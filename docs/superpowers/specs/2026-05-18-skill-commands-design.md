# Design: `SKILL_COMMANDS.md`

> Status: Spec — pending user approval
> Author: Copilot (brainstorming session, 2026-05-18)
> Scope: One new skill file (`specs-driven/skills/SKILL_COMMANDS.md`)
> Motivated by: BUG-001/002/003 (i18n command-name display leaks, PR #13)

---

## Problem

The "command" surface is the most-touched code in the game (parser, resolver,
14+ handlers, locale files in three languages, MECHANICS.md, LANGUAGES.md,
tests). Today, command-authoring rules are scattered across `SKILL_BUGS.md`,
`SKILL_TRANSLATION.md`, and `SKILL_NARRATIVE.md`. No single skill enforces the
end-to-end checklist a command author must follow.

The three i18n bugs we just shipped (PR #13) share one root cause: command
names were aliased on **input** but not localized on **display**. A command
author had no checklist that flagged "output strings that mention a command
name must call `localizedCommandName()` per active locale." `SKILL_COMMANDS.md`
exists to make that class of bug impossible to ship.

## Scope decisions

**In scope:**
- One new file: `specs-driven/skills/SKILL_COMMANDS.md`, matching the format and
  density of the six existing skills (~60–90 lines).
- Cross-references to MECHANICS.md, LANGUAGES.md, SKILL_TRANSLATION.md,
  SKILL_BUGS.md.
- A prominent **Display Rule** section that codifies the BUG-001/2/3 fix.

**Out of scope (deferred — see Appendix A):**
- The other 11 candidate skills (STATE, TESTING, SAVE_STATE, PERFORMANCE,
  BALANCE, TUTORIAL, REACTIVITY, ACCESSIBILITY, LOCALIZATION_QC, PLAYTEST,
  PR_REVIEW, PROMPT_AUTHORING).
- Detailed code samples — the skill points at file paths, not duplicates them.
- Detection-cost economics — that's `SKILL_BALANCE.md`'s job; this skill only
  reminds the author to set a value consistent with adjacent commands.
- A `command:new` scaffolder or codemod — not warranted yet.

## Design approach considered

**A (chosen):** Tight skill matching existing density (target 80–100 lines).
Eight sections:
header, "Use when", "Before You Add or Change a Command", **Command Pipeline**
(parser → resolver → handler → output entry → display), **The Display Rule**
(localizedCommandName mandate), **Checklist for Every Command Change**
(EN/PT/ES tests, MECHANICS sync, alias audit), Adding/Modifying/Removing,
Common Command Bugs, After Every Change. Target 80–100 lines.

**B (rejected):** Long command-authoring handbook (~250 lines) with embedded
TypeScript samples for each pipeline stage. Rejected because it duplicates
source-of-truth code, drifts as the code evolves, and breaks tonal consistency
with the other six skills (which all stay in the 50–80 line range).

## Skill outline (section-by-section)

### 1. Header + "Use when"
> Use when: adding, modifying, removing, aliasing, or renaming any command;
> changing a command's detection cost, output, or subcommands.

### 2. Before You Add or Change a Command (4 items)
1. Read [MECHANICS.md](../MECHANICS.md) Commands — Full Reference section.
2. Read [LANGUAGES.md](../LANGUAGES.md) Command Word Translations table.
3. Read `app/engine/commands/utils.ts` — understand `COMMAND_ALIASES`,
   `COMMAND_TRANSLATIONS`, `resolveCommandAlias`, `localizedCommandName`,
   `SUBCOMMAND_ALIASES`, `resolveSubcommandAlias`.
4. Search adjacent commands for the same pattern you're about to apply
   (e.g., adding `hide` alias? Check what `wait` does. Adding a subcommand?
   Check how `help` does it.).

### 3. The Command Pipeline

A one-paragraph map of how a typed line becomes terminal output:

```
input string
  → parseCommand()            (app/engine/commands/utils.ts)
  → resolveCommandAlias()     (translated word → canonical English)
  → handler dispatch          (app/engine/commands/*.ts)
  → createEntry / createEntryI18n  (per SKILL_TRANSLATION.md decision tree)
  → Terminal render           (active locale applied at render time)
```

Each arrow is a place a command can break in EN, PT-BR, or ES independently.

### 4. The Display Rule (NEW — codifies BUG-001/2/3)

> **Every command name rendered in player-visible output MUST be wrapped in
> `localizedCommandName(cmd, lang)`.** Never embed a literal command word
> (`save`, `hide`, `help basics`, etc.) in a locale string or in a fallback
> string handed to `createEntry*`.

Applies to: help bodies, UFO74 dialogue, system warnings, error messages,
tutorial hints, low-stability messages, ending dialogue, leaked-credentials
echoes, anywhere a command name appears as content.

Two exceptions:
- The string echoes the player's literal typed input (e.g., "command not
  recognized: <input>"). Keep the input verbatim.
- The command is on the LANGUAGES.md "Terms That Stay in English" list
  (`ls`, `cd`, `tree`, `link`, `morse`, `trace`, `chat`, `script`, `run`,
  `override protocol`, `god mode`, `god ending`).

### 5. Checklist for Every Command Change

- [ ] `COMMAND_ALIASES` updated for every supported translation
- [ ] `COMMAND_TRANSLATIONS[locale]` updated symmetrically (round-trip)
- [ ] `SUBCOMMAND_ALIASES` updated if the command has subcommands
- [ ] Handler registered/updated in the correct file under `app/engine/commands/`
- [ ] Every rendered command name uses `localizedCommandName()` per the
      Display Rule
- [ ] MECHANICS.md Commands — Full Reference row added/updated, including
      the Aliases column
- [ ] LANGUAGES.md Command Word Translations row added/updated (or the command
      is justified on the "Terms That Stay in English" list)
- [ ] Detection cost is consistent with adjacent commands of the same class
      (technical / investigation / recovery / risky)
- [ ] Locale strings exist in `app/locales/en.json`, `pt-br.json`, `es.json`
- [ ] Tests cover EN + PT-BR + ES (input parsing AND display) under
      `app/engine/commands/__tests__/` and `app/i18n/__tests__/`
- [ ] Adjacent-command audit: any sibling command with the same pattern that
      should get the same treatment? (If yes, do it now or open an issue.)

### 6. Adding a New Command (5 steps)

1. Register canonical English form in handler dispatch.
2. Add row to MECHANICS.md and LANGUAGES.md.
3. Add aliases in both `COMMAND_ALIASES` and `COMMAND_TRANSLATIONS`.
4. Author all user-visible strings via `createEntryI18n`, applying the Display
   Rule for any embedded command names.
5. Add tests: parsing (EN/PT/ES inputs route to the same handler) and display
   (output strings show localized names per active locale).

### 7. Modifying an Existing Command (3 steps)

1. Reproduce current behavior in all three languages before editing.
2. Apply change end-to-end through every pipeline stage. Re-run the Checklist.
3. Update MECHANICS.md/LANGUAGES.md if behavior, cost, or aliases changed.

### 8. Removing a Command (3 steps)

1. Delete handler + alias entries + subcommand entries.
2. Delete or replace every locale string that referenced the command name.
3. Remove from MECHANICS.md and LANGUAGES.md. Audit endings/files/UFO74 hints
   that pointed at it.

### 9. Common Command Bugs (cross-reference SKILL_BUGS.md "Common Bug Patterns")

- **English leak in non-English output** — Display Rule violated.
- **Asymmetric alias maps** — translated word resolves to English but English
  doesn't translate back; `localizedCommandName` returns the wrong name.
- **Subcommand not accent-insensitive** — diacritic-stripping skipped at lookup.
- **Adjacent-command drift** — sibling command (`wait`/`hide`, `save`/`unsave`)
  treated differently from its pair.
- **MECHANICS/code drift** — Aliases column says `—` but code has aliases, or
  vice versa.
- **Test only covers EN** — i18n bugs slip through. Tests must include PT-BR
  and ES paths.

### 10. After Every Command Change

1. `npm test` — all command and i18n suites pass
2. `npm run typecheck` — no type errors in handlers or locales
3. `npm run lint` — clean
4. `npm run validate-story` — story still parses
5. `npm run build` — production bundle builds
6. Manual smoke: switch language mid-session (EN → PT-BR → ES → EN), invoke
   the command in each, confirm display is fully localized.
7. Update plan.md / PR description with what changed.

---

## Acceptance criteria

A future contributor adding a new command, when handed `SKILL_COMMANDS.md`,
must be able to:

1. Identify every file they need to touch (parser, resolver, handler, locales,
   docs, tests) without grepping the codebase for examples.
2. Recognize the Display Rule and apply it on first draft (i.e., never need a
   reviewer to flag "you embedded `save` in a PT-BR string").
3. Know which validation commands to run before claiming the work done.
4. Know which adjacent skills (TRANSLATION, BUGS, NARRATIVE) cover concerns
   this skill points to but doesn't duplicate.

The skill itself must:

- Be 80–100 lines.
- Match the formatting, tone, and section structure of the existing six skills
  in `specs-driven/skills/`.
- Add no new dependencies or tools (the alias plumbing already exists).
- Reference real file paths and real exported function names from the current
  codebase (no placeholders).

## File touched by this change

- **New:** `specs-driven/skills/SKILL_COMMANDS.md`

That's it. No code, no tests, no doc moves. Implementation is "drop one file
in place per the outline above and verify it lints/builds (it's just
markdown — nothing to verify beyond that)."

## Risks / open questions

1. **Naming collision.** Existing skill files use `SKILL_<DOMAIN>.md`.
   `SKILL_COMMANDS.md` fits. ✅
2. **Overlap with `SKILL_TRANSLATION.md`.** The Display Rule lives here, not
   there, because it's command-specific. `SKILL_TRANSLATION.md` covers the
   general pipeline; `SKILL_COMMANDS.md` references it for tone/exempt-terms
   and adds the command-name-specific rule.
3. **Overlap with `SKILL_BUGS.md`.** The Common Command Bugs section
   *references* SKILL_BUGS.md's Common Bug Patterns rather than duplicating.
4. **AGENTS.md update.** Should AGENTS.md learn about the new skill? Existing
   AGENTS.md doesn't currently list the six skills explicitly. **Decision: do
   not modify AGENTS.md as part of this change. Out of scope.** If future
   discovery proves agents miss the skill, address then.

---

## Appendix A — Deferred skill roadmap

User-prioritized list of skills to author after `SKILL_COMMANDS.md` lands.
Preserved verbatim from the brainstorm input so the research isn't lost.

**Engineering hygiene (highest ROI):**
1. `SKILL_COMMANDS.md` — **this spec** ✅
2. `SKILL_TESTING.md` — Vitest + jsdom quirks, seeded RNG, localStorage
   mocking, command-harness setup, ending verification harness, translation
   snapshot tests, flaky test triage.
3. `SKILL_STATE.md` — GameState shape rules, action discipline, adding a field
   (type → default → migration → persistence → tests), save format versioning.
4. `SKILL_SAVE_STATE.md` — localStorage key inventory, Set/Map serialization,
   Steam Cloud sync, save migration, corruption detection.
5. `SKILL_PERFORMANCE.md` — bundle budgets, locale lazy-loading, Terminal
   scrollback virtualization, animation FPS budget, React 19 render profiling,
   reduce-motion fallbacks.

**Game craft:**
6. `SKILL_BALANCE.md` — detection cost ranges per command class, hint pacing,
   evidence distribution, ending reachability matrix, Turing-test calibration,
   wait/hide economy.
7. `SKILL_TUTORIAL.md` — command discovery gates, UFO74 pacing, first-failure
   recovery, tutorial bypass for returning players, "exit without confusion"
   bar.
8. `SKILL_REACTIVITY.md` — detection-tier inventory, adding a new reactive
   surface, tier-boundary testing (24/25, 49/50, 69/70, 89/90, 100), Firewall
   disarm propagation.

**Player experience:**
9. `SKILL_ACCESSIBILITY.md` — screen-reader patterns for terminal output,
   keyboard-only navigation, reduce-motion fallbacks, font scaling without
   breaking the bezel, colorblind-safe palette, modal focus management.
10. `SKILL_LOCALIZATION_QC.md` — register-consistency checks, idiomatic flow
    review, column-length checks, cultural fit, accent-insensitive matching
    audit, English-leak grep patterns.
11. `SKILL_PLAYTEST.md` — playtest protocol, telemetry events, ending
    distribution analysis, drop-off heatmap, stuck-point detection.

**Cross-cutting / meta (defer further — patterns still evolving):**
12. `SKILL_PR_REVIEW.md` — translation parity, MECHANICS/LANGUAGES sync, tests
    added, adjacent-system verification, diff-minimality, no new deps, save
    format unchanged or migrated.
13. `SKILL_PROMPT_AUTHORING.md` — meta-skill encoding the prompt patterns used
    for BUG-001/002/003 (cite spec, route via AGENTS.md, list validation,
    demand minimal diff).

**Recommended sequencing** (from the brainstorm input):
SKILL_COMMANDS → SKILL_TESTING → (SKILL_STATE + SKILL_SAVE_STATE as a pair) →
SKILL_BALANCE (before next public playtest). Defer SKILL_PROMPT_AUTHORING and
SKILL_PLAYTEST until patterns / playtests exist to encode.
