---
description: Run checks, stage changes, and generate commit message
allowed-tools: Bash, Read, Glob, Grep
---

# Prepare for Pull Request

Run all checks and prepare changes for commit.

## Steps

1. **Run type checking**:
   ```bash
   npx tsc --noEmit
   ```

2. **Build frontend**:
   ```bash
   npm run build:frontend
   ```

3. **Check for unstaged changes**:
   ```bash
   git status
   git diff --stat
   ```

4. **Review the diff**: Summarize what has been changed.

5. **Generate commit message**: Based on the changes, suggest a descriptive commit message following conventional commits format.

6. **Stage changes** (if checks pass):
   ```bash
   git add -A
   ```

7. **Report**: Show what's staged and the suggested commit message.
