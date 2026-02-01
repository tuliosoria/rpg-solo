// Interactive Tutorial System for Terminal 1996
// Based on SHODAN-tutorial-spec.md
// Implements gated input system where UFO74 guides player through commands

import { TerminalEntry, GameState, CommandResult, TutorialStateID, InteractiveTutorialState } from '../../types';
import { createEntry } from './utils';

// Re-export types for convenience
export { TutorialStateID };
export type { InteractiveTutorialState };

// ═══════════════════════════════════════════════════════════════════════════
// INITIAL STATE
// ═══════════════════════════════════════════════════════════════════════════

export const INITIAL_TUTORIAL_STATE: InteractiveTutorialState = {
  current: TutorialStateID.INTRO,
  failCount: 0,
  nudgeShown: false,
  inputLocked: true, // Starts locked during INTRO
  dialogueComplete: false,
};

// ═══════════════════════════════════════════════════════════════════════════
// TUTORIAL DIALOGUE SCRIPTS
// ═══════════════════════════════════════════════════════════════════════════

export const TUTORIAL_DIALOGUE: Partial<Record<TutorialStateID, string[]>> = {
  [TutorialStateID.INTRO]: [
    '[UFO74]: Connection established.',
    "[UFO74]: Listen carefully. I don't repeat myself.",
    "[UFO74]: You're inside their system. Don't panic.",
    "[UFO74]: I'll walk you through the basics.",
  ],
  [TutorialStateID.LS_PROMPT]: [
    "[UFO74]: First, see what's here.",
    '[UFO74]: Type ls',
  ],
  [TutorialStateID.CD_PROMPT]: [
    '[UFO74]: Good.',
    '[UFO74]: Now move into a folder.',
    '[UFO74]: Type cd files',
  ],
  [TutorialStateID.OPEN_PROMPT]: [
    "[UFO74]: Two files. Neither matters, but let's look anyway.",
    '[UFO74]: Type open cafeteria_menu',
    '[UFO74]: Or type open c and press TAB to autocomplete.',
  ],
  [TutorialStateID.FILE_DISPLAY]: [
    '[UFO74]: Riveting.',
    '[UFO74]: Not everything you find will matter.',
    '[UFO74]: Learn to recognize what does.',
  ],
  [TutorialStateID.CD_BACK_PROMPT]: [
    '[UFO74]: Now go back up.',
    '[UFO74]: Type cd ..',
  ],
  [TutorialStateID.LS_REINFORCE]: [
    '[UFO74]: Check where you are.',
    '[UFO74]: Run ls again.',
  ],
  [TutorialStateID.TUTORIAL_END]: [
    '[UFO74]: Good. You know enough.',
    '[UFO74]: Now the real thing.',
    '',
    '[UFO74]: Your mission: find 5 pieces of evidence.',
    '[UFO74]: Once you have them, leak everything.',
    '',
    '[UFO74]: But understand the risks.',
    '[UFO74]: Every action you take... they might notice.',
    "[UFO74]: Detection hits 100%, you're done. They'll find you.",
    '',
    '[UFO74]: And you only get 8 attempts.',
    '[UFO74]: Fail 8 times, the window closes. Permanently.',
    '',
    '[UFO74]: Some files are bait. Opening them spikes detection.',
    '[UFO74]: Some actions are loud. Others are quiet.',
    '[UFO74]: Curiosity has a cost here.',
    '',
    "[UFO74]: I've done what I can.",
    '[UFO74]: Good luck, kid.',
    '',
    '[UFO74]: ...',
    '',
    '[UFO74 has disconnected]',
  ],
};

