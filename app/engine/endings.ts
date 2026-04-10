// Multiple Endings System for Terminal 1996
//
// This system determines which of 8 possible endings the player gets,
// based on their discoveries and choices during the playthrough.
//
// Ending modifiers:
// - conspiracyFilesLeaked: Player chose to leak discovered conspiracy files
// - prisoner46Released: Player found and released Prisoner 46 (the surviving alien)
// - neuralLinkAuthenticated: Player connected to the alien neural link

import { GameState, TerminalEntry } from '../types';

// ═══════════════════════════════════════════════════════════════════════════
// ENDING TYPES
// ═══════════════════════════════════════════════════════════════════════════

export type EndingVariant =
  | 'controlled_disclosure'   // Clean leak, world debates
  | 'global_panic'            // Chaos, conspiracy files leaked
  | 'undeniable_confirmation' // Prisoner 46 testimony
  | 'total_collapse'          // Everything + conspiracy files
  | 'personal_contamination'  // Clean leak but neural link used
  | 'paranoid_awakening'      // Chaos + neural contamination
  | 'witnessed_truth'         // Confirmation + alien in mind
  | 'complete_revelation';    // Everything exposed, player transformed

export interface EndingFlags {
  conspiracyFilesLeaked: boolean;
  prisoner46Released: boolean;
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
  const { conspiracyFilesLeaked, prisoner46Released, neuralLinkAuthenticated } = flags;

  if (conspiracyFilesLeaked && prisoner46Released && neuralLinkAuthenticated) {
    return 'complete_revelation';
  }
  if (!conspiracyFilesLeaked && prisoner46Released && neuralLinkAuthenticated) {
    return 'witnessed_truth';
  }
  if (conspiracyFilesLeaked && !prisoner46Released && neuralLinkAuthenticated) {
    return 'paranoid_awakening';
  }
  if (!conspiracyFilesLeaked && !prisoner46Released && neuralLinkAuthenticated) {
    return 'personal_contamination';
  }
  if (conspiracyFilesLeaked && prisoner46Released && !neuralLinkAuthenticated) {
    return 'total_collapse';
  }
  if (!conspiracyFilesLeaked && prisoner46Released && !neuralLinkAuthenticated) {
    return 'undeniable_confirmation';
  }
  if (conspiracyFilesLeaked && !prisoner46Released && !neuralLinkAuthenticated) {
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
    prisoner46Released: state.flags.prisoner46Released === true,
    neuralLinkAuthenticated: state.flags.neuralLinkAuthenticated === true,
  };
}

// ═══════════════════════════════════════════════════════════════════════════
// ENDING CONTENT
// ═══════════════════════════════════════════════════════════════════════════

const ENDING_DIVIDER = '═══════════════════════════════════════════════════════════';

const ENDING_TITLES: Record<EndingVariant, string> = {
  controlled_disclosure: 'CONTROLLED DISCLOSURE',
  global_panic: 'GLOBAL PANIC',
  undeniable_confirmation: 'UNDENIABLE CONFIRMATION',
  total_collapse: 'TOTAL COLLAPSE',
  personal_contamination: 'PERSONAL CONTAMINATION',
  paranoid_awakening: 'PARANOID AWAKENING',
  witnessed_truth: 'WITNESSED TRUTH',
  complete_revelation: 'COMPLETE REVELATION',
};

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

function buildNeuralAftermath(header: string, lines: string[]): string[] {
  return [
    '',
    header,
    '',
    ...lines,
    '',
  ];
}

