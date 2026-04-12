// Shared helper functions used across multiple command handler modules

import {
  GameState,
  CommandResult,
  TerminalEntry,
  FileMutation,
  FileNode,
  ImageTrigger,
} from '../../types';
import { createSeededRng, seededRandomInt, seededRandomPick } from '../rng';
import {
  countEvidence,
  getDisturbingContentAvatarExpression,
  isEvidenceFile,
  MAX_EVIDENCE_COUNT,
} from '../evidenceRevelation';
import {
  ARCHIVE_FILES,
} from '../../data/archiveFiles';
import { DETECTION_THRESHOLDS, MAX_DETECTION, applyWarmupDetection, WARMUP_PHASE } from '../../constants/detection';
import { shouldSuppressPressure } from '../../constants/atmosphere';
import {
  createEntry,
  createOutputEntries,
  createUFO74Message,
} from './utils';
import {
  getTutorialTip,
  shouldShowTutorialTip,
} from './tutorial';
import { getFileContent } from '../filesystem';
import { saveCheckpoint } from '../../storage/saves';

// ═══════════════════════════════════════════════════════════════════════════
// CONTEXT RNG - Deterministic random based on game state and context
// ═══════════════════════════════════════════════════════════════════════════

export function hashCommandContext(value: string): number {
  let hash = 0;
  for (let i = 0; i < value.length; i++) {
    hash = (hash * 31 + value.charCodeAt(i)) | 0;
  }
  return Math.abs(hash) || 1;
}

export function createContextRng(
  state: GameState,
  ...parts: Array<string | number | boolean | undefined>
): () => number {
  const context = parts.map(part => String(part ?? '')).join('|');
  return createSeededRng((state.seed || 1) + (state.rngState || 1) + hashCommandContext(context));
}

export function contextChance(
  state: GameState,
  probability: number,
  ...parts: Array<string | number | boolean | undefined>
): boolean {
  return createContextRng(state, ...parts)() < probability;
}

export function contextRandomInt(
  state: GameState,
  min: number,
  max: number,
  ...parts: Array<string | number | boolean | undefined>
): number {
  return seededRandomInt(createContextRng(state, ...parts), min, max);
}

