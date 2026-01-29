// Evidence Revelation System for Terminal 1996
//
// This system handles gradual evidence discovery based on file content.
// Key principles:
// 1. Each file may have multiple potential evidences, but reveals only ONE per read
// 2. Files track which evidences have been revealed from them
// 3. Disturbing/frightening files (triggering avatar reactions) guarantee at least one potential evidence
// 4. Revelation is deterministic per session (seeded RNG) for replayability variance
// 5. Evidence must be coherent with file narrative content

import { GameState, TruthCategory, TRUTH_CATEGORIES, FileEvidenceState } from '../types';
import { createSeededRng, seededRandomPick, seededShuffle } from './rng';

// Re-export FileEvidenceState for convenience
export type { FileEvidenceState } from '../types';

/**
 * Result of attempting to reveal evidence from a file
 */
export interface EvidenceRevelationResult {
  // The evidence that was revealed (null if none available)
  revealedEvidence: TruthCategory | null;
  // Whether this is a new revelation for the player's overall truth collection
  isNewTruth: boolean;
  // Updated file evidence state
  updatedFileState: FileEvidenceState;
  // Whether the file has more unrevealed potential evidences
  hasMoreEvidences: boolean;
  // Message describing the revelation context
  revelationContext?: string;
}

/**
 * Content keywords that suggest relevance to each truth category.
 * Files are analyzed for these patterns to determine potential evidences.
 */
const EVIDENCE_CONTENT_PATTERNS: Record<TruthCategory, RegExp[]> = {
  debris_relocation: [
    /debris/i,
    /material/i,
    /transport/i,
    /container/i,
    /relocat/i,
    /shipment/i,
    /specimen.*sample/i,
    /recovered/i,
    /wreckage/i,
    /fragment/i,
    /asset.*transfer/i,
    /logistics/i,
    /manifest/i,
    /cargo/i,
    /mileage.*classified/i,
  ],
  being_containment: [
    /biological/i,
    /subject/i,
    /specimen/i,
    /containment/i,
    /quarantine/i,
    /autopsy/i,
    /medical.*exam/i,
    /cold.*storage/i,
    /being/i,
    /creature/i,
    /entity/i,
    /vitals/i,
    /non[\s-]?human/i,
    /body|bodies/i,
  ],
  telepathic_scouts: [
    /telepat/i,
    /signal/i,
    /communica/i,
    /mental/i,
    /neural/i,
    /psych/i,
    /transmission/i,
    /eeg/i,
    /pattern/i,
    /scout/i,
    /reconnaissance/i,
    /emission/i,
    /thought/i,
  ],
  international_actors: [
    /foreign/i,
    /international/i,
    /embassy/i,
    /diplomat/i,
    /liaison/i,
    /multinational/i,
    /protocol.*echo/i,
    /agency|agencies/i,
    /nation/i,
    /coordination/i,
    /langley/i,
    /tel[\s]?aviv/i,
    /external.*actor/i,
  ],
  transition_2026: [
    /2026/i,
    /transition/i,
    /window/i,
    /timeline/i,
    /project/i,
    /disclosure/i,
    /activation/i,
    /convergence/i,
    /future/i,
    /impending/i,
    /countdown/i,
  ],
};

/**
 * Keywords that indicate disturbing/frightening content
 * Files matching these should trigger avatar reactions and guarantee evidence potential
 */
const DISTURBING_CONTENT_PATTERNS: RegExp[] = [
  /creature/i,
  /autopsy/i,
  /non[\s-]?human/i,
  /classified.*urgent/i,
  /beings?\s+contain/i,
  /specimen.*expire/i,
  /deus me livre/i, // Portuguese expression of shock
  /subject.*beta/i,
  /vitals.*declin/i,
  /transmission.*burst/i,
  /neural.*pattern/i,
  /eyes\s+only/i,
  /terminate/i,
  /countdown/i,
  /doom/i,
  /purge/i,
  /hostile/i,
  /scream/i,
  /panic/i,
  /horror/i,
  /terrif/i,
  /frighten/i,
];

