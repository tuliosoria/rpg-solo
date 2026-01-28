/**
 * Integration Tests for Steam Integration
 *
 * Tests the full integration flow including initialization,
 * achievement syncing, and cloud saves with mocked Steamworks.
 */

import { describe, it, expect, beforeEach, vi } from 'vitest';

// Mock steamworks.js module
const mockAchievement = {
  isActivated: vi.fn(),
  activate: vi.fn(),
  clear: vi.fn(),
};

const mockCloud = {
  isEnabledForApp: vi.fn().mockReturnValue(true),
  isEnabledForAccount: vi.fn().mockReturnValue(true),
  writeFile: vi.fn().mockReturnValue(true),
  readFile: vi.fn(),
  isFileExists: vi.fn(),
  deleteFile: vi.fn().mockReturnValue(true),
  getFileCount: vi.fn().mockReturnValue(0),
  getFileNameAndSize: vi.fn(),
  getQuota: vi.fn().mockReturnValue({ totalBytes: 1000000, availableBytes: 900000 }),
};

const mockOverlay = {
  activateDialog: vi.fn(),
};

const mockLocalPlayer = {
  getName: vi.fn().mockReturnValue('TestPlayer'),
};

const mockSteamClient = {
  achievement: mockAchievement,
  cloud: mockCloud,
  overlay: mockOverlay,
  localplayer: mockLocalPlayer,
};

// Import modules
const steamAchievements = require('../steam-achievements');
const steamCloud = require('../steam-cloud');

