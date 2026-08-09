const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { v4: uuidv4 } = require('uuid');
const { OAuth2Client } = require('google-auth-library');

const JWT_SECRET = process.env.JWT_SECRET;
if (!JWT_SECRET) {
  throw new Error('FATAL: JWT_SECRET environment variable is not set. Server cannot start.');
}

// Google OAuth: the same Client ID used by the frontend GIS button. The ID token
// is verified against this audience so tokens minted for another app are rejected.
const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
const googleClient = GOOGLE_CLIENT_ID ? new OAuth2Client(GOOGLE_CLIENT_ID) : null;

// Turn a Google display name / email into a unique username, appending a short
// numeric suffix on collision so two "David" accounts don't clash.
async function deriveUniqueUsername(base) {
  const cleaned = (base || 'user').trim().replace(/\s+/g, ' ').slice(0, 24) || 'user';
  let candidate = cleaned;
  for (let i = 0; i < 20; i++) {
    const taken = await UserModel.findOne({ username: candidate }).select('_id').lean();
    if (!taken) return candidate;
    candidate = `${cleaned} ${Math.floor(1000 + Math.random() * 9000)}`;
  }
  return `${cleaned} ${uuidv4().slice(0, 6)}`;
}

const { UserModel } = require('../../database/users/userDB');
const { SessionModel } = require('../../database/simulator/sessionDB');
const { ProgressModel } = require('../../database/progress/progressDB');

// Throttle the guest cleanup so its heavy scan runs at most once per hour,
// instead of on every guest login (which slowed down the guest experience).
let lastGuestCleanup = 0;
const GUEST_CLEANUP_INTERVAL_MS = 60 * 60 * 1000; // 1 hour

async function cleanOldGuestData() {
  try {
    const cutoff = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
    const oldSessions = await SessionModel.find({
      user_id: /^guest-/,
      created_at: { $lt: cutoff }
    }).select('user_id').lean();

    if (oldSessions.length === 0) return;

    const guestIds = [...new Set(oldSessions.map(s => s.user_id))];
    await SessionModel.deleteMany({ user_id: { $in: guestIds }, created_at: { $lt: cutoff } });
    await ProgressModel.deleteMany({ user_id: { $in: guestIds } });
    console.log(`Cleaned up ${guestIds.length} expired guest user(s).`);
  } catch (err) {
    console.error('Guest cleanup failed (non-critical):', err.message);
  }
}

// POST /api/auth/register
router.post('/register', async (req, res) => {
  const { username, email, password, role } = req.body;

  if (!username || !username.trim()) return res.status(400).json({ error: 'Username is required.' });
  if (!email || !email.trim()) return res.status(400).json({ error: 'Email is required.' });
  if (!password || password.length < 6) return res.status(400).json({ error: 'Password must be at least 6 characters.' });

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email.trim())) return res.status(400).json({ error: 'Invalid email address.' });

  try {
    const existingUsername = await UserModel.findOne({ username: username.trim() });
    if (existingUsername) return res.status(409).json({ error: 'Username already taken.' });

    const existingEmail = await UserModel.findOne({ email: email.trim().toLowerCase() });
    if (existingEmail) return res.status(409).json({ error: 'Email already registered.' });

    const passwordHash = await bcrypt.hash(password, 12);
    const selectedRole = role || 'candidate';

    const user = await UserModel.create({
      username: username.trim(),
      email: email.trim().toLowerCase(),
      passwordHash,
      role: selectedRole,
    });

    const userId = `user-${user._id.toString()}`;
    const token = jwt.sign({ userId, username: user.username, role: selectedRole }, JWT_SECRET, { expiresIn: '30d' });

    return res.status(201).json({ token, userId, username: user.username, role: selectedRole });
  } catch (err) {
    console.error('Register error:', err.message);
    return res.status(500).json({ error: 'Registration failed. Please try again.' });
  }
});

