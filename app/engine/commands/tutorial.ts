// Tutorial and boot sequence messages for Terminal 1996

import { TerminalEntry } from '../../types';
import { createEntry } from './utils';

// Tutorial messages from UFO74 - shown one at a time
export const TUTORIAL_MESSAGES: string[][] = [
  [
    '┌─────────────────────────────────────────────────────────┐',
    '│ >> INCOMING TRANSMISSION << ENCRYPTED CHANNEL          │',
    '└─────────────────────────────────────────────────────────┘',
  ],
  ['UFO74: hey kid, youre in. nice work.'],
  ['UFO74: listen carefully. i dont have much time to explain.'],
  [
    'UFO74: this is a government archive. something happened in',
    '       varginha, brazil in january 1996. they buried it.',
  ],
  ['UFO74: i need you to find evidence of 5 things:'],
  [
    '       1. what they RECOVERED (debris, materials)',
    '       2. what they CAPTURED (beings, specimens)',
    '       3. how they COMMUNICATED (signals, telepathy)',
    '       4. who else was INVOLVED (other countries)',
    '       5. what happens NEXT (future dates, plans)',
  ],
  // Step 6: After showing the 5 things, trigger evidence tracker reveal
  ['       >> EVIDENCE TRACKER INITIALIZED <<'],
  [
    'UFO74: the files are scattered across directories.',
    '       use "ls" to see whats there, "cd" to move around,',
    '       and "open" to read files. some are encrypted.',
  ],
  ['UFO74: pro tip: press TAB to autocomplete commands and filenames.'],
  [
    'UFO74: be careful, the more you move around—the risk will',
    '       rise, and if it reaches the maximum, our connection',
    '       will end kid.',
  ],
  // Step 10: After showing risk warning, trigger risk bar reveal
  ['       >> RISK MONITOR ACTIVATED <<'],
  [
    'UFO74: you also got an ATT indicator up there. thats your',
    '       attempt counter. invalid commands and wrong passwords',
    '       will eat away at it. hit zero and youre locked out.',
  ],
  [
    'UFO74: the real stuff is in the encrypted files and in',
    '       hidden files. to see hidden files, we MUST override',
    '       the terminal.',
  ],
  ['UFO74: ill keep track of what you find. good luck hackerkid.'],
  ['>> CONNECTION IDLE <<', '', 'Type "help" for available commands.', '', 'UFO74: first time hacking a government server?', '       type "help basics" if you need guidance.', '       or just dive in. your call kid.'],
];

// Boot sequence for new game (without UFO74 tutorial)
export function generateBootSequence(): TerminalEntry[] {
  return [
    createEntry('system', ''),
    createEntry('system', '═══════════════════════════════════════════════════════════'),
    createEntry('system', 'BRAZILIAN INTELLIGENCE LEGACY SYSTEM'),
    createEntry('system', 'TERMINAL ACCESS POINT — NODE 7'),
    createEntry('system', '═══════════════════════════════════════════════════════════'),
    createEntry('system', ''),
    createEntry('system', 'SYSTEM DATE: JANUARY 1996'),
    createEntry('system', ''),
    createEntry('warning', 'WARNING: Unauthorized access detected'),
    createEntry('warning', 'WARNING: Session logging enabled'),
    createEntry('system', ''),
    createEntry('system', 'INCIDENT-RELATED ARCHIVE'),
    createEntry('warning', 'WARNING: Partial access may result in incomplete conclusions.'),
    createEntry('system', ''),
  ];
}

// ═══════════════════════════════════════════════════════════════════════════
// FIRST-RUN DETECTION - Gentle nudge for new players
// ═══════════════════════════════════════════════════════════════════════════

export function getFirstRunMessage(): TerminalEntry[] {
  return [
    createEntry('system', ''),
    createEntry('ufo74', 'UFO74: first time hacking a government server?'),
    createEntry('ufo74', '       type "help basics" if you need guidance.'),
    createEntry('ufo74', '       or just dive in. your call kid.'),
    createEntry('system', ''),
  ];
}

// ═══════════════════════════════════════════════════════════════════════════
// INTERACTIVE TUTORIAL MODE - Opt-in tips during gameplay
// ═══════════════════════════════════════════════════════════════════════════

// Tutorial tip IDs
export type TutorialTipId = 
  | 'first_fragment'
  | 'second_fragment_same_category'
  | 'first_correlate'
  | 'first_proven';

// Helper to create boxed tutorial tips
function createTutorialTipBox(lines: string[]): TerminalEntry[] {
  const width = 43;
  const entries: TerminalEntry[] = [
    createEntry('system', ''),
    createEntry('notice', '╔' + '═'.repeat(width) + '╗'),
    createEntry('notice', '║  💡 TUTORIAL TIP' + ' '.repeat(width - 17) + '║'),
  ];
  
  for (const line of lines) {
    const paddedLine = '  ' + line;
    const padding = Math.max(0, width - paddedLine.length);
    entries.push(createEntry('notice', '║' + paddedLine + ' '.repeat(padding) + '║'));
  }
  
  entries.push(createEntry('notice', '╚' + '═'.repeat(width) + '╝'));
  entries.push(createEntry('system', ''));
  
  return entries;
}

