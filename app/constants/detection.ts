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

  // Turing test thresholds
  TURING_WARNING: 45, // UFO74 warns player at this level
  TURING_TRIGGER: 50, // Turing test triggers EXACTLY at this level

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

// ═══════════════════════════════════════════════════════════════════════════
// WARMUP PHASE - Reduced detection early game for atmospheric pacing
// ═══════════════════════════════════════════════════════════════════════════
// During the warmup phase, detection increases are reduced to let players
// learn the system without punishment. The modifier ramps up gradually.
export const WARMUP_PHASE = {
  // Number of files read before warmup ends (exploration-based, not command-based)
  FILES_READ_THRESHOLD: 8,
  // Soft cap on detection during warmup - detection won't exceed this easily
  SOFT_CAP: 15,
  // Minimum multiplier at start (25% of normal detection)
  MIN_MULTIPLIER: 0.25,
  // Ramp curve: how quickly multiplier increases (higher = slower ramp)
  RAMP_DIVISOR: 10,
} as const;

/**
 * Calculate the warmup modifier for detection increases.
 * Returns a multiplier (0.25 to 1.0) based on how many files have been read.
 * Early game = low multiplier = reduced penalties.
 * After FILES_READ_THRESHOLD files, returns 1.0 (full penalties).
 */
export function getWarmupMultiplier(filesReadCount: number): number {
  if (filesReadCount >= WARMUP_PHASE.FILES_READ_THRESHOLD) {
    return 1.0;
  }
  // Gradual ramp: starts at MIN_MULTIPLIER, reaches 1.0 at threshold
  const progress = filesReadCount / WARMUP_PHASE.FILES_READ_THRESHOLD;
  return WARMUP_PHASE.MIN_MULTIPLIER + progress * (1.0 - WARMUP_PHASE.MIN_MULTIPLIER);
}

/**
 * Apply warmup modifier to a detection increase.
 * During warmup, also enforces soft cap - detection increases that would
 * push above SOFT_CAP are further reduced.
 */
export function applyWarmupDetection(
  currentDetection: number,
  increase: number,
  filesReadCount: number
): number {
  const multiplier = getWarmupMultiplier(filesReadCount);
  let modifiedIncrease = Math.ceil(increase * multiplier);

  // Soft cap enforcement during warmup
  if (filesReadCount < WARMUP_PHASE.FILES_READ_THRESHOLD) {
    const wouldBe = currentDetection + modifiedIncrease;
    if (wouldBe > WARMUP_PHASE.SOFT_CAP) {
      // Allow going slightly over soft cap, but heavily diminish returns
      const overCap = wouldBe - WARMUP_PHASE.SOFT_CAP;
      modifiedIncrease = Math.max(
        1,
        modifiedIncrease - Math.floor(overCap * 0.7)
      );
    }
  }

  return Math.min(MAX_DETECTION, currentDetection + modifiedIncrease);
}
