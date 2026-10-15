---
name: clean-session
description: Summarize current progress, clear out file-read contexts, and trigger memory compaction to save tokens.
version: 1.0.0
---

# Session Wrap-up & Token Deflation Workflow

Please execute the following steps to clean up the workspace and save token usage.

## Step 1: Progress Summary
Provide a brief, bulleted summary of:
- What changes were successfully made during this session.
- What files were created or altered.
- Any pending tasks left unfinished.

## Step 2: System Optimization Reminders
1. Remind the user to run the native system command `/compact` right after this output finishes to truncate the active conversation raw token history.
2. Instruct the user that if they are completely switching to a new feature or file, it is highly recommended to type `exit` and restart the `claude` terminal session to flush out all loaded background files from the active context window.

