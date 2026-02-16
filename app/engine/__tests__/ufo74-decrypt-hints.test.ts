import { describe, it, expect } from 'vitest';
import { executeCommand } from '../commands';
import { GameState, DEFAULT_GAME_STATE } from '../../types';

describe('Chat Command Priority - Prisoner 45 vs UFO74', () => {
  const createTestState = (overrides: Partial<GameState> = {}): GameState => ({
    ...DEFAULT_GAME_STATE,
    seed: 12345,
    rngState: 12345,
    sessionStartTime: Date.now(),
    tutorialStep: -1,
    tutorialComplete: true,
    ...overrides,
  });

  describe('password questions should go to Prisoner 45', () => {
    // Prisoner 45 has a "password" topic with morse code hints (COLHEITA)
    // UFO74 decrypt hints should NOT intercept chat sessions

    it('should route password questions to Prisoner 45, not UFO74', () => {
      const state = createTestState({
        filesRead: new Set<string>(),
        prisoner45QuestionsAsked: 0,
      });

      const result = executeCommand('chat what is the override password', state);

      const output = result.output.map(e => e.content).join('\n');
      // Should have Prisoner 45 response with morse code hints
      expect(output).toContain('PRISONER_45');
      expect(output).toContain('-.-. --- .-.. .... . .. - .-'); // Morse code for COLHEITA
      // Should NOT have UFO74 intercept
      expect(output).not.toContain('UFO74 INTERCEPT');
    });

    it('should give morse code hints when asking about password', () => {
      const state = createTestState({
        prisoner45QuestionsAsked: 0,
      });

      const result = executeCommand('chat whats the password', state);

      const output = result.output.map(e => e.content).join('\n');
      expect(output).toContain('PRISONER_45');
      // Prisoner 45 gives morse code hints
      expect(output).toMatch(/morse|code|-\.-|override/i);
    });

    it('should consume a Prisoner 45 question for password queries', () => {
      const state = createTestState({
        prisoner45QuestionsAsked: 2,
      });

      const result = executeCommand('chat what is the password', state);

      // Should increment question count (password is routed to Prisoner 45)
      expect(result.stateChanges.prisoner45QuestionsAsked).toBe(3);
    });

    it('should route decrypt-related questions to Prisoner 45', () => {
      const state = createTestState({
        prisoner45QuestionsAsked: 0,
      });

      const result = executeCommand('chat how do I decrypt the files', state);

      const output = result.output.map(e => e.content).join('\n');
      // Should be Prisoner 45, not UFO74
      expect(output).toContain('PRISONER_45');
      expect(output).not.toContain('UFO74 INTERCEPT');
    });

    it('should route code/access questions to Prisoner 45', () => {
      const state = createTestState({
        prisoner45QuestionsAsked: 0,
      });

      const result = executeCommand('chat what is the access code', state);

      const output = result.output.map(e => e.content).join('\n');
      expect(output).toContain('PRISONER_45');
    });

    it('should route admin unlock questions to Prisoner 45', () => {
      const state = createTestState({
        prisoner45QuestionsAsked: 0,
      });

      const result = executeCommand('chat how do I unlock admin', state);

      const output = result.output.map(e => e.content).join('\n');
      expect(output).toContain('PRISONER_45');
    });
  });

  describe('non-password questions also go to Prisoner 45', () => {
    it('should route alien questions to Prisoner 45', () => {
      const state = createTestState({
        prisoner45QuestionsAsked: 0,
      });

      const result = executeCommand('chat what did you see', state);

      const output = result.output.map(e => e.content).join('\n');
      // Should NOT be UFO74 intercept format
      expect(output).not.toContain('UFO74 INTERCEPT');
      // Should have Prisoner 45 response
      expect(output).toContain('PRISONER_45');
    });

    it('should route witness questions to Prisoner 45', () => {
      const state = createTestState({
        prisoner45QuestionsAsked: 0,
      });

      const result = executeCommand('chat tell me about the witness', state);

      const output = result.output.map(e => e.content).join('\n');
      expect(output).not.toContain('UFO74 INTERCEPT');
      expect(output).toContain('PRISONER_45');
    });

    it('should route telepathy questions to Prisoner 45', () => {
      const state = createTestState({
        prisoner45QuestionsAsked: 0,
      });

      const result = executeCommand('chat can they read minds', state);

      const output = result.output.map(e => e.content).join('\n');
      expect(output).toContain('PRISONER_45');
    });
  });

  describe('detection increases properly for chat', () => {
    it('should increase detection for valid Prisoner 45 responses', () => {
      const state = createTestState({
        detectionLevel: 10,
        prisoner45QuestionsAsked: 0,
      });

      const result = executeCommand('chat what happened in 1996', state);

      // Chat with Prisoner 45 should increase detection
      expect(result.stateChanges.detectionLevel).toBeGreaterThan(10);
    });
  });
});
