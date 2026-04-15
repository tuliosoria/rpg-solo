// Archive commands: script, run, rewind, present

import { getNode } from '../filesystem';
import { createEntry, createEntryI18n, createUFO74Message } from './utils';
import type { CommandRegistry } from './types';

// Forward reference to commands registry (needed for run -> leak redirect)
let commandsRef: CommandRegistry | null = null;
export function setCommandsRef(cmds: CommandRegistry) {
  commandsRef = cmds;
}

export const archiveCommands: CommandRegistry = {
  script: (args, state) => {
    if (args.length === 0) {
      return {
        output: [
          createEntryI18n(
            'system',
            'engine.commands.archive.script_executor_v1_7',
            'SCRIPT EXECUTOR v1.7'
          ),
          createEntry('system', ''),
          createEntryI18n(
            'system',
            'engine.commands.archive.usage_script_script_content',
            'Usage: script <script_content>'
          ),
          createEntry('system', ''),
          createEntryI18n('system', 'engine.commands.archive.required_format', 'Required format:'),
          createEntryI18n(
            'system',
            'engine.commands.archive.init_target_path_exec',
            '  INIT;TARGET=<path>;EXEC'
          ),
          createEntry('system', ''),
          createEntryI18n('system', 'engine.commands.archive.example', 'Example:'),
          createEntryI18n(
            'system',
            'engine.commands.archive.script_init_target_admin_neural_fragment_dat_exec',
            '  script INIT;TARGET=/admin/neural_fragment.dat;EXEC'
          ),
          createEntry('system', ''),
          createEntryI18n(
            'system',
            'engine.commands.archive.see_tmp_data_reconstruction_util_for_available_targets',
            'See /tmp/data_reconstruction.util for available targets.'
          ),
          createEntry('system', ''),
        ],
        stateChanges: {},
      };
    }

    const scriptContent = args.join(' ').toUpperCase();

    // Parse script
    const hasInit = scriptContent.includes('INIT');
    const hasExec = scriptContent.includes('EXEC');
    const targetMatch = scriptContent.match(/TARGET=([^;]+)/);

    if (!hasInit || !hasExec) {
      return {
        output: [
          createEntryI18n('system', 'engine.commands.archive.parsing_script', 'Parsing script...'),
          createEntry('error', ''),
          createEntryI18n('error', 'engine.commands.archive.syntax_error', 'SYNTAX ERROR'),
          createEntryI18n(
            'error',
            'engine.commands.archive.script_must_contain_init_and_exec_commands',
            'Script must contain INIT and EXEC commands.'
          ),
          createEntry('system', ''),
        ],
        stateChanges: state.tutorialComplete ? { detectionLevel: state.detectionLevel + 2 } : {},
      };
    }

    if (!targetMatch) {
      return {
        output: [
          createEntryI18n('system', 'engine.commands.archive.parsing_script', 'Parsing script...'),
          createEntry('error', ''),
          createEntryI18n('error', 'engine.commands.archive.syntax_error', 'SYNTAX ERROR'),
          createEntryI18n(
            'error',
            'engine.commands.archive.script_must_specify_target_path',
            'Script must specify TARGET=<path>'
          ),
          createEntry('system', ''),
        ],
        stateChanges: state.tutorialComplete ? { detectionLevel: state.detectionLevel + 2 } : {},
      };
    }

    const target = targetMatch[1].toLowerCase();

    // Valid targets
    if (target.includes('neural_fragment') || target.includes('/admin/neural')) {
      return {
        output: [
          createEntryI18n('system', 'engine.commands.archive.parsing_script', 'Parsing script...'),
          createEntryI18n('system', 'engine.commands.archive.init_ok', 'INIT... OK'),
          createEntryI18n(
            'system',
            'engine.commands.archive.target_admin_neural_fragment_dat_located',
            'TARGET=/admin/neural_fragment.dat... LOCATED'
          ),
          createEntryI18n('system', 'engine.commands.archive.exec_running', 'EXEC... RUNNING'),
          createEntry('warning', ''),
          createEntryI18n(
            'warning',
            'engine.commands.archive.reconstruction_in_progress',
            '▓▓▓ RECONSTRUCTION IN PROGRESS ▓▓▓'
          ),
          createEntry('warning', ''),
          createEntryI18n(
            'system',
            'engine.commands.archive.recovering_fragmented_sectors',
            'Recovering fragmented sectors...'
          ),
          createEntryI18n(
            'system',
            'engine.commands.archive.rebuilding_data_structure',
            'Rebuilding data structure...'
          ),
          createEntryI18n(
            'system',
            'engine.commands.archive.validating_integrity',
            'Validating integrity...'
          ),
          createEntry('notice', ''),
          createEntryI18n(
            'notice',
            'engine.commands.archive.reconstruction_successful',
            'RECONSTRUCTION SUCCESSFUL'
          ),
          createEntry('notice', ''),
          createEntryI18n(
            'system',
            'engine.commands.archive.file_admin_neural_fragment_dat_is_now_accessible',
            'File /admin/neural_fragment.dat is now accessible.'
          ),
          createEntry('system', ''),
        ],
        stateChanges: state.tutorialComplete
          ? {
              flags: { ...state.flags, scriptExecuted: true },
              detectionLevel: state.detectionLevel + 10, // was 15, reduced for pacing
            }
          : {
              flags: { ...state.flags, scriptExecuted: true },
            },
        triggerFlicker: true,
        delayMs: 3000,
      };
    }

    if (target.includes('psi_residue') || target.includes('/comms/psi')) {
      return {
        output: [
          createEntryI18n('system', 'engine.commands.archive.parsing_script', 'Parsing script...'),
          createEntryI18n('system', 'engine.commands.archive.init_ok', 'INIT... OK'),
          createEntryI18n(
            'system',
            'engine.commands.archive.target_comms_psi_residue_log_located',
            'TARGET=/comms/psi_residue.log... LOCATED'
          ),
          createEntryI18n('system', 'engine.commands.archive.exec_running', 'EXEC... RUNNING'),
          createEntry('warning', ''),
          createEntryI18n(
            'warning',
            'engine.commands.archive.reconstruction_in_progress',
            '▓▓▓ RECONSTRUCTION IN PROGRESS ▓▓▓'
          ),
          createEntry('warning', ''),
          createEntryI18n(
            'system',
            'engine.commands.archive.recovering_fragmented_sectors',
            'Recovering fragmented sectors...'
          ),
          createEntryI18n(
            'error',
            'engine.commands.archive.error_corruption_too_severe',
            'ERROR: Corruption too severe'
          ),
          createEntryI18n(
            'error',
            'engine.commands.archive.partial_recovery_only',
            'Partial recovery only:'
          ),
          createEntry('system', ''),
          createEntryI18n(
            'output',
            'engine.commands.archive.they_see_through_us',
            '...they see through us...'
          ),
          createEntryI18n(
            'output',
            'engine.commands.archive.we_are_not_the_first_world',
            '...we are not the first world...'
          ),
          createEntryI18n(
            'output',
            'engine.commands.archive.we_will_not_be_the_last',
            '...we will not be the last...'
          ),
          createEntry('system', ''),
          createEntryI18n(
            'warning',
            'engine.commands.archive.reconstruction_partial_file_lost',
            'RECONSTRUCTION PARTIAL — FILE LOST'
          ),
          createEntry('system', ''),
        ],
        stateChanges: state.tutorialComplete ? { detectionLevel: state.detectionLevel + 10 } : {},
        triggerFlicker: true,
        delayMs: 2500,
      };
    }

    // Invalid target
    return {
      output: [
        createEntryI18n('system', 'engine.commands.archive.parsing_script', 'Parsing script...'),
        createEntryI18n('system', 'engine.commands.archive.init_ok', 'INIT... OK'),
        createEntry('system', `TARGET=${target}... SEARCHING`),
        createEntry('error', ''),
        createEntryI18n('error', 'engine.commands.archive.target_not_found', 'TARGET NOT FOUND'),
        createEntryI18n(
          'error',
          'engine.commands.archive.specified_path_does_not_contain_reconstructable_data',
          'Specified path does not contain reconstructable data.'
        ),
        createEntry('system', ''),
      ],
      stateChanges: state.tutorialComplete ? { detectionLevel: state.detectionLevel + 3 } : {},
    };
  },

  run: (args, state) => {
    if (args.length === 0) {
      return {
        output: [
          createEntryI18n(
            'system',
            'engine.commands.archive.usage_run_script',
            'USAGE: run <script>'
          ),
          createEntryI18n(
            'system',
            'engine.commands.archive.example_run_purge_trace_sh',
            'Example: run purge_trace.sh'
          ),
        ],
        stateChanges: {},
      };
    }

    const scriptName = args[0].toLowerCase();

    if (scriptName === 'save_evidence.sh' || scriptName.endsWith('/save_evidence.sh')) {
      // Gate save_evidence.sh through the actual filesystem visibility rules.
      const visibleScript = getNode('/tmp/save_evidence.sh', state);
      if (!visibleScript || visibleScript.type !== 'file') {
        return {
          output: [
            createEntryI18n(
              'error',
              'engine.commands.archive.execution_failed',
              'EXECUTION FAILED'
            ),
            createEntry('system', `Script not found: ${args[0]}`),
          ],
          stateChanges: {},
        };
      }

      // Redirect to leak command
      return commandsRef!.leak([], state);
    }

    if (scriptName === 'purge_trace.sh') {
      if (!state.flags?.traceMonitorReviewed) {
        return {
          output: [
            createEntryI18n(
              'error',
              'engine.commands.archive.execution_failed',
              'EXECUTION FAILED'
            ),
            createEntryI18n(
              'system',
              'engine.commands.archive.no_active_trace_detected',
              'No active trace detected.'
            ),
          ],
          stateChanges: {},
        };
      }

      return {
        output: [
          createEntryI18n(
            'warning',
            'engine.commands.archive.trace_purge_utility',
            'TRACE PURGE UTILITY'
          ),
          createEntry('system', ''),
          createEntryI18n(
            'output',
            'engine.commands.archive.ok_trace_buffers_wiped',
            '[OK] Trace buffers wiped'
          ),
          createEntryI18n(
            'output',
            'engine.commands.archive.ok_session_log_truncated',
            '[OK] Session log truncated'
          ),
          createEntryI18n(
            'warning',
            'engine.commands.archive.notice_countermeasures_reset',
            'NOTICE: Countermeasures reset'
          ),
          createEntry('system', ''),
        ],
        stateChanges: state.tutorialComplete
          ? {
              traceSpikeActive: false,
              tracePurgeUsed: true,
              countdownActive: false,
              countdownEndTime: 0,
              flags: { ...state.flags, tracePurgeUsed: true },
              detectionLevel: Math.max(0, state.detectionLevel - 10),
            }
          : {
              traceSpikeActive: false,
              tracePurgeUsed: true,
              countdownActive: false,
              countdownEndTime: 0,
              flags: { ...state.flags, tracePurgeUsed: true },
            },
        delayMs: 1200,
        triggerFlicker: true,
      };
    }

    return {
      output: [
        createEntryI18n('error', 'engine.commands.archive.execution_failed', 'EXECUTION FAILED'),
        createEntry('system', `Script not found: ${args[0]}`),
      ],
      stateChanges: {},
    };
  },

  rewind: (args, state) => {
    return {
      output: [
        createEntry('system', ''),
        createEntryI18n(
          'warning',
          'engine.commands.archive.archive_mode_has_been_retired',
          'ARCHIVE MODE HAS BEEN RETIRED'
        ),
        createEntry('system', ''),
        ...createUFO74Message([
          'UFO74: no more time tricks, hackerkid.',
          '       stick to the live filesystem and keep correlating what you read.',
        ]),
      ],
      stateChanges: state.inArchiveMode
        ? {
            inArchiveMode: false,
            archiveActionsRemaining: 0,
            archiveTimestamp: '',
          }
        : {},
    };
  },

  present: (args, state) => {
    return {
      output: [
        createEntry('system', ''),
        createEntryI18n(
          'output',
          'engine.commands.archive.current_timeline_active',
          'Current timeline active.'
        ),
        createEntryI18n(
          'output',
          'engine.commands.archive.archive_mode_is_no_longer_available_in_this_build',
          'Archive mode is no longer available in this build.'
        ),
      ],
      stateChanges: state.inArchiveMode
        ? {
            inArchiveMode: false,
            archiveActionsRemaining: 0,
            archiveTimestamp: '',
          }
        : {},
    };
  },
};
