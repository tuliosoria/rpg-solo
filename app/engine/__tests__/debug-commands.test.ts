import { describe, it, expect, vi, afterEach } from 'vitest';
import { DEFAULT_GAME_STATE, GameState } from '../../types';

const base = (o: Partial<GameState> = {}): GameState =>
  ({ ...DEFAULT_GAME_STATE, tutorialComplete: true, ...o }) as GameState;

afterEach(() => { vi.unstubAllEnvs(); vi.resetModules(); });

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
    const res = debugCommands['bot-stop']([], base({ botTest: { active: true, level: 'pro', seed: 1, maxTurns: 400, delayMs: 900 } }));
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
