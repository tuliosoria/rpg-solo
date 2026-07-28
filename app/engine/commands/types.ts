// Shared types for command handler modules

import { GameState, CommandResult } from '../../types';

/**
 * Runs a full command line, exactly as a player's keystroke would.
 *
 * Handed to handlers that need to drive the engine rather than just answer a
 * question — currently only `bot-test sweep`, which plays whole games. Passing
 * it in is what keeps the bot's headless runner out of the command layer's
 * import graph: `debug.ts -> bot/sweep.ts -> engine/commands.ts ->
 * commands/index.ts -> debug.ts` was a real cycle, and `commands/index.ts`
 * dereferences `debugCommands` while it is still evaluating, so entering the
 * graph at `debug.ts` threw on the temporal dead zone.
 */
export type CommandExecutor = (input: string, state: GameState) => CommandResult;

export type CommandHandler = (
  args: string[],
  state: GameState,
  execute?: CommandExecutor
) => CommandResult;

export type CommandRegistry = Record<string, CommandHandler>;