/**
 * Analyze file content to determine which truth categories it can potentially reveal.
 * This ensures revelations are always coherent with what the file discusses.
 */
export function analyzeFileEvidencePotential(
  filePath: string,
  fileContent: string[],
  existingReveals?: TruthCategory[]
): TruthCategory[] {
  // Combine all content lines for analysis
  const contentText = fileContent.join(' ');

  // Find all matching truth categories based on content patterns
  const matchingCategories: TruthCategory[] = [];

  for (const category of TRUTH_CATEGORIES) {
    const patterns = EVIDENCE_CONTENT_PATTERNS[category];
    const matchCount = patterns.filter(pattern => pattern.test(contentText)).length;

    // Require at least 2 pattern matches for a potential evidence
    // This ensures the file genuinely discusses the topic
    if (matchCount >= 2) {
      matchingCategories.push(category);
    }
  }

  // If the file has explicit reveals defined, include those as potentials
  if (existingReveals) {
    for (const reveal of existingReveals) {
      if (TRUTH_CATEGORIES.includes(reveal) && !matchingCategories.includes(reveal)) {
        matchingCategories.push(reveal);
      }
    }
  }

  return matchingCategories;
}

/**
 * Check if file content is disturbing/frightening.
 * Disturbing files are guaranteed to have at least one potential evidence.
 */
export function isDisturbingContent(fileContent: string[]): boolean {
  const contentText = fileContent.join(' ');

  // Count how many disturbing patterns match
  const matchCount = DISTURBING_CONTENT_PATTERNS.filter(pattern =>
    pattern.test(contentText)
  ).length;

  // Consider disturbing if 2+ patterns match
  return matchCount >= 2;
}

/**
 * Get the current evidence state for a file.
 * Returns existing state or creates a new one based on file analysis.
 */
export function getFileEvidenceState(
  filePath: string,
  fileContent: string[],
  existingReveals: TruthCategory[] | undefined,
  state: GameState
): FileEvidenceState {
  // Check if we already have state for this file
  const existingState = state.fileEvidenceStates?.[filePath];

  if (existingState) {
    return existingState;
  }

  // Analyze file to determine potential evidences
  const potentialEvidences = analyzeFileEvidencePotential(filePath, fileContent, existingReveals);

  // If file is disturbing but has no potentials, assign at least one relevant evidence
  if (potentialEvidences.length === 0 && isDisturbingContent(fileContent)) {
    // Analyze which category is most relevant based on file path/name
    const pathLower = filePath.toLowerCase();

    if (
      pathLower.includes('medical') ||
      pathLower.includes('quarantine') ||
      pathLower.includes('autopsy')
    ) {
      potentialEvidences.push('being_containment');
    } else if (
      pathLower.includes('comms') ||
      pathLower.includes('signal') ||
      pathLower.includes('neural')
    ) {
      potentialEvidences.push('telepathic_scouts');
    } else if (
      pathLower.includes('transport') ||
      pathLower.includes('storage') ||
      pathLower.includes('logistics')
    ) {
      potentialEvidences.push('debris_relocation');
    } else if (
      pathLower.includes('liaison') ||
      pathLower.includes('diplomat') ||
      pathLower.includes('foreign')
    ) {
      potentialEvidences.push('international_actors');
    } else if (
      pathLower.includes('projection') ||
      pathLower.includes('window') ||
      pathLower.includes('2026')
    ) {
      potentialEvidences.push('transition_2026');
    } else {
      // Default: assign based on seeded random selection from all categories
      const rng = createSeededRng(state.seed + filePath.length);
      potentialEvidences.push(seededRandomPick(rng, [...TRUTH_CATEGORIES]));
    }
  }

  return {
    potentialEvidences,
    revealedEvidences: [],
  };
}

