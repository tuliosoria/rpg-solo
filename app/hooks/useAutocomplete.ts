/**
 * useAutocomplete - Tab Completion for Terminal
 *
 * Provides command and file path autocompletion for the terminal interface.
 * Supports command name completion and context-aware file/directory completion.
 *
 * @module hooks/useAutocomplete
 */

import { useCallback } from 'react';
import { GameState } from '../types';
import { listDirectory, resolvePath } from '../engine/filesystem';

// Available commands for auto-completion
const COMMANDS = [
  'help',
  'status',
  'progress',
  'ls',
  'cd',
  'back',
  'open',
  'last',
  'unread',
  'decrypt',
  'recover',
  'note',
  'notes',
  'bookmark',
  'trace',
  'chat',
  'clear',
  'save',
  'exit',
  'override',
  'run',
  'map',
  'tree',
  'tutorial',
  'leak',
  'message',
];

const COMMANDS_WITH_FILE_ARGS = ['cd', 'open', 'decrypt', 'recover', 'run', 'bookmark'];

/**
 * Result of an autocomplete query.
 */
export interface AutocompleteResult {
  /** The list of possible completions */
  completions: string[];
  /** The common prefix among all completions */
  commonPrefix: string;
}

/**
 * Hook for terminal command and file path autocompletion
 * @param gameState - Current game state for filesystem access
 * @returns getCompletions function and completeInput function
 */
export function useAutocomplete(gameState: GameState) {
  /**
   * Get auto-complete suggestions for the given input
   */
  const getCompletions = useCallback(
    (input: string): string[] => {
      const trimmed = input.trimStart();
      const parts = trimmed.split(/\s+/);

      if (parts.length <= 1) {
        // Complete command names
        const partial = parts[0].toLowerCase();
        return COMMANDS.filter(cmd => cmd.startsWith(partial));
      }

      // Complete file/directory arguments for specific commands
      const cmd = parts[0].toLowerCase();
      if (!COMMANDS_WITH_FILE_ARGS.includes(cmd)) return [];

      const partial = parts[parts.length - 1];
      const currentPath = gameState.currentPath;

      // Determine the directory to search and the prefix to match
      let searchDir = currentPath;
      let prefix = partial;

      if (partial.includes('/')) {
        const lastSlash = partial.lastIndexOf('/');
        const dirPart = partial.substring(0, lastSlash + 1);
        prefix = partial.substring(lastSlash + 1);
        searchDir = resolvePath(dirPart, currentPath);
      }

      const entries = listDirectory(searchDir, gameState);
      if (!entries) return [];

      // Filter entries that match the prefix
      const matches = entries
        .map(e => e.name.replace(/\/$/, '')) // Remove trailing slash for matching
        .filter(name => name.toLowerCase().startsWith(prefix.toLowerCase()));

      // For 'cd', only show directories
      if (cmd === 'cd') {
        const dirEntries = entries.filter(e => e.type === 'dir');
        return dirEntries
          .map(e => e.name.replace(/\/$/, ''))
          .filter(name => name.toLowerCase().startsWith(prefix.toLowerCase()));
      }

      return matches;
    },
    [gameState]
  );

  /**
   * Complete the input with the given completions
   * @returns The completed input string, or null if no completion possible
   */
  const completeInput = useCallback((input: string, completions: string[]): string | null => {
    if (completions.length === 0) return null;

    const parts = input.trimStart().split(/\s+/);

    // Check if completions are full paths (e.g., from filesRead for multi-arg commands)
    const completionsAreFullPaths = completions.length > 0 && completions[0].startsWith('/');

    if (completions.length === 1) {
      // Single match - complete it
      if (parts.length <= 1) {
        // Completing a command
        return completions[0] + ' ';
      } else {
        // Completing a file/directory argument - preserve all previous arguments
        const cmd = parts[0];
        const middleArgs = parts.slice(1, -1); // All args except first (cmd) and last (partial)
        const partial = parts[parts.length - 1];

        // For full path completions, use the completion directly without adding prefix
        if (completionsAreFullPaths) {
          const allArgs = [...middleArgs, completions[0]];
          return `${cmd} ${allArgs.join(' ')}`;
        }

        let prefix = '';
        if (partial.includes('/')) {
          prefix = partial.substring(0, partial.lastIndexOf('/') + 1);
        }
        const allArgs = [...middleArgs, `${prefix}${completions[0]}`];
        return `${cmd} ${allArgs.join(' ')}`;
      }
    } else {
      // Multiple matches - complete common prefix
      const commonPrefix = completions.reduce((acc, str) => {
        while (acc && !str.toLowerCase().startsWith(acc.toLowerCase())) {
          acc = acc.slice(0, -1);
        }
        return acc;
      }, completions[0]);

      if (parts.length <= 1) {
        return commonPrefix;
      } else {
        // Preserve all previous arguments when completing partial
        const cmd = parts[0];
        const middleArgs = parts.slice(1, -1);
        const partial = parts[parts.length - 1];

        // For full path completions, use the common prefix directly without adding prefix
        if (completionsAreFullPaths) {
          const allArgs = [...middleArgs, commonPrefix];
          return `${cmd} ${allArgs.join(' ')}`;
        }

        let prefix = '';
        if (partial.includes('/')) {
          prefix = partial.substring(0, partial.lastIndexOf('/') + 1);
        }
        const allArgs = [...middleArgs, `${prefix}${commonPrefix}`];
        return `${cmd} ${allArgs.join(' ')}`;
      }
    }
  }, []);

  return { getCompletions, completeInput, COMMANDS, COMMANDS_WITH_FILE_ARGS };
}
