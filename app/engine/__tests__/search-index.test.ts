// Test for search command functionality
import { describe, it, expect, beforeEach } from 'vitest';
import { performSearch, canSearch, getSearchCooldownMessage } from '../searchIndex';
import { GameState, DEFAULT_GAME_STATE } from '../../types';

// Create a test game state
function createTestState(overrides: Partial<GameState> = {}): GameState {
  return {
    ...DEFAULT_GAME_STATE,
    seed: 12345,
    rngState: 12345,
    sessionStartTime: Date.now(),
    lastSearchTime: 0,
    ...overrides,
  } as GameState;
}

describe('Search Index System', () => {
  describe('performSearch', () => {
    it('should return empty results for unknown keywords', () => {
      const state = createTestState();
      const results = performSearch('xyznonexistent', state);
      expect(results.length).toBeLessThanOrEqual(2); // May include random false positives
    });

    it('should return results for valid keywords like "alien"', () => {
      const state = createTestState();
      const results = performSearch('alien', state);
      // Should match creature/foreign/biological tagged files
      expect(results.length).toBeGreaterThan(0);
    });

    it('should return results for "telepathy" keyword', () => {
      const state = createTestState();
      const results = performSearch('telepathy', state);
      // Should match telepathic/psi tagged files
      expect(results.length).toBeGreaterThan(0);
    });

    it('should return results for "crash" keyword', () => {
      const state = createTestState();
      const results = performSearch('crash', state);
      // Should match crash/debris tagged files
      expect(results.length).toBeGreaterThan(0);
    });

    it('should return results for "creature" keyword', () => {
      const state = createTestState();
      const results = performSearch('creature', state);
      expect(results.length).toBeGreaterThan(0);
    });

    it('should return results for "military" keyword', () => {
      const state = createTestState();
      const results = performSearch('military', state);
      expect(results.length).toBeGreaterThan(0);
    });

    it('should return results for "witness" keyword', () => {
      const state = createTestState();
      const results = performSearch('witness', state);
      expect(results.length).toBeGreaterThan(0);
    });

    it('should return results for "2026" keyword', () => {
      const state = createTestState();
      const results = performSearch('2026', state);
      expect(results.length).toBeGreaterThan(0);
    });

    it('should return filenames without paths', () => {
      const state = createTestState();
      const results = performSearch('creature', state);
      // Check that results don't contain paths (no slashes)
      for (const result of results) {
        if (!result.isCorrupted) {
          expect(result.filename).not.toContain('/');
        }
      }
    });

    it('should sometimes return corrupted entries', () => {
      // Run multiple searches to find at least one with corruption
      let foundCorruption = false;
      for (let i = 0; i < 20; i++) {
        const state = createTestState({ seed: 1000 + i, sessionCommandCount: i * 10 });
        const results = performSearch('alien', state);
        if (results.some(r => r.isCorrupted)) {
          foundCorruption = true;
          break;
        }
      }
      // Corruption should happen sometimes (30% chance)
      // With 20 attempts, probability of never seeing it is ~0.7^20 ≈ 0.08%
      expect(foundCorruption).toBe(true);
    });
  });

  describe('canSearch', () => {
    it('should allow search when no previous search done', () => {
      const state = createTestState({ lastSearchTime: 0 });
      expect(canSearch(state)).toBe(true);
    });

    it('should block search during cooldown', () => {
      const now = Date.now();
      const state = createTestState({ lastSearchTime: now - 5000 }); // 5 seconds ago
      expect(canSearch(state)).toBe(false);
    });

    it('should allow search after cooldown expires', () => {
      const now = Date.now();
      const state = createTestState({ lastSearchTime: now - 15000 }); // 15 seconds ago
      expect(canSearch(state)).toBe(true);
    });
  });

  describe('getSearchCooldownMessage', () => {
    it('should return cooldown message', () => {
      const message = getSearchCooldownMessage();
      expect(message).toContain('COOLDOWN');
      expect(message).toContain('wait');
    });
  });
});
