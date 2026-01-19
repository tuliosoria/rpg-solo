import { describe, it, expect } from 'vitest';
import { resolvePath, getNode, listDirectory, canAccessFile } from '../filesystem';
import { GameState, DEFAULT_GAME_STATE } from '../../types';

const createTestState = (overrides: Partial<GameState> = {}): GameState => ({
  ...DEFAULT_GAME_STATE,
  seed: 12345,
  rngState: 12345,
  sessionStartTime: Date.now(),
  ...overrides,
});

describe('Filesystem', () => {
  describe('resolvePath', () => {
    it('resolves absolute paths correctly', () => {
      expect(resolvePath('/storage/quarantine', '/')).toBe('/storage/quarantine');
    });

    it('resolves relative paths correctly', () => {
      expect(resolvePath('quarantine', '/storage')).toBe('/storage/quarantine');
    });

    it('handles .. correctly', () => {
      expect(resolvePath('..', '/storage/quarantine')).toBe('/storage');
    });

    it('handles . correctly', () => {
      expect(resolvePath('.', '/storage')).toBe('/storage');
    });

    it('handles multiple .. correctly', () => {
      expect(resolvePath('../..', '/storage/quarantine')).toBe('/');
    });
  });

  describe('getNode', () => {
    it('returns root node for root path', () => {
      const state = createTestState();
      const node = getNode('/', state);
      expect(node).not.toBeNull();
      expect(node?.type).toBe('dir');
    });

    it('returns storage directory', () => {
      const state = createTestState();
      const node = getNode('/storage', state);
      expect(node).not.toBeNull();
      expect(node?.type).toBe('dir');
    });

    it('returns quarantine directory', () => {
      const state = createTestState();
      const node = getNode('/storage/quarantine', state);
      expect(node).not.toBeNull();
      expect(node?.type).toBe('dir');
    });

    it('returns null for non-existent path', () => {
      const state = createTestState();
      const node = getNode('/nonexistent', state);
      expect(node).toBeNull();
    });

    it('respects access threshold', () => {
      const state = createTestState({ accessLevel: 1 });
      const node = getNode('/admin', state);
      // Admin requires accessThreshold: 3
      expect(node).toBeNull();
    });

    it('allows access when access level is sufficient', () => {
      const state = createTestState({ accessLevel: 3 });
      const node = getNode('/admin', state);
      expect(node).not.toBeNull();
    });
  });

  describe('listDirectory', () => {
    it('lists root directory', () => {
      const state = createTestState();
      const entries = listDirectory('/', state);
      expect(entries).not.toBeNull();
      expect(entries!.length).toBeGreaterThan(0);
      expect(entries!.some(e => e.name === 'storage/')).toBe(true);
    });

    it('lists quarantine directory with video file', () => {
      const state = createTestState();
      const entries = listDirectory('/storage/quarantine', state);
      expect(entries).not.toBeNull();
      expect(entries!.some(e => e.name === 'surveillance_recovery.vid')).toBe(true);
    });

    it('hides prato archive before override', () => {
      const state = createTestState({ accessLevel: 5 });
      const entries = listDirectory('/ops/prato', state);
      expect(entries!.some(e => e.name === 'archive/')).toBe(false);
    });

    it('shows prato archive after override', () => {
      const state = createTestState({ accessLevel: 5, flags: { adminUnlocked: true } });
      const entries = listDirectory('/ops/prato', state);
      expect(entries!.some(e => e.name === 'archive/')).toBe(true);
    });

    it('returns null for non-existent directory', () => {
      const state = createTestState();
      const entries = listDirectory('/nonexistent', state);
      expect(entries).toBeNull();
    });

    it('hides files with insufficient access level', () => {
      const state = createTestState({ accessLevel: 1 });
      const entries = listDirectory('/', state);
      // admin directory requires accessThreshold: 3
      expect(entries!.some(e => e.name === 'admin/')).toBe(false);
    });
  });

  describe('canAccessFile', () => {
    it('allows access to normal files', () => {
      const state = createTestState();
      const result = canAccessFile('/internal/incident_review_protocol.txt', state);
      expect(result.accessible).toBe(true);
    });

    it('denies access to non-existent files', () => {
      const state = createTestState();
      const result = canAccessFile('/nonexistent.txt', state);
      expect(result.accessible).toBe(false);
      expect(result.reason).toBe('FILE NOT FOUND');
    });

    it('denies access to deleted files', () => {
      const state = createTestState({
        fileMutations: {
          '/internal/incident_review_protocol.txt': { deleted: true, corruptedLines: [] },
        },
      });
      const result = canAccessFile('/internal/incident_review_protocol.txt', state);
      expect(result.accessible).toBe(false);
      expect(result.reason).toBe('FILE DELETED');
    });

    it('denies access to locked files', () => {
      const state = createTestState({
        fileMutations: {
          '/internal/incident_review_protocol.txt': { locked: true, corruptedLines: [] },
        },
      });
      const result = canAccessFile('/internal/incident_review_protocol.txt', state);
      expect(result.accessible).toBe(false);
      expect(result.reason).toBe('FILE LOCKED');
    });
  });
});
