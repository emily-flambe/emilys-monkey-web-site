---
description: Pull and fix a GitHub issue by number
allowed-tools: Bash, Read, Write, Edit, Glob, Grep, WebFetch
---

# Fix GitHub Issue

Fetch issue #$ARGUMENTS from GitHub and implement a fix.

## Steps

1. **Fetch the issue**:
   ```bash
   gh issue view $ARGUMENTS --json title,body,labels,comments
   ```

2. **Understand the issue**: Read the title, description, and any comments to fully understand what needs to be fixed.

3. **Investigate the codebase**: Find relevant files and understand the current implementation.

4. **Implement the fix**: Make the necessary code changes.

5. **Verify the fix**:
   - Run `npx tsc --noEmit` to check for TypeScript errors
   - Run `npm run build:frontend` to verify the build
   - If possible, run `npm run dev` and test manually

6. **Summarize**: Explain what was changed and why.
