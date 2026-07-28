import { DEFAULT_GAME_STATE, GameState } from '../../types';
import { EndingId, determineEnding } from '../endings';
import { CommandExecutor } from '../commands/types';
import { decideNextCommand } from './strategy';
import { ALL_ENDING_IDS } from './endingTargets';
import { ALL_SCENARIO_IDS, BOT_SCENARIOS, BotScenarioId, resolveScenarioSeed } from './scenarios';
import { BotGoal, BotLevel, createBotMemory } from './types';

/**
 * The headless half of the harness.
 *
 * Watching a run in the terminal takes three seconds a turn, so proving that
 * all twelve endings and every scenario are still reachable would take an
 * afternoon. The same strategy driven straight against `executeCommand` runs a
 * full playthrough in a few milliseconds, which turns "is everything still
 * reachable" into one command.
 *
 * This is the state machine only: no streaming, no overlays, no UFO74 timing.
 * A green sweep says every outcome is still *reachable*; it does not say the
 * screens around it still render. Watch a level run for that.
 *
 * The engine arrives as a parameter rather than an import. `executeCommand`
 * reaches back into the command registry, which registers `bot-test`, which is
 * what calls the sweep — importing it here closed that loop, and the registry
 * dereferences the debug handlers while it is still evaluating, so entering the
 * graph at `debug.ts` threw. Taking it as an argument removes the cycle instead
 * of relying on a bundler to tolerate it.
 */

export const SWEEP_LEVELS: BotLevel[] = ['dummy', 'novice', 'pro', 'chaos'];

/** Bound per run. A full winning playthrough is ~40 turns. */
const MAX_SWEEP_TURNS = 600;

export interface SweepRow {
  label: string;
  goal: BotGoal;
  level: BotLevel;
  seed: number;
  turns: number;
  stopReason: string;
  detection: number;
  filesRead: number;
  saved: number;
  won: boolean;
  gameOver: boolean;
  gameOverReason?: string;
  /** The ending the dossier resolves to, for runs that reached one. */
  ending?: EndingId;
  /** What the row was supposed to produce, in words. */
  expected: string;
  /** What it actually produced, in words. */
  actual: string;
  pass: boolean;
}

function freshState(seed: number): GameState {
  return {
    ...DEFAULT_GAME_STATE,
    tutorialComplete: true,
    seed,
    rngState: seed,
    sessionStartTime: 0,
    filesRead: new Set<string>(),
    savedFiles: new Set<string>(),
    flags: { ...(DEFAULT_GAME_STATE.flags || {}) },
  } as GameState;
}

export interface SweepRunResult {
  state: GameState;
  turns: number;
  stopReason: string;
  commands: string[];
}

/** Plays one run to completion against the pure command engine. */
export function runHeadless(
  execute: CommandExecutor,
  level: BotLevel,
  seed: number,
  goal: BotGoal,
  maxTurns: number = MAX_SWEEP_TURNS
): SweepRunResult {
  let state = freshState(seed);
  let memory = createBotMemory();
  const commands: string[] = [];
  let stopReason = 'unterminated';

  for (let i = 0; i < maxTurns; i++) {
    const { decision, memory: next } = decideNextCommand(state, memory, level, seed, goal);
    memory = next;
    if (decision.kind === 'done') {
      stopReason = decision.reason;
      break;
    }
    const input = decision.kind === 'enter' ? '' : decision.text;
    commands.push(input);
    const result = execute(input, state);
    state = { ...state, ...result.stateChanges } as GameState;
  }

  return { state, turns: memory.turnsTaken, stopReason, commands };
}

function describeOutcome(state: GameState): string {
  if (state.gameWon) return `won:${determineEnding(state.savedFiles)}`;
  if (state.isGameOver) return `gameOver:${state.gameOverReason || 'unknown'}`;
  return 'survived';
}

