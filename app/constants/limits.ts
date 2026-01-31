// Storage and history limits
// These constants define size limits to prevent unbounded growth

// Save file version - increment when save format changes
// Migration logic should be added to saves.ts migrateState()
export const SAVE_VERSION = 1;

// Maximum number of terminal history entries to keep
export const MAX_HISTORY_SIZE = 500;

// Maximum number of commands in command history (for arrow-key navigation)
export const MAX_COMMAND_HISTORY_SIZE = 100;

// Maximum length of a command input string
export const MAX_COMMAND_INPUT_LENGTH = 256;

// Maximum number of player notes
export const MAX_PLAYER_NOTES = 50;

// Maximum number of save slots
export const MAX_SAVE_SLOTS = 10;

// Maximum number of navigation history entries (for 'back' command)
export const MAX_NAVIGATION_HISTORY = 20;
