/**
 * Tests for Window State Module
 *
 * These tests mock the Electron APIs to test the window state
 * persistence module without requiring Electron to be running.
 */

import { describe, it, expect, vi } from 'vitest';

describe('Window State Module', () => {
  it('can import the window state module without errors', () => {
    // Mock electron and fs before import
    vi.doMock('electron', () => ({
      app: { getPath: vi.fn().mockReturnValue('/mock/path') },
      screen: {
        getAllDisplays: vi.fn().mockReturnValue([
          { bounds: { x: 0, y: 0, width: 1920, height: 1080 } }
        ])
      },
    }));

    vi.doMock('fs', () => ({
      existsSync: vi.fn().mockReturnValue(false),
      readFileSync: vi.fn(),
      writeFileSync: vi.fn(),
    }));

    vi.doMock('path', () => ({
      join: vi.fn().mockReturnValue('/mock/state/path'),
    }));

    expect(() => {
      // eslint-disable-next-line @typescript-eslint/no-require-imports
      require('../window-state');
    }).not.toThrow();
  });

  it('exports expected functions', () => {
    // Mock electron and fs before import
    vi.doMock('electron', () => ({
      app: { getPath: vi.fn().mockReturnValue('/mock/path') },
      screen: {
        getAllDisplays: vi.fn().mockReturnValue([
          { bounds: { x: 0, y: 0, width: 1920, height: 1080 } }
        ])
      },
    }));

    vi.doMock('fs', () => ({
      existsSync: vi.fn().mockReturnValue(false),
      readFileSync: vi.fn(),
      writeFileSync: vi.fn(),
    }));

    vi.doMock('path', () => ({
      join: vi.fn().mockReturnValue('/mock/state/path'),
    }));

    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const windowState = require('../window-state');

    expect(typeof windowState.loadState).toBe('function');
    expect(typeof windowState.createWindowStateManager).toBe('function');
  });

  it('loadState returns default state when no file exists', () => {
    // Mock electron and fs before import
    vi.doMock('electron', () => ({
      app: { getPath: vi.fn().mockReturnValue('/mock/path') },
      screen: {
        getAllDisplays: vi.fn().mockReturnValue([
          { bounds: { x: 0, y: 0, width: 1920, height: 1080 } }
        ])
      },
    }));

    vi.doMock('fs', () => ({
      existsSync: vi.fn().mockReturnValue(false),
      readFileSync: vi.fn(),
      writeFileSync: vi.fn(),
    }));

    vi.doMock('path', () => ({
      join: vi.fn().mockReturnValue('/mock/state/path'),
    }));

    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const windowState = require('../window-state');

    const state = windowState.loadState();

    expect(state).toHaveProperty('width', 1200);
    expect(state).toHaveProperty('height', 800);
    expect(state).toHaveProperty('isMaximized', false);
  });
});