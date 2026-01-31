// Morse Puzzle Tests - message command and wrongAttempts game over
import { describe, it, expect } from 'vitest';
import { executeCommand } from '../commands';
import { GameState, DEFAULT_GAME_STATE } from '../../types';

// Helper to create a test state
// NOTE: Set truthsDiscovered to exit atmosphere phase so penalties apply
const createTestState = (overrides: Partial<GameState> = {}): GameState => ({
  ...DEFAULT_GAME_STATE,
  seed: 12345,
  rngState: 12345,
  sessionStartTime: Date.now(),
  tutorialStep: -1,
  tutorialComplete: true,
  truthsDiscovered: new Set(['debris_relocation']), // Exit atmosphere phase
  ...overrides,
});

describe('Morse Puzzle', () => {
  describe('message command - prerequisites', () => {
    it('should show error when morse file has not been read', () => {
      const state = createTestState({ morseFileRead: false });
      const result = executeCommand('message UFO RECOVERED', state);
      
      expect(result.output.some(e => e.content.includes('No pending message'))).toBe(true);
      expect(result.output.some(e => e.content.includes('/comms/intercepts/'))).toBe(true);
    });

    it('should show usage when no argument provided', () => {
      const state = createTestState({ morseFileRead: true });
      const result = executeCommand('message', state);
      
      expect(result.output.some(e => e.content.includes('Usage: message'))).toBe(true);
      expect(result.output.some(e => e.content.includes('Attempts remaining: 3'))).toBe(true);
    });
  });

  describe('message command - correct answer', () => {
    it('should accept correct answer "UFO RECOVERED"', () => {
      const state = createTestState({ morseFileRead: true });
      const result = executeCommand('message UFO RECOVERED', state);
      
      expect(result.output.some(e => e.content.includes('MESSAGE DECIPHERED'))).toBe(true);
      expect(result.stateChanges.morseMessageSolved).toBe(true);
    });

    it('should accept answer without space "UFORECOVERED"', () => {
      const state = createTestState({ morseFileRead: true });
      const result = executeCommand('message UFORECOVERED', state);
      
      expect(result.stateChanges.morseMessageSolved).toBe(true);
    });

    it('should accept lowercase answer', () => {
      const state = createTestState({ morseFileRead: true });
      const result = executeCommand('message ufo recovered', state);
      
      expect(result.stateChanges.morseMessageSolved).toBe(true);
    });

    it('should accept hyphenated answer "UFO-RECOVERED"', () => {
      const state = createTestState({ morseFileRead: true });
      const result = executeCommand('message UFO-RECOVERED', state);
      
      expect(result.stateChanges.morseMessageSolved).toBe(true);
    });
  });

  describe('message command - wrong answer', () => {
    it('should show wrong answer message and decrement attempts', () => {
      const state = createTestState({ morseFileRead: true, morseMessageAttempts: 0 });
      const result = executeCommand('message WRONG ANSWER', state);
      
      expect(result.output.some(e => e.content.includes('INCORRECT'))).toBe(true);
      expect(result.stateChanges.morseMessageAttempts).toBe(1);
      expect(result.stateChanges.morseMessageSolved).toBeUndefined();
    });

    it('should show remaining attempts after wrong answer', () => {
      const state = createTestState({ morseFileRead: true, morseMessageAttempts: 1 });
      const result = executeCommand('message WRONG', state);
      
      expect(result.output.some(e => e.content.includes('Attempts remaining: 1'))).toBe(true);
      expect(result.stateChanges.morseMessageAttempts).toBe(2);
    });
  });

  describe('message command - exhausted attempts', () => {
    it('should trigger failure after 3 wrong attempts', () => {
      const state = createTestState({ morseFileRead: true, morseMessageAttempts: 2 });
      const result = executeCommand('message WRONG', state);
      
      expect(result.output.some(e => e.content.includes('DECRYPTION FAILED'))).toBe(true);
      expect(result.output.some(e => e.content.includes('UFO RECOVERED'))).toBe(true);
      expect(result.stateChanges.morseMessageAttempts).toBe(3);
      expect(result.stateChanges.wrongAttempts).toBe(1);
    });

    it('should show puzzle failed state when already exhausted', () => {
      const state = createTestState({ morseFileRead: true, morseMessageAttempts: 3 });
      const result = executeCommand('message', state);
      
      expect(result.output.some(e => e.content.includes('exhausted'))).toBe(true);
      expect(result.output.some(e => e.content.includes('UFO RECOVERED'))).toBe(true);
    });

    it('should show puzzle failed for any input after exhaustion', () => {
      const state = createTestState({ morseFileRead: true, morseMessageAttempts: 3 });
      const result = executeCommand('message UFO RECOVERED', state);
      
      // Even correct answer should fail after exhaustion
      expect(result.output.some(e => e.content.includes('exhausted'))).toBe(true);
      expect(result.stateChanges.morseMessageSolved).toBeUndefined();
    });
  });

  describe('message command - already solved', () => {
    it('should show already solved message', () => {
      const state = createTestState({ 
        morseFileRead: true, 
        morseMessageSolved: true 
      });
      const result = executeCommand('message UFO RECOVERED', state);
      
      expect(result.output.some(e => e.content.includes('already deciphered'))).toBe(true);
    });
  });
});

