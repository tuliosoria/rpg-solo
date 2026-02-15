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

const ENDING_CONTENT: Record<EndingVariant, Omit<EndingResult, 'variant' | 'flags'>> = {
  controlled_disclosure: {
    title: 'CONTROLLED DISCLOSURE',
    worldAftermath: [
      '',
      '═══════════════════════════════════════════════════════════',
      '',
      '                  THE WORLD AFTER',
      '',
      '═══════════════════════════════════════════════════════════',
      '',
      'The leak made headlines for two weeks.',
      '',
      'News anchors debated. Experts argued. Politicians deflected.',
      'Social media exploded with theories and counter-theories.',
      '',
      'The Brazilian government issued a statement:',
      '"Historical documents require context and verification."',
      '',
      'The American embassy declined to comment.',
      '',
      'By the third week, a celebrity scandal dominated the news.',
      'The Varginha files became "that thing from last month."',
      '',
      'But the files are still out there.',
      'Downloaded. Archived. Waiting.',
      '',
      'The truth was released. Whether humanity chooses to',
      'acknowledge it... that\'s another question entirely.',
      '',
    ],
    epilogue: [
      '═══════════════════════════════════════════════════════════',
      '',
      'The disclosure succeeded. The world debates.',
      'Some believe. Most dismiss. Time will tell.',
      '',
      '>> ENDING: CONTROLLED DISCLOSURE <<',
      '',
    ],
  },

  global_panic: {
    title: 'GLOBAL PANIC',
    worldAftermath: [
      '',
      '═══════════════════════════════════════════════════════════',
      '',
      '                  THE WORLD AFTER',
      '',
      '═══════════════════════════════════════════════════════════',
      '',
      'You leaked everything.',
      '',
      'Not just the Varginha files. The conspiracy documents.',
      'The economic memos. The surveillance programs.',
      'The weather manipulation. The behavioral experiments.',
      '',
      'The world didn\'t debate. It erupted.',
      '',
      'Governments fell within months. Brazil\'s administration',
      'collapsed under public outrage. The US faced its largest',
      'protests since the civil rights era.',
      '',
      'Markets crashed. Trust in institutions evaporated.',
      'Conspiracy theorists declared vindication.',
      'Paranoia became the new normal.',
      '',
      'The truth was too much, too fast.',
      '',
      'Six months later, martial law in twelve countries.',
      'The age of transparency became the age of chaos.',
      '',
    ],
    epilogue: [
      '═══════════════════════════════════════════════════════════',
      '',
      'You exposed everything. The world wasn\'t ready.',
      'Truth without wisdom is just another weapon.',
      '',
      '>> ENDING: GLOBAL PANIC <<',
      '',
    ],
  },

  undeniable_confirmation: {
    title: 'UNDENIABLE CONFIRMATION',
    worldAftermath: [
      '',
      '═══════════════════════════════════════════════════════════',
      '',
      '                  THE WORLD AFTER',
      '',
      '═══════════════════════════════════════════════════════════',
      '',
      'Prisoner 46 appeared on live television three days later.',
      '',
      'The surviving scout from Varginha. Freed from containment.',
      'Speaking through a neural translator to a stunned world.',
      '',
      'No debate. No denial. No conspiracy theories.',
      'The creature stood there, alive, undeniable.',
      '',
      '"We were sent to observe. To catalog. To prepare.',
      ' Your species is not alone. You never were."',
      '',
      'Governments could not deny what the world could see.',
      'The paradigm shifted in a single broadcast.',
      '',
      'Contact protocols were established within weeks.',
      'Humanity united around a single undeniable fact:',
      '',
      'We are not alone.',
      '',
    ],
    epilogue: [
      '═══════════════════════════════════════════════════════════',
      '',
      'Prisoner 46\'s testimony silenced all doubt.',
      'The universe opened. Humanity stepped forward.',
      '',
      '>> ENDING: UNDENIABLE CONFIRMATION <<',
      '',
    ],
  },

  total_collapse: {
    title: 'TOTAL COLLAPSE',
    worldAftermath: [
      '',
      '═══════════════════════════════════════════════════════════',
      '',
      '                  THE WORLD AFTER',
      '',
      '═══════════════════════════════════════════════════════════',
      '',
      'You gave them everything. And then you gave them more.',
      '',
      'The Varginha files. The living alien witness.',
      'The conspiracy documents. Every dark secret.',
      '',
      'It was too much.',
      '',
      'The alien testimony confirmed the worst fears.',
      'The conspiracy files proved every suspicion.',
      'Governments were not just hiding aliens — they were',
      'actively manipulating every aspect of human life.',
      '',
      'Society fractured along fault lines no one knew existed.',
      '',
      'The alien stood on television, speaking of preparation,',
      'while humans rioted in the streets behind it.',
      '',
      'Contact was made. But humanity was too broken to respond.',
      '',
      'The visitors withdrew. "Not ready," they said.',
      '"Perhaps another thirty rotations."',
      '',
    ],
    epilogue: [
      '═══════════════════════════════════════════════════════════',
      '',
      'Truth and proof and exposure, all at once.',
      'Humanity couldn\'t bear the weight.',
      '',
      '>> ENDING: TOTAL COLLAPSE <<',
      '',
    ],
  },

  personal_contamination: {
    title: 'PERSONAL CONTAMINATION',
    worldAftermath: [
      '',
      '═══════════════════════════════════════════════════════════',
      '',
      '                  THE WORLD AFTER',
      '',
      '═══════════════════════════════════════════════════════════',
      '',
      'The leak succeeded. The world debates.',
      '',
      'Some believe. Most dismiss. Business as usual.',
      'You should feel satisfied.',
      '',
      'But something is different now.',
      '',
      'You connected to it. The neural link. The consciousness.',
      'You felt thoughts that weren\'t yours.',
      'Concepts without words. Memories without context.',
      '',
      'Sometimes, in quiet moments, you hear it.',
      'A whisper at the edge of perception.',
      'Not malevolent. Not benevolent. Just... there.',
      '',
      'You released the truth to the world.',
      'But something else was released into you.',
      '',
    ],
    personalAftermath: [
      '',
      '▓▓▓ NEURAL ECHO DETECTED ▓▓▓',
      '',
      '...we see through you now...',
      '...your pattern is archived...',
      '...the harvest includes those who harvest...',
      '',
      '...you will remember this moment...',
      '...thirty rotations from now...',
      '...when we return...',
      '',
      '...you will recognize us...',
      '...because part of us...',
      '...lives in you now...',
      '',
    ],
    epilogue: [
      '═══════════════════════════════════════════════════════════',
      '',
      'The truth is out there. And now, so is something else.',
      'You carry a passenger. Forever.',
      '',
      '>> ENDING: PERSONAL CONTAMINATION <<',
      '',
    ],
  },

  paranoid_awakening: {
    title: 'PARANOID AWAKENING',
    worldAftermath: [
      '',
      '═══════════════════════════════════════════════════════════',
      '',
      '                  THE WORLD AFTER',
      '',
      '═══════════════════════════════════════════════════════════',
      '',
      'The conspiracy files detonated across the world.',
      'The Varginha evidence added fuel to the inferno.',
      '',
      'Chaos. Protests. Institutional collapse.',
      '',
      'And through it all, you feel... connected.',
      '',
      'The neural link changed you. The consciousness watches.',
      'As humanity tears itself apart, you perceive the pattern.',
      'The thirty-year cycles. The preparation. The harvest.',
      '',
      'They wanted this. You realize now.',
      'The chaos serves their purpose.',
      '',
      'You try to warn people. But who listens to warnings',
      'from someone who hears alien voices?',
      '',
      'You know too much. And what you know drives you mad.',
      '',
    ],
    personalAftermath: [
      '',
      '▓▓▓ NEURAL CONTAMINATION ACTIVE ▓▓▓',
      '',
      '...you see the pattern now...',
      '...the chaos is necessary...',
      '...old systems must fall...',
      '',
      '...you understand... but cannot explain...',
      '...they will call you insane...',
      '...but you see clearly now...',
      '',
      '...perhaps too clearly...',
      '',
    ],
    epilogue: [
      '═══════════════════════════════════════════════════════════',
      '',
      'You exposed the truth. You absorbed the consciousness.',
      'Now you see everything. And it\'s driving you mad.',
      '',
      '>> ENDING: PARANOID AWAKENING <<',
      '',
    ],
  },

  witnessed_truth: {
    title: 'WITNESSED TRUTH',
    worldAftermath: [
      '',
      '═══════════════════════════════════════════════════════════',
      '',
      '                  THE WORLD AFTER',
      '',
      '═══════════════════════════════════════════════════════════',
      '',
      'Prisoner 46 addressed the world.',
      'The evidence was undeniable.',
      'Contact was established.',
      '',
      'Humanity took its first steps into a larger universe.',
      '',
      'And you... you understand it differently.',
      '',
      'The neural link gave you context no one else has.',
      'When the alien speaks, you comprehend nuances',
      'that translators cannot capture.',
      '',
      'You know what "harvest" really means.',
      'You know what happens in thirty rotations.',
      'You know the scouts were not just observers.',
      '',
      'The world celebrates first contact.',
      'You alone carry the weight of full understanding.',
      '',
    ],
    personalAftermath: [
      '',
      '▓▓▓ NEURAL RESONANCE ACTIVE ▓▓▓',
      '',
      '...you alone understand...',
      '...the words they speak are simplified...',
      '...for minds that cannot yet perceive...',
      '',
      '...you are the bridge now...',
      '...between what they say...',
      '...and what they mean...',
      '',
      '...this is your burden...',
      '...and your gift...',
      '',
    ],
    epilogue: [
      '═══════════════════════════════════════════════════════════',
      '',
      'The truth stands before the world. And within you.',
      'You are humanity\'s first true ambassador.',
      '',
      '>> ENDING: WITNESSED TRUTH <<',
      '',
    ],
  },

  complete_revelation: {
    title: 'COMPLETE REVELATION',
    worldAftermath: [
      '',
      '═══════════════════════════════════════════════════════════',
      '',
      '                  THE WORLD AFTER',
      '',
      '═══════════════════════════════════════════════════════════',
      '',
      'Everything was revealed.',
      '',
      'The Varginha evidence. The living witness.',
      'The conspiracy documents. Every hidden truth.',
      '',
      'And you — connected to the consciousness that started it all.',
      '',
      'The world transformed overnight.',
      'Old institutions crumbled. New ones rose.',
      'Humanity faced its history, its present, its future.',
      '',
      'Prisoner 46 spoke publicly. The neural link translated.',
      'For the first time, a human understood them completely.',
      '',
      'You became the voice between worlds.',
      '',
      'The transition that was scheduled for 2026...',
      'You accelerated it. You broke the cycle.',
      'The harvest became something else entirely.',
      '',
      'A partnership. Negotiated through you.',
      '',
    ],
    personalAftermath: [
      '',
      '▓▓▓ FULL INTEGRATION ACHIEVED ▓▓▓',
      '',
      '...you are no longer only human...',
      '...our patterns merge with yours...',
      '...the bridge is permanent now...',
      '',
      '...you will live between worlds...',
      '...translator... ambassador... hybrid...',
      '',
      '...this was always your purpose...',
      '...hackerkid...',
      '',
      '...welcome to the collective...',
      '',
    ],
    epilogue: [
      '═══════════════════════════════════════════════════════════',
      '',
      'Everything exposed. Everything connected. Everything changed.',
      'You became more than human. The universe awaits.',
      '',
      '>> ENDING: COMPLETE REVELATION <<',
      '',
    ],
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
  return ENDING_CONTENT[variant].title;
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