export const TUTORIAL_NUDGES: Record<TutorialStateID, string | null> = {
  [TutorialStateID.INTRO]: null,
  [TutorialStateID.LS_PROMPT]: '[UFO74]: Two letters. Lowercase. ls',
  [TutorialStateID.CD_PROMPT]: '[UFO74]: cd means change directory. cd files',
  [TutorialStateID.OPEN_PROMPT]: '[UFO74]: open followed by the filename. Try the tab key.',
  [TutorialStateID.FILE_DISPLAY]: null,
  [TutorialStateID.CD_BACK_PROMPT]: '[UFO74]: Two dots. cd space dot dot.',
  [TutorialStateID.LS_REINFORCE]: '[UFO74]: Same command as before. ls',
  [TutorialStateID.TUTORIAL_END]: null,
  [TutorialStateID.GAME_ACTIVE]: null,
};

// ═══════════════════════════════════════════════════════════════════════════
// TUTORIAL FILESYSTEM (Sandbox)
// ═══════════════════════════════════════════════════════════════════════════

export const TUTORIAL_ROOT_LISTING = [
  '/',
  '├── files/',
  '├── logs/',
  '├── system/',
  '└── admin/',
];

export const TUTORIAL_FILES_LISTING = [
  '/files',
  '├── cafeteria_menu',
  '└── shift_schedule',
];

export const CAFETERIA_MENU_CONTENT = [
  '┌─────────────────────────────────────┐',
  '│  CAFETERIA MENU - WEEK 42          │',
  '├─────────────────────────────────────┤',
  '│  MON: Salisbury steak, mashed pot. │',
  '│  TUE: Fish sticks, coleslaw        │',
  '│  WED: Chicken fried rice           │',
  '│  THU: Beef tacos                   │',
  '│  FRI: Pizza day                    │',
  '├─────────────────────────────────────┤',
  '│  * Vegan options available daily   │',
  '└─────────────────────────────────────┘',
];

// ═══════════════════════════════════════════════════════════════════════════
// INPUT VALIDATION
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Normalize input for comparison: trim, lowercase, collapse multiple spaces
 */
function normalizeInput(input: string): string {
  return input.trim().toLowerCase().replace(/\s+/g, ' ');
}

/**
 * Validate input for the current tutorial state
 */
export function validateTutorialInput(
  input: string,
  state: TutorialStateID,
  tabPressed: boolean = false
): boolean {
  const normalized = normalizeInput(input);

  switch (state) {
    case TutorialStateID.LS_PROMPT:
    case TutorialStateID.LS_REINFORCE:
      return normalized === 'ls';

    case TutorialStateID.CD_PROMPT:
      return /^cd\s+files$/.test(normalized);

    case TutorialStateID.OPEN_PROMPT:
      // Full command
      if (/^open\s+cafeteria_menu$/.test(normalized)) return true;
      // Autocomplete: open c + TAB
      if (tabPressed && /^open\s+c/.test(normalized)) {
        const prefix = normalized.replace(/^open\s+/, '');
        return 'cafeteria_menu'.startsWith(prefix);
      }
      return false;

    case TutorialStateID.CD_BACK_PROMPT:
      return /^cd\s+\.\.$/.test(normalized);

    default:
      return false;
  }
}

/**
 * Get autocomplete suggestion for current tutorial state
 */
export function getTutorialAutocomplete(
  input: string,
  state: TutorialStateID
): string | null {
  const normalized = normalizeInput(input);

  if (state === TutorialStateID.OPEN_PROMPT) {
    if (/^open\s+c/.test(normalized)) {
      const prefix = normalized.replace(/^open\s+/, '');
      if ('cafeteria_menu'.startsWith(prefix)) {
        return 'open cafeteria_menu';
      }
    }
  }

  return null;
}

// ═══════════════════════════════════════════════════════════════════════════
// TUTORIAL STATE MACHINE LOGIC
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Check if tutorial is in an input-accepting state
 */
export function isTutorialInputState(state: TutorialStateID): boolean {
  return [
    TutorialStateID.LS_PROMPT,
    TutorialStateID.CD_PROMPT,
    TutorialStateID.OPEN_PROMPT,
    TutorialStateID.CD_BACK_PROMPT,
    TutorialStateID.LS_REINFORCE,
  ].includes(state);
}

