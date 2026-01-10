---
description: Start the development server and verify it's working
allowed-tools: Bash, WebFetch
---

# Start Development Server

Initialize the local database and start the dev server.

## Steps

1. **Install dependencies** (if needed):
   ```bash
   npm install
   ```

2. **Initialize local database**:
   ```bash
   npm run db:init
   ```

3. **Start dev server**:
   ```bash
   npm run dev
   ```

   The server will be available at http://localhost:8787

4. **Verify**: Once running, test the health endpoint:
   ```bash
   curl http://localhost:8787/api/health
   ```

## Notes

- The local D1 database is stored in `.wrangler/`
- Frontend changes require rebuilding (`npm run build:frontend`) or restart
- Backend changes hot-reload automatically
