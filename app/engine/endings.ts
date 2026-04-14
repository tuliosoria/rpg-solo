// Multiple Endings System for Terminal 1996
//
// This system determines which of 8 possible endings the player gets,
// based on their discoveries and choices during the playthrough.
//
// Ending modifiers:
// - conspiracyFilesLeaked: Player chose to leak discovered conspiracy files
// - alphaReleased: Player found and released ALPHA (the surviving alien)
// - neuralLinkAuthenticated: Player connected to the alien neural link

import { GameState, TerminalEntry } from '../types';
import { translateStatic } from '../i18n';
import { generateEntryId } from './commands/utils';

// ═══════════════════════════════════════════════════════════════════════════
// ENDING TYPES
// ═══════════════════════════════════════════════════════════════════════════

export type EndingVariant =
  | 'controlled_disclosure'   // Clean leak, world debates
  | 'global_panic'            // Chaos, conspiracy files leaked
  | 'undeniable_confirmation' // ALPHA testimony
  | 'total_collapse'          // Everything + conspiracy files
  | 'personal_contamination'  // Clean leak but neural link used
  | 'paranoid_awakening'      // Chaos + neural contamination
  | 'witnessed_truth'         // Confirmation + alien in mind
  | 'complete_revelation';    // Everything exposed, player transformed

export interface EndingFlags {
  conspiracyFilesLeaked: boolean;
  alphaReleased: boolean;
  neuralLinkAuthenticated: boolean;
}

export interface EndingResult {
  variant: EndingVariant;
  title: string;
  flags: EndingFlags;
  worldAftermath: string[];
  personalAftermath?: string[];  // Only for neural link endings
  epilogue: string[];
}

// ═══════════════════════════════════════════════════════════════════════════
// ENDING DETERMINATION
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Determine which ending variant the player gets based on their flags
 */
export function determineEndingVariant(flags: EndingFlags): EndingVariant {
  const { conspiracyFilesLeaked, alphaReleased, neuralLinkAuthenticated } = flags;

  if (conspiracyFilesLeaked && alphaReleased && neuralLinkAuthenticated) {
    return 'complete_revelation';
  }
  if (!conspiracyFilesLeaked && alphaReleased && neuralLinkAuthenticated) {
    return 'witnessed_truth';
  }
  if (conspiracyFilesLeaked && !alphaReleased && neuralLinkAuthenticated) {
    return 'paranoid_awakening';
  }
  if (!conspiracyFilesLeaked && !alphaReleased && neuralLinkAuthenticated) {
    return 'personal_contamination';
  }
  if (conspiracyFilesLeaked && alphaReleased && !neuralLinkAuthenticated) {
    return 'total_collapse';
  }
  if (!conspiracyFilesLeaked && alphaReleased && !neuralLinkAuthenticated) {
    return 'undeniable_confirmation';
  }
  if (conspiracyFilesLeaked && !alphaReleased && !neuralLinkAuthenticated) {
    return 'global_panic';
  }
  return 'controlled_disclosure';
}

/**
 * Get the ending flags from the game state
 */
export function getEndingFlags(state: GameState): EndingFlags {
  return {
    conspiracyFilesLeaked: state.flags.conspiracyFilesLeaked === true,
    alphaReleased: state.flags.alphaReleased === true,
    neuralLinkAuthenticated: state.flags.neuralLinkAuthenticated === true,
  };
}

// ═══════════════════════════════════════════════════════════════════════════
// ENDING CONTENT
// ═══════════════════════════════════════════════════════════════════════════

const ENDING_DIVIDER = '═══════════════════════════════════════════════════════════';

interface EndingContentTemplate {
  title: string;
  narrative: string[];
  personalAftermath?: [string, ...string[]];
  epilogueSummary: string;
}

