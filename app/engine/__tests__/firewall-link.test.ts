/**
 * Firewall and Neural Link System Tests
 */

import { describe, it, expect } from 'vitest';
import { executeCommand } from '../commands';
import { GameState, DEFAULT_GAME_STATE } from '../../types';
import {
  DETECTION_THRESHOLD,
} from '../../components/FirewallEyes';

// Helper to create a test state
function createTestState(overrides: Partial<GameState> = {}): GameState {
  return {
    ...DEFAULT_GAME_STATE,
    seed: 12345,
    rngState: 12345,
    sessionStartTime: Date.now(),
    ...overrides,
  } as GameState;
}

describe('Firewall System', () => {
  describe('Firewall constants', () => {
    it('has detection threshold of 25%', () => {
      expect(DETECTION_THRESHOLD).toBe(25);
    });
  });
});

describe('Neural Link Command', () => {
  describe('link without unlocking neural dump', () => {
    it('shows access denied before unlocking neural dump', () => {
      const state = createTestState({
        tutorialStep: -1,
        tutorialComplete: true,
        flags: {},
      });

      const result = executeCommand('link', state);

      expect(result.output.some(e => e.content.includes('ACCESS DENIED'))).toBe(true);
      expect(result.output.some(e => e.content.includes('NEURAL PATTERN'))).toBe(true);
    });
  });

  describe('link with neural dump unlocked but not authenticated', () => {
    it('still denies access when only a non-alpha .psi file has been decrypted', () => {
      // scoutLinkUnlocked can be set by any .psi file, but `link` should
      // only authenticate after neural_dump_alfa.psi has been read.
      const state = createTestState({
        tutorialStep: -1,
        tutorialComplete: true,
        flags: { scoutLinkUnlocked: true },
      });

      const result = executeCommand('link', state);

      expect(result.output.some(e => e.content.includes('ACCESS DENIED'))).toBe(true);
      expect(
        result.output.some(e => e.content.includes('No neural pattern is indexed'))
      ).toBe(true);
    });

    it('does not prompt for a password or show UFO74 quarantine hints', () => {
      const state = createTestState({
        tutorialStep: -1,
        tutorialComplete: true,
        flags: { scoutLinkUnlocked: true },
      });

      const result = executeCommand('link', state);

      expect(result.output.some(e => e.content.includes('AUTHENTICATION REQUIRED'))).toBe(false);
      expect(result.output.some(e => e.content.includes('phrase'))).toBe(false);
      expect(
        result.output.some(e => e.content.toLowerCase().includes('quarantine'))
      ).toBe(false);
      expect(
        result.output.some(e => e.content.toLowerCase().includes('psi analysis'))
      ).toBe(false);
    });

    it('ignores password arguments entirely — no auth flow exists', () => {
      const state = createTestState({
        tutorialStep: -1,
        tutorialComplete: true,
        flags: { scoutLinkUnlocked: true },
      });

      const result = executeCommand('link harvest is not destruction', state);

      expect(result.output.some(e => e.content.includes('ACCESS DENIED'))).toBe(true);
      expect(result.output.some(e => e.content.includes('AUTHENTICATION ACCEPTED'))).toBe(false);
      expect(result.stateChanges.flags?.neuralLinkAuthenticated).toBeUndefined();
    });
  });

  describe('link after authentication', () => {
    it('shows query prompt when already authenticated', () => {
      const state = createTestState({
        tutorialStep: -1,
        tutorialComplete: true,
        flags: { scoutLinkUnlocked: true, neuralLinkAuthenticated: true },
      });

      const result = executeCommand('link', state);

      // Should show the normal link prompt, not authentication
      expect(result.output.some(e => e.content.includes('NEURAL PATTERN LINK ACTIVE'))).toBe(true);
    });
  });

  describe('link disarm command', () => {
    it('disarms active firewall', () => {
      const state = createTestState({
        tutorialStep: -1,
        tutorialComplete: true,
        flags: { scoutLinkUnlocked: true, neuralLinkAuthenticated: true },
        firewallActive: true,
        detectionLevel: 50,
      });

      const result = executeCommand('link disarm', state);

      expect(result.output.some(e => e.content.includes('FIREWALL NEUTRALIZED'))).toBe(true);
      expect(result.stateChanges.firewallDisarmed).toBe(true);
      expect(result.stateChanges.firewallActive).toBe(false);
    });

    it('reduces detection level when disarming firewall', () => {
      const state = createTestState({
        tutorialStep: -1,
        tutorialComplete: true,
        flags: { scoutLinkUnlocked: true, neuralLinkAuthenticated: true },
        firewallActive: true,
        detectionLevel: 50,
      });

      const result = executeCommand('link disarm', state);

      expect(result.stateChanges.detectionLevel).toBeLessThan(50);
    });

    it('reports no threat when firewall not active', () => {
      const state = createTestState({
        tutorialStep: -1,
        tutorialComplete: true,
        flags: { scoutLinkUnlocked: true, neuralLinkAuthenticated: true },
        firewallActive: false,
      });

      const result = executeCommand('link disarm', state);

      expect(result.output.some(e => e.content.includes('no threat'))).toBe(true);
    });

    it('reports already silenced when firewall already disarmed', () => {
      const state = createTestState({
        tutorialStep: -1,
        tutorialComplete: true,
        flags: { scoutLinkUnlocked: true, neuralLinkAuthenticated: true },
        firewallDisarmed: true,
      });

      const result = executeCommand('link disarm', state);

      expect(result.output.some(e => e.content.includes('already'))).toBe(true);
    });
  });

  describe('link exhaustion', () => {
    it('exhausts after 4 queries', () => {
      const state = createTestState({
        tutorialStep: -1,
        tutorialComplete: true,
        flags: { scoutLinkUnlocked: true, neuralLinkAuthenticated: true },
        scoutLinksUsed: 4,
      });

      const result = executeCommand('link', state);

      expect(
        result.output.some(
          e => e.content.includes('PATTERN EXHAUSTED') || e.content.includes('DEGRADED')
        )
      ).toBe(true);
    });
  });
});
