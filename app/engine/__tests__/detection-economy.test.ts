/**
 * Balance properties that must survive tuning.
 *
 * Detection numbers get adjusted — that is what balancing is. What must not
 * change is whether the game can be finished at all. Both failures below are
 * silent: no test breaks, no error appears, the game simply becomes impossible
 * in a way only a player who reaches that point discovers.
 *
 *  1. The objective must be completable. A player who reads and saves files can
 *     fill the dossier without detection ending the run first.
 *  2. Reading everything must remain survivable, or the `completionist`
 *     achievement — awarded at victory for having read every readable file —
 *     becomes permanently unobtainable.
 *
 * These assert *properties*, not the current tuning: that a path exists and has
 * some headroom, not that it costs exactly N. Pinning today's numbers would
 * just make the suite something to silence during the next balance pass.
 */
import { describe, it, expect, vi, afterEach } from 'vitest';
import { executeCommand } from '../commands';
import { listDirectory, getAllAccessibleFiles } from '../filesystem';
import { MAX_DETECTION } from '../../constants/detection';
import { MAX_EVIDENCE_COUNT } from '../evidenceRevelation';
import { FILE_CATEGORIES } from '../endings';
import { DEFAULT_GAME_STATE, type GameState } from '../../types';

function freshRun(seed: number): GameState {
  // DEFAULT_GAME_STATE's Set fields are shared by reference and executeCommand
  // writes through them, so each run needs its own copies.
  const base = DEFAULT_GAME_STATE as unknown as Record<string, unknown>;
  const copy: Record<string, unknown> = { ...base };
  for (const [key, value] of Object.entries(base)) {
    if (value instanceof Set) copy[key] = new Set(value);
  }

  return {
    ...(copy as unknown as GameState),
    seed,
    rngState: seed,
    tutorialComplete: true,
  } as GameState;
}

/** Every directory reachable from root in the player's current state. */
function reachableDirectories(state: GameState): string[] {
  const found: string[] = [];
  const seen = new Set<string>();

  const walk = (dir: string) => {
    if (seen.has(dir)) return;
    seen.add(dir);
    found.push(dir);

    for (const entry of listDirectory(dir, state) ?? []) {
      if (entry.type !== 'dir') continue;
      // Directory entries carry a trailing slash in `name`.
      const name = entry.name.replace(/\/+$/, '');
      walk(dir === '/' ? `/${name}` : `${dir}/${name}`);
    }
  };

  walk('/');
  return found;
}

interface Player {
  state: GameState;
  commands: number;
  peakDetection: number;
  run(command: string): void;
}

function startPlayer(seed: number): Player {
  const player: Player = {
    state: freshRun(seed),
    commands: 0,
    peakDetection: 0,
    run(command: string) {
      const result = executeCommand(command, player.state);
      player.state = { ...player.state, ...result.stateChanges } as GameState;
      player.commands += 1;
      player.peakDetection = Math.max(player.peakDetection, player.state.detectionLevel);
    },
  };
  return player;
}

const HONEYPOTS = new Set(FILE_CATEGORIES.honeypot_trap);

describe('detection economy', () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('lets a player fill the dossier without being caught', () => {
    const player = startPlayer(4242);

    for (const dir of reachableDirectories(player.state)) {
      if (player.state.isGameOver || player.state.savedFiles.size >= MAX_EVIDENCE_COUNT) break;
      player.run(`cd ${dir}`);

      for (const entry of (listDirectory(dir, player.state) ?? []).filter(e => e.type === 'file')) {
        if (player.state.isGameOver || player.state.savedFiles.size >= MAX_EVIDENCE_COUNT) break;
        // Bait is the player's mistake to make, not a cost the core loop imposes.
        if (HONEYPOTS.has(entry.name)) continue;

        player.run(`open ${entry.name}`);
        const path = dir === '/' ? `/${entry.name}` : `${dir}/${entry.name}`;
        if (player.state.filesRead.has(path)) player.run(`save ${entry.name}`);
      }
    }

    expect(player.state.isGameOver, 'run ended before the dossier was full').toBe(false);
    expect(player.state.savedFiles.size).toBe(MAX_EVIDENCE_COUNT);

    // Headroom, not a specific cost: finishing the objective must not consume
    // the whole detection budget, or there is nothing left for the leak
    // sequence and no room to explore at all.
    expect(player.state.detectionLevel).toBeLessThan(MAX_DETECTION / 2);
  });

  it('keeps reading every file survivable, so completionist stays obtainable', () => {
    // `wait` enforces a real-time cooldown between uses. A human spends seconds
    // per command so it rarely binds; a loop would hit it on every call and
    // report a difficulty the game does not actually have.
    let clock = 1_000_000;
    vi.spyOn(Date, 'now').mockImplementation(() => (clock += 8_000));

    const player = startPlayer(1996);

    const spendWaitBudget = () => {
      // The budget is small and finite, so it is only worth spending high,
      // where the reduction is largest.
      while (
        !player.state.isGameOver &&
        player.state.detectionLevel >= 75 &&
        (player.state.waitUsesRemaining ?? 0) > 0
      ) {
        const before = player.state.detectionLevel;
        player.run('wait');
        if (player.state.detectionLevel >= before) break;
      }
    };

    for (const dir of reachableDirectories(player.state)) {
      if (player.state.isGameOver) break;
      player.run(`cd ${dir}`);

      for (const entry of (listDirectory(dir, player.state) ?? []).filter(e => e.type === 'file')) {
        if (player.state.isGameOver) break;
        spendWaitBudget();
        if (player.state.isGameOver) break;
        player.run(`open ${entry.name}`);
      }
    }

    const readable = getAllAccessibleFiles(player.state).length;

    expect(player.state.isGameOver, 'caught before reading everything').toBe(false);
    // The achievement compares filesRead against every readable file, so
    // anything short of all of them leaves it unobtainable.
    expect(player.state.filesRead.size).toBeGreaterThanOrEqual(readable);
  });

  it('still makes reading everything cost something', () => {
    // The mirror of the test above. If a full sweep became free, the tension
    // the whole game runs on would be gone, and no test would notice.
    let clock = 1_000_000;
    vi.spyOn(Date, 'now').mockImplementation(() => (clock += 8_000));

    const player = startPlayer(1996);

    for (const dir of reachableDirectories(player.state)) {
      if (player.state.isGameOver) break;
      player.run(`cd ${dir}`);
      for (const entry of (listDirectory(dir, player.state) ?? []).filter(e => e.type === 'file')) {
        if (player.state.isGameOver) break;
        player.run(`open ${entry.name}`);
      }
    }

    // Reading the whole filesystem with no detection management must push the
    // player into real danger.
    expect(player.peakDetection).toBeGreaterThan(MAX_DETECTION / 2);
  });
});
