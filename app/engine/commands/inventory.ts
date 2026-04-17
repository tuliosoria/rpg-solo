// Inventory/management commands: note, notes, bookmark, unread, progress, search, scan, decode, disconnect, release

import { GameState, TerminalEntry } from '../../types';
import {
  resolvePath,
  getNode,
  listDirectory,
  canAccessFile,
  getAllAccessibleFiles,
  getFileContent,
  fuzzyMatchFilename,
} from '../filesystem';
import { MAX_DETECTION } from '../../constants/detection';
import { createEntry, createEntryI18n, createInvalidCommandResult } from './utils';
import {
  ALPHA_RELEASE_INTRO,
  ALPHA_RELEASE_SEQUENCE,
  ALPHA_RELEASE_SUCCESS,
  ALPHA_ALREADY_RELEASED,
  ALPHA_FILE_NOT_FOUND,
} from '../../data/alpha';
import type { CommandRegistry } from './types';

const SEARCH_RESULT_LIMIT = 8;
const SEARCH_DETECTION_PENALTY = 2;
const BLOCKED_SEARCH_PENALTY = 5;

const BLOCKED_SEARCH_TERMS = [
  'alien', 'aliens', 'ufo', 'ufos', 'classified', 'spaceship', 'spaceships',
  'et', 'extraterrestrial', 'extraterrestrials', 'creature', 'creatures',
  'varginha', 'saucer', 'saucers', 'coverup', 'cover-up', 'cover up',
  'ovni', 'ovnis', 'disco voador', 'extraterrestre', 'extraterrestres',
  'criatura', 'criaturas', 'encobrimento',
];

function isBlockedSearchTerm(query: string): boolean {
  const lower = query.toLowerCase();
  return BLOCKED_SEARCH_TERMS.some(term => lower === term || lower.includes(term));
}

type SearchMatchKind = 'filename' | 'path' | 'content' | 'fuzzy';

interface SearchMatch {
  path: string;
  filename: string;
  kind: SearchMatchKind;
  preview?: string;
}

function getSearchPreview(content: string[], query: string): string | null {
  const normalizedQuery = query.toLowerCase();

  for (const line of content) {
    const normalizedLine = line.replace(/\s+/g, ' ').trim();
    if (normalizedLine.length === 0) {
      continue;
    }
    if (!normalizedLine.toLowerCase().includes(normalizedQuery)) {
      continue;
    }

    return normalizedLine.length > 76 ? `${normalizedLine.slice(0, 73)}...` : normalizedLine;
  }

  return null;
}

function findSearchMatches(query: string, state: GameState): SearchMatch[] {
  const normalizedQuery = query.toLowerCase();
  const matches: SearchMatch[] = [];

  for (const path of getAllAccessibleFiles(state)) {
    const filename = path.split('/').pop() || path;
    const filenameMatch = fuzzyMatchFilename(filename, query);
    const pathMatch = path.toLowerCase().includes(normalizedQuery);
    const content = getFileContent(path, state) || [];
    const preview = getSearchPreview(content, normalizedQuery);

    let kind: SearchMatchKind | null = null;
    if (filenameMatch === 'exact' || filenameMatch === 'contains') {
      kind = 'filename';
    } else if (pathMatch) {
      kind = 'path';
    } else if (preview) {
      kind = 'content';
    } else if (filenameMatch === 'fuzzy') {
      kind = 'fuzzy';
    }

    if (!kind) {
      continue;
    }

    matches.push({
      path,
      filename,
      kind,
      preview: preview ?? undefined,
    });
  }

  const matchOrder: Record<SearchMatchKind, number> = {
    filename: 0,
    path: 1,
    content: 2,
    fuzzy: 3,
  };

  return matches.sort((left, right) => {
    const rankDifference = matchOrder[left.kind] - matchOrder[right.kind];
    if (rankDifference !== 0) {
      return rankDifference;
    }

    return left.path.localeCompare(right.path);
  });
}

