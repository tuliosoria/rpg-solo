// Hint System for Terminal 1996
// Provides state-aware UFO74 hints without revealing exact file answers.

import { DETECTION_THRESHOLDS } from '../constants/detection';
import { GameState, TerminalEntry } from '../types';
import { countEvidence, MAX_EVIDENCE_COUNT } from './evidenceRevelation';
import { createEntry, createEntryI18n } from './commands/utils';

// Hint configuration
export const HINT_CONFIG = {
  maxHints: 8,
  detectionPenalty: 4,
};

interface HintLine {
  key: string;
  fallback: string;
  values?: Record<string, string | number>;
}

export interface HintDescriptor {
  primary: HintLine;
  followUp?: HintLine;
}

function pickHintVariant(hintsUsed: number, variants: HintLine[]): HintLine {
  return variants[hintsUsed % variants.length];
}

function hasReadPathPrefix(state: GameState, prefix: string): boolean {
  for (const path of state.filesRead || []) {
    if (path.startsWith(prefix)) {
      return true;
    }
  }

  return false;
}

/**
 * Analyze player progress and return the most useful hint for the current state.
 */
export function analyzeProgressForHint(state: GameState): HintDescriptor | null {
  const hintsUsed = state.hintsUsed || 0;
  const filesReadCount = state.filesRead?.size || 0;
  const evidenceCount = countEvidence(state);
  const waitUsesRemaining = state.waitUsesRemaining || 0;
  const hasReadStorage = hasReadPathPrefix(state, '/storage/');
  const hasReadOps = hasReadPathPrefix(state, '/ops/');
  const hasReadComms = hasReadPathPrefix(state, '/comms/');
  const hasReadAdmin = hasReadPathPrefix(state, '/admin/');
  const adminUnlocked = state.flags?.adminUnlocked === true || state.accessLevel >= 3;

  if (!state.gameWon && evidenceCount >= MAX_EVIDENCE_COUNT) {
    return {
      primary: pickHintVariant(hintsUsed, [
        {
          key: 'engine.hints.progress.nearComplete.1',
          fallback: 'UFO74: You are close to understanding.',
        },
        {
          key: 'engine.hints.progress.nearComplete.3',
          fallback: 'UFO74: The full picture is almost visible.',
        },
      ]),
      followUp: {
        key: 'engine.hints.action.leak',
        fallback: '       review with "progress", then use "leak" when you are ready.',
      },
    };
  }

  if (state.detectionLevel >= DETECTION_THRESHOLDS.STATUS_HIGH && waitUsesRemaining > 0) {
    return {
      primary: {
        key: 'engine.hints.action.recoverHeader',
        fallback: 'UFO74: dont get greedy. the system is awake now.',
      },
      followUp: {
        key: waitUsesRemaining === 1 ? 'engine.hints.action.recover.one' : 'engine.hints.action.recover.other',
        fallback: `       cool the heat first. "wait" still has ${waitUsesRemaining} use${
          waitUsesRemaining === 1 ? '' : 's'
        } left.`,
        values: { value: waitUsesRemaining },
      },
    };
  }

  if (filesReadCount === 0) {
    return {
      primary: pickHintVariant(hintsUsed, [
        {
          key: 'engine.hints.progress.noFiles.1',
          fallback: 'UFO74: You have not examined any files yet.',
        },
        {
          key: 'engine.hints.progress.noFiles.3',
          fallback: 'UFO74: The filesystem contains answers.',
        },
      ]),
      followUp: {
        key: 'engine.hints.action.start.openRoutineFile',
        fallback: '       start small: "ls", then "open" something routine.',
      },
    };
  }

  if (filesReadCount < 4 && evidenceCount === 0) {
    return {
      primary: pickHintVariant(hintsUsed, [
        {
          key: 'engine.hints.progress.fewFiles.1',
          fallback: 'UFO74: You have only scratched the surface.',
        },
        {
          key: 'engine.hints.progress.fewFiles.2',
          fallback: 'UFO74: Many directories remain unexplored.',
        },
      ]),
      followUp: {
        key: 'engine.hints.action.start.useTreeAndSearch',
        fallback: '       use "tree" for the map, then "search <term>" if you need a lead.',
      },
    };
  }

  if (state.morseFileRead && !state.morseMessageSolved) {
    return {
      primary: pickHintVariant(hintsUsed, [
        {
          key: 'engine.hints.truth.telepathic.2',
          fallback: 'UFO74: Signal analysis revealed unusual patterns.',
        },
        {
          key: 'engine.hints.directory.comms.3',
          fallback: 'UFO74: Some signals defy conventional analysis.',
        },
      ]),
      followUp: {
        key: 'engine.hints.action.morse',
        fallback: '       the intercept is waiting for a "morse" response, not another file read.',
      },
    };
  }

  if (!hasReadStorage && evidenceCount < 3) {
    return {
      primary: pickHintVariant(hintsUsed, [
        {
          key: 'engine.hints.directory.storage.1',
          fallback: 'UFO74: Storage logs track more than inventory.',
        },
        {
          key: 'engine.hints.directory.storage.3',
          fallback: 'UFO74: Physical evidence leaves paper trails.',
        },
      ]),
      followUp: {
        key: 'engine.hints.action.storage',
        fallback: '       follow the manifests. "search transport" is a good start.',
      },
    };
  }

  if (!hasReadOps && evidenceCount < 5) {
    return {
      primary: pickHintVariant(hintsUsed, [
        {
          key: 'engine.hints.directory.ops.1',
          fallback: 'UFO74: Operations involved more than cleanup.',
        },
        {
          key: 'engine.hints.directory.ops.2',
          fallback: 'UFO74: Quarantine suggests something needed containing.',
        },
      ]),
      followUp: {
        key: 'engine.hints.action.ops',
        fallback: '       dig through /ops/ before you assume it was only debris.',
      },
    };
  }

  if (!hasReadComms && evidenceCount < 7) {
    return {
      primary: pickHintVariant(hintsUsed, [
        {
          key: 'engine.hints.directory.comms.1',
          fallback: 'UFO74: Communication channels hold encrypted secrets.',
        },
        {
          key: 'engine.hints.directory.comms.2',
          fallback: 'UFO74: Not all intercepts are routine.',
        },
      ]),
      followUp: {
        key: 'engine.hints.action.comms',
        fallback: '       /comms/ is where the story stops sounding human.',
      },
    };
  }

  if (!adminUnlocked && evidenceCount >= 4) {
    return {
      primary: pickHintVariant(hintsUsed, [
        {
          key: 'engine.hints.progress.someTruths.2',
          fallback: 'UFO74: Cross-reference what you have learned.',
        },
        {
          key: 'engine.hints.progress.someTruths.3',
          fallback: 'UFO74: Some truths illuminate others.',
        },
      ]),
      followUp: {
        key: 'engine.hints.action.override',
        fallback: '       if the trail narrows, ask Prisoner 45 about the password and decode what he gives you.',
      },
    };
  }

  if (adminUnlocked && !hasReadAdmin) {
    return {
      primary: pickHintVariant(hintsUsed, [
        {
          key: 'engine.hints.directory.admin.1',
          fallback: 'UFO74: Administrative access reveals higher clearance docs.',
        },
        {
          key: 'engine.hints.directory.admin.2',
          fallback: 'UFO74: Internal memos speak more freely.',
        },
      ]),
      followUp: {
        key: 'engine.hints.action.admin',
        fallback: '       you earned the clearance. spend it in /admin/.',
      },
    };
  }

  if (state.prisoner45QuestionsAsked === 0 && evidenceCount >= 2) {
    return {
      primary: pickHintVariant(hintsUsed, [
        {
          key: 'engine.hints.progress.someTruths.1',
          fallback: 'UFO74: You are assembling the picture.',
        },
        {
          key: 'engine.hints.truth.international.2',
          fallback: 'UFO74: Diplomatic channels activated faster than expected.',
        },
      ]),
      followUp: {
        key: 'engine.hints.action.chat',
        fallback: '       open "chat". someone trapped in the system still answers questions.',
      },
    };
  }

  if (evidenceCount >= 7) {
    return {
      primary: pickHintVariant(hintsUsed, [
        {
          key: 'engine.hints.progress.nearComplete.2',
          fallback: 'UFO74: One or two pieces remain hidden.',
        },
        {
          key: 'engine.hints.progress.nearComplete.3',
          fallback: 'UFO74: The full picture is almost visible.',
        },
      ]),
      followUp: {
        key: 'engine.hints.action.review.looseThreads',
        fallback: '       use "progress", "bookmark", and "unread" to find the loose threads.',
      },
    };
  }

  if (evidenceCount > 0) {
    return {
      primary: pickHintVariant(hintsUsed, [
        {
          key: 'engine.hints.progress.someTruths.1',
          fallback: 'UFO74: You are assembling the picture.',
        },
        {
          key: 'engine.hints.progress.someTruths.2',
          fallback: 'UFO74: Cross-reference what you have learned.',
        },
      ]),
      followUp: {
        key: 'engine.hints.action.review.searchGaps',
        fallback: '       run "progress" for the recap, then search the gaps instead of rereading everything.',
      },
    };
  }

  return {
    primary: pickHintVariant(hintsUsed, [
      {
        key: 'engine.hints.progress.noTruths.1',
        fallback: 'UFO74: Evidence exists, but you have not recognized it.',
      },
      {
        key: 'engine.hints.progress.noTruths.3',
        fallback: 'UFO74: Read deeper. Question what you read.',
      },
    ]),
    followUp: {
      key: 'engine.hints.action.start.widenSearch',
      fallback: '       widen the search. different sectors answer different parts of the case.',
    },
  };
}

