const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const fs = require('fs');

const isDev = process.env.NODE_ENV === 'development';

// Steam integration modules
const steamAchievements = require('./steam-achievements');
const steamCloud = require('./steam-cloud');

// Steam state
let steamClient = null;
let steamInitialized = false;

// Server reference for cleanup
let localServer = null;

// Steam App ID - Replace with your actual Steam App ID
// For development/testing, use 480 (Spacewar test app)
const STEAM_APP_ID = process.env.STEAM_APP_ID || '480';

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
    console.log('Steam initialization failed:', error.message);
    console.log('Running without Steam integration');
  }

  return false;
}

/**
 * Shuts down Steam gracefully.
 */
function shutdownSteam() {
  if (steamClient) {
    try {
      // steamworks.js doesn't require explicit shutdown,
      // but we clear our references
      steamClient = null;
      steamInitialized = false;
      console.log('Steam shutdown complete');
    } catch (error) {
      console.error('Error during Steam shutdown:', error);
    }
  }
}

function createWindow() {
  const mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    minWidth: 800,
    minHeight: 600,
    resizable: true,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      nodeIntegration: false,
    },
  });

  // Steam overlay is handled automatically by steamworks.js when the window has focus

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

  // Shutdown Steam before quitting
  shutdownSteam();

  // On macOS, apps typically stay active until explicitly quit
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('before-quit', () => {
  // Ensure Steam is shut down
  shutdownSteam();
});
