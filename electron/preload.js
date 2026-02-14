const { contextBridge, ipcRenderer } = require('electron');

// ============================================================
// Safe IPC wrapper with error handling
// ============================================================

/**
 * Wraps an IPC invoke call with error handling.
 * @param {string} channel - The IPC channel to invoke
 * @param {...any} args - Arguments to pass to the handler
 * @returns {Promise} - Result or error object
 */
async function safeInvoke(channel, ...args) {
  try {
    return await ipcRenderer.invoke(channel, ...args);
  } catch (error) {
    console.error(`IPC error on ${channel}:`, error.message);
    // Return a consistent error format
    return { success: false, error: error.message || 'IPC call failed' };
  }
}

/**
 * Wraps an IPC invoke call that returns a boolean.
 * @param {string} channel - The IPC channel to invoke
 * @param {...any} args - Arguments to pass to the handler
 * @returns {Promise<boolean>} - Result or false on error
 */
async function safeInvokeBoolean(channel, ...args) {
  try {
    return await ipcRenderer.invoke(channel, ...args);
  } catch (error) {
    console.error(`IPC error on ${channel}:`, error.message);
    return false;
  }
}

/**
 * Wraps an IPC invoke call that returns a nullable value.
 * @param {string} channel - The IPC channel to invoke
 * @param {...any} args - Arguments to pass to the handler
 * @returns {Promise} - Result or null on error
 */
async function safeInvokeNullable(channel, ...args) {
  try {
    return await ipcRenderer.invoke(channel, ...args);
  } catch (error) {
    console.error(`IPC error on ${channel}:`, error.message);
    return null;
  }
}

