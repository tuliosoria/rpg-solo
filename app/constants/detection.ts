// Detection level thresholds used throughout the game
// Centralizing these makes balancing easier

export const DETECTION_THRESHOLDS = {
  // UI/Visual feedback thresholds
  SUSPICIOUS: 50, // First warning level - status bar changes
  ALERT: 70, // Increased tension - more warnings
  CRITICAL: 85, // Near-death state
  IMMINENT: 90, // Emergency escape available

  // Gameplay mechanic thresholds
  LIGHT_GLITCH: 40, // Light visual glitches begin
  MEDIUM_GLITCH: 60, // Medium glitches
  HEAVY_GLITCH: 80, // Heavy glitches with screen shake
  DOUBLE_GLITCH: 90, // Double glitch effects

  // Stealth recovery thresholds
  HIDE_AVAILABLE: 90, // When hide command becomes available
  HIGH_WAIT_REDUCTION: 70, // Higher detection reduction from wait
  GHOST_MAX: 5, // Max detection for ghost achievement

  // Response delay thresholds (typing simulation)
  DELAY_NONE: 20, // No delay below this
  DELAY_LOW: 40, // Low delay
  DELAY_MEDIUM: 60, // Medium delay
  DELAY_HIGH: 80, // High delay

  // Decrypt hostility thresholds
  DECRYPT_WARNING: 50, // When decrypt gets more hostile
  HOSTILITY_HIGH: 80, // High hostility
  HOSTILITY_MED: 60, // Medium hostility
  HOSTILITY_LOW: 40, // Low hostility

  // Wandering trigger thresholds
  WANDERING_LOW: 35, // Low detection wandering notices
  WANDERING_MID: 45, // Mid detection wandering
  WANDERING_RANGE_MIN: 45, // Min for range-based wandering
  WANDERING_RANGE_MAX: 55, // Max for range-based wandering
  WANDERING_PSI: 40, // PSI-related wandering
  WANDERING_ADMIN: 60, // Admin-related wandering
  WANDERING_TRUTHS: 50, // Truth-discovery wandering
  WANDERING_EVIDENCE: 45, // Evidence-based wandering

  // Status check thresholds
  STATUS_LOW: 20, // "All clear" status
  STATUS_MED: 50, // "Elevated" status
  STATUS_HIGH: 80, // "Critical" status
} as const;

// Maximum detection level
export const MAX_DETECTION = 100;

// Detection increases for various actions
// BALANCE NOTE: Reduced values for more gradual pacing (Jan 2026)
export const DETECTION_INCREASES = {
  OPEN_FILE: 1, // was 2
  OPEN_RESTRICTED: 3, // was 5
  DECRYPT_SUCCESS: 2, // was 3
  DECRYPT_FAILURE: 5, // was 8
  OVERRIDE_ATTEMPT: 7, // was 10
  TIMED_DECRYPT_EXPIRED: 5, // was 8
  WRONG_PASSWORD: 3, // was 5
  SCAN_COMMAND: 2, // was 3
  TRACE_SPIKE: 10, // was 15
} as const;

// Detection decreases
export const DETECTION_DECREASES = {
  WAIT_NORMAL: 5,
  WAIT_HIGH_DETECTION: 8,
  TRUTH_DISCOVERY: 3,
  TIMED_DECRYPT_SUCCESS: 3,
} as const;
