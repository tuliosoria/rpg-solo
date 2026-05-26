import { describe, it, expect } from 'vitest';
import { existsSync } from 'node:fs';
import { join } from 'node:path';
import {
  ENDINGS,
  type EndingFlags,
  type EndingId,
  analyzeDossier,
  determineEnding,
  determineEndingVariant,
  getEndingFlags,
  getEndingTitle,
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

const ALL_ENDING_IDS = Object.keys(ENDINGS) as EndingId[];

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

  describe('analyzeDossier', () => {
    it('surfaces spoiler-light dossier threads without exposing trap categories', () => {
      const analysis = analyzeDossier(
        dossier(
          'incident_report_1996_01_VG.txt',
          'autopsy_alpha.log',
          'URGENT_classified_alpha.txt',
          'SMOKING_GUN_proof.txt'
        )
      );

      expect(analysis.counts.honeypotTrap).toBe(2);
      expect(analysis.visibleThreads).toContain('military');
      expect(analysis.visibleThreads).toContain('medical');
      expect(analysis.visibleThreads.map(String)).not.toContain('honeypot');
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

  describe('ending content polish', () => {
    it('has complete presentation copy for every dossier ending', () => {
      expect(ALL_ENDING_IDS).toHaveLength(12);

      for (const endingId of ALL_ENDING_IDS) {
        const ending = ENDINGS[endingId];
        const copy = [
          ending.title,
          ending.subtitle,
          ...ending.narrative,
          ending.ufo74_final,
          ending.aol.headline,
          ending.aol.subheadline,
          ...ending.aol.body,
          ending.aol.url,
          ending.aol.imageAlt,
        ].join('\n');

        expect(ending.title, `${endingId} title`).toMatch(/\S/);
        expect(ending.subtitle, `${endingId} subtitle`).toMatch(/\S/);
        expect(ending.narrative.length, `${endingId} narrative`).toBeGreaterThanOrEqual(3);
        expect(ending.ufo74_final, `${endingId} UFO74 final line`).toMatch(/\S/);
        expect(ending.aol.headline, `${endingId} AOL headline`).toMatch(/\S/);
        expect(ending.aol.subheadline, `${endingId} AOL subheadline`).toMatch(/\S/);
        expect(ending.aol.body.length, `${endingId} AOL body`).toBeGreaterThanOrEqual(3);
        expect(ending.aol.url, `${endingId} AOL URL`).toMatch(/^http:\/\/www\.aol\.com\/news\//);
        expect(ending.aol.imageAlt, `${endingId} image alt`).toMatch(/\S/);
        expect(ending.aol.visitorCount, `${endingId} visitor count`).toBeGreaterThan(0);
        expect(copy, `${endingId} placeholder copy`).not.toMatch(/TODO|PLACEHOLDER|ENDING NOT FOUND/i);
      }
    });

    it('points every ending image at an existing public asset', () => {
      for (const endingId of ALL_ENDING_IDS) {
        const imageSrc = ENDINGS[endingId].aol.imageSrc;

        expect(imageSrc, `${endingId} image source`).toMatch(/^\/images\/endings\/.+\.jpg$/);
        expect(
          existsSync(join(process.cwd(), 'public', imageSrc?.replace(/^\//, '') ?? '')),
          `${endingId} image asset is missing: ${imageSrc}`,
        ).toBe(true);
      }
    });
  });
});
