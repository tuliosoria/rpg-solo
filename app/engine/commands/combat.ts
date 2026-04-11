// Combat/confrontation commands: override, trace

import { GameState, CommandResult, TerminalEntry } from '../../types';
import { createSeededRng, seededRandomInt } from '../rng';
import { DETECTION_THRESHOLDS, MAX_DETECTION } from '../../constants/detection';
import { shouldSuppressPenalties } from '../../constants/atmosphere';
import {
  createEntry,
  createInvalidCommandResult,
} from './utils';
import {
  applyDetectionVariance,
} from './helpers';
import { saveCheckpoint } from '../../storage/saves';
import type { CommandRegistry } from './types';

export const combatCommands: CommandRegistry = {
  trace: (args, state) => {
    const output: TerminalEntry[] = [
      createEntry('system', 'Initiating trace protocol...'),
      createEntry('output', ''),
    ];

    // Reveal some structure based on access level
    if (state.accessLevel < 2) {
      output.push(createEntry('output', 'TRACE RESULT:'));
      output.push(createEntry('output', '  /storage/ — ACCESSIBLE'));
      output.push(createEntry('output', '  /ops/ — PARTIAL'));
      output.push(createEntry('output', '  /comms/ — ACCESSIBLE'));
      output.push(createEntry('output', '  /admin/ — HIGH PRIORITY'));
      output.push(createEntry('warning', ''));
      output.push(createEntry('warning', 'WARNING: Trace logged. Detection increased.'));
    } else {
      output.push(createEntry('output', 'TRACE RESULT:'));
      output.push(createEntry('output', '  /storage/assets/ — 2 files'));
      output.push(createEntry('output', '  /storage/quarantine/ — 3 files'));
      output.push(createEntry('output', '  /ops/prato/ — 1 file'));
      output.push(createEntry('output', '  /ops/exo/ — 2 files [ELEVATED]'));
      output.push(createEntry('output', '  /comms/psi/ — 2 files [SIGNAL]'));
      output.push(createEntry('output', '  /admin/ — 7 files [HIGH PRIORITY]'));
      output.push(createEntry('output', ''));
      output.push(createEntry('notice', 'NOTICE: Administrative access may be obtainable.'));
    }

    const stateChanges: Partial<GameState> = {
      detectionLevel: state.detectionLevel + applyDetectionVariance(state, 'trace', 10), // was 15, reduced for pacing
      accessLevel: Math.min(state.accessLevel + 1, 3),
      sessionStability: state.sessionStability - 5,
    };

    if (!state.tutorialComplete) {
      delete stateChanges.detectionLevel;
      delete stateChanges.sessionStability;
    }

    return {
      output,
      stateChanges,
      triggerFlicker: true,
      delayMs: 1800,
    };
  },

  override: (args, state) => {
    // Requires: "override protocol <PASSWORD>"
    if (args.length === 0 || args[0].toLowerCase() !== 'protocol') {
      // Invalid override syntax - treat as invalid command
      return createInvalidCommandResult(state, '');
    }

    // Check if password was provided
    if (args.length < 2) {
      const stateChanges: Partial<GameState> = {
        detectionLevel: state.detectionLevel + 5,
      };

      if (!state.tutorialComplete) {
        delete stateChanges.detectionLevel;
      }

      return {
        output: [
          createEntry('system', 'Initiating protocol override...'),
          createEntry('error', ''),
          createEntry('error', 'ACCESS DENIED'),
          createEntry('error', ''),
          createEntry('warning', 'Protocol override requires authentication code.'),
          createEntry('warning', 'Usage: override protocol <CODE>'),
          createEntry('system', ''),
          createEntry('ufo74', '[UFO74]: try "chat". theres someone in the system who knows the code.'),
        ],
        stateChanges,
        triggerFlicker: true,
        delayMs: 1500,
      };
    }

    const password = args.slice(1).join(' ').toUpperCase();
    const correctPassword = 'COLHEITA';

    // Track failed attempts
    const failedAttempts = state.overrideFailedAttempts || 0;

    // Checkpoint before high-risk override protocol attempt (only if first real attempt)
    if (failedAttempts === 0) {
      saveCheckpoint(state, 'Before override protocol');
    }

    // Wrong password
    if (password !== correctPassword) {
      const newFailedAttempts = failedAttempts + 1;

      // Too many failed attempts = lockdown
      if (newFailedAttempts >= 3) {
        return {
          output: [
            createEntry('system', `Verifying code: ${password}...`),
            createEntry('error', ''),
            createEntry('error', '═══════════════════════════════════════════════════════════'),
            createEntry('error', 'SECURITY COUNTERMEASURE ACTIVATED'),
            createEntry('error', 'MULTIPLE AUTHENTICATION FAILURES DETECTED'),
            createEntry('error', '═══════════════════════════════════════════════════════════'),
            createEntry('error', ''),
            createEntry('error', 'IMMEDIATE SHUTDOWN'),
            createEntry('error', ''),
          ],
          stateChanges: {
            isGameOver: true,
            gameOverReason: 'SECURITY LOCKDOWN - AUTHENTICATION FAILURE',
            wrongAttempts: (state.wrongAttempts || 0) + 1,
          },
          triggerFlicker: true,
          delayMs: 3000,
        };
      }

      const stateChanges: Partial<GameState> = {
        detectionLevel: state.detectionLevel + 10, // was 15, reduced for pacing
        overrideFailedAttempts: newFailedAttempts,
        wrongAttempts: (state.wrongAttempts || 0) + 1,
      };

      // Suppress penalties during tutorial or atmosphere phase
      if (shouldSuppressPenalties(state)) {
        delete stateChanges.detectionLevel;
        delete stateChanges.wrongAttempts;
      }

      return {
        output: [
          createEntry('system', `Verifying code: ${password}...`),
          createEntry('error', ''),
          createEntry('error', 'INVALID AUTHENTICATION CODE'),
          createEntry('error', ''),
          createEntry(
            'warning',
            `WARNING: ${3 - newFailedAttempts} attempt(s) remaining before lockdown`
          ),
        ],
        stateChanges,
        triggerFlicker: true,
        delayMs: 1500,
      };
    }

    // Correct password!
    // THE TERRIBLE MISTAKE - Can still trigger at high detection with correct password
    const rng = createSeededRng(state.rngState);
    const roll = rng();

    const isTerribleMistakeCondition =
      state.detectionLevel >= DETECTION_THRESHOLDS.ALERT &&
      (state.evidenceCount || 0) >= 2 &&
      !state.terribleMistakeTriggered &&
      roll < 0.35; // 35% chance when conditions are met

    if (isTerribleMistakeCondition) {
      return {
        output: [
          createEntry('system', `Verifying code: ${password}...`),
          createEntry('system', 'Authentication accepted.'),
          createEntry('error', ''),
          createEntry('error', '▓▓▓ CRITICAL BREACH ▓▓▓'),
          createEntry('error', ''),
          createEntry('warning', '════════════════════════════════════════════'),
          createEntry('warning', 'EMERGENCY BUFFER DUMP — DO NOT DISTRIBUTE'),
          createEntry('warning', '════════════════════════════════════════════'),
          createEntry('system', ''),
          createEntry('output', 'RECOVERED FRAGMENT [ORIGIN: UNKNOWN NODE]:'),
          createEntry('system', ''),
          createEntry('output', '  ...harvest cycle confirmed...'),
          createEntry('output', '  ...cognitive extraction: 7.2 billion units...'),
          createEntry('output', '  ...window activation: IMMINENT...'),
          createEntry('output', '  ...no intervention possible...'),
          createEntry('output', '  ...observation terminates upon extraction...'),
          createEntry('system', ''),
          createEntry('error', '════════════════════════════════════════════'),
          createEntry('error', 'PURGE PROTOCOL INITIATED'),
          createEntry('error', 'SYSTEM WILL TERMINATE IN 8 OPERATIONS'),
          createEntry('error', '════════════════════════════════════════════'),
          createEntry('system', ''),
          createEntry('warning', 'You should not have seen this.'),
          createEntry('system', ''),
        ],
        stateChanges: {
          terribleMistakeTriggered: true,
          sessionDoomCountdown: 8,
          flags: {
            ...state.flags,
            adminUnlocked: true,
            forbiddenKnowledge: true,
            overrideGateActive: false,
          },
          accessLevel: 5,
          detectionLevel: MAX_DETECTION,
          systemHostilityLevel: 5,
          rngState: seededRandomInt(rng, 0, 2147483647),
          avatarExpression: 'angry', // Terrible mistake - angry expression
        },
        triggerFlicker: true,
        delayMs: 4000,
      };
    }

    // Success - unlock admin
    const stateChanges: Partial<GameState> = {
      flags: { ...state.flags, adminUnlocked: true, overrideGateActive: false },
      overrideFailedAttempts: 0,
      accessLevel: 5,
      detectionLevel: state.detectionLevel + 15, // was 25, reduced for pacing
      sessionStability: state.sessionStability - 15,
      systemHostilityLevel: Math.min((state.systemHostilityLevel || 0) + 1, 5),
      rngState: seededRandomInt(rng, 0, 2147483647),
    };

    if (!state.tutorialComplete) {
      delete stateChanges.detectionLevel;
      delete stateChanges.sessionStability;
    }

    return {
      output: [
        createEntry('system', `Verifying code: ${password}...`),
        createEntry('system', 'Authentication accepted.'),
        createEntry('warning', ''),
        createEntry('warning', 'WARNING: Legacy security bypass detected'),
        createEntry('output', ''),
        createEntry('notice', 'NOTICE: Administrative archive access granted'),
        createEntry('notice', 'NOTICE: Elevated clearance applied'),
        createEntry('output', ''),
        createEntry('warning', 'WARNING: Session heavily monitored'),
      ],
      stateChanges,
      triggerFlicker: true,
      delayMs: 2500,
    };
  },
};
