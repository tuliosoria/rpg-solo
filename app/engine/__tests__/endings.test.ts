import { describe, it, expect } from 'vitest';
import {
  type EndingFlags,
  type EndingId,
  determineEnding,
  determineEndingVariant,
  generateEnding,
  getEndingFlags,
  getEndingTitle,
  hasDiscoveredConspiracyFiles,
} from '../endings';
import { GameState, DEFAULT_GAME_STATE } from '../../types';

function createTestState(overrides: Partial<GameState> = {}): GameState {
  return {
    ...DEFAULT_GAME_STATE,
    ...overrides,
  } as GameState;
}

function dossier(...fileNames: string[]): Set<string> {
  return new Set(fileNames.map(fileName => `/archive/${fileName}`));
}

const REPRESENTATIVE_DOSSIERS: Record<EndingId, Set<string>> = {
  ridiculed: dossier(
    'witness_statement_raw.txt',
    'witness_statement_original.txt',
    'witness_visit_log.txt'
  ),
  ufo74_exposed: dossier('ghost_in_machine.enc', 'audio_transcript_brief.txt'),
  the_2026_warning: dossier('thirty_year_cycle.txt', 'projection_update_2026.txt'),
  government_scandal: dossier(
    'incident_report_1996_01_VG.txt',
    'initial_response_orders.txt',
    'transport_log_96.txt',
    'jardim_andere_incident.txt'
  ),
  prisoner_45_freed: dossier(
    'neural_cluster_experiment.red',
    'neural_cluster_memo.txt',
    'witness_statement_raw.txt'
  ),
  harvest_understood: dossier('extraction_mechanism.red', 'colonization_model.red'),
  nothing_changes: dossier(
    'audio_transcript_brief.txt',
    'alpha_journal.log',
    'autopsy_alpha.log',
    'incident_report_1996_01_VG.txt'
  ),
  incomplete_picture: dossier('audio_transcript_brief.txt', 'alpha_journal.log'),
  wrong_story: dossier(
    'journalist_payments.enc',
    'media_contacts.txt',
    'budget_request_q1_96.txt',
    'cafeteria_menu_week03.txt',
    'parking_allocation_jan96.txt'
  ),
  hackerkid_caught: dossier('URGENT_classified_alpha.txt', 'SMOKING_GUN_proof.txt'),
  secret_ending: dossier(
    'ghost_in_machine.enc',
    'alpha_neural_connection.psi',
    'thirty_year_cycle.txt',
    'convergence_model_draft.txt'
  ),
  real_ending: dossier(
    'audio_transcript_brief.txt',
    'alpha_journal.log',
    'autopsy_alpha.log',
    'bio_container.log',
    'witness_statement_raw.txt',
    'incident_report_1996_01_VG.txt',
    'initial_response_orders.txt'
  ),
};

