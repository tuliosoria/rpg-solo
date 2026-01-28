/**
 * Steam Cloud Saves Bridge
 *
 * Provides cloud save functionality using Steam Cloud storage.
 * Falls back gracefully when Steam is not available.
 */

let steamworksClient = null;

// File name prefix for cloud saves
const CLOUD_SAVE_PREFIX = 'terminal1996_';

/**
 * Initializes the Steam Cloud module with the Steamworks client.
 * @param {Object} client - The initialized Steamworks client
 */
function initialize(client) {
  steamworksClient = client;
}

/**
 * Checks if Steam Cloud is available.
 * @returns {boolean} True if Steam client is initialized and cloud is enabled
 */
function isAvailable() {
  if (!steamworksClient) return false;

  try {
    const cloud = steamworksClient.cloud;
    return cloud && cloud.isEnabledForApp() && cloud.isEnabledForAccount();
  } catch {
    return false;
  }
}

/**
 * Saves data to Steam Cloud.
 * @param {string} key - The save key (will be prefixed with CLOUD_SAVE_PREFIX)
 * @param {string} data - The data to save (typically JSON stringified)
 * @returns {Object} Result object with success status
 */
function save(key, data) {
  if (!steamworksClient) {
    return { success: false, error: 'Steam not initialized' };
  }

  try {
    const cloud = steamworksClient.cloud;
    if (!cloud) {
      return { success: false, error: 'Steam Cloud API not available' };
    }

    if (!cloud.isEnabledForApp() || !cloud.isEnabledForAccount()) {
      return { success: false, error: 'Steam Cloud is disabled' };
    }

    const filename = CLOUD_SAVE_PREFIX + key;
    const buffer = Buffer.from(data, 'utf-8');

    const result = cloud.writeFile(filename, buffer);
    return { success: result, filename };
  } catch (error) {
    return { success: false, error: error.message };
  }
}

/**
 * Loads data from Steam Cloud.
 * @param {string} key - The save key (will be prefixed with CLOUD_SAVE_PREFIX)
 * @returns {Object} Result object with success status and data if successful
 */
function load(key) {
  if (!steamworksClient) {
    return { success: false, data: null, error: 'Steam not initialized' };
  }

  try {
    const cloud = steamworksClient.cloud;
    if (!cloud) {
      return { success: false, data: null, error: 'Steam Cloud API not available' };
    }

    const filename = CLOUD_SAVE_PREFIX + key;

    // Check if file exists
    if (!cloud.isFileExists(filename)) {
      return { success: false, data: null, error: 'File not found' };
    }

    const buffer = cloud.readFile(filename);
    if (!buffer) {
      return { success: false, data: null, error: 'Failed to read file' };
    }

    const data = buffer.toString('utf-8');
    return { success: true, data };
  } catch (error) {
    return { success: false, data: null, error: error.message };
  }
}

/**
 * Deletes a file from Steam Cloud.
 * @param {string} key - The save key (will be prefixed with CLOUD_SAVE_PREFIX)
 * @returns {Object} Result object with success status
 */
function deleteFile(key) {
  if (!steamworksClient) {
    return { success: false, error: 'Steam not initialized' };
  }

  try {
    const cloud = steamworksClient.cloud;
    if (!cloud) {
      return { success: false, error: 'Steam Cloud API not available' };
    }

    const filename = CLOUD_SAVE_PREFIX + key;

    if (!cloud.isFileExists(filename)) {
      // File doesn't exist, which is fine for delete - return success
      return { success: true };
    }

    const result = cloud.deleteFile(filename);
    return { success: result };
  } catch (error) {
    return { success: false, error: error.message };
  }
}

/**
 * Lists all save files in Steam Cloud for this game.
 * @returns {Object} Result object with success status and files array
 */
function listFiles() {
  if (!steamworksClient) {
    return { success: false, files: [], error: 'Steam not initialized' };
  }

  try {
    const cloud = steamworksClient.cloud;
    if (!cloud) {
      return { success: false, files: [], error: 'Steam Cloud API not available' };
    }

    const fileCount = cloud.getFileCount();
    const files = [];

    for (let i = 0; i < fileCount; i++) {
      const { name, size } = cloud.getFileNameAndSize(i);
      if (name.startsWith(CLOUD_SAVE_PREFIX)) {
        files.push({
          key: name.substring(CLOUD_SAVE_PREFIX.length),
          filename: name,
          size,
        });
      }
    }

    return { success: true, files };
  } catch (error) {
    return { success: false, files: [], error: error.message };
  }
}

/**
 * Gets the available quota for Steam Cloud.
 * @returns {Object} Result object with total and available bytes
 */
function getQuota() {
  if (!steamworksClient) {
    return { success: false, error: 'Steam not initialized' };
  }

  try {
    const cloud = steamworksClient.cloud;
    if (!cloud) {
      return { success: false, error: 'Steam Cloud API not available' };
    }

    const { totalBytes, availableBytes } = cloud.getQuota();
    return { success: true, totalBytes, availableBytes };
  } catch (error) {
    return { success: false, error: error.message };
  }
}

module.exports = {
  initialize,
  isAvailable,
  save,
  load,
  deleteFile,
  listFiles,
  getQuota,
  CLOUD_SAVE_PREFIX,
};