describe('Steam Integration', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    steamAchievements.initialize(null);
    steamCloud.initialize(null);
  });

  describe('Full initialization flow', () => {
    it('initializes all Steam modules when Steam is available', () => {
      // Simulate what main.js does during initialization
      steamAchievements.initialize(mockSteamClient);
      steamCloud.initialize(mockSteamClient);

      expect(steamAchievements.isAvailable()).toBe(true);
      expect(steamCloud.isAvailable()).toBe(true);
    });

    it('handles gracefully when Steam is not available', () => {
      // Simulate running without Steam
      steamAchievements.initialize(null);
      steamCloud.initialize(null);

      expect(steamAchievements.isAvailable()).toBe(false);
      expect(steamCloud.isAvailable()).toBe(false);

      // Operations should fail gracefully
      const unlockResult = steamAchievements.unlock('speed_demon');
      expect(unlockResult.success).toBe(false);
      expect(unlockResult.error).toBe('Steam not initialized');

      const saveResult = steamCloud.save('test', 'data');
      expect(saveResult.success).toBe(false);
    });
  });

  describe('Achievement sync workflow', () => {
    beforeEach(() => {
      steamAchievements.initialize(mockSteamClient);
    });

    it('syncs achievement unlock from game to Steam', () => {
      mockAchievement.isActivated.mockReturnValue(false);
      mockAchievement.activate.mockReturnValue(true);

      // Simulate game unlocking an achievement
      const result = steamAchievements.unlock('first_blood');

      expect(result.success).toBe(true);
      expect(mockAchievement.isActivated).toHaveBeenCalledWith('FIRST_BLOOD');
      expect(mockAchievement.activate).toHaveBeenCalledWith('FIRST_BLOOD');
    });

    it('does not re-unlock already unlocked achievements', () => {
      mockAchievement.isActivated.mockReturnValue(true);

      const result = steamAchievements.unlock('ghost');

      expect(result.success).toBe(true);
      expect(result.alreadyUnlocked).toBe(true);
      expect(mockAchievement.activate).not.toHaveBeenCalled();
    });

    it('can check achievement status from Steam', () => {
      mockAchievement.isActivated.mockReturnValue(true);

      const result = steamAchievements.isUnlocked('truth_seeker');

      expect(result.success).toBe(true);
      expect(result.unlocked).toBe(true);
    });
  });

  describe('Cloud save workflow', () => {
    beforeEach(() => {
      steamCloud.initialize(mockSteamClient);
    });

    it('saves game state to Steam Cloud', () => {
      const gameState = JSON.stringify({
        currentPath: '/home/ghost',
        truthsDiscovered: ['truth1', 'truth2'],
        detectionLevel: 25,
      });

      const result = steamCloud.save('autosave', gameState);

      expect(result.success).toBe(true);
      expect(mockCloud.writeFile).toHaveBeenCalledWith('terminal1996_autosave', expect.any(Buffer));
    });

    it('loads game state from Steam Cloud', () => {
      const gameState = {
        currentPath: '/home/ghost',
        truthsDiscovered: ['truth1', 'truth2'],
        detectionLevel: 25,
      };

      mockCloud.isFileExists.mockReturnValue(true);
      mockCloud.readFile.mockReturnValue(Buffer.from(JSON.stringify(gameState), 'utf-8'));

      const result = steamCloud.load('autosave');

      expect(result.success).toBe(true);
      expect(JSON.parse(result.data)).toEqual(gameState);
    });

    it('handles cloud save with localStorage fallback workflow', () => {
      // Initialize with cloud disabled
      mockCloud.isEnabledForApp.mockReturnValue(false);
      steamCloud.initialize(mockSteamClient);

      expect(steamCloud.isAvailable()).toBe(false);

      // Save would fail, game should fall back to localStorage
      const saveResult = steamCloud.save('savegame', '{}');
      expect(saveResult.success).toBe(false);
      expect(saveResult.error).toBe('Steam Cloud is disabled');

      // Load would also fail (file not found since cloud is disabled)
      mockCloud.isFileExists.mockReturnValue(false);
      const loadResult = steamCloud.load('savegame');
      expect(loadResult.success).toBe(false);
    });
  });

  describe('Multiple achievement unlocks', () => {
    beforeEach(() => {
      steamAchievements.initialize(mockSteamClient);
      mockAchievement.isActivated.mockReturnValue(false);
      mockAchievement.activate.mockReturnValue(true);
    });

    it('unlocks multiple achievements in sequence', () => {
      const achievementIds = ['first_blood', 'hacker', 'survivor', 'truth_seeker'];

      achievementIds.forEach(id => {
        const result = steamAchievements.unlock(id);
        expect(result.success).toBe(true);
      });

      expect(mockAchievement.activate).toHaveBeenCalledTimes(4);
    });
  });

  describe('Cloud file management', () => {
    beforeEach(() => {
      steamCloud.initialize(mockSteamClient);
    });

    it('lists and manages multiple save files', () => {
      // Setup mock file list
      mockCloud.getFileCount.mockReturnValue(3);
      mockCloud.getFileNameAndSize
        .mockReturnValueOnce({ name: 'terminal1996_save1', size: 1024 })
        .mockReturnValueOnce({ name: 'terminal1996_save2', size: 2048 })
        .mockReturnValueOnce({ name: 'terminal1996_autosave', size: 512 });

      const listResult = steamCloud.listFiles();
      expect(listResult.success).toBe(true);
      expect(listResult.files.length).toBe(3);

      // Delete old save
      mockCloud.isFileExists.mockReturnValue(true);
      const deleteResult = steamCloud.deleteFile('save1');
      expect(deleteResult.success).toBe(true);
      expect(mockCloud.deleteFile).toHaveBeenCalledWith('terminal1996_save1');
    });
  });

  describe('Error recovery', () => {
    it('recovers from temporary Steam API failures', () => {
      steamAchievements.initialize(mockSteamClient);

      // First call fails
      mockAchievement.isActivated.mockImplementationOnce(() => {
        throw new Error('Temporary network error');
      });

      const failedResult = steamAchievements.unlock('speed_demon');
      expect(failedResult.success).toBe(false);

      // Second call succeeds
      mockAchievement.isActivated.mockReturnValue(false);
      mockAchievement.activate.mockReturnValue(true);

      const successResult = steamAchievements.unlock('speed_demon');
      expect(successResult.success).toBe(true);
    });

    it('handles cloud quota exceeded scenario', () => {
      // Re-enable cloud for this test
      mockCloud.isEnabledForApp.mockReturnValue(true);
      mockCloud.isEnabledForAccount.mockReturnValue(true);
      steamCloud.initialize(mockSteamClient);

      mockCloud.writeFile.mockImplementation(() => {
        throw new Error('Quota exceeded');
      });

      const result = steamCloud.save('largesave', 'x'.repeat(10000));
      expect(result.success).toBe(false);
      expect(result.error).toBe('Quota exceeded');

      // Quota check still works
      mockCloud.getQuota.mockReturnValue({ totalBytes: 1000, availableBytes: 0 });
      const quotaResult = steamCloud.getQuota();
      expect(quotaResult.availableBytes).toBe(0);
    });
  });
});