/**
 * Attempt to reveal ONE evidence from a file.
 *
 * Logic:
 * - If file has multiple potentials and none revealed yet: randomly reveal ONE eligible
 * - If player already revealed some from this file: reveal one remaining unrevealed
 * - If all evidences for this file are revealed: reveal nothing new
 * - Evidence must not already be in player's truthsDiscovered (no duplicates)
 */
export function attemptEvidenceRevelation(
  filePath: string,
  fileContent: string[],
  existingReveals: TruthCategory[] | undefined,
  state: GameState
): EvidenceRevelationResult {
  // Get current file evidence state
  const fileState = getFileEvidenceState(filePath, fileContent, existingReveals, state);

  // Find evidences that haven't been revealed from this file yet
  const unrevealedFromFile = fileState.potentialEvidences.filter(
    ev => !fileState.revealedEvidences.includes(ev)
  );

  // If no unrevealed potentials, nothing to reveal
  if (unrevealedFromFile.length === 0) {
    return {
      revealedEvidence: null,
      isNewTruth: false,
      updatedFileState: fileState,
      hasMoreEvidences: false,
      revelationContext: 'This file has already revealed all its secrets.',
    };
  }

  // Prioritize evidences the player hasn't discovered yet
  const playerTruths = state.truthsDiscovered || new Set<string>();
  const newToPlayer = unrevealedFromFile.filter(ev => !playerTruths.has(ev));

  // Use seeded RNG for deterministic selection
  // Include the file path hash and read count for variance
  const readCount = fileState.revealedEvidences.length;
  const pathHash = filePath.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  const rng = createSeededRng(state.seed + pathHash + readCount);

  // Shuffle candidates for randomness
  let candidates = newToPlayer.length > 0 ? newToPlayer : unrevealedFromFile;
  candidates = seededShuffle(rng, candidates);

  // Select ONE evidence to reveal
  const selectedEvidence = candidates[0];
  const isNewTruth = !playerTruths.has(selectedEvidence);

  // Update file evidence state
  const updatedFileState: FileEvidenceState = {
    ...fileState,
    revealedEvidences: [...fileState.revealedEvidences, selectedEvidence],
  };

  // Check if file has more evidences after this revelation
  const remainingAfterReveal = fileState.potentialEvidences.filter(
    ev => !updatedFileState.revealedEvidences.includes(ev)
  );

  // Generate context message based on revelation type
  let revelationContext = '';
  if (isNewTruth) {
    const contextMessages: Record<TruthCategory, string> = {
      debris_relocation: 'Physical evidence chain becomes clearer...',
      being_containment: 'The nature of the subjects becomes undeniable...',
      telepathic_scouts: 'The communication anomalies form a pattern...',
      international_actors: 'The scope of coordination reveals itself...',
      transition_2026: 'A convergent timeline emerges from the data...',
    };
    revelationContext = contextMessages[selectedEvidence];
  } else {
    revelationContext = 'Additional documentation confirms previous findings.';
  }

  return {
    revealedEvidence: selectedEvidence,
    isNewTruth,
    updatedFileState,
    hasMoreEvidences: remainingAfterReveal.length > 0,
    revelationContext,
  };
}

/**
 * Get a summary of evidence potential for a file without triggering revelation.
 * Useful for hinting at file importance.
 */
export function getEvidencePotentialSummary(
  filePath: string,
  fileContent: string[],
  existingReveals: TruthCategory[] | undefined,
  state: GameState
): { hasPotential: boolean; isDisturbing: boolean; unrevealedCount: number } {
  const fileState = getFileEvidenceState(filePath, fileContent, existingReveals, state);
  const isDisturbing = isDisturbingContent(fileContent);

  const unrevealedCount = fileState.potentialEvidences.filter(
    ev => !fileState.revealedEvidences.includes(ev)
  ).length;

  return {
    hasPotential: fileState.potentialEvidences.length > 0,
    isDisturbing,
    unrevealedCount,
  };
}

