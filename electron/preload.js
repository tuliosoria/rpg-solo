const { contextBridge, ipcRenderer } = require('electron');

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
    isAvailable: () => ipcRenderer.invoke('steam:isAvailable'),

    /**
     * Gets the current Steam player name.
     * @returns {Promise<string|null>}
     */
    getPlayerName: () => ipcRenderer.invoke('steam:getPlayerName'),
  },

  // Steam Achievements API
  steamAchievements: {
    /**
     * Unlocks an achievement on Steam.
     * @param {string} id - The game's internal achievement ID
     * @returns {Promise<{success: boolean, error?: string, alreadyUnlocked?: boolean}>}
     */
    unlock: id => ipcRenderer.invoke('steam:achievements:unlock', id),

    /**
     * Checks if an achievement is unlocked on Steam.
     * @param {string} id - The game's internal achievement ID
     * @returns {Promise<{success: boolean, unlocked: boolean, error?: string}>}
     */
    isUnlocked: id => ipcRenderer.invoke('steam:achievements:isUnlocked', id),

    /**
     * Clears an achievement on Steam (development mode only).
     * @param {string} id - The game's internal achievement ID
     * @returns {Promise<{success: boolean, error?: string}>}
     */
    clear: id => ipcRenderer.invoke('steam:achievements:clear', id),

    /**
     * Gets all achievement IDs that are mapped to Steam.
     * @returns {Promise<string[]>}
     */
    getAllMapped: () => ipcRenderer.invoke('steam:achievements:getAllMapped'),
  },

  // Steam Cloud API
  steamCloud: {
    /**
     * Checks if Steam Cloud is available and enabled.
     * @returns {Promise<boolean>}
     */
    isAvailable: () => ipcRenderer.invoke('steam:cloud:isAvailable'),

    /**
     * Saves data to Steam Cloud.
     * @param {string} key - The save key
     * @param {string} data - The data to save (typically JSON stringified)
     * @returns {Promise<{success: boolean, error?: string}>}
     */
    save: (key, data) => ipcRenderer.invoke('steam:cloud:save', key, data),

    /**
     * Loads data from Steam Cloud.
     * @param {string} key - The save key
     * @returns {Promise<{success: boolean, data: string|null, error?: string}>}
     */
    load: key => ipcRenderer.invoke('steam:cloud:load', key),

    /**
     * Deletes a file from Steam Cloud.
     * @param {string} key - The save key
     * @returns {Promise<{success: boolean, error?: string}>}
     */
    delete: key => ipcRenderer.invoke('steam:cloud:delete', key),

    /**
     * Lists all save files in Steam Cloud.
     * @returns {Promise<{success: boolean, files: Array<{key: string, filename: string, size: number}>, error?: string}>}
     */
    list: () => ipcRenderer.invoke('steam:cloud:list'),

    /**
     * Gets the Steam Cloud quota information.
     * @returns {Promise<{success: boolean, totalBytes?: number, availableBytes?: number, error?: string}>}
     */
    getQuota: () => ipcRenderer.invoke('steam:cloud:getQuota'),
  },

  // Steam Overlay API
  steamOverlay: {
    /**
     * Activates the Steam overlay with a specific dialog.
     * @param {string} [dialog='achievements'] - The dialog to show: 'friends', 'community', 'players', 'settings', 'officialgamegroup', 'stats', 'achievements'
     * @returns {Promise<{success: boolean, error?: string}>}
     */
    activate: (dialog = 'achievements') => ipcRenderer.invoke('steam:overlay:activate', dialog),
  },

  // Steam Rich Presence API
  steamPresence: {
    /**
     * Sets a custom presence status string.
     * @param {string} status - The status to display in Steam
     * @returns {Promise<{success: boolean, error?: string}>}
     */
    set: (status) => ipcRenderer.invoke('steam:presence:set', status),

    /**
     * Updates presence from game state (also updates tray status).
     * @param {Object} gameState - Current game state object
     * @returns {Promise<{success: boolean}>}
     */
    update: (gameState) => ipcRenderer.invoke('steam:presence:update', gameState),

    /**
     * Clears the rich presence status.
     * @returns {Promise<{success: boolean, error?: string}>}
     */
    clear: () => ipcRenderer.invoke('steam:presence:clear'),

    /**
     * Gets all predefined presence states.
     * @returns {Promise<Object>}
     */
    getStates: () => ipcRenderer.invoke('steam:presence:getStates'),
  },

  // System Tray API
  tray: {
    /**
     * Sets whether the app should minimize to tray.
     * @param {boolean} enabled - Whether to enable minimize to tray
     * @returns {Promise<{success: boolean}>}
     */
    setMinimizeToTray: (enabled) => ipcRenderer.invoke('tray:setMinimizeToTray', enabled),

    /**
     * Gets whether minimize to tray is enabled.
     * @returns {Promise<boolean>}
     */
    isMinimizeToTrayEnabled: () => ipcRenderer.invoke('tray:isMinimizeToTrayEnabled'),

    /**
     * Updates the tray tooltip status.
     * @param {string} status - Status text for the tooltip
     * @returns {Promise<{success: boolean}>}
     */
    updateStatus: (status) => ipcRenderer.invoke('tray:updateStatus', status),

    /**
     * Listen for new game requests from tray menu.
     * @param {Function} callback - Called when user clicks "New Game" in tray
     */
    onNewGame: (callback) => ipcRenderer.on('tray:newGame', callback),
  },
});
