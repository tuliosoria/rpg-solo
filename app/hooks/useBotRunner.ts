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

/** Returns an anomaly string for this turn, or null. */
export function detectAnomaly(command: string, hadErrorOutput: boolean): string | null {
  if (hadErrorOutput) return `command returned error: ${command}`;
  return null;
}

interface BotRunnerArgs {
  gameState: GameState;
  isProcessing: boolean;
  showTuringTest: boolean;
  /** Full-screen overlays that require a dedicated dismiss (image/video). */
  hasActiveOverlay: boolean;
  /** Inline prompts advanced by pressing Enter (image reveal, UFO74 messages). */
  hasEnterPrompt: boolean;
  /** The yes/no evidence-video prompt (skipped with "no"). */
  hasVideoPrompt: boolean;
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
    submit,
    dismissActiveOverlay,
    appendOutput,
    clearBot,
  } = args;

  const memoryRef = useRef<BotMemory>(createBotMemory());
  const logRef = useRef<BotRunLogEntry[]>([]);
  const inFlightRef = useRef(false);
  const activeRef = useRef(false);

  useEffect(() => {
    const cfg = gameState.botTest;
    if (!cfg?.active) {
      if (activeRef.current) {
        activeRef.current = false;
        memoryRef.current = createBotMemory();
        logRef.current = [];
      }
      return;
    }
    // New run: reset memory/log exactly once.
    if (!activeRef.current) {
      activeRef.current = true;
      memoryRef.current = createBotMemory();
      logRef.current = [];
    }

    // Still streaming a previous command, or the turing overlay is up (it
    // auto-answers itself) — just wait; the effect re-runs when state settles.
    if (isProcessing || showTuringTest) return;
    if (inFlightRef.current) return;

    inFlightRef.current = true;
    const timer = setTimeout(() => {
      inFlightRef.current = false;

      // Clear any blocking media so autoplay can continue.
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
    submit,
    dismissActiveOverlay,
    appendOutput,
    clearBot,
  ]);
}
