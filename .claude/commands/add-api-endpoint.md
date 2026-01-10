---
description: Add a new API endpoint to the Hono router
allowed-tools: Bash, Read, Write, Edit, Glob, Grep
---

# Add API Endpoint

Add a new API endpoint: $ARGUMENTS

## Steps

1. **Understand the request**: Parse what endpoint is needed (method, path, functionality).

2. **Check existing patterns**: Read `src/api/routes.ts` to understand existing endpoint patterns.

3. **Check types**: Read `src/types.ts` to see if new types are needed.

4. **Implement the endpoint**:
   - Add to `src/api/routes.ts`
   - Follow existing patterns (error handling, response format)
   - Add any needed types to `src/types.ts`

5. **Update schema if needed**: If the endpoint requires new tables/columns, update `src/db/schema.sql`.

6. **Verify**:
   ```bash
   npx tsc --noEmit
   ```

7. **Document**: Update the API table in CLAUDE.md if this is a significant new endpoint.

## Conventions

- All endpoints are under `/api/`
- Use JSON responses: `c.json({ ... })`
- Return appropriate status codes (400 for bad input, 404 for not found, 500 for errors)
- Use prepared statements for all database queries
