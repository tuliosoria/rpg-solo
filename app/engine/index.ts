/**
 * Terminal 1996 Game Engine
 *
 * Core game logic for the Varginha Terminal adventure.
 *
 * @module engine
 *
 * @description
 * This module re-exports all engine subsystems:
 * - **commands** – Command parser and execution (processCommand, utilities)
 * - **filesystem** – Virtual filesystem navigation and file access
 * - **rng** – Seeded random number generation for deterministic gameplay
 * - **evidenceRevelation** – Gradual evidence discovery system
 * - **achievements** – Achievement definitions and unlock tracking
 */
export * from './commands';
export * from './filesystem';
export * from './rng';
export * from './evidenceRevelation';
export * from './achievements';
