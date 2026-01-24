import { describe, it, expect, beforeEach, vi } from 'vitest';
import { DEFAULT_GAME_STATE, GameState } from '../../types';

// Helper to create a valid test state with required fields
function createTestState(overrides: Partial<GameState> = {}): GameState {
  return {
    ...DEFAULT_GAME_STATE,
    seed: 12345,
    rngState: 12345,
    sessionStartTime: Date.now(),
    truthsDiscovered: new Set(),
    singularEventsTriggered: new Set(),
    imagesShownThisRun: new Set(),
    videosShownThisRun: new Set(),
    categoriesRead: new Set(),
    filesRead: new Set(),
    prisoner45UsedResponses: new Set(),
    scoutLinkUsedResponses: new Set(),
    disinformationDiscovered: new Set(),
    hiddenCommandsDiscovered: new Set(),
    passwordsFound: new Set(),
    bookmarkedFiles: new Set(),
    trapsTriggered: new Set(),
    ...overrides,
  };
}

describe('Save/Load System', () => {
  let mockStore: Record<string, string> = {};

  beforeEach(async () => {
    mockStore = {};
    vi.resetModules();
    
    const mockLocalStorage = {
      getItem: (key: string) => mockStore[key] || null,
      setItem: (key: string, value: string) => { mockStore[key] = value; },
      removeItem: (key: string) => { delete mockStore[key]; },
      clear: () => { mockStore = {}; },
      length: 0,
      key: () => null,
    };
    
    vi.stubGlobal('localStorage', mockLocalStorage);
    vi.stubGlobal('document', {});
    vi.stubGlobal('window', { localStorage: mockLocalStorage });
  });

  describe('serialization round-trip', () => {
    it('preserves videosShownThisRun through save/load cycle', async () => {
      const { saveGame, loadGame } = await import('../saves');
      
      const state = createTestState({
        videosShownThisRun: new Set(['video1.mp4', 'video2.mp4']),
      });
      
      const slot = saveGame(state, 'Test Save');
      expect(slot).not.toBeNull();
      
      const loaded = loadGame(slot!.id);
      expect(loaded).not.toBeNull();
      expect(loaded!.videosShownThisRun).toBeInstanceOf(Set);
      expect(loaded!.videosShownThisRun.has('video1.mp4')).toBe(true);
      expect(loaded!.videosShownThisRun.has('video2.mp4')).toBe(true);
      expect(loaded!.videosShownThisRun.size).toBe(2);
    });

    it('preserves imagesShownThisRun through save/load cycle', async () => {
      const { saveGame, loadGame } = await import('../saves');
      
      const state = createTestState({
        imagesShownThisRun: new Set(['image1.png', 'image2.png']),
      });
      
      const slot = saveGame(state, 'Test Save');
      const loaded = loadGame(slot!.id);
      
      expect(loaded!.imagesShownThisRun).toBeInstanceOf(Set);
      expect(loaded!.imagesShownThisRun.size).toBe(2);
    });

    it('preserves all Set fields through save/load cycle', async () => {
      const { saveGame, loadGame } = await import('../saves');
      
      const state = createTestState({
        truthsDiscovered: new Set(['truth1', 'truth2']),
        singularEventsTriggered: new Set(['event1']),
        imagesShownThisRun: new Set(['img1']),
        videosShownThisRun: new Set(['vid1']),
        categoriesRead: new Set(['cat1', 'cat2', 'cat3']),
        filesRead: new Set(['file1']),
        prisoner45UsedResponses: new Set(['resp1']),
        scoutLinkUsedResponses: new Set(['scout1']),
        disinformationDiscovered: new Set(['disinfo1']),
        hiddenCommandsDiscovered: new Set(['cmd1']),
        passwordsFound: new Set(['pass1', 'pass2']),
        bookmarkedFiles: new Set(['bookmark1']),
        trapsTriggered: new Set(['trap1']),
      });
      
      const slot = saveGame(state, 'Test Save');
      const loaded = loadGame(slot!.id);
      
      expect(loaded!.truthsDiscovered.size).toBe(2);
      expect(loaded!.singularEventsTriggered.size).toBe(1);
      expect(loaded!.categoriesRead.size).toBe(3);
      expect(loaded!.passwordsFound.size).toBe(2);
    });

    it('handles empty Sets correctly', async () => {
      const { saveGame, loadGame } = await import('../saves');
      
      const state = createTestState();
      
      const slot = saveGame(state, 'Test Save');
      const loaded = loadGame(slot!.id);
      
      expect(loaded!.videosShownThisRun).toBeInstanceOf(Set);
      expect(loaded!.videosShownThisRun.size).toBe(0);
    });
  });

  describe('save migration support', () => {
    it('provides default values for new fields when loading old saves', async () => {
      const { loadGame } = await import('../saves');
      
      // Simulate an old save without videosShownThisRun
      const oldSaveData = {
        currentPath: '/',
        detectionLevel: 50,
        accessLevel: 3,
        truthsDiscovered: ['truth1'],
        // Missing: videosShownThisRun, categoriesRead, etc.
      };
      
      mockStore['terminal1996:save:old_save'] = JSON.stringify(oldSaveData);
      
      const loaded = loadGame('old_save');
      
      expect(loaded).not.toBeNull();
      // Should get default values from DEFAULT_GAME_STATE spread
      expect(loaded!.videosShownThisRun).toBeInstanceOf(Set);
      expect(loaded!.videosShownThisRun.size).toBe(0);
    });
  });

  describe('save slot management', () => {
    it('limits saves to 10 slots and deletes orphaned data', async () => {
      const { saveGame, getSaveSlots } = await import('../saves');
      
      const baseState = createTestState();
      
      // Create 12 saves
      const slots = [];
      for (let i = 0; i < 12; i++) {
        const slot = saveGame({ ...baseState, detectionLevel: i }, `Save ${i}`);
        slots.push(slot);
        // Small delay to ensure unique timestamps
        await new Promise(r => setTimeout(r, 5));
      }
      
      const finalSlots = getSaveSlots();
      expect(finalSlots.length).toBe(10);
      
      // First 2 saves should have their data deleted
      expect(mockStore[`terminal1996:save:${slots[0]!.id}`]).toBeUndefined();
      expect(mockStore[`terminal1996:save:${slots[1]!.id}`]).toBeUndefined();
    });
  });

  describe('history truncation', () => {
    it('truncates history to 500 entries on save', async () => {
      const { saveGame, loadGame } = await import('../saves');
      
      // Create state with 600 history entries
      const largeHistory = Array.from({ length: 600 }, (_, i) => ({
        id: `entry-${i}`,
        type: 'output' as const,
        content: `Line ${i}`,
        timestamp: Date.now(),
      }));
      
      const state = createTestState({
        history: largeHistory,
      });
      
      const slot = saveGame(state, 'Large History');
      const loaded = loadGame(slot!.id);
      
      expect(loaded!.history.length).toBe(500);
      // Should keep the last 500 entries
      expect(loaded!.history[0].content).toBe('Line 100');
      expect(loaded!.history[499].content).toBe('Line 599');
    });
  });

  describe('createNewGame', () => {
    it('initializes videosShownThisRun as empty Set', async () => {
      const { createNewGame } = await import('../saves');
      
      const newGame = createNewGame();
      
      expect(newGame.videosShownThisRun).toBeInstanceOf(Set);
      expect(newGame.videosShownThisRun.size).toBe(0);
    });

    it('initializes imagesShownThisRun as empty Set', async () => {
      const { createNewGame } = await import('../saves');
      
      const newGame = createNewGame();
      
      expect(newGame.imagesShownThisRun).toBeInstanceOf(Set);
      expect(newGame.imagesShownThisRun.size).toBe(0);
    });

    it('initializes all required Set fields', async () => {
      const { createNewGame } = await import('../saves');
      
      const newGame = createNewGame();
      
      expect(newGame.truthsDiscovered).toBeInstanceOf(Set);
      expect(newGame.singularEventsTriggered).toBeInstanceOf(Set);
      expect(newGame.imagesShownThisRun).toBeInstanceOf(Set);
      expect(newGame.videosShownThisRun).toBeInstanceOf(Set);
    });
  });
});