// Tutorial tips content
export const TUTORIAL_TIPS: Record<TutorialTipId, string[]> = {
  first_fragment: [
    'You found a FRAGMENT! But fragments',
    'alone won\'t win your case.',
    '',
    'Find another file about the same topic',
    'and use: correlate <file1> <file2>',
  ],
  second_fragment_same_category: [
    'Two fragments about the same thing!',
    'Now correlate them:',
    '',
    'correlate <file1> <file2>',
  ],
  first_correlate: [
    'CORROBORATED! Much stronger.',
    'To make it PROVEN (undeniable):',
    '',
    'Connect a 3rd related file with:',
    'connect <file1> <file3>',
    '',
    'Use "map" to see your evidence web.',
  ],
  first_proven: [
    'PROVEN! This evidence is undeniable.',
    '',
    'Build 5 proven chains to win.',
    'Use "progress" to track your case.',
    '',
    'Tutorial complete! Type "tutorial off"',
    'to disable tips, or keep them on.',
  ],
};

// Get a tutorial tip as formatted terminal entries
export function getTutorialTip(tipId: TutorialTipId): TerminalEntry[] {
  const lines = TUTORIAL_TIPS[tipId];
  if (!lines) return [];
  return createTutorialTipBox(lines);
}

// Check if a tutorial tip should be shown
export function shouldShowTutorialTip(
  tipId: TutorialTipId,
  tutorialMode: boolean,
  tipsShown: Set<string>
): boolean {
  if (!tutorialMode) return false;
  if (tipsShown.has(tipId)) return false;
  return true;
}

// ═══════════════════════════════════════════════════════════════════════════
// ENHANCED HELP COMMANDS - Detailed guides for new players
// ═══════════════════════════════════════════════════════════════════════════

export function getHelpBasics(): TerminalEntry[] {
  return [
    createEntry('system', ''),
    createEntry('output', '═══════════════════════════════════════════════'),
    createEntry('output', '  B A S I C S'),
    createEntry('output', '═══════════════════════════════════════════════'),
    createEntry('system', ''),
    createEntry('output', '  NAVIGATION'),
    createEntry('output', '  ls              List files in current directory'),
    createEntry('output', '  cd <dir>        Change directory'),
    createEntry('output', '  cd ..           Go back one level'),
    createEntry('system', ''),
    createEntry('output', '  READING'),
    createEntry('output', '  open <file>     Read a file\'s contents'),
    createEntry('output', '  last            Re-read last opened file'),
    createEntry('system', ''),
    createEntry('output', '  TRACKING'),
    createEntry('output', '  note <text>     Save a personal note'),
    createEntry('output', '  notes           View all your notes'),
    createEntry('output', '  bookmark <file> Bookmark a file for later'),
    createEntry('system', ''),
    createEntry('output', '  STATUS'),
    createEntry('output', '  progress        See your evidence status'),
    createEntry('output', '  map             Visualize evidence connections'),
    createEntry('output', '  help            Show all commands'),
    createEntry('system', ''),
  ];
}

export function getHelpEvidence(): TerminalEntry[] {
  return [
    createEntry('system', ''),
    createEntry('output', '═══════════════════════════════════════════════'),
    createEntry('output', '  E V I D E N C E   T I E R S'),
    createEntry('output', '═══════════════════════════════════════════════'),
    createEntry('system', ''),
    createEntry('output', '  [○] FRAGMENT'),
    createEntry('output', '      Found by reading a file.'),
    createEntry('output', '      Not enough to prove anything alone.'),
    createEntry('system', ''),
    createEntry('output', '  [◆] CORROBORATED'),
    createEntry('output', '      Two files linked via "correlate".'),
    createEntry('output', '      Stronger, but still deniable.'),
    createEntry('system', ''),
    createEntry('output', '  [●] PROVEN'),
    createEntry('output', '      Chain of 3+ connected files.'),
    createEntry('output', '      Undeniable evidence.'),
    createEntry('system', ''),
    createEntry('output', '  ─────────────────────────────────────────────'),
    createEntry('system', ''),
    createEntry('output', '  HOW TO BUILD YOUR CASE:'),
    createEntry('system', ''),
    createEntry('output', '  1. Read files, find fragments'),
    createEntry('output', '  2. Find two files about same topic'),
    createEntry('output', '  3. Use: correlate <file1> <file2>'),
    createEntry('output', '  4. Connect a 3rd file to prove it'),
    createEntry('output', '  5. Repeat for all 5 evidence categories'),
    createEntry('system', ''),
    createEntry('output', '  ─────────────────────────────────────────────'),
    createEntry('system', ''),
    createEntry('output', '  ENDINGS (based on evidence quality):'),
    createEntry('system', ''),
    createEntry('output', '  • 5 PROVEN    → Best ending (full exposure)'),
    createEntry('output', '  • 3+ PROVEN   → Good ending (partial win)'),
    createEntry('output', '  • 5 CORROBORATED → Neutral ending'),
    createEntry('output', '  • 5 FRAGMENTS → Bad ending (dismissed)'),
    createEntry('system', ''),
  ];
}

