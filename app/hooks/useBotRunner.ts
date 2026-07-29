import { useEffect, useRef } from 'react';
import { GameState, TerminalEntry } from '../types';
import { decideNextCommand } from '../engine/bot/strategy';
import { buildRunSummary } from '../engine/bot/report';
import {
  createBotMemory,
  describeGoal,
  settleBotTurn,
  BotMemory,
  BotRunLogEntry,
} from '../engine/bot/types';

/** True only when the terminal is free to accept the next bot command. */
export function isTerminalIdle(g: {
  isProcessing: boolean;
  showTuringTest: boolean;
  hasPendingMedia: boolean;
}): boolean {
  return !g.isProcessing && !g.showTuringTest && !g.hasPendingMedia;
}

/**
 * Emits the run summary somewhere it survives the screen that follows it.
 *
 * `buildRunSummary` writes into the terminal history, and `Terminal` unmounts
 * the terminal outright when `gamePhase` becomes `victory` or `bad_ending` —
 * it returns the ending component *instead of* the history. So the summary was
 * invisible for exactly the runs most worth reading: every winning level run
 * and all twelve ending runs finished by replacing the only surface it was
 * printed on, and the ending screen's one control restarts the game. The
 * console copy is plain text, survives the unmount, and can be copied out.
 */
function logRunSummary(entries: TerminalEntry[]): void {
  if (typeof console === 'undefined') return;
  // eslint-disable-next-line no-console
  console.log(entries.map(entry => entry.content).join('\n'));
}

interface BotRunnerArgs {
  gameState: GameState;
  isProcessing: boolean;
  showTuringTest: boolean;
  /** Full-screen media overlays the bot actively dismisses (image/evidence video). */
  hasActiveOverlay: boolean;
  /** Inline prompts advanced by pressing Enter (image reveal, UFO74 messages). */
  hasEnterPrompt: boolean;
  /** The yes/no evidence-video prompt (skipped with "no"). */
  hasVideoPrompt: boolean;
  /** Any other blocking popup (turing video, achievement toast, firewall scare,
   *  menus, game-over). The bot waits for these to clear on their own. */
  hasBlockingPopup: boolean;
  submit: (overrideInput: string) => void;
  dismissActiveOverlay: () => void;
  appendOutput: (entries: TerminalEntry[]) => void;
  clearBot: () => void;
}

