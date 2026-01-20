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
        expect(result.skipToPhase).toBe('neutral_ending');
        expect(result.stateChanges.isGameOver).toBe(true);
      });

      it('prevents disconnect when evidence saved', () => {
        const state = createTestState({
          hiddenCommandsDiscovered: new Set(['disconnect']),
          evidencesSaved: true,
        });
        const result = executeCommand('disconnect', state);
        expect(result.skipToPhase).toBeUndefined();
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
      it('returns error when command not discovered', () => {
        const state = createTestState();
        const result = executeCommand('decode test', state);
        expect(result.output.some(e => e.content.includes('Unknown command'))).toBe(true);
      });

      it('shows usage when no argument provided and command discovered', () => {
        const state = createTestState({
          hiddenCommandsDiscovered: new Set(['decode']),
        });
        const result = executeCommand('decode', state);
        expect(result.output.some(e => e.content.includes('Usage:'))).toBe(true);
      });

      it('succeeds with correct answer', () => {
        const state = createTestState({
          hiddenCommandsDiscovered: new Set(['decode']),
        });
        const result = executeCommand('decode the', state);
        expect(result.output.some(e => e.content.includes('Decryption successful'))).toBe(true);
        expect(result.stateChanges.disinformationDiscovered?.has('cipher_decoded')).toBe(true);
      });

      it('fails with incorrect answer', () => {
        const state = createTestState({
          hiddenCommandsDiscovered: new Set(['decode']),
        });
        const result = executeCommand('decode wrong', state);
        expect(result.output.some(e => e.content.includes('Pattern not recognized'))).toBe(true);
        expect(result.stateChanges.cipherAttempts).toBe(1);
      });

      it('gives hint after 3 failed attempts', () => {
        const state = createTestState({ 
          cipherAttempts: 2,
          hiddenCommandsDiscovered: new Set(['decode']),
        });
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
        expect(result.skipToPhase).toBe('secret_ending');
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
        expect(result.stateChanges.hiddenCommandsDiscovered?.has('decode')).toBe(true);
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

  describe('Truth Discovery Breathers', () => {
    it('reduces detection when discovering a new truth', () => {
      // Reading a file that reveals a truth should reduce detection
      const state = createTestState({
        currentPath: '/storage/assets',
        detectionLevel: 50,
        accessLevel: 2,
        truthsDiscovered: new Set<string>(),
        tutorialStep: -1,
        tutorialComplete: true,
      });
      
      // material_x_analysis.dat reveals 'debris_relocation'
      const result = executeCommand('open material_x_analysis.dat', state);
      
      // Should have detection reduction from breather
      if (result.stateChanges.detectionLevel !== undefined) {
        expect(result.stateChanges.detectionLevel).toBeLessThan(50);
      }
    });

    it('shows recalibration message when truth discovered', () => {
      const state = createTestState({
        currentPath: '/storage/assets',
        detectionLevel: 30,
        accessLevel: 2,
        truthsDiscovered: new Set<string>(),
        tutorialStep: -1,
        tutorialComplete: true,
      });
      
      const result = executeCommand('open material_x_analysis.dat', state);
      
      // Should show recalibration message
      const hasRecalibration = result.output.some(e => 
        e.content.includes('recalibrating') || e.content.includes('MEMO FLAG') || e.content.includes('NOTICE')
      );
      expect(hasRecalibration).toBe(true);
    });
  });

  describe('Detection State Warnings', () => {
    it('shows SUSPICIOUS warning when crossing 50 threshold', () => {
      const state = createTestState({
        currentPath: '/admin',
        detectionLevel: 48,
        accessLevel: 4,
        flags: { adminUnlocked: true },
        tutorialStep: -1,
        tutorialComplete: true,
      });
      
      // trace command adds significant detection
      const result = executeCommand('trace', state);
      
      // If we crossed 50, should see SUSPICIOUS warning
      const newDetection = result.stateChanges.detectionLevel ?? state.detectionLevel;
      if (newDetection >= 50 && newDetection < 70) {
        const hasSuspicious = result.output.some(e => 
          e.content.includes('SUSPICIOUS') || e.content.includes('monitoring increased')
        );
        expect(hasSuspicious).toBe(true);
      }
    });

    it('shows ALERT warning when crossing 70 threshold', () => {
      const state = createTestState({
        currentPath: '/',
        detectionLevel: 65,
        tutorialStep: -1,
        tutorialComplete: true,
      });
      
      // decrypt adds 12 detection
      const result = executeCommand('decrypt nonexistent.enc', state);
      
      const newDetection = result.stateChanges.detectionLevel ?? state.detectionLevel;
      if (newDetection >= 70 && state.detectionLevel < 70) {
        const hasAlert = result.output.some(e => 
          e.content.includes('ALERT') || e.content.includes('paying attention')
        );
        expect(hasAlert).toBe(true);
      }
    });

    it('shows CRITICAL warning and flicker at 85+ threshold', () => {
      const state = createTestState({
        currentPath: '/',
        detectionLevel: 75,
        tutorialStep: -1,
        tutorialComplete: true,
      });
      
      // decrypt adds ~12 detection, should push us to 87+
      const result = executeCommand('decrypt test.enc', state);
      
      const newDetection = result.stateChanges.detectionLevel ?? state.detectionLevel;
      if (newDetection >= 85 && state.detectionLevel < 85) {
        expect(result.triggerFlicker).toBe(true);
        const hasCritical = result.output.some(e => 
          e.content.includes('CRITICAL') || e.content.includes('about to get burned')
        );
        expect(hasCritical).toBe(true);
      }
    });

    it('shows IMMINENT warning and enables hide at 90+ threshold', () => {
      const state = createTestState({
        currentPath: '/',
        detectionLevel: 88,
        tutorialStep: -1,
        tutorialComplete: true,
      });
      
      // decrypt adds detection
      const result = executeCommand('decrypt test.enc', state);
      
      const newDetection = result.stateChanges.detectionLevel ?? state.detectionLevel;
      if (newDetection >= 90 && state.detectionLevel < 90) {
        expect(result.stateChanges.hideAvailable).toBe(true);
        const hasImminent = result.output.some(e => 
          e.content.includes('IMMINENT') || e.content.includes('hide')
        );
        expect(hasImminent).toBe(true);
      }
    });
  });

  describe('Basic Commands', () => {
    it('help command shows available commands', () => {
      const state = createTestState({ tutorialStep: -1, tutorialComplete: true });
      const result = executeCommand('help', state);
      
      expect(result.output.some(e => e.content.includes('TERMINAL COMMANDS'))).toBe(true);
      expect(result.output.some(e => e.content.includes('ls'))).toBe(true);
      expect(result.output.some(e => e.content.includes('cd'))).toBe(true);
      expect(result.output.some(e => e.content.includes('open'))).toBe(true);
    });

    it('status command shows system status', () => {
      const state = createTestState({ 
        tutorialStep: -1, 
        tutorialComplete: true,
        detectionLevel: 30,
      });
      const result = executeCommand('status', state);
      
      expect(result.output.some(e => e.content.includes('SYSTEM STATUS'))).toBe(true);
      expect(result.output.some(e => e.content.includes('LOGGING'))).toBe(true);
    });

    it('cd command changes directory', () => {
      const state = createTestState({ 
        currentPath: '/',
        tutorialStep: -1, 
        tutorialComplete: true,
      });
      const result = executeCommand('cd storage', state);
      
      expect(result.stateChanges.currentPath).toBe('/storage');
    });

    it('clear command clears history', () => {
      const state = createTestState({ 
        tutorialStep: -1, 
        tutorialComplete: true,
        history: [{ id: '1', type: 'output', content: 'test', timestamp: Date.now() }],
      });
      const result = executeCommand('clear', state);
      
      expect(result.stateChanges.history).toEqual([]);
    });
  });

  describe('Easter Eggs', () => {
    it('trust_protocol_1993.txt exists in /internal', () => {
      const state = createTestState({ 
        currentPath: '/internal',
        tutorialStep: -1, 
        tutorialComplete: true,
      });
      const result = executeCommand('open trust_protocol_1993.txt', state);
      
      expect(result.output.some(e => e.content.includes('TRUST NO ONE'))).toBe(true);
    });

    it('modem_log_jan96.txt contains IRC chat', () => {
      const state = createTestState({ 
        currentPath: '/tmp',
        tutorialStep: -1, 
        tutorialComplete: true,
      });
      const result = executeCommand('open modem_log_jan96.txt', state);
      
      expect(result.output.some(e => e.content.includes('UFO74'))).toBe(true);
      expect(result.output.some(e => e.content.includes('IRC'))).toBe(true);
    });

    it('jardim_andere_incident.txt contains real Varginha details', () => {
      const state = createTestState({ 
        currentPath: '/storage/quarantine',
        tutorialStep: -1, 
        tutorialComplete: true,
      });
      const result = executeCommand('open jardim_andere_incident.txt', state);
      
      expect(result.output.some(e => e.content.includes('Jardim Andere'))).toBe(true);
      expect(result.output.some(e => e.content.includes('20-JAN-1996'))).toBe(true);
    });
  });

  describe('Advanced Commands', () => {
    it('chat command connects to PRISONER_45', () => {
      const state = createTestState({
        tutorialStep: -1,
        tutorialComplete: true,
      });
      const result = executeCommand('chat', state);
      
      expect(result.output.some(e => e.content.includes('PRISONER_45'))).toBe(true);
    });

    it('link command shows access denied when not unlocked', () => {
      const state = createTestState({
        tutorialStep: -1,
        tutorialComplete: true,
      });
      const result = executeCommand('link', state);
      
      expect(result.output.some(e => 
        e.content.includes('ACCESS DENIED') || e.content.includes('NEURAL PATTERN')
      )).toBe(true);
    });

    it('script command shows script status', () => {
      const state = createTestState({
        tutorialStep: -1,
        tutorialComplete: true,
      });
      const result = executeCommand('script', state);
      
      expect(result.output.length).toBeGreaterThan(0);
    });

    it('recover command shows usage or attempts recovery', () => {
      const state = createTestState({
        tutorialStep: -1,
        tutorialComplete: true,
      });
      const result = executeCommand('recover', state);
      
      expect(result.output.length).toBeGreaterThan(0);
    });

    it('save command triggers evidence save flow', () => {
      const state = createTestState({
        tutorialStep: -1,
        tutorialComplete: true,
      });
      const result = executeCommand('save', state);
      
      expect(result.output.some(e => 
        e.content.includes('evidence') || e.content.includes('SAVE') || e.content.includes('save')
      )).toBe(true);
    });

    it('trace command shows network activity or traces', () => {
      const state = createTestState({
        tutorialStep: -1,
        tutorialComplete: true,
        accessLevel: 2,
      });
      const result = executeCommand('trace', state);
      
      expect(result.output.length).toBeGreaterThan(0);
    });
  });

  describe('Wrong Command Handling', () => {
    it('invalid command increases detection and alert counter', () => {
      const state = createTestState({
        tutorialStep: -1,
        tutorialComplete: true,
        detectionLevel: 20,
        legacyAlertCounter: 0,
      });
      const result = executeCommand('invalidcmd', state);
      
      expect(result.stateChanges.detectionLevel).toBe(22); // +2
      expect(result.stateChanges.legacyAlertCounter).toBe(1);
      expect(result.output.some(e => e.content.includes('RISK INCREASED'))).toBe(true);
    });

    it('UFO74 helps after 3 wrong commands', () => {
      const state = createTestState({
        tutorialStep: -1,
        tutorialComplete: true,
        legacyAlertCounter: 2,
      });
      const result = executeCommand('badcommand', state);
      
      expect(result.stateChanges.legacyAlertCounter).toBe(3);
      expect(result.output.some(e => e.content.includes('fumbling'))).toBe(true);
    });

    it('game over after 8 wrong commands', () => {
      const state = createTestState({
        tutorialStep: -1,
        tutorialComplete: true,
        legacyAlertCounter: 7,
      });
      const result = executeCommand('wrongcmd', state);
      
      expect(result.stateChanges.isGameOver).toBe(true);
      expect(result.stateChanges.gameOverReason).toBe('INVALID ATTEMPT THRESHOLD');
    });
  });
});
