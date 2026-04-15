---
name: game-content
description: Guidance for adding narrative content, files, and hidden progression in the terminal game.
---

# Game Content Workflow

Use this skill when adding files, directories, dossier-worthy evidence, or UFO74-facing narrative beats.

## Current Content Map
- Main filesystem content lives in `app/data/virtualFileSystem.ts`.
- Reusable content blocks also live in `app/data/narrativeContent.ts`, `app/data/expansionContent.ts`, `app/data/neuralClusterMemo.ts`, and related data files.
- Access is controlled through `requiredFlags`, `accessThreshold`, and progress checks in `app/engine/filesystem.ts`.

## How to Add a File Well
1. Put the file in the right narrative neighborhood inside `FILESYSTEM_ROOT`.
2. Match existing naming (`lowercase_with_underscores.ext`) and document formatting.
3. Make the file do at least one job:
   - reveal a new fact;
   - contradict an earlier “official” record;
   - unlock/gate later content;
   - deepen UFO74 / Prisoner 45 / cover-up context.
4. Use `isEvidence: true` only when opening the file should count toward evidence discovery (`app/engine/evidenceRevelation.ts`).
5. Dossier / leak progress is separate: players must `save` files, which populates `state.savedFiles` and feeds `progress` / `leak` (`app/engine/commands/system.ts`, `app/engine/commands/inventory.ts`, `app/engine/commands/evidence.ts`).
6. If the file should only change mood, keep it short and make sure it does not crowd out more important evidence.

## Gating and Progression
- Use `requiredFlags` for late reveals and stateful unlocks.
- Use `accessThreshold` for clearance-based restrictions.
- Prefer explicit progression triggers over obscure one-off conditions.
- Follow live behavior from `app/engine/commands/**` and in-app `help`, not outdated puzzle assumptions.
- Current loop favors direct investigation, search, evidence discovery through reading, then dossier prep through `save`.

## UFO74 and Tone
- Write in bureaucratic horror for system files: clinical, detached, euphemistic.
- UFO74 should feel useful, tense, and human—not lore-dumping every answer.
- Let UFO74 redirect the player when they chase side conspiracies too early.
- Save the most reality-bending reframes for later-stage files; early files should create suspicion, not explain everything.

## Common Pitfalls
- Don’t duplicate the same revelation across many easy files.
- Don’t gate critical progression behind a flag that nothing sets.
- Don’t add “flavor” files that accidentally sound more important than true evidence.
- Don’t break existing paths when extending directories; add children rather than renaming established nodes.

## What to Update and Check
- Add/update filesystem tests in `app/engine/__tests__/filesystem.test.ts` for new gated paths.
- If content changes progression, also check `narrative-mechanics.test.ts`, `story-consistency.test.ts`, and story validation scripts.
