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
});
