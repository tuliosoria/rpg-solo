// Inventory/management commands: note, notes, unread, progress, search, scan, decode, disconnect, release

import { GameState, TerminalEntry } from '../../types';
import {
  listDirectory,
  canAccessFile,
  getAllAccessibleFiles,
  getFileContent,
  fuzzyMatchFilename,
} from '../filesystem';
import { countEvidence, MAX_EVIDENCE_COUNT } from '../evidenceRevelation';
import { DETECTION_THRESHOLDS, MAX_DETECTION } from '../../constants/detection';
import { createEntry, createEntryI18n, createInvalidCommandResult } from './utils';
import { analyzeDossier, type DossierAnalysis, type DossierThreadId } from '../endings';
import { translateStatic } from '../../i18n';
import {
  ALPHA_RELEASE_INTRO,
  ALPHA_RELEASE_SEQUENCE,
  ALPHA_RELEASE_SUCCESS,
  ALPHA_ALREADY_RELEASED,
  ALPHA_FILE_NOT_FOUND,
} from '../../data/alpha';
import type { CommandRegistry } from './types';

const SEARCH_FUZZY_RESULT_LIMIT = 8;
const SEARCH_DETECTION_PENALTY = 2;
const BLOCKED_SEARCH_PENALTY = 5;

type TranslationValues = Record<string, string | number>;

function tInventory(key: string, fallback: string, values?: TranslationValues): string {
  return translateStatic(`engine.commands.inventory.${key}`, values, fallback);
}

const BLOCKED_SEARCH_TERMS = [
  'alien', 'aliens', 'ufo', 'ufos', 'classified', 'spaceship', 'spaceships',
  'et', 'extraterrestrial', 'extraterrestrials', 'creature', 'creatures',
  'varginha', 'saucer', 'saucers', 'coverup', 'cover-up', 'cover up',
  'ovni', 'ovnis', 'disco voador', 'extraterrestre', 'extraterrestres',
  'criatura', 'criaturas', 'encobrimento', 'autopsy',
];

