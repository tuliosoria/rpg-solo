// @vitest-environment node
import { expect, it, vi } from 'vitest';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import vm from 'node:vm';
import { createRequire } from 'node:module';

// Exercise the packaged startup failure handler without opening native windows
// or starting Steam, update checks, or a server outside this test fixture.
it('closes the splash and quits without loading another origin after a bind failure', async () => {
  const mainPath = resolve(__dirname, '../main.js');
  const nativeRequire = createRequire(mainPath);
  const loadURL = vi.fn();
  const closeSplash = vi.fn();
  const quit = vi.fn();
  const showErrorBox = vi.fn();
  const listen = vi.fn().mockRejectedValue(new Error('Port 43196 is already in use.'));
  class BrowserWindow {
    webContents = { once: vi.fn() };
    loadURL = loadURL;
    isDestroyed = () => false;
  }
  const electron = {
    app: {
      isPackaged: true,
      commandLine: { appendSwitch: vi.fn() },
      whenReady: () => ({ then: vi.fn() }),
      on: vi.fn(),
      quit,
    },
    BrowserWindow,
    ipcMain: { handle: vi.fn(), on: vi.fn() },
    dialog: { showErrorBox },
    crashReporter: { start: vi.fn() },
  };
  const fixtureRequire = (name: string) => {
    if (name === 'electron') return electron;
    if (name === './stable-port') return { listenOnStablePort: listen };
    if (name === './window-state')
      return { loadState: () => ({}), createWindowStateManager: () => ({}) };
    if (name === './tray') return { initialize: vi.fn() };
    if (name === 'http') return { createServer: () => ({}) };
    return nativeRequire(name);
  };
  vm.runInNewContext(
    readFileSync(mainPath, 'utf8') + '\nsplashWindow = testSplash; createWindow();',
    {
      require: fixtureRequire,
      __dirname: resolve(__dirname, '..'),
      process: { env: {}, argv: [], platform: process.platform },
      console: { log: vi.fn(), error: vi.fn() },
      testSplash: { isDestroyed: () => false, close: closeSplash, webContents: { send: vi.fn() } },
      setTimeout,
      clearTimeout,
      setInterval,
      clearInterval,
      setImmediate,
    }
  );
  await new Promise<void>(resolve => setImmediate(resolve));
  expect(listen).toHaveBeenCalledTimes(1);
  expect(loadURL).not.toHaveBeenCalled();
  expect(closeSplash).toHaveBeenCalledTimes(1);
  expect(showErrorBox).toHaveBeenCalledWith(
    'Unable to start',
    expect.stringContaining('Port 43196 is already in use')
  );
  expect(quit).toHaveBeenCalledTimes(1);
});