export function useBotRunner(args: BotRunnerArgs): void {
  const {
    gameState,
    isProcessing,
    showTuringTest,
    hasActiveOverlay,
    hasEnterPrompt,
    hasVideoPrompt,
    hasBlockingPopup,
    submit,
    dismissActiveOverlay,
    appendOutput,
    clearBot,
  } = args;

  const memoryRef = useRef<BotMemory>(createBotMemory());
  const logRef = useRef<BotRunLogEntry[]>([]);
  const inFlightRef = useRef(false);
  const runIdRef = useRef<string | null>(null);
  /**
   * The turn that has been submitted but whose effect is not known yet. A
   * command's outcome only shows up in gameState after it has run, so each
   * entry is closed out at the start of the following turn.
   */
  const openTurnRef = useRef<{
    entry: BotRunLogEntry;
    before: {
      wrongAttempts: number;
      legacyAlertCounter: number;
      leakProgress: number;
      leakGenerated: boolean;
      pendingTreeConfirm: boolean;
      doomCountdown: number;
    };
  } | null>(null);

  useEffect(() => {
    const cfg = gameState.botTest;
    if (!cfg?.active) {
      if (runIdRef.current !== null) {
        runIdRef.current = null;
        memoryRef.current = createBotMemory();
        logRef.current = [];
      }
      return;
    }

    // Reset memory/log at the start of each distinct run (including a fresh
    // bot-test issued while another run is still flagged active).
    // The goal is part of the run identity: `bot-test ending ridiculed` issued
    // over a running `bot-test ending real_ending` on the same seed is a new run,
    // and reusing the old memory would leave it planning the previous dossier.
    const runId = `${cfg.level}:${cfg.seed}:${describeGoal(cfg.goal)}`;
    if (runIdRef.current !== runId) {
      runIdRef.current = runId;
      memoryRef.current = createBotMemory();
      logRef.current = [];
      openTurnRef.current = null;
    }

    // Wait while a command is streaming or the turing overlay is up (it
    // auto-answers itself). The effect re-runs once those settle.
    if (isProcessing || showTuringTest) return;
    if (inFlightRef.current) return;

    inFlightRef.current = true;
    const timer = setTimeout(() => {
      inFlightRef.current = false;

      // The previous command has run by now, so its effect is readable. Close
      // the turn out before doing anything else, including terminating — the
      // turn that ends a run is usually the interesting one.
      const open = openTurnRef.current;
      if (open) {
        settleBotTurn(
          open.entry,
          {
            detectionLevel: gameState.detectionLevel,
            filesRead: gameState.filesRead.size,
            savedFiles: gameState.savedFiles.size,
            wrongAttempts: gameState.wrongAttempts,
            legacyAlertCounter: gameState.legacyAlertCounter,
            leakProgress: gameState.leakSequenceProgress,
            leakGenerated: Boolean(gameState.leakSequenceGenerated),
            gameWon: Boolean(gameState.gameWon),
            isGameOver: Boolean(gameState.isGameOver),
            gameOverReason: gameState.gameOverReason,
            pendingTreeConfirm: Boolean(gameState.pendingTreeConfirm),
            doomCountdown: gameState.sessionDoomCountdown,
          },
          open.before
        );
        openTurnRef.current = null;
      }

      // Terminal-ending states finalize regardless of any popup on screen.
      if (gameState.gameWon || gameState.isGameOver) {
        const { decision } = decideNextCommand(
          gameState,
          memoryRef.current,
          cfg.level,
          cfg.seed,
          cfg.goal
        );
        if (decision.kind === 'done') {
          const summary = buildRunSummary(logRef.current, cfg, gameState, decision.reason);
          appendOutput(summary);
          logRunSummary(summary);
          clearBot();
        }
        return;
      }

      // Clear blocking media so autoplay can continue.
      if (hasActiveOverlay) {
        dismissActiveOverlay();
        return;
      }
      if (hasVideoPrompt) {
        submit('no'); // skip evidence videos during autoplay
        return;
      }
      if (hasEnterPrompt) {
        submit(''); // advance image reveal / UFO74 messages
        return;
      }

      // Any other blocking popup (turing video, achievement, firewall scare,
      // menus) auto-clears on its own — wait for it. The effect re-runs when
      // hasBlockingPopup flips because it is a dependency.
      if (hasBlockingPopup) return;

      const { decision, memory } = decideNextCommand(
        gameState,
        memoryRef.current,
        cfg.level,
        cfg.seed,
        cfg.goal
      );
      memoryRef.current = memory;

      if (decision.kind === 'done') {
        const summary = buildRunSummary(logRef.current, cfg, gameState, decision.reason);
        appendOutput(summary);
        logRunSummary(summary);
        clearBot();
        return;
      }

      const input = decision.kind === 'enter' ? '' : decision.text;
      const entry: BotRunLogEntry = {
        turn: memory.turnsTaken,
        command: input || '(enter)',
        detectionBefore: gameState.detectionLevel,
        detectionAfter: gameState.detectionLevel,
        filesReadBefore: gameState.filesRead.size,
        savedBefore: gameState.savedFiles.size,
        filesReadAfter: gameState.filesRead.size,
        savedAfter: gameState.savedFiles.size,
        probe: decision.kind === 'command' ? decision.probe : undefined,
        expectRejected: decision.kind === 'command' ? decision.expectRejected : undefined,
      };
      logRef.current.push(entry);
      openTurnRef.current = {
        entry,
        before: {
          wrongAttempts: gameState.wrongAttempts,
          legacyAlertCounter: gameState.legacyAlertCounter,
          leakProgress: gameState.leakSequenceProgress,
          leakGenerated: Boolean(gameState.leakSequenceGenerated),
          pendingTreeConfirm: Boolean(gameState.pendingTreeConfirm),
          doomCountdown: gameState.sessionDoomCountdown,
        },
      };
      submit(input);
    }, cfg.delayMs);

    return () => {
      clearTimeout(timer);
      inFlightRef.current = false;
    };
  }, [
    gameState,
    isProcessing,
    showTuringTest,
    hasActiveOverlay,
    hasEnterPrompt,
    hasVideoPrompt,
    hasBlockingPopup,
    submit,
    dismissActiveOverlay,
    appendOutput,
    clearBot,
  ]);
}
