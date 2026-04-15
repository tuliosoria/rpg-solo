import { describe, it, expect } from 'vitest';
import { generateHintOutput, analyzeProgressForHint, HINT_CONFIG } from '../hintSystem';
import { GameState, DEFAULT_GAME_STATE } from '../../types';

function createTestState(overrides: Partial<GameState> = {}): GameState {
  return {
    ...DEFAULT_GAME_STATE,
    seed: 12345,
    rngState: 12345,
    sessionStartTime: Date.now(),
    filesRead: new Set<string>(),
    evidenceCount: 0,
    hintsUsed: 0,
    tutorialComplete: false,
    detectionLevel: 0,
    ...overrides,
  } as GameState;
}

describe('Hint System', () => {
  describe('generateHintOutput', () => {
    it('returns a hint when hints are available', () => {
      const state = createTestState({ tutorialComplete: true });
      const result = generateHintOutput(state);

      expect(result.output.length).toBeGreaterThan(0);
      expect(result.output.some(e => e.content.includes('HINT PROTOCOL ACTIVATED'))).toBe(true);
      expect(result.stateChanges.hintsUsed).toBe(1);
    });

    it('shows hints remaining count', () => {
      const state = createTestState({ hintsUsed: 1, tutorialComplete: true });
      const result = generateHintOutput(state);

      const remainingEntry = result.output.find(e => e.content.includes('REMAINING'));
      expect(remainingEntry).toBeDefined();
    });

    it('attaches i18n keys to hint protocol entries', () => {
      const state = createTestState({ tutorialComplete: true });
      const result = generateHintOutput(state);

      expect(result.output.find(e => e.content.includes('HINT PROTOCOL ACTIVATED'))?.i18nKey).toBe(
        'engine.hints.protocol.activated'
      );
      expect(result.output.find(e => e.type === 'ufo74' && e.content.includes('UFO74:'))?.i18nKey).toBeDefined();
    });

    it('refuses hints when exhausted', () => {
      const state = createTestState({ hintsUsed: HINT_CONFIG.maxHints });
      const result = generateHintOutput(state);

      expect(result.output.some(e => e.content.includes('RESOURCE DEPLETED'))).toBe(true);
      expect(result.stateChanges.hintsUsed).toBeUndefined();
    });

    it('increases detection after the tutorial is complete', () => {
      const state = createTestState({
        tutorialComplete: true,
        detectionLevel: 10,
      });
      const result = generateHintOutput(state);

      expect(result.stateChanges.detectionLevel).toBe(10 + HINT_CONFIG.detectionPenalty);
    });

    it('does not increase detection during tutorial', () => {
      const state = createTestState({
        tutorialComplete: false,
        detectionLevel: 10,
      });
      const result = generateHintOutput(state);

      expect(result.stateChanges.detectionLevel).toBeUndefined();
    });

    it('caps detection at 100', () => {
      const state = createTestState({
        tutorialComplete: true,
        detectionLevel: 98,
      });
      const result = generateHintOutput(state);

      expect(result.stateChanges.detectionLevel).toBe(100);
    });

    it('delivers hints through UFO74 channel', () => {
      const state = createTestState({ tutorialComplete: true });
      const result = generateHintOutput(state);

      expect(result.output.some(e => e.type === 'ufo74')).toBe(true);
    });
  });

  describe('analyzeProgressForHint', () => {
    it('guides brand-new players toward opening files', () => {
      const hint = analyzeProgressForHint(createTestState());

      expect(hint?.primary.key.startsWith('engine.hints.progress.noFiles')).toBe(true);
      expect(hint?.followUp?.key).toBe('engine.hints.action.start.openRoutineFile');
    });

    it('uses a distinct early exploration follow-up for search guidance', () => {
      const hint = analyzeProgressForHint(
        createTestState({
          filesRead: new Set(['/internal/file1.txt']),
        })
      );

      expect(hint?.followUp?.key).toBe('engine.hints.action.start.useTreeAndSearch');
    });

    it('returns null when all exploration is done and no saves yet — silence is better', () => {
      const hint = analyzeProgressForHint(
        createTestState({
          filesRead: new Set([
            '/storage/log1.txt',
            '/ops/log2.txt',
            '/comms/log3.txt',
            '/admin/log4.txt',
          ]),
          accessLevel: 3,
          flags: { adminUnlocked: true },
          prisoner45QuestionsAsked: 1,
        })
      );

      // With all dirs explored and prisoner contacted, but nothing saved, silence
      expect(hint).toBeNull();
    });

    it('guides players toward unexplored sectors', () => {
      const hint = analyzeProgressForHint(
        createTestState({
          filesRead: new Set(['/ops/file1.txt', '/ops/file2.txt', '/internal/file3.txt', '/internal/file4.txt']),
          savedFiles: new Set(['file1.txt']),
        })
      );

      expect(hint?.primary.key.startsWith('engine.hints.directory.storage')).toBe(true);
    });

    it('prioritizes morse guidance when an intercept is open but unsolved', () => {
      const hint = analyzeProgressForHint(
        createTestState({
          filesRead: new Set(['/comms/psi/morse_intercept.sig']),
          morseFileRead: true,
          morseMessageSolved: false,
          evidenceCount: 3,
        })
      );

      expect(hint?.followUp?.key).toBe('engine.hints.action.morse');
    });

    it('guides toward admin after clearance is unlocked', () => {
      const hint = analyzeProgressForHint(
        createTestState({
          filesRead: new Set([
            '/storage/log1.txt', '/storage/log2.txt',
            '/ops/log2.txt', '/ops/log3.txt',
            '/comms/log3.txt', '/comms/log4.txt',
            '/internal/log5.txt', '/internal/log6.txt',
          ]),
          savedFiles: new Set(['file1.txt', 'file2.txt', 'file3.txt', 'file4.txt', 'file5.txt']),
          accessLevel: 3,
          flags: { adminUnlocked: true },
          prisoner45QuestionsAsked: 1,
        })
      );

      expect(hint?.primary.key.startsWith('engine.hints.directory.admin')).toBe(true);
      expect(hint?.followUp?.key).toBe('engine.hints.action.admin');
    });

    it('guides leak-ready players toward the endgame', () => {
      const savedSet = new Set<string>();
      for (let i = 0; i < 10; i++) savedSet.add(`file${i}.txt`);
      const hint = analyzeProgressForHint(
        createTestState({
          savedFiles: savedSet,
          filesRead: new Set(['/storage/a.txt', '/ops/b.txt', '/comms/c.txt']),
        })
      );

      expect(hint?.primary.key).toBe('engine.hints.leak.ready');
    });

    it('keeps late-stage review guidance distinct from mid-run recap guidance', () => {
      const nearCompleteHint = analyzeProgressForHint(
        createTestState({
          filesRead: new Set([
            '/storage/log1.txt',
            '/ops/log2.txt',
            '/comms/log3.txt',
            '/admin/log4.txt',
          ]),
          accessLevel: 3,
          flags: { adminUnlocked: true },
          savedFiles: new Set(['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h']),
          prisoner45QuestionsAsked: 1,
        })
      );
      const midRunHint = analyzeProgressForHint(
        createTestState({
          filesRead: new Set([
            '/storage/log1.txt',
            '/ops/log2.txt',
            '/comms/log3.txt',
            '/admin/log4.txt',
          ]),
          accessLevel: 3,
          flags: { adminUnlocked: true },
          savedFiles: new Set(['a', 'b']),
          prisoner45QuestionsAsked: 1,
        })
      );

      expect(nearCompleteHint?.followUp?.key).toBe('engine.hints.action.review.looseThreads');
      expect(midRunHint?.followUp?.key).toBe('engine.hints.action.review.searchGaps');
    });
  });

  describe('HINT_CONFIG', () => {
    it('has reasonable max hints value', () => {
      expect(HINT_CONFIG.maxHints).toBe(8);
    });

    it('has small detection penalty', () => {
      expect(HINT_CONFIG.detectionPenalty).toBeGreaterThanOrEqual(3);
      expect(HINT_CONFIG.detectionPenalty).toBeLessThanOrEqual(5);
    });
  });

  describe('Hint Output Format', () => {
    it('never reveals specific file names', () => {
      const state = createTestState({ tutorialComplete: true });
      const result = generateHintOutput(state);

      for (const entry of result.output) {
        expect(entry.content).not.toMatch(/\.(txt|enc|log|dat|sig)$/i);
        expect(entry.content).not.toMatch(/\/\w+\/\w+\.\w+/);
      }
    });

    it('stays contextual as the case advances', () => {
      const result = generateHintOutput(
        createTestState({
          tutorialComplete: true,
          filesRead: new Set(['/storage/a.txt', '/ops/b.txt', '/comms/c.txt', '/admin/d.txt']),
          savedFiles: new Set(['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h']),
          accessLevel: 3,
          flags: { adminUnlocked: true },
          prisoner45QuestionsAsked: 1,
        })
      );

      const ufo74Entries = result.output.filter(e => e.type === 'ufo74');
      expect(ufo74Entries.length).toBeGreaterThan(0);
      expect(ufo74Entries.some(entry => entry.content.includes('progress'))).toBe(true);
    });
  });
});
