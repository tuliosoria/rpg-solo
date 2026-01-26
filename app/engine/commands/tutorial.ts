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
    'UFO74: you also got a MEMORY indicator up there. thats how',
    '       much of the archive is still intact. corruption and',
    '       failed recoveries will eat away at it.',
  ],
  [
    'UFO74: the real stuff is in the encrypted files and in',
    '       hidden files. to see hidden files, we MUST override',
    '       the terminal.',
  ],
  ['UFO74: ill keep track of what you find. good luck hackerkid.'],
  ['>> CONNECTION IDLE <<', '', 'Type "help" for available commands.'],
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
      // Last message: first line is channel closed, rest are system
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
