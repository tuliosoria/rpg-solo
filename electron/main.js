const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const fs = require('fs');

const isDev = process.env.NODE_ENV === 'development';

// ============================================================
// STARTUP OPTIMIZATION: Memory management flags
// ============================================================
// Configure V8 GC for gaming workloads
app.commandLine.appendSwitch('js-flags', '--max-old-space-size=512 --expose-gc');
app.commandLine.appendSwitch('--in-process-gpu'); // Better Steam overlay rendering
app.commandLine.appendSwitch('disable-renderer-backgrounding'); // Consistent game loop
app.commandLine.appendSwitch('disable-background-timer-throttling'); // Prevent timer throttling

// ============================================================
// LAZY LOADING: Defer Steam module loading
// ============================================================
let steamAchievements = null;
let steamCloud = null;
let steamPresence = null;
let windowState = null;
let tray = null;

function loadWindowModules() {
  if (!windowState) {
    windowState = require('./window-state');
  }
  if (!tray) {
    tray = require('./tray');
  }
}

function loadSteamModules() {
  if (!steamAchievements) {
    steamAchievements = require('./steam-achievements');
    steamCloud = require('./steam-cloud');
    steamPresence = require('./steam-presence');
  }
}

// Steam state
let steamClient = null;
let steamInitialized = false;
let steamReady = false;
let pendingSteamOperations = [];

// Server reference for cleanup
let localServer = null;

// Window references
let mainWindow = null;
let splashWindow = null;

// Network status
let isOnline = true;
let pendingSteamSync = [];

// Startup timing
const startupTime = Date.now();
function logStartupTime(phase) {
  if (isDev) {
    console.log(`[Startup] ${phase}: ${Date.now() - startupTime}ms`);
  }
}

// Steam App ID - Replace with your actual Steam App ID
// For development/testing, use 480 (Spacewar test app)
const STEAM_APP_ID = process.env.STEAM_APP_ID || '480';

// Mark app as not quitting (for tray minimize)
app.isQuitting = false;

// ============================================================
// Input validation helpers
// ============================================================

/**
 * Validates a string identifier (achievement ID, save key, etc.)
 * @param {unknown} id - The value to validate
 * @param {string} name - Name for error messages
 * @returns {{valid: boolean, error?: string, value?: string}}
 */
function validateStringId(id, name = 'id') {
  if (typeof id !== 'string') {
    return { valid: false, error: `${name} must be a string` };
  }
  if (id.length === 0) {
    return { valid: false, error: `${name} cannot be empty` };
  }
  if (id.length > 256) {
    return { valid: false, error: `${name} too long (max 256 characters)` };
  }
  // Only allow alphanumeric, underscore, hyphen, and common separators
  if (!/^[a-zA-Z0-9_\-:.]+$/.test(id)) {
    return { valid: false, error: `${name} contains invalid characters` };
  }
  return { valid: true, value: id };
}

/**
 * Validates save data (JSON string)
 * @param {unknown} data - The data to validate
 * @returns {{valid: boolean, error?: string, value?: string}}
 */
function validateSaveData(data) {
  if (typeof data !== 'string') {
    return { valid: false, error: 'Save data must be a string' };
  }
  // 10MB max for cloud saves
  const MAX_SIZE = 10 * 1024 * 1024;
  if (data.length > MAX_SIZE) {
    return { valid: false, error: 'Save data too large (max 10MB)' };
  }
  return { valid: true, value: data };
}

/**
 * Validates presence status string
 * @param {unknown} status - The status to validate
 * @returns {{valid: boolean, error?: string, value?: string}}
 */
function validatePresenceStatus(status) {
  if (typeof status !== 'string') {
    return { valid: false, error: 'Status must be a string' };
  }
  if (status.length > 256) {
    return { valid: false, error: 'Status too long (max 256 characters)' };
  }
  return { valid: true, value: status };
}

// ============================================================
// Steam ready state management
// ============================================================

/**
 * Queues an operation to run when Steam is ready.
 * @param {Function} operation - Async function to run
 * @returns {Promise} - Resolves when operation completes
 */
function whenSteamReady(operation) {
  if (steamReady) {
    return operation();
  }
  return new Promise((resolve) => {
    pendingSteamOperations.push(() => {
      resolve(operation());
    });
  });
}

/**
 * Marks Steam as ready and runs pending operations.
 */
function markSteamReady() {
  steamReady = true;
  const operations = pendingSteamOperations;
  pendingSteamOperations = [];
  operations.forEach((op) => {
    try {
      op();
    } catch (e) {
      console.error('Pending Steam operation failed:', e);
    }
  });
}

// ============================================================
// SPLASH SCREEN
// ============================================================

