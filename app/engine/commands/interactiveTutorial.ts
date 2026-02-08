// Interactive Tutorial System for Terminal 1996
// Based on SHODAN-tutorial-spec.md
// Implements gated input system where UFO74 guides player through commands

import { TerminalEntry, GameState, CommandResult, TutorialStateID, InteractiveTutorialState } from '../../types';
import { createEntry } from './utils';
import { listDirectory } from '../filesystem';
import { FILESYSTEM_ROOT } from '../../data/filesystem';
import { DEFAULT_GAME_STATE } from '../../types';

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
    '',
    "[UFO74]: Hey kid! I'll create a user for you so you can investigate.",
    '[UFO74]: You will be... hackerkid.',
  ],
  [TutorialStateID.LS_PROMPT]: [
    "[UFO74]: First, see what's here.",
    '[UFO74]: Type `ls`',
  ],
  [TutorialStateID.CD_PROMPT]: [
    '[UFO74]: Good. These are the main directories.',
    '[UFO74]: Start with internal — it has basic files.',
    '[UFO74]: Type `cd internal`',
  ],
  [TutorialStateID.OPEN_PROMPT]: [
    "[UFO74]: Multiple folders here. Let's check misc.",
    '[UFO74]: Type `cd misc`',
  ],
  [TutorialStateID.FILE_DISPLAY]: [
    '[UFO74]: Mundane stuff. Nothing critical.',
    '[UFO74]: Open the cafeteria menu.',
    '[UFO74]: Type `open cafeteria_menu_week03.txt`',
    '[UFO74]: Or use TAB to autocomplete.',
  ],
  [TutorialStateID.CD_BACK_PROMPT]: [
    '[UFO74]: Riveting.',
    "[UFO74]: Not everything matters. You'll learn what does.",
    '[UFO74]: Go back up one level.',
    '[UFO74]: Type `cd ..`',
  ],
  [TutorialStateID.LS_REINFORCE]: [
    '[UFO74]: Now go back to root.',
    '[UFO74]: Type `cd ..`',
  ],
  [TutorialStateID.TUTORIAL_END]: [
    '[UFO74]: Now the real thing.',
    '',
    '[UFO74]: Your mission: find 5 pieces of evidence.',
    '[UFO74]: Once you have them, leak everything.',
    '',
    '[UFO74]: But understand the risks.',
    '[UFO74]: Every action you take... they might notice.',
    "[UFO74]: Risk hits 100%, you're done. They'll find you.",
    '',
    '[UFO74]: And you only get 8 attempts.',
    '[UFO74]: Fail 8 times, the window closes. Permanently.',
    '',
    '[UFO74]: Some files are bait. Opening them spikes detection.',
    '[UFO74]: Some actions are loud. Others are quiet.',
    '[UFO74]: Curiosity has a cost here.',
    '',
    "[UFO74]: I've done what I can. One last thing, type `help` to see other commands you can use in the terminal.",
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
  [TutorialStateID.CD_PROMPT]: '[UFO74]: cd means change directory. cd internal',
  [TutorialStateID.OPEN_PROMPT]: '[UFO74]: Navigate to misc folder. cd misc',
  [TutorialStateID.FILE_DISPLAY]: '[UFO74]: open followed by the filename. Try TAB key.',
  [TutorialStateID.CD_BACK_PROMPT]: '[UFO74]: Two dots. cd space dot dot.',
  [TutorialStateID.LS_REINFORCE]: '[UFO74]: Same command. cd ..',
  [TutorialStateID.TUTORIAL_END]: null,
  [TutorialStateID.GAME_ACTIVE]: null,
};

// ═══════════════════════════════════════════════════════════════════════════
// TUTORIAL FILESYSTEM (Sandbox)
// ═══════════════════════════════════════════════════════════════════════════

// Generate listing from the real game filesystem so tutorial always matches
function generateListing(path: string): string[] {
  // Use a minimal default state to query the real filesystem
  const mockState = { ...DEFAULT_GAME_STATE } as GameState;
  const entries = listDirectory(path, mockState);
  if (!entries || entries.length === 0) return [path, '  (empty)'];

  const lines = ['', `Directory: ${path}`, ''];
  for (const entry of entries) {
    lines.push(`  ${entry.name}`);
  }
  return lines;
}

