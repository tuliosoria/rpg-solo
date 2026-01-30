const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const fs = require('fs');

const isDev = process.env.NODE_ENV === 'development';

// Steam integration modules
const steamAchievements = require('./steam-achievements');
const steamCloud = require('./steam-cloud');
const steamPresence = require('./steam-presence');

// Window and tray modules
const windowState = require('./window-state');
const tray = require('./tray');

// Steam state
let steamClient = null;
let steamInitialized = false;

// Server reference for cleanup
let localServer = null;

// Main window reference
let mainWindow = null;

// Steam App ID - Replace with your actual Steam App ID
// For development/testing, use 480 (Spacewar test app)
const STEAM_APP_ID = process.env.STEAM_APP_ID || '480';

// ============================================================
// Electron command-line optimizations for Steam/gaming
// ============================================================
app.commandLine.appendSwitch('--in-process-gpu'); // Better Steam overlay rendering
app.commandLine.appendSwitch('disable-renderer-backgrounding'); // Consistent game loop
app.commandLine.appendSwitch('disable-background-timer-throttling'); // Prevent timer throttling

// Mark app as not quitting (for tray minimize)
app.isQuitting = false;

/**
 * Initializes Steamworks SDK.
 * Must be called before creating the window.
 * @returns {boolean} True if Steam was initialized successfully
 */
function initializeSteam() {
  try {
    // steamworks.js uses dynamic require for native bindings
    const steamworks = require('steamworks.js');

    // Try to initialize with our app ID
    steamClient = steamworks.init(parseInt(STEAM_APP_ID, 10));

    if (steamClient) {
      steamInitialized = true;
      console.log('Steam initialized successfully');
      console.log('Steam App ID:', STEAM_APP_ID);

      // Initialize sub-modules with the client
      steamAchievements.initialize(steamClient);
      steamCloud.initialize(steamClient);
      steamPresence.initialize(steamClient);

      // Log some Steam info for debugging
      try {
        const localPlayer = steamClient.localplayer;
        if (localPlayer) {
          console.log('Steam user:', localPlayer.getName());
        }
      } catch (e) {
        if (isDev) {
          console.debug('Could not get Steam user info:', e.message);
        }
      }

      return true;
    }
  } catch (error) {
    console.error('Steam initialization failed:', error.message);
    console.log('Running without Steam integration');

    // Handle specific Steam initialization failures
    if (error.message.includes('SteamAPI_Init')) {
      console.log('Hint: Ensure Steam client is running');
    } else if (error.message.includes('steamworks.js')) {
      console.log('Hint: Native module may need rebuilding');
    }
  }

  return false;
}

/**
 * Shuts down Steam gracefully.
 */
function shutdownSteam() {
  if (steamClient) {
    try {
      steamPresence.clearPresence();
      steamClient = null;
      steamInitialized = false;
      console.log('Steam shutdown complete');
    } catch (error) {
      console.error('Error during Steam shutdown:', error);
    }
  }
}

function createWindow() {
  // Load saved window state
  const savedState = windowState.loadState();

  mainWindow = new BrowserWindow({
    width: savedState.width,
    height: savedState.height,
    x: savedState.x,
    y: savedState.y,
    minWidth: 800,
    minHeight: 600,
    resizable: true,
    show: false, // Show after ready-to-show for smoother startup
    backgroundColor: '#000000', // Reduce flash on startup
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      nodeIntegration: false,
      sandbox: true, // Enhanced security
      backgroundThrottling: false, // Consistent game loop
      v8CacheOptions: 'bypassHeatCheck', // Faster startup
    },
  });

  // Set up window state persistence
  const stateManager = windowState.createWindowStateManager(mainWindow);

  // Show window when ready and apply maximized state
  mainWindow.once('ready-to-show', () => {
    mainWindow.show();
    stateManager.applyMaximized();
  });

  // Initialize system tray
  tray.initialize(mainWindow);

  if (isDev) {
    // Development: load from Next.js dev server
    mainWindow.loadURL('http://localhost:3000');
    mainWindow.webContents.openDevTools();
  } else {
    // Production: load from local server
    const http = require('http');
    const outDir = path.join(__dirname, '../out');
    
    const mimeTypes = {
      '.html': 'text/html',
      '.js': 'application/javascript',
      '.mjs': 'application/javascript',
      '.css': 'text/css',
      '.json': 'application/json',
      '.png': 'image/png',
      '.jpg': 'image/jpeg',
      '.jpeg': 'image/jpeg',
      '.gif': 'image/gif',
      '.svg': 'image/svg+xml',
      '.ico': 'image/x-icon',
      '.webp': 'image/webp',
      '.wav': 'audio/wav',
      '.mp3': 'audio/mpeg',
      '.ogg': 'audio/ogg',
      '.mp4': 'video/mp4',
      '.webm': 'video/webm',
      '.woff': 'font/woff',
      '.woff2': 'font/woff2',
      '.ttf': 'font/ttf',
      '.eot': 'application/vnd.ms-fontobject',
      '.otf': 'font/otf',
      '.txt': 'text/plain',
      '.xml': 'application/xml',
      '.map': 'application/json',
    };

    localServer = http.createServer((req, res) => {
      // Sanitize URL to prevent path traversal attacks
      const sanitizedUrl = path.normalize(req.url).replace(/^(\.\.[\/\\])+/, '');
      let filePath = path.join(outDir, sanitizedUrl === '/' || sanitizedUrl === '\\' ? 'index.html' : sanitizedUrl);
      
      // Ensure the resolved path is within outDir
      if (!filePath.startsWith(outDir)) {
        res.writeHead(403);
        res.end('Forbidden');
        return;
      }
      
      // Handle paths without extensions (try .html)
      if (!path.extname(filePath) && !fs.existsSync(filePath)) {
        filePath += '.html';
      }
      
      const ext = path.extname(filePath).toLowerCase();
      const contentType = mimeTypes[ext] || 'application/octet-stream';

      fs.readFile(filePath, (err, content) => {
        if (err) {
          if (err.code === 'ENOENT') {
            res.writeHead(404);
            res.end('File not found');
          } else {
            res.writeHead(500);
            res.end('Server error');
          }
        } else {
          res.writeHead(200, { 'Content-Type': contentType });
          res.end(content);
        }
      });
    });

    localServer.listen(0, '127.0.0.1', () => {
      const port = localServer.address().port;
      mainWindow.loadURL(`http://127.0.0.1:${port}`);
    });
  }

  return mainWindow;
}

