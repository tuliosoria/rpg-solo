// Interactive Tutorial System for Terminal 1996
// Based on SHODAN-tutorial-spec.md
// Implements gated input system where UFO74 guides player through commands

import {
  TerminalEntry,
  GameState,
  CommandResult,
  TutorialStateID,
  InteractiveTutorialState,
} from '../../types';
import { createEntry, createEntryI18n } from './utils';
import { listDirectory } from '../filesystem';
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
  [TutorialStateID.LS_PROMPT]: ["[UFO74]: First, see what's here.", '[UFO74]: Type `ls`'],
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
  [TutorialStateID.LS_REINFORCE]: ['[UFO74]: Now go back to root.', '[UFO74]: Type `cd ..`'],
  [TutorialStateID.TUTORIAL_END]: [
    '[UFO74]: Now the real thing.',
    '',
    '[UFO74]: Your mission: save 10 files to your dossier.',
    '[UFO74]: Use `save <filename>` after reading a file.',
    '[UFO74]: Changed your mind? `unsave <filename>` removes it.',
    '[UFO74]: Check your progress with `progress`.',
    '[UFO74]: Once your dossier has 10 files, type `leak`.',
    '',
    '[UFO74]: But understand the risks.',
    '[UFO74]: Every action you take... they might notice.',
    "[UFO74]: Risk hits 100%, you're done. They'll find you.",
    '',
    '[UFO74]: Be careful, do not type wrong commands on the terminal. In doubt, type help.',
    '[UFO74]: Type wrong commands 8 times, the window closes. Permanently. So concentrate, kid!',
    '',
    '[UFO74]: Some files are bait. Opening them spikes detection.',
    '[UFO74]: Some actions are loud. Others are quiet.',
    '[UFO74]: Curiosity has a cost here.',
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
      // Full command (with or without .txt extension)
      if (/^open\s+cafeteria_menu_week03(\.txt)?$/.test(normalized)) return true;
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
export function getTutorialAutocomplete(input: string, state: TutorialStateID): string | null {
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
  const entries: TerminalEntry[] = [createEntry('system', '')];

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
        createEntryI18n('error', 'runtime.inputTooLong', 'INPUT TOO LONG'),
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
      entries.push(
        createEntryI18n('output', 'engine.commands.interactiveTutorial.internal', '/internal>')
      );
      entries.push(createEntry('system', ''));
      nextState = TutorialStateID.LS_REINFORCE;
      // Add LS_REINFORCE dialogue
      entries.push(...generateStateDialogue(TutorialStateID.LS_REINFORCE));
      break;

    case TutorialStateID.LS_REINFORCE:
      // Go back to root
      currentPath = '/';
      entries.push(createEntry('system', ''));
      entries.push(createEntryI18n('output', 'engine.commands.interactiveTutorial.text', '/>'));
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
    inputLocked:
      nextState === TutorialStateID.GAME_ACTIVE ? false : !isTutorialInputState(nextState),
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
        return '[UFO74]: You already see the folders. Navigate into one. Type: cd internal';
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
        return '[UFO74]: One more step back first. Type: cd ..';
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
    createEntryI18n(
      'ufo74',
      'engine.commands.interactiveTutorial.ufo74_good_you_know_enough',
      '[UFO74]: Good. You know enough.'
    ),
    createEntryI18n(
      'ufo74',
      'engine.commands.interactiveTutorial.ufo74_now_the_real_thing',
      '[UFO74]: Now the real thing.'
    ),
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
    createEntryI18n(
      'ufo74',
      'engine.commands.interactiveTutorial.ufo74_your_mission_find_10_pieces_of_evidence',
      '[UFO74]: Your mission: save 10 files to your dossier.'
    ),
    createEntryI18n(
      'ufo74',
      'engine.commands.interactiveTutorial.ufo74_use_save_filename',
      '[UFO74]: Use `save <filename>` after reading a file.'
    ),
    createEntryI18n(
      'ufo74',
      'engine.commands.interactiveTutorial.ufo74_use_unsave_filename',
      '[UFO74]: Changed your mind? `unsave <filename>` removes it.'
    ),
    createEntryI18n(
      'ufo74',
      'engine.commands.interactiveTutorial.ufo74_check_progress',
      '[UFO74]: Check your progress with `progress`.'
    ),
    createEntryI18n(
      'ufo74',
      'engine.commands.interactiveTutorial.ufo74_once_you_have_them_leak_everything',
      '[UFO74]: Once your dossier has 10 files, type `leak`.'
    ),
    createEntry('system', ''),
  ],
  // Step 1
  [
    createEntryI18n(
      'ufo74',
      'engine.commands.interactiveTutorial.ufo74_but_understand_the_risks',
      '[UFO74]: But understand the risks.'
    ),
    createEntryI18n(
      'ufo74',
      'engine.commands.interactiveTutorial.ufo74_every_action_you_take_they_might_notice',
      '[UFO74]: Every action you take... they might notice.'
    ),
    createEntryI18n(
      'ufo74',
      'engine.commands.interactiveTutorial.ufo74_risk_hits_100_you_re_done_they_ll_find_you',
      "[UFO74]: Risk hits 100%, you're done. They'll find you."
    ),
    createEntry('system', ''),
  ],
  // Step 2 — Attempts reveal
  [
    createEntryI18n(
      'ufo74',
      'engine.commands.interactiveTutorial.ufo74_be_careful_do_not_type_wrong_commands_on_the_terminal_',
      '[UFO74]: Be careful, do not type wrong commands on the terminal. In doubt, type help.'
    ),
    createEntryI18n(
      'ufo74',
      'engine.commands.interactiveTutorial.ufo74_type_wrong_commands_8_times_the_window_closes_permanen',
      '[UFO74]: Type wrong commands 8 times, the window closes. Permanently. So concentrate, kid!'
    ),
    createEntry('system', ''),
  ],
  // Step 3
  [
    createEntryI18n(
      'ufo74',
      'engine.commands.interactiveTutorial.ufo74_some_files_are_bait_opening_them_spikes_detection',
      '[UFO74]: Some files are bait. Opening them spikes detection.'
    ),
    createEntryI18n(
      'ufo74',
      'engine.commands.interactiveTutorial.ufo74_some_actions_are_loud_others_are_quiet',
      '[UFO74]: Some actions are loud. Others are quiet.'
    ),
    createEntryI18n(
      'ufo74',
      'engine.commands.interactiveTutorial.ufo74_curiosity_has_a_cost_here',
      '[UFO74]: Curiosity has a cost here.'
    ),
    createEntry('system', ''),
  ],
  // Step 4 — Final / disconnect
  [
    createEntryI18n('ufo74', 'terminal.tutorialSkip.ellipsis', '[UFO74]: ...'),
    createEntry('system', ''),
    createEntryI18n('system', 'terminal.tutorialSkip.disconnected', '[UFO74 has disconnected]'),
    createEntry('system', ''),
  ],
];

