import { describe, it, expect } from 'vitest';
import { executeCommand } from '../../commands';
import { decideNextCommand } from '../strategy';
import { createBotMemory } from '../types';
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
});
