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

## The Three-Language Rule

> **Any test that exercises a string, command, ending, or any user-facing
> behavior MUST run in all three locales: `en`, `pt-BR`, `es`.**

This is the test-side mirror of the `commands` skill's Display Rule. EN-only
tests let PT-BR / ES regressions ship. Use `describe.each(['en', 'pt-BR', 'es'])`,
a plain `for` loop, or pass the locale through the function under test
(see `app/i18n/__tests__/i18n.test.tsx` for the explicit-locale-argument
pattern) — whichever fits.

Exceptions:
- The test verifies English-only infrastructure (`vitest.setup.ts`, build
  scripts).
- The string is on `specs-driven/LANGUAGES.md`'s "Terms That Stay in English"
  list (`ls`, `cd`, `tree`, `link`, `morse`, `trace`, `chat`, `script`,
  `run`, `override protocol`, `god mode`, `god ending`).

## Seeded RNG

> **Never call `Math.random()` from a test.** Use the seeded helpers in
> `app/engine/rng.ts`. Tests that depend on randomness MUST seed
> deterministically.

Flaky tests are almost always (a) unseeded RNG, (b) shared state across
tests, or (c) async timing assumed instead of awaited. See
`app/engine/__tests__/rng.test.ts` for the canonical seeded-stream pattern.

## localStorage and Save State

jsdom provides a real localStorage. It is NOT reset between tests by default.
Reset it explicitly:

```ts
beforeEach(() => {
  window.localStorage.clear();
});
```

For save/load, prefer the fixture pattern in `app/storage/__tests__/saves.test.ts`
over hand-rolled localStorage shapes — especially for Set/Map serialization,
which has its own conventions there.

## Test Harnesses by Domain

- **Commands** — `app/engine/__tests__/commands-utils.test.ts` and
  `system-commands.test.ts` (parser/resolver/handler pattern). Template
  when adding a new command per the `commands` skill.
- **i18n display** — `app/i18n/__tests__/i18n.test.tsx`. Passes the locale
  through `translateStatic(...)` explicitly; mirror that when asserting
  translated output.
- **Endings (12-endings matrix)** — `app/engine/__tests__/endings.test.ts`
  and `ending-reachability.test.ts`. Extend the reachability matrix when
  adding or modifying any ending; never trust manual play-through alone.
- **Save state** — `app/storage/__tests__/saves.test.ts` covers Set/Map
  serialization and Steam Cloud round-trip assertions.

## Flaky Test Triage

1. Re-run the single test in isolation:
   `npx vitest run path/to/file --reporter=verbose`.
2. If it now passes: shared state. Hunt for missing
   `window.localStorage.clear()`, module-level mutable state, leaked timers,
   leaked fetch mocks.
3. If it still fails: unseeded RNG or unawaited async. Add deterministic
   seeds and `await` every promise.
4. Bisect with `it.only` until the failing case is isolated.
5. Last resort: `it.fails()` with a tracking ticket — never bare `it.skip`.
