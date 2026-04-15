// Evidence commands: leak

import { createEntry, createEntryI18n } from './utils';
import { saveCheckpoint } from '../../storage/saves';
import { countEvidence, MAX_EVIDENCE_COUNT } from '../evidenceRevelation';
import { translateStatic } from '../../i18n';
import { createSeededRng, seededShuffle } from '../rng';
import type { CommandRegistry } from './types';
import type { GameState, CommandResult } from '../../types';

const LEAK_SEQUENCE_POOL = [
  'verify alpha',
  'route signal',
  'encrypt channel',
  'bypass node',
  'sync relay',
  'confirm handshake',
  'open port',
  'auth token',
  'flush cache',
  'prime buffer',
];

const EVIDENCE_THRESHOLD_FOR_SEQUENCE = 5;

function generateLeakSequence(state: GameState): string[] {
  const rng = createSeededRng(state.seed ^ 0x4c45414b); // XOR with "LEAK" for unique sequence
  const shuffled = seededShuffle(rng, LEAK_SEQUENCE_POOL);
  return shuffled.slice(0, 3);
}

function formatSequenceDisplay(sequence: string[], progress: number): string[] {
  return sequence.map((cmd, i) => {
    const marker = i < progress ? '  ✓' : `  ${i + 1}.`;
    return `${marker} leak ${cmd}`;
  });
}

function handleLeakSubcommand(args: string[], state: GameState): CommandResult {
  const subcommand = args.join(' ');
  const sequence = state.leakSequence!;
  const progress = state.leakSequenceProgress;
  const expected = sequence[progress];

  if (subcommand === expected) {
    const newProgress = progress + 1;

    if (newProgress >= 3) {
      // Sequence complete
      return {
        output: [
          createEntry('system', ''),
          createEntry('notice', `  ✓ ${subcommand}`),
          createEntry('system', ''),
          createEntry('notice', '  ▸ PREPARATION SEQUENCE COMPLETE'),
          createEntry('notice', '  ▸ Leak channel decrypted and standing by.'),
          createEntry('system', ''),
          createEntry('ufo74', '[UFO74]: channel is open. run "leak" when you have all ten.'),
          createEntry('system', ''),
        ],
        stateChanges: {
          leakSequenceProgress: 3,
        },
      };
    }

    // Correct step, not yet complete
    return {
      output: [
        createEntry('system', ''),
        createEntry('notice', `  ✓ ${subcommand}`),
        createEntry('system', `  Step ${newProgress}/3 confirmed.`),
        createEntry('system', `  Next: leak ${sequence[newProgress]}`),
        createEntry('system', ''),
      ],
      stateChanges: {
        leakSequenceProgress: newProgress,
      },
    };
  }

  // Wrong command — reset sequence and increase detection
  const newDetection = Math.min(100, state.detectionLevel + 5);
  return {
    output: [
      createEntry('error', ''),
      createEntry('error', '  ✗ SEQUENCE MISMATCH — protocol reset'),
      createEntry('error', `  Expected: leak ${expected}`),
      createEntry('error', `  Received: leak ${subcommand}`),
      createEntry('system', ''),
      createEntry('warning', '  ⚠ Detection level increased (+5%)'),
      createEntry('system', '  Preparation sequence must be restarted from step 1.'),
      createEntry('system', ''),
      ...formatSequenceDisplay(sequence, 0).map((line) => createEntry('system' as const, line)),
      createEntry('system', ''),
    ],
    stateChanges: {
      leakSequenceProgress: 0,
      detectionLevel: newDetection,
    },
  };
}

