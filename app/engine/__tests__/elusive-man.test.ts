import { describe, it, expect } from 'vitest';
import type { GameState } from '../../types';
import { DEFAULT_GAME_STATE } from '../../types';
import { executeCommand } from '../commands';
import {
  evaluateAnswer,
  normalizeText,
  LEAK_QUESTIONS,
  LEAK_DETECTION_PENALTY,
  LEAK_MAX_WRONG_ANSWERS,
} from '../elusiveMan';

const ALL_TRUTHS = new Set(['debris_relocation', 'being_containment', 'telepathic_scouts', 'international_actors', 'transition_2026'] as const);

const createState = (overrides: Partial<GameState> = {}): GameState => ({
  ...DEFAULT_GAME_STATE,
  seed: 12345,
  rngState: 12345,
  sessionStartTime: Date.now(),
  tutorialStep: -1,
  tutorialComplete: true,
  truthsDiscovered: ALL_TRUTHS,
  flags: { allEvidenceCollected: true },
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

  describe('Leak command integration', () => {
    it('starts leak sequence when leak command is used', () => {
      const state = createState();
      const result = executeCommand('leak', state);

      expect(result.stateChanges.inLeakSequence).toBe(true);
      expect(result.stateChanges.currentLeakQuestion).toBe(0);
      expect(result.stateChanges.leakWrongAnswers).toBe(0);
      expect(result.output.some(e => e.content.includes('I have resources'))).toBe(true);
      expect(result.output.some(e => e.content.includes('[DEBRIS]'))).toBe(true);
    });

    it('processes correct answers and advances questions', () => {
      const state = createState({
        inLeakSequence: true,
        currentLeakQuestion: 0,
        leakWrongAnswers: 0,
        leakAnswers: [],
      });

      const result = executeCommand('campinas', state);

      expect(result.stateChanges.currentLeakQuestion).toBe(1);
      expect(result.output.some(e => e.content.includes('[CONTAINMENT]'))).toBe(true);
    });

    it('increases detection on wrong answers', () => {
      const state = createState({
        inLeakSequence: true,
        currentLeakQuestion: 0,
        leakWrongAnswers: 0,
        leakAnswers: [],
        detectionLevel: 10,
      });

      // Short wrong answer to avoid partial match (needs to be <10 chars or <2 words)
      const result = executeCommand('no', state);

      expect(result.stateChanges.leakWrongAnswers).toBe(1);
      expect(result.stateChanges.detectionLevel).toBe(10 + LEAK_DETECTION_PENALTY);
      expect(result.output.some(e => e.content.includes('Disappointing') || e.content.includes('Incorrect') || e.content.includes('Wrong'))).toBe(true);
    });

    it('triggers game over on 3 wrong answers', () => {
      const state = createState({
        inLeakSequence: true,
        currentLeakQuestion: 0,
        leakWrongAnswers: 2, // Already 2 wrong
        leakAnswers: ['wrong1', 'wrong2'],
        detectionLevel: 40,
      });

      // Short wrong answer
      const result = executeCommand('xyz', state);

      expect(result.stateChanges.isGameOver).toBe(true);
      expect(result.stateChanges.endingType).toBe('bad');
      expect(result.stateChanges.gameOverReason).toContain('LOCKOUT');
      expect(result.output.some(e => e.content.includes('Three strikes'))).toBe(true);
    });

    it('triggers victory when all 5 questions answered correctly', () => {
      const state = createState({
        inLeakSequence: true,
        currentLeakQuestion: 4, // Last question (CONVERGENCE)
        leakWrongAnswers: 0,
        leakAnswers: ['campinas', 'three specimens', 'telepathic scouts', 'CIA'],
      });

      // Answer the CONVERGENCE question
      const result = executeCommand('2026', state);

      expect(result.stateChanges.gameWon).toBe(true);
      expect(result.stateChanges.endingType).toBe('good');
      expect(result.stateChanges.inLeakSequence).toBe(false);
      expect(result.output.some(e => e.content.includes('LEAK SUCCESSFUL'))).toBe(true);
    });

    it('allows abort during sequence', () => {
      const state = createState({
        inLeakSequence: true,
        currentLeakQuestion: 2,
        leakWrongAnswers: 1,
        leakAnswers: ['campinas', 'three specimens'],
      });

      const result = executeCommand('abort', state);

      expect(result.stateChanges.inLeakSequence).toBe(false);
      expect(result.stateChanges.isGameOver).toBeFalsy();
      expect(result.output.some(e => e.content.includes('Wise choice') || e.content.includes('Channel closed'))).toBe(true);
    });

    it('shows partial match hint for close but wrong answers', () => {
      const state = createState({
        inLeakSequence: true,
        currentLeakQuestion: 0,
        leakWrongAnswers: 0,
        leakAnswers: [],
      });

      // Long answer that doesn't match but shows effort
      const result = executeCommand('they came here from space to do something important', state);

      // Should be partial match, not wrong
      expect(result.stateChanges.leakWrongAnswers).toBeUndefined();
      expect(result.output.some(e => 
        e.content.includes('Close') || 
        e.content.includes('Elaborate') ||
        e.content.includes('vicinity')
      )).toBe(true);
    });
  });

  describe('Edge cases', () => {
    it('handles empty input during leak sequence', () => {
      const state = createState({
        inLeakSequence: true,
        currentLeakQuestion: 0,
        leakWrongAnswers: 0,
        leakAnswers: [],
      });

      // Empty input should be treated as wrong
      const result = executeCommand('', state);
      
      // Should stay in sequence, not crash
      expect(result).toBeDefined();
    });

    it('preserves leak state across multiple wrong answers until limit', () => {
      let state = createState({
        inLeakSequence: true,
        currentLeakQuestion: 0,
        leakWrongAnswers: 0,
        leakAnswers: [],
        detectionLevel: 0,
      });

      // First wrong answer (short to avoid partial match)
      let result = executeCommand('nope', state);
      expect(result.stateChanges.leakWrongAnswers).toBe(1);
      expect(result.stateChanges.isGameOver).toBeFalsy();

      // Second wrong answer
      state = { ...state, ...result.stateChanges } as GameState;
      result = executeCommand('nope', state);
      expect(result.stateChanges.leakWrongAnswers).toBe(2);
      expect(result.stateChanges.isGameOver).toBeFalsy();

      // Third wrong answer - game over
      state = { ...state, ...result.stateChanges } as GameState;
      result = executeCommand('nope', state);
      expect(result.stateChanges.leakWrongAnswers).toBe(3);
      expect(result.stateChanges.isGameOver).toBe(true);
    });

    it('detection caps at 100', () => {
      const state = createState({
        inLeakSequence: true,
        currentLeakQuestion: 0,
        leakWrongAnswers: 0,
        leakAnswers: [],
        detectionLevel: 95,
      });

      const result = executeCommand('wrong', state);
      
      expect(result.stateChanges.detectionLevel).toBe(100);
    });
  });
});
