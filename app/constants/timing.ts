// Timing constants in milliseconds
// Centralizing these makes tuning gameplay feel easier

// Auto-save and session tracking
export const AUTOSAVE_INTERVAL_MS = 30000; // 30 seconds
export const IDLE_HINT_DELAY_MS = 120000;  // 2 minutes
export const SCROLL_ACTIVITY_THRESHOLD_MS = 30000; // 30 seconds

// Transition delays
export const CRT_WARMUP_DURATION_MS = 1500;
export const BLACKOUT_TRANSITION_DELAY_MS = 3000;
export const TURING_TEST_DELAY_MS = 1500;
export const GAME_OVER_DELAY_MS = 1500;
export const TUTORIAL_REVEAL_DELAY_MS = 300;

// Visual effects
export const GLITCH_DURATIONS = {
  LIGHT: 200,
  MEDIUM: 300,
  HEAVY: 500,
  CRITICAL: 600,
  SCREEN_SHAKE: 300,
} as const;

export const GLITCH_TIMING = {
  MIN_INTERVAL_MS: 1200,
  BASE_INTERVAL_MS: 4000,
  DETECTION_FACTOR: 25,    // Divisor for detection-based timing
  VARIANCE_FACTOR: 10,     // Divisor for random variance
} as const;

export const FLICKER_DURATION_MS = 300;
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
export const TIMER_UPDATE_INTERVAL_MS = 100;

// UFO74 messaging
export const UFO74_MESSAGE_COOLDOWN_MS = 15000;

// ICQ chat
export const ICQ_DEFAULT_TYPING_DELAY_MS = 1500;
export const ICQ_VICTORY_DELAY_MS = 5000;

// Turing test overlay
export const TURING_TIMING = {
  FLICKER_CHECK_INTERVAL_MS: 2000,
  QUESTION_TRANSITION_DELAY_MS: 1500,
  INITIAL_FLICKER_MS: 200,
  FLICKER_PROBABILITY: 0.1,
} as const;

// Night Owl achievement tracking
export const NIGHT_OWL_DURATION_MS = 30 * 60 * 1000; // 30 minutes
