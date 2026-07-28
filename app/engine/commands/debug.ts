import { CommandRegistry } from './types';
import { createEntry } from './utils';
import { BotLevel, DEFAULT_BOT_DELAY_MS, DEFAULT_BOT_MAX_TURNS } from '../bot/types';

const LEVELS: BotLevel[] = ['dummy', 'novice', 'pro', 'chaos'];

export const debugCommands: CommandRegistry = {
  'bot-test': (args, state) => {
    const level = (LEVELS.includes(args[0] as BotLevel) ? args[0] : 'novice') as BotLevel;
    const seedArg = args.find(a => /^\d+$/.test(a));
    const seed = seedArg ? parseInt(seedArg, 10) : (typeof state.seed === 'number' ? state.seed : 1);
    return {
      output: [
        createEntry('system', ''),
        createEntry('warning', `  BOT-TEST ENGAGED — level=${level}, seed=${seed}`),
        createEntry('system', '  autoplay starting. type "bot-stop" or press a key to halt.'),
        createEntry('system', ''),
      ],
      stateChanges: {
        botTest: { active: true, level, seed, maxTurns: DEFAULT_BOT_MAX_TURNS, delayMs: DEFAULT_BOT_DELAY_MS },
        // An explicit seed has to reach the game, not just the run summary.
        // `state.seed` is what actually drives play — the leak sequence, file
        // content variation, honeypot rolls — so storing the argument only on
        // `botTest` left it inert: every `bot-test novice 42` ran on whatever
        // seed the session happened to have while the summary claimed 42, and
        // re-running a reported seed reproduced nothing.
        ...(seedArg ? { seed, rngState: seed } : {}),
      },
    };
  },
  'bot-stop': (_args, state) => ({
    output: [createEntry('system', '  BOT-TEST halted.')],
    stateChanges: {
      botTest: state.botTest ? { ...state.botTest, active: false } : undefined,
    },
  }),
};
