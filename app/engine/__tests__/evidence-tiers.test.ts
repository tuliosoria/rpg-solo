/**
 * Evidence Tiers System Tests
 * 
 * Tests the tiered evidence system that forces players to use correlate/connect commands.
 */

import { describe, it, expect, beforeEach } from 'vitest';
import {
  attemptCorroborateUpgrade,
  attemptProvenUpgrade,
  countEvidenceByTier,
  determineEndingQuality,
  getFileTier,
  getFileTierSymbol,
  initializeEvidenceTier,
} from '../evidenceRevelation';
import { GameState, DEFAULT_GAME_STATE, TRUTH_CATEGORIES, EvidenceTierState } from '../../types';

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

describe('Evidence Tiers System', () => {
  describe('initializeEvidenceTier', () => {
    it('should create a fragment tier for new evidence', () => {
      const state = createTestState();
      const result = initializeEvidenceTier('debris_relocation', '/storage/test.txt', state);
      
      expect(result.tier).toBe('fragment');
      expect(result.linkedFiles).toContain('/storage/test.txt');
    });

    it('should add file to existing tier state', () => {
      const state = createTestState({
        evidenceTiers: {
          debris_relocation: {
            tier: 'fragment',
            linkedFiles: ['/existing.txt'],
          },
        },
      });
      const result = initializeEvidenceTier('debris_relocation', '/new.txt', state);
      
      expect(result.linkedFiles).toContain('/existing.txt');
      expect(result.linkedFiles).toContain('/new.txt');
    });
  });

  describe('attemptCorroborateUpgrade', () => {
    it('should upgrade fragment to corroborated when files share evidence', () => {
      const state = createTestState({
        truthsDiscovered: new Set(['debris_relocation']),
        fileEvidenceStates: {
          '/a.txt': { potentialEvidences: ['debris_relocation'], revealedEvidences: ['debris_relocation'] },
          '/b.txt': { potentialEvidences: ['debris_relocation'], revealedEvidences: ['debris_relocation'] },
        },
        evidenceTiers: {
          debris_relocation: { tier: 'fragment', linkedFiles: ['/a.txt'] },
        },
      });

      const result = attemptCorroborateUpgrade('/a.txt', '/b.txt', state);
      
      expect(result.success).toBe(true);
      expect(result.category).toBe('debris_relocation');
      expect(result.previousTier).toBe('fragment');
      expect(result.newTier).toBe('corroborated');
      expect(result.updatedTierState?.corroboratingFiles).toEqual(['/a.txt', '/b.txt']);
    });

    it('should fail if files do not share evidence', () => {
      const state = createTestState({
        truthsDiscovered: new Set(['debris_relocation', 'being_containment']),
        fileEvidenceStates: {
          '/a.txt': { potentialEvidences: ['debris_relocation'], revealedEvidences: ['debris_relocation'] },
          '/b.txt': { potentialEvidences: ['being_containment'], revealedEvidences: ['being_containment'] },
        },
        evidenceTiers: {
          debris_relocation: { tier: 'fragment', linkedFiles: ['/a.txt'] },
          being_containment: { tier: 'fragment', linkedFiles: ['/b.txt'] },
        },
      });

      const result = attemptCorroborateUpgrade('/a.txt', '/b.txt', state);
      
      expect(result.success).toBe(false);
      expect(result.message).toContain('do not share evidence');
    });

    it('should not upgrade already corroborated evidence', () => {
      const state = createTestState({
        truthsDiscovered: new Set(['debris_relocation']),
        fileEvidenceStates: {
          '/a.txt': { potentialEvidences: ['debris_relocation'], revealedEvidences: ['debris_relocation'] },
          '/b.txt': { potentialEvidences: ['debris_relocation'], revealedEvidences: ['debris_relocation'] },
        },
        evidenceTiers: {
          debris_relocation: { 
            tier: 'corroborated', 
            linkedFiles: ['/a.txt', '/b.txt'],
            corroboratingFiles: ['/a.txt', '/b.txt'],
          },
        },
      });

      const result = attemptCorroborateUpgrade('/a.txt', '/b.txt', state);
      
      expect(result.success).toBe(false);
      expect(result.message).toContain('already corroborated');
    });
  });

  describe('attemptProvenUpgrade', () => {
    it('should upgrade corroborated to proven with 3 connected files', () => {
      const state = createTestState({
        truthsDiscovered: new Set(['debris_relocation']),
        fileEvidenceStates: {
          '/a.txt': { potentialEvidences: ['debris_relocation'], revealedEvidences: ['debris_relocation'] },
          '/b.txt': { potentialEvidences: ['debris_relocation'], revealedEvidences: ['debris_relocation'] },
          '/c.txt': { potentialEvidences: ['debris_relocation'], revealedEvidences: ['debris_relocation'] },
        },
        evidenceTiers: {
          debris_relocation: { 
            tier: 'corroborated', 
            linkedFiles: ['/a.txt', '/b.txt'],
            corroboratingFiles: ['/a.txt', '/b.txt'],
          },
        },
      });

      const existingLinks: Array<[string, string]> = [['/a.txt', '/b.txt']];
      const result = attemptProvenUpgrade('/b.txt', '/c.txt', existingLinks, state);
      
      expect(result.success).toBe(true);
      expect(result.category).toBe('debris_relocation');
      expect(result.newTier).toBe('proven');
      expect(result.updatedTierState?.proofChain).toHaveLength(3);
    });

    it('should not upgrade with only 2 connected files', () => {
      const state = createTestState({
        truthsDiscovered: new Set(['debris_relocation']),
        fileEvidenceStates: {
          '/a.txt': { potentialEvidences: ['debris_relocation'], revealedEvidences: ['debris_relocation'] },
          '/b.txt': { potentialEvidences: ['debris_relocation'], revealedEvidences: ['debris_relocation'] },
        },
        evidenceTiers: {
          debris_relocation: { 
            tier: 'corroborated', 
            linkedFiles: ['/a.txt', '/b.txt'],
            corroboratingFiles: ['/a.txt', '/b.txt'],
          },
        },
      });

      const existingLinks: Array<[string, string]> = [];
      const result = attemptProvenUpgrade('/a.txt', '/b.txt', existingLinks, state);
      
      expect(result.success).toBe(false);
    });
  });

  describe('countEvidenceByTier', () => {
    it('should count evidence by tier correctly', () => {
      const state = createTestState({
        truthsDiscovered: new Set(['debris_relocation', 'being_containment', 'telepathic_scouts']),
        evidenceTiers: {
          debris_relocation: { tier: 'proven', linkedFiles: [] },
          being_containment: { tier: 'corroborated', linkedFiles: [] },
          telepathic_scouts: { tier: 'fragment', linkedFiles: [] },
        },
      });

      const counts = countEvidenceByTier(state);
      
      expect(counts.proven).toBe(1);
      expect(counts.corroborated).toBe(1);
      expect(counts.fragments).toBe(1);
      expect(counts.total).toBe(3);
    });

    it('should count evidence without tier state as fragments', () => {
      const state = createTestState({
        truthsDiscovered: new Set(['debris_relocation']),
        evidenceTiers: {},
      });

      const counts = countEvidenceByTier(state);
      
      expect(counts.fragments).toBe(1);
      expect(counts.total).toBe(1);
    });
  });

  describe('determineEndingQuality', () => {
    it('should return best for 5 proven', () => {
      const state = createTestState({
        truthsDiscovered: new Set(TRUTH_CATEGORIES),
        evidenceTiers: Object.fromEntries(
          TRUTH_CATEGORIES.map(c => [c, { tier: 'proven', linkedFiles: [] } as EvidenceTierState])
        ),
      });

      expect(determineEndingQuality(state)).toBe('best');
    });

    it('should return good for 3+ proven', () => {
      const state = createTestState({
        truthsDiscovered: new Set(TRUTH_CATEGORIES),
        evidenceTiers: {
          debris_relocation: { tier: 'proven', linkedFiles: [] },
          being_containment: { tier: 'proven', linkedFiles: [] },
          telepathic_scouts: { tier: 'proven', linkedFiles: [] },
          international_actors: { tier: 'corroborated', linkedFiles: [] },
          transition_2026: { tier: 'corroborated', linkedFiles: [] },
        },
      });

      expect(determineEndingQuality(state)).toBe('good');
    });

    it('should return neutral for 5 corroborated', () => {
      const state = createTestState({
        truthsDiscovered: new Set(TRUTH_CATEGORIES),
        evidenceTiers: Object.fromEntries(
          TRUTH_CATEGORIES.map(c => [c, { tier: 'corroborated', linkedFiles: [] } as EvidenceTierState])
        ),
      });

      expect(determineEndingQuality(state)).toBe('neutral');
    });

    it('should return bad for only fragments', () => {
      const state = createTestState({
        truthsDiscovered: new Set(TRUTH_CATEGORIES),
        evidenceTiers: Object.fromEntries(
          TRUTH_CATEGORIES.map(c => [c, { tier: 'fragment', linkedFiles: [] } as EvidenceTierState])
        ),
      });

      expect(determineEndingQuality(state)).toBe('bad');
    });

    it('should return bad for less than 5 truths', () => {
      const state = createTestState({
        truthsDiscovered: new Set(['debris_relocation', 'being_containment']),
        evidenceTiers: {
          debris_relocation: { tier: 'proven', linkedFiles: [] },
          being_containment: { tier: 'proven', linkedFiles: [] },
        },
      });

      expect(determineEndingQuality(state)).toBe('bad');
    });
  });

  describe('getFileTier', () => {
    it('should return the highest tier among file contributions', () => {
      const state = createTestState({
        truthsDiscovered: new Set(['debris_relocation', 'being_containment']),
        fileEvidenceStates: {
          '/multi.txt': { 
            potentialEvidences: ['debris_relocation', 'being_containment'], 
            revealedEvidences: ['debris_relocation', 'being_containment'] 
          },
        },
        evidenceTiers: {
          debris_relocation: { tier: 'fragment', linkedFiles: [] },
          being_containment: { tier: 'proven', linkedFiles: [] },
        },
      });

      const tier = getFileTier('/multi.txt', state);
      
      expect(tier).toBe('proven'); // Highest tier among contributions
    });

    it('should return null for files without evidence', () => {
      const state = createTestState();
      
      expect(getFileTier('/unknown.txt', state)).toBeNull();
    });
  });

  describe('getFileTierSymbol', () => {
    it('should return correct symbol for each tier', () => {
      const fragmentState = createTestState({
        fileEvidenceStates: { '/f.txt': { potentialEvidences: ['debris_relocation'], revealedEvidences: ['debris_relocation'] } },
        truthsDiscovered: new Set(['debris_relocation']),
        evidenceTiers: { debris_relocation: { tier: 'fragment', linkedFiles: [] } },
      });
      expect(getFileTierSymbol('/f.txt', fragmentState)).toBe('○');

      const corrState = createTestState({
        fileEvidenceStates: { '/c.txt': { potentialEvidences: ['debris_relocation'], revealedEvidences: ['debris_relocation'] } },
        truthsDiscovered: new Set(['debris_relocation']),
        evidenceTiers: { debris_relocation: { tier: 'corroborated', linkedFiles: [] } },
      });
      expect(getFileTierSymbol('/c.txt', corrState)).toBe('◆');

      const provenState = createTestState({
        fileEvidenceStates: { '/p.txt': { potentialEvidences: ['debris_relocation'], revealedEvidences: ['debris_relocation'] } },
        truthsDiscovered: new Set(['debris_relocation']),
        evidenceTiers: { debris_relocation: { tier: 'proven', linkedFiles: [] } },
      });
      expect(getFileTierSymbol('/p.txt', provenState)).toBe('●');
    });
  });
});
