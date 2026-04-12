// Evidence commands: leak

import { createEntry } from './utils';
import { saveCheckpoint } from '../../storage/saves';
import { countEvidence, MAX_EVIDENCE_COUNT } from '../evidenceRevelation';
import type { CommandRegistry } from './types';

export const evidenceCommands: CommandRegistry = {
  leak: (args, state) => {
    // Require all 10 evidence before allowing leak
    const allFound = countEvidence(state) >= MAX_EVIDENCE_COUNT;
    if (!allFound) {
      const found = countEvidence(state);
      return {
        output: [
          createEntry('error', 'LEAK BLOCKED — INSUFFICIENT EVIDENCE'),
          createEntry('system', ''),
          createEntry('system', `  Evidence documented: ${found}/${MAX_EVIDENCE_COUNT}`),
          createEntry('system', '  All ten must be confirmed before'),
          createEntry('system', '  the leak channel can be opened.'),
          createEntry('system', ''),
          createEntry('ufo74', '[UFO74]: not yet. we need more. ten pieces minimum or nobody will believe us.'),
        ],
        stateChanges: {},
      };
    }

    // Checkpoint before leak
    saveCheckpoint(state, 'Before leak transmission');

    // Skip questions — go straight to ICQ phase
    return {
      output: [
        createEntry('system', ''),
        createEntry('notice', '▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓'),
        createEntry('notice', ''),
        createEntry('notice', '  LEAK TRANSMISSION INITIATED'),
        createEntry('notice', ''),
        createEntry('notice', '  Compiling evidence package...'),
        createEntry('notice', `  ${MAX_EVIDENCE_COUNT} files confirmed.`),
        createEntry('notice', '  Encrypting for distribution...'),
        createEntry('notice', '  Channel open.'),
        createEntry('notice', ''),
        createEntry('notice', '  TRANSMISSION SUCCESSFUL.'),
        createEntry('notice', ''),
        createEntry('notice', '▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓'),
        createEntry('system', ''),
        createEntry('ufo74', '[UFO74]: it is done. the world will know.'),
        createEntry('ufo74', '         someone wants to talk to you.'),
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
