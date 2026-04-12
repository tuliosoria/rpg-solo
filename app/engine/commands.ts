// Command parser and execution engine for Terminal 1996
// Command handlers are split into domain modules under ./commands/

import { GameState, CommandResult, TerminalEntry, FileNode } from '../types';
import { resolvePath, getNode } from './filesystem';
import { MAX_DETECTION } from '../constants/detection';
import { MAX_WRONG_ATTEMPTS } from '../constants/gameplay';
import { MAX_COMMAND_INPUT_LENGTH } from '../constants/limits';

// Import utilities
import { createEntry, createEntryI18n, sanitizeCommandInput, parseCommand } from './commands/utils';

// Import interactive tutorial system
import { isInTutorialMode, processTutorialInput } from './commands/interactiveTutorial';

// Import Elusive Man leak system (conspiracy choice kept for save compat)
import { isPendingConspiracyChoice, processConspiracyChoice } from './elusiveMan';

// Import helpers used by executeCommand
import {
  checkSingularEvents,
  calculateHostilityIncrease,
  applyHostileFiltering,
  checkWanderingState,
  getIncognitoMessage,
  performDecryption,
} from './commands/helpers';

// Import the combined commands registry from domain modules
import { commands } from './commands/index';

// Re-export utilities for backward compatibility
export {
  generateEntryId,
  createEntry,
  createOutputEntries,
  createInvalidCommandResult,
  sanitizeCommandInput,
  parseCommand,
  calculateDelay,
  shouldFlicker,
  addHesitation,
  createUFO74Message,
} from './commands/utils';

// Re-export tutorial functions for backward compatibility
export {
  TUTORIAL_MESSAGES,
  generateBootSequence,
  getTutorialMessage,
  getFirstRunMessage,
  getTutorialTip,
  shouldShowTutorialTip,
} from './commands/tutorial';
export type { TutorialTipId } from './commands/tutorial';

// Re-export isInWarmupPhase for backward compatibility
export { isInWarmupPhase } from './commands/helpers';

