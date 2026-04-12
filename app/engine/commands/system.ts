// System commands: help, status, clear, hint, tutorial, save

import { GameState } from '../../types';
import { createEntry, createEntryI18n, createOutputEntries } from './utils';
import {
  checkVictory,
  getObserverStatusLines,
  getWarmupAdjustedDetection,
  hasReadPsiMaterial,
} from './helpers';
import { DETECTION_THRESHOLDS } from '../../constants/detection';
import { countEvidence } from '../evidenceRevelation';
import { generateHintOutput } from '../hintSystem';
import type { CommandRegistry } from './types';

// Detailed help for individual commands
const COMMAND_HELP: Record<string, string[]> = {
  help: [
    'COMMAND: help [command]',
    '',
    'Display available commands or detailed help for a specific command.',
    '',
    'USAGE:',
    '  help           - Show all commands',
    '  help ls        - Show detailed help for "ls"',
    '  help open      - Show detailed help for "open"',
  ],
  ls: [
    'COMMAND: ls [-l]',
    '',
    'List contents of current directory.',
    '',
    'USAGE:',
    '  ls             - List files and directories',
    '  ls -l          - Long format with previews',
    '',
    'MARKERS:',
    '  [UNREAD]       - File not yet read',
    '  [READ]         - File already opened',
    '  [~2min]        - Longer document estimate',
    '  ★              - Bookmarked file',
  ],
  cd: [
    'COMMAND: cd <directory>',
    '',
    'Change to a different directory.',
    '',
    'USAGE:',
    '  cd ops         - Enter the "ops" directory',
    '  cd /admin      - Go to absolute path',
    '  cd ..          - Go to parent directory',
  ],
  open: [
    'COMMAND: open <file>',
    '',
    'Open and display the contents of a file.',
    '',
    'USAGE:',
    '  open report.txt       - Open a file',
    '',
    'NOTE: Legacy encrypted/restricted wrappers now open directly.',
    'NOTE: Opening certain files may increase detection risk.',
  ],
  note: [
    'COMMAND: note <text>',
    '',
    'Save a personal note to help you remember important details.',
    '',
    'USAGE:',
    '  note Check the date on transport log',
    '  note Password might be varginha',
    '',
    'Notes are saved with timestamps and persist across saves.',
  ],
  notes: [
    'COMMAND: notes',
    '',
    'Display all saved personal notes.',
    '',
    'USAGE:',
    '  notes          - Show all notes with timestamps',
  ],
  bookmark: [
    'COMMAND: bookmark [file]',
    '',
    'Bookmark a file for quick reference, or view bookmarks.',
    '',
    'USAGE:',
    '  bookmark                    - List all bookmarks',
    '  bookmark report.txt         - Toggle bookmark on file',
    '',
    'Bookmarked files show a ★ marker in directory listings.',
  ],
  status: [
    'COMMAND: status',
    '',
    'Display current system status and risk indicators.',
    '',
    'Shows:',
    '  - Logging/audit status',
    '  - System tolerance (wrong attempts remaining)',
    '  - Session stability',
  ],
  clear: [
    'COMMAND: clear',
    '',
    'Clear the terminal display.',
    '',
    'USAGE:',
    '  clear          - Clear screen',
    '',
    'SHORTCUT: Ctrl+L',
  ],
  save: [
    'COMMAND: save',
    '',
    'Manually save your current session.',
    '',
    'USAGE:',
    '  save           - Save to a new slot',
    '',
    'NOTE: The game also auto-saves periodically.',
  ],
  chat: [
    'COMMAND: chat',
    '',
    'Open the secure relay channel to communicate with contacts.',
    '',
    'USAGE:',
    '  chat           - Open chat interface',
  ],
  last: [
    'COMMAND: last',
    '',
    'Re-display the last opened file without increasing risk.',
    '',
    'USAGE:',
    '  last           - Show last opened file',
  ],
  unread: [
    'COMMAND: unread',
    '',
    'List all files you have not yet opened.',
    '',
    'USAGE:',
    '  unread         - Show unread files',
  ],
  tree: [
    'COMMAND: tree',
    '',
    'Display a tree view of the directory structure.',
    '',
    'USAGE:',
    '  tree           - Show directory tree',
  ],
  tutorial: [
    'COMMAND: tutorial [on|off]',
    '',
    'Toggle tutorial tips or replay the introduction.',
    '',
    'USAGE:',
    '  tutorial       - Restart tutorial sequence',
    '  tutorial on    - Enable tutorial tips during gameplay',
    '  tutorial off   - Disable tutorial tips',
    '',
    'When tutorial mode is ON, helpful tips appear at key moments:',
    '  - After your first evidence update',
    '  - When you discover new evidence categories',
  ],
  morse: [
    'COMMAND: morse',
    '',
    'Decipher intercepted morse code messages.',
    '',
    'USAGE:',
    '  morse <message>  - Submit your deciphered message',
    '  morse cancel     - Cancel current morse entry',
    '',
    'First read a morse intercept file (e.g., morse_intercept.sig).',
    'Then use this command to submit your translation.',
  ],
  leak: [
    'COMMAND: leak',
    '',
    'Attempt to leak collected evidence to external channels.',
    '',
    'USAGE:',
    '  leak            - Initiate evidence leak',
    '',
    'REQUIREMENT: All 10 evidence files must be collected first.',
    '',
    'WARNING: This action triggers the endgame sequence.',
  ],
  hint: [
    'COMMAND: hint',
    '',
    'Request guidance when you are stuck.',
    '',
    'USAGE:',
    '  hint              - Receive a contextual hint',
    '',
    'NOTES:',
    '  - Hints are LIMITED (4 per run)',
    '  - Hints are vague — they guide thinking, not actions',
    '  - Cannot reveal specific file names or answers',
    '',
    'Use sparingly. Trust your own analysis.',
  ],
  wait: [
    'COMMAND: wait',
    '',
    'Wait and let attention drift elsewhere.',
    '',
    'USAGE:',
    '  wait           - Reduce detection by ~10%',
    '',
    'Limited uses per session (3).',
    'Strategic use can help avoid detection.',
  ],
  hide: ['COMMAND: hide', 'USAGE:', '  hide           - Emergency escape at 90% risk'],
  link: [
    'COMMAND: link [phrase]',
    '',
    'Establish neural connection with recovered consciousness.',
    '',
    'USAGE:',
    '  link           - Attempt connection',
    '  link <phrase>  - Authenticate with conceptual key',
    '',
    'REQUIREMENTS:',
    '  Requires a .psi neural pattern file.',
    '  Check /storage/quarantine/ for psi files.',
  ],
  override: [
    'COMMAND: override protocol <code>',
    '',
    'Execute administrative override with access code.',
    '',
    'USAGE:',
    '  override protocol <code>',
    '',
    'HINT: The access code can be obtained through encrypted channels.',
  ],
  release: [
    'COMMAND: release <target>',
    '',
    'Release a containment subject.',
    '',
    'USAGE:',
    '  release <target>',
    '',
    'NOTE: Requires discovery of containment manifests.',
  ],
};

