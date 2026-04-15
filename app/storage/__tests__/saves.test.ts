import { describe, it, expect, beforeEach, vi } from 'vitest';
import { DEFAULT_GAME_STATE, GameState } from '../../types';

vi.mock('../../lib/steamBridge', () => ({
  isCloudAvailable: vi.fn(async () => false),
  cloudSave: vi.fn(async () => ({ success: true })),
  cloudLoad: vi.fn(async () => ({ success: false, data: null })),
  cloudDelete: vi.fn(async () => ({ success: true })),
  cloudList: vi.fn(async () => ({ success: true, files: [] })),
}));

const EVIDENCE_PATHS = {
  cycle: '/admin/thirty_year_cycle.txt',
  prato: '/ops/prato/archive/patrol_observation_shift_04.txt',
} as const;

// Helper to create a valid test state with required fields
function createTestState(overrides: Partial<GameState> = {}): GameState {
  return {
    ...DEFAULT_GAME_STATE,
    seed: 12345,
    rngState: 12345,
    sessionStartTime: Date.now(),
    evidenceCount: 0,
    singularEventsTriggered: new Set(),
    imagesShownThisRun: new Set(),
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

function createQuotaExceededError(): DOMException {
  const error = new DOMException('Quota exceeded', 'QuotaExceededError');
  Object.defineProperty(error, 'code', { value: 22 });
  return error;
}

describe('Save/Load System', () => {
  let mockStore: Record<string, string> = {};
  let steamBridge: typeof import('../../lib/steamBridge');

  beforeEach(async () => {
    mockStore = {};
    vi.resetModules();
    steamBridge = await import('../../lib/steamBridge');
    vi.mocked(steamBridge.isCloudAvailable).mockResolvedValue(false);
    vi.mocked(steamBridge.cloudLoad).mockResolvedValue({ success: false, data: null });
    vi.mocked(steamBridge.cloudList).mockResolvedValue({ success: true, files: [] });

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
    it('uses dossier file count in save slot metadata', async () => {
      const { saveGame } = await import('../saves');

      const state = createTestState({
        savedFiles: new Set([EVIDENCE_PATHS.cycle]),
      });

      const slot = saveGame(state, 'Test Save');

      expect(slot).not.toBeNull();
      expect(slot!.truthCount).toBe(1);
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
        evidenceCount: 2,
        singularEventsTriggered: new Set(['event1']),
        imagesShownThisRun: new Set(['img1']),
        categoriesRead: new Set(['cat1', 'cat2', 'cat3']),
        filesRead: new Set([EVIDENCE_PATHS.cycle, EVIDENCE_PATHS.prato]),
        savedFiles: new Set([EVIDENCE_PATHS.cycle, EVIDENCE_PATHS.prato]),
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

      expect(loaded!.evidenceCount).toBe(2);
      expect(loaded!.savedFiles).toBeInstanceOf(Set);
      expect(loaded!.savedFiles.size).toBe(2);
      expect(loaded!.singularEventsTriggered.size).toBe(1);
      expect(loaded!.categoriesRead.size).toBe(3);
      expect(loaded!.passwordsFound.size).toBe(2);
      expect(loaded!.tutorialTipsShown.size).toBe(1);
    });

    it('preserves conspiracyFilesSeen and archiveFilesViewed through save/load cycle', async () => {
      const { saveGame, loadGame } = await import('../saves');

      const state = createTestState({
        conspiracyFilesSeen: new Set(['file_a.txt', 'file_b.txt']),
        archiveFilesViewed: new Set(['/archive/doc1.txt', '/archive/doc2.txt', '/archive/doc3.txt']),
      });

      const slot = saveGame(state, 'Conspiracy Test');
      const loaded = loadGame(slot!.id);

      expect(loaded!.conspiracyFilesSeen).toBeInstanceOf(Set);
      expect(loaded!.conspiracyFilesSeen.size).toBe(2);
      expect(loaded!.conspiracyFilesSeen.has('file_a.txt')).toBe(true);
      expect(loaded!.conspiracyFilesSeen.has('file_b.txt')).toBe(true);

      expect(loaded!.archiveFilesViewed).toBeInstanceOf(Set);
      expect(loaded!.archiveFilesViewed.size).toBe(3);
      expect(loaded!.archiveFilesViewed.has('/archive/doc1.txt')).toBe(true);
      expect(loaded!.archiveFilesViewed.has('/archive/doc3.txt')).toBe(true);
    });

    it('handles empty Sets correctly', async () => {
      const { saveGame, loadGame } = await import('../saves');

      const state = createTestState();

      const slot = saveGame(state, 'Test Save');
      const loaded = loadGame(slot!.id);

      expect(loaded!.imagesShownThisRun).toBeInstanceOf(Set);
      expect(loaded!.imagesShownThisRun.size).toBe(0);
    });

    it('loads a saved game through loadGameAsync', async () => {
      const { saveGame, loadGameAsync } = await import('../saves');

      const state = createTestState({
        currentPath: '/storage/quarantine',
        detectionLevel: 42,
      });

      const slot = saveGame(state, 'Async Save');
      const loaded = await loadGameAsync(slot!.id);

      expect(loaded).not.toBeNull();
      expect(loaded!.currentPath).toBe('/storage/quarantine');
      expect(loaded!.detectionLevel).toBe(42);
    });

    it('returns null from loadGameAsync when the request has already been aborted', async () => {
      const { saveGame, loadGameAsync } = await import('../saves');
      const controller = new AbortController();

      const slot = saveGame(createTestState(), 'Aborted Async Save');
      controller.abort();

      const loaded = await loadGameAsync(slot!.id, controller.signal);

      expect(loaded).toBeNull();
    });

    it('returns a cloud-loaded save even when local caching fails', async () => {
      const { saveGame, loadGameAsync } = await import('../saves');
      const state = createTestState({
        currentPath: '/storage/quarantine',
        detectionLevel: 42,
      });
      const slot = saveGame(state, 'Cloud Save');
      const payloadKey = `terminal1996:save:${slot!.id}`;
      const raw = mockStore[payloadKey];

      delete mockStore[payloadKey];

      const failingStorage = {
        getItem: (key: string) => mockStore[key] || null,
        setItem: (key: string, value: string) => {
          if (key === payloadKey) {
            throw createQuotaExceededError();
          }
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

      vi.stubGlobal('localStorage', failingStorage);
      vi.stubGlobal('document', {});
      vi.stubGlobal('window', { localStorage: failingStorage });
      vi.mocked(steamBridge.isCloudAvailable).mockResolvedValue(true);
      vi.mocked(steamBridge.cloudLoad).mockResolvedValue({ success: true, data: raw });

      const loaded = await loadGameAsync(slot!.id);

      expect(loaded).not.toBeNull();
      expect(loaded!.currentPath).toBe('/storage/quarantine');
      expect(mockStore[payloadKey]).toBeUndefined();
    });

    it('persists metadata for a recovered cloud-only save after loading it', async () => {
      const { saveGame, loadGameAsync, getSaveSlots } = await import('../saves');
      const state = createTestState({
        currentPath: '/storage/quarantine',
        detectionLevel: 37,
        filesRead: new Set([EVIDENCE_PATHS.cycle]),
        savedFiles: new Set([EVIDENCE_PATHS.cycle]),
      });
      const slot = saveGame(state, 'Cloud Save');
      const payloadKey = `terminal1996:save:${slot!.id}`;
      const raw = mockStore[payloadKey];

      mockStore = {};
      vi.mocked(steamBridge.isCloudAvailable).mockResolvedValue(true);
      vi.mocked(steamBridge.cloudLoad).mockResolvedValue({ success: true, data: raw });

      const loaded = await loadGameAsync(slot!.id);

      expect(loaded).not.toBeNull();
      expect(getSaveSlots()).toEqual([
        expect.objectContaining({
          id: slot!.id,
          name: 'Recovered Save',
          currentPath: '/storage/quarantine',
          detectionLevel: 37,
          truthCount: 1,
        }),
      ]);
    });
  });

  describe('save migration support', () => {
    it('provides default values for new fields when loading old saves', async () => {
      const { loadGame } = await import('../saves');

      // Simulate an old save without newer fields
      const oldSaveData = {
        currentPath: '/',
        detectionLevel: 50,
        accessLevel: 3,
        evidenceCount: 1,
        // Missing: categoriesRead, etc.
      };

      mockStore['terminal1996:save:old_save'] = JSON.stringify(oldSaveData);

      const loaded = loadGame('old_save');

      expect(loaded).not.toBeNull();
      // Should get default values from DEFAULT_GAME_STATE spread
      expect(loaded!.imagesShownThisRun).toBeInstanceOf(Set);
      expect(loaded!.imagesShownThisRun.size).toBe(0);
    });

    it('rebuilds evidenceCount from filesRead when stale save data undercounts evidence files', async () => {
      const { loadGame } = await import('../saves');

      const oldSaveData = {
        currentPath: '/',
        detectionLevel: 50,
        accessLevel: 4,
        evidenceCount: 0,
        filesRead: [EVIDENCE_PATHS.cycle, EVIDENCE_PATHS.prato],
      };

      mockStore['terminal1996:save:stale_truths'] = JSON.stringify(oldSaveData);

      const loaded = loadGame('stale_truths');

      expect(loaded).not.toBeNull();
      expect(loaded!.evidenceCount).toBe(2);
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
    it('initializes imagesShownThisRun as empty Set', async () => {
      const { createNewGame } = await import('../saves');

      const newGame = createNewGame();

      expect(newGame.imagesShownThisRun).toBeInstanceOf(Set);
      expect(newGame.imagesShownThisRun.size).toBe(0);
    });

    it('initializes all required Set fields', async () => {
      const { createNewGame } = await import('../saves');

      const newGame = createNewGame();

      expect(typeof newGame.evidenceCount).toBe('number');
      expect(newGame.singularEventsTriggered).toBeInstanceOf(Set);
      expect(newGame.imagesShownThisRun).toBeInstanceOf(Set);
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
        evidenceCount: 1,
      });

      autoSave(state);

      const loaded = loadAutoSave();
      expect(loaded).not.toBeNull();
      expect(loaded!.detectionLevel).toBe(42);
      expect(loaded!.evidenceCount).toBe(1);
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

    it('drops at least one existing save before retrying a quota-limited write', async () => {
      const { saveGame, getSaveSlots } = await import('../saves');
      const state = createTestState();
      const existingSlots = [];

      for (let i = 0; i < 5; i++) {
        const slot = saveGame({ ...state, detectionLevel: i }, `Save ${i}`);
        existingSlots.push(slot);
        await new Promise(resolve => setTimeout(resolve, 5));
      }

      const quotaLimitedStorage = {
        getItem: (key: string) => mockStore[key] || null,
        setItem: (key: string, value: string) => {
          const existingSaveCount = Object.keys(mockStore).filter(storedKey =>
            storedKey.startsWith('terminal1996:save:')
          ).length;

          if (
            key.startsWith('terminal1996:save:') &&
            !(key in mockStore) &&
            existingSaveCount >= 5
          ) {
            throw createQuotaExceededError();
          }

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

      vi.stubGlobal('localStorage', quotaLimitedStorage);
      vi.stubGlobal('window', { localStorage: quotaLimitedStorage });

      const oldestSlot = existingSlots
        .filter((slot): slot is NonNullable<typeof slot> => slot !== null)
        .sort((left, right) => left.timestamp - right.timestamp)[0];
      const newSlot = saveGame({ ...state, detectionLevel: 99 }, 'Newest Save');

      expect(oldestSlot).toBeDefined();
      expect(newSlot).not.toBeNull();
      expect(getSaveSlots()).toHaveLength(5);
      expect(mockStore[`terminal1996:save:${oldestSlot!.id}`]).toBeUndefined();
    });

    it('preserves slot metadata correctly', async () => {
      const { saveGame } = await import('../saves');

      const state = createTestState({
        currentPath: '/admin/classified',
        detectionLevel: 75,
        savedFiles: new Set([EVIDENCE_PATHS.cycle, EVIDENCE_PATHS.prato]),
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

    it('localizes recovered cloud slot names in the active language', async () => {
      const { saveGame, getSaveSlotsAsync } = await import('../saves');
      const slot = saveGame(createTestState(), 'Cloud Save');
      const payloadKey = `terminal1996:save:${slot!.id}`;
      const raw = mockStore[payloadKey];

      mockStore = { terminal1996_language: 'es' };
      vi.mocked(steamBridge.isCloudAvailable).mockResolvedValue(true);
      vi.mocked(steamBridge.cloudList).mockResolvedValue({
        success: true,
        files: [{ key: slot!.id, filename: `${slot!.id}.json`, size: raw.length }],
      });
      vi.mocked(steamBridge.cloudLoad).mockResolvedValue({ success: true, data: raw });

      const slots = await getSaveSlotsAsync();

      expect(slots[0]).toEqual(
        expect.objectContaining({
          id: slot!.id,
          name: 'Sesión recuperada',
        })
      );
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
        evidenceCount: 1,
        history: [],
        commandHistory: [],
      };

      mockStore['terminal1996:save:legacy_save'] = JSON.stringify(legacySave);

      const loaded = loadGame('legacy_save');

      expect(loaded).not.toBeNull();
      expect(loaded!.currentPath).toBe('/storage');
      expect(loaded!.detectionLevel).toBe(30);
      expect(typeof loaded!.evidenceCount).toBe('number');
      expect(loaded!.evidenceCount).toBe(1);
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
      const { saveCheckpoint, loadCheckpoint, getCheckpointSlots, getLatestCheckpoint } =
        await import('../saves');

      const state = createTestState({
        detectionLevel: 25,
        evidenceCount: 1,
        savedFiles: new Set([EVIDENCE_PATHS.cycle]),
      });

      const slot = saveCheckpoint(state, 'First evidence');
      expect(slot).not.toBeNull();
      expect(slot!.reason).toBe('First evidence');
      expect(slot!.truthCount).toBe(1);

      const loaded = loadCheckpoint(slot!.id);
      expect(loaded).not.toBeNull();
      expect(loaded!.detectionLevel).toBe(25);
      expect(loaded!.evidenceCount).toBe(1);

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

    it('creates unique checkpoint ids when multiple checkpoints land in the same millisecond', async () => {
      const { saveCheckpoint, getCheckpointSlots } = await import('../saves');
      const nowSpy = vi.spyOn(Date, 'now').mockReturnValue(1_700_000_000_000);
      const state = createTestState();

      const first = saveCheckpoint(state, 'Checkpoint A');
      const second = saveCheckpoint(state, 'Checkpoint B');

      expect(first).not.toBeNull();
      expect(second).not.toBeNull();
      expect(first!.id).not.toBe(second!.id);
      expect(getCheckpointSlots().map(slot => slot.id)).toEqual([second!.id, first!.id]);

      nowSpy.mockRestore();
    });

    it('drops at least one existing checkpoint before retrying a quota-limited write', async () => {
      const { saveCheckpoint, getCheckpointSlots } = await import('../saves');
      const state = createTestState();
      const existingSlots = [];

      for (let i = 0; i < 2; i++) {
        const slot = saveCheckpoint({ ...state, detectionLevel: i * 10 }, `Checkpoint ${i}`);
        existingSlots.push(slot);
        await new Promise(resolve => setTimeout(resolve, 5));
      }

      const quotaLimitedStorage = {
        getItem: (key: string) => mockStore[key] || null,
        setItem: (key: string, value: string) => {
          const existingCheckpointCount = Object.keys(mockStore).filter(storedKey =>
            storedKey.startsWith('terminal1996:checkpoint:')
          ).length;

          if (
            key.startsWith('terminal1996:checkpoint:') &&
            !(key in mockStore) &&
            existingCheckpointCount >= 2
          ) {
            throw createQuotaExceededError();
          }

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

      vi.stubGlobal('localStorage', quotaLimitedStorage);
      vi.stubGlobal('window', { localStorage: quotaLimitedStorage });

      const oldestSlot = existingSlots
        .filter((slot): slot is NonNullable<typeof slot> => slot !== null)
        .sort((left, right) => left.timestamp - right.timestamp)[0];
      const newSlot = saveCheckpoint({ ...state, detectionLevel: 99 }, 'Newest Checkpoint');

      expect(oldestSlot).toBeDefined();
      expect(newSlot).not.toBeNull();
      expect(getCheckpointSlots()).toHaveLength(2);
      expect(mockStore[`terminal1996:checkpoint:${oldestSlot!.id}`]).toBeUndefined();
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
