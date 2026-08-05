import { GameState, TerminalEntry } from '../../types';
import { createEntry } from '../commands/utils';
import { determineEnding } from '../endings';
import { BOT_SCENARIOS } from './scenarios';
import { BotRunConfig, BotRunLogEntry, describeGoal } from './types';

const SUMMARY_COMMAND_PREVIEW_LENGTH = 72;

function summarizeCommand(command: string): string {
  if (command.length <= SUMMARY_COMMAND_PREVIEW_LENGTH) return command;
  return `${command.slice(0, SUMMARY_COMMAND_PREVIEW_LENGTH)}... (${command.length} chars)`;
}

/**
 * Whether a finished run produced what its goal asked for, in words.
 *
 * A level run has no expectation beyond "it terminated", so it gets none. Goal
 * runs do: an ending run only passes if the dossier resolves to the ending it
 * was aiming at — winning with the wrong ending is the exact failure the goal
 * exists to catch — and a scenario run is judged against its declared outcome.
 */
function evaluateGoal(config: BotRunConfig, finalState: GameState): string | null {
  const goal = config.goal;
  if (!goal || goal.kind === 'default') return null;

  if (goal.kind === 'ending') {
    if (!finalState.gameWon) {
      return `FAIL — expected ending ${goal.ending}, run did not reach an ending`;
    }
    const actual = determineEnding(finalState.savedFiles);
    return actual === goal.ending
      ? `PASS — reached ending ${goal.ending}`
      : `FAIL — expected ending ${goal.ending}, got ${actual}`;
  }

  const expect = BOT_SCENARIOS[goal.scenario].expect;
  if (expect.kind === 'gameOver') {
    if (!finalState.isGameOver) return `FAIL — expected game over "${expect.reason}", run survived`;
    return finalState.gameOverReason === expect.reason
      ? `PASS — game over "${expect.reason}"`
      : `FAIL — expected game over "${expect.reason}", got "${finalState.gameOverReason || 'unknown'}"`;
  }
  if (finalState.isGameOver) {
    return `FAIL — scenario should survive, ended with "${finalState.gameOverReason || 'unknown'}"`;
  }
  return 'PASS — scenario survived as expected';
}

export function buildRunSummary(
  log: BotRunLogEntry[],
  config: BotRunConfig,
  finalState: GameState,
  stopReason?: string
): TerminalEntry[] {
  const anomalies = log.filter(e => e.anomaly);
  const outcome = finalState.gameWon
    ? `WON — ending: ${determineEnding(finalState.savedFiles)}`
    : finalState.isGameOver
      ? `GAME OVER — ${finalState.gameOverReason || 'unknown'}`
      : // "stopped" alone hid the useful half: a run that ends on "no progress
        // (stuck)" or "max turns reached" looks identical to one that finished
        // on purpose.
        `stopped — ${stopReason || 'unknown'}`;

  const lines: TerminalEntry[] = [
    createEntry('system', ''),
    createEntry('system', '═══════════════════════════════════════'),
    createEntry('system', '  BOT-TEST RUN SUMMARY'),
    createEntry('system', '═══════════════════════════════════════'),
    createEntry('system', `  Level: ${config.level}   Seed: ${config.seed}`),
    createEntry('system', `  Goal: ${describeGoal(config.goal)}`),
    createEntry('system', `  Turns: ${log.length}`),
    createEntry(
      'system',
      `  Files read: ${finalState.filesRead.size}   Saved: ${finalState.savedFiles.size}`
    ),
    createEntry('system', `  Final detection: ${finalState.detectionLevel}`),
    createEntry('system', `  Outcome: ${outcome}`),
  ];

  const verdict = evaluateGoal(config, finalState);
  if (verdict) {
    lines.push(
      createEntry(verdict.startsWith('PASS') ? 'system' : 'warning', `  Goal: ${verdict}`)
    );
  }

  lines.push(
    createEntry('system', ''),
    createEntry(anomalies.length ? 'warning' : 'system', `  ANOMALIES (${anomalies.length})`)
  );
  for (const a of anomalies) {
    lines.push(
      createEntry('warning', `    turn ${a.turn} [${summarizeCommand(a.command)}]: ${a.anomaly}`)
    );
  }
  lines.push(createEntry('system', ''));
  return lines;
}
