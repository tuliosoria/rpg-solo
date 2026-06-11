# Steam Release Runbook

This is the end-to-end checklist for shipping **Varginha: Terminal 1996** to
Steam. The code is release-ready; most of the remaining work is one-time setup
in the **Steamworks partner site** (which only you can do with the partner
account) plus configuring three GitHub secrets.

`STEAM.md` documents how the *runtime* integration behaves (achievements, cloud,
presence). This document is the *release pipeline* — how a build actually gets
onto Steam.

---

## Overview: who does what

| Piece | Status | Where |
|---|---|---|
| Cross-platform installers (.exe/.dmg/.AppImage/.deb) | ✅ Automated | `desktop-build.yml` |
| GitHub draft release on `v*` tag | ✅ Automated | `desktop-build.yml` |
| Steamworks runtime integration | ✅ In code | `electron/steam-*.js` |
| **Upload build to Steam depots (SteamPipe)** | ✅ Automated (this PR) | `steam-release.yml` + `npm run steam:deploy` |
| Steamworks partner app, store page, depots, achievements | ⬜ **Manual (you)** | Steamworks partner site |
| Set a build live for players | ⬜ **Manual (you)** | Steamworks → Builds |

---

## One-time setup

### 1. Steamworks partner account & app

1. Join the [Steamworks partner program](https://partner.steamgames.com/) and
   pay the one-time Steam Direct fee per app.
2. Create the application. Steam assigns a numeric **App ID** (e.g. `1234560`).
   This replaces the development placeholder `480` everywhere.

### 2. Create depots (must match the code's convention)

The deploy tooling uses the standard Steamworks depot offsets relative to your
App ID. Create three depots with these exact IDs:

| Platform | Depot ID | Content |
|---|---|---|
| Windows | `AppID + 1` | `dist/win-unpacked` |
| macOS | `AppID + 2` | `dist/mac` |
| Linux | `AppID + 3` | `dist/linux-unpacked` |

> Example: App ID `1234560` → depots `1234561` (win), `1234562` (mac),
> `1234563` (linux). This convention is enforced in `scripts/steamPipe.mjs` and
> the `depotNPath` mapping in `steam-release.yml`. If your assigned depot IDs
> differ, update both.

In each app's **Installation → General Installation** settings, add a launch
option pointing at the packaged executable per OS.

### 3. Recreate the 26 achievements

In **Steamworks → Stats & Achievements → Achievements**, create one achievement
per row below. The **API Name must match exactly** (the game unlocks them by
these names — see `electron/steam-achievements.js`). Upload locked/unlocked
icons and set hidden flags as desired.

```
SPEED_DEMON, GHOST_PROTOCOL, COMPLETIONIST, FIRST_BLOOD, SURVIVOR,
TRUTH_SEEKER, IDDQD, ARCHIVIST, PARANOID, NIGHT_OWL, LIBERATOR,
WHISTLEBLOWER, LINKED, REVELATOR, ENDING_RIDICULED, ENDING_UFO74_EXPOSED,
ENDING_THE_2026_WARNING, ENDING_GOVERNMENT_SCANDAL, ENDING_PRISONER_45_FREED,
ENDING_HARVEST_UNDERSTOOD, ENDING_NOTHING_CHANGES, ENDING_INCOMPLETE_PICTURE,
ENDING_WRONG_STORY, ENDING_HACKERKID_CAUGHT, ENDING_SECRET_ENDING,
ENDING_REAL_ENDING
```

(Descriptions and titles are in `STEAM.md`.)

### 4. Enable Steam Cloud

Under **Steam Cloud**, enable auto-cloud or quota-based cloud. The game writes
slots prefixed `terminal1996_`. A modest quota (a few MB) is plenty.

### 5. Store page

Fill in capsule art, screenshots, trailer, short/long description, tags, genre,
price, and release date. Reuse copy from `README.md` and `STEAM.md`. The store
page must pass Valve review before launch.

### 6. Create a Steam **build account** (not your personal login)

In **Users & Permissions**, create a dedicated account with only "Edit App
Metadata / Publish" + build upload rights. CI and local uploads use this
account so your personal credentials never touch the pipeline.

### 7. Configure GitHub secrets

Add these in **GitHub → Settings → Secrets and variables → Actions**:

| Secret | Value |
|---|---|
| `STEAM_APP_ID` | Your numeric App ID |
| `STEAM_USERNAME` | The build account name from step 6 |
| `STEAM_CONFIG_VDF` | base64 of a logged-in `steamcmd` `config.vdf` (see below) |

**Generating `STEAM_CONFIG_VDF`:**

```bash
# On a machine with steamcmd installed, log in once interactively with the
# build account and supply the Steam Guard code when prompted:
steamcmd +login <build_account> +quit

# Confirm it no longer prompts:
steamcmd +login <build_account> +quit   # should succeed with no code

# Base64-encode the resulting config.vdf and paste it into the secret.
# Linux:   base64 -w0 ~/.steam/steam/config/config.vdf
# macOS:   base64 -i ~/Library/Application\ Support/Steam/config/config.vdf
# Windows: certutil -encode "...\Steam\config\config.vdf" out.txt  (strip headers)
```

> `config.vdf` is sensitive — never commit it. Rotate it if it leaks or expires.
> If you prefer TOTP, the `game-ci/steam-deploy` action also supports a
> `STEAM_SHARED_SECRET` route; adjust `steam-release.yml` accordingly.

---

## Releasing a build

### Option A — automated, via a version tag (recommended)

```bash
# 1. Bump the version (must match the tag you push).
#    package.json version is the source of truth; the beforeBuild hook fails
#    the build if a v* tag does not match it.
# 2. Tag and push:
git tag v1.0.0
git push origin v1.0.0
```

This triggers `steam-release.yml`, which:

1. Skips entirely if the three secrets are absent (safe for forks).
2. Builds the unpacked app on Windows, macOS, and Linux with the App ID
   embedded.
3. Uploads all three depots to Steam under build description `v1.0.0`, set live
   on the **`prerelease`** branch (never the default branch automatically).

`desktop-build.yml` separately produces the downloadable installers + a GitHub
draft release for the same tag.

### Option B — automated, manual dispatch

GitHub → Actions → **Steam Release** → *Run workflow*. Choose the Steam branch
(or leave blank to upload without setting anything live).

### Option C — local upload (first upload / offline)

```bash
# Build all platforms locally (you can only build mac on macOS, etc.):
npm run electron:build:all

# Dry run first — generates VDFs and prints the steamcmd command, no upload:
STEAM_APP_ID=1234560 STEAM_BUILD_USER=mybuildacct \
  npm run steam:deploy:dry -- --desc v1.0.0 --branch beta

# Real upload (requires steamcmd on PATH and one prior interactive login):
STEAM_APP_ID=1234560 STEAM_BUILD_USER=mybuildacct \
  npm run steam:deploy -- --desc v1.0.0 --branch beta
```

Omit `--branch` to upload without setting live (promote it from Steamworks).

---

## Testing before you go live

1. **Local, outside Steam** — write the app id file next to a build and launch
   it to confirm Steam features initialise:
   ```bash
   npm run electron:build         # current platform
   STEAM_APP_ID=1234560 npm run steam:appid -- dist/win-unpacked
   # launch the exe with Steam running; watch for "Steam initialized successfully"
   ```
2. **On Steam, beta branch** — upload to `prerelease`/`beta` (Options B/C),
   install via the Steam client on that branch, then verify against the sandbox
   matrix in `STEAM.md`:
   - achievements unlock (and reconcile if earned offline),
   - cloud save round-trips between two machines (newer copy wins),
   - overlay opens, rich presence shows in the friends list,
   - the game still launches with Steam closed.
3. **Promote to default** — only after the above pass, set the build live on the
   default branch in **Steamworks → Builds**. That is the moment players get it.

---

## Pre-launch checklist

- [ ] App ID set; `480` placeholder no longer referenced for release
- [ ] Three secrets configured (`STEAM_APP_ID`, `STEAM_USERNAME`, `STEAM_CONFIG_VDF`)
- [ ] Depots created with the `+1/+2/+3` IDs and launch options set
- [ ] All 26 achievements created with exact API names + icons
- [ ] Steam Cloud enabled with quota
- [ ] Store page art/copy submitted and approved
- [ ] `package.json` version matches the release tag
- [ ] Beta-branch build passes the full `STEAM.md` sandbox matrix
- [ ] Build promoted to the default branch on launch day
