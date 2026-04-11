// Hint System for Terminal 1996
// Provides a curated pool of exactly 8 hints, never repeating

import { GameState, TerminalEntry } from '../types';
import { createEntry, createEntryI18n } from './commands/utils';

// Hint configuration
export const HINT_CONFIG = {
  maxHints: 8, // Exactly 8 hints total, never repeat
  detectionPenalty: 4, // +4 detection after tutorial (hidden from player)
};

// Fixed pool of 8 curated hints — ordered from basic to advanced
const HINT_POOL: string[] = [
  'the filesystem contains answers.',
  'have you thought about using tree?',
  'check /storage/ for transport logs.',
  'if risk is too high, you can use wait.',
  'some files are encrypted — look for clues on how to decode them.',
  'morse code is not just noise.',
  'pay attention to cross-references between files.',
  'the good stuff is behind override — we need to find the password.',
];

const HINT_I18N_BY_TEXT: Record<string, string> = {
  'the filesystem contains answers.': 'engine.hints.pool.1',
  'have you thought about using tree?': 'engine.hints.pool.2',
  'check /storage/ for transport logs.': 'engine.hints.pool.3',
  'if risk is too high, you can use wait.': 'engine.hints.pool.4',
  'some files are encrypted — look for clues on how to decode them.': 'engine.hints.pool.5',
  'morse code is not just noise.': 'engine.hints.pool.6',
  'pay attention to cross-references between files.': 'engine.hints.pool.7',
  'the good stuff is behind override — we need to find the password.': 'engine.hints.pool.8',
};

/**
 * Get the next hint from the pool (sequential, never repeats).
 * Returns null if all hints have been given.
 */
export function analyzeProgressForHint(state: GameState): string | null {
  const hintsUsed = state.hintsUsed || 0;
  if (hintsUsed >= HINT_POOL.length) return null;
  return HINT_POOL[hintsUsed];
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

  // Check if hints are exhausted
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

  // Generate contextual hint
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
          '       keep exploring. the truth is in the files.'
        ),
        createEntry('system', ''),
      ],
      stateChanges: {},
    };
  }

  const hintsRemaining = maxHints - hintsUsed - 1;

  // Build state changes
  const stateChanges: Partial<GameState> = {
    hintsUsed: hintsUsed + 1,
  };

  // Apply detection penalty if tutorial is complete (hidden from player)
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
      HINT_I18N_BY_TEXT[hint]
        ? createEntryI18n('ufo74', HINT_I18N_BY_TEXT[hint], `UFO74: ${hint}`)
        : createEntry('ufo74', `UFO74: ${hint}`),
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
