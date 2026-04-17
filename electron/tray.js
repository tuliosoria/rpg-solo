/**
 * System tray integration module.
 * Provides minimize to tray, status tooltip, and quick actions.
 */
const { Tray, Menu, nativeImage, app } = require('electron');
const path = require('path');

const TRANSLATIONS = {
  en: {
    menu: {
      showWindow: 'Show Window',
      minimizeToTray: 'Minimize to Tray',
      newGame: 'New Game',
      quit: 'Quit',
    },
    status: {
      inMenu: 'In menu',
      victory: 'Victory!',
      gameOver: 'Game Over',
      detection: 'Detection: {{value}}%',
      detectionCritical: '⚠️ Detection: {{value}}%',
      investigating: 'Investigating...',
    },
  },
  'pt-BR': {
    menu: {
      showWindow: 'Mostrar janela',
      minimizeToTray: 'Minimizar para a bandeja',
      newGame: 'Novo jogo',
      quit: 'Sair',
    },
    status: {
      inMenu: 'No menu',
      victory: 'Vitória!',
      gameOver: 'Fim de jogo',
      detection: 'Detecção: {{value}}%',
      detectionCritical: '⚠️ Detecção: {{value}}%',
      investigating: 'Investigando...',
    },
  },
  es: {
    menu: {
      showWindow: 'Mostrar ventana',
      minimizeToTray: 'Minimizar a la bandeja',
      newGame: 'Nueva partida',
      quit: 'Salir',
    },
    status: {
      inMenu: 'En el menú',
      victory: '¡Victoria!',
      gameOver: 'Fin de la partida',
      detection: 'Detección: {{value}}%',
      detectionCritical: '⚠️ Detección: {{value}}%',
      investigating: 'Investigando...',
    },
  },
};

let tray = null;
let mainWindow = null;
let currentLanguage = 'en';
let currentStatus = '';
let lastGameState = null;
let minimizeToTray = false;

function normalizeLanguage(value) {
  if (typeof value !== 'string') {
    return 'en';
  }

  const normalized = value.toLowerCase();
  if (normalized.startsWith('pt')) {
    return 'pt-BR';
  }
  if (normalized.startsWith('es')) {
    return 'es';
  }
  return 'en';
}

function getCurrentLocale() {
  return TRANSLATIONS[currentLanguage] || TRANSLATIONS.en;
}

function formatMessage(template, values = {}) {
  return template.replace(/\{\{(.*?)\}\}/g, (_, token) => {
    const key = token.trim();
    return values[key] === undefined ? '' : String(values[key]);
  });
}

function getStatusLabel(key, values) {
  const locale = getCurrentLocale();
  return formatMessage(locale.status[key] || TRANSLATIONS.en.status[key], values);
}

function getMenuLabel(key) {
  const locale = getCurrentLocale();
  return locale.menu[key] || TRANSLATIONS.en.menu[key];
}

function getCurrentStatus() {
  return currentStatus || getStatusLabel('inMenu');
}

try {
  currentLanguage = normalizeLanguage(typeof app.getLocale === 'function' ? app.getLocale() : null);
} catch {
  currentLanguage = 'en';
}

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
  const resolvedStatus = status || getStatusLabel('inMenu');
  currentStatus = resolvedStatus;
  if (tray) {
    tray.setToolTip(`Varginha: Terminal 1996 - ${resolvedStatus}`);
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
      label: getCurrentStatus(),
      enabled: false,
      icon: null,
    },
    {
      type: 'separator',
    },
    {
      label: getMenuLabel('showWindow'),
      click: () => {
        if (mainWindow) {
          mainWindow.show();
          mainWindow.focus();
        }
      },
    },
    {
      label: getMenuLabel('minimizeToTray'),
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
      label: getMenuLabel('newGame'),
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
      label: getMenuLabel('quit'),
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
    updateTooltip(getStatusLabel('inMenu'));
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
 * Derives the tray tooltip status from the game state.
 * @param {Object | null | undefined} gameState - Current game state
 * @returns {string}
 */
function getTrayStatus(gameState) {
  if (!gameState) {
    return getStatusLabel('inMenu');
  }

  if (gameState.gameOver || gameState.isGameOver) {
    return gameState.gameWon ? getStatusLabel('victory') : getStatusLabel('gameOver');
  }

  if (gameState.detectionLevel >= 90) {
    return getStatusLabel('detectionCritical', { value: gameState.detectionLevel });
  }

  if (gameState.detectionLevel >= 50) {
    return getStatusLabel('detection', { value: gameState.detectionLevel });
  }

  return getStatusLabel('investigating');
}

/**
 * Updates the tray status from game state.
 * @param {Object} gameState - Current game state
 */
function updateFromGameState(gameState) {
  lastGameState = gameState || null;
  const status = getTrayStatus(gameState);
  updateTooltip(status);
  if (tray) {
    tray.setContextMenu(buildContextMenu());
  }
}

/**
 * Sets the tray language for shell-level desktop strings.
 * @param {string} language - Active UI language
 * @returns {string}
 */
function setLanguage(language) {
  currentLanguage = normalizeLanguage(language);
  currentStatus = lastGameState ? getTrayStatus(lastGameState) : getStatusLabel('inMenu');
  if (tray) {
    updateTooltip(currentStatus);
    tray.setContextMenu(buildContextMenu());
  }
  return currentLanguage;
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
  getTrayStatus,
  updateFromGameState,
  setLanguage,
  isMinimizeToTrayEnabled,
  setMinimizeToTray,
  destroy,
  getTray,
};
