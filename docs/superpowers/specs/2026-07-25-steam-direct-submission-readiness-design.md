# Steam Direct Submission Readiness — Design

**Date:** 2026-07-25
**Game:** Varginha: Terminal 1996 (`varginha-terminal-1996` v1.0.0)
**Author:** brainstorming session (autonomous; awaiting user review)

---

## 1. Goal

Get **Varginha: Terminal 1996** from "code is release-ready" to "submitted and
approvable on Steam via Steam Direct." This spec is a *readiness audit + a
preparation plan*, not a from-scratch build: the runtime Steam integration and
the upload pipeline already exist. The output separates work that lives **in the
repo** (which this session can do/verify) from work that happens **only in the
Steamworks partner site** (which requires the owner's account, the $100 fee, and
legal/banking identity — nobody else can do it).

Success = every in-repo prerequisite is verified green, the store-page content is
drafted and committed, and the owner has an ordered, timing-aware checklist so
the 30-day and 2-week Steam waiting periods don't ambush the launch date.

---

## 2. Current state — audited this session (evidence)

| Area | Status | Evidence |
|---|---|---|
| Electron desktop app | ✅ Exists | `electron/main.js`, `electron-builder.yml` |
| Steamworks runtime (achievements, cloud, presence, overlay, tray) | ✅ In code | `electron/steam-*.js`, 26 achievements in `steam-achievements.js` |
| Electron/Steam unit tests | ✅ **142 passed** | `node scripts/run-vitest.mjs run electron/__tests__/` |
| Desktop packaging works | ✅ **Verified** | `npm run electron:build` produced `dist/…-mac-arm64.dmg` + `…-mac-x64.dmg` |
| SteamPipe upload pipeline | ✅ Automated | `scripts/steamPipe.mjs`, `steam:deploy`, `.github/workflows/steam-release.yml` |
| Cross-platform installers + GitHub release on `v*` tag | ✅ Automated | `.github/workflows/desktop-build.yml` |
| Release runbook | ✅ Exists | `docs/STEAM_RELEASE.md`, `STEAM.md` |
| App ID | ⬜ Not created | placeholder `480` used until a real App ID exists |
| macOS code signing / notarization | ⚠️ **Ad-hoc only** | build log: "falling back to ad-hoc signature", "skipped macOS notarization" |
| Business onboarding (fee, tax, bank, identity) | ⬜ Owner-only | Steamworks partner site |
| Store page (art, copy, tags, rating, price) | ⬜ Not started | Steamworks partner site |

**Net finding:** the *technical* pipeline is genuinely done and now
**independently verified**. The remaining work is 90% Steamworks-partner-site and
content, plus two optional repo hardening items (signing, timing docs).

---

## 3. What the existing runbook under-emphasizes: Steam Direct timing

Pulled from Valve's current onboarding docs
(`partner.steamgames.com/doc/gettingstarted/onboarding`). These are **calendar
gates**, not code, and they gate the launch date:

1. **$100 USD app deposit fee** per product (recoupable after $1,000 in sales).
2. **Tax + bank + identity verification:** verified by a third party,
   **2–7 business days**; may request extra documents. Bank account holder name
   must match the legal name provided.
3. **30-day waiting period** between paying the app fee and being allowed to
   **release your first title**. One-time-ish gate for new accounts.
4. **"Coming soon" page must be public for at least 2 weeks** before release
   (builds wishlists; also forces you to rehearse the store presentation).
5. **Valve review, 1–5 business days:** they run the game and check the store
   page before either the store page *or* the build can go live.

**Implication:** from "paid the fee" to "can press Release" is realistically
**~30 days minimum**, dominated by the 30-day new-account gate running in
parallel with the 2-week coming-soon window and tax verification. This must be
front-loaded. `docs/STEAM_RELEASE.md` today reads as if the only blocker is
technical; it should call out these calendar gates.

---

## 4. Approaches considered

**A. Readiness audit + prep spec + drafted store content (RECOMMENDED).**
Verify the repo prerequisites (done: tests + packaging), draft the store-page
content as committed repo artifacts, surface the Steam Direct timing gates, and
hand the owner an ordered checklist. Highest value given the owner is the only
one who can touch the partner site. Low risk, nothing deploys.

**B. Repo-only hardening.** Add macOS signing/notarization, tighten CI, expand
the runbook — but skip store content. Rejected as primary: signing is optional
for Steam (Steam wraps distribution/trust), and it ignores the actual critical
path (partner-site setup + store page + calendar gates).

