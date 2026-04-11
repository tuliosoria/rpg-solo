// Command registry index - combines all command modules into unified registry

import type { CommandRegistry } from './types';
import { systemCommands } from './system';
import { filesystemCommands, setCommandsRef as setFilesystemRef } from './filesystem';
import { evidenceCommands } from './evidence';
import { combatCommands } from './combat';
import { chatCommands, setCommandsRef as setChatRef } from './chat';
import { archiveCommands, setCommandsRef as setArchiveRef } from './archive';
import { navigationCommands } from './navigation';
import { inventoryCommands } from './inventory';

// Re-export from existing modules for backward compatibility
export {
  generateEntryId,
  createEntry,
  createOutputEntries,
  createInvalidCommandResult,
  sanitizeCommandInput,
  parseCommand,
  calculateDelay,
  shouldFlicker,
  addHesitation,
  maybeAddTypo,
  createUFO74Message,
} from './utils';

export {
  TUTORIAL_MESSAGES,
  generateBootSequence,
  getTutorialMessage,
  getFirstRunMessage,
  getTutorialTip,
  shouldShowTutorialTip,
} from './tutorial';
export type { TutorialTipId } from './tutorial';

// Re-export helpers used by main commands.ts
export {
  isInWarmupPhase,
  checkSingularEvents,
  calculateHostilityIncrease,
  applyHostileFiltering,
  checkWanderingState,
  getIncognitoMessage,
  isArchiveOnlyFile,
  hasReadPsiMaterial,
  performDecryption,
  getWarmupAdjustedDetection,
} from './helpers';

// Re-export types
export type { CommandHandler, CommandRegistry } from './types';

// Build the unified commands registry
export const commands: CommandRegistry = {
  ...systemCommands,
  ...filesystemCommands,
  ...evidenceCommands,
  ...combatCommands,
  ...chatCommands,
  ...archiveCommands,
  ...navigationCommands,
  ...inventoryCommands,
};

// Wire up cross-references now that all commands are assembled
setFilesystemRef(commands);
setChatRef(commands);
setArchiveRef(commands);
