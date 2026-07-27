# Additional Skills Brainstorm — Round 2

> **Status:** Brainstorm output. Picks one or more skills from this list to
> promote into a design spec + plan + implementation. Not a commitment.

## Why this exists

PR #14 (`docs/superpowers/specs/2026-05-18-skill-commands-design.md`,
Appendix A) listed 13 candidate skills. The user asked: "any **other** skills
beyond that list?" This document surfaces new candidates discovered by walking
the repo, plus a load-bearing meta-finding that the original brainstorm
missed.

---

## Meta-finding (load-bearing, fix before adding any more skills)

**The repo has two parallel skill systems and only one is auto-loaded.**

| Path | Format | Auto-loaded by agents? | Current count |
| --- | --- | --- | --- |
| `.github/skills/<name>/SKILL.md` | YAML frontmatter (`name`, `description`) | **Yes** (referenced by `AGENTS.md`) | 4 (`game-design`, `game-content`, `testing`, `version-bump`) |
| `specs-driven/skills/SKILL_<NAME>.md` | Plain markdown, no frontmatter | **No** (documentation only) | 8 (`AUDIO_VIDEO`, `BUGS`, `COMMANDS`, `ENDINGS`, `FILES`, `NARRATIVE`, `TESTING`, `TRANSLATION`) |

