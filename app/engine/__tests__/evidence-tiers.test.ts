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
  EVIDENCE_SYMBOL as _EVIDENCE_SYMBOL,
} from '../evidenceRevelation';
import { GameState, DEFAULT_GAME_STATE } from '../../types';

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
  describe('countEvidence', () => {
    it('should count discovered evidence correctly', () => {
      const state = createTestState({
        evidenceCount: 3,
      });

      const count = countEvidence(state);

      expect(count).toBe(3);
    });

    it('should return 0 for no discovered evidence', () => {
      const state = createTestState({
        evidenceCount: 0,
      });

      const count = countEvidence(state);

      expect(count).toBe(0);
    });

    it('should derive discovered evidence from evidence-bearing files', () => {
      const state = createTestState({
        evidenceCount: 0,
        filesRead: new Set([
          '/internal/jardim_andere_incident.txt',
          '/storage/quarantine/bio_container.log',
        ]),
      });

      const count = countEvidence(state);

      expect(count).toBe(2);
    });

    it('should count currently designated evidence files like thirty_year_cycle.txt', () => {
      const state = createTestState({
        evidenceCount: 0,
        filesRead: new Set([
          '/admin/thirty_year_cycle.txt',
          '/admin/thirty_year_cycle.txt',
        ]),
      });

      const count = countEvidence(state);

      expect(count).toBe(1);
    });

    it('should cap stored evidence progress at 10', () => {
      const state = createTestState({
        evidenceCount: 12,
        filesRead: new Set([
          '/internal/jardim_andere_incident.txt',
          '/internal/misc/incident_report_1996_01_VG.txt',
          '/storage/quarantine/bio_container.log',
          '/storage/quarantine/autopsy_alpha.log',
          '/ops/prato/archive/patrol_observation_shift_04.txt',
          '/admin/colonization_model.red',
          '/admin/thirty_year_cycle.txt',
        ]),
      });

      const count = countEvidence(state);

      expect(count).toBe(10);
    });
  });

  describe('getCaseStrengthDescription', () => {
    it('should return COMPLETE for 10 evidence', () => {
      const state = createTestState({
        evidenceCount: 10,
      });

      const description = getCaseStrengthDescription(state);

      expect(description).toContain('COMPLETE');
    });

    it('should return STRONG for 8 evidence', () => {
      const state = createTestState({
        evidenceCount: 8,
      });

      const description = getCaseStrengthDescription(state);

      expect(description).toContain('STRONG');
    });

    it('should return MODERATE for 5 evidence', () => {
      const state = createTestState({
        evidenceCount: 5,
      });

      const description = getCaseStrengthDescription(state);

      expect(description).toContain('MODERATE');
    });

    it('should return DEVELOPING for 1-2 evidence', () => {
      const state = createTestState({
        evidenceCount: 1,
      });

      const description = getCaseStrengthDescription(state);

      expect(description).toContain('DEVELOPING');
    });

    it('should return NONE for no evidence', () => {
      const state = createTestState({
        evidenceCount: 0,
      });

      const description = getCaseStrengthDescription(state);

      expect(description).toContain('NONE');
    });
  });
});
