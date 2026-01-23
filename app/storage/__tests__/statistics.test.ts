import { describe, it, expect, beforeEach, vi } from 'vitest';

// We need to isolate tests by clearing localStorage before each test
// and by resetting the module state

describe('Statistics Storage', () => {
  // Store for mock
  let mockStore: Record<string, string> = {};

  beforeEach(async () => {
    // Clear the mock store
    mockStore = {};
    
    // Reset modules to ensure fresh imports
    vi.resetModules();
    
    // Create fresh mock
    const mockLocalStorage = {
      getItem: (key: string) => mockStore[key] || null,
      setItem: (key: string, value: string) => { mockStore[key] = value; },
      removeItem: (key: string) => { delete mockStore[key]; },
      clear: () => { mockStore = {}; },
      length: 0,
      key: () => null,
    };
    
    // Mock localStorage globally
    vi.stubGlobal('localStorage', mockLocalStorage);
  });

  describe('getStatistics', () => {
    it('returns default statistics when localStorage is empty', async () => {
      const { getStatistics } = await import('../statistics');
      const stats = getStatistics();
      
      expect(stats.totalPlaytime).toBe(0);
      expect(stats.gamesPlayed).toBe(0);
      expect(stats.gamesCompleted).toBe(0);
      expect(stats.filesRead).toBe(0);
      expect(stats.commandsTyped).toBe(0);
      expect(stats.endingsAchieved.good).toBe(0);
      expect(stats.endingsAchieved.bad).toBe(0);
      expect(stats.endingsAchieved.neutral).toBe(0);
      expect(stats.endingsAchieved.secret).toBe(0);
      expect(stats.highestDetectionSurvived).toBe(0);
      expect(stats.fastestCompletion).toBeNull();
    });

    it('returns stored statistics from localStorage', async () => {
      const { getStatistics } = await import('../statistics');
      
      const stored = {
        totalPlaytime: 3600000,
        gamesPlayed: 5,
        gamesCompleted: 3,
        filesRead: 42,
        commandsTyped: 150,
        endingsAchieved: { good: 2, bad: 1, neutral: 0, secret: 0 },
        highestDetectionSurvived: 85,
        fastestCompletion: 45,
        lastPlayed: 1234567890,
      };
      mockStore['rpg-solo-statistics'] = JSON.stringify(stored);
      
      const stats = getStatistics();
      
      expect(stats.totalPlaytime).toBe(3600000);
      expect(stats.gamesPlayed).toBe(5);
      expect(stats.gamesCompleted).toBe(3);
      expect(stats.endingsAchieved.good).toBe(2);
      expect(stats.fastestCompletion).toBe(45);
    });

    it('merges stored data with defaults for new fields', async () => {
      const { getStatistics } = await import('../statistics');
      
      // Simulate old data missing some fields
      const oldStored = {
        gamesPlayed: 10,
        gamesCompleted: 5,
      };
      mockStore['rpg-solo-statistics'] = JSON.stringify(oldStored);
      
      const stats = getStatistics();
      
      expect(stats.gamesPlayed).toBe(10);
      expect(stats.gamesCompleted).toBe(5);
      // New fields should have defaults
      expect(stats.totalPlaytime).toBe(0);
      expect(stats.highestDetectionSurvived).toBe(0);
    });

    it('returns defaults on JSON parse error', async () => {
      const { getStatistics } = await import('../statistics');
      
      mockStore['rpg-solo-statistics'] = 'invalid json';
      
      const stats = getStatistics();
      
      expect(stats.gamesPlayed).toBe(0);
    });
  });

  describe('saveStatistics', () => {
    it('saves statistics to localStorage', async () => {
      const { saveStatistics } = await import('../statistics');
      
      const stats = {
        totalPlaytime: 1000,
        gamesPlayed: 1,
        gamesCompleted: 0,
        filesRead: 5,
        commandsTyped: 20,
        endingsAchieved: { good: 0, bad: 0, neutral: 0, secret: 0 },
        highestDetectionSurvived: 30,
        fastestCompletion: null,
        lastPlayed: Date.now(),
      };
      
      saveStatistics(stats);
      
      const storedRaw = mockStore['rpg-solo-statistics'];
      expect(storedRaw).toBeTruthy();
      const stored = JSON.parse(storedRaw!);
      expect(stored.gamesPlayed).toBe(1);
      expect(stored.filesRead).toBe(5);
    });
  });

  describe('updateStatistics', () => {
    it('updates specific fields and preserves others', async () => {
      const { updateStatistics } = await import('../statistics');
      
      const initial = {
        totalPlaytime: 1000,
        gamesPlayed: 5,
        gamesCompleted: 3,
        filesRead: 20,
        commandsTyped: 100,
        endingsAchieved: { good: 2, bad: 1, neutral: 0, secret: 0 },
        highestDetectionSurvived: 50,
        fastestCompletion: 60,
        lastPlayed: 1000,
      };
      mockStore['rpg-solo-statistics'] = JSON.stringify(initial);
      
      const updated = updateStatistics({ gamesPlayed: 6, filesRead: 25 });
      
      expect(updated.gamesPlayed).toBe(6);
      expect(updated.filesRead).toBe(25);
      expect(updated.gamesCompleted).toBe(3); // Preserved
      expect(updated.commandsTyped).toBe(100); // Preserved
      expect(updated.lastPlayed).toBeGreaterThan(1000); // Updated to now
    });
  });

  describe('incrementStatistic', () => {
    it('increments gamesPlayed', async () => {
      const { incrementStatistic, getStatistics } = await import('../statistics');
      
      incrementStatistic('gamesPlayed');
      
      const stats = getStatistics();
      expect(stats.gamesPlayed).toBe(1);
    });

    it('increments filesRead', async () => {
      const { incrementStatistic, getStatistics } = await import('../statistics');
      
      incrementStatistic('filesRead');
      incrementStatistic('filesRead');
      incrementStatistic('filesRead');
      
      const stats = getStatistics();
      expect(stats.filesRead).toBe(3);
    });

    it('increments commandsTyped', async () => {
      const { incrementStatistic, getStatistics } = await import('../statistics');
      
      incrementStatistic('commandsTyped');
      
      const stats = getStatistics();
      expect(stats.commandsTyped).toBe(1);
    });
  });

  describe('recordEnding', () => {
    it('records good ending and increments gamesCompleted', async () => {
      const { recordEnding, getStatistics } = await import('../statistics');
      
      recordEnding('good', 50, 30);
      
      const stats = getStatistics();
      expect(stats.endingsAchieved.good).toBe(1);
      expect(stats.gamesCompleted).toBe(1);
    });

    it('records bad ending', async () => {
      const { recordEnding, getStatistics } = await import('../statistics');
      
      recordEnding('bad', 100, 100);
      
      const stats = getStatistics();
      expect(stats.endingsAchieved.bad).toBe(1);
    });

    it('records neutral ending', async () => {
      const { recordEnding, getStatistics } = await import('../statistics');
      
      recordEnding('neutral', 75, 60);
      
      const stats = getStatistics();
      expect(stats.endingsAchieved.neutral).toBe(1);
    });

    it('records secret ending', async () => {
      const { recordEnding, getStatistics } = await import('../statistics');
      
      recordEnding('secret', 80, 70);
      
      const stats = getStatistics();
      expect(stats.endingsAchieved.secret).toBe(1);
    });

    it('updates highestDetectionSurvived when detection is higher', async () => {
      const { recordEnding, getStatistics } = await import('../statistics');
      
      recordEnding('good', 50, 85);
      
      const stats = getStatistics();
      expect(stats.highestDetectionSurvived).toBe(85);
    });

    it('does not lower highestDetectionSurvived when detection is lower', async () => {
      const { recordEnding, getStatistics } = await import('../statistics');
      
      recordEnding('good', 50, 90);
      recordEnding('good', 50, 30);
      
      const stats = getStatistics();
      expect(stats.highestDetectionSurvived).toBe(90);
    });

    it('updates fastestCompletion for good ending', async () => {
      const { recordEnding, getStatistics } = await import('../statistics');
      
      recordEnding('good', 45, 30);
      
      const stats = getStatistics();
      expect(stats.fastestCompletion).toBe(45);
    });

    it('updates fastestCompletion for secret ending', async () => {
      const { recordEnding, getStatistics } = await import('../statistics');
      
      recordEnding('secret', 40, 50);
      
      const stats = getStatistics();
      expect(stats.fastestCompletion).toBe(40);
    });

    it('does not update fastestCompletion for bad ending when no prior completion', async () => {
      const { recordEnding, getStatistics } = await import('../statistics');
      
      // First do a good ending to set baseline
      recordEnding('good', 50, 30);
      const beforeBad = getStatistics().fastestCompletion;
      
      // Bad ending shouldn't update fastest
      recordEnding('bad', 30, 100);
      
      const stats = getStatistics();
      expect(stats.fastestCompletion).toBe(beforeBad);
    });

    it('updates fastestCompletion only if faster', async () => {
      const { recordEnding, getStatistics } = await import('../statistics');
      
      recordEnding('good', 50, 30);
      recordEnding('good', 60, 30); // Slower
      recordEnding('good', 40, 30); // Faster
      
      const stats = getStatistics();
      expect(stats.fastestCompletion).toBe(40);
    });
  });

  describe('addPlaytime', () => {
    it('adds playtime to total', async () => {
      const { addPlaytime, getStatistics } = await import('../statistics');
      
      addPlaytime(60000);
      addPlaytime(30000);
      
      const stats = getStatistics();
      expect(stats.totalPlaytime).toBe(90000);
    });
  });

  describe('formatPlaytime', () => {
    it('formats minutes only', async () => {
      const { formatPlaytime } = await import('../statistics');
      
      expect(formatPlaytime(5 * 60 * 1000)).toBe('5m');
      expect(formatPlaytime(30 * 60 * 1000)).toBe('30m');
    });

    it('formats hours and minutes', async () => {
      const { formatPlaytime } = await import('../statistics');
      
      expect(formatPlaytime(90 * 60 * 1000)).toBe('1h 30m');
      expect(formatPlaytime(150 * 60 * 1000)).toBe('2h 30m');
    });

    it('formats zero minutes', async () => {
      const { formatPlaytime } = await import('../statistics');
      
      expect(formatPlaytime(0)).toBe('0m');
    });
  });

  describe('clearStatistics', () => {
    it('removes statistics from localStorage', async () => {
      const { saveStatistics, getStatistics, clearStatistics } = await import('../statistics');
      
      // Manually set up stored data instead of using recordEnding
      // to avoid any module state issues
      saveStatistics({
        totalPlaytime: 1000,
        gamesPlayed: 5,
        gamesCompleted: 3,
        filesRead: 10,
        commandsTyped: 50,
        endingsAchieved: { good: 2, bad: 1, neutral: 0, secret: 0 },
        highestDetectionSurvived: 50,
        fastestCompletion: 40,
        lastPlayed: Date.now(),
      });
      
      let stats = getStatistics();
      expect(stats.gamesCompleted).toBe(3);
      
      clearStatistics();
      
      // Verify the storage key was removed
      expect(mockStore['rpg-solo-statistics']).toBeUndefined();
      
      stats = getStatistics();
      expect(stats.gamesCompleted).toBe(0);
    });
  });
});
