/**
 * Steam Bridge - Unified Steam API access with graceful fallbacks.
 *
 * This module provides a consistent interface for Steam functionality
 * that works both in Electron (with Steam) and in the browser (without).
 * All methods return meaningful fallback values when Steam is unavailable.
 *
 * @module lib/steamBridge
 */

import type { ElectronAPI } from '../types/electron';

// ============================================================
// Type Definitions
// ============================================================

export interface SteamBridgeResult {
  success: boolean;
  error?: string;
}

export interface AchievementUnlockResult extends SteamBridgeResult {
  alreadyUnlocked?: boolean;
}

export interface AchievementCheckResult extends SteamBridgeResult {
  unlocked: boolean;
}

export interface CloudSaveResult extends SteamBridgeResult {
  filename?: string;
}

export interface CloudLoadResult extends SteamBridgeResult {
  data: string | null;
}

export interface CloudFileInfo {
  key: string;
  filename: string;
  size: number;
}

export interface CloudListResult extends SteamBridgeResult {
  files: CloudFileInfo[];
}

export interface CloudQuotaResult extends SteamBridgeResult {
  totalBytes?: number;
  availableBytes?: number;
}

// ============================================================
// Helper Functions
// ============================================================

/**
 * Safely gets the electronAPI from the window object.
 * Returns null if not in Electron or API is unavailable.
 */
function getElectronAPI(): ElectronAPI | null {
  if (typeof window === 'undefined') {
    return null;
  }
  return window.electronAPI ?? null;
}

/**
 * Checks if we're running in Electron with Steam available.
 */
export async function isSteamAvailable(): Promise<boolean> {
  const api = getElectronAPI();
  if (!api?.steam) {
    return false;
  }
  try {
    return await api.steam.isAvailable();
  } catch (e) {
    console.error('Steam availability check failed:', e);
    return false;
  }
}

/**
 * Checks if we're running in Electron (regardless of Steam status).
 */
export function isElectron(): boolean {
  return getElectronAPI() !== null;
}

// ============================================================
// Steam Status
// ============================================================

/**
 * Gets the Steam player name.
 * @returns The player name, or null if unavailable.
 */
export async function getPlayerName(): Promise<string | null> {
  const api = getElectronAPI();
  if (!api?.steam) {
    return null;
  }
  try {
    return await api.steam.getPlayerName();
  } catch (e) {
    console.error('Failed to get Steam player name:', e);
    return null;
  }
}

// ============================================================
// Achievements
// ============================================================

/**
 * Unlocks an achievement on Steam.
 * Safe to call even when Steam is unavailable - will return success: false.
 *
 * @param id - The game's internal achievement ID
 * @returns Result indicating success or failure
 */
export async function unlockAchievement(id: string): Promise<AchievementUnlockResult> {
  const api = getElectronAPI();
  if (!api?.steamAchievements) {
    return { success: false, error: 'Steam not available' };
  }
  try {
    return await api.steamAchievements.unlock(id);
  } catch (e) {
    const error = e instanceof Error ? e.message : 'Unknown error';
    console.error('Steam achievement unlock failed:', error);
    return { success: false, error };
  }
}

/**
 * Checks if an achievement is unlocked on Steam.
 *
 * @param id - The achievement ID to check
 * @returns Result with unlocked status
 */
export async function isAchievementUnlocked(id: string): Promise<AchievementCheckResult> {
  const api = getElectronAPI();
  if (!api?.steamAchievements) {
    return { success: false, unlocked: false, error: 'Steam not available' };
  }
  try {
    return await api.steamAchievements.isUnlocked(id);
  } catch (e) {
    const error = e instanceof Error ? e.message : 'Unknown error';
    console.error('Steam achievement check failed:', error);
    return { success: false, unlocked: false, error };
  }
}

/**
 * Clears an achievement (development mode only).
 *
 * @param id - The achievement ID to clear
 * @returns Result indicating success or failure
 */
export async function clearAchievement(id: string): Promise<SteamBridgeResult> {
  const api = getElectronAPI();
  if (!api?.steamAchievements) {
    return { success: false, error: 'Steam not available' };
  }
  try {
    return await api.steamAchievements.clear(id);
  } catch (e) {
    const error = e instanceof Error ? e.message : 'Unknown error';
    console.error('Steam achievement clear failed:', error);
    return { success: false, error };
  }
}

/**
 * Gets all achievement IDs that are mapped to Steam.
 *
 * @returns Array of mapped achievement IDs
 */
