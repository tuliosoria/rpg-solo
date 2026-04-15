// Navigation commands: last, back, map, wait, hide

import { TerminalEntry } from '../../types';
import { canAccessFile, getFileContent } from '../filesystem';
import { EVIDENCE_SYMBOL } from '../evidenceRevelation';
import { DETECTION_THRESHOLDS, DETECTION_DECREASES } from '../../constants/detection';
import { createEntry, createEntryI18n } from './utils';
import { getWarmupAdjustedDetection } from './helpers';
import type { CommandRegistry } from './types';

export const navigationCommands: CommandRegistry = {
  last: (args, state) => {
    // Re-display last opened file without re-triggering detection
    if (!state.lastOpenedFile) {
      return {
        output: [
          createEntryI18n(
            'error',
            'engine.commands.navigation.error_no_file_opened_yet',
            'ERROR: No file opened yet'
          ),
          createEntryI18n(
            'ufo74',
            'engine.commands.navigation.ufo74_use_open_filename_to_read_a_file_first',
            '[UFO74]: use "open <filename>" to read a file first.'
          ),
        ],
        stateChanges: {},
      };
    }

    const access = canAccessFile(state.lastOpenedFile, state);
    if (!access.accessible) {
      return {
        output: [createEntry('error', `ERROR: File no longer accessible: ${access.reason}`)],
        stateChanges: {},
      };
    }

    const content = getFileContent(state.lastOpenedFile, state);
    if (!content) {
      return {
        output: [
          createEntryI18n(
            'error',
            'engine.commands.navigation.error_file_content_no_longer_available',
            'ERROR: File content no longer available'
          ),
        ],
        stateChanges: {},
      };
    }

    const fileName = state.lastOpenedFile.split('/').pop() || state.lastOpenedFile;
    const output: TerminalEntry[] = [
      createEntry('system', `[Re-reading: ${fileName}]`),
      createEntry('system', ''),
      ...content.map(line => createEntry('file', line)),
      createEntry('system', ''),
    ];

    return {
      output,
      stateChanges: {}, // No state changes - no detection increase
      streamingMode: 'fast',
    };
  },

  back: (args, state) => {
    // Navigate to previous directory in history (not just parent)
    const history = state.navigationHistory || [];

    if (history.length === 0) {
      // Fallback to parent directory if no history
      if (state.currentPath === '/') {
        return {
          output: [
            createEntryI18n(
              'system',
              'engine.commands.navigation.already_at_root_directory_no_navigation_history',
              'Already at root directory. No navigation history.'
            ),
          ],
          stateChanges: {},
        };
      }

      const parts = state.currentPath.split('/').filter(p => p);
      const newPath = parts.length <= 1 ? '/' : '/' + parts.slice(0, -1).join('/');

      return {
        output: [
          createEntry('output', `Changed to: ${newPath}`),
          createEntryI18n(
            'ufo74',
            'engine.commands.navigation.ufo74_use_cd_to_build_navigation_history_for_the_back_comman',
            '[UFO74]: use "cd" to build navigation history for the "back" command.'
          ),
        ],
        stateChanges: state.tutorialComplete
          ? {
              currentPath: newPath,
              detectionLevel: getWarmupAdjustedDetection(state, 1),
            }
          : {
              currentPath: newPath,
            },
      };
    }

    // Pop the last path from history
    const newHistory = [...history];
    const previousPath = newHistory.pop()!;

    return {
      output: [createEntry('output', `Changed to: ${previousPath}`)],
      stateChanges: state.tutorialComplete
        ? {
            currentPath: previousPath,
            detectionLevel: getWarmupAdjustedDetection(state, 1),
            navigationHistory: newHistory,
          }
        : {
            currentPath: previousPath,
            navigationHistory: newHistory,
          },
    };
  },

  map: (args, state) => {
    const savedCount = state.savedFiles?.size || 0;
    const savedFiles = state.savedFiles ? [...state.savedFiles] : [];

    if (savedCount === 0) {
      return {
        output: [
          createEntry('system', ''),
          createEntry('system', '╔═══════════════════════════════════════════════════════╗'),
          createEntry('system', '║                  DOSSIER MAP                          ║'),
          createEntry('system', '╠═══════════════════════════════════════════════════════╣'),
          createEntry('system', ''),
          createEntry('system', '  No files saved yet.'),
          createEntry('system', ''),
          createEntry('system', '  Use "save <filename>" after reading a file.'),
          createEntry('system', ''),
          createEntry('system', '╚═══════════════════════════════════════════════════════╝'),
        ],
        stateChanges: {},
      };
    }

    const output: TerminalEntry[] = [
      createEntry('system', ''),
      createEntry('system', '╔═══════════════════════════════════════════════════════╗'),
      createEntry('system', '║                  DOSSIER MAP                          ║'),
      createEntry('system', '╠═══════════════════════════════════════════════════════╣'),
      createEntry('system', ''),
      createEntry('system', '  SAVED FILES:'),
      createEntry('system', ''),
    ];

    for (let i = 1; i <= 10; i++) {
      if (i <= savedCount) {
        const fileName = savedFiles[i - 1]?.split('/').pop() || '?';
        output.push(createEntry('output', `  ${EVIDENCE_SYMBOL} ${i.toString().padStart(2, ' ')}. ${fileName}`));
      } else {
        output.push(createEntry('system', `  ○ ${i.toString().padStart(2, ' ')}. ─────────`));
      }
    }

    output.push(createEntry('system', ''));
    output.push(createEntry('system', '  ─────────────────────────────────────────────'));
    output.push(createEntry('system', `  DOSSIER: ${savedCount}/10 files saved`));
    if (savedCount >= 10) {
      output.push(createEntry('notice', '  READY — type "leak" when prepared.'));
    }
    output.push(createEntry('system', ''));
    output.push(createEntry('system', '╚═══════════════════════════════════════════════════════╝'));

    return { output, stateChanges: {} };
  },

  wait: (args, state) => {
    if (state.savedFiles.size >= 5) {
      return {
        output: [
          createEntry('warning', ''),
          createEntry('warning', '  COMMAND RESTRICTED — ELEVATED SECURITY PROTOCOL'),
          createEntry('warning', ''),
        ],
        stateChanges: {},
      };
    }

    const usesRemaining = state.waitUsesRemaining ?? 3;

    if (usesRemaining <= 0) {
      return {
        output: [
          createEntryI18n(
            'warning',
            'engine.commands.navigation.cannot_wait_any_longer',
            'Cannot wait any longer.'
          ),
          createEntryI18n(
            'system',
            'engine.commands.navigation.the_system_is_too_alert_staying_still_would_be_suspicious',
            'The system is too alert. Staying still would be suspicious.'
          ),
        ],
        stateChanges: {},
      };
    }

    // Enforce a 5-second cooldown between uses
    const WAIT_COOLDOWN_MS = 5000;
    const now = Date.now();
    const timeSinceLastWait = now - (state.lastWaitTime || 0);
    if (state.lastWaitTime && timeSinceLastWait < WAIT_COOLDOWN_MS) {
      const remaining = Math.ceil((WAIT_COOLDOWN_MS - timeSinceLastWait) / 1000);
      return {
        output: [
          createEntry(
            'system',
            `Too soon. Wait ${remaining} second${remaining === 1 ? '' : 's'} before trying again.`
          ),
        ],
        stateChanges: {},
      };
    }

    if (state.detectionLevel <= DETECTION_THRESHOLDS.GHOST_MAX) {
      return {
        output: [
          createEntryI18n(
            'system',
            'engine.commands.navigation.detection_level_already_minimal',
            'Detection level already minimal.'
          ),
          createEntryI18n(
            'system',
            'engine.commands.navigation.no_need_to_wait',
            'No need to wait.'
          ),
        ],
        stateChanges: {},
      };
    }

    // Calculate reduction: more effective at high detection, but costs hostility
    const reduction = Math.min(
      state.detectionLevel,
      state.detectionLevel >= DETECTION_THRESHOLDS.HIGH_WAIT_REDUCTION
        ? DETECTION_DECREASES.WAIT_HIGH_DETECTION
        : DETECTION_DECREASES.WAIT_NORMAL
    );
    const newDetection = Math.max(0, state.detectionLevel - reduction);
    const newHostility = Math.min(5, (state.systemHostilityLevel || 0) + 1);

    const messages: TerminalEntry[] = [
      createEntry('system', ''),
      createEntryI18n('system', 'engine.commands.navigation.text', '    . . .'),
      createEntry('system', ''),
      createEntryI18n(
        'system',
        'engine.commands.navigation.holding_position_monitoring_suspended',
        '    [Holding position... monitoring suspended]'
      ),
      createEntry('system', ''),
    ];

    if (newHostility >= 3) {
      messages.push(
        createEntryI18n(
          'warning',
          'engine.commands.navigation.the_system_grows_impatient',
          '    The system grows impatient.'
        )
      );
    } else if (newHostility >= 2) {
      messages.push(
        createEntryI18n(
          'system',
          'engine.commands.navigation.something_is_still_watching',
          '    Something is still watching.'
        )
      );
    } else {
      messages.push(
        createEntryI18n(
          'system',
          'engine.commands.navigation.attention_drifts_elsewhere',
          '    Attention drifts elsewhere.'
        )
      );
    }

    messages.push(createEntry('system', ''));
    messages.push(
      createEntry(
        'system',
        `    Detection reduced. [${usesRemaining - 1} wait${usesRemaining - 1 === 1 ? '' : 's'} remaining]`
      )
    );

    return {
      output: messages,
      stateChanges: {
        detectionLevel: newDetection,
        waitUsesRemaining: usesRemaining - 1,
        lastWaitTime: Date.now(),
        systemHostilityLevel: newHostility,
      },
      streamingMode: 'slow',
      delayMs: 2000,
    };
  },

  hide: (args, state) => {
    // Only available at 90+ detection
    if (state.detectionLevel < DETECTION_THRESHOLDS.HIDE_AVAILABLE) {
      return {
        output: [
          createEntryI18n(
            'error',
            'engine.commands.navigation.command_not_recognized_hide',
            'Command not recognized: hide'
          ),
          createEntryI18n(
            'system',
            'engine.commands.navigation.type_help_for_available_commands',
            'Type "help" for available commands'
          ),
        ],
        stateChanges: {},
      };
    }

    // Can only use once per run
    if (
      state.hideAvailable === false &&
      state.detectionLevel >= DETECTION_THRESHOLDS.HIDE_AVAILABLE
    ) {
      // First time at 90+ - hide becomes available
      // This is handled by the detection check below
    }

    if (state.singularEventsTriggered?.has('hide_used')) {
      return {
        output: [
          createEntryI18n(
            'error',
            'engine.commands.navigation.cannot_hide_again',
            'Cannot hide again.'
          ),
          createEntryI18n(
            'warning',
            'engine.commands.navigation.they_know_your_patterns_now',
            'They know your patterns now.'
          ),
          createEntryI18n(
            'system',
            'engine.commands.navigation.there_is_no_second_escape',
            'There is no second escape.'
          ),
        ],
        stateChanges: {},
      };
    }

    // Emergency escape: reset to 70 but costs stability
    const stabilityLoss = 25;
    const newStability = Math.max(10, state.sessionStability - stabilityLoss);

    return {
      output: [
        createEntry('system', ''),
        createEntryI18n(
          'warning',
          'engine.commands.navigation.emergency_protocol_engaged',
          '▓▓▓ EMERGENCY PROTOCOL ENGAGED ▓▓▓'
        ),
        createEntry('system', ''),
        createEntryI18n(
          'system',
          'engine.commands.navigation.routing_through_backup_channels',
          '    Routing through backup channels...'
        ),
        createEntryI18n(
          'system',
          'engine.commands.navigation.fragmenting_connection_signature',
          '    Fragmenting connection signature...'
        ),
        createEntryI18n(
          'system',
          'engine.commands.navigation.deploying_decoy_packets',
          '    Deploying decoy packets...'
        ),
        createEntry('system', ''),
        createEntryI18n(
          'system',
          'engine.commands.navigation.connection_destabilized',
          '    [CONNECTION DESTABILIZED]'
        ),
        createEntry('system', ''),
        createEntryI18n(
          'output',
          'engine.commands.navigation.you_slip_back_into_the_shadows',
          '    You slip back into the shadows.'
        ),
        createEntryI18n(
          'warning',
          'engine.commands.navigation.session_stability_compromised',
          '    Session stability compromised.'
        ),
        createEntry('system', ''),
        createEntryI18n(
          'ufo74',
          'engine.commands.navigation.close_call_dont_push_your_luck',
          '    >> close call. dont push your luck. <<'
        ),
        createEntry('system', ''),
      ],
      stateChanges: {
        detectionLevel: 70,
        sessionStability: newStability,
        singularEventsTriggered: new Set([...(state.singularEventsTriggered || []), 'hide_used']),
        systemHostilityLevel: Math.min(5, (state.systemHostilityLevel || 0) + 2),
      },
      streamingMode: 'slow',
      delayMs: 3000,
      triggerFlicker: true,
    };
  },
};
