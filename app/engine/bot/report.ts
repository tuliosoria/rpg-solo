import { GameState, TerminalEntry } from '../../types';
import { createEntry } from '../commands/utils';
import { determineEnding } from '../endings';
import { BotRunConfig, BotRunLogEntry } from './types';

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
    createEntry('system', `  Turns: ${log.length}`),
    createEntry('system', `  Files read: ${finalState.filesRead.size}   Saved: ${finalState.savedFiles.size}`),
    createEntry('system', `  Final detection: ${finalState.detectionLevel}`),
    createEntry('system', `  Outcome: ${outcome}`),
    createEntry('system', ''),
    createEntry(anomalies.length ? 'warning' : 'system', `  ANOMALIES (${anomalies.length})`),
  ];
  for (const a of anomalies) {
    lines.push(createEntry('warning', `    turn ${a.turn} [${a.command}]: ${a.anomaly}`));
  }
  lines.push(createEntry('system', ''));
  return lines;
}