// Main command executor
export function executeCommand(input: string, state: GameState): CommandResult {
  const sanitizedInput = sanitizeCommandInput(input, MAX_COMMAND_INPUT_LENGTH);
  if (sanitizedInput.wasTruncated) {
    const newAlertCounter = (state.legacyAlertCounter || 0) + 1;
    const nextDetection = Math.min(MAX_DETECTION, state.detectionLevel + 2);
    if (newAlertCounter >= 8) {
      return {
        output: [
          createEntry('error', ''),
          createEntry('error', '═══════════════════════════════════════════════════════════'),
          createEntryI18n(
            'error',
            'engine.commands.core.critical_input_length_threshold_exceeded',
            'CRITICAL: INPUT LENGTH THRESHOLD EXCEEDED'
          ),
          createEntry('error', '═══════════════════════════════════════════════════════════'),
          createEntry('error', ''),
          createEntryI18n(
            'error',
            'engine.invalidAttemptThreshold.lockdown',
            'SYSTEM LOCKDOWN INITIATED'
          ),
          createEntryI18n(
            'error',
            'engine.invalidAttemptThreshold.terminated',
            'SESSION TERMINATED'
          ),
          createEntry('error', ''),
        ],
        stateChanges: {
          isGameOver: true,
          gameOverReason: 'INVALID INPUT THRESHOLD',
          legacyAlertCounter: newAlertCounter,
        },
        triggerFlicker: true,
      };
    }

    if (nextDetection >= MAX_DETECTION) {
      return {
        output: [
          createEntryI18n(
            'error',
            'engine.commands.core.error_input_too_long',
            'ERROR: INPUT TOO LONG'
          ),
          createEntry('warning', ''),
          createEntry(
            'warning',
            `Maximum command length is ${MAX_COMMAND_INPUT_LENGTH} characters.`
          ),
          createEntry('error', ''),
          createEntry('error', '▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓'),
          createEntry('error', ''),
          createEntryI18n(
            'error',
            'engine.commands.core.intrusion_detected',
            '  INTRUSION DETECTED'
          ),
          createEntry('error', ''),
          createEntryI18n(
            'error',
            'engine.commands.core.your_connection_has_been_traced',
            '  Your connection has been traced.'
          ),
          createEntryI18n(
            'error',
            'engine.commands.core.security_protocols_have_been_dispatched',
            '  Security protocols have been dispatched.'
          ),
          createEntry('error', ''),
          createEntryI18n(
            'error',
            'engine.commands.core.session_terminated',
            '  >> SESSION TERMINATED <<'
          ),
          createEntry('error', ''),
          createEntry('error', '▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓'),
          createEntry('error', ''),
        ],
        stateChanges: {
          detectionLevel: nextDetection,
          legacyAlertCounter: newAlertCounter,
          isGameOver: true,
          gameOverReason: 'INTRUSION DETECTED - TRACED',
        },
        triggerFlicker: true,
      };
    }

    return {
      output: [
        createEntryI18n(
          'error',
          'engine.commands.core.error_input_too_long',
          'ERROR: INPUT TOO LONG'
        ),
        createEntry('warning', ''),
        createEntry('warning', `Maximum command length is ${MAX_COMMAND_INPUT_LENGTH} characters.`),
        createEntry('system', `   [Invalid attempts: ${newAlertCounter}/8]`),
      ],
      stateChanges: {
        detectionLevel: nextDetection,
        legacyAlertCounter: newAlertCounter,
      },
    };
  }

  const normalizedInput = sanitizedInput.value;
  const { command, args } = parseCommand(normalizedInput);

  // Check for game over
  if (state.isGameOver) {
    return {
      output: [
        createEntryI18n('error', 'engine.invalidAttemptThreshold.terminated', 'SESSION TERMINATED'),
      ],
      stateChanges: {},
    };
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // INTERACTIVE TUTORIAL - Gated input system
  // ═══════════════════════════════════════════════════════════════════════════
  if (isInTutorialMode(state)) {
    return processTutorialInput(normalizedInput, state, false);
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // TERRIBLE MISTAKE - Doom countdown check
  // ═══════════════════════════════════════════════════════════════════════════
  const traceSpikeWarning =
    state.traceSpikeActive && state.countdownActive && state.countdownTriggeredBy === 'trace_spike'
      ? createEntryI18n(
          'warning',
          'engine.commands.core.trace_spike_active',
          '[TRACE SPIKE ACTIVE]'
        )
      : null;

  // Track doom countdown decrement for later injection into result
  let doomCountdownDecremented = false;
  let newDoomCountdown = 0;

  if (state.tutorialComplete && state.terribleMistakeTriggered && state.sessionDoomCountdown > 0) {
    newDoomCountdown = state.sessionDoomCountdown - 1;
    doomCountdownDecremented = true;

    if (newDoomCountdown <= 0) {
      return {
        output: [
          createEntry('error', ''),
          createEntry('error', '▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓'),
          createEntry('error', ''),
          createEntryI18n(
            'error',
            'engine.commands.core.purge_protocol_complete',
            '                    PURGE PROTOCOL COMPLETE'
          ),
          createEntry('error', ''),
          createEntryI18n(
            'warning',
            'engine.commands.core.you_saw_what_you_should_not_have_seen',
            '          You saw what you should not have seen.'
          ),
          createEntryI18n(
            'warning',
            'engine.commands.core.the_knowledge_is_yours_to_keep',
            '          The knowledge is yours to keep.'
          ),
          createEntryI18n(
            'warning',
            'engine.commands.core.but_this_session_is_now_closed',
            '          But this session is now closed.'
          ),
          createEntry('error', ''),
          createEntry('error', '▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓'),
          createEntry('error', ''),
        ],
        stateChanges: {
          isGameOver: true,
          gameOverReason: 'PURGE PROTOCOL - FORBIDDEN KNOWLEDGE',
          sessionDoomCountdown: 0,
        },
        triggerFlicker: true,
        delayMs: 3000,
      };
    }

    // Continue with normal command using decremented countdown
    state = { ...state, sessionDoomCountdown: newDoomCountdown };
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // GOD MODE - Hidden developer commands for testing
  // ═══════════════════════════════════════════════════════════════════════════

  const lowerInput = normalizedInput.trim().toLowerCase();
  const createAlienPreviewResult = () => ({
    output: [
      createEntryI18n(
        'system',
        'engine.commands.core.alien_preview_armed',
        '═══ ALIEN PREVIEW ARMED ═══'
      ),
      createEntryI18n('output', 'engine.commands.core.detectionlevel_70', 'detectionLevel = 70'),
      createEntryI18n(
        'output',
        'engine.commands.core.forced_alien_silhouette_preview_active_for_12_seconds',
        'Forced alien silhouette preview active for 12 seconds.'
      ),
    ],
    stateChanges: {
      detectionLevel: 70,
      alienPreviewUntil: Date.now() + 12000,
    },
  });
  const createLeakReadyEvidenceResult = (title = '═══ LEAK-READY EVIDENCE ARMED ═══') => ({
    output: [
      createEntry('system', title),
      createEntryI18n(
        'output',
        'engine.commands.core.evidence_count_set_to_5_5',
        'Evidence count set to 10/10'
      ),
      createEntryI18n(
        'output',
        'engine.commands.core.leak_path_ready_use_leak_or_run_save_evidence_sh',
        'Leak path ready — use "leak" or run "save_evidence.sh".'
      ),
      createEntry('system', ''),
      createEntryI18n(
        'output',
        'engine.commands.core.use_god_save_to_trigger_the_blackout_phase_instead',
        'Use "god save" to trigger the blackout phase instead.'
      ),
    ],
    stateChanges: {
      evidenceCount: 10,
    },
  });

  if (lowerInput === 'god alien') {
    return createAlienPreviewResult();
  }

  if (lowerInput === 'god evidences') {
    return createLeakReadyEvidenceResult();
  }

  if (lowerInput === 'iddqd') {
    if (state.godMode) {
      return {
        output: [
          createEntry('system', ''),
          createEntryI18n(
            'warning',
            'engine.commands.core.god_mode_deactivated',
            '▓▓▓ GOD MODE DEACTIVATED ▓▓▓'
          ),
          createEntry('system', ''),
        ],
        stateChanges: { godMode: false },
      };
    }
    return {
      output: [
        createEntry('system', ''),
        createEntryI18n(
          'warning',
          'engine.commands.core.god_mode_activated',
          '▓▓▓ GOD MODE ACTIVATED ▓▓▓'
        ),
        createEntry('system', ''),
        createEntryI18n('output', 'engine.commands.core.available_commands', 'Available commands:'),
        createEntryI18n(
          'output',
          'engine.commands.core.god_help_show_all_god_mode_commands',
          '  god help     - Show all god mode commands'
        ),
        createEntryI18n(
          'output',
          'engine.commands.core.god_evidence_unlock_all_5_evidence_pieces',
          '  god evidence - Unlock all 10 evidence pieces'
        ),
        createEntryI18n(
          'output',
          'engine.commands.core.god_save_trigger_evidence_saved_blackout',
          '  god save     - Trigger evidence saved (→ blackout)'
        ),
        createEntryI18n(
          'output',
          'engine.commands.core.god_icq_jump_to_icq_phase',
          '  god icq      - Jump to ICQ phase'
        ),
        createEntryI18n(
          'output',
          'engine.commands.core.god_victory_jump_to_victory_screen',
          '  god victory  - Jump to victory screen'
        ),
        createEntryI18n(
          'output',
          'engine.commands.core.god_reset_reset_game_state',
          '  god reset    - Reset game state'
        ),
        createEntryI18n(
          'output',
          'engine.commands.core.god_status_show_current_game_state',
          '  god status   - Show current game state'
        ),
        createEntryI18n(
          'output',
          'engine.commands.core.god_alien_set_risk_to_70_and_force_alien_preview',
          '  god alien    - Set risk to 70 and force alien preview'
        ),
        createEntry('system', ''),
        createEntryI18n(
          'output',
          'engine.commands.core.type_iddqd_again_to_deactivate',
          'Type "iddqd" again to deactivate.'
        ),
      ],
      stateChanges: { godMode: true },
    };
  }

  // Handle god mode commands
  if (state.godMode && lowerInput.startsWith('god ')) {
    const godCmd = lowerInput.slice(4).trim();

    if (godCmd === 'help') {
      return {
        output: [
          createEntryI18n(
            'system',
            'engine.commands.core.god_mode_commands',
            '═══ GOD MODE COMMANDS ═══'
          ),
          createEntry('output', ''),
          createEntryI18n(
            'output',
            'engine.commands.core.god_help_show_this_help',
            'god help      - Show this help'
          ),
          createEntryI18n(
            'output',
            'engine.commands.core.god_evidence_discover_all_5_evidence_pieces',
            'god evidence  - Discover all 10 evidence pieces'
          ),
          createEntryI18n(
            'output',
            'engine.commands.core.god_save_set_evidencessaved_flag_triggers_blackout',
            'god save      - Set evidencesSaved flag (triggers blackout)'
          ),
          createEntryI18n(
            'output',
            'engine.commands.core.god_icq_jump_directly_to_icq_phase',
            'god icq       - Jump directly to ICQ phase'
          ),
          createEntryI18n(
            'output',
            'engine.commands.core.god_victory_jump_directly_to_victory_screen',
            'god victory   - Jump directly to victory screen'
          ),
          createEntryI18n(
            'output',
            'engine.commands.core.god_bad_jump_to_bad_ending_caught',
            'god bad       - Jump to bad ending (caught)'
          ),
          createEntryI18n(
            'output',
            'engine.commands.core.god_neutral_jump_to_neutral_ending_escaped',
            'god neutral   - Jump to neutral ending (escaped)'
          ),
          createEntryI18n(
            'output',
            'engine.commands.core.god_secret_jump_to_secret_ending_ufo74_identity',
            'god secret    - Jump to secret ending (UFO74 identity)'
          ),
          createEntryI18n(
            'output',
            'engine.commands.core.god_countdown_start_2_minute_countdown',
            'god countdown - Start 2-minute countdown'
          ),
          createEntryI18n(
            'output',
            'engine.commands.core.god_unlock_unlock_hidden_commands_passwords',
            'god unlock    - Unlock hidden commands & passwords'
          ),
          createEntryI18n(
            'output',
            'engine.commands.core.god_reset_reset_to_fresh_game_state',
            'god reset     - Reset to fresh game state'
          ),
          createEntryI18n(
            'output',
            'engine.commands.core.god_status_show_current_game_flags',
            'god status    - Show current game flags'
          ),
          createEntryI18n(
            'output',
            'engine.commands.core.god_stable_set_stability_to_100_detection_to_0',
            'god stable    - Set stability to 100, detection to 0'
          ),
          createEntryI18n(
            'output',
            'engine.commands.core.god_alien_set_detection_to_70_and_force_alien_preview',
            'god alien     - Set detection to 70 and force alien preview'
          ),
          createEntryI18n(
            'output',
            'engine.commands.core.god_doom_disable_doom_countdown',
            'god doom      - Disable doom countdown'
          ),
          createEntry('output', ''),
          createEntryI18n(
            'system',
            'engine.commands.core.type_iddqd_to_toggle_god_mode_off',
            'Type "iddqd" to toggle god mode off.'
          ),
        ],
        stateChanges: {},
      };
    }

    if (godCmd === 'evidence') {
      return createLeakReadyEvidenceResult('═══ ALL EVIDENCE UNLOCKED ═══');
    }

    if (godCmd === 'evidences') {
      return createLeakReadyEvidenceResult();
    }

    if (godCmd === 'save') {
      return {
        output: [
          createEntryI18n(
            'system',
            'engine.commands.core.evidence_saved',
            '═══ EVIDENCE SAVED ═══'
          ),
          createEntryI18n(
            'output',
            'engine.commands.core.evidencessaved_true',
            'evidencesSaved = true'
          ),
          createEntryI18n(
            'output',
            'engine.commands.core.blackout_transition_will_trigger_in_3_seconds',
            'Blackout transition will trigger in 3 seconds...'
          ),
        ],
        stateChanges: {
          evidencesSaved: true,
          flags: { ...state.flags, evidencesSaved: true },
        },
      };
    }

    if (godCmd === 'icq') {
      return {
        output: [
          createEntryI18n(
            'system',
            'engine.commands.core.jumping_to_icq_phase',
            '═══ JUMPING TO ICQ PHASE ═══'
          ),
          createEntryI18n(
            'output',
            'engine.commands.core.terminal_will_transition_to_icq_chat',
            'Terminal will transition to ICQ chat...'
          ),
        ],
        stateChanges: {
          evidencesSaved: true,
          icqPhase: true,
        },
        skipToPhase: 'icq' as const,
      };
    }

    if (godCmd === 'victory') {
      return {
        output: [
          createEntryI18n(
            'system',
            'engine.commands.core.jumping_to_victory',
            '═══ JUMPING TO VICTORY ═══'
          ),
        ],
        stateChanges: {
          gameWon: true,
          endingType: 'good',
        },
        skipToPhase: 'victory' as const,
      };
    }

    if (godCmd === 'reset') {
      return {
        output: [
          createEntryI18n(
            'system',
            'engine.commands.core.game_state_reset',
            '═══ GAME STATE RESET ═══'
          ),
          createEntryI18n(
            'output',
            'engine.commands.core.all_progress_cleared_reload_recommended',
            'All progress cleared. Reload recommended.'
          ),
        ],
        stateChanges: {
          evidenceCount: 0,
          evidencesSaved: false,
          icqPhase: false,
          gameWon: false,
          detectionLevel: 0,
          sessionStability: 100,
          flags: {},
          fileMutations: {},
          terribleMistakeTriggered: false,
          sessionDoomCountdown: 0,
        },
      };
    }

    if (godCmd === 'status') {
      const evidCount = state.evidenceCount || 0;
      return {
        output: [
          createEntryI18n('system', 'engine.commands.core.game_status', '═══ GAME STATUS ═══'),
          createEntry('output', `Evidence found: ${evidCount}/10`),
          createEntry('output', `evidencesSaved: ${state.evidencesSaved}`),
          createEntry('output', `icqPhase: ${state.icqPhase}`),
          createEntry('output', `gameWon: ${state.gameWon}`),
          createEntry('output', `detectionLevel: ${state.detectionLevel}`),
          createEntry('output', `sessionStability: ${state.sessionStability}`),
          createEntry('output', `terribleMistake: ${state.terribleMistakeTriggered}`),
          createEntry('output', `doomCountdown: ${state.sessionDoomCountdown}`),
          createEntry('output', `currentPath: ${state.currentPath}`),
          createEntry('output', `godMode: ${state.godMode}`),
        ],
        stateChanges: {},
      };
    }

    if (godCmd === 'stable') {
      return {
        output: [
          createEntryI18n(
            'system',
            'engine.commands.core.stability_maxed',
            '═══ STABILITY MAXED ═══'
          ),
          createEntryI18n(
            'output',
            'engine.commands.core.sessionstability_100',
            'sessionStability = 100'
          ),
          createEntryI18n('output', 'engine.commands.core.detectionlevel_0', 'detectionLevel = 0'),
        ],
        stateChanges: {
          sessionStability: 100,
          detectionLevel: 0,
        },
      };
    }

    if (godCmd === 'alien') {
      return createAlienPreviewResult();
    }

    if (godCmd === 'doom') {
      return {
        output: [
          createEntryI18n('system', 'engine.commands.core.doom_disabled', '═══ DOOM DISABLED ═══'),
          createEntryI18n(
            'output',
            'engine.commands.core.terriblemistaketriggered_false',
            'terribleMistakeTriggered = false'
          ),
          createEntryI18n(
            'output',
            'engine.commands.core.sessiondoomcountdown_0',
            'sessionDoomCountdown = 0'
          ),
        ],
        stateChanges: {
          terribleMistakeTriggered: false,
          sessionDoomCountdown: 0,
        },
      };
    }

    // New ending shortcuts
    if (godCmd === 'bad') {
      return {
        output: [
          createEntryI18n(
            'system',
            'engine.commands.core.jumping_to_bad_ending',
            '═══ JUMPING TO BAD ENDING ═══'
          ),
        ],
        stateChanges: {
          isGameOver: true,
          gameOverReason: 'GOD MODE - BAD ENDING',
          endingType: 'bad',
        },
        skipToPhase: 'bad_ending' as const,
      };
    }

    if (godCmd === 'neutral') {
      return {
        output: [
          createEntryI18n(
            'system',
            'engine.commands.core.jumping_to_neutral_ending',
            '═══ JUMPING TO NEUTRAL ENDING ═══'
          ),
        ],
        stateChanges: {
          isGameOver: true,
          gameOverReason: 'GOD MODE - NEUTRAL ENDING',
          endingType: 'neutral',
        },
        skipToPhase: 'neutral_ending' as const,
      };
    }

    if (godCmd === 'secret') {
      return {
        output: [
          createEntryI18n(
            'system',
            'engine.commands.core.jumping_to_secret_ending',
            '═══ JUMPING TO SECRET ENDING ═══'
          ),
        ],
        stateChanges: {
          ufo74SecretDiscovered: true,
          endingType: 'secret',
          isGameOver: true,
        },
        skipToPhase: 'secret_ending' as const,
      };
    }

    if (godCmd === 'countdown') {
      return {
        output: [
          createEntryI18n(
            'system',
            'engine.commands.core.countdown_activated',
            '═══ COUNTDOWN ACTIVATED ═══'
          ),
          createEntryI18n(
            'output',
            'engine.commands.core.you_have_2_minutes_before_they_trace_you',
            'You have 2 minutes before they trace you.'
          ),
        ],
        stateChanges: {
          countdownActive: true,
          countdownEndTime: Date.now() + 2 * 60 * 1000, // 2 minutes
        },
      };
    }

    if (godCmd === 'unlock') {
      return {
        output: [
          createEntryI18n(
            'system',
            'engine.commands.core.all_hidden_features_unlocked',
            '═══ ALL HIDDEN FEATURES UNLOCKED ═══'
          ),
          createEntryI18n(
            'output',
            'engine.commands.core.hidden_commands_disconnect_scan_decode',
            '✓ Hidden commands: disconnect, scan, decode'
          ),
          createEntryI18n(
            'output',
            'engine.commands.core.password_found_varginha1996',
            '✓ Password found: varginha1996'
          ),
          createEntryI18n('output', 'engine.commands.core.admin_flag_set', '✓ Admin flag set'),
        ],
        stateChanges: {
          hiddenCommandsDiscovered: new Set(['disconnect', 'scan', 'decode']),
          passwordsFound: new Set(['varginha1996']),
          flags: { ...state.flags, adminUnlocked: true },
        },
      };
    }

    return {
      output: [
        createEntry('error', `Unknown god command: ${godCmd}`),
        createEntryI18n(
          'output',
          'engine.commands.core.type_god_help_for_available_commands',
          'Type "god help" for available commands.'
        ),
      ],
      stateChanges: {},
    };
  }

  // Check for pending decrypt answer
  if (state.pendingDecryptFile) {
    const filePath = state.pendingDecryptFile;

    // Cancel decryption if user types cancel
    if (normalizedInput.toLowerCase().trim() === 'cancel') {
      return {
        output: [
          createEntryI18n(
            'system',
            'engine.commands.core.decryption_cancelled',
            'Decryption cancelled.'
          ),
        ],
        stateChanges: {
          pendingDecryptFile: undefined,
        },
      };
    }

    const node = getNode(filePath, state);

    if (node && node.type === 'file') {
      const file = node as FileNode;
      if (file.securityQuestion) {
        const answer = normalizedInput.trim().toLowerCase();
        const validAnswers = file.securityQuestion.answers.map(a => a.toLowerCase());

        if (validAnswers.includes(answer)) {
          // Correct answer - perform decryption
          if (!state.tutorialComplete) {
            return {
              output: [
                createEntryI18n(
                  'system',
                  'engine.commands.core.decryption_unavailable_during_transmission',
                  'Decryption unavailable during transmission.'
                ),
              ],
              stateChanges: {},
            };
          }
          return performDecryption(filePath, file, state);
        } else {
          // Wrong answer
          if (!state.tutorialComplete) {
            return {
              output: [
                createEntryI18n(
                  'error',
                  'engine.commands.core.authentication_failed',
                  'AUTHENTICATION FAILED'
                ),
                createEntry('system', ''),
                createEntry('ufo74', `[UFO74]: ${file.securityQuestion.hint}`),
                createEntry('system', ''),
                createEntryI18n(
                  'system',
                  'engine.commands.core.enter_answer_or_type_cancel_to_abort',
                  'Enter answer or type "cancel" to abort:'
                ),
              ],
              stateChanges: {},
              delayMs: 500,
            };
          }

          const newAlertCounter = state.legacyAlertCounter + 1;

          if (newAlertCounter >= 8) {
            return {
              output: [
                createEntryI18n(
                  'error',
                  'engine.commands.core.authentication_failed',
                  'AUTHENTICATION FAILED'
                ),
                createEntry('error', ''),
                createEntry('error', '═══════════════════════════════════════════════════════════'),
                createEntryI18n(
                  'error',
                  'engine.commands.core.critical_security_threshold_exceeded',
                  'CRITICAL: SECURITY THRESHOLD EXCEEDED'
                ),
                createEntry('error', '═══════════════════════════════════════════════════════════'),
                createEntry('error', ''),
                createEntryI18n(
                  'error',
                  'engine.invalidAttemptThreshold.lockdown',
                  'SYSTEM LOCKDOWN INITIATED'
                ),
              ],
              stateChanges: {
                isGameOver: true,
                gameOverReason: 'SECURITY LOCKDOWN - FAILED AUTHENTICATION',
                pendingDecryptFile: undefined,
              },
              triggerFlicker: true,
              delayMs: 2000,
            };
          }

          return {
            output: [
              createEntryI18n(
                'error',
                'engine.commands.core.authentication_failed',
                'AUTHENTICATION FAILED'
              ),
              createEntry('warning', `WARNING: Invalid attempts: ${newAlertCounter}/8`),
              createEntry('system', ''),
              createEntry('ufo74', `[UFO74]: ${file.securityQuestion.hint}`),
              createEntry('system', ''),
              createEntryI18n(
                'system',
                'engine.commands.core.enter_answer_or_type_cancel_to_abort',
                'Enter answer or type "cancel" to abort:'
              ),
            ],
            stateChanges: {
              legacyAlertCounter: newAlertCounter,
              detectionLevel: state.detectionLevel + 5,
            },
            delayMs: 500,
          };
        }
      }
    }
  }

  // Check for lockdown
  if (state.legacyAlertCounter >= MAX_WRONG_ATTEMPTS) {
    return {
      output: [
        createEntryI18n('error', 'engine.commands.core.system_lockdown', 'SYSTEM LOCKDOWN'),
        createEntryI18n(
          'error',
          'engine.commands.core.no_further_commands_accepted',
          'NO FURTHER COMMANDS ACCEPTED'
        ),
      ],
      stateChanges: {
        isGameOver: true,
        gameOverReason: 'LOCKDOWN',
      },
    };
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // CONSPIRACY FILES CHOICE (legacy — kept for save compatibility)
  // ═══════════════════════════════════════════════════════════════════════════
  if (isPendingConspiracyChoice(state)) {
    return processConspiracyChoice(normalizedInput, state);
  }

  // Empty command
  if (!command) {
    return { output: [], stateChanges: {} };
  }

  // Handle "override protocol" as special case
  if (command === 'override') {
    if (!state.tutorialComplete) {
      return {
        output: [
          createEntryI18n(
            'system',
            'engine.commands.core.override_protocol_unavailable_during_transmission',
            'Override protocol unavailable during transmission.'
          ),
        ],
        stateChanges: {},
      };
    }
    return commands.override(args, state);
  }

  // Find command handler
  const handler = commands[command];

  // Catch common typo: "cd.." without a space
  if (!handler && (command === 'cd..' || command === 'cd...' || input.startsWith('cd..'))) {
    return {
      output: [
        createEntryI18n(
          'ufo74',
          'engine.commands.core.ufo74_hey_careful_to_go_back_use_cd_with_a_space_after_cd',
          '[UFO74]: hey careful, to go back use cd .. (with a space after cd)'
        ),
      ],
      stateChanges: {},
    };
  }

  if (!handler) {
    // Increment legacy alert counter for invalid commands
    if (!state.tutorialComplete) {
      const output: TerminalEntry[] = [...getCommandTip(command, args, state)];
      return { output, stateChanges: {} };
    }

    const newAlertCounter = state.legacyAlertCounter + 1;
    const nextDetection = Math.min(MAX_DETECTION, state.detectionLevel + 2);

    // Check if this triggers game over
    if (newAlertCounter >= 8) {
      return {
        output: [
          createEntry('error', ''),
          createEntry('error', '═══════════════════════════════════════════════════════════'),
          createEntryI18n(
            'error',
            'engine.invalidAttemptThreshold.exceeded',
            'CRITICAL: INVALID ATTEMPT THRESHOLD EXCEEDED'
          ),
          createEntry('error', '═══════════════════════════════════════════════════════════'),
          createEntry('error', ''),
          createEntryI18n(
            'error',
            'engine.invalidAttemptThreshold.lockdown',
            'SYSTEM LOCKDOWN INITIATED'
          ),
          createEntryI18n(
            'error',
            'engine.invalidAttemptThreshold.terminated',
            'SESSION TERMINATED'
          ),
          createEntry('error', ''),
        ],
        stateChanges: {
          isGameOver: true,
          gameOverReason: 'INVALID ATTEMPT THRESHOLD',
          legacyAlertCounter: newAlertCounter,
        },
        triggerFlicker: true,
      };
    }

    if (nextDetection >= MAX_DETECTION) {
      return {
        output: [
          createEntry('error', ''),
          createEntry('error', '▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓'),
          createEntry('error', ''),
          createEntryI18n(
            'error',
            'engine.commands.core.intrusion_detected',
            '  INTRUSION DETECTED'
          ),
          createEntry('error', ''),
          createEntryI18n(
            'error',
            'engine.commands.core.your_connection_has_been_traced',
            '  Your connection has been traced.'
          ),
          createEntryI18n(
            'error',
            'engine.commands.core.security_protocols_have_been_dispatched',
            '  Security protocols have been dispatched.'
          ),
          createEntry('error', ''),
          createEntryI18n(
            'error',
            'engine.commands.core.session_terminated',
            '  >> SESSION TERMINATED <<'
          ),
          createEntry('error', ''),
          createEntry('error', '▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓'),
          createEntry('error', ''),
        ],
        stateChanges: {
          isGameOver: true,
          gameOverReason: 'INTRUSION DETECTED - TRACED',
          legacyAlertCounter: newAlertCounter,
          detectionLevel: nextDetection,
        },
        triggerFlicker: true,
      };
    }

    // Provide helpful tips based on what the player might have been trying to do
    const tips = getCommandTip(command, args, state);

    // Build output with clear risk warning
    const output: TerminalEntry[] = [
      ...tips,
      createEntry('warning', ''),
      createEntryI18n(
        'warning',
        'engine.invalidCommand.riskIncreased',
        '⚠ RISK INCREASED: Invalid commands draw system attention.'
      ),
      createEntry('system', `   [Invalid attempts: ${newAlertCounter}/8]`),
    ];

    // After 3 wrong commands, UFO74 steps in to help
    if (newAlertCounter === 3) {
      output.push(createEntry('system', ''));
      output.push(
        createEntryI18n(
          'ufo74',
          'engine.commands.core.ufo74_hey_kid_youre_fumbling_let_me_help',
          'UFO74: hey kid, youre fumbling. let me help.'
        )
      );
      output.push(
        createEntryI18n(
          'ufo74',
          'engine.commands.core.ufo74_try_these_ls_to_see_files_cd_dir_to_move_open_file_to_',
          'UFO74: try these: "ls" to see files, "cd <dir>" to move, "open <file>" to read.'
        )
      );
      output.push(
        createEntryI18n(
          'ufo74',
          'engine.commands.core.ufo74_type_help_if_youre_lost',
          'UFO74: type "help" if youre lost.'
        )
      );
    } else if (newAlertCounter >= 5) {
      output.push(createEntry('system', ''));
      output.push(
        createEntryI18n(
          'ufo74',
          'engine.commands.core.ufo74_careful_too_many_mistakes_and_theyll_lock_you_out',
          'UFO74: careful. too many mistakes and theyll lock you out.'
        )
      );
    }

    return {
      output,
      stateChanges: {
        detectionLevel: nextDetection,
        legacyAlertCounter: newAlertCounter,
      },
    };
  }

  const result = handler(args, state);

  // Clear pending tree confirmation when any non-tree command is executed
  if (command !== 'tree' && state.pendingTreeConfirm) {
    result.stateChanges.pendingTreeConfirm = false;
  }

  if (traceSpikeWarning) {
    result.output = [traceSpikeWarning, ...result.output];
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // SESSION COMMAND COUNTER
  // ═══════════════════════════════════════════════════════════════════════════
  result.stateChanges.sessionCommandCount = (state.sessionCommandCount || 0) + 1;

  const commandCount = (state.sessionCommandCount || 0) + 1;
  if (commandCount >= 30 && !state.flags['earlyWindowPassed']) {
    result.stateChanges.flags = {
      ...result.stateChanges.flags,
      ...state.flags,
      earlyWindowPassed: true,
    };
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // SINGULAR EVENTS
  // ═══════════════════════════════════════════════════════════════════════════
  const stateWithUpdatedDetection = {
    ...state,
    detectionLevel: result.stateChanges.detectionLevel ?? state.detectionLevel,
  };
  const singularEvent = state.tutorialComplete
    ? checkSingularEvents(stateWithUpdatedDetection, command, args)
    : null;
  if (singularEvent) {
    result.output = [...result.output, ...singularEvent.output];
    result.stateChanges = {
      ...result.stateChanges,
      ...singularEvent.stateChanges,
    };
    if (singularEvent.delayMs) {
      result.delayMs = (result.delayMs || 0) + singularEvent.delayMs;
    }
    if (singularEvent.triggerFlicker) {
      result.triggerFlicker = true;
    }
    if (singularEvent.triggerTuringTest) {
      result.triggerTuringTest = true;
    }
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // SYSTEM HOSTILITY
  // ═══════════════════════════════════════════════════════════════════════════
  if (state.tutorialComplete) {
    const hostilityIncrease = calculateHostilityIncrease(state, command);
    if (hostilityIncrease > 0) {
      result.stateChanges.systemHostilityLevel = Math.min(
        (state.systemHostilityLevel || 0) + hostilityIncrease,
        5
      );
    }
  }

  const currentHostility =
    result.stateChanges.systemHostilityLevel ?? state.systemHostilityLevel ?? 0;
  if (currentHostility >= 3) {
    result.output = applyHostileFiltering(result.output, currentHostility);

    const triggered = state.singularEventsTriggered || new Set<string>();
    if (!triggered.has('ufo74_risk_corruption_warning')) {
      const newTriggered = new Set(triggered);
      newTriggered.add('ufo74_risk_corruption_warning');
      result.stateChanges.singularEventsTriggered = new Set([
        ...(result.stateChanges.singularEventsTriggered || triggered),
        'ufo74_risk_corruption_warning',
      ]);
      result.output = [
        ...result.output,
        createEntryI18n(
          'ufo74',
          'engine.commands.core.ufo74_hey_kid_risk_is_getting_too_high',
          'UFO74: hey kid, risk is getting too high.'
        ),
        createEntryI18n(
          'ufo74',
          'engine.commands.core.ufo74_use_wait_to_lay_low_and_bring_the_risk_down',
          'UFO74: use "wait" to lay low and bring the risk down.'
        ),
      ];
    }
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // DOOM COUNTDOWN
  // ═══════════════════════════════════════════════════════════════════════════
  if (doomCountdownDecremented) {
    result.stateChanges.sessionDoomCountdown = newDoomCountdown;

    if (newDoomCountdown > 0) {
      const countdownWarning =
        newDoomCountdown <= 3
          ? [
              createEntry('error', ''),
              createEntry('error', `▓▓▓ PURGE IN ${newDoomCountdown} ▓▓▓`),
              createEntry('error', ''),
            ]
          : [
              createEntry('warning', ''),
              createEntry('warning', `[PURGE COUNTDOWN: ${newDoomCountdown}]`),
            ];

      result.output = [...result.output, ...countdownWarning];
    }
  }

  // Check if we should add an incognito message after reading important files
  if (command === 'open' || command === 'decrypt') {
    const wasSuccessfulRead = !result.output.some(entry => entry.type === 'error');

    if (wasSuccessfulRead) {
      const filePath = args.length > 0 ? resolvePath(args[0], state.currentPath) : undefined;

      const isEncryptedAndLocked = false;
      let isFirstUnstable = false;
      if (filePath) {
        const node = getNode(filePath, state);
        if (node && node.type === 'file') {
          const file = node as FileNode;

          if (file.status === 'unstable' && !state.flags.seenUnstableWarning) {
            isFirstUnstable = true;
            result.stateChanges.flags = {
              ...state.flags,
              ...result.stateChanges.flags,
              seenUnstableWarning: true,
            };
          }
        }
      }

      const notices = isEncryptedAndLocked
        ? []
        : result.output.filter(
            entry =>
              entry.type === 'notice' &&
              (entry.content.includes('NOTICE:') ||
                entry.content.includes('MEMO FLAG:') ||
                entry.content.includes('SYSTEM:'))
          );

      const alreadyHasPendingMessages =
        result.pendingUfo74Messages && result.pendingUfo74Messages.length > 0;

      const incognitoMessage = alreadyHasPendingMessages
        ? null
        : getIncognitoMessage(
            {
              ...state,
              evidenceCount: state.evidenceCount,
              incognitoMessageCount: state.incognitoMessageCount || 0,
              lastIncognitoTrigger: state.lastIncognitoTrigger || 0,
            } as GameState,
            filePath,
            notices,
            isEncryptedAndLocked,
            isFirstUnstable
          );

      if (incognitoMessage) {
        result.pendingUfo74Messages = [...(result.pendingUfo74Messages || []), ...incognitoMessage];
        result.stateChanges.incognitoMessageCount = (state.incognitoMessageCount || 0) + 1;
        result.stateChanges.lastIncognitoTrigger = Date.now();
      }
    }
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // WANDERING DETECTION
  // ═══════════════════════════════════════════════════════════════════════════
  const wanderingCheck = state.tutorialComplete
    ? checkWanderingState(state, command, args, result)
    : null;
  if (wanderingCheck) {
    if (wanderingCheck.notices.length > 0) {
      result.pendingUfo74Messages = [
        ...(result.pendingUfo74Messages || []),
        ...wanderingCheck.notices,
      ];
    }
    result.stateChanges = {
      ...result.stateChanges,
      ...wanderingCheck.stateChanges,
    };
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // DETECTION STATE WARNINGS
  // ═══════════════════════════════════════════════════════════════════════════
  const rawDetection = result.stateChanges.detectionLevel ?? state.detectionLevel;
  const boundedDetection = Math.min(MAX_DETECTION, Math.max(0, rawDetection));

  if (result.stateChanges.detectionLevel !== undefined || rawDetection !== boundedDetection) {
    result.stateChanges.detectionLevel = boundedDetection;
  }

  const newDetection = boundedDetection;
  const prevDetection = Math.min(MAX_DETECTION, Math.max(0, state.detectionLevel));

  if (state.tutorialComplete && newDetection >= 50 && newDetection < 70 && prevDetection < 50) {
    result.output = [
      ...result.output,
      createEntry('system', ''),
      createEntry('warning', '────────────────────────────────────────'),
      createEntryI18n('warning', 'engine.commands.core.status_suspicious', '  STATUS: SUSPICIOUS'),
      createEntryI18n(
        'warning',
        'engine.commands.core.system_monitoring_increased',
        '  System monitoring increased.'
      ),
      createEntry('warning', '────────────────────────────────────────'),
    ];
  }

  if (state.tutorialComplete && newDetection >= 70 && newDetection < 85 && prevDetection < 70) {
    result.output = [
      ...result.output,
      createEntry('system', ''),
      createEntry('error', '════════════════════════════════════════'),
      createEntryI18n('error', 'engine.commands.core.status_alert', '  STATUS: ALERT'),
      createEntryI18n(
        'warning',
        'engine.commands.core.active_countermeasures_online',
        '  Active countermeasures online.'
      ),
      createEntry('error', '════════════════════════════════════════'),
      createEntry('system', ''),
      createEntryI18n(
        'ufo74',
        'engine.commands.core.careful_theyre_paying_attention_now',
        '>> careful. theyre paying attention now. <<'
      ),
    ];
  }

  if (state.tutorialComplete && newDetection >= 85 && newDetection < 90 && prevDetection < 85) {
    result.output = [
      ...result.output,
      createEntry('system', ''),
      createEntry('error', '▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓'),
      createEntryI18n('error', 'engine.commands.core.status_critical', '  STATUS: CRITICAL'),
      createEntryI18n(
        'error',
        'engine.commands.core.trace_protocols_active',
        '  Trace protocols active.'
      ),
      createEntry('error', '▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓'),
      createEntry('system', ''),
      createEntryI18n(
        'ufo74',
        'engine.commands.core.stop_youre_about_to_get_burned',
        '>> STOP. youre about to get burned. <<'
      ),
      createEntryI18n(
        'ufo74',
        'engine.commands.core.use_wait_to_lay_low_you_have_limited_uses',
        '>> use "wait" to lay low. you have limited uses. <<'
      ),
    ];
    result.triggerFlicker = true;
    result.stateChanges.avatarExpression = 'scared';
  }

  if (state.tutorialComplete && newDetection >= 90 && prevDetection < 90) {
    result.output = [
      ...result.output,
      createEntry('system', ''),
      createEntry('error', '▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓'),
      createEntryI18n(
        'error',
        'engine.commands.core.status_imminent_detection',
        '  STATUS: IMMINENT DETECTION'
      ),
      createEntryI18n(
        'error',
        'engine.commands.core.countermeasures_locking_on',
        '  Countermeasures locking on.'
      ),
      createEntry('error', '▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓'),
      createEntry('system', ''),
      createEntryI18n(
        'ufo74',
        'engine.commands.core.emergency_type_hide_now_one_chance',
        '>> EMERGENCY. type "hide" NOW. one chance. <<'
      ),
    ];
    result.stateChanges.hideAvailable = true;
    result.triggerFlicker = true;
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // MAX DETECTION GAME OVER
  // ═══════════════════════════════════════════════════════════════════════════
  if (
    state.tutorialComplete &&
    newDetection >= MAX_DETECTION &&
    !result.stateChanges.isGameOver &&
    !result.stateChanges.evidencesSaved
  ) {
    result.output = [
      createEntry('error', ''),
      createEntry('error', '▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓'),
      createEntry('error', ''),
      createEntryI18n('error', 'engine.commands.core.intrusion_detected', '  INTRUSION DETECTED'),
      createEntry('error', ''),
      createEntryI18n(
        'error',
        'engine.commands.core.your_connection_has_been_traced',
        '  Your connection has been traced.'
      ),
      createEntryI18n(
        'error',
        'engine.commands.core.security_protocols_have_been_dispatched',
        '  Security protocols have been dispatched.'
      ),
      createEntry('error', ''),
      createEntryI18n(
        'error',
        'engine.commands.core.session_terminated',
        '  >> SESSION TERMINATED <<'
      ),
      createEntry('error', ''),
      createEntry('error', '▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓'),
      createEntry('error', ''),
    ];
    result.stateChanges.isGameOver = true;
    result.stateChanges.gameOverReason = 'INTRUSION DETECTED - TRACED';
    result.triggerFlicker = true;
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // WRONG ATTEMPTS GAME OVER
  // ═══════════════════════════════════════════════════════════════════════════
  const newWrongAttempts = result.stateChanges.wrongAttempts ?? state.wrongAttempts ?? 0;
  if (newWrongAttempts >= 8 && !result.stateChanges.isGameOver) {
    result.output = [
      createEntry('error', ''),
      createEntry('error', '▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓'),
      createEntry('error', ''),
      createEntryI18n('error', 'engine.commands.core.terminal_lockout', '  TERMINAL LOCKOUT'),
      createEntry('error', ''),
      createEntryI18n(
        'error',
        'engine.commands.core.too_many_failed_authentication_attempts',
        '  Too many failed authentication attempts.'
      ),
      createEntryI18n(
        'error',
        'engine.commands.core.session_terminated_by_security_protocol',
        '  Session terminated by security protocol.'
      ),
      createEntry('error', ''),
      createEntry('error', '▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓'),
      createEntry('error', ''),
    ];
    result.stateChanges.isGameOver = true;
    result.stateChanges.gameOverReason = 'TERMINAL LOCKOUT - AUTHENTICATION FAILURE';
    result.triggerFlicker = true;
  }

  return result;
}

// Generate helpful tips for unknown commands — all delivered as UFO74 voice
function getCommandTip(command: string, args: string[], state: GameState): TerminalEntry[] {
  if (command === 'dir' || command === 'list' || command === 'show') {
    return [
      createEntry('system', ''),
      createEntryI18n(
        'ufo74',
        'engine.commands.core.ufo74_try_ls_to_list_directory_contents',
        '[UFO74]: try "ls" to list directory contents.'
      ),
      createEntry('system', ''),
    ];
  }

  if (
    command.includes('/') ||
    command.endsWith('/') ||
    [
      'storage',
      'ops',
      'comms',
      'admin',
      'tmp',
      'assets',
      'quarantine',
      'prato',
      'exo',
      'psi',
    ].includes(command)
  ) {
    return [
      createEntry('system', ''),
      createEntry('ufo74', `[UFO74]: you cant just type a path. use: cd ${command}`),
      createEntry('system', ''),
    ];
  }

  if (
    command.includes('.') ||
    command.endsWith('.txt') ||
    command.endsWith('.log') ||
    command.endsWith('.enc') ||
    command.endsWith('.dat') ||
    command.endsWith('.red') ||
    command.endsWith('.meta')
  ) {
    return [
      createEntry('system', ''),
      createEntry('ufo74', `[UFO74]: to read a file, use: open ${command}`),
      createEntry('system', ''),
    ];
  }

  if (
    command === 'read' ||
    command === 'view' ||
    command === 'cat' ||
    command === 'type' ||
    command === 'more'
  ) {
    const target = args[0] || '<filename>';
    if (args[0]) {
      const filePath = resolvePath(args[0], state.currentPath);
      const node = getNode(filePath, state);
      if (node && node.type === 'dir') {
        return [
          createEntry('error', `ERROR: ${args[0]} is a directory`),
          createEntry('system', `  HINT: '${command}' is used for files only.`),
          createEntry('system', `  To explore a directory use 'cd ${args[0]}' then 'ls'.`),
          createEntry('system', ''),
          createEntry('ufo74', `[UFO74]: thats a directory kid. use: ls ${args[0]}`),
        ];
      }
    }
    return [
      createEntry('system', ''),
      createEntry('ufo74', `[UFO74]: wrong command kid. use: open ${target}`),
      createEntry('system', ''),
    ];
  }

  if (command === 'quit' || command === 'exit' || command === 'logout' || command === 'bye') {
    return [
      createEntry('system', ''),
      createEntryI18n(
        'ufo74',
        'engine.commands.core.ufo74_press_esc_to_exit_or_type_save_first_if_you_want_to_ke',
        '[UFO74]: press [ESC] to exit. or type "save" first if you want to keep your progress.'
      ),
      createEntry('system', ''),
    ];
  }

  if (command === 'unlock' || command === 'access' || command === 'sudo' || command === 'admin') {
    return [
      createEntry('system', ''),
      createEntryI18n(
        'ufo74',
        'engine.commands.core.ufo74_you_need_the_override_protocol_for_that_dangerous_stuf',
        '[UFO74]: you need the override protocol for that. dangerous stuff.'
      ),
      createEntry('system', ''),
    ];
  }

  if (command === 'back' || command === 'up' || command === '..') {
    return [
      createEntry('system', ''),
      createEntryI18n(
        'ufo74',
        'engine.commands.core.ufo74_use_cd_to_go_to_parent_directory',
        '[UFO74]: use "cd .." to go to parent directory.'
      ),
      createEntry('system', ''),
    ];
  }

  if (command === 'info' || command === 'about' || command === 'whoami' || command === 'who') {
    return [
      createEntry('system', ''),
      createEntryI18n(
        'ufo74',
        'engine.commands.core.ufo74_try_status_or_help_kid',
        '[UFO74]: try "status" or "help" kid.'
      ),
      createEntry('system', ''),
    ];
  }

  return [
    createEntry('system', ''),
    createEntry('system', `Command not recognized: ${command}`),
    createEntry('system', ''),
    createEntryI18n(
      'ufo74',
      'engine.commands.core.ufo74_type_help_to_see_what_you_can_do',
      '[UFO74]: type "help" to see what you can do.'
    ),
    createEntry('system', ''),
  ];
}
