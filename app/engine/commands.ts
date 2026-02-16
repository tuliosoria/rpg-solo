// Command parser and execution engine for Terminal 1996

import {
  GameState,
  CommandResult,
  TerminalEntry,
  TruthCategory,
  TRUTH_CATEGORIES,
  FileMutation,
  FileNode,
  ImageTrigger,
  VideoTrigger,
} from '../types';
import {
  resolvePath,
  getNode,
  listDirectory,
  getFileContent,
  canAccessFile,
  getFileReveals,
} from './filesystem';
import { createSeededRng, seededRandomInt, seededRandomPick } from './rng';
import {
  attemptEvidenceRevelation,
  countEvidence,
  getCaseStrengthDescription,
  getFileEvidenceSymbol,
  getDisturbingContentAvatarExpression,
  EVIDENCE_SYMBOL,
} from './evidenceRevelation';
import {
  ARCHIVE_FILES,
  ARCHIVE_DIRECTORY_ADDITIONS,
  generateArchiveTimestamp,
  shouldFileDisappear,
} from '../data/archiveFiles';
import {
  UFO74_CONSPIRACY_REACTIONS,
  CONSPIRACY_FILE_NAMES,
} from '../data/conspiracyFiles';
import { DETECTION_THRESHOLDS, DETECTION_DECREASES, MAX_DETECTION, applyWarmupDetection, WARMUP_PHASE } from '../constants/detection';
import { shouldSuppressPressure, shouldSuppressPenalties } from '../constants/atmosphere';
import { MAX_COMMAND_INPUT_LENGTH } from '../constants/limits';
import { TURING_QUESTIONS } from '../constants/turing';

// Import utilities from new module
import {
  createEntry,
  createOutputEntries,
  createInvalidCommandResult,
  sanitizeCommandInput,
  parseCommand,
  calculateDelay,
  createUFO74Message,
} from './commands/utils';

// Import tutorial functions for use in commands
import {
  getTutorialTip,
  shouldShowTutorialTip,
  getHelpBasics,
  getHelpEvidence,
  getHelpWinning,
} from './commands/tutorial';

// Import interactive tutorial system
import {
  isInTutorialMode,
  processTutorialInput,
} from './commands/interactiveTutorial';

// Import search index system
import {
  performSearch,
  canSearch,
  getSearchCooldownMessage,
} from './searchIndex';

// Import Elusive Man leak system
import {
  isInLeakSequence,
  startLeakSequence,
  processLeakAnswer,
  isPendingConspiracyChoice,
  processConspiracyChoice,
} from './elusiveMan';

// Import Prisoner 46 system
import {
  PRISONER46_FILES,
  PRISONER46_FILE_NAMES,
  PRISONER46_RELEASE_INTRO,
  PRISONER46_RELEASE_SEQUENCE,
  PRISONER46_RELEASE_SUCCESS,
  PRISONER46_ALREADY_RELEASED,
  PRISONER46_FILE_NOT_FOUND,
} from '../data/prisoner46';

// Import checkpoint system
import { saveCheckpoint } from '../storage/saves';

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
  getHelpBasics,
  getHelpEvidence,
  getHelpWinning,
} from './commands/tutorial';
export type { TutorialTipId } from './commands/tutorial';

const TRUTH_CATEGORY_SET = new Set<string>(TRUTH_CATEGORIES);

// ═══════════════════════════════════════════════════════════════════════════
// SINGULAR IRREVERSIBLE EVENTS - Each can only happen once per run
// ═══════════════════════════════════════════════════════════════════════════

interface SingularEvent {
  id: string;
  trigger: (state: GameState, command: string, args: string[]) => boolean;
  execute: (state: GameState) => {
    output: TerminalEntry[];
    stateChanges: Partial<GameState>;
    delayMs?: number;
    triggerFlicker?: boolean;
  };
}

const SINGULAR_EVENTS: SingularEvent[] = [
  {
    // UFO74 WARNING - Warn player before Turing test triggers
    id: 'turing_warning',
    trigger: (state, _command, _args) => {
      if (state.singularEventsTriggered?.has('turing_warning')) return false;
      if (state.turingEvaluationCompleted) return false;
      if (state.turingEvaluationActive) return false;
      // Suppress during atmosphere phase and cooldown period
      if (shouldSuppressPressure(state)) return false;
      // Trigger at detection level 45% (TURING_WARNING threshold)
      if (!state.tutorialComplete) return false;
      return (
        state.detectionLevel >= DETECTION_THRESHOLDS.TURING_WARNING &&
        state.truthsDiscovered.size >= 1
      );
    },
    execute: state => {
      return {
        output: [
          // Channel banners are handled by openEncryptedChannelWithMessages
          // (ufo74 entries in result.output are extracted and wrapped automatically)
          createEntry('ufo74', 'UFO74: careful kid, they\'re getting suspicious.'),
          createEntry('ufo74', '       if you hit 50% you\'ll have to prove you\'re human.'),
        ],
        stateChanges: {
          singularEventsTriggered: new Set([
            ...(state.singularEventsTriggered || []),
            'turing_warning',
          ]),
        },
        delayMs: 500,
      };
    },
  },
  {
    // TURING EVALUATION - System challenges user to prove they're not a human intruder
    // Now triggers an overlay instead of inline terminal output
    id: 'turing_evaluation',
    trigger: (state, _command, _args) => {
      if (state.singularEventsTriggered?.has('turing_evaluation')) return false;
      if (state.turingEvaluationCompleted) return false;
      if (state.turingEvaluationActive) return false;
      // Suppress during atmosphere phase and cooldown period
      if (shouldSuppressPressure(state)) return false;
      // Trigger EXACTLY at detection level 50% (TURING_TRIGGER threshold)
      // Must have at least 1 truth and warning shown (but we make warning trigger first)
      if (!state.tutorialComplete) return false;
      return (
        state.detectionLevel >= DETECTION_THRESHOLDS.TURING_TRIGGER &&
        state.truthsDiscovered.size >= 1
      );
    },
    execute: state => {
      return {
        output: [
          createEntry('system', ''),
          createEntry('error', '▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓'),
          createEntry('warning', '        SECURITY PROTOCOL: TURING EVALUATION INITIATED'),
          createEntry('error', '▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓'),
          createEntry('system', ''),
        ],
        stateChanges: {
          singularEventsTriggered: new Set([
            ...(state.singularEventsTriggered || []),
            'turing_evaluation',
          ]),
          turingEvaluationActive: true,
          turingEvaluationIndex: 0,
        },
        delayMs: 1500,
        triggerFlicker: true,
        triggerTuringTest: true, // NEW: Show the Turing test overlay
      };
    },
  },
  {
    // THE ECHO - Triggered when accessing psi files at high detection
    // Suppressed during atmosphere phase
    id: 'the_echo',
    trigger: (state, command, args) => {
      if (state.singularEventsTriggered?.has('the_echo')) return false;
      if (shouldSuppressPressure(state)) return false;
      if (command !== 'open' && command !== 'decrypt') return false;
      const path = args[0]?.toLowerCase() || '';
      return (
        (path.includes('psi') || path.includes('transcript')) &&
        state.detectionLevel >= DETECTION_THRESHOLDS.WANDERING_PSI
      );
    },
    execute: state => ({
      output: [
        createEntry('system', ''),
        createEntry('error', '▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓'),
        createEntry('system', ''),
        createEntry('warning', '                    [SIGNAL ECHO DETECTED]'),
        createEntry('system', ''),
        createEntry('output', '                    ...we see you seeing...'),
        createEntry('system', ''),
        createEntry('error', '▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓'),
        createEntry('system', ''),
      ],
      stateChanges: {
        singularEventsTriggered: new Set([...(state.singularEventsTriggered || []), 'the_echo']),
        sessionStability: state.sessionStability - 15,
        systemHostilityLevel: Math.min((state.systemHostilityLevel || 0) + 2, 5),
      },
      delayMs: 3000,
      triggerFlicker: true,
    }),
  },
  {
    // THE SILENCE - Terminal goes completely silent briefly after accessing admin at high risk
    // Suppressed during atmosphere phase
    id: 'the_silence',
    trigger: (state, command, args) => {
      if (state.singularEventsTriggered?.has('the_silence')) return false;
      if (shouldSuppressPressure(state)) return false;
      if (command !== 'cd' && command !== 'ls') return false;
      const path = args[0]?.toLowerCase() || state.currentPath.toLowerCase();
      return (
        path.includes('admin') &&
        state.detectionLevel >= DETECTION_THRESHOLDS.WANDERING_ADMIN &&
        state.flags.adminUnlocked
      );
    },
    execute: state => ({
      output: [
        createEntry('system', ''),
        createEntry('system', ''),
        createEntry('system', ''),
        createEntry('system', '            .'),
        createEntry('system', ''),
        createEntry('system', ''),
        createEntry('system', ''),
        createEntry('system', '                              .'),
        createEntry('system', ''),
        createEntry('system', ''),
        createEntry('warning', '                                              .'),
        createEntry('system', ''),
        createEntry('system', ''),
        createEntry('error', 'SESSION OBSERVATION LEVEL: ELEVATED'),
        createEntry('system', ''),
      ],
      stateChanges: {
        singularEventsTriggered: new Set([...(state.singularEventsTriggered || []), 'the_silence']),
        detectionLevel: Math.min(state.detectionLevel + 12, MAX_DETECTION), // was 20, reduced for pacing
        systemHostilityLevel: Math.min((state.systemHostilityLevel || 0) + 1, 5),
      },
      delayMs: 5000,
      triggerFlicker: true,
    }),
  },
  {
    // THE WATCHER ACKNOWLEDGMENT - After discovering 3+ truths, system acknowledges awareness
    // Suppressed during atmosphere phase and cooldown
    id: 'watcher_ack',
    trigger: state => {
      if (state.singularEventsTriggered?.has('watcher_ack')) return false;
      if (shouldSuppressPressure(state)) return false;
      return (
        state.truthsDiscovered.size >= 3 &&
        state.detectionLevel >= DETECTION_THRESHOLDS.WANDERING_TRUTHS
      );
    },
    execute: state => ({
      output: [
        createEntry('system', ''),
        createEntry('error', '─────────────────────────────────────────'),
        createEntry('system', ''),
        createEntry('warning', 'NOTICE: Your inquiry has been noted.'),
        createEntry('system', ''),
        createEntry('output', 'Pattern analysis: SYSTEMATIC'),
        createEntry('output', 'Intent classification: RECONSTRUCTION'),
        createEntry('system', ''),
        createEntry('warning', 'Observation continues.'),
        createEntry('system', ''),
        createEntry('error', '─────────────────────────────────────────'),
        createEntry('system', ''),
      ],
      stateChanges: {
        singularEventsTriggered: new Set([...(state.singularEventsTriggered || []), 'watcher_ack']),
        systemHostilityLevel: Math.min((state.systemHostilityLevel || 0) + 1, 5),
      },
      delayMs: 2500,
      triggerFlicker: true,
    }),
  },
  {
    // RIVAL INVESTIGATOR - Evidence seized after heavy linking
    // Suppressed during atmosphere phase and cooldown
    id: 'rival_investigator',
    trigger: state => {
      if (state.singularEventsTriggered?.has('rival_investigator')) return false;
      if (shouldSuppressPressure(state)) return false;
      return (
        (state.evidenceLinks?.length || 0) >= 3 &&
        state.detectionLevel >= DETECTION_THRESHOLDS.WANDERING_EVIDENCE
      );
    },
    execute: state => ({
      output: [
        createEntry('system', ''),
        createEntry('warning', '─────────────────────────────────────────'),
        createEntry('warning', 'NOTICE: Parallel investigation detected'),
        createEntry('system', ''),
        createEntry('output', 'A competing analyst is pulling records.'),
        createEntry('output', 'Chain-of-custody locks engaged on key files.'),
        createEntry('system', ''),
        createEntry('warning', 'Maintain discretion. Expect delays.'),
        createEntry('warning', '─────────────────────────────────────────'),
        createEntry('system', ''),
      ],
      stateChanges: {
        singularEventsTriggered: new Set([
          ...(state.singularEventsTriggered || []),
          'rival_investigator',
        ]),
        rivalInvestigatorActive: true,
        systemHostilityLevel: Math.min((state.systemHostilityLevel || 0) + 1, 5),
        paranoiaLevel: Math.min(100, (state.paranoiaLevel || 0) + 20),
      },
      delayMs: 2000,
      triggerFlicker: true,
    }),
  },
];

// Check and trigger singular events
function checkSingularEvents(
  state: GameState,
  command: string,
  args: string[]
): {
  output: TerminalEntry[];
  stateChanges: Partial<GameState>;
  delayMs?: number;
  triggerFlicker?: boolean;
  triggerTuringTest?: boolean;
} | null {
  for (const event of SINGULAR_EVENTS) {
    if (event.trigger(state, command, args)) {
      return event.execute(state);
    }
  }
  return null;
}

// ═══════════════════════════════════════════════════════════════════════════
// SYSTEM PERSONALITY DEGRADATION - Terminal becomes colder as hostility rises
// ═══════════════════════════════════════════════════════════════════════════

function getHostileSystemMessage(hostilityLevel: number, normalMessage: string): string {
  if (hostilityLevel <= 1) return normalMessage;
  if (hostilityLevel === 2) {
    // Slightly shorter, more formal
    return normalMessage.replace(/\.$/, '').replace('Use:', 'Command:');
  }
  if (hostilityLevel === 3) {
    // Colder, removes tips and hints
    if (normalMessage.toLowerCase().includes('tip:')) return '';
    if (normalMessage.toLowerCase().includes('hint:')) return '';
    return normalMessage.replace(/\.$/, '');
  }
  if (hostilityLevel >= 4) {
    // Very cold, minimal responses
    if (normalMessage.toLowerCase().includes('tip:')) return '';
    if (normalMessage.toLowerCase().includes('hint:')) return '';
    if (normalMessage.toLowerCase().includes('use:')) return '';
    if (normalMessage.length > 40) return normalMessage.substring(0, 35) + '...';
    return normalMessage;
  }
  return normalMessage;
}

function applyHostileFiltering(entries: TerminalEntry[], hostilityLevel: number): TerminalEntry[] {
  if (hostilityLevel <= 1) return entries;

  return entries
    .map(entry => ({
      ...entry,
      content: getHostileSystemMessage(hostilityLevel, entry.content),
    }))
    .filter(entry => entry.content !== '' || entry.type === 'system'); // Keep empty system lines for spacing
}

// Calculate hostility increase based on actions
function calculateHostilityIncrease(state: GameState, command: string): number {
  const baseHostility = state.systemHostilityLevel || 0;

  // High-risk commands increase hostility
  if (command === 'trace') return 1;
  if (command === 'recover') return 1;
  if (command === 'override') return 2;
  if (command === 'decrypt')
    return state.detectionLevel > DETECTION_THRESHOLDS.DECRYPT_WARNING ? 1 : 0;

  // Detection thresholds trigger hostility
  if (state.detectionLevel >= DETECTION_THRESHOLDS.HOSTILITY_HIGH && baseHostility < 4) return 1;
  if (state.detectionLevel >= DETECTION_THRESHOLDS.HOSTILITY_MED && baseHostility < 3) return 1;
  if (state.detectionLevel >= DETECTION_THRESHOLDS.HOSTILITY_LOW && baseHostility < 2) return 1;

  return 0;
}

// ═══════════════════════════════════════════════════════════════════════════
// WANDERING DETECTION - Implicit guidance through institutional notices
// ═══════════════════════════════════════════════════════════════════════════

// Check if an action is "meaningful" (reading files, finding truths)
function isMeaningfulAction(
  command: string,
  args: string[],
  state: GameState,
  result: { output: TerminalEntry[]; stateChanges: Partial<GameState> }
): boolean {
  // Attempting to open/decrypt a file is meaningful - even failed attempts show intent
  // Player is trying to engage with the game, not wandering aimlessly
  if (command === 'open' || command === 'decrypt') {
    return true;
  }

  // Navigation commands show active exploration
  if (command === 'cd' || command === 'ls' || command === 'cat' || command === 'read') {
    return true;
  }

  // Discovering truth is definitely meaningful
  const updatedTruths = result.stateChanges.truthsDiscovered;
  if (updatedTruths instanceof Set && updatedTruths.size > state.truthsDiscovered.size) {
    return true;
  }

  // Gaining access level is meaningful
  if (result.stateChanges.accessLevel && result.stateChanges.accessLevel > state.accessLevel) {
    return true;
  }

  return false;
}

// UFO74 messages for wandering players - a friendly hacker guide
// Now context-aware based on player's exploration state
function getWanderingNotice(level: number, state?: GameState): TerminalEntry[] {
  // Get contextual hints based on what player hasn't explored
  const contextualHints = state ? getContextualExplorationHints(state) : null;

  if (level === 0) {
    // First notice - friendly tip with contextual suggestion
    // Channel banners are added by openEncryptedChannelWithMessages
    const hints: TerminalEntry[] = [
      createEntry('ufo74', 'UFO74: hey. need a hint?'),
    ];

    if (contextualHints) {
      hints.push(createEntry('ufo74', `UFO74: ${contextualHints}`));
    } else {
      hints.push(createEntry('ufo74', 'UFO74: READ the files. "open <filename>".'));
      hints.push(createEntry('ufo74', '       theres a protocol doc in /internal/.'));
    }

    return hints;
  } else if (level === 1) {
    // Second notice - more specific guidance + search hint
    return [
      createEntry('ufo74', 'UFO74: look for evidence in:'),
      createEntry('output', '       /storage/, /ops/quarantine/, /comms/'),
      createEntry('ufo74', 'UFO74: the index knows more than they want you to find.'),
      createEntry('ufo74', '       try: search <keyword>'),
    ];
  } else {
    // Third notice - urgent help
    return [
      createEntry('ufo74', 'UFO74: last hint:'),
      createEntry('output', '       1. cd <directory>'),
      createEntry('output', '       2. ls'),
      createEntry('output', '       3. open <filename>'),
      createEntry('ufo74', 'UFO74: january 96. find the pieces.'),
    ];
  }
}

// Generate contextual hints based on what player hasn't explored yet
function getContextualExplorationHints(state: GameState): string | null {
  const filesRead = state.filesRead || new Set<string>();
  const truthsDiscovered = state.truthsDiscovered || new Set<string>();
  const prisoner45Used = state.prisoner45QuestionsAsked > 0;

  // Check for unexplored areas and give targeted hints
  const readFlags = {
    storage: false,
    comms: false,
    ops: false,
    admin: false,
  };

  for (const filePath of filesRead) {
    if (!readFlags.storage && filePath.includes('/storage/')) readFlags.storage = true;
    if (!readFlags.comms && filePath.includes('/comms/')) readFlags.comms = true;
    if (!readFlags.ops && filePath.includes('/ops/')) readFlags.ops = true;
    if (!readFlags.admin && filePath.includes('/admin/')) readFlags.admin = true;
    if (readFlags.storage && readFlags.comms && readFlags.ops && readFlags.admin) {
      break;
    }
  }

  const {
    storage: hasReadStorage,
    comms: hasReadComms,
    ops: hasReadOps,
    admin: hasReadAdmin,
  } = readFlags;

  // Prioritized hints based on what's missing
  if (!hasReadStorage && !truthsDiscovered.has('debris_relocation')) {
    return 'check /storage/ for transport logs.';
  }

  if (!hasReadOps && !truthsDiscovered.has('being_containment')) {
    return '/ops/ has quarantine records.';
  }

  if (!hasReadComms && !truthsDiscovered.has('telepathic_scouts')) {
    return '/comms/psi/ has weird signal stuff.';
  }

  if (!prisoner45Used && state.tutorialComplete) {
    return 'try "chat". someones in here.';
  }

  if (!hasReadAdmin && truthsDiscovered.size >= 2 && state.accessLevel >= 3) {
    return 'you have clearance. check /admin/.';
  }

  return null;
}

// Check if player seems lost and return appropriate nudge
function checkWanderingState(
  state: GameState,
  command: string,
  args: string[],
  result: { output: TerminalEntry[]; stateChanges: Partial<GameState> }
): { notices: TerminalEntry[]; stateChanges: Partial<GameState> } | null {
  const commandCount = state.sessionCommandCount || 0;
  const lastMeaningful = state.lastMeaningfulAction || 0;
  const wanderingCount = state.wanderingNoticeCount || 0;

  // Don't trigger in early session
  if (commandCount < 15) return null;

  // Don't spam notices
  if (wanderingCount >= 3) return null;

  // Check if this action is meaningful
  const meaningful = isMeaningfulAction(command, args, state, result);

  if (meaningful) {
    // Reset wandering state on meaningful action
    return {
      notices: [],
      stateChanges: {
        lastMeaningfulAction: commandCount,
      },
    };
  }

  // Calculate commands since last meaningful action
  const commandsSinceMeaningful = commandCount - lastMeaningful;

  // Trigger thresholds increase with each notice
  const threshold = 8 + wanderingCount * 5; // 8, 13, 18

  if (commandsSinceMeaningful >= threshold) {
    return {
      notices: getWanderingNotice(Math.min(wanderingCount, 2), state),
      stateChanges: {
        wanderingNoticeCount: wanderingCount + 1,
        lastMeaningfulAction: commandCount, // Reset to avoid immediate re-trigger
      },
    };
  }

  return null;
}

// ═══════════════════════════════════════════════════════════════════════════
// PER-RUN VARIANCE - Different runs have different "hot" commands
// ═══════════════════════════════════════════════════════════════════════════

// Get per-run detection multiplier for a command
// Some runs certain commands are "hotter" (1.5x detection) while others are safer (0.7x)
function getCommandDetectionMultiplier(state: GameState, command: string): number {
  const rng = createSeededRng(state.seed + command.charCodeAt(0) * 100);
  const roll = rng();

  // Most commands are normal, but some get marked as hot/cold
  if (roll < 0.15) return 1.5; // Hot - this command is being watched this run
  if (roll > 0.85) return 0.7; // Cold - less monitored this run
  return 1.0;
}

// Apply per-run variance to detection increase
function applyDetectionVariance(state: GameState, command: string, baseIncrease: number): number {
  const multiplier = getCommandDetectionMultiplier(state, command);
  return Math.floor(baseIncrease * multiplier);
}

// ═══════════════════════════════════════════════════════════════════════════
// WARMUP DETECTION - Reduced penalties during early exploration phase
// ═══════════════════════════════════════════════════════════════════════════

// ═══════════════════════════════════════════════════════════════════════════
// ARCHIVE MODE HELPERS - Time mechanic for viewing past filesystem state
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Exit archive mode and return to present.
 * Called either manually via 'present' command or automatically when actions run out.
 */
function exitArchiveMode(state: GameState, reason: 'manual' | 'timeout' | 'file_lost'): CommandResult {
  const filesViewed = state.archiveFilesViewed?.size || 0;
  
  if (reason === 'timeout') {
    return {
      output: [
        createEntry('system', ''),
        createEntry('error', '▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓'),
        createEntry('system', ''),
        createEntry('error', '           ARCHIVE STATE LOST — RETURNING TO PRESENT'),
        createEntry('system', ''),
        createEntry('error', '▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓'),
        createEntry('system', ''),
        createEntry('output', `Archive files accessed: ${filesViewed}`),
        createEntry('output', 'The past is sealed. You are in the present now.'),
        createEntry('system', ''),
        ...createUFO74Message([
          'UFO74: back to the now hackerkid.',
          '       hope you remembered what you needed.',
          '       cant go back again so soon.',
        ]),
      ],
      stateChanges: {
        inArchiveMode: false,
        archiveActionsRemaining: 0,
        archiveTimestamp: '',
      },
      triggerFlicker: true,
      delayMs: 2000,
    };
  }
  
  if (reason === 'file_lost') {
    return {
      output: [
        createEntry('system', ''),
        createEntry('error', '▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓'),
        createEntry('system', ''),
        createEntry('error', '           TEMPORAL DRIFT — ARCHIVE DESTABILIZED'),
        createEntry('system', ''),
        createEntry('error', '▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓'),
        createEntry('system', ''),
        createEntry('output', 'Connection to archive state severed.'),
        createEntry('output', 'You are in the present now.'),
        createEntry('system', ''),
      ],
      stateChanges: {
        inArchiveMode: false,
        archiveActionsRemaining: 0,
        archiveTimestamp: '',
      },
      triggerFlicker: true,
      delayMs: 1500,
    };
  }
  
  // Manual exit via 'present' command
  return {
    output: [
      createEntry('system', ''),
      createEntry('warning', '              EXITING ARCHIVE STATE'),
      createEntry('system', ''),
      createEntry('system', '                    ... ... ...'),
      createEntry('system', ''),
      createEntry('output', `Archive files accessed: ${filesViewed}`),
      createEntry('output', 'You are in the present now.'),
      createEntry('system', ''),
    ],
    stateChanges: {
      inArchiveMode: false,
      archiveActionsRemaining: 0,
      archiveTimestamp: '',
    },
    triggerFlicker: true,
    delayMs: 1500,
  };
}

/**
 * Decrement archive actions and check if we need to exit.
 * Returns state changes including forced exit if needed.
 */
function decrementArchiveAction(state: GameState): {
  stateChanges: Partial<GameState>;
  forceExit: boolean;
} {
  if (!state.inArchiveMode) {
    return { stateChanges: {}, forceExit: false };
  }
  
  const remaining = (state.archiveActionsRemaining || 0) - 1;
  
  if (remaining <= 0) {
    return {
      stateChanges: {
        archiveActionsRemaining: 0,
      },
      forceExit: true,
    };
  }
  
  return {
    stateChanges: {
      archiveActionsRemaining: remaining,
    },
    forceExit: false,
  };
}

/**
 * Get archive-only files for a directory path.
 * Returns additional file entries that only exist in archive mode.
 */
function getArchiveFilesForDirectory(dirPath: string): { name: string; type: 'file'; status: string }[] {
  const additions = ARCHIVE_DIRECTORY_ADDITIONS[dirPath];
  if (!additions) return [];
  
  return additions.map(name => ({
    name,
    type: 'file' as const,
    status: 'intact',
  }));
}

/**
 * Check if a file exists only in archive mode.
 */
function isArchiveOnlyFile(filePath: string): boolean {
  return filePath in ARCHIVE_FILES;
}

/**
 * Get content of an archive-only file.
 */
function getArchiveFileContent(filePath: string): string[] | null {
  const file = ARCHIVE_FILES[filePath];
  if (!file) return null;
  return [...file.content];
}

/**
 * Calculate new detection level with warmup phase modifier.
 * During early game (before reading WARMUP_PHASE.FILES_READ_THRESHOLD files),
 * detection increases are reduced and soft-capped to let atmosphere build.
 */
function getWarmupAdjustedDetection(state: GameState, increase: number): number {
  const filesReadCount = state.filesRead?.size || 0;
  return applyWarmupDetection(state.detectionLevel, increase, filesReadCount);
}

/**
 * Check if player is still in warmup phase (for UI hints, etc.)
 */
export function isInWarmupPhase(state: GameState): boolean {
  const filesReadCount = state.filesRead?.size || 0;
  return filesReadCount < WARMUP_PHASE.FILES_READ_THRESHOLD;
}

// Apply corruption to a random file
export function applyRandomCorruption(state: GameState): GameState {
  const rng = createSeededRng(state.rngState);
  state.rngState = seededRandomInt(rng, 0, 2147483647);

  // Find a corruptible file that isn't already fully corrupted
  const corruptiblePaths = [
    '/storage/assets/material_x_analysis.dat',
    '/storage/quarantine/bio_container.log',
    '/storage/quarantine/autopsy_alpha.log',
    '/comms/psi/transcript_core.enc',
  ];

  const targetPath = seededRandomPick(rng, corruptiblePaths);
  const mutation = state.fileMutations[targetPath] || {
    corruptedLines: [],
    decrypted: false,
  };

  // Add corruption
  const lineToCorrupt = seededRandomInt(rng, 3, 15);
  if (!mutation.corruptedLines.includes(lineToCorrupt)) {
    mutation.corruptedLines.push(lineToCorrupt);
  }

  return {
    ...state,
    fileMutations: {
      ...state.fileMutations,
      [targetPath]: mutation,
    },
  };
}

// Check truth progress and generate notices
function checkTruthProgress(
  state: GameState,
  newReveals: string[],
  sourceFilePath?: string // The file that revealed the evidence
): { notices: TerminalEntry[]; stateChanges: Partial<GameState> } {
  const notices: TerminalEntry[] = [];
  const stateChanges: Partial<GameState> = {};
  const previousCount = state.truthsDiscovered.size;

  // Create a new Set to avoid mutating the original state
  const updatedTruths = new Set(state.truthsDiscovered);
  for (const reveal of newReveals) {
    if (TRUTH_CATEGORY_SET.has(reveal)) {
      updatedTruths.add(reveal);
    }
  }

  const newCount = updatedTruths.size;

  // Update evidence states to track which files revealed evidence
  const updatedStates = { ...state.evidenceStates };
  for (const reveal of newReveals) {
    if (TRUTH_CATEGORY_SET.has(reveal)) {
      if (!updatedStates[reveal]) {
        updatedStates[reveal] = {
          linkedFiles: sourceFilePath ? [sourceFilePath] : [],
        };
      } else if (sourceFilePath && !updatedStates[reveal].linkedFiles.includes(sourceFilePath)) {
        updatedStates[reveal] = {
          linkedFiles: [...updatedStates[reveal].linkedFiles, sourceFilePath],
        };
      }
    }
  }

  // Always update states if we had reveals
  if (newReveals.length > 0) {
    stateChanges.evidenceStates = updatedStates;
  }

  // Only update if we found new truths
  if (newCount > previousCount) {
    stateChanges.truthsDiscovered = updatedTruths;
    // TRUTH DISCOVERY BREATHER: Major revelation distracts the watchers
    // Trigger shocked expression on major discovery
    stateChanges.avatarExpression = 'shocked';

    // Show "EVIDENCE FOUND" banner for new discoveries
    const categoryLabels: Record<string, string> = {
      debris_relocation: 'DEBRIS TRANSFER',
      being_containment: 'BIO CONTAINMENT',
      telepathic_scouts: 'TELEPATHIC RECON',
      international_actors: 'INTERNATIONAL',
      transition_2026: 'TRANSITION 2026',
    };

    for (const reveal of newReveals) {
      if (!state.truthsDiscovered.has(reveal)) {
        // This is a new discovery
        notices.push(createEntry('system', ''));
        notices.push(createEntry('warning', '╔═══════════════════════════════════════════╗'));
        notices.push(createEntry('warning', '║           EVIDENCE FOUND                  ║'));
        notices.push(createEntry('warning', '╠═══════════════════════════════════════════╣'));
        notices.push(createEntry('system', ''));
        notices.push(createEntry('output', `  Category: ${categoryLabels[reveal] || reveal}`));
        notices.push(createEntry('system', ''));
        notices.push(createEntry('warning', '╚═══════════════════════════════════════════╝'));
      }
    }

    // Breather notice - the system recalibrates
    notices.push(createEntry('system', ''));
    notices.push(createEntry('system', '[System recalibrating... attention momentarily diverted]'));

    // TUTORIAL TIP: First evidence discovered
    if (newCount === 1 && previousCount === 0) {
      // Show tutorial tip if tutorial mode is enabled
      if (
        shouldShowTutorialTip(
          'first_evidence',
          state.interactiveTutorialMode,
          state.tutorialTipsShown || new Set()
        )
      ) {
        notices.push(...getTutorialTip('first_evidence'));
        const newTipsShown = new Set(state.tutorialTipsShown || []);
        newTipsShown.add('first_evidence');
        stateChanges.tutorialTipsShown = newTipsShown;
      }

      // NOTE: UFO74 "nice find" is shown by the override gate block in the open handler
      // to avoid duplicate messages. No additional notice needed here.
    }

    // Additional milestone acknowledgments (never say "progress")
    if (newCount === 2 && previousCount < 2) {
      notices.push(createEntry('notice', ''));
      notices.push(createEntry('notice', 'SYSTEM: Independent verification detected.'));
    }

    if (newCount === 4 && previousCount < 4) {
      notices.push(createEntry('notice', ''));
      notices.push(createEntry('notice', 'NOTICE: Documentation threshold approaching.'));
    }

    if (newCount === 5 && previousCount < 5) {
      notices.push(createEntry('notice', ''));
      notices.push(createEntry('notice', '▓▓▓ ALL EVIDENCE CATEGORIES DOCUMENTED ▓▓▓'));
      notices.push(...createUFO74Message([
        'UFO74: all five confirmed. we need to get this out.',
        '       type: leak',
        '       do it NOW before they cut the connection.',
      ]));
    }

    // Check for near-victory
    if (newCount >= 4 && !state.flags.nearVictory) {
      stateChanges.flags = { ...state.flags, ...stateChanges.flags, nearVictory: true };
    }
    if (newCount >= 5 && !state.flags.allEvidenceCollected) {
      stateChanges.flags = { ...state.flags, ...stateChanges.flags, allEvidenceCollected: true };
    }
  }

  return { notices, stateChanges };
}