describe('Endings', () => {
  describe('determineEnding', () => {
    Object.entries(REPRESENTATIVE_DOSSIERS).forEach(([endingId, savedFiles]) => {
      it(`reaches ${endingId}`, () => {
        expect(determineEnding(savedFiles)).toBe(endingId);
      });
    });
  });

  describe('determineEndingVariant', () => {
    const combinations: Array<{ flags: EndingFlags; expected: EndingId }> = [
      {
        flags: {
          conspiracyFilesLeaked: false,
          alphaReleased: false,
          neuralLinkAuthenticated: false,
        },
        expected: 'incomplete_picture',
      },
      {
        flags: {
          conspiracyFilesLeaked: true,
          alphaReleased: false,
          neuralLinkAuthenticated: false,
        },
        expected: 'government_scandal',
      },
      {
        flags: {
          conspiracyFilesLeaked: false,
          alphaReleased: true,
          neuralLinkAuthenticated: false,
        },
        expected: 'prisoner_45_freed',
      },
      {
        flags: {
          conspiracyFilesLeaked: true,
          alphaReleased: true,
          neuralLinkAuthenticated: false,
        },
        expected: 'real_ending',
      },
      {
        flags: {
          conspiracyFilesLeaked: false,
          alphaReleased: false,
          neuralLinkAuthenticated: true,
        },
        expected: 'ridiculed',
      },
      {
        flags: {
          conspiracyFilesLeaked: true,
          alphaReleased: false,
          neuralLinkAuthenticated: true,
        },
        expected: 'government_scandal',
      },
      {
        flags: {
          conspiracyFilesLeaked: false,
          alphaReleased: true,
          neuralLinkAuthenticated: true,
        },
        expected: 'prisoner_45_freed',
      },
      {
        flags: {
          conspiracyFilesLeaked: true,
          alphaReleased: true,
          neuralLinkAuthenticated: true,
        },
        expected: 'real_ending',
      },
    ];

    combinations.forEach(({ flags, expected }) => {
      it(
        `maps flags (${String(flags.conspiracyFilesLeaked)}, ${String(flags.alphaReleased)}, ${String(flags.neuralLinkAuthenticated)}) to ${expected}`,
        () => {
          expect(determineEndingVariant(flags)).toBe(expected);
        }
      );
    });
  });

  describe('getEndingFlags', () => {
    it('extracts explicit flags from game state', () => {
      const state = createTestState({
        flags: {
          conspiracyFilesLeaked: true,
          alphaReleased: false,
          neuralLinkAuthenticated: true,
        },
      });

      expect(getEndingFlags(state)).toEqual({
        conspiracyFilesLeaked: true,
        alphaReleased: false,
        neuralLinkAuthenticated: true,
      });
    });

    it('defaults missing flags to false', () => {
      expect(getEndingFlags(createTestState({ flags: {} }))).toEqual({
        conspiracyFilesLeaked: false,
        alphaReleased: false,
        neuralLinkAuthenticated: false,
      });
    });

    it('falls back to the public leak choice when conspiracy files were discovered', () => {
      const state = createTestState({
        flags: {},
        choiceLeakPath: 'public',
        conspiracyFilesSeen: new Set(['/internal/misc/economic_transition_memo.txt']),
      });

      expect(getEndingFlags(state)).toEqual({
        conspiracyFilesLeaked: true,
        alphaReleased: false,
        neuralLinkAuthenticated: false,
      });
    });

    it('does not infer conspiracy leakage without discovered conspiracy files', () => {
      const state = createTestState({
        flags: {},
        choiceLeakPath: 'public',
        conspiracyFilesSeen: new Set<string>(),
      });

      expect(getEndingFlags(state)).toEqual({
        conspiracyFilesLeaked: false,
        alphaReleased: false,
        neuralLinkAuthenticated: false,
      });
    });

    it('prefers an explicit conspiracyFilesLeaked flag over the legacy leak-choice fallback', () => {
      const state = createTestState({
        flags: { conspiracyFilesLeaked: false },
        choiceLeakPath: 'public',
        conspiracyFilesSeen: new Set(['/internal/misc/economic_transition_memo.txt']),
      });

      expect(getEndingFlags(state)).toEqual({
        conspiracyFilesLeaked: false,
        alphaReleased: false,
        neuralLinkAuthenticated: false,
      });
    });
  });

  describe('generateEnding', () => {
    it('builds the ending from the saved dossier rather than legacy modifier flags', () => {
      const ending = generateEnding(
        createTestState({
          savedFiles: REPRESENTATIVE_DOSSIERS.wrong_story,
          flags: {
            conspiracyFilesLeaked: true,
            alphaReleased: true,
            neuralLinkAuthenticated: true,
          },
        })
      );

      expect(ending.variant).toBe('wrong_story');
      expect(ending.title).toBe('THE WRONG STORY');
      expect(ending.flags).toEqual({
        conspiracyFilesLeaked: true,
        alphaReleased: true,
        neuralLinkAuthenticated: true,
      });
      expect(ending.worldAftermath.length).toBeGreaterThan(0);
      expect(ending.personalAftermath).toBeUndefined();
      expect(ending.epilogue).toContain('>> ENDING: THE WRONG STORY <<');
    });

    it('produces the real ending when the dossier is comprehensive', () => {
      const ending = generateEnding(
        createTestState({
          savedFiles: REPRESENTATIVE_DOSSIERS.real_ending,
          flags: {
            conspiracyFilesLeaked: true,
            alphaReleased: true,
            neuralLinkAuthenticated: false,
          },
        })
      );

      expect(ending.variant).toBe('real_ending');
      expect(ending.title).toBe('UNDENIABLE');
      expect(ending.worldAftermath.length).toBeGreaterThan(0);
      expect(ending.epilogue).toContain('The dossier that could not be ignored.');
    });
  });

  describe('getEndingTitle', () => {
    (Object.keys(REPRESENTATIVE_DOSSIERS) as EndingId[]).forEach(endingId => {
      it(`returns a title for ${endingId}`, () => {
        const title = getEndingTitle(endingId);
        expect(title).toBeTruthy();
        expect(typeof title).toBe('string');
      });
    });
  });

  describe('hasDiscoveredConspiracyFiles', () => {
    it('returns false when no conspiracy files were seen', () => {
      expect(
        hasDiscoveredConspiracyFiles(createTestState({ conspiracyFilesSeen: new Set<string>() }))
      ).toBe(false);
    });

    it('returns true when conspiracy files were seen', () => {
      expect(
        hasDiscoveredConspiracyFiles(
          createTestState({ conspiracyFilesSeen: new Set(['economic_transition_memo.txt']) })
        )
      ).toBe(true);
    });
  });
});
