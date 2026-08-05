import { CommandExecutor, CommandRegistry } from './types';
import { createEntry } from './utils';
import { TerminalEntry } from '../../types';
import {
  BotGoal,
  BotLevel,
  DEFAULT_BOT_DELAY_MS,
  DEFAULT_BOT_MAX_TURNS,
  describeGoal,
} from '../bot/types';
import { ALL_ENDING_IDS, ENDING_RECIPES, isEndingId } from '../bot/endingTargets';
import {
  ALL_SCENARIO_IDS,
  BOT_SCENARIOS,
  isScenarioId,
  resolveScenarioSeed,
} from '../bot/scenarios';
import { runBotSweep, summariseSweep } from '../bot/sweep';

const LEVELS: BotLevel[] = ['dummy', 'novice', 'pro', 'chaos'];

/**
 * Parses `bot-test`'s argument list.
 *
 * Grammar — every part is optional apart from an id following its keyword:
 *
 *   bot-test [level] [seed]
 *   bot-test ending <endingId> [seed]
 *   bot-test scenario <scenarioId> [seed]
 *   bot-test <endingId|scenarioId> [seed]     keyword optional; ids are unique
 *   bot-test list
 *   bot-test sweep [seed]
 */
interface ParsedBotArgs {
  mode: 'run' | 'list' | 'sweep';
  level: BotLevel;
  goal: BotGoal;
  seedArg?: string;
  /** An `ending`/`scenario` keyword whose id was missing or unrecognised. */
  badTarget?: string;
}

export function parseBotArgs(args: string[]): ParsedBotArgs {
  const lower = args.map(a => a.toLowerCase());
  const seedArg = args.find(a => /^\d+$/.test(a));
  let level: BotLevel = 'novice';
  let goal: BotGoal = { kind: 'default' };
  let badTarget: string | undefined;

  for (let i = 0; i < lower.length; i++) {
    const token = lower[i];
    if (token === 'list' || token === 'help') return { mode: 'list', level, goal, seedArg };
    if (token === 'sweep') return { mode: 'sweep', level, goal, seedArg };
    if (LEVELS.includes(token as BotLevel)) {
      level = token as BotLevel;
      continue;
    }
    if (token === 'ending' || token === 'scenario') {
      const id = lower[i + 1];
      i += 1;
      if (token === 'ending' && id && isEndingId(id)) goal = { kind: 'ending', ending: id };
      else if (token === 'scenario' && id && isScenarioId(id)) {
        goal = { kind: 'scenario', scenario: id };
      } else badTarget = `${token} ${id ?? ''}`.trim();
      continue;
    }
    // Bare ids: endings and scenarios share no names with each other or with a
    // level, so the keyword is a convenience rather than a requirement.
    if (isEndingId(token)) goal = { kind: 'ending', ending: token };
    else if (isScenarioId(token)) goal = { kind: 'scenario', scenario: token };
  }

  return { mode: 'run', level, goal, seedArg, badTarget };
}

function listing(): TerminalEntry[] {
  const lines: TerminalEntry[] = [
    createEntry('system', ''),
    createEntry('system', '  BOT-TEST TARGETS'),
    createEntry('system', ''),
    createEntry('notice', '  levels    bot-test <level> [seed]'),
  ];
  for (const level of LEVELS) lines.push(createEntry('system', `    ${level}`));

  lines.push(
    createEntry('system', ''),
    createEntry('notice', `  endings   bot-test ending <id> [seed]   (${ALL_ENDING_IDS.length})`)
  );
  for (const id of ALL_ENDING_IDS) {
    lines.push(
      createEntry(
        'system',
        `    ${id.padEnd(20)} anchored on ${ENDING_RECIPES[id].required.length} file(s)`
      )
    );
  }

  lines.push(
    createEntry('system', ''),
    createEntry('notice', `  scenarios bot-test scenario <id> [seed]  (${ALL_SCENARIO_IDS.length})`)
  );
  for (const id of ALL_SCENARIO_IDS) {
    lines.push(createEntry('system', `    ${id.padEnd(20)} ${BOT_SCENARIOS[id].summary}`));
  }

  lines.push(
    createEntry('system', ''),
    createEntry('notice', '  bot-test sweep [seed]   run every target headlessly and report'),
    createEntry('system', '')
  );
  return lines;
}

