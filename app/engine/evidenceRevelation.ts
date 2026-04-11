// Evidence Revelation System for Terminal 1996
//
// Simplified system: evidence is a simple counter (0-5).
// Every time the Kid avatar shows a scared reaction, one evidence is released.
// Finding 5 triggers the win condition.

import { GameState } from '../types';

/**
 * Keywords that indicate disturbing/frightening content
 * Files matching these trigger avatar reactions
 */
const WITNESS_ENCOUNTER_PATTERNS: RegExp[] = [
  /red\s+eyes/i,
  /ammonia(?:-like)?\s+odor/i,
  /temporary\s+paralysis/i,
  /feel(?:ing)?\s+(?:its|their)\s+thoughts/i,
  /three\s+(?:prominent\s+)?ridges(?:\s+on\s+cranium)?/i,
];

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
  ...WITNESS_ENCOUNTER_PATTERNS,
];

const VERY_DISTURBING_PATTERNS: RegExp[] = [
  /autopsy/i,
  /non[\s-]?human/i,
  /creature/i,
  /specimen.*expire/i,
  /terminate/i,
  /doom/i,
  /scream/i,
  /red\s+eyes/i,
  /ammonia(?:-like)?\s+odor/i,
  /temporary\s+paralysis/i,
  /feel(?:ing)?\s+(?:its|their)\s+thoughts/i,
];

/**
 * Check if file content is disturbing/frightening.
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
  const isVeryDisturbing = VERY_DISTURBING_PATTERNS.some(p => p.test(contentText));

  return isVeryDisturbing ? 'scared' : 'shocked';
}

// Evidence symbol for display
export const EVIDENCE_SYMBOL = '●';

/**
 * Count total evidence discovered.
 */
export function countEvidence(state: GameState): number {
  return state.evidenceCount || 0;
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
