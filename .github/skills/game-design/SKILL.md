---
name: game-design
description: Best practices for game mechanics, player experience, stealth systems, and narrative pacing.
---

# Game Design Workflow

Use this skill when changing mechanics, command flow, pacing, endings pressure, or stealth balance.

## Start Here
- Detection tuning lives in `app/constants/detection.ts`. Reuse `DETECTION_THRESHOLDS`, `DETECTION_DECREASES`, and warmup helpers instead of hardcoding numbers.
- Command behavior is split across `app/engine/commands/` modules and assembled in `app/engine/commands/index.ts`.
- Navigation and gating depend on `app/engine/filesystem.ts`, `requiredFlags`, `accessThreshold`, and `state.flags`.
- Treat `app/engine/commands/**` and in-app `help` (`app/engine/commands/system.ts`) as the live command source. README is a player-facing summary, not the authority for current behavior.
- `rewind` is the retired compatibility path (`app/engine/commands/archive.ts`). Do not design around a `decrypt` flow unless you are also adding a real handler/help path for it.

## Practical Design Rules
1. **Keep pressure rising, not spiking randomly.** Low-risk actions should stay low-risk; powerful shortcuts should cost detection, trust, time, or access.
2. **Preserve recovery windows.** If you add risk, keep a believable breather (`wait`, progress beats, softer early-game warmup).
3. **Honor centralized thresholds.** UI tone, warnings, Turing triggers, wandering nudges, and recovery logic already key off shared constants.
4. **Gate with flags, not hidden magic.** If a file/command appears late, tie it to `requiredFlags`, evidence/state milestones, or explicit prior reads.
5. **Respect current player flow.** Core play is investigate → cross-reference → save evidence → leak. Avoid re-centering the game on retired command loops.

## When Adding or Changing Commands
- Add/update the handler in the appropriate `app/engine/commands/*.ts` module, not in a monolithic switch.
- Check what players actually see in handler output and `help`, especially `system.ts`, `inventory.ts`, `evidence.ts`, and `archive.ts`.
- Decide whether the command is:
  - always visible (`help`, `ls`, `search`);
  - context-sensitive but documented;
  - hidden/discoverable through content.
- Update README only after the live handlers/help are correct, and only when player-facing behavior changes now.
- Check knock-on effects: detection, hostility, tutorial friction, hint flow, evidence progression, endings, and achievements.

## Balance Heuristics
- Browsing commands should usually feel safe enough to encourage exploration.
- High-agency commands should either cost more or require prior commitment.
- If a discovery is narratively major, give the player a short release beat instead of stacking punishment immediately after it.
- Prefer small, testable numeric changes over broad rewrites.

## What to Test
- Engine tests usually belong in `app/engine/__tests__/` (`narrative-mechanics`, `ux-commands`, `system-commands`, `warmup-detection`, `filesystem`).
- Add hook/component coverage only if the mechanic changes rendered UI or phase transitions.
- Validate:
  - threshold crossings and warning behavior;
  - flag-gated access;
  - command help and retired `rewind` messaging;
  - evidence/save/leak readiness;
  - edge cases at 0 and max values.
