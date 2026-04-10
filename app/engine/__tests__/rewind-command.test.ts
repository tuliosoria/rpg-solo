// Tests for the rewind/present commands (now decommissioned) and archive time mechanic

import { describe, it, expect, beforeEach } from 'vitest';
import { executeCommand } from '../commands';
import { GameState, DEFAULT_GAME_STATE } from '../../types';

describe('Rewind Command - Decommissioned', () => {
  let baseState: GameState;

  beforeEach(() => {
    baseState = {
      ...DEFAULT_GAME_STATE,
      seed: 12345,
      rngState: 12345,
      sessionStartTime: Date.now(),
      tutorialComplete: true, // Skip tutorial
    };
  });

  describe('rewind command', () => {
    it('should return decommissioned message', () => {
      const result = executeCommand('rewind', baseState);

      expect(result.output.some(e => e.content.includes('decommissioned'))).toBe(true);
      expect(result.stateChanges.inArchiveMode).toBeUndefined();
      expect(result.stateChanges.archiveActionsRemaining).toBeUndefined();
    });

    it('should not enter archive mode even during tutorial', () => {
      const tutorialState = { ...baseState, tutorialComplete: false };
      const result = executeCommand('rewind', tutorialState);

      expect(result.stateChanges.inArchiveMode).toBeUndefined();
    });

    it('should not change detection level', () => {
      const result = executeCommand('rewind', baseState);

      expect(result.output.some(e => e.content.includes('decommissioned'))).toBe(true);
      // Decommissioned commands don't change detection
      expect(result.stateChanges.detectionLevel).toBeUndefined();
    });

    it('should not trigger flicker effect', () => {
      const result = executeCommand('rewind', baseState);

      expect(result.triggerFlicker).toBeUndefined();
    });
  });

  describe('present command', () => {
    it('should return decommissioned message when not in archive mode', () => {
      const result = executeCommand('present', baseState);

      expect(result.output.some(e => e.content.includes('decommissioned'))).toBe(true);
      expect(result.stateChanges.inArchiveMode).toBeUndefined();
    });

    it('should return decommissioned message even with archive state', () => {
      const archiveState = {
        ...baseState,
        inArchiveMode: true,
        archiveActionsRemaining: 3,
        archiveTimestamp: '02:15:30',
      };

      const result = executeCommand('present', archiveState);

      expect(result.output.some(e => e.content.includes('decommissioned'))).toBe(true);
    });
  });

  describe('help command', () => {
    it('should include rewind in help output', () => {
      const result = executeCommand('help', baseState);

      const outputText = result.output.map(e => e.content).join('\n');
      expect(outputText).toContain('rewind');
    });

    it('should show decommissioned help for rewind', () => {
      const result = executeCommand('help rewind', baseState);

      const outputText = result.output.map(e => e.content).join('\n');
      expect(outputText).toContain('COMMAND: rewind');
      expect(outputText).toContain('decommissioned');
    });

    it('should show decommissioned help for present', () => {
      const result = executeCommand('help present', baseState);

      const outputText = result.output.map(e => e.content).join('\n');
      expect(outputText).toContain('COMMAND: present');
      expect(outputText).toContain('decommissioned');
    });
  });
});
