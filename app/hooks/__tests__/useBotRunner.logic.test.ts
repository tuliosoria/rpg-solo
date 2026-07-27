import { describe, it, expect } from 'vitest';
import { isTerminalIdle } from '../useBotRunner';

describe('useBotRunner logic', () => {
  it('is not idle while processing or while media/turing gates are open', () => {
    expect(isTerminalIdle({ isProcessing: true, showTuringTest: false, hasPendingMedia: false })).toBe(false);
    expect(isTerminalIdle({ isProcessing: false, showTuringTest: true, hasPendingMedia: false })).toBe(false);
    expect(isTerminalIdle({ isProcessing: false, showTuringTest: false, hasPendingMedia: true })).toBe(false);
    expect(isTerminalIdle({ isProcessing: false, showTuringTest: false, hasPendingMedia: false })).toBe(true);
  });
});
