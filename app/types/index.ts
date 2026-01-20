// Terminal 1996 - Type Definitions

export type FileStatus = 'intact' | 'restricted' | 'unstable' | 'encrypted' | 'conditional' | 'restricted_briefing';

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
  type: 'input' | 'output' | 'system' | 'warning' | 'error' | 'notice' | 'ufo74';
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
  dataIntegrity: number; // 100-0 (starts high, degrades)
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
  
  // System personality degradation (affects tone as risk increases)
  systemHostilityLevel: number; // 0-5, increases with risky actions
  
  // Terrible mistake state - forbidden knowledge revealed but session doomed
  terribleMistakeTriggered: boolean;
  sessionDoomCountdown: number; // Commands remaining before forced purge
  
  // Content categories read (for conditional file access)
  categoriesRead: Set<string>; // e.g., 'military', 'medical', 'comms', 'logistics'
  
  // Session command count (for time-sensitive content)
  sessionCommandCount: number;
  
  // Wandering detection (for implicit guidance)
  lastMeaningfulAction: number; // Command count at last meaningful action
  wanderingNoticeCount: number; // How many times we've nudged the player
  lastDirectoriesVisited: string[]; // Recent directory history for pattern detection
  
  // Tutorial state (UFO74 intro messages)
  tutorialStep: number; // -1 = complete, 0+ = current message index
  tutorialComplete: boolean;
  
  // Evidence collection & ICQ phase
  evidencesSaved: boolean; // True after running save script
  icqPhase: boolean; // True when in ICQ chat mode
  icqMessages: { sender: 'player' | 'teen'; text: string }[]; // Chat history
  mathQuestionsAnswered: number; // 0-3, how many equations solved
  currentMathQuestion: number; // Current equation index
  mathQuestionWrong: number; // Wrong attempts on current question
  filesSent: boolean; // True after convincing teenager
  gameWon: boolean; // True on victory
  
  // Debug mode
  godMode: boolean; // Hidden dev mode for testing
  
  // Multiple endings tracking
  endingType?: 'bad' | 'neutral' | 'good' | 'secret'; // Which ending was achieved
  ufo74SecretDiscovered: boolean; // Found the secret about UFO74's identity
  
  // Time pressure
  countdownActive: boolean; // Real-time countdown triggered
  countdownEndTime: number; // Timestamp when countdown expires
  countdownTriggeredBy?: string; // What triggered the countdown
  
  // Unreliable narrator
  disinformationDiscovered: Set<string>; // Files revealed to be disinformation
  
  // Hidden commands discovered
  hiddenCommandsDiscovered: Set<string>; // Commands found via documents
  
  // Password puzzles
  passwordsFound: Set<string>; // Passwords discovered in documents
  
  // Cipher puzzle state
  pendingCipherFile?: string; // File awaiting cipher solution
  cipherAttempts: number; // Wrong attempts on current cipher
}

export interface SaveSlot {
  id: string;
  name: string;
  timestamp: number;
  currentPath: string;
  truthCount: number;
}

export type StreamingMode = 'none' | 'fast' | 'normal' | 'slow' | 'glitchy';
export type GamePhase = 'terminal' | 'blackout' | 'icq' | 'victory' | 'bad_ending' | 'neutral_ending' | 'secret_ending';
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
}

export const TRUTH_CATEGORIES = [
  'debris_relocation',      // Spacecraft debris were split and relocated
  'being_containment',      // Non-human beings were contained and transferred
  'telepathic_scouts',      // Beings communicated telepathically and were reconnaissance bio-constructs
  'international_actors',   // International actors were involved beyond Brazil
  'transition_2026'         // A future transition/activation window converges on 2026
] as const;

export type TruthCategory = typeof TRUTH_CATEGORIES[number];

export const DEFAULT_GAME_STATE: Omit<GameState, 'seed' | 'rngState' | 'sessionStartTime'> = {
  currentPath: '/',
  history: [],
  commandHistory: [],
  commandHistoryIndex: -1,
  detectionLevel: 0,
  dataIntegrity: 100,
  accessLevel: 1,
  sessionStability: 100,
  legacyAlertCounter: 0,
  flags: {},
  overrideFailedAttempts: 0,
  scoutLinksUsed: 0,
  truthsDiscovered: new Set(),
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
  systemHostilityLevel: 0,
  terribleMistakeTriggered: false,
  sessionDoomCountdown: 0,
  categoriesRead: new Set(),
  sessionCommandCount: 0,
  lastMeaningfulAction: 0,
  wanderingNoticeCount: 0,
  lastDirectoriesVisited: [],
  tutorialStep: 0,
  tutorialComplete: false,
  evidencesSaved: false,
  icqPhase: false,
  icqMessages: [],
  mathQuestionsAnswered: 0,
  currentMathQuestion: 0,
  mathQuestionWrong: 0,
  filesSent: false,
  gameWon: false,
  godMode: false,
  // Multiple endings
  endingType: undefined,
  ufo74SecretDiscovered: false,
  // Time pressure
  countdownActive: false,
  countdownEndTime: 0,
  countdownTriggeredBy: undefined,
  // Unreliable narrator
  disinformationDiscovered: new Set(),
  // Hidden commands
  hiddenCommandsDiscovered: new Set(),
  // Password puzzles
  passwordsFound: new Set(),
  // Cipher puzzles
  pendingCipherFile: undefined,
  cipherAttempts: 0,
};
