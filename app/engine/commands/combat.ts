// Combat/confrontation commands: override, trace

import { GameState, TerminalEntry } from '../../types';
import { createSeededRng, seededRandomInt } from '../rng';
import { DETECTION_THRESHOLDS, MAX_DETECTION } from '../../constants/detection';
import { shouldSuppressPenalties } from '../../constants/atmosphere';
import { createEntry, createEntryI18n, createInvalidCommandResult } from './utils';
import { applyDetectionVariance } from './helpers';
import { saveCheckpoint } from '../../storage/saves';
import { translateStatic } from '../../i18n';
import type { CommandRegistry } from './types';

export const combatCommands: CommandRegistry = {
  trace: (args, state) => {
    const output: TerminalEntry[] = [
      createEntryI18n(
        'system',
        'engine.commands.combat.initiating_trace_protocol',
        'Initiating trace protocol...'
      ),
      createEntry('output', ''),
    ];

    // Reveal some structure based on access level
    if (state.accessLevel < 2) {
      output.push(
        createEntryI18n('output', 'engine.commands.combat.trace_result', 'TRACE RESULT:')
      );
      output.push(
        createEntryI18n(
          'output',
          'engine.commands.combat.storage_accessible',
          '  /storage/ — ACCESSIBLE'
        )
      );
      output.push(
        createEntryI18n('output', 'engine.commands.combat.ops_partial', '  /ops/ — PARTIAL')
      );
      output.push(
        createEntryI18n(
          'output',
          'engine.commands.combat.comms_accessible',
          '  /comms/ — ACCESSIBLE'
        )
      );
      output.push(
        createEntryI18n(
          'output',
          'engine.commands.combat.admin_high_priority',
          '  /admin/ — HIGH PRIORITY'
        )
      );
      output.push(createEntry('warning', ''));
      output.push(
        createEntryI18n(
          'warning',
          'engine.commands.combat.warning_trace_logged_detection_increased',
          'WARNING: Trace logged. Detection increased.'
        )
      );
    } else {
      output.push(
        createEntryI18n('output', 'engine.commands.combat.trace_result', 'TRACE RESULT:')
      );
      output.push(
        createEntryI18n(
          'output',
          'engine.commands.combat.storage_assets_2_files',
          '  /storage/assets/ — 2 files'
        )
      );
      output.push(
        createEntryI18n(
          'output',
          'engine.commands.combat.storage_quarantine_3_files',
          '  /storage/quarantine/ — 3 files'
        )
      );
      output.push(
        createEntryI18n(
          'output',
          'engine.commands.combat.ops_prato_1_file',
          '  /ops/prato/ — 1 file'
        )
      );
      output.push(
        createEntryI18n(
          'output',
          'engine.commands.combat.ops_exo_2_files_elevated',
          '  /ops/exo/ — 2 files [ELEVATED]'
        )
      );
      output.push(
        createEntryI18n(
          'output',
          'engine.commands.combat.comms_psi_2_files_signal',
          '  /comms/psi/ — 2 files [SIGNAL]'
        )
      );
      output.push(
        createEntryI18n(
          'output',
          'engine.commands.combat.admin_7_files_high_priority',
          '  /admin/ — 7 files [HIGH PRIORITY]'
        )
      );
      output.push(createEntry('output', ''));
      output.push(
        createEntryI18n(
          'notice',
          'engine.commands.combat.notice_administrative_access_may_be_obtainable',
          'NOTICE: Administrative access may be obtainable.'
        )
      );
    }

    const stateChanges: Partial<GameState> = {
      detectionLevel: state.detectionLevel + applyDetectionVariance(state, 'trace', 10), // was 15, reduced for pacing
      accessLevel: Math.min(state.accessLevel + 1, 3),
      sessionStability: state.sessionStability - 5,
    };

    if (!state.tutorialComplete) {
      delete stateChanges.detectionLevel;
      delete stateChanges.sessionStability;
    }

    return {
      output,
      stateChanges,
      triggerFlicker: true,
      delayMs: 1800,
    };
  },

  override: (args, state) => {
    // Requires: "override protocol <PASSWORD>"
    if (args.length === 0 || args[0].toLowerCase() !== 'protocol') {
      // Invalid override syntax - treat as invalid command
      return createInvalidCommandResult(state, '');
    }

    // Check if password was provided
    if (args.length < 2) {
      const stateChanges: Partial<GameState> = {
        detectionLevel: state.detectionLevel + 5,
      };

      if (!state.tutorialComplete) {
        delete stateChanges.detectionLevel;
      }

      return {
        output: [
          createEntryI18n(
            'system',
            'engine.commands.combat.initiating_protocol_override',
            'Initiating protocol override...'
          ),
          createEntry('error', ''),
          createEntryI18n('error', 'engine.commands.chat.access_denied', 'ACCESS DENIED'),
          createEntry('error', ''),
          createEntryI18n(
            'warning',
            'engine.commands.combat.protocol_override_requires_authentication_code',
            'Protocol override requires authentication code.'
          ),
          createEntryI18n(
            'warning',
            'engine.commands.combat.usage_override_protocol_code',
            'Usage: override protocol <CODE>'
          ),
          createEntry('system', ''),
          createEntryI18n(
            'ufo74',
            'engine.commands.combat.ufo74_try_chat_theres_someone_in_the_system_who_knows_the_co',
            '[UFO74]: try "chat". theres someone in the system who knows the code.'
          ),
        ],
        stateChanges,
        triggerFlicker: true,
        delayMs: 1500,
      };
    }

    const password = args.slice(1).join(' ').toUpperCase();
    const correctPassword = 'COLHEITA';

    // Track failed attempts
    const failedAttempts = state.overrideFailedAttempts || 0;

    // Checkpoint before high-risk override protocol attempt (only if first real attempt)
    if (failedAttempts === 0) {
      saveCheckpoint(state, translateStatic('checkpoint.reason.beforeOverrideProtocol'));
    }

    // Wrong password
    if (password !== correctPassword) {
      const newFailedAttempts = failedAttempts + 1;

      // Too many failed attempts = lockdown
      if (newFailedAttempts >= 3) {
        return {
          output: [
            createEntryI18n('system', 'engine.commands.combat.verifyingCode', `Verifying code: ${password}...`, { value: password }),
            createEntry('error', ''),
            createEntry('error', '═══════════════════════════════════════════════════════════'),
            createEntryI18n(
              'error',
              'engine.commands.combat.security_countermeasure_activated',
              'SECURITY COUNTERMEASURE ACTIVATED'
            ),
            createEntryI18n(
              'error',
              'engine.commands.combat.multiple_authentication_failures_detected',
              'MULTIPLE AUTHENTICATION FAILURES DETECTED'
            ),
            createEntry('error', '═══════════════════════════════════════════════════════════'),
            createEntry('error', ''),
            createEntryI18n(
              'error',
              'engine.commands.combat.immediate_shutdown',
              'IMMEDIATE SHUTDOWN'
            ),
            createEntry('error', ''),
          ],
          stateChanges: {
            isGameOver: true,
            gameOverReason: 'SECURITY LOCKDOWN - AUTHENTICATION FAILURE',
            wrongAttempts: (state.wrongAttempts || 0) + 1,
          },
          triggerFlicker: true,
          delayMs: 3000,
        };
      }

      const stateChanges: Partial<GameState> = {
        detectionLevel: state.detectionLevel + 10, // was 15, reduced for pacing
        overrideFailedAttempts: newFailedAttempts,
        wrongAttempts: (state.wrongAttempts || 0) + 1,
      };

      // Suppress penalties during tutorial or atmosphere phase
      if (shouldSuppressPenalties(state)) {
        delete stateChanges.detectionLevel;
        delete stateChanges.wrongAttempts;
      }

      return {
        output: [
          createEntryI18n('system', 'engine.commands.combat.verifyingCode', `Verifying code: ${password}...`, { value: password }),
          createEntry('error', ''),
          createEntryI18n(
            'error',
            'engine.commands.combat.invalid_authentication_code',
            'INVALID AUTHENTICATION CODE'
          ),
          createEntry('error', ''),
          createEntry(
            'warning',
            `WARNING: ${3 - newFailedAttempts} attempt(s) remaining before lockdown`
          ),
        ],
        stateChanges,
        triggerFlicker: true,
        delayMs: 1500,
      };
    }

    // Correct password!
    // THE TERRIBLE MISTAKE - Can still trigger at high detection with correct password
    const rng = createSeededRng(state.rngState);
    const roll = rng();

    const isTerribleMistakeCondition =
      state.detectionLevel >= DETECTION_THRESHOLDS.ALERT &&
      (state.evidenceCount || 0) >= 2 &&
      !state.terribleMistakeTriggered &&
      roll < 0.35; // 35% chance when conditions are met

    if (isTerribleMistakeCondition) {
      return {
        output: [
          createEntryI18n('system', 'engine.commands.combat.verifyingCode', `Verifying code: ${password}...`, { value: password }),
          createEntryI18n(
            'system',
            'engine.commands.combat.authentication_accepted',
            'Authentication accepted.'
          ),
          createEntry('error', ''),
          createEntryI18n(
            'error',
            'engine.commands.combat.critical_breach',
            '▓▓▓ CRITICAL BREACH ▓▓▓'
          ),
          createEntry('error', ''),
          createEntry('warning', '════════════════════════════════════════════'),
          createEntryI18n(
            'warning',
            'engine.commands.combat.emergency_buffer_dump_do_not_distribute',
            'EMERGENCY BUFFER DUMP — DO NOT DISTRIBUTE'
          ),
          createEntry('warning', '════════════════════════════════════════════'),
          createEntry('system', ''),
          createEntryI18n(
            'output',
            'engine.commands.combat.recovered_fragment_origin_unknown_node',
            'RECOVERED FRAGMENT [ORIGIN: UNKNOWN NODE]:'
          ),
          createEntry('system', ''),
          createEntryI18n(
            'output',
            'engine.commands.combat.harvest_cycle_confirmed',
            '  ...harvest cycle confirmed...'
          ),
          createEntryI18n(
            'output',
            'engine.commands.combat.cognitive_extraction_7_2_billion_units',
            '  ...cognitive extraction: 7.2 billion units...'
          ),
          createEntryI18n(
            'output',
            'engine.commands.combat.window_activation_imminent',
            '  ...window activation: IMMINENT...'
          ),
          createEntryI18n(
            'output',
            'engine.commands.combat.no_intervention_possible',
            '  ...no intervention possible...'
          ),
          createEntryI18n(
            'output',
            'engine.commands.combat.observation_terminates_upon_extraction',
            '  ...observation terminates upon extraction...'
          ),
          createEntry('system', ''),
          createEntry('error', '════════════════════════════════════════════'),
          createEntryI18n(
            'error',
            'engine.commands.combat.purge_protocol_initiated',
            'PURGE PROTOCOL INITIATED'
          ),
          createEntryI18n(
            'error',
            'engine.commands.combat.system_will_terminate_in_8_operations',
            'SYSTEM WILL TERMINATE IN 8 OPERATIONS'
          ),
          createEntry('error', '════════════════════════════════════════════'),
          createEntry('system', ''),
          createEntryI18n(
            'warning',
            'engine.commands.combat.you_should_not_have_seen_this',
            'You should not have seen this.'
          ),
          createEntry('system', ''),
        ],
        stateChanges: {
          terribleMistakeTriggered: true,
          sessionDoomCountdown: 8,
          flags: {
            ...state.flags,
            adminUnlocked: true,
            forbiddenKnowledge: true,
            overrideGateActive: false,
          },
          accessLevel: 5,
          detectionLevel: MAX_DETECTION,
          systemHostilityLevel: 5,
          rngState: seededRandomInt(rng, 0, 2147483647),
          avatarExpression: 'angry', // Terrible mistake - angry expression
        },
        triggerFlicker: true,
        delayMs: 4000,
      };
    }

    // Success - unlock admin
    const stateChanges: Partial<GameState> = {
      flags: { ...state.flags, adminUnlocked: true, overrideGateActive: false },
      overrideFailedAttempts: 0,
      accessLevel: 5,
      detectionLevel: state.detectionLevel + 15, // was 25, reduced for pacing
      sessionStability: state.sessionStability - 15,
      systemHostilityLevel: Math.min((state.systemHostilityLevel || 0) + 1, 5),
      rngState: seededRandomInt(rng, 0, 2147483647),
    };

    if (!state.tutorialComplete) {
      delete stateChanges.detectionLevel;
      delete stateChanges.sessionStability;
    }

    return {
      output: [
        createEntryI18n('system', 'engine.commands.combat.verifyingCode', `Verifying code: ${password}...`, { value: password }),
        createEntryI18n(
          'system',
          'engine.commands.combat.authentication_accepted',
          'Authentication accepted.'
        ),
        createEntry('warning', ''),
        createEntryI18n(
          'warning',
          'engine.commands.combat.warning_legacy_security_bypass_detected',
          'WARNING: Legacy security bypass detected'
        ),
        createEntry('output', ''),
        createEntryI18n(
          'notice',
          'engine.commands.combat.notice_administrative_archive_access_granted',
          'NOTICE: Administrative archive access granted'
        ),
        createEntryI18n(
          'notice',
          'engine.commands.combat.notice_elevated_clearance_applied',
          'NOTICE: Elevated clearance applied'
        ),
        createEntry('output', ''),
        createEntryI18n(
          'warning',
          'engine.commands.combat.warning_session_heavily_monitored',
          'WARNING: Session heavily monitored'
        ),
      ],
      stateChanges,
      triggerFlicker: true,
      delayMs: 2500,
    };
  },
};
