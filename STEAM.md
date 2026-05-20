# Steam Integration

This document describes the Steam-facing desktop integration for the Electron build.

## Overview

The game uses [steamworks.js](https://github.com/nicobrinkkemper/steamworks.js) for:

- **Achievements** - Sync local achievement unlocks to Steam
- **Cloud Saves** - Mirror save data into Steam Cloud when available
- **Rich Presence** - Reflect live investigation/detection state in the Steam friends list
- **Overlay** - Open Steam dialogs from the desktop build
- **Tray Status** - Mirror the same state in the desktop tray tooltip while the app is running

## App ID behavior

`electron/main.js` resolves the Steam App ID in this order:

1. `STEAM_APP_ID` environment variable
2. Development fallback: `480`
3. Generated release artifact: `electron/steam-app-id.generated.js`
4. Production fallback: **disable Steam features and continue launching**

`scripts/prepare-steam-app-id.mjs` creates the generated artifact from `STEAM_APP_ID` immediately before Electron packaging. The generated file is ignored by git but included by `electron-builder` because it lives under `electron/`.

That means local and PR packaged builds no longer crash when an App ID is missing. They simply run without Steam integration until `STEAM_APP_ID` is configured. Tagged `v*` release builds fail before packaging if the App ID is missing or if the tag does not match `package.json` version.

## Local testing

### Without Steam running

Steam integration is optional. The app continues to work locally and falls back to browser/local-storage behavior.

```bash
npm test -- electron/__tests__/
```

### With Steam running

1. Start Steam and sign in.
2. Optionally set `STEAM_APP_ID` to your real app ID. If you do nothing, development uses `480`.
3. Run:

```bash
npm run electron:dev
```

4. Confirm the console prints `Steam initialized successfully`.

Developer tools no longer open automatically in desktop dev mode. Set `VARGINHA_DEVTOOLS=1` or pass `--devtools` when you need them.

## Production packaging

Use the standard Electron packaging script:

```bash
npm run electron:build
```

That script points explicitly at `electron-builder.yml`, so local desktop builds use the same packaging config as CI. The Electron builder `beforeBuild` hook prepares the generated Steam App ID file immediately before packaging.

For a Steam-enabled packaged build:

1. Set `STEAM_APP_ID` locally, or configure the GitHub Actions `STEAM_APP_ID` secret before creating a `v*` release tag
2. Configure Steam achievements to match `electron/steam-achievements.js`
3. Enable Steam Cloud in Steamworks Partner
4. Upload store/achievement art in Steamworks Partner

## Update policy

When Steam initializes successfully, the Electron auto-updater is intentionally disabled. Steam should remain the source of truth for updates on Steam-distributed installs.

Non-Steam desktop builds can still use the GitHub-backed updater path.

## Achievement mapping

Game achievements are mapped to Steam achievements in `electron/steam-achievements.js`.
When the renderer starts, locally unlocked achievements are reconciled back to Steam once per session. This protects players who earned achievements while Steam was offline, unavailable, or not yet initialized.

| Game ID | Steam API Name | Description |
|---------|----------------|-------------|
| `speed_demon` | `SPEED_DEMON` | Complete the game in under 50 commands |
| `ghost` | `GHOST_PROTOCOL` | Win with detection level under 20% |
| `completionist` | `COMPLETIONIST` | Read every accessible file in the system |
| `first_blood` | `FIRST_BLOOD` | Save your first file to the dossier |
| `survivor` | `SURVIVOR` | Complete the game after reaching critical detection |
| `truth_seeker` | `TRUTH_SEEKER` | Save 10 files to the dossier |
| `doom_fan` | `IDDQD` | Activate god mode |
| `archivist` | `ARCHIVIST` | Read every file in a folder with 3+ files |
| `paranoid` | `PARANOID` | Check system status 10+ times |
| `night_owl` | `NIGHT_OWL` | Play for over 30 minutes |
| `liberator` | `LIBERATOR` | Release ALPHA from containment |
| `whistleblower` | `WHISTLEBLOWER` | Leak the dossier successfully |
| `linked` | `LINKED` | Connect to the alien consciousness |
| `revelator` | `REVELATOR` | Reach the ultimate ending with all modifiers |
| `ending_ridiculed` | `ENDING_RIDICULED` | Reach the ridiculed dossier ending |
| `ending_ufo74_exposed` | `ENDING_UFO74_EXPOSED` | Reveal UFO74's identity |
| `ending_the_2026_warning` | `ENDING_THE_2026_WARNING` | Publish the 2026 convergence warning |
| `ending_government_scandal` | `ENDING_GOVERNMENT_SCANDAL` | Expose the military cover-up |
| `ending_prisoner_45_freed` | `ENDING_PRISONER_45_FREED` | Reveal the containment of Prisoner 45 |
| `ending_harvest_understood` | `ENDING_HARVEST_UNDERSTOOD` | Expose the extraction model |
| `ending_nothing_changes` | `ENDING_NOTHING_CHANGES` | Prove the truth and watch the world ignore it |
| `ending_incomplete_picture` | `ENDING_INCOMPLETE_PICTURE` | Leak real evidence without a coherent case |
| `ending_wrong_story` | `ENDING_WRONG_STORY` | Expose the wrong scandal |
| `ending_hackerkid_caught` | `ENDING_HACKERKID_CAUGHT` | Trigger the honeypot ending |
| `ending_secret_ending` | `ENDING_SECRET_ENDING` | Assemble the Ferreira protocol |
| `ending_real_ending` | `ENDING_REAL_ENDING` | Assemble the undeniable dossier |

## Cloud saves

Steam Cloud files are prefixed with `terminal1996_`:

- `terminal1996_autosave`
- `terminal1996_save_<timestamp>`
- `terminal1996_achievements`

If Steam Cloud is unavailable, the game continues to use local storage.
When both local storage and Steam Cloud contain the same slot, the loader compares save timestamps and keeps the newer copy. If local storage is newer, it is pushed back to Steam Cloud in the background so another machine does not keep restoring stale progress.

## Local support diagnostics

Crash reporting is local-only (`uploadToServer: false`). The desktop build logs a local diagnostics block at startup with:

- App version, platform, packaged/dev state
- Steam App ID/initialization readiness
- `userData`, `logs`, and `crashDumps` paths

The same values are available to the renderer through `window.electronAPI.app.getSupportInfo()` for future support UI. No diagnostics are uploaded automatically.

## Release checklist

- Configure `STEAM_APP_ID`
- Confirm the release tag matches `package.json` version, for example `v1.0.0`
- Verify Steam achievements and hidden-achievement flags
- Verify Steam Cloud quota/settings
- Verify packaged desktop build starts with Steam running and reconciles a locally unlocked achievement
- Verify packaged desktop build still starts without Steam/App ID
- Verify Steam Cloud conflict handling: newer local save wins, newer cloud save wins
- Verify local diagnostics paths are printed and crash dumps remain local-only
- Upload store assets and capsule art in Steamworks Partner
- Smoke-test overlay, achievement unlocks, and a cloud save round-trip

### Steam sandbox matrix

Before release, test the packaged build in these states:

| Scenario | Expected result |
|----------|-----------------|
| Steam running with real App ID | Achievements, overlay, rich presence, and cloud saves work |
| Steam running with App ID 480 in dev | Integration smoke tests work without release secrets |
| Steam not running | Game starts, saves locally, and Steam calls fail gracefully |
| Steam Cloud disabled or quota exhausted | Local saves remain usable; errors stay non-fatal |

## Relevant files

- `electron/main.js` - Steam initialization, IPC, updater gating
- `electron/preload.js` - Renderer-safe Steam/Desktop bridge
- `electron/steam-achievements.js` - Achievement mapping and sync
- `electron/steam-cloud.js` - Cloud save/load
- `electron/steam-presence.js` - Rich Presence mapping
- `electron/tray.js` - Tray integration and status mirroring
- `electron-builder.yml` - Canonical desktop packaging config
