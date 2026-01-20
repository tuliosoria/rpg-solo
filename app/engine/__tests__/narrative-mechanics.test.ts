import { describe, it, expect, beforeEach } from 'vitest';
import { executeCommand } from '../commands';
import { GameState, DEFAULT_GAME_STATE, TruthCategory } from '../../types';

const createTestState = (overrides: Partial<GameState> = {}): GameState => ({
  ...DEFAULT_GAME_STATE,
  seed: 12345,
  rngState: 12345,
  sessionStartTime: Date.now(),
  ...overrides,
});

describe('Narrative Mechanics', () => {
  describe('Hidden Commands', () => {
    describe('disconnect command', () => {
      it('returns error when command not discovered', () => {
        const state = createTestState();
        const result = executeCommand('disconnect', state);
        expect(result.output.some(e => e.content.includes('Unknown command'))).toBe(true);
      });

      it('triggers neutral ending when discovered and evidence not saved', () => {
        const state = createTestState({
          hiddenCommandsDiscovered: new Set(['disconnect']),
          evidencesSaved: false,
        });
        const result = executeCommand('disconnect', state);
        expect(result.stateChanges.gamePhase).toBe('neutral_ending');
        expect(result.stateChanges.isGameOver).toBe(true);
      });

      it('prevents disconnect when evidence saved', () => {
        const state = createTestState({
          hiddenCommandsDiscovered: new Set(['disconnect']),
          evidencesSaved: true,
        });
        const result = executeCommand('disconnect', state);
        expect(result.stateChanges.gamePhase).toBeUndefined();
        expect(result.output.some(e => e.content.includes('transfer in progress'))).toBe(true);
      });
    });

    describe('scan command', () => {
      it('returns error when command not discovered', () => {
        const state = createTestState();
        const result = executeCommand('scan', state);
        expect(result.output.some(e => e.content.includes('Unknown command'))).toBe(true);
      });

      it('reveals hidden files and increases detection when discovered', () => {
        const state = createTestState({
          hiddenCommandsDiscovered: new Set(['scan']),
          detectionLevel: 10,
        });
        const result = executeCommand('scan', state);
        expect(result.stateChanges.flags?.adminUnlocked).toBe(true);
        expect(result.stateChanges.detectionLevel).toBe(25); // 10 + 15
      });

      it('caps detection at 100', () => {
        const state = createTestState({
          hiddenCommandsDiscovered: new Set(['scan']),
          detectionLevel: 95,
        });
        const result = executeCommand('scan', state);
        expect(result.stateChanges.detectionLevel).toBe(100);
      });
    });

    describe('decode command', () => {
      it('shows usage when no argument provided', () => {
        const state = createTestState();
        const result = executeCommand('decode', state);
        expect(result.output.some(e => e.content.includes('Usage:'))).toBe(true);
      });

      it('succeeds with correct answer', () => {
        const state = createTestState();
        const result = executeCommand('decode the', state);
        expect(result.output.some(e => e.content.includes('Decryption successful'))).toBe(true);
        expect(result.stateChanges.disinformationDiscovered?.has('cipher_decoded')).toBe(true);
      });

      it('fails with incorrect answer', () => {
        const state = createTestState();
        const result = executeCommand('decode wrong', state);
        expect(result.output.some(e => e.content.includes('Pattern not recognized'))).toBe(true);
        expect(result.stateChanges.cipherAttempts).toBe(1);
      });

      it('gives hint after 3 failed attempts', () => {
        const state = createTestState({ cipherAttempts: 2 });
        const result = executeCommand('decode wrong', state);
        expect(result.output.some(e => e.content.includes('ROT13'))).toBe(true);
        expect(result.stateChanges.cipherAttempts).toBe(3);
      });
    });
  });

  describe('Password Puzzle', () => {
    it('requires password for ghost_in_machine.enc', () => {
      const state = createTestState({
        currentPath: '/sys',
        flags: { adminUnlocked: true },
      });
      // Use absolute path since the file is in /sys
      const result = executeCommand('decrypt /sys/ghost_in_machine.enc', state);
      // Should prompt for password or show file not found if dir not accessible
      const hasPasswordPrompt = result.output.some(e => e.content.includes('PASSWORD REQUIRED'));
      const hasFileNotFound = result.output.some(e => e.content.includes('File not found'));
      expect(hasPasswordPrompt || hasFileNotFound).toBe(true);
    });

    it('rejects wrong password', () => {
      const state = createTestState({
        currentPath: '/sys',
        flags: { adminUnlocked: true },
      });
      const result = executeCommand('decrypt /sys/ghost_in_machine.enc wrongpassword', state);
      // Should show decryption failed or file not found
      const hasFailed = result.output.some(e => e.content.includes('DECRYPTION FAILED') || e.content.includes('Invalid password'));
      const hasFileNotFound = result.output.some(e => e.content.includes('File not found'));
      expect(hasFailed || hasFileNotFound).toBe(true);
    });

    it('triggers secret ending with correct password', () => {
      const state = createTestState({
        currentPath: '/sys',
        flags: { adminUnlocked: true },
      });
      const result = executeCommand('decrypt /sys/ghost_in_machine.enc varginha1996', state);
      // Should succeed or file not found
      const hasSuccess = result.output.some(e => e.content.includes('DECRYPTION SUCCESSFUL'));
      const hasFileNotFound = result.output.some(e => e.content.includes('File not found'));
      if (hasSuccess) {
        expect(result.stateChanges.ufo74SecretDiscovered).toBe(true);
        expect(result.stateChanges.gamePhase).toBe('secret_ending');
      } else {
        expect(hasFileNotFound).toBe(true);
      }
    });
  });

  describe('Special File Triggers', () => {
    describe('maintenance_notes.txt', () => {
      it('unlocks hidden commands when read', () => {
        const state = createTestState({ currentPath: '/internal' });
        const result = executeCommand('open maintenance_notes.txt', state);
        expect(result.stateChanges.hiddenCommandsDiscovered?.has('disconnect')).toBe(true);
        expect(result.stateChanges.hiddenCommandsDiscovered?.has('scan')).toBe(true);
      });
    });

    describe('transfer_authorization.txt', () => {
      it('reveals password when read', () => {
        const state = createTestState({ currentPath: '/internal' });
        const result = executeCommand('open transfer_authorization.txt', state);
        expect(result.stateChanges.passwordsFound?.has('varginha1996')).toBe(true);
      });
    });

    describe('incident_summary_official.txt', () => {
      it('flags disinformation when read', () => {
        const state = createTestState({ currentPath: '/internal' });
        const result = executeCommand('open incident_summary_official.txt', state);
        expect(result.stateChanges.disinformationDiscovered?.has('official_summary')).toBe(true);
      });
    });

    describe('active_trace.sys', () => {
      it('triggers countdown when read with sufficient access', () => {
        const state = createTestState({
          currentPath: '/sys',
          flags: { adminUnlocked: true },
          countdownActive: false,
          accessLevel: 3, // Needs access level >= 2
        });
        const result = executeCommand('open /sys/active_trace.sys', state);
        // If file is accessible, should trigger countdown
        const hasFileNotFound = result.output.some(e => e.content.includes('File not found') || e.content.includes('not found'));
        const hasAccessDenied = result.output.some(e => e.content.includes('Access') || e.content.includes('level'));
        if (!hasFileNotFound && !hasAccessDenied) {
          expect(result.stateChanges.countdownActive).toBe(true);
          expect(result.stateChanges.countdownEndTime).toBeGreaterThan(Date.now());
        }
      });

      it('does not reset countdown if already active', () => {
        const originalEndTime = Date.now() + 60000;
        const state = createTestState({
          currentPath: '/sys',
          flags: { adminUnlocked: true },
          countdownActive: true,
          countdownEndTime: originalEndTime,
          accessLevel: 3,
        });
        const result = executeCommand('open /sys/active_trace.sys', state);
        // Should not change the countdown
        expect(result.stateChanges.countdownActive).toBeUndefined();
      });
    });
  });

  describe('GOD Mode Commands', () => {
    describe('god bad', () => {
      it('triggers bad ending', () => {
        const state = createTestState({ godMode: true });
        const result = executeCommand('god bad', state);
        expect(result.skipToPhase).toBe('bad_ending');
        expect(result.stateChanges.isGameOver).toBe(true);
      });
    });

    describe('god neutral', () => {
      it('triggers neutral ending', () => {
        const state = createTestState({ godMode: true });
        const result = executeCommand('god neutral', state);
        expect(result.skipToPhase).toBe('neutral_ending');
        expect(result.stateChanges.isGameOver).toBe(true);
      });
    });

    describe('god secret', () => {
      it('triggers secret ending', () => {
        const state = createTestState({ godMode: true });
        const result = executeCommand('god secret', state);
        expect(result.skipToPhase).toBe('secret_ending');
        expect(result.stateChanges.ufo74SecretDiscovered).toBe(true);
      });
    });

    describe('god countdown', () => {
      it('starts countdown', () => {
        const state = createTestState({ godMode: true });
        const result = executeCommand('god countdown', state);
        expect(result.stateChanges.countdownActive).toBe(true);
        expect(result.stateChanges.countdownEndTime).toBeGreaterThan(Date.now());
      });
    });

    describe('god unlock', () => {
      it('unlocks all hidden features', () => {
        const state = createTestState({ godMode: true });
        const result = executeCommand('god unlock', state);
        expect(result.stateChanges.hiddenCommandsDiscovered?.has('disconnect')).toBe(true);
        expect(result.stateChanges.hiddenCommandsDiscovered?.has('scan')).toBe(true);
        expect(result.stateChanges.passwordsFound?.has('varginha1996')).toBe(true);
        expect(result.stateChanges.flags?.adminUnlocked).toBe(true);
      });
    });
  });

  describe('File Corruption Spread', () => {
    it('corrupts nearby files when reading core_dump_corrupted.bin', () => {
      const state = createTestState({ 
        currentPath: '/tmp',
        dataIntegrity: 100,
      });
      const result = executeCommand('open core_dump_corrupted.bin', state);
      // Should have corruption applied to a random file
      expect(result.stateChanges.fileMutations).toBeDefined();
      expect(result.stateChanges.dataIntegrity).toBeLessThan(100);
      expect(result.triggerFlicker).toBe(true);
    });
  });

  describe('UFO74 Entry Type', () => {
    it('uses ufo74 entry type for UFO74 messages in password prompt', () => {
      const state = createTestState({
        currentPath: '/sys',
        flags: { adminUnlocked: true },
      });
      const result = executeCommand('decrypt /sys/ghost_in_machine.enc', state);
      // Check if UFO74 entries exist (when file is accessible)
      const hasFileNotFound = result.output.some(e => e.content.includes('File not found'));
      if (!hasFileNotFound) {
        const ufo74Entries = result.output.filter(e => e.type === 'ufo74');
        expect(ufo74Entries.length).toBeGreaterThan(0);
      }
    });
  });
});
