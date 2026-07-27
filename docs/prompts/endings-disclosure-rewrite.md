# Agent prompt: rewrite ending copy for "disclosure day" impact

Paste everything below the line into a fresh agent session to execute this task.

---

## Task

You're working in `rpg-solo`, a text-based narrative game about the 1996 Varginha UFO
incident (`AGENTS.md` has full project context — read it first). The game ends when the
player leaks a dossier of saved evidence files; `determineEnding()` in
`app/engine/endings.ts` pattern-matches the saved file set against `FILE_CATEGORIES` and
picks one of 12 endings from the `ENDINGS` record.

**The problem:** ending copy is siloed to only the evidence category that triggered it,
and several endings undersell what a serious leak actually means. The clearest example:
`the_2026_warning` fires when the player saved 2+ files from `temporal_convergence`
(`thirty_year_cycle.txt`, `convergence_model_draft.txt`, etc.) — files that describe an
alien arrival cycle. But its copy reads like a science curiosity story:

> "SCIENTISTS IDENTIFY 30-YEAR PATTERN IN UNEXPLAINED ATMOSPHERIC EVENTS"

"Atmospheric events." No aliens, no autopsies, no witnesses, no sense that a government
is unraveling — even though the trigger for this ending already implies the player
assembled a coherent, damning case. The same softening shows up to varying degrees in
`wrong_story`, `incomplete_picture`, `ridiculed`, `nothing_changes`, and
`harvest_understood`.

**Your job:** rewrite the ending copy across all 12 endings in `app/engine/endings.ts` so
each one reads like an actual disclosure event proportional to what it took to trigger —
tense, world-altering, unmistakably about the reality of non-human contact and a
collapsing cover-up. Not vague euphemism standing in for the stakes.

## What "better" means here — calibration example

Before (`the_2026_warning`, current):

> The convergence data hits academic servers first. Physicists in three countries confirm
> the thirty-year cycle independently. 1947. 1977. 1996. The pattern is clean, the
> projection is specific: September 2026, plus or minus two months.
>
> Governments issue no statements. Private aerospace firms begin relocating satellite
> arrays. The Brazilian Air Force reclassifies seven archived directives without
> explanation.
>
> The public does not panic because the public does not understand logarithmic signal
> propagation. Those who do understand have gone very quiet.

This is calm, deflationary, and hides behind jargon. Compare the register you're aiming
for — the game's own `real_ending` narrative already gets closer:

> The dossier does not ask questions. It presents facts in a sequence that permits only
> one conclusion. International press picks it up within hours. The Brazilian government
> requests seventy-two hours before responding. They use all of them.
>
> The response, when it comes, is seven words: "The matter is under renewed
> investigation." Those seven words change everything.

Notice what makes that version land: specific institutional reactions (press, government
response time, a quoted line), stakes that compound rather than diffuse, and an ending
beat that names what changed, not just what was published. Apply that same discipline to
`the_2026_warning` and the other five weaker endings — keep the physics/thirty-year-cycle
premise, but let the consequence be a world reorganizing around confirmed non-human
contact, not a footnote in aerospace trade press.

**Guardrail — don't overcorrect into lurid or off-tone:** `AGENTS.md` documents the
game's house style: clinical detachment, bureaucratic document voice,
`[REDACTED]`/`[DATA EXPUNGED]` euphemism-as-horror, not jump-scares. "Groundbreaking"
means the *event* is undeniably alien disclosure and the world visibly reacts to it — it
does not mean the prose should turn pulpy, purple, or abandon the deadpan bureaucratic
register. The `real_ending` example above is deadpan *and* massive in consequence — that's
the target, not a tonal departure.

## Scope

**In scope:**
- `app/engine/endings.ts` → the `ENDINGS` record only: `title`, `subtitle`, `narrative`,
  `ufo74_final`, and every field under `aol` (headline, subheadline, body, imageAlt) for
  all 12 endings. Every ending gets reviewed and tightened for tonal consistency, even
  ones that already land reasonably well (`real_ending`, `government_scandal`,
  `prisoner_45_freed`) — the goal is a uniform "world just found out" register across the
  whole set, not just patching the worst offenders.
