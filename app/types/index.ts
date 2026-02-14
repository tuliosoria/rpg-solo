// Terminal 1996 - Type Definitions

// ═══════════════════════════════════════════════════════════════════════════
// INTERACTIVE TUTORIAL STATE MACHINE
// ═══════════════════════════════════════════════════════════════════════════

export enum TutorialStateID {
  INTRO = 0,
  LS_PROMPT = 1,
  CD_PROMPT = 2,
  OPEN_PROMPT = 3,
  FILE_DISPLAY = 4,
  CD_BACK_PROMPT = 5,
  LS_REINFORCE = 6,
  TUTORIAL_END = 7,
  GAME_ACTIVE = 8,
}

export interface InteractiveTutorialState {
  current: TutorialStateID;
  failCount: number;
  nudgeShown: boolean;
  inputLocked: boolean;
  dialogueComplete: boolean;
}

// ═══════════════════════════════════════════════════════════════════════════

export type FileStatus =
  | 'intact'
  | 'restricted'
  | 'unstable'
  | 'encrypted'
  | 'conditional'
  | 'restricted_briefing';

export type ImageTone = 'clinical' | 'surveillance';

export interface ImageTrigger {
  src: string;
  alt: string;
  tone: ImageTone;
  corrupted?: boolean;
  durationMs?: number;
}

export interface VideoTrigger {
  src: string;
  title: string;
  tone: ImageTone;
  corrupted?: boolean;
}

export interface SecurityQuestion {
  question: string;
  answers: string[]; // Multiple valid answers (case insensitive)
  hint: string; // Where to find the answer
}

// Tags for the search index system
export type FileTag =
  | 'creature'
  | 'foreign'
  | 'biological'
  | 'signal'
  | 'debris'
  | 'medical'
  | 'containment'
  | 'telepathic'
  | 'transport'
  | 'cover-up'
  | 'witness'
  | 'journalist'
  | 'military'
  | 'government'
  | 'autopsy'
  | 'spacecraft'
  | 'crash'
  | 'communication'
  | 'encryption'
  | 'administrative'
  | 'routine'
  | 'classified'
  | 'timeline'
  | '2026'
  | 'psi'
  | 'neural'
  | 'experiment'
  | 'international'
  | 'security'
  | 'surveillance'
  | 'hospital'
  | 'specimen';

export interface FileNode {
  type: 'file';
  name: string;
  status: FileStatus;
  content: string[];
  decryptedFragment?: string[];
  reveals?: string[]; // Truth categories this file contributes to
  accessThreshold?: number; // Required access level
  requiredFlags?: string[]; // Required flags to appear
  corruptible?: boolean;
  imageTrigger?: ImageTrigger; // Image to display when file is accessed
  videoTrigger?: VideoTrigger; // Video to display when file is accessed
  securityQuestion?: SecurityQuestion; // Required to decrypt
  timedDecrypt?: { sequence: string; timeLimit: number }; // Timed decryption challenge
  tags?: FileTag[]; // Search index tags for the search command
}

export interface DirectoryNode {
  type: 'dir';
  name: string;
  children: Record<string, FileSystemNode>;
  requiredFlags?: string[];
  accessThreshold?: number;
}

export type FileSystemNode = FileNode | DirectoryNode;

export interface FileMutation {
  corruptedLines: number[]; // Line indices replaced with [DATA LOSS]
  truncatedLine?: number; // Line index truncated mid-word
  deleted?: boolean;
  locked?: boolean;
  decrypted?: boolean;
}

export interface TerminalEntry {
  id: string;
  type: 'input' | 'output' | 'system' | 'warning' | 'error' | 'notice' | 'ufo74' | 'file';
  content: string;
  timestamp: number;
}

export interface GameState {
  currentPath: string;
  history: TerminalEntry[];
  commandHistory: string[];
  commandHistoryIndex: number;

  // Hidden variables (numeric internally, surfaced as symptoms)
  detectionLevel: number; // 0-100
  wrongAttempts: number; // 0-8 (wrong commands/auth failures, 8 = game over)
  accessLevel: number; // 0-5
  sessionStability: number; // 100-0
  legacyAlertCounter: number; // 0-10

