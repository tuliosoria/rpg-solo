/**
 * Tests for System Tray Module
 *
 * These tests mock the Electron APIs to test the system tray
 * functionality without requiring Electron to be running.
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';

const { mockTrayConstructor, mockBuildMenu } = vi.hoisted(() => {
  const trayInstance = {
    setToolTip: vi.fn(),
    setContextMenu: vi.fn(),
    on: vi.fn(),
    destroy: vi.fn(),
  };

  return {
    mockTrayConstructor: vi.fn().mockImplementation(() => trayInstance),
    mockBuildMenu: vi.fn().mockReturnValue({}),
  };
});

vi.mock('electron', () => ({
  Tray: mockTrayConstructor,
  Menu: { buildFromTemplate: mockBuildMenu },
  nativeImage: {
    createFromPath: vi.fn().mockReturnValue({ isEmpty: () => false }),
    createEmpty: vi.fn().mockReturnValue({ isEmpty: () => false }),
  },
  app: { quit: vi.fn(), isPackaged: false },
}));

vi.mock('path', () => ({
  default: {},
  join: vi.fn().mockReturnValue('/mock/path'),
}));

describe('System Tray Module', () => {
  let trayModule: ReturnType<typeof require>;

  beforeEach(() => {
    vi.resetModules();
    vi.clearAllMocks();
     
    trayModule = require('../tray');
  });

  it('can import the tray module without errors', () => {
    expect(trayModule).toBeDefined();
  });

  it('exports expected functions', () => {
    expect(typeof trayModule.initialize).toBe('function');
    expect(typeof trayModule.updateTooltip).toBe('function');
    expect(typeof trayModule.getTrayStatus).toBe('function');
    expect(typeof trayModule.updateFromGameState).toBe('function');
    expect(typeof trayModule.isMinimizeToTrayEnabled).toBe('function');
    expect(typeof trayModule.setMinimizeToTray).toBe('function');
    expect(typeof trayModule.destroy).toBe('function');
    expect(typeof trayModule.getTray).toBe('function');
  });

  it('handles minimize to tray settings', () => {
    // Test default state
    expect(trayModule.isMinimizeToTrayEnabled()).toBe(false);

    // Test setting
    trayModule.setMinimizeToTray(false);
    expect(trayModule.isMinimizeToTrayEnabled()).toBe(false);

    trayModule.setMinimizeToTray(true);
    expect(trayModule.isMinimizeToTrayEnabled()).toBe(true);
  });

  it('returns null tray initially', () => {
    expect(trayModule.getTray()).toBeNull();
  });

  it('treats isGameOver renderer state as a completed session', () => {
    expect(trayModule.getTrayStatus({ isGameOver: true, gameWon: true })).toBe('Victory!');
  });
});