/**
 * Check if game is still in tutorial mode
 * Returns false if:
 * - No interactive tutorial state exists
 * - Tutorial is complete (tutorialComplete flag)
 * - Tutorial state is GAME_ACTIVE
 */
export function isInTutorialMode(state: GameState): boolean {
  // If tutorialComplete is set, we're past the tutorial
  if (state.tutorialComplete) return false;
  
  const tutorialState = state.interactiveTutorialState;
  if (!tutorialState) return false;
  return tutorialState.current !== TutorialStateID.GAME_ACTIVE;
}

/**
 * Generate initial tutorial INTRO dialogue
 */
export function generateIntroDialogue(): TerminalEntry[] {
  const entries: TerminalEntry[] = [
    createEntry('system', ''),
    createEntry('ufo74', '┌─────────────────────────────────────────────────────────┐'),
    createEntry('ufo74', '│         >> ENCRYPTED CHANNEL OPEN <<                    │'),
    createEntry('ufo74', '└─────────────────────────────────────────────────────────┘'),
    createEntry('system', ''),
  ];

  const introDialogue = TUTORIAL_DIALOGUE[TutorialStateID.INTRO] ?? [];
  for (const line of introDialogue) {
    entries.push(createEntry('ufo74', line));
  }

  entries.push(createEntry('system', ''));

  return entries;
}

/**
 * Generate dialogue for a tutorial state
 */
export function generateStateDialogue(state: TutorialStateID): TerminalEntry[] {
  const dialogue = TUTORIAL_DIALOGUE[state];
  if (!dialogue) return [];

  const entries: TerminalEntry[] = [createEntry('system', '')];

  for (const line of dialogue) {
    if (line === '') {
      entries.push(createEntry('system', ''));
    } else if (line.startsWith('[UFO74]')) {
      entries.push(createEntry('ufo74', line));
    } else {
      entries.push(createEntry('system', line));
    }
  }

  entries.push(createEntry('system', ''));

  return entries;
}

/**
 * Process tutorial input and return result
 */
export function processTutorialInput(
  input: string,
  gameState: GameState,
  tabPressed: boolean = false
): CommandResult {
  const tutorialState = gameState.interactiveTutorialState;
  if (!tutorialState) {
    // No tutorial state - shouldn't happen
    return {
      output: [],
      stateChanges: {},
    };
  }

  const currentState = tutorialState.current;

  // Locked states ignore all input
  if (!isTutorialInputState(currentState)) {
    return {
      output: [],
      stateChanges: {},
    };
  }

  // Empty input - ignore
  const normalized = normalizeInput(input);
  if (!normalized) {
    return {
      output: [],
      stateChanges: {},
    };
  }

  // Check input too long
  if (input.length > 64) {
    return {
      output: [
        createEntry('input', `> ${input}`),
        createEntry('error', 'INPUT TOO LONG'),
        createEntry('system', ''),
      ],
      stateChanges: {},
    };
  }

  // Validate input
  const isValid = validateTutorialInput(input, currentState, tabPressed);

  if (isValid) {
    // Success - advance to next state
    return handleValidInput(input, currentState, gameState);
  } else {
    // Failure - increment fail count, maybe show nudge
    return handleInvalidInput(input, tutorialState, gameState);
  }
}

/**
 * Handle valid tutorial input
 */