/**
 * Check if a file should trigger avatar expression based on content.
 * Returns suggested avatar expression or null.
 */
export function getDisturbingContentAvatarExpression(
  fileContent: string[]
): 'shocked' | 'scared' | null {
  if (!isDisturbingContent(fileContent)) {
    return null;
  }

  const contentText = fileContent.join(' ');

  // Very disturbing patterns that trigger 'scared'
  const veryDisturbingPatterns = [
    /autopsy/i,
    /non[\s-]?human/i,
    /creature/i,
    /specimen.*expire/i,
    /terminate/i,
    /doom/i,
    /scream/i,
  ];

  const isVeryDisturbing = veryDisturbingPatterns.some(p => p.test(contentText));

  return isVeryDisturbing ? 'scared' : 'shocked';
}

// ═══════════════════════════════════════════════════════════════════════════
// SIMPLIFIED EVIDENCE TRACKING
// Evidence is simply "discovered" when a file is read - no tiers needed
// ═══════════════════════════════════════════════════════════════════════════

import { EvidenceState } from '../types';

// Re-export type for convenience
export type { EvidenceState } from '../types';

// Evidence symbol for display
export const EVIDENCE_SYMBOL = '●';

/**
 * Get the current evidence state for a truth category.
 * Returns existing state or null if not discovered.
 */
export function getEvidenceState(category: TruthCategory, state: GameState): EvidenceState | null {
  // Check if this category has been discovered
  if (!state.truthsDiscovered?.has(category)) {
    return null;
  }

  // Check if we have existing state
  const existingState = state.evidenceStates?.[category];
  if (existingState) {
    return existingState;
  }

  // Build state from file evidence states
  const linkedFiles: string[] = [];
  for (const [filePath, fileState] of Object.entries(state.fileEvidenceStates || {})) {
    if (fileState.revealedEvidences?.includes(category)) {
      linkedFiles.push(filePath);
    }
  }

  return { linkedFiles };
}

/**
 * Initialize or update evidence state when evidence is discovered.
 * Called when a file reveals new evidence.
 */
export function initializeEvidence(
  category: TruthCategory,
  filePath: string,
  state: GameState
): EvidenceState {
  const existingState = state.evidenceStates?.[category];

  if (existingState) {
    // Add file to linked files if not already present
    const linkedFiles = existingState.linkedFiles.includes(filePath)
      ? existingState.linkedFiles
      : [...existingState.linkedFiles, filePath];
    return { linkedFiles };
  }

  return { linkedFiles: [filePath] };
}

/**
 * Count total evidence discovered.
 */
export function countEvidence(state: GameState): number {
  return state.truthsDiscovered?.size || 0;
}

/**
 * Get a human-readable description of the current case strength.
 */
export function getCaseStrengthDescription(state: GameState): string {
  const count = countEvidence(state);

  if (count >= 5) {
    return 'COMPLETE - All evidence documented';
  }
  if (count >= 4) {
    return 'STRONG - Nearly complete';
  }
  if (count >= 3) {
    return 'MODERATE - Building case';
  }
  if (count >= 1) {
    return 'DEVELOPING - Keep searching';
  }
  return 'NONE - No evidence yet';
}

/**
 * Check if a file has revealed evidence.
 */
export function fileHasEvidence(filePath: string, state: GameState): boolean {
  const fileState = state.fileEvidenceStates?.[filePath];
  return (fileState?.revealedEvidences?.length || 0) > 0;
}

/**
 * Get the evidence symbol for display in ls command.
 * Returns symbol if file has revealed evidence, null otherwise.
 */
export function getFileEvidenceSymbol(filePath: string, state: GameState): string | null {
  return fileHasEvidence(filePath, state) ? EVIDENCE_SYMBOL : null;
}
