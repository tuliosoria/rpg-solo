# Design: `government_scandal` Ending — Smoking-Gun Consistency

**Date:** 2026-07-04
**Scope owner:** endings consistency
**Status:** Draft (design), pending user review
**Related:** `docs/superpowers/specs/2026-07-03-endings-disclosure-rewrite-design.md`
(the disclosure "Consequence Ladder" rewrite, implemented in commit `c7f8bbf`).

---

## Problem

The `government_scandal` ending (headline *"LEAKED DOCUMENTS REVEAL MASSIVE
BRAZILIAN MILITARY OPERATION IN VARGINHA"*) is deliberately written as a
**mundane, bureaucratic** outcome: the player exposed the cover-up, but *not* the
biological truth. Its copy makes two **absolute** claims:

- `narrative[0]` (`app/engine/endings.ts:447`):
  *"The leak **does not prove alien contact** — it proves the Brazilian military
  mobilized an entire region to hide something…"*
- `aol.body[1]` (`app/engine/endings.ts:457`):
  *"The purpose of the operation is **not specified in any of the recovered
  files**."*

Both claims are **false when the player's leaked dossier contains genuine
smoking-gun contact files**, and the player *can* reach this ending while having
leaked exactly those files:

- `jardim_andere_incident.txt` — a field report describing **direct contact**
  with the surviving occupant (oily dark-brown skin, three cranial ridges, large
  red eyes, telepathic intrusion).
- `incident_report_1996_01_VG.txt` — *"three biological specimens recovered from
  Jardim Andere. Two responsive. One injured."*

### Why it's reachable

`determineEnding` (`endings.ts:341`) fires `government_scandal` when
`militaryCount >= 4`, where `militaryCount` counts files in
`FILE_CATEGORIES.military_coverup` (`endings.ts:51-62`). That category mixes **8
mundane logistics files** (transport logs, duty rosters, cargo memos) with the
**2 smoking-gun files above**. So a dossier of
`{jardim_andere_incident.txt, incident_report_1996_01_VG.txt,
initial_response_orders.txt, transport_log_96.txt}` → `militaryCount = 4` →
`government_scandal`, whose own copy then denies the alien proof sitting in the
dossier.

This is **intentional routing, not a mis-wire**: the legacy
`conspiracyFilesLeaked` flag maps to a synthetic set that *explicitly* includes
both smoking-gun files and is tested to yield `government_scandal`
(`endings.ts:686-692`; `endings.test.ts:118-125`). The defect is purely in the
**ending's prose**, which asserts absolutes that the dossier can contradict.

### What the player already sees

The AOL newspaper (`app/components/endings/Victory.tsx`) is the player-visible
ending surface. It already prepends a savedFiles-aware "world in uproar" preface
via `buildLeakPrologue` (`app/engine/leakPrologue.ts`) — and `government_scandal`
is **not** excluded from it. Because every `military_coverup` file is in
`ALIEN_RELATED_FILES` (`leakPrologue.ts:77-87`), any `government_scandal` dossier
(≥4 military) already triggers the preface:
*"…hackerkid has leaked classified Brazilian government files appearing to prove
the existence of extraterrestrial life, and the world is in international
uproar…"*

That preface then runs **directly into** `aol.body[1]`'s
*"purpose is not specified in any of the recovered files"* — a self-contradiction
within the same article whenever smoking-gun files are present.

> Note: `narrative[]` (the terminal-style block in `getEndingNarrativeLines`) has
> no current UI consumer — only `getEndingNarrativeLines` references it, and
> nothing calls that outside tests. The **player-visible** contradiction lives in
> `aol.body[1]`. We fix `narrative[0]` too for content correctness and test
> integrity, but the render-critical change is the AOL body.

---

## Goal

Make `government_scandal`'s copy **consistent with the dossier that produced it**:

- When the dossier contains **no** smoking-gun contact file → keep the current
  mundane framing (*"the cover-up was bigger than the event; purpose still
  classified"*). This is **correct** for a pure-logistics leak and must be
  preserved.
- When the dossier **does** contain a smoking-gun contact file → the copy must
  acknowledge that the leaked files carry a groundbreaking revelation (recovered
  biological specimens / direct contact), while staying true to the ending's
  theme: the political story still centres on the mobilization and the cover-up,
  but it can no longer pretend the purpose is unknown.

Non-goals: no change to which ending is *reached*; no re-tiering of the ending;
no rewrite of the mundane-path meaning.

---

## Approaches considered

### A. Recategorize the smoking-gun files (rejected)

Move `jardim_andere_incident.txt` / `incident_report_1996_01_VG.txt` out of
`military_coverup` (e.g., into `ufo_core`) so they don't count toward the mundane
tally.

**Rejected** — breaks load-bearing counts:
- `real_ending` requires `militaryCount >= 2`; its canonical dossier relies on
  `incident_report_1996_01_VG.txt` as one of two military files
  (`endings.test.ts:70-78`). Recategorizing drops it to 1 → `real_ending`
  unreachable via that path.
- `nothing_changes` canonical dossier likewise counts
  `incident_report_1996_01_VG.txt` as its single `military` file
  (`endings.test.ts:49-54`); recategorizing breaks it.
- Contradicts the legacy `conspiracyFilesLeaked → government_scandal` contract
  (`endings.ts:686-692`, `endings.test.ts:118-125,150-157`).
- A guard-only variant (block `government_scandal` when a smoking gun is present)
  strands such dossiers in `ridiculed` — thematically wrong for a creature-report
  leak.

### B. Rewrite the base copy to always assert contact (rejected)

Make `government_scandal` uniformly about confirmed non-human contact.

**Rejected** — false in the other direction: a pure-logistics leak (4+ mundane
files, no smoking guns) genuinely *doesn't* prove contact, and "purpose not
specified" is *accurate* there. A single static copy cannot be truthful for both
dossier shapes.

### C. Conditional / adaptive copy (recommended)

Keep the trigger, categorization, and legacy contract **untouched**. Select
between a **mundane** and a **smoking-gun** version of exactly the two
contradictory lines, based on a pure predicate over `savedFiles`.

**Why C:** surgically fixes the contradiction with zero mechanical regressions;
mirrors the existing savedFiles-aware `buildLeakPrologue` pattern; keeps both
dossier shapes truthful; smallest blast radius on the test suite (the
ending-*selection* tests are unaffected because `determineEnding` doesn't
change).

---

## Design (Approach C)

### 1. Smoking-gun predicate (pure, engine)

Add a small pure helper (co-located with the existing leak logic in
`app/engine/leakPrologue.ts`, or a sibling module — final home decided in the
plan):

```ts
export const SMOKING_GUN_CONTACT_FILES = new Set<string>([
  'jardim_andere_incident.txt',       // direct-contact field report
  'incident_report_1996_01_VG.txt',   // "biological specimens recovered"
]);

export function hasSmokingGunContact(
  savedFiles: ReadonlySet<string> | undefined | null,
): boolean {
  if (!savedFiles) return false;
  for (const fullPath of savedFiles) {
    const basename = fullPath.split('/').pop() ?? fullPath;
    if (SMOKING_GUN_CONTACT_FILES.has(basename)) return true;
  }
  return false;
}
```

Triggers on **≥1** smoking-gun file (a single creature/specimen document is
enough to invalidate "purpose not specified").

### 2. Two copies of exactly two lines

Store both variants in the `government_scandal` content (extend the ending record
with optional `narrativeSmokingGun` + `aolBodySmokingGun`, keeping the existing
fields as the mundane default), or return them from an engine selector
`resolveGovernmentScandalCopy(savedFiles)`. Exact structural choice is left to the
implementation plan; the requirement is: **the mundane strings stay the default,
the smoking-gun strings are used when `hasSmokingGunContact(savedFiles)` is true.**

Draft smoking-gun copy (house style: clinical, wire-service, AGENTS.md tone —
final wording refined during implementation):

- **`narrative[0]` (smoking-gun):**
  *"Transport logs. Response orders. And two documents that turn a mobilization
  story into something else: an incident report logging biological specimens
  recovered from the Jardim Andere site, and a field report describing direct
  contact with a surviving occupant. This is no longer only proof that the
  Brazilian military hid something on January 20, 1996 — it is the first page of
  what it was hiding."*

- **`aol.body[1]` (smoking-gun):**
  *"Unlike the transport and command records, two of the leaked files name the
  operation's purpose: an incident report references 'biological specimens
  recovered' from the Jardim Andere site, and a field report describes a
  surviving occupant. Forensic analysts working around the clock report the
  documents may be authentic; wire services are already calling it the most
  consequential leak of the decade."*

The mundane `narrative[0]` / `aol.body[1]` remain **exactly as today** for the
no-smoking-gun path.

**Optional (flag for user):** conditionally escalate the AOL `subheadline` when
smoking guns are present (the current one lists only "transport logs and response
orders"). Kept optional to hold the diff minimal; include only if the user wants
the headline block to reflect the revelation too.

### 3. Render integration

- **AOL (render-critical):** `Victory.tsx` already builds `aol` in a `useMemo`
  with `savedFiles` in scope (`Victory.tsx:130-141`) and already composes
  `buildLeakPrologue(savedFiles, …)`. Extend that resolution so that, for
  `resolvedEndingId === 'government_scandal'`, the smoking-gun `body`/`subheadline`
  variant is used when `hasSmokingGunContact(savedFiles)`. Prefer routing through
  an engine selector over index-based swaps in the component.
- **Terminal narrative:** make `getEndingNarrativeLines` accept an optional
  `savedFiles` argument (backward-compatible; defaults to mundane) and select the
  smoking-gun `narrative[0]` when present. Low urgency (no live consumer) but
  keeps content and tests coherent.

### 4. Internationalization

`government_scandal` copy is duplicated for PT-BR/ES in
`app/i18n/runtimeCommandSupplement.ts` (existing mundane lines already present).
Add PT-BR/ES entries for the new smoking-gun `narrative[0]` and `aol.body[1]`
(and the optional subheadline) so `translateRuntimeText` resolves them in
localized runs. Directory/file names stay English (per LANGUAGES.md), but these
are prose lines and must be translated to match the rest of the ending.

---

## Testing

- **New pure unit tests** (engine): `hasSmokingGunContact` / the copy selector —
  dossier with a smoking gun → smoking-gun copy; pure-logistics dossier → mundane
  copy; empty/undefined → mundane. This is the isolated pure-function test the
  request asks for.
- **Unchanged & must stay green:** `endings.test.ts` ending-*selection* tests —
  `determineEnding` is deliberately untouched, so the `government_scandal`
  representative dossier (which includes both smoking-gun files,
  `endings.test.ts:37-42`) still resolves to `government_scandal`. `real_ending`
  and `nothing_changes` canonical paths are unaffected (categories unchanged).
- **Render assertion (Victory):** with a `government_scandal` dossier that
  includes `jardim_andere_incident.txt`, the AOL body shows the smoking-gun line
  and **not** "purpose is not specified"; with a pure-logistics dossier it shows
  the mundane line. (Follow existing `Victory` test patterns.)
- **i18n:** confirm PT-BR/ES resolve the new lines (no missing-key fallback to
  English) — extend `i18n` tests if a targeted assertion fits existing patterns.
- **Regenerate audit doc:** `npx tsx scripts/gen-endings-doc.ts` if the endings
  audit doc enumerates copy (per the prior spec's validation step).

## Validation (per AGENTS.md)

1. `npm test` (or targeted: `node scripts/run-vitest.mjs run app/engine/__tests__/endings.test.ts app/components/endings/__tests__ --configLoader runner --reporter=dot`)
2. `npm run typecheck`
3. `npm run lint`
4. `npm run validate-story`
5. Manual: reach `government_scandal` (a) with `jardim_andere_incident.txt`
   leaked → ending acknowledges recovered specimens / contact; (b) with only
   mundane logistics leaked → ending retains "purpose still classified" framing.
6. Confirm `en`, `pt-BR`, `es` all render consistent copy.

---

## Scope guardrails

- **Do NOT** change `determineEnding`, `FILE_CATEGORIES`, or the legacy
  `conspiracyFilesLeaked` mapping (avoids `real_ending` / `nothing_changes`
  regressions and preserves the tested contract).
- **Do NOT** alter the mundane-path meaning; the "purpose still classified"
  reading must survive for pure-logistics leaks.
- **Do NOT** expand to other endings in this change.
- Keep the diff scoped to: the smoking-gun predicate, the two conditional lines
  (+ optional subheadline), their two render integration points, i18n entries,
  and tests.

## Known-adjacent risks (out of scope — future pass)

- **`wrong_story`** can fire with `coreCount <= 1`; because smoking-gun files
  count as `military` (not `ufo_core`), a dossier could reach `wrong_story`
  ("exposed the wrong scandal / media manipulation") while a single smoking-gun
  file is present — the same contradiction class. Flagged for a follow-up review;
  not addressed here to keep this change minimal.
- **`buildLeakPrologue`** treats *all* `military_coverup` files as
  "alien-related," so even a pure-logistics `government_scandal` leak currently
  gets the "appearing to prove the existence of extraterrestrial life" preface —
  a possible over-claim in the opposite direction. Separate concern; not in scope.