export function getTutorialRootListing(): string[] {
  return generateListing('/');
}

export function getTutorialInternalListing(): string[] {
  return generateListing('/internal');
}

export function getTutorialMiscListing(): string[] {
  return generateListing('/internal/misc');
}

// Keep backwards-compatible exports for barrel file
export const TUTORIAL_ROOT_LISTING = generateListing('/');
export const TUTORIAL_INTERNAL_LISTING = generateListing('/internal');
export const TUTORIAL_MISC_LISTING = generateListing('/internal/misc');

export const CAFETERIA_MENU_CONTENT = [
  '═══════════════════════════════════════════════════════════',
  'CAFETERIA MENU — WEEK 3, JANUARY 1996',
  '═══════════════════════════════════════════════════════════',
  '',
  'MONDAY (15-JAN):',
  '  Almoço: Feijoada completa, arroz, farofa',
  '  Jantar: Frango grelhado, legumes',
  '',
  'TUESDAY (16-JAN):',
  '  Almoço: Bife acebolado, arroz, feijão',
  '  Jantar: Sopa de legumes, pão',
  '',
  'WEDNESDAY (17-JAN):',
  '  Almoço: Peixe frito, batatas',
  '  Jantar: Macarronada',
  '',
  'THURSDAY (18-JAN):',
  '  Almoço: Frango com quiabo',
  '  Jantar: Sanduíches variados',
  '',
  'FRIDAY (19-JAN):',
  '  Almoço: Churrasco misto',
  '  Jantar: Pizza',
  '',
  'NOTE: Vegan/vegetarian options upon request.',
  '      Coffee machine still OUT OF SERVICE.',
  '',
  '═══════════════════════════════════════════════════════════',
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
      return normalized === 'ls';

    case TutorialStateID.CD_PROMPT:
      return /^cd\s+internal$/.test(normalized);

    case TutorialStateID.OPEN_PROMPT:
      return /^cd\s+misc$/.test(normalized);

    case TutorialStateID.FILE_DISPLAY:
      // Full command
      if (/^open\s+cafeteria_menu_week03\.txt$/.test(normalized)) return true;
      // Autocomplete: open c + TAB
      if (tabPressed && /^open\s+c/.test(normalized)) {
        const prefix = normalized.replace(/^open\s+/, '');
        return 'cafeteria_menu_week03.txt'.startsWith(prefix);
      }
      return false;

    case TutorialStateID.CD_BACK_PROMPT:
      return /^cd\s+\.\.$/.test(normalized);

    case TutorialStateID.LS_REINFORCE:
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

  if (state === TutorialStateID.FILE_DISPLAY) {
    if (/^open\s+c/.test(normalized)) {
      const prefix = normalized.replace(/^open\s+/, '');
      if ('cafeteria_menu_week03.txt'.startsWith(prefix)) {
        // Return just the filename, not the full command
        // completeInput() will prepend the command automatically
        return 'cafeteria_menu_week03.txt';
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
    TutorialStateID.FILE_DISPLAY,
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
      // Change to /internal, show internal listing
      currentPath = '/internal';
      entries.push(createEntry('system', ''));
      for (const line of TUTORIAL_INTERNAL_LISTING) {
        entries.push(createEntry('output', line));
      }
      entries.push(createEntry('system', ''));
      nextState = TutorialStateID.OPEN_PROMPT;
      // Add OPEN_PROMPT dialogue
      entries.push(...generateStateDialogue(TutorialStateID.OPEN_PROMPT));
      break;

    case TutorialStateID.OPEN_PROMPT:
      // Change to /internal/misc, show misc listing
      currentPath = '/internal/misc';
      entries.push(createEntry('system', ''));
      for (const line of TUTORIAL_MISC_LISTING) {
        entries.push(createEntry('output', line));
      }
      entries.push(createEntry('system', ''));
      nextState = TutorialStateID.FILE_DISPLAY;
      // Add FILE_DISPLAY dialogue
      entries.push(...generateStateDialogue(TutorialStateID.FILE_DISPLAY));
      break;

    case TutorialStateID.FILE_DISPLAY:
      // Show cafeteria menu content
      entries.push(createEntry('system', ''));
      for (const line of CAFETERIA_MENU_CONTENT) {
        entries.push(createEntry('file', line));
      }
      entries.push(createEntry('system', ''));
      nextState = TutorialStateID.CD_BACK_PROMPT;
      // Add CD_BACK_PROMPT dialogue
      entries.push(...generateStateDialogue(TutorialStateID.CD_BACK_PROMPT));
      break;

    case TutorialStateID.CD_BACK_PROMPT:
      // Go back to /internal
      currentPath = '/internal';
      entries.push(createEntry('system', ''));
      entries.push(createEntry('output', '/internal>'));
      entries.push(createEntry('system', ''));
      nextState = TutorialStateID.LS_REINFORCE;
      // Add LS_REINFORCE dialogue
      entries.push(...generateStateDialogue(TutorialStateID.LS_REINFORCE));
      break;

    case TutorialStateID.LS_REINFORCE:
      // Go back to root
      currentPath = '/';
      entries.push(createEntry('system', ''));
      entries.push(createEntry('output', '/>'));
      entries.push(createEntry('system', ''));
      // Show opening briefing lines, then enter step-by-step mode
      entries.push(...generateTutorialEndDialogue());
      nextState = TutorialStateID.TUTORIAL_END;
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

  // If transitioning to TUTORIAL_END, set up briefing step counter
  if (nextState === TutorialStateID.TUTORIAL_END) {
    stateChanges.tutorialStep = 0;
    stateChanges.currentPath = '/';
  }

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
 * Get a contextual hint based on what the player typed vs. what's expected
 */
function getTutorialHint(input: string, state: TutorialStateID): string {
  const normalized = normalizeInput(input);

  switch (state) {
    case TutorialStateID.LS_PROMPT: {
      // Expected: ls
      if (normalized === 'dir' || normalized === 'list') {
        return '[UFO74]: Close idea, wrong system. Try: ls';
      }
      if (normalized.startsWith('cd ') || normalized.startsWith('open ')) {
        return "[UFO74]: Not yet. First, let's see what's here. Type: ls";
      }
      return '[UFO74]: Type ls to list the files here.';
    }

    case TutorialStateID.CD_PROMPT: {
      // Expected: cd internal
      if (normalized === 'cd') {
        return '[UFO74]: cd needs a target. Type: cd internal';
      }
      if (normalized.startsWith('cd ') && !normalized.includes('internal')) {
        return '[UFO74]: Wrong folder. Type: cd internal';
      }
      if (normalized === 'ls') {
        return "[UFO74]: You already see the folders. Navigate into one. Type: cd internal";
      }
      if (normalized.startsWith('open ')) {
        return "[UFO74]: Can't open a folder. Navigate into it. Type: cd internal";
      }
      return '[UFO74]: Use cd to move into a directory. Type: cd internal';
    }

    case TutorialStateID.OPEN_PROMPT: {
      // Expected: cd misc
      if (normalized === 'cd') {
        return '[UFO74]: cd needs a target. Type: cd misc';
      }
      if (normalized.startsWith('cd ') && !normalized.includes('misc')) {
        return '[UFO74]: Not that one. Type: cd misc';
      }
      if (normalized === 'ls') {
        return "[UFO74]: You can see the folders. Let's go into misc. Type: cd misc";
      }
      if (normalized.startsWith('open ')) {
        return '[UFO74]: Navigate first, open later. Type: cd misc';
      }
      return '[UFO74]: Move into the misc folder. Type: cd misc';
    }

    case TutorialStateID.FILE_DISPLAY: {
      // Expected: open cafeteria_menu_week03.txt
      if (normalized.startsWith('open ') && !normalized.includes('cafeteria')) {
        return '[UFO74]: Wrong file. Try: open cafeteria_menu_week03.txt';
      }
      if (normalized === 'open') {
        return '[UFO74]: open needs a filename. Try: open cafeteria_menu_week03.txt';
      }
      if (normalized.startsWith('cd ')) {
        return "[UFO74]: We're where we need to be. Now open a file. Type: open cafeteria_menu_week03.txt";
      }
      if (normalized === 'ls') {
        return '[UFO74]: You can see the files. Now open one. Type: open cafeteria_menu_week03.txt';
      }
      if (normalized.includes('cafeteria') && !normalized.startsWith('open')) {
        return '[UFO74]: Use the open command. Type: open cafeteria_menu_week03.txt';
      }
      return '[UFO74]: Open the file. Type: open cafeteria_menu_week03.txt — or type open c and press TAB.';
    }

    case TutorialStateID.CD_BACK_PROMPT: {
      // Expected: cd ..
      if (normalized === 'cd') {
        return '[UFO74]: Two dots mean "go back." Type: cd ..';
      }
      if (normalized.startsWith('cd ') && !normalized.includes('..')) {
        return '[UFO74]: To go back up, use two dots. Type: cd ..';
      }
      if (normalized === 'back' || normalized === 'exit') {
        return '[UFO74]: Right idea. The command is: cd ..';
      }
      return '[UFO74]: Go back one level. Type: cd ..';
    }

    case TutorialStateID.LS_REINFORCE: {
      // Expected: cd ..
      if (normalized === 'cd') {
        return '[UFO74]: Almost. Type: cd ..';
      }
      if (normalized.startsWith('cd ') && !normalized.includes('..')) {
        return '[UFO74]: Back to root. Type: cd ..';
      }
      if (normalized === 'ls') {
        return "[UFO74]: One more step back first. Type: cd ..";
      }
      return '[UFO74]: Same as before. Type: cd ..';
    }

    default:
      return '[UFO74]: Not quite. Check the instruction above.';
  }
}

/**
 * Handle invalid tutorial input
 */
function handleInvalidInput(
  input: string,
  tutorialState: InteractiveTutorialState,
  _gameState: GameState
): CommandResult {
  const hint = getTutorialHint(input, tutorialState.current);

  const entries: TerminalEntry[] = [
    createEntry('input', `> ${input}`),
    createEntry('ufo74', hint),
    createEntry('system', ''),
  ];

  const newFailCount = tutorialState.failCount + 1;

  const newTutorialState: InteractiveTutorialState = {
    ...tutorialState,
    failCount: newFailCount,
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
  // Only show the opening line — the rest is delivered step-by-step
  return [
    createEntry('system', ''),
    createEntry('ufo74', '[UFO74]: Good. You know enough.'),
    createEntry('ufo74', '[UFO74]: Now the real thing.'),
    createEntry('system', ''),
  ];
}

// ═══════════════════════════════════════════════════════════════════════════
// TUTORIAL BRIEFING MESSAGES — Delivered one-by-one on Enter
// ═══════════════════════════════════════════════════════════════════════════
// Each entry is a group of lines shown together on one Enter press.
// Special indices trigger UI reveals (handled in useTerminalInput):
//   Step 0: evidence mention → reveal evidence tracker
//   Step 1: risk mention → reveal risk bar
//   Step 2: attempts mention → reveal ATT bar

export const TUTORIAL_BRIEFING_STEPS: TerminalEntry[][] = [
  // Step 0 — Evidence reveal
  [
    createEntry('ufo74', '[UFO74]: Your mission: find 5 pieces of evidence.'),
    createEntry('ufo74', '[UFO74]: Once you have them, leak everything.'),
    createEntry('system', ''),
  ],
  // Step 1
  [
    createEntry('ufo74', '[UFO74]: But understand the risks.'),
    createEntry('ufo74', '[UFO74]: Every action you take... they might notice.'),
    createEntry('ufo74', "[UFO74]: Risk hits 100%, you're done. They'll find you."),
    createEntry('system', ''),
  ],
  // Step 2 — Risk reveal
  [
    createEntry('ufo74', '[UFO74]: And you only get 8 attempts.'),
    createEntry('ufo74', '[UFO74]: Fail 8 times, the window closes. Permanently.'),
    createEntry('system', ''),
  ],
  // Step 3
  [
    createEntry('ufo74', '[UFO74]: Some files are bait. Opening them spikes detection.'),
    createEntry('ufo74', '[UFO74]: Some actions are loud. Others are quiet.'),
    createEntry('ufo74', '[UFO74]: Curiosity has a cost here.'),
    createEntry('system', ''),
  ],
  // Step 4
  [
    createEntry('ufo74', "[UFO74]: I've done what I can. One last thing, type `help` to see other commands you can use in the terminal."),
    createEntry('ufo74', '[UFO74]: Good luck, kid.'),
    createEntry('system', ''),
  ],
  // Step 5 — Final / disconnect
  [
    createEntry('ufo74', '[UFO74]: ...'),
    createEntry('system', ''),
    createEntry('ufo74', '┌─────────────────────────────────────────────────────────┐'),
    createEntry('ufo74', '│         >> ENCRYPTED CHANNEL CLOSED <<                  │'),
    createEntry('ufo74', '└─────────────────────────────────────────────────────────┘'),
    createEntry('system', ''),
    createEntry('system', '[UFO74 has disconnected]'),
    createEntry('system', ''),
  ],
];

/**
 * Step-by-step INTRO blocks shown one-at-a-time on Enter
 */
export const TUTORIAL_INTRO_STEPS: TerminalEntry[][] = [
  // Block 0 — Encrypted channel open + first contact
  [
    createEntry('system', ''),
    createEntry('ufo74', '┌─────────────────────────────────────────────────────────┐'),
    createEntry('ufo74', '│         >> ENCRYPTED CHANNEL OPEN <<                    │'),
    createEntry('ufo74', '└─────────────────────────────────────────────────────────┘'),
    createEntry('system', ''),
    createEntry('ufo74', '[UFO74]: Connection established.'),
    createEntry('ufo74', "[UFO74]: Listen carefully. I don't repeat myself."),
    createEntry('ufo74', "[UFO74]: You're inside their system. Don't panic."),
    createEntry('system', ''),
  ],
  // Block 1 — hackerkid creation (triggers avatar animation)
  [
    createEntry('ufo74', "[UFO74]: Hey kid! I'll create a user for you so you can investigate."),
    createEntry('ufo74', '[UFO74]: You will be... hackerkid.'),
    createEntry('system', ''),
  ],
  // Block 2 — User creation animation + context + first command
  [
    createEntry('system', '> CREATING USER PROFILE...'),
    createEntry('system', '> USERNAME: hackerkid'),
    createEntry('system', '> ACCESS LEVEL: 1 [PROVISIONAL]'),
    createEntry('system', '> STATUS: ACTIVE'),
    createEntry('system', ''),
    createEntry('notice', '✓ USER hackerkid REGISTERED'),
    createEntry('system', ''),
    createEntry('ufo74', "[UFO74]: Great, now you're in. Let's get to business."),
    createEntry('ufo74', '[UFO74]: We need to explore UFO files here. Brazil, 1996, kid. Varginha!'),
    createEntry('ufo74', '[UFO74]: Aliens were all over the damn city.'),
    createEntry('ufo74', "[UFO74]: I'll teach you the basics."),
    createEntry('system', ''),
    createEntry('ufo74', "[UFO74]: First, see what's here."),
    createEntry('ufo74', '[UFO74]: Type `ls`'),
    createEntry('system', ''),
  ],
];

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
  // Only the boot header — INTRO blocks are shown step-by-step on Enter
  return [
    createEntry('system', ''),
    createEntry('system', '═══════════════════════════════════════════════════════════'),
    createEntry('system', 'BRAZILIAN INTELLIGENCE LEGACY SYSTEM'),
    createEntry('system', 'TERMINAL ACCESS POINT — NODE 7'),
    createEntry('system', '═══════════════════════════════════════════════════════════'),
    createEntry('system', ''),
    createEntry('system', 'SYSTEM DATE: JANUARY 1996'),
    createEntry('system', ''),
  ];
}