Implication: **`SKILL_COMMANDS.md` (PR #14) and `SKILL_TESTING.md` (PR #16) live
in the non-auto-loaded directory.** Agents reading `AGENTS.md` are routed to
`.github/skills/testing/SKILL.md` (a different, well-written skill) — they
will never see our new ones. The Display Rule we just codified will not
self-activate in future agent sessions.

**`SKILL_TESTING.md` is the worst-case:** there is already a
`.github/skills/testing/SKILL.md` covering the same territory with better
structure (decision tree by change type). Our new file is at best a
supplement, at worst a confusing duplicate.

### Proposed Skill 0 — `skill-authoring` (HIGHEST PRIORITY, blocks all others)

Goes in `.github/skills/skill-authoring/SKILL.md`. Codifies:

1. **Canonical home:** `.github/skills/<name>/SKILL.md` with YAML frontmatter.
   `specs-driven/skills/` is legacy reference material, not the runtime
   skill registry. Either retire it or define its distinct purpose.
2. **Required frontmatter:** `name`, `description` (one sentence, scannable).
3. **Routing from `AGENTS.md`:** every new skill MUST be added to the
   AGENTS.md skill table or it is invisible to agents.
4. **Format conventions** (header → Use when → Start Here → checklists →
   common bugs → After Every Change), matching existing four.
5. **Migration path** for the 8 `specs-driven/skills/` files: which to fold
   into `.github/skills/`, which to leave as reference, which to delete.

Without this skill, every future brainstorm risks repeating PR #14/16's
filing error.

---

## New skill candidates beyond Appendix A

Grouped by surface area. Each entry lists the trigger (file/test that proves
the surface exists today and is not covered), and the gap each skill closes.

### Release & distribution (not in Appendix A — entire surface uncovered)

1. **`electron-release`** — Use when changing `electron-builder.yml`,
   `electron/after-pack.js`, `scripts/build-electron.mjs`, or any
   multi-platform build (win/mac/linux). Code-signing, notarization,
   artifact layout, build matrix. Triggers: `electron:build:all` script,
   `after-pack.js` hook, three target platforms.

2. **`steam-integration`** — Use when touching `steamworks.js` calls, Steam
   achievements, Steam Cloud sync, rich-presence. Distinct from local save
   state (covered by Appendix A's `SAVE_STATE`). Triggers:
   `electron/steam-achievements.js`, `electron/steam-cloud.d.ts`,
   `electron/__tests__/steam-presence.test.ts`.

3. **`auto-update`** — Use when changing the `electron-updater` flow,
   release-channel routing, or update-blocking conditions. Triggers:
   `electron-updater` dep, beta channel decisions.

### Test infrastructure (Appendix A's `SKILL_TESTING` covers Vitest only)

4. **`playwright-e2e`** — Use when writing or fixing `e2e-tests/*.spec.ts`.
   Selectors, page-object patterns, headed vs headless, flake triage.
   The existing `.github/skills/testing` decision tree does not cover
   `npm run e2e`. Triggers: `e2e-tests/playwright.config.ts` + ~12 specs.

### Content tooling (no skill covers the validate-* scripts)

5. **`story-validation`** — Use when changing story data, running
   `validate-story`, `validate-enhanced`, `analyze-story`,
   `generate-report`, `shrink_and_spice_story`, `validate-fundamentals`.
   Five overlapping scripts; non-obvious which to run when. The decision
   tree alone is the skill. Triggers: `scripts/validate-*.js`,
   `scripts/story_validator.js`.

### Gameplay subsystems (each has its own test file; each is its own concern)

6. **`minigames`** (or split into `morse` + `turing` + `leak-prologue`) —
   Use when changing the morse minigame, Turing-test evaluator, or
   leak-sequence flow. Each has bespoke rules (3 morse attempts, evaluator
   prompts, sequence ordering). Triggers: `morse-evaluation.test.ts`,
   `turing-evaluation.test.ts`, `leakPrologue.test.ts`.

7. **`debug-commands`** — Use when adding or modifying `god mode`,
   `god ending <N>`, `override protocol`, or any dev-only command.
   Includes: how to keep dev commands out of player-visible `help`,
   prod-build gating, deterministic-RNG requirements for `god ending <N>`
   replays. Triggers: ending-verification harness, `god-mode-*.test.ts`.

8. **`reactive-tiers`** (refinement of Appendix A's `REACTIVITY`) — May
   merge or stand alone. The narrower scope here is the **detection-tier
   state machine itself** (24/25, 49/50, 69/70, 89/90, 100 boundaries),
   distinct from the surfaces that react to it. Triggers:
   `app/constants/detection.ts`, `warmup-detection.test.ts`,
   `atmosphere-phase.test.ts`.

### Player input (no skill covers the keyboard layer)

9. **`input-handling`** — Use when changing `useAutocomplete`, command
   history navigation, focus traps (Turing modal, leak sequence), or
   IME composition for PT/ES accented input. Triggers:
   `useAutocomplete.test.ts`, modal focus issues in past bugs.

### Rendering correctness (distinct from `PERFORMANCE`)

10. **`terminal-rendering`** — Use when changing fixed-pitch column
    alignment, scrollback rendering, bezel constraints, or any
    pixel-level terminal layout. The recent help-menu column-alignment
    bug (off by 1 char in `hide` row) is exactly this surface.
    Distinct from `PERFORMANCE` (which is FPS/bundle budgets).

### Maintenance (not in Appendix A)

11. **`dependencies`** — Use when bumping Electron (CVE cadence is real),
    Next, React, or Vitest. Includes npm audit triage, lockfile
    discipline, when to defer vs patch.

12. **`character-voice`** — Use when writing dialogue for UFO74,
    Firewall, HackerKid, the Director, or any speaking NPC. Currently
    overlaps with `SKILL_NARRATIVE.md` but the latter is event/pacing
    focused. `CHARACTERS.md` exists as the spec; the skill would route
    authors to it. Triggers: PRs that drift character voice (a real
    recurring review concern).

### Meta (not in Appendix A)

13. **`spec-authoring`** — Use when editing `specs-driven/MECHANICS.md`,
    `LANGUAGES.md`, `ENDINGS.md`, `FILES_REGISTRY.md`, `CHARACTERS.md`,
    `NARRATIVE.md`, `AUDIO_VIDEO.md`, `GAME_CONTEXT.md`. Conventions
    for spec deltas, source-of-truth precedence (spec vs code), and
    keeping `FILES_REGISTRY.md` translation table accurate.

---

## Recommended priority order

| Rank | Skill | Why now |
| --- | --- | --- |
| **0** | `skill-authoring` | Blocks everything else; current skills are mis-filed |
| 1 | `electron-release` | Entirely uncovered surface; release is high-stakes |
| 2 | `steam-integration` | Player-data risk (cloud saves, achievement state) |
| 3 | `story-validation` | Five scripts, no decision tree; agents currently guess |
| 4 | `playwright-e2e` | Existing `.github/skills/testing` explicitly excludes e2e |
| 5 | `debug-commands` | Touched every ending-verification PR |
| 6 | `dependencies` | Electron CVE cadence makes this recurring |
| 7 | `terminal-rendering` | Just hit a real bug in this surface |
| 8 | `input-handling` | Recurring keyboard edge cases |
| 9 | `character-voice` | Review-time concern; cheap to write |
| 10 | `minigames` | Bespoke per minigame; can split later |
| 11 | `auto-update` | Low cadence; defer |
| 12 | `reactive-tiers` | Likely folds into Appendix A's `REACTIVITY` |
| 13 | `spec-authoring` | Useful but lower traffic |

---

## What this brainstorm does NOT do

- It does not author any new skill files. Per the brainstorming skill's
  HARD-GATE, no implementation happens until the user approves a design.
- It does not revisit Appendix A. Those 11 deferred skills remain on the
  original roadmap (STATE, SAVE_STATE, PERFORMANCE, BALANCE, TUTORIAL,
  REACTIVITY, ACCESSIBILITY, LOCALIZATION_QC, PLAYTEST, PR_REVIEW,
  PROMPT_AUTHORING).
- It does not migrate `specs-driven/skills/*` into `.github/skills/`. That
  migration belongs to the `skill-authoring` skill's plan, not this
  brainstorm.

## Suggested next step

Promote **`skill-authoring`** to a design spec + plan + implementation.
Without it, every other new skill repeats the filing error PR #14 and PR #16
just made.

After `skill-authoring` ships, the next two highest-leverage picks are
`electron-release` and `story-validation` — both fill complete gaps (no
existing skill, no `specs-driven/skills/` overlap), both have clear scope.
