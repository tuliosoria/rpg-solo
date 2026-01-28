# Steam Integration

This document describes how the Steam integration works in the Electron version of the game.

## Overview

The game uses [steamworks.js](https://github.com/nicobrinkkemper/steamworks.js) to integrate with Steam for:

- **Achievements**: Sync game achievements to Steam
- **Cloud Saves**: Save/load game data to Steam Cloud
- **Overlay**: Access Steam overlay from within the game

## Requirements

### For Development

1. **Steam Client**: Steam must be running on your machine
2. **steam_appid.txt**: Create a file named `steam_appid.txt` in the project root containing your Steam App ID (or `480` for testing with Spacewar)

### For Production

1. Set the `STEAM_APP_ID` environment variable or update the default in `electron/main.js`
2. Configure achievements in Steamworks Partner dashboard to match the mapping in `electron/steam-achievements.js`
3. Enable Steam Cloud in Steamworks Partner dashboard

## Testing Locally

### Without Steam Running

The game gracefully degrades when Steam is not available:

```bash
# Run tests (mocks Steam APIs)
npm test -- electron/__tests__/
```

### With Steam Running

1. Create `steam_appid.txt` in project root:
   ```
   480
   ```
   (Use `480` for Spacewar test app, or your actual App ID)

2. Start Steam and log in

3. Run the Electron app:
   ```bash
   npm run electron:dev
   ```

4. Check console for "Steam initialized successfully"

## Steam App ID Configuration

The Steam App ID can be configured in several ways (in order of precedence):

1. **Environment variable**: `STEAM_APP_ID=123456 npm run electron:dev`
2. **Default in code**: Edit `STEAM_APP_ID` constant in `electron/main.js`
3. **steam_appid.txt**: File in project root (for development only)

For production builds, always use the environment variable or update the code.

## Achievement Mapping

Game achievements are mapped to Steam achievements in `electron/steam-achievements.js`:

| Game ID | Steam API Name | Description |
|---------|---------------|-------------|
| `speed_demon` | `SPEED_DEMON` | Complete the game in under 50 commands |
| `ghost` | `GHOST_PROTOCOL` | Win with detection level under 20% |
| `completionist` | `COMPLETIONIST` | Read every accessible file in the system |
| `pacifist` | `PACIFIST` | Never trigger a warning or alert |
| `curious` | `CURIOUS_MIND` | Find all easter eggs |
| `first_blood` | `FIRST_BLOOD` | Discover your first evidence |
| `hacker` | `ELITE_HACKER` | Decrypt 5 encrypted files |
| `survivor` | `SURVIVOR` | Complete the game after reaching critical detection |
| `mathematician` | `MATHEMATICIAN` | Solve all equations on first try |
| `truth_seeker` | `TRUTH_SEEKER` | Uncover all 5 truth categories |
| `doom_fan` | `IDDQD` | Activate god mode (secret) |
| `persistent` | `PERSISTENT` | Continue playing after a game over |
| `archivist` | `ARCHIVIST` | Read every file in a folder with 3+ files (secret) |
| `paranoid` | `PARANOID` | Check system status 10+ times (secret) |
| `bookworm` | `BOOKWORM` | Bookmark 5+ files (secret) |
| `night_owl` | `NIGHT_OWL` | Play for over 30 minutes (secret) |

### Setting Up Achievements in Steamworks

1. Go to Steamworks Partner > Your App > Stats & Achievements
2. Create achievements matching the "Steam API Name" column above
3. For secret achievements, check "Hidden" option
4. Upload achievement icons (64x64 pixels recommended)

## Cloud Saves

### File Naming

Cloud save files are prefixed with `terminal1996_` to avoid conflicts:

- `terminal1996_autosave` - Auto-save data
- `terminal1996_save_<timestamp>` - Manual saves
- `terminal1996_achievements` - Achievement sync data

### Quota

Steam Cloud has a default quota of 100MB per game. Check quota usage:

```javascript
const quota = await window.electronAPI.steamCloud.getQuota();
console.log(`Used: ${quota.totalBytes - quota.availableBytes} / ${quota.totalBytes}`);
```

## API Reference

### From Renderer Process (via preload)

```javascript
// Check if Steam is available
const isAvailable = await window.electronAPI.steam.isAvailable();

// Get player name
const name = await window.electronAPI.steam.getPlayerName();

// Unlock achievement
const result = await window.electronAPI.steamAchievements.unlock('speed_demon');
// Returns: { success: true } or { success: false, error: '...' }

// Check achievement status
const status = await window.electronAPI.steamAchievements.isUnlocked('ghost');
// Returns: { success: true, unlocked: true/false }

// Save to cloud
const saveResult = await window.electronAPI.steamCloud.save('savegame', jsonString);
// Returns: { success: true, filename: 'terminal1996_savegame' }

// Load from cloud
const loadResult = await window.electronAPI.steamCloud.load('savegame');
// Returns: { success: true, data: '...' } or { success: false, error: '...' }

// Open Steam overlay
await window.electronAPI.steamOverlay.activate('achievements');
// Valid dialogs: 'friends', 'community', 'players', 'settings', 
//                'officialgamegroup', 'stats', 'achievements'
```

## Graceful Degradation

The integration is designed to work even when Steam is unavailable:

1. **Steam not running**: All Steam API calls return `{ success: false, error: 'Steam not initialized' }`
2. **Cloud disabled**: Cloud operations fail gracefully, game uses localStorage fallback
3. **Network issues**: Operations that fail return appropriate error messages

Always check `success` before using results:

```javascript
const result = await window.electronAPI.steamAchievements.unlock('speed_demon');
if (!result.success) {
  console.log('Steam achievement sync failed:', result.error);
  // Achievement is still saved locally
}
```

## Troubleshooting

### "Steam not initialized"

- Ensure Steam is running
- Check that `steam_appid.txt` exists with valid App ID
- Verify the app isn't already running in another process

### Achievements not syncing

- Verify achievement names match Steamworks dashboard exactly
- Check that achievements are published (not draft) in Steamworks
- Ensure user owns the game (or use test App ID 480)

### Cloud saves not working

- Check Steam Cloud is enabled in Steam Settings > Cloud
- Verify cloud is enabled for this game in Steamworks dashboard
- Check quota hasn't been exceeded

## Files

- `electron/main.js` - Steam initialization and IPC handlers
- `electron/preload.js` - Steam APIs exposed to renderer
- `electron/steam-achievements.js` - Achievement mapping and sync
- `electron/steam-cloud.js` - Cloud save/load functionality
- `electron/__tests__/` - Test files for Steam integration