const ENDING_CONTENT: Record<EndingVariant, Omit<EndingResult, 'variant' | 'flags'>> = {
  controlled_disclosure: {
    title: ENDING_TITLES.controlled_disclosure,
    worldAftermath: [
      'The leak burned bright for two weeks.',
      'Panels argued. Officials stalled.',
      'Then the feed drifted elsewhere.',
      '',
      'But the archive spread anyway.',
      'Copied. Mirrored. Waiting.',
      '',
      'The truth escaped. Belief did not.',
    ],
    epilogue: buildEpilogue(
      'You opened the vault. The world only glanced inside.',
      ENDING_TITLES.controlled_disclosure
    ),
  },

  global_panic: {
    title: ENDING_TITLES.global_panic,
    worldAftermath: [
      'You leaked the black files too.',
      'Markets lurched. Cabinets fell.',
      'Every screen spawned a new paranoia.',
      '',
      'Truth hit too fast and turned to fire.',
      'By winter, panic had a flag.',
    ],
    epilogue: buildEpilogue(
      'Everything surfaced. Nothing stayed stable.',
      ENDING_TITLES.global_panic
    ),
  },

  undeniable_confirmation: {
    title: ENDING_TITLES.undeniable_confirmation,
    worldAftermath: [
      'Prisoner 46 appeared live three days later.',
      'No panel could explain it away.',
      '"We observed. We prepared. You were never alone."',
      '',
      'Contact protocols formed within weeks.',
      'Humanity lost the right to pretend.',
    ],
    epilogue: buildEpilogue(
      'The witness spoke. Doubt broke.',
      ENDING_TITLES.undeniable_confirmation
    ),
  },

  total_collapse: {
    title: ENDING_TITLES.total_collapse,
    worldAftermath: [
      'You gave them the witness and the hidden machinery behind it.',
      'Cities answered with riots, not wonder.',
      '',
      'The visitors watched humanity break on live television.',
      '"Not ready," they said, and stepped back into the dark.',
    ],
    epilogue: buildEpilogue(
      'Proof arrived with every secret at once. Humanity buckled.',
      ENDING_TITLES.total_collapse
    ),
  },

  personal_contamination: {
    title: ENDING_TITLES.personal_contamination,
    worldAftermath: [
      'The leak landed. Most people shrugged and kept moving.',
      'You should have felt relief.',
      '',
      'Instead the link stayed open.',
      'A second pulse lives just behind your own.',
    ],
    personalAftermath: buildNeuralAftermath('▓▓▓ NEURAL ECHO DETECTED ▓▓▓', [
      '...we kept the door ajar...',
      '...thirty rotations is not far...',
      '...when we return, you will know us...',
    ]),
    epilogue: buildEpilogue(
      'The archive escaped the system. Something else escaped into you.',
      ENDING_TITLES.personal_contamination
    ),
  },

  paranoid_awakening: {
    title: ENDING_TITLES.paranoid_awakening,
    worldAftermath: [
      'The conspiracy files detonated. Institutions split at the seams.',
      'The link let you see the pattern inside the panic.',
      '',
      'You try to warn people.',
      'You sound insane. Maybe you are.',
    ],
    personalAftermath: buildNeuralAftermath('▓▓▓ NEURAL CONTAMINATION ACTIVE ▓▓▓', [
      '...you see the pattern now...',
      '...collapse is part of the signal...',
      '...clarity hurts, doesnt it...',
    ]),
    epilogue: buildEpilogue(
      'You exposed the lie and swallowed its rhythm.',
      ENDING_TITLES.paranoid_awakening
    ),
  },

  witnessed_truth: {
    title: ENDING_TITLES.witnessed_truth,
    worldAftermath: [
      'Prisoner 46 spoke. Humanity believed.',
      'The link let you hear what the translator softened.',
      '',
      'The planet celebrated first contact.',
      'You heard the warning beneath it.',
    ],
    personalAftermath: buildNeuralAftermath('▓▓▓ NEURAL RESONANCE ACTIVE ▓▓▓', [
      '...you catch the meaning between meanings...',
      '...bridge and burden...',
      '...do not close your mind again...',
    ]),
    epilogue: buildEpilogue(
      'The truth stood before the world. It stayed inside you.',
      ENDING_TITLES.witnessed_truth
    ),
  },

  complete_revelation: {
    title: ENDING_TITLES.complete_revelation,
    worldAftermath: [
      'Everything surfaced at once.',
      'The witness spoke. The black files opened.',
      'The link made you the voice between species.',
      '',
      'The 2026 transition bent around your signal.',
      'History did not end. It changed shape.',
    ],
    personalAftermath: buildNeuralAftermath('▓▓▓ FULL INTEGRATION ACHIEVED ▓▓▓', [
      '...pattern accepted...',
      '...translator, host, ambassador...',
      '...welcome between worlds...',
    ]),
    epilogue: buildEpilogue(
      'Every seal broke. You became the breach and the bridge.',
      ENDING_TITLES.complete_revelation
    ),
  },
};

// ═══════════════════════════════════════════════════════════════════════════
// ENDING GENERATION
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Generate the complete ending based on game state
 */
export function generateEnding(state: GameState): EndingResult {
  const flags = getEndingFlags(state);
  const variant = determineEndingVariant(flags);
  const content = ENDING_CONTENT[variant];

  return {
    variant,
    flags,
    ...content,
  };
}

export function getEndingNarrativeLines(variant: EndingVariant): string[] {
  const ending = ENDING_CONTENT[variant];
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
    id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
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
  return ENDING_TITLES[variant];
}

/**
 * Check if the player has discovered any conspiracy files
 */
export function hasDiscoveredConspiracyFiles(state: GameState): boolean {
  return state.conspiracyFilesSeen.size > 0;
}

/**
 * Get list of conspiracy files the player has seen
 */
export function getSeenConspiracyFiles(state: GameState): string[] {
  return Array.from(state.conspiracyFilesSeen);
}
