'use client';

/**
 * useOptions - Game Options State Management
 *
 * Provides persistent storage and reactive state for audio/visual options.
 * Options are saved to localStorage and applied immediately without restart.
 *
 * @module hooks/useOptions
 */

import { useState, useEffect, useCallback } from 'react';

// ═══════════════════════════════════════════════════════════════════════════
// TYPES
// ═══════════════════════════════════════════════════════════════════════════

export type FlickerIntensity = 'low' | 'medium' | 'high';
export type FontSize = 'small' | 'medium' | 'large';

export interface OptionsState {
  // Audio Options
  masterVolume: number; // 0-100
  ambientSoundEnabled: boolean;
  soundEffectsEnabled: boolean;
  turingVoiceEnabled: boolean;

  // Visual Options
  crtEffectsEnabled: boolean;
  screenFlickerEnabled: boolean;
  flickerIntensity: FlickerIntensity;
  fontSize: FontSize;
}

// ═══════════════════════════════════════════════════════════════════════════
// CONSTANTS
// ═══════════════════════════════════════════════════════════════════════════

const STORAGE_KEY = 'terminal1996_options';

export const DEFAULT_OPTIONS: OptionsState = {
  // Audio defaults: all ON, volume 100%
  masterVolume: 100,
  ambientSoundEnabled: true,
  soundEffectsEnabled: true,
  turingVoiceEnabled: true,

  // Visual defaults: all ON, flicker medium, font medium
  crtEffectsEnabled: true,
  screenFlickerEnabled: true,
  flickerIntensity: 'medium',
  fontSize: 'medium',
};

// ═══════════════════════════════════════════════════════════════════════════
// HOOK
// ═══════════════════════════════════════════════════════════════════════════

export interface UseOptionsReturn {
  options: OptionsState;
  setOption: <K extends keyof OptionsState>(key: K, value: OptionsState[K]) => void;
  resetOptions: () => void;
  isLoaded: boolean;
}

export function useOptions(): UseOptionsReturn {
  const [options, setOptions] = useState<OptionsState>(DEFAULT_OPTIONS);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load options from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored) as Partial<OptionsState>;
        // Merge with defaults to handle new options added in updates
        setOptions({ ...DEFAULT_OPTIONS, ...parsed });
      }
    } catch (e) {
      console.warn('[useOptions] Failed to load options from localStorage:', e);
    }
    setIsLoaded(true);
  }, []);

  // Save options to localStorage whenever they change (after initial load)
  useEffect(() => {
    if (isLoaded) {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(options));
      } catch (e) {
        console.warn('[useOptions] Failed to save options to localStorage:', e);
      }
    }
  }, [options, isLoaded]);

  // Apply CSS variables for font size
  useEffect(() => {
    if (isLoaded) {
      const root = document.documentElement;
      const fontSizeMap: Record<FontSize, string> = {
        small: '12px',
        medium: '14px',
        large: '16px',
      };
      root.style.setProperty('--terminal-font-size', fontSizeMap[options.fontSize]);
    }
  }, [options.fontSize, isLoaded]);

  // Apply CRT effects class to body
  useEffect(() => {
    if (isLoaded) {
      document.body.classList.toggle('crt-effects-disabled', !options.crtEffectsEnabled);
      document.body.classList.toggle('screen-flicker-disabled', !options.screenFlickerEnabled);

      // Flicker intensity as CSS variable
      const flickerMap: Record<FlickerIntensity, string> = {
        low: '0.02',
        medium: '0.05',
        high: '0.1',
      };
      document.documentElement.style.setProperty(
        '--flicker-intensity',
        flickerMap[options.flickerIntensity]
      );
    }
  }, [options.crtEffectsEnabled, options.screenFlickerEnabled, options.flickerIntensity, isLoaded]);

  const setOption = useCallback(<K extends keyof OptionsState>(key: K, value: OptionsState[K]) => {
    setOptions(prev => ({ ...prev, [key]: value }));
  }, []);

  const resetOptions = useCallback(() => {
    setOptions(DEFAULT_OPTIONS);
  }, []);

  return {
    options,
    setOption,
    resetOptions,
    isLoaded,
  };
}

// ═══════════════════════════════════════════════════════════════════════════
// CONTEXT (for app-wide access)
// ═══════════════════════════════════════════════════════════════════════════

import { createContext, useContext, ReactNode } from 'react';

const OptionsContext = createContext<UseOptionsReturn | null>(null);

export function OptionsProvider({ children }: { children: ReactNode }) {
  const optionsState = useOptions();

  return <OptionsContext.Provider value={optionsState}>{children}</OptionsContext.Provider>;
}

export function useOptionsContext(): UseOptionsReturn {
  const context = useContext(OptionsContext);
  if (!context) {
    throw new Error('useOptionsContext must be used within an OptionsProvider');
  }
  return context;
}
