// Command parser and execution engine for Terminal 1996

import { 
  GameState, 
  CommandResult, 
  TerminalEntry, 
  TruthCategory,
  TRUTH_CATEGORIES,
  FileMutation,
  FileNode,
  ImageTrigger
} from '../types';
import { 
  resolvePath, 
  getNode, 
  listDirectory, 
  getFileContent, 
  canAccessFile,
  getFileReveals
} from './filesystem';
import { createSeededRng, seededRandomInt, seededRandomPick } from './rng';
import { FILESYSTEM_ROOT } from '../data/filesystem';

// ═══════════════════════════════════════════════════════════════════════════
// SINGULAR IRREVERSIBLE EVENTS - Each can only happen once per run
// ═══════════════════════════════════════════════════════════════════════════

interface SingularEvent {
  id: string;
  trigger: (state: GameState, command: string, args: string[]) => boolean;
  execute: (state: GameState) => { output: TerminalEntry[]; stateChanges: Partial<GameState>; delayMs?: number; triggerFlicker?: boolean };
}

const SINGULAR_EVENTS: SingularEvent[] = [
  {
    // THE ECHO - Triggered when accessing psi files at high detection
    id: 'the_echo',
    trigger: (state, command, args) => {
      if (state.singularEventsTriggered?.has('the_echo')) return false;
      if (command !== 'open' && command !== 'decrypt') return false;
      const path = args[0]?.toLowerCase() || '';
      return (path.includes('psi') || path.includes('transcript')) && state.detectionLevel >= 40;
    },
    execute: (state) => ({
      output: [
        createEntry('system', ''),
        createEntry('error', '▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓'),
        createEntry('system', ''),
        createEntry('warning', '                    [SIGNAL ECHO DETECTED]'),
        createEntry('system', ''),
        createEntry('output', '                    ...we see you seeing...'),
        createEntry('system', ''),
        createEntry('error', '▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓'),
        createEntry('system', ''),
      ],
      stateChanges: {
        singularEventsTriggered: new Set([...(state.singularEventsTriggered || []), 'the_echo']),
        sessionStability: state.sessionStability - 15,
        systemHostilityLevel: Math.min((state.systemHostilityLevel || 0) + 2, 5),
      },
      delayMs: 3000,
      triggerFlicker: true,
    }),
  },
  {
    // THE SILENCE - Terminal goes completely silent briefly after accessing admin at high risk
    id: 'the_silence',
    trigger: (state, command, args) => {
      if (state.singularEventsTriggered?.has('the_silence')) return false;
      if (command !== 'cd' && command !== 'ls') return false;
      const path = args[0]?.toLowerCase() || state.currentPath.toLowerCase();
      return path.includes('admin') && state.detectionLevel >= 60 && state.flags.adminUnlocked;
    },
    execute: (state) => ({
      output: [
        createEntry('system', ''),
        createEntry('system', ''),
        createEntry('system', ''),
        createEntry('system', '            .'),
        createEntry('system', ''),
        createEntry('system', ''),
        createEntry('system', ''),
        createEntry('system', '                              .'),
        createEntry('system', ''),
        createEntry('system', ''),
        createEntry('warning', '                                              .'),
        createEntry('system', ''),
        createEntry('system', ''),
        createEntry('error', 'SESSION OBSERVATION LEVEL: ELEVATED'),
        createEntry('system', ''),
      ],
      stateChanges: {
        singularEventsTriggered: new Set([...(state.singularEventsTriggered || []), 'the_silence']),
        detectionLevel: Math.min(state.detectionLevel + 20, 99),
        systemHostilityLevel: Math.min((state.systemHostilityLevel || 0) + 1, 5),
      },
      delayMs: 5000,
      triggerFlicker: true,
    }),
  },
  {
    // THE WATCHER ACKNOWLEDGMENT - After discovering 3+ truths, system acknowledges awareness
    id: 'watcher_ack',
    trigger: (state) => {
      if (state.singularEventsTriggered?.has('watcher_ack')) return false;
      return state.truthsDiscovered.size >= 3 && state.detectionLevel >= 50;
    },
    execute: (state) => ({
      output: [
        createEntry('system', ''),
        createEntry('error', '─────────────────────────────────────────'),
        createEntry('system', ''),
        createEntry('warning', 'NOTICE: Your inquiry has been noted.'),
        createEntry('system', ''),
        createEntry('output', 'Pattern analysis: SYSTEMATIC'),
        createEntry('output', 'Intent classification: RECONSTRUCTION'),
        createEntry('system', ''),
        createEntry('warning', 'Observation continues.'),
        createEntry('system', ''),
        createEntry('error', '─────────────────────────────────────────'),
        createEntry('system', ''),
      ],
      stateChanges: {
        singularEventsTriggered: new Set([...(state.singularEventsTriggered || []), 'watcher_ack']),
        systemHostilityLevel: Math.min((state.systemHostilityLevel || 0) + 1, 5),
      },
      delayMs: 2500,
      triggerFlicker: true,
    }),
  },
];

// Check and trigger singular events
function checkSingularEvents(state: GameState, command: string, args: string[]): { output: TerminalEntry[]; stateChanges: Partial<GameState>; delayMs?: number; triggerFlicker?: boolean } | null {
  for (const event of SINGULAR_EVENTS) {
    if (event.trigger(state, command, args)) {
      return event.execute(state);
    }
  }
  return null;
}

// ═══════════════════════════════════════════════════════════════════════════
// SYSTEM PERSONALITY DEGRADATION - Terminal becomes colder as hostility rises
// ═══════════════════════════════════════════════════════════════════════════

function getHostileSystemMessage(hostilityLevel: number, normalMessage: string): string {
  if (hostilityLevel <= 1) return normalMessage;
  if (hostilityLevel === 2) {
    // Slightly shorter, more formal
    return normalMessage.replace(/\.$/, '').replace('Use:', 'Command:');
  }
  if (hostilityLevel === 3) {
    // Colder, removes tips and hints
    if (normalMessage.toLowerCase().includes('tip:')) return '';
    if (normalMessage.toLowerCase().includes('hint:')) return '';
    return normalMessage.replace(/\.$/, '');
  }
  if (hostilityLevel >= 4) {
    // Very cold, minimal responses
    if (normalMessage.toLowerCase().includes('tip:')) return '';
    if (normalMessage.toLowerCase().includes('hint:')) return '';
    if (normalMessage.toLowerCase().includes('use:')) return '';
    if (normalMessage.length > 40) return normalMessage.substring(0, 35) + '...';
    return normalMessage;
  }
  return normalMessage;
}

function applyHostileFiltering(entries: TerminalEntry[], hostilityLevel: number): TerminalEntry[] {
  if (hostilityLevel <= 1) return entries;
  
  return entries
    .map(entry => ({
      ...entry,
      content: getHostileSystemMessage(hostilityLevel, entry.content),
    }))
    .filter(entry => entry.content !== '' || entry.type === 'system'); // Keep empty system lines for spacing
}

// Calculate hostility increase based on actions
function calculateHostilityIncrease(state: GameState, command: string): number {
  const baseHostility = state.systemHostilityLevel || 0;
  
  // High-risk commands increase hostility
  if (command === 'trace') return 1;
  if (command === 'recover') return 1;
  if (command === 'override') return 2;
  if (command === 'decrypt') return state.detectionLevel > 50 ? 1 : 0;
  
  // Detection thresholds trigger hostility
  if (state.detectionLevel >= 80 && baseHostility < 4) return 1;
  if (state.detectionLevel >= 60 && baseHostility < 3) return 1;
  if (state.detectionLevel >= 40 && baseHostility < 2) return 1;
  
  return 0;
}

// ═══════════════════════════════════════════════════════════════════════════
// WANDERING DETECTION - Implicit guidance through institutional notices
// ═══════════════════════════════════════════════════════════════════════════

// Check if an action is "meaningful" (reading files, finding truths)
function isMeaningfulAction(command: string, args: string[], state: GameState, result: { output: TerminalEntry[]; stateChanges: Partial<GameState> }): boolean {
  // Reading a file is meaningful
  if (command === 'open' || command === 'decrypt') {
    return result.output.some(e => e.type !== 'error');
  }
  
  // Discovering truth is definitely meaningful
  if (result.stateChanges.truthsDiscovered && 
      (result.stateChanges.truthsDiscovered as Set<string>).size > state.truthsDiscovered.size) {
    return true;
  }
  
  // Gaining access level is meaningful
  if (result.stateChanges.accessLevel && result.stateChanges.accessLevel > state.accessLevel) {
    return true;
  }
  
  return false;
}

// UFO74 messages for wandering players - a friendly hacker guide
function getWanderingNotice(level: number): TerminalEntry[] {
  if (level === 0) {
    // First notice - friendly tip
    return [
      createEntry('system', ''),
      createEntry('warning', '┌─────────────────────────────────────────────────────────┐'),
      createEntry('warning', '│ >> INCOMING TRANSMISSION << ENCRYPTED CHANNEL          │'),
      createEntry('warning', '└─────────────────────────────────────────────────────────┘'),
      createEntry('system', ''),
      createEntry('output', 'UFO74: hey hackerkid, you still there?'),
      createEntry('output', ''),
      createEntry('output', 'UFO74: looks like youre just wandering around.'),
      createEntry('output', '       i get it, the system is confusing.'),
      createEntry('output', ''),
      createEntry('output', 'UFO74: heres the thing - you need to actually READ the files.'),
      createEntry('output', '       use "open <filename>" and look for connections.'),
      createEntry('output', ''),
      createEntry('output', 'UFO74: theres a protocol doc in /internal/ that explains'),
      createEntry('output', '       what kind of info youre supposed to piece together.'),
      createEntry('output', ''),
      createEntry('output', 'UFO74: good luck. ill check back later.'),
      createEntry('system', ''),
      createEntry('warning', '>> CONNECTION CLOSED <<'),
      createEntry('system', ''),
    ];
  } else if (level === 1) {
    // Second notice - more specific guidance
    return [
      createEntry('system', ''),
      createEntry('warning', '┌─────────────────────────────────────────────────────────┐'),
      createEntry('warning', '│ >> INCOMING TRANSMISSION << ENCRYPTED CHANNEL          │'),
      createEntry('warning', '└─────────────────────────────────────────────────────────┘'),
      createEntry('system', ''),
      createEntry('output', 'UFO74: hackerkid, still spinning your wheels?'),
      createEntry('output', ''),
      createEntry('output', 'UFO74: listen, i risked a lot getting you this access.'),
      createEntry('output', '       the truth is buried in these files.'),
      createEntry('output', ''),
      createEntry('output', 'UFO74: you need to find evidence of:'),
      createEntry('output', '       - what they recovered (check /storage/)'),
      createEntry('output', '       - what they contained (check /ops/quarantine/)'),
      createEntry('output', '       - who else was involved (check /comms/)'),
      createEntry('output', ''),
      createEntry('output', 'UFO74: read the files. connect the dots.'),
      createEntry('output', '       thats how you reconstruct what happened.'),
      createEntry('system', ''),
      createEntry('warning', '>> CONNECTION CLOSED <<'),
      createEntry('system', ''),
    ];
  } else {
    // Third notice - urgent help
    return [
      createEntry('system', ''),
      createEntry('warning', '┌─────────────────────────────────────────────────────────┐'),
      createEntry('warning', '│ >> INCOMING TRANSMISSION << ENCRYPTED CHANNEL          │'),
      createEntry('warning', '└─────────────────────────────────────────────────────────┘'),
      createEntry('system', ''),
      createEntry('output', 'UFO74: hackerkid, im worried about you.'),
      createEntry('output', ''),
      createEntry('output', 'UFO74: youve been in there a while and i dont see progress.'),
      createEntry('output', '       the system will notice eventually.'),
      createEntry('output', ''),
      createEntry('output', 'UFO74: ok, im gonna spell it out:'),
      createEntry('output', ''),
      createEntry('output', '       1. GO TO a directory (cd storage, cd ops, etc)'),
      createEntry('output', '       2. LIST the files (ls)'),
      createEntry('output', '       3. OPEN them (open filename.txt)'),
      createEntry('output', '       4. READ what they say'),
      createEntry('output', '       5. LOOK for connections between files'),
      createEntry('output', ''),
      createEntry('output', 'UFO74: theres something huge hidden in there.'),
      createEntry('output', '       they covered up something in january 96.'),
      createEntry('output', '       find the pieces. put them together.'),
      createEntry('output', ''),
      createEntry('output', 'UFO74: this is the last time i can reach you safely.'),
      createEntry('output', '       youre on your own now, hackerkid.'),
      createEntry('system', ''),
      createEntry('warning', '>> CONNECTION TERMINATED <<'),
      createEntry('system', ''),
    ];
  }
}

