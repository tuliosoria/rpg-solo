/**
 * React Hooks Module
 *
 * Custom React hooks for Terminal 1996.
 *
 * @module hooks
 *
 * @description
 * This module provides:
 * - **useAutocomplete** – Tab-completion for terminal commands and paths
 * - **useTerminalState** – Core Terminal state wiring
 * - **useSound** – Synthesized audio effects and ambient tension system
 * - **useGlobalErrorHandler** – Global error and rejection handling
 */
export { useAutocomplete, type AutocompleteResult } from './useAutocomplete';
export { useTerminalState } from './useTerminalState';
export { useSound, type SoundType } from './useSound';
export { useGlobalErrorHandler } from './useGlobalErrorHandler';
