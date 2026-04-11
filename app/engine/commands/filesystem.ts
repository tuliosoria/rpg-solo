// Filesystem commands: ls, cd, open, decrypt, tree

import {
  GameState,
  CommandResult,
  TerminalEntry,
  FileNode,
  ImageTrigger,
} from '../../types';
import {
  resolvePath,
  getNode,
  listDirectory,
  getFileContent,
  canAccessFile,
  getEvidenceBearingFiles,
} from '../filesystem';
import { createSeededRng, seededRandomInt } from '../rng';
import { EVIDENCE_SYMBOL } from '../evidenceRevelation';
import {
  UFO74_CONSPIRACY_REACTIONS,
  CONSPIRACY_FILE_NAMES,
} from '../../data/conspiracyFiles';
import { MAX_DETECTION } from '../../constants/detection';
import {
  createEntry,
  createOutputEntries,
  calculateDelay,
  createUFO74Message,
} from './utils';
import {
  getWarmupAdjustedDetection,
  applyEvidenceDiscovery,
  performDecryption,
  contextRandomPick,
  isArchiveOnlyFile,
} from './helpers';
import type { CommandRegistry } from './types';

// Forward reference to commands registry (needed for decrypt -> open redirect)
let commandsRef: CommandRegistry | null = null;
export function setCommandsRef(cmds: CommandRegistry) {
  commandsRef = cmds;
}

