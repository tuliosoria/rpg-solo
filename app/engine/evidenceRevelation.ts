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
  const matchCount = DISTURBING_CONTENT_PATTERNS.filter(
    pattern => pattern.test(contentText)
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
  const potentialEvidences = analyzeFileEvidencePotential(
    filePath, 
    fileContent, 
    existingReveals
  );
  
  // If file is disturbing but has no potentials, assign at least one relevant evidence
  if (potentialEvidences.length === 0 && isDisturbingContent(fileContent)) {
    // Analyze which category is most relevant based on file path/name
    const pathLower = filePath.toLowerCase();
    
    if (pathLower.includes('medical') || pathLower.includes('quarantine') || pathLower.includes('autopsy')) {
      potentialEvidences.push('being_containment');
    } else if (pathLower.includes('comms') || pathLower.includes('signal') || pathLower.includes('neural')) {
      potentialEvidences.push('telepathic_scouts');
    } else if (pathLower.includes('transport') || pathLower.includes('storage') || pathLower.includes('logistics')) {
      potentialEvidences.push('debris_relocation');
    } else if (pathLower.includes('liaison') || pathLower.includes('diplomat') || pathLower.includes('foreign')) {
      potentialEvidences.push('international_actors');
    } else if (pathLower.includes('projection') || pathLower.includes('window') || pathLower.includes('2026')) {
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
// EVIDENCE TIERS SYSTEM
// ═══════════════════════════════════════════════════════════════════════════

import { EvidenceTier, EvidenceTierState, EVIDENCE_TIER_LABELS, EVIDENCE_TIER_SYMBOLS } from '../types';

// Re-export types for convenience
export type { EvidenceTier, EvidenceTierState } from '../types';
export { EVIDENCE_TIER_LABELS, EVIDENCE_TIER_SYMBOLS } from '../types';

/**
 * Get the current tier state for a truth category.
 * Returns existing state or creates a new FRAGMENT tier if evidence exists.
 */
export function getEvidenceTierState(
  category: TruthCategory,
  state: GameState
): EvidenceTierState | null {
  // Check if this category has been discovered
  if (!state.truthsDiscovered?.has(category)) {
    return null;
  }
  
  // Check if we have existing tier state
  const existingState = state.evidenceTiers?.[category];
  if (existingState) {
    return existingState;
  }
  
  // Create default FRAGMENT tier for newly discovered evidence
  // Find which files contributed to this evidence
  const linkedFiles: string[] = [];
  for (const [filePath, fileState] of Object.entries(state.fileEvidenceStates || {})) {
    if (fileState.revealedEvidences?.includes(category)) {
      linkedFiles.push(filePath);
    }
  }
  
  return {
    tier: 'fragment',
    linkedFiles,
  };
}

/**
 * Initialize or update tier state when evidence is first discovered.
 * Called when a file reveals new evidence.
 */
export function initializeEvidenceTier(
  category: TruthCategory,
  filePath: string,
  state: GameState
): EvidenceTierState {
  const existingState = state.evidenceTiers?.[category];
  
  if (existingState) {
    // Add file to linked files if not already present
    const linkedFiles = existingState.linkedFiles.includes(filePath)
      ? existingState.linkedFiles
      : [...existingState.linkedFiles, filePath];
    return { ...existingState, linkedFiles };
  }
  
  return {
    tier: 'fragment',
    linkedFiles: [filePath],
  };
}

/**
 * Result of attempting to upgrade evidence tier via correlate command.
 */
export interface TierUpgradeResult {
  success: boolean;
  category: TruthCategory | null;
  previousTier: EvidenceTier | null;
  newTier: EvidenceTier | null;
  updatedTierState: EvidenceTierState | null;
  message: string;
}

/**
 * Attempt to upgrade evidence from FRAGMENT to CORROBORATED.
 * Called when player uses correlate command on two files.
 * 
 * Returns upgrade result with success status and new tier state.
 */
export function attemptCorroborateUpgrade(
  file1Path: string,
  file2Path: string,
  state: GameState
): TierUpgradeResult {
  // Find which truth categories both files contribute to
  const file1State = state.fileEvidenceStates?.[file1Path];
  const file2State = state.fileEvidenceStates?.[file2Path];
  
  if (!file1State || !file2State) {
    return {
      success: false,
      category: null,
      previousTier: null,
      newTier: null,
      updatedTierState: null,
      message: 'Files have not revealed evidence yet.',
    };
  }
  
  // Find shared evidence categories
  const sharedCategories = file1State.revealedEvidences.filter(
    cat => file2State.revealedEvidences.includes(cat)
  );
  
  if (sharedCategories.length === 0) {
    return {
      success: false,
      category: null,
      previousTier: null,
      newTier: null,
      updatedTierState: null,
      message: 'These files do not share evidence categories.',
    };
  }
  
  // Try to upgrade the first shared category that is still at FRAGMENT
  for (const category of sharedCategories) {
    const tierState = getEvidenceTierState(category, state);
    
    if (tierState && tierState.tier === 'fragment') {
      // Upgrade to CORROBORATED
      const newTierState: EvidenceTierState = {
        tier: 'corroborated',
        linkedFiles: [...new Set([...tierState.linkedFiles, file1Path, file2Path])],
        corroboratingFiles: [file1Path, file2Path],
      };
      
      return {
        success: true,
        category,
        previousTier: 'fragment',
        newTier: 'corroborated',
        updatedTierState: newTierState,
        message: `Evidence upgraded: ${EVIDENCE_TIER_LABELS.fragment} → ${EVIDENCE_TIER_LABELS.corroborated}`,
      };
    }
  }
  
  // All shared categories already upgraded
  return {
    success: false,
    category: sharedCategories[0],
    previousTier: state.evidenceTiers?.[sharedCategories[0]]?.tier || 'fragment',
    newTier: null,
    updatedTierState: null,
    message: 'Evidence already corroborated or proven.',
  };
}

/**
 * Attempt to upgrade evidence from CORROBORATED to PROVEN.
 * Called when player uses connect command to build a chain of 3+ files.
 * 
 * Checks if adding this connection creates a chain of 3+ files
 * that all contribute to the same evidence category.
 */
export function attemptProvenUpgrade(
  file1Path: string,
  file2Path: string,
  existingLinks: Array<[string, string]>,
  state: GameState
): TierUpgradeResult {
  // Build a graph of all connections including the new one
  const allLinks = [...existingLinks, [file1Path, file2Path] as [string, string]];
  
  // For each truth category, find connected components
  for (const category of TRUTH_CATEGORIES) {
    if (!state.truthsDiscovered?.has(category)) continue;
    
    const tierState = state.evidenceTiers?.[category];
    if (!tierState || tierState.tier !== 'corroborated') continue;
    
    // Find all files that contribute to this category
    const categoryFiles = new Set<string>();
    for (const [filePath, fileState] of Object.entries(state.fileEvidenceStates || {})) {
      if (fileState.revealedEvidences?.includes(category)) {
        categoryFiles.add(filePath);
      }
    }
    
    // Build adjacency list for files in this category
    const adjacency = new Map<string, Set<string>>();
    for (const file of categoryFiles) {
      adjacency.set(file, new Set());
    }
    
    for (const [a, b] of allLinks) {
      if (categoryFiles.has(a) && categoryFiles.has(b)) {
        adjacency.get(a)?.add(b);
        adjacency.get(b)?.add(a);
      }
    }
    
    // Find the largest connected component
    const visited = new Set<string>();
    let largestComponent: string[] = [];
    
    for (const startFile of categoryFiles) {
      if (visited.has(startFile)) continue;
      
      const component: string[] = [];
      const stack = [startFile];
      
      while (stack.length > 0) {
        const file = stack.pop()!;
        if (visited.has(file)) continue;
        
        visited.add(file);
        component.push(file);
        
        const neighbors = adjacency.get(file) || new Set();
        for (const neighbor of neighbors) {
          if (!visited.has(neighbor)) {
            stack.push(neighbor);
          }
        }
      }
      
      if (component.length > largestComponent.length) {
        largestComponent = component;
      }
    }
    
    // If we have a chain of 3+ connected files, upgrade to PROVEN
    if (largestComponent.length >= 3) {
      const newTierState: EvidenceTierState = {
        tier: 'proven',
        linkedFiles: [...new Set([...tierState.linkedFiles, ...largestComponent])],
        corroboratingFiles: tierState.corroboratingFiles,
        proofChain: largestComponent,
      };
      
      return {
        success: true,
        category,
        previousTier: 'corroborated',
        newTier: 'proven',
        updatedTierState: newTierState,
        message: `Evidence upgraded: ${EVIDENCE_TIER_LABELS.corroborated} → ${EVIDENCE_TIER_LABELS.proven}`,
      };
    }
  }
  
  return {
    success: false,
    category: null,
    previousTier: null,
    newTier: null,
    updatedTierState: null,
    message: 'No evidence chain long enough for proof.',
  };
}

/**
 * Count evidence by tier for win condition evaluation.
 */
export function countEvidenceByTier(state: GameState): {
  fragments: number;
  corroborated: number;
  proven: number;
  total: number;
} {
  let fragments = 0;
  let corroborated = 0;
  let proven = 0;
  
  for (const category of TRUTH_CATEGORIES) {
    if (!state.truthsDiscovered?.has(category)) continue;
    
    const tierState = state.evidenceTiers?.[category];
    if (!tierState) {
      fragments++; // No tier state means it's a fragment
    } else {
      switch (tierState.tier) {
        case 'fragment':
          fragments++;
          break;
        case 'corroborated':
          corroborated++;
          break;
        case 'proven':
          proven++;
          break;
      }
    }
  }
  
  return {
    fragments,
    corroborated,
    proven,
    total: fragments + corroborated + proven,
  };
}

/**
 * Determine ending quality based on evidence tiers.
 * 
 * Win Conditions:
 * - 5 PROVEN → Best ending
 * - 3+ PROVEN → Good ending  
 * - 5 CORROBORATED → Neutral ending
 * - 5 FRAGMENTS only → Bad ending (dismissed as conspiracy theorist)
 */
export function determineEndingQuality(state: GameState): 'best' | 'good' | 'neutral' | 'bad' {
  const counts = countEvidenceByTier(state);
  
  if (counts.total < 5) {
    return 'bad'; // Not enough evidence
  }
  
  if (counts.proven >= 5) {
    return 'best';
  }
  
  if (counts.proven >= 3) {
    return 'good';
  }
  
  if (counts.corroborated + counts.proven >= 5) {
    return 'neutral';
  }
  
  return 'bad'; // Only fragments
}

/**
 * Get a human-readable description of the current case strength.
 */
export function getCaseStrengthDescription(state: GameState): string {
  const counts = countEvidenceByTier(state);
  const quality = determineEndingQuality(state);
  
  const descriptions: Record<'best' | 'good' | 'neutral' | 'bad', string> = {
    best: 'IRONCLAD - Undeniable proof established',
    good: 'STRONG - Compelling evidence chain',
    neutral: 'MODERATE - Corroborated but not proven',
    bad: 'WEAK - Only fragments, easily dismissed',
  };
  
  return descriptions[quality];
}

/**
 * Get evidence tier for a specific file based on which categories it contributes to.
 * Returns the highest tier among all categories the file contributes to.
 */
export function getFileTier(filePath: string, state: GameState): EvidenceTier | null {
  const fileState = state.fileEvidenceStates?.[filePath];
  if (!fileState || fileState.revealedEvidences.length === 0) {
    return null;
  }
  
  let highestTier: EvidenceTier | null = null;
  const tierPriority: Record<EvidenceTier, number> = {
    fragment: 1,
    corroborated: 2,
    proven: 3,
  };
  
  for (const category of fileState.revealedEvidences) {
    const tierState = state.evidenceTiers?.[category];
    const tier = tierState?.tier || 'fragment';
    
    if (!highestTier || tierPriority[tier] > tierPriority[highestTier]) {
      highestTier = tier;
    }
  }
  
  return highestTier;
}

/**
 * Get the tier symbol for display in ls command.
 */
export function getFileTierSymbol(filePath: string, state: GameState): string | null {
  const tier = getFileTier(filePath, state);
  if (!tier) return null;
  return EVIDENCE_TIER_SYMBOLS[tier];
}
