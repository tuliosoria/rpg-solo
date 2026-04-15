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
3. Production fallback: **disable Steam features and continue launching**

That means packaged builds no longer crash when an App ID is missing. They simply run without Steam integration until `STEAM_APP_ID` is configured.

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

## Production packaging

Use the standard Electron packaging script:

```bash
npm run electron:build
```

That script now points explicitly at `electron-builder.yml`, so local desktop builds use the same packaging config as CI.

For a Steam-enabled packaged build:

1. Set `STEAM_APP_ID`
2. Configure Steam achievements to match `electron/steam-achievements.js`
3. Enable Steam Cloud in Steamworks Partner
4. Upload store/achievement art in Steamworks Partner

## Update policy

When Steam initializes successfully, the Electron auto-updater is intentionally disabled. Steam should remain the source of truth for updates on Steam-distributed installs.

Non-Steam desktop builds can still use the GitHub-backed updater path.

## Achievement mapping

Game achievements are mapped to Steam achievements in `electron/steam-achievements.js`.

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
| `bookworm` | `BOOKWORM` | Bookmark 5+ files |
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

## Release checklist

- Configure `STEAM_APP_ID`
- Verify Steam achievements and hidden-achievement flags
- Verify Steam Cloud quota/settings
- Verify packaged desktop build starts with Steam running
- Verify packaged desktop build still starts without Steam/App ID
- Upload store assets and capsule art in Steamworks Partner
- Smoke-test overlay, achievement unlocks, and a cloud save round-trip

## Relevant files

- `electron/main.js` - Steam initialization, IPC, updater gating
- `electron/preload.js` - Renderer-safe Steam/Desktop bridge
- `electron/steam-achievements.js` - Achievement mapping and sync
- `electron/steam-cloud.js` - Cloud save/load
- `electron/steam-presence.js` - Rich Presence mapping
- `electron/tray.js` - Tray integration and status mirroring
- `electron-builder.yml` - Canonical desktop packaging config
