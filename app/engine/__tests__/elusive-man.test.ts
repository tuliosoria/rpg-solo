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

const createState = (overrides: Partial<GameState> = {}): GameState => ({
  ...DEFAULT_GAME_STATE,
  seed: 12345,
  rngState: 12345,
  sessionStartTime: Date.now(),
  tutorialStep: -1,
  tutorialComplete: true,
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
    const originQuestion = LEAK_QUESTIONS[0]; // ORIGIN question

    it('accepts exact keyword matches', () => {
      const result = evaluateAnswer('recon', originQuestion);
      expect(result.isCorrect).toBe(true);
      expect(result.matchedConcepts.length).toBeGreaterThan(0);
    });

    it('accepts synonym matches', () => {
      expect(evaluateAnswer('reconnaissance', originQuestion).isCorrect).toBe(true);
      expect(evaluateAnswer('scouting', originQuestion).isCorrect).toBe(true);
      expect(evaluateAnswer('observation', originQuestion).isCorrect).toBe(true);
      expect(evaluateAnswer('monitoring', originQuestion).isCorrect).toBe(true);
    });

    it('accepts answers embedded in sentences', () => {
      expect(evaluateAnswer('they came for reconnaissance', originQuestion).isCorrect).toBe(true);
      expect(evaluateAnswer('their mission was scouting the area', originQuestion).isCorrect).toBe(true);
    });

    it('is case insensitive', () => {
      expect(evaluateAnswer('RECON', originQuestion).isCorrect).toBe(true);
      expect(evaluateAnswer('Reconnaissance', originQuestion).isCorrect).toBe(true);
    });

    it('rejects incorrect answers', () => {
      const result = evaluateAnswer('they wanted to eat humans', originQuestion);
      expect(result.isCorrect).toBe(false);
    });

    it('identifies partial matches for long but wrong answers', () => {
      const result = evaluateAnswer('i think they came here for some reason related to earth', originQuestion);
      expect(result.isCorrect).toBe(false);
      expect(result.isPartialMatch).toBe(true);
    });

    it('rejects empty or very short answers', () => {
      expect(evaluateAnswer('', originQuestion).isCorrect).toBe(false);
      expect(evaluateAnswer('a', originQuestion).isCorrect).toBe(false);
    });
  });

  describe('LOCATION question', () => {
    const locationQuestion = LEAK_QUESTIONS[1];

    it('accepts facility names', () => {
      expect(evaluateAnswer('Campinas', locationQuestion).isCorrect).toBe(true);
      expect(evaluateAnswer('ESA facility', locationQuestion).isCorrect).toBe(true);
      expect(evaluateAnswer('military base', locationQuestion).isCorrect).toBe(true);
    });
  });

  describe('BIOLOGICAL question', () => {
    const biologicalQuestion = LEAK_QUESTIONS[2];

    it('accepts autopsy-related answers', () => {
      expect(evaluateAnswer('autopsy', biologicalQuestion).isCorrect).toBe(true);
      expect(evaluateAnswer('Americans took them', biologicalQuestion).isCorrect).toBe(true);
      expect(evaluateAnswer('US military', biologicalQuestion).isCorrect).toBe(true);
    });
  });

  describe('COMMUNICATION question', () => {
    const commQuestion = LEAK_QUESTIONS[3];

    it('accepts telepathic-related answers', () => {
      expect(evaluateAnswer('telepathic contact', commQuestion).isCorrect).toBe(true);
      expect(evaluateAnswer('warning', commQuestion).isCorrect).toBe(true);
      expect(evaluateAnswer('neural transmission', commQuestion).isCorrect).toBe(true);
    });
  });

  describe('AFTERMATH question', () => {
    const aftermathQuestion = LEAK_QUESTIONS[4];

    it('accepts cover-up related answers', () => {
      expect(evaluateAnswer('cover-up', aftermathQuestion).isCorrect).toBe(true);
      expect(evaluateAnswer('media suppression', aftermathQuestion).isCorrect).toBe(true);
      expect(evaluateAnswer('witness silencing', aftermathQuestion).isCorrect).toBe(true);
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
      expect(result.output.some(e => e.content.includes('[ORIGIN]'))).toBe(true);
    });

    it('processes correct answers and advances questions', () => {
      const state = createState({
        inLeakSequence: true,
        currentLeakQuestion: 0,
        leakWrongAnswers: 0,
        leakAnswers: [],
      });

      const result = executeCommand('recon', state);

      expect(result.stateChanges.currentLeakQuestion).toBe(1);
      expect(result.output.some(e => e.content.includes('[LOCATION]'))).toBe(true);
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
        currentLeakQuestion: 4, // Last question
        leakWrongAnswers: 0,
        leakAnswers: ['recon', 'campinas', 'autopsy', 'telepathic'],
      });

      // Answer the AFTERMATH question
      const result = executeCommand('cover-up', state);

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
        leakAnswers: ['recon', 'campinas'],
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
