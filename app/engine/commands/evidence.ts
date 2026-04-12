// Evidence commands: leak

import { createEntry } from './utils';
import { saveCheckpoint } from '../../storage/saves';
import { countEvidence, MAX_EVIDENCE_COUNT } from '../evidenceRevelation';
import {
  startLeakSequence,
} from '../elusiveMan';
import type { CommandRegistry } from './types';

export const evidenceCommands: CommandRegistry = {
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

    // Require all 5 evidence before allowing leak
    const allFound = countEvidence(state) >= MAX_EVIDENCE_COUNT;
    if (!allFound) {
      const found = countEvidence(state);
      return {
        output: [
          createEntry('error', 'LEAK BLOCKED — INSUFFICIENT EVIDENCE'),
          createEntry('system', ''),
          createEntry('system', `  Evidence documented: ${found}/5`),
          createEntry('system', '  All five must be confirmed before'),
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
    return startLeakSequence();
  },
};
