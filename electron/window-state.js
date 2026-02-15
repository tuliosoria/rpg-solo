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
 * Uses a margin to ensure at least part of the window is accessible.
 * @param {Object} state - The window state to validate
 * @returns {boolean}
 */
function isVisibleOnScreen(state) {
  if (state.x === undefined || state.y === undefined) {
    return true;
  }

  const displays = screen.getAllDisplays();

  // Ensure at least 100px of the window is visible on some display
  const minVisibleMargin = 100;

  return displays.some((display) => {
    const { bounds } = display;
    const { workArea } = display;

    // Check if window overlaps with the work area (excluding taskbar, etc.)
    const windowRight = state.x + state.width;
    const windowBottom = state.y + state.height;

    const overlapX =
      state.x < workArea.x + workArea.width - minVisibleMargin &&
      windowRight > workArea.x + minVisibleMargin;
    const overlapY =
      state.y < workArea.y + workArea.height - minVisibleMargin &&
      windowBottom > workArea.y + minVisibleMargin;

    return overlapX && overlapY;
  });
}

/**
 * Constrains window state to be visible on current displays.
 * If the window would be off-screen, repositions it to the primary display.
 * @param {Object} state - The window state to constrain
 * @returns {Object} - The constrained state
 */
function constrainToScreen(state) {
  if (isVisibleOnScreen(state)) {
    return state;
  }

  // Window would be off-screen, reset position to primary display
  const primaryDisplay = screen.getPrimaryDisplay();
  const { workArea } = primaryDisplay;

  // Center the window on the primary display
  const newX = Math.round(workArea.x + (workArea.width - state.width) / 2);
  const newY = Math.round(workArea.y + (workArea.height - state.height) / 2);

  return {
    ...state,
    x: newX,
    y: newY,
    // Also ensure dimensions fit within the work area
    width: Math.min(state.width, workArea.width),
    height: Math.min(state.height, workArea.height),
  };
}

/**
 * Loads the saved window state from disk.
 * Constrains the position to be visible on current displays.
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
        state.height >= 300
      ) {
        const mergedState = {
          ...defaultState,
          ...state,
        };

        // Constrain to current screen configuration
        return constrainToScreen(mergedState);
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