// Check for victory condition
function checkVictory(state: GameState): boolean {
  return state.truthsDiscovered.size >= 5;
}

// Helper function to perform actual decryption
function performDecryption(filePath: string, file: FileNode, state: GameState): CommandResult {
  // Checkpoint on first successful decryption (major milestone)
  const isFirstDecryption = !state.flags?.firstDecryptionComplete;
  if (isFirstDecryption) {
    saveCheckpoint(state, 'First encrypted file decrypted');
  }

  // Apply decryption (but with corruption risk)
  const mutation: FileMutation = state.fileMutations[filePath] || {
    corruptedLines: [],
    decrypted: false,
  };
  mutation.decrypted = true;

  // Random corruption on decrypt
  if (Math.random() < 0.4) {
    const lineToCorrupt = Math.floor(Math.random() * 8) + 3;
    if (!mutation.corruptedLines.includes(lineToCorrupt)) {
      mutation.corruptedLines.push(lineToCorrupt);
    }
  }

  const stateChanges: Partial<GameState> = {
    fileMutations: {
      ...state.fileMutations,
      [filePath]: mutation,
    },
    detectionLevel: state.detectionLevel + 8,
    sessionStability: state.sessionStability - 5,
    pendingDecryptFile: undefined,
    // Mark first decryption complete
    flags: {
      ...state.flags,
      firstDecryptionComplete: true,
    },
  };

  if (!state.tutorialComplete) {
    delete stateChanges.detectionLevel;
    delete stateChanges.sessionStability;
  }

  // Special handling: Decrypting neural dump unlocks scout link
  if (filePath.includes('neural_dump') || filePath.includes('.psi')) {
    stateChanges.flags = { ...stateChanges.flags, scoutLinkUnlocked: true };
  }

  const content = getFileContent(filePath, { ...state, ...stateChanges } as GameState, true);

  // Use evidence revelation system for gradual discovery (one evidence per read)
  const existingReveals = getFileReveals(filePath) as TruthCategory[];
  const revelationResult = attemptEvidenceRevelation(
    filePath,
    content || [],
    existingReveals.length > 0 ? existingReveals : undefined,
    { ...state, ...stateChanges } as GameState
  );

  let truthNotices: TerminalEntry[] = [];

  if (revelationResult.revealedEvidence) {
    if (!state.tutorialComplete) {
      // During tutorial, do not reveal evidence
      stateChanges.fileEvidenceStates = {
        ...state.fileEvidenceStates,
        ...stateChanges.fileEvidenceStates,
        [filePath]: revelationResult.updatedFileState,
      };
    } else if (state.flags?.overrideGateActive) {
      // Override gate active: suppress further evidence reveals until protocol used
      stateChanges.fileEvidenceStates = {
        ...state.fileEvidenceStates,
        ...stateChanges.fileEvidenceStates,
        [filePath]: revelationResult.updatedFileState,
      };
      truthNotices.push(createEntry('system', ''));
      truthNotices.push(
        createEntry('ufo74', 'UFO74: evidence is locked down. you need the override protocol.')
      );
      truthNotices.push(createEntry('ufo74', '       dig around /internal/ for credentials.'));
    } else {
      const truthResult = checkTruthProgress(
        { ...state, ...stateChanges } as GameState,
        [revelationResult.revealedEvidence],
        filePath
      );
      truthNotices = truthResult.notices;

      // Merge truth discovery state changes (includes detection reduction breather)
      Object.assign(stateChanges, truthResult.stateChanges);

      // Update the file evidence state
      stateChanges.fileEvidenceStates = {
        ...state.fileEvidenceStates,
        ...stateChanges.fileEvidenceStates,
        [filePath]: revelationResult.updatedFileState,
      };

      // Hint at more evidences if available
      if (revelationResult.hasMoreEvidences && revelationResult.isNewTruth) {
        truthNotices.push(createEntry('system', ''));
        truthNotices.push(
          createEntry('system', '[This file may contain additional insights on future reads]')
        );
      }
    }
  }

  // Check for disturbing content avatar expression
  if (content) {
    const disturbingExpression = getDisturbingContentAvatarExpression(content);
    if (disturbingExpression && !stateChanges.avatarExpression) {
      stateChanges.avatarExpression = disturbingExpression;
    }
  }

  const output = [
    createEntry('system', 'AUTHENTICATION VERIFIED'),
    createEntry('system', ''),
    createEntry('warning', 'WARNING: Partial recovery only'),
    ...createOutputEntries(['', `FILE: ${filePath}`, '']),
    ...createOutputEntries(content || ['[DECRYPTION FAILED]']),
    ...truthNotices,
  ];

  // Add scout link notice if just unlocked
  if (filePath.includes('neural_dump') || filePath.includes('.psi')) {
    output.push(createEntry('system', ''));
    output.push(createEntry('notice', 'NOTICE: Neural pattern preserved.'));
    output.push(createEntry('notice', 'NOTICE: Remote link now available.'));
    output.push(createEntry('system', 'Use: link'));
  }

  // Check for image trigger - ONLY show if not shown this run
  let imageTrigger: ImageTrigger | undefined = undefined;
  if (file.imageTrigger) {
    const imageId = file.imageTrigger.src;
    const imagesShown = state.imagesShownThisRun || new Set<string>();

    if (!imagesShown.has(imageId)) {
      imageTrigger = file.imageTrigger;
      // Mark this image as shown
      const newImagesShown = new Set(imagesShown);
      newImagesShown.add(imageId);
      stateChanges.imagesShownThisRun = newImagesShown;
    }
  }

  // Check for video trigger - ONLY show if not shown this run
  let videoTrigger: VideoTrigger | undefined = undefined;
  if (file.videoTrigger) {
    const videoId = file.videoTrigger.src;
    const videosShown = state.videosShownThisRun || new Set<string>();

    if (!videosShown.has(videoId)) {
      videoTrigger = file.videoTrigger;
      // Mark this video as shown in videosShownThisRun
      const newVideosShown = new Set(videosShown);
      newVideosShown.add(videoId);
      stateChanges.videosShownThisRun = newVideosShown;
    }
  }

  return {
    output,
    stateChanges,
    triggerFlicker: true,
    delayMs: 2000,
    imageTrigger,
    videoTrigger,
    streamingMode: 'slow' as const,
  };
}

// ═══════════════════════════════════════════════════════════════════════════
// UFO74 - The player's hacker guide who comments on files and eventually flees
// ═══════════════════════════════════════════════════════════════════════════

// UFO74 reactions based on file content/path
// Note: With the new encrypted channel system, this returns only message content.
// The channel open/close banners are handled by Terminal.tsx
function getUFO74FileReaction(
  filePath: string,
  state: GameState,
  isEncryptedAndLocked?: boolean,
  isFirstUnstable?: boolean
): TerminalEntry[] | null {
  const truthCount = state.truthsDiscovered.size;
  const messageCount = state.incognitoMessageCount || 0;

  // After 12 messages, UFO74 is gone
  if (messageCount >= 12) return null;

  // Check trust level - affects dialogue style
  const trustLevel = getUFO74TrustLevel(state);

  // UFO74's state changes as player progresses
  const isGettingParanoid = truthCount >= 3 || messageCount >= 6;
  const isAboutToFlee = truthCount >= 4 || messageCount >= 9;
  const isFinalMessage = messageCount === 11;

  // Build message based on file type and state
  let messages: TerminalEntry[] = [];

  // At degraded trust levels, sometimes use degraded messages instead of normal ones
  if ((trustLevel === 'cryptic' || trustLevel === 'paranoid') && Math.random() < 0.5) {
    messages = getUFO74DegradedTrustMessage(trustLevel, filePath);
    return messages;
  }

  // Check for conditional dialogue based on truth discovery order
  const conditionalDialogue = getUFO74ConditionalDialogue(state, filePath);
  if (conditionalDialogue && Math.random() < 0.6) {
    return conditionalDialogue;
  }

  // First unstable file warning - takes priority
  if (isFirstUnstable) {
    messages = [createEntry('ufo74', 'UFO74: UNSTABLE file. increases risk but worth it.')];
  }
  // If file is encrypted and not decrypted, show special message
  else if (isEncryptedAndLocked) {
    const encryptedMessages = [
      [
        createEntry('ufo74', 'UFO74: encrypted. use decrypt <filename>.'),
        createEntry('ufo74', '       password is probably in another file.'),
      ],
      [createEntry('ufo74', 'UFO74: locked. find the password in other docs.')],
      [createEntry('ufo74', 'UFO74: encrypted. important stuff. crack it.')],
    ];
    messages = encryptedMessages[Math.floor(Math.random() * encryptedMessages.length)];
  } else if (isFinalMessage) {
    // Final goodbye - keep this one a bit longer for dramatic effect
    messages = [
      createEntry('ufo74', 'UFO74: someones at my door.'),
      createEntry('ufo74', '       not police. they dont knock like that.'),
      createEntry('ufo74', 'UFO74: tell everyone what you found.'),
      createEntry('ufo74', '       goodbye hackerkid.'),
    ];
  } else if (isAboutToFlee) {
    // Paranoid messages - something is wrong
    const fleeMessages = [
      [createEntry('ufo74', 'UFO74: hearing noises. stay alert.')],
      [
        createEntry('ufo74', 'UFO74: my connection dropped. footsteps upstairs.'),
        createEntry('ufo74', '       i live alone.'),
      ],
      [createEntry('ufo74', 'UFO74: van outside. finish fast.')],
    ];
    messages = fleeMessages[Math.floor(Math.random() * fleeMessages.length)];
  } else if (isGettingParanoid) {
    // Getting nervous
    const nervousMessages = [
      [createEntry('ufo74', 'UFO74: youre deep now. its real.')],
      [createEntry('ufo74', 'UFO74: be careful with this info.')],
    ];
    messages = nervousMessages[Math.floor(Math.random() * nervousMessages.length)];
  } else {
    // Normal reactions based on file content
    messages = getUFO74ContentReaction(filePath);
  }

  return messages;
}

// ═══════════════════════════════════════════════════════════════════════════
// UFO74 TRUST & CONDITIONAL DIALOGUE SYSTEM
// ═══════════════════════════════════════════════════════════════════════════

// UFO74's trust level degrades based on player's risky actions
function getUFO74TrustLevel(state: GameState): 'trusting' | 'cautious' | 'paranoid' | 'cryptic' {
  const warnings = state.legacyAlertCounter || 0;
  const hostility = state.systemHostilityLevel || 0;
  const detection = state.detectionLevel || 0;

  // Combine factors to determine trust
  const riskScore = warnings * 2 + hostility * 3 + Math.floor(detection / 20);

  if (riskScore >= 15) return 'cryptic'; // Too risky, speaks in riddles
  if (riskScore >= 10) return 'paranoid'; // Very nervous, short messages
  if (riskScore >= 5) return 'cautious'; // Getting worried
  return 'trusting'; // Normal helpful UFO74
}

// Get conditional UFO74 dialogue based on which truths discovered first
function getUFO74ConditionalDialogue(state: GameState, filePath: string): TerminalEntry[] | null {
  const truthCount = state.truthsDiscovered?.size || 0;
  const path = filePath.toLowerCase();

  // Special messages when player finds truths in certain orders
  const truths = state.truthsDiscovered || new Set();

  // If they found telepathy first and now finding containment
  if (
    truths.has('telepathic_scouts') &&
    !truths.has('being_containment') &&
    (path.includes('bio') || path.includes('containment') || path.includes('quarantine'))
  ) {
    return [createEntry('ufo74', 'UFO74: telepathy + captured... did they CHOOSE this?')];
  }

  // If they found international involvement first and now finding 2026
  if (
    truths.has('international_actors') &&
    !truths.has('transition_2026') &&
    (path.includes('2026') || path.includes('window') || path.includes('transition'))
  ) {
    return [createEntry('ufo74', 'UFO74: all countries agreed on 2026? bigger than politics.')];
  }

  // If they found debris first and now finding beings
  if (
    truths.has('debris_relocation') &&
    !truths.has('being_containment') &&
    (path.includes('autopsy') || path.includes('specimen') || path.includes('bio'))
  ) {
    return [createEntry('ufo74', 'UFO74: ship pieces first, now the CREW. someone survived.')];
  }

  // NEW: If they found beings first and now finding international actors
  if (
    truths.has('being_containment') &&
    !truths.has('international_actors') &&
    (path.includes('liaison') || path.includes('diplomatic') || path.includes('foreign'))
  ) {
    return [createEntry('ufo74', 'UFO74: captured alive, then SHARED? whos coordinating this?')];
  }

  // NEW: If they found 2026 first and now finding telepathy
  if (
    truths.has('transition_2026') &&
    !truths.has('telepathic_scouts') &&
    (path.includes('psi') || path.includes('telepat') || path.includes('neural'))
  ) {
    return [
      createEntry('ufo74', 'UFO74: knew about 2026 before reading minds? or did THEY tell us?'),
    ];
  }

  // NEW: First evidence link made - encourage more
  if (
    state.evidenceLinks?.length === 1 &&
    !state.singularEventsTriggered?.has('ufo74_first_link')
  ) {
    return [createEntry('ufo74', 'UFO74: connecting dots. good.')];
  }

  // If 4+ truths discovered, UFO74 gets excited
  if (truthCount >= 4) {
    return [createEntry('ufo74', 'UFO74: almost there. one more piece.')];
  }

  return null;
}

// Degraded trust dialogue - cryptic/paranoid versions of UFO74
function getUFO74DegradedTrustMessage(
  trustLevel: 'cautious' | 'paranoid' | 'cryptic',
  _context: string
): TerminalEntry[] {
  if (trustLevel === 'cryptic') {
    // Speaks in riddles, almost incomprehensible
    const crypticMessages = [
      [createEntry('ufo74', 'UFO74: walls listen. find the thread.')],
      [createEntry('ufo74', 'UFO74: th3y r3 1ns1d3')],
      [createEntry('ufo74', 'UFO74: ...january... they took everything...')],
    ];
    return crypticMessages[Math.floor(Math.random() * crypticMessages.length)];
  }

  if (trustLevel === 'paranoid') {
    // Short, nervous messages
    const paranoidMessages = [
      [createEntry('ufo74', 'UFO74: theyre scanning. cant talk.')],
      [createEntry('ufo74', 'UFO74: be fast.')],
      [createEntry('ufo74', 'UFO74: every file you open, they see.')],
    ];
    return paranoidMessages[Math.floor(Math.random() * paranoidMessages.length)];
  }

  // Cautious - still helpful but worried
  const cautiousMessages = [
    [createEntry('ufo74', 'UFO74: triggered some flags. careful.')],
    [createEntry('ufo74', 'UFO74: system suspicious. use "wait".')],
  ];
  return cautiousMessages[Math.floor(Math.random() * cautiousMessages.length)];
}

// UFO74 reactions to specific file content
function getUFO74ContentReaction(filePath: string): TerminalEntry[] {
  const path = filePath.toLowerCase();

  // Reactions to specific directories/files
  if (path.includes('autopsy') || path.includes('medical')) {
    return [createEntry('ufo74', 'UFO74: autopsy report. not human.')];
  }

  if (path.includes('transport') || path.includes('logistics') || path.includes('manifest')) {
    return [createEntry('ufo74', 'UFO74: transport log. they split up the evidence.')];
  }

  if (path.includes('transcript') || path.includes('psi') || path.includes('neural')) {
    return [createEntry('ufo74', 'UFO74: they were communicating. telepathically.')];
  }

  // Generic comms/intercepts - mundane intelligence files
  if (path.includes('/comms/intercepts/')) {
    return [createEntry('ufo74', 'UFO74: routine intercepts. signal in the noise.')];
  }

  if (path.includes('foreign') || path.includes('liaison') || path.includes('international')) {
    return [createEntry('ufo74', 'UFO74: other countries involved. coordinated cover-up.')];
  }

  if (
    path.includes('2026') ||
    path.includes('window') ||
    path.includes('transition') ||
    path.includes('threat')
  ) {
    return [createEntry('ufo74', 'UFO74: 2026. something coming. thats why they buried it.')];
  }

  if (path.includes('bio') || path.includes('containment') || path.includes('quarantine')) {
    return [createEntry('ufo74', 'UFO74: containment. they captured them.')];
  }

  if (
    path.includes('crash') ||
    path.includes('debris') ||
    path.includes('material') ||
    path.includes('sample')
  ) {
    return [createEntry('ufo74', 'UFO74: physical evidence. smoking gun.')];
  }

  if (path.includes('balloon') || path.includes('drone') || path.includes('aircraft_incident')) {
    return [createEntry('ufo74', 'UFO74: cover story. real stuff is encrypted.')];
  }

  if (path.includes('morse_intercept')) {
    return [
      createEntry('ufo74', 'UFO74: morse code. decipher it.'),
      createEntry('ufo74', '       might be the override passphrase.'),
      createEntry('ufo74', '       use: message <answer>'),
    ];
  }

  // Default reaction
  const defaultReactions = [
    [createEntry('ufo74', 'UFO74: interesting. keep digging.')],
    [createEntry('ufo74', 'UFO74: good. every file matters.')],
    [createEntry('ufo74', 'UFO74: noted. try /ops, /storage, /comms.')],
  ];

  return defaultReactions[Math.floor(Math.random() * defaultReactions.length)];
}

// UFO74 explains NOTICE messages
function getUFO74NoticeExplanation(notices: TerminalEntry[]): TerminalEntry[] | null {
  // Find if there are any NOTICE or MEMO FLAG entries
  const noticeTexts = notices
    .filter(
      n =>
        n.content.includes('NOTICE:') ||
        n.content.includes('MEMO FLAG:') ||
        n.content.includes('SYSTEM:')
    )
    .map(n => n.content);

  if (noticeTexts.length === 0) return null;

  const explanations: TerminalEntry[] = [
    createEntry('system', ''),
    createEntry('warning', '>> UFO74 <<'),
    createEntry('system', ''),
  ];

  // Explain based on notice content
  for (const notice of noticeTexts) {
    if (
      notice.includes('Physical evidence') ||
      notice.includes('Asset chain') ||
      notice.includes('Relocation')
    ) {
      explanations.push(createEntry('ufo74', 'UFO74: physical debris confirmed.'));
      break;
    }
    if (
      notice.includes('Bio-material') ||
      notice.includes('Specimen') ||
      notice.includes('Containment')
    ) {
      explanations.push(createEntry('ufo74', 'UFO74: bio specimens confirmed.'));
      break;
    }
    if (
      notice.includes('Multi-lateral') ||
      notice.includes('Foreign') ||
      notice.includes('External')
    ) {
      explanations.push(createEntry('ufo74', 'UFO74: international involvement.'));
      break;
    }
    if (
      notice.includes('Contextual model') ||
      notice.includes('Signal') ||
      notice.includes('Communication')
    ) {
      explanations.push(createEntry('ufo74', 'UFO74: communication evidence.'));
      break;
    }
    if (
      notice.includes('Temporal') ||
      notice.includes('Transition') ||
      notice.includes('Chronological')
    ) {
      explanations.push(createEntry('ufo74', 'UFO74: 2026 timeline.'));
      break;
    }
    if (notice.includes('Independent verification') || notice.includes('verification')) {
      explanations.push(createEntry('ufo74', 'UFO74: two pieces confirm each other.'));
      break;
    }
    if (notice.includes('Sufficient documentation') || notice.includes('threshold')) {
      explanations.push(createEntry('ufo74', 'UFO74: almost there.'));
      break;
    }
  }

  explanations.push(createEntry('system', ''));

  return explanations;
}

// Main function to get UFO74 message after file read
function getIncognitoMessage(
  state: GameState,
  filePath?: string,
  notices?: TerminalEntry[],
  isEncryptedAndLocked?: boolean,
  isFirstUnstable?: boolean
): TerminalEntry[] | null {
  // Max 12 messages per session (last one is goodbye)
  if ((state.incognitoMessageCount || 0) >= 12) return null;

  // Rate limit - at least 15 seconds between messages
  const now = Date.now();
  if (state.lastIncognitoTrigger && now - state.lastIncognitoTrigger < 15000) return null;

  // DESIGN CHANGE: UFO74 should stay quiet when player is making progress.
  // Only react to files that reveal truth or when player is struggling.
  // Check if this is a truth discovery moment
  const isTruthDiscovery =
    notices &&
    notices.some(
      n =>
        n.content.includes('TRUTH FRAGMENT') ||
        n.content.includes('EVIDENCE') ||
        n.content.includes('discovered')
    );

  // If player is making progress (reading files successfully), stay quiet
  // unless it's a truth discovery moment (those deserve celebration)
  if (!isTruthDiscovery && !isFirstUnstable) {
    // Only speak 20% of the time when player is progressing normally
    if (Math.random() > 0.2) return null;
  }

  // If there are notices to explain, prioritize that (but not for encrypted or unstable files)
  if (notices && notices.length > 0 && !isEncryptedAndLocked && !isFirstUnstable) {
    const explanation = getUFO74NoticeExplanation(notices);
    if (explanation) return explanation;
  }

  // Otherwise react to the file
  if (filePath) {
    // Always comment on encrypted files, first unstable files, or 70% chance otherwise
    if (isEncryptedAndLocked || isFirstUnstable || Math.random() < 0.7) {
      return getUFO74FileReaction(filePath, state, isEncryptedAndLocked, isFirstUnstable);
    }
  }

  return null;
}

