// Commands Edge Cases Tests - additional coverage for commands.ts
import { describe, it, expect } from 'vitest';
import {
  parseCommand,
  sanitizeCommandInput,
  createEntry,
  createOutputEntries,
  generateEntryId,
  calculateDelay,
  createInvalidCommandResult,
} from '../commands';
import { GameState, DEFAULT_GAME_STATE } from '../../types';

// Helper to create a test state
const createTestState = (overrides: Partial<GameState> = {}): GameState => ({
  ...DEFAULT_GAME_STATE,
  seed: 12345,
  rngState: 12345,
  sessionStartTime: Date.now(),
  tutorialStep: -1,
  tutorialComplete: true,
  ...overrides,
});

describe('Command Utilities', () => {
  describe('parseCommand', () => {
    it('parses simple command', () => {
      const result = parseCommand('help');
      expect(result.command).toBe('help');
      expect(result.args).toEqual([]);
    });

    it('parses command with single arg', () => {
      const result = parseCommand('cd internal');
      expect(result.command).toBe('cd');
      expect(result.args).toEqual(['internal']);
    });

    it('parses command with multiple args', () => {
      const result = parseCommand('decrypt file.txt password123');
      expect(result.command).toBe('decrypt');
      expect(result.args).toEqual(['file.txt', 'password123']);
    });

    it('handles leading whitespace', () => {
      const result = parseCommand('   help');
      expect(result.command).toBe('help');
    });

    it('handles trailing whitespace', () => {
      const result = parseCommand('help   ');
      expect(result.command).toBe('help');
    });

    it('handles multiple spaces between args', () => {
      const result = parseCommand('cd    internal    protocols');
      expect(result.command).toBe('cd');
      expect(result.args).toEqual(['internal', 'protocols']);
    });

    it('converts command to lowercase', () => {
      const result = parseCommand('HELP');
      expect(result.command).toBe('help');
    });

    it('handles empty string', () => {
      const result = parseCommand('');
      expect(result.command).toBe('');
      expect(result.args).toEqual([]);
    });

    it('handles whitespace only', () => {
      const result = parseCommand('   ');
      expect(result.command).toBe('');
      expect(result.args).toEqual([]);
    });

    it('strips zero-width characters', () => {
      const result = parseCommand('he\u200Blp');
      expect(result.command).toBe('help');
    });

    it('strips control characters', () => {
      const result = parseCommand('op\u0000en file.txt');
      expect(result.command).toBe('op');
      expect(result.args).toEqual(['en', 'file.txt']);
    });

    it('normalizes fullwidth characters', () => {
      const result = parseCommand('\uFF28\uFF25\uFF2C\uFF30'); // FULLWIDTH HELP
      expect(result.command).toBe('help');
    });
  });

  describe('sanitizeCommandInput', () => {
    it('flags modified input when control characters removed', () => {
      const result = sanitizeCommandInput('he\u0000lp');
      expect(result.value).toBe('he lp');
      expect(result.wasModified).toBe(true);
    });
  });

  describe('createEntry', () => {
    it('creates output entry', () => {
      const entry = createEntry('output', 'test content');
      expect(entry.type).toBe('output');
      expect(entry.content).toBe('test content');
      expect(entry.id).toBeDefined();
      expect(entry.timestamp).toBeDefined();
    });

    it('creates error entry', () => {
      const entry = createEntry('error', 'error message');
      expect(entry.type).toBe('error');
      expect(entry.content).toBe('error message');
    });

    it('creates warning entry', () => {
      const entry = createEntry('warning', 'warning message');
      expect(entry.type).toBe('warning');
    });

    it('creates input entry', () => {
      const entry = createEntry('input', 'ls');
      expect(entry.type).toBe('input');
    });

    it('creates system entry', () => {
      const entry = createEntry('system', 'system info');
      expect(entry.type).toBe('system');
    });

    it('creates ufo74 entry', () => {
      const entry = createEntry('ufo74', 'UFO74: message');
      expect(entry.type).toBe('ufo74');
    });

    it('creates notice entry', () => {
      const entry = createEntry('notice', 'NOTICE: info');
      expect(entry.type).toBe('notice');
    });

    it('generates unique IDs', () => {
      const entry1 = createEntry('output', 'test1');
      const entry2 = createEntry('output', 'test2');
      expect(entry1.id).not.toBe(entry2.id);
    });
  });

  describe('createOutputEntries', () => {
    it('creates entries from array of strings', () => {
      const entries = createOutputEntries(['line 1', 'line 2', 'line 3']);
      expect(entries.length).toBe(3);
      expect(entries[0].content).toBe('line 1');
      expect(entries[1].content).toBe('line 2');
      expect(entries[2].content).toBe('line 3');
    });

    it('uses output type by default', () => {
      const entries = createOutputEntries(['test']);
      expect(entries[0].type).toBe('output');
    });

    it('accepts custom type', () => {
      const entries = createOutputEntries(['test'], 'warning');
      expect(entries[0].type).toBe('warning');
    });

    it('handles empty array', () => {
      const entries = createOutputEntries([]);
      expect(entries.length).toBe(0);
    });
  });

  describe('generateEntryId', () => {
    it('generates unique IDs', () => {
      const ids = new Set<string>();
      for (let i = 0; i < 100; i++) {
        ids.add(generateEntryId());
      }
      expect(ids.size).toBe(100);
    });

    it('generates string IDs', () => {
      const id = generateEntryId();
      expect(typeof id).toBe('string');
    });

    it('includes entry prefix', () => {
      const id = generateEntryId();
      expect(id.startsWith('entry_')).toBe(true);
    });
  });

  describe('calculateDelay', () => {
    it('returns 0 for low detection', () => {
      const state = createTestState({ detectionLevel: 5 });
      const delay = calculateDelay(state);
      expect(delay).toBe(0);
    });

    it('returns higher delay for higher detection', () => {
      const lowState = createTestState({ detectionLevel: 20 });
      const highState = createTestState({ detectionLevel: 80 });

      const lowDelay = calculateDelay(lowState);
      const highDelay = calculateDelay(highState);

      expect(highDelay).toBeGreaterThan(lowDelay);
    });

    it('applies seed-based variance', () => {
      const state1 = createTestState({ detectionLevel: 50, seed: 12345 });
      const state2 = createTestState({ detectionLevel: 50, seed: 54321 });

      // Different seeds may produce different variance
      const delay1 = calculateDelay(state1);
      const delay2 = calculateDelay(state2);

      // Both should be reasonable delays for detection level 50
      expect(delay1).toBeGreaterThanOrEqual(0);
      expect(delay2).toBeGreaterThanOrEqual(0);
    });

    it('handles edge case of 0 detection', () => {
      const state = createTestState({ detectionLevel: 0 });
      const delay = calculateDelay(state);
      expect(delay).toBe(0);
    });

    it('handles maximum detection', () => {
      const state = createTestState({ detectionLevel: 100 });
      const delay = calculateDelay(state);
      expect(delay).toBeGreaterThan(0);
    });
  });

  describe('createInvalidCommandResult', () => {
    it('returns error message for unknown command', () => {
      const state = createTestState({ legacyAlertCounter: 0 });
      const result = createInvalidCommandResult(state, 'badcmd');

      expect(result.output.some(e => e.content.includes('badcmd'))).toBe(true);
      expect(result.stateChanges.legacyAlertCounter).toBe(1);
    });

    it('increases detection level', () => {
      // Provide enough files read to be past warmup phase (8+ files)
      const state = createTestState({ 
        detectionLevel: 10, 
        legacyAlertCounter: 0,
        filesRead: new Set(['/a', '/b', '/c', '/d', '/e', '/f', '/g', '/h']),
      });
      const result = createInvalidCommandResult(state, 'test');

      expect(result.stateChanges.detectionLevel).toBe(12);
    });

    it('shows warning about invalid attempts', () => {
      const state = createTestState({ legacyAlertCounter: 3 });
      const result = createInvalidCommandResult(state, 'test');

      expect(result.output.some(e => e.content.includes('RISK INCREASED'))).toBe(true);
      expect(result.output.some(e => e.content.includes('4/8'))).toBe(true);
    });

    it('attaches i18n keys for invalid command output', () => {
      const state = createTestState({ legacyAlertCounter: 2 });
      const result = createInvalidCommandResult(state, 'badcmd');

      expect(result.output.find(e => e.content.includes('badcmd'))?.i18nKey).toBe('runtime.unknownCommand');
      expect(result.output.find(e => e.content.includes('RISK INCREASED'))?.i18nKey).toBe(
        'engine.invalidCommand.riskIncreased'
      );
      expect(result.output.find(e => e.content.includes('3/8'))?.i18nKey).toBe(
        'engine.invalidCommand.invalidAttempts'
      );
    });

    it('triggers game over at 8 invalid attempts', () => {
      const state = createTestState({ legacyAlertCounter: 7 });
      const result = createInvalidCommandResult(state, 'test');

      expect(result.stateChanges.isGameOver).toBe(true);
      expect(result.stateChanges.gameOverReason).toContain('THRESHOLD');
      expect(result.triggerFlicker).toBe(true);
    });

    it('handles empty command name', () => {
      const state = createTestState({ legacyAlertCounter: 0 });
      const result = createInvalidCommandResult(state, '');

      expect(result.output.some(e => e.content.includes('Unknown command'))).toBe(true);
    });
  });
});
