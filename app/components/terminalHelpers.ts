/**
 * Pure utility helpers used by Terminal.tsx.
 * Extracted to reduce Terminal component file size.
 */

import { GameState, GamePhase, TerminalEntry } from '../types';
import { resolvePath } from '../engine/filesystem';
import { TutorialStateID } from '../engine/commands/interactiveTutorial';
import {
  AFFIRMATIVE_VIDEO_PROMPT_INPUTS,
  NEGATIVE_VIDEO_PROMPT_INPUTS,
  EVIDENCE_VIDEO_ATTACHMENTS,
  type EvidenceVideoAttachment,
} from './terminalConstants';

/** Normalize a yes/no video prompt choice to 'yes' | 'no' | null */
export function normalizeVideoPromptChoice(input: string): 'yes' | 'no' | null {
  const normalized = input.trim().toLowerCase();

  if (AFFIRMATIVE_VIDEO_PROMPT_INPUTS.has(normalized)) {
    return 'yes';
  }

  if (NEGATIVE_VIDEO_PROMPT_INPUTS.has(normalized)) {
    return 'no';
  }

  return null;
}

/** Resolve a file-reading command to its evidence video attachment, if any */
export const getEvidenceVideoAttachment = (
  commandInput: string,
  currentPath: string
): EvidenceVideoAttachment | null => {
  const match = /^(?:open|cat)\s+(\S+)/i.exec(commandInput.trim());
  if (!match) {
    return null;
  }

  const filePath = resolvePath(match[1].trim(), currentPath);
  return EVIDENCE_VIDEO_ATTACHMENTS[filePath] ?? null;
};

/** Derive the current game phase from state flags */
export const deriveGamePhase = (state: GameState): GamePhase => {
  if (state.endingType === 'bad') return 'bad_ending';
  if (state.endingType === 'neutral') return 'neutral_ending';
  if (state.gameWon || state.endingType === 'good') return 'victory';
  if (state.evidencesSaved) return 'victory';
  return 'terminal';
};

/** Check if an entry is a blank system spacer line */
export const isBlankSystemSpacer = (entry: TerminalEntry) =>
  entry.type === 'system' && entry.content.trim().length === 0;

/** Find the nearest non-spacer entry in a given direction */
export const getNearestNonSpacerEntry = (
  entries: readonly TerminalEntry[],
  startIndex: number,
  direction: -1 | 1
): TerminalEntry | undefined => {
  let index = startIndex + direction;

  while (index >= 0 && index < entries.length) {
    const candidate = entries[index];
    if (!isBlankSystemSpacer(candidate)) {
      return candidate;
    }
    index += direction;
  }

  return undefined;
};

/** Determine if a blank spacer near UFO74 messages should be suppressed */
export const shouldSuppressUfo74Spacer = (
  entry: TerminalEntry,
  index: number,
  entries: readonly TerminalEntry[]
) =>
  isBlankSystemSpacer(entry) &&
  (getNearestNonSpacerEntry(entries, index, -1)?.type === 'ufo74' ||
    getNearestNonSpacerEntry(entries, index, 1)?.type === 'ufo74');

/** Check if the pre-tutorial onboarding cards should be shown */
export function shouldShowOnboardingCards(state: GameState): boolean {
  return (
    !state.tutorialComplete &&
    state.tutorialStep === 0 &&
    state.interactiveTutorialState?.current === TutorialStateID.INTRO
  );
}
