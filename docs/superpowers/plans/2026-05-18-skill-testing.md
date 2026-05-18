# SKILL_TESTING.md Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add `specs-driven/skills/SKILL_TESTING.md` — the eighth entry in the project's skill set — covering Vitest+jsdom quirks, command/i18n test harness patterns, the ending verification harness, and flaky-test triage. Same format and density as the existing seven skills.

**Architecture:** Markdown-only deliverable. Pattern established by PR #14 (`SKILL_COMMANDS.md`): research existing test patterns in the codebase, identify the load-bearing rule, draft the file in the canonical skill format, validate by reading it back against existing tests to confirm rules are honored, commit, PR.

**Tech Stack:** Vitest 4 + @vitejs/plugin-react + jsdom 26, `node scripts/run-vitest.mjs` wrapper, `@testing-library/jest-dom`, manual `vi.mock(...)` electron mocks in `vitest.setup.ts`.

**Scope:** ONE skill file. The remaining 11 skills from the roadmap (`SKILL_STATE`, `SKILL_SAVE_STATE`, `SKILL_PERFORMANCE`, `SKILL_BALANCE`, `SKILL_TUTORIAL`, `SKILL_REACTIVITY`, `SKILL_ACCESSIBILITY`, `SKILL_LOCALIZATION_QC`, `SKILL_PLAYTEST`, `SKILL_PR_REVIEW`, `SKILL_PROMPT_AUTHORING`) each need their own brainstorm → spec → plan cycle. Backlog with research anchors is in Appendix A so future plans can be written quickly.

---

## File Structure

| File | Status | Purpose |
| --- | --- | --- |
| `specs-driven/skills/SKILL_TESTING.md` | **Create** | New skill, 90–120 lines, matches format of the seven existing skills. |
| `docs/superpowers/plans/2026-05-18-skill-testing.md` | **Create (this doc)** | This plan. |

No source code, no test, no config changes. The skill *describes* existing test infrastructure; it does not modify it.

---

## Pre-Task: Branch Setup

- [ ] **Step 0a: Confirm working branch**

```bash
git status -sb
# Expected: '## docs/skill-testing-plan...origin/docs/skill-testing-plan' or a fresh branch off main.
git branch --show-current
```

- [ ] **Step 0b: If not already on a feature branch, create one off `main`**

```bash
git checkout main && git pull --ff-only && git checkout -b docs/skill-testing
```

---

## Task 1: Author `SKILL_TESTING.md`

**Files:**
- Create: `specs-driven/skills/SKILL_TESTING.md`

The skill must cover (load-bearing topics, derived from the brainstorm):
1. **Vitest + jsdom configuration** — environment, setup file, run wrapper.
2. **The Three-Language Rule** — load-bearing rule analogous to `SKILL_COMMANDS.md`'s Display Rule: *every i18n-relevant test must exercise EN, PT-BR, and ES.*
3. **Seeded RNG discipline** — never use unseeded `Math.random()` in tests; use the seeded helpers already in the codebase (`app/types/index.ts`).
4. **localStorage mocking** — handled by jsdom; document the reset hook.
5. **Electron mocking** — handled in `vitest.setup.ts`; document scope and gotchas.
6. **Command test harness** — patterns from `app/engine/commands/__tests__/` (e.g., `aliases.test.ts`).
7. **i18n snapshot/render harness** — patterns from `app/i18n/__tests__/` (e.g., `help-body-localization.test.tsx`, `ufo74-tutorial-localization.test.tsx`).
8. **Ending verification harness** — `app/engine/__tests__/endings.test.ts` and `ending-reachability.test.ts` (the 12-endings matrix).
9. **Flaky-test triage** — `--maxWorkers=1` is already enforced via the run wrapper; document additional first-aid (rerun in isolation, check for shared state, seed mismatch).

- [ ] **Step 1: Research current test patterns (5 reads, parallel)**

Read these files in parallel; capture the patterns each demonstrates:

