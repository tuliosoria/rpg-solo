import { describe, it, expect, vi, afterEach } from 'vitest';
import { DEFAULT_GAME_STATE, GameState } from '../../types';

const base = (o: Partial<GameState> = {}): GameState =>
  ({ ...DEFAULT_GAME_STATE, tutorialComplete: true, ...o }) as GameState;

afterEach(() => {
  vi.unstubAllEnvs();
  vi.resetModules();
});

describe('bot-test / bot-stop (dev only)', () => {
  it('activates the bot with a level and seed in development', async () => {
    vi.stubEnv('NODE_ENV', 'development');
    const { debugCommands } = await import('../commands/debug');
    const res = debugCommands['bot-test'](['pro', '999'], base());
    expect(res.stateChanges.botTest?.active).toBe(true);
    expect(res.stateChanges.botTest?.level).toBe('pro');
    expect(res.stateChanges.botTest?.seed).toBe(999);
  });

  it('bot-stop clears the active run', async () => {
    vi.stubEnv('NODE_ENV', 'development');
    const { debugCommands } = await import('../commands/debug');
    const res = debugCommands['bot-stop'](
      [],
      base({ botTest: { active: true, level: 'pro', seed: 1, maxTurns: 400, delayMs: 900 } })
    );
    expect(res.stateChanges.botTest?.active).toBe(false);
  });

  it('defaults level to novice and derives seed from game seed', async () => {
    vi.stubEnv('NODE_ENV', 'development');
    const { debugCommands } = await import('../commands/debug');
    const res = debugCommands['bot-test']([], base({ seed: 77 }));
    expect(res.stateChanges.botTest?.level).toBe('novice');
    expect(res.stateChanges.botTest?.seed).toBe(77);
  });

  // The summary prints the seed so a reported run can be reproduced. That only
  // holds if the seed reaches the game: `state.seed` drives the leak sequence,
  // file content variation and honeypot rolls, so storing the argument on
  // `botTest` alone left it inert — every run used whatever seed the session
  // already had while the summary claimed otherwise.
  it('applies an explicit seed to the game RNG, not just the run config', async () => {
    vi.stubEnv('NODE_ENV', 'development');
    const { debugCommands } = await import('../commands/debug');
    const res = debugCommands['bot-test'](['pro', '4242'], base({ seed: 77, rngState: 77 }));
    expect(res.stateChanges.botTest?.seed).toBe(4242);
    expect(res.stateChanges.seed).toBe(4242);
    expect(res.stateChanges.rngState).toBe(4242);
  });

  it('leaves the session seed untouched when none is given', async () => {
    vi.stubEnv('NODE_ENV', 'development');
    const { debugCommands } = await import('../commands/debug');
    const res = debugCommands['bot-test'](['dummy'], base({ seed: 77, rngState: 31337 }));
    expect(res.stateChanges.botTest?.seed).toBe(77);
    expect(res.stateChanges.seed).toBeUndefined();
    expect(res.stateChanges.rngState).toBeUndefined();
  });
});

describe('bot-test goals', () => {
  // Note this file imports `debug.ts` before anything else in the command
  // graph, which is the load order that used to throw on the module cycle the
  // sweep introduced. The engine now arrives as a handler argument, exactly as
  // `executeCommand` supplies it in the app.
  const run = async (args: string[], state = base({ seed: 5, rngState: 5 })) => {
    vi.stubEnv('NODE_ENV', 'development');
    const { debugCommands } = await import('../commands/debug');
    const { executeCommand } = await import('../commands');
    return debugCommands['bot-test'](args, state, executeCommand);
  };

  it('accepts an ending target', async () => {
    const res = await run(['ending', 'ridiculed']);
    expect(res.stateChanges.botTest?.goal).toEqual({ kind: 'ending', ending: 'ridiculed' });
  });

  it('accepts a scenario target', async () => {
    const res = await run(['scenario', 'tree-firewall']);
    expect(res.stateChanges.botTest?.goal).toEqual({ kind: 'scenario', scenario: 'tree-firewall' });
  });

  // Ending and scenario ids collide with nothing else the parser accepts, so
  // making the keyword mandatory would only be ceremony.
  it('accepts a bare id without its keyword', async () => {
    expect((await run(['secret_ending'])).stateChanges.botTest?.goal).toEqual({
      kind: 'ending',
      ending: 'secret_ending',
    });
    expect((await run(['dossier-full'])).stateChanges.botTest?.goal).toEqual({
      kind: 'scenario',
      scenario: 'dossier-full',
    });
  });

  it('keeps the level and seed alongside a goal', async () => {
    const res = await run(['chaos', 'ending', 'wrong_story', '4242']);
    expect(res.stateChanges.botTest?.level).toBe('chaos');
    expect(res.stateChanges.botTest?.seed).toBe(4242);
    expect(res.stateChanges.seed).toBe(4242);
    expect(res.stateChanges.botTest?.goal).toEqual({ kind: 'ending', ending: 'wrong_story' });
  });

  it('leaves a plain level run goal-free', async () => {
    const res = await run(['pro']);
    expect(res.stateChanges.botTest?.goal).toEqual({ kind: 'default' });
  });

  // A typo that silently started a default run would look like the harness
  // ignoring the request, and the summary would say `goal: default` in the one
  // place nobody reads it.
  it('refuses an unknown target instead of quietly running the default', async () => {
    const res = await run(['ending', 'not_an_ending']);
    expect(res.stateChanges.botTest).toBeUndefined();
    expect(res.output.some(e => e.content.includes('unknown target'))).toBe(true);
  });

  it('lists every level, ending and scenario', async () => {
    const { ALL_ENDING_IDS } = await import('../bot/endingTargets');
    const { ALL_SCENARIO_IDS } = await import('../bot/scenarios');
    const res = await run(['list']);
    expect(res.stateChanges.botTest).toBeUndefined();
    const text = res.output.map(e => e.content).join('\n');
    for (const id of [...ALL_ENDING_IDS, ...ALL_SCENARIO_IDS]) expect(text).toContain(id);
    for (const level of ['dummy', 'novice', 'pro', 'chaos']) expect(text).toContain(level);
  });

  it('sweeps every target headlessly and reports them all reachable', async () => {
    const res = await run(['sweep', '1']);
    expect(res.stateChanges.botTest).toBeUndefined();
    const lines = res.output.map(e => e.content);
    const text = lines.join('\n');
    expect(text).toContain('BOT-TEST SWEEP');
    expect(text).toContain('Failed: 0');
    expect(text).toContain('Every ending and scenario is still reachable.');
    // Matched on the row marker rather than the substring: one of the expected
    // outcomes is literally "AUTHENTICATION FAILURE".
    expect(lines.filter(l => l.trimStart().startsWith('FAIL '))).toEqual([]);
    expect(lines.filter(l => l.trimStart().startsWith('PASS ')).length).toBeGreaterThan(20);
  });

  /**
   * `purge-protocol` hangs off a seeded dice roll, so the seed has to reach the
   * game even when the player named none — otherwise the run is a coin flip.
   */
  it('picks and applies a workable seed for a seed-gated scenario', async () => {
    const { BOT_SCENARIOS } = await import('../bot/scenarios');
    const res = await run(['scenario', 'purge-protocol'], base({ seed: 5, rngState: 5 }));
    const seed = res.stateChanges.botTest!.seed;
    expect(BOT_SCENARIOS['purge-protocol'].seedFits!(seed)).toBe(true);
    expect(res.stateChanges.seed).toBe(seed);
    expect(res.stateChanges.rngState).toBe(seed);
  });
});