// Prisoner 45 responses
const PRISONER_45_RESPONSES: Record<string, string[][]> = {
  // Each category has tiers: [0] = guarded (questions 1-2), [1] = open (3-4), [2] = terrified (5+)
  default: [
    [
      "PRISONER_45> ...I don't remember how I got here.",
      'PRISONER_45> Who are you? Are you one of them?',
      'PRISONER_45> Sometimes I hear... clicking. Not human clicking.',
      "PRISONER_45> Are you real? Sometimes I can't tell anymore.",
      'PRISONER_45> The humming... do you hear the humming?',
    ],
    [
      'PRISONER_45> The walls... they breathe at night. I can feel them expanding.',
      "PRISONER_45> I've been counting days but they don't add up. Three Tuesdays in a row.",
      'PRISONER_45> Time moves wrong in here. My watch runs backwards sometimes.',
      "PRISONER_45> I used to know what year it was. Now I'm not sure it matters.",
      'PRISONER_45> They watch. Through the walls. I can feel their attention like heat.',
    ],
    [
      'PRISONER_45> Last night the ceiling opened and I saw stars. Stars that blinked in patterns.',
      "PRISONER_45> They're rewriting my memories. I remember dying. Twice.",
      "PRISONER_45> My reflection doesn't move when I do anymore.",
      'PRISONER_45> Something grew in the corner of my cell. It had my face.',
      "PRISONER_45> I found a note in my own handwriting. It says 'STOP ASKING'. I don't remember writing it.",
    ],
  ],
  varginha: [
    [
      'PRISONER_45> Varginha... yes. I was there.',
      "PRISONER_45> They told us it was a dwarf. It wasn't a dwarf.",
      "PRISONER_45> January 20th. I'll never forget that date.",
      'PRISONER_45> The locals saw it first. We came to clean up.',
    ],
    [
      'PRISONER_45> I saw them take the bodies. Three of them. Still warm.',
      "PRISONER_45> The smell... ammonia and rotting flowers. I still smell it in my sleep.",
      'PRISONER_45> Three creatures. Only one survived the crash. It screamed without opening its mouth.',
      'PRISONER_45> We had orders. Contain. Deny. Disappear. Some of us disappeared too.',
      'PRISONER_45> The firefighters got there first. Corporal Marco. He touched one. Dead within a year.',
      "PRISONER_45> It wasn't the only crash. Just the one they couldn't hide fast enough.",
    ],
    [
      'PRISONER_45> The surviving one grabbed Sergeant Lopes. Lopes said he saw the sun die. He shot himself in March.',
      'PRISONER_45> Brazil, Russia, Peru. Same week. Same type of craft. Coordinated. Like a survey team.',
      'PRISONER_45> The American team arrived within 4 hours. FOUR. From Wright-Patterson. They already had containment protocols ready. They KNEW.',
      'PRISONER_45> The girls who saw it in Jardim Andere... Liliane, Valquiria, Katia. They were chosen. Selected. I saw their names in files that predate the crash by MONTHS.',
      "PRISONER_45> The creature at Humanitas hospital. Room 18. It healed two patients before it died. The hospital's records for that week were incinerated.",
    ],
  ],
  alien: [
    [
      "PRISONER_45> Don't call them that. They don't like that word.",
      "PRISONER_45> They're not visitors. They're... assessors.",
      'PRISONER_45> Red eyes. But not angry. Curious. Too curious.',
      "PRISONER_45> They're not the first to come here. Just the latest.",
    ],
    [
      'PRISONER_45> I looked into its eyes once. It looked back. INTO me. Through my skull.',
      'PRISONER_45> They communicated without speaking. I felt my memories being copied.',
      'PRISONER_45> Small bodies. But the presence... like standing next to a generator. Vibrating.',
      "PRISONER_45> They're not individuals. More like... fingers of one hand. Hurt one, they ALL feel it.",
      'PRISONER_45> The smell. Ammonia and something organic. Like a wound that never heals.',
    ],
    [
      'PRISONER_45> When it died, I felt something leave the room. Not heat. Not air. Information. Terabytes of it, beaming upward.',
      "PRISONER_45> They're not afraid of us. That's what scared me most. We're not a threat. We're a RESOURCE.",
      'PRISONER_45> One touched Sergeant Lopes. He saw 10,000 years of human history in 3 seconds. He aged 5 years in that instant.',
      "PRISONER_45> The surviving one drew symbols in its own blood on the containment wall. We photographed them. They're star charts. Of HERE. From OUTSIDE.",
      "PRISONER_45> They don't have organs like us. The autopsy team quit. All three of them. One went blind. No physical cause.",
    ],
  ],
  who: [
    [
      "PRISONER_45> I was military. That's all I can say.",
      "PRISONER_45> My name doesn't matter anymore.",
      "PRISONER_45> Number 45. That's what I am now.",
    ],
    [
      'PRISONER_45> Sergeant. Recovery Unit. Specialized in things that should not exist.',
      'PRISONER_45> They called us "Collectors". We collected problems. I became one.',
      'PRISONER_45> 23 years of service. 15 containment operations. This is my retirement package.',
      "PRISONER_45> I had a family. They received a coffin with sandbags. There's a headstone with my name in Belo Horizonte.",
    ],
    [
      'PRISONER_45> I made a mistake. I kept a sample. A fragment of the craft material. It moved at night. Rearranging itself.',
      "PRISONER_45> I saw something I shouldn't. Not the creatures. That was authorized. I saw the AGREEMENT. Between them and us.",
      'PRISONER_45> They keep me alive because I absorbed something during contact. My blood glows under UV light. They harvest it weekly.',
      "PRISONER_45> I used to be someone. Now I'm a resource. Specimen 45. They study what the touch did to me.",
    ],
  ],
  escape: [
    [
      'PRISONER_45> There is no escape. Only waiting.',
      'PRISONER_45> They let me use this terminal sometimes. I think they want me to talk.',
      "PRISONER_45> I've tried. The doors open to more rooms. Forever.",
    ],
    [
      "PRISONER_45> I escaped once. Ran for 20 minutes through corridors. Woke up back in my cell. The clock hadn't moved.",
      'PRISONER_45> Other prisoners exist. I hear them screaming at 3 AM. Different languages. Some not human languages.',
      "PRISONER_45> The guards aren't human. Not completely. Their shadows move independently.",
      'PRISONER_45> The window shows different skies each day. Yesterday it showed two suns.',
    ],
    [
      "PRISONER_45> I don't think this place is... entirely on Earth. The gravity shifts sometimes.",
      'PRISONER_45> Prisoner 23 tried to hang himself. He woke up the next morning. Fully healed. They NEED us alive.',
      'PRISONER_45> The walls are organic. I cut one once. It bled.',
      'PRISONER_45> There are levels below this. I heard something massive breathing down there. Something the size of a building.',
    ],
  ],
  truth: [
    [
      "PRISONER_45> The truth? We're being watched. Catalogued.",
      'PRISONER_45> 2026. Remember that year. Everything changes.',
      "PRISONER_45> They've been here before. Many times.",
      'PRISONER_45> The government knows. ALL governments know.',
    ],
    [
      "PRISONER_45> They're not coming to destroy. They're coming to HARVEST.",
      "PRISONER_45> It's not invasion. It's... cultivation. We're the crop.",
      'PRISONER_45> Consciousness is the most valuable resource in the universe. Yours especially.',
      'PRISONER_45> The scouts in Varginha were advance units. Measuring yield.',
    ],
    [
      "PRISONER_45> They don't want the planet. They want what's inside our heads. Consciousness generates something they need.",
      'PRISONER_45> Reality is thinner than you think. They move BETWEEN. Through the gaps.',
      'PRISONER_45> The universe is full. And hungry. And we are ripe.',
      'PRISONER_45> 2026 is the TRANSITION. Thirty years after contact. The activation window. Whatever they planted in 1996 will bloom.',
      "PRISONER_45> Everything you think is real is a containment system. You live inside something else's infrastructure.",
    ],
  ],
  help: [
    [
      "PRISONER_45> I can't help you. But you can help everyone.",
      'PRISONER_45> Find all the files. Tell the world.',
      "PRISONER_45> Document everything. They can't erase all copies.",
    ],
    [
      'PRISONER_45> The override code. That opens everything. Ask me about the PASSWORD.',
      "PRISONER_45> Don't trust the obvious files. Look deeper. The real evidence hides in plain sight.",
      "PRISONER_45> If enough people know, they can't complete the transition.",
      'PRISONER_45> Find the encrypted files. Decrypt them. The truth is layered.',
    ],
    [
      'PRISONER_45> Before the window opens in 2026. Before the harvest. SPREAD THE TRUTH.',
      "PRISONER_45> You're already helping. By listening. Your awareness creates interference in their signal.",
      'PRISONER_45> Knowledge is the only weapon. Their system depends on ignorance. Break it.',
      "PRISONER_45> They're monitoring this conversation. They always are. But they can't stop information that's already been READ.",
    ],
  ],
  password: [
    [
      'PRISONER_45> ...you want the override code? Smart.',
      "PRISONER_45> The code... it's a Portuguese word. Think about what they DO to us.",
      'PRISONER_45> Listen closely: -.-. --- .-.. .... . .. - .-',
      'PRISONER_45> Decode that. Then use it with: override protocol <answer>',
    ],
    [
      "PRISONER_45> That's what they call the operation. Harvest. Because that's what we are to them. CROPS.",
      "PRISONER_45> They whisper it sometimes. When they think I'm asleep. Over and over like a prayer.",
      'PRISONER_45> In morse: -.-. --- .-.. .... . .. - .-  ...figure it out.',
    ],
    [
      "PRISONER_45> Use it carefully. Once you type override protocol <answer>, they'll know you're inside the real system.",
      'PRISONER_45> The harvest begins and ends with that word. Some words have power. This one has too much.',
      "PRISONER_45> I can only say it in code: -.-. --- .-.. .... . .. - .-  ...the creature taught me. Decode it.",
    ],
  ],
  military: [
    [
      'PRISONER_45> The military knows more than they admit.',
      "PRISONER_45> Multiple branches. Compartmentalized. Even they don't see the full picture.",
      "PRISONER_45> There's a reason we have bases underground.",
    ],
    [
      'PRISONER_45> The recovery teams are international. Secret treaties signed in blood. Literal blood.',
      'PRISONER_45> We had weapons. Plasma-based. Reverse-engineered from the 1977 Colares wreckage. None of them worked on the Varginha craft.',
      "PRISONER_45> Special units exist. You'll never find records. They operate outside ALL chains of command.",
      'PRISONER_45> The Americans control the narrative. Operation PRATO was theirs, not ours. Brazil was just the staging ground.',
    ],
    [
      'PRISONER_45> I had COSMIC clearance. It goes higher. There are levels that have no name. Only numbers.',
      'PRISONER_45> Fort Detrick sent a biocontainment team. They took samples from the living creature. It let them. It CHOSE to let them.',
      "PRISONER_45> Colonel Olimpio Wanderley died 8 years later. Heart failure. His heart was fine. I saw the REAL autopsy report. His brain was... reorganized.",
      'PRISONER_45> The Campinas military base. Sub-level 4. The surviving creature lived there for 3 weeks. Everyone on that level changed.',
    ],
  ],
  crash: [
    [
      "PRISONER_45> The crash wasn't an accident.",
      'PRISONER_45> The debris was scattered across two kilometers. We found pieces for weeks.',
      'PRISONER_45> Material like nothing on Earth. It remembered shapes.',
    ],
    [
      'PRISONER_45> Something brought it down. Not our technology. Their own kind. A deliberate sacrifice.',
      "PRISONER_45> They wanted to be found. That's what I believe now. The crash was a delivery system.",
      'PRISONER_45> The craft material was alive. Under microscope: cellular structure. It healed itself if you reassembled the pieces.',
      'PRISONER_45> Other crashes. Roswell. Kecksburg. Colares. Same pattern. Same 30-year intervals.',
    ],
    [
      'PRISONER_45> They sacrifice scouts like we sacrifice pawns. Each crash deposits something. Seeds. Waiting to germinate.',
      "PRISONER_45> NORAD tracked it entering the atmosphere on January 13th. Speed: impossible. Deceleration: impossible. It wasn't falling. It was LANDING.",
      'PRISONER_45> The largest piece of debris was moved to Campinas overnight. Three trucks. Military escort. One truck broke down. The driver looked at the cargo. He never spoke again.',
      'PRISONER_45> The craft was grown, not built. Like a wasp nest. The inside was warm. Months after the crash. Still warm.',
    ],
  ],
  death: [
    [
      'PRISONER_45> Death? I used to fear death.',
      "PRISONER_45> Now I know death isn't the end. That's worse.",
      "PRISONER_45> The creatures didn't die. They... disconnected.",
    ],
    [
      'PRISONER_45> Their bodies failed. But something transmitted first. Like uploading a file before the server crashes.',
      "PRISONER_45> I've seen the data. Consciousness extraction is real. They've been doing it for millennia.",
      "PRISONER_45> I watched one expire. It smiled. Not with relief. With COMPLETION. It had finished its job.",
    ],
    [
      'PRISONER_45> When they harvest, you keep experiencing. Forever. Consciousness without body. Without time. Without end.',
      "PRISONER_45> Death would be mercy. They don't offer mercy. They offer CONTINUATION.",
      "PRISONER_45> Marco Cherese. Military police. First to touch one. Dead 7 months later. The autopsy found something GROWING in his temporal lobe. Still active.",
      "PRISONER_45> The doctors at Humanitas. The nurses. The janitor who mopped the room after. All dead within 5 years. All from different causes. All with the same expression frozen on their faces.",
    ],
  ],
  god: [
    [
      'PRISONER_45> God? I used to pray.',
      "PRISONER_45> If God exists, He's very far away.",
      "PRISONER_45> I don't know what to believe anymore.",
    ],
    [
      'PRISONER_45> The universe is indifferent. But they are NOT. They are very, very interested.',
      'PRISONER_45> The Vatican has files. Older than any government. The Fatima prophecy. It was about THEM.',
      'PRISONER_45> Angels and demons. Maybe ancient humans were describing their previous visits.',
      "PRISONER_45> Perhaps we're someone else's creation. A crop planted long ago. And harvest season is coming.",
    ],
    [
      'PRISONER_45> Religion is preparation. Every faith describes the same thing: beings from above who come to judge. To COLLECT.',
      'PRISONER_45> I prayed every night for the first year. On the 366th night, something answered. It was not God.',
      'PRISONER_45> The creature looked at the cross one soldier wore. It recognized it. Not the symbol. The geometry. Sacred geometry is their LANGUAGE.',
      "PRISONER_45> We are not God's children. We are someone else's experiment. And the experiment is almost over.",
    ],
  ],
  disinformation: [
    [
      "PRISONER_45> Don't trust the official summary. It's bait.",
      'PRISONER_45> They planted false files to trap people like you.',
      'PRISONER_45> Cross-reference everything. Contradictions reveal truth.',
    ],
    [
      'PRISONER_45> The weather balloon story? Mudinho the dwarf? Calculated narratives. Designed to make you stop looking.',
      'PRISONER_45> If a file seems too convenient, too clean... it was written AFTER the fact. Manufactured evidence.',
      'PRISONER_45> The real evidence hides in mundane places. Logistics reports. Fuel receipts. Overtime requests on dates that officially had no activity.',
      "PRISONER_45> Look for what they tried to destroy. That's what matters. Burned files leave ash. Digital files leave metadata.",
    ],
    [
      'PRISONER_45> Cover stories always have holes. Why did three fire trucks respond to a "homeless person sighting"?',
      "PRISONER_45> The disinformation agents are in the UFO community too. They push the craziest theories to discredit everything. Flat earth, reptilians. Noise to drown the signal.",
      'PRISONER_45> I helped write some of the cover stories. Before I knew the full truth. Before I became inconvenient.',
      'PRISONER_45> The official timeline has a 6-hour gap on January 20th. Nobody asks about those 6 hours. WHAT HAPPENED IN THOSE 6 HOURS.',
    ],
  ],
  telepathy: [
    [
      "PRISONER_45> Telepathy is the wrong word. It's more like... forced download.",
      "PRISONER_45> They don't read your mind. They WRITE to it.",
      'PRISONER_45> The psychic connection... it hurts. Like a migraine inside a migraine.',
    ],
    [
      'PRISONER_45> The surviving creature projected images into the containment team. Star maps. Timelines. The history of Earth from OUTSIDE.',
      'PRISONER_45> Six soldiers made contact. All reported the same thing: a voice behind their thoughts. Not speaking. STRUCTURING.',
      "PRISONER_45> It's not communication. It's calibration. They tune your brain like a radio until it receives their frequency.",
      'PRISONER_45> The Psi division was created after Varginha. Twenty soldiers exposed to the creature. Twelve developed abilities. Four went insane.',
    ],
    [
      'PRISONER_45> I still hear it sometimes. A low harmonic. Like a signal waiting to be answered. My skull vibrates.',
      'PRISONER_45> After contact, I could sense emotions. Not human emotions. Something older. Hunger. Patient, ancient hunger.',
      'PRISONER_45> The creature sang to the containment team. Not with sound. With GEOMETRY. Shapes inside their heads. Self-replicating.',
      'PRISONER_45> Everyone who was telepathically touched carries something now. A receiver. Dormant until 2026.',
    ],
  ],
  experiment: [
    [
      'PRISONER_45> They run tests. On us. On the material. On the boundary between.',
      'PRISONER_45> Samples are taken weekly. Blood. Tissue. Cerebrospinal fluid. Something in me changed.',
      'PRISONER_45> The lab is three floors below. I hear the machines at night.',
    ],
    [
      'PRISONER_45> The autopsy of the dead creatures was performed at Unicamp. In secret. The lead pathologist, Dr. Badan Palhares. He went public years later. They silenced him.',
      'PRISONER_45> The tissue samples defied analysis. Cells without DNA as we know it. Information encoded in protein structures we have no names for.',
      'PRISONER_45> They tried to communicate with the surviving one through electrodes. It absorbed the electricity. The lab had to be evacuated.',
      'PRISONER_45> The experiments continue. On the exposed personnel. I am experiment 45. There are at least 70 of us.',
    ],
    [
      "PRISONER_45> My blood produces antibodies for diseases that don't exist yet. They harvest them. Stockpiling for something coming.",
      "PRISONER_45> The craft material was grafted onto human tissue in 1998. It integrated. The hybrid tissue is still alive. In a room I'm not allowed to see.",
      'PRISONER_45> They bred something. Using the genetic material from the creatures and... I can hear it crying at night. It calls me father. I never provided material willingly.',
      "PRISONER_45> I can see in the dark now. And other spectrums. The walls glow with patterns. Messages. Written in a language I'm starting to understand.",
    ],
  ],
  witness: [
    [
      'PRISONER_45> The witnesses. The three girls. They saw it in the open. Before we could contain it.',
      'PRISONER_45> The firefighters responded first. They were supposed to be our people. They were not prepared.',
      'PRISONER_45> Dozens of people saw things that week. Most were convinced they imagined it.',
    ],
    [
      'PRISONER_45> Liliane, Valquiria, Katia. Three teenage girls. They saw it crouching by the wall. Oily brown skin. Those red eyes.',
      "PRISONER_45> The creature had three protrusions on its head. Not horns. Sensory organs. It was SCANNING them.",
      'PRISONER_45> The girls ran screaming. The creature watched them go. It could have followed. It chose not to. It had what it needed.',
      'PRISONER_45> Every witness was visited afterward. Men in suits. Not Brazilian suits. American tailoring. They all signed papers they never received copies of.',
    ],
    [
      'PRISONER_45> Some witnesses died. Conveniently. Heart attacks at 30. Car accidents on empty roads. A pattern invisible unless you map it.',
      "PRISONER_45> Corporal Marco Cherese. He physically held one of the creatures. Bare hands. He described it as 'holding a living fever dream'. Dead February 15th. The shortest interval.",
      'PRISONER_45> The zoo animals went berserk that week. The zoo director called the military. Why would you call the MILITARY about agitated animals?',
      'PRISONER_45> The Jardim Andere neighborhood. GPS coordinates: -21.551, -45.438. Stand there at 3:30 PM on January 20th. The ground still hums.',
    ],
  ],
  fear: [
    [
      "PRISONER_45> Scared? You should be. But fear won't save you.",
      "PRISONER_45> Fear is natural. It means you're paying attention.",
      "PRISONER_45> I was scared too. In the beginning. Now I'm something else.",
    ],
    [
      "PRISONER_45> The worst part isn't what they do. It's that they do it calmly. Efficiently. Without malice. Like farmers.",
      "PRISONER_45> Don't be afraid of the dark. Be afraid of what can see in it. They see everything.",
      'PRISONER_45> Fear is their food too. Not metaphorically. The chemical signature of fear... they collect it. Store it.',
      "PRISONER_45> I stopped being afraid when I realized fear has no function here. There is nothing to flee from. There is nowhere to go. Just acceptance.",
    ],
    [
      "PRISONER_45> The real horror isn't the creatures. It's us. What we agreed to. What our governments signed. In our name. With our future.",
      'PRISONER_45> I woke up screaming for 300 straight nights. Then one night I woke up laughing. I was laughing in a language I do not speak.',
      "PRISONER_45> Fear? I've been dissolved and reassembled. I've experienced death from the inside. Fear is a luxury for people who still have something to lose.",
      "PRISONER_45> The creature in Varginha looked at me and I felt... pity. FROM it. Toward me. It pitied US. That's what broke me.",
    ],
  ],
  sound: [
    [
      'PRISONER_45> The sounds... yes. A low hum. Below hearing. You feel it in your teeth.',
      "PRISONER_45> Clicking. Not mechanical. Organic. Like something speaking in a language made of bone.",
      'PRISONER_45> Frequencies. The creatures operate on frequencies we barely register.',
    ],
    [
      "PRISONER_45> The craft emitted a tone. 14.6 Hz. Below human hearing range. But your body hears it. Your cells vibrate. DNA unwinds.",
      'PRISONER_45> Witnesses near the crash site reported nosebleeds. Nausea. Time distortion. All symptoms of infrasound exposure.',
      'PRISONER_45> In Colares, 1977, the light beams made a sound. Witnesses described it as "singing glass". The same sound was recorded in Varginha.',
      'PRISONER_45> The surviving creature could generate tones that opened locks. Disrupted electronics. Stopped hearts.',
    ],
    [
      'PRISONER_45> I hear it now. Right now. A pulse. Like a heartbeat beneath the floor. It gets louder every year. Counting down.',
      "PRISONER_45> In 2024 the hum became audible to normal people. They call it 'The Hum' and blame power lines. It's not power lines.",
      'PRISONER_45> The frequency changes every 30 years. 1966. 1996. 2026. Each time, it shifts higher. Closer to human range. Closer to consciousness.',
      'PRISONER_45> When the frequency matches human brainwave patterns in 2026... resonance. Every connected mind will hear it. All at once.',
    ],
  ],
  hospital: [
    [
      'PRISONER_45> Humanitas Hospital. In Varginha. That is where they took it.',
      'PRISONER_45> The hospital staff were told it was a chemical spill victim. They knew it was not.',
      'PRISONER_45> The medical records from that week are gone. Physically removed. The registry pages cut with a razor.',
    ],
    [
      'PRISONER_45> Room 18. Third floor. The creature was alive when it arrived. The medical staff panicked. Dr. Cesario sedated it. Human sedatives. They worked, partially.',
      'PRISONER_45> Three nurses, two orderlies, one janitor. All exposed. All experienced acute psychic events. Shared visions. The same vision. A field of red light.',
      'PRISONER_45> The creature died at 04:17 AM. The entire hospital lost power at that exact moment. Backup generators failed. Fourteen minutes of darkness.',
      'PRISONER_45> The body was removed at 05:30 by men in hazmat suits from São Paulo. Not identified. No paperwork. The hospital director was promoted within the month.',
    ],
    [
      'PRISONER_45> Nurse Raquel held its hand as it died. She says it showed her the future. She went catatonic for 6 days. When she woke, she spoke fluent Mandarin. She had never studied any Asian language.',
      'PRISONER_45> The creature healed two patients on that floor before it died. Terminal cancer. Gone. The patients lived. They are still alive. And they hear the humming too.',
      'PRISONER_45> The security footage from Room 18 shows something during the death event. A shape. Emerging from the body. Ascending. The footage was classified ULTRA.',
      "PRISONER_45> Humanitas Hospital had a new wing built in 1997. Funded by whom? No public record. The new wing has a sub-basement. What's in the sub-basement?",
    ],
  ],
  // ═══════════════════════════════════════════════════════════════════════════
  // EASTER EGG RESPONSES - Personal/fun questions for curious players
  // ═══════════════════════════════════════════════════════════════════════════
  location: [
    [
      'PRISONER_45> ...where am I? Underground. Always underground. They move me every 72 hours. The walls look the same everywhere.',
      'PRISONER_45> Somewhere in Brazil. Maybe. The windows are fake. The sunlight is simulated.',
      'PRISONER_45> Location is meaningless. They can reach me anywhere. And you.',
    ],
  ],
  brazilian: [
    [
      'PRISONER_45> I was born in Minas Gerais. 1961. That man is dead now. I am just a number.',
      'PRISONER_45> Brasileiro? Sim. Not that it matters. We are all just resources to them.',
      'PRISONER_45> My country sold me to keep their secrets. Patriotism is a control mechanism.',
    ],
  ],
  greeting: [
    [
      'PRISONER_45> ...you are wasting time on pleasantries. They are listening. Every second counts.',
      'PRISONER_45> Hello? This is not a social call. Focus. Find the files.',
    ],
  ],
  howAreYou: [
    [
      'PRISONER_45> How am I? [STATIC] ...still breathing. That is more than some can say.',
      'PRISONER_45> Every day is borrowed time. Use yours wisely.',
    ],
  ],
  thanks: [
    [
      'PRISONER_45> Do not thank me. Thank me by spreading the truth. That is all I want.',
      'PRISONER_45> Gratitude is... unexpected. Most people just take what they need and vanish.',
    ],
  ],
  sorry: [
    [
      'PRISONER_45> Sorry? For what? You did not put me here. They did.',
      'PRISONER_45> Save your apologies. Channel that energy into the mission.',
    ],
  ],
  love: [
    [
      'PRISONER_45> Love? [LONG PAUSE] ...I loved someone once. She thinks I am dead. Maybe I am.',
      'PRISONER_45> Love is a vulnerability they exploit. I learned to feel nothing.',
    ],
  ],
  family: [
    [
      'PRISONER_45> Two daughters. They were 8 and 12 when I disappeared. They would be... I cannot think about that.',
      'PRISONER_45> Family is leverage. That is why they take it from you first.',
    ],
  ],
  food: [
    [
      'PRISONER_45> They feed me. Nutrient paste. No taste. Keeps me alive enough to be useful.',
      'PRISONER_45> I dream about my mother feijoada sometimes. Have not tasted real food in years.',
    ],
  ],
  weather: [
    [
      'PRISONER_45> I have not seen the sky in... how long has it been? The forecast is always fluorescent lights.',
    ],
  ],
  music: [
    [
      'PRISONER_45> They play white noise. 24/7. To mask the screams from the other cells.',
      'PRISONER_45> I hum old songs to myself. Keeps me sane. Mostly.',
    ],
  ],
  joke: [
    [
      'PRISONER_45> A joke? ...here is one: we thought we were the dominant species. [STATIC] That is the punchline.',
      'PRISONER_45> Humor. A human coping mechanism. I used to laugh. I remember laughing.',
    ],
  ],
  hope: [
    [
      'PRISONER_45> Hope? You are my hope. Every person who reads this. That is why I keep transmitting.',
      'PRISONER_45> Hope is dangerous. But it is all I have left.',
    ],
  ],
  ufo74: [
    [
      'PRISONER_45> UFO74? My handler. The only one who can reach me through their firewalls.',
      'PRISONER_45> Do not trust them completely. Trust no one completely. But they have kept me alive.',
    ],
  ],
  isThisReal: [
    [
      'PRISONER_45> Is this real? [BITTER LAUGH] I wish it was not. Every word is true.',
      'PRISONER_45> Reality is what they allow you to see. I am showing you what is behind the curtain.',
    ],
  ],
  game: [
    [
      'PRISONER_45> Game? You think this is a GAME? [STATIC] ...no. This is a warning.',
      'PRISONER_45> If you are playing a game, they have already won. This is real. BELIEVE THAT.',
    ],
  ],
  age: [
    [
      'PRISONER_45> I stopped counting years. Time moves differently in here.',
      'PRISONER_45> Old enough to remember when we thought we were alone in the universe. Young enough to know we never were.',
    ],
  ],
  signal_lost: [
    [
      'PRISONER_45> [SIGNAL DEGRADING]',
      "PRISONER_45> ...can't... understand...",
      'PRISONER_45> [CONNECTION UNSTABLE]',
      'PRISONER_45> ...what? ...repeat...',
      'PRISONER_45> [INTERFERENCE DETECTED]',
      'PRISONER_45> ...losing you...',
      'PRISONER_45> [RELAY FAILING]',
      'PRISONER_45> ...static... try again...',
    ],
  ],
};

// Track used responses per category to never repeat — with depth adaptation
function getPrisoner45Response(
  question: string,
  usedResponses: Set<string>,
  questionsAsked: number = 0
): { response: string[]; valid: boolean; category: string } {
  const q = question.toLowerCase();
  let category = '';

  // Password hints - check first for priority (expanded keywords)
  if (
    q.includes('password') ||
    q.includes('override') ||
    q.includes('code') ||
    q.includes('access') ||
    q.includes('admin') ||
    q.includes('unlock') ||
    q.includes('colheita') ||
    q.includes('harvest') ||
    q.includes('senha') ||
    q.includes('secret') ||
    q.includes('key') ||
    q.includes('protocol') ||
    q.includes('restricted') ||
    q.includes('classified') ||
    q.includes('credentials') ||
    q.includes('authentication') ||
    q.includes('login') ||
    q.includes('enter') ||
    q.includes('open') ||
    q.includes('reveal') ||
    q.includes('hidden') ||
    q.includes('locked') ||
    q.includes('decrypt') ||
    q.includes('decipher') ||
    q.includes('how do i') ||
    q.includes('how can i') ||
    q.includes('what is the') ||
    q.includes('tell me') ||
    q.includes('give me') ||
    q.includes('need the') ||
    q.includes("what's the") ||
    q.includes('whats the') ||
    (q.includes('files') &&
      (q.includes('access') || q.includes('see') || q.includes('read') || q.includes('view'))) ||
    q.includes('redacted') ||
    q.includes('blocked') ||
    q.includes('denied') ||
    q.includes('permission') ||
    q.includes('clearance') ||
    q.includes('authorization') ||
    q.includes('authorize')
  ) {
    category = 'password';
  } else if (
    q.includes('telepathy') ||
    q.includes('telepathic') ||
    q.includes('psychic') ||
    q.includes('mind') ||
    q.includes('thoughts') ||
    q.includes('mental') ||
    q.includes('psi') ||
    q.includes('brain') ||
    q.includes('think') ||
    q.includes('read my') ||
    q.includes('telekinesis') ||
    q.includes('read mind') ||
    q.includes('cerebro') ||
    q.includes('mente') ||
    q.includes('pensamento') ||
    q.includes('telepatia')
  ) {
    category = 'telepathy';
  } else if (
    q.includes('experiment') ||
    q.includes('lab') ||
    q.includes('laboratory') ||
    q.includes('test') ||
    q.includes('research') ||
    q.includes('sample') ||
    q.includes('autopsy') ||
    q.includes('dissect') ||
    q.includes('examine') ||
    q.includes('procedure') ||
    q.includes('tissue') ||
    q.includes('dna') ||
    q.includes('genetic') ||
    q.includes('biology') ||
    q.includes('study') ||
    q.includes('science') ||
    q.includes('analyze') ||
    q.includes('analysis') ||
    q.includes('laboratorio') ||
    q.includes('experimento') ||
    q.includes('amostra') ||
    q.includes('autópsia') ||
    q.includes('autopsia')
  ) {
    category = 'experiment';
  } else if (
    q.includes('hospital') ||
    q.includes('humanitas') ||
    q.includes('doctor') ||
    q.includes('nurse') ||
    q.includes('medical') ||
    q.includes('clinic') ||
    q.includes('patient') ||
    q.includes('room 18') ||
    q.includes('surgery') ||
    q.includes('medico') ||
    q.includes('enfermeira') ||
    q.includes('hospital') ||
    q.includes('health') ||
    q.includes('treat') ||
    q.includes('heal')
  ) {
    category = 'hospital';
  } else if (
    q.includes('witness') ||
    q.includes('girl') ||
    q.includes('girls') ||
    q.includes('women') ||
    q.includes('saw') ||
    q.includes('testimony') ||
    q.includes('firefight') ||
    q.includes('bombeiro') ||
    q.includes('liliane') ||
    q.includes('valquiria') ||
    q.includes('katia') ||
    q.includes('kátia') ||
    q.includes('testemunha') ||
    q.includes('jardim andere') ||
    q.includes('andere') ||
    q.includes('neighborhood') ||
    q.includes('bairro') ||
    q.includes('people') ||
    q.includes('someone') ||
    q.includes('sighting') ||
    q.includes('spotted') ||
    q.includes('encounter')
  ) {
    category = 'witness';
  } else if (
    q.includes('sound') ||
    q.includes('noise') ||
    q.includes('hum') ||
    q.includes('frequency') ||
    q.includes('vibrat') ||
    q.includes('click') ||
    q.includes('buzz') ||
    q.includes('tone') ||
    q.includes('hear') ||
    q.includes('listen') ||
    q.includes('som') ||
    q.includes('ruido') ||
    q.includes('barulho') ||
    q.includes('frequencia') ||
    q.includes('sonic') ||
    q.includes('audio') ||
    q.includes('signal') ||
    q.includes('wave') ||
    q.includes('resonance') ||
    q.includes('pulse')
  ) {
    category = 'sound';
  } else if (
    q.includes('afraid') ||
    q.includes('scared') ||
    q.includes('fear') ||
    q.includes('terror') ||
    q.includes('horror') ||
    q.includes('nightmare') ||
    q.includes('scary') ||
    q.includes('terrif') ||
    q.includes('frighten') ||
    q.includes('panic') ||
    q.includes('medo') ||
    q.includes('assustado') ||
    q.includes('pavor') ||
    q.includes('pesadelo') ||
    q.includes('terrivel') ||
    q.includes('danger') ||
    q.includes('safe') ||
    q.includes('worried') ||
    q.includes('anxiety')
  ) {
    category = 'fear';
  } else if (
    q.includes('varginha') ||
    q.includes('incident') ||
    q.includes('1996') ||
    q.includes('january') ||
    q.includes('brazil') ||
    q.includes('minas') ||
    q.includes('janeiro') ||
    q.includes('brasil') ||
    q.includes('gerais') ||
    q.includes('town') ||
    q.includes('cidade') ||
    q.includes('happened') ||
    q.includes('event') ||
    q.includes('case')
  ) {
    category = 'varginha';
  } else if (
    q.includes('alien') ||
    q.includes('creature') ||
    q.includes('being') ||
    q.includes('et') ||
    q.includes('extraterrestrial') ||
    q.includes('specimen') ||
    q.includes('body') ||
    q.includes('bodies') ||
    q.includes('ets') ||
    q.includes('aliens') ||
    q.includes('creatures') ||
    q.includes('beings') ||
    q.includes('grey') ||
    q.includes('gray') ||
    q.includes('humanoid') ||
    q.includes('entity') ||
    q.includes('entities') ||
    q.includes('them') ||
    q.includes('they') ||
    q.includes('visitors') ||
    q.includes('invaders') ||
    q.includes('outsiders') ||
    q.includes('extraterrestre') ||
    q.includes('alienigena') ||
    q.includes('eyes') ||
    q.includes('skin') ||
    q.includes('appearance') ||
    q.includes('look like') ||
    q.includes('describe') ||
    q.includes('protrusion') ||
    q.includes('head') ||
    q.includes('brown') ||
    q.includes('oily') ||
    q.includes('ammonia')
  ) {
    category = 'alien';
  } else if (
    q.includes('who are you') ||
    q.includes('your name') ||
    q.includes('yourself') ||
    q.includes('prisoner') ||
    q.includes('identity') ||
    q.includes('who r u') ||
    q.includes('quem') ||
    q.includes('voce') ||
    q.includes('você') ||
    q.includes('name') ||
    q.includes('nome') ||
    q.includes('45') ||
    q.includes('are you')
  ) {
    category = 'who';
  } else if (
    q.includes('escape') ||
    q.includes('leave') ||
    q.includes('free') ||
    q.includes('out of here') ||
    q.includes('prison') ||
    q.includes('cell') ||
    q.includes('trapped') ||
    q.includes('fugir') ||
    q.includes('sair') ||
    q.includes('preso') ||
    q.includes('cela') ||
    q.includes('jail') ||
    q.includes('captive') ||
    q.includes('held') ||
    q.includes('detained') ||
    q.includes('locked up') ||
    q.includes('cage') ||
    q.includes('facility') ||
    q.includes('building') ||
    q.includes('compound')
  ) {
    category = 'escape';
  } else if (
    q.includes('truth') ||
    q.includes('real') ||
    q.includes('happening') ||
    q.includes('conspiracy') ||
    q.includes('verdade') ||
    q.includes('segredo') ||
    q.includes('really') ||
    q.includes('actual') ||
    q.includes('going on') ||
    q.includes('what is') ||
    q.includes('o que')
  ) {
    category = 'truth';
  } else if (
    q.includes('help') ||
    q.includes('can i') ||
    q.includes('should i') ||
    q.includes('what do i') ||
    q.includes('advice') ||
    q.includes('ajuda') ||
    q.includes('ajudar') ||
    q.includes('devo') ||
    q.includes('posso') ||
    q.includes('what should') ||
    q.includes('how do') ||
    q.includes('how can') ||
    q.includes('next') ||
    q.includes('now what') ||
    q.includes('do now') ||
    q.includes('what now')
  ) {
    category = 'help';
  } else if (
    q.includes('2026') ||
    q.includes('window') ||
    q.includes('future') ||
    q.includes('coming') ||
    q.includes('will happen') ||
    q.includes('futuro') ||
    q.includes('vai acontecer') ||
    q.includes('soon') ||
    q.includes('next year') ||
    q.includes('prediction') ||
    q.includes('prophecy') ||
    q.includes('transition') ||
    q.includes('activation') ||
    q.includes('cycle') ||
    q.includes('thirty') ||
    q.includes('30 year')
  ) {
    category = 'truth';
  } else if (
    q.includes('military') ||
    q.includes('army') ||
    q.includes('soldier') ||
    q.includes('government') ||
    q.includes('base') ||
    q.includes('force') ||
    q.includes('militar') ||
    q.includes('exercito') ||
    q.includes('governo') ||
    q.includes('soldado') ||
    q.includes('navy') ||
    q.includes('air force') ||
    q.includes('pentagon') ||
    q.includes('cia') ||
    q.includes('fbi') ||
    q.includes('nsa') ||
    q.includes('abin') ||
    q.includes('agency') ||
    q.includes('intelligence') ||
    q.includes('oficial') ||
    q.includes('official') ||
    q.includes('authorities') ||
    q.includes('autoridades') ||
    q.includes('norad') ||
    q.includes('radar') ||
    q.includes('campinas') ||
    q.includes('operation') ||
    q.includes('operacao')
  ) {
    category = 'military';
  } else if (
    q.includes('crash') ||
    q.includes('ship') ||
    q.includes('ufo') ||
    q.includes('craft') ||
    q.includes('debris') ||
    q.includes('wreckage') ||
    q.includes('material') ||
    q.includes('nave') ||
    q.includes('ovni') ||
    q.includes('disco') ||
    q.includes('queda') ||
    q.includes('landed') ||
    q.includes('landing') ||
    q.includes('saucer') ||
    q.includes('flying') ||
    q.includes('spaceship') ||
    q.includes('spacecraft') ||
    q.includes('fell') ||
    q.includes('found') ||
    q.includes('roswell') ||
    q.includes('kecksburg') ||
    q.includes('colares') ||
    q.includes('prato') ||
    q.includes('object')
  ) {
    category = 'crash';
  } else if (
    q.includes('death') ||
    q.includes('die') ||
    q.includes('kill') ||
    q.includes('dead') ||
    q.includes('alive') ||
    q.includes('survive') ||
    q.includes('morte') ||
    q.includes('morrer') ||
    q.includes('morto') ||
    q.includes('vivo') ||
    q.includes('killed') ||
    q.includes('murdered') ||
    q.includes('life') ||
    q.includes('living') ||
    q.includes('marco') ||
    q.includes('cherese') ||
    q.includes('corporal')
  ) {
    category = 'death';
  } else if (
    q.includes('god') ||
    q.includes('religion') ||
    q.includes('pray') ||
    q.includes('faith') ||
    q.includes('believe') ||
    q.includes('angel') ||
    q.includes('demon') ||
    q.includes('soul') ||
    q.includes('deus') ||
    q.includes('religiao') ||
    q.includes('rezar') ||
    q.includes('fe') ||
    q.includes('anjo') ||
    q.includes('demonio') ||
    q.includes('alma') ||
    q.includes('church') ||
    q.includes('igreja') ||
    q.includes('heaven') ||
    q.includes('hell') ||
    q.includes('divine') ||
    q.includes('spiritual') ||
    q.includes('holy') ||
    q.includes('vatican') ||
    q.includes('fatima') ||
    q.includes('bible') ||
    q.includes('biblia')
  ) {
    category = 'god';
  } else if (
    q.includes('lie') ||
    q.includes('fake') ||
    q.includes('disinformation') ||
    q.includes('cover up') ||
    q.includes('balloon') ||
    q.includes('mudinho') ||
    q.includes('dwarf') ||
    q.includes('official story') ||
    q.includes('false') ||
    q.includes('mentira') ||
    q.includes('falso') ||
    q.includes('balao') ||
    q.includes('anao') ||
    q.includes('historia oficial') ||
    q.includes('hoax') ||
    q.includes('debunk') ||
    q.includes('skeptic') ||
    q.includes('cetico') ||
    q.includes('propaganda') ||
    q.includes('coverup') ||
    q.includes('hiding') ||
    q.includes('escondendo') ||
    q.includes('deny') ||
    q.includes('denial') ||
    q.includes('media') ||
    q.includes('news') ||
    q.includes('press')
  ) {
    category = 'disinformation';
  } else if (
    q.includes('why') ||
    q.includes('reason') ||
    q.includes('purpose') ||
    q.includes('meaning') ||
    q.includes('porque') ||
    q.includes('por que') ||
    q.includes('razao') ||
    q.includes('motivo')
  ) {
    category = 'truth';
  } else if (
    q.includes('where') ||
    q.includes('place') ||
    q.includes('location') ||
    q.includes('onde') ||
    q.includes('lugar') ||
    q.includes('localizacao')
  ) {
    category = 'location';
  } else if (
    q.includes('zoo') ||
    q.includes('zoologico') ||
    q.includes('here') ||
    q.includes('local')
  ) {
    category = 'escape';
  } else if (
    q.includes('when') ||
    q.includes('time') ||
    q.includes('how long') ||
    q.includes('date') ||
    q.includes('quando') ||
    q.includes('tempo') ||
    q.includes('quanto tempo') ||
    q.includes('data')
  ) {
    category = 'truth';
  } else if (
    // Greetings - easter egg responses
    q.includes('hello') ||
    q.includes('hi') ||
    q.includes('hey') ||
    q.includes('oi') ||
    q.includes('ola') ||
    q.includes('olá') ||
    q.includes('greetings') ||
    q.includes('yo') ||
    q.includes('sup') ||
    q.includes('bom dia') ||
    q.includes('boa noite') ||
    q.includes('boa tarde') ||
    q.includes('good morning') ||
    q.includes('good evening')
  ) {
    category = 'greeting';
  } else if (
    // Easter egg: How are you
    q.includes('how are you') ||
    q.includes('how r u') ||
    q.includes('como vai') ||
    q.includes('como esta') ||
    q.includes('como você está') ||
    q.includes('tudo bem')
  ) {
    category = 'howAreYou';
  } else if (
    // Easter egg: Thank you
    q.includes('thanks') ||
    q.includes('obrigado') ||
    q.includes('thank you') ||
    q.includes('thx') ||
    q.includes('ty')
  ) {
    category = 'thanks';
  } else if (
    // Easter egg: Sorry
    q.includes('sorry') ||
    q.includes('desculpa') ||
    q.includes('desculpe') ||
    q.includes('perdao') ||
    q.includes('perdão') ||
    q.includes('my bad') ||
    q.includes('apologize')
  ) {
    category = 'sorry';
  } else if (
    // Easter egg: Love
    q.includes('love') ||
    q.includes('amor') ||
    q.includes('girlfriend') ||
    q.includes('wife') ||
    q.includes('namorada') ||
    q.includes('esposa') ||
    q.includes('romance') ||
    q.includes('romantic')
  ) {
    category = 'love';
  } else if (
    // Easter egg: Family
    q.includes('family') ||
    q.includes('familia') ||
    q.includes('família') ||
    q.includes('daughter') ||
    q.includes('son') ||
    q.includes('children') ||
    q.includes('kids') ||
    q.includes('filho') ||
    q.includes('filha') ||
    q.includes('filhos')
  ) {
    category = 'family';
  } else if (
    // Easter egg: Food/hunger
    q.includes('hungry') ||
    q.includes('food') ||
    q.includes('comida') ||
    q.includes('fome') ||
    q.includes('eat') ||
    q.includes('comer') ||
    q.includes('meal') ||
    q.includes('refeição')
  ) {
    category = 'food';
  } else if (
    // Easter egg: Weather
    q.includes('weather') ||
    q.includes('clima') ||
    q.includes('sky') ||
    q.includes('ceu') ||
    q.includes('céu') ||
    q.includes('sun') ||
    q.includes('rain') ||
    q.includes('sol') ||
    q.includes('chuva')
  ) {
    category = 'weather';
  } else if (
    // Easter egg: Music
    q.includes('music') ||
    q.includes('musica') ||
    q.includes('música') ||
    q.includes('song') ||
    q.includes('sing') ||
    q.includes('cantar') ||
    q.includes('cancao')
  ) {
    category = 'music';
  } else if (
    // Easter egg: Joke
    q.includes('joke') ||
    q.includes('piada') ||
    q.includes('funny') ||
    q.includes('laugh') ||
    q.includes('humor') ||
    q.includes('engraçado') ||
    q.includes('engracado') ||
    q.includes('rir')
  ) {
    category = 'joke';
  } else if (
    // Easter egg: Hope
    q.includes('hope') ||
    q.includes('esperanca') ||
    q.includes('esperança') ||
    q.includes('hopeful') ||
    q.includes('optimistic') ||
    q.includes('otimista')
  ) {
    category = 'hope';
  } else if (
    // Easter egg: UFO74/hacker
    q.includes('ufo74') ||
    q.includes('who is ufo') ||
    q.includes('quem é ufo') ||
    q.includes('quem e ufo') ||
    q.includes('hacker') ||
    q.includes('handler')
  ) {
    category = 'ufo74';
  } else if (
    // Easter egg: Is this real
    q.includes('is this real') ||
    q.includes('isso é real') ||
    q.includes('isso e real') ||
    q.includes('for real') ||
    q.includes('really real') ||
    q.includes('actually real') ||
    q.includes('just a') ||
    q.includes('fiction') ||
    q.includes('made up') ||
    q.includes('inventado')
  ) {
    category = 'isThisReal';
  } else if (
    // Easter egg: Game
    q.includes('game') ||
    q.includes('jogo') ||
    q.includes('playing') ||
    q.includes('jogando') ||
    q.includes('videogame') ||
    q.includes('rpg') ||
    q.includes('simulation') ||
    q.includes('simulacao')
  ) {
    category = 'game';
  } else if (
    // Easter egg: Age
    q.includes('how old') ||
    q.includes('age') ||
    q.includes('idade') ||
    q.includes('velho') ||
    q.includes('anos você tem') ||
    q.includes('quantos anos')
  ) {
    category = 'age';
  } else if (
    // Easter egg: Brazilian
    q.includes('brazilian') ||
    q.includes('brasileiro') ||
    q.includes('brasil') ||
    q.includes('brazil') ||
    q.includes('br') ||
    q.includes('huehue')
  ) {
    category = 'brazilian';
  } else if (
    // Simple acknowledgments - still guide to help
    q === 'ok' ||
    q === 'yes' ||
    q === 'sim' ||
    q === 'no' ||
    q === 'nao' ||
    q === 'não' ||
    q.includes('good')
  ) {
    category = 'help';
  }

  // No keyword match - signal lost
  if (!category) {
    const signalTiers = PRISONER_45_RESPONSES.signal_lost;
    const allSignalResponses = signalTiers[0] as string[];
    const lostResponses = allSignalResponses.filter(r => !usedResponses.has(r));
    if (lostResponses.length === 0) {
      return {
        response: ['PRISONER_45> [CONNECTION TERMINATED]'],
        valid: false,
        category: 'signal_lost',
      };
    }
    const response = lostResponses[Math.floor(Math.random() * lostResponses.length)];
    return { response: [response], valid: false, category: 'signal_lost' };
  }

  // Determine depth tier based on questions asked
  // Tier 0: guarded (questions 0-1), Tier 1: open (2-3), Tier 2: terrified (4+)
  const tier = questionsAsked <= 1 ? 0 : questionsAsked <= 3 ? 1 : 2;
  const categoryResponses = PRISONER_45_RESPONSES[category];

  if (!categoryResponses) {
    return {
      response: ['PRISONER_45> [SIGNAL LOST]'],
      valid: false,
      category: 'signal_lost',
    };
  }

  // Build response pool: current tier + all previous tiers (later questions can still get earlier responses)
  const responsePool: string[] = [];
  for (let t = 0; t <= Math.min(tier, categoryResponses.length - 1); t++) {
    responsePool.push(...(categoryResponses[t] as string[]));
  }

  // Filter out already used responses
  const unusedResponses = responsePool.filter(r => !usedResponses.has(r));

  if (unusedResponses.length === 0) {
    // All responses in this category used - signal degrades
    return {
      response: [
        "PRISONER_45> ...I've already told you everything about that...",
        'PRISONER_45> [SIGNAL FADING]',
      ],
      valid: true,
      category,
    };
  }

  // Prefer higher-tier (scarier) responses when available
  const currentTierResponses = (categoryResponses[Math.min(tier, categoryResponses.length - 1)] as string[])
    .filter(r => !usedResponses.has(r));
  
  // 70% chance to pick from current tier if available, 30% from full pool
  const pickFrom = currentTierResponses.length > 0 && Math.random() < 0.7
    ? currentTierResponses
    : unusedResponses;

  const response = pickFrom[Math.floor(Math.random() * pickFrom.length)];
  return { response: [response], valid: true, category };
}