```bash
# Use the view tool in parallel — do NOT cat each one:
#   vitest.config.ts
#   vitest.setup.ts
#   scripts/run-vitest.mjs
#   app/engine/commands/__tests__/aliases.test.ts
#   app/engine/__tests__/endings.test.ts
#   app/engine/__tests__/ending-reachability.test.ts
#   app/i18n/__tests__/help-body-localization.test.tsx
#   app/i18n/__tests__/ufo74-tutorial-localization.test.tsx
#   app/storage/__tests__/saves.test.ts
```

Capture (in your head, or scratch notes):
- The exact test-harness imports each file uses.
- Whether each file uses `describe` blocks, plain `it`, fixtures, or table-driven tests.
- How the i18n tests switch languages (look for `i18n.changeLanguage` or similar).
- How the ending tests assert which of the 12 endings was reached.

- [ ] **Step 2: Read the canonical skill format**

```bash
# Use the view tool, parallel:
#   specs-driven/skills/SKILL_BUGS.md
#   specs-driven/skills/SKILL_TRANSLATION.md
#   specs-driven/skills/SKILL_COMMANDS.md  # the most recent — closest template
```

Confirm:
- Header is `# SKILL: <Name>` followed by `> Use when: ...` and a `---` rule.
- Sections: `Before You X` → load-bearing pipeline/rule → checklist → process steps → common bugs → `After Every X`.
- Line count target: 90–120 (SKILL_COMMANDS is 121; matches the upper bound).

- [ ] **Step 3: Draft `SKILL_TESTING.md` at `specs-driven/skills/SKILL_TESTING.md`**

Write the file using exactly this skeleton (fill in body content from research):

```markdown
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

This is the test-side mirror of `SKILL_COMMANDS.md`'s Display Rule. EN-only
tests let PT-BR/ES regressions ship. Use `i18n.changeLanguage()` (or the
equivalent helper) in a `describe.each(['en', 'pt-BR', 'es'])` block, or a
plain `for` loop, or per-test setup — whichever fits the test best.

Two exceptions:
- The test is verifying English-only infrastructure (`vitest.setup.ts`, build
  scripts).
- The string under test is on the LANGUAGES.md "Terms That Stay in English"
  list (`ls`, `cd`, `tree`, ...).

## Seeded RNG

> **Never call `Math.random()` from a test.** Use the seeded helpers from
> `app/types/index.ts`. Tests that depend on randomness MUST seed
> deterministically.

Flaky tests are almost always (a) unseeded RNG, (b) shared state across tests,
or (c) async timing assumed instead of awaited.

## localStorage and Save State

jsdom provides a real localStorage. It is NOT reset between tests by default.
Reset it explicitly:

```ts
beforeEach(() => {
  localStorage.clear();
});
```

When testing save/load, prefer the existing fixture pattern in
`app/storage/__tests__/saves.test.ts` over hand-rolled localStorage shapes.

## Electron Mocks

`vitest.setup.ts` mocks the `electron` module globally (Tray, Menu, app,
BrowserWindow, screen, nativeImage). If you add an Electron surface the mock
doesn't cover, extend the mock in `vitest.setup.ts` rather than per-test —
otherwise you'll fight scope.

## Test Harnesses by Domain

- **Commands** — see `app/engine/commands/__tests__/aliases.test.ts` for the
  parser/resolver pattern (input → expected handler dispatch).
- **i18n display** — see `app/i18n/__tests__/help-body-localization.test.tsx`
  and `ufo74-tutorial-localization.test.tsx` for the language-switching
  render pattern.
- **Endings (12-endings matrix)** — see `app/engine/__tests__/endings.test.ts`
  and `ending-reachability.test.ts`. When adding or modifying any ending,
  extend the reachability matrix; never trust manual play-through alone.
- **Save state** — see `app/storage/__tests__/saves.test.ts` for Set/Map
  serialization patterns.

## Checklist for Every New Test

- [ ] File lives under `__tests__/` next to the code it tests
- [ ] Test name describes behavior, not implementation
- [ ] If i18n-relevant: covers EN + PT-BR + ES per Three-Language Rule
- [ ] No `Math.random()` — seeded RNG only
- [ ] `localStorage.clear()` in `beforeEach` if save state touched
- [ ] Extends existing electron mocks rather than re-mocking per-file
- [ ] If covering a command: extends the harness in
      `app/engine/commands/__tests__/`
- [ ] If covering an ending: extends `ending-reachability.test.ts`
- [ ] Test passes with `--maxWorkers=1` (already enforced by the wrapper)
- [ ] Test is deterministic across 10 consecutive runs

## Flaky Test Triage

1. Re-run the single test in isolation: `npx vitest run path/to/file --reporter=verbose`.
2. If it now passes: shared state. Hunt for: missing `localStorage.clear()`,
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
```

