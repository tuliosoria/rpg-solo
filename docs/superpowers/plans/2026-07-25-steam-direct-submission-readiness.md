# Steam Direct Submission Readiness (Track A) Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Land the in-repo half of Steam Direct prep — commit ready-to-paste store-page content and add the Steam Direct calendar-gate timeline to the release runbook — so the owner's partner-site work is copy-paste and correctly sequenced.

**Architecture:** Documentation-only changes. Create one new doc (`docs/steam/store-page.md`) holding the drafted Steam store copy + asset spec, and amend `docs/STEAM_RELEASE.md` with a timing banner + timeline section. No application code, no tests, nothing deployable. All paths are under `docs/**`, which the Amplify/Azure deploy workflows ignore (`paths-ignore`), so pushing to `main` does **not** trigger a production deploy.

**Tech Stack:** Markdown only. Source of truth for the content is `docs/superpowers/specs/2026-07-25-steam-direct-submission-readiness-design.md` (§3 timing, §6 store content).

**Scope note:** Track B (Steamworks partner-site steps: pay fee, create App ID/depots/achievements, store page, review, promote) is owner-only and is NOT code — it stays as the checklist in the spec + runbook. Optional macOS signing/notarization is an explicit out-of-scope follow-up and is not part of this plan.

---

### Task 1: Create the store-page content doc

**Files:**
- Create: `docs/steam/store-page.md`

- [ ] **Step 1: Create the directory and file with the full content below**

Create `docs/steam/store-page.md` with exactly this content:

```markdown
# Steam Store Page Content — Varginha: Terminal 1996

Ready-to-paste copy for the Steamworks store page. Source: `PRODUCT.md`,
`README.md`, `DESIGN.md`. Owner edits to taste before publishing. See
`docs/STEAM_RELEASE.md` for where each field goes and the submission timeline.

## Name
Varginha: Terminal 1996

## Short description (≤300 characters)
January 1996. You've illegally accessed a Brazilian intelligence terminal. Read
classified files, assemble a dossier on what really fell over Varginha, and leak
it before detection ends your session. A clinical, paranoid, text-only horror
investigation. English / Português / Español.

## About This Game
*January 20, 1996. Varginha, Minas Gerais. Something fell from the sky — and the
official reports say nothing happened.*

You are not supposed to be here. You've broken into a legacy Brazilian
intelligence system and you have one session to reconstruct the truth before the
machine detects you, corrupts the record, or shuts you out for good.

**Investigate a real machine, not a menu.** Navigate a virtual filesystem with
period-authentic terminal commands — `ls`, `cd`, `open`, `search`. Read,
cross-reference, and redact your way through classified documents.

**Every action is a risk.** A detection meter climbs as you dig. The terminal's
composure degrades with it — bureaucratic, then defensive, then hostile, then
pleading. Move carefully or get caught.

**Assemble the dossier. Decide what to do with it.** Collect evidence, then
`leak` it — or don't. Your investigation determines which of many endings you
earn. The truth you can prove is not always the truth that changes anything.

**Horror through paperwork.** No jump scares. Dread delivered via euphemism,
`[REDACTED]` blocks, and the specific unease of reading something you were never
meant to see.

**Fully trilingual** — English, Brazilian Portuguese, and Spanish, with
Brazilian players treated as a first-class audience for a real local event.

Steam features on the desktop build: 26 achievements, Steam Cloud saves, rich
presence, and overlay support.

## Genres
Adventure, Indie, Simulation

## Tags (ordered, ~15)
Horror, Mystery, Investigation, Text-Based, Puzzle, Atmospheric, Sci-fi,
Singleplayer, Story Rich, Choices Matter, Multiple Endings, Retro, Dark,
Conspiracy, Short

## Supported languages
English, Portuguese-Brazil, Spanish — Interface + Subtitles (no voice-over).
CONFIRM which of the three ship at launch.

## Pricing
Owner decision. Comparables (Stories Untold, Her Story) sit in the low
single-digit to ~$10 USD tier for short narrative investigation games.

## Maturity / content survey (recommended answers)
Contains infrequent/mild violence and horror themes delivered as text; no gore,
no sexual content, no gambling. Themes: government conspiracy, abduction, mild
clinical body horror. Complete Valve's content survey and any regional (IARC)
questionnaire accordingly.

## Required graphical assets (exact Valve sizes)
| Asset | Size (px) | Required |
|---|---|---|
| Header capsule | 920 × 430 | Yes |
| Small capsule (logo legible) | 462 × 174 | Yes |
| Main capsule | 1232 × 706 | Yes |
| Vertical capsule | 1200 × 1600 | Yes |
| Page background | 1438 × 810 | Yes |
| Library capsule | 600 × 900 | Yes |
| Library header | 460 × 215 | Yes |
| Library hero | 3840 × 1240 | Yes |
| Library logo | transparent PNG | Yes |
| Screenshots | ≥ 1920 × 1080, at least 5 | Yes |
| Trailer | 1080p+ | Recommended |

Rules: no text/quotes on capsules beyond the game logotype; keep the logotype
legible (especially the small capsule). Repo art (`ending images/`,
`Bio Program Overview.png`, `public/icon.*`, in-game CRT screenshots) is raw
material, but capsules must be designed to the sizes above — they do not exist
yet and are the largest owner-side content task.
```

- [ ] **Step 2: Verify the file exists and key fields are present**

Run:
```bash
test -f docs/steam/store-page.md && grep -c -E "Short description|About This Game|Required graphical assets|1232 × 706" docs/steam/store-page.md
```
Expected: prints `4` (all four anchor strings present).

- [ ] **Step 3: Confirm the short description is within Steam's 300-char limit**