// POST /api/auth/login
router.post('/login', async (req, res) => {
  const { identifier, password } = req.body;

  if (!identifier || !identifier.trim()) return res.status(400).json({ error: 'Username or email is required.' });
  if (!password) return res.status(400).json({ error: 'Password is required.' });

  try {
    const isEmail = identifier.includes('@');
    const user = isEmail
      ? await UserModel.findOne({ email: identifier.trim().toLowerCase() })
      : await UserModel.findOne({ username: identifier.trim() });

    if (!user) return res.status(401).json({ error: 'Invalid credentials.' });

    const valid = await bcrypt.compare(password, user.passwordHash);
    if (!valid) return res.status(401).json({ error: 'Invalid credentials.' });

    const userId = `user-${user._id.toString()}`;
    const token = jwt.sign({ userId, username: user.username, role: user.role }, JWT_SECRET, { expiresIn: '30d' });

    return res.json({ token, userId, username: user.username, role: user.role });
  } catch (err) {
    console.error('Login error:', err.message);
    return res.status(500).json({ error: 'Login failed. Please try again.' });
  }
});

// POST /api/auth/google
// Body: { credential, role? }  — `credential` is the Google ID token (JWT) from
// the GIS button. We verify it, then find-or-create a user keyed on the Google
// subject id, and issue our own app JWT exactly like login/register do.
router.post('/google', async (req, res) => {
  if (!googleClient) {
    console.error('Google login attempted but GOOGLE_CLIENT_ID is not set.');
    return res.status(500).json({ error: 'Google sign-in is not configured on the server.' });
  }

  const { credential, role } = req.body;
  if (!credential) return res.status(400).json({ error: 'Missing Google credential.' });

  let payload;
  try {
    const ticket = await googleClient.verifyIdToken({ idToken: credential, audience: GOOGLE_CLIENT_ID });
    payload = ticket.getPayload();
  } catch (err) {
    console.error('Google token verification failed:', err.message);
    return res.status(401).json({ error: 'Invalid Google sign-in. Please try again.' });
  }

  if (!payload || !payload.email || !payload.email_verified) {
    return res.status(401).json({ error: 'Google account email is not verified.' });
  }

  const googleId = payload.sub;
  const email = payload.email.trim().toLowerCase();

  try {
    // 1) Returning Google user.
    let user = await UserModel.findOne({ googleId });

    // 2) Existing local account with the same email — link Google to it.
    if (!user) {
      user = await UserModel.findOne({ email });
      if (user) {
        user.googleId = googleId;
        if (user.authProvider !== 'google') user.authProvider = user.authProvider || 'local';
        await user.save();
      }
    }

    // 3) Brand-new user — create one. Role only applies to fresh accounts.
    if (!user) {
      const selectedRole = role === 'interviewer' ? 'interviewer' : 'candidate';
      const username = await deriveUniqueUsername(payload.name || email.split('@')[0]);
      user = await UserModel.create({
        username,
        email,
        googleId,
        authProvider: 'google',
        role: selectedRole,
      });
    }

    const userId = `user-${user._id.toString()}`;
    const token = jwt.sign({ userId, username: user.username, role: user.role }, JWT_SECRET, { expiresIn: '30d' });
    return res.json({ token, userId, username: user.username, role: user.role });
  } catch (err) {
    console.error('Google login error:', err.message);
    return res.status(500).json({ error: 'Google sign-in failed. Please try again.' });
  }
});

// POST /api/auth/guest
router.post('/guest', (req, res) => {
  const { role } = req.body;
  const selectedRole = role || 'candidate';
  const guestId = `guest-${uuidv4().slice(0, 8)}`;
  const token = jwt.sign({ userId: guestId, username: 'Guest', role: selectedRole }, JWT_SECRET, { expiresIn: '30d' });

  if (Date.now() - lastGuestCleanup > GUEST_CLEANUP_INTERVAL_MS) {
    lastGuestCleanup = Date.now();
    cleanOldGuestData().catch(() => {});
  }

  return res.json({ token, userId: guestId, username: 'Guest', role: selectedRole });
});

module.exports = router;
