# Design: Ending Copy Disclosure Rewrite — Varginha: Terminal 1996

**Date:** 2026-07-03
**Scope owner:** endings rewrite
**Status:** Approved (design), pending spec review

## Problem

`app/engine/endings.ts` defines 12 endings in the `ENDINGS` record. Each ending's
copy is siloed to the single evidence category that triggered it, and several
endings undersell what a serious leak means. The clearest offender is
`the_2026_warning`, whose copy reads like a science-curiosity story
("SCIENTISTS IDENTIFY 30-YEAR PATTERN IN UNEXPLAINED ATMOSPHERIC EVENTS") despite
firing only when the player assembled a coherent, damning temporal-convergence
case about an alien arrival cycle. The same softening appears in `wrong_story`,
`incomplete_picture`, `ridiculed`, `nothing_changes`, and `harvest_understood`.

## Goal

Rewrite the copy across all 12 endings so each reads like an actual disclosure
event proportional to what it took to trigger — tense, world-altering,
unmistakably about the reality of non-human contact and a collapsing cover-up —
without abandoning the game's deadpan, clinical, bureaucratic house style
(AGENTS.md). The target register is the existing `real_ending`: specific
institutional reactions, compounding stakes, and a closing beat that names what
changed.

## Approach: the Consequence Ladder

Every ending becomes unmistakably about confirmed non-human contact + a
collapsing cover-up, but endings escalate in **institutional reaction and what
concretely changed**, so the set stays differentiated rather than flattening into
twelve identical apocalypses. The failure/irony endings keep their sting but stop
hiding behind euphemism.

- **Tier 0 — you got played / junk dossier:** `hackerkid_caught`, `ridiculed`.
  Deadpan; `ridiculed` keeps its comedy but only for genuinely weak dossiers.
- **Tier 1 — real evidence, failed to land:** `incomplete_picture` (horror leaked
  through but never cohered), `nothing_changes` (undeniable proof, world shrugs),
  `wrong_story` (exposed the wrong scandal; sharpen exactly what got buried).
- **Tier 2 — a true thread goes public, institutions visibly scramble:**
  `government_scandal`, `prisoner_45_freed`, `ufo74_exposed`,
  `the_2026_warning` (temporal alien threat public, governments reorganizing),
  `harvest_understood` (colonization-without-arrival confirmed; push the dread).
- **Tier 3 — total disclosure:** `real_ending`, `secret_ending`.

### Register discipline (per ending)

Apply the `real_ending` model to every ending's `narrative`, `ufo74_final`, and
`aol` block:
- Named institutions and specific reactions (press agencies, response times,
  quoted official/analyst lines).
- Stakes that compound rather than diffuse.
- A closing beat naming what changed, not just what was published.
- Keep AGENTS.md tone: clinical detachment, bureaucratic voice,
  `[REDACTED]`/`[DATA EXPUNGED]`/euphemism-as-horror. Massive in consequence,
  never pulpy/purple.
- Preserve the AOL-article format (dateline, wire-service voice, quoted
  analyst/official reactions) and the `[UFO74]:` closing-line convention.

## The one permitted logic tweak

`determineEnding()`'s `ridiculed` default fallback can catch genuinely damning
dossiers — e.g. a player who saved 3 alien-autopsy files (`medical=3`) lands in
`ridiculed` ("proved nothing"). This is the "damning file goes unacknowledged"
mismatch the task permits fixing with a narrow, additive threshold check.

**Change (Priority 11 only, additive):**

```ts
// Priority 11: Incomplete Picture — scattered dossier, OR one that still carries
// hard biological/containment evidence (multiple autopsies or containment logs)
// that never cohered. Such evidence should not be laughed off as 'ridiculed'.
const hardEvidence = medicalCount >= 2 || containmentCount >= 2;
if (maxCategory <= 2 || hardEvidence) return 'incomplete_picture';
return 'ridiculed';
```

**Why keyed on `medical`/`containment` only (not `core`):** probing current
behavior showed `determineEndingVariant({ neuralLinkAuthenticated: true })`
produces `core=3` (via a duplicate-path count of `alpha_journal.log`) and
resolves to `ridiculed`, with an existing test asserting that
(`app/engine/__tests__/endings.test.ts:124`). Keying the tweak on `core` would
flip that legacy case and break the test — overstepping the "no priority
redesign" guardrail. Keying only on biological/containment "body evidence"
targets the task's literal example (multiple autopsies) and is verified to change
no existing test outcome.

**Verified (via `determineEnding` probe) — outcomes after tweak:**
- `3 autopsy only` (med=3): `ridiculed` → **`incomplete_picture`** (the fix).
- `3 witness` (wit=3): `ridiculed` (unchanged; matches `endings.test.ts` ridiculed case).
- `3 military` (mil=3): `ridiculed` (unchanged; matches generator `EXAMPLES.ridiculed`).
- `neuralLinkAuthenticated` legacy variant: `ridiculed` (unchanged; test passes).
- `2 autopsy` / `2 core` / incomplete example: `incomplete_picture` (unchanged).

