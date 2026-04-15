// System commands: help, status, clear, hint, tutorial, save, unsave

import { GameState, CommandResult } from '../../types';
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
import { translateStatic } from '../../i18n';
import { getHelpBasics } from './tutorial';

type TranslationValues = Record<string, string | number>;

function tSystem(key: string, fallback: string, values?: TranslationValues): string {
  return translateStatic(`engine.commands.system.${key}`, values, fallback);
}

// Detailed help for individual commands
const COMMAND_HELP: Record<string, string[]> = {
  help: [
    'COMMAND: help [command]',
    '',
    'Display available commands or detailed help for a specific command.',
    '',
    'USAGE:',
    '  help           - Show all commands',
    '  help basics    - Show the new-player guide',
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
  progress: [
    'COMMAND: progress',
    '',
    'Review your evidence total, case strength, and session notes at a glance.',
    '',
    'USAGE:',
    '  progress       - Show a spoiler-light investigation recap',
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
    'COMMAND: save <filename>',
    '',
    'Save a file to your dossier for the leak.',
    'You must have read the file first.',
    '',
    'USAGE:',
    '  save report.txt    - Save report.txt to dossier',
    '',
    'NOTE: Your dossier can hold up to 10 files.',
  ],
  unsave: [
    'COMMAND: unsave <filename>',
    '',
    'Remove a file from your dossier.',
    '',
    'USAGE:',
    '  unsave report.txt  - Remove report.txt from dossier',
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
  search: [
    'COMMAND: search <keyword>',
    '',
    'Search accessible filenames, paths, and document text for a keyword.',
    '',
    'USAGE:',
    '  search crash       - Find crash-related files',
    '  search quarantine  - Find containment leads',
    '  search 2026        - Find transition references',
    '',
    'NOTES:',
    '  - Searches only what your current access can already reveal',
    '  - Results can be opened directly with "open <path>"',
  ],
  recovery: [
    'COMMAND: help recovery',
    '',
    'Review the emergency recovery options that can keep a run alive.',
    '',
    'TOOLS:',
    '  wait           - Lower detection briefly (limited uses)',
    '  hide           - Emergency escape at 90% risk',
    '  status         - Check current pressure before you commit',
    '',
    'Use recovery tools before the system forces your hand.',
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
    '  - When the case reaches major evidence milestones',
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
    'Attempt to leak your saved dossier to external channels.',
    '',
    'USAGE:',
    '  leak            - Initiate dossier leak',
    '',
    'REQUIREMENT: Save 10 files to your dossier first.',
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
    '  - Hints are LIMITED (8 per run)',
    '  - Hints react to your progress, risk, and missing leads',
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
    if (state.savedFiles.size >= 5) {
      return {
        output: [
          createEntry('warning', ''),
          createEntry('warning', '  COMMAND RESTRICTED — ELEVATED SECURITY PROTOCOL'),
          createEntry('warning', ''),
        ],
        stateChanges: {},
      };
    }

    // If a specific command is requested, show detailed help
    if (args.length > 0) {
      const cmdName = args[0].toLowerCase();

      // Show leak help even before evidence is found — command is visible but locked
      if (cmdName === 'basics') {
        return {
          output: getHelpBasics(),
          stateChanges: {},
        };
      }

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
      tSystem('helpMenu.title', 'TERMINAL COMMANDS'),
      '═══════════════════════════════════════════════════════════',
      '',
      tSystem('helpMenu.help', '  help [cmd]        Display help (or help for specific command)'),
      tSystem('helpMenu.basics', '  help basics      Starter guide for first-time players'),
      tSystem('helpMenu.status', '  status            Display system status'),
      tSystem('helpMenu.progress', '  progress          Review evidence and session recap'),
      tSystem('helpMenu.ls', '  ls                List directory contents'),
      tSystem('helpMenu.cd', '  cd <dir>          Change directory'),
      tSystem('helpMenu.open', '  open <file>       Open and display file contents'),
      tSystem('helpMenu.search', '  search <term>     Search visible files and contents'),
      tSystem('helpMenu.last', '  last              Re-display last opened file'),
      tSystem('helpMenu.unread', '  unread            List unread files'),
      tSystem('helpMenu.note', '  note <text>       Save a personal note'),
      tSystem('helpMenu.notes', '  notes             View all saved notes'),
      tSystem('helpMenu.bookmark', '  bookmark [file]   Bookmark a file (or view bookmarks)'),
      tSystem('helpMenu.chat', '  chat              Open secure relay channel'),
      tSystem('helpMenu.tree', '  tree              Show directory structure'),
      tSystem('helpMenu.morse', '  morse <text>      Decipher morse code messages'),
      tSystem('helpMenu.hint', '  hint              Request a hint (limited uses)'),
      tSystem('helpMenu.wait', '  wait              Lower detection briefly (limited)'),
      tSystem('helpMenu.hide', '  hide              Emergency escape at 90% risk'),
      tSystem('helpMenu.leak', '  leak              Leak your saved dossier'),
      tSystem(
        'helpMenu.override',
        '  override protocol <code>  Execute admin override'
      ),
      tSystem('helpMenu.tutorial', '  tutorial [on/off] Toggle tutorial tips or replay intro'),
      tSystem('helpMenu.save', '  save <file>       Save a file to your dossier'),
      tSystem('helpMenu.unsave', '  unsave <file>     Remove a file from your dossier'),
      tSystem('helpMenu.clear', '  clear             Clear terminal display'),
      '',
      tSystem('helpMenu.historyArrows', '  ↑/↓ arrows        Navigate command history'),
      tSystem('helpMenu.tab', '  Tab               Autocomplete commands and files'),
      tSystem('helpMenu.ctrlL', '  Ctrl+L            Clear terminal'),
      '',
    ];

    if (
      hasReadPsiMaterial(state) &&
      (state.evidenceCount || 0) >= 2 &&
      state.detectionLevel >= DETECTION_THRESHOLDS.STATUS_MED
    ) {
      helpLines.push(
        tSystem(
          'helpMenu.noticeAssistance',
          'NOTICE: If assistance appears before you finish typing, do not repeat it.'
        )
      );
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
      tSystem('status.title', 'SYSTEM STATUS'),
      '═══════════════════════════════════════════════════════════',
      '',
    ];

    // Detection surfacing - becomes more terse at high hostility
    if (state.detectionLevel < DETECTION_THRESHOLDS.STATUS_LOW) {
      lines.push(tSystem('status.logging.nominal', '  LOGGING: Nominal'));
    } else if (state.detectionLevel < DETECTION_THRESHOLDS.STATUS_MED) {
      lines.push(
        hostility >= 3
          ? tSystem('status.logging.activeShort', '  LOGGING: Active')
          : tSystem('status.logging.active', '  LOGGING: Active monitoring enabled')
      );
    } else if (state.detectionLevel < DETECTION_THRESHOLDS.STATUS_HIGH) {
      lines.push(
        hostility >= 3
          ? tSystem('status.logging.flaggedShort', '  LOGGING: FLAGGED')
          : tSystem('status.logging.flagged', '  LOGGING: WARNING — Audit trail flagged')
      );
    } else {
      lines.push(
        hostility >= 3
          ? tSystem('status.logging.criticalShort', '  LOGGING: CRITICAL')
          : tSystem('status.logging.critical', '  LOGGING: CRITICAL — Countermeasures engaged')
      );
    }

    // Attempts tracking - show remaining wrong attempts allowed
    const attemptsRemaining = 8 - (state.wrongAttempts || 0);
    if (attemptsRemaining >= 6) {
      lines.push(
        hostility >= 3
          ? tSystem('status.tolerance.normalShort', '  TOLERANCE: Normal')
          : tSystem('status.tolerance.normal', '  SYSTEM TOLERANCE: Normal')
      );
    } else if (attemptsRemaining >= 3) {
      lines.push(
        hostility >= 3
          ? tSystem('status.tolerance.reducedShort', '  TOLERANCE: Reduced')
          : tSystem('status.tolerance.reduced', '  SYSTEM TOLERANCE: Reduced — Errors noted')
      );
    } else if (attemptsRemaining >= 1) {
      lines.push(
        hostility >= 3
          ? tSystem('status.tolerance.criticalShort', '  TOLERANCE: CRITICAL')
          : tSystem(
              'status.tolerance.critical',
              '  SYSTEM TOLERANCE: CRITICAL — Few attempts remaining'
            )
      );
    } else {
      lines.push(
        hostility >= 3
          ? tSystem('status.tolerance.noneShort', '  TOLERANCE: NONE')
          : tSystem(
              'status.tolerance.exhausted',
              '  SYSTEM TOLERANCE: EXHAUSTED — Lockdown imminent'
            )
      );
    }

    // Session stability
    if (state.sessionStability > 80) {
      lines.push(tSystem('status.session.connected', '  SESSION: Connected'));
    } else if (state.sessionStability > 50) {
      lines.push(tSystem('status.session.intermittent', '  SESSION: Intermittent'));
    } else {
      lines.push(
        hostility >= 3
          ? tSystem('status.session.unstableShort', '  SESSION: UNSTABLE')
          : tSystem('status.session.unstable', '  SESSION: UNSTABLE — Connection degrading')
      );
    }

    // Access level (vague)
    if (state.accessLevel <= 1) {
      lines.push(tSystem('status.access.standard', '  ACCESS: Standard'));
    } else if (state.accessLevel <= 3) {
      lines.push(tSystem('status.access.elevated', '  ACCESS: Elevated'));
    } else {
      lines.push(tSystem('status.access.administrative', '  ACCESS: Administrative'));
    }

    const evidenceCount = countEvidence(state);
    lines.push(
      tSystem('status.evidenceConfirmed', '  EVIDENCE: {{count}}/10 confirmed', {
        count: evidenceCount,
      })
    );

    const savedFileCount = state.savedFiles?.size || 0;
    if (savedFileCount >= 10) {
      lines.push(
        tSystem(
          'status.objective.complete',
          '  OBJECTIVE: Dossier complete — review with "progress", then use "leak" when ready.'
        )
      );
    } else if (evidenceCount >= 10) {
      lines.push(
        tSystem(
          'status.objective.dossierIncomplete',
          '  OBJECTIVE: Evidence complete — save {{count}} more file(s) to your dossier before using "leak".',
          { count: 10 - savedFileCount }
        )
      );
    } else if (evidenceCount > 0) {
      lines.push(
        tSystem(
          'status.objective.progress',
          '  OBJECTIVE: Keep building the case. Use "progress", "unread", and "bookmark" to stay organized.'
        )
      );
    } else {
      lines.push(
        tSystem(
          'status.objective.start',
          '  OBJECTIVE: Start opening files. "help basics" and "search <term>" are safe ways to orient yourself.'
        )
      );
    }

    if (
      state.detectionLevel >= DETECTION_THRESHOLDS.HIDE_AVAILABLE &&
      !state.singularEventsTriggered?.has('hide_used')
    ) {
      lines.push(tSystem('status.recovery.hideAvailable', '  RECOVERY: "hide" is available now.'));
    } else if (state.detectionLevel >= DETECTION_THRESHOLDS.STATUS_HIGH) {
      const waitsLeft = state.waitUsesRemaining || 0;
      if (waitsLeft > 0) {
        lines.push(
          tSystem(
            waitsLeft === 1 ? 'status.recovery.waitAvailable.one' : 'status.recovery.waitAvailable.other',
            `  RECOVERY: "wait" can buy time (${waitsLeft} left).`,
            { value: waitsLeft }
          )
        );
      } else {
        lines.push(tSystem('status.recovery.none', '  RECOVERY: No wait uses remaining.'));
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
      lines.push(tSystem('status.attitude.studying', '  SYSTEM ATTITUDE: Studying you'));
    } else if (hostility >= 2) {
      lines.push('');
      lines.push(tSystem('status.attitude.listening', '  SYSTEM ATTITUDE: Listening'));
    }

    // Terrible Mistake indicator
    if (state.terribleMistakeTriggered) {
      lines.push('');
      lines.push(tSystem('status.purgeActive', '  ▓▓▓ PURGE PROTOCOL: ACTIVE ▓▓▓'));
      if (state.sessionDoomCountdown > 0) {
        lines.push(
          tSystem(
            'status.operationsRemaining',
            `  OPERATIONS REMAINING: ${state.sessionDoomCountdown}`,
            { value: state.sessionDoomCountdown }
          )
        );
      }
    }

    lines.push('');
    lines.push(tSystem('status.currentPath', `  CURRENT PATH: ${state.currentPath}`, { value: state.currentPath }));
    lines.push('');
    lines.push('═══════════════════════════════════════════════════════════');

    // Victory check
    if (checkVictory(state)) {
      lines.push('');
      lines.push(tSystem('status.sessionArchived', 'SESSION ARCHIVED'));
      return {
        output: createOutputEntries(lines),
        stateChanges: {},
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
    // No args = show usage
    if (args.length === 0) {
      return {
        output: [
          createEntry('system', ''),
          createEntry('system', tSystem('save.usage', '  USAGE: save <filename>')),
          createEntry(
            'system',
            tSystem('save.description', '  Save a file to your dossier for the leak.')
          ),
          createEntry(
            'system',
            tSystem('save.readFirst', '  You must have read the file first.')
          ),
          createEntry('system', ''),
          createEntry(
            'system',
            tSystem('save.dossierCountDetailed', '  Dossier: {{count}}/10 files saved', {
              count: state.savedFiles.size,
            })
          ),
          createEntry('system', ''),
        ],
        stateChanges: {},
      };
    }

    const filename = args.join(' ').trim();

    // Find the file in filesRead that matches
    const matchingPaths = [...state.filesRead].filter(path => {
      const name = path.split('/').pop() || '';
      return name.toLowerCase() === filename.toLowerCase() || path.toLowerCase().endsWith('/' + filename.toLowerCase());
    });

    if (matchingPaths.length === 0) {
      return {
        output: [
          createEntry('error', ''),
          createEntry(
            'error',
            tSystem('save.fileNotFoundTitle', '  FILE NOT FOUND IN MEMORY')
          ),
          createEntry(
            'error',
            tSystem(
              'save.fileNotFoundBody',
              '  You must open and read a file before saving it.'
            )
          ),
          createEntry('error', ''),
        ],
        stateChanges: {},
      };
    }

    const filePath = matchingPaths[0]; // Use first match

    // Check if already saved
    if (state.savedFiles.has(filePath)) {
      return {
        output: [
          createEntry('warning', ''),
          createEntry(
            'warning',
            tSystem('save.alreadySavedTitle', '  FILE ALREADY IN DOSSIER')
          ),
          createEntry(
            'warning',
            tSystem('save.fileLabel', '  {{file}}', { file: filePath.split('/').pop() || filename })
          ),
          createEntry('warning', ''),
        ],
        stateChanges: {},
      };
    }

    // Check if dossier is full
    if (state.savedFiles.size >= 10) {
      return {
        output: [
          createEntry('warning', ''),
          createEntry('warning', tSystem('save.fullTitle', '  DOSSIER FULL — 10/10 FILES SAVED')),
          createEntry(
            'warning',
            tSystem('save.fullBody', '  Use "unsave <filename>" to make room.')
          ),
          createEntry('warning', ''),
        ],
        stateChanges: {},
      };
    }

    // Save the file
    const newSavedFiles = new Set(state.savedFiles);
    newSavedFiles.add(filePath);

    const output = [
      createEntry('system', ''),
      createEntry(
        'system',
        tSystem('save.savedFile', '  ◉ FILE SAVED TO DOSSIER: {{file}}', {
          file: filePath.split('/').pop() || filename,
        })
      ),
      createEntry(
        'system',
        tSystem('save.dossierCount', '  Dossier: {{count}}/10', { count: newSavedFiles.size })
      ),
      createEntry('system', ''),
    ];

    const stateChanges: Partial<GameState> = {
      savedFiles: newSavedFiles,
      avatarExpression: 'smirk',
    };

    // Build result with sound trigger
    const result: CommandResult = {
      output,
      stateChanges,
      soundTrigger: 'evidence',
    };

    // After 10th save, add UFO74 message
    if (newSavedFiles.size === 10) {
      result.pendingUfo74Messages = [
        createEntry(
          'ufo74',
          tSystem(
            'save.readyToLeak',
            'UFO74: kid. you have enough. type "leak" when you are ready.'
          )
        ),
      ];
    }

    return result;
  },

  unsave: (args, state) => {
    if (args.length === 0) {
      return {
        output: [
          createEntry('system', ''),
          createEntry('system', tSystem('unsave.usage', '  USAGE: unsave <filename>')),
          createEntry(
            'system',
            tSystem('unsave.description', '  Remove a file from your dossier.')
          ),
          createEntry('system', ''),
        ],
        stateChanges: {},
      };
    }

    const filename = args.join(' ').trim();
    const matchingPaths = [...state.savedFiles].filter(path => {
      const name = path.split('/').pop() || '';
      return name.toLowerCase() === filename.toLowerCase();
    });

    if (matchingPaths.length === 0) {
      return {
        output: [
          createEntry('error', ''),
          createEntry('error', tSystem('unsave.fileNotFoundTitle', '  FILE NOT IN DOSSIER')),
          createEntry('error', ''),
        ],
        stateChanges: {},
      };
    }

    const filePath = matchingPaths[0];
    const newSavedFiles = new Set(state.savedFiles);
    newSavedFiles.delete(filePath);

    return {
      output: [
        createEntry('system', ''),
        createEntry(
          'system',
          tSystem('unsave.removedFile', '  ◎ FILE REMOVED FROM DOSSIER: {{file}}', {
            file: filePath.split('/').pop() || filename,
          })
        ),
        createEntry(
          'system',
          tSystem('save.dossierCount', '  Dossier: {{count}}/10', { count: newSavedFiles.size })
        ),
        createEntry('system', ''),
      ],
      stateChanges: { savedFiles: newSavedFiles },
    };
  },
};