export const evidenceCommands: CommandRegistry = {
  leak: (args, state) => {
    const found = countEvidence(state);

    // Below 5 evidence: standard block message
    if (found < EVIDENCE_THRESHOLD_FOR_SEQUENCE) {
      return {
        output: [
          createEntryI18n(
            'error',
            'engine.commands.evidence.leak_blocked_insufficient_evidence',
            'LEAK BLOCKED — INSUFFICIENT EVIDENCE'
          ),
          createEntry('system', ''),
          createEntry('system', `  Evidence documented: ${found}/${MAX_EVIDENCE_COUNT}`),
          createEntryI18n(
            'system',
            'engine.commands.evidence.all_ten_must_be_confirmed_before',
            '  All ten must be confirmed before'
          ),
          createEntryI18n(
            'system',
            'engine.commands.evidence.the_leak_channel_can_be_opened',
            '  the leak channel can be opened.'
          ),
          createEntry('system', ''),
          createEntryI18n(
            'ufo74',
            'engine.commands.evidence.ufo74_not_yet_we_need_more_ten_pieces_minimum_or_nobody_will',
            '[UFO74]: not yet. we need more. ten pieces minimum or nobody will believe us.'
          ),
        ],
        stateChanges: {},
      };
    }

    // 5+ evidence: preparation sequence gate
    const sequence = state.leakSequenceGenerated
      ? state.leakSequence!
      : generateLeakSequence(state);
    const sequenceJustGenerated = !state.leakSequenceGenerated;
    const progress = sequenceJustGenerated ? 0 : state.leakSequenceProgress;

    // Handle subcommands (e.g., "leak verify alpha")
    if (args.length > 0) {
      // Ensure sequence is stored before processing subcommand
      const stateWithSequence: GameState = sequenceJustGenerated
        ? { ...state, leakSequence: sequence, leakSequenceGenerated: true, leakSequenceProgress: 0 }
        : state;
      const result = handleLeakSubcommand(args, stateWithSequence);
      if (sequenceJustGenerated) {
        result.stateChanges = {
          ...result.stateChanges,
          leakSequence: sequence,
          leakSequenceGenerated: true,
        };
      }
      return result;
    }

    // "leak" with no subcommand

    // Sequence complete AND all 10 evidence: execute leak
    if (progress >= 3 && found >= MAX_EVIDENCE_COUNT) {
      saveCheckpoint(state, translateStatic('checkpoint.reason.beforeLeakTransmission'));

      return {
        output: [
          createEntry('system', ''),
          createEntry('notice', '▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓'),
          createEntry('notice', ''),
          createEntryI18n(
            'notice',
            'engine.commands.evidence.leak_transmission_initiated',
            '  LEAK TRANSMISSION INITIATED'
          ),
          createEntry('notice', ''),
          createEntryI18n(
            'notice',
            'engine.commands.evidence.compiling_evidence_package',
            '  Compiling evidence package...'
          ),
          createEntry('notice', `  ${MAX_EVIDENCE_COUNT} files confirmed.`),
          createEntryI18n(
            'notice',
            'engine.commands.evidence.encrypting_for_distribution',
            '  Encrypting for distribution...'
          ),
          createEntryI18n('notice', 'engine.commands.evidence.channel_open', '  Channel open.'),
          createEntry('notice', ''),
          createEntryI18n(
            'notice',
            'engine.commands.evidence.transmission_successful',
            '  TRANSMISSION SUCCESSFUL.'
          ),
          createEntry('notice', ''),
          createEntry('notice', '▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓'),
          createEntry('system', ''),
          createEntryI18n(
            'ufo74',
            'engine.commands.evidence.ufo74_it_is_done_the_world_will_know',
            '[UFO74]: it is done. the world will know.'
          ),
          createEntryI18n(
            'ufo74',
            'engine.commands.evidence.someone_wants_to_talk_to_you',
            '         someone wants to talk to you.'
          ),
          createEntry('system', ''),
        ],
        stateChanges: {
          evidencesSaved: true,
          icqPhase: true,
          flags: {
            ...state.flags,
            leakSuccessful: true,
          },
        },
        delayMs: 2000,
        triggerFlicker: true,
        skipToPhase: 'icq' as const,
      };
    }

    // Sequence complete but not all 10 evidence yet
    if (progress >= 3) {
      return {
        output: [
          createEntry('notice', ''),
          createEntry('notice', '  LEAK CHANNEL READY — awaiting full evidence package.'),
          createEntry('system', ''),
          createEntry('system', `  Evidence documented: ${found}/${MAX_EVIDENCE_COUNT}`),
          createEntry('system', '  Collect all 10 evidence files, then run "leak" again.'),
          createEntry('system', ''),
          createEntry('ufo74', '[UFO74]: channel is prepped. just need the rest of the files.'),
          createEntry('system', ''),
        ],
        stateChanges: {},
      };
    }

    // First time seeing the sequence: generate and display
    if (sequenceJustGenerated) {
      return {
        output: [
          createEntry('warning', ''),
          createEntry('warning', '  LEAK CHANNEL ENCRYPTED'),
          createEntry('system', ''),
          createEntry('system', '  The leak channel requires a 3-command preparation'),
          createEntry('system', '  sequence before it can be opened.'),
          createEntry('system', ''),
          createEntry('system', '  Run the following commands IN ORDER:'),
          createEntry('system', ''),
          ...formatSequenceDisplay(sequence, 0).map((line) => createEntry('notice' as const, line)),
          createEntry('system', ''),
          createEntry('warning', '  ⚠ Wrong order will reset the sequence and raise detection.'),
          createEntry('system', ''),
          createEntry('ufo74', '[UFO74]: encrypted channel. follow the protocol exactly.'),
          createEntry('system', ''),
        ],
        stateChanges: {
          leakSequence: sequence,
          leakSequenceGenerated: true,
          leakSequenceProgress: 0,
        },
      };
    }

    // Sequence generated but incomplete: remind player
    return {
      output: [
        createEntry('warning', ''),
        createEntry('warning', '  LEAK CHANNEL — PREPARATION IN PROGRESS'),
        createEntry('system', ''),
        createEntry('system', `  Progress: ${progress}/3 steps completed.`),
        createEntry('system', ''),
        ...formatSequenceDisplay(sequence, progress).map((line) => createEntry('system' as const, line)),
        createEntry('system', ''),
        createEntry('system', `  Next: leak ${sequence[progress]}`),
        createEntry('system', ''),
      ],
      stateChanges: {},
    };
  },
};
