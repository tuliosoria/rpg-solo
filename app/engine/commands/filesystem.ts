// Filesystem commands: ls, cd, open, tree

import { GameState, TerminalEntry, FileNode, ImageTrigger } from '../../types';
import {
  resolvePath,
  getNode,
  listDirectory,
  getFileContent,
  canAccessFile,
} from '../filesystem';
import { createSeededRng, seededRandomInt } from '../rng';
import { UFO74_CONSPIRACY_REACTIONS, CONSPIRACY_FILE_NAMES } from '../../data/conspiracyFiles';
import { MAX_DETECTION } from '../../constants/detection';
import {
  createEntry,
  createEntryI18n,
  createOutputEntries,
  calculateDelay,
  createUFO74Message,
} from './utils';
import {
  getWarmupAdjustedDetection,
  isArchiveOnlyFile,
  EVIDENCE_UFO74_REACTIONS,
  applyEvidenceDiscovery,
} from './helpers';
import type { CommandRegistry } from './types';

export function setCommandsRef(_cmds: CommandRegistry) {}

export const filesystemCommands: CommandRegistry = {
  ls: (args, state) => {
    // Check for -l flag
    const longFormat = args.includes('-l');

    const entries = listDirectory(state.currentPath, state);

    if (!entries) {
      return {
        output: [
          createEntryI18n(
            'error',
            'engine.commands.filesystem.error_cannot_read_directory',
            'ERROR: Cannot read directory'
          ),
        ],
        stateChanges: {},
      };
    }

    const allEntries = [...entries];

    const lines: string[] = [];
    lines.push('');
    lines.push(`Directory: ${state.currentPath}`);
    lines.push('');

    if (allEntries.length === 0) {
      lines.push('  (empty)');
    } else {
      for (const entry of allEntries) {
        let line = `  ${entry.name}`;
        const fullPath =
          state.currentPath === '/' ? `/${entry.name}` : `${state.currentPath}/${entry.name}`;

        // Show markers for files
        if (entry.type === 'file') {
          const showStatusTag =
            !!entry.status &&
            !['intact', 'encrypted', 'restricted', 'restricted_briefing', 'unstable'].includes(
              entry.status
            );

          const fileContent = getFileContent(fullPath, state);

          if (state.bookmarkedFiles?.has(fullPath)) {
            line += ' ★';
          }

          if (state.filesRead?.has(fullPath)) {
            line += ' [READ]';
          } else {
            line += ' [UNREAD]';
          }

          // Reading time estimate (based on content length)
          if (fileContent && fileContent.length > 0) {
            const wordCount = fileContent.join(' ').split(/\s+/).length;
            const readingMinutes = Math.ceil(wordCount / 200); // ~200 words per minute
            if (readingMinutes >= 2) {
              line += ` [~${readingMinutes}min]`;
            }
          }

          // Long format: prominent status tags and content preview
          if (longFormat) {
            // Prominent status tag
            if (showStatusTag) {
              const statusLabel = (entry.status ?? 'intact').toUpperCase();
              line = `  ${entry.name}  [${statusLabel}]`;
            }

            if (fileContent && fileContent.length > 0) {
              const firstLine = fileContent.find(l => l.trim().length > 0) || '';
              const preview = firstLine.length > 30 ? firstLine.slice(0, 27) + '...' : firstLine;
              if (preview) {
                line += `  "${preview}"`;
              }
            }
          }
        }

        // Standard format: status tags at end (only if not long format)
        if (
          !longFormat &&
          entry.status &&
          !['intact', 'encrypted', 'restricted', 'restricted_briefing', 'unstable'].includes(
            entry.status
          )
        ) {
          line += ` [${entry.status.toUpperCase()}]`;
        }
        lines.push(line);
      }
    }

    lines.push('');

    // Handle archive mode action decrement
    let stateChanges: Partial<GameState> = {
      detectionLevel: getWarmupAdjustedDetection(state, 2),
    };

    if (!state.tutorialComplete) {
      delete stateChanges.detectionLevel;
    }

    // Clean up any stale archive-mode flags from older saves.
    if (state.inArchiveMode) {
      stateChanges = {
        ...stateChanges,
        inArchiveMode: false,
        archiveActionsRemaining: 0,
        archiveTimestamp: '',
      };
    }

    return {
      output: createOutputEntries(lines),
      stateChanges,
      delayMs: calculateDelay(state),
    };
  },

  cd: (args, state) => {
    if (args.length === 0) {
      return {
        output: [
          createEntryI18n(
            'error',
            'engine.commands.filesystem.error_specify_directory',
            'ERROR: Specify directory'
          ),
          createEntry('system', ''),
          createEntryI18n(
            'ufo74',
            'engine.commands.filesystem.ufo74_use_ls_to_see_directories_then_cd_dirname_to_enter_one',
            '[UFO74]: use "ls" to see directories, then "cd <dirname>" to enter one.'
          ),
        ],
        stateChanges: {},
      };
    }

    const targetPath = resolvePath(args[0], state.currentPath);
    const node = getNode(targetPath, state);

    if (!node) {
      const stateChanges: Partial<GameState> = {
        detectionLevel: getWarmupAdjustedDetection(state, 3),
      };

      if (!state.tutorialComplete) {
        delete stateChanges.detectionLevel;
      }

      return {
        output: [
          createEntry('error', `ERROR: Directory not found: ${args[0]}`),
          createEntry('system', ''),
          createEntryI18n(
            'ufo74',
            'engine.commands.filesystem.ufo74_use_ls_to_see_whats_in_the_current_directory',
            '[UFO74]: use "ls" to see whats in the current directory.'
          ),
        ],
        stateChanges,
      };
    }

    if (node.type !== 'dir') {
      return {
        output: [
          createEntry('error', `ERROR: Not a directory: ${args[0]}`),
          createEntryI18n(
            'system',
            'engine.commands.filesystem.hint_cd_is_used_for_directories_only',
            `  HINT: 'cd' is used for directories only.`
          ),
          createEntry('system', `  To read a file use 'cat ${args[0]}' or 'open ${args[0]}'.`),
          createEntry('system', ''),
          createEntry('ufo74', '[UFO74]: thats a file. try: open ' + args[0]),
        ],
        stateChanges: {},
      };
    }

    const output: TerminalEntry[] = [createEntry('output', `Changed to: ${targetPath}`)];

    // Push current path to navigation history (for 'back' command)
    const updatedHistory = [...(state.navigationHistory || []), state.currentPath];

    const stateChanges: Partial<GameState> = {
      currentPath: targetPath,
      detectionLevel: getWarmupAdjustedDetection(state, 1),
      navigationHistory: updatedHistory,
    };

    if (!state.tutorialComplete) {
      delete stateChanges.detectionLevel;
    }

    return {
      output,
      stateChanges,
    };
  },

  open: (args, state) => {
    if (args.length === 0) {
      return {
        output: [
          createEntryI18n(
            'error',
            'engine.commands.filesystem.error_specify_file',
            'ERROR: Specify file'
          ),
          createEntry('system', ''),
          createEntryI18n(
            'ufo74',
            'engine.commands.filesystem.ufo74_use_ls_to_see_files_then_open_filename_to_read_one',
            '[UFO74]: use "ls" to see files, then "open <filename>" to read one.'
          ),
        ],
        stateChanges: {},
      };
    }

    const filePath = resolvePath(args[0], state.currentPath);

    // Archive/rewind access has been retired; keep legacy archive-only paths unavailable.
    if (isArchiveOnlyFile(filePath)) {
      return {
        output: [
          createEntryI18n(
            'error',
            'engine.commands.filesystem.error_file_not_found',
            'ERROR: File not found'
          ),
          createEntry('system', ''),
          createEntryI18n(
            'ufo74',
            'engine.commands.filesystem.ufo74_use_ls_to_see_whats_here',
            '[UFO74]: use "ls" to see whats here.'
          ),
        ],
        stateChanges: state.inArchiveMode
          ? {
              inArchiveMode: false,
              archiveActionsRemaining: 0,
              archiveTimestamp: '',
            }
          : {},
      };
    }

    const access = canAccessFile(filePath, state);

    if (!access.accessible) {
      const stateChanges: Partial<GameState> = {
        detectionLevel: getWarmupAdjustedDetection(state, 5),
        legacyAlertCounter: state.legacyAlertCounter + 1,
      };

      if (!state.tutorialComplete) {
        delete stateChanges.detectionLevel;
        delete stateChanges.legacyAlertCounter;
      }

      return {
        output: [createEntry('error', `ERROR: ${access.reason}`)],
        stateChanges,
        delayMs: calculateDelay(state) + 500,
      };
    }

    const node = getNode(filePath, state);

    // Check if it's a directory
    if (node && node.type === 'dir') {
      return {
        output: [
          createEntry('error', `ERROR: ${args[0]} is a directory`),
          createEntryI18n(
            'system',
            'engine.commands.filesystem.hint_open_is_used_for_files_only',
            `  HINT: 'open' is used for files only.`
          ),
          createEntry('system', `  To explore a directory use 'cd ${args[0]}' then 'ls'.`),
          createEntry('system', ''),
          createEntry('ufo74', '[UFO74]: thats a directory. use: cd ' + args[0]),
        ],
        stateChanges: {},
      };
    }

    if (!node || node.type !== 'file') {
      return {
        output: [
          createEntryI18n(
            'error',
            'engine.commands.filesystem.error_file_not_found',
            'ERROR: File not found'
          ),
          createEntry('system', ''),
          createEntryI18n(
            'ufo74',
            'engine.commands.filesystem.ufo74_use_ls_to_see_whats_here',
            '[UFO74]: use "ls" to see whats here.'
          ),
        ],
        stateChanges: {},
      };
    }

    const file = node as FileNode;
    const mutation = state.fileMutations[filePath];

    // Check if this is a honeypot/trap file
    const TRAP_FILES = [
      'URGENT_classified_alpha.txt',
      'LEAKED_classified_records.dat',
      'FOR_PRESIDENTS_EYES_ONLY.enc',
      'SMOKING_GUN_proof.txt',
    ];
    const fileName = filePath.split('/').pop() || '';
    const isTrap = TRAP_FILES.includes(fileName);

    // Check if file was already read BEFORE trap check to avoid double penalty
    const alreadyRead = state.filesRead?.has(filePath);

    if (isTrap) {
      // If trap was already triggered, show reduced penalty
      if (alreadyRead) {
        const content = getFileContent(filePath, state, state.fileMutations[filePath]?.decrypted);
        return {
          output: [
            createEntry('system', ''),
            createEntry('system', `=== ${filePath} ===`),
            createEntry('system', ''),
            ...(content || []).map(line => createEntry('file', line)),
            createEntry('system', ''),
            createEntryI18n(
              'warning',
              'engine.commands.filesystem.ufo74_you_already_fell_for_this_trap_kid_lets_move_on',
              'UFO74: you already fell for this trap, kid. lets move on.'
            ),
          ],
          stateChanges: state.tutorialComplete
            ? {
                detectionLevel: getWarmupAdjustedDetection(state, 1), // Reduced penalty for re-read
              }
            : {},
          streamingMode: 'fast',
        };
      }

      const trapsTriggered = new Set(state.trapsTriggered || []);
      const isFirstTrap = trapsTriggered.size === 0;
      trapsTriggered.add(filePath);

      const trapOutput: TerminalEntry[] = [];

      // UFO74 warning on first trap
      if (isFirstTrap && !state.trapWarningGiven) {
        trapOutput.push(
          createEntry('system', ''),
          createEntry('warning', '┌─────────────────────────────────────────────────────────┐'),
          createEntryI18n(
            'warning',
            'engine.commands.filesystem.ufo74_urgent',
            '│ >> UFO74 << URGENT                                      │'
          ),
          createEntry('warning', '└─────────────────────────────────────────────────────────┘'),
          createEntry('system', ''),
          createEntryI18n(
            'ufo74',
            'engine.commands.filesystem.ufo74_hackerkid_no',
            'UFO74: HACKERKID NO!'
          ),
          createEntry('output', ''),
          createEntryI18n(
            'ufo74',
            'engine.commands.filesystem.ufo74_that_was_a_honeypot_a_trap_file',
            'UFO74: that was a honeypot! a trap file!'
          ),
          createEntryI18n(
            'output',
            'engine.commands.filesystem.they_plant_those_to_catch_people_like_us',
            '       they plant those to catch people like us.'
          ),
          createEntry('output', ''),
          createEntryI18n(
            'ufo74',
            'engine.commands.filesystem.ufo74_real_evidence_is_never_labeled_that_obviously',
            'UFO74: real evidence is NEVER labeled that obviously.'
          ),
          createEntryI18n(
            'output',
            'engine.commands.filesystem.smoking_gun_presidents_eyes_come_on',
            '       "SMOKING GUN"? "PRESIDENTS EYES"? come on...'
          ),
          createEntry('output', ''),
          createEntryI18n(
            'ufo74',
            'engine.commands.filesystem.ufo74_your_detection_just_spiked_be_more_careful',
            'UFO74: your detection just spiked. be more careful!'
          ),
          createEntry('system', '')
        );
      }

      // Show file content (trap message)
      const content = getFileContent(filePath, state, false);
      if (content) {
        content.forEach(line => trapOutput.push(createEntry('error', line)));
      }

      const nextFilesRead = new Set([...(state.filesRead || []), filePath]);
      const safeTutorialState = {
        trapsTriggered,
        trapWarningGiven: true,
        filesRead: nextFilesRead,
      };
      return {
        output: trapOutput,
        stateChanges: state.tutorialComplete
          ? {
              ...safeTutorialState,
              detectionLevel: Math.min(MAX_DETECTION, state.detectionLevel + 12), // was 20, reduced for pacing
              avatarExpression: 'scared', // Trap triggered - scared expression
            }
          : safeTutorialState,
        triggerFlicker: state.tutorialComplete,
        delayMs: state.tutorialComplete ? 1000 : undefined,
      };
    }

    // Check if non-trap file was already read - show different message
    if (alreadyRead) {
      const content = getFileContent(filePath, state, state.fileMutations[filePath]?.decrypted);
      if (!content) {
        return {
          output: [
            createEntryI18n(
              'error',
              'engine.commands.filesystem.error_cannot_read_file',
              'ERROR: Cannot read file'
            ),
          ],
          stateChanges: {},
        };
      }

      // Show file content but with "already read" message instead of UFO74
      const output: TerminalEntry[] = [
        createEntry('system', ''),
        createEntry('system', `=== ${filePath} ===`),
        createEntry('system', ''),
        ...content.map(line => createEntry('file', line)),
        createEntry('system', ''),
        createEntryI18n(
          'warning',
          'engine.commands.filesystem.ufo74_you_already_read_this_file_kid_lets_move_on',
          'UFO74: you already read this file, kid. lets move on.'
        ),
      ];

      const rereadStateChanges: Partial<GameState> = state.tutorialComplete
        ? {
            detectionLevel: getWarmupAdjustedDetection(state, 1), // Less detection for re-read
          }
        : {};

      if (filePath.includes('ghost_in_machine') && !state.ufo74SecretDiscovered) {
        rereadStateChanges.ufo74SecretDiscovered = true;
      }

      return {
        output,
        stateChanges: rereadStateChanges,
        streamingMode: 'fast',
      };
    }

    // Track file as read
    const filesRead = new Set(state.filesRead || []);
    filesRead.add(filePath);

    // ═══════════════════════════════════════════════════════════════════════════
    // SAFE FILE DETECTION - Reading mundane files reduces detection
    // Files in /internal/admin/ and /internal/misc/ are "safe" - they make
    // the player look like a regular user browsing boring administrative docs.
    // ═══════════════════════════════════════════════════════════════════════════
    const isSafeFile =
      filePath.startsWith('/internal/admin/') || filePath.startsWith('/internal/misc/');
    const DETECTION_FLOOR = 5; // Can't reduce below this level

    let detectionChange = 3; // Default increase for reading files
    const safeFileNotice: ReturnType<typeof createEntry>[] = [];
    // Declared early so safe-file UFO74 can be routed through the same
    // single-message channel used by conspiracy/context reactions below.
    let ufo74ContextMessage: TerminalEntry[] | null = null;

    if (isSafeFile && state.detectionLevel > DETECTION_FLOOR) {
      // Reduce detection by 1-2 points instead of increasing
      const rng = createSeededRng((state.seed || 0) + filePath.length * 100);
      const reduction = seededRandomInt(rng, 1, 3);
      const newDetection = Math.max(DETECTION_FLOOR, state.detectionLevel - reduction);
      detectionChange = newDetection - state.detectionLevel; // Will be negative

      // Add subtle system message
      safeFileNotice.push(createEntry('system', ''));
      safeFileNotice.push(
        createEntryI18n(
          'system',
          'engine.commands.filesystem.system_access_pattern_normalized',
          '[SYSTEM: access pattern normalized]'
        )
      );

      // Occasionally add UFO74 comment (roughly 1 in 4 safe file reads)
      // Routed through ufo74ContextMessage so only ONE UFO74 message fires per open.
      const showUFO74 = seededRandomInt(rng, 0, 4) === 0;
      if (showUFO74) {
        ufo74ContextMessage = [
          createEntryI18n(
            'ufo74',
            'engine.commands.filesystem.ufo74_good_thinking_kid_reading_the_boring_stuff_keeps_you_l',
            'UFO74: good thinking, kid. reading the boring stuff keeps you looking like a regular user.'
          ),
        ];
      }
    }

    // Legacy unstable/encrypted/restricted mechanics are now presentation only.
    const stateChanges: Partial<GameState> = {
      detectionLevel:
        detectionChange > 0
          ? getWarmupAdjustedDetection(state, detectionChange)
          : state.detectionLevel + detectionChange, // Safe file reduction - no warmup needed
      filesRead,
      lastOpenedFile: filePath, // Track for 'last' command
      isReadingFile: true, // Mark as reading file (suppresses firewall eyes)
      lastFileReadTime: Date.now(), // Track when file was read
    };

    if (!state.tutorialComplete) {
      delete stateChanges.detectionLevel;
    }

    const triggerFlicker = false;

    const content = getFileContent(filePath, { ...state, ...stateChanges }, mutation?.decrypted);

    if (!content) {
      return {
        output: [
          createEntryI18n(
            'error',
            'engine.commands.filesystem.error_cannot_read_file',
            'ERROR: Cannot read file'
          ),
        ],
        stateChanges,
      };
    }

    const isEncryptedAndLocked = false;

    // Check for reveals and disturbing content
    const notices: ReturnType<typeof createEntry>[] = [];

    // Track content category based on file path
    const categoriesRead = new Set(state.categoriesRead || []);
    if (filePath.startsWith('/ops/')) categoriesRead.add('military');
    if (filePath.startsWith('/ops/medical/')) categoriesRead.add('medical');
    if (filePath.startsWith('/ops/assessments/')) categoriesRead.add('assessments');
    if (filePath.startsWith('/comms/')) categoriesRead.add('comms');
    if (filePath.startsWith('/comms/liaison/')) categoriesRead.add('liaison');
    if (filePath.startsWith('/comms/intercepts/')) categoriesRead.add('intercepts');
    if (filePath.startsWith('/storage/')) categoriesRead.add('storage');
    if (filePath.startsWith('/admin/')) categoriesRead.add('admin');
    if (filePath.startsWith('/internal/')) categoriesRead.add('internal');

    stateChanges.categoriesRead = categoriesRead;

    // ═══════════════════════════════════════════════════════════════════════════
    // SPECIAL FILE TRIGGERS
    // ═══════════════════════════════════════════════════════════════════════════

    // Maintenance notes reveal hidden commands
    if (filePath.includes('maintenance_notes') && !isEncryptedAndLocked) {
      const hiddenCmds = new Set(state.hiddenCommandsDiscovered || []);
      hiddenCmds.add('disconnect');
      hiddenCmds.add('scan');
      hiddenCmds.add('decode');
      stateChanges.hiddenCommandsDiscovered = hiddenCmds;
    }

    // Transfer authorization contains password hint
    if (filePath.includes('transfer_authorization') && !isEncryptedAndLocked) {
      const passwords = new Set(state.passwordsFound || []);
      passwords.add('varginha1996');
      stateChanges.passwordsFound = passwords;
    }

    // Official summary is disinformation - subtle flag
    if (filePath.includes('incident_summary_official') && !isEncryptedAndLocked) {
      const disinfo = new Set(state.disinformationDiscovered || []);
      disinfo.add('official_summary');
      stateChanges.disinformationDiscovered = disinfo;
    }

    // Active trace now stays informational only - no forced countdown spike.
    if (filePath.includes('active_trace.sys') && !isEncryptedAndLocked) {
      stateChanges.flags = { ...state.flags, ...stateChanges.flags, traceMonitorReviewed: true };
    }

    if (filePath.includes('ghost_in_machine') && !isEncryptedAndLocked) {
      stateChanges.ufo74SecretDiscovered = true;
    }

    if (filePath.includes('integrity_hashes') && !isEncryptedAndLocked) {
      stateChanges.flags = { ...state.flags, ...stateChanges.flags, tamperEvidenceNoted: true };
    }

    if (filePath.includes('ghost_session') && !isEncryptedAndLocked) {
      const hiddenCmds = new Set(stateChanges.hiddenCommandsDiscovered || state.hiddenCommandsDiscovered || []);
      hiddenCmds.add('iddqd');
      stateChanges.hiddenCommandsDiscovered = hiddenCmds;
      stateChanges.paranoiaLevel = Math.min(100, (state.paranoiaLevel || 0) + 10);
    }

    if (filePath.includes('redaction_keycard') && !isEncryptedAndLocked) {
      stateChanges.flags = { ...state.flags, ...stateChanges.flags, redactionKeycardRead: true };
    }

    if (
      filePath.includes('redaction_override_memo') &&
      !isEncryptedAndLocked &&
      state.flags.redactionKeycardRead
    ) {
      stateChanges.flags = { ...state.flags, ...stateChanges.flags, redactionOverrideSolved: true };
      notices.push(createEntry('notice', ''));
      notices.push(
        createEntryI18n(
          'notice',
          'engine.commands.filesystem.notice_redaction_sequence_reconciled',
          'NOTICE: Redaction sequence reconciled.'
        )
      );
    }

    if (filePath.includes('trace_purge_memo') && !isEncryptedAndLocked) {
      stateChanges.flags = { ...state.flags, ...stateChanges.flags, tracePurgeLogged: true };
    }

    // Morse intercept file tracking - enables 'message' command
    if (filePath.includes('morse_intercept') && !isEncryptedAndLocked) {
      stateChanges.morseFileRead = true;
    }

    // ═══════════════════════════════════════════════════════════════════════════
    // CODED LANGUAGE FILES - UFO74 explains these can't be used as evidence
    // Files in /internal/sanitized/ use euphemisms that provide plausible deniability
    // ═══════════════════════════════════════════════════════════════════════════
    // ufo74ContextMessage is declared earlier (safe-file block) so all UFO74
    // reactions share a single slot — only ONE message per file open.

    if (!ufo74ContextMessage && filePath.includes('/internal/sanitized/') && !isEncryptedAndLocked) {
      ufo74ContextMessage = createUFO74Message([
        'UFO74: ugh. this is sanitized documentation.',
        '       "the package"? "visitors"? "guests"?',
        '       its all code words. plausible deniability.',
        '',
        '       this stuff is useless as evidence.',
        '       they can claim its about anything.',
        '',
        '       we need docs with DIRECT language.',
        '       look for files that say what they MEAN.',
      ]);
    }

    // ═══════════════════════════════════════════════════════════════════════════
    // CONSPIRACY EASTER EGGS - UFO74 reacts with dismissive but entertained comments
    // These files contain real-world conspiracy theory references (non-alien)
    // ═══════════════════════════════════════════════════════════════════════════
    const isConspiracyFile = CONSPIRACY_FILE_NAMES.includes(fileName);
    const conspiracyFilesSeen = new Set(state.conspiracyFilesSeen || []);

    if (isConspiracyFile && !conspiracyFilesSeen.has(filePath) && !isEncryptedAndLocked) {
      // Mark this conspiracy file as seen
      conspiracyFilesSeen.add(filePath);
      stateChanges.conspiracyFilesSeen = conspiracyFilesSeen;

      // Pick a random UFO74 reaction (seeded for consistency using file path hash)
      const conspiracyRng = createSeededRng((state.seed || 0) + filePath.length * 7);
      const reactionIndex = seededRandomInt(conspiracyRng, 0, UFO74_CONSPIRACY_REACTIONS.length);
      const reaction = UFO74_CONSPIRACY_REACTIONS[reactionIndex];

      ufo74ContextMessage = createUFO74Message(reaction);
    }

    // ═══════════════════════════════════════════════════════════════════════════
    // UFO74 FILE-SPECIFIC REACTIONS — characterful comment for every file
    // Fires when no higher-priority message (safe-file, sanitized, conspiracy)
    // has already claimed the slot. Only on first read (re-reads return early).
    // ═══════════════════════════════════════════════════════════════════════════
    if (!ufo74ContextMessage && !isEncryptedAndLocked && state.tutorialComplete) {
      const fileReaction = EVIDENCE_UFO74_REACTIONS[fileName];
      if (fileReaction) {
        ufo74ContextMessage = [createEntry('ufo74', `UFO74: ${fileReaction}`)];
      }
    }

    // After a few reads, nudge players toward the key evidence-heavy directories.
    // Only if no file-specific reaction already claimed the slot.
    const totalFilesRead = filesRead.size;
    if (totalFilesRead === 3 && !state.flags.overrideSuggested && !state.flags.adminUnlocked) {
      const directoryHintMessage = createUFO74Message([
        'UFO74: good pace, hackerkid.',
        '       start digging through /storage, /ops, and /comms.',
        '       the good files are scattered all over the system.',
      ]);
      ufo74ContextMessage = ufo74ContextMessage
        ? [...ufo74ContextMessage, ...directoryHintMessage]
        : directoryHintMessage;
      stateChanges.flags = { ...state.flags, ...stateChanges.flags, overrideSuggested: true };
    }

    // Check for Archivist achievement: all files in parent folder read
    const achievementsToCheck: string[] = [];
    const parentPath = filePath.substring(0, filePath.lastIndexOf('/')) || '/';
    const parentEntries = listDirectory(parentPath, { ...state, ...stateChanges } as GameState);
    const filesInParent = parentEntries ? parentEntries.filter(e => e.type === 'file') : [];
    if (filesInParent.length >= 3) {
      const allRead = filesInParent.every(f => {
        const fullPath = parentPath === '/' ? `/${f.name}` : `${parentPath}/${f.name}`;
        return filesRead.has(fullPath);
      });
      if (allRead) {
        achievementsToCheck.push('archivist');

        // UFO74 hint: all files read in this subdirectory — only if no other reaction pending
        if (state.currentPath !== '/' && state.tutorialComplete && !ufo74ContextMessage) {
          ufo74ContextMessage = [
            createEntryI18n(
              'ufo74',
              'engine.commands.filesystem.ufo74_you_read_all_we_could_here_use_cd_to_go_back_up_to_exp',
              '[UFO74]: you read all we could here, use `cd ..` to go back up to explore other folders kid.'
            ),
          ];
        }
      }
    }

    // Evidence discovery stays internal; player-facing confirmation now happens on save.
    applyEvidenceDiscovery(state, stateChanges, filePath, file, content);

    const output = [
      ...createOutputEntries(['', `FILE: ${filePath}`, '']),
      ...createOutputEntries(content),
      ...notices,
      ...safeFileNotice,
    ];

    // Check for image trigger - ONLY show if file is decrypted (or not encrypted) AND not shown this run
    let imageTrigger: ImageTrigger | undefined = undefined;
    if (file.imageTrigger && !isEncryptedAndLocked) {
      const imageId = file.imageTrigger.src;
      const imagesShown = state.imagesShownThisRun || new Set<string>();

      if (!imagesShown.has(imageId)) {
        imageTrigger = file.imageTrigger;
        // Mark this image as shown
        const newImagesShown = new Set(imagesShown);
        newImagesShown.add(imageId);
        stateChanges.imagesShownThisRun = newImagesShown;
      }
    }

    // Determine streaming mode based on content length.
    let streamingMode: 'none' | 'fast' | 'normal' | 'slow' = 'normal';
    if (content.length > 30) {
      streamingMode = 'fast'; // Long files stream faster
    }

    return {
      output,
      stateChanges,
      triggerFlicker,
      delayMs: calculateDelay(state),
      imageTrigger,
      streamingMode,
      checkAchievements: achievementsToCheck.length > 0 ? achievementsToCheck : undefined,
      // Route UFO74 contextual message through encrypted channel (one message per file open)
      pendingUfo74Messages: ufo74ContextMessage || undefined,
    };
  },

  tree: (args, state) => {
    // Post-override: tree fails and triggers Firewall (game over)
    if (state.flags?.adminUnlocked) {
      return {
        output: [
          createEntry('error', ''),
          createEntry('error', '═══════════════════════════════════════════════════════════'),
          createEntryI18n('error', 'runtime.firewallTriggered', 'FIREWALL TRIGGERED'),
          createEntry('error', '═══════════════════════════════════════════════════════════'),
          createEntry('error', ''),
          createEntryI18n(
            'error',
            'engine.commands.filesystem.full_index_scan_detected_on_elevated_session',
            'Full index scan detected on elevated session.'
          ),
          createEntryI18n('error', 'runtime.connectionSevered', 'Connection severed.'),
          createEntry('error', ''),
        ],
        stateChanges: {
          isGameOver: true,
          gameOverReason: 'FIREWALL — TREE SCAN ON ELEVATED SESSION',
        },
        triggerFlicker: true,
        delayMs: 2000,
      };
    }

    // Confirmation gate: first tree call shows warning, second executes
    if (!state.pendingTreeConfirm) {
      return {
        output: [
          createEntry('warning', ''),
          createEntryI18n(
            'warning',
            'engine.commands.filesystem.hackerkid_hey_kid_are_you_sure_you_want_to_use_tree',
            '[HackerKid]: Hey kid, are you sure you want to use tree?'
          ),
          createEntryI18n(
            'warning',
            'engine.commands.filesystem.it_will_expose_all_files_but_it_will_spike_your_risk_signifi',
            '  It will expose all files but it will spike your risk significantly.'
          ),
          createEntry('warning', ''),
          createEntryI18n(
            'system',
            'engine.commands.filesystem.type_tree_again_to_confirm',
            'Type tree again to confirm.'
          ),
          createEntry('system', ''),
        ],
        stateChanges: {
          pendingTreeConfirm: true,
        },
      };
    }

    // Display directory tree structure
    const buildTree = (path: string, prefix: string, depth: number): string[] => {
      if (depth > 2) return []; // Limit depth to 2 levels

      const entries = listDirectory(path, state);
      const lines: string[] = [];

      if (!entries) return lines;

      entries.forEach((entry, index) => {
        const isLast = index === entries.length - 1;
        const connector = isLast ? '└── ' : '├── ';
        const childPrefix = isLast ? '    ' : '│   ';

        if (entry.type === 'dir') {
          const dirName = entry.name.replace(/\/$/, '');
          lines.push(`${prefix}${connector}${dirName}/`);
          const childPath = path === '/' ? `/${dirName}` : `${path}/${dirName}`;
          lines.push(...buildTree(childPath, prefix + childPrefix, depth + 1));
        } else {
          let marker = '';
          const fullPath = path === '/' ? `/${entry.name}` : `${path}/${entry.name}`;
          if (state.filesRead?.has(fullPath)) {
            marker = ' [READ]';
          }
          lines.push(`${prefix}${connector}${entry.name}${marker}`);
        }
      });

      return lines;
    };

    // +30% detection increase
    const detectionIncrease = 30;
    const newDetection = Math.min(MAX_DETECTION, state.detectionLevel + detectionIncrease);

    const treeLines = [
      '',
      '═══════════════════════════════════════════════════════════',
      'DIRECTORY STRUCTURE',
      '═══════════════════════════════════════════════════════════',
      '',
      '/',
      ...buildTree('/', '', 0),
      '',
      `Current location: ${state.currentPath}`,
      '',
      '═══════════════════════════════════════════════════════════',
      '',
    ];

    return {
      output: createOutputEntries(treeLines),
      stateChanges: {
        detectionLevel: newDetection,
        pendingTreeConfirm: false,
      },
    };
  },
};