function handleValidInput(
  input: string,
  currentState: TutorialStateID,
  gameState: GameState
): CommandResult {
  const entries: TerminalEntry[] = [createEntry('input', `> ${input}`)];
  let nextState = currentState;
  let currentPath = gameState.currentPath;

  switch (currentState) {
    case TutorialStateID.LS_PROMPT:
      // Show root directory listing
      entries.push(createEntry('system', ''));
      for (const line of TUTORIAL_ROOT_LISTING) {
        entries.push(createEntry('output', line));
      }
      entries.push(createEntry('system', ''));
      nextState = TutorialStateID.CD_PROMPT;
      // Add CD_PROMPT dialogue
      entries.push(...generateStateDialogue(TutorialStateID.CD_PROMPT));
      break;

    case TutorialStateID.CD_PROMPT:
      // Change to /files, show files listing
      currentPath = '/files';
      entries.push(createEntry('system', ''));
      for (const line of TUTORIAL_FILES_LISTING) {
        entries.push(createEntry('output', line));
      }
      entries.push(createEntry('system', ''));
      nextState = TutorialStateID.OPEN_PROMPT;
      // Add OPEN_PROMPT dialogue
      entries.push(...generateStateDialogue(TutorialStateID.OPEN_PROMPT));
      break;

    case TutorialStateID.OPEN_PROMPT:
      // Show cafeteria menu content
      entries.push(createEntry('system', ''));
      for (const line of CAFETERIA_MENU_CONTENT) {
        entries.push(createEntry('file', line));
      }
      entries.push(createEntry('system', ''));
      nextState = TutorialStateID.FILE_DISPLAY;
      // Add FILE_DISPLAY commentary, then CD_BACK_PROMPT
      entries.push(...generateStateDialogue(TutorialStateID.FILE_DISPLAY));
      entries.push(...generateStateDialogue(TutorialStateID.CD_BACK_PROMPT));
      nextState = TutorialStateID.CD_BACK_PROMPT;
      break;

    case TutorialStateID.CD_BACK_PROMPT:
      // Change to root
      currentPath = '/';
      entries.push(createEntry('system', ''));
      entries.push(createEntry('output', '/>'));
      entries.push(createEntry('system', ''));
      nextState = TutorialStateID.LS_REINFORCE;
      // Add LS_REINFORCE dialogue
      entries.push(...generateStateDialogue(TutorialStateID.LS_REINFORCE));
      break;

    case TutorialStateID.LS_REINFORCE:
      // Show root directory listing again
      entries.push(createEntry('system', ''));
      for (const line of TUTORIAL_ROOT_LISTING) {
        entries.push(createEntry('output', line));
      }
      entries.push(createEntry('system', ''));
      nextState = TutorialStateID.TUTORIAL_END;
      // Add TUTORIAL_END briefing
      entries.push(...generateTutorialEndDialogue());
      // After tutorial end, transition to GAME_ACTIVE
      nextState = TutorialStateID.GAME_ACTIVE;
      break;
  }

  const newTutorialState: InteractiveTutorialState = {
    current: nextState,
    failCount: 0,
    nudgeShown: false,
    inputLocked: nextState === TutorialStateID.GAME_ACTIVE ? false : !isTutorialInputState(nextState),
    dialogueComplete: true,
  };

  const stateChanges: Partial<GameState> = {
    interactiveTutorialState: newTutorialState,
    currentPath,
  };

  // If transitioning to GAME_ACTIVE, set tutorialComplete
  if (nextState === TutorialStateID.GAME_ACTIVE) {
    stateChanges.tutorialComplete = true;
    stateChanges.tutorialStep = -1;
    // Reset currentPath to real game root
    stateChanges.currentPath = '/';
  }

  return {
    output: entries,
    stateChanges,
  };
}

/**
 * Handle invalid tutorial input
 */
function handleInvalidInput(
  input: string,
  tutorialState: InteractiveTutorialState,
  _gameState: GameState
): CommandResult {
  const entries: TerminalEntry[] = [
    createEntry('input', `> ${input}`),
    createEntry('error', 'INVALID INPUT'),
    createEntry('system', ''),
  ];

  const newFailCount = tutorialState.failCount + 1;
  let nudgeShown = tutorialState.nudgeShown;

  // Show nudge after 3 failures (if not already shown)
  if (newFailCount >= 3 && !nudgeShown) {
    const nudge = TUTORIAL_NUDGES[tutorialState.current];
    if (nudge) {
      entries.push(createEntry('ufo74', nudge));
      entries.push(createEntry('system', ''));
      nudgeShown = true;
    }
  }

  const newTutorialState: InteractiveTutorialState = {
    ...tutorialState,
    failCount: newFailCount,
    nudgeShown,
  };

  return {
    output: entries,
    stateChanges: {
      interactiveTutorialState: newTutorialState,
    },
  };
}

