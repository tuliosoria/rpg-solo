import { describe, it, expect, beforeEach } from 'vitest';
import type { GameState } from '../../types';
import { DEFAULT_GAME_STATE } from '../../types';
import { executeCommand } from '../commands';

describe('Video Trigger Logic', () => {
  const neuralClusterVideoSrc =
    'https://drive.google.com/uc?export=download&id=1Gzqrt1QNqC5OuXjxo7U5NopTuZVwXcI7';

  let initialState: GameState;

  beforeEach(() => {
    initialState = {
      ...DEFAULT_GAME_STATE,
      seed: 12345,
      rngState: 12345,
      sessionStartTime: Date.now(),
      accessLevel: 4,
      tutorialComplete: true,  // Skip tutorial for these tests
      imagesShownThisRun: new Set(),
      videosShownThisRun: new Set(),
      flags: { ...DEFAULT_GAME_STATE.flags, adminUnlocked: true },
    };
  });

  it('tracks shown videos in videosShownThisRun set', () => {
    const result = executeCommand('open /storage/quarantine/surveillance_recovery.vid', initialState);

    expect(result.stateChanges.videosShownThisRun instanceof Set).toBe(true);
  });

  it('triggers neural cluster memo video while preserving file output', () => {
    const result = executeCommand('open /comms/neural_cluster_memo.txt', initialState);

    expect(result.videoTrigger).toBeDefined();
    expect(result.videoTrigger?.src).toBe(neuralClusterVideoSrc);
    expect(
      result.output.some(entry => entry.content.includes('MEMO: Neural Cluster Initiative'))
    ).toBe(true);
    expect(result.stateChanges.videosShownThisRun instanceof Set).toBe(true);
    expect(result.stateChanges.videosShownThisRun?.has(neuralClusterVideoSrc)).toBe(true);
  });

  it('does not set videosShownThisRun for non-video commands', () => {
    const result = executeCommand('help', initialState);

    expect(result.stateChanges.videosShownThisRun).toBeUndefined();
  });
});
