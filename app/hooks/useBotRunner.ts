import { useEffect, useRef } from 'react';
import { GameState, TerminalEntry } from '../types';
import { decideNextCommand } from '../engine/bot/strategy';
import { buildRunSummary } from '../engine/bot/report';
import { createBotMemory, BotMemory, BotRunLogEntry } from '../engine/bot/types';

/** True only when the terminal is free to accept the next bot command. */
export function isTerminalIdle(g: {
  isProcessing: boolean;
  showTuringTest: boolean;
  hasPendingMedia: boolean;
}): boolean {
  return !g.isProcessing && !g.showTuringTest && !g.hasPendingMedia;
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
    const runId = `${cfg.level}:${cfg.seed}`;
    if (runIdRef.current !== runId) {
      runIdRef.current = runId;
      memoryRef.current = createBotMemory();
      logRef.current = [];
    }

    // Wait while a command is streaming or the turing overlay is up (it
    // auto-answers itself). The effect re-runs once those settle.
    if (isProcessing || showTuringTest) return;
    if (inFlightRef.current) return;

    inFlightRef.current = true;
    const timer = setTimeout(() => {
      inFlightRef.current = false;

      // Terminal-ending states finalize regardless of any popup on screen.
      if (gameState.gameWon || gameState.isGameOver) {
        const { decision } = decideNextCommand(gameState, memoryRef.current, cfg.level, cfg.seed);
        if (decision.kind === 'done') {
          appendOutput(buildRunSummary(logRef.current, cfg, gameState));
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
        cfg.seed
      );
      memoryRef.current = memory;

      if (decision.kind === 'done') {
        appendOutput(buildRunSummary(logRef.current, cfg, gameState));
        clearBot();
        return;
      }

      const input = decision.kind === 'enter' ? '' : decision.text;
      logRef.current.push({
        turn: memory.turnsTaken,
        command: input || '(enter)',
        detectionBefore: gameState.detectionLevel,
        detectionAfter: gameState.detectionLevel,
        filesReadAfter: gameState.filesRead.size,
        savedAfter: gameState.savedFiles.size,
      });
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
