---
name: todo
description: View or update the project's implementation checklist.
version: 1.0.0
---

# Todo Tracker Workflow

## Step 1: Read the Tracker
Read the contents of the `TODO.md` file in the root directory.

## Step 2: Handle User Intent
- **If the user typed `/todo` alone:** Output a clean, compact summary of the current phase and what tasks are currently unchecked.
- **If the user provided an update (e.g., `/todo check 3.3`):** Update the corresponding `[ ]` to `[x]` in `todo.md`, update the status header if a phase is completed, and save the file.

## Step 3: Confirmation
Print a short confirmation showing what changed. Do not output the entire file to the terminal.