  // Flags for game progression
  flags: Record<string, boolean>;

  // Override password attempt tracking
  overrideFailedAttempts: number;

  // Scout link usage tracking
  scoutLinksUsed: number;

  // Truth categories discovered (5 required for victory)
  truthsDiscovered: Set<string>;

  // Files the player has opened/read
  filesRead: Set<string>;

  // Persistent file mutations
  fileMutations: Record<string, FileMutation>;

  // Seeded RNG state
  seed: number;
  rngState: number;

  // Session metadata
  sessionStartTime: number;
  isGameOver: boolean;
  gameOverReason?: string;

  // Chat with Prisoner 45
  prisoner45QuestionsAsked: number; // Max 5
  prisoner45Disconnected: boolean;
  prisoner45UsedResponses: Set<string>; // Track used responses to never repeat

  // Scout Link state
  scoutLinkUsedResponses: Set<string>; // Track used responses to never repeat

  // Decrypt challenge state
  pendingDecryptFile?: string; // File awaiting security answer

  // Turing evaluation state
  turingEvaluationActive: boolean;
  turingEvaluationIndex: number;
  turingEvaluationCompleted: boolean;

  // Neural cluster echo state
  neuralClusterUnlocked: boolean;
  neuralClusterActive: boolean;
  neuralClusterEmissions: number;
  neuralClusterDisabled: boolean;

  // Incognito hacker messages
  incognitoMessageCount: number;
  lastIncognitoTrigger: number; // Timestamp of last message

  // Irreversible events tracking (each can only happen once per run)
  singularEventsTriggered: Set<string>;

  // Images shown this run (each image shown at most once)
  imagesShownThisRun: Set<string>;

  // Videos shown this run (each video shown at most once)
  videosShownThisRun: Set<string>;

  // System personality degradation (affects tone as risk increases)
  systemHostilityLevel: number; // 0-5, increases with risky actions

  // Terrible mistake state - forbidden knowledge revealed but session doomed
  terribleMistakeTriggered: boolean;
  sessionDoomCountdown: number; // Commands remaining before forced purge

  // Content categories read (for conditional file access)
  categoriesRead: Set<string>; // e.g., 'military', 'medical', 'comms', 'logistics'

  // Session command count (for time-sensitive content)
  sessionCommandCount: number;

  // Achievement tracking
  statusCommandCount: number; // For "Paranoid" achievement

  // Wandering detection (for implicit guidance)
  lastMeaningfulAction: number; // Command count at last meaningful action
  wanderingNoticeCount: number; // How many times we've nudged the player
  lastDirectoriesVisited: string[]; // Recent directory history for pattern detection

  // Tutorial state (UFO74 intro messages)
  tutorialStep: number; // -1 = complete, 0+ = current message index
  tutorialComplete: boolean;

  // Interactive tutorial state machine (gated command learning)
  interactiveTutorialState?: InteractiveTutorialState;

  // Interactive tutorial mode (opt-in tips during gameplay)
  interactiveTutorialMode: boolean; // Whether player has tutorial tips enabled
  tutorialTipsShown: Set<string>; // Track which tutorial tips have been shown
  firstRunSeen: boolean; // Whether first-run welcome has been shown

  // Elusive Man leak sequence
  inLeakSequence: boolean; // True when in leak interrogation
  currentLeakQuestion: number; // 0-4, current question index
  leakWrongAnswers: number; // Wrong answers given (max 3)
  leakAnswers: string[]; // Player's answers for debugging/analysis

  // Evidence collection & ICQ phase
  evidencesSaved: boolean; // True after running save script
  icqPhase: boolean; // True when in ICQ chat mode
  icqMessages: { sender: 'player' | 'teen' | 'system'; text: string; timestamp?: string }[]; // Chat history
  mathQuestionsAnswered: number; // 0-3, how many equations solved
  currentMathQuestion: number; // Current equation index
  mathQuestionWrong: number; // Wrong attempts on current question
  filesSent: boolean; // True after convincing teenager
  gameWon: boolean; // True on victory
  choiceLeakPath?: 'public' | 'covert'; // Final evidence delivery choice
  icqTrust: number; // Teen trust score (0-100)