export async function getMappedAchievements(): Promise<string[]> {
  const api = getElectronAPI();
  if (!api?.steamAchievements) {
    return [];
  }
  try {
    return await api.steamAchievements.getAllMapped();
  } catch (e) {
    console.error('Failed to get mapped achievements:', e);
    return [];
  }
}

// ============================================================
// Cloud Saves
// ============================================================

/**
 * Checks if Steam Cloud is available for saves.
 */
export async function isCloudAvailable(): Promise<boolean> {
  const api = getElectronAPI();
  if (!api?.steamCloud) {
    return false;
  }
  try {
    return await api.steamCloud.isAvailable();
  } catch (e) {
    console.error('Steam Cloud availability check failed:', e);
    return false;
  }
}

/**
 * Saves data to Steam Cloud.
 *
 * @param key - The save key (e.g., 'save_1', 'autosave')
 * @param data - The data to save (JSON string)
 * @returns Result indicating success or failure
 */
export async function cloudSave(key: string, data: string): Promise<CloudSaveResult> {
  const api = getElectronAPI();
  if (!api?.steamCloud) {
    return { success: false, error: 'Steam Cloud not available' };
  }
  try {
    return await api.steamCloud.save(key, data);
  } catch (e) {
    const error = e instanceof Error ? e.message : 'Unknown error';
    console.error('Steam Cloud save failed:', error);
    return { success: false, error };
  }
}

/**
 * Loads data from Steam Cloud.
 *
 * @param key - The save key
 * @returns Result with the loaded data (null if not found)
 */
export async function cloudLoad(key: string): Promise<CloudLoadResult> {
  const api = getElectronAPI();
  if (!api?.steamCloud) {
    return { success: false, data: null, error: 'Steam Cloud not available' };
  }
  try {
    return await api.steamCloud.load(key);
  } catch (e) {
    const error = e instanceof Error ? e.message : 'Unknown error';
    console.error('Steam Cloud load failed:', error);
    return { success: false, data: null, error };
  }
}

/**
 * Deletes a file from Steam Cloud.
 *
 * @param key - The save key to delete
 * @returns Result indicating success or failure
 */
export async function cloudDelete(key: string): Promise<SteamBridgeResult> {
  const api = getElectronAPI();
  if (!api?.steamCloud) {
    return { success: false, error: 'Steam Cloud not available' };
  }
  try {
    return await api.steamCloud.delete(key);
  } catch (e) {
    const error = e instanceof Error ? e.message : 'Unknown error';
    console.error('Steam Cloud delete failed:', error);
    return { success: false, error };
  }
}

/**
 * Lists all files in Steam Cloud.
 *
 * @returns Result with array of file info
 */
export async function cloudList(): Promise<CloudListResult> {
  const api = getElectronAPI();
  if (!api?.steamCloud) {
    return { success: false, files: [], error: 'Steam Cloud not available' };
  }
  try {
    return await api.steamCloud.list();
  } catch (e) {
    const error = e instanceof Error ? e.message : 'Unknown error';
    console.error('Steam Cloud list failed:', error);
    return { success: false, files: [], error };
  }
}

/**
 * Gets Steam Cloud quota information.
 *
 * @returns Result with quota info
 */
export async function cloudGetQuota(): Promise<CloudQuotaResult> {
  const api = getElectronAPI();
  if (!api?.steamCloud) {
    return { success: false, error: 'Steam Cloud not available' };
  }
  try {
    return await api.steamCloud.getQuota();
  } catch (e) {
    const error = e instanceof Error ? e.message : 'Unknown error';
    console.error('Steam Cloud quota check failed:', error);
    return { success: false, error };
  }
}

// ============================================================
// Rich Presence
// ============================================================

/**
 * Sets a custom Rich Presence status.
 *
 * @param status - The status string to display
 * @returns Result indicating success or failure
 */
export async function setPresence(status: string): Promise<SteamBridgeResult> {
  const api = getElectronAPI();
  if (!api?.steamPresence) {
    return { success: false, error: 'Steam Presence not available' };
  }
  try {
    return await api.steamPresence.set(status);
  } catch (e) {
    const error = e instanceof Error ? e.message : 'Unknown error';
    console.error('Steam Presence set failed:', error);
    return { success: false, error };
  }
}

/**
 * Updates Rich Presence from game state.
 * This also updates the system tray status.
 *
 * @param gameState - Current game state object
 * @returns Result indicating success
 */
export async function updatePresence(gameState: object): Promise<SteamBridgeResult> {
  const api = getElectronAPI();
  if (!api?.steamPresence) {
    return { success: false, error: 'Steam Presence not available' };
  }
  try {
    return await api.steamPresence.update(gameState);
  } catch (e) {
    const error = e instanceof Error ? e.message : 'Unknown error';
    console.error('Steam Presence update failed:', error);
    return { success: false, error };
  }
}

