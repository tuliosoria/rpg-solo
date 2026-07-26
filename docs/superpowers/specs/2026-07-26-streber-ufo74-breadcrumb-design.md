# Design: Streber ↔ UFO74 breadcrumb + reachability of `ghost_in_machine.enc`

**Status:** PROPOSED — pending author (tuliosoria) approval. No game-runtime code changed yet.
**Date:** 2026-07-26
**Branch:** `feature/streber-ufo74-breadcrumb`

## Background

While testing endings with the localhost admin tool, the author opened `/tmp/.signature.bak`
(the `streber@bbs.unesp.br` ASCII-signature Easter egg) expecting the UFO74 video and an
ending, and saw neither. That is correct current behavior:

- The **UFO74.mp4** video is attached only to `/internal/ghost_in_machine.enc`
  (`EVIDENCE_VIDEO_ATTACHMENTS`, `app/components/terminalConstants.ts:124`), triggered by
  `open`/`cat`.
- The **`ufo74_exposed`** and **`secret_ending`** endings are keyed on `ghost_in_machine.enc`
  (`app/engine/endings.ts:332-335`).
- `.signature.bak` is pure flavor — not in `EVIDENCE_VIDEO_ATTACHMENTS`, `FILE_CATEGORIES`,
  or any ending rule.

The author's instinct — that `streber74` reads as UFO74's civilian handle — matches the
canon in `specs-driven/CHARACTERS.md:18-37`: UFO74 is Carlos Eduardo Ferreira, he "left
breadcrumbs," and his real name stays hidden "unless the player finds `ghost_in_machine.enc`."

This design covers two requested changes, which combine into one arc:
1. **Wire the `streber` `.sig` into the UFO74 arc** (narrative connection).
2. **Make `ghost_in_machine.enc` easier to reach / clarify the path to the UFO74 video.**

## Goals

- Turn the existing `streber` Easter eggs into an intentional, discoverable breadcrumb that
  hints UFO74's civilian identity and nudges the player toward the sealed identity file.
- Improve discoverability of `ghost_in_machine.enc` so more players actually reach the
  video + reveal, **without** removing the narrative gating that makes the reveal a climax.
- Stay additive and behavior-preserving for existing endings and tests.

## Non-goals

- No change to ending-determination rules or `FILE_CATEGORIES` (so `ufo74_exposed` /
  `secret_ending` reachability is unchanged).
- No new ending. No change to the admin/override unlock mechanic itself.
- No unrelated refactoring of the terminal/filesystem code.

## Current-state facts (verified)

| Thing | Location | Notes |
|---|---|---|
| `.signature.bak` (streber sig) | `/tmp/.signature.bak` — `app/data/virtualFileSystem.ts:2925,3748` | `ascii_signature_bak`, status `intact`, no gameplay hook |
| `<streber74>` IRC log | `/tmp/modem_log_jan96.txt` — `virtualFileSystem.ts:2910-2912` | same dir; football/DCC banter |
| UFO74 identity file | `/internal/ghost_in_machine.enc` → `ufo74_identity_file` (`app/data/narrativeContent.ts:9`) | gated `requiredFlags:['adminUnlocked']` + `accessThreshold:3`; teases "the transfer authorization may explain who left this behind" |
| Video mapping | `terminalConstants.ts:124-129` | `open`/`cat` of the `.enc` → `UFO74.mp4` prompt |
| Reveal flag | `filesystem.ts:559-560,713-714` | reading `ghost_in_machine` sets `ufo74SecretDiscovered` |
| Per-file UFO74 reaction channel | `filesystem.ts:585-617,903-904` (`ufo74ContextMessage` / `pendingUfo74Messages`) | one UFO74 line per file open — reuse this |
| Hint system | `app/engine/hintSystem.ts` | contextual UFO74 hints incl. a post-admin-unlock slot |
| i18n exact-match | `translateRuntimeText` (`app/i18n/index.tsx`) | **any new/edited English string that appears in-game must have pt-BR + es entries** in the runtime translation tables, or it renders English in localized modes |

## Approaches considered

### Option 2 — wire streber into the UFO74 arc