  // Debug mode
  godMode: boolean; // Hidden dev mode for testing

  // Multiple endings tracking
  endingType?: EndingType; // Which ending was achieved
  ufo74SecretDiscovered: boolean; // Found the secret about UFO74's identity

  // Time pressure
  countdownActive: boolean; // Real-time countdown triggered
  countdownEndTime: number; // Timestamp when countdown expires
  countdownTriggeredBy?: string; // What triggered the countdown
  traceSpikeActive: boolean; // Active trace spike in progress
  tracePurgeUsed: boolean; // Trace purge script executed

  // Unreliable narrator
  disinformationDiscovered: Set<string>; // Files revealed to be disinformation

  // Hidden commands discovered
  hiddenCommandsDiscovered: Set<string>; // Commands found via documents

  // Password puzzles
  passwordsFound: Set<string>; // Passwords discovered in documents

  // Cipher puzzle state
  pendingCipherFile?: string; // File awaiting cipher solution
  cipherAttempts: number; // Wrong attempts on current cipher

  // Morse code puzzle state
  morseFileRead: boolean; // True after reading morse_intercept.sig
  morseMessageAttempts: number; // Wrong attempts on morse message (max 3)
  morseMessageSolved: boolean; // True after correctly identifying the message

  // UX: Notes & bookmarks system
  playerNotes: { note: string; timestamp: number }[]; // Player-saved notes
  bookmarkedFiles: Set<string>; // Files player has bookmarked
  lastOpenedFile?: string; // Last file opened (for 'last' command)
  navigationHistory: string[]; // Stack of visited directories for 'back' command

  // UX: Idle detection for hints
  lastActivityTime: number; // Timestamp of last command
  idleHintsGiven: number; // How many idle hints have been shown

  // Stealth recovery system
  waitUsesRemaining: number; // Max 3 per run, resets on new game
  hideAvailable: boolean; // Becomes true at 90+ detection

  // Evidence linking system
  evidenceLinks: Array<[string, string]>; // Pairs of linked file paths

  // Evidence revelation system - tracks which evidences each file has revealed
  // Key: file path, Value: evidence state for that file
  fileEvidenceStates: Record<string, FileEvidenceState>;

  // Evidence tracking - simplified (no tiers)
  // Key: TruthCategory, Value: evidence state for that category
  evidenceStates: Record<string, EvidenceState>;

  // Timed decryption state
  timedDecryptActive: boolean;
  timedDecryptFile?: string;
  timedDecryptSequence?: string;
  timedDecryptEndTime: number;

  // Red herring traps
  trapsTriggered: Set<string>; // Files that were trap triggers
  trapWarningGiven: boolean; // UFO74 warned about traps

  // System personality
  systemPersonality: 'bureaucratic' | 'defensive' | 'hostile' | 'pleading';
  paranoiaLevel: number; // 0-100 intensity for paranoia cues

  // Typing speed tracking
  lastKeypressTime: number;
  fastTypingWarnings: number;

  // Screen burn-in content
  burnInContent: string[]; // Recent significant outputs for ghost effect

  // Epilogue unlocked
  epilogueUnlocked: boolean;
  rivalInvestigatorActive: boolean; // Rival actor tracking the trail

  // Hacker avatar expression
  avatarExpression: 'neutral' | 'shocked' | 'scared' | 'angry' | 'smirk';

  // Save tracking
  lastSaveTime: number;

  // Search command state
  lastSearchTime: number; // Timestamp of last search command (for cooldown)

  // Firewall Eyes system
  firewallActive: boolean; // True when detection >= 25%
  firewallEyes: FirewallEye[]; // Active hostile eyes on screen
  firewallDisarmed: boolean; // True if player used neural link to disable
  lastEyeSpawnDetection: number; // Detection level when last eye spawned (for 10% increments)
  lastEyeSpawnTime: number; // Timestamp of last eye batch spawn (for 1 min cooldown)

