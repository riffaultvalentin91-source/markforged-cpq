# Markforged Direct CPQ

Internal EMEA quoting tool. React + Vercel serverless proxy for Claude API.

---

## First-time deploy (15 minutes)

### 1. Push to GitHub

1. Go to [github.com](https://github.com) → **New repository**
2. Name it `markforged-cpq` → **Create repository**
3. Download [GitHub Desktop](https://desktop.github.com) if you don't have git
4. Drag this folder into GitHub Desktop → **Commit** → **Push**

### 2. Deploy on Vercel

1. Go to [vercel.com](https://vercel.com) → **Sign up with GitHub**
2. Click **Add New Project** → select `markforged-cpq`
3. Framework preset: **Create React App** (auto-detected)
4. Open **Environment Variables** and add:

| Name | Value |
|------|-------|
| `ANTHROPIC_API_KEY` | `sk-ant-...` (your key from console.anthropic.com) |
| `APP_PIN` | `MKF2026` (or your chosen PIN) |

5. Click **Deploy** — takes ~2 minutes

Your app is live at `https://markforged-cpq.vercel.app`

---

## Updating the tool

Every `git push` to the `main` branch auto-redeploys. No manual steps.

```bash
# Make changes to src/App.jsx, then:
git add .
git commit -m "Update pricing / add feature"
git push
# Vercel redeploys automatically in ~90 seconds
```

---

## Project structure

```
markforged-cpq/
├── public/
│   └── index.html        # HTML shell — don't edit unless you need meta tags
├── src/
│   ├── index.js          # React entry point — don't edit
│   ├── App.jsx           # ← YOUR CPQ TOOL — edit this for all changes
│   └── api.js            # Claude API helper — import askClaude() from here
├── api/
│   └── claude.js         # Vercel serverless function — API key lives here
├── .env.example          # Template — copy to .env.local for local dev
├── .gitignore            # Keeps secrets and node_modules out of GitHub
├── package.json          # Dependencies
├── vercel.json           # Vercel routing config
└── README.md             # This file
```

---

## Local development

```bash
# Install dependencies (one time)
npm install

# Copy env template
cp .env.example .env.local
# Edit .env.local and add your real ANTHROPIC_API_KEY and APP_PIN

# Start local server
npm start
# Opens http://localhost:3000
```

> The `/api/claude` proxy works locally too — Vercel CLI handles it automatically.
> Install Vercel CLI: `npm i -g vercel` then run `vercel dev` instead of `npm start`.

---

## Using the Claude API from the app

The `src/api.js` file exposes two functions:

```javascript
import { askClaude, generateQuoteSummary } from './api';

// Generic Claude call
const reply = await askClaude([
  { role: 'user', content: 'Summarise this quote in one sentence.' }
]);

// Pre-built: generate a quote summary paragraph
const summary = await generateQuoteSummary({
  custName, lines, totalNet, grandTotal, incoterm, qExpiry
});
```

The API key **never touches the browser** — all calls go through `/api/claude`.

---

## Security model

| Layer | How it works |
|-------|-------------|
| PIN gate | Client-side — blocks casual access |
| Server PIN check | `x-mkf-pin` header verified in `api/claude.js` — blocks API abuse even if PIN screen is bypassed |
| API key | Stored in Vercel env vars — never in code, never in browser |
| No index | `<meta name="robots" content="noindex">` — won't appear in search engines |

---

## Changing the access PIN

1. Change `APP_PIN` in Vercel dashboard → **Settings → Environment Variables**
2. Change `ACCESS_PIN` in `src/App.jsx` (near the top)
3. Push — redeploys automatically

---

## Free tier limits (Vercel Hobby)

| Resource | Limit | Your usage |
|----------|-------|------------|
| Bandwidth | 100 GB/month | ~1 MB per session → 100K sessions |
| Serverless invocations | 100K/month | Only used when calling Claude |
| Build minutes | 6,000/month | ~2 min per deploy |
| Domains | 1 custom domain | Free `.vercel.app` domain included |

Well within free limits for an internal EMEA team tool.

---

*Markforged EMEA · Internal / Confidential · Q1-2026*