function createSplashWindow() {
  logStartupTime('Creating splash window');
  
  splashWindow = new BrowserWindow({
    width: 450,
    height: 350,
    frame: false,
    transparent: true,
    resizable: false,
    center: true,
    alwaysOnTop: true,
    skipTaskbar: true,
    show: false,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false, // Allow IPC in splash
    },
  });

  splashWindow.loadFile(path.join(__dirname, 'splash.html'));
  
  splashWindow.once('ready-to-show', () => {
    splashWindow.show();
    logStartupTime('Splash window shown');
  });

  return splashWindow;
}

function updateSplashStatus(status, progress = null) {
  if (splashWindow && !splashWindow.isDestroyed()) {
    splashWindow.webContents.send('splash:status', status);
    if (progress !== null) {
      splashWindow.webContents.send('splash:progress', progress);
    }
  }
}

function closeSplashWindow() {
  if (splashWindow && !splashWindow.isDestroyed()) {
    splashWindow.close();
    splashWindow = null;
    logStartupTime('Splash window closed');
  }
}

// ============================================================
// OFFLINE DETECTION
// ============================================================

function setupNetworkMonitoring() {
  // Check initial status
  isOnline = require('dns').promises.resolve('steamcommunity.com')
    .then(() => { isOnline = true; })
    .catch(() => { isOnline = false; });

  // Periodic network check (every 30 seconds)
  setInterval(async () => {
    try {
      await require('dns').promises.resolve('steamcommunity.com');
      const wasOffline = !isOnline;
      isOnline = true;
      
      // Process pending sync operations when back online
      if (wasOffline && pendingSteamSync.length > 0) {
        console.log(`Back online, processing ${pendingSteamSync.length} pending Steam operations`);
        const pending = [...pendingSteamSync];
        pendingSteamSync = [];
        for (const op of pending) {
          try {
            await op();
          } catch (e) {
            console.error('Failed to process pending Steam operation:', e);
          }
        }
      }
      
      // Notify renderer of online status
      if (mainWindow && !mainWindow.isDestroyed()) {
        mainWindow.webContents.send('network:status', true);
      }
    } catch {
      isOnline = false;
      if (mainWindow && !mainWindow.isDestroyed()) {
        mainWindow.webContents.send('network:status', false);
      }
    }
  }, 30000);
}

function queueSteamOperation(operation) {
  if (!isOnline) {
    pendingSteamSync.push(operation);
    return { success: false, error: 'Offline - operation queued for sync', queued: true };
  }
  return null; // Proceed with operation
}

// ============================================================
// MEMORY MANAGEMENT
// ============================================================

let gcInterval = null;

function setupMemoryManagement() {
  // Periodic GC hints for long sessions (every 5 minutes)
  gcInterval = setInterval(() => {
    if (global.gc) {
      try {
        global.gc();
        if (isDev) {
          const used = process.memoryUsage();
          console.log(`[GC] Memory: ${Math.round(used.heapUsed / 1024 / 1024)}MB / ${Math.round(used.heapTotal / 1024 / 1024)}MB`);
        }
      } catch (e) {
        // GC not available, ignore
      }
    }
  }, 5 * 60 * 1000);

  // Monitor memory usage
  if (isDev) {
    setInterval(() => {
      const used = process.memoryUsage();
      console.log(`[Memory] Heap: ${Math.round(used.heapUsed / 1024 / 1024)}MB, RSS: ${Math.round(used.rss / 1024 / 1024)}MB`);
    }, 60000);
  }
}

// ============================================================
// Steam Initialization (lazy loaded)
// ============================================================

/**
 * Initializes Steamworks SDK.
 * Must be called before creating the window.
 * @returns {boolean} True if Steam was initialized successfully
 */
