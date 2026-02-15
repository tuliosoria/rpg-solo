// Tests for the multiple endings system

import { describe, it, expect } from 'vitest';
import {
  EndingFlags,
  EndingVariant,
  determineEndingVariant,
  getEndingFlags,
  generateEnding,
  getEndingTitle,
  hasDiscoveredConspiracyFiles,
} from '../endings';
import { GameState, DEFAULT_GAME_STATE } from '../../types';

// Helper to create test state
function createTestState(overrides: Partial<GameState> = {}): GameState {
  return {
    ...DEFAULT_GAME_STATE,
    ...overrides,
  } as GameState;
}

describe('Multiple Endings System', () => {
  describe('determineEndingVariant', () => {
    it('returns controlled_disclosure when no modifiers are active', () => {
      const flags: EndingFlags = {
        conspiracyFilesLeaked: false,
        prisoner46Released: false,
        neuralLinkAuthenticated: false,
      };
      expect(determineEndingVariant(flags)).toBe('controlled_disclosure');
    });

    it('returns global_panic when only conspiracy files are leaked', () => {
      const flags: EndingFlags = {
        conspiracyFilesLeaked: true,
        prisoner46Released: false,
        neuralLinkAuthenticated: false,
      };
      expect(determineEndingVariant(flags)).toBe('global_panic');
    });

    it('returns undeniable_confirmation when only prisoner 46 is released', () => {
      const flags: EndingFlags = {
        conspiracyFilesLeaked: false,
        prisoner46Released: true,
        neuralLinkAuthenticated: false,
      };
      expect(determineEndingVariant(flags)).toBe('undeniable_confirmation');
    });

    it('returns total_collapse when conspiracy + prisoner 46', () => {
      const flags: EndingFlags = {
        conspiracyFilesLeaked: true,
        prisoner46Released: true,
        neuralLinkAuthenticated: false,
      };
      expect(determineEndingVariant(flags)).toBe('total_collapse');
    });

    it('returns personal_contamination when only neural link is used', () => {
      const flags: EndingFlags = {
        conspiracyFilesLeaked: false,
        prisoner46Released: false,
        neuralLinkAuthenticated: true,
      };
      expect(determineEndingVariant(flags)).toBe('personal_contamination');
    });

    it('returns paranoid_awakening when conspiracy + neural link', () => {
      const flags: EndingFlags = {
        conspiracyFilesLeaked: true,
        prisoner46Released: false,
        neuralLinkAuthenticated: true,
      };
      expect(determineEndingVariant(flags)).toBe('paranoid_awakening');
    });

    it('returns witnessed_truth when prisoner 46 + neural link', () => {
      const flags: EndingFlags = {
        conspiracyFilesLeaked: false,
        prisoner46Released: true,
        neuralLinkAuthenticated: true,
      };
      expect(determineEndingVariant(flags)).toBe('witnessed_truth');
    });

    it('returns complete_revelation when all modifiers are active', () => {
      const flags: EndingFlags = {
        conspiracyFilesLeaked: true,
        prisoner46Released: true,
        neuralLinkAuthenticated: true,
      };
      expect(determineEndingVariant(flags)).toBe('complete_revelation');
    });
  });

  describe('getEndingFlags', () => {
    it('extracts flags from game state', () => {
      const state = createTestState({
        flags: {
          conspiracyFilesLeaked: true,
          prisoner46Released: false,
          neuralLinkAuthenticated: true,
        },
      });
      const flags = getEndingFlags(state);
      expect(flags).toEqual({
        conspiracyFilesLeaked: true,
        prisoner46Released: false,
        neuralLinkAuthenticated: true,
      });
    });

    it('defaults missing flags to false', () => {
      const state = createTestState({
        flags: {},
      });
      const flags = getEndingFlags(state);
      expect(flags).toEqual({
        conspiracyFilesLeaked: false,
        prisoner46Released: false,
        neuralLinkAuthenticated: false,
      });
    });
  });

  describe('generateEnding', () => {
    it('generates complete ending result', () => {
      const state = createTestState({
        flags: {
          conspiracyFilesLeaked: true,
          prisoner46Released: true,
          neuralLinkAuthenticated: true,
        },
      });
      const ending = generateEnding(state);
      
      expect(ending.variant).toBe('complete_revelation');
      expect(ending.title).toBe('COMPLETE REVELATION');
      expect(ending.worldAftermath).toBeInstanceOf(Array);
      expect(ending.worldAftermath.length).toBeGreaterThan(0);
      expect(ending.personalAftermath).toBeInstanceOf(Array); // Has neural link content
      expect(ending.epilogue).toBeInstanceOf(Array);
    });

    it('controlled disclosure has no personal aftermath', () => {
      const state = createTestState({
        flags: {},
      });
      const ending = generateEnding(state);
      
      expect(ending.variant).toBe('controlled_disclosure');
      expect(ending.personalAftermath).toBeUndefined();
    });

    it('neural link endings have personal aftermath', () => {
      const state = createTestState({
        flags: {
          neuralLinkAuthenticated: true,
        },
      });
      const ending = generateEnding(state);
      
      expect(ending.variant).toBe('personal_contamination');
      expect(ending.personalAftermath).toBeDefined();
      expect(ending.personalAftermath!.length).toBeGreaterThan(0);
    });
  });

  describe('getEndingTitle', () => {
    const variants: EndingVariant[] = [
      'controlled_disclosure',
      'global_panic',
      'undeniable_confirmation',
      'total_collapse',
      'personal_contamination',
      'paranoid_awakening',
      'witnessed_truth',
      'complete_revelation',
    ];

    variants.forEach(variant => {
      it(`returns title for ${variant}`, () => {
        const title = getEndingTitle(variant);
        expect(title).toBeTruthy();
        expect(typeof title).toBe('string');
        expect(title.length).toBeGreaterThan(0);
      });
    });
  });

  describe('hasDiscoveredConspiracyFiles', () => {
    it('returns false when no conspiracy files seen', () => {
      const state = createTestState({
        conspiracyFilesSeen: new Set<string>(),
      });
      expect(hasDiscoveredConspiracyFiles(state)).toBe(false);
    });

    it('returns true when conspiracy files have been seen', () => {
      const state = createTestState({
        conspiracyFilesSeen: new Set(['economic_transition_memo.txt']),
      });
      expect(hasDiscoveredConspiracyFiles(state)).toBe(true);
    });
  });

  describe('Ending combinations coverage', () => {
    // Test all 8 combinations explicitly
    const combinations = [
      { c: false, p: false, n: false, expected: 'controlled_disclosure' },
      { c: true, p: false, n: false, expected: 'global_panic' },
      { c: false, p: true, n: false, expected: 'undeniable_confirmation' },
      { c: true, p: true, n: false, expected: 'total_collapse' },
      { c: false, p: false, n: true, expected: 'personal_contamination' },
      { c: true, p: false, n: true, expected: 'paranoid_awakening' },
      { c: false, p: true, n: true, expected: 'witnessed_truth' },
      { c: true, p: true, n: true, expected: 'complete_revelation' },
    ] as const;

    combinations.forEach(({ c, p, n, expected }) => {
      it(`conspiracy=${c}, prisoner=${p}, neural=${n} → ${expected}`, () => {
        const flags: EndingFlags = {
          conspiracyFilesLeaked: c,
          prisoner46Released: p,
          neuralLinkAuthenticated: n,
        };
        expect(determineEndingVariant(flags)).toBe(expected);
      });
    });
  });
});
