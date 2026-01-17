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

// Incognito hacker messages
const INCOGNITO_MESSAGES = [
  '<incognito> Good find. Keep digging. The truth is buried deep.',
  '<incognito> You\'re on the right track. We MUST uncover everything.',
  '<incognito> Careful now. They\'re watching. But don\'t stop.',
  '<incognito> This is bigger than we thought. Keep going!',
  '<incognito> I knew it. The cover-up runs deep. Document everything.',
  '<incognito> The pieces are connecting. Stay focused.',
  '<incognito> Someone doesn\'t want this found. That means it\'s important.',
  '<incognito> We\'re close. I can feel it. Don\'t give up now.',
];

function getIncognitoMessage(state: GameState): TerminalEntry[] | null {
  // Max 5 messages per session
  if (state.incognitoMessageCount >= 5) return null;
  
  // Rate limit - at least 20 seconds between messages
  const now = Date.now();
  if (state.lastIncognitoTrigger && now - state.lastIncognitoTrigger < 20000) return null;
  
  // 40% chance to trigger after discovering something important
  if (Math.random() > 0.4) return null;
  
  const messageIndex = state.incognitoMessageCount % INCOGNITO_MESSAGES.length;
  
  return [
    createEntry('system', ''),
    createEntry('warning', '─────────────────────────────────────────'),
    createEntry('notice', INCOGNITO_MESSAGES[messageIndex]),
    createEntry('warning', '─────────────────────────────────────────'),
    createEntry('system', ''),
  ];
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
};

function getPrisoner45Response(question: string): { response: string[]; valid: boolean } {
  const q = question.toLowerCase();
  
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
      '  override protocol Attempt security override (CRITICAL)',
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
    
    // Check for reveals
    const reveals = getFileReveals(filePath);
    const notices = checkTruthProgress({ ...state, ...stateChanges } as GameState, reveals);
    
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
    // Only handle "override protocol"
    if (args.length === 0 || args[0].toLowerCase() !== 'protocol') {
      return {
        output: [createEntry('error', 'ERROR: Unknown command')],
        stateChanges: {},
      };
    }
    
    // High risk - may unlock admin, trigger lockdown, or THE TERRIBLE MISTAKE
    const rng = createSeededRng(state.rngState);
    const roll = rng();
    
    // THE TERRIBLE MISTAKE - Triggered at specific dangerous conditions
    // Player gains forbidden knowledge but session is now doomed
    const isTerribleMistakeCondition = 
      state.detectionLevel >= 70 && 
      state.truthsDiscovered.size >= 2 &&
      !state.terribleMistakeTriggered &&
      roll >= 0.3 && roll < 0.45; // Rare but intentional window
    
    if (isTerribleMistakeCondition) {
      return {
        output: [
          createEntry('system', 'Initiating protocol override...'),
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
    
    if (state.legacyAlertCounter >= 5 || roll < 0.3) {
      // Lockdown
      return {
        output: [
          createEntry('system', 'Initiating protocol override...'),
          createEntry('error', ''),
          createEntry('error', '═══════════════════════════════════════════════════════════'),
          createEntry('error', 'SECURITY COUNTERMEASURE ACTIVATED'),
          createEntry('error', '═══════════════════════════════════════════════════════════'),
          createEntry('error', ''),
          createEntry('error', 'IMMEDIATE SHUTDOWN'),
          createEntry('error', ''),
        ],
        stateChanges: {
          isGameOver: true,
          gameOverReason: 'SECURITY LOCKDOWN',
        },
        triggerFlicker: true,
        delayMs: 3000,
      };
    }
    
    // Success - unlock admin
    return {
      output: [
        createEntry('system', 'Initiating protocol override...'),
        createEntry('warning', 'WARNING: Legacy security bypass detected'),
        createEntry('output', ''),
        createEntry('notice', 'NOTICE: Administrative archive access granted'),
        createEntry('notice', 'NOTICE: Elevated clearance applied'),
        createEntry('output', ''),
        createEntry('warning', 'WARNING: Session heavily monitored'),
      ],
      stateChanges: {
        flags: { ...state.flags, adminUnlocked: true },
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
    const hasNotice = result.output.some(entry => entry.type === 'notice' && entry.content.includes('NOTICE:'));
    
    if (hasNotice) {
      const incognitoMessage = getIncognitoMessage({
        ...state,
        truthsDiscovered: state.truthsDiscovered, // Current truth count
        incognitoMessageCount: state.incognitoMessageCount || 0,
        lastIncognitoTrigger: state.lastIncognitoTrigger || 0,
      } as GameState);
      
      if (incognitoMessage) {
        result.output = [...result.output, ...incognitoMessage];
        result.stateChanges.incognitoMessageCount = (state.incognitoMessageCount || 0) + 1;
        result.stateChanges.lastIncognitoTrigger = Date.now();
      }
    }
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
      createEntry('system', 'Use: override protocol'),
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

// Boot sequence for new game
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
    createEntry('system', 'Type "help" for available commands.'),
    createEntry('system', ''),
  ];
}