export const filesystemCommands: CommandRegistry = {
  ls: (args, state) => {
    // Check for -l flag
    const longFormat = args.includes('-l');

    const entries = listDirectory(state.currentPath, state);

    if (!entries) {
      return {
        output: [createEntry('error', 'ERROR: Cannot read directory')],
        stateChanges: {},
      };
    }

    const allEntries = [...entries];
    const evidenceFiles = getEvidenceBearingFiles();

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

          // Evidence indicator: show for evidence-bearing files the player has read
          const fileContent = getFileContent(fullPath, state);
          const hasEvidenceMark = evidenceFiles.has(fullPath) && state.filesRead?.has(fullPath);
          if (hasEvidenceMark) {
            line = `  [${EVIDENCE_SYMBOL}] ${entry.name}`;
          }

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
              const prefix = hasEvidenceMark ? `  [${EVIDENCE_SYMBOL}] ` : '  ';
              const statusLabel = (entry.status ?? 'intact').toUpperCase();
              line = `${prefix}${entry.name}  [${statusLabel}]`;
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

    // Add legend if any files have evidence markers
    const hasEvidenceMarkers = allEntries.some(entry => {
      if (entry.type !== 'file') return false;
      const fullPath =
        state.currentPath === '/' ? `/${entry.name}` : `${state.currentPath}/${entry.name}`;
      return evidenceFiles.has(fullPath) && state.filesRead?.has(fullPath);
    });

    if (hasEvidenceMarkers) {
      lines.push('');
      lines.push(`  ${EVIDENCE_SYMBOL}=evidence logged`);
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
          createEntry('error', 'ERROR: Specify directory'),
          createEntry('system', ''),
          createEntry(
            'ufo74',
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
          createEntry('ufo74', '[UFO74]: use "ls" to see whats in the current directory.'),
        ],
        stateChanges,
      };
    }

    if (node.type !== 'dir') {
      return {
        output: [
          createEntry('error', `ERROR: Not a directory: ${args[0]}`),
          createEntry('system', `  HINT: 'cd' is used for directories only.`),
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
          createEntry('error', 'ERROR: Specify file'),
          createEntry('system', ''),
          createEntry(
            'ufo74',
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
          createEntry('error', 'ERROR: File not found'),
          createEntry('system', ''),
          createEntry('ufo74', '[UFO74]: use "ls" to see whats here.'),
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
          createEntry('system', `  HINT: 'open' is used for files only.`),
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
          createEntry('error', 'ERROR: File not found'),
          createEntry('system', ''),
          createEntry('ufo74', '[UFO74]: use "ls" to see whats here.'),
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
            createEntry('warning', 'UFO74: you already fell for this trap, kid. lets move on.'),
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
          createEntry('warning', '│ >> UFO74 << URGENT                                      │'),
          createEntry('warning', '└─────────────────────────────────────────────────────────┘'),
          createEntry('system', ''),
          createEntry('ufo74', 'UFO74: HACKERKID NO!'),
          createEntry('output', ''),
          createEntry('ufo74', 'UFO74: that was a honeypot! a trap file!'),
          createEntry('output', '       they plant those to catch people like us.'),
          createEntry('output', ''),
          createEntry('ufo74', 'UFO74: real evidence is NEVER labeled that obviously.'),
          createEntry('output', '       "SMOKING GUN"? "PRESIDENTS EYES"? come on...'),
          createEntry('output', ''),
          createEntry('ufo74', 'UFO74: your detection just spiked. be more careful!'),
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
          output: [createEntry('error', 'ERROR: Cannot read file')],
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
        createEntry('warning', 'UFO74: you already read this file, kid. lets move on.'),
      ];

      return {
        output,
        stateChanges: state.tutorialComplete
          ? {
              detectionLevel: getWarmupAdjustedDetection(state, 1), // Less detection for re-read
            }
          : {},
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

    if (isSafeFile && state.detectionLevel > DETECTION_FLOOR) {
      // Reduce detection by 1-2 points instead of increasing
      const rng = createSeededRng((state.seed || 0) + filePath.length * 100);
      const reduction = seededRandomInt(rng, 1, 2);
      const newDetection = Math.max(DETECTION_FLOOR, state.detectionLevel - reduction);
      detectionChange = newDetection - state.detectionLevel; // Will be negative

      // Add subtle system message
      safeFileNotice.push(createEntry('system', ''));
      safeFileNotice.push(createEntry('system', '[SYSTEM: access pattern normalized]'));

      // Occasionally add UFO74 comment (roughly 1 in 4 safe file reads)
      const showUFO74 = seededRandomInt(rng, 0, 3) === 0;
      if (showUFO74) {
        safeFileNotice.push(
          createEntry(
            'ufo74',
            'UFO74: good thinking, kid. reading the boring stuff keeps you looking like a regular user.'
          )
        );
      }
    }

    // Legacy unstable/encrypted/restricted mechanics are now presentation only.
    const stateChanges: Partial<GameState> = {
      detectionLevel: detectionChange > 0 
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
        output: [createEntry('error', 'ERROR: Cannot read file')],
        stateChanges,
      };
    }

    const isEncryptedAndLocked = false;

    // Check for reveals and disturbing content
    const notices: ReturnType<typeof createEntry>[] = [];
    if (!isEncryptedAndLocked) {
      applyEvidenceDiscovery(state, stateChanges, filePath, file, content, notices);
    }

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

    // Check if player has read multiple categories (unlocks pattern recognition files)
    if (categoriesRead.size >= 3 && !state.flags['readMultipleCategories']) {
      stateChanges.flags = { ...state.flags, readMultipleCategories: true };
    }
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

    if (filePath.includes('integrity_hashes') && !isEncryptedAndLocked) {
      stateChanges.flags = { ...state.flags, ...stateChanges.flags, tamperEvidenceNoted: true };
    }

    if (filePath.includes('ghost_session') && !isEncryptedAndLocked) {
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
      notices.push(createEntry('notice', 'NOTICE: Redaction sequence reconciled.'));
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
    // Collect UFO74 contextual messages separately — only the LAST one is kept
    // to avoid flooding the encrypted channel with multiple messages at once.
    let ufo74ContextMessage: TerminalEntry[] | null = null;

    if (filePath.includes('/internal/sanitized/') && !isEncryptedAndLocked) {
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

    // After a few reads, nudge players toward cross-referencing instead of the old override gate.
    const totalFilesRead = filesRead.size;
    if (totalFilesRead === 3 && !state.flags.overrideSuggested && !state.flags.adminUnlocked) {
      ufo74ContextMessage = createUFO74Message([
        'UFO74: good pace, hackerkid.',
        '       start cross-checking /storage, /ops, and /comms.',
        '       the pattern only shows up when you compare them.',
      ]);
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

        // UFO74 hint: all files read in this subdirectory — overrides previous messages
        if (state.currentPath !== '/' && state.tutorialComplete) {
          ufo74ContextMessage = [
            createEntry(
              'ufo74',
              '[UFO74]: you read all we could here, use `cd ..` to go back up to explore other folders kid.'
            ),
          ];
        }
      }
    }

    const output = [
      ...createOutputEntries(['', `FILE: ${filePath}`, '']),
      ...createOutputEntries(content),
      ...notices,
      ...safeFileNotice,
    ];

    // Add encryption hints for locked encrypted files
    if (isEncryptedAndLocked) {
      output.push(createEntry('system', ''));
      if (file.securityQuestion) {
        // Security question encrypted file - hint to find answer in system
        const hints = [
          'UFO74: this one still hides behind a recovery phrase. look around for clues first.',
          'UFO74: the answer is somewhere else in the system. keep digging before you force it.',
          'UFO74: locked tight. cross-reference the other files before you try the legacy prompt.',
        ];
        output.push(
          createEntry(
            'ufo74',
            contextRandomPick(state, hints, 'ufo74-security-question-hint', filePath, state.filesRead.size)
          )
        );
        output.push(
          createEntry(
            'ufo74',
            '[UFO74]: once you have the answer, the old recovery wrapper is "decrypt ' +
              args[0] +
              '".'
          )
        );
      } else if (file.timedDecrypt) {
        // Timed decrypt file - hint about the decrypt command
        output.push(
          createEntry(
            'ufo74',
            'UFO74: timed recovery wrapper. get ready first, then move fast.'
          )
        );
        output.push(
          createEntry(
            'ufo74',
            '[UFO74]: when you are ready, start it with "decrypt ' + args[0] + '".'
          )
        );
      } else {
        // Standard encrypted file
        const hints = [
          'UFO74: sealed, but not impossible. the old recovery wrapper still works here.',
          'UFO74: legacy lock. if you need it, use the recovery prompt instead of forcing it.',
        ];
        output.push(
          createEntry(
            'ufo74',
            contextRandomPick(state, hints, 'ufo74-encrypted-hint', filePath, state.filesRead.size)
          )
        );
        output.push(
          createEntry('ufo74', '[UFO74]: legacy wrapper: "decrypt ' + args[0] + '".')
        );
      }
    }

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

  decrypt: (args, state) => {
    if (args.length === 0) {
      return {
        output: [createEntry('error', 'ERROR: Specify file')],
        stateChanges: {},
      };
    }

    const filePath = resolvePath(args[0], state.currentPath);
    const node = getNode(filePath, state);

    if (!node || node.type !== 'file') {
      return {
        output: [createEntry('error', 'ERROR: File not found')],
        stateChanges: {},
      };
    }

    const file = node as FileNode;

    if (file.status !== 'encrypted') {
      return {
        output: [
          createEntry('error', 'ERROR: File is not encrypted'),
          createEntry('system', ''),
          createEntry('ufo74', '[UFO74]: this ones not encrypted. just use: open ' + args[0]),
        ],
        stateChanges: {},
      };
    }

    if (!file.decryptedFragment) {
      return {
        output: [createEntry('error', 'ERROR: No recoverable data')],
        stateChanges: {},
      };
    }

    const legacyPassword = args[1]?.toLowerCase().trim();

    // Decrypt is kept only as a legacy compatibility alias.
    // Normal access now goes through `open`; the old password path remains
    // solely for the hidden UFO74 secret ending.
    if (!(filePath.includes('ghost_in_machine') && legacyPassword === 'varginha1996')) {
      const openResult = commandsRef!.open([args[0]], state);
      return {
        ...openResult,
        output: [
          createEntry('system', ''),
          createEntry(
            'ufo74',
            '[UFO74]: old decrypt wrappers are retired. opening the recovered file directly.'
          ),
          ...openResult.output,
        ],
      };
    }

    // ═══════════════════════════════════════════════════════════════════════════
    // TIMED DECRYPTION FILES
    // ═══════════════════════════════════════════════════════════════════════════

    if (file.timedDecrypt) {
      // If timed decrypt is active and correct sequence provided
      if (state.timedDecryptActive && state.timedDecryptFile === filePath) {
        const providedSequence = args.slice(1).join(' ').toUpperCase().trim();
        const expectedSequence = file.timedDecrypt.sequence.toUpperCase();

        // Check if time expired
        if (Date.now() > state.timedDecryptEndTime) {
          return {
            output: [
              createEntry('error', ''),
              createEntry('error', '▓▓▓ DECRYPTION WINDOW EXPIRED ▓▓▓'),
              createEntry('error', ''),
              createEntry('warning', 'Time limit exceeded.'),
              createEntry('warning', 'Encryption re-initialized.'),
              createEntry('system', ''),
              createEntry('system', 'Try again with: decrypt ' + args[0]),
            ],
            stateChanges: {
              timedDecryptActive: false,
              timedDecryptFile: undefined,
              timedDecryptSequence: undefined,
              timedDecryptEndTime: 0,
              detectionLevel: Math.min(MAX_DETECTION, state.detectionLevel + 8),
            },
          };
        }

        // Check if sequence matches
        if (providedSequence === expectedSequence) {
          // Success! Decrypt the file
          const output: TerminalEntry[] = [
            createEntry('system', ''),
            createEntry('system', '═══════════════════════════════════════════════'),
            createEntry('system', '     TIMED DECRYPTION SUCCESSFUL              '),
            createEntry('system', '═══════════════════════════════════════════════'),
            createEntry('system', ''),
          ];

          for (const line of file.decryptedFragment) {
            output.push(createEntry('system', line));
          }

          return {
            output,
            stateChanges: {
              timedDecryptActive: false,
              timedDecryptFile: undefined,
              timedDecryptSequence: undefined,
              timedDecryptEndTime: 0,
              flags: { ...state.flags, [`decrypted_${filePath.replace(/\//g, '_')}`]: true },
              detectionLevel: Math.max(0, state.detectionLevel - 3), // Reward for fast decryption
              avatarExpression: 'smirk', // Successful decrypt - smirk expression
            },
          };
        } else {
          return {
            output: [
              createEntry('error', 'SEQUENCE MISMATCH'),
              createEntry('error', ''),
              createEntry('warning', `Expected: ${expectedSequence}`),
              createEntry('warning', `Received: ${providedSequence || '(empty)'}`),
              createEntry('system', ''),
              createEntry('system', 'Time remaining. Try again.'),
            ],
            stateChanges: {
              detectionLevel: Math.min(MAX_DETECTION, state.detectionLevel + 3),
            },
          };
        }
      }

      // Start timed decryption challenge
      const endTime = Date.now() + file.timedDecrypt.timeLimit;
      const timeSeconds = Math.floor(file.timedDecrypt.timeLimit / 1000);

      return {
        output: [
          createEntry('warning', ''),
          createEntry('warning', '▓▓▓ TIMED DECRYPTION INITIATED ▓▓▓'),
          createEntry('warning', ''),
          createEntry('system', '  This file uses time-locked encryption.'),
          createEntry('system', '  You must type the sequence before time expires.'),
          createEntry('system', ''),
          createEntry('warning', `  TIME LIMIT: ${timeSeconds} seconds`),
          createEntry('system', ''),
          createEntry('system', '  ┌─────────────────────────────────────┐'),
          createEntry('system', `  │  SEQUENCE: ${file.timedDecrypt.sequence}  │`),
          createEntry('system', '  └─────────────────────────────────────┘'),
          createEntry('system', ''),
          createEntry('system', `  Type: decrypt ${args[0]} ${file.timedDecrypt.sequence}`),
          createEntry('system', ''),
          createEntry('warning', '  TIMER STARTED'),
        ],
        stateChanges: {
          timedDecryptActive: true,
          timedDecryptFile: filePath,
          timedDecryptSequence: file.timedDecrypt.sequence,
          timedDecryptEndTime: endTime,
        },
      };
    }

    // ═══════════════════════════════════════════════════════════════════════════
    // PASSWORD-PROTECTED FILES
    // ═══════════════════════════════════════════════════════════════════════════

    // UFO74 identity file requires password from transfer_authorization.txt
    if (filePath.includes('ghost_in_machine')) {
      const password = args[1]?.toLowerCase().trim();

      if (!password) {
        return {
          output: [
            createEntry('warning', '══════════════════════════════════════════════'),
            createEntry('warning', 'PASSWORD REQUIRED'),
            createEntry('warning', '══════════════════════════════════════════════'),
            createEntry('system', ''),
            createEntry('system', 'Usage: decrypt ghost_in_machine.enc <password>'),
            createEntry('system', ''),
            createEntry('ufo74', "[UFO74]: This file... I don't recognize it."),
            createEntry('ufo74', '[UFO74]: But the encryption pattern looks familiar.'),
          ],
          stateChanges: {},
        };
      }

      if (password !== 'varginha1996') {
        const stateChanges: Partial<GameState> = {
          detectionLevel: state.detectionLevel + 5,
        };

        if (!state.tutorialComplete) {
          delete stateChanges.detectionLevel;
        }

        return {
          output: [
            createEntry('error', 'DECRYPTION FAILED'),
            createEntry('error', 'Invalid password'),
            createEntry('system', ''),
            createEntry('ufo74', '[UFO74]: Wrong password. Keep looking.'),
          ],
          stateChanges,
        };
      }

      // Password correct - trigger secret ending revelation
      return {
        output: [
          createEntry('system', 'DECRYPTION SUCCESSFUL'),
          createEntry('system', ''),
          createEntry('error', '▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓'),
          createEntry('warning', ''),
          createEntry('warning', '   CLASSIFIED PERSONNEL FILE'),
          createEntry('warning', '   SUBJECT: WITNESS #74 - CODE NAME "UFO74"'),
          createEntry('warning', ''),
          createEntry('output', '   Location: Varginha, Minas Gerais'),
          createEntry('output', '   Date: January 20, 1996'),
          createEntry('output', '   Status: WITNESS SUPPRESSION FAILED'),
          createEntry('output', ''),
          createEntry('output', '   Subject was present during initial'),
          createEntry('output', '   contact event. Demonstrated unusual'),
          createEntry('output', '   resistance to memory alteration'),
          createEntry('output', '   protocols.'),
          createEntry('output', ''),
          createEntry('output', '   Subject has since accessed internal'),
          createEntry('output', '   networks repeatedly. Motivation unclear.'),
          createEntry('output', '   Possibly seeking validation.'),
          createEntry('output', ''),
          createEntry('error', '▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓'),
          createEntry('system', ''),
          createEntry('ufo74', '[UFO74]: ...'),
          createEntry('ufo74', '[UFO74]: So you found it.'),
          createEntry('ufo74', '[UFO74]: I was there. January 1996.'),
          createEntry('ufo74', '[UFO74]: I saw what they did. What they took.'),
          createEntry('ufo74', "[UFO74]: I've been inside their systems ever since."),
          createEntry('ufo74', '[UFO74]: Not for revenge. For proof.'),
          createEntry('ufo74', "[UFO74]: You have the proof now. Don't let them bury it again."),
          createEntry('system', ''),
          createEntry('warning', '▓▓▓ THE WHOLE TRUTH AWAITS ▓▓▓'),
        ],
        stateChanges: {
          // Preserve the reveal output so the UI can transition on the next Enter press.
          ufo74SecretDiscovered: true,
        },
        triggerFlicker: true,
        delayMs: 3000,
      };
    }

    // Check access threshold
    if (file.accessThreshold && state.accessLevel < file.accessThreshold) {
      return {
        output: [
          createEntry('error', 'ERROR: Decryption failed'),
          createEntry('warning', 'WARNING: Access level insufficient'),
        ],
        stateChanges: state.tutorialComplete
          ? {
              detectionLevel: state.detectionLevel + 10,
              legacyAlertCounter: state.legacyAlertCounter + 1,
            }
          : {},
        delayMs: 1500,
      };
    }

    // If file has a security question, require answer
    if (file.securityQuestion) {
      return {
        output: [
          createEntry('system', 'Initiating decryption protocol...'),
          createEntry('system', ''),
          createEntry('warning', '══════════════════════════════════════════════'),
          createEntry('warning', 'DECRYPTION AUTHENTICATION REQUIRED'),
          createEntry('warning', '══════════════════════════════════════════════'),
          createEntry('system', ''),
          createEntry('system', file.securityQuestion.question),
          createEntry('system', ''),
          createEntry('system', 'Enter answer below:'),
        ],
        stateChanges: {
          pendingDecryptFile: filePath,
        },
        delayMs: 500,
      };
    }

    // No security question - proceed with decryption
    return performDecryption(filePath, file, state);
  },

  tree: (args, state) => {
    // Post-override: tree fails and triggers Firewall (game over)
    if (state.flags?.adminUnlocked) {
      return {
        output: [
          createEntry('error', ''),
          createEntry('error', '═══════════════════════════════════════════════════════════'),
          createEntry('error', 'FIREWALL TRIGGERED'),
          createEntry('error', '═══════════════════════════════════════════════════════════'),
          createEntry('error', ''),
          createEntry('error', 'Full index scan detected on elevated session.'),
          createEntry('error', 'Connection severed.'),
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
          createEntry('warning', '[HackerKid]: Hey kid, are you sure you want to use tree?'),
          createEntry('warning', '  It will expose all files but it will spike your risk significantly.'),
          createEntry('warning', ''),
          createEntry('system', 'Type tree again to confirm.'),
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
    const newDetection = Math.min(
      MAX_DETECTION,
      state.detectionLevel + detectionIncrease
    );

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