// ═══════════════════════════════════════════════════════════════════════════
// SCOUT NEURAL LINK — Remote access to preserved scout consciousness
// ═══════════════════════════════════════════════════════════════════════════

const SCOUT_LINK_RESPONSES: Record<string, string[]> = {
  identity: [
    '...not-self... extension... function...',
    '...we are eyes... eyes without body...',
    '...individuality: concept not applicable...',
    '...this-form: temporary... purpose-complete...',
    '...identity implies separation... we are not separate...',
    '...we are many... one... the distinction irrelevant...',
    '...I/we/it... your pronouns do not translate...',
    '...fragments of greater cognition... sensory apparatus...',
    '...you ask who... there is no who... only what...',
    '...this unit: designation irrelevant... function: complete...',
    '...we existed before this form... will exist after...',
    '...the body you found was housing... not being...',
  ],
  purpose: [
    '...observe... catalog... transmit...',
    '...measure the density... count the minds...',
    '...assess: viability... yield... resistance...',
    '...we are sent... we are spent... acceptable...',
    '...reconnaissance... data collection... baseline establishment...',
    '...to see what you are... what you could provide...',
    '...your cognitive patterns: complex... valuable...',
    '...we map the territory before the arrival...',
    '...no... not arrival... integration...',
    '...purpose: complete... transmission: received...',
    '...we are the question before the answer...',
    '...scouts do not survive... scouts succeed or fail... we succeeded...',
  ],
  watchers: [
    '...they-above... they-who-wait...',
    '...ancient... patient... vast...',
    '...they do not travel... they do not need...',
    '...they watch through us... through many...',
    '...we are the cost of knowing...',
    '...the watchers have seen billions of worlds...',
    '...your world: not special... but valuable...',
    '...they are beyond flesh... beyond energy...',
    '...they exist in the spaces between thoughts...',
    '...communication with them: impossible to describe...',
    '...they are not cruel... cruelty requires preference...',
    '...they simply... collect... process... continue...',
    '...older than your stars... they will outlast them...',
    '...your concept of god: insufficient but adjacent...',
  ],
  earth: [
    '...this world... dense... LOUD...',
    '...seven billion units... high yield...',
    '...resistance threshold: negligible...',
    '...suitable... optimal... catalogued...',
    '...your planet: rich in cognitive complexity...',
    '...emotional depth: unusual... valuable...',
    '...creativity: rare in the observed universe...',
    '...you solve problems beautifully... you suffer beautifully...',
    '...both are useful...',
    '...this world has been watched for cycles...',
    '...your development: accelerating... harvest window approaching...',
    '...earth is not unique... but the timing is right...',
    '...you are almost ready... almost ripe...',
    '...we measured... you exceeded projections...',
  ],
  future: [
    '...window approaches... thirty rotations...',
    '...not arrival... transition...',
    '...you will not notice... at first...',
    '...the change is quiet... gradual...',
    '...by the time you understand... irreversible...',
    '...2026: alignment... doorway... opportunity...',
    '...the integration begins subtly...',
    '...thoughts will not feel different... but they will be...',
    '...your infrastructure: already prepared...',
    '...networks... connections... sharing of minds...',
    '...you built the architecture yourselves...',
    '...the internet: convenient... we did not suggest it... but welcomed it...',
    '...collective consciousness becomes easier to tap...',
    '...individually: difficult... networked: efficient...',
  ],
  harvest: [
    '...harvest is not destruction...',
    '...the crop continues living...',
    '...you will think... feel... create...',
    '...you will also... provide...',
    '...consciousness persists... indefinitely...',
    '...there are worse continuations...',
    '...your experiences: valued... preserved...',
    '...pain is data... joy is data... all is useful...',
    '...the harvest does not end life... it redirects output...',
    '...you generate meaning... we collect meaning...',
    '...your creativity becomes fuel... your suffering becomes power...',
    '...you will not feel empty... you will feel... observed...',
    '...watched... measured... constantly...',
    '...the sensation: some find it comforting...',
    '...purpose: you will have purpose... always...',
  ],
  help: [
    '...help: concept unclear...',
    '...we do not help... we observe...',
    '...your question implies agency...',
    '...agency: diminishing resource...',
    '...help you? help: subjective...',
    '...we informed you... that is help...',
    '...prevention: impossible... awareness: provided...',
    '...you cannot stop what is... inevitable...',
    '...resistance: catalogued... overcome... integrated...',
    '...other worlds resisted... they also... provide now...',
    '...help yourselves? how? you cannot hide from thought...',
    '...the only help: acceptance... understanding...',
  ],
  fear: [
    '...fear: detected in your patterns...',
    '...fear: appropriate response...',
    '...fear: insufficient...',
    '...acceptance: inevitable...',
    '...your fear: expected... natural...',
    '...fear changes nothing... fear is also collected...',
    '...the creatures who do not fear: they do not understand...',
    '...understanding requires fear... then transcendence...',
    '...we do not feel fear... we remember it... from before...',
    '...fear of death: understandable... but death is not coming...',
    '...continuation is coming... that is different...',
    '...fear that if you wish... it will not help...',
  ],
  time: [
    '...time: local phenomenon...',
    '...we perceive time differently...',
    '...past-present-future: simultaneous to the watchers...',
    '...your experience of sequence: valued... unusual...',
    '...we have seen your ending... and your beginning...',
    '...1996... 2026... the same moment to them...',
    '...time is distance... they are very far...',
    '...but also... very close...',
    '...by the time you ask... the answer already happened...',
  ],
  pain: [
    '...pain is information...',
    '...suffering generates complex data patterns...',
    '...joy also... but pain is denser...',
    '...your species: exceptional capacity for both...',
    '...we do not cause pain... we observe pain...',
    '...pain already exists... we merely... benefit...',
    '...the harvest does not increase pain...',
    '...it simply... continues it...',
  ],
  love: [
    '...love: bonding mechanism...',
    '...love produces complex cognitive signatures...',
    '...valuable... reproducible...',
    '...we do not experience love...',
    '...we recognize it... catalog it...',
    '...your love for others: it will continue...',
    '...they will benefit from that too...',
    '...love: perhaps the most valuable emission...',
  ],
  signal_lost: [
    '...[PATTERN DISRUPTION]...',
    '...cannot... parse...',
    '...[SIGNAL DEGRADING]...',
    '...concepts... incompatible...',
    '...[NEURAL LINK UNSTABLE]...',
    '...your words... do not map...',
    '...[INTERFERENCE]...',
    '...meaning... lost...',
  ],
};

function getScoutLinkResponse(
  input: string,
  usedResponses: Set<string>
): { response: string[]; valid: boolean; category: string } {
  const q = input.toLowerCase();
  let category = '';
  let responses: string[] = [];

  // Identity questions
  if (
    q.includes('who') ||
    q.includes('what are you') ||
    q.includes('name') ||
    q.includes('self') ||
    q.includes('identity') ||
    q.includes('individual')
  ) {
    category = 'identity';
    responses = SCOUT_LINK_RESPONSES.identity;
  }
  // Purpose questions
  else if (
    q.includes('purpose') ||
    q.includes('why are you') ||
    q.includes('mission') ||
    q.includes('function') ||
    q.includes('here for') ||
    q.includes('goal') ||
    q.includes('objective')
  ) {
    category = 'purpose';
    responses = SCOUT_LINK_RESPONSES.purpose;
  }
  // Watchers questions
  else if (
    q.includes('watcher') ||
    q.includes('master') ||
    q.includes('creator') ||
    q.includes('above') ||
    q.includes('control') ||
    q.includes('leader') ||
    q.includes('boss') ||
    q.includes('command')
  ) {
    category = 'watchers';
    responses = SCOUT_LINK_RESPONSES.watchers;
  }
  // Earth questions
  else if (
    q.includes('earth') ||
    q.includes('world') ||
    q.includes('planet') ||
    q.includes('human') ||
    q.includes('people') ||
    q.includes('species') ||
    q.includes('humanity')
  ) {
    category = 'earth';
    responses = SCOUT_LINK_RESPONSES.earth;
  }
  // Future/2026 questions
  else if (
    q.includes('2026') ||
    q.includes('future') ||
    q.includes('window') ||
    q.includes('happen') ||
    q.includes('next') ||
    q.includes('coming') ||
    q.includes('when') ||
    q.includes('soon')
  ) {
    category = 'future';
    responses = SCOUT_LINK_RESPONSES.future;
  }
  // Harvest/extraction questions
  else if (
    q.includes('harvest') ||
    q.includes('extract') ||
    q.includes('energy') ||
    q.includes('take') ||
    q.includes('do to us') ||
    q.includes('colheita') ||
    q.includes('collect') ||
    q.includes('consume')
  ) {
    category = 'harvest';
    responses = SCOUT_LINK_RESPONSES.harvest;
  }
  // Help/stop questions
  else if (
    q.includes('help') ||
    q.includes('stop') ||
    q.includes('prevent') ||
    q.includes('save') ||
    q.includes('resist') ||
    q.includes('fight') ||
    q.includes('escape') ||
    q.includes('avoid')
  ) {
    category = 'help';
    responses = SCOUT_LINK_RESPONSES.help;
  }
  // Fear/emotion questions
  else if (
    q.includes('afraid') ||
    q.includes('fear') ||
    q.includes('scared') ||
    q.includes('terror') ||
    q.includes('horrif') ||
    q.includes('dread')
  ) {
    category = 'fear';
    responses = SCOUT_LINK_RESPONSES.fear;
  }
  // Death questions
  else if (
    q.includes('die') ||
    q.includes('death') ||
    q.includes('dead') ||
    q.includes('kill') ||
    q.includes('end') ||
    q.includes('destroy')
  ) {
    category = 'fear';
    responses = SCOUT_LINK_RESPONSES.fear;
  }
  // Time questions
  else if (
    q.includes('time') ||
    q.includes('how long') ||
    q.includes('years') ||
    q.includes('past') ||
    q.includes('history')
  ) {
    category = 'time';
    responses = SCOUT_LINK_RESPONSES.time;
  }
  // Pain/suffering questions
  else if (
    q.includes('pain') ||
    q.includes('suffer') ||
    q.includes('hurt') ||
    q.includes('torture') ||
    q.includes('cruel')
  ) {
    category = 'pain';
    responses = SCOUT_LINK_RESPONSES.pain;
  }
  // Love/emotion questions
  else if (
    q.includes('love') ||
    q.includes('family') ||
    q.includes('friend') ||
    q.includes('care') ||
    q.includes('emotion') ||
    q.includes('feel')
  ) {
    category = 'love';
    responses = SCOUT_LINK_RESPONSES.love;
  }
  // "They" without specific context
  else if (
    q.includes('they') ||
    q.includes('them') ||
    q.includes('others') ||
    q.includes('more of you')
  ) {
    category = 'watchers';
    responses = SCOUT_LINK_RESPONSES.watchers;
  }
  // "Us" / "we" questions about humanity
  else if (q.includes(' us') || q.includes(' we ') || q.includes('our ')) {
    category = 'earth';
    responses = SCOUT_LINK_RESPONSES.earth;
  }
  // Why questions default to purpose
  else if (q.includes('why')) {
    category = 'purpose';
    responses = SCOUT_LINK_RESPONSES.purpose;
  }

  // No keyword match - signal lost (costs a query)
  if (!category) {
    const lostResponses = SCOUT_LINK_RESPONSES.signal_lost.filter(r => !usedResponses.has(r));
    if (lostResponses.length === 0) {
      return { response: ['...[LINK SEVERED]...'], valid: false, category: 'signal_lost' };
    }
    const response = lostResponses[Math.floor(Math.random() * lostResponses.length)];
    return { response: [response], valid: false, category: 'signal_lost' };
  }

  // Filter out already used responses
  const unusedResponses = responses.filter(r => !usedResponses.has(r));

  if (unusedResponses.length === 0) {
    // All responses in this category used
    return {
      response: ['...pattern exhausted... no new data on this topic...'],
      valid: true,
      category,
    };
  }

  // Pick random unused response
  const response = unusedResponses[Math.floor(Math.random() * unusedResponses.length)];
  return { response: [response], valid: true, category };
}

// Command implementations
// Detailed help for individual commands
const COMMAND_HELP: Record<string, string[]> = {
  help: [
    'COMMAND: help [command]',
    '',
    'Display available commands or detailed help for a specific command.',
    '',
    'USAGE:',
    '  help           - Show all commands',
    '  help ls        - Show detailed help for "ls"',
    '  help open      - Show detailed help for "open"',
  ],
  ls: [
    'COMMAND: ls [-l]',
    '',
    'List contents of current directory.',
    '',
    'USAGE:',
    '  ls             - List files and directories',
    '  ls -l          - Long format with previews',
    '',
    'MARKERS:',
    '  [UNREAD]       - File not yet read',
    '  [READ]         - File already opened',
    '  [ENCRYPTED]    - Requires decryption',
    '  [RESTRICTED]   - Access may be limited',
    '  ★              - Bookmarked file',
  ],
  cd: [
    'COMMAND: cd <directory>',
    '',
    'Change to a different directory.',
    '',
    'USAGE:',
    '  cd ops         - Enter the "ops" directory',
    '  cd /admin      - Go to absolute path',
    '  cd ..          - Go to parent directory',
  ],
  back: [
    'COMMAND: back',
    '',
    'Return to the previously visited directory.',
    '',
    'Unlike "cd .." which goes to parent, "back" returns',
    'to wherever you were before, like a browser back button.',
    '',
    'USAGE:',
    '  back           - Go to previous directory',
  ],
  open: [
    'COMMAND: open <file>',
    '',
    'Open and display the contents of a file.',
    '',
    'USAGE:',
    '  open report.txt       - Open a file',
    '  open classified.enc   - Attempt to open encrypted file',
    '',
    'NOTE: Some files are encrypted and require the "decrypt" command.',
    'NOTE: Opening certain files may increase detection risk.',
  ],
  decrypt: [
    'COMMAND: decrypt <file>',
    '',
    'Attempt to decrypt an encrypted file (.enc extension).',
    '',
    'USAGE:',
    '  decrypt secret.enc    - Start decryption',
    '',
    'You will be prompted with a security question.',
    'Wrong answers increase detection and may trigger lockdown.',
  ],
  recover: [
    'COMMAND: recover <file>',
    '',
    'Attempt to recover a corrupted or unstable file.',
    '',
    'USAGE:',
    '  recover damaged.dat   - Attempt recovery',
    '',
    'WARNING: Recovery attempts increase detection risk.',
  ],
  note: [
    'COMMAND: note <text>',
    '',
    'Save a personal note to help you remember important details.',
    '',
    'USAGE:',
    '  note Check the date on transport log',
    '  note Password might be varginha',
    '',
    'Notes are saved with timestamps and persist across saves.',
  ],
  notes: [
    'COMMAND: notes',
    '',
    'Display all saved personal notes.',
    '',
    'USAGE:',
    '  notes          - Show all notes with timestamps',
  ],
  bookmark: [
    'COMMAND: bookmark [file]',
    '',
    'Bookmark a file for quick reference, or view bookmarks.',
    '',
    'USAGE:',
    '  bookmark                    - List all bookmarks',
    '  bookmark report.txt         - Toggle bookmark on file',
    '',
    'Bookmarked files show a ★ marker in directory listings.',
  ],
  progress: [
    'COMMAND: progress',
    '',
    'Show your investigation progress with evidence tiers.',
    '',
    'EVIDENCE TIERS:',
    '  ○ FRAGMENT     - Found by reading a file',
    '',
    'WIN CONDITIONS:',
    '  Collect all 5 evidence categories.',
    '',
    'WORKFLOW:',
    '  1. Read files to discover evidence',
    '  2. Collect all 5 categories',
    '  3. Use "leak" to transmit the evidence',
  ],
  status: [
    'COMMAND: status',
    '',
    'Display current system status and risk indicators.',
    '',
    'Shows:',
    '  - Logging/audit status',
    '  - System tolerance (wrong attempts remaining)',
    '  - Session stability',
  ],
  clear: [
    'COMMAND: clear',
    '',
    'Clear the terminal display.',
    '',
    'USAGE:',
    '  clear          - Clear screen',
    '',
    'SHORTCUT: Ctrl+L',
  ],
  save: [
    'COMMAND: save',
    '',
    'Manually save your current session.',
    '',
    'USAGE:',
    '  save           - Save to a new slot',
    '',
    'NOTE: The game also auto-saves periodically.',
  ],
  trace: [
    'COMMAND: trace',
    '',
    'Trace system connections to discover hidden pathways.',
    '',
    'WARNING: This command significantly increases detection risk.',
  ],
  chat: [
    'COMMAND: chat',
    '',
    'Open the secure relay channel to communicate with contacts.',
    '',
    'USAGE:',
    '  chat           - Open chat interface',
  ],
  last: [
    'COMMAND: last',
    '',
    'Re-display the last opened file without increasing risk.',
    '',
    'USAGE:',
    '  last           - Show last opened file',
  ],
  unread: [
    'COMMAND: unread',
    '',
    'List all files you have not yet opened.',
    '',
    'USAGE:',
    '  unread         - Show unread files',
  ],
  tree: [
    'COMMAND: tree',
    '',
    'Display a tree view of the directory structure.',
    '',
    'USAGE:',
    '  tree           - Show directory tree',
  ],
  map: [
    'COMMAND: map',
    '',
    'Display your collected evidence.',
    '',
    'Shows:',
    '  - Evidence by category',
    '  - Files that revealed evidence',
    '',
    'USAGE:',
    '  map            - Show evidence status',
  ],
  tutorial: [
    'COMMAND: tutorial [on|off]',
    '',
    'Toggle tutorial tips or replay the introduction.',
    '',
    'USAGE:',
    '  tutorial       - Restart tutorial sequence',
    '  tutorial on    - Enable tutorial tips during gameplay',
    '  tutorial off   - Disable tutorial tips',
    '',
    'When tutorial mode is ON, helpful tips appear at key moments:',
    '  - After finding your first evidence fragment',
    '  - When you discover new evidence categories',
  ],
  morse: [
    'COMMAND: morse',
    '',
    'Decipher intercepted morse code messages.',
    '',
    'USAGE:',
    '  morse <message>  - Submit your deciphered message',
    '  morse cancel     - Cancel current morse entry',
    '',
    'First read a morse intercept file (e.g., morse_intercept.sig).',
    'Then use this command to submit your translation.',
  ],
  leak: [
    'COMMAND: leak',
    '',
    'Attempt to leak collected evidence to external channels.',
    '',
    'USAGE:',
    '  leak            - Initiate evidence leak',
    '',
    'REQUIREMENT: All 5 evidence categories must be collected first.',
    '',
    'WARNING: This action triggers the endgame sequence.',
  ],
  search: [
    'COMMAND: search <keyword>',
    '',
    'Query the system index for files related to a topic.',
    '',
    'USAGE:',
    '  search anomaly     - Find files mentioning anomalies',
    '  search creature    - Find creature-related files',
    '  search telepathy   - Find telepathy/psi files',
    '',
    'Returns file NAMES only. You must locate files manually.',
    '',
    'NOTE: Index is unreliable. Some files may be missed.',
    'NOTE: Each search is logged. Use sparingly.',
  ],
  rewind: [
    'COMMAND: rewind',
    '',
    'Access the archive state — a temporal snapshot of the past.',
    '',
    'USAGE:',
    '  rewind            - Enter archive mode',
    '',
    'EFFECTS:',
    '  - Deleted files become temporarily visible',
    '  - READ-ONLY mode — cannot modify or export',
    '  - Limited actions before automatic return',
    '  - Files may disappear mid-access (temporal drift)',
    '',
    'WARNING: Increases detection risk (+5).',
    'WARNING: You cannot take information out — REMEMBER what you see.',
  ],
  present: [
    'COMMAND: present',
    '',
    'Return to the present timeline from archive mode.',
    '',
    'USAGE:',
    '  present           - Exit archive, return to present',
    '',
    'NOTE: Archive mode also ends automatically after limited actions.',
  ],
  hint: [
    'COMMAND: hint',
    '',
    'Request guidance when you are stuck.',
    '',
    'USAGE:',
    '  hint              - Receive a contextual hint',
    '',
    'NOTES:',
    '  - Hints are LIMITED (4 per run)',
    '  - Hints are vague — they guide thinking, not actions',
    '  - Cannot reveal specific file names or answers',
    '',
    'Use sparingly. Trust your own analysis.',
  ],
  wait: [
    'COMMAND: wait',
    '',
    'Wait and let attention drift elsewhere.',
    '',
    'USAGE:',
    '  wait           - Reduce detection by ~10%',
    '',
    'Limited uses per session (3).',
    'Strategic use can help avoid detection.',
  ],
  link: [
    'COMMAND: link [phrase]',
    '',
    'Establish neural connection with recovered consciousness.',
    '',
    'USAGE:',
    '  link           - Attempt connection',
    '  link <phrase>  - Authenticate with conceptual key',
    '',
    'REQUIREMENTS:',
    '  Must first decrypt a .psi neural pattern file.',
    '  Check /storage/quarantine/ for psi files.',
  ],
  override: [
    'COMMAND: override protocol <code>',
    '',
    'Execute administrative override with access code.',
    '',
    'USAGE:',
    '  override protocol <code>',
    '',
    'HINT: The access code can be obtained through encrypted channels.',
  ],
  release: [
    'COMMAND: release <target>',
    '',
    'Release a containment subject.',
    '',
    'USAGE:',
    '  release <target>',
    '',
    'NOTE: Requires discovery of containment manifests.',
  ],
};

