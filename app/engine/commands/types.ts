// Shared types for command handler modules

import { GameState, CommandResult } from '../../types';

export type CommandHandler = (args: string[], state: GameState) => CommandResult;

export type CommandRegistry = Record<string, CommandHandler>;
