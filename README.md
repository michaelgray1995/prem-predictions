# ⚽ Prem Predictions 2026/27

A live-updating site that shows the real Premier League table alongside everyone's
predictions, highlights each correct/incorrect position, and ranks a leaderboard
(**1 point for every team in its exact predicted spot**).

- Auto-refreshes every 60 seconds.
- API key stays server-side (Vercel serverless function) — never exposed to the browser.
- Predictors: Gareth, Hallan Surger, Ell, Ben Gull, Kyle, Jimmy Adventures, Mike.

## 1. Get a free data key (2 min)

1. Register at <https://www.football-data.org/client/register>.
2. Copy the API token from the confirmation email / your account page.

The free tier includes the Premier League standings and is plenty for this.

## 2. Deploy to Vercel

**Option A — from the dashboard (no CLI):**
1. Push this folder to a GitHub repo.
2. Go to <https://vercel.com> → **Add New → Project** → import the repo.
3. Framework preset: **Other**. No build command needed.
4. Add an Environment Variable:
   - Name: `FOOTBALL_DATA_API_KEY`
   - Value: *your token from step 1*
5. **Deploy.** You'll get a live URL like `https://prem-predictions.vercel.app`.

**Option B — from the CLI:**
```bash
npm i -g vercel
cd prem-predictions
vercel                       # follow prompts to link/create the project
vercel env add FOOTBALL_DATA_API_KEY   # paste your token
vercel --prod
```

## 3. Local preview

- **No key needed:** open `index.html` with any static server and add `?demo`
  to the URL to see sample data, e.g. `http://localhost:8000/?demo`.
- **Full local run with live data:** `vercel dev` (uses `.env.local`, see `.env.example`).

## Editing predictions / teams

Everything lives in [`data.js`](./data.js):
- `PREDICTIONS` — each person's ordered 20-team list (position 1 → 20).
- `ALIASES` — add a spelling if a name ever fails to match.

Scoring and rendering are in [`app.js`](./app.js); the live feed is in
[`api/standings.js`](./api/standings.js).

## Notes

- Coventry and Hull appear in the predictions. If a predicted team isn't in the
  real Premier League table, it simply can't score points (shown with a `—`).
- Ben Gull's submitted list had a duplicate "Hull"; per instruction it was fixed
  to Hull 19th, Ipswich 20th.