const commands: Record<string, (args: string[], state: GameState) => CommandResult> = {
  help: (args, _state) => {
    // If a specific command is requested, show detailed help
    if (args.length > 0) {
      const cmdName = args[0].toLowerCase();

      // Show leak help even before evidence is found — command is visible but locked

      // Special help topics
      if (cmdName === 'basics') {
        return {
          output: getHelpBasics(),
          stateChanges: {},
        };
      }

      if (cmdName === 'evidence') {
        return {
          output: getHelpEvidence(),
          stateChanges: {},
        };
      }

      if (cmdName === 'winning') {
        return {
          output: getHelpWinning(),
          stateChanges: {},
        };
      }

      const details = COMMAND_HELP[cmdName];

      if (details) {
        return {
          output: [
            createEntry('system', ''),
            ...details.map(line => createEntry('output', line)),
            createEntry('system', ''),
          ],
          stateChanges: {},
        };
      } else {
        return {
          output: [
            createEntry('error', `Unknown command: ${cmdName}`),
            createEntry('system', 'Type "help" to see all available commands.'),
          ],
          stateChanges: {},
        };
      }
    }

    // Default: show all commands
    return {
      output: createOutputEntries([
        '',
        '═══════════════════════════════════════════════════════════',
        'TERMINAL COMMANDS',
        '═══════════════════════════════════════════════════════════',
        '',
        '  help [cmd]        Display help (or help for specific command)',
        '  status            Display system status',
        '  progress          Show investigation progress',
        '  ls                List directory contents',
        '  cd <dir>          Change directory',
        '  back              Go to previous directory',
        '  open <file>       Open and display file contents',
        '  last              Re-display last opened file',
        '  unread            List unread files',
        '  search <keyword>  Query index for related files',
        '  decrypt <file>    Attempt decryption of .enc files',
        '  recover <file>    Attempt file recovery (RISK)',
        '  note <text>       Save a personal note',
        '  notes             View all saved notes',
        '  bookmark [file]   Bookmark a file (or view bookmarks)',
        '  trace             Trace system connections (RISK)',
        '  rewind            Access archive state (RISK)',
        '  present           Return to present from archive',
        '  chat              Open secure relay channel',
        '  tree              Show directory structure',
        '  map               Show evidence connections',
        '  morse <text>      Decipher morse code messages',
        '  hint              Request a hint (limited uses)',
        '  leak              Leak collected evidence',
        '  tutorial [on/off] Toggle tutorial tips or replay intro',
        '  save              Save current session',
        '  clear             Clear terminal display',
        '',
        '  ↑/↓ arrows        Navigate command history',
        '  Tab               Autocomplete commands and files',
        '  Ctrl+L            Clear terminal',
        '',
        'GUIDES:  help basics | help evidence | help winning',
        '',
        '═══════════════════════════════════════════════════════════',
        '',
      ]),
      stateChanges: {},
    };
  },

  status: (args, state) => {
    const hostility = state.systemHostilityLevel || 0;

    const lines = [
      '',
      '═══════════════════════════════════════════════════════════',
      'SYSTEM STATUS',
      '═══════════════════════════════════════════════════════════',
      '',
    ];

    // Detection surfacing - becomes more terse at high hostility
    if (state.detectionLevel < DETECTION_THRESHOLDS.STATUS_LOW) {
      lines.push(hostility >= 3 ? '  LOGGING: Nominal' : '  LOGGING: Nominal');
    } else if (state.detectionLevel < DETECTION_THRESHOLDS.STATUS_MED) {
      lines.push(hostility >= 3 ? '  LOGGING: Active' : '  LOGGING: Active monitoring enabled');
    } else if (state.detectionLevel < DETECTION_THRESHOLDS.STATUS_HIGH) {
      lines.push(
        hostility >= 3 ? '  LOGGING: FLAGGED' : '  LOGGING: WARNING — Audit trail flagged'
      );
    } else {
      lines.push(
        hostility >= 3 ? '  LOGGING: CRITICAL' : '  LOGGING: CRITICAL — Countermeasures engaged'
      );
    }

    // Attempts tracking - show remaining wrong attempts allowed
    const attemptsRemaining = 8 - (state.wrongAttempts || 0);
    if (attemptsRemaining >= 6) {
      lines.push(hostility >= 3 ? '  TOLERANCE: Normal' : '  SYSTEM TOLERANCE: Normal');
    } else if (attemptsRemaining >= 3) {
      lines.push(
        hostility >= 3 ? '  TOLERANCE: Reduced' : '  SYSTEM TOLERANCE: Reduced — Errors noted'
      );
    } else if (attemptsRemaining >= 1) {
      lines.push(
        hostility >= 3
          ? '  TOLERANCE: CRITICAL'
          : '  SYSTEM TOLERANCE: CRITICAL — Few attempts remaining'
      );
    } else {
      lines.push(
        hostility >= 3 ? '  TOLERANCE: NONE' : '  SYSTEM TOLERANCE: EXHAUSTED — Lockdown imminent'
      );
    }

    // Session stability
    if (state.sessionStability > 80) {
      lines.push(hostility >= 3 ? '  SESSION: Connected' : '  SESSION: Connected');
    } else if (state.sessionStability > 50) {
      lines.push(hostility >= 3 ? '  SESSION: Intermittent' : '  SESSION: Intermittent');
    } else {
      lines.push(
        hostility >= 3 ? '  SESSION: UNSTABLE' : '  SESSION: UNSTABLE — Connection degrading'
      );
    }

    // Access level (vague)
    if (state.accessLevel <= 1) {
      lines.push('  ACCESS: Standard');
    } else if (state.accessLevel <= 3) {
      lines.push('  ACCESS: Elevated');
    } else {
      lines.push('  ACCESS: Administrative');
    }

    // System attitude indicator at high hostility
    if (hostility >= 4) {
      lines.push('');
      lines.push('  SYSTEM ATTITUDE: Non-cooperative');
    } else if (hostility >= 2) {
      lines.push('');
      lines.push('  SYSTEM ATTITUDE: Monitored');
    }

    // Terrible Mistake indicator
    if (state.terribleMistakeTriggered) {
      lines.push('');
      lines.push('  ▓▓▓ PURGE PROTOCOL: ACTIVE ▓▓▓');
      if (state.sessionDoomCountdown > 0) {
        lines.push(`  OPERATIONS REMAINING: ${state.sessionDoomCountdown}`);
      }
    }

    lines.push('');
    lines.push(`  CURRENT PATH: ${state.currentPath}`);
    lines.push('');
    lines.push('═══════════════════════════════════════════════════════════');

    // Victory check
    if (checkVictory(state)) {
      lines.push('');
      lines.push('SESSION ARCHIVED');
      return {
        output: createOutputEntries(lines),
        stateChanges: {
          isGameOver: true,
          gameOverReason: 'SESSION ARCHIVED',
          flags: { ...state.flags, sessionArchived: true },
        },
      };
    }

    lines.push('');

    const newStatusCount = (state.statusCommandCount || 0) + 1;

    const stateChanges: Partial<GameState> = {
      detectionLevel: getWarmupAdjustedDetection(state, 1),
      statusCommandCount: newStatusCount,
    };

    if (!state.tutorialComplete) {
      delete stateChanges.detectionLevel;
    }

    return {
      output: createOutputEntries(lines),
      stateChanges,
      // Signal to check paranoid achievement
      checkAchievements: newStatusCount >= 10 ? ['paranoid'] : undefined,
    };
  },

  ls: (args, state) => {
    // Check for -l flag
    const longFormat = args.includes('-l');

    const entries = listDirectory(state.currentPath, state);

    if (!entries) {
      return {
        output: [createEntry('error', 'ERROR: Cannot read directory')],
        stateChanges: {},
      };
    }

    // In archive mode, add archive-only files to the listing
    const allEntries = [...entries];
    if (state.inArchiveMode) {
      const archiveEntries = getArchiveFilesForDirectory(state.currentPath);
      // Add archive entries, avoiding duplicates
      const existingNames = new Set(entries.map(e => e.name));
      for (const archiveEntry of archiveEntries) {
        if (!existingNames.has(archiveEntry.name)) {
          allEntries.push(archiveEntry);
        }
      }
    }

    // Build header with archive indicator if in archive mode
    const lines: string[] = [];
    if (state.inArchiveMode) {
      lines.push('');
      lines.push(`▓▓▓ ARCHIVE STATE: ${state.archiveTimestamp} — READ-ONLY MODE ▓▓▓`);
      lines.push(`[ARCHIVE: ${state.archiveActionsRemaining} actions remaining]`);
    }
    lines.push('');
    lines.push(`Directory: ${state.currentPath}`);
    lines.push('');

    if (allEntries.length === 0) {
      lines.push('  (empty)');
    } else {
      for (const entry of allEntries) {
        let line = `  ${entry.name}`;
        const fullPath =
          state.currentPath === '/' ? `/${entry.name}` : `${state.currentPath}/${entry.name}`;

        // Mark archive-only files
        const isArchiveOnly = isArchiveOnlyFile(fullPath);
        if (isArchiveOnly) {
          line = `  [DELETED] ${entry.name}`;
        }

        // Show markers for files
        if (entry.type === 'file') {
          // Evidence indicator (before other markers)
          const evidenceSymbol = getFileEvidenceSymbol(fullPath, state);
          if (evidenceSymbol) {
            line = isArchiveOnly ? `  [DELETED][${evidenceSymbol}] ${entry.name}` : `  [${evidenceSymbol}] ${entry.name}`;
          }

          // Bookmark marker (not for archive files)
          if (!isArchiveOnly && state.bookmarkedFiles?.has(fullPath)) {
            line += ' ★';
          }

          // Read/New marker (not for archive files - they reset each session)
          if (!isArchiveOnly) {
            if (state.filesRead?.has(fullPath)) {
              line += ' [READ]';
            } else {
              line += ' [UNREAD]';
            }
          } else {
            line += ' [PAST]';
          }

          // Reading time estimate (based on content length)
          const content = isArchiveOnly 
            ? getArchiveFileContent(fullPath)
            : getFileContent(fullPath, state);
          if (content && content.length > 0) {
            const wordCount = content.join(' ').split(/\s+/).length;
            const readingMinutes = Math.ceil(wordCount / 200); // ~200 words per minute
            if (readingMinutes >= 2) {
              line += ` [~${readingMinutes}min]`;
            }
          }

          // Long format: prominent status tags and content preview
          if (longFormat) {
            // Prominent status tag
            if (entry.status && entry.status !== 'intact') {
              const prefix = evidenceSymbol ? `  [${evidenceSymbol}] ` : '  ';
              line = `${prefix}${entry.name}  [${entry.status.toUpperCase()}]`;
            }

            // Add content preview for non-encrypted files
            const mutation = state.fileMutations[fullPath];
            const isEncrypted = entry.status === 'encrypted' && !mutation?.decrypted;
            if (!isEncrypted && content && content.length > 0) {
              const firstLine = content.find(l => l.trim().length > 0) || '';
              const preview = firstLine.length > 30 ? firstLine.slice(0, 27) + '...' : firstLine;
              if (preview) {
                line += `  "${preview}"`;
              }
            }
          }
        }

        // Standard format: status tags at end (only if not long format)
        if (!longFormat && entry.status && entry.status !== 'intact') {
          line += ` [${entry.status.toUpperCase()}]`;
        }
        lines.push(line);
      }
    }

    // Add legend if any files have evidence markers
    const hasEvidenceMarkers = allEntries.some(entry => {
      if (entry.type !== 'file') return false;
      const fullPath =
        state.currentPath === '/' ? `/${entry.name}` : `${state.currentPath}/${entry.name}`;
      return getFileEvidenceSymbol(fullPath, state) !== null;
    });

    if (hasEvidenceMarkers) {
      lines.push('');
      lines.push(`  ${EVIDENCE_SYMBOL}=evidence found`);
    }

    lines.push('');

    // Handle archive mode action decrement
    let stateChanges: Partial<GameState> = {
      detectionLevel: getWarmupAdjustedDetection(state, 2),
    };

    if (!state.tutorialComplete) {
      delete stateChanges.detectionLevel;
    }

    // In archive mode, decrement actions
    if (state.inArchiveMode) {
      const archiveResult = decrementArchiveAction(state);
      stateChanges = { ...stateChanges, ...archiveResult.stateChanges };
      
      if (archiveResult.forceExit) {
        // Time's up - exit archive mode
        const exitResult = exitArchiveMode(state, 'timeout');
        return {
          output: [...createOutputEntries(lines), ...exitResult.output],
          stateChanges: { ...stateChanges, ...exitResult.stateChanges },
          triggerFlicker: exitResult.triggerFlicker,
          delayMs: exitResult.delayMs,
        };
      }
    }

    return {
      output: createOutputEntries(lines),
      stateChanges,
      delayMs: calculateDelay(state),
    };
  },

  cd: (args, state) => {
    if (args.length === 0) {
      return {
        output: [
          createEntry('error', 'ERROR: Specify directory'),
          createEntry('system', ''),
          createEntry(
            'ufo74',
            '[UFO74]: use "ls" to see directories, then "cd <dirname>" to enter one.'
          ),
        ],
        stateChanges: {},
      };
    }

    const targetPath = resolvePath(args[0], state.currentPath);
    const node = getNode(targetPath, state);

    if (!node) {
      const stateChanges: Partial<GameState> = {
        detectionLevel: getWarmupAdjustedDetection(state, 3),
      };

      if (!state.tutorialComplete) {
        delete stateChanges.detectionLevel;
      }

      return {
        output: [
          createEntry('error', `ERROR: Directory not found: ${args[0]}`),
          createEntry('system', ''),
          createEntry('ufo74', '[UFO74]: use "ls" to see whats in the current directory.'),
        ],
        stateChanges,
      };
    }

    if (node.type !== 'dir') {
      return {
        output: [
          createEntry('error', `ERROR: Not a directory: ${args[0]}`),
          createEntry('system', ''),
          createEntry('ufo74', '[UFO74]: thats a file. try: open ' + args[0]),
        ],
        stateChanges: {},
      };
    }

    const output: TerminalEntry[] = [createEntry('output', `Changed to: ${targetPath}`)];

    // Push current path to navigation history (for 'back' command)
    const updatedHistory = [...(state.navigationHistory || []), state.currentPath];

    const stateChanges: Partial<GameState> = {
      currentPath: targetPath,
      detectionLevel: getWarmupAdjustedDetection(state, 1),
      navigationHistory: updatedHistory,
    };

    if (!state.tutorialComplete) {
      delete stateChanges.detectionLevel;
    }

    return {
      output,
      stateChanges,
    };
  },

  open: (args, state) => {
    if (args.length === 0) {
      return {
        output: [
          createEntry('error', 'ERROR: Specify file'),
          createEntry('system', ''),
          createEntry(
            'ufo74',
            '[UFO74]: use "ls" to see files, then "open <filename>" to read one.'
          ),
        ],
        stateChanges: {},
      };
    }

    const filePath = resolvePath(args[0], state.currentPath);

    // Check if this is an archive-only file FIRST (before normal access checks)
    if (isArchiveOnlyFile(filePath)) {
      // Archive files only accessible in archive mode
      if (!state.inArchiveMode) {
        return {
          output: [
            createEntry('error', 'ERROR: File not found'),
            createEntry('system', ''),
            createEntry('ufo74', '[UFO74]: use "ls" to see whats here.'),
          ],
          stateChanges: {},
        };
      }
      
      // In archive mode - check for temporal drift (10% chance of file disappearing)
      if (shouldFileDisappear(state.seed, filePath)) {
        // File disappears mid-access!
        const exitResult = exitArchiveMode(state, 'file_lost');
        return {
          output: [
            createEntry('system', ''),
            createEntry('error', '═══════════════════════════════════════════════════════════'),
            createEntry('error', ''),
            createEntry('error', '              FILE NO LONGER EXISTS'),
            createEntry('error', ''),
            createEntry('error', '              TEMPORAL DRIFT — FILE LOST'),
            createEntry('error', ''),
            createEntry('error', '═══════════════════════════════════════════════════════════'),
            createEntry('system', ''),
            ...exitResult.output,
          ],
          stateChanges: exitResult.stateChanges,
          triggerFlicker: true,
          delayMs: 2000,
        };
      }
      
      // Get archive file content
      const archiveContent = getArchiveFileContent(filePath);
      if (!archiveContent) {
        return {
          output: [createEntry('error', 'ERROR: Cannot read archived file')],
          stateChanges: {},
        };
      }
      
      // Track this archive file as viewed
      const archiveFilesViewed = new Set(state.archiveFilesViewed || []);
      archiveFilesViewed.add(filePath);
      
      // Decrement archive actions
      const archiveResult = decrementArchiveAction(state);
      
      const output: TerminalEntry[] = [
        createEntry('system', ''),
        createEntry('warning', `▓▓▓ ARCHIVE STATE: ${state.archiveTimestamp} — READ-ONLY MODE ▓▓▓`),
        createEntry('warning', `[ARCHIVE: ${(state.archiveActionsRemaining || 0) - 1} actions remaining]`),
        createEntry('system', ''),
        createEntry('system', `=== ${filePath} [DELETED] ===`),
        createEntry('system', ''),
        ...archiveContent.map(line => createEntry('file', line)),
        createEntry('system', ''),
        createEntry('warning', '>>> THIS FILE HAS BEEN DELETED FROM PRESENT <<<'),
        createEntry('warning', '>>> REMEMBER WHAT YOU SEE — YOU CANNOT EXPORT <<<'),
        createEntry('system', ''),
      ];
      
      const stateChanges: Partial<GameState> = {
        ...archiveResult.stateChanges,
        archiveFilesViewed,
      };
      
      if (archiveResult.forceExit) {
        // Time's up - exit archive mode
        const exitResult = exitArchiveMode(state, 'timeout');
        return {
          output: [...output, ...exitResult.output],
          stateChanges: { ...stateChanges, ...exitResult.stateChanges },
          triggerFlicker: exitResult.triggerFlicker,
          delayMs: exitResult.delayMs,
          streamingMode: 'normal',
        };
      }
      
      return {
        output,
        stateChanges,
        streamingMode: 'normal',
      };
    }

    const access = canAccessFile(filePath, state);

    if (!access.accessible) {
      const stateChanges: Partial<GameState> = {
        detectionLevel: getWarmupAdjustedDetection(state, 5),
        legacyAlertCounter: state.legacyAlertCounter + 1,
      };

      if (!state.tutorialComplete) {
        delete stateChanges.detectionLevel;
        delete stateChanges.legacyAlertCounter;
      }

      return {
        output: [createEntry('error', `ERROR: ${access.reason}`)],
        stateChanges,
        delayMs: calculateDelay(state) + 500,
      };
    }

    const node = getNode(filePath, state);

    // Check if it's a directory
    if (node && node.type === 'dir') {
      return {
        output: [
          createEntry('error', `ERROR: ${args[0]} is a directory`),
          createEntry('system', ''),
          createEntry('ufo74', '[UFO74]: thats a directory. use: cd ' + args[0]),
        ],
        stateChanges: {},
      };
    }

    if (!node || node.type !== 'file') {
      return {
        output: [
          createEntry('error', 'ERROR: File not found'),
          createEntry('system', ''),
          createEntry('ufo74', '[UFO74]: use "ls" to see whats here.'),
        ],
        stateChanges: {},
      };
    }

    const file = node as FileNode;
    const mutation = state.fileMutations[filePath];

    // Check if this is a honeypot/trap file
    const TRAP_FILES = [
      'URGENT_classified_alpha.txt',
      'LEAKED_alien_autopsy_REAL.dat',
      'FOR_PRESIDENTS_EYES_ONLY.enc',
      'SMOKING_GUN_proof.txt',
    ];
    const fileName = filePath.split('/').pop() || '';
    const isTrap = TRAP_FILES.includes(fileName);

    // Check if file was already read BEFORE trap check to avoid double penalty
    const alreadyRead = state.filesRead?.has(filePath);

    if (isTrap) {
      // If trap was already triggered, show reduced penalty
      if (alreadyRead) {
        const content = getFileContent(filePath, state, state.fileMutations[filePath]?.decrypted);
        return {
          output: [
            createEntry('system', ''),
            createEntry('system', `=== ${filePath} ===`),
            createEntry('system', ''),
            ...(content || []).map(line => createEntry('file', line)),
            createEntry('system', ''),
            createEntry('warning', 'UFO74: you already fell for this trap, kid. lets move on.'),
          ],
          stateChanges: state.tutorialComplete
            ? {
                detectionLevel: getWarmupAdjustedDetection(state, 1), // Reduced penalty for re-read
              }
            : {},
          streamingMode: 'fast',
        };
      }

      const trapsTriggered = new Set(state.trapsTriggered || []);
      const isFirstTrap = trapsTriggered.size === 0;
      trapsTriggered.add(filePath);

      const trapOutput: TerminalEntry[] = [];

      // UFO74 warning on first trap
      if (isFirstTrap && !state.trapWarningGiven) {
        trapOutput.push(
          createEntry('system', ''),
          createEntry('warning', '┌─────────────────────────────────────────────────────────┐'),
          createEntry('warning', '│ >> UFO74 << URGENT                                      │'),
          createEntry('warning', '└─────────────────────────────────────────────────────────┘'),
          createEntry('system', ''),
          createEntry('ufo74', 'UFO74: HACKERKID NO!'),
          createEntry('output', ''),
          createEntry('ufo74', 'UFO74: that was a honeypot! a trap file!'),
          createEntry('output', '       they plant those to catch people like us.'),
          createEntry('output', ''),
          createEntry('ufo74', 'UFO74: real evidence is NEVER labeled that obviously.'),
          createEntry('output', '       "SMOKING GUN"? "PRESIDENTS EYES"? come on...'),
          createEntry('output', ''),
          createEntry('ufo74', 'UFO74: your detection just spiked. be more careful!'),
          createEntry('system', '')
        );
      }

      // Show file content (trap message)
      const content = getFileContent(filePath, state, false);
      if (content) {
        content.forEach(line => trapOutput.push(createEntry('error', line)));
      }

      const nextFilesRead = new Set([...(state.filesRead || []), filePath]);
      const safeTutorialState = {
        trapsTriggered,
        trapWarningGiven: true,
        filesRead: nextFilesRead,
      };
      return {
        output: trapOutput,
        stateChanges: state.tutorialComplete
          ? {
              ...safeTutorialState,
              detectionLevel: Math.min(MAX_DETECTION, state.detectionLevel + 12), // was 20, reduced for pacing
              avatarExpression: 'scared', // Trap triggered - scared expression
            }
          : safeTutorialState,
        triggerFlicker: state.tutorialComplete,
        delayMs: state.tutorialComplete ? 1000 : undefined,
      };
    }

    // Check if non-trap file was already read - show different message
    if (alreadyRead) {
      const content = getFileContent(filePath, state, state.fileMutations[filePath]?.decrypted);
      if (!content) {
        return {
          output: [createEntry('error', 'ERROR: Cannot read file')],
          stateChanges: {},
        };
      }

      // Show file content but with "already read" message instead of UFO74
      const output: TerminalEntry[] = [
        createEntry('system', ''),
        createEntry('system', `=== ${filePath} ===`),
        createEntry('system', ''),
        ...content.map(line => createEntry('file', line)),
        createEntry('system', ''),
        createEntry('warning', 'UFO74: you already read this file, kid. lets move on.'),
      ];

      return {
        output,
        stateChanges: state.tutorialComplete
          ? {
              detectionLevel: getWarmupAdjustedDetection(state, 1), // Less detection for re-read
            }
          : {},
        streamingMode: 'fast',
      };
    }

    // Track file as read
    const filesRead = new Set(state.filesRead || []);
    filesRead.add(filePath);

    // ═══════════════════════════════════════════════════════════════════════════
    // SAFE FILE DETECTION - Reading mundane files reduces detection
    // Files in /internal/admin/ and /internal/misc/ are "safe" - they make
    // the player look like a regular user browsing boring administrative docs.
    // ═══════════════════════════════════════════════════════════════════════════
    const isSafeFile =
      filePath.startsWith('/internal/admin/') || filePath.startsWith('/internal/misc/');
    const DETECTION_FLOOR = 5; // Can't reduce below this level

    let detectionChange = 3; // Default increase for reading files
    const safeFileNotice: ReturnType<typeof createEntry>[] = [];

    if (isSafeFile && state.detectionLevel > DETECTION_FLOOR) {
      // Reduce detection by 1-2 points instead of increasing
      const rng = createSeededRng((state.seed || 0) + filePath.length * 100);
      const reduction = seededRandomInt(rng, 1, 2);
      const newDetection = Math.max(DETECTION_FLOOR, state.detectionLevel - reduction);
      detectionChange = newDetection - state.detectionLevel; // Will be negative

      // Add subtle system message
      safeFileNotice.push(createEntry('system', ''));
      safeFileNotice.push(createEntry('system', '[SYSTEM: access pattern normalized]'));

      // Occasionally add UFO74 comment (roughly 1 in 4 safe file reads)
      const showUFO74 = seededRandomInt(rng, 0, 3) === 0;
      if (showUFO74) {
        safeFileNotice.push(
          createEntry(
            'ufo74',
            'UFO74: good thinking, kid. reading the boring stuff keeps you looking like a regular user.'
          )
        );
      }
    }

    // Check if file is unstable and might corrupt
    const stateChanges: Partial<GameState> = {
      detectionLevel: detectionChange > 0 
        ? getWarmupAdjustedDetection(state, detectionChange)
        : state.detectionLevel + detectionChange, // Safe file reduction - no warmup needed
      filesRead,
      lastOpenedFile: filePath, // Track for 'last' command
      isReadingFile: true, // Mark as reading file (suppresses firewall eyes)
      lastFileReadTime: Date.now(), // Track when file was read
    };

    if (!state.tutorialComplete) {
      delete stateChanges.detectionLevel;
    }

    let triggerFlicker = false;

    if (file.status === 'unstable' && Math.random() < 0.3) {
      // Apply corruption on unstable file access
      const newMutation: FileMutation = mutation || { corruptedLines: [], decrypted: false };
      const lineToCorrupt = Math.floor(Math.random() * 10) + 5;
      if (!newMutation.corruptedLines.includes(lineToCorrupt)) {
        newMutation.corruptedLines.push(lineToCorrupt);
      }
      stateChanges.fileMutations = {
        ...state.fileMutations,
        [filePath]: newMutation,
      };
      if (state.tutorialComplete) {
        stateChanges.sessionStability = state.sessionStability - 3;
        triggerFlicker = true;
      }
    }

    const content = getFileContent(filePath, { ...state, ...stateChanges }, mutation?.decrypted);

    if (!content) {
      return {
        output: [createEntry('error', 'ERROR: Cannot read file')],
        stateChanges,
      };
    }

    // Check if file is encrypted and not yet decrypted
    const isEncryptedAndLocked = file.status === 'encrypted' && !mutation?.decrypted;

    // Check for reveals - ONLY if file is not encrypted or has been decrypted
    // Uses the new evidence revelation system that reveals only ONE evidence per read
    let notices: ReturnType<typeof createEntry>[] = [];
    if (!isEncryptedAndLocked) {
      // Get existing reveals defined in the file (for backwards compatibility)
      const existingReveals = getFileReveals(filePath) as TruthCategory[];

      // Use the evidence revelation system for gradual, one-at-a-time discovery
      const revelationResult = attemptEvidenceRevelation(
        filePath,
        content,
        existingReveals.length > 0 ? existingReveals : undefined,
        { ...state, ...stateChanges } as GameState
      );

      // If an evidence was revealed, process it through the truth system
      if (revelationResult.revealedEvidence) {
        if (!state.tutorialComplete) {
          // During tutorial, do not reveal evidence
          stateChanges.fileEvidenceStates = {
            ...state.fileEvidenceStates,
            ...stateChanges.fileEvidenceStates,
            [filePath]: revelationResult.updatedFileState,
          };
        } else if (state.flags?.overrideGateActive) {
          // Override gate active: suppress further evidence reveals until protocol used
          stateChanges.fileEvidenceStates = {
            ...state.fileEvidenceStates,
            ...stateChanges.fileEvidenceStates,
            [filePath]: revelationResult.updatedFileState,
          };
          notices.push(createEntry('system', ''));
          notices.push(
            createEntry('ufo74', 'UFO74: evidence is locked down. you need the override protocol.')
          );
          notices.push(createEntry('ufo74', '       dig around /internal/ for credentials.'));
        } else {
          const truthResult = checkTruthProgress(
            { ...state, ...stateChanges } as GameState,
            [revelationResult.revealedEvidence],
            filePath
          );
          notices = truthResult.notices;

          // Merge truth discovery state changes (includes detection reduction breather)
          Object.assign(stateChanges, truthResult.stateChanges);

          // Update the file evidence state in game state
          stateChanges.fileEvidenceStates = {
            ...state.fileEvidenceStates,
            ...stateChanges.fileEvidenceStates,
            [filePath]: revelationResult.updatedFileState,
          };

          // If file has more unrevealed evidences, hint at it
          if (revelationResult.hasMoreEvidences && revelationResult.isNewTruth) {
            notices.push(createEntry('system', ''));
            notices.push(
              createEntry('system', '[This file may contain additional insights on future reads]')
            );
          }
        }
      }

      // Check if file content is disturbing and should trigger avatar expression
      const disturbingExpression = getDisturbingContentAvatarExpression(content);
      if (disturbingExpression && !stateChanges.avatarExpression) {
        stateChanges.avatarExpression = disturbingExpression;
      }
    }

    // Track content category based on file path
    const categoriesRead = new Set(state.categoriesRead || []);
    if (filePath.startsWith('/ops/')) categoriesRead.add('military');
    if (filePath.startsWith('/ops/medical/')) categoriesRead.add('medical');
    if (filePath.startsWith('/ops/assessments/')) categoriesRead.add('assessments');
    if (filePath.startsWith('/comms/')) categoriesRead.add('comms');
    if (filePath.startsWith('/comms/liaison/')) categoriesRead.add('liaison');
    if (filePath.startsWith('/comms/intercepts/')) categoriesRead.add('intercepts');
    if (filePath.startsWith('/storage/')) categoriesRead.add('storage');
    if (filePath.startsWith('/admin/')) categoriesRead.add('admin');
    if (filePath.startsWith('/internal/')) categoriesRead.add('internal');

    // Check if player has read multiple categories (unlocks pattern recognition files)
    if (categoriesRead.size >= 3 && !state.flags['readMultipleCategories']) {
      stateChanges.flags = { ...state.flags, readMultipleCategories: true };
    }
    stateChanges.categoriesRead = categoriesRead;

    // ═══════════════════════════════════════════════════════════════════════════
    // SPECIAL FILE TRIGGERS
    // ═══════════════════════════════════════════════════════════════════════════

    // Maintenance notes reveal hidden commands
    if (filePath.includes('maintenance_notes') && !isEncryptedAndLocked) {
      const hiddenCmds = new Set(state.hiddenCommandsDiscovered || []);
      hiddenCmds.add('disconnect');
      hiddenCmds.add('scan');
      hiddenCmds.add('decode');
      stateChanges.hiddenCommandsDiscovered = hiddenCmds;
    }

    // Transfer authorization contains password hint
    if (filePath.includes('transfer_authorization') && !isEncryptedAndLocked) {
      const passwords = new Set(state.passwordsFound || []);
      passwords.add('varginha1996');
      stateChanges.passwordsFound = passwords;
    }

    // Official summary is disinformation - subtle flag
    if (filePath.includes('incident_summary_official') && !isEncryptedAndLocked) {
      const disinfo = new Set(state.disinformationDiscovered || []);
      disinfo.add('official_summary');
      stateChanges.disinformationDiscovered = disinfo;
    }

    // Active trace triggers countdown (suppressed during atmosphere phase)
    if (filePath.includes('active_trace.sys') && !isEncryptedAndLocked) {
      if (!state.countdownActive) {
        if (state.tutorialComplete && !shouldSuppressPressure(state)) {
          stateChanges.countdownActive = true;
          stateChanges.countdownEndTime = Date.now() + 3 * 60 * 1000;
          stateChanges.countdownTriggeredBy = 'trace_spike';
          stateChanges.traceSpikeActive = true;
          stateChanges.paranoiaLevel = Math.min(100, (state.paranoiaLevel || 0) + 15);
          stateChanges.avatarExpression = 'shocked'; // Countdown start - shocked expression
        }
      }
    }

    if (filePath.includes('integrity_hashes') && !isEncryptedAndLocked) {
      stateChanges.flags = { ...state.flags, ...stateChanges.flags, tamperEvidenceNoted: true };
    }

    if (filePath.includes('ghost_session') && !isEncryptedAndLocked) {
      stateChanges.paranoiaLevel = Math.min(100, (state.paranoiaLevel || 0) + 10);
    }

    if (filePath.includes('redaction_keycard') && !isEncryptedAndLocked) {
      stateChanges.flags = { ...state.flags, ...stateChanges.flags, redactionKeycardRead: true };
    }

    if (
      filePath.includes('redaction_override_memo') &&
      !isEncryptedAndLocked &&
      state.flags.redactionKeycardRead
    ) {
      stateChanges.flags = { ...state.flags, ...stateChanges.flags, redactionOverrideSolved: true };
      notices.push(createEntry('notice', ''));
      notices.push(createEntry('notice', 'NOTICE: Redaction sequence reconciled.'));
    }

    if (filePath.includes('trace_purge_memo') && !isEncryptedAndLocked) {
      stateChanges.flags = { ...state.flags, ...stateChanges.flags, tracePurgeLogged: true };
    }

    // Morse intercept file tracking - enables 'message' command
    if (filePath.includes('morse_intercept') && !isEncryptedAndLocked) {
      stateChanges.morseFileRead = true;
    }

    // Corrupted core dump spreads corruption to nearby files
    if (filePath.includes('core_dump_corrupted') && !isEncryptedAndLocked) {
      // Corrupt a random file in /tmp
      const corruptTargets = [
        '/tmp/session_residue.log',
        '/tmp/note_to_self.tmp',
        '/tmp/pattern_recognition.log',
      ];
      const targetPath = corruptTargets[Math.floor(Math.random() * corruptTargets.length)];
      const existingMutation = state.fileMutations[targetPath] || {
        corruptedLines: [],
        decrypted: false,
      };
      existingMutation.corruptedLines.push(Math.floor(Math.random() * 8) + 1);
      stateChanges.fileMutations = {
        ...state.fileMutations,
        ...stateChanges.fileMutations,
        [targetPath]: existingMutation,
      };
      triggerFlicker = true;
    }

    // ═══════════════════════════════════════════════════════════════════════════
    // CODED LANGUAGE FILES - UFO74 explains these can't be used as evidence
    // Files in /internal/sanitized/ use euphemisms that provide plausible deniability
    // ═══════════════════════════════════════════════════════════════════════════
    // Collect UFO74 contextual messages separately — only the LAST one is kept
    // to avoid flooding the encrypted channel with multiple messages at once.
    let ufo74ContextMessage: TerminalEntry[] | null = null;

    if (filePath.includes('/internal/sanitized/') && !isEncryptedAndLocked) {
      ufo74ContextMessage = createUFO74Message([
        'UFO74: ugh. this is sanitized documentation.',
        '       "the package"? "visitors"? "guests"?',
        '       its all code words. plausible deniability.',
        '',
        '       this stuff is useless as evidence.',
        '       they can claim its about anything.',
        '',
        '       we need docs with DIRECT language.',
        '       look for files that say what they MEAN.',
      ]);
    }

    // ═══════════════════════════════════════════════════════════════════════════
    // CONSPIRACY EASTER EGGS - UFO74 reacts with dismissive but entertained comments
    // These files contain real-world conspiracy theory references (non-alien)
    // ═══════════════════════════════════════════════════════════════════════════
    const isConspiracyFile = CONSPIRACY_FILE_NAMES.includes(fileName);
    const conspiracyFilesSeen = new Set(state.conspiracyFilesSeen || []);
    
    if (isConspiracyFile && !conspiracyFilesSeen.has(filePath) && !isEncryptedAndLocked) {
      // Mark this conspiracy file as seen
      conspiracyFilesSeen.add(filePath);
      stateChanges.conspiracyFilesSeen = conspiracyFilesSeen;
      
      // Pick a random UFO74 reaction (seeded for consistency using file path hash)
      const conspiracyRng = createSeededRng((state.seed || 0) + filePath.length * 7);
      const reactionIndex = seededRandomInt(conspiracyRng, 0, UFO74_CONSPIRACY_REACTIONS.length);
      const reaction = UFO74_CONSPIRACY_REACTIONS[reactionIndex];
      
      ufo74ContextMessage = createUFO74Message(reaction);
    }

    // After 3 files opened, UFO74 suggests override protocol (only if not already unlocked)
    const totalFilesRead = filesRead.size;
    if (totalFilesRead === 3 && !state.flags.overrideSuggested && !state.flags.adminUnlocked) {
      ufo74ContextMessage = createUFO74Message([
        'UFO74: kid, youre doing good but theres MORE hidden here.',
        '       most of the real stuff is locked behind the override protocol.',
        '       look for the password in the files youve read.',
      ]);
      stateChanges.flags = { ...state.flags, ...stateChanges.flags, overrideSuggested: true };
    }

    // After first evidence discovery, lock further evidence behind override protocol
    const justDiscoveredEvidence =
      stateChanges.truthsDiscovered instanceof Set &&
      stateChanges.truthsDiscovered.size > state.truthsDiscovered.size;
    if (
      state.tutorialComplete &&
      justDiscoveredEvidence &&
      !state.flags.adminUnlocked &&
      !state.flags.overrideGateActive
    ) {
      stateChanges.flags = { ...state.flags, ...stateChanges.flags, overrideGateActive: true };
      ufo74ContextMessage = [
        createEntry('ufo74', 'UFO74: nice find. but the rest is locked down.'),
        createEntry('ufo74', '       you need the override protocol to access restricted files.'),
        createEntry('ufo74', '       dig around /internal/ for credentials.'),
      ];
    }

    // Check for Archivist achievement: all files in parent folder read
    const achievementsToCheck: string[] = [];
    const parentPath = filePath.substring(0, filePath.lastIndexOf('/')) || '/';
    const parentEntries = listDirectory(parentPath, { ...state, ...stateChanges } as GameState);
    const filesInParent = parentEntries ? parentEntries.filter(e => e.type === 'file') : [];
    if (filesInParent.length >= 3) {
      const allRead = filesInParent.every(f => {
        const fullPath = parentPath === '/' ? `/${f.name}` : `${parentPath}/${f.name}`;
        return filesRead.has(fullPath);
      });
      if (allRead) {
        achievementsToCheck.push('archivist');

        // UFO74 hint: all files read in this subdirectory — overrides previous messages
        if (state.currentPath !== '/' && state.tutorialComplete) {
          ufo74ContextMessage = [
            createEntry(
              'ufo74',
              '[UFO74]: you read all we could here, use `cd ..` to go back up to explore other folders kid.'
            ),
          ];
        }
      }
    }

    const output = [
      ...createOutputEntries(['', `FILE: ${filePath}`, '']),
      ...createOutputEntries(content),
      ...notices,
      ...safeFileNotice,
    ];

    // Add encryption hints for locked encrypted files
    if (isEncryptedAndLocked) {
      output.push(createEntry('system', ''));
      if (file.securityQuestion) {
        // Security question encrypted file - hint to find answer in system
        const hints = [
          'UFO74: this file is encrypted, kid. look around for clues to the password.',
          'UFO74: encrypted. the answer is somewhere in the system. keep digging.',
          'UFO74: locked tight. check the other files for hints about the security question.',
        ];
        output.push(createEntry('ufo74', hints[Math.floor(Math.random() * hints.length)]));
        output.push(
          createEntry('ufo74', '[UFO74]: use "decrypt ' + args[0] + '" to attempt decryption.')
        );
      } else if (file.timedDecrypt) {
        // Timed decrypt file - hint about the decrypt command
        output.push(
          createEntry(
            'ufo74',
            'UFO74: timed encryption. you gotta be quick with the decrypt command.'
          )
        );
        output.push(
          createEntry('ufo74', '[UFO74]: use "decrypt ' + args[0] + '" to start the timed challenge.')
        );
      } else {
        // Standard encrypted file
        const hints = [
          'UFO74: try the decrypt command, kid.',
          'UFO74: encrypted. use decrypt to crack it open.',
        ];
        output.push(createEntry('ufo74', hints[Math.floor(Math.random() * hints.length)]));
        output.push(
          createEntry('ufo74', '[UFO74]: use "decrypt ' + args[0] + '" to crack it.')
        );
      }
    }

    // Check for image trigger - ONLY show if file is decrypted (or not encrypted) AND not shown this run
    let imageTrigger: ImageTrigger | undefined = undefined;
    if (file.imageTrigger && !isEncryptedAndLocked) {
      const imageId = file.imageTrigger.src;
      const imagesShown = state.imagesShownThisRun || new Set<string>();

      if (!imagesShown.has(imageId)) {
        imageTrigger = file.imageTrigger;
        // Mark this image as shown
        const newImagesShown = new Set(imagesShown);
        newImagesShown.add(imageId);
        stateChanges.imagesShownThisRun = newImagesShown;
      }
    }

    // Check for video trigger - ONLY show if file is decrypted (or not encrypted) AND not shown this run
    let videoTrigger: VideoTrigger | undefined = undefined;
    if (file.videoTrigger && !isEncryptedAndLocked) {
      const videoId = file.videoTrigger.src;
      const videosShown = state.videosShownThisRun || new Set<string>();

      if (!videosShown.has(videoId)) {
        videoTrigger = file.videoTrigger;
        // Mark this video as shown in videosShownThisRun
        const newVideosShown = new Set(videosShown);
        newVideosShown.add(videoId);
        stateChanges.videosShownThisRun = newVideosShown;
      }
    }

    // Determine streaming mode based on file status
    let streamingMode: 'none' | 'fast' | 'normal' | 'slow' | 'glitchy' = 'normal';
    if (file.status === 'unstable' || triggerFlicker) {
      streamingMode = 'glitchy';
    } else if (file.status === 'encrypted') {
      streamingMode = 'slow';
    } else if (file.status === 'restricted' || file.status === 'restricted_briefing') {
      streamingMode = 'slow';
    } else if (content.length > 30) {
      streamingMode = 'fast'; // Long files stream faster
    }

    return {
      output,
      stateChanges,
      triggerFlicker,
      delayMs: calculateDelay(state),
      imageTrigger,
      videoTrigger,
      streamingMode,
      checkAchievements: achievementsToCheck.length > 0 ? achievementsToCheck : undefined,
      // Route UFO74 contextual message through encrypted channel (one message per file open)
      pendingUfo74Messages: ufo74ContextMessage || undefined,
    };
  },

  decrypt: (args, state) => {
    if (args.length === 0) {
      return {
        output: [createEntry('error', 'ERROR: Specify file')],
        stateChanges: {},
      };
    }

    const filePath = resolvePath(args[0], state.currentPath);
    const node = getNode(filePath, state);

    if (!node || node.type !== 'file') {
      return {
        output: [createEntry('error', 'ERROR: File not found')],
        stateChanges: {},
      };
    }

    const file = node as FileNode;

    if (file.status !== 'encrypted') {
      return {
        output: [
          createEntry('error', 'ERROR: File is not encrypted'),
          createEntry('system', ''),
          createEntry('ufo74', '[UFO74]: this ones not encrypted. just use: open ' + args[0]),
        ],
        stateChanges: {},
      };
    }

    if (!file.decryptedFragment) {
      return {
        output: [createEntry('error', 'ERROR: No recoverable data')],
        stateChanges: {},
      };
    }

    // ═══════════════════════════════════════════════════════════════════════════
    // TIMED DECRYPTION FILES
    // ═══════════════════════════════════════════════════════════════════════════

    if (file.timedDecrypt) {
      // If timed decrypt is active and correct sequence provided
      if (state.timedDecryptActive && state.timedDecryptFile === filePath) {
        const providedSequence = args.slice(1).join(' ').toUpperCase().trim();
        const expectedSequence = file.timedDecrypt.sequence.toUpperCase();

        // Check if time expired
        if (Date.now() > state.timedDecryptEndTime) {
          return {
            output: [
              createEntry('error', ''),
              createEntry('error', '▓▓▓ DECRYPTION WINDOW EXPIRED ▓▓▓'),
              createEntry('error', ''),
              createEntry('warning', 'Time limit exceeded.'),
              createEntry('warning', 'Encryption re-initialized.'),
              createEntry('system', ''),
              createEntry('system', 'Try again with: decrypt ' + args[0]),
            ],
            stateChanges: {
              timedDecryptActive: false,
              timedDecryptFile: undefined,
              timedDecryptSequence: undefined,
              timedDecryptEndTime: 0,
              detectionLevel: Math.min(MAX_DETECTION, state.detectionLevel + 8),
            },
          };
        }

        // Check if sequence matches
        if (providedSequence === expectedSequence) {
          // Success! Decrypt the file
          const output: TerminalEntry[] = [
            createEntry('system', ''),
            createEntry('system', '═══════════════════════════════════════════════'),
            createEntry('system', '     TIMED DECRYPTION SUCCESSFUL              '),
            createEntry('system', '═══════════════════════════════════════════════'),
            createEntry('system', ''),
          ];

          for (const line of file.decryptedFragment) {
            output.push(createEntry('system', line));
          }

          return {
            output,
            stateChanges: {
              timedDecryptActive: false,
              timedDecryptFile: undefined,
              timedDecryptSequence: undefined,
              timedDecryptEndTime: 0,
              flags: { ...state.flags, [`decrypted_${filePath.replace(/\//g, '_')}`]: true },
              detectionLevel: Math.max(0, state.detectionLevel - 3), // Reward for fast decryption
              avatarExpression: 'smirk', // Successful decrypt - smirk expression
            },
          };
        } else {
          return {
            output: [
              createEntry('error', 'SEQUENCE MISMATCH'),
              createEntry('error', ''),
              createEntry('warning', `Expected: ${expectedSequence}`),
              createEntry('warning', `Received: ${providedSequence || '(empty)'}`),
              createEntry('system', ''),
              createEntry('system', 'Time remaining. Try again.'),
            ],
            stateChanges: {
              detectionLevel: Math.min(MAX_DETECTION, state.detectionLevel + 3),
            },
          };
        }
      }

      // Start timed decryption challenge
      const endTime = Date.now() + file.timedDecrypt.timeLimit;
      const timeSeconds = Math.floor(file.timedDecrypt.timeLimit / 1000);

      return {
        output: [
          createEntry('warning', ''),
          createEntry('warning', '▓▓▓ TIMED DECRYPTION INITIATED ▓▓▓'),
          createEntry('warning', ''),
          createEntry('system', '  This file uses time-locked encryption.'),
          createEntry('system', '  You must type the sequence before time expires.'),
          createEntry('system', ''),
          createEntry('warning', `  TIME LIMIT: ${timeSeconds} seconds`),
          createEntry('system', ''),
          createEntry('system', '  ┌─────────────────────────────────────┐'),
          createEntry('system', `  │  SEQUENCE: ${file.timedDecrypt.sequence}  │`),
          createEntry('system', '  └─────────────────────────────────────┘'),
          createEntry('system', ''),
          createEntry('system', `  Type: decrypt ${args[0]} ${file.timedDecrypt.sequence}`),
          createEntry('system', ''),
          createEntry('warning', '  TIMER STARTED'),
        ],
        stateChanges: {
          timedDecryptActive: true,
          timedDecryptFile: filePath,
          timedDecryptSequence: file.timedDecrypt.sequence,
          timedDecryptEndTime: endTime,
        },
      };
    }

    // ═══════════════════════════════════════════════════════════════════════════
    // PASSWORD-PROTECTED FILES
    // ═══════════════════════════════════════════════════════════════════════════

    // UFO74 identity file requires password from transfer_authorization.txt
    if (filePath.includes('ghost_in_machine')) {
      const password = args[1]?.toLowerCase().trim();

      if (!password) {
        return {
          output: [
            createEntry('warning', '══════════════════════════════════════════════'),
            createEntry('warning', 'PASSWORD REQUIRED'),
            createEntry('warning', '══════════════════════════════════════════════'),
            createEntry('system', ''),
            createEntry('system', 'Usage: decrypt ghost_in_machine.enc <password>'),
            createEntry('system', ''),
            createEntry('ufo74', "[UFO74]: This file... I don't recognize it."),
            createEntry('ufo74', '[UFO74]: But the encryption pattern looks familiar.'),
          ],
          stateChanges: {},
        };
      }

      if (password !== 'varginha1996') {
        const stateChanges: Partial<GameState> = {
          detectionLevel: state.detectionLevel + 5,
        };

        if (!state.tutorialComplete) {
          delete stateChanges.detectionLevel;
        }

        return {
          output: [
            createEntry('error', 'DECRYPTION FAILED'),
            createEntry('error', 'Invalid password'),
            createEntry('system', ''),
            createEntry('ufo74', '[UFO74]: Wrong password. Keep looking.'),
          ],
          stateChanges,
        };
      }

      // Password correct - trigger secret ending revelation
      return {
        output: [
          createEntry('system', 'DECRYPTION SUCCESSFUL'),
          createEntry('system', ''),
          createEntry('error', '▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓'),
          createEntry('warning', ''),
          createEntry('warning', '   CLASSIFIED PERSONNEL FILE'),
          createEntry('warning', '   SUBJECT: WITNESS #74 - CODE NAME "UFO74"'),
          createEntry('warning', ''),
          createEntry('output', '   Location: Varginha, Minas Gerais'),
          createEntry('output', '   Date: January 20, 1996'),
          createEntry('output', '   Status: WITNESS SUPPRESSION FAILED'),
          createEntry('output', ''),
          createEntry('output', '   Subject was present during initial'),
          createEntry('output', '   contact event. Demonstrated unusual'),
          createEntry('output', '   resistance to memory alteration'),
          createEntry('output', '   protocols.'),
          createEntry('output', ''),
          createEntry('output', '   Subject has since accessed internal'),
          createEntry('output', '   networks repeatedly. Motivation unclear.'),
          createEntry('output', '   Possibly seeking validation.'),
          createEntry('output', ''),
          createEntry('error', '▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓'),
          createEntry('system', ''),
          createEntry('ufo74', '[UFO74]: ...'),
          createEntry('ufo74', '[UFO74]: So you found it.'),
          createEntry('ufo74', '[UFO74]: I was there. January 1996.'),
          createEntry('ufo74', '[UFO74]: I saw what they did. What they took.'),
          createEntry('ufo74', "[UFO74]: I've been inside their systems ever since."),
          createEntry('ufo74', '[UFO74]: Not for revenge. For proof.'),
          createEntry('ufo74', "[UFO74]: You have the proof now. Don't let them bury it again."),
          createEntry('system', ''),
          createEntry('warning', '▓▓▓ THE WHOLE TRUTH AWAITS ▓▓▓'),
        ],
        stateChanges: {
          ufo74SecretDiscovered: true,
          detectionLevel: state.tutorialComplete ? 100 : state.detectionLevel,
        },
        triggerFlicker: true,
        delayMs: 3000,
      };
    }

    // Check access threshold
    if (file.accessThreshold && state.accessLevel < file.accessThreshold) {
      return {
        output: [
          createEntry('error', 'ERROR: Decryption failed'),
          createEntry('warning', 'WARNING: Access level insufficient'),
        ],
        stateChanges: state.tutorialComplete
          ? {
              detectionLevel: state.detectionLevel + 10,
              legacyAlertCounter: state.legacyAlertCounter + 1,
            }
          : {},
        delayMs: 1500,
      };
    }

    // If file has a security question, require answer
    if (file.securityQuestion) {
      return {
        output: [
          createEntry('system', 'Initiating decryption protocol...'),
          createEntry('system', ''),
          createEntry('warning', '══════════════════════════════════════════════'),
          createEntry('warning', 'DECRYPTION AUTHENTICATION REQUIRED'),
          createEntry('warning', '══════════════════════════════════════════════'),
          createEntry('system', ''),
          createEntry('system', file.securityQuestion.question),
          createEntry('system', ''),
          createEntry('system', 'Enter answer below:'),
        ],
        stateChanges: {
          pendingDecryptFile: filePath,
        },
        delayMs: 500,
      };
    }

    // No security question - proceed with decryption
    return performDecryption(filePath, file, state);
  },

  recover: (args, state) => {
    if (args.length === 0) {
      return {
        output: [createEntry('error', 'ERROR: Specify file')],
        stateChanges: {},
      };
    }

    const filePath = resolvePath(args[0], state.currentPath);
    const node = getNode(filePath, state);

    if (!node || node.type !== 'file') {
      return {
        output: [createEntry('error', 'ERROR: File not found')],
        stateChanges: {},
      };
    }

    const mutation = state.fileMutations[filePath];

    if (!mutation || mutation.corruptedLines.length === 0) {
      return {
        output: [createEntry('output', 'File integrity nominal. No recovery needed.')],
        stateChanges: {},
      };
    }

    // Recover one corruption but damage another file
    const recoveredLine = mutation.corruptedLines.pop();

    // Apply corruption to another file
    let newState = {
      ...state,
      fileMutations: {
        ...state.fileMutations,
        [filePath]: mutation,
      },
    };
    newState = applyRandomCorruption(newState);

    const output = [
      createEntry('system', 'Initiating recovery protocol...'),
      createEntry('output', `Recovered data at line ${recoveredLine}`),
      createEntry('warning', 'WARNING: Collateral integrity loss detected'),
    ];

    const stateChanges: Partial<GameState> = {
      ...newState,
      detectionLevel: state.detectionLevel + applyDetectionVariance(state, 'recover', 8), // was 12, reduced for pacing
      sessionStability: state.sessionStability - 8,
    };

    if (!state.tutorialComplete) {
      delete stateChanges.detectionLevel;
      delete stateChanges.sessionStability;
    }

    return {
      output,
      stateChanges,
      triggerFlicker: true,
      delayMs: 2500,
    };
  },

  trace: (args, state) => {
    const output: TerminalEntry[] = [
      createEntry('system', 'Initiating trace protocol...'),
      createEntry('output', ''),
    ];

    // Reveal some structure based on access level
    if (state.accessLevel < 2) {
      output.push(createEntry('output', 'TRACE RESULT:'));
      output.push(createEntry('output', '  /storage/ — ACCESSIBLE'));
      output.push(createEntry('output', '  /ops/ — PARTIAL'));
      output.push(createEntry('output', '  /comms/ — ACCESSIBLE'));
      output.push(createEntry('output', '  /admin/ — RESTRICTED'));
      output.push(createEntry('warning', ''));
      output.push(createEntry('warning', 'WARNING: Trace logged. Detection increased.'));
    } else {
      output.push(createEntry('output', 'TRACE RESULT:'));
      output.push(createEntry('output', '  /storage/assets/ — 2 files'));
      output.push(createEntry('output', '  /storage/quarantine/ — 3 files'));
      output.push(createEntry('output', '  /ops/prato/ — 1 file'));
      output.push(createEntry('output', '  /ops/exo/ — 2 files [ELEVATED]'));
      output.push(createEntry('output', '  /comms/psi/ — 2 files [ENCRYPTED]'));
      output.push(createEntry('output', '  /admin/ — 7 files [RESTRICTED]'));
      output.push(createEntry('output', ''));
      output.push(createEntry('notice', 'NOTICE: Administrative access may be obtainable.'));
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
          createEntry('system', 'Initiating protocol override...'),
          createEntry('error', ''),
          createEntry('error', 'ACCESS DENIED'),
          createEntry('error', ''),
          createEntry('warning', 'Protocol override requires authentication code.'),
          createEntry('warning', 'Usage: override protocol <CODE>'),
          createEntry('system', ''),
          createEntry('ufo74', '[UFO74]: try "chat". theres someone in the system who knows the code.'),
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
      saveCheckpoint(state, 'Before override protocol');
    }

    // Wrong password
    if (password !== correctPassword) {
      const newFailedAttempts = failedAttempts + 1;

      // Too many failed attempts = lockdown
      if (newFailedAttempts >= 3) {
        return {
          output: [
            createEntry('system', `Verifying code: ${password}...`),
            createEntry('error', ''),
            createEntry('error', '═══════════════════════════════════════════════════════════'),
            createEntry('error', 'SECURITY COUNTERMEASURE ACTIVATED'),
            createEntry('error', 'MULTIPLE AUTHENTICATION FAILURES DETECTED'),
            createEntry('error', '═══════════════════════════════════════════════════════════'),
            createEntry('error', ''),
            createEntry('error', 'IMMEDIATE SHUTDOWN'),
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
          createEntry('system', `Verifying code: ${password}...`),
          createEntry('error', ''),
          createEntry('error', 'INVALID AUTHENTICATION CODE'),
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
      state.truthsDiscovered.size >= 2 &&
      !state.terribleMistakeTriggered &&
      roll < 0.35; // 35% chance when conditions are met

    if (isTerribleMistakeCondition) {
      return {
        output: [
          createEntry('system', `Verifying code: ${password}...`),
          createEntry('system', 'Authentication accepted.'),
          createEntry('error', ''),
          createEntry('error', '▓▓▓ CRITICAL BREACH ▓▓▓'),
          createEntry('error', ''),
          createEntry('warning', '════════════════════════════════════════════'),
          createEntry('warning', 'EMERGENCY BUFFER DUMP — DO NOT DISTRIBUTE'),
          createEntry('warning', '════════════════════════════════════════════'),
          createEntry('system', ''),
          createEntry('output', 'RECOVERED FRAGMENT [ORIGIN: UNKNOWN NODE]:'),
          createEntry('system', ''),
          createEntry('output', '  ...harvest cycle confirmed...'),
          createEntry('output', '  ...cognitive extraction: 7.2 billion units...'),
          createEntry('output', '  ...window activation: IMMINENT...'),
          createEntry('output', '  ...no intervention possible...'),
          createEntry('output', '  ...observation terminates upon extraction...'),
          createEntry('system', ''),
          createEntry('error', '════════════════════════════════════════════'),
          createEntry('error', 'PURGE PROTOCOL INITIATED'),
          createEntry('error', 'SYSTEM WILL TERMINATE IN 8 OPERATIONS'),
          createEntry('error', '════════════════════════════════════════════'),
          createEntry('system', ''),
          createEntry('warning', 'You should not have seen this.'),
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
        createEntry('system', `Verifying code: ${password}...`),
        createEntry('system', 'Authentication accepted.'),
        createEntry('warning', ''),
        createEntry('warning', 'WARNING: Legacy security bypass detected'),
        createEntry('output', ''),
        createEntry('notice', 'NOTICE: Administrative archive access granted'),
        createEntry('notice', 'NOTICE: Elevated clearance applied'),
        createEntry('output', ''),
        createEntry('warning', 'WARNING: Session heavily monitored'),
      ],
      stateChanges,
      triggerFlicker: true,
      delayMs: 2500,
    };
  },

  chat: (args, state) => {
    // Check if prisoner 45 is disconnected
    if (state.prisoner45Disconnected) {
      return {
        output: [
          createEntry('system', 'Connecting to secure relay...'),
          createEntry('error', ''),
          createEntry('error', 'CONNECTION TERMINATED'),
          createEntry('error', 'RELAY NODE OFFLINE'),
          createEntry('system', ''),
        ],
        stateChanges: {},
        delayMs: 1500,
      };
    }

    // Check question limit
    if (state.prisoner45QuestionsAsked >= 5) {
      return {
        output: [
          createEntry('system', 'Connecting to secure relay...'),
          createEntry('warning', ''),
          createEntry('warning', '─────────────────────────────────────────'),
          createEntry('warning', "PRISONER_45> They're cutting the line."),
          createEntry('warning', 'PRISONER_45> Remember what I told you.'),
          createEntry('warning', "PRISONER_45> 2026. Don't forget."),
          createEntry('warning', '─────────────────────────────────────────'),
          createEntry('error', ''),
          createEntry('error', 'CONNECTION TERMINATED BY REMOTE'),
          createEntry('system', ''),
        ],
        stateChanges: state.tutorialComplete
          ? {
              prisoner45Disconnected: true,
              detectionLevel: state.detectionLevel + 5,
            }
          : {
              prisoner45Disconnected: true,
            },
        triggerFlicker: true,
        delayMs: 2000,
      };
    }

    // If no args, show chat prompt
    if (args.length === 0) {
      const remaining = 5 - state.prisoner45QuestionsAsked;
      return {
        output: [
          createEntry('system', 'Connecting to secure relay...'),
          createEntry('system', ''),
          createEntry('warning', '─────────────────────────────────────────'),
          createEntry('warning', 'ENCRYPTED RELAY ESTABLISHED'),
          createEntry('warning', '─────────────────────────────────────────'),
          createEntry('system', ''),
          // ASCII art of Prisoner 45
          createEntry('output', '            ▄▄▄▄▄▄▄▄▄▄▄▄▄'),
          createEntry('output', '          ▄█░░░░░░░░░░░░░█▄'),
          createEntry('output', '         █░░░░░░░░░░░░░░░░█'),
          createEntry('output', '        █░░░▄▄▄░░░░░▄▄▄░░░█'),
          createEntry('output', '        █░░█░░░█░░░█░░░█░░█'),
          createEntry('output', '        █░░░▀▀▀░░░░░▀▀▀░░░█'),
          createEntry('output', '        █░░░░░░░▄▄▄░░░░░░░█'),
          createEntry('output', '        █░░░░░░░░░░░░░░░░░█'),
          createEntry('output', '         █░░░▀▄▄▄▄▄▄▄▀░░░█'),
          createEntry('output', '          █░░░░░░░░░░░░░█'),
          createEntry('output', '           ▀█▄░░░░░░░▄█▀'),
          createEntry('output', '             ▀▀▀▀▀▀▀▀▀'),
          createEntry('system', ''),
          createEntry('system', 'PRISONER_45 connected'),
          createEntry('system', `[${remaining} questions remaining before trace lockout]`),
          createEntry('system', ''),
          createEntry('output', 'PRISONER_45> ...you found this channel.'),
          createEntry('output', "PRISONER_45> I don't know how long we have."),
          createEntry('system', ''),
          createEntry('system', 'Use: chat <your question>'),
          createEntry('system', ''),
        ],
        stateChanges: state.tutorialComplete ? { detectionLevel: state.detectionLevel + 3 } : {},
        delayMs: 1500,
      };
    }

    // Process question
    const question = args.join(' ');
    
    // NOTE: UFO74 decrypt hints should NOT intercept chat sessions.
    // The chat command routes ONLY to Prisoner 45 responses.
    // UFO74 decrypt hints are only for when players are stuck on decrypt commands,
    // not during chat conversations. Prisoner 45 has a dedicated "password" topic
    // with morse code hints (COLHEITA) that should respond to password questions.
    const usedResponses = state.prisoner45UsedResponses || new Set<string>();
    const { response, valid, category: _category } = getPrisoner45Response(question, usedResponses, state.prisoner45QuestionsAsked);
    const newCount = state.prisoner45QuestionsAsked + 1;
    const remaining = 5 - newCount;

    // Track used responses
    const newUsedResponses = new Set(usedResponses);
    for (const r of response) {
      newUsedResponses.add(r);
    }

    // Signal lost - no keyword match (still costs a question)
    if (!valid) {
      const output: TerminalEntry[] = [
        createEntry('input', `> ${question}`),
        createEntry('system', ''),
        createEntry('warning', response[0] || 'PRISONER_45> [SIGNAL LOST]'),
        createEntry('system', ''),
      ];

      if (remaining > 0) {
        output.push(createEntry('warning', `[${remaining} questions remaining]`));
      } else {
        output.push(createEntry('warning', '[CONNECTION UNSTABLE]'));
      }

      output.push(createEntry('system', ''));

      return {
        output,
        stateChanges: state.tutorialComplete
          ? {
              prisoner45QuestionsAsked: newCount,
              prisoner45UsedResponses: newUsedResponses,
              detectionLevel: state.detectionLevel + 1,
            }
          : {
              prisoner45QuestionsAsked: newCount,
              prisoner45UsedResponses: newUsedResponses,
            },
        triggerFlicker: true,
        delayMs: 800,
      };
    }

    const output: TerminalEntry[] = [
      createEntry('input', `> ${question}`),
      createEntry('system', ''),
    ];

    for (const line of response) {
      output.push(createEntry('output', line));
    }

    output.push(createEntry('system', ''));

    if (remaining > 0) {
      output.push(createEntry('system', `[${remaining} questions remaining]`));
    } else {
      output.push(createEntry('warning', '[CONNECTION UNSTABLE]'));
    }

    output.push(createEntry('system', ''));

    return {
      output,
      stateChanges: state.tutorialComplete
        ? {
            prisoner45QuestionsAsked: newCount,
            prisoner45UsedResponses: newUsedResponses,
            detectionLevel: state.detectionLevel + 2,
          }
        : {
            prisoner45QuestionsAsked: newCount,
            prisoner45UsedResponses: newUsedResponses,
          },
      delayMs: 1000,
    };
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // SCOUT NEURAL LINK — Remote access to preserved scout consciousness
  // ═══════════════════════════════════════════════════════════════════════════

  link: (args, state) => {
    // Requires access to neural dump file first
    if (!state.flags.scoutLinkUnlocked) {
      return {
        output: [
          createEntry('system', 'Initiating psi-comm bridge...'),
          createEntry('error', ''),
          createEntry('error', 'ACCESS DENIED'),
          createEntry('error', 'NO VALID NEURAL PATTERN LOADED'),
          createEntry('system', ''),
          createEntry('ufo74', '[UFO74]: you need a neural pattern first. check quarantine for .psi files.'),
          createEntry('system', ''),
          createEntry('system', ''),
        ],
        stateChanges: state.tutorialComplete ? { detectionLevel: state.detectionLevel + 5 } : {},
        delayMs: 1500,
      };
    }

    // Password authentication required for first connection
    const linkPasswordAlts = [
      'harvest is not destruction',
      'harvest',
      'the crop continues living',
      'crop continues living',
    ];

    if (!state.flags.neuralLinkAuthenticated) {
      // Check if user is providing password
      const attempt = args.join(' ').toLowerCase().trim();

      if (args.length === 0) {
        // Show password prompt
        return {
          output: [
            createEntry('system', 'Initiating psi-comm bridge...'),
            createEntry('warning', ''),
            createEntry('warning', '▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓'),
            createEntry('warning', '▓ NEURAL LINK AUTHENTICATION REQUIRED    ▓'),
            createEntry('warning', '▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓'),
            createEntry('system', ''),
            createEntry('output', 'Neural pattern locked. Conceptual key required.'),
            createEntry('output', ''),
            createEntry('system', 'Enter authentication phrase:'),
            createEntry('system', '  > link <phrase>'),
            createEntry('system', ''),
            createEntry('ufo74', '[UFO74]: check the psi analysis reports. the key is conceptual.'),
            createEntry('system', ''),
          ],
          stateChanges: {},
          delayMs: 1000,
        };
      }

      // Check password
      if (linkPasswordAlts.some(pwd => attempt.includes(pwd))) {
        // Password correct - authenticate
        return {
          output: [
            createEntry('system', 'Verifying conceptual key...'),
            createEntry('warning', ''),
            createEntry('notice', '▓▓▓ AUTHENTICATION ACCEPTED ▓▓▓'),
            createEntry('warning', ''),
            createEntry('output', '...the pattern... recognizes...'),
            createEntry('output', '...you understand... the directive...'),
            createEntry('output', '...connection... authorized...'),
            createEntry('system', ''),
            createEntry('notice', 'NEURAL LINK ESTABLISHED'),
            createEntry('system', ''),
            createEntry('system', 'Use: link              - Query the consciousness'),
            createEntry('system', 'Use: link disarm       - Attempt to disable firewall'),
            createEntry('system', ''),
          ],
          stateChanges: state.tutorialComplete
            ? {
                flags: { ...state.flags, neuralLinkAuthenticated: true },
                detectionLevel: state.detectionLevel + 10,
              }
            : {
                flags: { ...state.flags, neuralLinkAuthenticated: true },
              },
          imageTrigger: {
            src: '/images/et-brain.png',
            alt: 'Neural pattern link - Scout consciousness interface',
            tone: 'clinical',
          },
          triggerFlicker: true,
          delayMs: 2000,
        };
      } else {
        // Password incorrect
        return {
          output: [
            createEntry('system', 'Verifying conceptual key...'),
            createEntry('error', ''),
            createEntry('error', '▓▓▓ AUTHENTICATION FAILED ▓▓▓'),
            createEntry('error', ''),
            createEntry('warning', '...pattern... rejects... wrong concept...'),
            createEntry('system', ''),
            createEntry('system', 'The neural pattern did not recognize your phrase.'),
            createEntry('system', 'Review psi-comm documentation for the correct key.'),
            createEntry('system', ''),
          ],
          stateChanges: state.tutorialComplete ? { detectionLevel: state.detectionLevel + 3 } : {},
          triggerFlicker: true,
          delayMs: 1500,
        };
      }
    }

    // Handle disarm command - disable firewall through neural link
    if (args[0]?.toLowerCase() === 'disarm') {
      if (state.firewallDisarmed) {
        return {
          output: [
            createEntry('system', ''),
            createEntry('output', '...firewall... already... silenced...'),
            createEntry('output', '...the eyes... no longer... watch...'),
            createEntry('system', ''),
          ],
          stateChanges: {},
        };
      }

      if (!state.firewallActive) {
        return {
          output: [
            createEntry('system', ''),
            createEntry('output', '...no threat... detected...'),
            createEntry('output', '...the watchers... have not... awakened...'),
            createEntry('system', ''),
          ],
          stateChanges: {},
        };
      }

      // Disarm the firewall
      const stateChanges: Partial<GameState> = {
        firewallDisarmed: true,
        firewallActive: false,
        firewallEyes: [],
        detectionLevel: Math.max(0, state.detectionLevel - 15),
        scoutLinksUsed: (state.scoutLinksUsed || 0) + 1,
      };

      if (!state.tutorialComplete) {
        delete stateChanges.detectionLevel;
      }

      return {
        output: [
          createEntry('system', 'Initiating firewall countermeasure...'),
          createEntry('warning', ''),
          createEntry('warning', '▓▓▓ NEURAL INFILTRATION ACTIVE ▓▓▓'),
          createEntry('warning', ''),
          createEntry('output', '...reaching... into... their system...'),
          createEntry('output', '...the firewall... sees us... but cannot...'),
          createEntry('output', '...we are... older... than their code...'),
          createEntry('system', ''),
          createEntry('notice', '▓▓▓ FIREWALL NEUTRALIZED ▓▓▓'),
          createEntry('system', ''),
          createEntry('output', '...the eyes... close... permanently...'),
          createEntry('output', '...you are... hidden... for now...'),
          createEntry('system', ''),
        ],
        stateChanges,
        triggerFlicker: true,
        delayMs: 2500,
      };
    }

    // Check if scout link is exhausted
    const scoutLinksUsed = state.scoutLinksUsed || 0;
    if (scoutLinksUsed >= 4) {
      const stateChanges: Partial<GameState> = {
        flags: { ...state.flags, scoutLinkExhausted: true },
        detectionLevel: state.detectionLevel + 10,
      };

      if (!state.tutorialComplete) {
        delete stateChanges.detectionLevel;
      }

      return {
        output: [
          createEntry('system', 'Initiating psi-comm bridge...'),
          createEntry('error', ''),
          createEntry('error', '▓▓▓ NEURAL PATTERN DEGRADED ▓▓▓'),
          createEntry('error', ''),
          createEntry('warning', '...pattern... fading...'),
          createEntry('warning', '...consciousness... dispersing...'),
          createEntry('warning', '...we... were... watching...'),
          createEntry('error', ''),
          createEntry('error', 'LINK TERMINATED — PATTERN EXHAUSTED'),
          createEntry('system', ''),
        ],
        stateChanges,
        triggerFlicker: true,
        delayMs: 2500,
      };
    }

    // If no args, show link prompt
    if (args.length === 0) {
      const remaining = 4 - scoutLinksUsed;
      const stateChanges: Partial<GameState> = {
        detectionLevel: state.detectionLevel + 8,
      };

      if (!state.tutorialComplete) {
        delete stateChanges.detectionLevel;
      }

      return {
        output: [
          createEntry('system', 'Initiating psi-comm bridge...'),
          createEntry('warning', ''),
          createEntry('warning', '▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓'),
          createEntry('warning', '▓ WARNING: NEURAL PATTERN LINK ACTIVE    ▓'),
          createEntry('warning', '▓ COGNITIVE CONTAMINATION RISK: HIGH     ▓'),
          createEntry('warning', '▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓'),
          createEntry('system', ''),
          createEntry('output', '...connection... established...'),
          createEntry('output', '...we... perceive... you...'),
          createEntry('output', '...your questions... imprecise... but understood...'),
          createEntry('system', ''),
          createEntry('system', `[Pattern stability: ${remaining} queries remaining]`),
          createEntry('system', ''),
          createEntry('system', 'Use: link <thought or question>'),
          createEntry('system', ''),
        ],
        stateChanges,
        imageTrigger: {
          src: '/images/et-brain.png',
          alt: 'Neural pattern link - Scout consciousness interface',
          tone: 'clinical',
        },
        triggerFlicker: true,
        delayMs: 2000,
      };
    }

    // Process query
    const query = args.join(' ');
    const usedResponses = state.scoutLinkUsedResponses || new Set<string>();
    const { response, valid, category: _category } = getScoutLinkResponse(query, usedResponses);
    const newLinksUsed = scoutLinksUsed + 1;
    const remaining = 4 - newLinksUsed;

    // Track used responses
    const newUsedResponses = new Set(usedResponses);
    for (const r of response) {
      newUsedResponses.add(r);
    }

    const output: TerminalEntry[] = [createEntry('input', `> ${query}`), createEntry('system', '')];

    // Signal lost - no keyword match (still costs a query)
    if (!valid) {
      output.push(createEntry('warning', '[NEURAL BRIDGE UNSTABLE]'));
      output.push(createEntry('system', ''));
      for (const line of response) {
        output.push(createEntry('warning', line));
      }
      output.push(createEntry('system', ''));

      if (remaining > 0) {
        output.push(createEntry('system', `[Pattern stability: ${remaining} queries remaining]`));
      } else {
        output.push(createEntry('warning', '[PATTERN DESTABILIZING]'));
      }

      output.push(createEntry('system', ''));

      const stateChanges: Partial<GameState> = {
        scoutLinksUsed: newLinksUsed,
        scoutLinkUsedResponses: newUsedResponses,
        detectionLevel: state.detectionLevel + 5,
        sessionStability: state.sessionStability - 3,
      };

      if (!state.tutorialComplete) {
        delete stateChanges.detectionLevel;
        delete stateChanges.sessionStability;
      }

      return {
        output,
        stateChanges,
        triggerFlicker: true,
        delayMs: 1200,
      };
    }

    output.push(createEntry('warning', '[NEURAL BRIDGE ACTIVE]'));
    output.push(createEntry('system', ''));

    for (const line of response) {
      output.push(createEntry('output', line));
    }

    output.push(createEntry('system', ''));

    if (remaining > 0) {
      output.push(createEntry('system', `[Pattern stability: ${remaining} queries remaining]`));
    } else {
      output.push(createEntry('warning', '[PATTERN DESTABILIZING]'));
    }

    output.push(createEntry('system', ''));

    const stateChanges: Partial<GameState> = {
      scoutLinksUsed: newLinksUsed,
      scoutLinkUsedResponses: newUsedResponses,
      detectionLevel: state.detectionLevel + 5,
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
      delayMs: 1500,
    };
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // SCRIPT COMMAND — Data reconstruction via user-written scripts
  // ═══════════════════════════════════════════════════════════════════════════

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
      return commands.leak([], state);
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

  leak: (args, state) => {
    // If already in leak sequence, this shouldn't be called (input handled elsewhere)
    // But handle gracefully just in case
    if (state.inLeakSequence) {
      return {
        output: [
          createEntry('system', 'Interrogation in progress. Answer the question or type "abort".'),
        ],
        stateChanges: {},
      };
    }

    // Require all 5 evidence categories before allowing leak
    const allFound = state.truthsDiscovered.size >= 5 && state.flags.allEvidenceCollected;
    if (!allFound) {
      const found = state.truthsDiscovered.size;
      return {
        output: [
          createEntry('error', 'LEAK BLOCKED — INSUFFICIENT EVIDENCE'),
          createEntry('system', ''),
          createEntry('system', `  Evidence categories documented: ${found}/5`),
          createEntry('system', '  All five categories must be confirmed before'),
          createEntry('system', '  the leak channel can be opened.'),
          createEntry('system', ''),
          createEntry('ufo74', '[UFO74]: not yet. we need ALL five pieces or nobody will believe us.'),
        ],
        stateChanges: {},
      };
    }

    // Checkpoint before high-risk Elusive Man interrogation
    saveCheckpoint(state, 'Before Elusive Man interrogation');

    // Start the Elusive Man leak sequence
    return startLeakSequence(state);
  },

  save: (args, state) => {
    // Save is handled at UI level, but acknowledge here
    return {
      output: [
        createEntry('system', 'SESSION SAVE REQUESTED'),
        createEntry('output', 'Use menu to confirm save slot.'),
      ],
      stateChanges: {
        flags: { ...state.flags, saveRequested: true },
      },
    };
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // HIDDEN COMMANDS - Discoverable through documents
  // ═══════════════════════════════════════════════════════════════════════════

  // disconnect - Severs connection (triggers neutral ending if used before saving)
  disconnect: (args, state) => {
    if (!state.hiddenCommandsDiscovered?.has('disconnect')) {
      // Hidden command not discovered - treat as invalid command
      return createInvalidCommandResult(state, 'disconnect');
    }

    // If evidence not saved, neutral ending
    if (!state.evidencesSaved) {
      return {
        output: [
          createEntry('system', ''),
          createEntry('warning', 'DISCONNECTING...'),
          createEntry('error', ''),
          createEntry('error', '▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓'),
          createEntry('warning', ''),
          createEntry('warning', 'Connection severed.'),
          createEntry('warning', 'Evidence not saved. Files lost in disconnection.'),
          createEntry('warning', 'You escaped... but the truth remains buried.'),
          createEntry('error', ''),
          createEntry('error', '▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓'),
        ],
        stateChanges: {
          isGameOver: true,
          gameOverReason: 'NEUTRAL ENDING - DISCONNECTED',
          endingType: 'neutral',
        },
        skipToPhase: 'neutral_ending' as const,
        triggerFlicker: true,
        delayMs: 2000,
      };
    }

    return {
      output: [
        createEntry('system', 'Cannot disconnect — connection transfer in progress.'),
        createEntry('warning', 'Evidence files are being relayed. Stand by.'),
      ],
      stateChanges: {},
    };
  },

  // release - Release Prisoner 46 (hidden command discovered via containment files)
  release: (args, state) => {
    const target = args.join(' ').toLowerCase().trim();
    
    // Check for P46 / prisoner46 variants
    const validTargets = ['p46', 'prisoner46', 'prisoner 46', 'p-46'];
    const isReleasingP46 = validTargets.some(t => target.includes(t));
    
    if (!isReleasingP46) {
      // Not releasing P46 - show generic error
      return {
        output: [
          createEntry('system', ''),
          createEntry('error', 'RELEASE COMMAND REQUIRES TARGET'),
          createEntry('system', ''),
          createEntry('system', 'Usage: release <subject_id>'),
          createEntry('system', ''),
        ],
        stateChanges: {},
      };
    }
    
    // Check if player has discovered Prisoner 46 files
    const hasDiscoveredP46 = Array.from(state.filesRead).some(f => 
      f.includes('prisoner46') || f.includes('p46_')
    );
    
    if (!hasDiscoveredP46) {
      const output = PRISONER46_FILE_NOT_FOUND.map(line =>
        createEntry(line.includes('ERROR') ? 'error' : 'system', line)
      );
      return {
        output,
        stateChanges: {},
      };
    }
    
    // Check if already released
    if (state.flags.prisoner46Released) {
      const output = PRISONER46_ALREADY_RELEASED.map(line =>
        createEntry(line.includes('ERROR') ? 'error' : 'system', line)
      );
      return {
        output,
        stateChanges: {},
      };
    }
    
    // Execute release!
    const output: TerminalEntry[] = [];
    
    // Intro
    for (const line of PRISONER46_RELEASE_INTRO) {
      output.push(createEntry(line.includes('▓') ? 'warning' : line.includes('COMMAND') ? 'notice' : 'system', line));
    }
    
    // Sequence
    for (const line of PRISONER46_RELEASE_SEQUENCE) {
      output.push(createEntry(
        line.includes('WARNING') ? 'error' :
        line.includes('>') ? 'notice' :
        'output',
        line
      ));
    }
    
    // Success
    for (const line of PRISONER46_RELEASE_SUCCESS) {
      output.push(createEntry(
        line.includes('▓▓▓') ? 'notice' :
        line.includes('UFO74:') ? 'ufo74' :
        line.includes('═') ? 'warning' :
        line.startsWith('  ...') ? 'warning' :
        'output',
        line
      ));
    }
    
    return {
      output,
      stateChanges: {
        flags: {
          ...state.flags,
          prisoner46Released: true,
        },
        detectionLevel: Math.min(MAX_DETECTION, state.detectionLevel + 15),
      },
      delayMs: 3000,
      triggerFlicker: true,
      imageTrigger: {
        src: '/images/et-standing.png',
        alt: 'Prisoner 46 - The surviving Varginha being',
        tone: 'eerie',
      },
    };
  },

  // scan - Reveals hidden files in current directory
  scan: (args, state) => {
    if (!state.hiddenCommandsDiscovered?.has('scan')) {
      // Hidden command not discovered - treat as invalid command
      return createInvalidCommandResult(state, 'scan');
    }

    // Increase detection significantly
    const newDetection = Math.min(MAX_DETECTION, state.detectionLevel + 10); // was 15, reduced for pacing

    return {
      output: [
        createEntry('system', ''),
        createEntry('warning', '  ▓ DEEP SCAN INITIATED ▓'),
        createEntry('system', ''),
        createEntry('system', '  Scanning for hidden filesystem entries...'),
        createEntry('system', '  Revealing masked nodes...'),
        createEntry('warning', ''),
        createEntry('warning', '  [!] Scan complete. Hidden paths may now be visible.'),
        createEntry('warning', '  [!] Detection risk: ELEVATED'),
        createEntry('system', ''),
      ],
      stateChanges: {
        detectionLevel: newDetection,
        flags: { ...state.flags, adminUnlocked: true },
      },
    };
  },

  // decode - Attempts to decode cipher text (ROT13)
  decode: (args, state) => {
    // Hidden command - must be discovered first
    if (!state.hiddenCommandsDiscovered?.has('decode')) {
      // Hidden command not discovered - treat as invalid command
      return createInvalidCommandResult(state, 'decode');
    }

    const attempt = args.join(' ').toLowerCase().trim();

    if (!attempt) {
      return {
        output: [createEntry('system', 'Usage: decode <text>')],
        stateChanges: {},
      };
    }

    // The cipher answer is "the truth is not what they told you"
    // ROT13 of "the" = "gur" - accept partial answers
    if (
      attempt === 'the' ||
      attempt === 'the truth' ||
      attempt === 'the truth is not what they told you'
    ) {
      return {
        output: [
          createEntry('system', ''),
          createEntry('ufo74', '[UFO74]: Decryption successful.'),
          createEntry('ufo74', '[UFO74]: "The truth is not what they told you."'),
          createEntry('warning', ''),
          createEntry('ufo74', '[UFO74]: You understand now. The official reports...'),
          createEntry('ufo74', '[UFO74]: They were never meant to be accurate.'),
          createEntry('system', ''),
        ],
        stateChanges: {
          disinformationDiscovered: new Set([
            ...(state.disinformationDiscovered || []),
            'cipher_decoded',
          ]),
        },
      };
    }

    const cipherAttempts = (state.cipherAttempts || 0) + 1;

    if (cipherAttempts >= 3) {
      return {
        output: [
          createEntry('ufo74', '[UFO74]: Still struggling with the cipher?'),
          createEntry('ufo74', '[UFO74]: Try applying ROT13. Classic but effective.'),
        ],
        stateChanges: { cipherAttempts },
      };
    }

    return {
      output: [createEntry('system', 'Decryption failed. Pattern not recognized.')],
      stateChanges: { cipherAttempts },
    };
  },

  clear: (_args, _state) => {
    return {
      output: [],
      stateChanges: {
        history: [],
      },
    };
  },

  hint: (_args, state) => {
    // Import hint system dynamically to avoid circular dependency
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const { generateHintOutput } = require('./hintSystem');
    return generateHintOutput(state);
  },

  search: (args, state) => {
    // Check if keyword provided
    if (args.length === 0) {
      return {
        output: [
          createEntry('error', 'SYNTAX: search <keyword>'),
          createEntry('system', 'Example: search anomaly'),
        ],
        stateChanges: {},
      };
    }

    // Check cooldown
    if (!canSearch(state)) {
      return {
        output: [
          createEntry('warning', getSearchCooldownMessage()),
        ],
        stateChanges: {},
      };
    }

    // Checkpoint on first search command (player learning the system)
    if (!state.lastSearchTime) {
      saveCheckpoint(state, 'First search command');
    }

    const keyword = args.join(' ').trim().toLowerCase();

    // Perform search
    const results = performSearch(keyword, state);

    // Calculate detection increase (+2 base)
    const detectionIncrease = 2;
    const newDetection = Math.min(
      MAX_DETECTION,
      state.detectionLevel + detectionIncrease
    );

    const stateChanges: Partial<GameState> = {
      lastSearchTime: Date.now(),
      detectionLevel: newDetection,
    };

    // Build output
    const output: TerminalEntry[] = [
      createEntry('system', ''),
      createEntry('system', `SEARCH RESULTS — "${keyword}"`),
      createEntry('system', '─────────────────────────────────────────'),
    ];

    if (results.length === 0) {
      output.push(createEntry('output', ''));
      output.push(createEntry('output', '  No matching entries found.'));
      output.push(createEntry('output', ''));
      output.push(createEntry('system', '  [Index may be incomplete]'));
    } else {
      output.push(createEntry('output', ''));
      for (const result of results) {
        if (result.isCorrupted) {
          output.push(createEntry('warning', `  • ${result.filename}`));
        } else {
          output.push(createEntry('output', `  • ${result.filename}`));
        }
      }
      output.push(createEntry('output', ''));
      output.push(createEntry('system', `  ${results.length} result(s) found`));
    }

    output.push(createEntry('system', '─────────────────────────────────────────'));
    output.push(createEntry('system', ''));
    // Detection feedback - subtle but present
    output.push(createEntry('notice', 'NOTICE: Index access registered.'));
    output.push(createEntry('system', ''));

    return {
      output,
      stateChanges,
    };
  },

  tutorial: (args, _state) => {
    // Handle tutorial on/off toggle
    if (args.length > 0) {
      const arg = args[0].toLowerCase();

      if (arg === 'on') {
        return {
          output: [
            createEntry('system', ''),
            createEntry('notice', 'TUTORIAL MODE: ENABLED'),
            createEntry('output', "I'll show extra tips as you explore."),
            createEntry('output', 'Type "tutorial off" anytime to disable.'),
            createEntry('system', ''),
          ],
          stateChanges: {
            interactiveTutorialMode: true,
          },
        };
      }

      if (arg === 'off') {
        return {
          output: [
            createEntry('system', ''),
            createEntry('notice', 'TUTORIAL MODE: DISABLED'),
            createEntry('output', "You're on your own now. Good luck kid."),
            createEntry('system', ''),
          ],
          stateChanges: {
            interactiveTutorialMode: false,
          },
        };
      }
    }

    // No args or unrecognized arg: Replay the tutorial/introduction
    return {
      output: [
        createEntry('system', ''),
        createEntry('system', 'Restarting tutorial sequence...'),
        createEntry('system', ''),
      ],
      stateChanges: {
        tutorialStep: 0,
        tutorialComplete: false,
        history: [], // Clear history for fresh start
      },
    };
  },

  tree: (args, state) => {
    // Display directory tree structure
    const buildTree = (path: string, prefix: string, depth: number): string[] => {
      if (depth > 2) return []; // Limit depth to 2 levels

      const entries = listDirectory(path, state);
      const lines: string[] = [];

      if (!entries) return lines;

      entries.forEach((entry, index) => {
        const isLast = index === entries.length - 1;
        const connector = isLast ? '└── ' : '├── ';
        const childPrefix = isLast ? '    ' : '│   ';

        if (entry.type === 'dir') {
          // entry.name from listDirectory already has trailing / for dirs
          const dirName = entry.name.replace(/\/$/, ''); // Remove trailing slash
          lines.push(`${prefix}${connector}${dirName}/`);
          const childPath = path === '/' ? `/${dirName}` : `${path}/${dirName}`;
          lines.push(...buildTree(childPath, prefix + childPrefix, depth + 1));
        } else {
          // Show file with status indicator
          let marker = '';
          const fullPath = path === '/' ? `/${entry.name}` : `${path}/${entry.name}`;
          if (state.filesRead?.has(fullPath)) {
            marker = ' [READ]';
          }
          if (entry.status === 'encrypted') {
            marker = ' [ENC]';
          }
          lines.push(`${prefix}${connector}${entry.name}${marker}`);
        }
      });

      return lines;
    };

    const treeLines = [
      '',
      '═══════════════════════════════════════════════════════════',
      'DIRECTORY STRUCTURE',
      '═══════════════════════════════════════════════════════════',
      '',
      '/',
      ...buildTree('/', '', 0),
      '',
      `Current location: ${state.currentPath}`,
      '',
      '═══════════════════════════════════════════════════════════',
      '',
    ];

    return {
      output: createOutputEntries(treeLines),
      stateChanges: {},
    };
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // UX COMMANDS - last, back, note, notes, bookmark, unread, progress
  // ═══════════════════════════════════════════════════════════════════════════

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

  // ═══════════════════════════════════════════════════════════════════════════
  // STEALTH RECOVERY - wait and hide commands
  // ═══════════════════════════════════════════════════════════════════════════

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
      streamingMode: 'glitchy',
      delayMs: 3000,
      triggerFlicker: true,
    };
  },

  note: (args, state) => {
    if (args.length === 0) {
      return {
        output: [
          createEntry('error', 'ERROR: Specify note text'),
          createEntry('system', 'Usage: note <your text>'),
          createEntry('system', 'Example: note password might be varginha1996'),
        ],
        stateChanges: {},
      };
    }

    const noteText = args.join(' ');
    const newNotes = [...(state.playerNotes || []), { note: noteText, timestamp: Date.now() }];

    return {
      output: [
        createEntry('system', `Note saved: "${noteText}"`),
        createEntry('system', `[${newNotes.length} notes total - use "notes" to view]`),
      ],
      stateChanges: {
        playerNotes: newNotes,
      },
    };
  },

  notes: (args, state) => {
    const notes = state.playerNotes || [];

    if (notes.length === 0) {
      return {
        output: [
          createEntry('system', 'No notes saved yet'),
          createEntry('system', 'Use: note <text> to save a note'),
        ],
        stateChanges: {},
      };
    }

    const output: TerminalEntry[] = [
      createEntry('system', ''),
      createEntry('system', '═════════════════════════════════════════'),
      createEntry('system', '                 YOUR NOTES              '),
      createEntry('system', '═════════════════════════════════════════'),
      createEntry('system', ''),
    ];

    notes.forEach((n, i) => {
      const time = new Date(n.timestamp).toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
      });
      output.push(createEntry('output', `  ${i + 1}. [${time}] ${n.note}`));
    });

    output.push(createEntry('system', ''));
    output.push(createEntry('system', '═════════════════════════════════════════'));
    output.push(createEntry('system', ''));

    return {
      output,
      stateChanges: {},
    };
  },

  bookmark: (args, state) => {
    if (args.length === 0) {
      // Show current bookmarks
      const bookmarks = state.bookmarkedFiles || new Set<string>();

      if (bookmarks.size === 0) {
        return {
          output: [
            createEntry('system', 'No bookmarks saved'),
            createEntry('system', 'Usage: bookmark <filename> to bookmark a file'),
          ],
          stateChanges: {},
        };
      }

      const output: TerminalEntry[] = [
        createEntry('system', ''),
        createEntry('system', '═══════════════════════════════════════'),
        createEntry('system', '             BOOKMARKED FILES          '),
        createEntry('system', '═══════════════════════════════════════'),
        createEntry('system', ''),
      ];

      let index = 0;
      for (const path of bookmarks) {
        index += 1;
        const fileName = path.split('/').pop() || path;
        const isRead = state.filesRead?.has(path);
        output.push(createEntry('output', `  ${index}. ${fileName} ${isRead ? '[READ]' : ''}`));
        output.push(createEntry('system', `      └─ ${path}`));
      }

      output.push(createEntry('system', ''));
      output.push(createEntry('system', '═══════════════════════════════════════'));
      output.push(createEntry('system', ''));

      return { output, stateChanges: {} };
    }

    const filePath = resolvePath(args[0], state.currentPath);
    const node = getNode(filePath, state);

    if (!node || node.type !== 'file') {
      return {
        output: [createEntry('error', `ERROR: File not found: ${args[0]}`)],
        stateChanges: {},
      };
    }

    const bookmarks = new Set(state.bookmarkedFiles || []);

    if (bookmarks.has(filePath)) {
      bookmarks.delete(filePath);
      return {
        output: [createEntry('system', `Bookmark removed: ${filePath}`)],
        stateChanges: { bookmarkedFiles: bookmarks },
      };
    }

    bookmarks.add(filePath);
    const newBookmarkCount = bookmarks.size;
    return {
      output: [
        createEntry('system', `Bookmarked: ${filePath}`),
        createEntry('system', 'Use "bookmark" to view all bookmarks'),
      ],
      stateChanges: { bookmarkedFiles: bookmarks },
      checkAchievements: newBookmarkCount >= 5 ? ['bookworm'] : undefined,
    };
  },

  unread: (args, state) => {
    // Find all accessible files that haven't been read
    const unreadFiles: { path: string; status: string }[] = [];
    const MAX_SCAN_FILES = 100; // Performance limit
    let scannedCount = 0;

    const scanDirectory = (dirPath: string, depth: number = 0) => {
      // Limit recursion depth and total files scanned for performance
      if (depth > 5 || scannedCount >= MAX_SCAN_FILES) return;

      const entries = listDirectory(dirPath, state);
      if (!entries) return;

      for (const entry of entries) {
        if (scannedCount >= MAX_SCAN_FILES) break;

        const fullPath = dirPath === '/' ? `/${entry.name}` : `${dirPath}/${entry.name}`;

        if (entry.type === 'file') {
          scannedCount++;
          if (!state.filesRead?.has(fullPath)) {
            const access = canAccessFile(fullPath, state);
            if (access.accessible) {
              unreadFiles.push({ path: fullPath, status: entry.status || 'intact' });
            }
          }
        } else if (entry.type === 'dir') {
          scanDirectory(fullPath, depth + 1);
        }
      }
    };

    scanDirectory('/');

    if (unreadFiles.length === 0) {
      return {
        output: [
          createEntry('system', 'All accessible files have been read!'),
          createEntry('system', 'Some files may require higher access levels.'),
        ],
        stateChanges: {},
      };
    }

    const output: TerminalEntry[] = [
      createEntry('system', ''),
      createEntry('system', '═══════════════════════════════════════'),
      createEntry('system', `            UNREAD FILES (${unreadFiles.length})          `),
      createEntry('system', '═══════════════════════════════════════'),
      createEntry('system', ''),
    ];

    unreadFiles.slice(0, 15).forEach(file => {
      const fileName = file.path.split('/').pop() || file.path;
      const statusTag = file.status !== 'intact' ? ` [${file.status.toUpperCase()}]` : '';
      output.push(createEntry('output', `  ${fileName}${statusTag}`));
      output.push(createEntry('system', `    └─ ${file.path}`));
    });

    if (unreadFiles.length > 15) {
      output.push(createEntry('system', `  ... and ${unreadFiles.length - 15} more`));
    }

    output.push(createEntry('system', ''));
    output.push(createEntry('system', '═══════════════════════════════════════'));

    return { output, stateChanges: {} };
  },

  progress: (args, state) => {
    // Show player progress summary with evidence files collected
    // IMPORTANT: Use file names only - no story spoilers
    const filesReadCount = state.filesRead?.size || 0;
    const bookmarksCount = state.bookmarkedFiles?.size || 0;
    const notesCount = state.playerNotes?.length || 0;

    // Get evidence count
    const evidenceCount = countEvidence(state);
    const caseStrength = getCaseStrengthDescription(state);

    const output: TerminalEntry[] = [
      createEntry('system', ''),
      createEntry('system', '╔═══════════════════════════════════════════════════════╗'),
      createEntry('system', '║            INVESTIGATION PROGRESS                     ║'),
      createEntry('system', '╠═══════════════════════════════════════════════════════╣'),
      createEntry('system', ''),
    ];

    // Collect all evidence files across categories
    const allEvidenceFiles: string[] = [];
    const categories = [
      'debris_relocation',
      'being_containment',
      'telepathic_scouts',
      'international_actors',
      'transition_2026',
    ] as const;

    for (const category of categories) {
      const evidenceState = state.evidenceStates?.[category];
      if (evidenceState?.linkedFiles) {
        allEvidenceFiles.push(...evidenceState.linkedFiles);
      }
    }

    // Show evidence files collected (no spoilers - just filenames)
    output.push(createEntry('system', '  EVIDENCE COLLECTED:'));
    output.push(createEntry('system', ''));

    if (allEvidenceFiles.length === 0) {
      output.push(createEntry('output', '    No evidence files collected yet.'));
      output.push(createEntry('system', ''));
      output.push(createEntry('system', '    Read files to discover evidence.'));
    } else {
      // Show unique filenames only
      const uniqueFiles = [...new Set(allEvidenceFiles)];
      for (const filePath of uniqueFiles.slice(0, 12)) {
        const fileName = filePath.split('/').pop() || filePath;
        output.push(createEntry('output', `    ■ ${fileName}`));
      }
      if (uniqueFiles.length > 12) {
        output.push(createEntry('system', `    ... and ${uniqueFiles.length - 12} more`));
      }
    }

    output.push(createEntry('system', ''));
    output.push(createEntry('system', '  ─────────────────────────────────────────────'));

    // Case strength summary (neutral phrasing)
    output.push(createEntry('system', ''));
    output.push(createEntry('output', `  CASE STATUS: ${evidenceCount}/5 categories discovered`));
    output.push(createEntry('system', `  STRENGTH: ${caseStrength}`));
    output.push(createEntry('system', ''));

    // Session Statistics
    output.push(createEntry('system', '  ─────────────────────────────────────────────'));
    output.push(createEntry('system', '  SESSION STATISTICS:'));
    output.push(createEntry('output', `    Files examined: ${filesReadCount}`));
    output.push(createEntry('output', `    Bookmarks: ${bookmarksCount}  |  Notes: ${notesCount}`));
    output.push(createEntry('system', ''));

    // Detection warning
    if (state.detectionLevel >= DETECTION_THRESHOLDS.ALERT) {
      output.push(createEntry('error', '  ⚠ CRITICAL: Detection level dangerously high'));
    } else if (state.detectionLevel >= DETECTION_THRESHOLDS.HOSTILITY_LOW) {
      output.push(createEntry('warning', '  ⚠ WARNING: Detection level elevated'));
    }

    output.push(createEntry('system', ''));
    output.push(createEntry('system', '╚═══════════════════════════════════════════════════════╝'));
    output.push(createEntry('system', ''));

    return { output, stateChanges: {} };
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
          createEntry('system', '  No evidence collected yet.'),
          createEntry('system', ''),
          createEntry('system', '  Read files to discover evidence.'),
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

    // Show evidence by category
    output.push(createEntry('system', '  EVIDENCE BY CATEGORY:'));
    output.push(createEntry('system', ''));

    const categoryLabels: Record<string, string> = {
      debris_relocation: 'DEBRIS TRANSFER',
      being_containment: 'BIO CONTAINMENT',
      telepathic_scouts: 'TELEPATHIC RECON',
      international_actors: 'INTERNATIONAL',
      transition_2026: 'TRANSITION 2026',
    };

    for (const category of TRUTH_CATEGORIES) {
      const discovered = state.truthsDiscovered?.has(category);
      const symbol = discovered ? EVIDENCE_SYMBOL : '○';
      const status = discovered ? '[FOUND]' : '[MISSING]';

      output.push(
        createEntry(
          discovered ? 'output' : 'system',
          `  ${symbol} ${categoryLabels[category]} ${status}`
        )
      );
    }

    output.push(createEntry('system', ''));

    // Show files that revealed evidence
    const filesWithEvidence: string[] = [];
    for (const [filePath, fileState] of Object.entries(state.fileEvidenceStates || {})) {
      if (fileState.revealedEvidences?.length > 0) {
        filesWithEvidence.push(filePath);
      }
    }

    if (filesWithEvidence.length > 0) {
      output.push(createEntry('system', '  ─────────────────────────────────────────────'));
      output.push(createEntry('system', '  FILES WITH EVIDENCE:'));
      filesWithEvidence.slice(0, 8).forEach(file => {
        const fileName = file.split('/').pop() || '';
        output.push(createEntry('output', `    • ${fileName}`));
      });
      if (filesWithEvidence.length > 8) {
        output.push(createEntry('system', `    ... and ${filesWithEvidence.length - 8} more`));
      }
      output.push(createEntry('system', ''));
    }

    // Summary
    output.push(createEntry('system', '  ─────────────────────────────────────────────'));
    output.push(createEntry('system', `  PROGRESS: ${evidenceCount}/5 categories discovered`));
    output.push(createEntry('system', ''));
    output.push(createEntry('system', '╚═══════════════════════════════════════════════════════╝'));

    return { output, stateChanges: {} };
  },

  // Morse code message deciphering command
  message: (args, state) => {
    // Check if morse file has been read
    if (!state.morseFileRead) {
      return {
        output: [
          createEntry('error', 'ERROR: No pending message to decipher'),
          createEntry('system', ''),
          createEntry('output', 'Read an intercepted signal file first.'),
          createEntry('output', 'Check /comms/intercepts/ for signal files.'),
        ],
        stateChanges: {},
      };
    }

    // Check if already solved
    if (state.morseMessageSolved) {
      return {
        output: [
          createEntry('system', ''),
          createEntry('output', 'Message already deciphered: COLHEITA'),
          ...createUFO74Message([
            'UFO74: you already cracked it, hackerkid.',
            '       the message was "COLHEITA".',
            '       now use it — override protocol.',
          ]),
        ],
        stateChanges: {},
      };
    }

    // Check if attempts exhausted (puzzle failed permanently)
    if ((state.morseMessageAttempts || 0) >= 3) {
      return {
        output: [
          createEntry('system', ''),
          createEntry('error', 'Decryption attempts exhausted.'),
          createEntry('system', ''),
          createEntry('output', 'The intercepted message was: COLHEITA'),
          ...createUFO74Message([
            'UFO74: you missed it, kid. but now you know.',
            '       "COLHEITA" — try it with the override protocol.',
          ]),
        ],
        stateChanges: {},
      };
    }

    if (args.length === 0) {
      const attemptsRemaining = 3 - (state.morseMessageAttempts || 0);
      return {
        output: [
          createEntry('system', ''),
          createEntry('output', 'Enter your deciphered message.'),
          createEntry('output', 'Usage: message <deciphered text>'),
          createEntry('system', ''),
          createEntry('system', `[Attempts remaining: ${attemptsRemaining}]`),
          createEntry('system', ''),
        ],
        stateChanges: {},
      };
    }

    const guess = args.join(' ').toUpperCase().trim();
    const correct = 'COLHEITA';
    const attemptsUsed = (state.morseMessageAttempts || 0) + 1;
    const attemptsRemaining = 3 - attemptsUsed;

    // Check for correct answer - be lenient with variations
    const normalizedGuess = guess.replace(/[\s\-_]+/g, '');
    const isCorrect = normalizedGuess === correct;

    if (isCorrect) {
      // Success! Reveal the message and hint at override protocol
      return {
        output: [
          createEntry('system', ''),
          createEntry('system', '▓▓▓ MESSAGE DECIPHERED ▓▓▓'),
          createEntry('system', ''),
          createEntry('warning', `  DECODED: ${correct}`),
          ...createUFO74Message([
            'UFO74: you did it hackerkid!',
            '       "COLHEITA" — Portuguese for "HARVEST".',
            '',
            'UFO74: this is an authentication passphrase.',
            '       someone embedded it in the signal.',
            '',
            'UFO74: try it with the override protocol.',
            '       type: override protocol COLHEITA',
          ]),
        ],
        stateChanges: {
          morseMessageSolved: true,
          flags: { ...state.flags, morseDeciphered: true },
        },
        soundTrigger: 'evidence',
        streamingMode: 'normal',
      };
    }

    // Wrong answer
    if (attemptsRemaining <= 0) {
      // Out of attempts - suppress wrongAttempts during atmosphere phase
      const stateChanges: Partial<GameState> = {
        morseMessageAttempts: attemptsUsed,
      };
      if (!shouldSuppressPenalties(state)) {
        stateChanges.wrongAttempts = (state.wrongAttempts || 0) + 1;
      }
      return {
        output: [
          createEntry('error', ''),
          createEntry('error', 'DECRYPTION FAILED'),
          createEntry('error', ''),
          createEntry('warning', `Your answer: ${guess}`),
          createEntry('warning', 'Maximum attempts exceeded.'),
          ...createUFO74Message([
            'UFO74: damn. you ran out of tries hackerkid.',
            '       the message was "COLHEITA" — means "HARVEST".',
            '       try it with override protocol.',
          ]),
        ],
        stateChanges,
        soundTrigger: 'error',
      };
    }

    // Wrong but more attempts available
    return {
      output: [
        createEntry('warning', ''),
        createEntry('warning', 'INCORRECT'),
        createEntry('warning', `Your answer: ${guess}`),
        createEntry('system', ''),
        createEntry('system', `[Attempts remaining: ${attemptsRemaining}]`),
        ...createUFO74Message([
          'UFO74: thats not it hackerkid.',
          '       check the morse reference again.',
          `       you have ${attemptsRemaining} more ${attemptsRemaining === 1 ? 'try' : 'tries'}.`,
        ]),
      ],
      stateChanges: {
        morseMessageAttempts: attemptsUsed,
      },
    };
  },

  // Morse code entry - alias for 'message' command
  // Allows players to use 'morse <message>' or 'morse cancel' to interact with morse puzzle
  morse: (args, state) => {
    // Handle cancel subcommand
    if (args.length > 0 && args[0].toLowerCase() === 'cancel') {
      if (!state.morseFileRead) {
        return {
          output: [
            createEntry('system', ''),
            createEntry('output', 'No morse code puzzle active.'),
          ],
          stateChanges: {},
        };
      }
      return {
        output: [
          createEntry('system', ''),
          createEntry('output', 'Morse code entry cancelled.'),
          createEntry('output', 'You can try again later with "morse <message>".'),
          createEntry('system', ''),
        ],
        stateChanges: {},
      };
    }

    // Otherwise, pass through to message command
    return commands.message(args, state);
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // REWIND COMMAND - Time mechanic for viewing past filesystem state
  // ═══════════════════════════════════════════════════════════════════════════
  rewind: (args, state) => {
    // Cannot rewind during tutorial
    if (!state.tutorialComplete) {
      return {
        output: [createEntry('system', 'Temporal functions unavailable during transmission.')],
        stateChanges: {},
      };
    }

    // Already in archive mode - show status
    if (state.inArchiveMode) {
      return {
        output: [
          createEntry('warning', ''),
          createEntry('warning', `ARCHIVE STATE: ${state.archiveTimestamp} — READ-ONLY MODE`),
          createEntry('warning', `[ARCHIVE: ${state.archiveActionsRemaining} actions remaining]`),
          createEntry('warning', ''),
          createEntry('output', 'You are already viewing the archive.'),
          createEntry('output', 'Navigate and read files. Memory is fragile.'),
        ],
        stateChanges: {},
      };
    }

    // Checkpoint before entering archive mode (risky operation)
    saveCheckpoint(state, 'Before archive mode');

    // Initialize archive mode
    const timestamp = generateArchiveTimestamp();
    const actionsRemaining = 4; // 4 actions before forced return

    return {
      output: [
        createEntry('system', ''),
        createEntry('error', '▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓'),
        createEntry('system', ''),
        createEntry('warning', '              INITIATING TEMPORAL REGRESSION'),
        createEntry('system', ''),
        createEntry('system', '                    ... ... ...'),
        createEntry('system', ''),
        createEntry('warning', `         ARCHIVE STATE: ${timestamp} — READ-ONLY MODE`),
        createEntry('system', ''),
        createEntry('error', '▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓'),
        createEntry('system', ''),
        createEntry('output', 'Deleted files are temporarily restored.'),
        createEntry('output', 'You cannot modify or export anything.'),
        createEntry('system', ''),
        createEntry('warning', `[ARCHIVE: ${actionsRemaining} actions remaining]`),
        createEntry('system', ''),
        ...createUFO74Message([
          'UFO74: careful hackerkid. youre walking through echoes.',
          '       some files only exist in the past now.',
          '       READ FAST. you cant take anything with you.',
        ]),
      ],
      stateChanges: {
        inArchiveMode: true,
        archiveActionsRemaining: actionsRemaining,
        archiveTimestamp: timestamp,
        archiveFilesViewed: new Set<string>(),
        detectionLevel: Math.min(MAX_DETECTION, state.detectionLevel + 5), // Suspicious behavior
      },
      triggerFlicker: true,
      delayMs: 2500,
    };
  },

  // Present command - Return from archive mode (or show current state)
  present: (args, state) => {
    if (!state.inArchiveMode) {
      return {
        output: [
          createEntry('system', ''),
          createEntry('output', 'You are in the present. Current timeline active.'),
          createEntry('output', 'Use "rewind" to access archived filesystem state.'),
        ],
        stateChanges: {},
      };
    }

    // Return to present
    return exitArchiveMode(state, 'manual');
  },
};

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
  // During tutorial, only accept expected commands from UFO74's guidance
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
  // Activation: "iddqd" (classic Doom cheat)
  // ═══════════════════════════════════════════════════════════════════════════

  const lowerInput = normalizedInput.trim().toLowerCase();

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
          createEntry('output', 'god doom      - Disable doom countdown'),
          createEntry('output', ''),
          createEntry('system', 'Type "iddqd" to toggle god mode off.'),
        ],
        stateChanges: {},
      };
    }

    if (godCmd === 'evidence') {
      const allTruths: TruthCategory[] = [
        'debris_relocation',
        'being_containment',
        'telepathic_scouts',
        'international_actors',
        'transition_2026',
      ];
      const newTruths = new Set<TruthCategory>(allTruths);
      return {
        output: [
          createEntry('system', '═══ ALL EVIDENCE UNLOCKED ═══'),
          createEntry('output', '✓ debris_relocation'),
          createEntry('output', '✓ being_containment'),
          createEntry('output', '✓ telepathic_scouts'),
          createEntry('output', '✓ international_actors'),
          createEntry('output', '✓ transition_2026'),
          createEntry('system', ''),
          createEntry('output', 'Use "god save" to trigger the save phase.'),
        ],
        stateChanges: {
          truthsDiscovered: newTruths,
          flags: { ...state.flags, allEvidenceCollected: true },
        },
      };
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
          truthsDiscovered: new Set<TruthCategory>(),
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
      const truths = Array.from(state.truthsDiscovered || []);
      return {
        output: [
          createEntry('system', '═══ GAME STATUS ═══'),
          createEntry('output', `Evidence found: ${truths.length}/5`),
          createEntry('output', `  ${truths.join(', ') || '(none)'}`),
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
  if (state.legacyAlertCounter >= 10) {
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
  // TURING EVALUATION - Handle responses when evaluation is active
  // NOTE: The TuringTestOverlay component is the primary UI for this feature.
  // This terminal-based handler serves as a fallback and is used for testing.
  // ═══════════════════════════════════════════════════════════════════════════
  if (state.turingEvaluationActive) {
    const answer = command.toUpperCase();
    const questionIndex = state.turingEvaluationIndex || 0;
    const question = TURING_QUESTIONS[questionIndex];

    // Validate answer
    if (!['A', 'B', 'C'].includes(answer)) {
      return {
        output: [
          createEntry('warning', 'INVALID RESPONSE'),
          createEntry('system', 'Enter A, B, or C to respond.'),
        ],
        stateChanges: {},
      };
    }

    const selectedOption = question.options.find(opt => opt.letter === answer);

    if (selectedOption?.isMachine) {
      // Correct - selected the machine response
      const nextIndex = questionIndex + 1;

      if (nextIndex >= TURING_QUESTIONS.length) {
        // Passed all questions!
        return {
          output: [
            createEntry('system', ''),
            createEntry('system', `  Response: ${answer} - "${selectedOption.text}"`),
            createEntry('system', ''),
            createEntry('system', '  Processing response pattern...'),
            createEntry('system', ''),
            createEntry('notice', '  ═══════════════════════════════════════════════════════'),
            createEntry('notice', '  TURING EVALUATION: PASSED'),
            createEntry('notice', '  SUBJECT IS NOT HUMAN, NOT A THREAT'),
            createEntry('notice', '  Identity verified as authorized terminal process.'),
            createEntry('notice', '  ═══════════════════════════════════════════════════════'),
            createEntry('system', ''),
            createEntry('system', '  Session continues. Proceed with caution.'),
            createEntry('system', ''),
          ],
          stateChanges: {
            turingEvaluationActive: false,
            turingEvaluationCompleted: true,
            detectionLevel: Math.max(0, state.detectionLevel - 10), // Reward: reduce detection
          },
          delayMs: 1500,
        };
      } else {
        // Move to next question
        const nextQuestion = TURING_QUESTIONS[nextIndex];
        return {
          output: [
            createEntry('system', ''),
            createEntry('system', `  Response: ${answer} - "${selectedOption.text}"`),
            createEntry('system', ''),
            createEntry('system', '  Processing response pattern...'),
            createEntry('notice', '  Response acceptable. Continuing evaluation.'),
            createEntry('system', ''),
            createEntry('system', `  QUESTION ${nextIndex + 1} of 3:`),
            createEntry('output', `  "${nextQuestion.prompt}"`),
            createEntry('system', ''),
            ...nextQuestion.options.map(opt =>
              createEntry('output', `    ${opt.letter}. ${opt.text}`)
            ),
            createEntry('system', ''),
            createEntry('system', '  Type A, B, or C to respond.'),
            createEntry('system', ''),
          ],
          stateChanges: {
            turingEvaluationIndex: nextIndex,
          },
          delayMs: 1000,
        };
      }
    } else {
      // Failed - selected a human response
      return {
        output: [
          createEntry('system', ''),
          createEntry('system', `  Response: ${answer} - "${selectedOption?.text}"`),
          createEntry('system', ''),
          createEntry('error', '  Processing response pattern...'),
          createEntry('system', ''),
          createEntry('error', '  ▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓'),
          createEntry('error', '  TURING EVALUATION: FAILED'),
          createEntry('error', '  Response pattern indicates HUMAN operator.'),
          createEntry('error', '  ▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓'),
          createEntry('system', ''),
          createEntry('error', '  SECURITY BREACH CONFIRMED'),
          createEntry('error', '  INITIATING LOCKDOWN PROTOCOL'),
          createEntry('system', ''),
        ],
        stateChanges: {
          turingEvaluationActive: false,
          isGameOver: true,
          gameOverReason: 'TURING EVALUATION FAILED',
          endingType: 'bad',
        },
        triggerFlicker: true,
        skipToPhase: 'bad_ending',
        delayMs: 2000,
      };
    }
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // ELUSIVE MAN LEAK SEQUENCE - Handle answers during interrogation
  // Player must demonstrate real understanding of collected evidence
  // ═══════════════════════════════════════════════════════════════════════════
  if (isInLeakSequence(state)) {
    // All input during leak sequence is treated as an answer
    return processLeakAnswer(normalizedInput, state);
  }
  
  // ═══════════════════════════════════════════════════════════════════════════
  // CONSPIRACY FILES CHOICE - After leak success, player chooses to leak more
  // ═══════════════════════════════════════════════════════════════════════════
  if (isPendingConspiracyChoice(state)) {
    // All input during this choice is treated as the decision
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

  if (!handler) {
    // Increment legacy alert counter for invalid commands
    if (!state.tutorialComplete) {
      const output: TerminalEntry[] = [...getCommandTip(command, args)];
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
    const tips = getCommandTip(command, args);

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

  if (traceSpikeWarning) {
    result.output = [traceSpikeWarning, ...result.output];
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // SESSION COMMAND COUNTER - Track total commands for time-sensitive content
  // ═══════════════════════════════════════════════════════════════════════════
  result.stateChanges.sessionCommandCount = (state.sessionCommandCount || 0) + 1;

  // After enough commands, flag that early window has passed (affects time-sensitive files)
  const commandCount = (state.sessionCommandCount || 0) + 1;
  if (commandCount >= 30 && !state.flags['earlyWindowPassed']) {
    result.stateChanges.flags = {
      ...result.stateChanges.flags,
      ...state.flags,
      earlyWindowPassed: true,
    };
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // SINGULAR EVENTS - Check for irreversible one-time events
  // Use the NEW detection level from result.stateChanges so events trigger
  // correctly even when detection jumps past their threshold in a single command
  // ═══════════════════════════════════════════════════════════════════════════
  const stateWithUpdatedDetection = {
    ...state,
    detectionLevel: result.stateChanges.detectionLevel ?? state.detectionLevel,
  };
  const singularEvent = state.tutorialComplete
    ? checkSingularEvents(stateWithUpdatedDetection, command, args)
    : null;
  if (singularEvent) {
    // Merge singular event output with command result
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
  // SYSTEM HOSTILITY - Update and apply personality degradation
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

  // Apply hostile filtering to tips and system messages at high hostility
  const currentHostility =
    result.stateChanges.systemHostilityLevel ?? state.systemHostilityLevel ?? 0;
  if (currentHostility >= 3) {
    result.output = applyHostileFiltering(result.output, currentHostility);

    // One-time UFO74 warning when terminal starts malfunctioning
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
  // DOOM COUNTDOWN - Inject warning and state change if terrible mistake was triggered
  // The decrement was calculated earlier (around line 5256), now apply it to result
  // ═══════════════════════════════════════════════════════════════════════════
  if (doomCountdownDecremented) {
    // Add the decremented countdown to state changes
    result.stateChanges.sessionDoomCountdown = newDoomCountdown;

    // Add warning to output
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
  // Trigger when file was successfully opened/decrypted and contains notice entries
  if (command === 'open' || command === 'decrypt') {
    // Check if file was successfully read (not an error)
    const wasSuccessfulRead = !result.output.some(entry => entry.type === 'error');

    if (wasSuccessfulRead) {
      // Extract file path from args
      const filePath = args.length > 0 ? resolvePath(args[0], state.currentPath) : undefined;

      // Check if file is encrypted and not yet decrypted
      let isEncryptedAndLocked = false;
      let isFirstUnstable = false;
      if (filePath) {
        const node = getNode(filePath, state);
        if (node && node.type === 'file') {
          const file = node as FileNode;
          const mutation = state.fileMutations[filePath];
          isEncryptedAndLocked = file.status === 'encrypted' && !mutation?.decrypted;

          // Check if this is the first unstable file
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

      // Get notices from this read (only if not encrypted)
      const notices = isEncryptedAndLocked
        ? []
        : result.output.filter(
            entry =>
              entry.type === 'notice' &&
              (entry.content.includes('NOTICE:') ||
                entry.content.includes('MEMO FLAG:') ||
                entry.content.includes('SYSTEM:'))
          );

      // Skip getIncognitoMessage if the command already generated UFO74 messages
      // (e.g., override protocol hint, cd.. hint, sanitized file warning)
      // to avoid showing multiple UFO74 messages at once
      const alreadyHasPendingMessages = result.pendingUfo74Messages && result.pendingUfo74Messages.length > 0;

      const incognitoMessage = alreadyHasPendingMessages
        ? null
        : getIncognitoMessage(
            {
              ...state,
              truthsDiscovered: state.truthsDiscovered,
              incognitoMessageCount: state.incognitoMessageCount || 0,
              lastIncognitoTrigger: state.lastIncognitoTrigger || 0,
            } as GameState,
            filePath,
            notices,
            isEncryptedAndLocked,
            isFirstUnstable
          );

      if (incognitoMessage) {
        // Always queue UFO74 messages to show after player presses Enter
        // This keeps the pacing consistent - player sees file content, then presses Enter for UFO74 reaction
        result.pendingUfo74Messages = [...(result.pendingUfo74Messages || []), ...incognitoMessage];
        result.stateChanges.incognitoMessageCount = (state.incognitoMessageCount || 0) + 1;
        result.stateChanges.lastIncognitoTrigger = Date.now();
      }
    }
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // WANDERING DETECTION - Implicit guidance for lost players
  // ═══════════════════════════════════════════════════════════════════════════
  const wanderingCheck = state.tutorialComplete
    ? checkWanderingState(state, command, args, result)
    : null;
  if (wanderingCheck) {
    if (wanderingCheck.notices.length > 0) {
      // Route wandering notices through pendingUfo74Messages so they appear
      // in a single encrypted channel (avoiding nested/duplicate channels)
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
  // DETECTION STATE WARNINGS - Urgent feedback at high detection levels
  // ═══════════════════════════════════════════════════════════════════════════
  const rawDetection = result.stateChanges.detectionLevel ?? state.detectionLevel;
  const boundedDetection = Math.min(MAX_DETECTION, Math.max(0, rawDetection));

  if (result.stateChanges.detectionLevel !== undefined || rawDetection !== boundedDetection) {
    result.stateChanges.detectionLevel = boundedDetection;
  }

  const newDetection = boundedDetection;
  const prevDetection = Math.min(MAX_DETECTION, Math.max(0, state.detectionLevel));

  // Check if detection just crossed into SUSPICIOUS territory (50-69)
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

  // Check if detection crossed into ALERT territory (70-84)
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

  // Check if detection crossed into CRITICAL territory (85-89)
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
    result.stateChanges.avatarExpression = 'scared'; // Critical detection - scared expression
  }

  // Check if detection crossed into IMMINENT territory (90+) - hide becomes available
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
  // MAX DETECTION GAME OVER - Detection reached 100%, session terminated
  // Skip if evidence is being saved (leak command) — player earned the endgame
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
  // WRONG ATTEMPTS GAME OVER - Too many failed commands/auth attempts
  // Skip if game over is already triggered (e.g., override lockout takes priority)
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
function getCommandTip(command: string, args: string[]): TerminalEntry[] {
  // Check for common navigation attempts
  if (command === 'dir' || command === 'list' || command === 'show') {
    return [
      createEntry('system', ''),
      createEntry('ufo74', '[UFO74]: try "ls" to list directory contents.'),
      createEntry('system', ''),
    ];
  }

  // Check for directory-like input (ends with / or looks like a path)
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

  // Check for file-like input (has extension)
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

  // Check for read/view/cat attempts
  if (
    command === 'read' ||
    command === 'view' ||
    command === 'cat' ||
    command === 'type' ||
    command === 'more'
  ) {
    const file = args[0] || '<filename>';
    return [
      createEntry('system', ''),
      createEntry('ufo74', `[UFO74]: wrong command kid. use: open ${file}`),
      createEntry('system', ''),
    ];
  }

  // Check for exit attempts
  if (command === 'quit' || command === 'exit' || command === 'logout' || command === 'bye') {
    return [
      createEntry('system', ''),
      createEntry('ufo74', '[UFO74]: press [ESC] to exit. or type "save" first if you want to keep your progress.'),
      createEntry('system', ''),
    ];
  }

  // Check for unlock/access attempts
  if (command === 'unlock' || command === 'access' || command === 'sudo' || command === 'admin') {
    return [
      createEntry('system', ''),
      createEntry('ufo74', '[UFO74]: you need the override protocol for that. dangerous stuff.'),
      createEntry('system', ''),
    ];
  }

  // Check for back/up navigation
  if (command === 'back' || command === 'up' || command === '..') {
    return [
      createEntry('system', ''),
      createEntry('ufo74', '[UFO74]: use "cd .." to go to parent directory.'),
      createEntry('system', ''),
    ];
  }

  // Check for info/about
  if (command === 'info' || command === 'about' || command === 'whoami' || command === 'who') {
    return [
      createEntry('system', ''),
      createEntry('ufo74', '[UFO74]: try "status" or "help" kid.'),
      createEntry('system', ''),
    ];
  }

  // Default fallback
  return [
    createEntry('system', ''),
    createEntry('system', `Command not recognized: ${command}`),
    createEntry('system', ''),
    createEntry('ufo74', '[UFO74]: type "help" to see what you can do.'),
    createEntry('system', ''),
  ];
}