/**
 * Generate the full hint output with UFO74 framing.
 */
export function generateHintOutput(state: GameState): {
  output: TerminalEntry[];
  stateChanges: Partial<GameState>;
} {
  const hintsUsed = state.hintsUsed || 0;
  const maxHints = HINT_CONFIG.maxHints;

  if (hintsUsed >= maxHints) {
    return {
      output: [
        createEntry('system', ''),
        createEntryI18n(
          'warning',
          'engine.hints.protocol.depleted',
          '>>> HINT PROTOCOL: RESOURCE DEPLETED'
        ),
        createEntryI18n(
          'ufo74',
          'engine.hints.exhausted.line1',
          'UFO74: no more hints. rely on your own analysis.'
        ),
        createEntryI18n(
          'ufo74',
          'engine.hints.exhausted.line2',
          '       you have enough to work with. READ the files.'
        ),
        createEntry('system', ''),
      ],
      stateChanges: {},
    };
  }

  const hint = analyzeProgressForHint(state);

  if (!hint) {
    return {
      output: [
        createEntry('system', ''),
        createEntryI18n('warning', 'engine.hints.protocol.activated', '>>> HINT PROTOCOL ACTIVATED'),
        createEntryI18n('ufo74', 'engine.hints.progress.line1', 'UFO74: you seem to be making progress.'),
        createEntryI18n(
          'ufo74',
          'engine.hints.progress.line2',
          '       keep exploring. the evidence is in the files.'
        ),
        createEntry('system', ''),
      ],
      stateChanges: {},
    };
  }

  const hintsRemaining = maxHints - hintsUsed - 1;
  const stateChanges: Partial<GameState> = {
    hintsUsed: hintsUsed + 1,
  };

  if (state.tutorialComplete) {
    stateChanges.detectionLevel = Math.min(
      100,
      (state.detectionLevel || 0) + HINT_CONFIG.detectionPenalty
    );
  }

  return {
    output: [
      createEntry('system', ''),
      createEntryI18n('warning', 'engine.hints.protocol.activated', '>>> HINT PROTOCOL ACTIVATED'),
      createEntry('system', ''),
      createEntryI18n('ufo74', hint.primary.key, hint.primary.fallback, hint.primary.values),
      ...(hint.followUp
        ? [createEntryI18n('ufo74', hint.followUp.key, hint.followUp.fallback, hint.followUp.values)]
        : []),
      createEntry('system', ''),
      createEntryI18n(
        'notice',
        hintsRemaining === 1 ? 'engine.hints.remaining.one' : 'engine.hints.remaining.other',
        `>>> ${hintsRemaining} HINT${hintsRemaining !== 1 ? 'S' : ''} REMAINING`,
        { value: hintsRemaining }
      ),
      createEntry('system', ''),
    ],
    stateChanges,
  };
}
