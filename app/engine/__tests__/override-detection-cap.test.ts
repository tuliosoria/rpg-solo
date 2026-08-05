/**
 * Regressions for the `override` success path.
 *
 * `override protocol COLHEITA` is the correct answer to a puzzle, so it is the
 * worst possible place to strand a player. Two ways it used to do exactly that:
 *
 *  1. The success path added a flat +15 detection with no clamp, so a player who
 *     solved the puzzle at 86%+ ended the command above 100 — alive, but killed
 *     by whatever they typed next.
 *  2. The "terrible mistake" branch announced "SYSTEM WILL TERMINATE IN 8
 *     OPERATIONS" while pinning detection to the cap, so the promised eight
 *     operations were actually zero.
 *
 * Both were invisible: `override` returned before the shared post-command
 * pipeline, skipping the detection clamp and the 90%-threshold escape warning
 * that tells the player to `hide`.
 */
import { describe, it, expect } from 'vitest';
import { executeCommand } from '../commands';
import { MAX_DETECTION } from '../../constants/detection';
import { DEFAULT_GAME_STATE, type GameState } from '../../types';

function overrideReadyState(overrides: Partial<GameState> = {}): GameState {
  // DEFAULT_GAME_STATE's Set fields are shared by reference; executeCommand
  // writes to them, so each case needs its own copies or results bleed between
  // iterations and the suite stops being deterministic.
  const base = DEFAULT_GAME_STATE as unknown as Record<string, unknown>;
  const fresh: Record<string, unknown> = { ...base };
  for (const [key, value] of Object.entries(base)) {
    if (value instanceof Set) fresh[key] = new Set(value);
  }

  return {
    ...(fresh as unknown as GameState),
    seed: 4242,
    rngState: 4242,
    tutorialComplete: true,
    evidenceCount: 3,
    flags: { ...DEFAULT_GAME_STATE.flags, overrideGateActive: true },
    ...overrides,
  };
}

/** Detection the player is actually left holding after the command resolves. */
function resultingDetection(result: { stateChanges: Partial<GameState> }, before: number): number {
  return result.stateChanges.detectionLevel ?? before;
}

describe('override never strands the player above the detection cap', () => {
  // Sweep the band where +15 would overshoot 100, across many RNG seeds so both
  // the terrible-mistake branch and the ordinary success path are exercised.
  const highDetections = [86, 88, 90, 93, 95, 99, 100];
  const seeds = [1, 7, 42, 99, 1234, 4242, 90210];

  it('keeps detection within bounds for every high-detection entry point', () => {
    const violations: string[] = [];

    for (const detectionLevel of highDetections) {
      for (const rngState of seeds) {
        const state = overrideReadyState({ detectionLevel, rngState, seed: rngState });
        const result = executeCommand('override protocol COLHEITA', state);
        const after = resultingDetection(result, detectionLevel);

        if (after > MAX_DETECTION || after < 0) {
          violations.push(`detection ${detectionLevel} / seed ${rngState} -> ${after}`);
        }
      }
    }

    expect(violations).toEqual([]);
  });

  it('never leaves the player alive at the detection cap', () => {
    // The specific broken state: detection pinned at MAX with the run still
    // "in progress", so the next command — any command — is an execution the
    // player was never warned about. Reaching the cap must end the run here.
    const stranded: string[] = [];

    for (const detectionLevel of highDetections) {
      for (const rngState of seeds) {
        const state = overrideReadyState({ detectionLevel, rngState, seed: rngState });
        const result = executeCommand('override protocol COLHEITA', state);
        const after = resultingDetection(result, detectionLevel);

        if (after >= MAX_DETECTION && !result.stateChanges.isGameOver) {
          stranded.push(
            `detection ${detectionLevel} / seed ${rngState} -> ${after}, run not ended`
          );
        }
      }
    }

    expect(stranded).toEqual([]);
  });

  it('gives the purge-countdown branch survivable headroom', () => {
    // When the terrible-mistake branch fires it starts an 8-operation countdown.
    // It must land below the cap, or the max-detection check ends the run first
    // and the promised eight operations are zero.
    const broken: string[] = [];

    for (const detectionLevel of highDetections) {
      for (const rngState of seeds) {
        const state = overrideReadyState({ detectionLevel, rngState, seed: rngState });
        const result = executeCommand('override protocol COLHEITA', state);

        if (!result.stateChanges.sessionDoomCountdown) continue;

        const after = resultingDetection(result, detectionLevel);
        if (after >= MAX_DETECTION) {
          broken.push(`detection ${detectionLevel} / seed ${rngState} -> ${after} with countdown`);
        }
      }
    }

    expect(broken).toEqual([]);
  });

  it('still grants admin access on a correct password', () => {
    const state = overrideReadyState({ detectionLevel: 20 });
    const result = executeCommand('override protocol COLHEITA', state);

    expect(result.stateChanges.flags?.adminUnlocked).toBe(true);
    expect(result.stateChanges.accessLevel).toBe(5);
  });
});