export const inventoryCommands: CommandRegistry = {
  note: (args, state) => {
    if (args.length === 0) {
      return {
        output: [
          createEntryI18n(
            'error',
            'engine.commands.inventory.error_specify_note_text',
            'ERROR: Specify note text'
          ),
          createEntryI18n(
            'system',
            'engine.commands.inventory.usage_note_your_text',
            'Usage: note <your text>'
          ),
          createEntryI18n(
            'system',
            'engine.commands.inventory.example_note_password_might_be_varginha1996',
            'Example: note password might be varginha1996'
          ),
        ],
        stateChanges: {},
      };
    }

    const noteText = args.join(' ');
    const newNotes = [...(state.playerNotes || []), { note: noteText, timestamp: Date.now() }];

    return {
      output: [
        createEntryI18n(
          'system',
          'engine.commands.inventory.noteSaved',
          `Note saved: "${noteText}"`,
          { value: noteText }
        ),
        createEntryI18n(
          'system',
          'engine.commands.inventory.notesTotal',
          `[${newNotes.length} notes total - use "notes" to view]`,
          { count: newNotes.length }
        ),
      ],
      stateChanges: {
        playerNotes: newNotes,
      },
    };
  },

  notes: (args, state) => {
    const notes = state.playerNotes || [];

    if (notes.length === 0) {
      return {
        output: [
          createEntryI18n(
            'system',
            'engine.commands.inventory.no_notes_saved_yet',
            'No notes saved yet'
          ),
          createEntryI18n(
            'system',
            'engine.commands.inventory.use_note_text_to_save_a_note',
            'Use: note <text> to save a note'
          ),
        ],
        stateChanges: {},
      };
    }

    const output: TerminalEntry[] = [
      createEntry('system', ''),
      createEntry('system', '═════════════════════════════════════════'),
      createEntryI18n(
        'system',
        'engine.commands.inventory.your_notes',
        '                 YOUR NOTES              '
      ),
      createEntry('system', '═════════════════════════════════════════'),
      createEntry('system', ''),
    ];

    notes.forEach((n, i) => {
      const time = new Date(n.timestamp).toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
      });
      output.push(createEntry('output', `  ${i + 1}. [${time}] ${n.note}`));
    });

    output.push(createEntry('system', ''));
    output.push(createEntry('system', '═════════════════════════════════════════'));
    output.push(createEntry('system', ''));

    return {
      output,
      stateChanges: {},
    };
  },

  bookmark: (args, state) => {
    if (args.length === 0) {
      // Show current bookmarks
      const bookmarks = state.bookmarkedFiles || new Set<string>();

      if (bookmarks.size === 0) {
        return {
          output: [
            createEntryI18n(
              'system',
              'engine.commands.inventory.no_bookmarks_saved',
              'No bookmarks saved'
            ),
            createEntryI18n(
              'system',
              'engine.commands.inventory.usage_bookmark_filename_to_bookmark_a_file',
              'Usage: bookmark <filename> to bookmark a file'
            ),
          ],
          stateChanges: {},
        };
      }

      const output: TerminalEntry[] = [
        createEntry('system', ''),
        createEntry('system', '═══════════════════════════════════════'),
        createEntryI18n(
          'system',
          'engine.commands.inventory.bookmarked_files',
          '             BOOKMARKED FILES          '
        ),
        createEntry('system', '═══════════════════════════════════════'),
        createEntry('system', ''),
      ];

      let index = 0;
      for (const path of bookmarks) {
        index += 1;
        const fileName = path.split('/').pop() || path;
        const isRead = state.filesRead?.has(path);
        output.push(createEntry('output', `  ${index}. ${fileName} ${isRead ? '[READ]' : ''}`));
        output.push(createEntry('system', `      └─ ${path}`));
      }

      output.push(createEntry('system', ''));
      output.push(createEntry('system', '═══════════════════════════════════════'));
      output.push(createEntry('system', ''));

      return { output, stateChanges: {} };
    }

    const filePath = resolvePath(args[0], state.currentPath);
    const node = getNode(filePath, state);

    if (!node || node.type !== 'file') {
      return {
        output: [
          createEntryI18n(
            'error',
            'engine.commands.inventory.fileNotFound',
            `ERROR: File not found: ${args[0]}`,
            { value: args[0] }
          ),
        ],
        stateChanges: {},
      };
    }

    const bookmarks = new Set(state.bookmarkedFiles || []);

    if (bookmarks.has(filePath)) {
      bookmarks.delete(filePath);
      return {
        output: [
          createEntryI18n(
            'system',
            'engine.commands.inventory.bookmarkRemoved',
            `Bookmark removed: ${filePath}`,
            { value: filePath }
          ),
        ],
        stateChanges: { bookmarkedFiles: bookmarks },
      };
    }

    bookmarks.add(filePath);
    const newBookmarkCount = bookmarks.size;
    return {
      output: [
        createEntryI18n(
          'system',
          'engine.commands.inventory.bookmarked',
          `Bookmarked: ${filePath}`,
          { value: filePath }
        ),
        createEntryI18n(
          'system',
          'engine.commands.inventory.use_bookmark_to_view_all_bookmarks',
          'Use "bookmark" to view all bookmarks'
        ),
      ],
      stateChanges: { bookmarkedFiles: bookmarks },
      checkAchievements: newBookmarkCount >= 5 ? ['bookworm'] : undefined,
    };
  },

  unread: (args, state) => {
    // Find all accessible files that haven't been read
    const unreadFiles: { path: string; status: string }[] = [];
    const MAX_SCAN_FILES = 100; // Performance limit
    let scannedCount = 0;

    const scanDirectory = (dirPath: string, depth: number = 0) => {
      // Limit recursion depth and total files scanned for performance
      if (depth > 5 || scannedCount >= MAX_SCAN_FILES) return;

      const entries = listDirectory(dirPath, state);
      if (!entries) return;

      for (const entry of entries) {
        if (scannedCount >= MAX_SCAN_FILES) break;

        const fullPath = dirPath === '/' ? `/${entry.name}` : `${dirPath}/${entry.name}`;

        if (entry.type === 'file') {
          scannedCount++;
          if (!state.filesRead?.has(fullPath)) {
            const access = canAccessFile(fullPath, state);
            if (access.accessible) {
              unreadFiles.push({ path: fullPath, status: entry.status || 'intact' });
            }
          }
        } else if (entry.type === 'dir') {
          scanDirectory(fullPath, depth + 1);
        }
      }
    };

    scanDirectory('/');

    if (unreadFiles.length === 0) {
      return {
        output: [
          createEntryI18n(
            'system',
            'engine.commands.inventory.all_accessible_files_have_been_read',
            'All accessible files have been read!'
          ),
          createEntryI18n(
            'system',
            'engine.commands.inventory.some_files_may_require_higher_access_levels',
            'Some files may require higher access levels.'
          ),
        ],
        stateChanges: {},
      };
    }

    const output: TerminalEntry[] = [
      createEntry('system', ''),
      createEntry('system', '═══════════════════════════════════════'),
      createEntry('system', `            UNREAD FILES (${unreadFiles.length})          `),
      createEntry('system', '═══════════════════════════════════════'),
      createEntry('system', ''),
    ];

    unreadFiles.slice(0, 15).forEach(file => {
      const fileName = file.path.split('/').pop() || file.path;
      const statusTag = file.status !== 'intact' ? ` [${file.status.toUpperCase()}]` : '';
      output.push(createEntry('output', `  ${fileName}${statusTag}`));
      output.push(createEntry('system', `    └─ ${file.path}`));
    });

    if (unreadFiles.length > 15) {
      output.push(createEntry('system', `  ... and ${unreadFiles.length - 15} more`));
    }

    output.push(createEntry('system', ''));
    output.push(createEntry('system', '═══════════════════════════════════════'));

    return { output, stateChanges: {} };
  },

  progress: (args, state) => {
    const savedFiles = state.savedFiles || new Set();
    const output: TerminalEntry[] = [
      createEntry('system', ''),
      createEntry('system', '═══════════════════════════════════════'),
      createEntry('system', '  DOSSIER — LEAK PREPARATION'),
      createEntry('system', '═══════════════════════════════════════'),
      createEntry('system', ''),
      createEntry('system', `  Files saved: ${savedFiles.size}/10`),
      createEntry('system', ''),
    ];

    if (savedFiles.size === 0) {
      output.push(createEntry('dim', '  No files saved. Use "save <filename>" after reading a file.'));
    } else {
      [...savedFiles].forEach((path, i) => {
        const name = path.split('/').pop() || path;
        output.push(createEntry('system', `  ${(i + 1).toString().padStart(2, ' ')}. ${name}`));
      });
    }

    output.push(createEntry('system', ''));

    if (savedFiles.size >= 10) {
      output.push(createEntry('notice', '  DOSSIER COMPLETE — type "leak" when ready.'));
    } else {
      output.push(createEntry('dim', `  ${10 - savedFiles.size} more file(s) needed before leak.`));
    }

    output.push(createEntry('system', ''));
    output.push(createEntry('system', '═══════════════════════════════════════'));
    output.push(createEntry('system', ''));

    return { output, stateChanges: {} };
  },

  search: (args, state) => {
    // Late-game tension: warn but still allow search
    const lateGameWarning = (state.savedFiles?.size || 0) >= 5
      ? [
          createEntry('warning', ''),
          createEntry('warning', '  ⚠ ELEVATED SECURITY PROTOCOL — monitoring increased'),
          createEntry('warning', ''),
        ]
      : [];

    const query = args.join(' ').trim();

    if (query.length === 0) {
      return {
        output: [
          ...lateGameWarning,
          createEntryI18n(
            'error',
            'engine.commands.inventory.error_specify_search_term',
            'ERROR: Specify a search term'
          ),
          createEntryI18n(
            'system',
            'engine.commands.inventory.usage_search_keyword',
            'Usage: search <keyword>'
          ),
          createEntryI18n(
            'system',
            'engine.commands.inventory.example_search_terms',
            'Examples: search crash | search quarantine | search 2026'
          ),
        ],
        stateChanges: {},
      };
    }

    if (isBlockedSearchTerm(query)) {
      const nextDetection = Math.min(MAX_DETECTION, state.detectionLevel + BLOCKED_SEARCH_PENALTY);
      return {
        output: [
          ...lateGameWarning,
          createEntry('system', ''),
          createEntry('system', '═══════════════════════════════════════'),
          createEntryI18n(
            'system',
            'engine.commands.inventory.search_results',
            '              SEARCH RESULTS           '
          ),
          createEntry('system', '═══════════════════════════════════════'),
          createEntry('system', ''),
          createEntryI18n(
            'error',
            'engine.commands.inventory.queryRejected',
            `  QUERY REJECTED — "${query}"`,
            { value: query }
          ),
          createEntry('system', ''),
        ],
        stateChanges: { detectionLevel: nextDetection },
        triggerFirewallTaunt: true,
        pendingUfo74Messages: [
          createEntryI18n(
            'ufo74',
            'engine.commands.inventory.ufo74CarefulFlagWords',
            'UFO74: careful. they flag those words. use what you find, not what you search.'
          ),
        ],
      };
    }

    const matches = findSearchMatches(query, state);
    const limitedMatches = matches.slice(0, SEARCH_RESULT_LIMIT);
    const nextDetection = Math.min(MAX_DETECTION, state.detectionLevel + SEARCH_DETECTION_PENALTY);

    if (limitedMatches.length === 0) {
      return {
        output: [
          ...lateGameWarning,
          createEntry('system', ''),
          createEntry('system', '═══════════════════════════════════════'),
          createEntryI18n(
            'system',
            'engine.commands.inventory.search_results',
            '              SEARCH RESULTS           '
          ),
          createEntry('system', '═══════════════════════════════════════'),
          createEntry('system', ''),
          createEntryI18n(
            'system',
            'engine.commands.inventory.no_search_results',
            'No accessible files matched "{{value}}".',
            { value: query }
          ),
          createEntryI18n(
            'system',
            'engine.commands.inventory.search_try_broader_terms',
            'Try broader terms, "tree", or "unread" to widen the search.'
          ),
          createEntry('system', ''),
        ],
        stateChanges: { detectionLevel: nextDetection },
      };
    }

    const output: TerminalEntry[] = [
      ...lateGameWarning,
      createEntry('system', ''),
      createEntry('system', '═══════════════════════════════════════'),
      createEntryI18n(
        'system',
        'engine.commands.inventory.search_results',
        '              SEARCH RESULTS           '
      ),
      createEntry('system', '═══════════════════════════════════════'),
      createEntry('system', ''),
      createEntryI18n('output', 'engine.commands.inventory.search_query', `  QUERY: ${query}`, {
        value: query,
      }),
      createEntry('system', ''),
    ];

    limitedMatches.forEach((match, index) => {
      const key =
        match.kind === 'filename'
          ? 'engine.commands.inventory.search_result.filename'
          : match.kind === 'path'
            ? 'engine.commands.inventory.search_result.path'
            : match.kind === 'content'
              ? 'engine.commands.inventory.search_result.content'
              : 'engine.commands.inventory.search_result.fuzzy';
      const fallback =
        match.kind === 'filename'
          ? `  ${index + 1}. ${match.path} [NAME]`
          : match.kind === 'path'
            ? `  ${index + 1}. ${match.path} [PATH]`
            : match.kind === 'content'
              ? `  ${index + 1}. ${match.path} [TEXT]`
              : `  ${index + 1}. ${match.path} [FUZZY]`;

      output.push(createEntryI18n('output', key, fallback, { index: index + 1, path: match.path }));
      if (match.preview && match.kind === 'content') {
        output.push(createEntry('system', `      "${match.preview}"`));
      }
    });

    if (matches.length > limitedMatches.length) {
      output.push(createEntry('system', ''));
      output.push(
        createEntryI18n(
          'system',
          'engine.commands.inventory.search_more_results',
          `  ... and ${matches.length - limitedMatches.length} more`,
          { value: matches.length - limitedMatches.length }
        )
      );
    }

    output.push(createEntry('system', ''));
    output.push(
      createEntryI18n(
        'system',
        'engine.commands.inventory.search_open_tip',
        'Use "open <path>" to inspect a result or "bookmark <path>" to save it.'
      )
    );
    output.push(createEntry('system', ''));

    return {
      output,
      stateChanges: { detectionLevel: nextDetection },
    };
  },

  scan: (args, state) => {
    if (!state.hiddenCommandsDiscovered?.has('scan')) {
      // Hidden command not discovered - treat as invalid command
      return createInvalidCommandResult(state, 'scan');
    }

    // Increase detection significantly
    const newDetection = Math.min(MAX_DETECTION, state.detectionLevel + 10); // was 15, reduced for pacing

    return {
      output: [
        createEntry('system', ''),
        createEntryI18n(
          'warning',
          'engine.commands.inventory.deep_scan_initiated',
          '  ▓ DEEP SCAN INITIATED ▓'
        ),
        createEntry('system', ''),
        createEntryI18n(
          'system',
          'engine.commands.inventory.scanning_for_hidden_filesystem_entries',
          '  Scanning for hidden filesystem entries...'
        ),
        createEntryI18n(
          'system',
          'engine.commands.inventory.revealing_masked_nodes',
          '  Revealing masked nodes...'
        ),
        createEntry('warning', ''),
        createEntryI18n(
          'warning',
          'engine.commands.inventory.scan_complete_hidden_paths_may_now_be_visible',
          '  [!] Scan complete. Hidden paths may now be visible.'
        ),
        createEntryI18n(
          'warning',
          'engine.commands.inventory.detection_risk_elevated',
          '  [!] Detection risk: ELEVATED'
        ),
        createEntry('system', ''),
      ],
      stateChanges: {
        detectionLevel: newDetection,
        flags: { ...state.flags, adminUnlocked: true },
      },
    };
  },

  decode: (args, state) => {
    // Hidden command - must be discovered first
    if (!state.hiddenCommandsDiscovered?.has('decode')) {
      // Hidden command not discovered - treat as invalid command
      return createInvalidCommandResult(state, 'decode');
    }

    const attempt = args.join(' ').toLowerCase().trim();

    if (!attempt) {
      return {
        output: [
          createEntryI18n(
            'system',
            'engine.commands.inventory.usage_decode_text',
            'Usage: decode <text>'
          ),
        ],
        stateChanges: {},
      };
    }

    // The cipher answer is "the truth is not what they told you"
    // ROT13 of "the" = "gur" - accept partial answers
    if (
      attempt === 'the' ||
      attempt === 'the truth' ||
      attempt === 'the truth is not what they told you'
    ) {
      return {
        output: [
          createEntry('system', ''),
          createEntryI18n(
            'ufo74',
            'engine.commands.inventory.ufo74_decryption_successful',
            '[UFO74]: Decryption successful.'
          ),
          createEntryI18n(
            'ufo74',
            'engine.commands.inventory.ufo74_the_truth_is_not_what_they_told_you',
            '[UFO74]: "The truth is not what they told you."'
          ),
          createEntry('warning', ''),
          createEntryI18n(
            'ufo74',
            'engine.commands.inventory.ufo74_you_understand_now_the_official_reports',
            '[UFO74]: You understand now. The official reports...'
          ),
          createEntryI18n(
            'ufo74',
            'engine.commands.inventory.ufo74_they_were_never_meant_to_be_accurate',
            '[UFO74]: They were never meant to be accurate.'
          ),
          createEntry('system', ''),
        ],
        stateChanges: {
          disinformationDiscovered: new Set([
            ...(state.disinformationDiscovered || []),
            'cipher_decoded',
          ]),
        },
      };
    }

    const cipherAttempts = (state.cipherAttempts || 0) + 1;

    if (cipherAttempts >= 3) {
      return {
        output: [
          createEntryI18n(
            'ufo74',
            'engine.commands.inventory.ufo74_still_struggling_with_the_cipher',
            '[UFO74]: Still struggling with the cipher?'
          ),
          createEntryI18n(
            'ufo74',
            'engine.commands.inventory.ufo74_try_applying_rot13_classic_but_effective',
            '[UFO74]: Try applying ROT13. Classic but effective.'
          ),
        ],
        stateChanges: { cipherAttempts },
      };
    }

    return {
      output: [
        createEntryI18n(
          'system',
          'engine.commands.inventory.decryption_failed_pattern_not_recognized',
          'Decryption failed. Pattern not recognized.'
        ),
      ],
      stateChanges: { cipherAttempts },
    };
  },

  disconnect: (args, state) => {
    if (!state.hiddenCommandsDiscovered?.has('disconnect')) {
      // Hidden command not discovered - treat as invalid command
      return createInvalidCommandResult(state, 'disconnect');
    }

    // If evidence not saved, neutral ending
    if (!state.evidencesSaved) {
      return {
        output: [
          createEntry('system', ''),
          createEntryI18n('warning', 'engine.commands.inventory.disconnecting', 'DISCONNECTING...'),
          createEntry('error', ''),
          createEntry('error', '▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓'),
          createEntry('warning', ''),
          createEntryI18n('warning', 'runtime.connectionSevered', 'Connection severed.'),
          createEntryI18n(
            'warning',
            'engine.commands.inventory.evidence_not_saved_files_lost_in_disconnection',
            'Evidence not saved. Files lost in disconnection.'
          ),
          createEntryI18n(
            'warning',
            'engine.commands.inventory.you_escaped_but_the_truth_remains_buried',
            'You escaped... but the truth remains buried.'
          ),
          createEntry('error', ''),
          createEntry('error', '▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓'),
        ],
        stateChanges: {
          isGameOver: true,
          gameOverReason: 'NEUTRAL ENDING - DISCONNECTED',
          endingType: 'neutral',
        },
        skipToPhase: 'neutral_ending' as const,
        triggerFlicker: true,
        delayMs: 2000,
      };
    }

    return {
      output: [
        createEntryI18n(
          'system',
          'engine.commands.inventory.cannot_disconnect_connection_transfer_in_progress',
          'Cannot disconnect — connection transfer in progress.'
        ),
        createEntryI18n(
          'warning',
          'engine.commands.inventory.evidence_files_are_being_relayed_stand_by',
          'Evidence files are being relayed. Stand by.'
        ),
      ],
      stateChanges: {},
    };
  },

  release: (args, state) => {
    const target = args.join(' ').toLowerCase().trim();

    // Check for ALPHA variants
    const validTargets = ['alpha', 'codename alpha', 'subject alpha'];
    const isReleasingAlpha = validTargets.some(t => target.includes(t));

    if (!isReleasingAlpha) {
      // Not releasing ALPHA - show generic error
      return {
        output: [
          createEntry('system', ''),
          createEntryI18n(
            'error',
            'engine.commands.inventory.release_command_requires_target',
            'RELEASE COMMAND REQUIRES TARGET'
          ),
          createEntry('system', ''),
          createEntryI18n(
            'system',
            'engine.commands.inventory.usage_release_subject_id',
            'Usage: release <subject_id>'
          ),
          createEntry('system', ''),
        ],
        stateChanges: {},
      };
    }

    // Check if player has discovered ALPHA files
    const hasDiscoveredAlpha = Array.from(state.filesRead).some(
      f => f.includes('alpha_journal') || f.includes('alpha_neural') || f.includes('alpha_autopsy')
    );

    if (!hasDiscoveredAlpha) {
      const output = ALPHA_FILE_NOT_FOUND.map(line =>
        createEntry(line.includes('ERROR') ? 'error' : 'system', line)
      );
      return {
        output,
        stateChanges: {},
      };
    }

    // Check if already released
    if (state.flags.alphaReleased) {
      const output = ALPHA_ALREADY_RELEASED.map(line =>
        createEntry(line.includes('ERROR') ? 'error' : 'system', line)
      );
      return {
        output,
        stateChanges: {},
      };
    }

    // Execute release!
    const output: TerminalEntry[] = [];

    // Intro
    for (const line of ALPHA_RELEASE_INTRO) {
      output.push(
        createEntry(
          line.includes('▓') ? 'warning' : line.includes('COMMAND') ? 'notice' : 'system',
          line
        )
      );
    }

    // Sequence
    for (const line of ALPHA_RELEASE_SEQUENCE) {
      output.push(
        createEntry(
          line.includes('WARNING') ? 'error' : line.includes('>') ? 'notice' : 'output',
          line
        )
      );
    }

    // Success
    for (const line of ALPHA_RELEASE_SUCCESS) {
      output.push(
        createEntry(
          line.includes('▓▓▓')
            ? 'notice'
            : line.includes('UFO74:')
              ? 'ufo74'
              : line.includes('═')
                ? 'warning'
                : line.startsWith('  ...')
                  ? 'warning'
                  : 'output',
          line
        )
      );
    }

    return {
      output,
      stateChanges: {
        flags: {
          ...state.flags,
          alphaReleased: true,
        },
        detectionLevel: Math.min(MAX_DETECTION, state.detectionLevel + 15),
      },
      delayMs: 3000,
      triggerFlicker: true,
      imageTrigger: {
        src: '/images/et.webp',
        alt: 'ALPHA - The surviving Varginha being',
        altKey: 'media.alt.alphaSurvivor',
        tone: 'eerie',
      },
    };
  },
};
