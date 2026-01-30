/**
 * Tests for Steam Rich Presence Module
 *
 * These tests mock the Steamworks client to test the Rich Presence
 * module without requiring Steam to be running.
 */

import { describe, it, expect, beforeEach, vi } from 'vitest';

// Mock the steamworks friends API
const mockFriends = {
  setRichPresence: vi.fn(),
  clearRichPresence: vi.fn(),
};

const mockSteamClient = {
  friends: mockFriends,
};

// Import the module - use dynamic import for CommonJS compatibility
// eslint-disable-next-line @typescript-eslint/no-require-imports
const steamPresence = require('../steam-presence') as typeof import('../steam-presence');

describe('Steam Rich Presence Module', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    // Reset module state
    steamPresence.initialize(null);
  });

  describe('PRESENCE_STATES', () => {
    it('exports all expected presence states', () => {
      const states = steamPresence.PRESENCE_STATES;

      expect(states.MENU).toBe('In the main menu');
      expect(states.INVESTIGATING).toBe('Investigating classified files...');
      expect(states.CRITICAL).toBe('Detection critical! System alert!');
      expect(states.ENDING_GOOD).toBe('Uncovered the truth');
      expect(states.ENDING_BAD).toBe('Session terminated');
      expect(states.PLAYING).toBe('Accessing terminal...');
    });

    it('provides access to states via getPresenceStates', () => {
      const states = steamPresence.getPresenceStates();

      expect(states).toEqual(steamPresence.PRESENCE_STATES);
      expect(states).not.toBe(steamPresence.PRESENCE_STATES); // Should be a copy
    });
  });

  describe('initialize', () => {
    it('accepts Steam client and enables presence updates', () => {
      const consoleSpy = vi.spyOn(console, 'log').mockImplementation(() => {});

      steamPresence.initialize(mockSteamClient);

      expect(consoleSpy).toHaveBeenCalledWith('Steam Rich Presence initialized');

      consoleSpy.mockRestore();
    });

    it('handles null client gracefully', () => {
      const consoleSpy = vi.spyOn(console, 'log').mockImplementation(() => {});

      steamPresence.initialize(null);

      expect(consoleSpy).not.toHaveBeenCalled();

      consoleSpy.mockRestore();
    });
  });

  describe('setPresence', () => {
    it('returns error when Steam is not initialized', () => {
      const result = steamPresence.setPresence('Test status');

      expect(result.success).toBe(false);
      expect(result.error).toBe('Steam not initialized');
    });

    it('returns cached result for duplicate status', () => {
      steamPresence.initialize(mockSteamClient);

      // First call
      steamPresence.setPresence('Test status');
      vi.clearAllMocks();

      // Second call with same status
      const result = steamPresence.setPresence('Test status');

      expect(result.success).toBe(true);
      expect(result.cached).toBe(true);
      expect(mockFriends.setRichPresence).not.toHaveBeenCalled();
    });
  });

  describe('getCurrentPresence', () => {
    it('returns empty string initially', () => {
      // Import a fresh instance to avoid test pollution
      vi.resetModules();
      // eslint-disable-next-line @typescript-eslint/no-require-imports
      const freshSteamPresence = require('../steam-presence');
      expect(freshSteamPresence.getCurrentPresence()).toBe('');
    });
  });

  describe('clearPresence', () => {
    it('returns error when Steam is not initialized', () => {
      const result = steamPresence.clearPresence();

      expect(result.success).toBe(false);
      expect(result.error).toBe('Steam not initialized');
    });
  });

  describe('updateFromGameState', () => {
    it('returns error when Steam is not initialized', () => {
      steamPresence.initialize(null);

      const result = steamPresence.updateFromGameState({});

      expect(result.success).toBe(false);
      expect(result.error).toBe('Steam not initialized');
    });
  });

  describe('graceful degradation', () => {
    it('handles null friends API gracefully', () => {
      steamPresence.initialize({ friends: null });

      const setResult = steamPresence.setPresence('Test');
      expect(setResult.success).toBe(false);

      const clearResult = steamPresence.clearPresence();
      expect(clearResult.success).toBe(false);

      const updateResult = steamPresence.updateFromGameState({ gameOver: false, detectionLevel: 0 });
      expect(updateResult.success).toBe(false);
    });

    it('handles completely missing client gracefully', () => {
      steamPresence.initialize(undefined);

      expect(steamPresence.setPresence('Test').success).toBe(false);
      expect(steamPresence.clearPresence().success).toBe(false);
      expect(steamPresence.updateFromGameState({}).success).toBe(false);
    });
  });
});