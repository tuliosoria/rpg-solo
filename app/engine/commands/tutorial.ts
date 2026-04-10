// Tutorial and boot sequence messages for Terminal 1996

import { TerminalEntry } from '../../types';
import { createEntry } from './utils';

// Tutorial messages from UFO74 - shown one at a time
// Design: explicit early steps, diegetic, natural hacker briefing flow
export const TUTORIAL_MESSAGES: string[][] = [
  ['UFO74: youre in. stay quiet.'],
  ['UFO74: read-only. use "ls", "cd <folder>", and "open <file>".'],
  ['UFO74: start in internal/. dull files hide live wires.'],
  ['UFO74: the header tracks evidence. when it ticks, youre close.'],
  ['UFO74: dig too hard and they notice. fail a test, youre gone.'],
  ['UFO74: link dies here. trust the details.'],
  ['', 'Type "help" for commands. "help basics" if youre new.'],
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
    createEntry('ufo74', 'UFO74: new here? type "help basics".'),
    createEntry('system', ''),
  ];
}

// ═══════════════════════════════════════════════════════════════════════════
// INTERACTIVE TUTORIAL MODE - Opt-in tips during gameplay
// ═══════════════════════════════════════════════════════════════════════════

// Tutorial tip IDs
export type TutorialTipId = 'first_evidence';

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
  first_evidence: [
    'Evidence logged.',
    '',
    'Need 5 truths to leak.',
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
    createEntry('output', '  ls              List current folder'),
    createEntry('output', '  cd <dir>        Enter folder'),
    createEntry('output', '  cd ..           Move up one level'),
    createEntry('system', ''),
    createEntry('output', '  READING'),
    createEntry('output', '  open <file>     Read a file'),
    createEntry('output', '  last            Reopen last file'),
    createEntry('system', ''),
    createEntry('output', '  TRACKING'),
    createEntry('output', '  note <text>     Save a note'),
    createEntry('output', '  notes           Read saved notes'),
    createEntry('output', '  bookmark <file> Save file for later'),
    createEntry('system', ''),
    createEntry('output', '  STATUS'),
    createEntry('output', '  help            Show commands'),
    createEntry('system', ''),
  ];
}

export function getHelpEvidence(): TerminalEntry[] {
  return [
    createEntry('system', ''),
    createEntry('output', '═══════════════════════════════════════════════'),
    createEntry('output', '  E V I D E N C E   S Y S T E M'),
    createEntry('output', '═══════════════════════════════════════════════'),
    createEntry('system', ''),
    createEntry('output', '  OBJECTIVE'),
    createEntry('output', '  Build the 5 truths:'),
    createEntry('system', ''),
    createEntry('output', '  1. Debris Relocation'),
    createEntry('output', '  2. Being Containment'),
    createEntry('output', '  3. Telepathic Scouts'),
    createEntry('output', '  4. International Actors'),
    createEntry('output', '  5. Transition 2026'),
    createEntry('system', ''),
    createEntry('output', '  ─────────────────────────────────────────────'),
    createEntry('system', ''),
    createEntry('output', '  WORKFLOW'),
    createEntry('system', ''),
    createEntry('output', '  • Explore with ls and cd'),
    createEntry('output', '  • Read files with open'),
    createEntry('output', '  • Watch Alien Files in the header'),
    createEntry('system', ''),
    createEntry('output', '  ─────────────────────────────────────────────'),
    createEntry('system', ''),
    createEntry('output', '  TO WIN'),
    createEntry('system', ''),
    createEntry('output', '  • Reach 5/5 evidence'),
    createEntry('output', '  • Use "leak"'),
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
    createEntry('output', '  Expose 5 truths:'),
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
    createEntry('output', '  • Read for patterns, not noise'),
    createEntry('output', '  • Keep notes or bookmarks'),
    createEntry('output', '  • Stay below critical detection'),
    createEntry('system', ''),
    createEntry('output', '  ─────────────────────────────────────────────'),
    createEntry('system', ''),
    createEntry('output', '  FINAL STEP'),
    createEntry('system', ''),
    createEntry('output', '  • Run "leak" when the tracker hits 5/5'),
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

  for (let i = 0; i < messages.length; i++) {
    const msg = messages[i];

    if (msg.startsWith('UFO74:') || msg.startsWith('       ')) {
      entries.push(createEntry('ufo74', msg));
    } else {
      entries.push(createEntry('system', msg));
    }
  }

  // Add blank line after each step (enter prompt is now handled by UI)
  entries.push(createEntry('system', ''));

  return entries;
}