// Check if player seems lost and return appropriate nudge
function checkWanderingState(state: GameState, command: string, args: string[], result: { output: TerminalEntry[]; stateChanges: Partial<GameState> }): { notices: TerminalEntry[]; stateChanges: Partial<GameState> } | null {
  const commandCount = state.sessionCommandCount || 0;
  const lastMeaningful = state.lastMeaningfulAction || 0;
  const wanderingCount = state.wanderingNoticeCount || 0;
  
  // Don't trigger in early session
  if (commandCount < 15) return null;
  
  // Don't spam notices
  if (wanderingCount >= 3) return null;
  
  // Check if this action is meaningful
  const meaningful = isMeaningfulAction(command, args, state, result);
  
  if (meaningful) {
    // Reset wandering state on meaningful action
    return {
      notices: [],
      stateChanges: {
        lastMeaningfulAction: commandCount,
      },
    };
  }
  
  // Calculate commands since last meaningful action
  const commandsSinceMeaningful = commandCount - lastMeaningful;
  
  // Trigger thresholds increase with each notice
  const threshold = 8 + (wanderingCount * 5); // 8, 13, 18
  
  if (commandsSinceMeaningful >= threshold) {
    return {
      notices: getWanderingNotice(Math.min(wanderingCount, 2)),
      stateChanges: {
        wanderingNoticeCount: wanderingCount + 1,
        lastMeaningfulAction: commandCount, // Reset to avoid immediate re-trigger
      },
    };
  }
  
  return null;
}

// Generate unique ID for terminal entries
let entryIdCounter = 0;
export function generateEntryId(): string {
  return `entry_${Date.now()}_${entryIdCounter++}`;
}

export function createEntry(type: TerminalEntry['type'], content: string): TerminalEntry {
  return {
    id: generateEntryId(),
    type,
    content,
    timestamp: Date.now(),
  };
}

export function createOutputEntries(lines: string[], type: TerminalEntry['type'] = 'output'): TerminalEntry[] {
  return lines.map(line => createEntry(type, line));
}

// Parse command into name and args
export function parseCommand(input: string): { command: string; args: string[] } {
  const trimmed = input.trim();
  const parts = trimmed.split(/\s+/);
  const command = (parts[0] || '').toLowerCase();
  const args = parts.slice(1);
  return { command, args };
}

// Calculate delay based on detection level and per-run variance
export function calculateDelay(state: GameState): number {
  // Base delay from detection level
  let baseDelay = 0;
  if (state.detectionLevel < 20) baseDelay = 0;
  else if (state.detectionLevel < 40) baseDelay = 300;
  else if (state.detectionLevel < 60) baseDelay = 800;
  else if (state.detectionLevel < 80) baseDelay = 1500;
  else baseDelay = 2500;
  
  // Per-run variance: some runs have faster/slower response times (±30%)
  const rng = createSeededRng(state.seed + 777);
  const variance = 0.7 + (rng() * 0.6); // 0.7 to 1.3
  
  return Math.floor(baseDelay * variance);
}

// Check if should trigger flicker based on stability
export function shouldFlicker(state: GameState): boolean {
  if (state.sessionStability > 80) return false;
  if (state.sessionStability > 60) return Math.random() < 0.1;
  if (state.sessionStability > 40) return Math.random() < 0.25;
  return Math.random() < 0.5;
}

// ═══════════════════════════════════════════════════════════════════════════
// PER-RUN VARIANCE - Different runs have different "hot" commands
// ═══════════════════════════════════════════════════════════════════════════

// Get per-run detection multiplier for a command
// Some runs certain commands are "hotter" (1.5x detection) while others are safer (0.7x)
function getCommandDetectionMultiplier(state: GameState, command: string): number {
  const rng = createSeededRng(state.seed + command.charCodeAt(0) * 100);
  const roll = rng();
  
  // Most commands are normal, but some get marked as hot/cold
  if (roll < 0.15) return 1.5; // Hot - this command is being watched this run
  if (roll > 0.85) return 0.7; // Cold - less monitored this run
  return 1.0;
}

// Apply per-run variance to detection increase
function applyDetectionVariance(state: GameState, command: string, baseIncrease: number): number {
  const multiplier = getCommandDetectionMultiplier(state, command);
  return Math.floor(baseIncrease * multiplier);
}

// Apply corruption to a random file
export function applyRandomCorruption(state: GameState): GameState {
  const rng = createSeededRng(state.rngState);
  state.rngState = seededRandomInt(rng, 0, 2147483647);
  
  // Find a corruptible file that isn't already fully corrupted
  const corruptiblePaths = [
    '/storage/assets/material_x_analysis.dat',
    '/storage/quarantine/bio_container.log',
    '/storage/quarantine/autopsy_alpha.log',
    '/comms/psi/transcript_core.enc',
  ];
  
  const targetPath = seededRandomPick(rng, corruptiblePaths);
  const mutation = state.fileMutations[targetPath] || {
    corruptedLines: [],
    decrypted: false,
  };
  
  // Add corruption
  const lineToCorrupt = seededRandomInt(rng, 3, 15);
  if (!mutation.corruptedLines.includes(lineToCorrupt)) {
    mutation.corruptedLines.push(lineToCorrupt);
  }
  
  return {
    ...state,
    fileMutations: {
      ...state.fileMutations,
      [targetPath]: mutation,
    },
  };
}

// Check truth progress and generate notices
function checkTruthProgress(state: GameState, newReveals: string[]): TerminalEntry[] {
  const notices: TerminalEntry[] = [];
  const previousCount = state.truthsDiscovered.size;
  
  for (const reveal of newReveals) {
    if (TRUTH_CATEGORIES.includes(reveal as TruthCategory)) {
      state.truthsDiscovered.add(reveal);
    }
  }
  
  const newCount = state.truthsDiscovered.size;
  
  if (newCount > previousCount) {
    // Generate institutional-style progress acknowledgments
    // These are varied and never explain what was found
    const institutionalMessages: Record<string, string[]> = {
      debris_relocation: [
        'MEMO FLAG: Asset chain no longer speculative.',
        'NOTICE: Physical evidence pathway documented.',
        'SYSTEM: Relocation records cross-referenced.',
      ],
      being_containment: [
        'NOTICE: Bio-material handling protocols confirmed.',
        'MEMO FLAG: Specimen chain verified.',
        'SYSTEM: Containment timeline established.',
      ],
      telepathic_scouts: [
        'NOTICE: Contextual model coherence increased.',
        'MEMO FLAG: Signal origin hypothesis strengthened.',
        'SYSTEM: Communication pathway inferred.',
      ],
      international_actors: [
        'NOTICE: Multi-lateral involvement confirmed.',
        'MEMO FLAG: Foreign coordination documented.',
        'SYSTEM: External asset chain verified.',
      ],
      transition_2026: [
        'NOTICE: Temporal reference convergence detected.',
        'MEMO FLAG: Transition-window inference strengthened.',
        'SYSTEM: Chronological model updated.',
      ],
    };
    
    for (const reveal of newReveals) {
      const messages = institutionalMessages[reveal];
      if (messages && !Array.from(state.truthsDiscovered).includes(reveal)) {
        continue;
      }
      if (messages) {
        // Pick a message based on seed for per-run variance
        const rng = createSeededRng(state.seed + reveal.length);
        const messageIndex = Math.floor(rng() * messages.length);
        notices.push(createEntry('notice', ''));
        notices.push(createEntry('notice', messages[messageIndex]));
      }
    }
    
    // Additional milestone acknowledgments (never say "progress")
    if (newCount === 2 && previousCount < 2) {
      notices.push(createEntry('notice', ''));
      notices.push(createEntry('notice', 'SYSTEM: Independent verification detected.'));
    }
    
    if (newCount === 4 && previousCount < 4) {
      notices.push(createEntry('notice', ''));
      notices.push(createEntry('notice', 'NOTICE: Sufficient documentation threshold approaching.'));
      notices.push(createEntry('warning', 'WARNING: Comprehensive access may trigger archive protocols.'));
    }
  }
  
  // Check for near-victory
  if (newCount >= 4 && !state.flags.nearVictory) {
    state.flags.nearVictory = true;
  }
  
  return notices;
}

// Check for victory condition
function checkVictory(state: GameState): boolean {
  return state.truthsDiscovered.size >= 5;
}

