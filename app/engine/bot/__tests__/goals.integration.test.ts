import { describe, it, expect } from 'vitest';
import { EndingId } from '../../endings';
import {
  ALL_ENDING_IDS,
} from '../endingTargets';
import { ALL_SCENARIO_IDS, BOT_SCENARIOS, BotScenarioId } from '../scenarios';
import { runBotSweep, runHeadless, sweepEnding, sweepScenario, SWEEP_LEVELS } from '../sweep';
import { determineEnding } from '../../endings';
import { executeCommand } from '../../commands';

const SEEDS = [1, 42, 4242, 31337];

/**
 * The point of the whole exercise: every ending and every scenario is reachable
 * on demand, not by accident.
 *
 * Before goals existed the only ending any bot aimed at was `secret_ending`, and
 * the seed-spread test asserted merely that a sweep produced *more than one*
 * ending — which it satisfied with two out of twelve. Nothing had ever driven a
 * game-over screen at all.
 */
describe('every ending is reachable on demand', () => {
  for (const ending of ALL_ENDING_IDS) {
    it(`reaches ${ending}`, () => {
      for (const seed of SEEDS) {
        const row = sweepEnding(executeCommand, ending, seed);
        expect(row.won, `${ending} did not win on seed ${seed} (${row.stopReason})`).toBe(true);
        expect(row.ending, `${ending} won the wrong ending on seed ${seed}`).toBe(ending);
        expect(row.detection, `${ending} was traced on seed ${seed}`).toBeLessThan(100);
        expect(row.pass).toBe(true);
      }
    });
  }

  it('covers all twelve endings in a single sweep', () => {
    const reached = new Set<EndingId>();
    for (const row of runBotSweep(executeCommand, { seed: 7, levels: false, scenarios: false })) {
      expect(row.pass, `${row.label}: ${row.actual} (expected ${row.expected})`).toBe(true);
      if (row.ending) reached.add(row.ending);
    }
    expect([...reached].sort()).toEqual([...ALL_ENDING_IDS].sort());
  });

  it('does not need the seed to be lucky: the same ending lands on every seed', () => {
    // Ending runs are planned rather than improvised, so unlike `novice` they
    // must not vary with the seed at all — that is the whole point of aiming.
    for (const ending of ALL_ENDING_IDS) {
      const outcomes = new Set(SEEDS.map(seed => sweepEnding(executeCommand, ending, seed).ending));
      expect(outcomes, `${ending} varied across seeds`).toEqual(new Set([ending]));
    }
  });
});

describe('every scenario reaches the path it was written for', () => {
  for (const scenario of ALL_SCENARIO_IDS) {
    it(`plays out ${scenario}`, () => {
      for (const seed of SEEDS) {
        const row = sweepScenario(executeCommand, scenario, seed);
        expect(row.pass, `${scenario} on seed ${seed}: ${row.actual} (expected ${row.expected})`).toBe(
          true
        );
        expect(row.stopReason).not.toBe('max turns reached');
        expect(row.stopReason).not.toBe('unterminated');
      }
    });
  }

  it('names a distinct game-over reason for each fatal scenario', () => {
    // Two scenarios claiming the same reason would mean one of them is not
    // actually exercising the branch it says it is.
    const reasons = ALL_SCENARIO_IDS.map(id => BOT_SCENARIOS[id].expect)
      .filter(e => e.kind === 'gameOver')
      .map(e => (e.kind === 'gameOver' ? e.reason : ''));
    expect(new Set(reasons).size).toBe(reasons.length);
  });

  it('shares no ids with the endings or the levels, so bare ids stay unambiguous', () => {
    const levels = new Set<string>(SWEEP_LEVELS);
    const endings = new Set<string>(ALL_ENDING_IDS);
    for (const id of ALL_SCENARIO_IDS as string[]) {
      expect(levels.has(id), `${id} collides with a level name`).toBe(false);
      expect(endings.has(id), `${id} collides with an ending id`).toBe(false);
    }
  });

  it('never spins: no scenario burns more than a hundred turns', () => {
    for (const scenario of ALL_SCENARIO_IDS) {
      expect(sweepScenario(executeCommand, scenario, 1).turns, `${scenario}`).toBeLessThan(100);
    }
  });
});

describe('scenario seed preconditions', () => {
  /**
   * `purge-protocol` sits behind a 35% roll taken against `rngState`, which
   * nothing but `override` ever moves — so the seed alone decides whether the
   * branch is reachable, and an unlucky seed would make the scenario a coin
   * flip whose FAIL means nothing.
   */
  it('picks a seed that can actually reach the purge branch', () => {
    const spec = BOT_SCENARIOS['purge-protocol'];
    expect(spec.seedFits).toBeDefined();
    for (const seed of SEEDS) {
      const row = sweepScenario(executeCommand, 'purge-protocol', seed);
      expect(spec.seedFits!(row.seed), `chose unusable seed ${row.seed}`).toBe(true);
      expect(row.gameOverReason).toBe('PURGE PROTOCOL - FORBIDDEN KNOWLEDGE');
    }
  });

  it('honours a seed that already works instead of moving off it', () => {
    const spec = BOT_SCENARIOS['purge-protocol'];
    const working = [...Array(200).keys()].find(s => spec.seedFits!(s))!;
    expect(sweepScenario(executeCommand, 'purge-protocol', working).seed).toBe(working);
  });
});

describe('the sweep itself', () => {
  it('is all-green on a fresh build', () => {
    const rows = runBotSweep(executeCommand, { seed: 1 });
    const failures = rows.filter(r => !r.pass);
    expect(
      failures.map(f => `${f.label}: ${f.actual} (expected ${f.expected})`),
      'unreachable targets'
    ).toEqual([]);
    expect(rows.length).toBe(
      SWEEP_LEVELS.length + ALL_ENDING_IDS.length + ALL_SCENARIO_IDS.length
    );
  });

  it('runs a full playthrough without touching the browser', () => {
    // The sweep exists because 3s a turn makes watching twenty-odd runs an
    // afternoon's work. If a single run stops being cheap, that stops being true.
    const started = Date.now();
    runHeadless(executeCommand, 'pro', 1, { kind: 'ending', ending: 'real_ending' });
    expect(Date.now() - started).toBeLessThan(2000);
  });

  it('reports a failure rather than throwing when an ending goes unreachable', () => {
    // Sanity check on the reporting path: a plan that cannot be satisfied has to
    // surface as a FAIL row with the real outcome on it.
    const run = runHeadless(executeCommand, 'pro', 1, { kind: 'ending', ending: 'secret_ending' }, 3);
    expect(run.state.gameWon).toBeFalsy();
    expect(determineEnding(run.state.savedFiles)).toBeTruthy();
  });
});

describe('goal ids are stable identifiers', () => {
  it('exposes every scenario through ALL_SCENARIO_IDS', () => {
    expect(new Set(ALL_SCENARIO_IDS).size).toBe(ALL_SCENARIO_IDS.length);
    expect(ALL_SCENARIO_IDS.length).toBe(Object.keys(BOT_SCENARIOS).length);
    for (const id of ALL_SCENARIO_IDS) {
      expect(BOT_SCENARIOS[id as BotScenarioId].id).toBe(id);
      expect(BOT_SCENARIOS[id as BotScenarioId].summary.length).toBeGreaterThan(10);
    }
  });
});
