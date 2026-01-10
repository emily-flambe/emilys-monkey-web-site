# Emily's Monkey Web Site

A psychological experiment where users judge which rhesus macaque looks "nicer" across 23 pairs of faces. Originally used for PhD research on face-based trait judgments (2014), now a public web app.

## Tech Stack

- **Runtime**: Cloudflare Workers
- **Backend**: Hono (TypeScript)
- **Database**: Cloudflare D1 (SQLite)
- **Frontend**: Vanilla JS + CSS (no framework)
- **Build**: Vite (frontend only)
- **Deployment**: Wrangler CLI

## Project Structure

```
src/
  index.ts          # Worker entry point, Hono app setup
  types.ts          # TypeScript interfaces (Env, Session, Trial, FaceStats)
  api/routes.ts     # All API endpoints
  db/schema.sql     # D1 schema and seed data
  frontend/         # Static frontend (HTML, CSS, JS)
public/images/      # 46 monkey face images (face_01.png - face_46.png)
dist/               # Vite build output (gitignored)
```

## Essential Commands

```bash
# Development
npm install
npm run db:init          # Initialize local D1 database
npm run dev              # Start local dev server at http://localhost:8787

# Build
npm run build:frontend   # Build frontend with Vite

# Deployment
npm run db:init:remote   # Initialize remote D1 database (first time only)
npm run deploy           # Build frontend + deploy to Cloudflare

# Type checking
npx tsc --noEmit         # Check TypeScript errors
```

## API Endpoints

| Method | Path | Description |
|--------|------|-------------|
| GET | `/api/health` | Health check |
| POST | `/api/sessions` | Create new session, returns 23 randomized trial pairs |
| POST | `/api/responses` | Record a trial response |
| POST | `/api/sessions/:id/complete` | Mark session complete, calculate agreement score |
| GET | `/api/sessions/:id` | Get session results |
| GET | `/api/stats` | Get aggregate face statistics |
| GET | `/api/leaderboard` | Top 100 sessions by agreement score |

## Database Schema

Three tables:
- `sessions`: Session ID, timestamps, agreement score
- `trials`: Individual responses per session (session_id, trial_number, selected_face, response_time)
- `face_stats`: Aggregate stats per face (times_shown, times_selected)

The 46 faces are pre-seeded in `face_stats` via `schema.sql`.

## Key Patterns

- **Session flow**: Create session -> 23 trials -> complete session -> view results
- **Agreement score**: Percentage of times user picked the more popular face (based on all users)
- **Static assets**: Served from `dist/` via Wrangler assets, not the Worker itself
- **SPA routing**: `not_found_handling = "single-page-application"` in wrangler.toml

## Environment

- **Local**: Uses `.wrangler/` for local D1 database
- **Production**: D1 database `monkey-db` (ID in wrangler.toml)
- **Domain**: monkey.emilycogsdill.com
- **Dev port**: 8787
