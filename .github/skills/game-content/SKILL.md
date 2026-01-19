---
name: game-content
description: Guidance for adding narrative content, files, and hidden progression in the terminal game.
---

When adding narrative content:
- Place new lore files in `app/data/filesystem.ts` and follow existing header formatting (box lines, date stamps, classification).
- Preserve the cold, bureaucratic tone; avoid direct player address.
- Use existing access gating patterns (`accessThreshold`, `requiredFlags`) to control discovery timing.
- If referencing the Watchers, keep it subtle and use late-stage files to reframe earlier events.
- Keep file names consistent with existing naming style (lowercase, underscores, extensions).

For new directories:
- Add them under the appropriate tree node in `FILESYSTEM_ROOT`.
- Avoid breaking existing paths; add new directories as children.
- If content requires override, use `requiredFlags: ['adminUnlocked']`.

Testing:
- Add or update filesystem tests in `app/engine/__tests__/filesystem.test.ts` when adding gated paths.
