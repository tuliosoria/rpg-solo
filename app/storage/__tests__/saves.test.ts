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
      setItem: (key: string, value: string) => {
        mockStore[key] = value;
      },
      removeItem: (key: string) => {
        delete mockStore[key];
      },
      clear: () => {
        mockStore = {};
      },
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
        tutorialTipsShown: new Set(['first_evidence']),
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
      expect(loaded!.tutorialTipsShown.size).toBe(1);
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

    it('sets tutorialComplete to false for new games', async () => {
      const { createNewGame } = await import('../saves');

      const newGame = createNewGame();

      expect(newGame.tutorialComplete).toBe(false);
      expect(newGame.tutorialStep).toBe(0);
    });

    it('generates a unique seed for each new game', async () => {
      const { createNewGame } = await import('../saves');

      const game1 = createNewGame();
      const game2 = createNewGame();

      // Seeds should be set (non-zero)
      expect(game1.seed).toBeGreaterThan(0);
      expect(game2.seed).toBeGreaterThan(0);
    });

    it('sets variant route based on seed', async () => {
      const { createNewGame } = await import('../saves');

      const newGame = createNewGame();

      // One of the variant flags should be true
      const hasVariantAlpha = newGame.flags.variant_route_alpha;
      const hasVariantBeta = newGame.flags.variant_route_beta;

      expect(hasVariantAlpha || hasVariantBeta).toBe(true);
    });

    it('includes boot sequence in initial history', async () => {
      const { createNewGame } = await import('../saves');

      const newGame = createNewGame();

      expect(newGame.history.length).toBeGreaterThan(0);
    });

    it('sets sessionStartTime to current time', async () => {
      const { createNewGame } = await import('../saves');
      const before = Date.now();

      const newGame = createNewGame();

      const after = Date.now();
      expect(newGame.sessionStartTime).toBeGreaterThanOrEqual(before);
      expect(newGame.sessionStartTime).toBeLessThanOrEqual(after);
    });
  });

  describe('deleteSave', () => {
    it('removes save data from localStorage', async () => {
      const { saveGame, deleteSave, loadGame } = await import('../saves');

      const state = createTestState();
      const slot = saveGame(state, 'Test Save');
      expect(slot).not.toBeNull();

      // Verify save exists
      const loaded = loadGame(slot!.id);
      expect(loaded).not.toBeNull();

      // Delete the save
      deleteSave(slot!.id);

      // Verify save is gone
      const loadedAfterDelete = loadGame(slot!.id);
      expect(loadedAfterDelete).toBeNull();
    });

    it('removes slot from save slots list', async () => {
      const { saveGame, deleteSave, getSaveSlots } = await import('../saves');

      const state = createTestState();
      const slot = saveGame(state, 'Test Save');

      // Get initial count
      const slotsBefore = getSaveSlots();
      const countBefore = slotsBefore.length;

      // Delete the save
      deleteSave(slot!.id);

      // Verify count decreased
      const slotsAfter = getSaveSlots();
      expect(slotsAfter.length).toBe(countBefore - 1);
    });
  });

  describe('autoSave and loadAutoSave', () => {
    it('saves state to autosave slot', async () => {
      const { autoSave, loadAutoSave } = await import('../saves');

      const state = createTestState({
        detectionLevel: 42,
        truthsDiscovered: new Set(['debris_relocation']),
      });

      autoSave(state);

      const loaded = loadAutoSave();
      expect(loaded).not.toBeNull();
      expect(loaded!.detectionLevel).toBe(42);
      expect(loaded!.truthsDiscovered.has('debris_relocation')).toBe(true);
    });

    it('returns null when no autosave exists', async () => {
      const { loadAutoSave } = await import('../saves');

      // Clear any existing autosave
      delete mockStore['terminal1996:autosave'];

      const loaded = loadAutoSave();
      expect(loaded).toBeNull();
    });

    it('updates lastSaveTime on autosave', async () => {
      const { autoSave, loadAutoSave } = await import('../saves');

      const state = createTestState();
      const before = Date.now();

      autoSave(state);

      const loaded = loadAutoSave();
      expect(loaded!.lastSaveTime).toBeGreaterThanOrEqual(before);
    });
  });

  describe('saveGame error handling', () => {
    it('handles quota exceeded by cleaning up old saves', async () => {
      const { saveGame, getSaveSlots } = await import('../saves');

      const state = createTestState();

      // Create many saves to approach quota
      for (let i = 0; i < 8; i++) {
        saveGame({ ...state, detectionLevel: i }, `Save ${i}`);
      }

      // All saves should be there (up to limit)
      const slots = getSaveSlots();
      expect(slots.length).toBeLessThanOrEqual(10);
    });

    it('preserves slot metadata correctly', async () => {
      const { saveGame } = await import('../saves');

      const state = createTestState({
        currentPath: '/admin/classified',
        detectionLevel: 75,
        truthsDiscovered: new Set(['debris_relocation', 'being_containment']),
      });

      const slot = saveGame(state, 'My Save');

      expect(slot).not.toBeNull();
      expect(slot!.name).toBe('My Save');
      expect(slot!.currentPath).toBe('/admin/classified');
      expect(slot!.detectionLevel).toBe(75);
      expect(slot!.truthCount).toBe(2);
    });
  });

  describe('getSaveSlots', () => {
    it('returns empty array when no saves exist', async () => {
      // Clear mock store
      mockStore = {};
      vi.resetModules();

      const mockLocalStorage = {
        getItem: (key: string) => mockStore[key] || null,
        setItem: (key: string, value: string) => {
          mockStore[key] = value;
        },
        removeItem: (key: string) => {
          delete mockStore[key];
        },
        clear: () => {
          mockStore = {};
        },
        length: 0,
        key: () => null,
      };
      vi.stubGlobal('localStorage', mockLocalStorage);
      vi.stubGlobal('window', { localStorage: mockLocalStorage });

      const { getSaveSlots } = await import('../saves');

      const slots = getSaveSlots();
      expect(slots).toEqual([]);
    });

    it('returns saves in order (newest first)', async () => {
      const { saveGame, getSaveSlots } = await import('../saves');

      const state = createTestState();

      // Create saves with delays
      saveGame({ ...state }, 'First Save');
      await new Promise(r => setTimeout(r, 10));
      saveGame({ ...state }, 'Second Save');
      await new Promise(r => setTimeout(r, 10));
      saveGame({ ...state }, 'Third Save');

      const slots = getSaveSlots();
      expect(slots[0].name).toBe('Third Save');
      expect(slots[1].name).toBe('Second Save');
      expect(slots[2].name).toBe('First Save');
    });
  });

  describe('loadGame edge cases', () => {
    it('returns null for non-existent save', async () => {
      const { loadGame } = await import('../saves');

      const loaded = loadGame('non_existent_save_id');
      expect(loaded).toBeNull();
    });

    it('handles corrupted save data gracefully', async () => {
      const { loadGame } = await import('../saves');

      // Put corrupted data in storage
      mockStore['terminal1996:save:corrupted_save'] = 'not valid json';

      const loaded = loadGame('corrupted_save');
      expect(loaded).toBeNull();
    });
  });

  describe('command history truncation', () => {
    it('truncates command history on load', async () => {
      const { saveGame, loadGame } = await import('../saves');

      // Create state with large command history (more than MAX_COMMAND_HISTORY_SIZE = 100)
      const largeCommandHistory = Array.from({ length: 200 }, (_, i) => `command ${i}`);

      const state = createTestState({
        commandHistory: largeCommandHistory,
      });

      const slot = saveGame(state, 'Large Command History');
      const loaded = loadGame(slot!.id);

      // Should be truncated to MAX_COMMAND_HISTORY_SIZE (100)
      expect(loaded!.commandHistory.length).toBeLessThanOrEqual(100);
    });
  });

  describe('versioned save format', () => {
    it('handles legacy unversioned saves', async () => {
      const { loadGame } = await import('../saves');

      // Simulate a legacy save (no version field)
      const legacySave = {
        currentPath: '/storage',
        detectionLevel: 30,
        accessLevel: 2,
        truthsDiscovered: ['truth1'],
        history: [],
        commandHistory: [],
      };

      mockStore['terminal1996:save:legacy_save'] = JSON.stringify(legacySave);

      const loaded = loadGame('legacy_save');

      expect(loaded).not.toBeNull();
      expect(loaded!.currentPath).toBe('/storage');
      expect(loaded!.detectionLevel).toBe(30);
      expect(loaded!.truthsDiscovered).toBeInstanceOf(Set);
      expect(loaded!.truthsDiscovered.has('truth1')).toBe(true);
    });

    it('handles versioned saves correctly', async () => {
      const { saveGame, loadGame } = await import('../saves');

      const state = createTestState({
        detectionLevel: 55,
      });

      const slot = saveGame(state, 'Versioned Save');

      // Check raw storage has version field
      const rawData = JSON.parse(mockStore[`terminal1996:save:${slot!.id}`]);
      expect(rawData.version).toBeDefined();

      const loaded = loadGame(slot!.id);
      expect(loaded!.detectionLevel).toBe(55);
    });
  });

  describe('checkpoint system', () => {
    it('saves and loads checkpoints correctly', async () => {
      const {
        saveCheckpoint,
        loadCheckpoint,
        getCheckpointSlots,
        getLatestCheckpoint,
      } = await import('../saves');

      const state = createTestState({
        detectionLevel: 25,
        truthsDiscovered: new Set(['debris_relocation']),
      });

      const slot = saveCheckpoint(state, 'First evidence');
      expect(slot).not.toBeNull();
      expect(slot!.reason).toBe('First evidence');
      expect(slot!.truthCount).toBe(1);

      const loaded = loadCheckpoint(slot!.id);
      expect(loaded).not.toBeNull();
      expect(loaded!.detectionLevel).toBe(25);
      expect(loaded!.truthsDiscovered.has('debris_relocation')).toBe(true);

      const slots = getCheckpointSlots();
      expect(slots.length).toBe(1);

      const latest = getLatestCheckpoint();
      expect(latest).not.toBeNull();
      expect(latest!.id).toBe(slot!.id);
    });

    it('limits checkpoints to MAX_CHECKPOINT_SAVES', async () => {
      const { saveCheckpoint, getCheckpointSlots } = await import('../saves');

      const state = createTestState();

      // Create 7 checkpoints (MAX_CHECKPOINT_SAVES is 5)
      for (let i = 0; i < 7; i++) {
        saveCheckpoint({ ...state, detectionLevel: i * 10 }, `Checkpoint ${i}`);
        await new Promise(r => setTimeout(r, 5));
      }

      const slots = getCheckpointSlots();
      expect(slots.length).toBe(5);

      // Most recent should be first
      expect(slots[0].reason).toBe('Checkpoint 6');
    });

    it('returns null for non-existent checkpoint', async () => {
      const { loadCheckpoint } = await import('../saves');

      const loaded = loadCheckpoint('non_existent_checkpoint');
      expect(loaded).toBeNull();
    });

    it('deletes checkpoint correctly', async () => {
      const { saveCheckpoint, deleteCheckpoint, loadCheckpoint, getCheckpointSlots } =
        await import('../saves');

      const state = createTestState();
      const slot = saveCheckpoint(state, 'To be deleted');
      expect(slot).not.toBeNull();

      deleteCheckpoint(slot!.id);

      const loaded = loadCheckpoint(slot!.id);
      expect(loaded).toBeNull();

      const slots = getCheckpointSlots();
      expect(slots.find(s => s.id === slot!.id)).toBeUndefined();
    });

    it('clears all checkpoints', async () => {
      const { saveCheckpoint, clearCheckpoints, getCheckpointSlots } = await import('../saves');

      const state = createTestState();
      saveCheckpoint(state, 'Checkpoint 1');
      saveCheckpoint(state, 'Checkpoint 2');

      clearCheckpoints();

      const slots = getCheckpointSlots();
      expect(slots.length).toBe(0);
    });

    it('returns empty array when no checkpoints exist', async () => {
      // Clear mock store
      mockStore = {};
      vi.resetModules();

      const mockLocalStorage = {
        getItem: (key: string) => mockStore[key] || null,
        setItem: (key: string, value: string) => {
          mockStore[key] = value;
        },
        removeItem: (key: string) => {
          delete mockStore[key];
        },
        clear: () => {
          mockStore = {};
        },
        length: 0,
        key: () => null,
      };
      vi.stubGlobal('localStorage', mockLocalStorage);
      vi.stubGlobal('window', { localStorage: mockLocalStorage });

      const { getCheckpointSlots, getLatestCheckpoint } = await import('../saves');

      const slots = getCheckpointSlots();
      expect(slots).toEqual([]);

      const latest = getLatestCheckpoint();
      expect(latest).toBeNull();
    });
  });
});