export function getHelpWinning(): TerminalEntry[] {
  return [
    createEntry('system', ''),
    createEntry('output', '═══════════════════════════════════════════════'),
    createEntry('output', '  H O W   T O   W I N'),
    createEntry('output', '═══════════════════════════════════════════════'),
    createEntry('system', ''),
    createEntry('output', '  OBJECTIVE'),
    createEntry('output', '  Prove 5 truths about the Varginha incident:'),
    createEntry('system', ''),
    createEntry('output', '  1. Debris Relocation'),
    createEntry('output', '  2. Being Containment'),
    createEntry('output', '  3. Telepathic Scouts'),
    createEntry('output', '  4. International Actors'),
    createEntry('output', '  5. Transition 2026'),
    createEntry('system', ''),
    createEntry('output', '  ─────────────────────────────────────────────'),
    createEntry('system', ''),
    createEntry('output', '  STRATEGY'),
    createEntry('system', ''),
    createEntry('output', '  • Read carefully - evidence is in the details'),
    createEntry('output', '  • Use "note" to track important findings'),
    createEntry('output', '  • Correlate related files to strengthen evidence'),
    createEntry('output', '  • Connect 3+ files to PROVE each truth'),
    createEntry('output', '  • Watch your detection level!'),
    createEntry('system', ''),
    createEntry('output', '  ─────────────────────────────────────────────'),
    createEntry('system', ''),
    createEntry('output', '  COMMANDS TO KNOW'),
    createEntry('system', ''),
    createEntry('output', '  correlate <f1> <f2>  Link related evidence'),
    createEntry('output', '  connect <f1> <f2>    Build proof chains'),
    createEntry('output', '  progress             Check your case status'),
    createEntry('output', '  map                  Visualize connections'),
    createEntry('system', ''),
  ];
}

// Convert tutorial message to entries
export function getTutorialMessage(step: number): TerminalEntry[] {
  if (step < 0 || step >= TUTORIAL_MESSAGES.length) {
    return [];
  }

  const messages = TUTORIAL_MESSAGES[step];
  const entries: TerminalEntry[] = [createEntry('system', '')];

  const isLastStep = step === TUTORIAL_MESSAGES.length - 1;
  const isFirstStep = step === 0;

  // First step shows channel open header
  if (isFirstStep) {
    entries.push(
      createEntry('ufo74', '┌─────────────────────────────────────────────────────────┐')
    );
    entries.push(
      createEntry('ufo74', '│         >> ENCRYPTED CHANNEL OPEN <<                    │')
    );
    entries.push(
      createEntry('ufo74', '└─────────────────────────────────────────────────────────┘')
    );
    entries.push(createEntry('system', ''));
  }

  for (let i = 0; i < messages.length; i++) {
    const msg = messages[i];

    if (isFirstStep) {
      // Skip the original header lines (they're replaced above)
      continue;
    } else if (step === 6 || step === 9) {
      // Tracker reveal messages - styled as notices
      entries.push(createEntry('notice', msg));
    } else if (isLastStep) {
      // Last message: first line is channel closed, then system/ufo74 messages
      if (i === 0) {
        entries.push(
          createEntry('ufo74', '┌─────────────────────────────────────────────────────────┐')
        );
        entries.push(
          createEntry('ufo74', '│         >> ENCRYPTED CHANNEL CLOSED <<                  │')
        );
        entries.push(
          createEntry('ufo74', '└─────────────────────────────────────────────────────────┘')
        );
        entries.push(createEntry('system', ''));
        entries.push(createEntry('system', msg));
      } else if (msg.startsWith('UFO74:') || msg.startsWith('       ')) {
        // First-run nudge from UFO74
        entries.push(createEntry('ufo74', msg));
      } else {
        entries.push(createEntry('system', msg));
      }
    } else {
      // All other UFO74 messages use ufo74 type for consistent light blue styling
      entries.push(createEntry('ufo74', msg));
    }
  }

  // Add "press enter" hint except for the last message
  if (!isLastStep) {
    entries.push(createEntry('system', ''));
    entries.push(createEntry('system', '                    [ press ENTER to continue ]'));
  } else {
    entries.push(createEntry('system', ''));
  }

  return entries;
}
