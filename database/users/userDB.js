const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true, trim: true },
  email:    { type: String, required: true, unique: true, trim: true, lowercase: true },
  // Optional: users who sign in with Google never set a local password.
  passwordHash: { type: String },
  // Google account subject id (the stable `sub` from the verified ID token).
  // sparse so multiple password-only users (no googleId) don't collide on null.
  googleId: { type: String, unique: true, sparse: true },
  authProvider: { type: String, enum: ['local', 'google'], default: 'local' },
  role: { type: String, enum: ['candidate', 'interviewer'], default: 'candidate' },
  createdAt: { type: Date, default: Date.now },
});

const UserModel = mongoose.model('User', userSchema);
module.exports = { UserModel };
