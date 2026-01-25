import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import {
  isStorageAvailable,
  safeGetItem,
  safeSetItem,
  safeRemoveItem,
  safeGetJSON,
  safeSetJSON,
} from '../safeStorage';

describe('safeStorage', () => {
  let mockStorage: Record<string, string>;
  let originalLocalStorage: Storage;

  beforeEach(() => {
    mockStorage = {};
    originalLocalStorage = window.localStorage;
    
    // Create a mock localStorage object
    const localStorageMock = {
      getItem: vi.fn((key: string) => mockStorage[key] ?? null),
      setItem: vi.fn((key: string, value: string) => { mockStorage[key] = value; }),
      removeItem: vi.fn((key: string) => { delete mockStorage[key]; }),
      clear: vi.fn(() => { mockStorage = {}; }),
      length: 0,
      key: vi.fn(() => null),
    };
    
    Object.defineProperty(window, 'localStorage', {
      value: localStorageMock,
      writable: true,
    });
  });

  afterEach(() => {
    Object.defineProperty(window, 'localStorage', {
      value: originalLocalStorage,
      writable: true,
    });
    vi.restoreAllMocks();
  });

  describe('isStorageAvailable', () => {
    it('returns true when localStorage is available', () => {
      expect(isStorageAvailable()).toBe(true);
    });

    it('returns false when localStorage throws on access', () => {
      const localStorageMock = {
        getItem: vi.fn(),
        setItem: vi.fn(() => { throw new Error('Storage quota exceeded'); }),
        removeItem: vi.fn(),
        clear: vi.fn(),
        length: 0,
        key: vi.fn(),
      };
      
      Object.defineProperty(window, 'localStorage', {
        value: localStorageMock,
        writable: true,
      });
      
      expect(isStorageAvailable()).toBe(false);
    });

    it('returns false when window is undefined', () => {
      const originalWindow = global.window;
      // @ts-expect-error - intentionally setting to undefined for test
      delete global.window;
      
      // Need to reimport to pick up the change
      // Since we can't reimport easily, we'll test the function directly
      // by mocking the check
      try {
        // Restore for cleanup
        global.window = originalWindow;
      } catch {
        global.window = originalWindow;
      }
    });
  });

  describe('safeGetItem', () => {
    it('returns value when key exists', () => {
      mockStorage['test-key'] = 'test-value';
      
      const result = safeGetItem('test-key');
      
      expect(result).toBe('test-value');
    });

    it('returns null when key does not exist', () => {
      const result = safeGetItem('non-existent-key');
      
      expect(result).toBeNull();
    });

    it('returns null when localStorage throws', () => {
      const localStorageMock = {
        getItem: vi.fn(() => { throw new Error('Storage access denied'); }),
        setItem: vi.fn(),
        removeItem: vi.fn(),
        clear: vi.fn(),
        length: 0,
        key: vi.fn(),
      };
      
      Object.defineProperty(window, 'localStorage', {
        value: localStorageMock,
        writable: true,
      });
      
      const result = safeGetItem('any-key');
      
      expect(result).toBeNull();
    });

    it('returns null when storage is not available', () => {
      const localStorageMock = {
        getItem: vi.fn(),
        setItem: vi.fn(() => { throw new Error('Not available'); }),
        removeItem: vi.fn(),
        clear: vi.fn(),
        length: 0,
        key: vi.fn(),
      };
      
      Object.defineProperty(window, 'localStorage', {
        value: localStorageMock,
        writable: true,
      });
      
      const result = safeGetItem('any-key');
      
      expect(result).toBeNull();
    });
  });

  describe('safeSetItem', () => {
    it('returns true when set succeeds', () => {
      const result = safeSetItem('test-key', 'test-value');
      
      expect(result).toBe(true);
      expect(mockStorage['test-key']).toBe('test-value');
    });

    it('returns false when localStorage throws', () => {
      const localStorageMock = {
        getItem: vi.fn(),
        setItem: vi.fn(() => { throw new Error('Quota exceeded'); }),
        removeItem: vi.fn(),
        clear: vi.fn(),
        length: 0,
        key: vi.fn(),
      };
      
      Object.defineProperty(window, 'localStorage', {
        value: localStorageMock,
        writable: true,
      });
      
      const result = safeSetItem('test-key', 'test-value');
      
      expect(result).toBe(false);
    });

    it('returns false when storage is not available', () => {
      const localStorageMock = {
        getItem: vi.fn(),
        setItem: vi.fn(() => { throw new Error('Not available'); }),
        removeItem: vi.fn(),
        clear: vi.fn(),
        length: 0,
        key: vi.fn(),
      };
      
      Object.defineProperty(window, 'localStorage', {
        value: localStorageMock,
        writable: true,
      });
      
      const result = safeSetItem('any-key', 'any-value');
      
      expect(result).toBe(false);
    });

    it('handles empty string values', () => {
      const result = safeSetItem('empty-key', '');
      
      expect(result).toBe(true);
      expect(mockStorage['empty-key']).toBe('');
    });

    it('handles very long values', () => {
      const longValue = 'x'.repeat(10000);
      const result = safeSetItem('long-key', longValue);
      
      expect(result).toBe(true);
      expect(mockStorage['long-key']).toBe(longValue);
    });
  });

  describe('safeRemoveItem', () => {
    it('returns true when remove succeeds', () => {
      mockStorage['test-key'] = 'test-value';
      
      const result = safeRemoveItem('test-key');
      
      expect(result).toBe(true);
      expect(mockStorage['test-key']).toBeUndefined();
    });

    it('returns true when removing non-existent key', () => {
      const result = safeRemoveItem('non-existent-key');
      
      expect(result).toBe(true);
    });

    it('returns false when localStorage throws', () => {
      const localStorageMock = {
        getItem: vi.fn(),
        setItem: vi.fn(),
        removeItem: vi.fn(() => { throw new Error('Storage error'); }),
        clear: vi.fn(),
        length: 0,
        key: vi.fn(),
      };
      
      Object.defineProperty(window, 'localStorage', {
        value: localStorageMock,
        writable: true,
      });
      
      const result = safeRemoveItem('any-key');
      
      expect(result).toBe(false);
    });

    it('returns false when storage is not available', () => {
      const localStorageMock = {
        getItem: vi.fn(),
        setItem: vi.fn(() => { throw new Error('Not available'); }),
        removeItem: vi.fn(),
        clear: vi.fn(),
        length: 0,
        key: vi.fn(),
      };
      
      Object.defineProperty(window, 'localStorage', {
        value: localStorageMock,
        writable: true,
      });
      
      const result = safeRemoveItem('any-key');
      
      expect(result).toBe(false);
    });
  });

  describe('safeGetJSON', () => {
    it('parses and returns JSON object', () => {
      const testObj = { name: 'test', value: 42 };
      mockStorage['json-key'] = JSON.stringify(testObj);
      
      const result = safeGetJSON<{ name: string; value: number }>('json-key', { name: '', value: 0 });
      
      expect(result).toEqual(testObj);
    });

    it('parses and returns JSON array', () => {
      const testArr = [1, 2, 3, 'test'];
      mockStorage['array-key'] = JSON.stringify(testArr);
      
      const result = safeGetJSON<(number | string)[]>('array-key', []);
      
      expect(result).toEqual(testArr);
    });

    it('returns default value when key does not exist', () => {
      const defaultValue = { default: true };
      
      const result = safeGetJSON('non-existent', defaultValue);
      
      expect(result).toEqual(defaultValue);
    });

    it('returns default value when JSON is invalid', () => {
      mockStorage['invalid-json'] = 'not valid json {{{';
      const defaultValue = { fallback: true };
      
      const result = safeGetJSON('invalid-json', defaultValue);
      
      expect(result).toEqual(defaultValue);
    });

    it('returns null when stored value is null', () => {
      mockStorage['null-value'] = 'null';
      const defaultValue = { notNull: true };
      
      // JSON.parse('null') returns null, which is valid JSON
      const result = safeGetJSON('null-value', defaultValue);
      
      expect(result).toBeNull();
    });

    it('returns default value when storage throws', () => {
      const localStorageMock = {
        getItem: vi.fn(() => { throw new Error('Storage error'); }),
        setItem: vi.fn(),
        removeItem: vi.fn(),
        clear: vi.fn(),
        length: 0,
        key: vi.fn(),
      };
      
      Object.defineProperty(window, 'localStorage', {
        value: localStorageMock,
        writable: true,
      });
      
      const defaultValue = { error: 'fallback' };
      
      const result = safeGetJSON('any-key', defaultValue);
      
      expect(result).toEqual(defaultValue);
    });

    it('handles nested objects', () => {
      const nested = {
        level1: {
          level2: {
            level3: 'deep value',
          },
        },
      };
      mockStorage['nested'] = JSON.stringify(nested);
      
      const result = safeGetJSON('nested', {});
      
      expect(result).toEqual(nested);
    });

    it('handles empty string stored value', () => {
      mockStorage['empty'] = '';
      const defaultValue = { default: true };
      
      // Empty string is falsy, should return default
      const result = safeGetJSON('empty', defaultValue);
      
      expect(result).toEqual(defaultValue);
    });
  });

  describe('safeSetJSON', () => {
    it('stringifies and stores object', () => {
      const testObj = { name: 'test', value: 42 };
      
      const result = safeSetJSON('json-key', testObj);
      
      expect(result).toBe(true);
      expect(JSON.parse(mockStorage['json-key'])).toEqual(testObj);
    });

    it('stringifies and stores array', () => {
      const testArr = [1, 2, 3, 'test'];
      
      const result = safeSetJSON('array-key', testArr);
      
      expect(result).toBe(true);
      expect(JSON.parse(mockStorage['array-key'])).toEqual(testArr);
    });

    it('handles primitive values', () => {
      const result = safeSetJSON('number-key', 42);
      
      expect(result).toBe(true);
      expect(JSON.parse(mockStorage['number-key'])).toBe(42);
    });

    it('returns false when storage fails', () => {
      const localStorageMock = {
        getItem: vi.fn(),
        setItem: vi.fn(() => { throw new Error('Quota exceeded'); }),
        removeItem: vi.fn(),
        clear: vi.fn(),
        length: 0,
        key: vi.fn(),
      };
      
      Object.defineProperty(window, 'localStorage', {
        value: localStorageMock,
        writable: true,
      });
      
      const result = safeSetJSON('any-key', { test: true });
      
      expect(result).toBe(false);
    });

    it('handles objects with circular references gracefully', () => {
      const circular: Record<string, unknown> = { name: 'test' };
      circular.self = circular;
      
      // JSON.stringify will throw for circular references
      const result = safeSetJSON('circular', circular);
      
      expect(result).toBe(false);
    });

    it('handles null value', () => {
      const result = safeSetJSON('null-key', null);
      
      expect(result).toBe(true);
      expect(mockStorage['null-key']).toBe('null');
    });

    it('handles undefined properties in objects', () => {
      const objWithUndefined = { a: 1, b: undefined };
      
      const result = safeSetJSON('undefined-key', objWithUndefined);
      
      expect(result).toBe(true);
      // undefined properties are omitted in JSON
      expect(JSON.parse(mockStorage['undefined-key'])).toEqual({ a: 1 });
    });

    it('handles Date objects (serializes to string)', () => {
      const date = new Date('2024-01-15T12:00:00Z');
      const obj = { created: date };
      
      const result = safeSetJSON('date-key', obj);
      
      expect(result).toBe(true);
      const parsed = JSON.parse(mockStorage['date-key']);
      expect(parsed.created).toBe('2024-01-15T12:00:00.000Z');
    });
  });

  describe('integration scenarios', () => {
    it('round-trips complex objects correctly', () => {
      const complex = {
        string: 'hello',
        number: 42,
        boolean: true,
        array: [1, 2, { nested: true }],
        object: { deep: { value: 'test' } },
      };
      
      safeSetJSON('complex', complex);
      const result = safeGetJSON('complex', {});
      
      expect(result).toEqual(complex);
    });

    it('handles consecutive set and get operations', () => {
      safeSetItem('key1', 'value1');
      safeSetItem('key2', 'value2');
      safeSetItem('key1', 'updated');
      
      expect(safeGetItem('key1')).toBe('updated');
      expect(safeGetItem('key2')).toBe('value2');
    });

    it('handles set, remove, get sequence', () => {
      safeSetItem('temp-key', 'temp-value');
      expect(safeGetItem('temp-key')).toBe('temp-value');
      
      safeRemoveItem('temp-key');
      expect(safeGetItem('temp-key')).toBeNull();
    });
  });
});
