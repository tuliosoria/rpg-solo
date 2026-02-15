// Hint System for Terminal 1996
// Provides cryptic, context-aware hints without revealing specific files or answers

import { GameState, TruthCategory, TRUTH_CATEGORIES, TerminalEntry } from '../types';
import { createEntry } from './commands/utils';

// Hint configuration
export const HINT_CONFIG = {
  maxHints: 4, // Limited hints per run
  detectionPenalty: 4, // +4 detection after tutorial (hidden from player)
};

// Truth category -> vague hint mapping
// These hints guide thinking, not actions
const TRUTH_HINTS: Record<TruthCategory, string[]> = {
  debris_relocation: [
    'Physical evidence was divided, not destroyed.',
    'The wreckage traveled to multiple destinations.',
    'Transport records hold clues about material distribution.',
    'Cargo moved in different directions that week.',
  ],
  being_containment: [
    'Not everything at the site was wreckage.',
    'Medical containment requires living subjects.',
    'Some recovery operations involved more than debris.',
    'Quarantine protocols suggest survivors.',
  ],
  telepathic_scouts: [
    'Communication happened without spoken words.',
    'Signal analysis revealed unusual patterns.',
    'The visitors were not explorers in the traditional sense.',
    'Neural activity preceded verbal contact.',
  ],
  international_actors: [
    'Brazil was not alone in the response.',
    'Diplomatic channels activated faster than expected.',
    'Foreign expertise arrived remarkably quickly.',
    'Coordination suggests prior agreements.',
  ],
  transition_2026: [
    'The timeline extends decades into the future.',
    'Thirty years is a significant interval.',
    'Some documents reference a convergence window.',
    'The end date is not when it ends—it begins.',
  ],
};

// Directory exploration hints
const DIRECTORY_HINTS: Record<string, string[]> = {
  '/storage/': [
    'Storage logs track more than inventory.',
    'Asset manifests reveal movement patterns.',
    'Physical evidence leaves paper trails.',
  ],
  '/comms/': [
    'Communication channels hold encrypted secrets.',
    'Not all intercepts are routine.',
    'Some signals defy conventional analysis.',
  ],
  '/ops/': [
    'Operations involved more than cleanup.',
    'Quarantine suggests something needed containing.',
    'Recovery teams had specialized equipment.',
  ],
  '/admin/': [
    'Administrative access reveals higher clearance docs.',
    'Internal memos speak more freely.',
    'Protocol documents reference unusual procedures.',
  ],
  '/internal/': [
    'Internal protocols define expected behaviors.',
    'Access credentials may be documented internally.',
    'Standard procedures sometimes hide exceptions.',
  ],
};

// General progress hints based on game state
const PROGRESS_HINTS = {
  noFilesRead: [
    'You have not examined any files yet.',
    'Knowledge requires investigation.',
    'The filesystem contains answers.',
  ],
  fewFilesRead: [
    'You have only scratched the surface.',
    'Many directories remain unexplored.',
    'Persistence reveals patterns.',
  ],
  noTruthsFound: [
    'Evidence exists, but you have not recognized it.',
    'The pieces are there. You must see the connections.',
    'Read deeper. Question what you read.',
  ],
  someTruthsFound: [
    'You are assembling the picture.',
    'Cross-reference what you have learned.',
    'Some truths illuminate others.',
  ],
  nearComplete: [
    'You are close to understanding.',
    'One or two pieces remain hidden.',
    'The full picture is almost visible.',
  ],
};

/**
 * Analyze player progress and generate a contextual hint.
 * Returns null if no relevant hint can be generated.
 */
export function analyzeProgressForHint(state: GameState): string | null {
  const filesRead = state.filesRead || new Set<string>();
  const truthsDiscovered = state.truthsDiscovered || new Set<string>();
  const filesReadCount = filesRead.size;
  const truthCount = truthsDiscovered.size;

  // Track which directories the player has explored
  const exploredDirs = {
    storage: false,
    comms: false,
    ops: false,
    admin: false,
    internal: false,
  };

  for (const filePath of filesRead) {
    if (filePath.includes('/storage/')) exploredDirs.storage = true;
    if (filePath.includes('/comms/')) exploredDirs.comms = true;
    if (filePath.includes('/ops/')) exploredDirs.ops = true;
    if (filePath.includes('/admin/')) exploredDirs.admin = true;
    if (filePath.includes('/internal/')) exploredDirs.internal = true;
  }

  // Priority 1: If player has read very few files
  if (filesReadCount < 3) {
    return pickRandom(PROGRESS_HINTS.noFilesRead);
  }

  // Priority 2: Guide toward unexplored directories that contain evidence
  // Only suggest directories relevant to truths not yet discovered
  const missingTruths = TRUTH_CATEGORIES.filter(t => !truthsDiscovered.has(t));

  // Map truths to directories
  const truthDirectories: Record<TruthCategory, string[]> = {
    debris_relocation: ['/storage/'],
    being_containment: ['/ops/', '/storage/'],
    telepathic_scouts: ['/comms/'],
    international_actors: ['/comms/', '/admin/'],
    transition_2026: ['/admin/', '/comms/'],
  };

  // Find unexplored directories that contain missing truths
  for (const truth of missingTruths) {
    const relevantDirs = truthDirectories[truth];
    for (const dir of relevantDirs) {
      const dirKey = dir.replace(/\//g, '') as keyof typeof exploredDirs;
      if (!exploredDirs[dirKey] && DIRECTORY_HINTS[dir]) {
        return pickRandom(DIRECTORY_HINTS[dir]);
      }
    }
  }

  // Priority 3: Hint about specific missing truths (vaguely)
  if (missingTruths.length > 0) {
    // Pick a random missing truth and give a vague hint
    const targetTruth = pickRandom(missingTruths);
    return pickRandom(TRUTH_HINTS[targetTruth]);
  }

  // Priority 4: Progress-based hints
  if (truthCount === 0) {
    return pickRandom(PROGRESS_HINTS.noTruthsFound);
  } else if (truthCount < 3) {
    return pickRandom(PROGRESS_HINTS.someTruthsFound);
  } else if (truthCount >= 4) {
    return pickRandom(PROGRESS_HINTS.nearComplete);
  }

  // Fallback: generic exploration hint
  if (filesReadCount < 10) {
    return pickRandom(PROGRESS_HINTS.fewFilesRead);
  }

  return null;
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
        createEntry('warning', '>>> HINT PROTOCOL: RESOURCE DEPLETED'),
        createEntry('ufo74', 'UFO74: no more hints. rely on your own analysis.'),
        createEntry('ufo74', '       you have enough to work with. READ the files.'),
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
        createEntry('warning', '>>> HINT PROTOCOL ACTIVATED'),
        createEntry('ufo74', 'UFO74: you seem to be making progress.'),
        createEntry('ufo74', '       keep exploring. the truth is in the files.'),
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
      createEntry('warning', '>>> HINT PROTOCOL ACTIVATED'),
      createEntry('system', ''),
      createEntry('ufo74', `UFO74: ${hint}`),
      createEntry('system', ''),
      createEntry('notice', `>>> ${hintsRemaining} HINT${hintsRemaining !== 1 ? 'S' : ''} REMAINING`),
      createEntry('system', ''),
    ],
    stateChanges,
  };
}

/**
 * Helper to pick a random element from an array.
 */
function pickRandom<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}
