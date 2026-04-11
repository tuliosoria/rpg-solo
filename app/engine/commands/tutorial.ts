// Tutorial and boot sequence messages for Terminal 1996

import { TerminalEntry } from '../../types';
import { createEntry } from './utils';

// Tutorial messages from UFO74 - shown one at a time
// Design: explicit early steps, diegetic, natural hacker briefing flow
export const TUTORIAL_MESSAGES: string[][] = [
  ['UFO74: youre in. keep it quiet.'],
  ['UFO74: quick brief. you cant change anything here — read only.'],
  ['UFO74: type "ls" to see whats in front of you.'],
  ['UFO74: type "cd <folder>" to go inside. "open <file>" to read.'],
  ['UFO74: when this channel closes, start with: ls'],
  ['UFO74: try internal/ first. routine paperwork. low heat.'],
  ['UFO74: youll see an evidence tracker. it lights up when you prove something.'],
  ['UFO74: risk meter climbs as you dig. if it spikes, they test you. fail that, youre out.'],
  [
    'UFO74: im cutting the link. from here, youre on your own.',
    '       move slow. read everything. the truth is in the details.',
  ],
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
    'Evidence updated.',
    '',
    'Keep reading through the case files.',
    'Collect all 5 categories to win.',
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
    createEntry('output', "  open <file>     Read a file's contents"),
    createEntry('output', '  last            Re-read last opened file'),
    createEntry('system', ''),
    createEntry('output', '  TRACKING'),
    createEntry('output', '  note <text>     Save a personal note'),
    createEntry('output', '  notes           View all your notes'),
    createEntry('output', '  bookmark <file> Bookmark a file for later'),
    createEntry('system', ''),
    createEntry('output', '  STATUS'),
    createEntry('output', '  help            Show all commands'),
    createEntry('output', '  status          Check risk and session pressure'),
    createEntry('output', '  wait            Lower risk briefly (limited uses)'),
    createEntry('output', '  help recovery   Learn the emergency recovery options'),
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
    createEntry('output', '  Collect evidence in all 5 categories:'),
    createEntry('system', ''),
    createEntry('output', '  1. Debris Relocation'),
    createEntry('output', '  2. Being Containment'),
    createEntry('output', '  3. Telepathic Scouts'),
    createEntry('output', '  4. International Actors'),
    createEntry('output', '  5. Transition 2026'),
    createEntry('system', ''),
    createEntry('output', '  ─────────────────────────────────────────────'),
    createEntry('system', ''),
    createEntry('output', '  EVIDENCE WORKFLOW:'),
    createEntry('system', ''),
    createEntry('output', '  1. Navigate directories with ls, cd'),
    createEntry('output', '  2. Read files with open <filename>'),
    createEntry('output', '  3. Watch the header counter update'),
    createEntry('system', ''),
    createEntry('output', '  ─────────────────────────────────────────────'),
    createEntry('system', ''),
    createEntry('output', '  WINNING:'),
    createEntry('system', ''),
    createEntry('output', '  • Collect all 5 categories'),
    createEntry('output', '  • Use "leak" to transmit the evidence'),
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
    createEntry('output', '  Collect evidence in 5 categories:'),
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
    createEntry('output', '  • Use "note" to track important details'),
    createEntry('output', '  • Watch your detection level!'),
    createEntry('output', '  • If risk spikes, use "wait" to buy time'),
    createEntry('output', '  • At 90% risk, "hide" becomes a one-time escape'),
    createEntry('system', ''),
    createEntry('output', '  ─────────────────────────────────────────────'),
    createEntry('system', ''),
    createEntry('output', '  COMMANDS TO KNOW'),
    createEntry('system', ''),
    createEntry('output', '  note <text>      Save personal notes'),
    createEntry('output', '  bookmark <file>  Mark files for later'),
    createEntry('system', ''),
  ];
}

export function getHelpRecovery(): TerminalEntry[] {
  return [
    createEntry('system', ''),
    createEntry('output', '═══════════════════════════════════════════════'),
    createEntry('output', '  R E C O V E R Y   &   S T E A L T H'),
    createEntry('output', '═══════════════════════════════════════════════'),
    createEntry('system', ''),
    createEntry('output', '  wait'),
    createEntry('output', '    Lowers detection for a moment.'),
    createEntry('output', '    Limited to 3 uses per run.'),
    createEntry('system', ''),
    createEntry('output', '  hide'),
    createEntry('output', '    Unlocks automatically at 90% risk.'),
    createEntry('output', '    Gives you one emergency escape, but hurts stability.'),
    createEntry('system', ''),
    createEntry('output', '  status'),
    createEntry('output', '    Shows your current pressure and available recovery options.'),
    createEntry('system', ''),
    createEntry('output', '  RULE OF THUMB'),
    createEntry('output', '    If the tracker turns red, slow down and recover before digging deeper.'),
    createEntry('output', '    If the terminal replies too early, stop and wait it out.'),
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
