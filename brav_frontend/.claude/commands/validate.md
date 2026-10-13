---
name: validate
description: Run code quality checks sequentially (Linting followed by Type-checking).
version: 1.0.0
---

# Code Validation Chain

Execute the project's quality assurance commands sequentially. Stop immediately if any step fails.

## Step 1: Run Linter
Execute the command: `npm run lint`

## Step 2: Run TypeScript Type-Check
If Step 1 passes successfully, execute the command: `npm run type-check`

## Completion
Report the status back to the user. If both pass, confirm the code is production-ready.
