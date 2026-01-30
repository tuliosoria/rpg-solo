/**
 * Window state persistence module.
 * Saves and restores window size, position, and maximized state.
 */
const path = require('path');
const fs = require('fs');
const { app, screen } = require('electron');

const STATE_FILE = 'window-state.json';

/**
 * Gets the path to the window state file.
 * @returns {string}
 */
function getStatePath() {
  return path.join(app.getPath('userData'), STATE_FILE);
}

/**
 * Default window state configuration.
 */
const defaultState = {
  width: 1200,
  height: 800,
  x: undefined,
  y: undefined,
  isMaximized: false,
};

/**
 * Validates that the window position is visible on at least one display.
 * @param {Object} state - The window state to validate
 * @returns {boolean}
 */
function isVisibleOnScreen(state) {
  if (state.x === undefined || state.y === undefined) {
    return true;
  }

  const displays = screen.getAllDisplays();
  return displays.some((display) => {
    const { bounds } = display;
    return (
      state.x >= bounds.x - 100 &&
      state.x < bounds.x + bounds.width - 100 &&
      state.y >= bounds.y - 100 &&
      state.y < bounds.y + bounds.height - 100
    );
  });
}

/**
 * Loads the saved window state from disk.
 * @returns {Object} The window state or defaults if not found/invalid
 */
function loadState() {
  try {
    const statePath = getStatePath();
    if (fs.existsSync(statePath)) {
      const data = fs.readFileSync(statePath, 'utf-8');
      const state = JSON.parse(data);

      // Validate the loaded state
      if (
        typeof state.width === 'number' &&
        typeof state.height === 'number' &&
        state.width >= 400 &&
        state.height >= 300 &&
        isVisibleOnScreen(state)
      ) {
        return {
          ...defaultState,
          ...state,
        };
      }
    }
  } catch (error) {
    console.error('Failed to load window state:', error.message);
  }

  return { ...defaultState };
}

/**
 * Saves the window state to disk.
 * @param {Object} state - The window state to save
 */
function saveState(state) {
  try {
    const statePath = getStatePath();
    fs.writeFileSync(statePath, JSON.stringify(state, null, 2), 'utf-8');
  } catch (error) {
    console.error('Failed to save window state:', error.message);
  }
}

/**
 * Creates a window state manager for a BrowserWindow.
 * @param {Object} options - Configuration options
 * @param {BrowserWindow} options.window - The window to manage
 * @returns {Object} Manager with state and cleanup methods
 */
function createWindowStateManager(window) {
  const state = loadState();
  let saveTimeout = null;

  /**
   * Updates and saves the current window state.
   */
  function updateState() {
    if (window.isDestroyed()) return;

    const isMaximized = window.isMaximized();

    // Only save bounds when not maximized
    if (!isMaximized) {
      const bounds = window.getBounds();
      state.x = bounds.x;
      state.y = bounds.y;
      state.width = bounds.width;
      state.height = bounds.height;
    }

    state.isMaximized = isMaximized;

    // Debounce saves to avoid excessive disk writes
    if (saveTimeout) {
      clearTimeout(saveTimeout);
    }
    saveTimeout = setTimeout(() => {
      saveState(state);
    }, 500);
  }

  // Attach event listeners
  window.on('resize', updateState);
  window.on('move', updateState);
  window.on('maximize', updateState);
  window.on('unmaximize', updateState);
  window.on('close', () => {
    // Save immediately on close
    if (saveTimeout) {
      clearTimeout(saveTimeout);
    }
    updateState();
    saveState(state);
  });

  return {
    /**
     * Gets the initial state to apply to window creation.
     */
    getState: () => ({ ...state }),

    /**
     * Applies the maximized state after window is ready.
     */
    applyMaximized: () => {
      if (state.isMaximized) {
        window.maximize();
      }
    },
  };
}

module.exports = {
  loadState,
  createWindowStateManager,
};
