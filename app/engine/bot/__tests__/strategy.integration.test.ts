import { describe, it, expect } from 'vitest';
import { executeCommand } from '../../commands';
import { decideNextCommand } from '../strategy';
import { createBotMemory } from '../types';
import { BOT_PROBE_COMMANDS } from '../probes';
import { DEFAULT_GAME_STATE, GameState } from '../../../types';
import { BotLevel } from '../types';
import { determineEnding } from '../../endings';

function runBot(level: BotLevel): { state: GameState; turns: number; reason: string } {
  let state: GameState = {
    ...DEFAULT_GAME_STATE,
    tutorialComplete: true,
    seed: 12345,
    filesRead: new Set<string>(),
    savedFiles: new Set<string>(),
  } as GameState;
  let memory = createBotMemory();
  let reason = 'unterminated';
  for (let i = 0; i < 600; i++) {
    const { decision, memory: nextMemory } = decideNextCommand(state, memory, level, 12345);
    memory = nextMemory;
    if (decision.kind === 'done') { reason = decision.reason; break; }
    const input = decision.kind === 'enter' ? '' : decision.text;
    const result = executeCommand(input, state);
    state = { ...state, ...result.stateChanges } as GameState;
  }
  return { state, turns: memory.turnsTaken, reason };
}

/**
 * Boots the run through the real `bot-test` command, so the seed argument is
 * applied exactly as it is in play, then records what the run actually did.
 */
function runSeeded(level: BotLevel, seedArg: string, sessionSeed: number) {
  let state: GameState = {
    ...DEFAULT_GAME_STATE,
    tutorialComplete: true,
    seed: sessionSeed,
    rngState: sessionSeed,
    filesRead: new Set<string>(),
    savedFiles: new Set<string>(),
  } as GameState;

  const boot = executeCommand(`bot-test ${level} ${seedArg}`, state);
  state = { ...state, ...boot.stateChanges } as GameState;

  let memory = createBotMemory();
  const commands: string[] = [];
  for (let i = 0; i < 600; i++) {
    const { decision, memory: next } = decideNextCommand(state, memory, level, state.botTest!.seed);
    memory = next;
    if (decision.kind === 'done') break;
    const input = decision.kind === 'enter' ? '' : decision.text;
    commands.push(input);
    const result = executeCommand(input, state);
    state = { ...state, ...result.stateChanges } as GameState;
  }
  return {
    trace: commands.join('\n'),
    leak: (state.leakSequence || []).join('-'),
    seed: state.seed,
  };
}

/** As `runSeeded`, but returns the finished state for outcome assertions. */
function runSeededFull(level: BotLevel, seedArg: string): { state: GameState } {
  let state: GameState = {
    ...DEFAULT_GAME_STATE,
    tutorialComplete: true,
    seed: 1,
    rngState: 1,
    filesRead: new Set<string>(),
    savedFiles: new Set<string>(),
  } as GameState;

  const boot = executeCommand(`bot-test ${level} ${seedArg}`, state);
  state = { ...state, ...boot.stateChanges } as GameState;

  let memory = createBotMemory();
  for (let i = 0; i < 600; i++) {
    const { decision, memory: next } = decideNextCommand(state, memory, level, state.botTest!.seed);
    memory = next;
    if (decision.kind === 'done') break;
    const input = decision.kind === 'enter' ? '' : decision.text;
    const result = executeCommand(input, state);
    state = { ...state, ...result.stateChanges } as GameState;
  }
  return { state };
}

/** Every command a seeded run issued, in order. */
function runSeededTrace(level: BotLevel, seedArg: string): string[] {
  let state: GameState = {
    ...DEFAULT_GAME_STATE,
    tutorialComplete: true,
    seed: 1,
    rngState: 1,
    filesRead: new Set<string>(),
    savedFiles: new Set<string>(),
  } as GameState;

  const boot = executeCommand(`bot-test ${level} ${seedArg}`, state);
  state = { ...state, ...boot.stateChanges } as GameState;

  let memory = createBotMemory();
  const commands: string[] = [];
  for (let i = 0; i < 600; i++) {
    const { decision, memory: next } = decideNextCommand(state, memory, level, state.botTest!.seed);
    memory = next;
    if (decision.kind === 'done') break;
    const input = decision.kind === 'enter' ? '' : decision.text;
    commands.push(input);
    const result = executeCommand(input, state);
    state = { ...state, ...result.stateChanges } as GameState;
  }
  return commands;
}

describe('strategy full-run integration', () => {
  it('novice unlocks admin, fills the dossier, and wins', () => {
    const { state, reason } = runBot('novice');
    expect(state.flags?.adminUnlocked).toBe(true);
    expect(state.gameWon || reason === 'ending reached').toBe(true);
    expect(state.savedFiles.size).toBeGreaterThanOrEqual(10);
    expect(state.detectionLevel).toBeLessThan(100);
  });

  it('pro unlocks admin, saves the secret-critical files, and wins the secret ending', () => {
    const { state } = runBot('pro');
    expect(state.flags?.adminUnlocked).toBe(true);
    const names = [...state.savedFiles].map(f => f.split('/').pop());
    expect(names.some(f => f?.includes('ghost_in_machine'))).toBe(true);
    expect(state.gameWon).toBe(true);
    expect(determineEnding(state.savedFiles)).toBe('secret_ending');
    expect(state.detectionLevel).toBeLessThan(100);
  });

  it('dummy terminates without hanging', () => {
    const { reason, turns } = runBot('dummy');
    expect(turns).toBeLessThan(600);
    expect(reason).not.toBe('unterminated');
  });

  it('chaos exercises the command surface and still wins', () => {
    const { state, reason } = runBot('chaos');
    expect(state.gameWon || reason === 'ending reached').toBe(true);
    expect(state.savedFiles.size).toBeGreaterThanOrEqual(10);
    expect(state.detectionLevel).toBeLessThan(100);
  });
});

