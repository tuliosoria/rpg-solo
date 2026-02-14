/**
 * System tray integration module.
 * Provides minimize to tray, status tooltip, and quick actions.
 */
const { Tray, Menu, nativeImage, app } = require('electron');
const path = require('path');

let tray = null;
let mainWindow = null;
let currentStatus = 'Idle';
let minimizeToTray = true;

/**
 * Gets the tray icon path based on platform and packaging state.
 * @returns {string} Path to the tray icon
 */
function getTrayIconPath() {
  // Use different icon sizes for different platforms
  const iconName = process.platform === 'win32' ? 'icon.ico' : 'icon.png';

  // In production (packaged), resources are in different locations
  if (app.isPackaged) {
    // For packaged apps, use process.resourcesPath or app.getAppPath()
    const resourcesPath = process.resourcesPath || app.getAppPath();
    // Try multiple possible locations
    const possiblePaths = [
      path.join(resourcesPath, 'public', iconName),
      path.join(resourcesPath, 'app', 'public', iconName),
      path.join(app.getAppPath(), 'public', iconName),
      path.join(app.getAppPath(), '..', 'public', iconName),
    ];

    for (const iconPath of possiblePaths) {
      try {
        const fs = require('fs');
        if (fs.existsSync(iconPath)) {
          return iconPath;
        }
      } catch {
        // Continue to next path
      }
    }

    // Fallback to original path
    return path.join(__dirname, '..', 'public', iconName);
  }

  // Development: use the public folder directly
  return path.join(__dirname, '..', 'public', iconName);
}

/**
 * Creates a fallback icon if the file doesn't exist.
 * @returns {NativeImage}
 */
function createFallbackIcon() {
  // Create a simple 16x16 icon
  return nativeImage.createEmpty();
}

/**
 * Updates the tray tooltip with current game status.
 * @param {string} status - Status text to display
 */
function updateTooltip(status) {
  if (tray) {
    currentStatus = status || 'Idle';
    tray.setToolTip(`Varginha: Terminal 1996 - ${currentStatus}`);
  }
}

/**
 * Builds the context menu for the tray icon.
 * @returns {Menu}
 */
function buildContextMenu() {
  return Menu.buildFromTemplate([
    {
      label: 'Varginha: Terminal 1996',
      enabled: false,
    },
    {
      type: 'separator',
    },
    {
      label: currentStatus,
      enabled: false,
      icon: null,
    },
    {
      type: 'separator',
    },
    {
      label: 'Show Window',
      click: () => {
        if (mainWindow) {
          mainWindow.show();
          mainWindow.focus();
        }
      },
    },
    {
      label: 'Minimize to Tray',
      type: 'checkbox',
      checked: minimizeToTray,
      click: (menuItem) => {
        minimizeToTray = menuItem.checked;
      },
    },
    {
      type: 'separator',
    },
    {
      label: 'New Game',
      click: () => {
        if (mainWindow) {
          mainWindow.show();
          mainWindow.focus();
          mainWindow.webContents.send('tray:newGame');
        }
      },
    },
    {
      type: 'separator',
    },
    {
      label: 'Quit',
      click: () => {
        app.quit();
      },
    },
  ]);
}

/**
 * Initializes the system tray.
 * @param {BrowserWindow} window - The main application window
 * @returns {Tray|null} The tray instance or null if creation failed
 */
function initialize(window) {
  if (tray) {
    return tray;
  }

  mainWindow = window;

  try {
    const iconPath = getTrayIconPath();
    let icon;

    try {
      icon = nativeImage.createFromPath(iconPath);
      if (icon.isEmpty()) {
        icon = createFallbackIcon();
      }
    } catch {
      icon = createFallbackIcon();
    }

    tray = new Tray(icon);
    tray.setToolTip('Varginha: Terminal 1996');
    tray.setContextMenu(buildContextMenu());

    // Double-click to show window (Windows behavior)
    tray.on('double-click', () => {
      if (mainWindow) {
        mainWindow.show();
        mainWindow.focus();
      }
    });

    // Handle minimize to tray
    if (mainWindow) {
      mainWindow.on('minimize', (event) => {
        if (minimizeToTray) {
          event.preventDefault();
          mainWindow.hide();
        }
      });

      // Also handle close to tray on Windows/Linux
      mainWindow.on('close', (event) => {
        if (minimizeToTray && !app.isQuitting) {
          event.preventDefault();
          mainWindow.hide();
          return false;
        }
      });
    }

    console.log('System tray initialized');
    return tray;
  } catch (error) {
    console.error('Failed to initialize system tray:', error.message);
    return null;
  }
}

/**
 * Updates the tray status from game state.
 * @param {Object} gameState - Current game state
 */
function updateFromGameState(gameState) {
  if (!tray) return;

  let status;
  if (!gameState) {
    status = 'In menu';
  } else if (gameState.gameOver) {
    status = gameState.gameWon ? 'Victory!' : 'Game Over';
  } else if (gameState.detectionLevel >= 90) {
    status = `⚠️ Detection: ${gameState.detectionLevel}%`;
  } else if (gameState.detectionLevel >= 50) {
    status = `Detection: ${gameState.detectionLevel}%`;
  } else {
    status = 'Investigating...';
  }

  updateTooltip(status);
  tray.setContextMenu(buildContextMenu());
}

/**
 * Gets the minimize to tray setting.
 * @returns {boolean}
 */
function isMinimizeToTrayEnabled() {
  return minimizeToTray;
}

/**
 * Sets the minimize to tray setting.
 * @param {boolean} enabled - Whether to minimize to tray
 */
function setMinimizeToTray(enabled) {
  minimizeToTray = enabled;
  if (tray) {
    tray.setContextMenu(buildContextMenu());
  }
}

/**
 * Destroys the tray icon.
 */
function destroy() {
  if (tray) {
    tray.destroy();
    tray = null;
  }
}

/**
 * Gets the tray instance.
 * @returns {Tray|null}
 */
function getTray() {
  return tray;
}

module.exports = {
  initialize,
  updateTooltip,
  updateFromGameState,
  isMinimizeToTrayEnabled,
  setMinimizeToTray,
  destroy,
  getTray,
};
