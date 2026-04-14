import '@testing-library/jest-dom';
import { vi } from 'vitest';

vi.mock('electron', () => ({
  Tray: vi.fn().mockImplementation(() => ({
    setToolTip: vi.fn(),
    setContextMenu: vi.fn(),
    on: vi.fn(),
    destroy: vi.fn(),
  })),
  Menu: { buildFromTemplate: vi.fn().mockReturnValue({}) },
  nativeImage: {
    createFromPath: vi.fn().mockReturnValue({ isEmpty: () => false }),
    createEmpty: vi.fn().mockReturnValue({ isEmpty: () => false }),
  },
  app: {
    quit: vi.fn(),
    getPath: vi.fn().mockReturnValue('/mock/path'),
    getAppPath: vi.fn().mockReturnValue('/mock/app'),
    whenReady: vi.fn().mockResolvedValue(undefined),
    on: vi.fn(),
    isPackaged: false,
    commandLine: {
      appendSwitch: vi.fn(),
    },
  },
  screen: {
    getAllDisplays: vi.fn().mockReturnValue([{ bounds: { x: 0, y: 0, width: 1920, height: 1080 } }]),
  },
  BrowserWindow: vi.fn().mockImplementation(() => ({
    show: vi.fn(),
    hide: vi.fn(),
    focus: vi.fn(),
    close: vi.fn(),
    loadURL: vi.fn(),
    loadFile: vi.fn(),
    once: vi.fn(),
    on: vi.fn(),
    isDestroyed: vi.fn().mockReturnValue(false),
    webContents: {
      once: vi.fn(),
      send: vi.fn(),
      openDevTools: vi.fn(),
    },
  })),
  ipcMain: {
    handle: vi.fn(),
    on: vi.fn(),
  },
  ipcRenderer: {
    invoke: vi.fn(),
    on: vi.fn(),
    send: vi.fn(),
  },
  contextBridge: {
    exposeInMainWorld: vi.fn(),
  },
  crashReporter: {
    start: vi.fn(),
  },
}));

const isBrowser = typeof window !== 'undefined';

function createMemoryStorage(): Storage {
  const store = new Map<string, string>();

  return {
    get length() {
      return store.size;
    },
    clear() {
      store.clear();
    },
    getItem(key: string) {
      return store.has(key) ? store.get(key)! : null;
    },
    key(index: number) {
      return Array.from(store.keys())[index] ?? null;
    },
    removeItem(key: string) {
      store.delete(String(key));
    },
    setItem(key: string, value: string) {
      store.set(String(key), String(value));
    },
  };
}

function hasUsableStorage(storage: unknown): storage is Storage {
  return Boolean(
    storage &&
      typeof storage === 'object' &&
      typeof (storage as Storage).getItem === 'function' &&
      typeof (storage as Storage).setItem === 'function' &&
      typeof (storage as Storage).removeItem === 'function' &&
      typeof (storage as Storage).clear === 'function'
  );
}

if (isBrowser && !hasUsableStorage(window.localStorage)) {
  const memoryStorage = createMemoryStorage();

  Object.defineProperty(window, 'localStorage', {
    configurable: true,
    value: memoryStorage,
  });

  Object.defineProperty(globalThis, 'localStorage', {
    configurable: true,
    value: memoryStorage,
  });
}

class MockResizeObserver {
  callback: ResizeObserverCallback;

  constructor(callback: ResizeObserverCallback) {
    this.callback = callback;
  }

  observe(target: Element) {
    this.callback([{
      target,
      contentRect: { height: 50, width: 100 } as DOMRectReadOnly,
      borderBoxSize: [{ blockSize: 50, inlineSize: 100 }],
      contentBoxSize: [{ blockSize: 50, inlineSize: 100 }],
      devicePixelContentBoxSize: [],
    }], this);
  }

  unobserve() {}
  disconnect() {}
}

if (typeof globalThis.ResizeObserver === 'undefined') {
  global.ResizeObserver = MockResizeObserver as unknown as typeof ResizeObserver;
}

if (isBrowser) {
  Object.defineProperty(window, 'matchMedia', {
    writable: true,
    value: vi.fn().mockImplementation(query => ({
      matches: false,
      media: query,
      onchange: null,
      addListener: vi.fn(),
      removeListener: vi.fn(),
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      dispatchEvent: vi.fn(),
    })),
  });
}

if (typeof HTMLMediaElement !== 'undefined') {
  Object.defineProperty(HTMLMediaElement.prototype, 'play', {
    configurable: true,
    value: vi.fn().mockResolvedValue(undefined),
  });

  Object.defineProperty(HTMLMediaElement.prototype, 'pause', {
    configurable: true,
    value: vi.fn(),
  });

  Object.defineProperty(HTMLMediaElement.prototype, 'load', {
    configurable: true,
    value: vi.fn(),
  });
}