**C. "Do the submission."** Not possible from here — it requires the owner's
authenticated partner account, the fee payment, and legal identity. Only the
owner can perform it. We can only prepare and de-risk it.

Chosen: **A**, with the two cheap repo items from B folded in as an optional
follow-up track.

---

## 5. Plan — two tracks

### Track A — In-repo (this session can do / verify; nothing auto-deploys)

Docs commits are paths-ignored by the Amplify/Azure deploy workflows, so all of
this is safe.

1. ✅ **Verify prerequisites** — done: 142 Steam/electron tests pass; macOS DMGs
   package successfully; `dist`/`out` are gitignored; version is `1.0.0`.
2. **Commit this spec.**
3. **Draft & commit store-page content** to `docs/steam/store-page.md` (see §6)
   so the owner copy-pastes into Steamworks instead of writing from scratch.
4. **Amend `docs/STEAM_RELEASE.md`** with the §3 calendar-gate timeline and a
   "start these ~30 days before target launch" banner. *(Proposed; do in the
   implementation plan, not in this brainstorm.)*
5. *(Optional hardening, separate follow-up):* configure macOS
   signing/notarization (`CSC_LINK`/`CSC_KEY_PASSWORD` + `notarize`) so the
   non-Steam GitHub-released DMGs aren't Gatekeeper-blocked. **Not required for
   Steam itself.**

### Track B — Steamworks partner site (owner-only; ordered, with timing)

Front-load the calendar gates first:

1. **Join Steamworks, pay the $100 fee, sign NDA + Distribution Agreement.**
   *(starts the 30-day clock)*
2. **Complete tax + bank + identity onboarding immediately.** *(2–7 day
   verification — do it the same day as step 1)*
3. **Create the app → receive numeric App ID.** Replace placeholder `480`.
4. **Create 3 depots** `AppID+1` (win) / `+2` (mac) / `+3` (linux) — the exact
   convention enforced in `scripts/steamPipe.mjs` and `steam-release.yml`. Set
   per-OS launch options.
5. **Recreate the 26 achievements** with **exact API names** from
   `electron/steam-achievements.js` / `STEAM.md`; upload icons; set hidden flags.
6. **Enable Steam Cloud** (few-MB quota; slots prefixed `terminal1996_`).
7. **Create a dedicated build account** (Users & Permissions) — not the personal
   login — with publish + build-upload rights.
8. **Configure 3 GitHub secrets:** `STEAM_APP_ID`, `STEAM_USERNAME`,
   `STEAM_CONFIG_VDF` (base64 of a logged-in `steamcmd config.vdf`).
9. **Build the store page** using `docs/steam/store-page.md` (§6): capsules,
   screenshots, trailer, descriptions, tags, genre, price, maturity survey.
10. **Publish the "coming soon" page** → **2-week minimum public window.**
11. **Upload a build:** tag `v1.0.0` (must match `package.json`) → `steam-release.yml`
    uploads to the `prerelease` branch. Or `npm run steam:deploy` locally.
12. **Test on the beta branch** against the `STEAM.md` sandbox matrix
    (achievements reconcile, cloud round-trips, overlay, presence, launches with
    Steam closed).
13. **Submit store page + build for Valve review** (1–5 days).
14. **After 30-day gate + review pass + 2-week coming-soon all clear → promote
    the build to the default branch = launch.**

---

## 6. Store-page content package (draft — to be committed to `docs/steam/store-page.md`)

Drafted from `README.md`, `PRODUCT.md`, `DESIGN.md`. Owner edits to taste.

**Name:** Varginha: Terminal 1996

**Short description (≤300 chars):**
> January 1996. You've illegally accessed a Brazilian intelligence terminal.
> Read classified files, assemble a dossier on what really fell over Varginha,
> and leak it before detection ends your session. A clinical, paranoid,
> text-only horror investigation. English / Português / Español.

