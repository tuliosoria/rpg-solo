// Gameplay mechanics constants
// Centralizing these makes balancing easier

// Attempt limits (used for game over conditions)
export const MAX_WRONG_ATTEMPTS = 8;       // Wrong password/command attempts before game over
export const MAX_INVALID_COMMANDS = 8;     // Same as above, used in different contexts

// Typing/input suspicion
export const SUSPICIOUS_TYPING_SPEED = 8;  // Characters per second that triggers suspicion
export const KEYPRESS_TRACK_SIZE = 10;     // Number of keypresses to track for speed detection

// Idle hints
export const MAX_IDLE_HINTS_PER_SESSION = 5;

// UFO74 messaging
export const MAX_UFO74_MESSAGES = 12;      // Max messages per session
export const UFO74_STATE_THRESHOLDS = {
  CURIOUS: 3,
  INTRIGUED: 6,
  INVESTED: 9,
  FULLY_ENGAGED: 12,
} as const;

export const UFO74_TRUST_THRESHOLDS = {
  HIGH_RISK: 15,
  MED_RISK: 10,
  LOW_RISK: 5,
} as const;

// Probability thresholds
export const UFO74_PROBABILITIES = {
  DEGRADED_TRUST_MESSAGE: 0.5,
  MULTIPLE_PERSONA_HINT: 0.3,
  QUIET_MODE_SPEECH: 0.2,
  FILE_COMMENT: 0.7,
  SYSTEM_PERSONALITY_MESSAGE: 0.4,
} as const;

// Command detection variance
export const COMMAND_VARIANCE = {
  HOT_THRESHOLD: 0.15,
  COLD_THRESHOLD: 0.85,
} as const;

// Corruption settings
export const CORRUPTION_SETTINGS = {
  DECRYPT_CHANCE: 0.4,
  MIN_LINES: 3,
  MAX_LINES_LOW: 8,
  MAX_LINES_HIGH: 15,
} as const;

// Countdown warning thresholds (in seconds)
export const COUNTDOWN_WARNING_THRESHOLDS = [30, 10, 5] as const;

// Detection reduction rewards
export const TRUTH_DISCOVERY_DETECTION_REDUCTION = 10;

// Evidence revelation
export const MIN_PATTERN_MATCHES = 2;

// ICQ trust adjustments
export const ICQ_TRUST_ADJUSTMENTS = {
  PERFECT_ANSWER: 6,
  GOOD_ANSWER: 4,
  OKAY_ANSWER: 3,
  NEUTRAL: 2,
  POOR_ANSWER: -2,
  BAD_ANSWER: -3,
  TERRIBLE_ANSWER: -4,
} as const;

export const ICQ_WRONG_ATTEMPTS_FOR_HINT = 2;

// Achievement thresholds
export const ACHIEVEMENT_THRESHOLDS = {
  SPEED_DEMON_MAX_COMMANDS: 50,
  GHOST_PROTOCOL_MAX_DETECTION: 20,  // Should match DETECTION_THRESHOLDS.STATUS_LOW
  ELITE_HACKER_DECRYPT_COUNT: 5,
  BOOKWORM_BOOKMARK_COUNT: 5,
  PARANOID_STATUS_CHECKS: 10,
  NIGHT_OWL_MINUTES: 30,
} as const;
