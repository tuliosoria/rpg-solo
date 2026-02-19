import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useOptions, DEFAULT_OPTIONS, OptionsProvider, useOptionsContext } from '../useOptions';
import React from 'react';

describe('useOptions', () => {
  beforeEach(() => {
    // Clear localStorage before each test
    localStorage.clear();
    // Reset document.documentElement style
    document.documentElement.style.cssText = '';
    // Reset body classes
    document.body.className = '';
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('Default Values', () => {
    it('returns default options on initial load', () => {
      const { result } = renderHook(() => useOptions());

      expect(result.current.options).toEqual(DEFAULT_OPTIONS);
    });

    it('has all audio toggles ON by default', () => {
      const { result } = renderHook(() => useOptions());

      expect(result.current.options.ambientSoundEnabled).toBe(true);
      expect(result.current.options.soundEffectsEnabled).toBe(true);
      expect(result.current.options.turingVoiceEnabled).toBe(true);
    });

    it('has volume at 100% by default', () => {
      const { result } = renderHook(() => useOptions());

      expect(result.current.options.masterVolume).toBe(100);
    });

    it('has CRT and flicker effects ON by default', () => {
      const { result } = renderHook(() => useOptions());

      expect(result.current.options.crtEffectsEnabled).toBe(true);
      expect(result.current.options.screenFlickerEnabled).toBe(true);
    });

    it('has flicker intensity set to medium by default', () => {
      const { result } = renderHook(() => useOptions());

      expect(result.current.options.flickerIntensity).toBe('medium');
    });

    it('has font size set to medium by default', () => {
      const { result } = renderHook(() => useOptions());

      expect(result.current.options.fontSize).toBe('medium');
    });
  });

  describe('localStorage Persistence', () => {
    it('saves options to localStorage when changed', async () => {
      const { result } = renderHook(() => useOptions());

      // Wait for isLoaded to become true
      await vi.waitFor(() => expect(result.current.isLoaded).toBe(true));

      act(() => {
        result.current.setOption('masterVolume', 50);
      });

      // Check localStorage was updated
      const stored = JSON.parse(localStorage.getItem('terminal1996_options') || '{}');
      expect(stored.masterVolume).toBe(50);
    });

    it('loads options from localStorage on mount', async () => {
      // Set options in localStorage before rendering hook
      localStorage.setItem(
        'terminal1996_options',
        JSON.stringify({ masterVolume: 75, fontSize: 'large' })
      );

      const { result } = renderHook(() => useOptions());

      // Wait for isLoaded
      await vi.waitFor(() => expect(result.current.isLoaded).toBe(true));

      expect(result.current.options.masterVolume).toBe(75);
      expect(result.current.options.fontSize).toBe('large');
      // Other options should still have defaults
      expect(result.current.options.crtEffectsEnabled).toBe(true);
    });

    it('merges stored options with defaults for new options', async () => {
      // Simulate old stored options missing new keys
      localStorage.setItem(
        'terminal1996_options',
        JSON.stringify({ masterVolume: 80 })
      );

      const { result } = renderHook(() => useOptions());

      await vi.waitFor(() => expect(result.current.isLoaded).toBe(true));

      // Should have stored value
      expect(result.current.options.masterVolume).toBe(80);
      // Should have defaults for missing keys
      expect(result.current.options.flickerIntensity).toBe('medium');
      expect(result.current.options.fontSize).toBe('medium');
    });
  });

  describe('Individual Option Setters', () => {
    it('setOption updates masterVolume', async () => {
      const { result } = renderHook(() => useOptions());

      await vi.waitFor(() => expect(result.current.isLoaded).toBe(true));

      act(() => {
        result.current.setOption('masterVolume', 42);
      });

      expect(result.current.options.masterVolume).toBe(42);
    });

    it('setOption updates boolean toggles', async () => {
      const { result } = renderHook(() => useOptions());

      await vi.waitFor(() => expect(result.current.isLoaded).toBe(true));

      act(() => {
        result.current.setOption('crtEffectsEnabled', false);
      });

      expect(result.current.options.crtEffectsEnabled).toBe(false);
    });

    it('setOption updates flickerIntensity', async () => {
      const { result } = renderHook(() => useOptions());

      await vi.waitFor(() => expect(result.current.isLoaded).toBe(true));

      act(() => {
        result.current.setOption('flickerIntensity', 'high');
      });

      expect(result.current.options.flickerIntensity).toBe('high');
    });

    it('setOption updates fontSize', async () => {
      const { result } = renderHook(() => useOptions());

      await vi.waitFor(() => expect(result.current.isLoaded).toBe(true));

      act(() => {
        result.current.setOption('fontSize', 'small');
      });

      expect(result.current.options.fontSize).toBe('small');
    });

    it('resetOptions restores all defaults', async () => {
      const { result } = renderHook(() => useOptions());

      await vi.waitFor(() => expect(result.current.isLoaded).toBe(true));

      // Change some options
      act(() => {
        result.current.setOption('masterVolume', 25);
        result.current.setOption('crtEffectsEnabled', false);
        result.current.setOption('fontSize', 'large');
      });

      // Reset
      act(() => {
        result.current.resetOptions();
      });

      expect(result.current.options).toEqual(DEFAULT_OPTIONS);
    });
  });

  describe('CSS Variables for Font Size', () => {
    it('applies CSS variable for medium font size', async () => {
      const { result } = renderHook(() => useOptions());

      await vi.waitFor(() => expect(result.current.isLoaded).toBe(true));

      expect(document.documentElement.style.getPropertyValue('--terminal-font-size')).toBe('14px');
    });

    it('applies CSS variable for small font size', async () => {
      const { result } = renderHook(() => useOptions());

      await vi.waitFor(() => expect(result.current.isLoaded).toBe(true));

      act(() => {
        result.current.setOption('fontSize', 'small');
      });

      expect(document.documentElement.style.getPropertyValue('--terminal-font-size')).toBe('12px');
    });

    it('applies CSS variable for large font size', async () => {
      const { result } = renderHook(() => useOptions());

      await vi.waitFor(() => expect(result.current.isLoaded).toBe(true));

      act(() => {
        result.current.setOption('fontSize', 'large');
      });

      expect(document.documentElement.style.getPropertyValue('--terminal-font-size')).toBe('16px');
    });
  });

  describe('Body Classes for CRT/Flicker Effects', () => {
    it('toggles crt-effects-disabled class on body', async () => {
      const { result } = renderHook(() => useOptions());

      await vi.waitFor(() => expect(result.current.isLoaded).toBe(true));

      // Default: CRT on, so no disabled class
      expect(document.body.classList.contains('crt-effects-disabled')).toBe(false);

      act(() => {
        result.current.setOption('crtEffectsEnabled', false);
      });

      expect(document.body.classList.contains('crt-effects-disabled')).toBe(true);

      act(() => {
        result.current.setOption('crtEffectsEnabled', true);
      });

      expect(document.body.classList.contains('crt-effects-disabled')).toBe(false);
    });

    it('toggles screen-flicker-disabled class on body', async () => {
      const { result } = renderHook(() => useOptions());

      await vi.waitFor(() => expect(result.current.isLoaded).toBe(true));

      // Default: flicker on, so no disabled class
      expect(document.body.classList.contains('screen-flicker-disabled')).toBe(false);

      act(() => {
        result.current.setOption('screenFlickerEnabled', false);
      });

      expect(document.body.classList.contains('screen-flicker-disabled')).toBe(true);
    });

    it('sets flicker intensity CSS variable', async () => {
      const { result } = renderHook(() => useOptions());

      await vi.waitFor(() => expect(result.current.isLoaded).toBe(true));

      // Default: medium = 0.05
      expect(document.documentElement.style.getPropertyValue('--flicker-intensity')).toBe('0.05');

      act(() => {
        result.current.setOption('flickerIntensity', 'low');
      });

      expect(document.documentElement.style.getPropertyValue('--flicker-intensity')).toBe('0.02');

      act(() => {
        result.current.setOption('flickerIntensity', 'high');
      });

      expect(document.documentElement.style.getPropertyValue('--flicker-intensity')).toBe('0.1');
    });
  });

  describe('OptionsProvider and useOptionsContext', () => {
    it('provides options through context', () => {
      const wrapper = ({ children }: { children: React.ReactNode }) => (
        <OptionsProvider>{children}</OptionsProvider>
      );

      const { result } = renderHook(() => useOptionsContext(), { wrapper });

      expect(result.current.options).toEqual(DEFAULT_OPTIONS);
    });

    it('throws error when used outside provider', () => {
      // Suppress console.error for this test
      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

      expect(() => {
        renderHook(() => useOptionsContext());
      }).toThrow('useOptionsContext must be used within an OptionsProvider');

      consoleSpy.mockRestore();
    });
  });
});