Run:
```bash
awk '/## Short description/{f=1;next} /^## /{f=0} f && NF' docs/steam/store-page.md | tr '\n' ' ' | sed 's/  */ /g;s/^ //;s/ $//' | wc -c
```
Expected: a number ≤ 300 (the drafted copy is ~290). If it exceeds 300, trim the short description and re-run.

- [ ] **Step 4: Commit**

```bash
git add docs/steam/store-page.md
git commit -m "docs: add ready-to-paste Steam store-page content

Store name, short/long descriptions, genres, tags, languages, maturity
guidance, and the exact required capsule/art sizes, drawn from the approved
readiness spec. Owner pastes into Steamworks.

Co-authored-by: Copilot <223556219+Copilot@users.noreply.github.com>"
```

---

### Task 2: Add the Steam Direct calendar-gate timeline to the runbook

**Files:**
- Modify: `docs/STEAM_RELEASE.md` (insert after line 10, before the first `---`)

- [ ] **Step 1: Insert the timeline banner + section**

In `docs/STEAM_RELEASE.md`, immediately after the line that ends
`onto Steam.` (currently line 10) and before the `---` that follows it, insert
this block (leave one blank line before and after it):

```markdown
> ⏱️ **Start ~30 days before your target launch date.** Beyond the technical
> pipeline, Steam Direct imposes calendar gates you cannot shortcut. Front-load
> the fee + onboarding on day 1.

## Timeline & calendar gates (Steam Direct)

Source: Valve onboarding docs (`partner.steamgames.com/doc/gettingstarted/onboarding`).
These are schedule gates, not code, and they set the earliest possible launch:

| Gate | Duration / rule | Notes |
|---|---|---|
| $100 app deposit fee | one-time, per product | Paying it starts the clocks below. |
| Tax + bank + identity verification | 2–7 business days | Third-party verified; may request more docs. Bank holder name must match your legal name. |
| New-account release wait | **30 days** from fee payment | You cannot release your first title before this elapses. |
| "Coming soon" page public window | **≥ 2 weeks** before release | Builds wishlists; runs in parallel with the 30-day wait. |
| Valve review (store page + build) | 1–5 business days | They run the game and check the store page before anything goes live. |

**Realistic critical path:** ~30 days from paying the fee to being able to press
Release, dominated by the 30-day new-account gate (with the 2-week coming-soon
window and tax verification running inside it). Do the fee, tax/bank onboarding,
and a public coming-soon page as early as possible; the technical upload is fast
by comparison.

See `docs/steam/store-page.md` for ready-to-paste store copy and the required
capsule/art sizes.
```

- [ ] **Step 2: Verify the insertion landed and the doc is intact**

Run:
```bash
grep -n "Timeline & calendar gates" docs/STEAM_RELEASE.md && grep -c "30 days" docs/STEAM_RELEASE.md && grep -n "^## Overview: who does what" docs/STEAM_RELEASE.md
```
Expected: the timeline heading is found; `30 days` count ≥ 1; the original
`## Overview: who does what` heading still exists (proves the insert didn't clobber existing content).

- [ ] **Step 3: Commit**

```bash
git add docs/STEAM_RELEASE.md
git commit -m "docs: surface Steam Direct calendar-gate timeline in release runbook

Add the fee/tax/30-day-wait/2-week-coming-soon/review gates so the launch date
accounts for the ~30-day minimum critical path, and cross-link store-page.md.

Co-authored-by: Copilot <223556219+Copilot@users.noreply.github.com>"
```

---

### Task 3: Push and confirm no production deploy

**Files:** none (git + CI verification only)

- [ ] **Step 1: Push to main**

```bash
git push origin main
```

- [ ] **Step 2: Confirm the changes are docs-only under `docs/`**

Run:
```bash
git diff --name-only 4c54b36..HEAD
```
Expected: only paths under `docs/` (the spec from the prior commit, plus
`docs/steam/store-page.md` and `docs/STEAM_RELEASE.md`). If any non-`docs/` path
appears, stop — this plan must not touch application code.

- [ ] **Step 3: Confirm the deploy workflows ignore docs-only pushes**

Run:
```bash
grep -n "paths-ignore" -A6 .github/workflows/amplify-deploy.yml
```
Expected: a `paths-ignore` list that includes `docs/**` (and/or `**.md`),
confirming this push does not deploy to game.terminalufo.com. (No new Amplify run
should appear for this commit.)

---

## Self-Review

**Spec coverage:**
- Spec §6 (store content) → Task 1 reproduces name, short/long description,
  genres, tags, languages, pricing note, maturity guidance, and the full asset
  size table. ✅
- Spec §3 (calendar gates) → Task 2 adds the timeline banner + table. ✅
- Spec §5 Track A step 2 (commit spec) → already done in prior commit `616539b`. ✅
- Spec §5 Track A step 4 (amend runbook) → Task 2. ✅
- Spec §5 Track A step 3 (commit store copy) → Task 1. ✅
- Spec §7 optional mac signing → explicitly out of scope (stated in header). ✅
- Track B (partner-site) → not code; remains in spec/runbook checklist. ✅

**Placeholder scan:** The doc content contains two deliberate owner-decision
markers ("CONFIRM which of the three ship at launch", pricing = owner decision).
These are genuine external decisions, not plan placeholders — the *plan* steps
themselves are all concrete. No TBD/TODO steps. ✅

**Type consistency:** N/A (docs only). File paths (`docs/steam/store-page.md`,
`docs/STEAM_RELEASE.md`) and the anchor strings used in the verification greps
match the content written in the same tasks. Asset sizes match spec §6. ✅