  // Atmosphere Phase - quiet exploration period before pressure systems activate
  ufo74DisengageTime: number; // Timestamp when UFO74 disengaged (for cooldown)

  // Archive/Rewind system - time mechanic for viewing past filesystem state
  inArchiveMode: boolean; // True when player has rewound to past state
  archiveActionsRemaining: number; // Actions left before returning to present (3-5)
  archiveTimestamp: string; // Display timestamp for archive state (e.g., "02:09:12")
  archiveFilesViewed: Set<string>; // Files accessed during this archive session
}

// Firewall Eye entity
export interface FirewallEye {
  id: string;
  x: number; // Position as percentage (0-100)
  y: number; // Position as percentage (0-100)
  spawnTime: number; // Timestamp when spawned
  detonateTime: number; // Timestamp when it will detonate
  isDetonating: boolean; // True during detonation animation
}

export interface SaveSlot {
  id: string;
  name: string;
  timestamp: number;
  currentPath: string;
  truthCount: number;
  detectionLevel: number;
}

export interface CheckpointSlot {
  id: string;
  reason: string;
  timestamp: number;
  currentPath: string;
  truthCount: number;
  detectionLevel: number;
}

export type StreamingMode = 'none' | 'fast' | 'normal' | 'slow' | 'glitchy';
export type GamePhase =
  | 'terminal'
  | 'blackout'
  | 'icq'
  | 'victory'
  | 'bad_ending'
  | 'neutral_ending'
  | 'secret_ending';

export type EndingType = 'bad' | 'neutral' | 'good' | 'secret';

export interface CommandResult {
  output: TerminalEntry[];
  stateChanges: Partial<GameState>;
  triggerFlicker?: boolean;
  delayMs?: number;
  imageTrigger?: ImageTrigger;
  videoTrigger?: VideoTrigger;
  streamingMode?: StreamingMode; // How to stream the output
  skipToPhase?: GamePhase; // GOD mode: skip directly to a phase
  checkAchievements?: string[]; // Achievement IDs to check
  triggerTuringTest?: boolean; // Show Turing test overlay
  pendingUfo74Messages?: TerminalEntry[]; // UFO74 messages to show after image/video closes
  soundTrigger?: 'evidence' | 'error' | 'morse'; // Sound effect to play
}

export const TRUTH_CATEGORIES = [
  'debris_relocation', // Spacecraft debris were split and relocated
  'being_containment', // Non-human beings were contained and transferred
  'telepathic_scouts', // Beings communicated telepathically and were reconnaissance bio-constructs
  'international_actors', // International actors were involved beyond Brazil
  'transition_2026', // A future transition/activation window converges on 2026
] as const;

export type TruthCategory = (typeof TRUTH_CATEGORIES)[number];

// Evidence tracking - simplified to just track which files revealed evidence
export interface EvidenceState {
  linkedFiles: string[]; // Files that revealed this evidence
}

// Evidence Revelation System types
export interface FileEvidenceState {
  // All evidences this file can potentially reveal (determined by content analysis)
  potentialEvidences: TruthCategory[];
  // Evidences already revealed from this file in current playthrough
  revealedEvidences: TruthCategory[];
}

