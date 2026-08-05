import { describe, it, expect } from 'vitest';
import { decideNextCommand } from '../strategy';
import { createBotMemory } from '../types';
import { DEFAULT_GAME_STATE, GameState } from '../../../types';
import { getAllAccessibleFiles } from '../../filesystem';
import { isEvidencePath } from '../../evidenceRevelation';
import { OVERRIDE_PASSWORD } from '../../overrideSecret';

const PASSWORD_HINT_FILE = '/internal/override_protocol_memo.txt';

const base = (overrides: Partial<GameState> = {}): GameState =>
  ({
    ...DEFAULT_GAME_STATE,
    tutorialComplete: true,
    seed: 42,
    filesRead: new Set<string>(),
    savedFiles: new Set<string>(),
    ...overrides,
  }) as GameState;

describe('decideNextCommand — explore/read/save', () => {
  it('discovers the password by reading the override hint before overriding', () => {
    const { decision } = decideNextCommand(base(), createBotMemory(), 'novice', 42);
    expect(decision.kind).toBe('command');
    if (decision.kind === 'command') {
      expect(decision.text).toBe(`open ${PASSWORD_HINT_FILE}`);
    }
  });

  it('overrides only after the hint file has been read', () => {
    const s = base({ filesRead: new Set<string>([PASSWORD_HINT_FILE]) });
    const { decision } = decideNextCommand(s, createBotMemory(), 'novice', 42);
    expect(decision.kind).toBe('command');
    if (decision.kind === 'command') {
      expect(decision.text).toBe(`override protocol ${OVERRIDE_PASSWORD}`);
    }
  });

  it('opens an unread wanted file once admin is unlocked', () => {
    const s = base({ flags: { ...DEFAULT_GAME_STATE.flags, adminUnlocked: true }, accessLevel: 5 });
    const mem = { ...createBotMemory(), overrideAttempted: true };
    const { decision } = decideNextCommand(s, mem, 'novice', 42);
    expect(decision.kind).toBe('command');
    if (decision.kind === 'command') {
      expect(decision.text.startsWith('open ')).toBe(true);
    }
  });

  it('drives the leak sequence once the save target is met, instead of opening more files', () => {
    const s0 = base({
      flags: { ...DEFAULT_GAME_STATE.flags, adminUnlocked: true },
      accessLevel: 5,
    });
    const evidence = getAllAccessibleFiles(s0).filter(isEvidencePath);
    // Precondition: there must be MORE than 10 evidence files, so unread wanted
    // files remain after the dossier is full — the exact situation that used to
    // make the bot keep opening files instead of leaking.
    expect(evidence.length).toBeGreaterThan(10);
    const first10 = evidence.slice(0, 10);
    const s = base({
      flags: { ...DEFAULT_GAME_STATE.flags, adminUnlocked: true },
      accessLevel: 5,
      filesRead: new Set<string>(first10),
      savedFiles: new Set<string>(first10),
    });
    const mem = { ...createBotMemory(), overrideAttempted: true };
    const { decision } = decideNextCommand(s, mem, 'novice', 42);
    expect(decision.kind).toBe('command');
    if (decision.kind === 'command') {
      expect(decision.text.startsWith('leak')).toBe(true);
      expect(decision.text.startsWith('open')).toBe(false);
    }
  });

  it('saves a read wanted file it has not saved yet', () => {
    // dummy never unlocks admin, so no override step interferes.
    const s0 = base();
    const all: string[] = getAllAccessibleFiles(s0);
    const state = base({ filesRead: new Set(all) });
    const { decision } = decideNextCommand(state, createBotMemory(), 'dummy', 42);
    expect(decision.kind).toBe('command');
    if (decision.kind === 'command') {
      expect(decision.text.startsWith('save ')).toBe(true);
    }
  });

  it('dummy never issues an override command', () => {
    let memory = createBotMemory();
    const s = base();
    for (let i = 0; i < 5; i++) {
      const { decision, memory: nm } = decideNextCommand(s, memory, 'dummy', 42);
      memory = nm;
      if (decision.kind === 'command') {
        expect(decision.text.startsWith('override')).toBe(false);
      }
    }
  });
});

