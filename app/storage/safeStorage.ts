// Safe localStorage utilities with consistent error handling
// All operations silently fail if localStorage is unavailable

/**
 * Check if localStorage is available and functional
 */
export function isStorageAvailable(): boolean {
  try {
    if (typeof window === 'undefined' || typeof window.localStorage === 'undefined') {
      return false;
    }
    // Test that we can actually read/write
    const testKey = '__storage_test__';
    window.localStorage.setItem(testKey, testKey);
    window.localStorage.removeItem(testKey);
    return true;
  } catch {
    return false;
  }
}

/**
 * Safely get an item from localStorage
 * @returns The value or null if not found or error
 */
export function safeGetItem(key: string): string | null {
  try {
    if (!isStorageAvailable()) return null;
    return window.localStorage.getItem(key);
  } catch {
    return null;
  }
}

/**
 * Safely set an item in localStorage
 * @returns true if successful, false otherwise
 */
export function safeSetItem(key: string, value: string): boolean {
  try {
    if (!isStorageAvailable()) return false;
    window.localStorage.setItem(key, value);
    return true;
  } catch {
    // Quota exceeded or other error
    return false;
  }
}

/**
 * Safely remove an item from localStorage
 * @returns true if successful, false otherwise  
 */
export function safeRemoveItem(key: string): boolean {
  try {
    if (!isStorageAvailable()) return false;
    window.localStorage.removeItem(key);
    return true;
  } catch {
    return false;
  }
}

/**
 * Safely parse JSON from localStorage
 * @returns Parsed object or defaultValue if not found/invalid
 */
export function safeGetJSON<T>(key: string, defaultValue: T): T {
  try {
    const raw = safeGetItem(key);
    if (!raw) return defaultValue;
    return JSON.parse(raw) as T;
  } catch {
    return defaultValue;
  }
}

/**
 * Safely stringify and store JSON in localStorage
 * @returns true if successful, false otherwise
 */
export function safeSetJSON<T>(key: string, value: T): boolean {
  try {
    return safeSetItem(key, JSON.stringify(value));
  } catch {
    return false;
  }
}
