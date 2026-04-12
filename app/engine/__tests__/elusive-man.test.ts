import { describe, it, expect } from 'vitest';
import type { GameState } from '../../types';
import { DEFAULT_GAME_STATE } from '../../types';
import { executeCommand } from '../commands';
import {
  evaluateAnswer,
  normalizeText,
  LEAK_QUESTIONS,
  LEAK_DETECTION_PENALTY,
} from '../elusiveMan';

const createState = (overrides: Partial<GameState> = {}): GameState => ({
  ...DEFAULT_GAME_STATE,
  seed: 12345,
  rngState: 12345,
  sessionStartTime: Date.now(),
  tutorialStep: -1,
  tutorialComplete: true,
  evidenceCount: 5,
  ...overrides,
});

describe('Elusive Man Leak Mechanic', () => {
  describe('Text normalization', () => {
    it('lowercases text', () => {
      expect(normalizeText('RECON')).toBe('recon');
      expect(normalizeText('Reconnaissance')).toBe('reconnaissance');
    });

    it('removes punctuation', () => {
      expect(normalizeText('recon.')).toBe('recon');
      expect(normalizeText('recon!')).toBe('recon');
      expect(normalizeText('"recon"')).toBe('recon');
    });

    it('normalizes whitespace', () => {
      expect(normalizeText('  recon  mission  ')).toBe('recon mission');
    });
  });

  describe('Semantic answer evaluation', () => {
    const debrisQuestion = LEAK_QUESTIONS[0]; // DEBRIS question

    it('accepts exact keyword matches', () => {
      const result = evaluateAnswer('campinas', debrisQuestion);
      expect(result.isCorrect).toBe(true);
      expect(result.matchedConcepts.length).toBeGreaterThan(0);
    });

    it('accepts synonym matches', () => {
      expect(evaluateAnswer('ESA', debrisQuestion).isCorrect).toBe(true);
      expect(evaluateAnswer('military base', debrisQuestion).isCorrect).toBe(true);
      expect(evaluateAnswer('hangar', debrisQuestion).isCorrect).toBe(true);
      expect(evaluateAnswer('relocated', debrisQuestion).isCorrect).toBe(true);
    });

    it('accepts answers embedded in sentences', () => {
      expect(evaluateAnswer('debris was taken to campinas', debrisQuestion).isCorrect).toBe(true);
      expect(evaluateAnswer('they transferred it to the military base', debrisQuestion).isCorrect).toBe(true);
    });

    it('is case insensitive', () => {
      expect(evaluateAnswer('CAMPINAS', debrisQuestion).isCorrect).toBe(true);
      expect(evaluateAnswer('Hangar', debrisQuestion).isCorrect).toBe(true);
    });

    it('rejects incorrect answers', () => {
      const result = evaluateAnswer('they wanted to eat humans', debrisQuestion);
      expect(result.isCorrect).toBe(false);
    });

    it('identifies partial matches for long but wrong answers', () => {
      const result = evaluateAnswer('i think they took it somewhere far from the city center', debrisQuestion);
      expect(result.isCorrect).toBe(false);
      expect(result.isPartialMatch).toBe(true);
    });

    it('rejects empty or very short answers', () => {
      expect(evaluateAnswer('', debrisQuestion).isCorrect).toBe(false);
      expect(evaluateAnswer('a', debrisQuestion).isCorrect).toBe(false);
    });
  });

  describe('CONTAINMENT question', () => {
    const containmentQuestion = LEAK_QUESTIONS[1];

    it('accepts containment-related answers', () => {
      expect(evaluateAnswer('three biological specimens', containmentQuestion).isCorrect).toBe(true);
      expect(evaluateAnswer('bio-constructs contained', containmentQuestion).isCorrect).toBe(true);
      expect(evaluateAnswer('non-human creatures', containmentQuestion).isCorrect).toBe(true);
    });
  });

  describe('PSI-COMM question', () => {
    const psiQuestion = LEAK_QUESTIONS[2];

    it('accepts telepathic-related answers', () => {
      expect(evaluateAnswer('telepathic scouts', psiQuestion).isCorrect).toBe(true);
      expect(evaluateAnswer('psi-comm reconnaissance', psiQuestion).isCorrect).toBe(true);
      expect(evaluateAnswer('neural transmission', psiQuestion).isCorrect).toBe(true);
    });
  });

  describe('FOREIGN question', () => {
    const foreignQuestion = LEAK_QUESTIONS[3];

    it('accepts international actor answers', () => {
      expect(evaluateAnswer('Americans and CIA', foreignQuestion).isCorrect).toBe(true);
      expect(evaluateAnswer('Langley', foreignQuestion).isCorrect).toBe(true);
      expect(evaluateAnswer('US military', foreignQuestion).isCorrect).toBe(true);
    });
  });

  describe('CONVERGENCE question', () => {
    const convergenceQuestion = LEAK_QUESTIONS[4];

    it('accepts 2026 transition answers', () => {
      expect(evaluateAnswer('2026', convergenceQuestion).isCorrect).toBe(true);
      expect(evaluateAnswer('transition in 2026', convergenceQuestion).isCorrect).toBe(true);
      expect(evaluateAnswer('thirty rotations activation window', convergenceQuestion).isCorrect).toBe(true);
    });
  });

  describe('Leak command integration (direct-to-ICQ)', () => {
    it('blocks leak when evidence is insufficient', () => {
      const state = createState({ evidenceCount: 5 });
      const result = executeCommand('leak', state);

      expect(result.stateChanges.icqPhase).toBeUndefined();
      expect(
        result.output.some(e => e.content.includes('INSUFFICIENT EVIDENCE'))
      ).toBe(true);
    });

    it('skips to ICQ phase when all 10 evidence collected', () => {
      const state = createState({ evidenceCount: 10 });
      const result = executeCommand('leak', state);

      expect(result.stateChanges.icqPhase).toBe(true);
      expect(result.stateChanges.evidencesSaved).toBe(true);
      expect(result.skipToPhase).toBe('icq');
      expect(
        result.output.some(e => e.content.includes('TRANSMISSION SUCCESSFUL'))
      ).toBe(true);
    });

    it('sets leakSuccessful flag on successful leak', () => {
      const state = createState({ evidenceCount: 10 });
      const result = executeCommand('leak', state);

      expect(result.stateChanges.flags?.leakSuccessful).toBe(true);
    });

    it('shows evidence count in blocked message', () => {
      const state = createState({ evidenceCount: 3 });
      const result = executeCommand('leak', state);

      expect(
        result.output.some(e => e.content.includes('3/10'))
      ).toBe(true);
    });
  });
});
