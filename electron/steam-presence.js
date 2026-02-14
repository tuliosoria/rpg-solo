/**
 * Steam Rich Presence module.
 * Shows current game state in Steam friends list.
 */

let steamClient = null;
let currentPresence = '';

// Rich Presence status strings
const PRESENCE_STATES = {
  MENU: 'In the main menu',
  INVESTIGATING: 'Investigating classified files...',
  CRITICAL: 'Detection critical! System alert!',
  ENDING_GOOD: 'Uncovered the truth',
  ENDING_BAD: 'Session terminated',
  PLAYING: 'Accessing terminal...',
};

/**
 * @typedef {Object} PresenceResult
 * @property {boolean} success
 * @property {string} [error]
 * @property {boolean} [cached]
 */

/**
 * Initializes the Steam presence module.
 * @param {object | null | undefined} client - The steamworks.js client instance
 */
function initialize(client) {
  steamClient = client;
  currentPresence = '';
  if (steamClient) {
    console.log('Steam Rich Presence initialized');
  }
}

/**
 * Updates the Steam Rich Presence status.
 * @param {string} status - The status string to display
 * @returns {PresenceResult} Result with success status
 */
function setPresence(status) {
  if (!steamClient) {
    return { success: false, error: 'Steam not initialized' };
  }

  // Avoid redundant updates
  if (status === currentPresence) {
    return { success: true, cached: true };
  }

  try {
    // steamworks.js uses the friends API for rich presence
    const friends = steamClient.friends;
    if (friends && typeof friends.setRichPresence === 'function') {
      // Use 'status' key which is the standard for simple text presence
      // Note: 'steam_display' requires localization tokens in Steamworks dashboard
      friends.setRichPresence('status', status);
      currentPresence = status;
      return { success: true };
    }

    // Fallback: some versions use different API
    return { success: false, error: 'Rich presence API not available' };
  } catch (error) {
    return { success: false, error: error.message };
  }
}

/**
 * Updates presence based on game state.
 * @param {object | null | undefined} gameState - Current game state from renderer
 * @returns {PresenceResult} Result with success status
 */
function updateFromGameState(gameState) {
  if (!steamClient) {
    return { success: false, error: 'Steam not initialized' };
  }

  let status;

  // Determine status based on game state
  if (!gameState) {
    status = PRESENCE_STATES.MENU;
  } else if (gameState.gameOver) {
    status = gameState.gameWon ? PRESENCE_STATES.ENDING_GOOD : PRESENCE_STATES.ENDING_BAD;
  } else if (gameState.detectionLevel >= 90) {
    status = PRESENCE_STATES.CRITICAL;
  } else if (gameState.detectionLevel >= 50) {
    status = `Detection level: ${gameState.detectionLevel}%`;
  } else if (gameState.currentPath && gameState.currentPath !== '/') {
    status = PRESENCE_STATES.INVESTIGATING;
  } else {
    status = PRESENCE_STATES.PLAYING;
  }

  return setPresence(status);
}

/**
 * Clears the Rich Presence status.
 * @returns {PresenceResult} Result with success status
 */
function clearPresence() {
  if (!steamClient) {
    return { success: false, error: 'Steam not initialized' };
  }

  try {
    const friends = steamClient.friends;
    if (friends && typeof friends.clearRichPresence === 'function') {
      friends.clearRichPresence();
      currentPresence = '';
      return { success: true };
    }
    return { success: false, error: 'Clear presence API not available' };
  } catch (error) {
    return { success: false, error: error.message };
  }
}

/**
 * Gets the current presence status.
 * @returns {string} Current presence string
 */
function getCurrentPresence() {
  return currentPresence;
}

/**
 * Gets all predefined presence states.
 * @returns {object} Object with all presence state constants
 */
function getPresenceStates() {
  return { ...PRESENCE_STATES };
}

module.exports = {
  initialize,
  setPresence,
  updateFromGameState,
  clearPresence,
  getCurrentPresence,
  getPresenceStates,
  PRESENCE_STATES,
};
