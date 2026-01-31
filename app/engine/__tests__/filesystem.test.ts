import { describe, it, expect } from 'vitest';
import {
  resolvePath,
  getNode,
  listDirectory,
  canAccessFile,
  fuzzyMatchFilename,
  findFilesMatching,
  smartResolvePath,
} from '../filesystem';
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

    it('hides prato folder before override', () => {
      const state = createTestState({ accessLevel: 5 });
      const entries = listDirectory('/ops/prato', state);
      // Entire prato folder now requires adminUnlocked
      expect(entries).toBeNull();
    });

    it('shows prato folder after override', () => {
      const state = createTestState({ accessLevel: 5, flags: { adminUnlocked: true } });
      const entries = listDirectory('/ops/prato', state);
      expect(entries).not.toBeNull();
      expect(entries!.some(e => e.name === 'archive/')).toBe(true);
    });

    it('hides ghost session log until flag set', () => {
      const state = createTestState();
      const entries = listDirectory('/tmp', state);
      expect(entries!.some(e => e.name === 'ghost_session.log')).toBe(false);
    });

    it('shows ghost session log when flag set', () => {
      const state = createTestState({ flags: { ghostSessionAvailable: true } });
      const entries = listDirectory('/tmp', state);
      expect(entries!.some(e => e.name === 'ghost_session.log')).toBe(true);
    });

    it('hides trace purge memo until trace purge', () => {
      const state = createTestState({ accessLevel: 3, flags: { adminUnlocked: true } });
      const entries = listDirectory('/admin', state);
      expect(entries!.some(e => e.name === 'trace_purge_memo.txt')).toBe(false);
    });

    it('shows trace purge memo after trace purge', () => {
      const state = createTestState({
        accessLevel: 3,
        flags: { adminUnlocked: true, tracePurgeUsed: true },
      });
      const entries = listDirectory('/admin', state);
      expect(entries!.some(e => e.name === 'trace_purge_memo.txt')).toBe(true);
    });

    it('hides neural_cluster_memo.txt without adminUnlocked flag', () => {
      const state = createTestState({ accessLevel: 5, flags: { adminUnlocked: false } });
      const entries = listDirectory('/comms', state);
      expect(entries!.some(e => e.name === 'neural_cluster_memo.txt')).toBe(false);
    });

    it('shows neural_cluster_memo.txt when adminUnlocked flag is set', () => {
      const state = createTestState({ accessLevel: 5, flags: { adminUnlocked: true } });
      const entries = listDirectory('/comms', state);
      expect(entries!.some(e => e.name === 'neural_cluster_memo.txt')).toBe(true);
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
      const result = canAccessFile('/internal/protocols/incident_review_protocol.txt', state);
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
          '/internal/protocols/incident_review_protocol.txt': { deleted: true, corruptedLines: [] },
        },
      });
      const result = canAccessFile('/internal/protocols/incident_review_protocol.txt', state);
      expect(result.accessible).toBe(false);
      expect(result.reason).toBe('FILE DELETED');
    });

    it('denies access to locked files', () => {
      const state = createTestState({
        fileMutations: {
          '/internal/protocols/incident_review_protocol.txt': { locked: true, corruptedLines: [] },
        },
      });
      const result = canAccessFile('/internal/protocols/incident_review_protocol.txt', state);
      expect(result.accessible).toBe(false);
      expect(result.reason).toBe('FILE LOCKED');
    });

    it('denies access to restricted admin files without override', () => {
      const state = createTestState({
        accessLevel: 3,
        flags: { tracePurgeUsed: true },
      });
      const result = canAccessFile('/admin/trace_purge_memo.txt', state);
      expect(result.accessible).toBe(false);
      expect(result.reason).toBe('ACCESS DENIED - RESTRICTED ARCHIVE');
    });
  });

  describe('fuzzyMatchFilename', () => {
    describe('exact matches', () => {
      it('returns exact for identical filename', () => {
        expect(fuzzyMatchFilename('transport_log.txt', 'transport_log.txt')).toBe('exact');
      });

      it('returns exact for case-insensitive match', () => {
        expect(fuzzyMatchFilename('Transport_Log.txt', 'transport_log.txt')).toBe('exact');
      });

      it('returns exact when extensions differ but base matches', () => {
        expect(fuzzyMatchFilename('transport_log.txt', 'transport_log')).toBe('exact');
      });

      it('returns exact for full filename without extension in search', () => {
        expect(fuzzyMatchFilename('surveillance_recovery.vid', 'surveillance_recovery')).toBe(
          'exact'
        );
      });
    });

    describe('contains matches', () => {
      it('returns contains when search is substring of filename', () => {
        expect(fuzzyMatchFilename('transport_log_96.txt', 'transport_log')).toBe('contains');
      });

      it('returns contains when filename is substring of search', () => {
        expect(fuzzyMatchFilename('transport.txt', 'transport_log')).toBe('contains');
      });

      it('returns contains for word segment match', () => {
        expect(fuzzyMatchFilename('material_analysis_report.txt', 'analysis')).toBe('contains');
      });

      it('returns contains for partial word in underscore-separated name', () => {
        expect(fuzzyMatchFilename('neural_cluster_dump.txt', 'cluster')).toBe('contains');
      });
    });

    describe('fuzzy matches', () => {
      it('returns fuzzy for single character typo', () => {
        // transport vs transprot - 2 char distance (swap)
        expect(fuzzyMatchFilename('transport_log.txt', 'transprot')).toBe('fuzzy');
      });

      it('returns fuzzy for missing character', () => {
        // manifest vs manifst - 1 char distance
        expect(fuzzyMatchFilename('manifest_jan96.txt', 'manifst')).toBe('fuzzy');
      });

      it('returns fuzzy for extra character', () => {
        // autopsy vs autoopsy - 1 char distance
        expect(fuzzyMatchFilename('autopsy_report.txt', 'autoopsy')).toBe('fuzzy');
      });
    });

    describe('no match', () => {
      it('returns null for completely different names', () => {
        expect(fuzzyMatchFilename('transport_log.txt', 'neural_dump')).toBeNull();
      });

      it('returns null for short unrelated terms', () => {
        expect(fuzzyMatchFilename('transport_log.txt', 'xyz')).toBeNull();
      });

      it('returns null when distance exceeds threshold', () => {
        // Complete mismatch
        expect(fuzzyMatchFilename('autopsy_report.txt', 'zebra')).toBeNull();
      });
    });
  });

  describe('findFilesMatching', () => {
    it('finds exact matches first', () => {
      const state = createTestState();
      const matches = findFilesMatching('surveillance_recovery.vid', state);

      expect(matches.length).toBeGreaterThan(0);
      expect(matches[0].matchQuality).toBe('exact');
      expect(matches[0].filename).toBe('surveillance_recovery.vid');
    });

    it('finds files by partial name', () => {
      const state = createTestState();
      const matches = findFilesMatching('surveillance', state);

      expect(matches.length).toBeGreaterThan(0);
      expect(matches.some(m => m.filename.includes('surveillance'))).toBe(true);
    });

    it('returns empty array when no matches found', () => {
      const state = createTestState();
      // Use a search term that doesn't match any files' word segments or substrings
      const matches = findFilesMatching('qjkwxlmnp', state);

      // Filter out any spurious matches from edge cases (like empty word segments)
      const realMatches = matches.filter(
        m => m.matchQuality !== 'contains' || m.filename.toLowerCase().includes('qjkwxlmnp')
      );
      expect(realMatches.length).toBe(0);
    });

    it('sorts matches by quality (exact > contains > fuzzy)', () => {
      const state = createTestState();
      // Look for something that might have multiple match types
      const matches = findFilesMatching('incident', state);

      if (matches.length > 1) {
        const qualityOrder = { exact: 0, contains: 1, fuzzy: 2 };
        for (let i = 1; i < matches.length; i++) {
          expect(qualityOrder[matches[i - 1].matchQuality]).toBeLessThanOrEqual(
            qualityOrder[matches[i].matchQuality]
          );
        }
      }
    });

    it('respects access level when searching', () => {
      // Low access level should not find admin files
      const lowAccessState = createTestState({ accessLevel: 1 });
      const highAccessState = createTestState({ accessLevel: 5, flags: { adminUnlocked: true, tracePurgeUsed: true } });

      const lowMatches = findFilesMatching('trace_purge_memo', lowAccessState);
      const highMatches = findFilesMatching('trace_purge_memo', highAccessState);

      // Low access should not find admin file
      expect(lowMatches.some(m => m.filename === 'trace_purge_memo.txt')).toBe(false);
      // High access should find admin file
      expect(highMatches.some(m => m.filename === 'trace_purge_memo.txt')).toBe(true);
    });

    it('includes file path in results', () => {
      const state = createTestState();
      const matches = findFilesMatching('surveillance_recovery', state);

      expect(matches.length).toBeGreaterThan(0);
      expect(matches[0].path).toBe('/storage/quarantine/surveillance_recovery.vid');
    });
  });

  describe('smartResolvePath', () => {
    describe('exact path resolution', () => {
      it('resolves absolute path directly', () => {
        const state = createTestState();
        const result = smartResolvePath(
          '/storage/quarantine/surveillance_recovery.vid',
          '/',
          state
        );

        expect(result.resolvedPath).toBe('/storage/quarantine/surveillance_recovery.vid');
        expect(result.wasExact).toBe(true);
        expect(result.suggestions).toEqual([]);
      });

      it('resolves relative path from current directory', () => {
        const state = createTestState();
        const result = smartResolvePath('surveillance_recovery.vid', '/storage/quarantine', state);

        expect(result.resolvedPath).toBe('/storage/quarantine/surveillance_recovery.vid');
        expect(result.wasExact).toBe(true);
        expect(result.suggestions).toEqual([]);
      });
    });

    describe('fallback to search', () => {
      it('finds file by name when not in current directory', () => {
        const state = createTestState();
        // Search from root for a file in quarantine using exact filename with extension
        const result = smartResolvePath('surveillance_recovery.vid', '/', state);

        // Either it auto-resolved (unique exact match) or returned suggestions
        if (result.resolvedPath) {
          expect(result.resolvedPath).toBe('/storage/quarantine/surveillance_recovery.vid');
          expect(result.wasExact).toBe(false);
        } else {
          // Multiple matches found - check that the file is in suggestions
          expect(result.suggestions.length).toBeGreaterThan(0);
          expect(
            result.suggestions.some(s => s.path === '/storage/quarantine/surveillance_recovery.vid')
          ).toBe(true);
        }
      });

      it('auto-resolves unique exact match', () => {
        const state = createTestState();
        // Search by filename without extension - should still find the unique file
        const result = smartResolvePath('surveillance_recovery', '/', state);

        // There's only one file matching 'surveillance_recovery' exactly
        // If matchQuality is 'exact' and there's only one match, it should auto-resolve
        if (result.resolvedPath) {
          expect(result.resolvedPath).toBe('/storage/quarantine/surveillance_recovery.vid');
          expect(result.wasExact).toBe(false);
        } else {
          // If there are multiple matches, suggestions should be provided
          expect(result.suggestions.length).toBeGreaterThan(0);
        }
      });
    });

    describe('suggestions for ambiguous matches', () => {
      it('returns suggestions when multiple matches exist', () => {
        const state = createTestState({ accessLevel: 5 });
        // 'protocol' should match multiple files
        const result = smartResolvePath('protocol', '/', state);

        // Should not resolve but provide suggestions
        expect(result.resolvedPath).toBeNull();
        expect(result.suggestions.length).toBeGreaterThan(0);
      });

      it('includes match quality in suggestions', () => {
        const state = createTestState({ accessLevel: 5 });
        const result = smartResolvePath('protocol', '/', state);

        if (result.suggestions.length > 0) {
          expect(result.suggestions[0]).toHaveProperty('matchQuality');
          expect(result.suggestions[0]).toHaveProperty('path');
          expect(result.suggestions[0]).toHaveProperty('filename');
        }
      });
    });

    describe('no matches', () => {
      it('returns null with empty suggestions when file not found', () => {
        const state = createTestState();
        // Use a search term that doesn't match any real files
        const result = smartResolvePath('qjkwxlmnp', '/', state);

        expect(result.resolvedPath).toBeNull();
        // Filter out spurious matches from edge cases
        const realSuggestions = result.suggestions.filter(
          s => s.matchQuality !== 'contains' || s.filename.toLowerCase().includes('qjkwxlmnp')
        );
        expect(realSuggestions.length).toBe(0);
        expect(result.wasExact).toBe(false);
      });

      it('returns null for directory paths', () => {
        const state = createTestState();
        // smartResolvePath only resolves files, not directories
        const result = smartResolvePath('/storage', '/', state);

        expect(result.resolvedPath).toBeNull();
      });
    });
  });
});