**About This Game (long):**
> *January 20, 1996. Varginha, Minas Gerais. Something fell from the sky — and
> the official reports say nothing happened.*
>
> You are not supposed to be here. You've broken into a legacy Brazilian
> intelligence system and you have one session to reconstruct the truth before
> the machine detects you, corrupts the record, or shuts you out for good.
>
> **Investigate a real machine, not a menu.** Navigate a virtual filesystem with
> period-authentic terminal commands — `ls`, `cd`, `open`, `search`. Read,
> cross-reference, and redact your way through classified documents.
>
> **Every action is a risk.** A detection meter climbs as you dig. The terminal's
> composure degrades with it — bureaucratic, then defensive, then hostile, then
> pleading. Move carefully or get caught.
>
> **Assemble the dossier. Decide what to do with it.** Collect evidence, then
> `leak` it — or don't. Your investigation determines which of many endings you
> earn. The truth you can prove is not always the truth that changes anything.
>
> **Horror through paperwork.** No jump scares. Dread delivered via euphemism,
> `[REDACTED]` blocks, and the specific unease of reading something you were
> never meant to see.
>
> **Fully trilingual** — English, Brazilian Portuguese, and Spanish, with
> Brazilian players treated as a first-class audience for a real local event.
>
> Steam features on the desktop build: 26 achievements, Steam Cloud saves, rich
> presence, and overlay support.

**Genres:** Adventure, Indie, Simulation
**Player-facing tags (order matters, ~15):** Horror, Mystery, Investigation,
Text-Based, Puzzle, Atmospheric, Sci-fi, Singleplayer, Story Rich, Choices
Matter, Multiple Endings, Retro, Dark, Conspiracy, Short.

**Supported languages:** English, Portuguese-Brazil, Spanish — Interface +
Subtitles (no VO). *(Confirm which of the three ship at launch.)*

**Pricing:** to be set by owner (comparables: *Stories Untold*, *Her Story* —
short narrative investigation, typically low single-digit to ~$10 USD tier).

**Maturity / content survey (recommended answers):** Contains **infrequent/mild
violence and horror themes, no gore, no sexual content, no gambling**. Themes:
government conspiracy, abduction, mild body horror via clinical text. Likely a
"Mature 17+" self-rating is unnecessary; a moderate content descriptor
(occasional violent/frightening references, all textual) is accurate. Owner
completes Valve's content survey and any regional (IARC) questionnaire.

**Required graphical assets (exact Valve sizes):**

| Asset | Size (px) | Required |
|---|---|---|
| Header capsule | 920 × 430 | ✅ |
| Small capsule (logo legible) | 462 × 174 | ✅ |
| Main capsule | 1232 × 706 | ✅ |
| Vertical capsule | 1200 × 1600 | ✅ |
| Page background | 1438 × 810 | ✅ |
| Library capsule | 600 × 900 | ✅ |
| Library header | 460 × 215 | ✅ |
| Library hero | 3840 × 1240 | ✅ |
| Library logo | transparent PNG | ✅ |
| Screenshots | ≥ 1920 × 1080, **at least 5** | ✅ |
| Trailer | 1080p+ | strongly recommended |

Rules: no extra text/quotes on capsules beyond the game logotype; logotype must
be legible (especially small capsule). Existing repo art
(`ending images/`, `Bio Program Overview.png`, `public/icon.*`, CRT
screenshots) is raw material but capsules must be **designed to the sizes above**
— they are not yet created. This is the single biggest owner-side content task.

---

## 7. Out of scope / follow-ups

- macOS Developer-ID signing + notarization (optional for Steam; needed only for
  smooth Gatekeeper on the GitHub-released DMGs).
- Steam Deck "Playable/Verified" review (post-launch; a keyboard-driven text
  game may need a controller/virtual-keyboard pass).
- Localizing the *store page* into PT-BR/ES (the game is trilingual; the store
  page can be too — nice-to-have).
- Trailer production.

---

## 8. Verification performed this session

- `node scripts/run-vitest.mjs run electron/__tests__/` → **142 passed**.
- `npm run electron:build` → `dist/Varginha Terminal 1996-1.0.0-mac-arm64.dmg`
  and `…-mac-x64.dmg` produced (ad-hoc signed, un-notarized — expected without a
  Developer ID).
- Confirmed `dist/` and `out/` are gitignored; working tree clean;
  `package.json` version = `1.0.0` (matches the `v1.0.0` tag the pipeline
  expects).
- Steam Direct timing gates confirmed against Valve's live onboarding docs.

---

## 9. Next step

On approval, invoke **writing-plans** to turn Track A into an implementation plan
(commit this spec; create `docs/steam/store-page.md`; amend `docs/STEAM_RELEASE.md`
with the calendar-gate timeline). Track B is the owner's partner-site checklist
and is not code.