function isBlockedSearchTerm(query: string): boolean {
  const lower = query.toLowerCase();
  return BLOCKED_SEARCH_TERMS.some(term => {
    if (lower === term) return true;
    // Use word boundary regex to match whole words only
    const regex = new RegExp(`\\b${term.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`, 'i');
    return regex.test(lower);
  });
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

const DOSSIER_THREAD_LABELS: Record<DossierThreadId, string> = {
  military: 'military chain of custody',
  medical: 'biological record',
  witness: 'civilian testimony',
  containment: 'containment trail',
  ufoCore: 'non-human origin',
  temporal: '2026 window',
  harvest: 'extraction model',
  comms: 'signal intercepts',
  diplomatic: 'foreign coordination',
};

function getThreadLabel(thread: DossierThreadId): string {
  return tInventory(`caseProfile.thread.${thread}`, DOSSIER_THREAD_LABELS[thread]);
}

function getDossierThreadSummary(analysis: DossierAnalysis): string {
  const labels = analysis.visibleThreads.slice(0, 4).map(getThreadLabel);

  if (labels.length === 0) {
    return tInventory(
      'caseProfile.thread.unresolved',
      'unresolved administrative residue'
    );
  }

  return labels.join(' / ');
}

function getDossierAssessment(analysis: DossierAnalysis): string {
  const {
    savedCount,
    counts: {
      corruptionFinancial,
      conspiracyUnrelated,
      honeypotTrap,
      medicalAutopsy,
      militaryCoverup,
      ufoCore,
      witness,
    },
  } = analysis;

  if (honeypotTrap >= 2) {
    return tInventory(
      'caseProfile.assessment.hostile',
      '  Assessment: the archive is pushing back. Some files want to be found too badly.'
    );
  }

  if (savedCount < 3) {
    return tInventory(
      'caseProfile.assessment.early',
      '  Assessment: fragments only. The terminal is still louder than the case.'
    );
  }

  if (corruptionFinancial + conspiracyUnrelated >= 5 && ufoCore <= 1) {
    return tInventory(
      'caseProfile.assessment.drifting',
      '  Assessment: the paper trail is drifting away from the Varginha event.'
    );
  }

  if (ufoCore >= 2 && medicalAutopsy >= 2 && witness >= 1 && militaryCoverup >= 2) {
    return tInventory(
      'caseProfile.assessment.coherent',
      '  Assessment: a coherent field case is forming; denial will need names and dates.'
    );
  }

  if (savedCount >= 5 && analysis.visibleThreads.length <= 2) {
    return tInventory(
      'caseProfile.assessment.narrow',
      '  Assessment: the case has weight, but one angle is doing too much work.'
    );
  }

  if (savedCount >= 5) {
    return tInventory(
      'caseProfile.assessment.disturbing',
      '  Assessment: enough signal to disturb someone; not yet enough to corner them.'
    );
  }

  return tInventory(
    'caseProfile.assessment.forming',
    '  Assessment: the shape is forming. Keep reading before the file chooses the story.'
  );
}

function getDossierPressureLine(state: GameState): string | null {
  if (state.detectionLevel >= DETECTION_THRESHOLDS.CRITICAL) {
    return tInventory(
      'caseProfile.pressure.critical',
      '  OBSERVER: an audit cursor is following each dossier change.'
    );
  }

  if (state.detectionLevel >= DETECTION_THRESHOLDS.ALERT) {
    return tInventory(
      'caseProfile.pressure.alert',
      '  OBSERVER: a second login is shadowing this session.'
    );
  }

  if (state.detectionLevel >= DETECTION_THRESHOLDS.SUSPICIOUS) {
    return tInventory(
      'caseProfile.pressure.suspicious',
      '  OBSERVER: access pattern has a human shape.'
    );
  }

  return null;
}

function buildDossierProfileEntries(state: GameState, savedFiles: Set<string>): TerminalEntry[] {
  if (savedFiles.size === 0) {
    return [];
  }

  const analysis = analyzeDossier(savedFiles);
  const pressureLine = getDossierPressureLine(state);
  const entries: TerminalEntry[] = [
    createEntry('system', tInventory('caseProfile.title', '  CASE PROFILE')),
    createEntry(
      'system',
      tInventory(
        'caseProfile.consequence',
        '  Saved files determine what the world believes.'
      )
    ),
    createEntry(
      'system',
      tInventory(
        'caseProfile.threads',
        '  Threads in dossier: {{threads}}',
        { threads: getDossierThreadSummary(analysis) }
      )
    ),
    createEntry('system', getDossierAssessment(analysis)),
  ];

  if (pressureLine) {
    entries.push(createEntry('warning', pressureLine));
  }

  return entries;
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
      // i18n: dynamic string
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
      // i18n: dynamic string
      output.push(createEntry('system', `  ... and ${unreadFiles.length - 15} more`));
    }

    output.push(createEntry('system', ''));
    output.push(createEntry('system', '═══════════════════════════════════════'));

    return { output, stateChanges: {} };
  },

  progress: (_args, state) => {
    const savedFiles = state.savedFiles || new Set();
    const savedCount = savedFiles.size;
    const discoveredCount = countEvidence(state);
    const leakProgress = state.leakSequenceProgress || 0;
    const output: TerminalEntry[] = [
      createEntry('system', ''),
      createEntry('system', '═══════════════════════════════════════'),
      createEntryI18n('system', 'engine.commands.inventory.dossier_leak_preparation', '  DOSSIER — LEAK PREPARATION'),
      createEntry('system', '═══════════════════════════════════════'),
      createEntry('system', ''),
      createEntryI18n('system', 'engine.commands.inventory.evidence_discovered_progress', `  Evidence discovered: ${discoveredCount}/${MAX_EVIDENCE_COUNT}`, { count: discoveredCount, total: MAX_EVIDENCE_COUNT }),
      createEntryI18n('system', 'engine.commands.inventory.files_saved_progress', `  Files saved: ${savedCount}/${MAX_EVIDENCE_COUNT}`, { count: savedCount, total: MAX_EVIDENCE_COUNT }),
      createEntry('system', ''),
    ];

    if (savedCount === 0) {
      output.push(createEntryI18n('dim', 'engine.commands.inventory.no_files_saved_use_save', '  No files saved. Use "save <filename>" after reading a file.'));
    } else {
      [...savedFiles].forEach((path, i) => {
        const name = path.split('/').pop() || path;
        output.push(createEntry('system', `  ${(i + 1).toString().padStart(2, ' ')}. ${name}`));
      });
    }

    output.push(createEntry('system', ''));
    output.push(...buildDossierProfileEntries(state, savedFiles));
    output.push(createEntry('system', ''));

    if (savedCount >= MAX_EVIDENCE_COUNT && leakProgress >= 3) {
      output.push(createEntryI18n('notice', 'engine.commands.inventory.ready_to_transmit', '  READY TO TRANSMIT — run "leak" to publish the dossier.'));
    } else if (savedCount >= MAX_EVIDENCE_COUNT) {
      output.push(createEntryI18n('notice', 'engine.commands.inventory.dossier_complete', '  DOSSIER COMPLETE — run "leak" and finish channel preparation.'));
    } else if (state.leakSequenceGenerated && leakProgress >= 3) {
      output.push(createEntryI18n('notice', 'engine.commands.inventory.channel_ready_keep_saving', `  LEAK CHANNEL READY — save ${MAX_EVIDENCE_COUNT - savedCount} more file(s), then run "leak".`, { remaining: MAX_EVIDENCE_COUNT - savedCount }));
    } else if (state.leakSequenceGenerated) {
      output.push(createEntryI18n('notice', 'engine.commands.inventory.channel_preparation_in_progress', '  LEAK PREP IN PROGRESS — run "leak" for the next channel step.'));
    } else if (savedCount >= 5) {
      output.push(createEntryI18n('notice', 'engine.commands.inventory.leak_preparation_available', '  LEAK PREP AVAILABLE — run "leak" to open the 3-step channel.'));
      output.push(createEntryI18n('dim', 'engine.commands.inventory.keep_saving_until_ten', '  Keep saving strong files until the dossier reaches 10/10.'));
    } else if (discoveredCount > savedCount) {
      output.push(createEntryI18n('dim', 'engine.commands.inventory.next_save_read_file', '  Next: save a strong file you already opened with "save <filename>".'));
    } else {
      output.push(createEntryI18n('dim', 'engine.commands.inventory.next_open_unread_file', '  Next: open unread files, or use "search" and "unread" to find leads.'));
    }

    if (savedCount < 5) {
      output.push(createEntryI18n('dim', 'engine.commands.inventory.files_needed_before_prep', `  ${5 - savedCount} more saved file(s) needed before leak preparation unlocks.`, { count: 5 - savedCount }));
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
          createEntryI18n('warning', 'engine.commands.elevated_security_protocol_warning', '  ⚠ ELEVATED SECURITY PROTOCOL — monitoring increased'),
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
    const directMatches = matches.filter(match => match.kind !== 'fuzzy');
    const visibleMatches =
      directMatches.length > 0
        ? directMatches
        : matches.slice(0, SEARCH_FUZZY_RESULT_LIMIT);
    const nextDetection = Math.min(MAX_DETECTION, state.detectionLevel + SEARCH_DETECTION_PENALTY);

    if (visibleMatches.length === 0) {
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

    visibleMatches.forEach((match, index) => {
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

    if (directMatches.length === 0 && matches.length > visibleMatches.length) {
      output.push(createEntry('system', ''));
      output.push(
        createEntryI18n(
          'system',
          'engine.commands.inventory.search_more_results',
          `  ... and ${matches.length - visibleMatches.length} more`,
          { value: matches.length - visibleMatches.length }
        )
      );
    }

    output.push(createEntry('system', ''));
    output.push(
      createEntryI18n(
        'system',
        'engine.commands.inventory.search_open_tip',
        'Use "open <path>" to inspect a result or "save <path>" to keep it.'
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
