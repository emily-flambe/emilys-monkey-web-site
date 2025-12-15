# Emily's Monkey Web Site

This thing got me through grad school back in 2014 lmfao. Resurrected for the modern era.

A psychological experiment where you judge which rhesus macaque looks "nicer" across 23 pairs of faces. Originally used on Amazon Mechanical Turk for PhD research on face-based trait judgments.

## Stack

- Cloudflare Workers + Hono
- D1 (SQLite)
- Vite (frontend build)

## Development

```bash
npm install
npm run db:init     # Initialize local D1 database
npm run dev         # Start local dev server at http://localhost:8787
```

## Deployment

1. Create D1 database: `wrangler d1 create monkey-db`
2. Update `database_id` in `wrangler.toml`
3. Initialize remote DB: `npm run db:init:remote`
4. Deploy: `npm run deploy`
