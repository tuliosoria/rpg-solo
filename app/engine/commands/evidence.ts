// Evidence commands: leak

import { createEntry, createEntryI18n } from './utils';
import { saveCheckpoint } from '../../storage/saves';
import { MAX_EVIDENCE_COUNT } from '../evidenceRevelation';
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
  // Guard: migrated saves may lack `seed` — derive a stable fallback so the RNG is deterministic.
  const baseSeed =
    typeof state.seed === 'number' && Number.isFinite(state.seed)
      ? state.seed
      : ((state.savedFiles?.size || 0) + 1) * 0x9e3779b1;
  const rng = createSeededRng(baseSeed ^ 0x4c45414b); // XOR with "LEAK" for unique sequence
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
  if (!state.leakSequence) {
    return {
      output: [createEntryI18n('error', 'engine.commands.evidence.leak_sequence_not_initialized', 'Leak sequence not initialized.')],
      stateChanges: {},
    };
  }
  const sequence = state.leakSequence;
  const progress = state.leakSequenceProgress;

  // Sequence already complete — informational response, do not reset or penalize.
  if (progress >= sequence.length) {
    const savedCount = state.savedFiles?.size || 0;
    return {
      output: [
        createEntry('notice', ''),
        createEntryI18n('notice', 'engine.commands.evidence.leak_channel_already_prepared', '  LEAK CHANNEL ALREADY PREPARED'),
        createEntry('system', ''),
        createEntryI18n(
          'system',
          'engine.commands.evidence.files_saved_progress',
          '  Files saved: {{savedCount}}/{{maxCount}}',
          { savedCount, maxCount: MAX_EVIDENCE_COUNT }
        ),
        createEntryI18n('system', 'engine.commands.evidence.run_leak_to_transmit', '  Run "leak" with no arguments to transmit once all files are saved.'),
        createEntry('system', ''),
      ],
      stateChanges: {},
    };
  }

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
          createEntryI18n('notice', 'engine.commands.evidence.preparation_sequence_complete', '  ▸ PREPARATION SEQUENCE COMPLETE'),
          createEntryI18n('notice', 'engine.commands.evidence.leak_channel_decrypted_standing_by', '  ▸ Leak channel decrypted and standing by.'),
          createEntry('system', ''),
          createEntryI18n('ufo74', 'engine.commands.evidence.ufo74_channel_is_open', '[UFO74]: channel is open. run "leak" when you have all ten.'),
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
        createEntryI18n(
          'system',
          'engine.commands.evidence.step_progress_confirmed',
          '  Step {{current}}/{{total}} confirmed.',
          { current: newProgress, total: 3 }
        ),
        createEntryI18n(
          'system',
          'engine.commands.evidence.next_leak_step',
          '  Next: leak {{command}}',
          { command: sequence[newProgress] }
        ),
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
      createEntryI18n('error', 'engine.commands.evidence.sequence_mismatch_reset', '  ✗ SEQUENCE MISMATCH — protocol reset'),
      createEntryI18n(
        'error',
        'engine.commands.evidence.expected_leak_command',
        '  Expected: leak {{command}}',
        { command: expected }
      ),
      createEntryI18n(
        'error',
        'engine.commands.evidence.received_leak_command',
        '  Received: leak {{command}}',
        { command: subcommand }
      ),
      createEntry('system', ''),
      createEntryI18n('warning', 'engine.commands.evidence.detection_level_increased', '  ⚠ Detection level increased (+5%)'),
      createEntryI18n('system', 'engine.commands.evidence.preparation_must_restart', '  Preparation sequence must be restarted from step 1.'),
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
    const savedCount = (state.savedFiles?.size || 0);

    // Below 5 saved files: standard block message
    if (savedCount < EVIDENCE_THRESHOLD_FOR_SEQUENCE) {
      return {
        output: [
          createEntryI18n(
            'error',
            'engine.commands.evidence.leak_blocked_insufficient_evidence',
            'LEAK BLOCKED — INSUFFICIENT EVIDENCE'
          ),
          createEntry('system', ''),
          createEntryI18n(
            'system',
            'engine.commands.evidence.files_saved_progress',
            '  Files saved: {{savedCount}}/{{maxCount}}',
            { savedCount, maxCount: MAX_EVIDENCE_COUNT }
          ),
          createEntryI18n(
            'system',
            'engine.commands.evidence.save_at_least_five_files_to_begin',
            '  Save at least five files to begin'
          ),
          createEntryI18n(
            'system',
            'engine.commands.evidence.the_leak_preparation_sequence',
            '  the leak preparation sequence.'
          ),
          createEntry('system', ''),
          createEntryI18n(
            'ufo74',
            'engine.commands.evidence.ufo74_not_yet_we_need_more_five_minimum_ten_to_finish',
            '[UFO74]: not yet. we need more. five minimum to start the preparation. ten to finish the job.'
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

    // Sequence complete AND all 10 files saved: execute leak
    if (progress >= 3 && savedCount >= MAX_EVIDENCE_COUNT) {
      saveCheckpoint(state, translateStatic('checkpoint.reason.beforeLeakTransmission'));

      return {
        output: [
          createEntry('system', ''),
          createEntry('system', '═══════════════════════════════════════'),
          createEntryI18n('system', 'engine.commands.evidence.leak_transmission_initiated', '  LEAK TRANSMISSION INITIATED'),
          createEntry('system', '═══════════════════════════════════════'),
          createEntry('system', ''),
          createEntryI18n(
            'system',
            'engine.commands.evidence.compiling_dossier',
            '  Compiling dossier... {{savedCount}} files confirmed.',
            { savedCount }
          ),
          createEntryI18n('system', 'engine.commands.evidence.encrypting_for_distribution', '  Encrypting for distribution...'),
          createEntryI18n('system', 'engine.commands.evidence.channel_open', '  Channel open.'),
          createEntry('system', ''),
          createEntryI18n('system', 'engine.commands.evidence.transmission_successful', '  TRANSMISSION SUCCESSFUL.'),
          createEntry('system', ''),
        ],
        stateChanges: {
          evidencesSaved: true,
          flags: { ...state.flags, leakSuccessful: true },
          gameWon: true,
          endingId: undefined, // Ending determined when the blackout completion handler evaluates savedFiles
        },
        delayMs: 2000,
        triggerFlicker: true,
      };
    }

    // Sequence complete but not all 10 evidence yet
    if (progress >= 3) {
      return {
        output: [
          createEntry('notice', ''),
          createEntryI18n('notice', 'engine.commands.evidence.leak_channel_ready', '  LEAK CHANNEL READY — awaiting full evidence package.'),
          createEntry('system', ''),
          createEntryI18n(
            'system',
            'engine.commands.evidence.files_saved_progress',
            '  Files saved: {{savedCount}}/{{maxCount}}',
            { savedCount, maxCount: MAX_EVIDENCE_COUNT }
          ),
          createEntryI18n('system', 'engine.commands.evidence.save_all_ten_then_leak', '  Save all 10 files, then run "leak" again.'),
          createEntry('system', ''),
          createEntryI18n('ufo74', 'engine.commands.evidence.ufo74_channel_prepped', '[UFO74]: channel is prepped. just need the rest of the files.'),
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
          createEntryI18n('warning', 'engine.commands.evidence.leak_channel_encrypted', '  LEAK CHANNEL ENCRYPTED'),
          createEntry('system', ''),
          createEntryI18n('system', 'engine.commands.evidence.leak_channel_requires_preparation', '  The leak channel requires a 3-command preparation'),
          createEntryI18n('system', 'engine.commands.evidence.sequence_before_opened', '  sequence before it can be opened.'),
          createEntry('system', ''),
          createEntryI18n('system', 'engine.commands.evidence.run_commands_in_order', '  Run the following commands IN ORDER:'),
          createEntry('system', ''),
          ...formatSequenceDisplay(sequence, 0).map((line) => createEntry('notice' as const, line)),
          createEntry('system', ''),
          createEntryI18n('warning', 'engine.commands.evidence.wrong_order_warning', '  ⚠ Wrong order will reset the sequence and raise detection.'),
          createEntry('system', ''),
          createEntryI18n('ufo74', 'engine.commands.evidence.ufo74_encrypted_channel', '[UFO74]: encrypted channel. follow the protocol exactly.'),
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
        createEntryI18n('warning', 'engine.commands.evidence.leak_channel_preparation_in_progress', '  LEAK CHANNEL — PREPARATION IN PROGRESS'),
        createEntry('system', ''),
        createEntryI18n(
          'system',
          'engine.commands.evidence.steps_completed_progress',
          '  Progress: {{current}}/{{total}} steps completed.',
          { current: progress, total: 3 }
        ),
        createEntry('system', ''),
        ...formatSequenceDisplay(sequence, progress).map((line) => createEntry('system' as const, line)),
        createEntry('system', ''),
        createEntryI18n(
          'system',
          'engine.commands.evidence.next_leak_step',
          '  Next: leak {{command}}',
          { command: sequence[progress] }
        ),
        createEntry('system', ''),
      ],
      stateChanges: {},
    };
  },
};