// Expose protected methods that allow the renderer process to use
// the ipcRenderer without exposing the entire object
contextBridge.exposeInMainWorld('electronAPI', {
  // Platform information
  platform: process.platform,

  // ============================================================
  // Steam Integration APIs
  // ============================================================

  // Steam status
  steam: {
    /**
     * Checks if Steam is available and initialized.
     * @returns {Promise<boolean>}
     */
    isAvailable: () => safeInvokeBoolean('steam:isAvailable'),

    /**
     * Gets the current Steam player name.
     * @returns {Promise<string|null>}
     */
    getPlayerName: () => safeInvokeNullable('steam:getPlayerName'),
  },

  // Steam Achievements API
  steamAchievements: {
    /**
     * Unlocks an achievement on Steam.
     * @param {string} id - The game's internal achievement ID
     * @returns {Promise<{success: boolean, error?: string, alreadyUnlocked?: boolean}>}
     */
    unlock: id => safeInvoke('steam:achievements:unlock', id),

    /**
     * Checks if an achievement is unlocked on Steam.
     * @param {string} id - The game's internal achievement ID
     * @returns {Promise<{success: boolean, unlocked: boolean, error?: string}>}
     */
    isUnlocked: id => safeInvoke('steam:achievements:isUnlocked', id),

    /**
     * Clears an achievement on Steam (development mode only).
     * @param {string} id - The game's internal achievement ID
     * @returns {Promise<{success: boolean, error?: string}>}
     */
    clear: id => safeInvoke('steam:achievements:clear', id),

    /**
     * Gets all achievement IDs that are mapped to Steam.
     * @returns {Promise<string[]>}
     */
    getAllMapped: async () => {
      try {
        return await ipcRenderer.invoke('steam:achievements:getAllMapped');
      } catch (error) {
        console.error('IPC error on steam:achievements:getAllMapped:', error.message);
        return [];
      }
    },
  },

  // Steam Cloud API
  steamCloud: {
    /**
     * Checks if Steam Cloud is available and enabled.
     * @returns {Promise<boolean>}
     */
    isAvailable: () => safeInvokeBoolean('steam:cloud:isAvailable'),

    /**
     * Saves data to Steam Cloud.
     * @param {string} key - The save key
     * @param {string} data - The data to save (typically JSON stringified)
     * @returns {Promise<{success: boolean, error?: string}>}
     */
    save: (key, data) => safeInvoke('steam:cloud:save', key, data),

    /**
     * Loads data from Steam Cloud.
     * @param {string} key - The save key
     * @returns {Promise<{success: boolean, data: string|null, error?: string}>}
     */
    load: async key => {
      try {
        return await ipcRenderer.invoke('steam:cloud:load', key);
      } catch (error) {
        console.error('IPC error on steam:cloud:load:', error.message);
        return { success: false, data: null, error: error.message };
      }
    },

    /**
     * Deletes a file from Steam Cloud.
     * @param {string} key - The save key
     * @returns {Promise<{success: boolean, error?: string}>}
     */
    delete: key => safeInvoke('steam:cloud:delete', key),

    /**
     * Lists all save files in Steam Cloud.
     * @returns {Promise<{success: boolean, files: Array<{key: string, filename: string, size: number}>, error?: string}>}
     */
    list: async () => {
      try {
        return await ipcRenderer.invoke('steam:cloud:list');
      } catch (error) {
        console.error('IPC error on steam:cloud:list:', error.message);
        return { success: false, files: [], error: error.message };
      }
    },

    /**
     * Gets the Steam Cloud quota information.
     * @returns {Promise<{success: boolean, totalBytes?: number, availableBytes?: number, error?: string}>}
     */
    getQuota: () => safeInvoke('steam:cloud:getQuota'),
  },

  // Steam Overlay API
  steamOverlay: {
    /**
     * Activates the Steam overlay with a specific dialog.
     * @param {string} [dialog='achievements'] - The dialog to show: 'friends', 'community', 'players', 'settings', 'officialgamegroup', 'stats', 'achievements'
     * @returns {Promise<{success: boolean, error?: string}>}
     */
    activate: (dialog = 'achievements') => safeInvoke('steam:overlay:activate', dialog),
  },

  // Steam Rich Presence API
  steamPresence: {
    /**
     * Sets a custom presence status string.
     * @param {string} status - The status to display in Steam
     * @returns {Promise<{success: boolean, error?: string}>}
     */
    set: (status) => safeInvoke('steam:presence:set', status),

    /**
     * Updates presence from game state (also updates tray status).
     * @param {Object} gameState - Current game state object
     * @returns {Promise<{success: boolean}>}
     */
    update: (gameState) => safeInvoke('steam:presence:update', gameState),

    /**
     * Clears the rich presence status.
     * @returns {Promise<{success: boolean, error?: string}>}
     */
    clear: () => safeInvoke('steam:presence:clear'),

    /**
     * Gets all predefined presence states.
     * @returns {Promise<Object>}
     */
    getStates: async () => {
      try {
        return await ipcRenderer.invoke('steam:presence:getStates');
      } catch (error) {
        console.error('IPC error on steam:presence:getStates:', error.message);
        return {};
      }
    },
  },

  // System Tray API
  tray: {
    /**
     * Sets whether the app should minimize to tray.
     * @param {boolean} enabled - Whether to enable minimize to tray
     * @returns {Promise<{success: boolean}>}
     */
    setMinimizeToTray: (enabled) => safeInvoke('tray:setMinimizeToTray', enabled),

    /**
     * Gets whether minimize to tray is enabled.
     * @returns {Promise<boolean>}
     */
    isMinimizeToTrayEnabled: () => safeInvokeBoolean('tray:isMinimizeToTrayEnabled'),

    /**
     * Updates the tray tooltip status.
     * @param {string} status - Status text for the tooltip
     * @returns {Promise<{success: boolean}>}
     */
    updateStatus: (status) => safeInvoke('tray:updateStatus', status),

    /**
     * Listen for new game requests from tray menu.
     * @param {Function} callback - Called when user clicks "New Game" in tray
     */
    onNewGame: (callback) => {
      try {
        ipcRenderer.on('tray:newGame', callback);
      } catch (error) {
        console.error('Failed to register tray:newGame listener:', error.message);
      }
    },
  },
});
