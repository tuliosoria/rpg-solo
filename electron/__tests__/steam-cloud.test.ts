/**
 * Tests for Steam Cloud Bridge
 *
 * These tests mock the Steamworks client to test the cloud save
 * module without requiring Steam to be running.
 */

import { describe, it, expect, beforeEach, vi } from 'vitest';

// Mock the steamworks cloud API
const mockCloud = {
  isEnabledForApp: vi.fn(),
  isEnabledForAccount: vi.fn(),
  writeFile: vi.fn(),
  readFile: vi.fn(),
  isFileExists: vi.fn(),
  deleteFile: vi.fn(),
  getFileCount: vi.fn(),
  getFileNameAndSize: vi.fn(),
  getQuota: vi.fn(),
};

const mockSteamClient = {
  cloud: mockCloud,
};

// Import the module - use dynamic import for CommonJS compatibility
// eslint-disable-next-line @typescript-eslint/no-require-imports
const steamCloud = require('../steam-cloud') as typeof import('../steam-cloud');

describe('Steam Cloud Bridge', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    // Reset module state
    steamCloud.initialize(null);

    // Default mock returns - cloud enabled
    mockCloud.isEnabledForApp.mockReturnValue(true);
    mockCloud.isEnabledForAccount.mockReturnValue(true);
  });

  describe('CLOUD_SAVE_PREFIX', () => {
    it('has the expected prefix', () => {
      expect(steamCloud.CLOUD_SAVE_PREFIX).toBe('terminal1996_');
    });
  });

  describe('isAvailable', () => {
    it('returns false when Steam is not initialized', () => {
      expect(steamCloud.isAvailable()).toBe(false);
    });

    it('returns true when Steam Cloud is available and enabled', () => {
      steamCloud.initialize(mockSteamClient);
      expect(steamCloud.isAvailable()).toBe(true);
    });

    it('returns false when cloud is disabled for app', () => {
      steamCloud.initialize(mockSteamClient);
      mockCloud.isEnabledForApp.mockReturnValue(false);
      expect(steamCloud.isAvailable()).toBe(false);
    });

    it('returns false when cloud is disabled for account', () => {
      steamCloud.initialize(mockSteamClient);
      mockCloud.isEnabledForAccount.mockReturnValue(false);
      expect(steamCloud.isAvailable()).toBe(false);
    });
  });

  describe('save', () => {
    it('returns error when Steam is not initialized', () => {
      const result = steamCloud.save('savegame', '{"test": true}');
      expect(result.success).toBe(false);
      expect(result.error).toBe('Steam not initialized');
    });

    it('saves data to Steam Cloud with prefixed filename', () => {
      steamCloud.initialize(mockSteamClient);
      mockCloud.writeFile.mockReturnValue(true);

      const result = steamCloud.save('savegame', '{"test": true}');
      expect(result.success).toBe(true);
      expect(result.filename).toBe('terminal1996_savegame');
      expect(mockCloud.writeFile).toHaveBeenCalledWith('terminal1996_savegame', expect.any(Buffer));
    });

    it('returns error when cloud is disabled', () => {
      steamCloud.initialize(mockSteamClient);
      mockCloud.isEnabledForApp.mockReturnValue(false);

      const result = steamCloud.save('savegame', '{"test": true}');
      expect(result.success).toBe(false);
      expect(result.error).toBe('Steam Cloud is disabled');
    });

    it('handles write errors gracefully', () => {
      steamCloud.initialize(mockSteamClient);
      mockCloud.writeFile.mockImplementation(() => {
        throw new Error('Write failed');
      });

      const result = steamCloud.save('savegame', '{"test": true}');
      expect(result.success).toBe(false);
      expect(result.error).toBe('Write failed');
    });
  });

  describe('load', () => {
    it('returns error when Steam is not initialized', () => {
      const result = steamCloud.load('savegame');
      expect(result.success).toBe(false);
      expect(result.data).toBeNull();
      expect(result.error).toBe('Steam not initialized');
    });

    it('loads data from Steam Cloud', () => {
      steamCloud.initialize(mockSteamClient);
      mockCloud.isFileExists.mockReturnValue(true);
      mockCloud.readFile.mockReturnValue(Buffer.from('{"test": true}', 'utf-8'));

      const result = steamCloud.load('savegame');
      expect(result.success).toBe(true);
      expect(result.data).toBe('{"test": true}');
      expect(mockCloud.isFileExists).toHaveBeenCalledWith('terminal1996_savegame');
      expect(mockCloud.readFile).toHaveBeenCalledWith('terminal1996_savegame');
    });

    it('returns error when file does not exist', () => {
      steamCloud.initialize(mockSteamClient);
      mockCloud.isFileExists.mockReturnValue(false);

      const result = steamCloud.load('nonexistent');
      expect(result.success).toBe(false);
      expect(result.data).toBeNull();
      expect(result.error).toBe('File not found');
    });

    it('handles read errors gracefully', () => {
      steamCloud.initialize(mockSteamClient);
      mockCloud.isFileExists.mockReturnValue(true);
      mockCloud.readFile.mockReturnValue(null);

      const result = steamCloud.load('savegame');
      expect(result.success).toBe(false);
      expect(result.data).toBeNull();
      expect(result.error).toBe('Failed to read file');
    });
  });

  describe('deleteFile', () => {
    it('returns error when Steam is not initialized', () => {
      const result = steamCloud.deleteFile('savegame');
      expect(result.success).toBe(false);
      expect(result.error).toBe('Steam not initialized');
    });

    it('deletes file from Steam Cloud', () => {
      steamCloud.initialize(mockSteamClient);
      mockCloud.isFileExists.mockReturnValue(true);
      mockCloud.deleteFile.mockReturnValue(true);

      const result = steamCloud.deleteFile('savegame');
      expect(result.success).toBe(true);
      expect(mockCloud.deleteFile).toHaveBeenCalledWith('terminal1996_savegame');
    });

    it('returns success when file does not exist', () => {
      steamCloud.initialize(mockSteamClient);
      mockCloud.isFileExists.mockReturnValue(false);

      const result = steamCloud.deleteFile('nonexistent');
      expect(result.success).toBe(true);
      expect(mockCloud.deleteFile).not.toHaveBeenCalled();
    });
  });

  describe('listFiles', () => {
    it('returns error when Steam is not initialized', () => {
      const result = steamCloud.listFiles();
      expect(result.success).toBe(false);
      expect(result.files).toEqual([]);
      expect(result.error).toBe('Steam not initialized');
    });

    it('lists all save files with matching prefix', () => {
      steamCloud.initialize(mockSteamClient);
      mockCloud.getFileCount.mockReturnValue(3);
      mockCloud.getFileNameAndSize
        .mockReturnValueOnce({ name: 'terminal1996_save1', size: 1024 })
        .mockReturnValueOnce({ name: 'other_file', size: 512 })
        .mockReturnValueOnce({ name: 'terminal1996_autosave', size: 2048 });

      const result = steamCloud.listFiles();
      expect(result.success).toBe(true);
      expect(result.files.length).toBe(2);
      expect(result.files[0].key).toBe('save1');
      expect(result.files[0].filename).toBe('terminal1996_save1');
      expect(result.files[0].size).toBe(1024);
      expect(result.files[1].key).toBe('autosave');
    });
  });

  describe('getQuota', () => {
    it('returns error when Steam is not initialized', () => {
      const result = steamCloud.getQuota();
      expect(result.success).toBe(false);
      expect(result.error).toBe('Steam not initialized');
    });

    it('returns quota information', () => {
      steamCloud.initialize(mockSteamClient);
      mockCloud.getQuota.mockReturnValue({
        totalBytes: 1000000,
        availableBytes: 750000,
      });

      const result = steamCloud.getQuota();
      expect(result.success).toBe(true);
      expect(result.totalBytes).toBe(1000000);
      expect(result.availableBytes).toBe(750000);
    });
  });

  describe('graceful degradation', () => {
    it('handles null cloud API', () => {
      steamCloud.initialize({ cloud: null });

      // isAvailable returns false due to exception when calling methods on null
      expect(steamCloud.isAvailable()).toBeFalsy();

      const saveResult = steamCloud.save('test', 'data');
      expect(saveResult.success).toBe(false);
      expect(saveResult.error).toContain('not available');

      const loadResult = steamCloud.load('test');
      expect(loadResult.success).toBe(false);

      const listResult = steamCloud.listFiles();
      expect(listResult.success).toBe(false);
    });
  });
});
