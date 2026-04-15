// Timing constants in milliseconds
// Centralizing these makes tuning gameplay feel easier

// Auto-save and session tracking
export const AUTOSAVE_INTERVAL_MS = 30000; // 30 seconds

// Transition delays
export const CRT_WARMUP_DURATION_MS = 1500;
export const BLACKOUT_TRANSITION_DELAY_MS = 3000;
export const GAME_OVER_DELAY_MS = 1500;

// Visual effects
export const RISK_PULSE_DURATION_MS = 600;

// Paranoia system
export const PARANOIA_TIMING = {
  BASE_INTERVAL_MS: 60000,
  MIN_INTERVAL_MS: 15000,
  VARIANCE_MS: 20000,
  DETECTION_DIVISOR: 400,
  DISPLAY_DURATION_MS: 3000,
} as const;

// Typing/input
export const TYPING_WARNING_TIMEOUT_MS = 3000;

// Night Owl achievement tracking
export const NIGHT_OWL_DURATION_MS = 30 * 60 * 1000; // 30 minutes
