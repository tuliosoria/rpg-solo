import { describe, it, expect } from 'vitest';
import { GameState, DEFAULT_GAME_STATE } from '../../types';
import {
  isInAtmospherePhase,
  shouldSuppressPressure,
  shouldSuppressPenalties,
  isMeaningfulFile,
  countMeaningfulFilesRead,
  hasFirstEvidence,
  isPressureCooldownActive,
  MEANINGFUL_FILES_THRESHOLD,
  UFO74_DISENGAGE_COOLDOWN_MS,
} from '../../constants/atmosphere';

const createTestState = (overrides: Partial<GameState> = {}): GameState => ({
  ...DEFAULT_GAME_STATE,
  seed: 12345,
  rngState: 12345,
  sessionStartTime: Date.now(),
  tutorialStep: -1,
  tutorialComplete: true,
  ...overrides,
});

describe('Atmosphere Phase System', () => {
  describe('isMeaningfulFile', () => {
    it('returns true for narrative files', () => {
      expect(isMeaningfulFile('/storage/reports/incident.txt')).toBe(true);
      expect(isMeaningfulFile('/comms/intercepts/signal.log')).toBe(true);
      expect(isMeaningfulFile('/medical/autopsy/report.doc')).toBe(true);
    });

    it('returns false for tutorial/help files', () => {
      expect(isMeaningfulFile('/readme.txt')).toBe(false);
      expect(isMeaningfulFile('/help.txt')).toBe(false);
      expect(isMeaningfulFile('/docs/tutorial.md')).toBe(false);
      expect(isMeaningfulFile('/guide.txt')).toBe(false);
    });

    it('returns false for mundane directory files', () => {
      expect(isMeaningfulFile('/logs/access.log')).toBe(false);
      expect(isMeaningfulFile('/admin/config.txt')).toBe(false);
      expect(isMeaningfulFile('/temp/scratch.dat')).toBe(false);
    });
  });

  describe('countMeaningfulFilesRead', () => {
    it('returns 0 when no files read', () => {
      const state = createTestState({ filesRead: new Set() });
      expect(countMeaningfulFilesRead(state)).toBe(0);
    });

    it('counts only meaningful files', () => {
      const state = createTestState({
        filesRead: new Set([
          '/readme.txt',
          '/storage/report.txt',
          '/help.txt',
          '/comms/signal.dat',
          '/logs/access.log',
        ]),
      });
      // Should count: /storage/report.txt, /comms/signal.dat = 2
      // Should not count: readme, help, logs
      expect(countMeaningfulFilesRead(state)).toBe(2);
    });
  });

  describe('hasFirstEvidence', () => {
    it('returns false when no truths discovered', () => {
      const state = createTestState({ truthsDiscovered: new Set() });
      expect(hasFirstEvidence(state)).toBe(false);
    });

    it('returns true when any truth discovered', () => {
      const state = createTestState({ truthsDiscovered: new Set(['debris_relocation']) });
      expect(hasFirstEvidence(state)).toBe(true);
    });
  });

  describe('isInAtmospherePhase', () => {
    it('returns false during tutorial', () => {
      const state = createTestState({
        tutorialComplete: false,
        tutorialStep: 0,
        truthsDiscovered: new Set(),
        filesRead: new Set(),
      });
      expect(isInAtmospherePhase(state)).toBe(false);
    });

    it('returns true after tutorial with no evidence and few files', () => {
      const state = createTestState({
        truthsDiscovered: new Set(),
        filesRead: new Set(['/storage/file1.txt', '/storage/file2.txt']),
      });
      expect(isInAtmospherePhase(state)).toBe(true);
    });

    it('returns false once first evidence is discovered', () => {
      const state = createTestState({
        truthsDiscovered: new Set(['being_containment']),
        filesRead: new Set(['/storage/file1.txt']),
      });
      expect(isInAtmospherePhase(state)).toBe(false);
    });

    it('returns false after reading enough meaningful files', () => {
      const meaningfulFiles = new Set<string>();
      for (let i = 0; i < MEANINGFUL_FILES_THRESHOLD; i++) {
        meaningfulFiles.add(`/storage/file${i}.txt`);
      }
      const state = createTestState({
        truthsDiscovered: new Set(),
        filesRead: meaningfulFiles,
      });
      expect(isInAtmospherePhase(state)).toBe(false);
    });

    it('does not count mundane files toward threshold', () => {
      // Even with many log files, should remain in atmosphere phase
      const mundaneFiles = new Set<string>();
      for (let i = 0; i < 10; i++) {
        mundaneFiles.add(`/logs/access${i}.log`);
      }
      const state = createTestState({
        truthsDiscovered: new Set(),
        filesRead: mundaneFiles,
      });
      expect(isInAtmospherePhase(state)).toBe(true);
    });
  });

  describe('isPressureCooldownActive', () => {
    it('returns false when no disengage time set', () => {
      const state = createTestState({ ufo74DisengageTime: 0 });
      expect(isPressureCooldownActive(state)).toBe(false);
    });

    it('returns true during cooldown period', () => {
      const state = createTestState({
        ufo74DisengageTime: Date.now() - 10000, // 10 seconds ago
      });
      expect(isPressureCooldownActive(state)).toBe(true);
    });

    it('returns false after cooldown expires', () => {
      const state = createTestState({
        ufo74DisengageTime: Date.now() - UFO74_DISENGAGE_COOLDOWN_MS - 1000, // Well past cooldown
      });
      expect(isPressureCooldownActive(state)).toBe(false);
    });
  });

  describe('shouldSuppressPressure', () => {
    it('suppresses during tutorial', () => {
      const state = createTestState({
        tutorialComplete: false,
        tutorialStep: 0,
      });
      expect(shouldSuppressPressure(state)).toBe(true);
    });

    it('suppresses during atmosphere phase', () => {
      const state = createTestState({
        truthsDiscovered: new Set(),
        filesRead: new Set(),
      });
      expect(shouldSuppressPressure(state)).toBe(true);
    });

    it('suppresses during cooldown', () => {
      const state = createTestState({
        truthsDiscovered: new Set(['debris_relocation']), // Past atmosphere phase
        ufo74DisengageTime: Date.now() - 10000, // In cooldown
      });
      expect(shouldSuppressPressure(state)).toBe(true);
    });

    it('does not suppress after atmosphere phase and cooldown', () => {
      const state = createTestState({
        truthsDiscovered: new Set(['debris_relocation']),
        ufo74DisengageTime: 0,
      });
      expect(shouldSuppressPressure(state)).toBe(false);
    });
  });

  describe('shouldSuppressPenalties', () => {
    it('suppresses during tutorial', () => {
      const state = createTestState({
        tutorialComplete: false,
      });
      expect(shouldSuppressPenalties(state)).toBe(true);
    });

    it('suppresses during atmosphere phase', () => {
      const state = createTestState({
        truthsDiscovered: new Set(),
        filesRead: new Set(),
      });
      expect(shouldSuppressPenalties(state)).toBe(true);
    });

    it('does not suppress after atmosphere phase', () => {
      const state = createTestState({
        truthsDiscovered: new Set(['being_containment']),
      });
      expect(shouldSuppressPenalties(state)).toBe(false);
    });
  });
});

describe('Atmosphere Phase Integration', () => {
  it('provides pressure-free exploration early game', () => {
    // Simulate early game: tutorial complete, no evidence, few files
    const state = createTestState({
      filesRead: new Set(['/storage/memo.txt', '/storage/log.txt']),
      truthsDiscovered: new Set(),
      detectionLevel: 30, // Would normally trigger glitches/paranoia
    });

    // Should be in atmosphere phase
    expect(isInAtmospherePhase(state)).toBe(true);
    expect(shouldSuppressPressure(state)).toBe(true);

    // Penalties should also be suppressed
    expect(shouldSuppressPenalties(state)).toBe(true);
  });

  it('activates pressure systems after evidence discovery', () => {
    const state = createTestState({
      filesRead: new Set(['/storage/critical_report.txt']),
      truthsDiscovered: new Set(['telepathic_scouts']),
      detectionLevel: 40,
    });

    // No longer in atmosphere phase
    expect(isInAtmospherePhase(state)).toBe(false);
    expect(shouldSuppressPressure(state)).toBe(false);
    expect(shouldSuppressPenalties(state)).toBe(false);
  });
});
