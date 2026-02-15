import { describe, it, expect } from 'vitest';
import { executeCommand } from '../commands';
import { GameState, DEFAULT_GAME_STATE } from '../../types';

describe('UFO74 Decrypt Hints via Chat', () => {
  const createTestState = (overrides: Partial<GameState> = {}): GameState => ({
    ...DEFAULT_GAME_STATE,
    seed: 12345,
    rngState: 12345,
    sessionStartTime: Date.now(),
    tutorialStep: -1,
    tutorialComplete: true,
    ...overrides,
  });

  describe('when player has NOT read the source file', () => {
    it('should give hint for weight question without source file', () => {
      const state = createTestState({
        filesRead: new Set<string>(), // No files read
      });

      const result = executeCommand('chat what is the weight', state);

      // Should have UFO74 response
      const output = result.output.map(e => e.content).join('\n');
      expect(output).toContain('UFO74');
      expect(output).toContain('transport_log_96');
      expect(output).not.toContain('340'); // Should NOT give the answer
    });

    it('should give hint for subjects question without source file', () => {
      const state = createTestState({
        filesRead: new Set<string>(),
      });

      const result = executeCommand('chat how many subjects were recovered', state);

      const output = result.output.map(e => e.content).join('\n');
      expect(output).toContain('UFO74');
      expect(output).toContain('bio_container');
      expect(output).not.toContain('three'); // Should NOT give the answer
    });

    it('should give hint for protocol question without source file', () => {
      const state = createTestState({
        filesRead: new Set<string>(),
      });

      const result = executeCommand('chat whats the protocol name', state);

      const output = result.output.map(e => e.content).join('\n');
      expect(output).toContain('UFO74');
      expect(output).toContain('liaison');
    });
  });

  describe('when player HAS read the source file', () => {
    it('should give answer for weight question when transport log was read', () => {
      const state = createTestState({
        filesRead: new Set(['/storage/assets/transport_log_96.txt']),
      });

      const result = executeCommand('chat what is the material sample weight', state);

      const output = result.output.map(e => e.content).join('\n');
      expect(output).toContain('UFO74');
      expect(output).toContain('340'); // Should give the answer
    });

    it('should give answer for subjects question when bio_container was read', () => {
      const state = createTestState({
        filesRead: new Set(['/storage/quarantine/bio_container.log']),
      });

      const result = executeCommand('chat how many subjects total', state);

      const output = result.output.map(e => e.content).join('\n');
      expect(output).toContain('UFO74');
      expect(output).toContain('three'); // Should give the answer
    });

    it('should give answer for protocol question when liaison note was read', () => {
      const state = createTestState({
        filesRead: new Set(['/comms/liaison/foreign_liaison_note.txt']),
      });

      const result = executeCommand('chat what protocol governs the exchange', state);

      const output = result.output.map(e => e.content).join('\n');
      expect(output).toContain('UFO74');
      expect(output).toContain('7-ECHO'); // Should give the answer
    });
  });

  describe('various question phrasings', () => {
    it('should respond to "help with decrypt"', () => {
      const state = createTestState();
      const result = executeCommand('chat help with decrypt psi_comm', state);

      const output = result.output.map(e => e.content).join('\n');
      expect(output).toContain('UFO74');
    });

    it('should respond to "password for"', () => {
      const state = createTestState();
      const result = executeCommand('chat whats the password for transcript_limit', state);

      const output = result.output.map(e => e.content).join('\n');
      expect(output).toContain('UFO74');
    });

    it('should respond to "stuck on encrypted file"', () => {
      const state = createTestState();
      const result = executeCommand('chat stuck on encrypted file need answer', state);

      const output = result.output.map(e => e.content).join('\n');
      expect(output).toContain('UFO74');
    });

    it('should respond to "what is the 2026"', () => {
      const state = createTestState();
      const result = executeCommand('chat what is the year 2026', state);

      const output = result.output.map(e => e.content).join('\n');
      expect(output).toContain('UFO74');
      expect(output).toContain('2026');
    });
  });

  describe('does not consume Prisoner 45 questions', () => {
    it('should not increment question count for decrypt questions', () => {
      const state = createTestState({
        prisoner45QuestionsAsked: 2,
      });

      const result = executeCommand('chat what is the weight password', state);

      // Should not have state changes for question count
      expect(result.stateChanges.prisoner45QuestionsAsked).toBeUndefined();
    });

    it('should not increase detection for decrypt questions', () => {
      const state = createTestState({
        detectionLevel: 10,
      });

      const result = executeCommand('chat decrypt password help', state);

      expect(result.stateChanges.detectionLevel).toBeUndefined();
    });
  });

  describe('non-decrypt questions go to Prisoner 45', () => {
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
    });
  });
});
