import { MAX_HISTORY_SIZE } from '../constants/limits';
import type { TerminalEntry } from '../types';

/**
 * Appends entries to history while enforcing MAX_HISTORY_SIZE cap.
 * Always returns a new array trimmed to the most recent MAX_HISTORY_SIZE entries.
 */
export function appendToHistory(
  current: TerminalEntry[],
  ...entries: TerminalEntry[]
): TerminalEntry[] {
  const combined = [...current, ...entries];
  if (combined.length > MAX_HISTORY_SIZE) {
    return combined.slice(-MAX_HISTORY_SIZE);
  }
  return combined;
}
