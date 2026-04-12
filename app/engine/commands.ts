// Command parser and execution engine for Terminal 1996
// Command handlers are split into domain modules under ./commands/

import {
  GameState,
  CommandResult,
  TerminalEntry,
  FileNode,
} from '../types';
import {
  resolvePath,
  getNode,
} from './filesystem';
import { MAX_DETECTION } from '../constants/detection';
import { MAX_WRONG_ATTEMPTS } from '../constants/gameplay';
import { MAX_COMMAND_INPUT_LENGTH } from '../constants/limits';

// Import utilities
import {
  createEntry,
  sanitizeCommandInput,
  parseCommand,
} from './commands/utils';

// Import interactive tutorial system
import {
  isInTutorialMode,
  processTutorialInput,
} from './commands/interactiveTutorial';

// Import Elusive Man leak system
import {
  isInLeakSequence,
  processLeakAnswer,
  isPendingConspiracyChoice,
  processConspiracyChoice,
} from './elusiveMan';

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
  maybeAddTypo,
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
          createEntry('error', 'CRITICAL: INPUT LENGTH THRESHOLD EXCEEDED'),
          createEntry('error', '═══════════════════════════════════════════════════════════'),
          createEntry('error', ''),
          createEntry('error', 'SYSTEM LOCKDOWN INITIATED'),
          createEntry('error', 'SESSION TERMINATED'),
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
          createEntry('error', 'ERROR: INPUT TOO LONG'),
          createEntry('warning', ''),
          createEntry(
            'warning',
            `Maximum command length is ${MAX_COMMAND_INPUT_LENGTH} characters.`
          ),
          createEntry('error', ''),
          createEntry('error', '▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓'),
          createEntry('error', ''),
          createEntry('error', '  INTRUSION DETECTED'),
          createEntry('error', ''),
          createEntry('error', '  Your connection has been traced.'),
          createEntry('error', '  Security protocols have been dispatched.'),
          createEntry('error', ''),
          createEntry('error', '  >> SESSION TERMINATED <<'),
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
        createEntry('error', 'ERROR: INPUT TOO LONG'),
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
      output: [createEntry('error', 'SESSION TERMINATED')],
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
      ? createEntry('warning', '[TRACE SPIKE ACTIVE]')
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
          createEntry('error', '                    PURGE PROTOCOL COMPLETE'),
          createEntry('error', ''),
          createEntry('warning', '          You saw what you should not have seen.'),
          createEntry('warning', '          The knowledge is yours to keep.'),
          createEntry('warning', '          But this session is now closed.'),
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
      createEntry('system', '═══ ALIEN PREVIEW ARMED ═══'),
      createEntry('output', 'detectionLevel = 70'),
      createEntry('output', 'Forced alien silhouette preview active for 12 seconds.'),
    ],
    stateChanges: {
      detectionLevel: 70,
      alienPreviewUntil: Date.now() + 12000,
    },
  });
  const createLeakReadyEvidenceResult = (title = '═══ LEAK-READY EVIDENCE ARMED ═══') => ({
    output: [
      createEntry('system', title),
      createEntry('output', 'Evidence count set to 5/5'),
      createEntry('output', 'Leak path ready — use "leak" or run "save_evidence.sh".'),
      createEntry('system', ''),
      createEntry('output', 'Use "god save" to trigger the blackout phase instead.'),
    ],
    stateChanges: {
      evidenceCount: 5,
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
          createEntry('warning', '▓▓▓ GOD MODE DEACTIVATED ▓▓▓'),
          createEntry('system', ''),
        ],
        stateChanges: { godMode: false },
      };
    }
    return {
      output: [
        createEntry('system', ''),
        createEntry('warning', '▓▓▓ GOD MODE ACTIVATED ▓▓▓'),
        createEntry('system', ''),
        createEntry('output', 'Available commands:'),
        createEntry('output', '  god help     - Show all god mode commands'),
        createEntry('output', '  god evidence - Unlock all 5 evidence pieces'),
        createEntry('output', '  god save     - Trigger evidence saved (→ blackout)'),
        createEntry('output', '  god icq      - Jump to ICQ phase'),
        createEntry('output', '  god victory  - Jump to victory screen'),
        createEntry('output', '  god reset    - Reset game state'),
        createEntry('output', '  god status   - Show current game state'),
        createEntry('output', '  god alien    - Set risk to 70 and force alien preview'),
        createEntry('system', ''),
        createEntry('output', 'Type "iddqd" again to deactivate.'),
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
          createEntry('system', '═══ GOD MODE COMMANDS ═══'),
          createEntry('output', ''),
          createEntry('output', 'god help      - Show this help'),
          createEntry('output', 'god evidence  - Discover all 5 evidence pieces'),
          createEntry('output', 'god save      - Set evidencesSaved flag (triggers blackout)'),
          createEntry('output', 'god icq       - Jump directly to ICQ phase'),
          createEntry('output', 'god victory   - Jump directly to victory screen'),
          createEntry('output', 'god bad       - Jump to bad ending (caught)'),
          createEntry('output', 'god neutral   - Jump to neutral ending (escaped)'),
          createEntry('output', 'god secret    - Jump to secret ending (UFO74 identity)'),
          createEntry('output', 'god countdown - Start 2-minute countdown'),
          createEntry('output', 'god unlock    - Unlock hidden commands & passwords'),
          createEntry('output', 'god reset     - Reset to fresh game state'),
          createEntry('output', 'god status    - Show current game flags'),
          createEntry('output', 'god stable    - Set stability to 100, detection to 0'),
          createEntry('output', 'god alien     - Set detection to 70 and force alien preview'),
          createEntry('output', 'god doom      - Disable doom countdown'),
          createEntry('output', ''),
          createEntry('system', 'Type "iddqd" to toggle god mode off.'),
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
          createEntry('system', '═══ EVIDENCE SAVED ═══'),
          createEntry('output', 'evidencesSaved = true'),
          createEntry('output', 'Blackout transition will trigger in 3 seconds...'),
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
          createEntry('system', '═══ JUMPING TO ICQ PHASE ═══'),
          createEntry('output', 'Terminal will transition to ICQ chat...'),
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
        output: [createEntry('system', '═══ JUMPING TO VICTORY ═══')],
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
          createEntry('system', '═══ GAME STATE RESET ═══'),
          createEntry('output', 'All progress cleared. Reload recommended.'),
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
          createEntry('system', '═══ GAME STATUS ═══'),
          createEntry('output', `Evidence found: ${evidCount}/5`),
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
          createEntry('system', '═══ STABILITY MAXED ═══'),
          createEntry('output', 'sessionStability = 100'),
          createEntry('output', 'detectionLevel = 0'),
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
          createEntry('system', '═══ DOOM DISABLED ═══'),
          createEntry('output', 'terribleMistakeTriggered = false'),
          createEntry('output', 'sessionDoomCountdown = 0'),
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
        output: [createEntry('system', '═══ JUMPING TO BAD ENDING ═══')],
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
        output: [createEntry('system', '═══ JUMPING TO NEUTRAL ENDING ═══')],
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
        output: [createEntry('system', '═══ JUMPING TO SECRET ENDING ═══')],
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
          createEntry('system', '═══ COUNTDOWN ACTIVATED ═══'),
          createEntry('output', 'You have 2 minutes before they trace you.'),
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
          createEntry('system', '═══ ALL HIDDEN FEATURES UNLOCKED ═══'),
          createEntry('output', '✓ Hidden commands: disconnect, scan, decode'),
          createEntry('output', '✓ Password found: varginha1996'),
          createEntry('output', '✓ Admin flag set'),
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
        createEntry('output', 'Type "god help" for available commands.'),
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
        output: [createEntry('system', 'Decryption cancelled.')],
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
              output: [createEntry('system', 'Decryption unavailable during transmission.')],
              stateChanges: {},
            };
          }
          return performDecryption(filePath, file, state);
        } else {
          // Wrong answer
          if (!state.tutorialComplete) {
            return {
              output: [
                createEntry('error', 'AUTHENTICATION FAILED'),
                createEntry('system', ''),
                createEntry('ufo74', `[UFO74]: ${file.securityQuestion.hint}`),
                createEntry('system', ''),
                createEntry('system', 'Enter answer or type "cancel" to abort:'),
              ],
              stateChanges: {},
              delayMs: 500,
            };
          }

          const newAlertCounter = state.legacyAlertCounter + 1;

          if (newAlertCounter >= 8) {
            return {
              output: [
                createEntry('error', 'AUTHENTICATION FAILED'),
                createEntry('error', ''),
                createEntry('error', '═══════════════════════════════════════════════════════════'),
                createEntry('error', 'CRITICAL: SECURITY THRESHOLD EXCEEDED'),
                createEntry('error', '═══════════════════════════════════════════════════════════'),
                createEntry('error', ''),
                createEntry('error', 'SYSTEM LOCKDOWN INITIATED'),
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
              createEntry('error', 'AUTHENTICATION FAILED'),
              createEntry('warning', `WARNING: Invalid attempts: ${newAlertCounter}/8`),
              createEntry('system', ''),
              createEntry('ufo74', `[UFO74]: ${file.securityQuestion.hint}`),
              createEntry('system', ''),
              createEntry('system', 'Enter answer or type "cancel" to abort:'),
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
        createEntry('error', 'SYSTEM LOCKDOWN'),
        createEntry('error', 'NO FURTHER COMMANDS ACCEPTED'),
      ],
      stateChanges: {
        isGameOver: true,
        gameOverReason: 'LOCKDOWN',
      },
    };
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // ELUSIVE MAN LEAK SEQUENCE
  // ═══════════════════════════════════════════════════════════════════════════
  if (isInLeakSequence(state)) {
    return processLeakAnswer(normalizedInput, state);
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // CONSPIRACY FILES CHOICE
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
        output: [createEntry('system', 'Override protocol unavailable during transmission.')],
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
        createEntry('ufo74', '[UFO74]: hey careful, to go back use cd .. (with a space after cd)'),
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
          createEntry('error', 'CRITICAL: INVALID ATTEMPT THRESHOLD EXCEEDED'),
          createEntry('error', '═══════════════════════════════════════════════════════════'),
          createEntry('error', ''),
          createEntry('error', 'SYSTEM LOCKDOWN INITIATED'),
          createEntry('error', 'SESSION TERMINATED'),
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
          createEntry('error', '  INTRUSION DETECTED'),
          createEntry('error', ''),
          createEntry('error', '  Your connection has been traced.'),
          createEntry('error', '  Security protocols have been dispatched.'),
          createEntry('error', ''),
          createEntry('error', '  >> SESSION TERMINATED <<'),
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
      createEntry('warning', '⚠ RISK INCREASED: Invalid commands draw system attention.'),
      createEntry('system', `   [Invalid attempts: ${newAlertCounter}/8]`),
    ];

    // After 3 wrong commands, UFO74 steps in to help
    if (newAlertCounter === 3) {
      output.push(createEntry('system', ''));
      output.push(createEntry('ufo74', 'UFO74: hey kid, youre fumbling. let me help.'));
      output.push(
        createEntry(
          'ufo74',
          'UFO74: try these: "ls" to see files, "cd <dir>" to move, "open <file>" to read.'
        )
      );
      output.push(createEntry('ufo74', 'UFO74: type "help" if youre lost.'));
    } else if (newAlertCounter >= 5) {
      output.push(createEntry('system', ''));
      output.push(
        createEntry('ufo74', 'UFO74: careful. too many mistakes and theyll lock you out.')
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
        createEntry('ufo74', 'UFO74: hey kid, risk is getting too high.'),
        createEntry('ufo74', 'UFO74: the terminal is starting to malfunction. you see it right?'),
        createEntry('ufo74', 'UFO74: text gets corrupted when detection is this high.'),
        createEntry('ufo74', 'UFO74: use "wait" to lay low and bring the risk down.'),
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

      const alreadyHasPendingMessages = result.pendingUfo74Messages && result.pendingUfo74Messages.length > 0;

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
      createEntry('warning', '  STATUS: SUSPICIOUS'),
      createEntry('warning', '  System monitoring increased.'),
      createEntry('warning', '────────────────────────────────────────'),
    ];
  }

  if (state.tutorialComplete && newDetection >= 70 && newDetection < 85 && prevDetection < 70) {
    result.output = [
      ...result.output,
      createEntry('system', ''),
      createEntry('error', '════════════════════════════════════════'),
      createEntry('error', '  STATUS: ALERT'),
      createEntry('warning', '  Active countermeasures online.'),
      createEntry('error', '════════════════════════════════════════'),
      createEntry('system', ''),
      createEntry('ufo74', '>> careful. theyre paying attention now. <<'),
    ];
  }

  if (state.tutorialComplete && newDetection >= 85 && newDetection < 90 && prevDetection < 85) {
    result.output = [
      ...result.output,
      createEntry('system', ''),
      createEntry('error', '▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓'),
      createEntry('error', '  STATUS: CRITICAL'),
      createEntry('error', '  Trace protocols active.'),
      createEntry('error', '▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓'),
      createEntry('system', ''),
      createEntry('ufo74', '>> STOP. youre about to get burned. <<'),
      createEntry('ufo74', '>> use "wait" to lay low. you have limited uses. <<'),
    ];
    result.triggerFlicker = true;
    result.stateChanges.avatarExpression = 'scared';
  }

  if (state.tutorialComplete && newDetection >= 90 && prevDetection < 90) {
    result.output = [
      ...result.output,
      createEntry('system', ''),
      createEntry('error', '▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓'),
      createEntry('error', '  STATUS: IMMINENT DETECTION'),
      createEntry('error', '  Countermeasures locking on.'),
      createEntry('error', '▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓'),
      createEntry('system', ''),
      createEntry('ufo74', '>> EMERGENCY. type "hide" NOW. one chance. <<'),
    ];
    result.stateChanges.hideAvailable = true;
    result.triggerFlicker = true;
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // MAX DETECTION GAME OVER
  // ═══════════════════════════════════════════════════════════════════════════
  if (state.tutorialComplete && newDetection >= MAX_DETECTION && !result.stateChanges.isGameOver && !result.stateChanges.evidencesSaved) {
    result.output = [
      createEntry('error', ''),
      createEntry('error', '▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓'),
      createEntry('error', ''),
      createEntry('error', '  INTRUSION DETECTED'),
      createEntry('error', ''),
      createEntry('error', '  Your connection has been traced.'),
      createEntry('error', '  Security protocols have been dispatched.'),
      createEntry('error', ''),
      createEntry('error', '  >> SESSION TERMINATED <<'),
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
      createEntry('error', '  TERMINAL LOCKOUT'),
      createEntry('error', ''),
      createEntry('error', '  Too many failed authentication attempts.'),
      createEntry('error', '  Session terminated by security protocol.'),
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
      createEntry('ufo74', '[UFO74]: try "ls" to list directory contents.'),
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
      createEntry('ufo74', '[UFO74]: press [ESC] to exit. or type "save" first if you want to keep your progress.'),
      createEntry('system', ''),
    ];
  }

  if (command === 'unlock' || command === 'access' || command === 'sudo' || command === 'admin') {
    return [
      createEntry('system', ''),
      createEntry('ufo74', '[UFO74]: you need the override protocol for that. dangerous stuff.'),
      createEntry('system', ''),
    ];
  }

  if (command === 'back' || command === 'up' || command === '..') {
    return [
      createEntry('system', ''),
      createEntry('ufo74', '[UFO74]: use "cd .." to go to parent directory.'),
      createEntry('system', ''),
    ];
  }

  if (command === 'info' || command === 'about' || command === 'whoami' || command === 'who') {
    return [
      createEntry('system', ''),
      createEntry('ufo74', '[UFO74]: try "status" or "help" kid.'),
      createEntry('system', ''),
    ];
  }

  return [
    createEntry('system', ''),
    createEntry('system', `Command not recognized: ${command}`),
    createEntry('system', ''),
    createEntry('ufo74', '[UFO74]: type "help" to see what you can do.'),
    createEntry('system', ''),
  ];
}