/**
 * Step-by-step INTRO blocks shown one-at-a-time on Enter
 */
export const TUTORIAL_INTRO_STEPS: TerminalEntry[][] = [
  // Block 0 — First contact
  [
    createEntry('system', ''),
    createEntryI18n('ufo74', 'terminal.tutorialSkip.connected', '[UFO74]: Connection established.'),
    createEntryI18n(
      'ufo74',
      'engine.commands.interactiveTutorial.ufo74_listen_carefully_i_don_t_repeat_myself',
      "[UFO74]: Listen carefully. I don't repeat myself."
    ),
    createEntryI18n(
      'ufo74',
      'engine.commands.interactiveTutorial.ufo74_you_re_inside_their_system_don_t_panic',
      "[UFO74]: You're inside their system. Don't panic."
    ),
    createEntry('system', ''),
  ],
  // Block 1 — hackerkid creation (triggers avatar animation)
  [
    createEntryI18n(
      'ufo74',
      'engine.commands.interactiveTutorial.ufo74_hey_kid_i_ll_create_a_user_for_you_so_you_can_investig',
      "[UFO74]: Hey kid! I'll create a user for you so you can investigate."
    ),
    createEntryI18n(
      'ufo74',
      'engine.commands.interactiveTutorial.ufo74_you_will_be_hackerkid',
      '[UFO74]: You will be... hackerkid.'
    ),
    createEntry('system', ''),
  ],
  // Block 2 — User creation animation + context + first command
  [
    createEntryI18n('system', 'terminal.tutorialSkip.createProfile', '> CREATING USER PROFILE...'),
    createEntryI18n('system', 'terminal.tutorialSkip.username', '> USERNAME: hackerkid'),
    createEntryI18n(
      'system',
      'terminal.tutorialSkip.accessLevel',
      '> ACCESS LEVEL: 1 [PROVISIONAL]'
    ),
    createEntryI18n('system', 'terminal.tutorialSkip.statusActive', '> STATUS: ACTIVE'),
    createEntry('system', ''),
    createEntryI18n(
      'notice',
      'terminal.tutorialSkip.userRegistered',
      '✓ USER hackerkid REGISTERED'
    ),
    createEntry('system', ''),
    createEntryI18n(
      'ufo74',
      'engine.commands.interactiveTutorial.ufo74_great_now_you_re_in_let_s_get_to_business',
      "[UFO74]: Great, now you're in. Let's get to business."
    ),
    createEntryI18n(
      'ufo74',
      'engine.commands.interactiveTutorial.ufo74_we_need_to_explore_ufo_files_here_brazil_1996_kid_varg',
      '[UFO74]: We need to explore UFO files here. Brazil, 1996, kid. Varginha!'
    ),
    createEntryI18n(
      'ufo74',
      'engine.commands.interactiveTutorial.ufo74_aliens_were_all_over_the_damn_city',
      '[UFO74]: Aliens were all over the damn city.'
    ),
    createEntryI18n(
      'ufo74',
      'engine.commands.interactiveTutorial.ufo74_i_ll_teach_you_the_basics',
      "[UFO74]: I'll teach you the basics."
    ),
    createEntry('system', ''),
    createEntryI18n(
      'ufo74',
      'engine.commands.interactiveTutorial.ufo74_first_see_what_s_here',
      "[UFO74]: First, see what's here."
    ),
    createEntryI18n(
      'ufo74',
      'engine.commands.interactiveTutorial.ufo74_type_ls',
      '[UFO74]: Type `ls`'
    ),
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
    createEntryI18n(
      'system',
      'engine.commands.interactiveTutorial.brazilian_intelligence_legacy_system',
      'BRAZILIAN INTELLIGENCE LEGACY SYSTEM'
    ),
    createEntryI18n(
      'system',
      'engine.commands.interactiveTutorial.terminal_access_point_node_7',
      'TERMINAL ACCESS POINT — NODE 7'
    ),
    createEntry('system', '═══════════════════════════════════════════════════════════'),
    createEntry('system', ''),
    createEntryI18n(
      'system',
      'engine.commands.interactiveTutorial.system_date_january_1996',
      'SYSTEM DATE: JANUARY 1996'
    ),
    createEntry('system', ''),
  ];
}
