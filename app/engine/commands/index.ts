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

// Interactive tutorial system
export {
  TutorialStateID,
  INITIAL_TUTORIAL_STATE,
  TUTORIAL_DIALOGUE,
  TUTORIAL_NUDGES,
  TUTORIAL_ROOT_LISTING,
  TUTORIAL_MISC_LISTING,
  CAFETERIA_MENU_CONTENT,
  validateTutorialInput,
  getTutorialAutocomplete,
  isTutorialInputState,
  isInTutorialMode,
  generateIntroDialogue,
  generateStateDialogue,
  processTutorialInput,
  initializeInteractiveTutorial,
  getInitialTutorialOutput,
} from './interactiveTutorial';