export const systemCommands: CommandRegistry = {
  help: (args, state) => {
    // If a specific command is requested, show detailed help
    if (args.length > 0) {
      const cmdName = args[0].toLowerCase();

      // Show leak help even before evidence is found — command is visible but locked

      const details = COMMAND_HELP[cmdName];

      if (details) {
        return {
          output: [
            createEntry('system', ''),
            ...details.map(line => createEntry('output', line)),
            createEntry('system', ''),
          ],
          stateChanges: {},
        };
      } else {
        return {
          output: [
            createEntry('error', `Unknown command: ${cmdName}`),
            createEntryI18n(
              'system',
              'engine.commands.system.type_help_to_see_all_available_commands',
              'Type "help" to see all available commands.'
            ),
          ],
          stateChanges: {},
        };
      }
    }

    // Default: show all commands
    const helpLines = [
      '',
      '═══════════════════════════════════════════════════════════',
      'TERMINAL COMMANDS',
      '═══════════════════════════════════════════════════════════',
      '',
      '  help [cmd]        Display help (or help for specific command)',
      '  status            Display system status',
      '  ls                List directory contents',
      '  cd <dir>          Change directory',
      '  open <file>       Open and display file contents',
      '  last              Re-display last opened file',
      '  unread            List unread files',
      '  note <text>       Save a personal note',
      '  notes             View all saved notes',
      '  bookmark [file]   Bookmark a file (or view bookmarks)',
      '  chat              Open secure relay channel',
      '  tree              Show directory structure',
      '  morse <text>      Decipher morse code messages',
      '  hint              Request a hint (limited uses)',
      '  wait              Lower detection briefly (limited)',
      '  hide              Emergency escape at 90% risk',
      '  leak              Leak collected evidence',
      '  override protocol <code>  Execute admin override',
      '  tutorial [on/off] Toggle tutorial tips or replay intro',
      '  save              Save current session',
      '  clear             Clear terminal display',
      '',
      '  ↑/↓ arrows        Navigate command history',
      '  Tab               Autocomplete commands and files',
      '  Ctrl+L            Clear terminal',
      '',
    ];

    if (
      hasReadPsiMaterial(state) &&
      (state.evidenceCount || 0) >= 2 &&
      state.detectionLevel >= DETECTION_THRESHOLDS.STATUS_MED
    ) {
      helpLines.push('NOTICE: If assistance appears before you finish typing, do not repeat it.');
      helpLines.push('');
    }

    helpLines.push('═══════════════════════════════════════════════════════════');
    helpLines.push('');

    return {
      output: createOutputEntries(helpLines),
      stateChanges: {},
    };
  },

  status: (args, state) => {
    const hostility = state.systemHostilityLevel || 0;

    const lines = [
      '',
      '═══════════════════════════════════════════════════════════',
      'SYSTEM STATUS',
      '═══════════════════════════════════════════════════════════',
      '',
    ];

    // Detection surfacing - becomes more terse at high hostility
    if (state.detectionLevel < DETECTION_THRESHOLDS.STATUS_LOW) {
      lines.push(hostility >= 3 ? '  LOGGING: Nominal' : '  LOGGING: Nominal');
    } else if (state.detectionLevel < DETECTION_THRESHOLDS.STATUS_MED) {
      lines.push(hostility >= 3 ? '  LOGGING: Active' : '  LOGGING: Active monitoring enabled');
    } else if (state.detectionLevel < DETECTION_THRESHOLDS.STATUS_HIGH) {
      lines.push(
        hostility >= 3 ? '  LOGGING: FLAGGED' : '  LOGGING: WARNING — Audit trail flagged'
      );
    } else {
      lines.push(
        hostility >= 3 ? '  LOGGING: CRITICAL' : '  LOGGING: CRITICAL — Countermeasures engaged'
      );
    }

    // Attempts tracking - show remaining wrong attempts allowed
    const attemptsRemaining = 8 - (state.wrongAttempts || 0);
    if (attemptsRemaining >= 6) {
      lines.push(hostility >= 3 ? '  TOLERANCE: Normal' : '  SYSTEM TOLERANCE: Normal');
    } else if (attemptsRemaining >= 3) {
      lines.push(
        hostility >= 3 ? '  TOLERANCE: Reduced' : '  SYSTEM TOLERANCE: Reduced — Errors noted'
      );
    } else if (attemptsRemaining >= 1) {
      lines.push(
        hostility >= 3
          ? '  TOLERANCE: CRITICAL'
          : '  SYSTEM TOLERANCE: CRITICAL — Few attempts remaining'
      );
    } else {
      lines.push(
        hostility >= 3 ? '  TOLERANCE: NONE' : '  SYSTEM TOLERANCE: EXHAUSTED — Lockdown imminent'
      );
    }

    // Session stability
    if (state.sessionStability > 80) {
      lines.push(hostility >= 3 ? '  SESSION: Connected' : '  SESSION: Connected');
    } else if (state.sessionStability > 50) {
      lines.push(hostility >= 3 ? '  SESSION: Intermittent' : '  SESSION: Intermittent');
    } else {
      lines.push(
        hostility >= 3 ? '  SESSION: UNSTABLE' : '  SESSION: UNSTABLE — Connection degrading'
      );
    }

    // Access level (vague)
    if (state.accessLevel <= 1) {
      lines.push('  ACCESS: Standard');
    } else if (state.accessLevel <= 3) {
      lines.push('  ACCESS: Elevated');
    } else {
      lines.push('  ACCESS: Administrative');
    }

    const evidenceCount = countEvidence(state);
    lines.push(`  EVIDENCE: ${evidenceCount}/10 confirmed`);

    if (evidenceCount >= 10) {
      lines.push('  OBJECTIVE: Evidence complete — use "leak" when ready.');
    } else if (evidenceCount > 0) {
      lines.push('  OBJECTIVE: Keep reading. Each evidence file strengthens the case.');
    } else {
      lines.push('  OBJECTIVE: Start opening files and build the evidence tracker.');
    }

    if (
      state.detectionLevel >= DETECTION_THRESHOLDS.HIDE_AVAILABLE &&
      !state.singularEventsTriggered?.has('hide_used')
    ) {
      lines.push('  RECOVERY: "hide" is available now.');
    } else if (state.detectionLevel >= DETECTION_THRESHOLDS.STATUS_HIGH) {
      const waitsLeft = state.waitUsesRemaining || 0;
      if (waitsLeft > 0) {
        lines.push(`  RECOVERY: "wait" can buy time (${waitsLeft} left).`);
      } else {
        lines.push('  RECOVERY: No wait uses remaining.');
      }
    }

    const observerLines = getObserverStatusLines(state);
    if (observerLines.length > 0) {
      lines.push('');
      lines.push(...observerLines);
    }

    // System attitude indicator at high hostility
    if (hostility >= 4) {
      lines.push('');
      lines.push('  SYSTEM ATTITUDE: Studying you');
    } else if (hostility >= 2) {
      lines.push('');
      lines.push('  SYSTEM ATTITUDE: Listening');
    }

    // Terrible Mistake indicator
    if (state.terribleMistakeTriggered) {
      lines.push('');
      lines.push('  ▓▓▓ PURGE PROTOCOL: ACTIVE ▓▓▓');
      if (state.sessionDoomCountdown > 0) {
        lines.push(`  OPERATIONS REMAINING: ${state.sessionDoomCountdown}`);
      }
    }

    lines.push('');
    lines.push(`  CURRENT PATH: ${state.currentPath}`);
    lines.push('');
    lines.push('═══════════════════════════════════════════════════════════');

    // Victory check
    if (checkVictory(state)) {
      lines.push('');
      lines.push('SESSION ARCHIVED');
      return {
        output: createOutputEntries(lines),
        stateChanges: {
          isGameOver: true,
          gameOverReason: 'SESSION ARCHIVED',
          flags: { ...state.flags, sessionArchived: true },
        },
      };
    }

    lines.push('');

    const newStatusCount = (state.statusCommandCount || 0) + 1;

    const stateChanges: Partial<GameState> = {
      detectionLevel: getWarmupAdjustedDetection(state, 1),
      statusCommandCount: newStatusCount,
    };

    if (!state.tutorialComplete) {
      delete stateChanges.detectionLevel;
    }

    return {
      output: createOutputEntries(lines),
      stateChanges,
      // Signal to check paranoid achievement
      checkAchievements: newStatusCount >= 10 ? ['paranoid'] : undefined,
    };
  },

  clear: (_args, _state) => {
    return {
      output: [],
      stateChanges: {
        history: [],
      },
    };
  },

  hint: (_args, state) => {
    // hintSystem is now a proper ESM import (no circular dependency after the
    // commands.ts split — hintSystem only depends on commands/utils, not on this module).
    return generateHintOutput(state);
  },

  tutorial: (args, _state) => {
    // Handle tutorial on/off toggle
    if (args.length > 0) {
      const arg = args[0].toLowerCase();

      if (arg === 'on') {
        return {
          output: [
            createEntry('system', ''),
            createEntryI18n(
              'notice',
              'engine.commands.system.tutorial_mode_enabled',
              'TUTORIAL MODE: ENABLED'
            ),
            createEntryI18n(
              'output',
              'engine.commands.system.i_ll_show_extra_tips_as_you_explore',
              "I'll show extra tips as you explore."
            ),
            createEntryI18n(
              'output',
              'engine.commands.system.type_tutorial_off_anytime_to_disable',
              'Type "tutorial off" anytime to disable.'
            ),
            createEntry('system', ''),
          ],
          stateChanges: {
            interactiveTutorialMode: true,
          },
        };
      }

      if (arg === 'off') {
        return {
          output: [
            createEntry('system', ''),
            createEntryI18n(
              'notice',
              'engine.commands.system.tutorial_mode_disabled',
              'TUTORIAL MODE: DISABLED'
            ),
            createEntryI18n(
              'output',
              'engine.commands.system.you_re_on_your_own_now_good_luck_kid',
              "You're on your own now. Good luck kid."
            ),
            createEntry('system', ''),
          ],
          stateChanges: {
            interactiveTutorialMode: false,
          },
        };
      }
    }

    // No args or unrecognized arg: Replay the tutorial/introduction
    return {
      output: [
        createEntry('system', ''),
        createEntryI18n(
          'system',
          'engine.commands.system.restarting_tutorial_sequence',
          'Restarting tutorial sequence...'
        ),
        createEntry('system', ''),
      ],
      stateChanges: {
        tutorialStep: 0,
        tutorialComplete: false,
        history: [], // Clear history for fresh start
      },
    };
  },

  save: (args, state) => {
    // Save is handled at UI level, but acknowledge here
    return {
      output: [
        createEntryI18n(
          'system',
          'engine.commands.system.session_save_requested',
          'SESSION SAVE REQUESTED'
        ),
        createEntryI18n(
          'output',
          'engine.commands.system.use_menu_to_confirm_save_slot',
          'Use menu to confirm save slot.'
        ),
      ],
      stateChanges: {
        flags: { ...state.flags, saveRequested: true },
      },
    };
  },
};
