# HireUp AI

An AI interview coach with two sides: it helps **candidates** rehearse for a specific role, and helps **recruiters** build and run structured interviews. Full-stack MVP.

> Formerly *SmartInterviewer AI*. Built by a 4-person team for a university seminar on product management in the AI era, and presented at a Demo Day.

---

## What it does

### For candidates
- Upload a CV and a job description — PDF, Word, or a scanned image (OCR).
- Get an interview simulation generated for that specific role.
- Practice with real-time AI coaching that adapts to the type of question being asked.
- Review a scored feedback report and track readiness over time.

### For recruiters
- Generate a question bank tailored to a role from its job description.
- Save interview guides and export them to PDF or JSON.
- Follow candidate progress and readiness.

---

## The coaching engine

Rather than grading every answer against a single template, the coach first detects which method fits the question, then coaches to that method:

| Method | Used for |
|--------|----------|
| STAR | Behavioral questions |
| CAR | Situation → action → result questions |
| PREP | Opinion / structured-argument questions |
| Step-by-step reasoning | Technical questions |

The prompt logic behind each agent lives in [`ai/prompts/`](ai/prompts).

---

## Tech stack

| Layer | Tools |
|-------|-------|
| Frontend | React 19, Vite, React Router, Recharts |
| Backend | Node.js, Express |
| Database | MongoDB (Mongoose) |
| AI | Google Gemini (`@google/genai`), model fallback + API-key rotation per agent |
| Auth | JWT + bcrypt |
| Document parsing | pdf-parse, mammoth (Word), tesseract.js (OCR) |
| Export | PDFKit |

One detail worth calling out: Gemini calls run through a small resilience layer ([`ai/geminiClient.js`](ai/geminiClient.js)) that rotates across multiple API keys and falls back between models when a key is rate-limited or a model is unavailable.

---

## Getting started

**Prerequisites:** Node.js 18+, a MongoDB connection string, and at least one Google Gemini API key.

1. Install dependencies:
   ```bash
   npm install
   ```

2. Create a `.env` file in the project root:
   ```
   MONGODB_URI=your_mongodb_connection_string
   JWT_SECRET=your_secret
   PORT=3001

   # At least one Gemini key is required. Extra keys (up to _8) are
   # optional and enable per-agent key rotation.
   GOOGLE_API_KEY_1=your_gemini_key
   ```

3. Start the backend:
   ```bash
   npm run server
   ```

4. In a second terminal, start the frontend:
   ```bash
   npm run dev
   ```

---

## Project structure

```
ai/       Gemini client + prompt logic (coach, simulator, question bank, recommendations)
server/   Express controllers (coach, simulator, question bank, progress)
client/   React app — candidate and recruiter interfaces
public/   Static assets and brand files
```

## Deployment

The frontend is built with Vite (`npm run build`) and deployed on Vercel; the backend runs on Render.

## Status

An academic MVP under active iteration — not a production service.

---

## Demo video (Remotion)

A promotional demo video is scripted with [Remotion](https://www.remotion.dev/). The Remotion sources live under `client/src/remotion/` and are kept as local tooling (not part of the app build).

- Composition: `HireUpProductDemo` · `1920×1080` · `30 fps` · `60s`
- Preview in Remotion Studio: `npm run video`
- Render the MP4: `npm run render:hireup`

> The first render downloads Chromium (~200 MB) automatically.
