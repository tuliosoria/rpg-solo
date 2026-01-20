import { describe, it, expect, beforeEach, vi } from 'vitest';
import {
  ACHIEVEMENTS,
  getUnlockedAchievements,
  saveAchievements,
  unlockAchievement,
  clearAchievements,
  getAchievement,
  getAllAchievementsWithStatus,
} from '../achievements';

// Mock localStorage
const localStorageMock = (() => {
  let store: Record<string, string> = {};
  return {
    getItem: (key: string) => store[key] || null,
    setItem: (key: string, value: string) => { store[key] = value; },
    removeItem: (key: string) => { delete store[key]; },
    clear: () => { store = {}; },
  };
})();

Object.defineProperty(global, 'localStorage', { value: localStorageMock });

describe('Achievements', () => {
  beforeEach(() => {
    localStorageMock.clear();
  });

  describe('ACHIEVEMENTS constant', () => {
    it('contains expected achievements', () => {
      expect(ACHIEVEMENTS.length).toBeGreaterThanOrEqual(10);
      expect(ACHIEVEMENTS.find(a => a.id === 'speed_demon')).toBeDefined();
      expect(ACHIEVEMENTS.find(a => a.id === 'ghost')).toBeDefined();
      expect(ACHIEVEMENTS.find(a => a.id === 'truth_seeker')).toBeDefined();
    });

    it('has unique IDs', () => {
      const ids = ACHIEVEMENTS.map(a => a.id);
      const uniqueIds = new Set(ids);
      expect(uniqueIds.size).toBe(ids.length);
    });

    it('has required properties for each achievement', () => {
      ACHIEVEMENTS.forEach(a => {
        expect(a.id).toBeTruthy();
        expect(a.name).toBeTruthy();
        expect(a.description).toBeTruthy();
        expect(a.icon).toBeTruthy();
      });
    });
  });

  describe('getUnlockedAchievements', () => {
    it('returns empty set when no achievements unlocked', () => {
      const unlocked = getUnlockedAchievements();
      expect(unlocked.size).toBe(0);
    });

    it('returns stored achievements', () => {
      localStorageMock.setItem('rpg-solo-achievements', JSON.stringify(['speed_demon', 'ghost']));
      const unlocked = getUnlockedAchievements();
      expect(unlocked.has('speed_demon')).toBe(true);
      expect(unlocked.has('ghost')).toBe(true);
      expect(unlocked.size).toBe(2);
    });

    it('handles invalid JSON gracefully', () => {
      localStorageMock.setItem('rpg-solo-achievements', 'invalid json');
      const unlocked = getUnlockedAchievements();
      expect(unlocked.size).toBe(0);
    });
  });

  describe('saveAchievements', () => {
    it('saves achievements to localStorage', () => {
      const achievements = new Set(['speed_demon', 'ghost']);
      saveAchievements(achievements);
      
      const stored = JSON.parse(localStorageMock.getItem('rpg-solo-achievements')!);
      expect(stored).toContain('speed_demon');
      expect(stored).toContain('ghost');
    });
  });

  describe('unlockAchievement', () => {
    it('unlocks a new achievement', () => {
      const result = unlockAchievement('speed_demon');
      
      expect(result).not.toBeNull();
      expect(result!.achievement.id).toBe('speed_demon');
      expect(result!.isNew).toBe(true);
    });

    it('returns isNew: false for already unlocked achievement', () => {
      unlockAchievement('speed_demon');
      const result = unlockAchievement('speed_demon');
      
      expect(result).not.toBeNull();
      expect(result!.isNew).toBe(false);
    });

    it('returns null for invalid achievement ID', () => {
      const result = unlockAchievement('nonexistent_achievement');
      expect(result).toBeNull();
    });

    it('persists unlocked achievements', () => {
      unlockAchievement('speed_demon');
      unlockAchievement('ghost');
      
      const unlocked = getUnlockedAchievements();
      expect(unlocked.has('speed_demon')).toBe(true);
      expect(unlocked.has('ghost')).toBe(true);
    });
  });

  describe('clearAchievements', () => {
    it('removes all achievements from storage', () => {
      unlockAchievement('speed_demon');
      unlockAchievement('ghost');
      
      clearAchievements();
      
      const unlocked = getUnlockedAchievements();
      expect(unlocked.size).toBe(0);
    });
  });

  describe('getAchievement', () => {
    it('returns achievement by ID', () => {
      const achievement = getAchievement('speed_demon');
      expect(achievement).toBeDefined();
      expect(achievement!.name).toBe('Speed Demon');
    });

    it('returns undefined for invalid ID', () => {
      const achievement = getAchievement('nonexistent');
      expect(achievement).toBeUndefined();
    });
  });

  describe('getAllAchievementsWithStatus', () => {
    it('returns all achievements with unlocked status', () => {
      unlockAchievement('speed_demon');
      
      const all = getAllAchievementsWithStatus();
      
      expect(all.length).toBe(ACHIEVEMENTS.length);
      
      const speedDemon = all.find(a => a.id === 'speed_demon');
      expect(speedDemon!.unlocked).toBe(true);
      
      const ghost = all.find(a => a.id === 'ghost');
      expect(ghost!.unlocked).toBe(false);
    });
  });
});
