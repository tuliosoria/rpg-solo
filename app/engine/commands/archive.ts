// Archive commands: script, run, rewind, present

import { GameState, CommandResult, TerminalEntry } from '../../types';
import {
  createEntry,
  createUFO74Message,
} from './utils';
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
          createEntry('system', 'SCRIPT EXECUTOR v1.7'),
          createEntry('system', ''),
          createEntry('system', 'Usage: script <script_content>'),
          createEntry('system', ''),
          createEntry('system', 'Required format:'),
          createEntry('system', '  INIT;TARGET=<path>;EXEC'),
          createEntry('system', ''),
          createEntry('system', 'Example:'),
          createEntry('system', '  script INIT;TARGET=/admin/neural_fragment.dat;EXEC'),
          createEntry('system', ''),
          createEntry('system', 'See /tmp/data_reconstruction.util for available targets.'),
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
          createEntry('system', 'Parsing script...'),
          createEntry('error', ''),
          createEntry('error', 'SYNTAX ERROR'),
          createEntry('error', 'Script must contain INIT and EXEC commands.'),
          createEntry('system', ''),
        ],
        stateChanges: state.tutorialComplete ? { detectionLevel: state.detectionLevel + 2 } : {},
      };
    }

    if (!targetMatch) {
      return {
        output: [
          createEntry('system', 'Parsing script...'),
          createEntry('error', ''),
          createEntry('error', 'SYNTAX ERROR'),
          createEntry('error', 'Script must specify TARGET=<path>'),
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
          createEntry('system', 'Parsing script...'),
          createEntry('system', 'INIT... OK'),
          createEntry('system', 'TARGET=/admin/neural_fragment.dat... LOCATED'),
          createEntry('system', 'EXEC... RUNNING'),
          createEntry('warning', ''),
          createEntry('warning', '▓▓▓ RECONSTRUCTION IN PROGRESS ▓▓▓'),
          createEntry('warning', ''),
          createEntry('system', 'Recovering fragmented sectors...'),
          createEntry('system', 'Rebuilding data structure...'),
          createEntry('system', 'Validating integrity...'),
          createEntry('notice', ''),
          createEntry('notice', 'RECONSTRUCTION SUCCESSFUL'),
          createEntry('notice', ''),
          createEntry('system', 'File /admin/neural_fragment.dat is now accessible.'),
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
          createEntry('system', 'Parsing script...'),
          createEntry('system', 'INIT... OK'),
          createEntry('system', 'TARGET=/comms/psi_residue.log... LOCATED'),
          createEntry('system', 'EXEC... RUNNING'),
          createEntry('warning', ''),
          createEntry('warning', '▓▓▓ RECONSTRUCTION IN PROGRESS ▓▓▓'),
          createEntry('warning', ''),
          createEntry('system', 'Recovering fragmented sectors...'),
          createEntry('error', 'ERROR: Corruption too severe'),
          createEntry('error', 'Partial recovery only:'),
          createEntry('system', ''),
          createEntry('output', '...they see through us...'),
          createEntry('output', '...we are not the first world...'),
          createEntry('output', '...we will not be the last...'),
          createEntry('system', ''),
          createEntry('warning', 'RECONSTRUCTION PARTIAL — FILE LOST'),
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
        createEntry('system', 'Parsing script...'),
        createEntry('system', 'INIT... OK'),
        createEntry('system', `TARGET=${target}... SEARCHING`),
        createEntry('error', ''),
        createEntry('error', 'TARGET NOT FOUND'),
        createEntry('error', 'Specified path does not contain reconstructable data.'),
        createEntry('system', ''),
      ],
      stateChanges: state.tutorialComplete ? { detectionLevel: state.detectionLevel + 3 } : {},
    };
  },

  run: (args, state) => {
    if (args.length === 0) {
      return {
        output: [
          createEntry('system', 'USAGE: run <script>'),
          createEntry('system', 'Example: run purge_trace.sh'),
        ],
        stateChanges: {},
      };
    }

    const scriptName = args[0].toLowerCase();

    if (scriptName === 'save_evidence.sh') {
      // Redirect to leak command — save_evidence.sh is no longer a separate path
      return commandsRef!.leak([], state);
    }

    if (scriptName === 'purge_trace.sh') {
      if (!state.traceSpikeActive) {
        return {
          output: [
            createEntry('error', 'EXECUTION FAILED'),
            createEntry('system', 'No active trace detected.'),
          ],
          stateChanges: {},
        };
      }

      return {
        output: [
          createEntry('warning', 'TRACE PURGE UTILITY'),
          createEntry('system', ''),
          createEntry('output', '[OK] Trace buffers wiped'),
          createEntry('output', '[OK] Session log truncated'),
          createEntry('warning', 'NOTICE: Countermeasures reset'),
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
        createEntry('error', 'EXECUTION FAILED'),
        createEntry('system', `Script not found: ${args[0]}`),
      ],
      stateChanges: {},
    };
  },

  rewind: (args, state) => {
    return {
      output: [
        createEntry('system', ''),
        createEntry('warning', 'ARCHIVE MODE HAS BEEN RETIRED'),
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
        createEntry('output', 'Current timeline active.'),
        createEntry('output', 'Archive mode is no longer available in this build.'),
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