- **A. Breadcrumb + UFO74 reaction (RECOMMENDED).** Add a subtle, non-spoilery line to
  `.signature.bak` that reinforces streber = a real person whose terminal this was, and fire a
  one-off UFO74 reaction when the player reads `.signature.bak` (and/or `modem_log_jan96.txt`)
  via the existing `ufo74ContextMessage` channel — e.g. *"ufo74: heh. streber. long time since
  anyone called me that. keep digging, kid."* Set a hidden flag (`streberSigFound`) that
  sharpens a later UFO74 hint toward the identity file. Preserves mystery, reuses existing
  systems, low risk.
- **B. Explicit pointer.** Put the literal path `/internal/ghost_in_machine.enc` in the sig /
  IRC log. Simple but heavy-handed; kills the mystery.
- **C. New tracked mini-arc / achievement.** Make "recognize streber = UFO74" a first-class
  achievement, possibly feeding the secret ending. Larger scope; touches achievements +
  ending logic (violates non-goals). Not now.

### Option 3 — reachability of `ghost_in_machine.enc`

- **X. Guidance, not gate-removal (RECOMMENDED).** Keep `adminUnlocked` + `accessThreshold:3`
  (the sealed personal archive is the climax). Improve discoverability instead: after admin is
  unlocked, a UFO74 hint points to `/internal/ghost_in_machine.enc`; the streber breadcrumb
  (Option 2A) plants the thread earlier; the existing "transfer authorization" clue already
  points at it. Path becomes: streber sig/IRC → curiosity → admin unlock → UFO74 hint →
  `open ghost_in_machine.enc` → video + reveal.
- **Y. Lower the gate.** Drop the threshold/flag so it's reachable earlier. Risks the secret
  ending pacing and the climactic weight. Not recommended.
- **Z. `decrypt`-only nudge.** If a player only `decrypt`s the file (which shows content but
  does not fire the video, since the video trigger is `open`/`cat`-only in `Terminal.tsx`),
  add a one-line nudge to `open` it. Small, complements X. Worth including.

## Recommended design (Option 2A + 3X, plus 3Z nudge)

Additive breadcrumb arc, no ending-rule changes:

1. **`.signature.bak` copy tweak** — add 1–2 lines tying streber to "whoever built this
   archive," staying cryptic. Reuse the existing `>> ... <<` tone.
2. **UFO74 reaction on reading the streber files** — one-off line via `ufo74ContextMessage`
   when the player opens `.signature.bak` (primary) and optionally `modem_log_jan96.txt`.
   Gated so it fires once (e.g. new `streberSigFound` flag), matching the "one UFO74 message
   per file open" convention.
3. **Sharper post-admin hint** — in `hintSystem.ts`, when `adminUnlocked` is true (and/or
   `streberSigFound`), surface a hint pointing to `/internal/ghost_in_machine.enc`.
4. **`decrypt` → `open` nudge** — if the player decrypts `ghost_in_machine.enc` but has not
   opened it, a brief UFO74/system line suggests `open`ing it to "see the rest."
5. **i18n** — every new/edited English string gets pt-BR + es entries in the runtime
   translation tables (project convention; exact-match lookup).
6. **Tests** — unit coverage that reading `.signature.bak` sets `streberSigFound` and emits
   the UFO74 reaction once; that the post-admin hint references the identity file; and a
   guard that ending determination for the existing UFO74 endings is unchanged.

## Open questions for the author (please answer before implementation)

1. **Mystery level:** subtle breadcrumb (recommended) vs. explicit path pointer? (Default: subtle.)
2. **Mechanical payoff:** keep it pure lore + hint (recommended), or should recognizing
   streber = UFO74 grant an achievement / feed the secret ending? (Default: lore + hint only.)
3. **Gate:** keep `ghost_in_machine.enc` gated behind admin + threshold 3 (recommended), or
   actually lower it? (Default: keep gate, add guidance.)
4. **Scope of the reaction:** react on `.signature.bak` only, or also `modem_log_jan96.txt`?
   (Default: `.signature.bak` primary, IRC log optional.)
5. **Exact UFO74 line(s):** placeholder copy above is a draft in UFO74's lowercase voice —
   want to write/approve the final wording yourself?

## Risks / constraints

- **Deploy:** game-runtime edits auto-deploy on merge to `main`. Implementation will land on
  `feature/streber-ufo74-breadcrumb` and ship via PR for review.
- **i18n drift:** missing pt-BR/es entries would show English in localized modes; covered by
  step 5 + tests.
- **Voice:** UFO74 must stay lowercase, periods-only, no exclamation marks
  (`CHARACTERS.md:22,37`).
