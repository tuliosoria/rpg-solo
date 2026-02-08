import '@testing-library/jest-dom';
import { vi } from 'vitest';

// Guard all browser-only mocks so the setup file works in both jsdom and node environments.
const isBrowser = typeof window !== 'undefined';

// Mock ResizeObserver
class MockResizeObserver {
  callback: ResizeObserverCallback;
  
  constructor(callback: ResizeObserverCallback) {
    this.callback = callback;
  }
  
  observe(target: Element) {
    // Simulate initial size observation
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
  // Mock window.matchMedia
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

// Mock HTMLMediaElement
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