export function contextRandomPick<T>(
  state: GameState,
  items: T[],
  ...parts: Array<string | number | boolean | undefined>
): T {
  return seededRandomPick(createContextRng(state, ...parts), items);
}

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
    triggerTuringTest?: boolean;
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
      if (!state.tutorialComplete) return false;
      return (
        state.detectionLevel >= DETECTION_THRESHOLDS.TURING_WARNING &&
        state.evidenceCount >= 1
      );
    },
    execute: state => {
      return {
        output: [
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
    id: 'turing_evaluation',
    trigger: (state, _command, _args) => {
      if (state.singularEventsTriggered?.has('turing_evaluation')) return false;
      if (state.turingEvaluationCompleted) return false;
      if (state.turingEvaluationActive) return false;
      if (!state.tutorialComplete) return false;
      return (
        state.detectionLevel >= DETECTION_THRESHOLDS.TURING_TRIGGER &&
        state.evidenceCount >= 1
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
        triggerTuringTest: true,
      };
    },
  },
  {
    // THE ECHO - Triggered when accessing psi files at high detection
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
        detectionLevel: Math.min(state.detectionLevel + 12, MAX_DETECTION),
        systemHostilityLevel: Math.min((state.systemHostilityLevel || 0) + 1, 5),
      },
      delayMs: 5000,
      triggerFlicker: true,
    }),
  },
  {
    // SECOND VOICE - a delayed, subtle mismatch after psi exposure
    id: 'second_voice',
    trigger: (state, command) => {
      if (state.singularEventsTriggered?.has('second_voice')) return false;
      if (shouldSuppressPressure(state)) return false;
      if (!['status', 'help', 'ls'].includes(command)) return false;
      return (
        state.evidenceCount >= 2 &&
        hasReadPsiMaterial(state) &&
        state.detectionLevel >= DETECTION_THRESHOLDS.STATUS_MED
      );
    },
    execute: state => ({
      output: [
        createEntry('system', ''),
        createEntry('warning', '[RESPONSE TIMING MISMATCH]'),
        createEntry('output', 'Reply buffer opened before command log update.'),
        createEntry('ufo74', 'UFO74: if you get a second answer from this terminal, dont answer it back.'),
        createEntry('system', ''),
      ],
      stateChanges: {
        singularEventsTriggered: new Set([...(state.singularEventsTriggered || []), 'second_voice']),
        paranoiaLevel: Math.min(100, (state.paranoiaLevel || 0) + 12),
      },
      delayMs: 1800,
      triggerFlicker: true,
    }),
  },
  {
    // THE WATCHER ACKNOWLEDGMENT
    id: 'watcher_ack',
    trigger: state => {
      if (state.singularEventsTriggered?.has('watcher_ack')) return false;
      if (shouldSuppressPressure(state)) return false;
      return (
        state.evidenceCount >= 3 &&
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
    // RIVAL INVESTIGATOR
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
export function checkSingularEvents(
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
// SYSTEM PERSONALITY DEGRADATION
// ═══════════════════════════════════════════════════════════════════════════

function getHostileSystemMessage(hostilityLevel: number, normalMessage: string): string {
  if (hostilityLevel <= 1) return normalMessage;
  if (hostilityLevel === 2) {
    return normalMessage.replace(/\.$/, '').replace('Use:', 'Command:');
  }
  if (hostilityLevel === 3) {
    if (normalMessage.toLowerCase().includes('tip:')) return '';
    if (normalMessage.toLowerCase().includes('hint:')) return '';
    return normalMessage.replace(/\.$/, '');
  }
  if (hostilityLevel >= 4) {
    if (normalMessage.toLowerCase().includes('tip:')) return '';
    if (normalMessage.toLowerCase().includes('hint:')) return '';
    if (normalMessage.toLowerCase().includes('use:')) return '';
    if (normalMessage.length > 40) return normalMessage.substring(0, 35) + '...';
    return normalMessage;
  }
  return normalMessage;
}

export function applyHostileFiltering(entries: TerminalEntry[], hostilityLevel: number): TerminalEntry[] {
  if (hostilityLevel <= 1) return entries;

  return entries
    .map(entry => ({
      ...entry,
      content: getHostileSystemMessage(hostilityLevel, entry.content),
    }))
    .filter(entry => entry.content !== '' || entry.type === 'system');
}

export function calculateHostilityIncrease(state: GameState, command: string): number {
  const baseHostility = state.systemHostilityLevel || 0;

  if (command === 'trace') return 1;
  if (command === 'override') return 2;
  if (command === 'decrypt')
    return state.detectionLevel > DETECTION_THRESHOLDS.DECRYPT_WARNING ? 1 : 0;

  if (state.detectionLevel >= DETECTION_THRESHOLDS.HOSTILITY_HIGH && baseHostility < 4) return 1;
  if (state.detectionLevel >= DETECTION_THRESHOLDS.HOSTILITY_MED && baseHostility < 3) return 1;
  if (state.detectionLevel >= DETECTION_THRESHOLDS.HOSTILITY_LOW && baseHostility < 2) return 1;

  return 0;
}

// ═══════════════════════════════════════════════════════════════════════════
// WANDERING DETECTION
// ═══════════════════════════════════════════════════════════════════════════

function isMeaningfulAction(
  command: string,
  args: string[],
  state: GameState,
  result: { output: TerminalEntry[]; stateChanges: Partial<GameState> }
): boolean {
  if (command === 'open' || command === 'decrypt') {
    return true;
  }
  if (command === 'cd' || command === 'ls' || command === 'cat' || command === 'read') {
    return true;
  }
  const updatedEvidenceCount = result.stateChanges.evidenceCount;
  if (typeof updatedEvidenceCount === 'number' && updatedEvidenceCount > (state.evidenceCount || 0)) {
    return true;
  }
  if (result.stateChanges.accessLevel && result.stateChanges.accessLevel > state.accessLevel) {
    return true;
  }
  return false;
}

function getWanderingNotice(level: number, state?: GameState): TerminalEntry[] {
  const contextualHints = state ? getContextualExplorationHints(state) : null;

  if (level === 0) {
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
    return [
      createEntry('ufo74', 'UFO74: look for evidence in:'),
      createEntry('output', '       /storage/, /ops/quarantine/, /comms/'),
      createEntry('ufo74', 'UFO74: the index knows more than they want you to find.'),
      createEntry('ufo74', '       try: search <keyword>'),
    ];
  } else {
    return [
      createEntry('ufo74', 'UFO74: last hint:'),
      createEntry('output', '       1. cd <directory>'),
      createEntry('output', '       2. ls'),
      createEntry('output', '       3. open <filename>'),
      createEntry('ufo74', 'UFO74: january 96. find the pieces.'),
    ];
  }
}

function getContextualExplorationHints(state: GameState): string | null {
  const filesRead = state.filesRead || new Set<string>();
  const truthsCount = state.evidenceCount || 0;
  const prisoner45Used = state.prisoner45QuestionsAsked > 0;

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

  if (!hasReadStorage && truthsCount < 1) {
    return 'check /storage/ for transport logs.';
  }
  if (!hasReadOps && truthsCount < 2) {
    return '/ops/ has quarantine records.';
  }
  if (!hasReadComms && truthsCount < 3) {
    return '/comms/psi/ has weird signal stuff.';
  }
  if (!prisoner45Used && state.tutorialComplete) {
    return 'try "chat". someones in here.';
  }
  if (!hasReadAdmin && truthsCount >= 2 && state.accessLevel >= 3) {
    return 'you have clearance. check /admin/.';
  }
  return null;
}

export function hasReadPsiMaterial(state: GameState): boolean {
  for (const filePath of state.filesRead || []) {
    const lower = filePath.toLowerCase();
    if (
      lower.includes('/comms/psi/') ||
      lower.includes('transcript') ||
      lower.includes('psi') ||
      lower.includes('neural')
    ) {
      return true;
    }
  }
  return false;
}

export function getObserverStatusLines(state: GameState): string[] {
  const evidCount = state.evidenceCount || 0;
  const psiExposed = hasReadPsiMaterial(state);
  const lines: string[] = [];

  if (
    psiExposed &&
    evidCount >= 2 &&
    state.detectionLevel >= DETECTION_THRESHOLDS.STATUS_MED
  ) {
    lines.push('  SIGNAL: Residual echo persists in relay buffer.');
    if (state.detectionLevel >= DETECTION_THRESHOLDS.STATUS_HIGH) {
      lines.push('  NOTE: One response arrived before keystroke registration.');
    } else {
      lines.push('  NOTE: Command cadence is being mirrored faintly.');
    }
    return lines;
  }

  if (psiExposed && state.detectionLevel >= DETECTION_THRESHOLDS.STATUS_LOW) {
    lines.push('  SIGNAL: Background carrier present. Source unresolved.');
  }

  if (
    evidCount >= 3 &&
    state.detectionLevel >= DETECTION_THRESHOLDS.STATUS_HIGH
  ) {
    lines.push('  NOTICE: Query pattern resembles prior containment interviews.');
  }

  return lines;
}

export function checkWanderingState(
  state: GameState,
  command: string,
  args: string[],
  result: { output: TerminalEntry[]; stateChanges: Partial<GameState> }
): { notices: TerminalEntry[]; stateChanges: Partial<GameState> } | null {
  const commandCount = state.sessionCommandCount || 0;
  const lastMeaningful = state.lastMeaningfulAction || 0;
  const wanderingCount = state.wanderingNoticeCount || 0;

  if (commandCount < 15) return null;
  if (wanderingCount >= 3) return null;

  const meaningful = isMeaningfulAction(command, args, state, result);

  if (meaningful) {
    return {
      notices: [],
      stateChanges: {
        lastMeaningfulAction: commandCount,
      },
    };
  }

  const commandsSinceMeaningful = commandCount - lastMeaningful;
  const threshold = 8 + wanderingCount * 5;

  if (commandsSinceMeaningful >= threshold) {
    return {
      notices: getWanderingNotice(Math.min(wanderingCount, 2), state),
      stateChanges: {
        wanderingNoticeCount: wanderingCount + 1,
        lastMeaningfulAction: commandCount,
      },
    };
  }

  return null;
}

// ═══════════════════════════════════════════════════════════════════════════
// PER-RUN VARIANCE
// ═══════════════════════════════════════════════════════════════════════════

function getCommandDetectionMultiplier(state: GameState, command: string): number {
  const rng = createSeededRng(state.seed + command.charCodeAt(0) * 100);
  const roll = rng();

  if (roll < 0.15) return 1.5;
  if (roll > 0.85) return 0.7;
  return 1.0;
}

export function applyDetectionVariance(state: GameState, command: string, baseIncrease: number): number {
  const multiplier = getCommandDetectionMultiplier(state, command);
  return Math.floor(baseIncrease * multiplier);
}

// ═══════════════════════════════════════════════════════════════════════════
// WARMUP DETECTION
// ═══════════════════════════════════════════════════════════════════════════

export function getWarmupAdjustedDetection(state: GameState, increase: number): number {
  const filesReadCount = state.filesRead?.size || 0;
  return applyWarmupDetection(state.detectionLevel, increase, filesReadCount);
}

export function isInWarmupPhase(state: GameState): boolean {
  const filesReadCount = state.filesRead?.size || 0;
  return filesReadCount < WARMUP_PHASE.FILES_READ_THRESHOLD;
}

// ═══════════════════════════════════════════════════════════════════════════
// VICTORY CHECK
// ═══════════════════════════════════════════════════════════════════════════

export function checkVictory(state: GameState): boolean {
  return countEvidence(state) >= MAX_EVIDENCE_COUNT;
}

// ═══════════════════════════════════════════════════════════════════════════
// EVIDENCE DISCOVERY
// ═══════════════════════════════════════════════════════════════════════════

export function applyEvidenceDiscovery(
  state: GameState,
  stateChanges: Partial<GameState>,
  filePath: string,
  file: FileNode,
  content: string[] | null,
  notices: TerminalEntry[]
): void {
  if (!content) {
    return;
  }

  const disturbingExpression = getDisturbingContentAvatarExpression(content);
  if (disturbingExpression && !stateChanges.avatarExpression) {
    stateChanges.avatarExpression = disturbingExpression;
  }

  if (!state.tutorialComplete || state.filesRead.has(filePath) || !isEvidenceFile(file)) {
    return;
  }

  const currentCount = countEvidence(state);
  const newCount = Math.min(MAX_EVIDENCE_COUNT, currentCount + 1);

  if (newCount <= currentCount) {
    return;
  }

  stateChanges.evidenceCount = newCount;
  stateChanges.avatarExpression = 'scared';

  notices.push(createEntry('system', ''));
  notices.push(createEntry('system', '[System recalibrating... attention momentarily diverted]'));

  if (newCount === 1) {
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
  }
  if (newCount === 2) {
    notices.push(createEntry('notice', ''));
    notices.push(createEntry('notice', 'SYSTEM: Evidence archive updated.'));
  }
  if (newCount === 4) {
    notices.push(createEntry('notice', ''));
    notices.push(createEntry('notice', 'NOTICE: Leak package almost ready.'));
  }
  if (newCount === MAX_EVIDENCE_COUNT) {
    notices.push(createEntry('notice', ''));
    notices.push(createEntry('notice', '▓▓▓ LEAK PACKAGE READY ▓▓▓'));
    notices.push(...createUFO74Message([
      'UFO74: five files logged. leak path is live.',
      '       type: leak',
      '       do it NOW before they cut the connection.',
    ]));
  }
}

// ═══════════════════════════════════════════════════════════════════════════
// DECRYPTION HELPER
// ═══════════════════════════════════════════════════════════════════════════

export function performDecryption(filePath: string, file: FileNode, state: GameState): CommandResult {
  const isFirstDecryption = !state.flags?.firstDecryptionComplete;
  if (isFirstDecryption) {
    saveCheckpoint(state, 'First encrypted file decrypted');
  }

  const mutation: FileMutation = state.fileMutations[filePath] || {
    decrypted: false,
  };
  mutation.decrypted = true;
  const filesRead = new Set(state.filesRead || []);
  filesRead.add(filePath);

  const stateChanges: Partial<GameState> = {
    fileMutations: {
      ...state.fileMutations,
      [filePath]: mutation,
    },
    filesRead,
    detectionLevel: state.detectionLevel + 8,
    sessionStability: state.sessionStability - 5,
    pendingDecryptFile: undefined,
    flags: {
      ...state.flags,
      firstDecryptionComplete: true,
    },
  };

  if (!state.tutorialComplete) {
    delete stateChanges.detectionLevel;
    delete stateChanges.sessionStability;
  }

  if (filePath.includes('neural_dump') || filePath.includes('.psi')) {
    stateChanges.flags = { ...stateChanges.flags, scoutLinkUnlocked: true };
  }

  const content = getFileContent(filePath, { ...state, ...stateChanges } as GameState, true);

  const truthNotices: TerminalEntry[] = [];
  applyEvidenceDiscovery(state, stateChanges, filePath, file, content, truthNotices);

  const output = [
    createEntry('system', 'AUTHENTICATION VERIFIED'),
    createEntry('system', ''),
    createEntry('warning', 'WARNING: Partial recovery only'),
    ...createOutputEntries(['', `FILE: ${filePath}`, '']),
    ...createOutputEntries(content || ['[DECRYPTION FAILED]']),
    ...truthNotices,
  ];

  if (filePath.includes('neural_dump') || filePath.includes('.psi')) {
    output.push(createEntry('system', ''));
    output.push(createEntry('notice', 'NOTICE: Neural pattern preserved.'));
    output.push(createEntry('notice', 'NOTICE: Remote link now available.'));
    output.push(createEntry('system', 'Use: link'));
  }

  let imageTrigger: ImageTrigger | undefined = undefined;
  if (file.imageTrigger) {
    const imageId = file.imageTrigger.src;
    const imagesShown = state.imagesShownThisRun || new Set<string>();

    if (!imagesShown.has(imageId)) {
      imageTrigger = file.imageTrigger;
      const newImagesShown = new Set(imagesShown);
      newImagesShown.add(imageId);
      stateChanges.imagesShownThisRun = newImagesShown;
    }
  }

  return {
    output,
    stateChanges,
    triggerFlicker: true,
    delayMs: 2000,
    imageTrigger,
    streamingMode: 'slow' as const,
  };
}

// ═══════════════════════════════════════════════════════════════════════════
// UFO74 FILE REACTION SYSTEM
// ═══════════════════════════════════════════════════════════════════════════

function getUFO74TrustLevel(state: GameState): 'trusting' | 'cautious' | 'paranoid' | 'cryptic' {
  const warnings = state.legacyAlertCounter || 0;
  const hostility = state.systemHostilityLevel || 0;
  const detection = state.detectionLevel || 0;

  const riskScore = warnings * 2 + hostility * 3 + Math.floor(detection / 20);

  if (riskScore >= 15) return 'cryptic';
  if (riskScore >= 10) return 'paranoid';
  if (riskScore >= 5) return 'cautious';
  return 'trusting';
}

function getUFO74ConditionalDialogue(state: GameState, filePath: string): TerminalEntry[] | null {
  const truthCount = state.evidenceCount || 0;
  const path = filePath.toLowerCase();

  if (
    truthCount >= 2 &&
    (path.includes('psi') || path.includes('transcript') || path.includes('neural'))
  ) {
    return contextRandomPick(
      state,
      [
        [createEntry('ufo74', 'UFO74: if the terminal starts using your wording, stop typing.')],
        [createEntry('ufo74', 'UFO74: dont mirror anything back from the psi files.')],
        [createEntry('ufo74', 'UFO74: if another line answers before i do, ignore it.')],
      ],
      'ufo74-telepathy-aftershock',
      filePath,
      truthCount
    );
  }

  if (
    truthCount >= 1 &&
    truthCount < 3 &&
    (path.includes('bio') || path.includes('containment') || path.includes('quarantine'))
  ) {
    return [createEntry('ufo74', 'UFO74: telepathy + captured... did they CHOOSE this?')];
  }

  if (
    truthCount >= 2 &&
    truthCount < 4 &&
    (path.includes('2026') || path.includes('window') || path.includes('transition'))
  ) {
    return [createEntry('ufo74', 'UFO74: all countries agreed on 2026? bigger than politics.')];
  }

  if (
    truthCount >= 1 &&
    truthCount < 3 &&
    (path.includes('autopsy') || path.includes('specimen') || path.includes('bio'))
  ) {
    return [createEntry('ufo74', 'UFO74: ship pieces first, now the CREW. someone survived.')];
  }

  if (
    truthCount >= 2 &&
    truthCount < 4 &&
    (path.includes('liaison') || path.includes('diplomatic') || path.includes('foreign'))
  ) {
    return [createEntry('ufo74', 'UFO74: captured alive, then SHARED? whos coordinating this?')];
  }

  if (
    truthCount >= 3 &&
    (path.includes('psi') || path.includes('telepat') || path.includes('neural'))
  ) {
    return [
      createEntry('ufo74', 'UFO74: knew about 2026 before reading minds? or did THEY tell us?'),
    ];
  }

  if (
    state.evidenceLinks?.length === 1 &&
    !state.singularEventsTriggered?.has('ufo74_first_link')
  ) {
    return [createEntry('ufo74', 'UFO74: connecting dots. good.')];
  }

  if (truthCount >= 4) {
    return [createEntry('ufo74', 'UFO74: almost there. one more piece.')];
  }

  return null;
}

function getUFO74DegradedTrustMessage(
  state: GameState,
  trustLevel: 'cautious' | 'paranoid' | 'cryptic',
  context: string
): TerminalEntry[] {
  if (trustLevel === 'cryptic') {
    const crypticMessages = [
      [createEntry('ufo74', 'UFO74: walls listen. find the thread.')],
      [createEntry('ufo74', 'UFO74: th3y r3 1ns1d3')],
      [createEntry('ufo74', 'UFO74: ...january... they took everything...')],
    ];
    return contextRandomPick(state, crypticMessages, 'ufo74-cryptic-message', context);
  }

  if (trustLevel === 'paranoid') {
    const paranoidMessages = [
      [createEntry('ufo74', 'UFO74: theyre scanning. cant talk.')],
      [createEntry('ufo74', 'UFO74: be fast.')],
      [createEntry('ufo74', 'UFO74: every file you open, they see.')],
    ];
    return contextRandomPick(state, paranoidMessages, 'ufo74-paranoid-message', context);
  }

  const cautiousMessages = [
    [createEntry('ufo74', 'UFO74: triggered some flags. careful.')],
    [createEntry('ufo74', 'UFO74: system suspicious. use "wait".')],
  ];
  return contextRandomPick(state, cautiousMessages, 'ufo74-cautious-message', context);
}

function getUFO74ContentReaction(state: GameState, filePath: string): TerminalEntry[] {
  const path = filePath.toLowerCase();

  if (path.includes('autopsy') || path.includes('medical')) {
    return [createEntry('ufo74', 'UFO74: autopsy report. not human.')];
  }
  if (path.includes('transport') || path.includes('logistics') || path.includes('manifest')) {
    return [createEntry('ufo74', 'UFO74: transport log. they split up the evidence.')];
  }
  if (path.includes('transcript') || path.includes('psi') || path.includes('neural')) {
    return [createEntry('ufo74', 'UFO74: they were communicating. telepathically.')];
  }
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
    return [createEntry('ufo74', 'UFO74: cover story. the real material is buried deeper.')];
  }
  if (path.includes('morse_intercept')) {
    return [
      createEntry('ufo74', 'UFO74: morse code. decipher it.'),
      createEntry('ufo74', '       might be the override passphrase.'),
      createEntry('ufo74', '       use: message <answer>'),
    ];
  }

  const defaultReactions = [
    [createEntry('ufo74', 'UFO74: interesting. keep digging.')],
    [createEntry('ufo74', 'UFO74: good. every file matters.')],
    [createEntry('ufo74', 'UFO74: noted. try /ops, /storage, /comms.')],
  ];

  return contextRandomPick(state, defaultReactions, 'ufo74-default-reaction', filePath);
}

function getUFO74FileReaction(
  filePath: string,
  state: GameState,
  isEncryptedAndLocked?: boolean,
  isFirstUnstable?: boolean
): TerminalEntry[] | null {
  const truthCount = state.evidenceCount || 0;
  const messageCount = state.incognitoMessageCount || 0;

  if (messageCount >= 12) return null;

  const trustLevel = getUFO74TrustLevel(state);

  const isGettingParanoid = truthCount >= 3 || messageCount >= 6;
  const isAboutToFlee = truthCount >= 4 || messageCount >= 9;
  const isFinalMessage = messageCount === 11;

  let messages: TerminalEntry[] = [];

  if (
    (trustLevel === 'cryptic' || trustLevel === 'paranoid') &&
    contextChance(state, 0.5, 'ufo74-degraded-trust', trustLevel, filePath, messageCount, truthCount)
  ) {
    messages = getUFO74DegradedTrustMessage(state, trustLevel, filePath);
    return messages;
  }

  const conditionalDialogue = getUFO74ConditionalDialogue(state, filePath);
  if (
    conditionalDialogue &&
    contextChance(state, 0.6, 'ufo74-conditional-dialogue', filePath, messageCount, truthCount)
  ) {
    return conditionalDialogue;
  }

  if (isFirstUnstable) {
    messages = [createEntry('ufo74', 'UFO74: messy copy, but it should still read clean enough.')];
  } else if (isEncryptedAndLocked) {
    const encryptedMessages = [
      [
        createEntry('ufo74', 'UFO74: old wrapper on this file. readable layer is still intact.'),
      ],
      [createEntry('ufo74', 'UFO74: legacy encryption tag. just keep reading closely.')],
      [createEntry('ufo74', 'UFO74: noisy shell, but the evidence is still there.')],
    ];
    messages = contextRandomPick(
      state,
      encryptedMessages,
      'ufo74-encrypted-message',
      filePath,
      messageCount,
      truthCount
    );
  } else if (isFinalMessage) {
    messages = [
      createEntry('ufo74', 'UFO74: someones at my door.'),
      createEntry('ufo74', '       not police. they dont knock like that.'),
      createEntry('ufo74', 'UFO74: tell everyone what you found.'),
      createEntry('ufo74', '       goodbye hackerkid.'),
    ];
  } else if (isAboutToFlee) {
    const fleeMessages = [
      [createEntry('ufo74', 'UFO74: hearing noises. stay alert.')],
      [
        createEntry('ufo74', 'UFO74: my connection dropped. footsteps upstairs.'),
        createEntry('ufo74', '       i live alone.'),
      ],
      [createEntry('ufo74', 'UFO74: van outside. finish fast.')],
    ];
    messages = contextRandomPick(
      state,
      fleeMessages,
      'ufo74-flee-message',
      filePath,
      messageCount,
      truthCount
    );
  } else if (isGettingParanoid) {
    const nervousMessages = [
      [createEntry('ufo74', 'UFO74: youre deep now. its real.')],
      [createEntry('ufo74', 'UFO74: be careful with this info.')],
    ];
    messages = contextRandomPick(
      state,
      nervousMessages,
      'ufo74-nervous-message',
      filePath,
      messageCount,
      truthCount
    );
  } else {
    messages = getUFO74ContentReaction(state, filePath);
  }

  return messages;
}

function getUFO74NoticeExplanation(notices: TerminalEntry[]): TerminalEntry[] | null {
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

export function getIncognitoMessage(
  state: GameState,
  filePath?: string,
  notices?: TerminalEntry[],
  isEncryptedAndLocked?: boolean,
  isFirstUnstable?: boolean
): TerminalEntry[] | null {
  if ((state.incognitoMessageCount || 0) >= 12) return null;

  const now = Date.now();
  if (state.lastIncognitoTrigger && now - state.lastIncognitoTrigger < 15000) return null;

  const isTruthDiscovery =
    notices &&
    notices.some(
      n =>
        n.content.includes('TRUTH FRAGMENT') ||
        n.content.includes('EVIDENCE') ||
        n.content.includes('discovered')
    );

  if (!isTruthDiscovery && !isFirstUnstable) {
    if (!contextChance(state, 0.2, 'ufo74-react-to-open', filePath || '', notices?.length || 0)) {
      return null;
    }
  }

  if (notices && notices.length > 0 && !isEncryptedAndLocked && !isFirstUnstable) {
    const explanation = getUFO74NoticeExplanation(notices);
    if (explanation) return explanation;
  }

  if (filePath) {
    if (
      isEncryptedAndLocked ||
      isFirstUnstable ||
      contextChance(state, 0.7, 'ufo74-file-comment', filePath, notices?.length || 0)
    ) {
      return getUFO74FileReaction(filePath, state, isEncryptedAndLocked, isFirstUnstable);
    }
  }

  return null;
}

// ═══════════════════════════════════════════════════════════════════════════
// ARCHIVE MODE HELPERS
// ═══════════════════════════════════════════════════════════════════════════

export function isArchiveOnlyFile(filePath: string): boolean {
  return filePath in ARCHIVE_FILES;
}