No priority reorder, no renamed/added `EndingId`s, no `FILE_CATEGORIES` change.

## visitorCount plan

`visitorCount` loosely signals the news magnitude of each ending.
- **Preserve as-is (deliberate symbolism):** `secret_ending: 1`,
  `hackerkid_caught: 12`.
- **Preserve download-virality irony:** `nothing_changes` ~14M.
- **Scale up to match raised stakes:** endings whose consequence I deepen —
  chiefly `the_2026_warning` and `harvest_understood` — move into the Tier-2 band
  (hundreds of thousands), staying below `real_ending` (highest non-symbolic).
- Keep relative ordering coherent with the ladder. Final numbers set during
  implementation to match final copy; a rewritten "world reacts massively"
  narrative must not ship paired with a tiny count.

## Companion change: keep the audit doc truthful

`scripts/gen-endings-doc.ts` contains human-readable `TRIGGER_RULES` text that
"mirrors determineEnding" (lines ~93–94 for `incomplete_picture` / `ridiculed`).
After the logic tweak, update only those two rule strings so the regenerated
`game_story_files/endings.MD` accurately describes the new routing. The `EXAMPLES`
verification sets are unaffected (all still resolve to their intended endings).

## Scope

**In scope**
- `app/engine/endings.ts` → `ENDINGS` record: `title`, `subtitle`, `narrative`,
  `ufo74_final`, and every `aol.*` field (`headline`, `subheadline`, `body`,
  `imageAlt`, and `visitorCount` where scale changes) for all 12 endings.
- `app/engine/endings.ts` → the single additive `determineEnding` Priority-11
  disjunct above.
- `scripts/gen-endings-doc.ts` → the two `TRIGGER_RULES` strings for
  `incomplete_picture` / `ridiculed` (accuracy only).
- Regenerate `game_story_files/endings.MD` via
  `npx tsx scripts/gen-endings-doc.ts` (verified working invocation).

**Out of scope**
- `determineEnding` priority order / `FILE_CATEGORIES` (beyond the one disjunct).
- Renaming/adding `EndingId`s; changing `GameEnding`/`AolPresentation` shape.
- `app/data/virtualFileSystem.ts`, `app/data/archiveFiles.ts`, any in-game file text.
- Any UI/rendering code (`Terminal.tsx`, `Victory.tsx`, etc.). Data only.
- Hand-editing `game_story_files/endings.MD` (generated; never edited directly).

## Constraints

- TypeScript strict. `ENDINGS: Record<EndingId, Omit<GameEnding, 'id'>>` — do not
  change the type shape.
- Keep `[UFO74]:` closing-line convention and AOL wire-service article format.
- Titles/subtitles keep their meaning-signature (e.g. `the_2026_warning` stays
  about the 2026 window) — deepen consequence and specificity, don't change what
  each ending is about.

## Per-ending checklist

- `the_2026_warning` — worst offender. Cyclical alien threat going fully public,
  governments visibly scrambling. Keep the physics/thirty-year-cycle premise;
  drop "atmospheric events" euphemism.
- `wrong_story` — keep the irony; make the closing beat sting by naming exactly
  how close the real story was and what specifically got buried.
- `incomplete_picture` — acknowledge that genuinely disturbing individual files
  leaked through even though the narrative failed to cohere (now also the
  destination for damning autopsy/containment dossiers via the logic tweak).
- `ridiculed` — reserved for genuinely weak dossiers; keep deadpan dismissal.
- `nothing_changes` — tighten so the proof is described with more weight before
  the apathy undercuts it.
- `harvest_understood` — push the cosmic dread of colonization-without-arrival;
  drop the mild "resource assessment" punchline as the terminal note.
- `hackerkid_caught`, `secret_ending`, `ufo74_exposed`, `real_ending`,
  `government_scandal`, `prisoner_45_freed` — tighten for uniform register; these
  are already near the target bar.

## Validation

Run after edits (AGENTS.md):
1. `npm test`
2. `npm run typecheck`
3. `npm run lint`
4. `npm run validate-story`
5. `npx tsx scripts/gen-endings-doc.ts` — regenerate the audit doc; confirm the
   diff reflects the new copy and the updated trigger-rule text.

## Deliverable

- Updated `app/engine/endings.ts` (copy + one logic disjunct).
- Updated `scripts/gen-endings-doc.ts` (two rule strings).
- Regenerated `game_story_files/endings.MD`.
- Summary of what changed per ending and why, plus confirmation all validation
  commands passed.
