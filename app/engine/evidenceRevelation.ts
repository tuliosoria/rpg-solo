// Evidence Revelation System for Terminal 1996
//
// Evidence is now a simple file counter: the first time the player opens an
// evidence file, it counts as one piece of evidence. Disturbing files can
// still drive avatar reactions independently from evidence counting.

import { FILESYSTEM_ROOT } from '../data/filesystem';
import { FileNode, FileSystemNode, GameState } from '../types';

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

export const MAX_EVIDENCE_COUNT = 10;

function getStaticNode(path: string): FileSystemNode | null {
  const segments = path.split('/').filter(Boolean);
  let current: FileSystemNode = FILESYSTEM_ROOT;

  for (const segment of segments) {
    if (current.type !== 'dir') return null;
    const child: FileSystemNode | undefined = current.children[segment];
    if (!child) return null;
    current = child;
  }

  return current;
}

export function isEvidenceFile(file: Pick<FileNode, 'isEvidence'>): boolean {
  return file.isEvidence === true;
}

export function isEvidencePath(path: string): boolean {
  const node = getStaticNode(path);
  return !!node && node.type === 'file' && isEvidenceFile(node as FileNode);
}

export function getDiscoveredEvidenceFiles(paths: Iterable<string>): Set<string> {
  const discovered = new Set<string>();

  for (const path of paths) {
    if (isEvidencePath(path)) {
      discovered.add(path);
    }
  }

  return discovered;
}

/**
 * Check if file content is disturbing/frightening.
 */
export function isDisturbingContent(fileContent: string[]): boolean {
  const contentText = fileContent.join(' ');

  // Count how many disturbing patterns match
  const matchCount = DISTURBING_CONTENT_PATTERNS.filter(pattern => pattern.test(contentText)).length;

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
  const storedCount = Math.max(0, state.evidenceCount || 0);
  const discoveredCount = getDiscoveredEvidenceFiles(state.filesRead || []).size;
  return Math.min(MAX_EVIDENCE_COUNT, Math.max(storedCount, discoveredCount));
}

/**
 * Get a human-readable description of the current case strength.
 */
export function getCaseStrengthDescription(state: GameState): string {
  const count = countEvidence(state);

  if (count >= MAX_EVIDENCE_COUNT) {
    return 'COMPLETE - Leak ready';
  }
  if (count >= 8) {
    return 'STRONG - Nearly ready';
  }
  if (count >= 5) {
    return 'MODERATE - Building case';
  }
  if (count >= 1) {
    return 'DEVELOPING - Keep searching';
  }
  return 'NONE - No evidence yet';
}