const ENDING_CONTENT_FALLBACKS: Record<EndingVariant, EndingContentTemplate> = {
  controlled_disclosure: {
    title: 'CONTROLLED DISCLOSURE',
    narrative: [
      'The leak burned bright for two weeks.',
      'Panels argued. Officials stalled.',
      'Then the feed drifted elsewhere.',
      '',
      'But the archive spread anyway.',
      'Copied. Mirrored. Waiting.',
      '',
      'The truth escaped. Belief did not.',
    ],
    epilogueSummary: 'You opened the vault. The world only glanced inside.',
  },
  global_panic: {
    title: 'GLOBAL PANIC',
    narrative: [
      'You leaked the black files too.',
      'Markets lurched. Cabinets fell.',
      'Every screen spawned a new paranoia.',
      '',
      'Truth hit too fast and turned to fire.',
      'By winter, panic had a flag.',
    ],
    epilogueSummary: 'Everything surfaced. Nothing stayed stable.',
  },
  undeniable_confirmation: {
    title: 'UNDENIABLE CONFIRMATION',
    narrative: [
      'ALPHA appeared live three days later.',
      'No panel could explain it away.',
      '"We observed. We prepared. You were never alone."',
      '',
      'Contact protocols formed within weeks.',
      'Humanity lost the right to pretend.',
    ],
    epilogueSummary: 'The witness spoke. Doubt broke.',
  },
  total_collapse: {
    title: 'TOTAL COLLAPSE',
    narrative: [
      'You gave them the witness and the hidden machinery behind it.',
      'Cities answered with riots, not wonder.',
      '',
      'The visitors watched humanity break on live television.',
      '"Not ready," they said, and stepped back into the dark.',
    ],
    epilogueSummary: 'Proof arrived with every secret at once. Humanity buckled.',
  },
  personal_contamination: {
    title: 'PERSONAL CONTAMINATION',
    narrative: [
      'The leak landed. Most people shrugged and kept moving.',
      'You should have felt relief.',
      '',
      'Instead the link stayed open.',
      'A second pulse lives just behind your own.',
    ],
    personalAftermath: [
      '▓▓▓ NEURAL ECHO DETECTED ▓▓▓',
      '...we kept the door ajar...',
      '...thirty rotations is not far...',
      '...when we return, you will know us...',
    ],
    epilogueSummary: 'The archive escaped the system. Something else escaped into you.',
  },
  paranoid_awakening: {
    title: 'PARANOID AWAKENING',
    narrative: [
      'The conspiracy files detonated. Institutions split at the seams.',
      'The link let you see the pattern inside the panic.',
      '',
      'You try to warn people.',
      'You sound insane. Maybe you are.',
    ],
    personalAftermath: [
      '▓▓▓ NEURAL CONTAMINATION ACTIVE ▓▓▓',
      '...you see the pattern now...',
      '...collapse is part of the signal...',
      '...clarity hurts, doesnt it...',
    ],
    epilogueSummary: 'You exposed the lie and swallowed its rhythm.',
  },
  witnessed_truth: {
    title: 'WITNESSED TRUTH',
    narrative: [
      'ALPHA spoke. Humanity believed.',
      'The link let you hear what the translator softened.',
      '',
      'The planet celebrated first contact.',
      'You heard the warning beneath it.',
    ],
    personalAftermath: [
      '▓▓▓ NEURAL RESONANCE ACTIVE ▓▓▓',
      '...you catch the meaning between meanings...',
      '...bridge and burden...',
      '...do not close your mind again...',
    ],
    epilogueSummary: 'The truth stood before the world. It stayed inside you.',
  },
  complete_revelation: {
    title: 'COMPLETE REVELATION',
    narrative: [
      'Everything surfaced at once.',
      'The witness spoke. The black files opened.',
      'The link made you the voice between species.',
      '',
      'The 2026 transition bent around your signal.',
      'History did not end. It changed shape.',
    ],
    personalAftermath: [
      '▓▓▓ FULL INTEGRATION ACHIEVED ▓▓▓',
      '...pattern accepted...',
      '...translator, host, ambassador...',
      '...welcome between worlds...',
    ],
    epilogueSummary: 'Every seal broke. You became the breach and the bridge.',
  },
};