// ============================================================
// IPC Handlers for Steam functionality
// ============================================================

// Steam status
ipcMain.handle('steam:isAvailable', () => {
  return steamInitialized;
});

ipcMain.handle('steam:getPlayerName', () => {
  if (!steamInitialized || !steamClient) {
    return null;
  }
  try {
    const localPlayer = steamClient.localplayer;
    return localPlayer ? localPlayer.getName() : null;
  } catch {
    return null;
  }
});

// Achievement handlers
ipcMain.handle('steam:achievements:unlock', (event, achievementId) => {
  return steamAchievements.unlock(achievementId);
});

ipcMain.handle('steam:achievements:isUnlocked', (event, achievementId) => {
  return steamAchievements.isUnlocked(achievementId);
});

// Only allow clearing achievements in development mode (for testing)
ipcMain.handle('steam:achievements:clear', (event, achievementId) => {
  if (!isDev) {
    return { success: false, error: 'Achievement clearing is only available in development mode' };
  }
  return steamAchievements.clear(achievementId);
});

ipcMain.handle('steam:achievements:getAllMapped', () => {
  return steamAchievements.getAllMappedAchievements();
});

// Cloud save handlers
ipcMain.handle('steam:cloud:isAvailable', () => {
  return steamCloud.isAvailable();
});

ipcMain.handle('steam:cloud:save', (event, key, data) => {
  return steamCloud.save(key, data);
});

ipcMain.handle('steam:cloud:load', (event, key) => {
  return steamCloud.load(key);
});

ipcMain.handle('steam:cloud:delete', (event, key) => {
  return steamCloud.deleteFile(key);
});

ipcMain.handle('steam:cloud:list', () => {
  return steamCloud.listFiles();
});

ipcMain.handle('steam:cloud:getQuota', () => {
  return steamCloud.getQuota();
});

// Overlay handler
ipcMain.handle('steam:overlay:activate', (event, dialog) => {
  if (!steamInitialized || !steamClient) {
    return { success: false, error: 'Steam not initialized' };
  }
  try {
    const overlay = steamClient.overlay;
    if (overlay) {
      // Valid dialog types: 'friends', 'community', 'players', 'settings',
      // 'officialgamegroup', 'stats', 'achievements'
      overlay.activateDialog(dialog || 'achievements');
      return { success: true };
    }
    return { success: false, error: 'Overlay not available' };
  } catch (error) {
    return { success: false, error: error.message };
  }
});

// ============================================================
// IPC Handlers for Rich Presence
// ============================================================

ipcMain.handle('steam:presence:set', (event, status) => {
  return steamPresence.setPresence(status);
});

ipcMain.handle('steam:presence:update', (event, gameState) => {
  // Update both Steam presence and tray status
  steamPresence.updateFromGameState(gameState);
  tray.updateFromGameState(gameState);
  return { success: true };
});

ipcMain.handle('steam:presence:clear', () => {
  return steamPresence.clearPresence();
});

ipcMain.handle('steam:presence:getStates', () => {
  return steamPresence.getPresenceStates();
});

// ============================================================
// IPC Handlers for Tray
// ============================================================

ipcMain.handle('tray:setMinimizeToTray', (event, enabled) => {
  tray.setMinimizeToTray(enabled);
  return { success: true };
});

ipcMain.handle('tray:isMinimizeToTrayEnabled', () => {
  return tray.isMinimizeToTrayEnabled();
});

ipcMain.handle('tray:updateStatus', (event, status) => {
  tray.updateTooltip(status);
  return { success: true };
});

// ============================================================
// App lifecycle
// ============================================================

app.whenReady().then(() => {
  // Initialize Steam before creating the window
  initializeSteam();

  createWindow();

  app.on('activate', () => {
    // On macOS, re-create window when dock icon is clicked and no windows are open
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

app.on('window-all-closed', () => {
  // Close local server if running
  if (localServer) {
    localServer.close();
    localServer = null;
  }

  // Destroy tray icon
  tray.destroy();

  // Shutdown Steam before quitting
  shutdownSteam();

  // On macOS, apps typically stay active until explicitly quit
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('before-quit', () => {
  // Mark app as quitting so tray doesn't prevent close
  app.isQuitting = true;

  // Ensure Steam is shut down
  shutdownSteam();
});