describe('Wrong Attempts Game Over', () => {
  it('should trigger game over when wrongAttempts reaches 8', () => {
    const state = createTestState({ wrongAttempts: 7, morseFileRead: true, morseMessageAttempts: 2 });
    // This will be the 3rd failed morse attempt, which adds +1 wrongAttempts = 8
    const result = executeCommand('message WRONG', state);
    
    expect(result.stateChanges.isGameOver).toBe(true);
    expect(result.stateChanges.gameOverReason).toContain('TERMINAL LOCKOUT');
  });

  it('should not trigger game over at 7 wrongAttempts', () => {
    const state = createTestState({ wrongAttempts: 6, morseFileRead: true, morseMessageAttempts: 2 });
    const result = executeCommand('message WRONG', state);
    
    expect(result.stateChanges.wrongAttempts).toBe(7);
    expect(result.stateChanges.isGameOver).toBeUndefined();
  });
});

describe('Morse File Read Flag', () => {
  it('should set morseFileRead when opening morse_intercept file', () => {
    const state = createTestState({ currentPath: '/comms/intercepts' });
    const result = executeCommand('open morse_intercept.sig', state);
    
    expect(result.stateChanges.morseFileRead).toBe(true);
  });
});

describe('Override Failures', () => {
  it('should increment wrongAttempts on wrong override password', () => {
    const state = createTestState({ wrongAttempts: 0 });
    const result = executeCommand('override protocol WRONGPASS', state);
    
    expect(result.stateChanges.wrongAttempts).toBe(1);
    expect(result.stateChanges.overrideFailedAttempts).toBe(1);
    expect(result.output.some(e => e.content.includes('INVALID AUTHENTICATION CODE'))).toBe(true);
  });

  it('should accumulate wrongAttempts across multiple override failures', () => {
    const state = createTestState({ wrongAttempts: 2, overrideFailedAttempts: 1 });
    const result = executeCommand('override protocol BADCODE', state);
    
    expect(result.stateChanges.wrongAttempts).toBe(3);
    expect(result.stateChanges.overrideFailedAttempts).toBe(2);
  });

  it('should trigger override lockout after 3 wrong passwords', () => {
    const state = createTestState({ wrongAttempts: 5, overrideFailedAttempts: 2 });
    const result = executeCommand('override protocol WRONG', state);
    
    expect(result.stateChanges.isGameOver).toBe(true);
    expect(result.stateChanges.gameOverReason).toContain('SECURITY LOCKDOWN');
    expect(result.stateChanges.wrongAttempts).toBe(6);
  });

  it('should show override lockout message even if wrongAttempts reaches 8', () => {
    // 7 wrong attempts + 3rd override failure = 8, but override lockout should take priority
    const state = createTestState({ wrongAttempts: 7, overrideFailedAttempts: 2 });
    const result = executeCommand('override protocol WRONG', state);
    
    expect(result.stateChanges.isGameOver).toBe(true);
    // Should show override-specific message, not generic terminal lockout
    expect(result.stateChanges.gameOverReason).toContain('SECURITY LOCKDOWN');
    expect(result.output.some(e => e.content.includes('SECURITY COUNTERMEASURE'))).toBe(true);
  });

  it('should not increment wrongAttempts when no password provided', () => {
    const state = createTestState({ wrongAttempts: 0 });
    const result = executeCommand('override protocol', state);
    
    expect(result.stateChanges.wrongAttempts).toBeUndefined();
    expect(result.output.some(e => e.content.includes('ACCESS DENIED'))).toBe(true);
  });

  it('should not increment wrongAttempts on correct password', () => {
    const state = createTestState({ wrongAttempts: 2 });
    const result = executeCommand('override protocol COLHEITA', state);
    
    expect(result.stateChanges.wrongAttempts).toBeUndefined();
  });
});
