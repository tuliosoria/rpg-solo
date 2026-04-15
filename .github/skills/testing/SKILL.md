---
name: testing
description: Guidance for running and updating tests in this repository.
---

# Testing Workflow

Use this skill to choose the smallest validation set that still proves the change is safe.

## Where Tests Usually Live
- Engine/game logic: `app/engine/__tests__/`
- React components: `app/components/**/__tests__/`
- Hooks/state wiring: `app/hooks/__tests__/`
- Save/load and persistence: `app/storage/__tests__/`
- Electron-only behavior: `electron/__tests__/`
- Browser journeys: `e2e-tests/*.spec.ts`

## Decision Tree

### 1) Logic, mechanics, command, state, or gating changes
Run:
- `npm test`
- `npm run typecheck`
- `npm run lint`

Also run `npm run build` if the change touches app boot, rendering, build-time env usage, or anything imported by Next at build time.

### 2) Narrative/data/content changes in `app/data` or story flow
Run:
- `npm test`
- `npm run validate-story`

Add `npm run typecheck` if you changed TypeScript structures, imports, or file definitions.

### 3) Docs / repo-guidance / skill-instruction only
- Usually no runtime validation is needed.
- If the doc references commands or architecture, verify against current source (`package.json`, `README.md`, `next.config.ts`, relevant app files) before editing.

## Practical Pointers
- Prefer updating an existing test file near the feature before creating a new one.
- For filesystem gating, start with `app/engine/__tests__/filesystem.test.ts`.
- For command behavior, check `narrative-mechanics.test.ts`, `ux-commands.test.ts`, `system-commands.test.ts`, or the closest focused spec.
- For UI fallout from engine changes, `Terminal.test.tsx` and hook tests are common follow-ups.
- Prefer real helper usage (`createTestState`, existing mocks, `DEFAULT_GAME_STATE`) over ad hoc fixtures.

## Available Validation Commands
- `npm test`
- `npm run typecheck`
- `npm run lint`
- `npm run build`
- `npm run validate-story`
- `npm run validate-enhanced`
- `npm run validate-fundamentals`
