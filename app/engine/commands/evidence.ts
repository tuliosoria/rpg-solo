// Evidence commands: leak

import { createEntry, createEntryI18n } from './utils';
import { saveCheckpoint } from '../../storage/saves';
import { countEvidence, MAX_EVIDENCE_COUNT } from '../evidenceRevelation';
import { translateStatic } from '../../i18n';
import type { CommandRegistry } from './types';

export const evidenceCommands: CommandRegistry = {
  leak: (args, state) => {
    // Require all 10 evidence before allowing leak
    const allFound = countEvidence(state) >= MAX_EVIDENCE_COUNT;
    if (!allFound) {
      const found = countEvidence(state);
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

    // Checkpoint before leak
    saveCheckpoint(state, translateStatic('checkpoint.reason.beforeLeakTransmission'));

    // Skip questions — go straight to ICQ phase
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
  },
};