function translateEndingBlock(key: string, fallbackLines: string[]): string[] {
  return translateStatic(key, undefined, fallbackLines.join('\n')).split('\n');
}

function getEndingTitleText(variant: EndingVariant): string {
  const fallback = ENDING_CONTENT_FALLBACKS[variant].title;
  return translateStatic(`engine.endings.${variant}.title`, undefined, fallback);
}

function buildEpilogue(summary: string, title: string): string[] {
  return [
    '',
    ENDING_DIVIDER,
    '',
    summary,
    '',
    '>> ENDING: ' + title + ' <<',
    '',
  ];
}

function buildNeuralAftermath(variant: EndingVariant, fallbackLines: [string, ...string[]]): string[] {
  const [header, ...lines] = translateEndingBlock(
    `engine.endings.${variant}.personalAftermath`,
    [...fallbackLines]
  );
  return [
    '',
    header,
    '',
    ...lines,
    '',
  ];
}

function getEndingContent(variant: EndingVariant): Omit<EndingResult, 'variant' | 'flags'> {
  const fallback = ENDING_CONTENT_FALLBACKS[variant];
  const title = getEndingTitleText(variant);
  const worldAftermath = translateEndingBlock(
    `engine.endings.${variant}.narrative`,
    fallback.narrative
  );
  const personalAftermath = fallback.personalAftermath
    ? buildNeuralAftermath(variant, fallback.personalAftermath)
    : undefined;

  return {
    title,
    worldAftermath,
    personalAftermath,
    epilogue: buildEpilogue(
      translateStatic(
        `engine.endings.${variant}.epilogueSummary`,
        undefined,
        fallback.epilogueSummary
      ),
      title
    ),
  };
}

// ═══════════════════════════════════════════════════════════════════════════
// ENDING GENERATION
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Generate the complete ending based on game state
 */
export function generateEnding(state: GameState): EndingResult {
  const flags = getEndingFlags(state);
  const variant = determineEndingVariant(flags);
  const content = getEndingContent(variant);

  return {
    variant,
    flags,
    ...content,
  };
}

export function getEndingNarrativeLines(variant: EndingVariant): string[] {
  const ending = getEndingContent(variant);
  return [
    ENDING_DIVIDER,
    '',
    ending.title,
    '',
    ENDING_DIVIDER,
    '',
    ...ending.worldAftermath,
    ...(ending.personalAftermath ?? []),
    ...ending.epilogue,
  ];
}

/**
 * Create terminal entries for the ending display
 */
export function createEndingEntries(ending: EndingResult): TerminalEntry[] {
  const entries: TerminalEntry[] = [];

  const createEntry = (type: TerminalEntry['type'], content: string): TerminalEntry => ({
    id: generateEntryId(),
    type,
    content,
    timestamp: Date.now(),
  });

  // World aftermath
  for (const line of ending.worldAftermath) {
    const type = line.startsWith('═') ? 'warning' 
               : line.includes('THE WORLD AFTER') ? 'notice'
               : 'output';
    entries.push(createEntry(type, line));
  }

  // Personal aftermath (neural link endings only)
  if (ending.personalAftermath) {
    for (const line of ending.personalAftermath) {
      const type = line.includes('▓▓▓') ? 'error'
                 : line.startsWith('...') ? 'warning'
                 : 'output';
      entries.push(createEntry(type, line));
    }
  }

  // Epilogue
  for (const line of ending.epilogue) {
    const type = line.startsWith('═') ? 'warning'
               : line.includes('>>') ? 'notice'
               : 'output';
    entries.push(createEntry(type, line));
  }

  return entries;
}

/**
 * Get the ending title for display
 */
export function getEndingTitle(variant: EndingVariant): string {
  return getEndingTitleText(variant);
}

/**
 * Check if the player has discovered any conspiracy files
 */
export function hasDiscoveredConspiracyFiles(state: GameState): boolean {
  return state.conspiracyFilesSeen.size > 0;
}
