/**
 * Tests for Window State Module
 *
 * These tests mock the Electron APIs to test the window state
 * persistence module without requiring Electron to be running.
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';

vi.mock('electron', () => ({
  app: { getPath: vi.fn().mockReturnValue('/mock/path') },
  screen: {
    getAllDisplays: vi.fn().mockReturnValue([
      { bounds: { x: 0, y: 0, width: 1920, height: 1080 } },
    ]),
  },
}));

vi.mock('fs', () => ({
  default: {},
  existsSync: vi.fn().mockReturnValue(false),
  readFileSync: vi.fn(),
  writeFileSync: vi.fn(),
}));

vi.mock('path', () => ({
  default: {},
  join: vi.fn().mockReturnValue('/mock/state/path'),
}));

describe('Window State Module', () => {
  let windowState: ReturnType<typeof require>;

  beforeEach(() => {
    vi.resetModules();
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    windowState = require('../window-state');
  });

  it('can import the window state module without errors', () => {
    expect(windowState).toBeDefined();
  });

  it('exports expected functions', () => {
    expect(typeof windowState.loadState).toBe('function');
    expect(typeof windowState.createWindowStateManager).toBe('function');
  });

  it('loadState returns default state when no file exists', () => {
    const state = windowState.loadState();

    expect(state).toHaveProperty('width', 1200);
    expect(state).toHaveProperty('height', 800);
    expect(state).toHaveProperty('isMaximized', false);
  });
});