function initializeSteam() {
  logStartupTime('Starting Steam initialization');
  updateSplashStatus('Connecting to Steam...', 60);
  
  try {
    // Lazy load Steam modules
    loadSteamModules();
    
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

      // Mark Steam as ready and run pending operations
      markSteamReady();

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

      logStartupTime('Steam initialized');
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

  // Steam not available - still mark as "ready" so pending ops return gracefully
  // Load modules so handlers don't crash
  loadSteamModules();
  markSteamReady();
  logStartupTime('Steam skipped (not available)');

  return false;
}

/**
 * Shuts down Steam gracefully.
 */
function shutdownSteam() {
  if (steamClient) {
    try {
      if (steamPresence) {
        steamPresence.clearPresence();
      }
      steamClient = null;
      steamInitialized = false;
      steamReady = false;
      pendingSteamOperations = [];
      console.log('Steam shutdown complete');
    } catch (error) {
      console.error('Error during Steam shutdown:', error);
    }
  }
}

// ============================================================
// MAIN WINDOW (hidden until ready)
// ============================================================

function createWindow() {
  logStartupTime('Creating main window');
  updateSplashStatus('Loading game...', 80);
  
  // Lazy load window modules
  loadWindowModules();
  
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
    show: false, // HIDDEN until content ready
    backgroundColor: '#0a0a0a', // Match splash background - prevent white flash
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

  // Show window when content is fully loaded (no white flash)
  mainWindow.webContents.once('did-finish-load', () => {
    logStartupTime('Content loaded');
    updateSplashStatus('Ready!', 100);
    
    // Small delay for smooth transition
    setTimeout(() => {
      if (mainWindow && !mainWindow.isDestroyed()) {
        mainWindow.show();
        stateManager.applyMaximized();
        closeSplashWindow();
        logStartupTime('Main window shown - startup complete');
      }
    }, 200);
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

// Network status
ipcMain.handle('network:isOnline', () => {
  return isOnline;
});

ipcMain.handle('network:getPendingSync', () => {
  return pendingSteamSync.length;
});

// Achievement handlers
ipcMain.handle('steam:achievements:unlock', (event, achievementId) => {
  const validation = validateStringId(achievementId, 'achievementId');
  if (!validation.valid) {
    return { success: false, error: validation.error };
  }
  return whenSteamReady(() => steamAchievements.unlock(validation.value));
});

ipcMain.handle('steam:achievements:isUnlocked', (event, achievementId) => {
  const validation = validateStringId(achievementId, 'achievementId');
  if (!validation.valid) {
    return { success: false, unlocked: false, error: validation.error };
  }
  return whenSteamReady(() => steamAchievements.isUnlocked(validation.value));
});

// Only allow clearing achievements in development mode (for testing)
ipcMain.handle('steam:achievements:clear', (event, achievementId) => {
  if (!isDev) {
    return { success: false, error: 'Achievement clearing is only available in development mode' };
  }
  const validation = validateStringId(achievementId, 'achievementId');
  if (!validation.valid) {
    return { success: false, error: validation.error };
  }
  return whenSteamReady(() => steamAchievements.clear(validation.value));
});

ipcMain.handle('steam:achievements:getAllMapped', () => {
  return whenSteamReady(() => steamAchievements.getAllMappedAchievements());
});

// Cloud save handlers with offline queue support
ipcMain.handle('steam:cloud:isAvailable', () => {
  return steamCloud ? steamCloud.isAvailable() : false;
});

ipcMain.handle('steam:cloud:save', (event, key, data) => {
  const keyValidation = validateStringId(key, 'key');
  if (!keyValidation.valid) {
    return { success: false, error: keyValidation.error };
  }
  const dataValidation = validateSaveData(data);
  if (!dataValidation.valid) {
    return { success: false, error: dataValidation.error };
  }
  
  // Queue for offline sync if needed
  const queued = queueSteamOperation(() => 
    whenSteamReady(() => steamCloud.save(keyValidation.value, dataValidation.value))
  );
  if (queued) return queued;
  
  return whenSteamReady(() => steamCloud.save(keyValidation.value, dataValidation.value));
});

ipcMain.handle('steam:cloud:load', (event, key) => {
  const validation = validateStringId(key, 'key');
  if (!validation.valid) {
    return { success: false, data: null, error: validation.error };
  }
  return whenSteamReady(() => steamCloud.load(validation.value));
});

ipcMain.handle('steam:cloud:delete', (event, key) => {
  const validation = validateStringId(key, 'key');
  if (!validation.valid) {
    return { success: false, error: validation.error };
  }
  return whenSteamReady(() => steamCloud.deleteFile(validation.value));
});

ipcMain.handle('steam:cloud:list', () => {
  return whenSteamReady(() => steamCloud.list());
});

ipcMain.handle('steam:cloud:getQuota', () => {
  return whenSteamReady(() => steamCloud.getQuota());
});

// Overlay handler
ipcMain.handle('steam:overlay:activate', (event, dialog) => {
  if (!steamInitialized || !steamClient) {
    return { success: false, error: 'Steam not initialized' };
  }
  // Validate dialog type
  const validDialogs = ['friends', 'community', 'players', 'settings', 'officialgamegroup', 'stats', 'achievements'];
  const dialogValue = typeof dialog === 'string' ? dialog : 'achievements';
  if (!validDialogs.includes(dialogValue)) {
    return { success: false, error: 'Invalid dialog type' };
  }
  try {
    const overlay = steamClient.overlay;
    if (overlay) {
      overlay.activateDialog(dialogValue);
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
  const validation = validatePresenceStatus(status);
  if (!validation.valid) {
    return { success: false, error: validation.error };
  }
  return steamPresence ? steamPresence.setPresence(validation.value) : { success: false, error: 'Steam not available' };
});

ipcMain.handle('steam:presence:update', (event, gameState) => {
  // gameState is an object, basic validation
  if (gameState && typeof gameState !== 'object') {
    return { success: false, error: 'Invalid game state' };
  }
  // Update both Steam presence and tray status
  if (steamPresence) steamPresence.updateFromGameState(gameState);
  if (tray) tray.updateFromGameState(gameState);
  return { success: true };
});

ipcMain.handle('steam:presence:clear', () => {
  return steamPresence ? steamPresence.clearPresence() : { success: true };
});

ipcMain.handle('steam:presence:getStates', () => {
  return steamPresence ? steamPresence.getPresenceStates() : {};
});

// ============================================================
// IPC Handlers for Tray
// ============================================================

ipcMain.handle('tray:setMinimizeToTray', (event, enabled) => {
  if (typeof enabled !== 'boolean') {
    return { success: false, error: 'enabled must be a boolean' };
  }
  if (tray) tray.setMinimizeToTray(enabled);
  return { success: true };
});

ipcMain.handle('tray:isMinimizeToTrayEnabled', () => {
  return tray ? tray.isMinimizeToTrayEnabled() : false;
});

ipcMain.handle('tray:updateStatus', (event, status) => {
  if (tray) tray.updateTooltip(status);
  return { success: true };
});

// ============================================================
// App lifecycle - Optimized startup sequence
// ============================================================

app.whenReady().then(async () => {
  logStartupTime('App ready');
  
  // 1. Show splash immediately
  createSplashWindow();
  updateSplashStatus('Initializing...', 10);
  
  // 2. Start network monitoring (non-blocking)
  setupNetworkMonitoring();
  updateSplashStatus('Checking network...', 30);
  
  // 3. Start memory management
  setupMemoryManagement();
  
  // 4. Initialize Steam (deferred to allow splash to show)
  setImmediate(() => {
    initializeSteam();
    
    // 5. Create main window (hidden)
    createWindow();
  });

  app.on('activate', () => {
    // On macOS, re-create window when dock icon is clicked and no windows are open
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

app.on('window-all-closed', () => {
  // Clear GC interval
  if (gcInterval) {
    clearInterval(gcInterval);
    gcInterval = null;
  }
  
  // Close local server if running
  if (localServer) {
    localServer.close();
    localServer = null;
  }

  // Destroy tray icon
  if (tray) tray.destroy();

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

// ============================================================
// Auto-updater (production only)
// ============================================================

function setupAutoUpdater() {
  if (isDev) {
    console.log('Auto-updater disabled in development');
    return;
  }

  try {
    const { autoUpdater } = require('electron-updater');

    autoUpdater.logger = console;
    autoUpdater.autoDownload = true;
    autoUpdater.autoInstallOnAppQuit = true;

    autoUpdater.on('checking-for-update', () => {
      console.log('Checking for updates...');
    });

    autoUpdater.on('update-available', (info) => {
      console.log('Update available:', info.version);
    });

    autoUpdater.on('update-not-available', () => {
      console.log('App is up to date');
    });

    autoUpdater.on('error', (err) => {
      console.error('Auto-updater error:', err.message);
    });

    autoUpdater.on('download-progress', (progress) => {
      console.log(`Download progress: ${progress.percent.toFixed(1)}%`);
    });

    autoUpdater.on('update-downloaded', (info) => {
      console.log('Update downloaded:', info.version);
      // Will install on next app quit
    });

    // Check for updates after a short delay (deferred for startup performance)
    setTimeout(() => {
      autoUpdater.checkForUpdatesAndNotify().catch((err) => {
        // Silently fail if update check fails (offline, etc.)
        if (isDev) {
          console.debug('Update check failed:', err.message);
        }
      });
    }, 15000); // 15 seconds after startup (increased from 10)
  } catch (error) {
    // electron-updater not installed or other error
    console.log('Auto-updater not available:', error.message);
  }
}

// ============================================================
// Crash reporter
// ============================================================

function setupCrashReporter() {
  try {
    const { crashReporter } = require('electron');

    crashReporter.start({
      productName: 'Varginha Terminal 1996',
      companyName: 'Terminal 1996',
      submitURL: '', // Set to your crash report server URL if desired
      uploadToServer: false, // Set to true if you have a crash report server
      ignoreSystemCrashHandler: false,
    });

    console.log('Crash reporter initialized');
  } catch (error) {
    console.error('Crash reporter setup failed:', error.message);
  }
}

// Initialize crash reporter immediately
setupCrashReporter();

// Set up auto-updater after app is ready (deferred)
app.whenReady().then(() => {
  // Defer auto-updater setup to not block startup
  setImmediate(() => {
    setupAutoUpdater();
  });
});
