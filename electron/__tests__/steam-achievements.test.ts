/**
 * Tests for Steam Achievements Bridge
 *
 * These tests mock the Steamworks client to test the achievements
 * module without requiring Steam to be running.
 */

import { describe, it, expect, beforeEach, vi } from 'vitest';

// Mock the steamworks client
const mockAchievement = {
  isActivated: vi.fn(),
  activate: vi.fn(),
  clear: vi.fn(),
};

const mockSteamClient = {
  achievement: mockAchievement,
};

// Import the module - use dynamic import for CommonJS compatibility
// eslint-disable-next-line @typescript-eslint/no-require-imports
const steamAchievements = require('../steam-achievements') as typeof import('../steam-achievements');

describe('Steam Achievements Bridge', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    // Reset module state by re-initializing with null
    steamAchievements.initialize(null);
  });

  describe('ACHIEVEMENT_MAP', () => {
    it('maps all game achievements to Steam names', () => {
      const map = steamAchievements.ACHIEVEMENT_MAP;

      // Verify key achievements are mapped
      expect(map.speed_demon).toBe('SPEED_DEMON');
      expect(map.ghost).toBe('GHOST_PROTOCOL');
      expect(map.completionist).toBe('COMPLETIONIST');
      expect(map.first_blood).toBe('FIRST_BLOOD');
      expect(map.truth_seeker).toBe('TRUTH_SEEKER');
    });

    it('has mappings for all expected achievements', () => {
      const expectedAchievements = [
        'speed_demon',
        'ghost',
        'completionist',
        'pacifist',
        'curious',
        'first_blood',
        'hacker',
        'survivor',
        'mathematician',
        'truth_seeker',
        'doom_fan',
        'persistent',
        'archivist',
        'paranoid',
        'bookworm',
        'night_owl',
      ];

      const map = steamAchievements.ACHIEVEMENT_MAP;
      expectedAchievements.forEach(id => {
        expect(map[id]).toBeDefined();
        expect(typeof map[id]).toBe('string');
      });
    });
  });

  describe('isAvailable', () => {
    it('returns false when Steam is not initialized', () => {
      expect(steamAchievements.isAvailable()).toBe(false);
    });

    it('returns true when Steam is initialized', () => {
      steamAchievements.initialize(mockSteamClient);
      expect(steamAchievements.isAvailable()).toBe(true);
    });
  });

  describe('getSteamAchievementName', () => {
    it('returns Steam name for valid game achievement ID', () => {
      expect(steamAchievements.getSteamAchievementName('speed_demon')).toBe('SPEED_DEMON');
      expect(steamAchievements.getSteamAchievementName('ghost')).toBe('GHOST_PROTOCOL');
    });

    it('returns null for unknown achievement ID', () => {
      expect(steamAchievements.getSteamAchievementName('nonexistent')).toBeNull();
    });
  });

  describe('unlock', () => {
    it('returns error when Steam is not initialized', () => {
      const result = steamAchievements.unlock('speed_demon');
      expect(result.success).toBe(false);
      expect(result.error).toBe('Steam not initialized');
    });

    it('returns error for unknown achievement ID', () => {
      steamAchievements.initialize(mockSteamClient);
      const result = steamAchievements.unlock('nonexistent');
      expect(result.success).toBe(false);
      expect(result.error).toContain('Unknown achievement');
    });

    it('returns already unlocked status if achievement was previously unlocked', () => {
      steamAchievements.initialize(mockSteamClient);
      mockAchievement.isActivated.mockReturnValue(true);

      const result = steamAchievements.unlock('speed_demon');
      expect(result.success).toBe(true);
      expect(result.alreadyUnlocked).toBe(true);
      expect(mockAchievement.activate).not.toHaveBeenCalled();
    });

    it('activates achievement on Steam when not already unlocked', () => {
      steamAchievements.initialize(mockSteamClient);
      mockAchievement.isActivated.mockReturnValue(false);
      mockAchievement.activate.mockReturnValue(true);

      const result = steamAchievements.unlock('speed_demon');
      expect(result.success).toBe(true);
      expect(result.steamName).toBe('SPEED_DEMON');
      expect(mockAchievement.activate).toHaveBeenCalledWith('SPEED_DEMON');
    });

    it('handles Steam API errors gracefully', () => {
      steamAchievements.initialize(mockSteamClient);
      mockAchievement.isActivated.mockImplementation(() => {
        throw new Error('Steam API error');
      });

      const result = steamAchievements.unlock('speed_demon');
      expect(result.success).toBe(false);
      expect(result.error).toBe('Steam API error');
    });
  });

  describe('isUnlocked', () => {
    it('returns error when Steam is not initialized', () => {
      const result = steamAchievements.isUnlocked('speed_demon');
      expect(result.success).toBe(false);
      expect(result.unlocked).toBe(false);
      expect(result.error).toBe('Steam not initialized');
    });

    it('returns unlocked status from Steam', () => {
      steamAchievements.initialize(mockSteamClient);
      mockAchievement.isActivated.mockReturnValue(true);

      const result = steamAchievements.isUnlocked('speed_demon');
      expect(result.success).toBe(true);
      expect(result.unlocked).toBe(true);
    });

    it('returns not unlocked status from Steam', () => {
      steamAchievements.initialize(mockSteamClient);
      mockAchievement.isActivated.mockReturnValue(false);

      const result = steamAchievements.isUnlocked('ghost');
      expect(result.success).toBe(true);
      expect(result.unlocked).toBe(false);
    });
  });

  describe('clear', () => {
    it('returns error when Steam is not initialized', () => {
      const result = steamAchievements.clear('speed_demon');
      expect(result.success).toBe(false);
      expect(result.error).toBe('Steam not initialized');
    });

    it('clears achievement on Steam', () => {
      steamAchievements.initialize(mockSteamClient);
      mockAchievement.clear.mockReturnValue(true);

      const result = steamAchievements.clear('speed_demon');
      expect(result.success).toBe(true);
      expect(mockAchievement.clear).toHaveBeenCalledWith('SPEED_DEMON');
    });
  });

  describe('getAllMappedAchievements', () => {
    it('returns all mapped achievement IDs', () => {
      const achievements = steamAchievements.getAllMappedAchievements();
      expect(Array.isArray(achievements)).toBe(true);
      expect(achievements).toContain('speed_demon');
      expect(achievements).toContain('ghost');
      expect(achievements).toContain('truth_seeker');
      expect(achievements.length).toBeGreaterThanOrEqual(16);
    });
  });

  describe('graceful degradation', () => {
    it('handles null achievement API', () => {
      steamAchievements.initialize({ achievement: null });

      const unlockResult = steamAchievements.unlock('speed_demon');
      expect(unlockResult.success).toBe(false);
      expect(unlockResult.error).toContain('not available');

      const isUnlockedResult = steamAchievements.isUnlocked('speed_demon');
      expect(isUnlockedResult.success).toBe(false);

      const clearResult = steamAchievements.clear('speed_demon');
      expect(clearResult.success).toBe(false);
    });
  });
});