/**
 * Clears the Rich Presence status.
 *
 * @returns Result indicating success or failure
 */
export async function clearPresence(): Promise<SteamBridgeResult> {
  const api = getElectronAPI();
  if (!api?.steamPresence) {
    return { success: false, error: 'Steam Presence not available' };
  }
  try {
    return await api.steamPresence.clear();
  } catch (e) {
    const error = e instanceof Error ? e.message : 'Unknown error';
    console.error('Steam Presence clear failed:', error);
    return { success: false, error };
  }
}

/**
 * Gets all predefined presence states.
 *
 * @returns Object with presence state constants
 */
export async function getPresenceStates(): Promise<Record<string, string>> {
  const api = getElectronAPI();
  if (!api?.steamPresence) {
    return {};
  }
  try {
    return await api.steamPresence.getStates();
  } catch (e) {
    console.error('Failed to get presence states:', e);
    return {};
  }
}

// ============================================================
// Overlay
// ============================================================

/**
 * Activates the Steam overlay with a specific dialog.
 *
 * @param dialog - The dialog to show (default: 'achievements')
 * @returns Result indicating success or failure
 */
export async function activateOverlay(
  dialog: 'friends' | 'community' | 'players' | 'settings' | 'officialgamegroup' | 'stats' | 'achievements' = 'achievements'
): Promise<SteamBridgeResult> {
  const api = getElectronAPI();
  if (!api?.steamOverlay) {
    return { success: false, error: 'Steam Overlay not available' };
  }
  try {
    return await api.steamOverlay.activate(dialog);
  } catch (e) {
    const error = e instanceof Error ? e.message : 'Unknown error';
    console.error('Steam Overlay activation failed:', error);
    return { success: false, error };
  }
}

// ============================================================
// Tray
// ============================================================

/**
 * Sets whether the app should minimize to tray.
 *
 * @param enabled - Whether to enable minimize to tray
 * @returns Result indicating success
 */
export async function setMinimizeToTray(enabled: boolean): Promise<SteamBridgeResult> {
  const api = getElectronAPI();
  if (!api?.tray) {
    return { success: false, error: 'Tray not available' };
  }
  try {
    return await api.tray.setMinimizeToTray(enabled);
  } catch (e) {
    const error = e instanceof Error ? e.message : 'Unknown error';
    console.error('Set minimize to tray failed:', error);
    return { success: false, error };
  }
}

/**
 * Gets whether minimize to tray is enabled.
 *
 * @returns Whether minimize to tray is enabled
 */
export async function isMinimizeToTrayEnabled(): Promise<boolean> {
  const api = getElectronAPI();
  if (!api?.tray) {
    return false;
  }
  try {
    return await api.tray.isMinimizeToTrayEnabled();
  } catch (e) {
    console.error('Get minimize to tray state failed:', e);
    return false;
  }
}

/**
 * Updates the tray tooltip status.
 *
 * @param status - Status text for the tooltip
 * @returns Result indicating success
 */
export async function updateTrayStatus(status: string): Promise<SteamBridgeResult> {
  const api = getElectronAPI();
  if (!api?.tray) {
    return { success: false, error: 'Tray not available' };
  }
  try {
    return await api.tray.updateStatus(status);
  } catch (e) {
    const error = e instanceof Error ? e.message : 'Unknown error';
    console.error('Update tray status failed:', error);
    return { success: false, error };
  }
}

/**
 * Registers a callback for new game requests from tray.
 *
 * @param callback - Function to call when user clicks "New Game" in tray
 */
export function onTrayNewGame(callback: () => void): void {
  const api = getElectronAPI();
  if (!api?.tray) {
    return;
  }
  try {
    api.tray.onNewGame(callback);
  } catch (e) {
    console.error('Failed to register tray new game callback:', e);
  }
}

// ============================================================
// Export default object for convenience
// ============================================================

export const steamBridge = {
  // Status
  isSteamAvailable,
  isElectron,
  getPlayerName,

  // Achievements
  unlockAchievement,
  isAchievementUnlocked,
  clearAchievement,
  getMappedAchievements,

  // Cloud Saves
  isCloudAvailable,
  cloudSave,
  cloudLoad,
  cloudDelete,
  cloudList,
  cloudGetQuota,

  // Rich Presence
  setPresence,
  updatePresence,
  clearPresence,
  getPresenceStates,

  // Overlay
  activateOverlay,

  // Tray
  setMinimizeToTray,
  isMinimizeToTrayEnabled,
  updateTrayStatus,
  onTrayNewGame,
};

export default steamBridge;
