import { describe, it, expect } from 'vitest';
import { buildRunSummary } from '../report';
import { BotRunConfig, BotRunLogEntry } from '../types';
import { buildEndingDossier } from '../endingTargets';
import { BOT_SCENARIOS } from '../scenarios';
import { executeCommand } from '../../commands';
import { getAllAccessibleFiles } from '../../filesystem';
import { OVERRIDE_PASSWORD } from '../../overrideSecret';
import { DEFAULT_GAME_STATE, GameState } from '../../../types';

const cfg = { active: false, level: 'pro' as const, seed: 7, maxTurns: 400, delayMs: 900 };

/** Files an elevated session can reach, so dossiers here match real plans. */
const ELEVATED_FILES = (() => {
  let state = {
    ...DEFAULT_GAME_STATE,
    tutorialComplete: true,
    seed: 1,
    rngState: 1,
    sessionStartTime: 0,
    filesRead: new Set<string>(['/internal/override_protocol_memo.txt']),
    savedFiles: new Set<string>(),
  } as GameState;
  const result = executeCommand(`override protocol ${OVERRIDE_PASSWORD}`, state);
  state = { ...state, ...result.stateChanges } as GameState;
  return getAllAccessibleFiles(state);
})();

describe('buildRunSummary', () => {
  it('summarizes turns, saves, outcome, and lists anomalies', () => {
    const log: BotRunLogEntry[] = [
      { turn: 1, command: 'open /a.txt', detectionBefore: 0, detectionAfter: 1, filesReadBefore: 0, savedBefore: 0, filesReadAfter: 1, savedAfter: 0 },
      { turn: 2, command: 'save a.txt', detectionBefore: 1, detectionAfter: 1, filesReadBefore: 1, savedBefore: 0, filesReadAfter: 1, savedAfter: 1, anomaly: 'command returned error' },
    ];
    const finalState: GameState = { ...DEFAULT_GAME_STATE, savedFiles: new Set(['/a.txt']), gameWon: true } as GameState;
    const entries = buildRunSummary(log, cfg, finalState);
    const text = entries.map(e => e.content).join('\n');
    expect(text).toContain('BOT-TEST RUN SUMMARY');
    expect(text).toContain('pro');
    expect(text).toContain('Turns: 2');
    expect(text).toContain('ANOMALIES (1)');
    expect(text).toContain('command returned error');
  });

  it('keeps overlong commands readable in the anomaly list', () => {
    const command = 'x'.repeat(257);
    const log: BotRunLogEntry[] = [
      {
        turn: 8,
        command,
        detectionBefore: 12,
        detectionAfter: 14,
        filesReadBefore: 0,
        savedBefore: 0,
        filesReadAfter: 0,
        savedAfter: 0,
        anomaly: 'game over — INVALID INPUT THRESHOLD',
      },
    ];

    const text = buildRunSummary(log, cfg, DEFAULT_GAME_STATE as GameState)
      .map(e => e.content)
      .join('\n');
    expect(text).toContain('(257 chars)');
    expect(text).not.toContain(command);
  });
});

/**
 * A goal run that finishes is not necessarily a goal run that succeeded: the
 * whole reason to aim at `ridiculed` is to catch the day it starts producing
 * `incomplete_picture` instead, and "WON — ending: incomplete_picture" reads
 * like a success unless something says otherwise.
 */
describe('buildRunSummary goal verdicts', () => {
  const won = (files: string[]): GameState =>
    ({ ...DEFAULT_GAME_STATE, savedFiles: new Set(files), gameWon: true }) as GameState;

  const goalCfg = (goal: BotRunConfig['goal']): BotRunConfig => ({ ...cfg, goal });

  it('says nothing about goals on a plain level run', () => {
    const text = buildRunSummary([], cfg, won(['/a.txt']))
      .map(e => e.content)
      .join('\n');
    expect(text).toContain('Goal: default');
    expect(text).not.toContain('PASS');
    expect(text).not.toContain('FAIL');
  });

  it('passes an ending run that landed on its ending', () => {
    const dossier = buildEndingDossier('ridiculed', ELEVATED_FILES).paths;
    const text = buildRunSummary([], goalCfg({ kind: 'ending', ending: 'ridiculed' }), won(dossier))
      .map(e => e.content)
      .join('\n');
    expect(text).toContain('PASS — reached ending ridiculed');
  });

  it('fails an ending run that won a different ending', () => {
    const dossier = buildEndingDossier('ridiculed', ELEVATED_FILES).paths;
    const text = buildRunSummary(
      [],
      goalCfg({ kind: 'ending', ending: 'real_ending' }),
      won(dossier)
    )
      .map(e => e.content)
      .join('\n');
    expect(text).toContain('FAIL — expected ending real_ending, got ridiculed');
  });

  it('judges a scenario against the game over it declared', () => {
    const spec = BOT_SCENARIOS['tree-firewall'];
    const reason = spec.expect.kind === 'gameOver' ? spec.expect.reason : '';
    const ended = (r?: string): GameState =>
      ({
        ...DEFAULT_GAME_STATE,
        savedFiles: new Set<string>(),
        isGameOver: true,
        gameOverReason: r,
      }) as GameState;
    const goal = goalCfg({ kind: 'scenario', scenario: 'tree-firewall' });

    expect(buildRunSummary([], goal, ended(reason)).map(e => e.content).join('\n')).toContain(
      `PASS — game over "${reason}"`
    );
    expect(buildRunSummary([], goal, ended('LOCKDOWN')).map(e => e.content).join('\n')).toContain(
      'FAIL — expected game over'
    );
  });

  it('fails a survivable scenario that ended the run', () => {
    const goal = goalCfg({ kind: 'scenario', scenario: 'honeypot-traps' });
    const dead = {
      ...DEFAULT_GAME_STATE,
      savedFiles: new Set<string>(),
      isGameOver: true,
      gameOverReason: 'LOCKDOWN',
    } as GameState;
    expect(buildRunSummary([], goal, dead).map(e => e.content).join('\n')).toContain(
      'FAIL — scenario should survive'
    );
  });
});
