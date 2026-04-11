// Navigation commands: last, back, map, wait, hide

import { TerminalEntry } from '../../types';
import { canAccessFile, getFileContent } from '../filesystem';
import { countEvidence, EVIDENCE_SYMBOL } from '../evidenceRevelation';
import { DETECTION_THRESHOLDS, DETECTION_DECREASES } from '../../constants/detection';
import {
  createEntry,
} from './utils';
import {
  getWarmupAdjustedDetection,
} from './helpers';
import type { CommandRegistry } from './types';

export const navigationCommands: CommandRegistry = {
  last: (args, state) => {
    // Re-display last opened file without re-triggering detection
    if (!state.lastOpenedFile) {
      return {
        output: [
          createEntry('error', 'ERROR: No file opened yet'),
          createEntry('ufo74', '[UFO74]: use "open <filename>" to read a file first.'),
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
        output: [createEntry('error', 'ERROR: File content no longer available')],
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
          output: [createEntry('system', 'Already at root directory. No navigation history.')],
          stateChanges: {},
        };
      }

      const parts = state.currentPath.split('/').filter(p => p);
      const newPath = parts.length <= 1 ? '/' : '/' + parts.slice(0, -1).join('/');

      return {
        output: [
          createEntry('output', `Changed to: ${newPath}`),
          createEntry('ufo74', '[UFO74]: use "cd" to build navigation history for the "back" command.'),
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
    // Display collected evidence status
    const evidenceCount = countEvidence(state);

    if (evidenceCount === 0) {
      return {
        output: [
          createEntry('system', ''),
          createEntry('system', '╔═══════════════════════════════════════════════════════╗'),
          createEntry('system', '║                  EVIDENCE MAP                         ║'),
          createEntry('system', '╠═══════════════════════════════════════════════════════╣'),
          createEntry('system', ''),
          createEntry('system', '  No evidence logged yet.'),
          createEntry('system', ''),
          createEntry('system', '  Read files to log corroborating evidence.'),
          createEntry('system', ''),
          createEntry('system', '╚═══════════════════════════════════════════════════════╝'),
        ],
        stateChanges: {},
      };
    }

    const output: TerminalEntry[] = [
      createEntry('system', ''),
      createEntry('system', '╔═══════════════════════════════════════════════════════╗'),
      createEntry('system', '║                  EVIDENCE MAP                         ║'),
      createEntry('system', '╠═══════════════════════════════════════════════════════╣'),
      createEntry('system', ''),
    ];

    // Show evidence status
    output.push(createEntry('system', '  EVIDENCE STATUS:'));
    output.push(createEntry('system', ''));
    for (let i = 1; i <= 5; i++) {
      const symbol = i <= evidenceCount ? EVIDENCE_SYMBOL : '○';
      const status = i <= evidenceCount ? 'CONFIRMED' : 'PENDING';
      output.push(
        createEntry(
          i <= evidenceCount ? 'output' : 'system',
          `  ${symbol} EVIDENCE #${i} — ${status}`
        )
      );
    }

    output.push(createEntry('system', ''));

    // Summary
    output.push(createEntry('system', '  ─────────────────────────────────────────────'));
    output.push(createEntry('system', `  PROGRESS: ${evidenceCount}/5 evidence links confirmed`));
    output.push(createEntry('system', ''));
    output.push(createEntry('system', '╚═══════════════════════════════════════════════════════╝'));

    return { output, stateChanges: {} };
  },

  wait: (args, state) => {
    const usesRemaining = state.waitUsesRemaining ?? 3;

    if (usesRemaining <= 0) {
      return {
        output: [
          createEntry('warning', 'Cannot wait any longer.'),
          createEntry('system', 'The system is too alert. Staying still would be suspicious.'),
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
          createEntry('system', `Too soon. Wait ${remaining} second${remaining === 1 ? '' : 's'} before trying again.`),
        ],
        stateChanges: {},
      };
    }

    if (state.detectionLevel <= DETECTION_THRESHOLDS.GHOST_MAX) {
      return {
        output: [
          createEntry('system', 'Detection level already minimal.'),
          createEntry('system', 'No need to wait.'),
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
      createEntry('system', '    . . .'),
      createEntry('system', ''),
      createEntry('system', '    [Holding position... monitoring suspended]'),
      createEntry('system', ''),
    ];

    if (newHostility >= 3) {
      messages.push(createEntry('warning', '    The system grows impatient.'));
    } else if (newHostility >= 2) {
      messages.push(createEntry('system', '    Something is still watching.'));
    } else {
      messages.push(createEntry('system', '    Attention drifts elsewhere.'));
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
          createEntry('error', 'Command not recognized: hide'),
          createEntry('system', 'Type "help" for available commands'),
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
          createEntry('error', 'Cannot hide again.'),
          createEntry('warning', 'They know your patterns now.'),
          createEntry('system', 'There is no second escape.'),
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
        createEntry('warning', '▓▓▓ EMERGENCY PROTOCOL ENGAGED ▓▓▓'),
        createEntry('system', ''),
        createEntry('system', '    Routing through backup channels...'),
        createEntry('system', '    Fragmenting connection signature...'),
        createEntry('system', '    Deploying decoy packets...'),
        createEntry('system', ''),
        createEntry('system', '    [CONNECTION DESTABILIZED]'),
        createEntry('system', ''),
        createEntry('output', '    You slip back into the shadows.'),
        createEntry('warning', '    Session stability compromised.'),
        createEntry('system', ''),
        createEntry('ufo74', '    >> close call. dont push your luck. <<'),
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
