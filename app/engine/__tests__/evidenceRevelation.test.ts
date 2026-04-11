import { describe, it, expect } from 'vitest';
import {
  isDisturbingContent,
  getDisturbingContentAvatarExpression,
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
      const content = ['BUDGET MEMO', 'Paper clip inventory', 'Office supplies list'];

      const expression = getDisturbingContentAvatarExpression(content);

      expect(expression).toBeNull();
    });
  });
});