- Regenerating `game_story_files/endings.MD` afterward via
  `npx tsx scripts/gen-endings-doc.ts` (check the script's actual invocation command — it
  says "do not hand-edit, regenerate" at the top of the doc). Do not hand-edit
  `endings.MD` directly.

**Out of scope — do not touch unless you hit the specific case below:**
- `determineEnding()` priority order and `FILE_CATEGORIES` matching logic are off-limits
  for general redesign. The one exception: if, while reading trigger conditions, you find
  a clear mismatch — an ending firing on a technicality while a much more damning file
  the player also saved goes completely unacknowledged in the copy — you may make a
  narrowly-scoped logic tweak (e.g. an added threshold check) to fix that specific case.
  Do not restructure the priority system or rename/add ending IDs.
- `app/data/virtualFileSystem.ts`, `app/data/archiveFiles.ts`, or any in-game file content.
  Evidence file text is a separate concern from ending copy.
- Any UI/rendering code (`Terminal.tsx`, `Victory.tsx`, etc.) — you're only changing the
  data, not how it's displayed.

## Per-ending notes (use as a starting checklist, not a rigid spec)

- **`the_2026_warning`** — worst offender. Should read as a temporal/cyclical alien threat
  going fully public and governments visibly scrambling, not an "atmospheric events"
  science story.
- **`wrong_story`** — the joke is that the player exposed corruption but missed the alien
  story. Keep the irony, but the closing beat should sting harder: make explicit exactly
  how close the real story was and what specifically got buried, so the player feels the
  loss.
- **`incomplete_picture`** — currently reads as mild ("proves nothing"). If the player's
  scattered dossier still contains genuinely disturbing individual files, the copy should
  acknowledge that horror leaked through even though the narrative failed to cohere.
- **`ridiculed`** — leans into comedy/dismissal, which is probably right for a genuinely
  weak dossier — but double check the trigger conditions (default fallback) aren't also
  catching cases where the player saved some serious files that just didn't hit any
  threshold. If so, the tone should carry a thread of "they were so close."
- **`nothing_changes`** — already decent (the apathy-despite-proof angle works) but tighten
  so the proof itself is described with more weight before the apathy undercuts it.
- **`harvest_understood`** — good premise (colonization without arrival), push the
  consequence further — this is arguably the most cosmically unsettling ending in the set
  and currently undersells it with a mild "resource assessment" euphemism punchline.
- **`hackerkid_caught`**, **`secret_ending`**, **`ufo74_exposed`**, **`real_ending`**,
  **`government_scandal`**, **`prisoner_45_freed`** — review for tonal consistency with the
  rewritten endings above; tighten only where needed, these are closer to the target bar
  already.

## Constraints

- TypeScript strict mode — `ENDINGS` is typed as `Record<EndingId, Omit<GameEnding,
  'id'>>`; don't change the shape of `GameEnding`/`AolPresentation`.
- Keep the existing AOL-article format (dateline, wire-service style, quoted analyst/
  official reactions) and the `[UFO74]:` closing-line convention.
- `visitorCount` numbers currently signal how "big" each ending's news story is (12 for
  the honeypot trap, 847,291 for `real_ending`). If you change the narrative's implied
  scale, keep these numbers roughly consistent with the new copy's scale, or adjust them
  to match — don't leave a rewritten "the world reacts massively" narrative paired with a
  visitor count of 12.
- Don't touch the ending titles/subtitles' meaning-signature (e.g. `the_2026_warning`
  should still be about the 2026 window) — you're deepening consequence and specificity,
  not changing what each ending is about.

## Validation (run after edits, per AGENTS.md)

```bash
npm test
npm run typecheck
npm run lint
npm run validate-story
```

Then regenerate the audit doc and confirm it reflects your changes:

```bash
npx tsx scripts/gen-endings-doc.ts
```

## Deliverable

- Updated `app/engine/endings.ts`.
- Regenerated `game_story_files/endings.MD` (do not hand-edit).
- A short summary of what changed per ending and why, plus confirmation that all
  validation commands above passed.
