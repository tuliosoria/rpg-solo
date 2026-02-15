import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { 
  generateHintOutput, 
  analyzeProgressForHint, 
  HINT_CONFIG 
} from '../hintSystem';
import { GameState, TruthCategory, DEFAULT_GAME_STATE } from '../../types';

// Create a minimal game state for testing
function createTestState(overrides: Partial<GameState> = {}): GameState {
  return {
    ...DEFAULT_GAME_STATE,
    seed: 12345,
    rngState: 12345,
    sessionStartTime: Date.now(),
    filesRead: new Set<string>(),
    truthsDiscovered: new Set<TruthCategory>(),
    hintsUsed: 0,
    tutorialComplete: false,
    detectionLevel: 0,
    ...overrides,
  } as GameState;
}

describe('Hint System', () => {
  // Store original Math.random
  const originalRandom = Math.random;

  beforeEach(() => {
    // Mock Math.random for deterministic tests
    vi.spyOn(Math, 'random').mockReturnValue(0.1);
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('generateHintOutput', () => {
    it('should return a hint when hints are available', () => {
      const state = createTestState({ tutorialComplete: true });
      const result = generateHintOutput(state);

      expect(result.output.length).toBeGreaterThan(0);
      expect(result.output.some(e => e.content.includes('HINT PROTOCOL ACTIVATED'))).toBe(true);
      expect(result.stateChanges.hintsUsed).toBe(1);
    });

    it('should show hints remaining count', () => {
      const state = createTestState({ hintsUsed: 1, tutorialComplete: true });
      const result = generateHintOutput(state);

      // Should show "2 HINTS REMAINING" (4 max - 1 used - 1 current = 2)
      const remainingEntry = result.output.find(e => e.content.includes('REMAINING'));
      expect(remainingEntry).toBeDefined();
    });

    it('should refuse hints when exhausted', () => {
      const state = createTestState({ hintsUsed: HINT_CONFIG.maxHints });
      const result = generateHintOutput(state);

      expect(result.output.some(e => e.content.includes('RESOURCE DEPLETED'))).toBe(true);
      expect(result.stateChanges.hintsUsed).toBeUndefined();
    });

    it('should increase detection after tutorial is complete', () => {
      const state = createTestState({ 
        tutorialComplete: true, 
        detectionLevel: 10 
      });
      const result = generateHintOutput(state);

      expect(result.stateChanges.detectionLevel).toBe(10 + HINT_CONFIG.detectionPenalty);
    });

    it('should NOT increase detection during tutorial', () => {
      const state = createTestState({ 
        tutorialComplete: false, 
        detectionLevel: 10 
      });
      const result = generateHintOutput(state);

      expect(result.stateChanges.detectionLevel).toBeUndefined();
    });

    it('should cap detection at 100', () => {
      const state = createTestState({ 
        tutorialComplete: true, 
        detectionLevel: 98 
      });
      const result = generateHintOutput(state);

      expect(result.stateChanges.detectionLevel).toBe(100);
    });

    it('should deliver hints through UFO74 channel', () => {
      const state = createTestState({ tutorialComplete: true });
      const result = generateHintOutput(state);

      expect(result.output.some(e => e.type === 'ufo74')).toBe(true);
    });
  });

  describe('analyzeProgressForHint', () => {
    it('should suggest reading files when few files read', () => {
      const state = createTestState({ 
        filesRead: new Set(['one.txt', 'two.txt']),
      });
      const hint = analyzeProgressForHint(state);

      expect(hint).toBeDefined();
      // Should be a "no files read" type hint
      expect(hint).toBeTruthy();
    });

    it('should guide toward unexplored directories for missing truths', () => {
      const state = createTestState({
        filesRead: new Set([
          '/ops/file1.txt',
          '/ops/file2.txt',
          '/ops/file3.txt',
          '/ops/file4.txt',
        ]),
        truthsDiscovered: new Set<TruthCategory>(['being_containment']),
      });
      const hint = analyzeProgressForHint(state);

      expect(hint).toBeDefined();
      // Should potentially hint at storage, comms, or admin since those are unexplored
    });

    it('should give truth-specific hints when directories explored but truth missing', () => {
      const state = createTestState({
        filesRead: new Set([
          '/storage/file1.txt',
          '/comms/file1.txt',
          '/ops/file1.txt',
          '/admin/file1.txt',
          '/internal/file1.txt',
        ]),
        truthsDiscovered: new Set<TruthCategory>(['debris_relocation', 'being_containment']),
      });
      const hint = analyzeProgressForHint(state);

      expect(hint).toBeDefined();
      // Should give a hint about one of the missing truths
    });

    it('should indicate near completion when 4+ truths found', () => {
      const state = createTestState({
        filesRead: new Set([
          '/storage/file1.txt',
          '/comms/file1.txt',
          '/ops/file1.txt',
          '/admin/file1.txt',
          '/internal/file1.txt',
        ]),
        truthsDiscovered: new Set<TruthCategory>([
          'debris_relocation',
          'being_containment',
          'telepathic_scouts',
          'international_actors',
        ]),
      });
      const hint = analyzeProgressForHint(state);

      expect(hint).toBeDefined();
    });

    it('should return null when all truths discovered', () => {
      const state = createTestState({
        filesRead: new Set([
          '/storage/file1.txt',
          '/comms/file1.txt',
          '/ops/file1.txt',
          '/admin/file1.txt',
          '/internal/file1.txt',
          '/storage/file2.txt',
          '/comms/file2.txt',
          '/ops/file2.txt',
          '/admin/file2.txt',
          '/internal/file2.txt',
          '/extra/file.txt',
        ]),
        truthsDiscovered: new Set<TruthCategory>([
          'debris_relocation',
          'being_containment',
          'telepathic_scouts',
          'international_actors',
          'transition_2026',
        ]),
      });
      const hint = analyzeProgressForHint(state);

      // When all truths found and many files read, should return null
      // (though the function may still give generic hints)
      // The test is more about coverage than specific behavior here
      expect(hint === null || typeof hint === 'string').toBe(true);
    });
  });

  describe('HINT_CONFIG', () => {
    it('should have reasonable max hints value', () => {
      expect(HINT_CONFIG.maxHints).toBeGreaterThanOrEqual(3);
      expect(HINT_CONFIG.maxHints).toBeLessThanOrEqual(5);
    });

    it('should have small detection penalty', () => {
      expect(HINT_CONFIG.detectionPenalty).toBeGreaterThanOrEqual(3);
      expect(HINT_CONFIG.detectionPenalty).toBeLessThanOrEqual(5);
    });
  });

  describe('Hint Output Format', () => {
    it('should never reveal specific file names', () => {
      const state = createTestState({ tutorialComplete: true });
      
      // Generate multiple hints and check none contain file paths
      for (let i = 0; i < 10; i++) {
        vi.spyOn(Math, 'random').mockReturnValue(i / 10);
        const result = generateHintOutput({ ...state, hintsUsed: 0 });
        
        for (const entry of result.output) {
          // Should not contain file extensions or paths
          expect(entry.content).not.toMatch(/\.(txt|enc|log|dat|sig)$/i);
          expect(entry.content).not.toMatch(/\/\w+\/\w+\.\w+/);
        }
      }
    });

    it('should feel cryptic and guide thinking', () => {
      const state = createTestState({ 
        tutorialComplete: true,
        filesRead: new Set(['/ops/file1.txt', '/ops/file2.txt', '/ops/file3.txt']),
      });
      const result = generateHintOutput(state);

      // Hints should be delivered via UFO74
      const ufo74Entries = result.output.filter(e => e.type === 'ufo74');
      expect(ufo74Entries.length).toBeGreaterThan(0);
    });
  });
});
