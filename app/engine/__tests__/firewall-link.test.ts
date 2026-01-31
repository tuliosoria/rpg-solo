/**
 * Firewall and Neural Link System Tests
 */

import { describe, it, expect } from 'vitest';
import { executeCommand } from '../commands';
import { GameState, DEFAULT_GAME_STATE } from '../../types';
import {
  createFirewallEye,
  DETECTION_THRESHOLD,
  DETECTION_INCREASE_ON_DETONATE,
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

describe('Firewall Eyes System', () => {
  describe('createFirewallEye', () => {
    it('creates an eye with valid properties', () => {
      const eye = createFirewallEye();

      expect(eye.id).toBeDefined();
      expect(eye.x).toBeGreaterThanOrEqual(10);
      expect(eye.x).toBeLessThanOrEqual(90);
      expect(eye.y).toBeGreaterThanOrEqual(20);
      expect(eye.y).toBeLessThanOrEqual(80);
      expect(eye.spawnTime).toBeLessThanOrEqual(Date.now());
      expect(eye.detonateTime).toBeGreaterThan(eye.spawnTime);
      expect(eye.isDetonating).toBe(false);
    });

    it('creates unique eye IDs', () => {
      const eye1 = createFirewallEye();
      const eye2 = createFirewallEye();

      expect(eye1.id).not.toBe(eye2.id);
    });

    it('avoids spawning in avatar region (top-right corner)', () => {
      // Create many eyes and verify none spawn in avatar zone (x > 75% and y < 40%)
      const eyes = [];
      for (let i = 0; i < 100; i++) {
        eyes.push(createFirewallEye());
      }

      for (const eye of eyes) {
        const inAvatarZone = eye.x > 75 && eye.y < 40;
        expect(inAvatarZone).toBe(false);
      }
    });
  });

  describe('Firewall constants', () => {
    it('has detection threshold of 25%', () => {
      expect(DETECTION_THRESHOLD).toBe(25);
    });

    it('increases detection by 5% on detonation', () => {
      expect(DETECTION_INCREASE_ON_DETONATE).toBe(5);
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
    it('prompts for authentication phrase', () => {
      const state = createTestState({
        tutorialStep: -1,
        tutorialComplete: true,
        flags: { scoutLinkUnlocked: true },
      });

      const result = executeCommand('link', state);

      expect(result.output.some(e => e.content.includes('AUTHENTICATION REQUIRED'))).toBe(true);
      expect(result.output.some(e => e.content.includes('phrase'))).toBe(true);
    });

    it('rejects incorrect password', () => {
      const state = createTestState({
        tutorialStep: -1,
        tutorialComplete: true,
        flags: { scoutLinkUnlocked: true },
      });

      const result = executeCommand('link wrong password', state);

      expect(result.output.some(e => e.content.includes('AUTHENTICATION FAILED'))).toBe(true);
    });

    it('accepts correct password "harvest is not destruction"', () => {
      const state = createTestState({
        tutorialStep: -1,
        tutorialComplete: true,
        flags: { scoutLinkUnlocked: true },
      });

      const result = executeCommand('link harvest is not destruction', state);

      expect(result.output.some(e => e.content.includes('AUTHENTICATION ACCEPTED'))).toBe(true);
      expect(result.stateChanges.flags?.neuralLinkAuthenticated).toBe(true);
    });

    it('accepts partial password "harvest"', () => {
      const state = createTestState({
        tutorialStep: -1,
        tutorialComplete: true,
        flags: { scoutLinkUnlocked: true },
      });

      const result = executeCommand('link harvest', state);

      expect(result.output.some(e => e.content.includes('AUTHENTICATION ACCEPTED'))).toBe(true);
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
        firewallEyes: [createFirewallEye()],
        detectionLevel: 50,
      });

      const result = executeCommand('link disarm', state);

      expect(result.output.some(e => e.content.includes('FIREWALL NEUTRALIZED'))).toBe(true);
      expect(result.stateChanges.firewallDisarmed).toBe(true);
      expect(result.stateChanges.firewallActive).toBe(false);
      expect(result.stateChanges.firewallEyes).toEqual([]);
    });

    it('reduces detection level when disarming firewall', () => {
      const state = createTestState({
        tutorialStep: -1,
        tutorialComplete: true,
        flags: { scoutLinkUnlocked: true, neuralLinkAuthenticated: true },
        firewallActive: true,
        firewallEyes: [createFirewallEye()],
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
