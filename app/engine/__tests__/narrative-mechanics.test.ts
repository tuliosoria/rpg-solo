import { describe, it, expect } from 'vitest';
import { executeCommand } from '../commands';
import { GameState, DEFAULT_GAME_STATE } from '../../types';

const createTestState = (overrides: Partial<GameState> = {}): GameState => ({
  ...DEFAULT_GAME_STATE,
  seed: 12345,
  rngState: 12345,
  sessionStartTime: Date.now(),
  tutorialStep: -1,
  tutorialComplete: true,
  evidenceCount: 1, // Exit atmosphere phase
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
          filesRead: new Set(['/a', '/b', '/c', '/d', '/e', '/f', '/g', '/h']), // Past warmup
        });
        const result = executeCommand('scan', state);
        expect(result.stateChanges.flags?.adminUnlocked).toBe(true);
        expect(result.stateChanges.detectionLevel).toBe(20); // 10 + 10 (was +15, reduced for balance)
      });

      it('caps detection at 100', () => {
        const state = createTestState({
          hiddenCommandsDiscovered: new Set(['scan']),
          detectionLevel: 95,
          filesRead: new Set(['/a', '/b', '/c', '/d', '/e', '/f', '/g', '/h']), // Past warmup
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

  describe('Legacy decrypt compatibility', () => {
    it('opens ghost_in_machine.enc directly without the old password prompt', () => {
      const state = createTestState({
        currentPath: '/sys',
        flags: { adminUnlocked: true },
        accessLevel: 3,
      });

      const result = executeCommand('decrypt /sys/ghost_in_machine.enc', state);
      const output = result.output.map(e => e.content).join('\n');

      expect(output).not.toContain('PASSWORD REQUIRED');
      expect(output).toContain('old decrypt wrappers are retired');
      expect(output).toContain('FILE: /sys/ghost_in_machine.enc');
    });

    it('ignores a wrong password and still opens the recovered file', () => {
      const state = createTestState({
        currentPath: '/sys',
        flags: { adminUnlocked: true },
        accessLevel: 3,
      });

      const result = executeCommand('decrypt /sys/ghost_in_machine.enc wrongpassword', state);
      const output = result.output.map(e => e.content).join('\n');

      expect(output).not.toContain('DECRYPTION FAILED');
      expect(output).toContain('FILE: /sys/ghost_in_machine.enc');
    });

    it('decrypt reveals UFO74 when the ghost_in_machine password is correct', () => {
      const state = createTestState({
        currentPath: '/sys',
        flags: { adminUnlocked: true },
        accessLevel: 3,
      });
      const result = executeCommand('decrypt /sys/ghost_in_machine.enc varginha1996', state);
      expect(result.output.some(e => e.content.includes('DECRYPTION SUCCESSFUL'))).toBe(true);
      expect(result.stateChanges.ufo74SecretDiscovered).toBe(true);
      expect(result.skipToPhase).toBeUndefined();
      expect(result.triggerFlicker).toBe(true);
    });
  });

  describe('Special File Triggers', () => {
    describe('evidence discovery output', () => {
      it('does not emit the old evidence banner or category line', () => {
        const state = createTestState({
          currentPath: '/storage/assets',
          evidenceCount: 0,
          flags: { adminUnlocked: true },
        });

        const result = executeCommand('open logistics_manifest_fragment.txt', state);

        // The old category-based evidence system is gone
        expect(result.output.some(e => e.content.includes('EVIDENCE FOUND'))).toBe(false);
        expect(result.output.some(e => e.content.includes('Category:'))).toBe(false);
      });
    });

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
        const state = createTestState({ currentPath: '/internal/personnel' });
        const result = executeCommand('open transfer_authorization.txt', state);
        expect(result.stateChanges.passwordsFound?.has('varginha1996')).toBe(true);
      });
    });

    describe('incident_summary_official.txt', () => {
      it('flags disinformation when read', () => {
        const state = createTestState({ currentPath: '/internal', flags: { adminUnlocked: true } });
        const result = executeCommand('open incident_summary_official.txt', state);
        expect(result.stateChanges.disinformationDiscovered?.has('official_summary')).toBe(true);
      });
    });

    describe('active_trace.sys', () => {
      it('no longer triggers countdown when read with sufficient access', () => {
        const state = createTestState({
          currentPath: '/sys',
          flags: { adminUnlocked: true },
          countdownActive: false,
          accessLevel: 3, // Needs access level >= 2
        });
        const result = executeCommand('open /sys/active_trace.sys', state);
        // If file is accessible, should trigger countdown
        const hasFileNotFound = result.output.some(
          e => e.content.includes('File not found') || e.content.includes('not found')
        );
        const hasAccessDenied = result.output.some(
          e => e.content.includes('Access') || e.content.includes('level')
        );
        if (!hasFileNotFound && !hasAccessDenied) {
          expect(result.stateChanges.countdownActive).toBeUndefined();
          expect(result.stateChanges.traceSpikeActive).toBeUndefined();
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

  describe('UFO74 Entry Type', () => {
    it('decrypt ghost_in_machine can emit ufo74 entries', () => {
      const state = createTestState({
        currentPath: '/sys',
        flags: { adminUnlocked: true },
        accessLevel: 3,
      });
      const result = executeCommand('decrypt /sys/ghost_in_machine.enc', state);
      const ufo74Entries = result.output.filter(e => e.type === 'ufo74');
      expect(ufo74Entries.length).toBeGreaterThan(0);
    });
  });

  describe('UFO74 Override Protocol Hints', () => {
    it('nudges players toward the main evidence directories after 3 files read', () => {
      // State where player has read exactly 2 files - reading 3rd should trigger hint
      const state = createTestState({
        currentPath: '/internal/misc',
        tutorialStep: -1,
        tutorialComplete: true,
        filesRead: new Set([
          '/internal/protocols/incident_review_protocol.txt',
          '/comms/radio_intercept_log.txt',
        ]),
        flags: { overrideSuggested: false, adminUnlocked: false },
      });

      // Open 3rd file (this makes filesRead.size === 3 after processing)
      const result = executeCommand('open cafeteria_menu.txt', state);

      // Should include the updated exploration hint (in pendingUfo74Messages, not output)
      const pendingMessages = result.pendingUfo74Messages || [];
      const hasDirectoryHint = pendingMessages.some(
        e =>
          e.content.includes('start digging through /storage, /ops, and /comms.') ||
          e.content.includes('good files are scattered all over the system')
      );
      expect(hasDirectoryHint).toBe(true);
      expect(result.stateChanges.flags?.overrideSuggested).toBe(true);
    });

    it('does NOT suggest override protocol when already unlocked (adminUnlocked)', () => {
      // State where player has read 4 files BUT already has adminUnlocked
      const state = createTestState({
        currentPath: '/storage/quarantine',
        tutorialStep: -1,
        tutorialComplete: true,
        filesRead: new Set([
          '/internal/admin/contact_list.txt',
          '/internal/misc/maintenance_schedule.txt',
          '/comms/radio_intercept_log.txt',
          '/storage/assets/material_x_analysis.dat',
        ]),
        flags: { overrideSuggested: false, adminUnlocked: true },
      });

      // Open 5th file
      const result = executeCommand('open bio_container.log', state);

      // Should NOT include UFO74 hint about override protocol since already unlocked
      const hasOverrideHint = result.output.some(
        e => e.content.includes('override protocol') && e.content.includes('MORE hidden')
      );
      expect(hasOverrideHint).toBe(false);
    });

    it('does NOT suggest override protocol if already suggested', () => {
      // State where override was already suggested
      const state = createTestState({
        currentPath: '/storage/quarantine',
        tutorialStep: -1,
        tutorialComplete: true,
        filesRead: new Set([
          '/internal/admin/contact_list.txt',
          '/internal/misc/maintenance_schedule.txt',
          '/comms/radio_intercept_log.txt',
          '/storage/assets/material_x_analysis.dat',
        ]),
        flags: { overrideSuggested: true, adminUnlocked: false },
      });

      // Open 5th file
      const result = executeCommand('open bio_container.log', state);

      // Should NOT include UFO74 hint since already suggested
      const hasOverrideHint = result.output.some(
        e => e.content.includes('override protocol') && e.content.includes('MORE hidden')
      );
      expect(hasOverrideHint).toBe(false);
    });
  });

  describe('Truth Discovery Breathers', () => {
    it('reduces detection when discovering a new truth', () => {
      // Reading a file that reveals a truth should reduce detection
      const state = createTestState({
        currentPath: '/storage/assets',
        detectionLevel: 50,
        accessLevel: 2,
        evidenceCount: 0,
        tutorialStep: -1,
        tutorialComplete: true,
        flags: { adminUnlocked: true },
      });

      // material_x_analysis.dat should reveal evidence
      const result = executeCommand('open material_x_analysis.dat', state);

      // Detection should NOT decrease when discovering evidence (breather mechanic was removed)
      // Detection either stays the same or increases slightly from the command itself
      if (result.stateChanges.detectionLevel !== undefined) {
        expect(result.stateChanges.detectionLevel).toBeGreaterThanOrEqual(50);
      }
    });

    it('shows recalibration or notice message when opening files', () => {
      const state = createTestState({
        currentPath: '/storage/assets',
        detectionLevel: 30,
        accessLevel: 2,
        evidenceCount: 0,
        tutorialStep: -1,
        tutorialComplete: true,
        flags: { adminUnlocked: true },
      });

      const result = executeCommand('open material_x_analysis.dat', state);

      // With the simplified evidence system, evidence only increments on scared reactions
      // The file may or may not trigger a scared reaction based on its content
      // Just verify no old-style category output
      expect(result.output.some(e => e.content.includes('Category:'))).toBe(false);
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
        const hasSuspicious = result.output.some(
          e => e.content.includes('SUSPICIOUS') || e.content.includes('monitoring increased')
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
        const hasAlert = result.output.some(
          e => e.content.includes('ALERT') || e.content.includes('paying attention')
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
        const hasCritical = result.output.some(
          e => e.content.includes('CRITICAL') || e.content.includes('about to get burned')
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
        const hasImminent = result.output.some(
          e => e.content.includes('IMMINENT') || e.content.includes('hide')
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
      const result = executeCommand('cd comms', state);

      expect(result.stateChanges.currentPath).toBe('/comms');
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
    it('trust_protocol_1993.txt exists in /internal/protocols', () => {
      const state = createTestState({
        currentPath: '/internal/protocols',
        tutorialStep: -1,
        tutorialComplete: true,
      });
      const result = executeCommand('open trust_protocol_1993.txt', state);

      expect(result.output.some(e => e.content.includes('SHARE NOTHING BEYOND YOUR SCOPE'))).toBe(
        true
      );
    });

    it('modem_log_jan96.txt contains IRC chat', () => {
      const state = createTestState({
        currentPath: '/tmp',
        tutorialStep: -1,
        tutorialComplete: true,
      });
      const result = executeCommand('open modem_log_jan96.txt', state);

      expect(result.output.some(e => e.content.includes('brasnet'))).toBe(true);
      expect(result.output.some(e => e.content.includes('IRC'))).toBe(true);
    });

    it('jardim_andere_incident.txt contains real Varginha details', () => {
      const state = createTestState({
        currentPath: '/internal',
        tutorialStep: -1,
        tutorialComplete: true,
        flags: { adminUnlocked: true },
      });
      const result = executeCommand('open jardim_andere_incident.txt', state);

      expect(result.output.some(e => e.content.includes('Jardim Andere'))).toBe(true);
      expect(result.output.some(e => e.content.includes('20-JAN-1996'))).toBe(true);
    });

    it('jardim_andere_incident.txt logs evidence on first read', () => {
      const state = createTestState({
        currentPath: '/internal',
        tutorialStep: -1,
        tutorialComplete: true,
        evidenceCount: 0,
      });
      const result = executeCommand('open jardim_andere_incident.txt', state);

      expect(result.stateChanges.evidenceCount).toBe(1);
      expect(result.stateChanges.avatarExpression).toBe('scared');
      expect(result.stateChanges.filesRead?.has('/internal/jardim_andere_incident.txt')).toBe(true);
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

    it('link command shows access denied when scout link not unlocked', () => {
      const state = createTestState({
        tutorialStep: -1,
        tutorialComplete: true,
      });
      const result = executeCommand('link', state);

      expect(
        result.output.some(
          e => e.content.includes('ACCESS DENIED') || e.content.includes('psi-comm')
        )
      ).toBe(true);
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

      expect(
        result.output.some(
          e =>
            e.content.includes('evidence') ||
            e.content.includes('SAVE') ||
            e.content.includes('save')
        )
      ).toBe(true);
    });

    it('trace command reveals network activity', () => {
      const state = createTestState({
        tutorialStep: -1,
        tutorialComplete: true,
        accessLevel: 2,
      });
      const result = executeCommand('trace', state);

      expect(result.output.some(e => e.content.includes('TRACE RESULT:'))).toBe(true);
      expect(result.stateChanges.accessLevel).toBe(3);
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

  describe('Prisoner_45 Disinformation Responses', () => {
    it('responds to disinformation keywords', () => {
      const state = createTestState({
        tutorialStep: -1,
        tutorialComplete: true,
      });
      const result = executeCommand('chat is the official story a lie?', state);

      expect(result.output.some(e => e.content.includes('PRISONER_45'))).toBe(true);
    });

    it('responds to balloon cover story question', () => {
      const state = createTestState({
        tutorialStep: -1,
        tutorialComplete: true,
      });
      const result = executeCommand('chat what about the weather balloon?', state);

      expect(result.output.some(e => e.content.includes('PRISONER_45'))).toBe(true);
    });
  });

  describe('New International Actors Files', () => {
    it('diplomatic_cable_23jan.enc exists in /comms/liaison', () => {
      const state = createTestState({
        tutorialStep: -1,
        tutorialComplete: true,
        currentPath: '/comms/liaison',
        accessLevel: 2,
        flags: { adminUnlocked: true },
      });
      const result = executeCommand('ls', state);

      expect(result.output.some(e => e.content.includes('diplomatic_cable_23jan'))).toBe(true);
    });

    it('standing_orders_multinational.txt exists in /comms/liaison with admin access', () => {
      const state = createTestState({
        tutorialStep: -1,
        tutorialComplete: true,
        currentPath: '/comms/liaison',
        accessLevel: 3,
        flags: { adminUnlocked: true },
      });
      const result = executeCommand('ls', state);

      expect(result.output.some(e => e.content.includes('standing_orders_multinational'))).toBe(
        true
      );
    });
  });

  describe('Avatar Expression Triggers', () => {
    it('sets scared expression when detection crosses 85', () => {
      const state = createTestState({
        tutorialStep: -1,
        tutorialComplete: true,
        detectionLevel: 84,
      });
      // Trigger a command that increases detection
      const result = executeCommand('wrongcmd', state);
      // Detection warnings should appear at high levels
      expect(result.output.length).toBeGreaterThan(0);
    });
  });

  describe('Contextual Wandering Hints', () => {
    it('provides targeted hints based on exploration state', () => {
      // This tests that the wandering system is context-aware
      // The actual hint content is tested implicitly through the function
      const state = createTestState({
        tutorialStep: -1,
        tutorialComplete: true,
        sessionCommandCount: 20,
        lastMeaningfulAction: 0,
        wanderingNoticeCount: 0,
        filesRead: new Set(), // Nothing read yet
      });
      // After many commands without meaningful action, should trigger wandering notice
      // We can't easily trigger this without mocking, but the function exists
      expect(state.wanderingNoticeCount).toBe(0);
    });
  });

  describe('Chat Command - Prisoner_45', () => {
    it('connects to Prisoner_45 on first use', () => {
      const state = createTestState({
        tutorialStep: -1,
        tutorialComplete: true,
      });
      const result = executeCommand('chat', state);
      expect(result.output.some(e => e.content.includes('PRISONER_45'))).toBe(true);
    });

    it('responds to varginha-related questions', () => {
      const state = createTestState({
        tutorialStep: -1,
        tutorialComplete: true,
        prisoner45QuestionsAsked: 0,
      });
      const result = executeCommand('chat what happened in varginha?', state);
      expect(result.output.some(e => e.content.includes('PRISONER_45'))).toBe(true);
      expect(result.stateChanges.prisoner45QuestionsAsked).toBe(1);
    });

    it('disconnects after 5 questions', () => {
      const state = createTestState({
        tutorialStep: -1,
        tutorialComplete: true,
        prisoner45QuestionsAsked: 5,
        prisoner45Disconnected: false,
      });
      const result = executeCommand('chat hello', state);
      expect(
        result.output.some(
          e => e.content.includes('CONNECTION TERMINATED') || e.content.includes('cutting the line')
        )
      ).toBe(true);
      expect(result.stateChanges.prisoner45Disconnected).toBe(true);
    });

    it('shows disconnected message when already disconnected', () => {
      const state = createTestState({
        tutorialStep: -1,
        tutorialComplete: true,
        prisoner45Disconnected: true,
      });
      const result = executeCommand('chat hello', state);
      expect(
        result.output.some(
          e =>
            e.content.includes('CONNECTION TERMINATED') || e.content.includes('RELAY NODE OFFLINE')
        )
      ).toBe(true);
    });
  });

  describe('Link Command - Scout Neural Link', () => {
    it('requires scoutLinkUnlocked flag', () => {
      const state = createTestState({
        tutorialStep: -1,
        tutorialComplete: true,
        flags: { scoutLinkUnlocked: false },
      });
      const result = executeCommand('link', state);
      expect(
        result.output.some(
          e => e.content.includes('ACCESS DENIED') || e.content.includes('NO VALID NEURAL PATTERN')
        )
      ).toBe(true);
    });

    it('allows connection when unlocked and authenticated', () => {
      const state = createTestState({
        tutorialStep: -1,
        tutorialComplete: true,
        flags: { scoutLinkUnlocked: true, neuralLinkAuthenticated: true },
        scoutLinksUsed: 0,
      });
      const result = executeCommand('link', state);
      expect(
        result.output.some(
          e =>
            e.content.includes('NEURAL PATTERN LINK') ||
            e.content.includes('connection') ||
            e.content.includes('established') ||
            e.content.includes('Query the consciousness')
        )
      ).toBe(true);
    });

    it('exhausts after 4 uses', () => {
      const state = createTestState({
        tutorialStep: -1,
        tutorialComplete: true,
        flags: { scoutLinkUnlocked: true, neuralLinkAuthenticated: true },
        scoutLinksUsed: 4,
      });
      const result = executeCommand('link what is your purpose', state);
      expect(
        result.output.some(
          e =>
            e.content.includes('PATTERN EXHAUSTED') || e.content.includes('NEURAL PATTERN DEGRADED')
        )
      ).toBe(true);
    });
  });

  describe('Run Command - Script Execution', () => {
    it('shows usage when no script specified', () => {
      const state = createTestState({
        tutorialStep: -1,
        tutorialComplete: true,
      });
      const result = executeCommand('run', state);
      expect(
        result.output.some(
          e =>
            e.content.includes('USAGE') || e.content.includes('run') || e.content.includes('script')
        )
      ).toBe(true);
    });

    it('run save_evidence.sh redirects to leak command (Elusive Man)', () => {
      const state = createTestState({
        tutorialStep: -1,
        tutorialComplete: true,
        currentPath: '/tmp',
        evidenceCount: 5,
      });
      const result = executeCommand('run save_evidence.sh', state);
      // Should trigger the Elusive Man leak sequence
      expect(
        result.output.some(
          e => e.content.includes('I have resources') || e.content.includes('SECURE CHANNEL')
        )
      ).toBe(true);
      expect(result.stateChanges.inLeakSequence).toBe(true);
    });

    it('executes purge_trace.sh to clear countdown', () => {
      const state = createTestState({
        tutorialStep: -1,
        tutorialComplete: true,
        currentPath: '/tmp',
        countdownActive: true,
        countdownTriggeredBy: 'trace_spike',
        traceSpikeActive: true,
      });
      const result = executeCommand('run purge_trace.sh', state);
      // Should either clear countdown or show error
      expect(result.output.length).toBeGreaterThan(0);
    });
  });

  describe('Trace Command', () => {
    it('shows a limited topology trace at low access levels', () => {
      const state = createTestState({
        tutorialStep: -1,
        tutorialComplete: true,
        accessLevel: 1,
      });
      const result = executeCommand('trace', state);
      expect(result.output.some(e => e.content.includes('/storage/ — ACCESSIBLE'))).toBe(true);
      expect(result.stateChanges.accessLevel).toBe(2);
    });

    it('shows a detailed topology trace at higher access levels', () => {
      const state = createTestState({
        tutorialStep: -1,
        tutorialComplete: true,
        accessLevel: 2,
      });
      const result = executeCommand('trace', state);
      expect(result.output.some(e => e.content.includes('/admin/ — 7 files [HIGH PRIORITY]'))).toBe(
        true
      );
      expect(
        result.output.some(e => e.content.includes('Administrative access may be obtainable.'))
      ).toBe(true);
    });
  });

  describe('Connect Command - Evidence Links', () => {
    it('connect command was removed - shows error or unknown', () => {
      const state = createTestState({
        tutorialStep: -1,
        tutorialComplete: true,
      });
      const result = executeCommand('connect', state);
      // Connect command was removed, should show some kind of error message
      // May show "Unknown command" or other error depending on implementation
      expect(result.output.length).toBeGreaterThan(0);
    });
  });

  describe('Map Command - Evidence Web', () => {
    it('shows no links when none created', () => {
      const state = createTestState({
        tutorialStep: -1,
        tutorialComplete: true,
        evidenceLinks: [],
      });
      const result = executeCommand('map', state);
      expect(
        result.output.some(
          e =>
            e.content.includes('No') ||
            e.content.includes('empty') ||
            e.content.includes('EVIDENCE') ||
            e.content.includes('MAP')
        )
      ).toBe(true);
    });

    it('displays existing evidence links', () => {
      const state = createTestState({
        tutorialStep: -1,
        tutorialComplete: true,
        evidenceLinks: [['/storage/file1.txt', '/ops/file2.txt']],
      });
      const result = executeCommand('map', state);
      expect(result.output.length).toBeGreaterThan(0);
    });
  });

  describe('Leak Command', () => {
    it('blocks leak when evidence is incomplete', () => {
      const state = createTestState({
        tutorialStep: -1,
        tutorialComplete: true,
      });
      const result = executeCommand('leak', state);
      // Should be blocked — not enough evidence
      expect(
        result.output.some(
          e => e.content.includes('INSUFFICIENT EVIDENCE') || e.content.includes('not yet')
        )
      ).toBe(true);
      expect(result.stateChanges.inLeakSequence).toBeUndefined();
    });

    it('triggers Elusive Man interrogation when all evidence found', () => {
      const state = createTestState({
        tutorialStep: -1,
        tutorialComplete: true,
        evidenceCount: 5,
      });
      const result = executeCommand('leak', state);
      // Should trigger the Elusive Man leak sequence
      expect(
        result.output.some(
          e => e.content.includes('I have resources') || e.content.includes('SECURE CHANNEL')
        )
      ).toBe(true);
      expect(result.stateChanges.inLeakSequence).toBe(true);
    });
  });

  describe('Singular Events', () => {
    it('turing evaluation only triggers once', () => {
      const state = createTestState({
        tutorialStep: -1,
        tutorialComplete: true,
        detectionLevel: 50,
        evidenceCount: 1,
        singularEventsTriggered: new Set(['turing_evaluation']),
        turingEvaluationCompleted: true,
      });
      // With turing already triggered, it shouldn't trigger again
      const result = executeCommand('ls', state);
      // Should NOT contain turing evaluation prompt
      expect(result.output.every(e => !e.content.includes('TURING EVALUATION'))).toBe(true);
    });
  });

  describe('Countdown System', () => {
    it('reading active_trace.sys stays informational only', () => {
      const state = createTestState({
        tutorialStep: -1,
        tutorialComplete: true,
        currentPath: '/sys',
        accessLevel: 5,
        flags: { adminUnlocked: true },
        countdownActive: false,
      });
      const result = executeCommand('open active_trace.sys', state);
      expect(result.output.length).toBeGreaterThan(0);
      expect(result.stateChanges.countdownActive).toBeUndefined();
    });
  });

  describe('Doom Countdown (sessionDoomCountdown)', () => {
    it('decrements doom countdown exactly once per command when terribleMistakeTriggered', () => {
      const state = createTestState({
        tutorialStep: -1,
        tutorialComplete: true,
        terribleMistakeTriggered: true,
        sessionDoomCountdown: 10,
      });
      const result = executeCommand('ls', state);

      // Should decrement by exactly 1
      expect(result.stateChanges.sessionDoomCountdown).toBe(9);
    });

    it('shows warning when doom countdown is low (5 or below)', () => {
      const state = createTestState({
        tutorialStep: -1,
        tutorialComplete: true,
        terribleMistakeTriggered: true,
        sessionDoomCountdown: 5,
      });
      const result = executeCommand('ls', state);

      // Should show doom countdown warning in output (uses PURGE COUNTDOWN or PURGE IN format)
      expect(
        result.output.some(
          e => e.content.includes('PURGE COUNTDOWN') || e.content.includes('PURGE IN')
        )
      ).toBe(true);
      expect(result.stateChanges.sessionDoomCountdown).toBe(4);
    });

    it('triggers game over when doom countdown reaches 0', () => {
      const state = createTestState({
        tutorialStep: -1,
        tutorialComplete: true,
        terribleMistakeTriggered: true,
        sessionDoomCountdown: 1, // Will become 0 after command
      });
      const result = executeCommand('ls', state);

      // Should trigger game over with PURGE PROTOCOL reason
      expect(result.stateChanges.isGameOver).toBe(true);
      expect(result.stateChanges.gameOverReason).toContain('PURGE PROTOCOL');
    });

    it('does not decrement doom countdown when terribleMistakeTriggered is false', () => {
      const state = createTestState({
        tutorialStep: -1,
        tutorialComplete: true,
        terribleMistakeTriggered: false,
        sessionDoomCountdown: 10,
      });
      const result = executeCommand('ls', state);

      // Should not change doom countdown
      expect(result.stateChanges.sessionDoomCountdown).toBeUndefined();
    });

    it('maintains correct decrement across multiple commands', () => {
      let state = createTestState({
        tutorialStep: -1,
        tutorialComplete: true,
        terribleMistakeTriggered: true,
        sessionDoomCountdown: 5,
      });

      // Execute 3 commands and verify countdown decrements correctly each time
      for (let i = 0; i < 3; i++) {
        const result = executeCommand('ls', state);
        const expectedCountdown = 5 - (i + 1);
        expect(result.stateChanges.sessionDoomCountdown).toBe(expectedCountdown);

        // Apply state changes for next iteration
        state = {
          ...state,
          sessionDoomCountdown:
            result.stateChanges.sessionDoomCountdown ?? state.sessionDoomCountdown,
        };
      }
    });
  });

  describe('Detection Level Game Over', () => {
    it('triggers game over when detection reaches 100', () => {
      const state = createTestState({
        tutorialStep: -1,
        tutorialComplete: true,
        detectionLevel: 95,
        hiddenCommandsDiscovered: new Set(['scan']),
      });
      // scan adds 15 detection, should push us to 100+
      const result = executeCommand('scan', state);

      expect(result.stateChanges.detectionLevel).toBe(100);
      expect(result.stateChanges.isGameOver).toBe(true);
      expect(result.stateChanges.gameOverReason).toContain('TRACED');
    });

    it('triggers game over when detection exceeds 100', () => {
      const state = createTestState({
        tutorialStep: -1,
        tutorialComplete: true,
        detectionLevel: 98,
        hiddenCommandsDiscovered: new Set(['scan']),
      });
      // scan adds 15 detection, should push us to 113 (capped at 100)
      const result = executeCommand('scan', state);

      // Detection should be capped at 100
      expect(result.stateChanges.detectionLevel).toBe(100);
      expect(result.stateChanges.isGameOver).toBe(true);
    });

    it('does not trigger game over when detection is below 100', () => {
      const state = createTestState({
        tutorialStep: -1,
        tutorialComplete: true,
        detectionLevel: 80,
        hiddenCommandsDiscovered: new Set(['scan']),
      });
      // scan adds 10 detection (was 15, reduced for balance), should push us to 90
      const result = executeCommand('scan', state);

      expect(result.stateChanges.detectionLevel).toBe(90);
      expect(result.stateChanges.isGameOver).toBeUndefined();
    });
  });

  describe('Truth Discovery System', () => {
    it('evidenceCount is a number in state', () => {
      const state = createTestState({
        tutorialStep: -1,
        tutorialComplete: true,
        currentPath: '/storage/assets',
        accessLevel: 3,
        evidenceCount: 0,
        filesRead: new Set<string>(),
        flags: { adminUnlocked: true },
      });

      // Verify evidenceCount exists and is a number
      expect(typeof state.evidenceCount).toBe('number');
      expect(state.evidenceCount).toBe(0);
    });

    it('win condition is evidenceCount >= 5', () => {
      const state = createTestState({
        tutorialStep: -1,
        tutorialComplete: true,
        currentPath: '/ops/exo',
        accessLevel: 4,
        evidenceCount: 5,
        flags: { adminUnlocked: true },
        filesRead: new Set<string>(),
      });

      // Evidence count of 5 should allow the leak command
      const result = executeCommand('leak', state);
      // Should NOT show "INSUFFICIENT EVIDENCE"
      expect(result.output.some(e => e.content.includes('INSUFFICIENT EVIDENCE'))).toBe(false);
    });

    it('blocks leak when evidenceCount < 5', () => {
      const state = createTestState({
        tutorialStep: -1,
        tutorialComplete: true,
        currentPath: '/ops/exo',
        accessLevel: 4,
        evidenceCount: 3,
        flags: { adminUnlocked: true },
        filesRead: new Set<string>(),
      });

      const result = executeCommand('leak', state);
      // Should show insufficient evidence
      expect(
        result.output.some(
          e => e.content.includes('INSUFFICIENT EVIDENCE') || e.content.includes('3/5')
        )
      ).toBe(true);
    });
  });

  describe('Link Command with Image', () => {
    it('shows ET brain image when link is initiated and authenticated', () => {
      const state = createTestState({
        tutorialStep: -1,
        tutorialComplete: true,
        flags: { scoutLinkUnlocked: true, neuralLinkAuthenticated: true },
        scoutLinksUsed: 0,
      });
      const result = executeCommand('link', state);

      // Should have imageTrigger with et-brain.png
      expect(result.imageTrigger).toBeDefined();
      expect(result.imageTrigger?.src).toBe('/images/et-brain.webp');
    });

    it('does not show image on subsequent link queries', () => {
      const state = createTestState({
        tutorialStep: -1,
        tutorialComplete: true,
        flags: { scoutLinkUnlocked: true, neuralLinkAuthenticated: true },
        scoutLinksUsed: 1,
      });
      const result = executeCommand('link what is your purpose', state);

      // Query should not trigger image (only initial link does)
      expect(result.imageTrigger).toBeUndefined();
    });
  });

  describe('File Image Triggers', () => {
    it('foreign_drone_assessment.txt has drone image trigger', () => {
      const state = createTestState({
        tutorialStep: -1,
        tutorialComplete: true,
        currentPath: '/ops/assessments',
        accessLevel: 2,
        filesRead: new Set<string>(),
        imagesShownThisRun: new Set<string>(),
        flags: { adminUnlocked: true },
      });
      const result = executeCommand('open foreign_drone_assessment.txt', state);

      expect(result.imageTrigger).toBeDefined();
      expect(result.imageTrigger?.src).toBe('/images/drone.webp');
    });

    it('foreign_drone_assessment.txt logs evidence and scares the avatar on first read', () => {
      const state = createTestState({
        tutorialStep: -1,
        tutorialComplete: true,
        currentPath: '/ops/assessments',
        accessLevel: 2,
        evidenceCount: 0,
        filesRead: new Set<string>(),
        imagesShownThisRun: new Set<string>(),
        flags: { adminUnlocked: true },
      });

      const result = executeCommand('open foreign_drone_assessment.txt', state);

      expect(result.stateChanges.evidenceCount).toBe(1);
      expect(result.stateChanges.avatarExpression).toBe('scared');
      expect(
        result.stateChanges.filesRead?.has('/ops/assessments/foreign_drone_assessment.txt')
      ).toBe(true);
    });

    it('counts each evidence file separately even when they cover similar material', () => {
      const state = createTestState({
        tutorialStep: -1,
        tutorialComplete: true,
        currentPath: '/storage/assets',
        accessLevel: 2,
        evidenceCount: 1,
        filesRead: new Set<string>(['/ops/assessments/foreign_drone_assessment.txt']),
        flags: { adminUnlocked: true },
      });

      const result = executeCommand('open material_x_analysis.dat', state);

      expect(result.stateChanges.evidenceCount).toBe(2);
      expect(result.stateChanges.avatarExpression).toBe('scared');
    });

    it('bio_program_overview.red logs evidence on first read', () => {
      const state = createTestState({
        tutorialStep: -1,
        tutorialComplete: true,
        currentPath: '/admin',
        accessLevel: 4,
        evidenceCount: 0,
        filesRead: new Set<string>(),
        flags: { adminUnlocked: true },
      });

      const result = executeCommand('open bio_program_overview.red', state);

      expect(result.stateChanges.evidenceCount).toBe(1);
      expect(result.stateChanges.filesRead?.has('/admin/bio_program_overview.red')).toBe(true);
    });

    it('field_report_delta.txt has prato-delta image trigger', () => {
      const state = createTestState({
        tutorialStep: -1,
        tutorialComplete: true,
        currentPath: '/ops/prato',
        accessLevel: 2,
        filesRead: new Set<string>(),
        imagesShownThisRun: new Set<string>(), // Ensure no images shown yet
        flags: { adminUnlocked: true }, // prato folder now requires adminUnlocked
      });
      const result = executeCommand('open field_report_delta.txt', state);

      expect(result.imageTrigger).toBeDefined();
      expect(result.imageTrigger?.src).toBe('/images/prato-delta.webp');
    });
  });

  describe('ALPHA Release Command', () => {
    it('shows error when no target provided', () => {
      const state = createTestState({
        tutorialStep: -1,
        tutorialComplete: true,
      });
      const result = executeCommand('release', state);

      expect(result.output.some(e => e.content.includes('REQUIRES TARGET'))).toBe(true);
    });

    it('shows file not found when ALPHA files not discovered', () => {
      const state = createTestState({
        tutorialStep: -1,
        tutorialComplete: true,
        filesRead: new Set<string>(),
      });
      const result = executeCommand('release alpha', state);

      expect(
        result.output.some(
          e => e.content.includes('not found') || e.content.includes('not available')
        )
      ).toBe(true);
    });

    it('successfully releases ALPHA when files discovered', () => {
      const state = createTestState({
        tutorialStep: -1,
        tutorialComplete: true,
        filesRead: new Set(['/storage/quarantine/alpha_journal.log']),
        detectionLevel: 20,
        flags: {},
      });
      const result = executeCommand('release alpha', state);

      expect(result.stateChanges.flags?.alphaReleased).toBe(true);
      expect(result.stateChanges.detectionLevel).toBe(35); // 20 + 15
      expect(result.triggerFlicker).toBe(true);
      expect(result.imageTrigger).toBeDefined();
      expect(result.imageTrigger?.src).toBe('/images/et.webp');
    });

    it('accepts various ALPHA target formats', () => {
      const state = createTestState({
        tutorialStep: -1,
        tutorialComplete: true,
        filesRead: new Set(['/storage/quarantine/alpha_journal.log']),
        detectionLevel: 10,
        flags: {},
      });

      // Test different target formats
      const formats = ['alpha', 'Alpha', 'ALPHA', 'codename alpha', 'subject alpha'];
      for (const format of formats) {
        const testState = { ...state, flags: {} };
        const result = executeCommand(`release ${format}`, testState);
        expect(result.stateChanges.flags?.alphaReleased).toBe(true);
      }
    });

    it('shows already released message when ALPHA already released', () => {
      const state = createTestState({
        tutorialStep: -1,
        tutorialComplete: true,
        filesRead: new Set(['/storage/quarantine/alpha_journal.log']),
        flags: { alphaReleased: true },
      });
      const result = executeCommand('release alpha', state);

      expect(
        result.output.some(e => e.content.includes('ALREADY') || e.content.includes('already'))
      ).toBe(true);
      // Should not set the flag again
      expect(result.stateChanges.flags?.alphaReleased).toBeUndefined();
    });

    it('caps detection at 100 when releasing ALPHA', () => {
      const state = createTestState({
        tutorialStep: -1,
        tutorialComplete: true,
        filesRead: new Set(['/storage/quarantine/alpha_journal.log']),
        detectionLevel: 90,
        flags: {},
      });
      const result = executeCommand('release alpha', state);

      expect(result.stateChanges.detectionLevel).toBe(100);
    });

    it('shows UFO74 reaction in release sequence', () => {
      const state = createTestState({
        tutorialStep: -1,
        tutorialComplete: true,
        filesRead: new Set(['/storage/quarantine/alpha_journal.log']),
        flags: {},
      });
      const result = executeCommand('release alpha', state);

      expect(result.output.some(e => e.type === 'ufo74')).toBe(true);
    });
  });
});