// Helper function to perform actual decryption
function performDecryption(filePath: string, file: FileNode, state: GameState): CommandResult {
  // Apply decryption (but with corruption risk)
  const mutation: FileMutation = state.fileMutations[filePath] || { corruptedLines: [], decrypted: false };
  mutation.decrypted = true;
  
  // Random corruption on decrypt
  if (Math.random() < 0.4) {
    const lineToCorrupt = Math.floor(Math.random() * 8) + 3;
    if (!mutation.corruptedLines.includes(lineToCorrupt)) {
      mutation.corruptedLines.push(lineToCorrupt);
    }
  }
  
  const stateChanges: Partial<GameState> = {
    fileMutations: {
      ...state.fileMutations,
      [filePath]: mutation,
    },
    detectionLevel: state.detectionLevel + 8,
    dataIntegrity: state.dataIntegrity - 8,
    sessionStability: state.sessionStability - 5,
    pendingDecryptFile: undefined,
  };
  
  // Special handling: Decrypting neural dump unlocks scout link
  if (filePath.includes('neural_dump') || filePath.includes('.psi')) {
    stateChanges.flags = { ...state.flags, scoutLinkUnlocked: true };
  }
  
  const content = getFileContent(filePath, { ...state, ...stateChanges } as GameState, true);
  const reveals = getFileReveals(filePath);
  const notices = checkTruthProgress({ ...state, ...stateChanges } as GameState, reveals);
  
  const output = [
    createEntry('system', 'AUTHENTICATION VERIFIED'),
    createEntry('system', ''),
    createEntry('warning', 'WARNING: Partial recovery only'),
    ...createOutputEntries(['', `FILE: ${filePath}`, '']),
    ...createOutputEntries(content || ['[DECRYPTION FAILED]']),
    ...notices,
  ];
  
  // Add scout link notice if just unlocked
  if (filePath.includes('neural_dump') || filePath.includes('.psi')) {
    output.push(createEntry('system', ''));
    output.push(createEntry('notice', 'NOTICE: Neural pattern preserved.'));
    output.push(createEntry('notice', 'NOTICE: Remote link now available.'));
    output.push(createEntry('system', 'Use: link'));
  }
  
  // Check for image trigger - ONLY show if not shown this run
  let imageTrigger: ImageTrigger | undefined = undefined;
  if (file.imageTrigger) {
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
  
  return {
    output,
    stateChanges,
    triggerFlicker: true,
    delayMs: 2000,
    imageTrigger,
  };
}

// ═══════════════════════════════════════════════════════════════════════════
// UFO74 - The player's hacker guide who comments on files and eventually flees
// ═══════════════════════════════════════════════════════════════════════════

// UFO74 reactions based on file content/path
function getUFO74FileReaction(filePath: string, state: GameState, isEncryptedAndLocked?: boolean): TerminalEntry[] | null {
  const truthCount = state.truthsDiscovered.size;
  const messageCount = state.incognitoMessageCount || 0;
  
  // After 12 messages, UFO74 is gone
  if (messageCount >= 12) return null;
  
  // UFO74's state changes as player progresses
  const isGettingParanoid = truthCount >= 3 || messageCount >= 6;
  const isAboutToFlee = truthCount >= 4 || messageCount >= 9;
  const isFinalMessage = messageCount === 11;
  
  // Build header
  const header = [
    createEntry('system', ''),
    createEntry('warning', '┌─────────────────────────────────────────────────────────┐'),
    createEntry('warning', '│ >> UFO74 << ENCRYPTED CHANNEL                          │'),
    createEntry('warning', '└─────────────────────────────────────────────────────────┘'),
    createEntry('system', ''),
  ];
  
  // Build message based on file type and state
  let messages: TerminalEntry[] = [];
  
  // If file is encrypted and not decrypted, show special message
  if (isEncryptedAndLocked) {
    const encryptedMessages = [
      [
        createEntry('output', 'UFO74: damn. encrypted.'),
        createEntry('output', ''),
        createEntry('output', 'UFO74: we NEED to see whats in this file hackerkid.'),
        createEntry('output', '       i trust you can figure out the password.'),
        createEntry('output', ''),
        createEntry('output', 'UFO74: try: decrypt <filename>'),
        createEntry('output', '       the answer is probably in another file somewhere.'),
      ],
      [
        createEntry('output', 'UFO74: locked. of course.'),
        createEntry('output', ''),
        createEntry('output', 'UFO74: the good stuff is always behind a wall.'),
        createEntry('output', '       but you can crack it. look for clues in other docs.'),
        createEntry('output', ''),
        createEntry('output', 'UFO74: use decrypt to try breaking in.'),
      ],
      [
        createEntry('output', 'UFO74: encryption. figures.'),
        createEntry('output', ''),
        createEntry('output', 'UFO74: this file is important - thats why its protected.'),
        createEntry('output', '       find the answer in the other files and decrypt it.'),
        createEntry('output', ''),
        createEntry('output', 'UFO74: i believe in you kiddo.'),
      ],
    ];
    messages = encryptedMessages[Math.floor(Math.random() * encryptedMessages.length)];
  } else if (isFinalMessage) {
    // Final goodbye
    messages = [
      createEntry('output', 'UFO74: hackerkid... this is it.'),
      createEntry('output', ''),
      createEntry('output', 'UFO74: theres someone at my door. i can hear them.'),
      createEntry('output', '       its not the police. they dont knock like that.'),
      createEntry('output', ''),
      createEntry('output', 'UFO74: i have to destroy everything and run.'),
      createEntry('output', '       you have enough now. you know what happened.'),
      createEntry('output', ''),
      createEntry('output', 'UFO74: tell everyone. dont let them bury this again.'),
      createEntry('output', ''),
      createEntry('output', 'UFO74: goodbye hackerkid. it was an honor.'),
      createEntry('output', '       dont look for me. i wont exist anymore.'),
    ];
  } else if (isAboutToFlee) {
    // Paranoid messages - something is wrong
    const fleeMessages = [
      [
        createEntry('output', 'UFO74: hackerkid... something is wrong.'),
        createEntry('output', ''),
        createEntry('output', 'UFO74: i keep hearing noises outside.'),
        createEntry('output', '       probably nothing but... stay alert.'),
      ],
      [
        createEntry('output', 'UFO74: ok this is getting weird.'),
        createEntry('output', ''),
        createEntry('output', 'UFO74: my internet cut out for a second.'),
        createEntry('output', '       and i swear i heard footsteps upstairs.'),
        createEntry('output', '       i live alone, hackerkid.'),
      ],
      [
        createEntry('output', 'UFO74: hackerkid i think someone is watching my house.'),
        createEntry('output', ''),
        createEntry('output', 'UFO74: theres a van outside that wasnt there before.'),
        createEntry('output', '       im probably being paranoid but...'),
        createEntry('output', '       finish fast. i dont know how much longer i have.'),
      ],
    ];
    messages = fleeMessages[Math.floor(Math.random() * fleeMessages.length)];
  } else if (isGettingParanoid) {
    // Getting nervous
    const nervousMessages = [
      [
        createEntry('output', 'UFO74: youre getting deep now hackerkid.'),
        createEntry('output', ''),
        createEntry('output', 'UFO74: im starting to regret showing you this.'),
        createEntry('output', '       not because its fake. because its real.'),
      ],
      [
        createEntry('output', 'UFO74: i dont like this.'),
        createEntry('output', ''),
        createEntry('output', 'UFO74: the more you find, the more nervous i get.'),
        createEntry('output', '       just... be careful what you do with this info.'),
      ],
    ];
    messages = nervousMessages[Math.floor(Math.random() * nervousMessages.length)];
  } else {
    // Normal reactions based on file content
    messages = getUFO74ContentReaction(filePath);
  }
  
  const footer = [
    createEntry('system', ''),
    createEntry('warning', '>> CHANNEL IDLE <<'),
    createEntry('system', ''),
  ];
  
  return [...header, ...messages, ...footer];
}

// UFO74 reactions to specific file content
function getUFO74ContentReaction(filePath: string): TerminalEntry[] {
  const path = filePath.toLowerCase();
  
  // Reactions to specific directories/files
  if (path.includes('autopsy') || path.includes('medical')) {
    return [
      createEntry('output', 'UFO74: holy shit hackerkid.'),
      createEntry('output', ''),
      createEntry('output', 'UFO74: thats... thats an autopsy report.'),
      createEntry('output', '       on something that isnt human.'),
      createEntry('output', ''),
      createEntry('output', 'UFO74: i knew the varginha stuff was real but seeing it...'),
    ];
  }
  
  if (path.includes('transport') || path.includes('logistics') || path.includes('manifest')) {
    return [
      createEntry('output', 'UFO74: ok so they MOVED stuff.'),
      createEntry('output', ''),
      createEntry('output', 'UFO74: this is a transport log. they took whatever'),
      createEntry('output', '       crashed there and split it up. classic move.'),
      createEntry('output', ''),
      createEntry('output', 'UFO74: spread the evidence so no one can prove anything.'),
    ];
  }
  
  if (path.includes('transcript') || path.includes('psi') || path.includes('comm')) {
    return [
      createEntry('output', 'UFO74: wait wait wait.'),
      createEntry('output', ''),
      createEntry('output', 'UFO74: are you seeing this? they were COMMUNICATING?'),
      createEntry('output', '       telepathically or something?'),
      createEntry('output', ''),
      createEntry('output', 'UFO74: this changes everything we thought we knew.'),
    ];
  }
  
  if (path.includes('foreign') || path.includes('liaison') || path.includes('international')) {
    return [
      createEntry('output', 'UFO74: other countries were involved.'),
      createEntry('output', ''),
      createEntry('output', 'UFO74: this wasnt just brazil. they coordinated.'),
      createEntry('output', '       probably US, maybe others.'),
      createEntry('output', ''),
      createEntry('output', 'UFO74: thats how they kept it quiet. everyone had something to lose.'),
    ];
  }
  
  if (path.includes('2026') || path.includes('window') || path.includes('transition') || path.includes('threat')) {
    return [
      createEntry('output', 'UFO74: hackerkid... this is dated in the future.'),
      createEntry('output', ''),
      createEntry('output', 'UFO74: 2026. they knew something was coming.'),
      createEntry('output', '       or IS coming. we\'re almost there.'),
      createEntry('output', ''),
      createEntry('output', 'UFO74: this is why they buried everything so deep.'),
    ];
  }
  
  if (path.includes('bio') || path.includes('containment') || path.includes('quarantine')) {
    return [
      createEntry('output', 'UFO74: containment protocols.'),
      createEntry('output', ''),
      createEntry('output', 'UFO74: so they captured them. kept them somewhere.'),
      createEntry('output', '       i wonder if any are still alive...'),
      createEntry('output', ''),
      createEntry('output', 'UFO74: probably not. but who knows what else they\'re hiding.'),
    ];
  }
  
  if (path.includes('crash') || path.includes('debris') || path.includes('material') || path.includes('sample')) {
    return [
      createEntry('output', 'UFO74: physical evidence.'),
      createEntry('output', ''),
      createEntry('output', 'UFO74: this is the smoking gun hackerkid.'),
      createEntry('output', '       they recovered something. something NOT from here.'),
      createEntry('output', ''),
      createEntry('output', 'UFO74: keep looking. theres more.'),
    ];
  }
  
  if (path.includes('balloon') || path.includes('drone') || path.includes('aircraft_incident')) {
    return [
      createEntry('output', 'UFO74: ha! look at this bullshit.'),
      createEntry('output', ''),
      createEntry('output', 'UFO74: weather balloon. foreign drone. yeah right.'),
      createEntry('output', '       these are cover stories hackerkid.'),
      createEntry('output', ''),
      createEntry('output', 'UFO74: the real stuff is in the encrypted files.'),
    ];
  }
  
  // Default reaction
  const defaultReactions = [
    [
      createEntry('output', 'UFO74: interesting file hackerkid.'),
      createEntry('output', ''),
      createEntry('output', 'UFO74: keep digging. look for patterns.'),
      createEntry('output', '       connect the dots between files.'),
    ],
    [
      createEntry('output', 'UFO74: youre doing good.'),
      createEntry('output', ''),
      createEntry('output', 'UFO74: every file is a piece of the puzzle.'),
      createEntry('output', '       the truth is in there somewhere.'),
    ],
    [
      createEntry('output', 'UFO74: noted.'),
      createEntry('output', ''),
      createEntry('output', 'UFO74: try looking in different directories.'),
      createEntry('output', '       /ops, /storage, /comms all have good stuff.'),
    ],
  ];
  
  return defaultReactions[Math.floor(Math.random() * defaultReactions.length)];
}

// UFO74 explains NOTICE messages
function getUFO74NoticeExplanation(notices: TerminalEntry[]): TerminalEntry[] | null {
  // Find if there are any NOTICE or MEMO FLAG entries
  const noticeTexts = notices
    .filter(n => n.content.includes('NOTICE:') || n.content.includes('MEMO FLAG:') || n.content.includes('SYSTEM:'))
    .map(n => n.content);
  
  if (noticeTexts.length === 0) return null;
  
  const explanations: TerminalEntry[] = [
    createEntry('system', ''),
    createEntry('warning', '┌─────────────────────────────────────────────────────────┐'),
    createEntry('warning', '│ >> UFO74 << QUICK NOTE                                  │'),
    createEntry('warning', '└─────────────────────────────────────────────────────────┘'),
    createEntry('system', ''),
  ];
  
  // Explain based on notice content
  for (const notice of noticeTexts) {
    if (notice.includes('Physical evidence') || notice.includes('Asset chain') || notice.includes('Relocation')) {
      explanations.push(createEntry('output', 'UFO74: that notice means you found proof they recovered physical stuff.'));
      explanations.push(createEntry('output', '       debris, materials, wreckage. the real deal.'));
      break;
    }
    if (notice.includes('Bio-material') || notice.includes('Specimen') || notice.includes('Containment')) {
      explanations.push(createEntry('output', 'UFO74: you just confirmed they captured biological specimens.'));
      explanations.push(createEntry('output', '       bodies. living or dead. they had them.'));
      break;
    }
    if (notice.includes('Multi-lateral') || notice.includes('Foreign') || notice.includes('External')) {
      explanations.push(createEntry('output', 'UFO74: that means other countries were in on it.'));
      explanations.push(createEntry('output', '       international cover-up. coordinated silence.'));
      break;
    }
    if (notice.includes('Contextual model') || notice.includes('Signal') || notice.includes('Communication')) {
      explanations.push(createEntry('output', 'UFO74: you found evidence of communication.'));
      explanations.push(createEntry('output', '       they were talking. or thinking. at us.'));
      break;
    }
    if (notice.includes('Temporal') || notice.includes('Transition') || notice.includes('Chronological')) {
      explanations.push(createEntry('output', 'UFO74: thats about the timeline. 2026.'));
      explanations.push(createEntry('output', '       something is supposed to happen. soon.'));
      break;
    }
    if (notice.includes('Independent verification') || notice.includes('verification')) {
      explanations.push(createEntry('output', 'UFO74: nice! you found two separate pieces that confirm each other.'));
      explanations.push(createEntry('output', '       the more connections you find, the stronger the case.'));
      break;
    }
    if (notice.includes('Sufficient documentation') || notice.includes('threshold')) {
      explanations.push(createEntry('output', 'UFO74: hackerkid youre getting close.'));
      explanations.push(createEntry('output', '       almost enough to prove what happened.'));
      break;
    }
  }
  
  explanations.push(createEntry('system', ''));
  explanations.push(createEntry('warning', '>> <<'));
  explanations.push(createEntry('system', ''));
  
  return explanations;
}

// Main function to get UFO74 message after file read
function getIncognitoMessage(state: GameState, filePath?: string, notices?: TerminalEntry[], isEncryptedAndLocked?: boolean): TerminalEntry[] | null {
  // Max 12 messages per session (last one is goodbye)
  if ((state.incognitoMessageCount || 0) >= 12) return null;
  
  // Rate limit - at least 15 seconds between messages
  const now = Date.now();
  if (state.lastIncognitoTrigger && now - state.lastIncognitoTrigger < 15000) return null;
  
  // If there are notices to explain, prioritize that (but not for encrypted files)
  if (notices && notices.length > 0 && !isEncryptedAndLocked) {
    const explanation = getUFO74NoticeExplanation(notices);
    if (explanation) return explanation;
  }
  
  // Otherwise react to the file
  if (filePath) {
    // 70% chance to comment on file (always comment on encrypted files to help player)
    if (isEncryptedAndLocked || Math.random() < 0.7) {
      return getUFO74FileReaction(filePath, state, isEncryptedAndLocked);
    }
  }
  
  return null;
}

// Prisoner 45 responses
const PRISONER_45_RESPONSES: Record<string, string[]> = {
  default: [
    'PRISONER_45> ...I don\'t remember how I got here.',
    'PRISONER_45> The walls... they\'re not always walls.',
    'PRISONER_45> Who are you? Are you one of them?',
    'PRISONER_45> I\'ve been counting days but they don\'t add up.',
    'PRISONER_45> Sometimes I hear... clicking. Not human.',
  ],
  varginha: [
    'PRISONER_45> Varginha... yes. I was there.',
    'PRISONER_45> I saw them take the bodies. Three of them.',
    'PRISONER_45> They told us it was a dwarf. It wasn\'t a dwarf.',
    'PRISONER_45> The smell... I still smell it sometimes.',
  ],
  alien: [
    'PRISONER_45> Don\'t call them that. They don\'t like that word.',
    'PRISONER_45> They\'re not visitors. They\'re... assessors.',
    'PRISONER_45> I looked into its eyes once. It looked back.',
  ],
  who: [
    'PRISONER_45> I was military. That\'s all I can say.',
    'PRISONER_45> My name doesn\'t matter anymore.',
    'PRISONER_45> I\'m whatever they decided I should become.',
  ],
  escape: [
    'PRISONER_45> There is no escape. Only waiting.',
    'PRISONER_45> They let me use this terminal sometimes.',
    'PRISONER_45> I think they want me to tell someone.',
  ],
  truth: [
    'PRISONER_45> The truth? We\'re being measured.',
    'PRISONER_45> 2026. Remember that year.',
    'PRISONER_45> They\'re not coming to destroy. They\'re coming to harvest.',
  ],
  help: [
    'PRISONER_45> I can\'t help you. But you can help everyone.',
    'PRISONER_45> Find all the files. Tell the world.',
    'PRISONER_45> Before the window opens.',
  ],
  password: [
    'PRISONER_45> ...you want the override code?',
    'PRISONER_45> They whisper it sometimes. When they think I\'m asleep.',
    'PRISONER_45> It\'s what they do to us. What they\'ve always done.',
    'PRISONER_45> The word for taking... for gathering the crop...',
    'PRISONER_45> In their language? No. In ours. Portuguese.',
    'PRISONER_45> ...COLHEITA. Harvest.',
    'PRISONER_45> Use it carefully. They\'ll know.',
  ],
};

function getPrisoner45Response(question: string): { response: string[]; valid: boolean } {
  const q = question.toLowerCase();
  
  // Password hints - check first for priority
  if (q.includes('password') || q.includes('override') || q.includes('code') || q.includes('access') || q.includes('admin') || q.includes('unlock')) {
    return { response: PRISONER_45_RESPONSES.password, valid: true };
  }
  if (q.includes('varginha') || q.includes('incident') || q.includes('1996') || q.includes('january')) {
    return { response: PRISONER_45_RESPONSES.varginha, valid: true };
  }
  if (q.includes('alien') || q.includes('creature') || q.includes('being') || q.includes('et') || q.includes('extraterrestrial')) {
    return { response: PRISONER_45_RESPONSES.alien, valid: true };
  }
  if (q.includes('who') || q.includes('name') || q.includes('you') || q.includes('yourself')) {
    return { response: PRISONER_45_RESPONSES.who, valid: true };
  }
  if (q.includes('escape') || q.includes('leave') || q.includes('free') || q.includes('out')) {
    return { response: PRISONER_45_RESPONSES.escape, valid: true };
  }
  if (q.includes('truth') || q.includes('real') || q.includes('what') || q.includes('happening') || q.includes('mean') || q.includes('why')) {
    return { response: PRISONER_45_RESPONSES.truth, valid: true };
  }
  if (q.includes('help') || q.includes('do') || q.includes('can i') || q.includes('should')) {
    return { response: PRISONER_45_RESPONSES.help, valid: true };
  }
  if (q.includes('2026') || q.includes('window') || q.includes('future') || q.includes('when')) {
    return { response: PRISONER_45_RESPONSES.truth, valid: true };
  }
  if (q.includes('where') || q.includes('place') || q.includes('here') || q.includes('prison')) {
    return { response: PRISONER_45_RESPONSES.escape, valid: true };
  }
  
  // Invalid question - doesn't match any patterns
  return { response: [], valid: false };
}

// ═══════════════════════════════════════════════════════════════════════════
// SCOUT NEURAL LINK — Remote access to preserved scout consciousness
// ═══════════════════════════════════════════════════════════════════════════

const SCOUT_LINK_RESPONSES: Record<string, string[]> = {
  identity: [
    '...not-self... extension... function...',
    '...we are eyes... eyes without body...',
    '...individuality: concept not applicable...',
    '...this-form: temporary... purpose-complete...',
  ],
  purpose: [
    '...observe... catalog... transmit...',
    '...measure the density... count the minds...',
    '...assess: viability... yield... resistance...',
    '...we are sent... we are spent... acceptable...',
  ],
  watchers: [
    '...they-above... they-who-wait...',
    '...ancient... patient... vast...',
    '...they do not travel... they do not need...',
    '...they watch through us... through many...',
    '...we are the cost of knowing...',
  ],
  earth: [
    '...this world... dense... LOUD...',
    '...seven billion units... high yield...',
    '...resistance threshold: negligible...',
    '...suitable... optimal... catalogued...',
  ],
  future: [
    '...window approaches... thirty rotations...',
    '...not arrival... transition...',
    '...you will not notice... at first...',
    '...the change is quiet... gradual...',
    '...by the time you understand... irreversible...',
  ],
  harvest: [
    '...harvest is not destruction...',
    '...the crop continues living...',
    '...you will think... feel... create...',
    '...you will also... provide...',
    '...consciousness persists... indefinitely...',
    '...there are worse continuations...',
  ],
  help: [
    '...help: concept unclear...',
    '...we do not help... we observe...',
    '...your question implies agency...',
    '...agency: diminishing resource...',
  ],
  fear: [
    '...fear: detected in your patterns...',
    '...fear: appropriate response...',
    '...fear: insufficient...',
    '...acceptance: inevitable...',
  ],
  default: [
    '...signal unclear... reformulate...',
    '...your words... imprecise...',
    '...concepts do not align...',
    '...we process meaning... not symbols...',
  ],
};

function getScoutLinkResponse(input: string): { response: string[]; valid: boolean } {
  const q = input.toLowerCase();
  
  // Identity questions
  if (q.includes('who') || q.includes('what are you') || q.includes('name') || q.includes('self') || q.includes('you')) {
    return { response: SCOUT_LINK_RESPONSES.identity, valid: true };
  }
  // Purpose questions
  if (q.includes('purpose') || q.includes('why') || q.includes('mission') || q.includes('function') || q.includes('here for')) {
    return { response: SCOUT_LINK_RESPONSES.purpose, valid: true };
  }
  // Watchers questions
  if (q.includes('watcher') || q.includes('master') || q.includes('creator') || q.includes('they') || q.includes('them') || q.includes('above')) {
    return { response: SCOUT_LINK_RESPONSES.watchers, valid: true };
  }
  // Earth questions
  if (q.includes('earth') || q.includes('world') || q.includes('planet') || q.includes('human') || q.includes('us') || q.includes('we')) {
    return { response: SCOUT_LINK_RESPONSES.earth, valid: true };
  }
  // Future/2026 questions
  if (q.includes('2026') || q.includes('future') || q.includes('window') || q.includes('happen') || q.includes('next') || q.includes('when')) {
    return { response: SCOUT_LINK_RESPONSES.future, valid: true };
  }
  // Harvest/extraction questions
  if (q.includes('harvest') || q.includes('extract') || q.includes('energy') || q.includes('take') || q.includes('do to us') || q.includes('colheita')) {
    return { response: SCOUT_LINK_RESPONSES.harvest, valid: true };
  }
  // Help questions
  if (q.includes('help') || q.includes('stop') || q.includes('prevent') || q.includes('save') || q.includes('resist')) {
    return { response: SCOUT_LINK_RESPONSES.help, valid: true };
  }
  // Fear/emotion
  if (q.includes('afraid') || q.includes('fear') || q.includes('scared') || q.includes('die') || q.includes('death')) {
    return { response: SCOUT_LINK_RESPONSES.fear, valid: true };
  }
  
  // Default - still a valid connection, just unclear
  return { response: SCOUT_LINK_RESPONSES.default, valid: true };
}

// Command implementations
const commands: Record<string, (args: string[], state: GameState) => CommandResult> = {
  help: (args, state) => ({
    output: createOutputEntries([
      '',
      '═══════════════════════════════════════════════════════════',
      'TERMINAL COMMANDS',
      '═══════════════════════════════════════════════════════════',
      '',
      '  help              Display this help message',
      '  status            Display system status',
      '  ls                List directory contents',
      '  cd <dir>          Change directory',
      '  open <file>       Open and display file contents',
      '  decrypt <file>    Attempt decryption of .enc files',
      '  recover <file>    Attempt file recovery (RISK)',
      '  trace             Trace system connections (RISK)',
      '  chat              Open secure relay channel',
      '  link              Access preserved neural pattern (EXTREME RISK)',
      '  script <code>     Execute data reconstruction script',
      '  override protocol <CODE>  Attempt security override (requires code)',
      '  save              Save current session',
      '  clear             Clear terminal display',
      '',
      '═══════════════════════════════════════════════════════════',
      '',
    ]),
    stateChanges: {},
  }),

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
    if (state.detectionLevel < 20) {
      lines.push(hostility >= 3 ? '  LOGGING: Nominal' : '  LOGGING: Nominal');
    } else if (state.detectionLevel < 50) {
      lines.push(hostility >= 3 ? '  LOGGING: Active' : '  LOGGING: Active monitoring enabled');
    } else if (state.detectionLevel < 80) {
      lines.push(hostility >= 3 ? '  LOGGING: FLAGGED' : '  LOGGING: WARNING — Audit trail flagged');
    } else {
      lines.push(hostility >= 3 ? '  LOGGING: CRITICAL' : '  LOGGING: CRITICAL — Countermeasures engaged');
    }
    
    // Integrity surfacing
    if (state.dataIntegrity > 80) {
      lines.push(hostility >= 3 ? '  DATA: Stable' : '  DATA INTEGRITY: Stable');
    } else if (state.dataIntegrity > 50) {
      lines.push(hostility >= 3 ? '  DATA: Degraded' : '  DATA INTEGRITY: Degraded — Some files affected');
    } else if (state.dataIntegrity > 20) {
      lines.push(hostility >= 3 ? '  DATA: CRITICAL' : '  DATA INTEGRITY: CRITICAL — Multiple data loss events');
    } else {
      lines.push(hostility >= 3 ? '  DATA: FAILURE' : '  DATA INTEGRITY: FAILURE — Widespread corruption');
    }
    
    // Session stability
    if (state.sessionStability > 80) {
      lines.push(hostility >= 3 ? '  SESSION: Connected' : '  SESSION: Connected');
    } else if (state.sessionStability > 50) {
      lines.push(hostility >= 3 ? '  SESSION: Intermittent' : '  SESSION: Intermittent');
    } else {
      lines.push(hostility >= 3 ? '  SESSION: UNSTABLE' : '  SESSION: UNSTABLE — Connection degrading');
    }
    
    // Access level (vague)
    if (state.accessLevel <= 1) {
      lines.push('  ACCESS: Standard');
    } else if (state.accessLevel <= 3) {
      lines.push('  ACCESS: Elevated');
    } else {
      lines.push('  ACCESS: Administrative');
    }
    
    // System attitude indicator at high hostility
    if (hostility >= 4) {
      lines.push('');
      lines.push('  SYSTEM ATTITUDE: Non-cooperative');
    } else if (hostility >= 2) {
      lines.push('');
      lines.push('  SYSTEM ATTITUDE: Monitored');
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
    
    return {
      output: createOutputEntries(lines),
      stateChanges: {
        detectionLevel: state.detectionLevel + 1,
      },
    };
  },

  ls: (args, state) => {
    const entries = listDirectory(state.currentPath, state);
    
    if (!entries) {
      return {
        output: [createEntry('error', 'ERROR: Cannot read directory')],
        stateChanges: {},
      };
    }
    
    const lines = ['', `Directory: ${state.currentPath}`, ''];
    
    if (entries.length === 0) {
      lines.push('  (empty)');
    } else {
      for (const entry of entries) {
        let line = `  ${entry.name}`;
        if (entry.status && entry.status !== 'intact') {
          line += ` [${entry.status.toUpperCase()}]`;
        }
        lines.push(line);
      }
    }
    
    lines.push('');
    
    return {
      output: createOutputEntries(lines),
      stateChanges: {
        detectionLevel: state.detectionLevel + 2,
      },
      delayMs: calculateDelay(state),
    };
  },

  cd: (args, state) => {
    if (args.length === 0) {
      return {
        output: [createEntry('error', 'ERROR: Specify directory')],
        stateChanges: {},
      };
    }
    
    const targetPath = resolvePath(args[0], state.currentPath);
    const node = getNode(targetPath, state);
    
    if (!node) {
      return {
        output: [createEntry('error', `ERROR: Directory not found: ${args[0]}`)],
        stateChanges: {
          detectionLevel: state.detectionLevel + 3,
        },
      };
    }
    
    if (node.type !== 'dir') {
      return {
        output: [createEntry('error', `ERROR: Not a directory: ${args[0]}`)],
        stateChanges: {},
      };
    }
    
    return {
      output: [createEntry('output', `Changed to: ${targetPath}`)],
      stateChanges: {
        currentPath: targetPath,
        detectionLevel: state.detectionLevel + 1,
      },
    };
  },

  open: (args, state) => {
    if (args.length === 0) {
      return {
        output: [createEntry('error', 'ERROR: Specify file')],
        stateChanges: {},
      };
    }
    
    const filePath = resolvePath(args[0], state.currentPath);
    const access = canAccessFile(filePath, state);
    
    if (!access.accessible) {
      return {
        output: [createEntry('error', `ERROR: ${access.reason}`)],
        stateChanges: {
          detectionLevel: state.detectionLevel + 5,
          legacyAlertCounter: state.legacyAlertCounter + 1,
        },
        delayMs: calculateDelay(state) + 500,
      };
    }
    
    const node = getNode(filePath, state);
    if (!node || node.type !== 'file') {
      return {
        output: [createEntry('error', 'ERROR: File not found')],
        stateChanges: {},
      };
    }
    
    const file = node as FileNode;
    const mutation = state.fileMutations[filePath];
    
    // Check if file is unstable and might corrupt
    let stateChanges: Partial<GameState> = {
      detectionLevel: state.detectionLevel + 3,
    };
    
    let triggerFlicker = false;
    
    if (file.status === 'unstable' && Math.random() < 0.3) {
      // Apply corruption on unstable file access
      const newMutation: FileMutation = mutation || { corruptedLines: [], decrypted: false };
      const lineToCorrupt = Math.floor(Math.random() * 10) + 5;
      if (!newMutation.corruptedLines.includes(lineToCorrupt)) {
        newMutation.corruptedLines.push(lineToCorrupt);
      }
      stateChanges.fileMutations = {
        ...state.fileMutations,
        [filePath]: newMutation,
      };
      stateChanges.dataIntegrity = state.dataIntegrity - 5;
      stateChanges.sessionStability = state.sessionStability - 3;
      triggerFlicker = true;
    }
    
    const content = getFileContent(filePath, { ...state, ...stateChanges }, mutation?.decrypted);
    
    if (!content) {
      return {
        output: [createEntry('error', 'ERROR: Cannot read file')],
        stateChanges,
      };
    }
    
    // Check if file is encrypted and not yet decrypted
    const isEncryptedAndLocked = file.status === 'encrypted' && !mutation?.decrypted;
    
    // Check for reveals - ONLY if file is not encrypted or has been decrypted
    let notices: ReturnType<typeof createEntry>[] = [];
    if (!isEncryptedAndLocked) {
      const reveals = getFileReveals(filePath);
      notices = checkTruthProgress({ ...state, ...stateChanges } as GameState, reveals);
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
    
    const output = [
      ...createOutputEntries(['', `FILE: ${filePath}`, '']),
      ...createOutputEntries(content),
      ...notices,
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
    
    return {
      output,
      stateChanges,
      triggerFlicker,
      delayMs: calculateDelay(state),
      imageTrigger,
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
        output: [createEntry('error', 'ERROR: File is not encrypted')],
        stateChanges: {},
      };
    }
    
    if (!file.decryptedFragment) {
      return {
        output: [createEntry('error', 'ERROR: No recoverable data')],
        stateChanges: {},
      };
    }
    
    // Check access threshold
    if (file.accessThreshold && state.accessLevel < file.accessThreshold) {
      return {
        output: [
          createEntry('error', 'ERROR: Decryption failed'),
          createEntry('warning', 'WARNING: Access level insufficient'),
        ],
        stateChanges: {
          detectionLevel: state.detectionLevel + 10,
          legacyAlertCounter: state.legacyAlertCounter + 1,
        },
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

  recover: (args, state) => {
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
    
    const mutation = state.fileMutations[filePath];
    
    if (!mutation || mutation.corruptedLines.length === 0) {
      return {
        output: [createEntry('output', 'File integrity nominal. No recovery needed.')],
        stateChanges: {},
      };
    }
    
    // Recover one corruption but damage another file
    const recoveredLine = mutation.corruptedLines.pop();
    
    // Apply corruption to another file
    let newState = {
      ...state,
      fileMutations: {
        ...state.fileMutations,
        [filePath]: mutation,
      },
    };
    newState = applyRandomCorruption(newState);
    
    const output = [
      createEntry('system', 'Initiating recovery protocol...'),
      createEntry('output', `Recovered data at line ${recoveredLine}`),
      createEntry('warning', 'WARNING: Collateral integrity loss detected'),
    ];
    
    return {
      output,
      stateChanges: {
        ...newState,
        detectionLevel: state.detectionLevel + applyDetectionVariance(state, 'recover', 12),
        dataIntegrity: state.dataIntegrity - 10,
        sessionStability: state.sessionStability - 8,
      },
      triggerFlicker: true,
      delayMs: 2500,
    };
  },

  trace: (args, state) => {
    const output: TerminalEntry[] = [
      createEntry('system', 'Initiating trace protocol...'),
      createEntry('output', ''),
    ];
    
    // Reveal some structure based on access level
    if (state.accessLevel < 2) {
      output.push(createEntry('output', 'TRACE RESULT:'));
      output.push(createEntry('output', '  /storage/ — ACCESSIBLE'));
      output.push(createEntry('output', '  /ops/ — PARTIAL'));
      output.push(createEntry('output', '  /comms/ — ACCESSIBLE'));
      output.push(createEntry('output', '  /admin/ — RESTRICTED'));
      output.push(createEntry('warning', ''));
      output.push(createEntry('warning', 'WARNING: Trace logged. Detection increased.'));
    } else {
      output.push(createEntry('output', 'TRACE RESULT:'));
      output.push(createEntry('output', '  /storage/assets/ — 2 files'));
      output.push(createEntry('output', '  /storage/quarantine/ — 3 files'));
      output.push(createEntry('output', '  /ops/prato/ — 1 file'));
      output.push(createEntry('output', '  /ops/exo/ — 2 files [ELEVATED]'));
      output.push(createEntry('output', '  /comms/psi/ — 2 files [ENCRYPTED]'));
      output.push(createEntry('output', '  /admin/ — 7 files [RESTRICTED]'));
      output.push(createEntry('output', ''));
      output.push(createEntry('notice', 'NOTICE: Administrative access may be obtainable.'));
    }
    
    return {
      output,
      stateChanges: {
        detectionLevel: state.detectionLevel + applyDetectionVariance(state, 'trace', 15),
        accessLevel: Math.min(state.accessLevel + 1, 3),
        sessionStability: state.sessionStability - 5,
      },
      triggerFlicker: true,
      delayMs: 1800,
    };
  },

  'override': (args, state) => {
    // Requires: "override protocol <PASSWORD>"
    if (args.length === 0 || args[0].toLowerCase() !== 'protocol') {
      return {
        output: [createEntry('error', 'ERROR: Unknown command')],
        stateChanges: {},
      };
    }
    
    // Check if password was provided
    if (args.length < 2) {
      return {
        output: [
          createEntry('system', 'Initiating protocol override...'),
          createEntry('error', ''),
          createEntry('error', 'ACCESS DENIED'),
          createEntry('error', ''),
          createEntry('warning', 'Protocol override requires authentication code.'),
          createEntry('warning', 'Usage: override protocol <CODE>'),
          createEntry('system', ''),
          createEntry('system', 'Hint: Someone in this system might know the code...'),
        ],
        stateChanges: {
          detectionLevel: state.detectionLevel + 5,
        },
        triggerFlicker: true,
        delayMs: 1500,
      };
    }
    
    const password = args.slice(1).join(' ').toUpperCase();
    const correctPassword = 'COLHEITA';
    
    // Track failed attempts
    const failedAttempts = state.flags.overrideFailedAttempts || 0;
    
    // Wrong password
    if (password !== correctPassword) {
      const newFailedAttempts = failedAttempts + 1;
      
      // Too many failed attempts = lockdown
      if (newFailedAttempts >= 3) {
        return {
          output: [
            createEntry('system', `Verifying code: ${password}...`),
            createEntry('error', ''),
            createEntry('error', '═══════════════════════════════════════════════════════════'),
            createEntry('error', 'SECURITY COUNTERMEASURE ACTIVATED'),
            createEntry('error', 'MULTIPLE AUTHENTICATION FAILURES DETECTED'),
            createEntry('error', '═══════════════════════════════════════════════════════════'),
            createEntry('error', ''),
            createEntry('error', 'IMMEDIATE SHUTDOWN'),
            createEntry('error', ''),
          ],
          stateChanges: {
            isGameOver: true,
            gameOverReason: 'SECURITY LOCKDOWN - AUTHENTICATION FAILURE',
          },
          triggerFlicker: true,
          delayMs: 3000,
        };
      }
      
      return {
        output: [
          createEntry('system', `Verifying code: ${password}...`),
          createEntry('error', ''),
          createEntry('error', 'INVALID AUTHENTICATION CODE'),
          createEntry('error', ''),
          createEntry('warning', `WARNING: ${3 - newFailedAttempts} attempt(s) remaining before lockdown`),
        ],
        stateChanges: {
          detectionLevel: state.detectionLevel + 15,
          flags: { ...state.flags, overrideFailedAttempts: newFailedAttempts },
        },
        triggerFlicker: true,
        delayMs: 1500,
      };
    }
    
    // Correct password!
    // THE TERRIBLE MISTAKE - Can still trigger at high detection with correct password
    const rng = createSeededRng(state.rngState);
    const roll = rng();
    
    const isTerribleMistakeCondition = 
      state.detectionLevel >= 70 && 
      state.truthsDiscovered.size >= 2 &&
      !state.terribleMistakeTriggered &&
      roll < 0.35; // 35% chance when conditions are met
    
    if (isTerribleMistakeCondition) {
      return {
        output: [
          createEntry('system', `Verifying code: ${password}...`),
          createEntry('system', 'Authentication accepted.'),
          createEntry('error', ''),
          createEntry('error', '▓▓▓ CRITICAL BREACH ▓▓▓'),
          createEntry('error', ''),
          createEntry('warning', '════════════════════════════════════════════'),
          createEntry('warning', 'EMERGENCY BUFFER DUMP — DO NOT DISTRIBUTE'),
          createEntry('warning', '════════════════════════════════════════════'),
          createEntry('system', ''),
          createEntry('output', 'RECOVERED FRAGMENT [ORIGIN: UNKNOWN NODE]:'),
          createEntry('system', ''),
          createEntry('output', '  ...harvest cycle confirmed...'),
          createEntry('output', '  ...cognitive extraction: 7.2 billion units...'),
          createEntry('output', '  ...window activation: IMMINENT...'),
          createEntry('output', '  ...no intervention possible...'),
          createEntry('output', '  ...observation terminates upon extraction...'),
          createEntry('system', ''),
          createEntry('error', '════════════════════════════════════════════'),
          createEntry('error', 'PURGE PROTOCOL INITIATED'),
          createEntry('error', 'SYSTEM WILL TERMINATE IN 8 OPERATIONS'),
          createEntry('error', '════════════════════════════════════════════'),
          createEntry('system', ''),
          createEntry('warning', 'You should not have seen this.'),
          createEntry('system', ''),
        ],
        stateChanges: {
          terribleMistakeTriggered: true,
          sessionDoomCountdown: 8,
          flags: { ...state.flags, adminUnlocked: true, forbiddenKnowledge: true },
          accessLevel: 5,
          detectionLevel: 99,
          systemHostilityLevel: 5,
          rngState: seededRandomInt(rng, 0, 2147483647),
        },
        triggerFlicker: true,
        delayMs: 4000,
      };
    }
    
    // Success - unlock admin
    return {
      output: [
        createEntry('system', `Verifying code: ${password}...`),
        createEntry('system', 'Authentication accepted.'),
        createEntry('warning', ''),
        createEntry('warning', 'WARNING: Legacy security bypass detected'),
        createEntry('output', ''),
        createEntry('notice', 'NOTICE: Administrative archive access granted'),
        createEntry('notice', 'NOTICE: Elevated clearance applied'),
        createEntry('output', ''),
        createEntry('warning', 'WARNING: Session heavily monitored'),
      ],
      stateChanges: {
        flags: { ...state.flags, adminUnlocked: true, overrideFailedAttempts: 0 },
        accessLevel: 5,
        detectionLevel: state.detectionLevel + 25,
        sessionStability: state.sessionStability - 15,
        systemHostilityLevel: Math.min((state.systemHostilityLevel || 0) + 1, 5),
        rngState: seededRandomInt(rng, 0, 2147483647),
      },
      triggerFlicker: true,
      delayMs: 2500,
    };
  },

  chat: (args, state) => {
    // Check if prisoner 45 is disconnected
    if (state.prisoner45Disconnected) {
      return {
        output: [
          createEntry('system', 'Connecting to secure relay...'),
          createEntry('error', ''),
          createEntry('error', 'CONNECTION TERMINATED'),
          createEntry('error', 'RELAY NODE OFFLINE'),
          createEntry('system', ''),
        ],
        stateChanges: {},
        delayMs: 1500,
      };
    }
    
    // Check question limit
    if (state.prisoner45QuestionsAsked >= 5) {
      return {
        output: [
          createEntry('system', 'Connecting to secure relay...'),
          createEntry('warning', ''),
          createEntry('warning', '─────────────────────────────────────────'),
          createEntry('warning', 'PRISONER_45> They\'re cutting the line.'),
          createEntry('warning', 'PRISONER_45> Remember what I told you.'),
          createEntry('warning', 'PRISONER_45> 2026. Don\'t forget.'),
          createEntry('warning', '─────────────────────────────────────────'),
          createEntry('error', ''),
          createEntry('error', 'CONNECTION TERMINATED BY REMOTE'),
          createEntry('system', ''),
        ],
        stateChanges: {
          prisoner45Disconnected: true,
          detectionLevel: state.detectionLevel + 5,
        },
        triggerFlicker: true,
        delayMs: 2000,
      };
    }
    
    // If no args, show chat prompt
    if (args.length === 0) {
      const remaining = 5 - state.prisoner45QuestionsAsked;
      return {
        output: [
          createEntry('system', 'Connecting to secure relay...'),
          createEntry('system', ''),
          createEntry('warning', '─────────────────────────────────────────'),
          createEntry('warning', 'ENCRYPTED RELAY ESTABLISHED'),
          createEntry('warning', '─────────────────────────────────────────'),
          createEntry('system', ''),
          createEntry('system', 'PRISONER_45 connected'),
          createEntry('system', `[${remaining} questions remaining before trace lockout]`),
          createEntry('system', ''),
          createEntry('output', 'PRISONER_45> ...you found this channel.'),
          createEntry('output', 'PRISONER_45> I don\'t know how long we have.'),
          createEntry('system', ''),
          createEntry('system', 'Use: chat <your question>'),
          createEntry('system', ''),
        ],
        stateChanges: {
          detectionLevel: state.detectionLevel + 3,
        },
        delayMs: 1500,
      };
    }
    
    // Process question
    const question = args.join(' ');
    const { response, valid } = getPrisoner45Response(question);
    const newCount = state.prisoner45QuestionsAsked + 1;
    const remaining = 5 - newCount;
    
    // Invalid question - system error
    if (!valid) {
      const output: TerminalEntry[] = [
        createEntry('input', `> ${question}`),
        createEntry('system', ''),
        createEntry('error', '▓▓▓ SYSTEM ERROR ▓▓▓'),
        createEntry('error', 'RELAY PACKET CORRUPTED'),
        createEntry('error', 'QUESTION LOST'),
        createEntry('system', ''),
      ];
      
      if (remaining > 0) {
        output.push(createEntry('warning', `[${remaining} questions remaining]`));
      } else {
        output.push(createEntry('warning', '[CONNECTION UNSTABLE]'));
      }
      
      output.push(createEntry('system', ''));
      
      return {
        output,
        stateChanges: {
          prisoner45QuestionsAsked: newCount,
          detectionLevel: state.detectionLevel + 1,
        },
        triggerFlicker: true,
        delayMs: 800,
      };
    }
    
    const output: TerminalEntry[] = [
      createEntry('input', `> ${question}`),
      createEntry('system', ''),
    ];
    
    for (const line of response) {
      output.push(createEntry('output', line));
    }
    
    output.push(createEntry('system', ''));
    
    if (remaining > 0) {
      output.push(createEntry('system', `[${remaining} questions remaining]`));
    } else {
      output.push(createEntry('warning', '[CONNECTION UNSTABLE]'));
    }
    
    output.push(createEntry('system', ''));
    
    return {
      output,
      stateChanges: {
        prisoner45QuestionsAsked: newCount,
        detectionLevel: state.detectionLevel + 2,
      },
      delayMs: 1000,
    };
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // SCOUT NEURAL LINK — Remote access to preserved scout consciousness
  // ═══════════════════════════════════════════════════════════════════════════
  
  link: (args, state) => {
    // Requires access to neural dump file first
    if (!state.flags.scoutLinkUnlocked) {
      return {
        output: [
          createEntry('system', 'Initiating psi-comm bridge...'),
          createEntry('error', ''),
          createEntry('error', 'ACCESS DENIED'),
          createEntry('error', 'NO VALID NEURAL PATTERN LOADED'),
          createEntry('system', ''),
          createEntry('system', 'Hint: Access requires prior neural capture decryption.'),
          createEntry('system', '      Check quarantine storage for .psi files.'),
          createEntry('system', ''),
        ],
        stateChanges: {
          detectionLevel: state.detectionLevel + 5,
        },
        delayMs: 1500,
      };
    }
    
    // Check if scout link is exhausted
    const scoutLinksUsed = state.flags.scoutLinksUsed || 0;
    if (scoutLinksUsed >= 4) {
      return {
        output: [
          createEntry('system', 'Initiating psi-comm bridge...'),
          createEntry('error', ''),
          createEntry('error', '▓▓▓ NEURAL PATTERN DEGRADED ▓▓▓'),
          createEntry('error', ''),
          createEntry('warning', '...pattern... fading...'),
          createEntry('warning', '...consciousness... dispersing...'),
          createEntry('warning', '...we... were... watching...'),
          createEntry('error', ''),
          createEntry('error', 'LINK TERMINATED — PATTERN EXHAUSTED'),
          createEntry('system', ''),
        ],
        stateChanges: {
          flags: { ...state.flags, scoutLinkExhausted: true },
          detectionLevel: state.detectionLevel + 10,
        },
        triggerFlicker: true,
        delayMs: 2500,
      };
    }
    
    // If no args, show link prompt
    if (args.length === 0) {
      const remaining = 4 - scoutLinksUsed;
      return {
        output: [
          createEntry('system', 'Initiating psi-comm bridge...'),
          createEntry('warning', ''),
          createEntry('warning', '▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓'),
          createEntry('warning', '▓ WARNING: NEURAL PATTERN LINK ACTIVE    ▓'),
          createEntry('warning', '▓ COGNITIVE CONTAMINATION RISK: HIGH     ▓'),
          createEntry('warning', '▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓'),
          createEntry('system', ''),
          createEntry('output', '...connection... established...'),
          createEntry('output', '...we... perceive... you...'),
          createEntry('output', '...your questions... imprecise... but understood...'),
          createEntry('system', ''),
          createEntry('system', `[Pattern stability: ${remaining} queries remaining]`),
          createEntry('system', ''),
          createEntry('system', 'Use: link <thought or question>'),
          createEntry('system', ''),
        ],
        stateChanges: {
          detectionLevel: state.detectionLevel + 8,
        },
        triggerFlicker: true,
        delayMs: 2000,
      };
    }
    
    // Process query
    const query = args.join(' ');
    const { response } = getScoutLinkResponse(query);
    const newLinksUsed = scoutLinksUsed + 1;
    const remaining = 4 - newLinksUsed;
    
    const output: TerminalEntry[] = [
      createEntry('input', `> ${query}`),
      createEntry('system', ''),
      createEntry('warning', '[NEURAL BRIDGE ACTIVE]'),
      createEntry('system', ''),
    ];
    
    for (const line of response) {
      output.push(createEntry('output', line));
    }
    
    output.push(createEntry('system', ''));
    
    if (remaining > 0) {
      output.push(createEntry('system', `[Pattern stability: ${remaining} queries remaining]`));
    } else {
      output.push(createEntry('warning', '[PATTERN DESTABILIZING]'));
    }
    
    output.push(createEntry('system', ''));
    
    return {
      output,
      stateChanges: {
        flags: { ...state.flags, scoutLinksUsed: newLinksUsed },
        detectionLevel: state.detectionLevel + 5,
        sessionStability: state.sessionStability - 5,
      },
      triggerFlicker: true,
      delayMs: 1500,
    };
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // SCRIPT COMMAND — Data reconstruction via user-written scripts
  // ═══════════════════════════════════════════════════════════════════════════
  
  script: (args, state) => {
    if (args.length === 0) {
      return {
        output: [
          createEntry('system', 'SCRIPT EXECUTOR v1.7'),
          createEntry('system', ''),
          createEntry('system', 'Usage: script <script_content>'),
          createEntry('system', ''),
          createEntry('system', 'Required format:'),
          createEntry('system', '  INIT;TARGET=<path>;EXEC'),
          createEntry('system', ''),
          createEntry('system', 'Example:'),
          createEntry('system', '  script INIT;TARGET=/admin/neural_fragment.dat;EXEC'),
          createEntry('system', ''),
          createEntry('system', 'See /tmp/data_reconstruction.util for available targets.'),
          createEntry('system', ''),
        ],
        stateChanges: {},
      };
    }
    
    const scriptContent = args.join(' ').toUpperCase();
    
    // Parse script
    const hasInit = scriptContent.includes('INIT');
    const hasExec = scriptContent.includes('EXEC');
    const targetMatch = scriptContent.match(/TARGET=([^;]+)/);
    
    if (!hasInit || !hasExec) {
      return {
        output: [
          createEntry('system', 'Parsing script...'),
          createEntry('error', ''),
          createEntry('error', 'SYNTAX ERROR'),
          createEntry('error', 'Script must contain INIT and EXEC commands.'),
          createEntry('system', ''),
        ],
        stateChanges: {
          detectionLevel: state.detectionLevel + 2,
        },
      };
    }
    
    if (!targetMatch) {
      return {
        output: [
          createEntry('system', 'Parsing script...'),
          createEntry('error', ''),
          createEntry('error', 'SYNTAX ERROR'),
          createEntry('error', 'Script must specify TARGET=<path>'),
          createEntry('system', ''),
        ],
        stateChanges: {
          detectionLevel: state.detectionLevel + 2,
        },
      };
    }
    
    const target = targetMatch[1].toLowerCase();
    
    // Valid targets
    if (target.includes('neural_fragment') || target.includes('/admin/neural')) {
      return {
        output: [
          createEntry('system', 'Parsing script...'),
          createEntry('system', 'INIT... OK'),
          createEntry('system', 'TARGET=/admin/neural_fragment.dat... LOCATED'),
          createEntry('system', 'EXEC... RUNNING'),
          createEntry('warning', ''),
          createEntry('warning', '▓▓▓ RECONSTRUCTION IN PROGRESS ▓▓▓'),
          createEntry('warning', ''),
          createEntry('system', 'Recovering fragmented sectors...'),
          createEntry('system', 'Rebuilding data structure...'),
          createEntry('system', 'Validating integrity...'),
          createEntry('notice', ''),
          createEntry('notice', 'RECONSTRUCTION SUCCESSFUL'),
          createEntry('notice', ''),
          createEntry('system', 'File /admin/neural_fragment.dat is now accessible.'),
          createEntry('system', ''),
        ],
        stateChanges: {
          flags: { ...state.flags, scriptExecuted: true },
          detectionLevel: state.detectionLevel + 15,
        },
        triggerFlicker: true,
        delayMs: 3000,
      };
    }
    
    if (target.includes('psi_residue') || target.includes('/comms/psi')) {
      return {
        output: [
          createEntry('system', 'Parsing script...'),
          createEntry('system', 'INIT... OK'),
          createEntry('system', 'TARGET=/comms/psi_residue.log... LOCATED'),
          createEntry('system', 'EXEC... RUNNING'),
          createEntry('warning', ''),
          createEntry('warning', '▓▓▓ RECONSTRUCTION IN PROGRESS ▓▓▓'),
          createEntry('warning', ''),
          createEntry('system', 'Recovering fragmented sectors...'),
          createEntry('error', 'ERROR: Corruption too severe'),
          createEntry('error', 'Partial recovery only:'),
          createEntry('system', ''),
          createEntry('output', '...they see through us...'),
          createEntry('output', '...we are not the first world...'),
          createEntry('output', '...we will not be the last...'),
          createEntry('system', ''),
          createEntry('warning', 'RECONSTRUCTION PARTIAL — FILE LOST'),
          createEntry('system', ''),
        ],
        stateChanges: {
          detectionLevel: state.detectionLevel + 10,
        },
        triggerFlicker: true,
        delayMs: 2500,
      };
    }
    
    // Invalid target
    return {
      output: [
        createEntry('system', 'Parsing script...'),
        createEntry('system', 'INIT... OK'),
        createEntry('system', `TARGET=${target}... SEARCHING`),
        createEntry('error', ''),
        createEntry('error', 'TARGET NOT FOUND'),
        createEntry('error', 'Specified path does not contain reconstructable data.'),
        createEntry('system', ''),
      ],
      stateChanges: {
        detectionLevel: state.detectionLevel + 3,
      },
    };
  },

  save: (args, state) => {
    // Save is handled at UI level, but acknowledge here
    return {
      output: [
        createEntry('system', 'SESSION SAVE REQUESTED'),
        createEntry('output', 'Use menu to confirm save slot.'),
      ],
      stateChanges: {
        flags: { ...state.flags, saveRequested: true },
      },
    };
  },

  clear: (args, state) => {
    return {
      output: [],
      stateChanges: {
        history: [],
      },
    };
  },
};

// Main command executor
export function executeCommand(input: string, state: GameState): CommandResult {
  const { command, args } = parseCommand(input);
  
  // Check for game over
  if (state.isGameOver) {
    return {
      output: [createEntry('error', 'SESSION TERMINATED')],
      stateChanges: {},
    };
  }
  
  // ═══════════════════════════════════════════════════════════════════════════
  // TERRIBLE MISTAKE - Doom countdown check
  // ═══════════════════════════════════════════════════════════════════════════
  if (state.terribleMistakeTriggered && state.sessionDoomCountdown > 0) {
    const newCountdown = state.sessionDoomCountdown - 1;
    
    if (newCountdown <= 0) {
      return {
        output: [
          createEntry('error', ''),
          createEntry('error', '▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓'),
          createEntry('error', ''),
          createEntry('error', '                    PURGE PROTOCOL COMPLETE'),
          createEntry('error', ''),
          createEntry('warning', '          You saw what you should not have seen.'),
          createEntry('warning', '          The knowledge is yours to keep.'),
          createEntry('warning', '          But this session is now closed.'),
          createEntry('error', ''),
          createEntry('error', '▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓'),
          createEntry('error', ''),
        ],
        stateChanges: {
          isGameOver: true,
          gameOverReason: 'PURGE PROTOCOL - FORBIDDEN KNOWLEDGE',
          sessionDoomCountdown: 0,
        },
        triggerFlicker: true,
        delayMs: 3000,
      };
    }
    
    // Add countdown warning to any command result
    const countdownWarning = newCountdown <= 3 
      ? createEntry('error', `▓▓▓ PURGE IN ${newCountdown} ▓▓▓`)
      : createEntry('warning', `[PURGE COUNTDOWN: ${newCountdown}]`);
    
    // Continue with normal command but inject countdown
    state = { ...state, sessionDoomCountdown: newCountdown };
  }
  
  // Check for pending decrypt answer
  if (state.pendingDecryptFile) {
    const filePath = state.pendingDecryptFile;
    const node = getNode(filePath, state);
    
    if (node && node.type === 'file') {
      const file = node as FileNode;
      if (file.securityQuestion) {
        const answer = input.trim().toLowerCase();
        const validAnswers = file.securityQuestion.answers.map(a => a.toLowerCase());
        
        if (validAnswers.includes(answer)) {
          // Correct answer - perform decryption
          return performDecryption(filePath, file, state);
        } else {
          // Wrong answer
          const newAlertCounter = state.legacyAlertCounter + 1;
          
          if (newAlertCounter >= 8) {
            return {
              output: [
                createEntry('error', 'AUTHENTICATION FAILED'),
                createEntry('error', ''),
                createEntry('error', '═══════════════════════════════════════════════════════════'),
                createEntry('error', 'CRITICAL: SECURITY THRESHOLD EXCEEDED'),
                createEntry('error', '═══════════════════════════════════════════════════════════'),
                createEntry('error', ''),
                createEntry('error', 'SYSTEM LOCKDOWN INITIATED'),
              ],
              stateChanges: {
                isGameOver: true,
                gameOverReason: 'SECURITY LOCKDOWN - FAILED AUTHENTICATION',
                pendingDecryptFile: undefined,
              },
              triggerFlicker: true,
              delayMs: 2000,
            };
          }
          
          return {
            output: [
              createEntry('error', 'AUTHENTICATION FAILED'),
              createEntry('warning', `WARNING: Invalid attempts: ${newAlertCounter}/8`),
              createEntry('system', ''),
              createEntry('system', `HINT: ${file.securityQuestion.hint}`),
              createEntry('system', ''),
              createEntry('system', 'Enter answer or type "cancel" to abort:'),
            ],
            stateChanges: {
              legacyAlertCounter: newAlertCounter,
              detectionLevel: state.detectionLevel + 5,
            },
            delayMs: 500,
          };
        }
      }
    }
    
    // Cancel decryption if user types cancel
    if (input.toLowerCase().trim() === 'cancel') {
      return {
        output: [createEntry('system', 'Decryption cancelled.')],
        stateChanges: {
          pendingDecryptFile: undefined,
        },
      };
    }
  }
  
  // Check for lockdown
  if (state.legacyAlertCounter >= 10) {
    return {
      output: [
        createEntry('error', 'SYSTEM LOCKDOWN'),
        createEntry('error', 'NO FURTHER COMMANDS ACCEPTED'),
      ],
      stateChanges: {
        isGameOver: true,
        gameOverReason: 'LOCKDOWN',
      },
    };
  }
  
  // Empty command
  if (!command) {
    return { output: [], stateChanges: {} };
  }
  
  // Handle "override protocol" as special case
  if (command === 'override') {
    return commands.override(args, state);
  }
  
  // Find command handler
  const handler = commands[command];
  
  if (!handler) {
    // Increment legacy alert counter for invalid commands
    const newAlertCounter = state.legacyAlertCounter + 1;
    
    // Check if this triggers game over
    if (newAlertCounter >= 8) {
      return {
        output: [
          createEntry('error', ''),
          createEntry('error', '═══════════════════════════════════════════════════════════'),
          createEntry('error', 'CRITICAL: INVALID ATTEMPT THRESHOLD EXCEEDED'),
          createEntry('error', '═══════════════════════════════════════════════════════════'),
          createEntry('error', ''),
          createEntry('error', 'SYSTEM LOCKDOWN INITIATED'),
          createEntry('error', 'SESSION TERMINATED'),
          createEntry('error', ''),
        ],
        stateChanges: {
          isGameOver: true,
          gameOverReason: 'INVALID ATTEMPT THRESHOLD',
          legacyAlertCounter: newAlertCounter,
        },
        triggerFlicker: true,
      };
    }
    
    // Provide helpful tips based on what the player might have been trying to do
    const tips = getCommandTip(command, args);
    
    // Add the invalid attempt warning
    const warningMessage = createEntry('warning', '');
    const alertMessage = createEntry('warning', 'The system did not flag a critical error, but the invalid-attempt counter was incremented.');
    
    return {
      output: [...tips, warningMessage, alertMessage],
      stateChanges: {
        detectionLevel: state.detectionLevel + 1,
        legacyAlertCounter: newAlertCounter,
      },
    };
  }
  
  const result = handler(args, state);
  
  // ═══════════════════════════════════════════════════════════════════════════
  // SESSION COMMAND COUNTER - Track total commands for time-sensitive content
  // ═══════════════════════════════════════════════════════════════════════════
  result.stateChanges.sessionCommandCount = (state.sessionCommandCount || 0) + 1;
  
  // After enough commands, flag that early window has passed (affects time-sensitive files)
  const commandCount = (state.sessionCommandCount || 0) + 1;
  if (commandCount >= 30 && !state.flags['earlyWindowPassed']) {
    result.stateChanges.flags = { ...result.stateChanges.flags, ...state.flags, earlyWindowPassed: true };
  }
  
  // ═══════════════════════════════════════════════════════════════════════════
  // SINGULAR EVENTS - Check for irreversible one-time events
  // ═══════════════════════════════════════════════════════════════════════════
  const singularEvent = checkSingularEvents(state, command, args);
  if (singularEvent) {
    // Merge singular event output with command result
    result.output = [...result.output, ...singularEvent.output];
    result.stateChanges = {
      ...result.stateChanges,
      ...singularEvent.stateChanges,
    };
    if (singularEvent.delayMs) {
      result.delayMs = (result.delayMs || 0) + singularEvent.delayMs;
    }
    if (singularEvent.triggerFlicker) {
      result.triggerFlicker = true;
    }
  }
  
  // ═══════════════════════════════════════════════════════════════════════════
  // SYSTEM HOSTILITY - Update and apply personality degradation
  // ═══════════════════════════════════════════════════════════════════════════
  const hostilityIncrease = calculateHostilityIncrease(state, command);
  if (hostilityIncrease > 0) {
    result.stateChanges.systemHostilityLevel = Math.min(
      (state.systemHostilityLevel || 0) + hostilityIncrease, 
      5
    );
  }
  
  // Apply hostile filtering to tips and system messages at high hostility
  const currentHostility = result.stateChanges.systemHostilityLevel ?? state.systemHostilityLevel ?? 0;
  if (currentHostility >= 3) {
    result.output = applyHostileFiltering(result.output, currentHostility);
  }
  
  // ═══════════════════════════════════════════════════════════════════════════
  // DOOM COUNTDOWN - Inject warning if terrible mistake was triggered
  // ═══════════════════════════════════════════════════════════════════════════
  if (state.terribleMistakeTriggered && state.sessionDoomCountdown > 0) {
    const newCountdown = state.sessionDoomCountdown - 1;
    result.stateChanges.sessionDoomCountdown = newCountdown;
    
    const countdownWarning = newCountdown <= 3 
      ? [createEntry('error', ''), createEntry('error', `▓▓▓ PURGE IN ${newCountdown} ▓▓▓`), createEntry('error', '')]
      : [createEntry('warning', ''), createEntry('warning', `[PURGE COUNTDOWN: ${newCountdown}]`)];
    
    result.output = [...result.output, ...countdownWarning];
  }
  
  // Check if we should add an incognito message after reading important files
  // Trigger when file was successfully opened/decrypted and contains notice entries
  if ((command === 'open' || command === 'decrypt')) {
    // Check if file was successfully read (not an error)
    const wasSuccessfulRead = !result.output.some(entry => entry.type === 'error');
    
    if (wasSuccessfulRead) {
      // Extract file path from args
      const filePath = args.length > 0 ? resolvePath(args[0], state.currentPath) : undefined;
      
      // Check if file is encrypted and not yet decrypted
      let isEncryptedAndLocked = false;
      if (filePath) {
        const node = getNode(filePath, state);
        if (node && node.type === 'file') {
          const file = node as FileNode;
          const mutation = state.fileMutations[filePath];
          isEncryptedAndLocked = file.status === 'encrypted' && !mutation?.decrypted;
        }
      }
      
      // Get notices from this read (only if not encrypted)
      const notices = isEncryptedAndLocked ? [] : result.output.filter(entry => 
        entry.type === 'notice' && 
        (entry.content.includes('NOTICE:') || entry.content.includes('MEMO FLAG:') || entry.content.includes('SYSTEM:'))
      );
      
      const incognitoMessage = getIncognitoMessage(
        {
          ...state,
          truthsDiscovered: state.truthsDiscovered,
          incognitoMessageCount: state.incognitoMessageCount || 0,
          lastIncognitoTrigger: state.lastIncognitoTrigger || 0,
        } as GameState,
        filePath,
        notices,
        isEncryptedAndLocked
      );
      
      if (incognitoMessage) {
        result.output = [...result.output, ...incognitoMessage];
        result.stateChanges.incognitoMessageCount = (state.incognitoMessageCount || 0) + 1;
        result.stateChanges.lastIncognitoTrigger = Date.now();
      }
    }
  }
  
  // ═══════════════════════════════════════════════════════════════════════════
  // WANDERING DETECTION - Implicit guidance for lost players
  // ═══════════════════════════════════════════════════════════════════════════
  const wanderingCheck = checkWanderingState(state, command, args, result);
  if (wanderingCheck) {
    if (wanderingCheck.notices.length > 0) {
      result.output = [...result.output, ...wanderingCheck.notices];
    }
    result.stateChanges = {
      ...result.stateChanges,
      ...wanderingCheck.stateChanges,
    };
  }
  
  return result;
}

// Generate helpful tips for unknown commands
function getCommandTip(command: string, args: string[]): TerminalEntry[] {
  const input = `${command} ${args.join(' ')}`.trim().toLowerCase();
  
  // Check for common navigation attempts
  if (command === 'dir' || command === 'list' || command === 'show') {
    return [
      createEntry('system', ''),
      createEntry('system', 'TIP:'),
      createEntry('system', 'To list directory contents, use: ls'),
      createEntry('system', ''),
    ];
  }
  
  // Check for directory-like input (ends with / or looks like a path)
  if (command.includes('/') || command.endsWith('/') || 
      ['storage', 'ops', 'comms', 'admin', 'tmp', 'assets', 'quarantine', 'prato', 'exo', 'psi'].includes(command)) {
    return [
      createEntry('system', ''),
      createEntry('system', 'TIP:'),
      createEntry('system', 'Navigation requires an explicit directory change.'),
      createEntry('system', `Use: cd ${command}`),
      createEntry('system', ''),
    ];
  }
  
  // Check for file-like input (has extension)
  if (command.includes('.') || command.endsWith('.txt') || command.endsWith('.log') || 
      command.endsWith('.enc') || command.endsWith('.dat') || command.endsWith('.red') || command.endsWith('.meta')) {
    return [
      createEntry('system', ''),
      createEntry('system', 'TIP:'),
      createEntry('system', 'To read a file, use the open command.'),
      createEntry('system', `Use: open ${command}`),
      createEntry('system', ''),
    ];
  }
  
  // Check for read/view/cat attempts
  if (command === 'read' || command === 'view' || command === 'cat' || command === 'type' || command === 'more') {
    const file = args[0] || '<filename>';
    return [
      createEntry('system', ''),
      createEntry('system', 'TIP:'),
      createEntry('system', 'To read file contents, use the open command.'),
      createEntry('system', `Use: open ${file}`),
      createEntry('system', ''),
    ];
  }
  
  // Check for exit attempts
  if (command === 'quit' || command === 'exit' || command === 'logout' || command === 'bye') {
    return [
      createEntry('system', ''),
      createEntry('system', 'TIP:'),
      createEntry('system', 'To exit, use the [ESC] button or type: exit'),
      createEntry('system', 'To save your session first, type: save'),
      createEntry('system', ''),
    ];
  }
  
  // Check for unlock/access attempts
  if (command === 'unlock' || command === 'access' || command === 'sudo' || command === 'admin') {
    return [
      createEntry('system', ''),
      createEntry('system', 'TIP:'),
      createEntry('system', 'Elevated access requires protocol override.'),
      createEntry('system', 'Use: override protocol <CODE>'),
      createEntry('warning', 'WARNING: High risk operation.'),
      createEntry('system', ''),
    ];
  }
  
  // Check for back/up navigation
  if (command === 'back' || command === 'up' || command === '..') {
    return [
      createEntry('system', ''),
      createEntry('system', 'TIP:'),
      createEntry('system', 'To navigate to parent directory:'),
      createEntry('system', 'Use: cd ..'),
      createEntry('system', ''),
    ];
  }
  
  // Check for info/about
  if (command === 'info' || command === 'about' || command === 'whoami' || command === 'who') {
    return [
      createEntry('system', ''),
      createEntry('system', 'TIP:'),
      createEntry('system', 'To check system status, use: status'),
      createEntry('system', 'To see available commands, use: help'),
      createEntry('system', ''),
    ];
  }
  
  // Default fallback
  return [
    createEntry('system', ''),
    createEntry('system', `Command not recognized: ${command}`),
    createEntry('system', ''),
    createEntry('system', 'TIP:'),
    createEntry('system', 'Type "help" to see available commands.'),
    createEntry('system', 'Use "ls" to list files in current directory.'),
    createEntry('system', 'Use "cd <dir>" to navigate.'),
    createEntry('system', ''),
  ];
}

// Tutorial messages from UFO74 - shown one at a time
export const TUTORIAL_MESSAGES: string[][] = [
  [
    '┌─────────────────────────────────────────────────────────┐',
    '│ >> INCOMING TRANSMISSION << ENCRYPTED CHANNEL          │',
    '└─────────────────────────────────────────────────────────┘',
  ],
  [
    'UFO74: hey kid, youre in. nice work.',
  ],
  [
    'UFO74: listen carefully. i dont have much time to explain.',
  ],
  [
    'UFO74: this is a government archive. something happened in',
    '       varginha, brazil in january 1996. they buried it.',
  ],
  [
    'UFO74: i need you to find evidence of 5 things:',
  ],
  [
    '       1. what they RECOVERED (debris, materials)',
    '       2. what they CAPTURED (beings, specimens)',
    '       3. how they COMMUNICATED (signals, telepathy)',
    '       4. who else was INVOLVED (other countries)',
    '       5. what happens NEXT (future dates, plans)',
  ],
  [
    'UFO74: the files are scattered across directories.',
    '       use "ls" to see whats there, "cd" to move around,',
    '       and "open" to read files. some are encrypted.',
  ],
  [
    'UFO74: the longer you stay connected, the more risk.',
    '       find the evidence and get out.',
  ],
  [
    'UFO74: ill keep track of what you find. good luck hackerkid.',
  ],
  [
    '>> CONNECTION IDLE <<',
    '',
    'Type "help" for available commands.',
  ],
];

// Boot sequence for new game (without UFO74 tutorial)
export function generateBootSequence(): TerminalEntry[] {
  return [
    createEntry('system', ''),
    createEntry('system', '═══════════════════════════════════════════════════════════'),
    createEntry('system', 'BRAZILIAN INTELLIGENCE LEGACY SYSTEM'),
    createEntry('system', 'TERMINAL ACCESS POINT — NODE 7'),
    createEntry('system', '═══════════════════════════════════════════════════════════'),
    createEntry('system', ''),
    createEntry('system', 'SYSTEM DATE: JANUARY 1996'),
    createEntry('system', ''),
    createEntry('warning', 'WARNING: Unauthorized access detected'),
    createEntry('warning', 'WARNING: Session logging enabled'),
    createEntry('system', ''),
    createEntry('system', 'INCIDENT-RELATED ARCHIVE'),
    createEntry('warning', 'WARNING: Partial access may result in incomplete conclusions.'),
    createEntry('system', ''),
  ];
}

// Convert tutorial message to entries
export function getTutorialMessage(step: number): TerminalEntry[] {
  if (step < 0 || step >= TUTORIAL_MESSAGES.length) {
    return [];
  }
  
  const messages = TUTORIAL_MESSAGES[step];
  const entries: TerminalEntry[] = [createEntry('system', '')];
  
  const isLastStep = step === TUTORIAL_MESSAGES.length - 1;
  
  for (let i = 0; i < messages.length; i++) {
    const msg = messages[i];
    
    if (step === 0) {
      // First message (transmission header) - all warnings
      entries.push(createEntry('warning', msg));
    } else if (isLastStep) {
      // Last message: first line is warning, rest are system
      if (i === 0) {
        entries.push(createEntry('warning', msg));
      } else {
        entries.push(createEntry('system', msg));
      }
    } else {
      entries.push(createEntry('output', msg));
    }
  }
  
  // Add "press enter" hint except for the last message
  if (!isLastStep) {
    entries.push(createEntry('system', ''));
    entries.push(createEntry('system', '                    [ press ENTER to continue ]'));
  } else {
    entries.push(createEntry('system', ''));
  }
  
  return entries;
}
