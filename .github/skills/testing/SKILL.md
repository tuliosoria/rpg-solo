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

## Live Browser Checks (Playwright MCP — optional)

Two browser tools exist; keep them distinct:

- **Committed e2e suite** — `npm run e2e` (Playwright Test; specs in `e2e-tests/*.spec.ts`, config `e2e-tests/playwright.config.ts`; `npm run e2e:headed` to watch). This is the canonical, CI-friendly validation for browser journeys. See `E2E_TESTING.md`.
- **Playwright MCP** — an *optional*, agent-driven live browser, present only if a `playwright` MCP server is configured in the environment (it is user-global, not part of this repo). Drive it against a running dev server (`npm run dev`, http://localhost:3000) to navigate, click, type at the prompt, read console output, and eyeball UI state.

Reach for the MCP when:
- Manually confirming a UI/UX change reads right (detection color ramp, avatar reactions, terminal-personality shifts) before or instead of writing a spec.
- Reproducing or diagnosing a browser-only bug interactively.
- Capturing console/network behavior while exploring.

Do **not** use it when:
- Durable, repeatable coverage is needed — that belongs in the committed e2e suite so CI runs it. The MCP never replaces `*.spec.ts`.
- The change is logic/data already covered by `npm test`.

If no Playwright MCP is configured, ignore this section and rely on `npm run e2e`.

## Available Validation Commands
- `npm test`
- `npm run typecheck`
- `npm run lint`
- `npm run build`
- `npm run validate-story`
- `npm run validate-enhanced`
- `npm run validate-fundamentals`
- `npm run e2e` / `npm run e2e:headed` (committed Playwright browser journeys)
