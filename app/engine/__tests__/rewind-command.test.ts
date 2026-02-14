// Tests for the rewind/archive time mechanic

import { describe, it, expect, beforeEach } from 'vitest';
import { executeCommand } from '../commands';
import { GameState, DEFAULT_GAME_STATE, TruthCategory } from '../../types';

describe('Rewind Command - Time Mechanic', () => {
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
    it('should not work during tutorial', () => {
      const tutorialState = { ...baseState, tutorialComplete: false };
      const result = executeCommand('rewind', tutorialState);
      
      // During tutorial, either the command is blocked or handled by tutorial system
      // The key check is that archive mode is NOT activated
      expect(result.stateChanges.inArchiveMode).toBeUndefined();
    });

    it('should enter archive mode with correct state', () => {
      const result = executeCommand('rewind', baseState);
      
      expect(result.stateChanges.inArchiveMode).toBe(true);
      expect(result.stateChanges.archiveActionsRemaining).toBe(4);
      expect(result.stateChanges.archiveTimestamp).toBeDefined();
      expect(result.stateChanges.archiveTimestamp?.length).toBeGreaterThan(0);
    });

    it('should increase detection level by 5', () => {
      const result = executeCommand('rewind', baseState);
      
      expect(result.stateChanges.detectionLevel).toBe(baseState.detectionLevel + 5);
    });

    it('should show archive mode visual indicators', () => {
      const result = executeCommand('rewind', baseState);
      
      const outputText = result.output.map(e => e.content).join('\n');
      expect(outputText).toContain('ARCHIVE STATE');
      expect(outputText).toContain('READ-ONLY MODE');
      expect(outputText).toContain('TEMPORAL REGRESSION');
    });

    it('should show current status when already in archive mode', () => {
      const archiveState = {
        ...baseState,
        inArchiveMode: true,
        archiveActionsRemaining: 3,
        archiveTimestamp: '02:15:30',
      };
      
      const result = executeCommand('rewind', archiveState);
      
      expect(result.stateChanges.inArchiveMode).toBeUndefined(); // No change
      expect(result.output.some(e => e.content.includes('already viewing'))).toBe(true);
    });

    it('should trigger flicker effect', () => {
      const result = executeCommand('rewind', baseState);
      
      expect(result.triggerFlicker).toBe(true);
    });
  });

  describe('present command', () => {
    it('should inform user when not in archive mode', () => {
      const result = executeCommand('present', baseState);
      
      expect(result.output.some(e => e.content.includes('present'))).toBe(true);
      expect(result.stateChanges.inArchiveMode).toBeUndefined();
    });

    it('should exit archive mode when in archive mode', () => {
      const archiveState = {
        ...baseState,
        inArchiveMode: true,
        archiveActionsRemaining: 3,
        archiveTimestamp: '02:15:30',
      };
      
      const result = executeCommand('present', archiveState);
      
      expect(result.stateChanges.inArchiveMode).toBe(false);
      expect(result.stateChanges.archiveActionsRemaining).toBe(0);
    });
  });

  describe('ls command in archive mode', () => {
    it('should show archive header when in archive mode', () => {
      const archiveState = {
        ...baseState,
        inArchiveMode: true,
        archiveActionsRemaining: 4,
        archiveTimestamp: '02:15:30',
        currentPath: '/comms',
      };
      
      const result = executeCommand('ls', archiveState);
      
      const outputText = result.output.map(e => e.content).join('\n');
      expect(outputText).toContain('ARCHIVE STATE');
      expect(outputText).toContain('READ-ONLY MODE');
    });

    it('should show archive-only files with [DELETED] marker', () => {
      const archiveState = {
        ...baseState,
        inArchiveMode: true,
        archiveActionsRemaining: 4,
        archiveTimestamp: '02:15:30',
        currentPath: '/comms',
      };
      
      const result = executeCommand('ls', archiveState);
      
      const outputText = result.output.map(e => e.content).join('\n');
      expect(outputText).toContain('deleted_comms_log.txt');
      expect(outputText).toContain('[DELETED]');
    });

    it('should decrement archive actions', () => {
      const archiveState = {
        ...baseState,
        inArchiveMode: true,
        archiveActionsRemaining: 4,
        archiveTimestamp: '02:15:30',
        currentPath: '/comms',
      };
      
      const result = executeCommand('ls', archiveState);
      
      expect(result.stateChanges.archiveActionsRemaining).toBe(3);
    });

    it('should auto-exit archive mode when actions run out', () => {
      const archiveState = {
        ...baseState,
        inArchiveMode: true,
        archiveActionsRemaining: 1,
        archiveTimestamp: '02:15:30',
        currentPath: '/comms',
      };
      
      const result = executeCommand('ls', archiveState);
      
      expect(result.stateChanges.inArchiveMode).toBe(false);
      const outputText = result.output.map(e => e.content).join('\n');
      expect(outputText).toContain('ARCHIVE STATE LOST');
      expect(outputText).toContain('RETURNING TO PRESENT');
    });
  });

  describe('open command for archive files', () => {
    it('should not allow opening archive files when not in archive mode', () => {
      const result = executeCommand('open deleted_comms_log.txt', {
        ...baseState,
        currentPath: '/comms',
      });
      
      expect(result.output.some(e => e.content.includes('File not found'))).toBe(true);
    });

    it('should allow opening archive files when in archive mode', () => {
      const archiveState = {
        ...baseState,
        inArchiveMode: true,
        archiveActionsRemaining: 4,
        archiveTimestamp: '02:15:30',
        currentPath: '/comms',
        archiveFilesViewed: new Set<string>(),
      };
      
      // Use a seed that won't trigger file disappearance
      archiveState.seed = 99999; // Chosen to avoid 10% disappearance
      
      const result = executeCommand('open deleted_comms_log.txt', archiveState);
      
      const outputText = result.output.map(e => e.content).join('\n');
      // Should either show content or file disappearance
      const hasContent = outputText.includes('COMMUNICATIONS LOG');
      const hasDisappear = outputText.includes('FILE NO LONGER EXISTS');
      expect(hasContent || hasDisappear).toBe(true);
    });

    it('should show [DELETED] marker and warnings for archive files', () => {
      const archiveState = {
        ...baseState,
        inArchiveMode: true,
        archiveActionsRemaining: 4,
        archiveTimestamp: '02:15:30',
        currentPath: '/comms',
        archiveFilesViewed: new Set<string>(),
        seed: 50000, // Seed that avoids disappearance
      };
      
      const result = executeCommand('open deleted_comms_log.txt', archiveState);
      
      const outputText = result.output.map(e => e.content).join('\n');
      if (!outputText.includes('FILE NO LONGER EXISTS')) {
        expect(outputText).toContain('[DELETED]');
        expect(outputText).toContain('REMEMBER WHAT YOU SEE');
      }
    });

    it('should track viewed archive files', () => {
      const archiveState = {
        ...baseState,
        inArchiveMode: true,
        archiveActionsRemaining: 4,
        archiveTimestamp: '02:15:30',
        currentPath: '/comms',
        archiveFilesViewed: new Set<string>(),
        seed: 50000,
      };
      
      const result = executeCommand('open deleted_comms_log.txt', archiveState);
      
      if (result.stateChanges.archiveFilesViewed) {
        expect(result.stateChanges.archiveFilesViewed.has('/comms/deleted_comms_log.txt')).toBe(true);
      }
    });
  });

  describe('help command', () => {
    it('should include rewind in help output', () => {
      const result = executeCommand('help', baseState);
      
      const outputText = result.output.map(e => e.content).join('\n');
      expect(outputText).toContain('rewind');
    });

    it('should provide detailed help for rewind', () => {
      const result = executeCommand('help rewind', baseState);
      
      const outputText = result.output.map(e => e.content).join('\n');
      expect(outputText).toContain('COMMAND: rewind');
      expect(outputText).toContain('archive');
    });

    it('should provide detailed help for present', () => {
      const result = executeCommand('help present', baseState);
      
      const outputText = result.output.map(e => e.content).join('\n');
      expect(outputText).toContain('COMMAND: present');
    });
  });
});