function baseRow(
  label: string,
  goal: BotGoal,
  level: BotLevel,
  seed: number,
  run: SweepRunResult
): Omit<SweepRow, 'expected' | 'actual' | 'pass'> {
  return {
    label,
    goal,
    level,
    seed,
    turns: run.turns,
    stopReason: run.stopReason,
    detection: run.state.detectionLevel,
    filesRead: run.state.filesRead.size,
    saved: run.state.savedFiles.size,
    won: Boolean(run.state.gameWon),
    gameOver: Boolean(run.state.isGameOver),
    gameOverReason: run.state.gameOverReason,
    ending: run.state.gameWon ? determineEnding(run.state.savedFiles) : undefined,
  };
}

export function sweepLevel(execute: CommandExecutor, level: BotLevel, seed: number): SweepRow {
  const goal: BotGoal = { kind: 'default' };
  const run = runHeadless(execute, level, seed, goal);
  const row = baseRow(`level:${level}`, goal, level, seed, run);
  // `dummy` cannot reach ten saves by design, so "terminated without winning"
  // is its pass condition, not its failure.
  const expected = level === 'dummy' ? 'terminates without hanging' : 'won:<any ending>';
  const pass =
    level === 'dummy'
      ? run.stopReason !== 'unterminated' && run.stopReason !== 'max turns reached'
      : Boolean(run.state.gameWon);
  return { ...row, expected, actual: describeOutcome(run.state), pass };
}

export function sweepEnding(execute: CommandExecutor, ending: EndingId, seed: number): SweepRow {
  const goal: BotGoal = { kind: 'ending', ending };
  // Ending runs are planned, not improvised, so the level only decides how the
  // *default* strategy would behave — which this goal never falls through to.
  const run = runHeadless(execute, 'pro', seed, goal);
  const row = baseRow(`ending:${ending}`, goal, 'pro', seed, run);
  const pass = Boolean(run.state.gameWon) && determineEnding(run.state.savedFiles) === ending;
  return { ...row, expected: `won:${ending}`, actual: describeOutcome(run.state), pass };
}

export function sweepScenario(
  execute: CommandExecutor,
  scenario: BotScenarioId,
  seed: number
): SweepRow {
  const spec = BOT_SCENARIOS[scenario];
  const resolvedSeed = resolveScenarioSeed(scenario, seed);
  const goal: BotGoal = { kind: 'scenario', scenario };
  const run = runHeadless(execute, 'novice', resolvedSeed, goal);
  const row = baseRow(`scenario:${scenario}`, goal, 'novice', resolvedSeed, run);

  const expected =
    spec.expect.kind === 'gameOver' ? `gameOver:${spec.expect.reason}` : 'survived';
  const actual = describeOutcome(run.state);
  const pass =
    spec.expect.kind === 'gameOver'
      ? Boolean(run.state.isGameOver) && run.state.gameOverReason === spec.expect.reason
      : !run.state.isGameOver && !run.state.gameWon;

  return { ...row, expected, actual, pass };
}

export interface SweepOptions {
  seed?: number;
  levels?: boolean;
  endings?: boolean;
  scenarios?: boolean;
}

/** Runs every requested category and returns one row per run. */
export function runBotSweep(execute: CommandExecutor, options: SweepOptions = {}): SweepRow[] {
  const seed = options.seed ?? 1;
  const wantLevels = options.levels ?? true;
  const wantEndings = options.endings ?? true;
  const wantScenarios = options.scenarios ?? true;

  const rows: SweepRow[] = [];
  if (wantLevels) for (const level of SWEEP_LEVELS) rows.push(sweepLevel(execute, level, seed));
  if (wantEndings) for (const e of ALL_ENDING_IDS) rows.push(sweepEnding(execute, e, seed));
  if (wantScenarios) for (const s of ALL_SCENARIO_IDS) rows.push(sweepScenario(execute, s, seed));
  return rows;
}

export function summariseSweep(rows: SweepRow[]): { passed: number; failed: number } {
  const passed = rows.filter(r => r.pass).length;
  return { passed, failed: rows.length - passed };
}
