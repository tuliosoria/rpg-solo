import { beforeEach, describe, expect, it } from 'vitest';
import { executeCommand } from '../commands';
import { DEFAULT_GAME_STATE, GameState } from '../../types';

describe('Rewind Command - Legacy Compatibility', () => {
  let baseState: GameState;

  beforeEach(() => {
    baseState = {
      ...DEFAULT_GAME_STATE,
      seed: 12345,
      rngState: 12345,
      sessionStartTime: Date.now(),
      tutorialComplete: true,
    };
  });

  describe('rewind command', () => {
    it('stays disabled during tutorial', () => {
      const result = executeCommand('rewind', { ...baseState, tutorialComplete: false });

      expect(result.stateChanges.inArchiveMode).toBeUndefined();
    });

    it('does not enter archive mode anymore', () => {
      const result = executeCommand('rewind', baseState);

      expect(result.stateChanges.inArchiveMode).toBeUndefined();
      expect(result.output.some(e => e.content.includes('ARCHIVE MODE HAS BEEN RETIRED'))).toBe(
        true
      );
    });

    it('clears stale archive state from older saves', () => {
      const result = executeCommand('rewind', {
        ...baseState,
        inArchiveMode: true,
        archiveActionsRemaining: 3,
        archiveTimestamp: '02:15:30',
      });

      expect(result.stateChanges.inArchiveMode).toBe(false);
      expect(result.stateChanges.archiveActionsRemaining).toBe(0);
    });
  });

  describe('present command', () => {
    it('confirms the current timeline when not in archive mode', () => {
      const result = executeCommand('present', baseState);

      expect(result.output.some(e => e.content.includes('Current timeline active.'))).toBe(true);
      expect(result.stateChanges.inArchiveMode).toBeUndefined();
    });

    it('clears stale archive state when needed', () => {
      const result = executeCommand('present', {
        ...baseState,
        inArchiveMode: true,
        archiveActionsRemaining: 3,
        archiveTimestamp: '02:15:30',
      });

      expect(result.stateChanges.inArchiveMode).toBe(false);
      expect(result.stateChanges.archiveActionsRemaining).toBe(0);
    });
  });

  describe('legacy archive-only files', () => {
    it('does not allow opening archive-only files', () => {
      const result = executeCommand('open deleted_comms_log.txt', {
        ...baseState,
        currentPath: '/comms',
      });

      expect(result.output.some(e => e.content.includes('File not found'))).toBe(true);
    });
  });
});
