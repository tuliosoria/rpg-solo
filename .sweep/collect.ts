/**
 * Phase 1 of the sweep: drive the engine purely and collect every TerminalEntry
 * the player could see, tagged with the scenario that produced it.
 */
import { executeCommand } from '../app/engine/commands';
import { decideNextCommand } from '../app/engine/bot/strategy';
import { createBotMemory, BotLevel } from '../app/engine/bot/types';
import { DEFAULT_GAME_STATE, GameState, TerminalEntry } from '../app/types';
import { getAllAccessibleFiles } from '../app/engine/filesystem';
import { PUBLIC_COMMANDS } from '../app/engine/commands/utils';
import { OVERRIDE_PASSWORD } from '../app/engine/overrideSecret';

export interface Collected {
  scenario: string;
  entry: TerminalEntry;
}

export function freshState(over: Partial<GameState> = {}): GameState {
  return {
    ...DEFAULT_GAME_STATE,
    tutorialComplete: true,
    seed: 12345,
    filesRead: new Set<string>(),
    savedFiles: new Set<string>(),
    ...over,
  } as unknown as GameState;
}

function push(out: Collected[], scenario: string, entries: TerminalEntry[] | undefined) {
  for (const e of entries ?? []) {
    if (e.type === 'input') continue;
    out.push({ scenario, entry: e });
  }
}

/** Run one command against a state, collect output, return the next state. */
export function step(
  out: Collected[],
  scenario: string,
  state: GameState,
  input: string
): GameState {
  const result = executeCommand(input, state);
  push(out, scenario, result.output);
  return { ...state, ...result.stateChanges } as GameState;
}

/** A full bot run at the given level; collects everything it sees. */
export function collectBotRun(out: Collected[], level: BotLevel): GameState {
  let state = freshState();
  let memory = createBotMemory();
  for (let i = 0; i < 900; i++) {
    const { decision, memory: next } = decideNextCommand(state, memory, level, 12345);
    memory = next;
    if (decision.kind === 'done') break;
    const input = decision.kind === 'enter' ? '' : decision.text;
    state = step(out, `bot:${level}`, state, input);
  }
  return state;
}

/**
 * Every accessible file, each opened from its OWN fresh detection-0 state.
 *
 * Opening them all in one session drives detection into the hostile tiers where
 * the terminal truncates and mangles its own output — a documented trap that
 * once produced a 54-line phantom "translation gap".
 */
export function collectEveryDocument(out: Collected[]): string[] {
  const preAdmin = getAllAccessibleFiles(freshState());
  const adminFlags = { ...(DEFAULT_GAME_STATE.flags ?? {}), adminUnlocked: true };
  const all = Array.from(
    new Set([...preAdmin, ...getAllAccessibleFiles(freshState({ flags: adminFlags }))])
  );

  for (const path of all) {
    step(out, `doc:${path}`, freshState({ flags: adminFlags }), `open ${path}`);
  }
  return all;
}

/** Every advertised command, in a few states, plus common error shapes. */
export function collectCommandSurface(out: Collected[]) {
  const base = () => freshState({ flags: { ...(DEFAULT_GAME_STATE.flags ?? {}), adminUnlocked: true } });

  for (const cmd of PUBLIC_COMMANDS) {
    // bare
    step(out, `cmd:${cmd}`, base(), cmd);
    // with a nonsense argument — exercises the "unknown target" copy
    step(out, `cmd:${cmd} <bad-arg>`, base(), `${cmd} zzzznotathing`);
  }

  // Unknown command / typo suggestion paths.
  step(out, 'cmd:unknown', base(), 'zzzznotacommand');
  step(out, 'cmd:typo', base(), 'hlep');
  step(out, 'cmd:typo2', base(), 'opne');
  step(out, 'cmd:empty', base(), '');

  // Save/unsave lifecycle.
  let s = base();
  const files = getAllAccessibleFiles(s).filter(p => p.endsWith('.txt'));
  if (files[0]) {
    s = step(out, 'lifecycle:save', s, `open ${files[0]}`);
    s = step(out, 'lifecycle:save', s, `save ${files[0].split('/').pop()}`);
    s = step(out, 'lifecycle:save', s, `save ${files[0].split('/').pop()}`); // double save
    s = step(out, 'lifecycle:save', s, `unsave ${files[0].split('/').pop()}`);
    s = step(out, 'lifecycle:save', s, `unsave ${files[0].split('/').pop()}`); // double unsave
    s = step(out, 'lifecycle:save', s, 'progress');
    s = step(out, 'lifecycle:save', s, 'unread');
    s = step(out, 'lifecycle:save', s, 'notes');
    s = step(out, 'lifecycle:save', s, 'last');
  }

  // Navigation.
  let n = base();
  n = step(out, 'nav', n, 'ls');
  n = step(out, 'nav', n, 'cd /admin');
  n = step(out, 'nav', n, 'ls');
  n = step(out, 'nav', n, 'cd ..');
  n = step(out, 'nav', n, 'back');
  n = step(out, 'nav', n, 'cd /nowhere');
  n = step(out, 'nav', n, 'tree');
  n = step(out, 'nav', n, 'map');

  // Search.
  let q = base();
  q = step(out, 'search', q, 'search varginha');
  q = step(out, 'search', q, 'search zzzznotfound');
  q = step(out, 'search', q, 'search');

  // Override / auth failures.
  let a = freshState();
  a = step(out, 'override', a, 'override protocol WRONGPASS');
  a = step(out, 'override', a, 'override');
  a = step(out, 'override', a, `override protocol ${OVERRIDE_PASSWORD}`);
  a = step(out, 'override', a, `override protocol ${OVERRIDE_PASSWORD}`); // repeat

  // Chat / hint / wait.
  let c = base();
  c = step(out, 'chat', c, 'chat');
  c = step(out, 'chat', c, 'chat hello');
  c = step(out, 'chat', c, 'hint');
  c = step(out, 'chat', c, 'hint');
  c = step(out, 'chat', c, 'wait');
  c = step(out, 'chat', c, 'wait');

  // Leak with an empty dossier, and mid-sequence misuse.
  let l = base();
  l = step(out, 'leak:empty', l, 'leak');
  l = step(out, 'leak:empty', l, 'leak 999');

  // High detection tiers — terminal personality changes.
  for (const det of [45, 55, 75, 92]) {
    const h = base();
    h.detectionLevel = det;
    step(out, `detection:${det}`, h, 'status');
    step(out, `detection:${det}`, h, 'ls');
    step(out, `detection:${det}`, h, 'hint');
  }

  // Wrong-attempt escalation to lockdown.
  let w = base();
  for (let i = 0; i < 9; i++) {
    w = step(out, 'lockdown', w, `zzzbogus${i}`);
  }
}
