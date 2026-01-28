/**
 * Steam Achievements Bridge
 *
 * Maps game achievement IDs to Steam achievement names and provides
 * functions to sync achievements with Steam.
 */

// Mapping from game achievement IDs to Steam achievement API names
// Steam achievement names are typically uppercase with underscores
const ACHIEVEMENT_MAP = {
  speed_demon: 'SPEED_DEMON',
  ghost: 'GHOST_PROTOCOL',
  completionist: 'COMPLETIONIST',
  pacifist: 'PACIFIST',
  curious: 'CURIOUS_MIND',
  first_blood: 'FIRST_BLOOD',
  hacker: 'ELITE_HACKER',
  survivor: 'SURVIVOR',
  mathematician: 'MATHEMATICIAN',
  truth_seeker: 'TRUTH_SEEKER',
  doom_fan: 'IDDQD',
  persistent: 'PERSISTENT',
  archivist: 'ARCHIVIST',
  paranoid: 'PARANOID',
  bookworm: 'BOOKWORM',
  night_owl: 'NIGHT_OWL',
};

let steamworksClient = null;

/**
 * Initializes the Steam achievements module with the Steamworks client.
 * @param {Object} client - The initialized Steamworks client
 */
function initialize(client) {
  steamworksClient = client;
}

/**
 * Checks if Steam achievements are available.
 * @returns {boolean} True if Steam client is initialized
 */
function isAvailable() {
  return steamworksClient !== null;
}

/**
 * Gets the Steam achievement name for a game achievement ID.
 * @param {string} gameAchievementId - The game's internal achievement ID
 * @returns {string|null} The Steam achievement name, or null if not mapped
 */
function getSteamAchievementName(gameAchievementId) {
  return ACHIEVEMENT_MAP[gameAchievementId] || null;
}

/**
 * Unlocks an achievement on Steam.
 * @param {string} gameAchievementId - The game's internal achievement ID
 * @returns {Object} Result object with success status and any error message
 */
function unlock(gameAchievementId) {
  if (!steamworksClient) {
    return { success: false, error: 'Steam not initialized' };
  }

  const steamName = getSteamAchievementName(gameAchievementId);
  if (!steamName) {
    return { success: false, error: `Unknown achievement: ${gameAchievementId}` };
  }

  try {
    const achievement = steamworksClient.achievement;
    if (!achievement) {
      return { success: false, error: 'Steam achievements API not available' };
    }

    // Check if already unlocked
    if (achievement.isActivated(steamName)) {
      return { success: true, alreadyUnlocked: true };
    }

    // Activate the achievement
    const result = achievement.activate(steamName);
    return { success: result, steamName };
  } catch (error) {
    return { success: false, error: error.message };
  }
}

/**
 * Checks if an achievement is unlocked on Steam.
 * @param {string} gameAchievementId - The game's internal achievement ID
 * @returns {Object} Result object with unlocked status
 */
function isUnlocked(gameAchievementId) {
  if (!steamworksClient) {
    return { success: false, unlocked: false, error: 'Steam not initialized' };
  }

  const steamName = getSteamAchievementName(gameAchievementId);
  if (!steamName) {
    return { success: false, unlocked: false, error: `Unknown achievement: ${gameAchievementId}` };
  }

  try {
    const achievement = steamworksClient.achievement;
    if (!achievement) {
      return { success: false, unlocked: false, error: 'Steam achievements API not available' };
    }

    const unlocked = achievement.isActivated(steamName);
    return { success: true, unlocked };
  } catch (error) {
    return { success: false, unlocked: false, error: error.message };
  }
}

/**
 * Clears an achievement on Steam (for testing purposes).
 * @param {string} gameAchievementId - The game's internal achievement ID
 * @returns {Object} Result object with success status
 */
function clear(gameAchievementId) {
  if (!steamworksClient) {
    return { success: false, error: 'Steam not initialized' };
  }

  const steamName = getSteamAchievementName(gameAchievementId);
  if (!steamName) {
    return { success: false, error: `Unknown achievement: ${gameAchievementId}` };
  }

  try {
    const achievement = steamworksClient.achievement;
    if (!achievement) {
      return { success: false, error: 'Steam achievements API not available' };
    }

    const result = achievement.clear(steamName);
    return { success: result };
  } catch (error) {
    return { success: false, error: error.message };
  }
}

/**
 * Gets all achievement IDs that are mapped to Steam.
 * @returns {string[]} Array of game achievement IDs
 */
function getAllMappedAchievements() {
  return Object.keys(ACHIEVEMENT_MAP);
}

module.exports = {
  initialize,
  isAvailable,
  getSteamAchievementName,
  unlock,
  isUnlocked,
  clear,
  getAllMappedAchievements,
  ACHIEVEMENT_MAP,
};
