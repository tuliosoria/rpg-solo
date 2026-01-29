/**
 * Simplified Evidence System Tests
 *
 * The tier upgrade system (correlate/connect commands) has been removed.
 * Evidence is now simply "discovered" when reading files.
 */

import { describe, it, expect } from 'vitest';
import {
  countEvidence,
  getCaseStrengthDescription,
  fileHasEvidence,
  getFileEvidenceSymbol,
  initializeEvidence,
  EVIDENCE_SYMBOL,
} from '../evidenceRevelation';
import { GameState, DEFAULT_GAME_STATE, TRUTH_CATEGORIES } from '../../types';

// Helper to create a test state
function createTestState(overrides: Partial<GameState> = {}): GameState {
  return {
    ...DEFAULT_GAME_STATE,
    seed: 12345,
    rngState: 12345,
    sessionStartTime: Date.now(),
    ...overrides,
  } as GameState;
}

describe('Simplified Evidence System', () => {
  describe('initializeEvidence', () => {
    it('should create evidence state for new evidence', () => {
      const state = createTestState();
      const result = initializeEvidence('debris_relocation', '/storage/test.txt', state);

      expect(result.linkedFiles).toContain('/storage/test.txt');
    });

    it('should add file to existing evidence state', () => {
      const state = createTestState({
        evidenceStates: {
          debris_relocation: {
            linkedFiles: ['/existing.txt'],
          },
        },
      });
      const result = initializeEvidence('debris_relocation', '/new.txt', state);

      expect(result.linkedFiles).toContain('/existing.txt');
      expect(result.linkedFiles).toContain('/new.txt');
    });
  });

  describe('countEvidence', () => {
    it('should count discovered evidence correctly', () => {
      const state = createTestState({
        truthsDiscovered: new Set(['debris_relocation', 'being_containment', 'telepathic_scouts']),
      });

      const count = countEvidence(state);

      expect(count).toBe(3);
    });

    it('should return 0 for no discovered evidence', () => {
      const state = createTestState({
        truthsDiscovered: new Set(),
      });

      const count = countEvidence(state);

      expect(count).toBe(0);
    });

    it('should return 5 when all evidence discovered', () => {
      const state = createTestState({
        truthsDiscovered: new Set(TRUTH_CATEGORIES),
      });

      const count = countEvidence(state);

      expect(count).toBe(5);
    });
  });

  describe('getCaseStrengthDescription', () => {
    it('should return COMPLETE for 5 evidence', () => {
      const state = createTestState({
        truthsDiscovered: new Set(TRUTH_CATEGORIES),
      });

      const description = getCaseStrengthDescription(state);

      expect(description).toContain('COMPLETE');
    });

    it('should return STRONG for 4 evidence', () => {
      const state = createTestState({
        truthsDiscovered: new Set([
          'debris_relocation',
          'being_containment',
          'telepathic_scouts',
          'international_actors',
        ]),
      });

      const description = getCaseStrengthDescription(state);

      expect(description).toContain('STRONG');
    });

    it('should return MODERATE for 3 evidence', () => {
      const state = createTestState({
        truthsDiscovered: new Set(['debris_relocation', 'being_containment', 'telepathic_scouts']),
      });

      const description = getCaseStrengthDescription(state);

      expect(description).toContain('MODERATE');
    });

    it('should return DEVELOPING for 1-2 evidence', () => {
      const state = createTestState({
        truthsDiscovered: new Set(['debris_relocation']),
      });

      const description = getCaseStrengthDescription(state);

      expect(description).toContain('DEVELOPING');
    });

    it('should return NONE for no evidence', () => {
      const state = createTestState({
        truthsDiscovered: new Set(),
      });

      const description = getCaseStrengthDescription(state);

      expect(description).toContain('NONE');
    });
  });

  describe('fileHasEvidence', () => {
    it('should return true for files with revealed evidence', () => {
      const state = createTestState({
        fileEvidenceStates: {
          '/test.txt': {
            potentialEvidences: ['debris_relocation'],
            revealedEvidences: ['debris_relocation'],
          },
        },
      });

      expect(fileHasEvidence('/test.txt', state)).toBe(true);
    });

    it('should return false for files without evidence', () => {
      const state = createTestState();

      expect(fileHasEvidence('/unknown.txt', state)).toBe(false);
    });

    it('should return false for files with no revealed evidence', () => {
      const state = createTestState({
        fileEvidenceStates: {
          '/test.txt': {
            potentialEvidences: ['debris_relocation'],
            revealedEvidences: [],
          },
        },
      });

      expect(fileHasEvidence('/test.txt', state)).toBe(false);
    });
  });

  describe('getFileEvidenceSymbol', () => {
    it('should return evidence symbol for files with evidence', () => {
      const state = createTestState({
        fileEvidenceStates: {
          '/test.txt': {
            potentialEvidences: ['debris_relocation'],
            revealedEvidences: ['debris_relocation'],
          },
        },
      });

      expect(getFileEvidenceSymbol('/test.txt', state)).toBe(EVIDENCE_SYMBOL);
    });

    it('should return null for files without evidence', () => {
      const state = createTestState();

      expect(getFileEvidenceSymbol('/unknown.txt', state)).toBeNull();
    });
  });
});
