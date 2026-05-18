# SKILL: Testing

> Use when: writing a new test, fixing a flaky test, adding a test fixture,
> or changing anything in `vitest.config.ts`, `vitest.setup.ts`, or
> `scripts/run-vitest.mjs`.

---

## Before You Write a Test

1. Read [GAME_CONTEXT.md](../GAME_CONTEXT.md) — understand the system you're testing.
2. Read `vitest.config.ts` and `vitest.setup.ts` — know what's already mocked.
3. Search for an existing test of the same surface area; copy its pattern.

## The Test Stack

- **Runner:** Vitest 4 via `node scripts/run-vitest.mjs` (enforces `--maxWorkers=1`).
- **Environment:** jsdom 26 (DOM + localStorage available; no real network).
- **Globals:** `describe / it / expect / vi` available without imports.
- **Setup:** `vitest.setup.ts` — global Electron API mocks, `@testing-library/jest-dom` matchers.
- **Patterns:** Test files colocated under `__tests__/` next to source. Include glob `**/*.test.{ts,tsx}`.

## The Three-Language Rule

> **Any test that exercises a string, command, ending, or any user-facing
> behavior MUST run in all three locales: `en`, `pt-BR`, `es`.**

This is the test-side mirror of [SKILL_COMMANDS.md](SKILL_COMMANDS.md)'s
Display Rule. EN-only tests let PT-BR/ES regressions ship. Use
`describe.each(['en', 'pt-BR', 'es'])`, a plain `for` loop, or pass the
locale through the function under test (see `app/i18n/__tests__/i18n.test.tsx`
for the explicit-locale-argument pattern) — whichever fits the test best.

Two exceptions:
- The test is verifying English-only infrastructure (`vitest.setup.ts`, build
  scripts).
- The string under test is on the [LANGUAGES.md](../LANGUAGES.md) "Terms That
  Stay in English" list (`ls`, `cd`, `tree`, ...).

## Seeded RNG

> **Never call `Math.random()` from a test.** Use the seeded helpers in
> `app/engine/rng.ts`. Tests that depend on randomness MUST seed
> deterministically.

Flaky tests are almost always (a) unseeded RNG, (b) shared state across tests,
or (c) async timing assumed instead of awaited. See `app/engine/__tests__/rng.test.ts`
for the canonical seeded-stream pattern.

## localStorage and Save State

jsdom provides a real localStorage. It is NOT reset between tests by default.
Reset it explicitly:

```ts
beforeEach(() => {
  window.localStorage.clear();
});
```

When testing save/load, prefer the existing fixture pattern in
`app/storage/__tests__/saves.test.ts` over hand-rolled localStorage shapes —
especially for Set/Map serialization, which has its own conventions there.

## Electron Mocks

`vitest.setup.ts` mocks the `electron` module globally (Tray, Menu, app,
BrowserWindow, screen, nativeImage). If you add an Electron surface the mock
doesn't cover, extend the mock in `vitest.setup.ts` rather than per-test —
otherwise you'll fight scope.

## Test Harnesses by Domain

- **Commands** — see `app/engine/__tests__/commands-utils.test.ts` and
  `system-commands.test.ts` for the parser/resolver/handler pattern (input
  → expected handler dispatch). Use these as the template when adding a
  new command per [SKILL_COMMANDS.md](SKILL_COMMANDS.md).
- **i18n display** — see `app/i18n/__tests__/i18n.test.tsx`. Passes the
  locale through `translateStatic(...)` explicitly; mirror that pattern when
  asserting translated output.
- **Endings (12-endings matrix)** — see `app/engine/__tests__/endings.test.ts`
  and `ending-reachability.test.ts`. When adding or modifying any ending,
  extend the reachability matrix; never trust manual play-through alone.
- **Save state** — see `app/storage/__tests__/saves.test.ts` for Set/Map
  serialization patterns and Steam Cloud round-trip assertions.

## Checklist for Every New Test

- [ ] File lives under `__tests__/` next to the code it tests
- [ ] Test name describes behavior, not implementation
- [ ] If i18n-relevant: covers `en` + `pt-BR` + `es` per Three-Language Rule
- [ ] No `Math.random()` — seeded RNG only (see `app/engine/rng.ts`)
- [ ] `window.localStorage.clear()` in `beforeEach` if save state is touched
- [ ] Extends existing Electron mocks in `vitest.setup.ts` rather than
      re-mocking per-file
- [ ] If covering a command: extends a harness in `app/engine/__tests__/`
- [ ] If covering an ending: extends `ending-reachability.test.ts`
- [ ] Test passes with `--maxWorkers=1` (already enforced by the wrapper)
- [ ] Test is deterministic across 10 consecutive runs

## Flaky Test Triage

1. Re-run the single test in isolation: `npx vitest run path/to/file --reporter=verbose`.
2. If it now passes: shared state. Hunt for: missing `window.localStorage.clear()`,
   module-level mutable state, leaked timers, leaked fetch mocks.
3. If it still fails: check for unseeded RNG or async assertions without
   `await`. Add deterministic seeds and `await` every promise.
4. If 1–3 don't reveal it: bisect by adding `it.only` until the failing
   case is isolated.
5. Last resort: mark `it.fails()` and open an issue — never `it.skip`
   without a tracking ticket.

## After Every Test Change

1. `npm test` — full suite passes
2. `npm run typecheck` — no type errors in test files
3. `npm run lint` — clean
4. Repeat the test 3× in a row to confirm determinism
5. If a new test pattern was introduced, consider whether it belongs in
   this skill — update if so
