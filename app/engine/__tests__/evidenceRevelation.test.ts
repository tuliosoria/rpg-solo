import { describe, it, expect } from 'vitest';
import {
  isDisturbingContent,
  getDisturbingContentAvatarExpression,
  getDiscoveredEvidenceFiles,
  isEvidencePath,
} from '../evidenceRevelation';
import { GameState, DEFAULT_GAME_STATE } from '../../types';

const _createTestState = (overrides: Partial<GameState> = {}): GameState => ({
  ...DEFAULT_GAME_STATE,
  seed: 12345,
  rngState: 12345,
  sessionStartTime: Date.now(),
  evidenceCount: 0,
  ...overrides,
});

describe('Evidence Revelation System', () => {
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

    it('detects witness encounter details from the Jardim Andere report', () => {
      const content = [
        'WITNESS ACCOUNT (SUMMARY):',
        'Subjects observed crouching figure approximately 1.6m in height.',
        'Dark brown skin described as "oily." Three prominent ridges on cranium. Large red eyes. Strong ammonia-like odor noted.',
        'Subjects fled scene. One reported temporary paralysis.',
        'Another claimed "feeling its thoughts".',
      ];

      expect(isDisturbingContent(content)).toBe(true);
    });
  });

  describe('evidence file detection', () => {
    it('flags jardim_andere_incident.txt as evidence', () => {
      expect(isEvidencePath('/internal/jardim_andere_incident.txt')).toBe(true);
    });

    it('includes thirty_year_cycle.txt in the evidence pool', () => {
      expect(isEvidencePath('/admin/thirty_year_cycle.txt')).toBe(true);
    });

    it('counts each evidence file separately, even if they used to share a category', () => {
      const discovered = getDiscoveredEvidenceFiles([
        '/internal/jardim_andere_incident.txt',
        '/storage/quarantine/bio_container.log',
      ]);

      expect(discovered.size).toBe(2);
      expect(discovered.has('/internal/jardim_andere_incident.txt')).toBe(true);
      expect(discovered.has('/storage/quarantine/bio_container.log')).toBe(true);
    });

    it('deduplicates rereads of the same evidence file path', () => {
      const discovered = getDiscoveredEvidenceFiles([
        '/storage/quarantine/autopsy_alpha.log',
        '/storage/quarantine/autopsy_alpha.log',
      ]);

      expect(discovered.size).toBe(1);
      expect(discovered.has('/storage/quarantine/autopsy_alpha.log')).toBe(true);
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

    it('returns scared for witness encounter reports with creature details', () => {
      const content = [
        'WITNESS ACCOUNT (SUMMARY):',
        'Subjects observed crouching creature approximately 1.6m in height.',
        'Dark brown skin described as "oily." Three prominent ridges on cranium. Large red eyes. Strong ammonia-like odor noted.',
        'Subjects fled scene. One reported temporary paralysis.',
        'Another claimed "feeling its thoughts".',
      ];

      const expression = getDisturbingContentAvatarExpression(content);

      expect(expression).toBe('scared');
    });

    it('returns null for mundane content', () => {
      const content = ['BUDGET MEMO', 'Paper clip inventory', 'Office supplies list'];

      const expression = getDisturbingContentAvatarExpression(content);

      expect(expression).toBeNull();
    });
  });
});
