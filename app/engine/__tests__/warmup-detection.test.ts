import { describe, it, expect } from 'vitest';
import { executeCommand } from '../commands';
import { GameState, DEFAULT_GAME_STATE } from '../../types';
import {
  getWarmupMultiplier,
  applyWarmupDetection,
  WARMUP_PHASE,
} from '../../constants/detection';

const createTestState = (overrides: Partial<GameState> = {}): GameState => ({
  ...DEFAULT_GAME_STATE,
  seed: 12345,
  rngState: 12345,
  sessionStartTime: Date.now(),
  tutorialStep: -1,
  tutorialComplete: true,
  ...overrides,
});

describe('Warmup Detection System', () => {
  describe('getWarmupMultiplier', () => {
    it('returns MIN_MULTIPLIER when no files read', () => {
      expect(getWarmupMultiplier(0)).toBe(WARMUP_PHASE.MIN_MULTIPLIER);
    });

    it('returns 1.0 at or above threshold', () => {
      expect(getWarmupMultiplier(WARMUP_PHASE.FILES_READ_THRESHOLD)).toBe(1.0);
      expect(getWarmupMultiplier(WARMUP_PHASE.FILES_READ_THRESHOLD + 5)).toBe(1.0);
    });

    it('ramps up gradually between 0 and threshold', () => {
      const midpoint = Math.floor(WARMUP_PHASE.FILES_READ_THRESHOLD / 2);
      const multiplier = getWarmupMultiplier(midpoint);

      // Should be between MIN_MULTIPLIER and 1.0
      expect(multiplier).toBeGreaterThan(WARMUP_PHASE.MIN_MULTIPLIER);
      expect(multiplier).toBeLessThan(1.0);
    });

    it('increases monotonically as files read increases', () => {
      let prev = getWarmupMultiplier(0);
      for (let i = 1; i <= WARMUP_PHASE.FILES_READ_THRESHOLD; i++) {
        const current = getWarmupMultiplier(i);
        expect(current).toBeGreaterThanOrEqual(prev);
        prev = current;
      }
    });
  });

  describe('applyWarmupDetection', () => {
    it('reduces detection increase during early game', () => {
      // With 0 files read, a +10 increase should become much smaller
      const newDetection = applyWarmupDetection(0, 10, 0);
      // At 0.25 multiplier, ceil(10 * 0.25) = 3
      expect(newDetection).toBeLessThan(10);
      expect(newDetection).toBeGreaterThan(0);
    });

    it('applies full increase after warmup phase', () => {
      const filesRead = WARMUP_PHASE.FILES_READ_THRESHOLD;
      const newDetection = applyWarmupDetection(0, 10, filesRead);
      expect(newDetection).toBe(10);
    });

    it('respects soft cap during warmup', () => {
      // With 2 files read and detection at 12, a +10 increase
      // would normally push to 22, but soft cap at 15 should limit it
      const newDetection = applyWarmupDetection(12, 10, 2);
      expect(newDetection).toBeLessThanOrEqual(WARMUP_PHASE.SOFT_CAP + 5);
    });

    it('caps at MAX_DETECTION', () => {
      const newDetection = applyWarmupDetection(95, 20, WARMUP_PHASE.FILES_READ_THRESHOLD);
      expect(newDetection).toBe(100);
    });
  });

  describe('Command Integration', () => {
    it('reduces ls detection during warmup phase', () => {
      const state = createTestState({
        detectionLevel: 0,
        filesRead: new Set(), // 0 files = warmup phase
      });

      const result = executeCommand('ls', state);
      // Normal ls is +2, with warmup should be reduced
      expect(result.stateChanges.detectionLevel).toBeLessThanOrEqual(2);
    });

    it('applies full detection after reading 8+ files', () => {
      const state = createTestState({
        detectionLevel: 0,
        filesRead: new Set([
          '/file1.txt',
          '/file2.txt',
          '/file3.txt',
          '/file4.txt',
          '/file5.txt',
          '/file6.txt',
          '/file7.txt',
          '/file8.txt',
        ]), // 8 files = past warmup
      });

      const result = executeCommand('ls', state);
      // After warmup, full +2 should apply
      expect(result.stateChanges.detectionLevel).toBe(2);
    });

    it('reduces cd detection during warmup phase', () => {
      const state = createTestState({
        currentPath: '/',
        detectionLevel: 0,
        filesRead: new Set(), // warmup phase
      });

      const result = executeCommand('cd storage', state);
      // Normal cd is +1, with warmup should be minimal
      expect(result.stateChanges.detectionLevel).toBeLessThanOrEqual(1);
    });

    it('scales detection increase with files read progress', () => {
      // Test that detection increases as player reads more files
      const filesSetSmall = new Set<string>(['/a.txt', '/b.txt']);
      const filesSetMedium = new Set<string>([
        '/a.txt',
        '/b.txt',
        '/c.txt',
        '/d.txt',
        '/e.txt',
        '/f.txt',
      ]);

      const stateSmall = createTestState({
        detectionLevel: 0,
        filesRead: filesSetSmall,
      });

      const stateMedium = createTestState({
        detectionLevel: 0,
        filesRead: filesSetMedium,
      });

      const resultSmall = executeCommand('ls', stateSmall);
      const resultMedium = executeCommand('ls', stateMedium);

      // Medium should have equal or higher detection
      expect(resultMedium.stateChanges.detectionLevel).toBeGreaterThanOrEqual(
        resultSmall.stateChanges.detectionLevel ?? 0
      );
    });
  });

  describe('Atmospheric Pacing', () => {
    it('allows exploration without punishment in early game', () => {
      // Simulate early game: navigate and list several times
      let state = createTestState({
        detectionLevel: 0,
        filesRead: new Set(),
      });

      // Execute several navigation commands
      for (let i = 0; i < 5; i++) {
        const cdResult = executeCommand('cd storage', state);
        state = { ...state, ...cdResult.stateChanges };

        const lsResult = executeCommand('ls', state);
        state = { ...state, ...lsResult.stateChanges };

        state = { ...state, currentPath: '/' }; // Reset for next iteration
      }

      // After 10 commands, detection should still be reasonable (< 15%)
      expect(state.detectionLevel).toBeLessThan(15);
    });

    it('maintains soft cap during aggressive early exploration', () => {
      let state = createTestState({
        detectionLevel: 0,
        filesRead: new Set(['/file1.txt', '/file2.txt']), // 2 files = still in warmup
      });

      // Execute high-risk actions that would normally spike detection
      const cdBadResult = executeCommand('cd nonexistent', state);
      state = { ...state, ...cdBadResult.stateChanges };

      // Even with failed cd (+3 normally), should be soft-capped
      expect(state.detectionLevel).toBeLessThanOrEqual(WARMUP_PHASE.SOFT_CAP + 3);
    });
  });
});
