// Inventory/management commands: note, notes, bookmark, unread, progress, scan, decode, disconnect, release

import { TerminalEntry } from '../../types';
import {
  resolvePath,
  getNode,
  listDirectory,
  canAccessFile,
} from '../filesystem';
import { countEvidence, getCaseStrengthDescription } from '../evidenceRevelation';
import { DETECTION_THRESHOLDS, MAX_DETECTION } from '../../constants/detection';
import {
  createEntry,
  createInvalidCommandResult,
} from './utils';
import {
  PRISONER46_RELEASE_INTRO,
  PRISONER46_RELEASE_SEQUENCE,
  PRISONER46_RELEASE_SUCCESS,
  PRISONER46_ALREADY_RELEASED,
  PRISONER46_FILE_NOT_FOUND,
} from '../../data/prisoner46';
import type { CommandRegistry } from './types';

export const inventoryCommands: CommandRegistry = {
  note: (args, state) => {
    if (args.length === 0) {
      return {
        output: [
          createEntry('error', 'ERROR: Specify note text'),
          createEntry('system', 'Usage: note <your text>'),
          createEntry('system', 'Example: note password might be varginha1996'),
        ],
        stateChanges: {},
      };
    }

    const noteText = args.join(' ');
    const newNotes = [...(state.playerNotes || []), { note: noteText, timestamp: Date.now() }];

    return {
      output: [
        createEntry('system', `Note saved: "${noteText}"`),
        createEntry('system', `[${newNotes.length} notes total - use "notes" to view]`),
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
          createEntry('system', 'No notes saved yet'),
          createEntry('system', 'Use: note <text> to save a note'),
        ],
        stateChanges: {},
      };
    }

    const output: TerminalEntry[] = [
      createEntry('system', ''),
      createEntry('system', '═════════════════════════════════════════'),
      createEntry('system', '                 YOUR NOTES              '),
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
            createEntry('system', 'No bookmarks saved'),
            createEntry('system', 'Usage: bookmark <filename> to bookmark a file'),
          ],
          stateChanges: {},
        };
      }

      const output: TerminalEntry[] = [
        createEntry('system', ''),
        createEntry('system', '═══════════════════════════════════════'),
        createEntry('system', '             BOOKMARKED FILES          '),
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
        output: [createEntry('error', `ERROR: File not found: ${args[0]}`)],
        stateChanges: {},
      };
    }

    const bookmarks = new Set(state.bookmarkedFiles || []);

    if (bookmarks.has(filePath)) {
      bookmarks.delete(filePath);
      return {
        output: [createEntry('system', `Bookmark removed: ${filePath}`)],
        stateChanges: { bookmarkedFiles: bookmarks },
      };
    }

    bookmarks.add(filePath);
    const newBookmarkCount = bookmarks.size;
    return {
      output: [
        createEntry('system', `Bookmarked: ${filePath}`),
        createEntry('system', 'Use "bookmark" to view all bookmarks'),
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
          createEntry('system', 'All accessible files have been read!'),
          createEntry('system', 'Some files may require higher access levels.'),
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
    // Show player progress summary with evidence files collected
    // IMPORTANT: Use file names only - no story spoilers
    const filesReadCount = state.filesRead?.size || 0;
    const bookmarksCount = state.bookmarkedFiles?.size || 0;
    const notesCount = state.playerNotes?.length || 0;

    // Get evidence count
    const evidenceCount = countEvidence(state);
    const caseStrength = getCaseStrengthDescription(state);

    const output: TerminalEntry[] = [
      createEntry('system', ''),
      createEntry('system', '╔═══════════════════════════════════════════════════════╗'),
      createEntry('system', '║            INVESTIGATION PROGRESS                     ║'),
      createEntry('system', '╠═══════════════════════════════════════════════════════╣'),
      createEntry('system', ''),
    ];

    // Show evidence count
    output.push(createEntry('system', '  EVIDENCE COLLECTED:'));
    output.push(createEntry('system', ''));
    output.push(createEntry('output', `    Evidence Found: ${evidenceCount}/5`));
    output.push(createEntry('system', ''));

    output.push(createEntry('system', '  ─────────────────────────────────────────────'));

    // Case strength summary (neutral phrasing)
    output.push(createEntry('system', ''));
    output.push(createEntry('output', `  CASE STATUS: ${evidenceCount}/5 evidence confirmed`));
    output.push(createEntry('system', `  STRENGTH: ${caseStrength}`));
    output.push(createEntry('system', ''));

    // Session Statistics
    output.push(createEntry('system', '  ─────────────────────────────────────────────'));
    output.push(createEntry('system', '  SESSION STATISTICS:'));
    output.push(createEntry('output', `    Files examined: ${filesReadCount}`));
    output.push(createEntry('output', `    Bookmarks: ${bookmarksCount}  |  Notes: ${notesCount}`));
    output.push(createEntry('system', ''));

    // Detection warning
    if (state.detectionLevel >= DETECTION_THRESHOLDS.ALERT) {
      output.push(createEntry('error', '  ⚠ CRITICAL: Detection level dangerously high'));
    } else if (state.detectionLevel >= DETECTION_THRESHOLDS.HOSTILITY_LOW) {
      output.push(createEntry('warning', '  ⚠ WARNING: Detection level elevated'));
    }

    output.push(createEntry('system', ''));
    output.push(createEntry('system', '╚═══════════════════════════════════════════════════════╝'));
    output.push(createEntry('system', ''));

    return { output, stateChanges: {} };
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
        createEntry('warning', '  ▓ DEEP SCAN INITIATED ▓'),
        createEntry('system', ''),
        createEntry('system', '  Scanning for hidden filesystem entries...'),
        createEntry('system', '  Revealing masked nodes...'),
        createEntry('warning', ''),
        createEntry('warning', '  [!] Scan complete. Hidden paths may now be visible.'),
        createEntry('warning', '  [!] Detection risk: ELEVATED'),
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
        output: [createEntry('system', 'Usage: decode <text>')],
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
          createEntry('ufo74', '[UFO74]: Decryption successful.'),
          createEntry('ufo74', '[UFO74]: "The truth is not what they told you."'),
          createEntry('warning', ''),
          createEntry('ufo74', '[UFO74]: You understand now. The official reports...'),
          createEntry('ufo74', '[UFO74]: They were never meant to be accurate.'),
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
          createEntry('ufo74', '[UFO74]: Still struggling with the cipher?'),
          createEntry('ufo74', '[UFO74]: Try applying ROT13. Classic but effective.'),
        ],
        stateChanges: { cipherAttempts },
      };
    }

    return {
      output: [createEntry('system', 'Decryption failed. Pattern not recognized.')],
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
          createEntry('warning', 'DISCONNECTING...'),
          createEntry('error', ''),
          createEntry('error', '▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓'),
          createEntry('warning', ''),
          createEntry('warning', 'Connection severed.'),
          createEntry('warning', 'Evidence not saved. Files lost in disconnection.'),
          createEntry('warning', 'You escaped... but the truth remains buried.'),
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
        createEntry('system', 'Cannot disconnect — connection transfer in progress.'),
        createEntry('warning', 'Evidence files are being relayed. Stand by.'),
      ],
      stateChanges: {},
    };
  },

  release: (args, state) => {
    const target = args.join(' ').toLowerCase().trim();
    
    // Check for P46 / prisoner46 variants
    const validTargets = ['p46', 'prisoner46', 'prisoner 46', 'p-46'];
    const isReleasingP46 = validTargets.some(t => target.includes(t));
    
    if (!isReleasingP46) {
      // Not releasing P46 - show generic error
      return {
        output: [
          createEntry('system', ''),
          createEntry('error', 'RELEASE COMMAND REQUIRES TARGET'),
          createEntry('system', ''),
          createEntry('system', 'Usage: release <subject_id>'),
          createEntry('system', ''),
        ],
        stateChanges: {},
      };
    }
    
    // Check if player has discovered Prisoner 46 files
    const hasDiscoveredP46 = Array.from(state.filesRead).some(f => 
      f.includes('prisoner46') || f.includes('p46_')
    );
    
    if (!hasDiscoveredP46) {
      const output = PRISONER46_FILE_NOT_FOUND.map(line =>
        createEntry(line.includes('ERROR') ? 'error' : 'system', line)
      );
      return {
        output,
        stateChanges: {},
      };
    }
    
    // Check if already released
    if (state.flags.prisoner46Released) {
      const output = PRISONER46_ALREADY_RELEASED.map(line =>
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
    for (const line of PRISONER46_RELEASE_INTRO) {
      output.push(createEntry(line.includes('▓') ? 'warning' : line.includes('COMMAND') ? 'notice' : 'system', line));
    }
    
    // Sequence
    for (const line of PRISONER46_RELEASE_SEQUENCE) {
      output.push(createEntry(
        line.includes('WARNING') ? 'error' :
        line.includes('>') ? 'notice' :
        'output',
        line
      ));
    }
    
    // Success
    for (const line of PRISONER46_RELEASE_SUCCESS) {
      output.push(createEntry(
        line.includes('▓▓▓') ? 'notice' :
        line.includes('UFO74:') ? 'ufo74' :
        line.includes('═') ? 'warning' :
        line.startsWith('  ...') ? 'warning' :
        'output',
        line
      ));
    }
    
    return {
      output,
      stateChanges: {
        flags: {
          ...state.flags,
          prisoner46Released: true,
        },
        detectionLevel: Math.min(MAX_DETECTION, state.detectionLevel + 15),
      },
      delayMs: 3000,
      triggerFlicker: true,
      imageTrigger: {
        src: '/images/et-standing.webp',
        alt: 'Prisoner 46 - The surviving Varginha being',
        tone: 'eerie',
      },
    };
  },
};