/**
 * The bot used to be seed-invariant in the one thing that decides the ending:
 * file order came from the filesystem walk, so every seed built the same
 * dossier and `novice` produced `the_2026_warning` on every seed of a sweep.
 * `determineEnding` reads the dossier, so eleven of the twelve endings — and
 * every content path behind them — were never exercised by any bot run.
 */
describe('seeds actually vary what the bot investigates', () => {
  const SPREAD = ['1', '3', '42', '99', '1996', '4242', '31337', '888', '161803', '8675309'];

  it('novice reaches more than one ending across a spread of seeds', () => {
    const endings = new Set(
      SPREAD.map(seed => determineEnding(runSeededFull('novice', seed).state.savedFiles))
    );
    expect(endings.size).toBeGreaterThan(1);
  });

  it('novice builds different dossiers on different seeds', () => {
    const dossiers = new Set(
      SPREAD.map(seed => [...runSeededFull('novice', seed).state.savedFiles].sort().join('|'))
    );
    expect(dossiers.size).toBeGreaterThan(1);
  });

  it('pro still lands the secret ending on every seed despite the variation', () => {
    // `pro` keeps its priority tiers, so the four secret-critical files claim
    // dossier slots first no matter how the interchangeable remainder shuffles.
    for (const seed of SPREAD) {
      const { state } = runSeededFull('pro', seed);
      expect(state.gameWon, `pro failed to win on seed ${seed}`).toBe(true);
      expect(determineEnding(state.savedFiles), `pro missed the secret ending on seed ${seed}`).toBe(
        'secret_ending'
      );
    }
  });

  it('is still reproducible: the same seed replays the same dossier', () => {
    const a = [...runSeededFull('novice', '4242').state.savedFiles].sort().join('|');
    const b = [...runSeededFull('novice', '4242').state.savedFiles].sort().join('|');
    expect(b).toBe(a);
  });
});

describe('chaos level probes the command surface', () => {
  it('issues every probe exactly once', () => {
    const commands = runSeededTrace('chaos', '4242');
    for (const probe of BOT_PROBE_COMMANDS) {
      expect(commands.filter(c => c === probe), `probe ${JSON.stringify(probe)}`).toHaveLength(1);
    }
  });

  it('never probes with a command that restarts the session', () => {
    // `tutorial` with no argument sets tutorialComplete:false and clears
    // history, handing the session back to the interactive tutorial. A probe
    // that does that stops measuring the game and starts rewriting the run.
    expect(BOT_PROBE_COMMANDS).not.toContain('tutorial');
  });

  it('marks probe turns so they are exempt from the "changed nothing" rule', () => {
    const state = {
      ...DEFAULT_GAME_STATE,
      seed: 1,
      rngState: 1,
      sessionStartTime: 0,
      tutorialComplete: true,
      filesRead: new Set<string>(['/internal/override_protocol_memo.txt']),
      savedFiles: new Set<string>(),
      flags: { ...(DEFAULT_GAME_STATE.flags || {}), adminUnlocked: true },
    } as GameState;

    const { decision } = decideNextCommand(state, createBotMemory(), 'chaos', 1);
    expect(decision.kind).toBe('command');
    if (decision.kind === 'command') {
      expect(decision.probe).toBe(true);
    }
  });

  it('does not mark ordinary progress turns as probes', () => {
    const state = {
      ...DEFAULT_GAME_STATE,
      seed: 1,
      rngState: 1,
      sessionStartTime: 0,
      tutorialComplete: true,
      filesRead: new Set<string>(),
      savedFiles: new Set<string>(),
    } as GameState;

    const { decision } = decideNextCommand(state, createBotMemory(), 'novice', 1);
    expect(decision.kind).toBe('command');
    if (decision.kind === 'command') {
      expect(decision.probe).toBeFalsy();
    }
  });
});

describe('seeded runs are reproducible', () => {
  it('replays identically from a different session when given the same seed', () => {
    const a = runSeeded('pro', '4242', 111);
    const b = runSeeded('pro', '4242', 999);

    expect(a.seed).toBe(4242);
    expect(b.seed).toBe(4242);
    expect(b.trace).toBe(a.trace);
    expect(b.leak).toBe(a.leak);
  });

  it('actually diverges on different seeds, so the seed is not decorative', () => {
    const leaks = ['1', '2', '7', '4242', '31337'].map(s => runSeeded('novice', s, 111).leak);
    expect(new Set(leaks).size).toBeGreaterThan(1);
  });

  // Seeds only started changing anything once `bot-test` applied them to the
  // game, so "it wins on seed 12345" stopped being evidence that it wins at all.
  it('still wins on every level across a spread of seeds', () => {
    for (const seed of ['1', '7', '42', '1996', '4242', '31337', '20260127']) {
      for (const level of ['novice', 'pro'] as BotLevel[]) {
        const { state } = runSeededFull(level, seed);
        expect(state.gameWon, `${level} failed to win on seed ${seed}`).toBe(true);
        expect(state.detectionLevel).toBeLessThan(100);
        if (level === 'pro') {
          expect(determineEnding(state.savedFiles), `pro missed the secret ending on seed ${seed}`).toBe(
            'secret_ending'
          );
        }
      }
    }
  });
});