- [ ] **Step 4: Verify line count and format**

```bash
wc -l specs-driven/skills/SKILL_TESTING.md
# Expected: 90-120 lines

# Confirm format matches:
head -5 specs-driven/skills/SKILL_TESTING.md
# Expected: '# SKILL: Testing' header, '> Use when: ...' line, '---' separator

head -5 specs-driven/skills/SKILL_COMMANDS.md
# Same shape.
```

If lines are under 90 or over 130: trim or expand a single section (NOT the
Three-Language Rule or Seeded RNG sections — those are load-bearing).

- [ ] **Step 5: Sanity-read the skill back against real tests**

For each domain heading in "Test Harnesses by Domain", open the referenced
file and confirm the path is correct and the file still demonstrates the
pattern described:

```bash
ls app/engine/commands/__tests__/aliases.test.ts \
   app/i18n/__tests__/help-body-localization.test.tsx \
   app/i18n/__tests__/ufo74-tutorial-localization.test.tsx \
   app/engine/__tests__/endings.test.ts \
   app/engine/__tests__/ending-reachability.test.ts \
   app/storage/__tests__/saves.test.ts
# Expected: every file exists
```

If a file has moved or been renamed since the brainstorm: update the skill,
don't hand-wave.

- [ ] **Step 6: Run the validation suite (markdown-only, so this is light)**

```bash
# No code changed, but confirm nothing accidentally regressed.
git status   # should show only the new SKILL_TESTING.md
npm run lint # should pass; markdown isn't linted but nothing else changed
```

Expected: exit 0 on lint, only one new untracked-then-added file in `git status`.

- [ ] **Step 7: Commit**

```bash
git add specs-driven/skills/SKILL_TESTING.md
git commit -m "docs(skills): add SKILL_TESTING.md (Three-Language Rule + harness map)

Adds the eighth entry in specs-driven/skills/, covering the Vitest+jsdom
stack, the Three-Language Rule (test-side mirror of SKILL_COMMANDS.md's
Display Rule), seeded RNG discipline, electron-mock scope, per-domain
test harnesses (commands / i18n / endings / save state), and flaky-test
triage.

Plan: docs/superpowers/plans/2026-05-18-skill-testing.md

Co-authored-by: Copilot <223556219+Copilot@users.noreply.github.com>"
```

- [ ] **Step 8: Push and open PR**

```bash
git push -u origin $(git branch --show-current)
```

PR title:
```
docs(skills): add SKILL_TESTING.md (Three-Language Rule + test harness map)
```

PR body — adapt from PR #14's body. Must include:
- Motivation: codifies the test-side rules that catch i18n display bugs at
  the test layer (companion to SKILL_COMMANDS).
- File: `specs-driven/skills/SKILL_TESTING.md` (line count actual).
- Load-bearing additions: The Three-Language Rule, Seeded RNG, harness map.
- Roadmap: next skills per recommended sequencing — SKILL_STATE +
  SKILL_SAVE_STATE as a pair.
- Validation: markdown-only; lint clean; no code/test/config changes.

---

## Validation (final)

After Task 1's PR is open:

