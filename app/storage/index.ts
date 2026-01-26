/**
 * Storage Module
 *
 * Persistence layer for Terminal 1996 game data.
 *
 * @module storage
 *
 * @description
 * This module provides:
 * - **saves** – Save/load game state to localStorage with versioned migrations
 * - **statistics** – Track player statistics and achievements across sessions
 * - **safeStorage** – Safe localStorage wrappers with error handling
 */
export * from './saves';
export * from './statistics';
export * from './safeStorage';