/**
 * Generate the tutorial end briefing with proper formatting
 */
function generateTutorialEndDialogue(): TerminalEntry[] {
  const entries: TerminalEntry[] = [
    createEntry('system', ''),
    createEntry('ufo74', '[UFO74]: Good. You know enough.'),
    createEntry('ufo74', '[UFO74]: Now the real thing.'),
    createEntry('system', ''),
    createEntry('ufo74', '[UFO74]: Your mission: find 5 pieces of evidence.'),
    createEntry('ufo74', '[UFO74]: Once you have them, leak everything.'),
    createEntry('system', ''),
    createEntry('ufo74', '[UFO74]: But understand the risks.'),
    createEntry('ufo74', '[UFO74]: Every action you take... they might notice.'),
    createEntry('ufo74', "[UFO74]: Detection hits 100%, you're done. They'll find you."),
    createEntry('system', ''),
    createEntry('ufo74', '[UFO74]: And you only get 8 attempts.'),
    createEntry('ufo74', '[UFO74]: Fail 8 times, the window closes. Permanently.'),
    createEntry('system', ''),
    createEntry('ufo74', '[UFO74]: Some files are bait. Opening them spikes detection.'),
    createEntry('ufo74', '[UFO74]: Some actions are loud. Others are quiet.'),
    createEntry('ufo74', '[UFO74]: Curiosity has a cost here.'),
    createEntry('system', ''),
    createEntry('ufo74', "[UFO74]: I've done what I can."),
    createEntry('ufo74', '[UFO74]: Good luck, kid.'),
    createEntry('system', ''),
    createEntry('ufo74', '[UFO74]: ...'),
    createEntry('system', ''),
    createEntry('ufo74', '┌─────────────────────────────────────────────────────────┐'),
    createEntry('ufo74', '│         >> ENCRYPTED CHANNEL CLOSED <<                  │'),
    createEntry('ufo74', '└─────────────────────────────────────────────────────────┘'),
    createEntry('system', ''),
    createEntry('system', '[UFO74 has disconnected]'),
    createEntry('system', ''),
  ];

  return entries;
}

/**
 * Initialize a new game with interactive tutorial
 */
export function initializeInteractiveTutorial(): Partial<GameState> {
  return {
    interactiveTutorialState: { ...INITIAL_TUTORIAL_STATE },
    tutorialComplete: false,
    tutorialStep: 0,
    currentPath: '/',
  };
}

/**
 * Get the initial tutorial output (INTRO dialogue + first prompt)
 */
export function getInitialTutorialOutput(): TerminalEntry[] {
  const entries: TerminalEntry[] = [];

  // Boot sequence header
  entries.push(createEntry('system', ''));
  entries.push(createEntry('system', '═══════════════════════════════════════════════════════════'));
  entries.push(createEntry('system', 'BRAZILIAN INTELLIGENCE LEGACY SYSTEM'));
  entries.push(createEntry('system', 'TERMINAL ACCESS POINT — NODE 7'));
  entries.push(createEntry('system', '═══════════════════════════════════════════════════════════'));
  entries.push(createEntry('system', ''));
  entries.push(createEntry('system', 'SYSTEM DATE: JANUARY 1996'));
  entries.push(createEntry('system', ''));

  // UFO74 intro
  entries.push(...generateIntroDialogue());

  // LS_PROMPT dialogue
  entries.push(...generateStateDialogue(TutorialStateID.LS_PROMPT));

  return entries;
}
