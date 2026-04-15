// Gameplay mechanics constants
// Centralizing these makes balancing easier

// Attempt limits (used for game over conditions)
export const MAX_WRONG_ATTEMPTS = 8;       // Wrong password/command attempts before game over

// Typing/input suspicion
export const SUSPICIOUS_TYPING_SPEED = 8;  // Characters per second that triggers suspicion
export const KEYPRESS_TRACK_SIZE = 10;     // Number of keypresses to track for speed detection