function sweepReport(execute: CommandExecutor, seed: number): TerminalEntry[] {
  const rows = runBotSweep(execute, { seed });
  const { passed, failed } = summariseSweep(rows);
  const lines: TerminalEntry[] = [
    createEntry('system', ''),
    createEntry('system', '═══════════════════════════════════════'),
    createEntry('system', '  BOT-TEST SWEEP'),
    createEntry('system', '═══════════════════════════════════════'),
    createEntry(
      'system',
      `  Seed: ${seed}   Runs: ${rows.length}   Passed: ${passed}   Failed: ${failed}`
    ),
    createEntry('system', ''),
  ];
  for (const row of rows) {
    lines.push(
      createEntry(
        row.pass ? 'system' : 'warning',
        `  ${row.pass ? 'PASS' : 'FAIL'}  ${row.label.padEnd(28)} ${row.actual}` +
          (row.pass ? '' : `  (expected ${row.expected})`)
      )
    );
  }
  lines.push(
    createEntry('system', ''),
    createEntry(
      failed ? 'warning' : 'system',
      failed
        ? `  ${failed} target(s) unreachable — see FAIL rows above.`
        : '  Every ending and scenario is still reachable.'
    ),
    createEntry('system', ''),
    // Worth saying out loud: the sweep drives the pure command engine, so it
    // can prove an outcome is still *reachable* and nothing at all about the
    // screen that outcome puts on the player's monitor.
    createEntry('system', '  (state machine only: proves reachability, not rendering —'),
    createEntry('system', '   watch a level run to check the screens themselves.)'),
    createEntry('system', '')
  );
  return lines;
}

export const debugCommands: CommandRegistry = {
  'bot-test': (args, state, execute) => {
    const parsed = parseBotArgs(args);
    const sessionSeed = typeof state.seed === 'number' ? state.seed : 1;
    const requestedSeed = parsed.seedArg ? parseInt(parsed.seedArg, 10) : sessionSeed;

    if (parsed.mode === 'list') return { output: listing(), stateChanges: {} };
    if (parsed.mode === 'sweep') {
      // The engine is handed in rather than imported; see `CommandExecutor`.
      if (!execute) {
        return {
          output: [
            createEntry('error', ''),
            createEntry('error', '  BOT-TEST: sweep needs the command executor.'),
            createEntry('system', '  it is supplied by executeCommand — call bot-test through it.'),
            createEntry('system', ''),
          ],
          stateChanges: {},
        };
      }
      return { output: sweepReport(execute, requestedSeed), stateChanges: {} };
    }

    if (parsed.badTarget) {
      return {
        output: [
          createEntry('error', ''),
          createEntry('error', `  BOT-TEST: unknown target "${parsed.badTarget}"`),
          createEntry('system', '  run "bot-test list" to see every level, ending and scenario.'),
          createEntry('system', ''),
        ],
        stateChanges: {},
      };
    }

    // A scenario can sit behind a seeded dice roll, in which case it names the
    // seeds that reach its branch and gets one — otherwise the run is a coin
    // flip and a FAIL means nothing.
    const seed =
      parsed.goal.kind === 'scenario'
        ? resolveScenarioSeed(parsed.goal.scenario, requestedSeed)
        : requestedSeed;
    // That chosen seed has to reach the game even when the player named no
    // seed, because the roll it steers is taken against `rngState`.
    const applySeed = Boolean(parsed.seedArg) || seed !== sessionSeed;

    return {
      output: [
        createEntry('system', ''),
        createEntry(
          'warning',
          `  BOT-TEST ENGAGED — level=${parsed.level}, seed=${seed}, goal=${describeGoal(parsed.goal)}`
        ),
        ...(parsed.goal.kind === 'scenario'
          ? [createEntry('system' as const, `  ${BOT_SCENARIOS[parsed.goal.scenario].summary}`)]
          : []),
        createEntry('system', '  autoplay starting. type "bot-stop" or press a key to halt.'),
        createEntry('system', ''),
      ],
      stateChanges: {
        botTest: {
          active: true,
          level: parsed.level,
          seed,
          maxTurns: DEFAULT_BOT_MAX_TURNS,
          delayMs: DEFAULT_BOT_DELAY_MS,
          goal: parsed.goal,
        },
        // An explicit seed has to reach the game, not just the run summary.
        // `state.seed` is what actually drives play — the leak sequence, file
        // content variation, honeypot rolls — so storing the argument only on
        // `botTest` left it inert: every `bot-test novice 42` ran on whatever
        // seed the session happened to have while the summary claimed 42, and
        // re-running a reported seed reproduced nothing.
        ...(applySeed ? { seed, rngState: seed } : {}),
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