describe('decideNextCommand — goals', () => {
  const elevated = (overrides: Partial<GameState> = {}) =>
    base({
      flags: { ...DEFAULT_GAME_STATE.flags, adminUnlocked: true },
      accessLevel: 5,
      ...overrides,
    });

  const endingGoal = { kind: 'ending' as const, ending: 'ridiculed' as const };

  it('leaves the default strategy untouched when no goal is passed', () => {
    // The parameter is optional so every existing caller — and every existing
    // test — keeps the level-driven behaviour it had.
    const s = base();
    const withoutGoal = decideNextCommand(s, createBotMemory(), 'novice', 42).decision;
    const withDefault = decideNextCommand(s, createBotMemory(), 'novice', 42, {
      kind: 'default',
    }).decision;
    expect(withDefault).toEqual(withoutGoal);
  });

  it('an ending run elevates before it starts collecting', () => {
    const first = decideNextCommand(base(), createBotMemory(), 'novice', 42, endingGoal).decision;
    expect(first.kind).toBe('command');
    if (first.kind === 'command') expect(first.text).toBe(`open ${PASSWORD_HINT_FILE}`);
  });

  /**
   * The recovery path. An `open` that produces nothing would otherwise be asked
   * for again every turn until the run hit the turn cap, so the file is recorded
   * once and the next plan routes around it.
   */
  it('records a file that refused to open and asks for something else', () => {
    const s = elevated();
    const start = { ...createBotMemory(), overrideAttempted: true };

    const first = decideNextCommand(s, start, 'novice', 42, endingGoal);
    expect(first.decision.kind).toBe('command');
    const asked = first.decision.kind === 'command' ? first.decision.text : '';
    expect(asked.startsWith('open ')).toBe(true);

    // Same state on the next turn: the file never arrived in filesRead.
    const second = decideNextCommand(s, first.memory, 'novice', 42, endingGoal);
    expect(second.memory.unavailablePaths).toEqual([asked.slice(5)]);
    expect(second.decision.kind).toBe('command');
    if (second.decision.kind === 'command') {
      expect(second.decision.text).not.toBe(asked);
      expect(second.decision.text.startsWith('open ')).toBe(true);
    }
  });

  it('clears a saved file the target ending does not want', () => {
    const stray = '/public/bulletin/cafeteria_menu.txt';
    const s = elevated({
      filesRead: new Set<string>([stray]),
      savedFiles: new Set<string>([stray]),
    });
    const mem = { ...createBotMemory(), overrideAttempted: true };
    const { decision } = decideNextCommand(s, mem, 'novice', 42, {
      kind: 'ending',
      ending: 'secret_ending',
    });
    expect(decision.kind).toBe('command');
    if (decision.kind === 'command') expect(decision.text).toBe('unsave cafeteria_menu.txt');
  });

  it('runs a scenario script and stops when it is done', () => {
    const goal = { kind: 'scenario' as const, scenario: 'invalid-threshold' as const };
    let memory = createBotMemory();
    const s = base();
    const issued: string[] = [];
    for (let i = 0; i < 12; i++) {
      const { decision, memory: nm } = decideNextCommand(s, memory, 'novice', 42, goal);
      memory = nm;
      if (decision.kind === 'done') break;
      if (decision.kind === 'command') issued.push(decision.text);
    }
    // Each turn must be a *different* string: repeating one would be caught by
    // the parser's suggestion path rather than counting as a fresh strike.
    expect(issued.length).toBeGreaterThan(1);
    expect(new Set(issued).size).toBe(issued.length);
    expect(memory.scenarioStep).toBe(issued.length);
  });

  /**
   * A scenario that reads nothing and saves nothing moves none of the counters
   * the default stuck-detector watches, so it would be stopped as "stuck" three
   * turns before the game over it exists to reach.
   */
  it('does not call a scenario stuck while its counters are still moving', () => {
    const goal = { kind: 'scenario' as const, scenario: 'invalid-threshold' as const };
    let memory = createBotMemory();
    let state = base();
    for (let i = 0; i < 7; i++) {
      const { decision, memory: nm } = decideNextCommand(state, memory, 'novice', 42, goal);
      memory = nm;
      expect(decision.kind, `stopped on turn ${i + 1}`).toBe('command');
      // Stand in for the engine: an invalid command bumps the strike counter.
      state = { ...state, legacyAlertCounter: state.legacyAlertCounter + 1 } as GameState;
    }
  });
});
