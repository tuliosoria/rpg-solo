// Commands module - re-exports utilities for backward compatibility
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

export { TUTORIAL_MESSAGES, generateBootSequence, getTutorialMessage } from './tutorial';
