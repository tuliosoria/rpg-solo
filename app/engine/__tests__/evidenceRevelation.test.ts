import { describe, it, expect, beforeEach } from 'vitest';
import {
  analyzeFileEvidencePotential,
  isDisturbingContent,
  getFileEvidenceState,
  attemptEvidenceRevelation,
  getEvidencePotentialSummary,
  getDisturbingContentAvatarExpression,
} from '../evidenceRevelation';
import { GameState, DEFAULT_GAME_STATE, TruthCategory, TRUTH_CATEGORIES } from '../../types';

const createTestState = (overrides: Partial<GameState> = {}): GameState => ({
  ...DEFAULT_GAME_STATE,
  seed: 12345,
  rngState: 12345,
  sessionStartTime: Date.now(),
  truthsDiscovered: new Set(),
  fileEvidenceStates: {},
  ...overrides,
});

describe('Evidence Revelation System', () => {
  describe('analyzeFileEvidencePotential', () => {
    it('identifies debris_relocation patterns in content', () => {
      const content = [
        'LOGISTICS MANIFEST — PARTIAL RECOVERY',
        'Container C-7 shipped to undisclosed location',
        'Weight: 45kg',
        'Materials recovered from crash site',
        'Transport logistics confirmed',
      ];
      
      const potentials = analyzeFileEvidencePotential('/test/file.txt', content);
      
      expect(potentials).toContain('debris_relocation');
    });

    it('identifies being_containment patterns in content', () => {
      const content = [
        'MEDICAL EXAMINATION REPORT',
        'Subject: Non-human biological specimen',
        'Containment protocol activated',
        'Quarantine procedures followed',
        'Autopsy scheduled for 0900',
      ];
      
      const potentials = analyzeFileEvidencePotential('/test/file.txt', content);
      
      expect(potentials).toContain('being_containment');
    });

    it('identifies telepathic_scouts patterns in content', () => {
      const content = [
        'SIGNAL ANALYSIS REPORT',
        'Neural pattern detected',
        'Transmission burst recorded',
        'Telepathic communication suspected',
        'EEG readings anomalous',
      ];
      
      const potentials = analyzeFileEvidencePotential('/test/file.txt', content);
      
      expect(potentials).toContain('telepathic_scouts');
    });

    it('identifies international_actors patterns in content', () => {
      const content = [
        'LIAISON NOTE — FOREIGN COORDINATION',
        'Embassy contact confirmed',
        'Diplomatic pouch received',
        'Protocol 7-ECHO acknowledged',
        'Multinational team deployed',
      ];
      
      const potentials = analyzeFileEvidencePotential('/test/file.txt', content);
      
      expect(potentials).toContain('international_actors');
    });

    it('identifies transition_2026 patterns in content', () => {
      const content = [
        'PROJECTION UPDATE — 2026 TRANSITION WINDOW',
        'Timeline convergence detected',
        'Disclosure window approaching',
        'Future projection model updated',
        'Activation countdown initiated',
      ];
      
      const potentials = analyzeFileEvidencePotential('/test/file.txt', content);
      
      expect(potentials).toContain('transition_2026');
    });

    it('identifies multiple evidence types in complex content', () => {
      const content = [
        'CLASSIFIED BRIEFING',
        'Materials recovered and transported to secure facility',
        'Non-human specimens contained in quarantine',
        'Foreign liaisons notified via diplomatic channels',
        'Signal analysis ongoing',
      ];
      
      const potentials = analyzeFileEvidencePotential('/test/file.txt', content);
      
      expect(potentials.length).toBeGreaterThanOrEqual(2);
    });

    it('returns empty array for mundane content', () => {
      const content = [
        'CAFETERIA MENU — WEEK 04',
        'Monday: Strogonoff de frango',
        'Tuesday: Bife à milanesa',
        'Wednesday: Moqueca de peixe',
      ];
      
      const potentials = analyzeFileEvidencePotential('/test/file.txt', content);
      
      expect(potentials).toHaveLength(0);
    });

    it('includes existing reveals in potentials', () => {
      const content = ['Some mundane content'];
      const existingReveals: TruthCategory[] = ['debris_relocation'];
      
      const potentials = analyzeFileEvidencePotential('/test/file.txt', content, existingReveals);
      
      expect(potentials).toContain('debris_relocation');
    });

    it('requires at least 2 pattern matches for potential evidence', () => {
      const content = [
        'Random note',
        'Mentioned transport once but nothing else relevant',
      ];
      
      const potentials = analyzeFileEvidencePotential('/test/file.txt', content);
      
      // Single pattern match should not be enough
      expect(potentials).toHaveLength(0);
    });
  });

  describe('isDisturbingContent', () => {
    it('detects disturbing content with autopsy references', () => {
      const content = [
        'AUTOPSY REPORT',
        'Non-human biological specimen examined',
        'Subject vitals declining rapidly',
      ];
      
      expect(isDisturbingContent(content)).toBe(true);
    });

    it('detects disturbing content with creature references', () => {
      const content = [
        'WITNESS REPORT',
        'Strange creature observed',
        'Subject appeared frightened, caused panic',
      ];
      
      expect(isDisturbingContent(content)).toBe(true);
    });

    it('returns false for mundane content', () => {
      const content = [
        'BUDGET REQUEST — Q1 1996',
        'Personnel: R$ 142,000.00',
        'Equipment: R$ 38,500.00',
      ];
      
      expect(isDisturbingContent(content)).toBe(false);
    });

    it('detects shock expressions in content', () => {
      const content = [
        'Deus me livre!',
        'The pilot couldnt believe what he saw',
        'Eyes only material - classified urgent',
      ];
      
      expect(isDisturbingContent(content)).toBe(true);
    });
  });

  describe('getFileEvidenceState', () => {
    it('creates new state for unknown file', () => {
      const state = createTestState();
      const content = [
        'Materials recovered from crash site',
        'Transport logistics confirmed',
      ];
      
      const fileState = getFileEvidenceState('/test/file.txt', content, undefined, state);
      
      expect(fileState.potentialEvidences).toBeDefined();
      expect(fileState.revealedEvidences).toHaveLength(0);
    });

    it('returns existing state for known file', () => {
      const existingFileState = {
        potentialEvidences: ['debris_relocation' as TruthCategory],
        revealedEvidences: ['debris_relocation' as TruthCategory],
      };
      
      const state = createTestState({
        fileEvidenceStates: {
          '/test/file.txt': existingFileState,
        },
      });
      
      const content = ['Any content'];
      const fileState = getFileEvidenceState('/test/file.txt', content, undefined, state);
      
      expect(fileState).toEqual(existingFileState);
    });

    it('assigns evidence to disturbing files with no patterns', () => {
      const state = createTestState();
      const content = [
        'HORROR!',
        'Non-human creature observed',
        'Subject expired amid screams of terror',
      ];
      
      const fileState = getFileEvidenceState('/test/file.txt', content, undefined, state);
      
      // Disturbing content should guarantee at least one potential
      expect(fileState.potentialEvidences.length).toBeGreaterThanOrEqual(1);
    });

    it('assigns appropriate evidence based on file path for disturbing files', () => {
      const state = createTestState();
      
      // Use content that is disturbing but doesn't match specific patterns
      // to test the path-based fallback assignment
      const genericDisturbingContent = ['Horror occurred', 'Screams heard', 'Panic ensued'];
      
      // Medical path should get being_containment
      const medicalState = getFileEvidenceState(
        '/ops/medical/scary_file.txt', 
        genericDisturbingContent, 
        undefined, 
        state
      );
      expect(medicalState.potentialEvidences).toContain('being_containment');
      
      // Neural path should get telepathic_scouts
      const neuralState = getFileEvidenceState(
        '/comms/neural/scary_file.txt', 
        genericDisturbingContent, 
        undefined, 
        state
      );
      expect(neuralState.potentialEvidences).toContain('telepathic_scouts');
      
      // Transport/storage path should get debris_relocation
      const transportState = getFileEvidenceState(
        '/storage/transport/scary_file.txt',
        genericDisturbingContent,
        undefined,
        state
      );
      expect(transportState.potentialEvidences).toContain('debris_relocation');
    });
  });

  describe('attemptEvidenceRevelation', () => {
    it('reveals ONE evidence on first read', () => {
      const state = createTestState();
      const content = [
        'Materials recovered and transported to facility',
        'Container logistics confirmed',
        'Debris relocation complete',
      ];
      
      const result = attemptEvidenceRevelation('/test/file.txt', content, undefined, state);
      
      expect(result.revealedEvidence).not.toBeNull();
      expect(result.updatedFileState.revealedEvidences).toHaveLength(1);
    });

    it('reveals only one evidence even when file has multiple potentials', () => {
      const state = createTestState();
      const content = [
        'Materials recovered and transported',
        'Container logistics confirmed',
        'Non-human specimens contained',
        'Quarantine protocol activated',
        'Foreign liaison notified',
        'Diplomatic coordination underway',
      ];
      
      const result = attemptEvidenceRevelation('/test/file.txt', content, undefined, state);
      
      // Even with multiple potentials, only ONE should be revealed
      expect(result.updatedFileState.revealedEvidences).toHaveLength(1);
      expect(result.revealedEvidence).not.toBeNull();
    });

    it('reveals unrevealed evidence on subsequent reads', () => {
      // First read
      const state1 = createTestState();
      const content = [
        'Materials recovered and transported',
        'Container logistics confirmed',
        'Non-human specimens contained',
        'Quarantine protocol activated',
      ];
      const existingReveals: TruthCategory[] = ['debris_relocation', 'being_containment'];
      
      const result1 = attemptEvidenceRevelation('/test/file.txt', content, existingReveals, state1);
      
      // Second read with updated state
      const state2 = createTestState({
        fileEvidenceStates: {
          '/test/file.txt': result1.updatedFileState,
        },
        truthsDiscovered: result1.revealedEvidence 
          ? new Set([result1.revealedEvidence])
          : new Set(),
      });
      
      const result2 = attemptEvidenceRevelation('/test/file.txt', content, existingReveals, state2);
      
      // Should reveal a different evidence (if available)
      if (result1.hasMoreEvidences) {
        expect(result2.revealedEvidence).not.toBeNull();
        expect(result2.revealedEvidence).not.toBe(result1.revealedEvidence);
      }
    });

    it('returns null when all evidences already revealed from file', () => {
      const fileState = {
        potentialEvidences: ['debris_relocation' as TruthCategory],
        revealedEvidences: ['debris_relocation' as TruthCategory],
      };
      
      const state = createTestState({
        fileEvidenceStates: {
          '/test/file.txt': fileState,
        },
      });
      
      const content = ['Materials recovered and transported', 'Logistics confirmed'];
      const result = attemptEvidenceRevelation('/test/file.txt', content, undefined, state);
      
      expect(result.revealedEvidence).toBeNull();
      expect(result.hasMoreEvidences).toBe(false);
    });

    it('marks isNewTruth correctly for already-discovered truths', () => {
      const state = createTestState({
        truthsDiscovered: new Set(['debris_relocation']),
      });
      
      const content = [
        'Materials recovered and transported',
        'Container logistics confirmed',
      ];
      const existingReveals: TruthCategory[] = ['debris_relocation'];
      
      const result = attemptEvidenceRevelation('/test/file.txt', content, existingReveals, state);
      
      if (result.revealedEvidence === 'debris_relocation') {
        expect(result.isNewTruth).toBe(false);
      }
    });

    it('prioritizes evidences not yet discovered by player', () => {
      const state = createTestState({
        truthsDiscovered: new Set(['debris_relocation']),
      });
      
      const content = [
        'Materials recovered and transported',
        'Container logistics confirmed',
        'Non-human specimens contained',
        'Quarantine protocol activated',
      ];
      const existingReveals: TruthCategory[] = ['debris_relocation', 'being_containment'];
      
      const result = attemptEvidenceRevelation('/test/file.txt', content, existingReveals, state);
      
      // Should prioritize being_containment since debris_relocation already known
      expect(result.revealedEvidence).toBe('being_containment');
      expect(result.isNewTruth).toBe(true);
    });

    it('provides appropriate revelation context', () => {
      const state = createTestState();
      const content = [
        'Materials recovered and transported',
        'Container logistics confirmed',
      ];
      const existingReveals: TruthCategory[] = ['debris_relocation'];
      
      const result = attemptEvidenceRevelation('/test/file.txt', content, existingReveals, state);
      
      expect(result.revelationContext).toBeDefined();
      expect(result.revelationContext!.length).toBeGreaterThan(0);
    });

    it('is deterministic with same seed', () => {
      const content = [
        'Materials recovered and transported',
        'Container logistics confirmed',
        'Non-human specimens contained',
        'Quarantine protocol activated',
        'Foreign liaison notified',
      ];
      const existingReveals: TruthCategory[] = [
        'debris_relocation', 
        'being_containment', 
        'international_actors'
      ];
      
      const state1 = createTestState({ seed: 99999 });
      const state2 = createTestState({ seed: 99999 });
      
      const result1 = attemptEvidenceRevelation('/test/file.txt', content, existingReveals, state1);
      const result2 = attemptEvidenceRevelation('/test/file.txt', content, existingReveals, state2);
      
      expect(result1.revealedEvidence).toBe(result2.revealedEvidence);
    });

    it('produces different results with different seeds', () => {
      const content = [
        'Materials recovered and transported',
        'Container logistics confirmed',
        'Non-human specimens contained',
        'Quarantine protocol activated',
        'Foreign liaison notified',
      ];
      const existingReveals: TruthCategory[] = [
        'debris_relocation', 
        'being_containment', 
        'international_actors'
      ];
      
      // Try multiple different seeds to find variance
      const results = new Set<TruthCategory | null>();
      for (let seed = 0; seed < 100; seed++) {
        const state = createTestState({ seed });
        const result = attemptEvidenceRevelation('/test/file.txt', content, existingReveals, state);
        results.add(result.revealedEvidence);
      }
      
      // With 100 different seeds, we should see multiple different results
      expect(results.size).toBeGreaterThan(1);
    });
  });

  describe('getEvidencePotentialSummary', () => {
    it('returns correct summary for file with potential evidences', () => {
      const state = createTestState();
      const content = [
        'Materials recovered and transported',
        'Container logistics confirmed',
      ];
      const existingReveals: TruthCategory[] = ['debris_relocation'];
      
      const summary = getEvidencePotentialSummary('/test/file.txt', content, existingReveals, state);
      
      expect(summary.hasPotential).toBe(true);
      expect(summary.unrevealedCount).toBe(1);
    });

    it('detects disturbing content correctly', () => {
      const state = createTestState();
      const content = [
        'Non-human creature autopsy report',
        'Specimen expired during examination',
      ];
      
      const summary = getEvidencePotentialSummary('/test/file.txt', content, undefined, state);
      
      expect(summary.isDisturbing).toBe(true);
    });

    it('reports zero unrevealed when all evidences revealed', () => {
      const fileState = {
        potentialEvidences: ['debris_relocation' as TruthCategory],
        revealedEvidences: ['debris_relocation' as TruthCategory],
      };
      
      const state = createTestState({
        fileEvidenceStates: {
          '/test/file.txt': fileState,
        },
      });
      
      const content = ['Materials recovered and transported', 'Logistics confirmed'];
      const summary = getEvidencePotentialSummary('/test/file.txt', content, undefined, state);
      
      expect(summary.unrevealedCount).toBe(0);
    });
  });

  describe('getDisturbingContentAvatarExpression', () => {
    it('returns scared for very disturbing content', () => {
      const content = [
        'AUTOPSY REPORT',
        'Non-human creature examined',
        'Specimen expired during procedure',
      ];
      
      const expression = getDisturbingContentAvatarExpression(content);
      
      expect(expression).toBe('scared');
    });

    it('returns shocked for moderately disturbing content', () => {
      const content = [
        'CLASSIFIED URGENT REPORT',
        'Eyes only material',
        'Panic situation developing',
      ];
      
      const expression = getDisturbingContentAvatarExpression(content);
      
      expect(expression).toBe('shocked');
    });

    it('returns null for mundane content', () => {
      const content = [
        'BUDGET MEMO',
        'Paper clip inventory',
        'Office supplies list',
      ];
      
      const expression = getDisturbingContentAvatarExpression(content);
      
      expect(expression).toBeNull();
    });
  });

  describe('Integration: Multiple reads reveal different evidences', () => {
    it('reveals all potentials across multiple reads', () => {
      const content = [
        'Materials recovered and transported to facility',
        'Container logistics confirmed',
        'Non-human specimens contained',
        'Quarantine protocol activated',
      ];
      const existingReveals: TruthCategory[] = ['debris_relocation', 'being_containment'];
      
      let state = createTestState();
      const revealedEvidences: TruthCategory[] = [];
      
      // Simulate multiple reads
      for (let i = 0; i < 5; i++) {
        const result = attemptEvidenceRevelation('/test/file.txt', content, existingReveals, state);
        
        if (result.revealedEvidence) {
          revealedEvidences.push(result.revealedEvidence);
          
          // Update state for next read
          state = createTestState({
            ...state,
            fileEvidenceStates: {
              ...state.fileEvidenceStates,
              '/test/file.txt': result.updatedFileState,
            },
            truthsDiscovered: new Set([...state.truthsDiscovered, result.revealedEvidence]),
          });
        }
        
        if (!result.hasMoreEvidences) {
          break;
        }
      }
      
      // Should have revealed both evidences
      expect(revealedEvidences).toContain('debris_relocation');
      expect(revealedEvidences).toContain('being_containment');
      
      // Each evidence should only appear once
      const uniqueReveals = new Set(revealedEvidences);
      expect(uniqueReveals.size).toBe(revealedEvidences.length);
    });
  });

  describe('Requirement: Disturbing files guarantee evidence potential', () => {
    it('ensures disturbing files have at least one potential evidence', () => {
      const state = createTestState();
      
      // Content that is disturbing but doesn't match any specific pattern
      const disturbingContent = [
        'Something horrible happened here',
        'The creature was unlike anything seen before',
        'Witness suffered trauma and panic attacks',
      ];
      
      const fileState = getFileEvidenceState(
        '/random/path/scary.txt', 
        disturbingContent, 
        undefined, 
        state
      );
      
      // Disturbing content should always have at least one potential
      expect(fileState.potentialEvidences.length).toBeGreaterThanOrEqual(1);
    });
  });

  describe('Requirement: Revelations coherent with file content', () => {
    it('only reveals evidences that match file content patterns', () => {
      const state = createTestState();
      
      // Content clearly about debris/materials, NOT about beings or telepathy
      const content = [
        'TRANSPORT MANIFEST',
        'Container shipped via truck',
        'Materials recovered from crash site',
        'Logistics operation successful',
        'Cargo secured at destination',
      ];
      
      const result = attemptEvidenceRevelation('/storage/manifest.txt', content, undefined, state);
      
      // Should only reveal debris_relocation, not other categories
      if (result.revealedEvidence) {
        expect(result.revealedEvidence).toBe('debris_relocation');
      }
    });
  });
});
