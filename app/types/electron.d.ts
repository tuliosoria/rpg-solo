/**
 * TypeScript type definitions for Electron IPC API.
 * These types describe the window.electronAPI object exposed by preload.js.
 */

export interface SteamAPI {
  /**
   * Checks if Steam is available and initialized.
   */
  isAvailable: () => Promise<boolean>;

  /**
   * Gets the current Steam player name.
   */
  getPlayerName: () => Promise<string | null>;
}

export interface SteamAchievementsAPI {
  /**
   * Unlocks an achievement on Steam.
   * @param id - The game's internal achievement ID
   */
  unlock: (
    id: string
  ) => Promise<{ success: boolean; error?: string; alreadyUnlocked?: boolean }>;

  /**
   * Checks if an achievement is unlocked on Steam.
   * @param id - The game's internal achievement ID
   */
  isUnlocked: (id: string) => Promise<{ success: boolean; unlocked: boolean; error?: string }>;

  /**
   * Clears an achievement on Steam (development mode only).
   * @param id - The game's internal achievement ID
   */
  clear: (id: string) => Promise<{ success: boolean; error?: string }>;

  /**
   * Gets all achievement IDs that are mapped to Steam.
   */
  getAllMapped: () => Promise<string[]>;
}

export interface SteamCloudAPI {
  /**
   * Checks if Steam Cloud is available and enabled.
   */
  isAvailable: () => Promise<boolean>;

  /**
   * Saves data to Steam Cloud.
   * @param key - The save key
   * @param data - The data to save (typically JSON stringified)
   */
  save: (
    key: string,
    data: string
  ) => Promise<{ success: boolean; filename?: string; error?: string }>;

  /**
   * Loads data from Steam Cloud.
   * @param key - The save key
   */
  load: (key: string) => Promise<{ success: boolean; data: string | null; error?: string }>;

  /**
   * Deletes a file from Steam Cloud.
   * @param key - The save key
   */
  delete: (key: string) => Promise<{ success: boolean; error?: string }>;

  /**
   * Lists all save files in Steam Cloud.
   */
  list: () => Promise<{
    success: boolean;
    files: Array<{ key: string; filename: string; size: number }>;
    error?: string;
  }>;

  /**
   * Gets the Steam Cloud quota information.
   */
  getQuota: () => Promise<{
    success: boolean;
    totalBytes?: number;
    availableBytes?: number;
    error?: string;
  }>;
}

export interface SteamOverlayAPI {
  /**
   * Activates the Steam overlay with a specific dialog.
   * @param dialog - The dialog to show: 'friends', 'community', 'players',
   *                 'settings', 'officialgamegroup', 'stats', 'achievements'
   */
  activate: (dialog?: string) => Promise<{ success: boolean; error?: string }>;
}

export interface SteamPresenceAPI {
  /**
   * Sets a custom presence status string.
   * @param status - The status to display in Steam
   */
  set: (status: string) => Promise<{ success: boolean; error?: string }>;

  /**
   * Updates presence from game state (also updates tray status).
   * @param gameState - Current game state object
   */
  update: (gameState: object) => Promise<{ success: boolean }>;

  /**
   * Clears the rich presence status.
   */
  clear: () => Promise<{ success: boolean; error?: string }>;

  /**
   * Gets all predefined presence states.
   */
  getStates: () => Promise<Record<string, string>>;
}

export interface TrayAPI {
  /**
   * Sets whether the app should minimize to tray.
   * @param enabled - Whether to enable minimize to tray
   */
  setMinimizeToTray: (enabled: boolean) => Promise<{ success: boolean }>;

  /**
   * Gets whether minimize to tray is enabled.
   */
  isMinimizeToTrayEnabled: () => Promise<boolean>;

  /**
   * Updates the tray tooltip status.
   * @param status - Status text for the tooltip
   */
  updateStatus: (status: string) => Promise<{ success: boolean }>;

  /**
   * Listen for new game requests from tray menu.
   * @param callback - Called when user clicks "New Game" in tray
   */
  onNewGame: (callback: () => void) => void;
}

export interface ElectronAPI {
  /**
   * The current platform (darwin, win32, linux).
   */
  platform: string;

  /**
   * Steam status APIs.
   */
  steam: SteamAPI;

  /**
   * Steam Achievements API.
   */
  steamAchievements: SteamAchievementsAPI;

  /**
   * Steam Cloud save API.
   */
  steamCloud: SteamCloudAPI;

  /**
   * Steam Overlay API.
   */
  steamOverlay: SteamOverlayAPI;

  /**
   * Steam Rich Presence API.
   */
  steamPresence: SteamPresenceAPI;

  /**
   * System tray API.
   */
  tray: TrayAPI;
}

declare global {
  interface Window {
    /**
     * Electron API exposed via contextBridge.
     * Only available when running in Electron.
     */
    electronAPI?: ElectronAPI;
  }
}

export {};
