import { describe, it, expect } from 'vitest';
import { isTerminalIdle, detectAnomaly } from '../useBotRunner';

describe('useBotRunner logic', () => {
  it('is not idle while processing or while media/turing gates are open', () => {
    expect(isTerminalIdle({ isProcessing: true, showTuringTest: false, hasPendingMedia: false })).toBe(false);
    expect(isTerminalIdle({ isProcessing: false, showTuringTest: true, hasPendingMedia: false })).toBe(false);
    expect(isTerminalIdle({ isProcessing: false, showTuringTest: false, hasPendingMedia: true })).toBe(false);
    expect(isTerminalIdle({ isProcessing: false, showTuringTest: false, hasPendingMedia: false })).toBe(true);
  });

  it('flags an error-typed command result as an anomaly', () => {
    expect(detectAnomaly('open nope', true)).toContain('error');
  });

  it('returns null when nothing went wrong', () => {
    expect(detectAnomaly('open a.txt', false)).toBeNull();
  });
});