export const DEFAULT_GAME_STATE: Omit<GameState, 'seed' | 'rngState' | 'sessionStartTime'> = {
  currentPath: '/',
  history: [],
  commandHistory: [],
  commandHistoryIndex: -1,
  detectionLevel: 0,
  wrongAttempts: 0,
  accessLevel: 1,
  sessionStability: 100,
  legacyAlertCounter: 0,
  flags: {},
  overrideFailedAttempts: 0,
  scoutLinksUsed: 0,
  truthsDiscovered: new Set(),
  filesRead: new Set(),
  fileMutations: {},
  isGameOver: false,
  gameOverReason: undefined,
  prisoner45QuestionsAsked: 0,
  prisoner45Disconnected: false,
  prisoner45UsedResponses: new Set(),
  scoutLinkUsedResponses: new Set(),
  pendingDecryptFile: undefined,
  turingEvaluationActive: false,
  turingEvaluationIndex: 0,
  turingEvaluationCompleted: false,
  neuralClusterUnlocked: false,
  neuralClusterActive: false,
  neuralClusterEmissions: 0,
  neuralClusterDisabled: false,
  incognitoMessageCount: 0,
  lastIncognitoTrigger: 0,
  singularEventsTriggered: new Set(),
  imagesShownThisRun: new Set(),
  videosShownThisRun: new Set(),
  systemHostilityLevel: 0,
  terribleMistakeTriggered: false,
  sessionDoomCountdown: 0,
  categoriesRead: new Set(),
  sessionCommandCount: 0,
  statusCommandCount: 0,
  lastMeaningfulAction: 0,
  wanderingNoticeCount: 0,
  lastDirectoriesVisited: [],
  tutorialStep: 0,
  tutorialComplete: false,
  interactiveTutorialState: {
    current: TutorialStateID.INTRO,
    failCount: 0,
    nudgeShown: false,
    inputLocked: true,
    dialogueComplete: false,
  },
  interactiveTutorialMode: false,
  tutorialTipsShown: new Set(),
  firstRunSeen: false,
  // Elusive Man leak sequence
  inLeakSequence: false,
  currentLeakQuestion: 0,
  leakWrongAnswers: 0,
  leakAnswers: [],
  evidencesSaved: false,
  icqPhase: false,
  icqMessages: [],
  mathQuestionsAnswered: 0,
  currentMathQuestion: 0,
  mathQuestionWrong: 0,
  filesSent: false,
  gameWon: false,
  choiceLeakPath: undefined,
  icqTrust: 50,
  godMode: false,
  // Multiple endings
  endingType: undefined,
  ufo74SecretDiscovered: false,
  // Time pressure
  countdownActive: false,
  countdownEndTime: 0,
  countdownTriggeredBy: undefined,
  traceSpikeActive: false,
  tracePurgeUsed: false,
  // Unreliable narrator
  disinformationDiscovered: new Set(),
  // Hidden commands
  hiddenCommandsDiscovered: new Set(),
  // Password puzzles
  passwordsFound: new Set(),
  // Cipher puzzles
  pendingCipherFile: undefined,
  cipherAttempts: 0,
  // Morse code puzzle
  morseFileRead: false,
  morseMessageAttempts: 0,
  morseMessageSolved: false,
  // UX: Notes & bookmarks
  playerNotes: [],
  bookmarkedFiles: new Set(),
  lastOpenedFile: undefined,
  navigationHistory: [],
  // UX: Idle detection
  lastActivityTime: 0,
  idleHintsGiven: 0,
  // Stealth recovery
  waitUsesRemaining: 3,
  hideAvailable: false,
  // Evidence linking
  evidenceLinks: [],
  // Evidence revelation system
  fileEvidenceStates: {},
  // Evidence tracking
  evidenceStates: {},
  // Timed decryption
  timedDecryptActive: false,
  timedDecryptFile: undefined,
  timedDecryptSequence: undefined,
  timedDecryptEndTime: 0,
  // Red herring traps
  trapsTriggered: new Set(),
  trapWarningGiven: false,
  // System personality
  systemPersonality: 'bureaucratic',
  paranoiaLevel: 0,
  // Typing speed
  lastKeypressTime: 0,
  fastTypingWarnings: 0,
  // Screen burn-in
  burnInContent: [],
  // Epilogue
  epilogueUnlocked: false,
  rivalInvestigatorActive: false,
  // Avatar expression
  avatarExpression: 'neutral',
  // Save tracking
  lastSaveTime: 0,
  // Search command state
  lastSearchTime: 0,
  // Firewall Eyes system
  firewallActive: false,
  firewallEyes: [],
  firewallDisarmed: false,
  lastEyeSpawnDetection: 0,
  lastEyeSpawnTime: 0,
  // Atmosphere Phase
  ufo74DisengageTime: 0,
  // Archive/Rewind system
  inArchiveMode: false,
  archiveActionsRemaining: 0,
  archiveTimestamp: '',
  archiveFilesViewed: new Set(),
};