- [ ] PR shows exactly one file changed: `specs-driven/skills/SKILL_TESTING.md`
- [ ] CI (if any runs on this branch) is green
- [ ] No tests added, removed, or modified
- [ ] No `package.json` / `vitest.config.ts` / `vitest.setup.ts` changes
- [ ] Skill is between 90 and 130 lines
- [ ] Skill is reachable from `specs-driven/skills/` directory listing

---

## Appendix A — Backlog (remaining 11 skills)

Each skill below needs its own brainstorm → spec → plan cycle before
implementation. Use the recommended sequencing. Per-skill research anchors
are pre-collected so the next brainstorm has a head start.

**Priority order (from PR #14's spec Appendix A):**

1. ~~`SKILL_TESTING.md`~~ ← THIS PLAN
2. `SKILL_STATE.md` — anchors: `app/state/*.ts` (Zustand stores), `app/types/index.ts` (GameState shape), AGENTS.md "GameState (~80 fields)" warning, `app/storage/saves.ts`.
3. `SKILL_SAVE_STATE.md` — anchors: `app/storage/saves.ts`, `app/storage/__tests__/saves.test.ts`, Set/Map serialization, Steam Cloud sync code in `electron/`.
4. `SKILL_BALANCE.md` — anchors: detection-cost call sites in `app/engine/commands/*.ts`, hint budget constants, `app/engine/__tests__/ending-reachability.test.ts`, MECHANICS.md.
5. `SKILL_PERFORMANCE.md` — anchors: `app/components/Terminal.tsx`, locale file sizes (~5500 lines each), `app/i18n/runtime.ts`, animation loops in `app/components/effects/`.
6. `SKILL_TUTORIAL.md` — anchors: UFO74 dialogue paths in locale files, tutorial-state slice in `app/state/`, first-command discovery code.
7. `SKILL_REACTIVITY.md` — anchors: detection-tier branches across `app/components/Terminal.tsx`, UFO74 voice phases, Firewall taunts, alien silhouette overlay.
8. `SKILL_ACCESSIBILITY.md` — anchors: terminal aria patterns, focus management in modals (Turing test, leak sequence), CRT/static effect components, reduce-motion media query usage.
9. `SKILL_LOCALIZATION_QC.md` — anchors: `app/locales/*.json`, `specs-driven/LANGUAGES.md` tone rules, terminal column widths from `Terminal.tsx`.
10. `SKILL_PLAYTEST.md` — anchors: defer until real playtests run; no current telemetry surface.
11. `SKILL_PR_REVIEW.md` — anchors: PR #13 and PR #14 review history, AGENTS.md adjacent-system warnings, `SKILL_BUGS.md` "Common Bug Patterns".
12. `SKILL_PROMPT_AUTHORING.md` — defer (patterns still evolving per PR #14 spec).

**Brainstorm template for any of the above:**
- What's the load-bearing rule (the equivalent of SKILL_COMMANDS' Display Rule)?
- What pipeline/architecture map belongs in "The X Pipeline" section?
- What checklist items prevent the most common bug class in this area?
- Which existing skills does this cross-reference?
- What validation commands belong in "After Every Change"?

---

## Self-Review (completed inline by plan author)

- **Spec coverage:** This plan covers one skill from the 13-skill brainstorm.
  The remaining 11 are documented in Appendix A with research anchors so
  their future plans aren't starting from scratch. ✅
- **Placeholder scan:** No "TBD" / "TODO" / "implement later" / "add
  appropriate error handling" / "similar to Task N". The skill body is fully
  drafted in Step 3. ✅
- **Type consistency:** The plan references real exported names from the
  current codebase: `vitest.config.ts`, `vitest.setup.ts`,
  `scripts/run-vitest.mjs`, `app/types/index.ts` (seeded RNG),
  `app/storage/saves.ts`, `aliases.test.ts`, `endings.test.ts`,
  `ending-reachability.test.ts`, `help-body-localization.test.tsx`,
  `ufo74-tutorial-localization.test.tsx`. All verified to exist via the
  brainstorm research session. ✅
- **Sub-skill required:** Per the plan header, the next agent should use
  superpowers:subagent-driven-development (or executing-plans for inline
  execution). ✅
