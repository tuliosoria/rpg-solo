'use client';

/**
 * useOptions - Game Options State Management
 *
 * Provides persistent storage and reactive state for audio/visual options.
 * Options are saved to localStorage and applied immediately without restart.
 *
 * @module hooks/useOptions
 */

import {
  useState,
  useEffect,
  useCallback,
  createContext,
  useContext,
  type ReactNode,
} from 'react';
import type { FlickerIntensity, FontSize, OptionsState } from '../types';
import { safeGetJSON, safeSetJSON } from '../storage/safeStorage';

export type { FlickerIntensity, FontSize, OptionsState } from '../types';

// ═══════════════════════════════════════════════════════════════════════════
// CONSTANTS
// ═══════════════════════════════════════════════════════════════════════════

export const OPTIONS_STORAGE_KEY = 'terminal1996_options';

const FONT_SIZE_MAP: Record<FontSize, string> = {
  small: '12px',
  medium: '14px',
  large: '16px',
};

const FLICKER_INTENSITY_MAP: Record<FlickerIntensity, string> = {
  low: '0.02',
  medium: '0.05',
  high: '0.1',
};

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

export function readStoredOptions(): OptionsState {
  const stored = safeGetJSON<Partial<OptionsState>>(OPTIONS_STORAGE_KEY, {});
  return { ...DEFAULT_OPTIONS, ...stored };
}

export function persistOptions(options: OptionsState): boolean {
  return safeSetJSON(OPTIONS_STORAGE_KEY, options);
}

export function applyOptionsToDocument(options: OptionsState): void {
  if (typeof document === 'undefined') return;

  document.body.classList.toggle('no-crt', !options.crtEffectsEnabled);
  document.body.classList.toggle('screen-flicker-disabled', !options.screenFlickerEnabled);
  document.documentElement.style.setProperty('--terminal-font-size', FONT_SIZE_MAP[options.fontSize]);
  document.documentElement.style.setProperty(
    '--flicker-intensity',
    FLICKER_INTENSITY_MAP[options.flickerIntensity]
  );
}

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
    setOptions(readStoredOptions());
    setIsLoaded(true);
  }, []);

  // Save options and apply document classes/variables whenever they change
  useEffect(() => {
    if (isLoaded) {
      if (!persistOptions(options)) {
        console.warn('[useOptions] Failed to save options to localStorage');
      }
      applyOptionsToDocument(options);
    }
  }, [options, isLoaded]);

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
