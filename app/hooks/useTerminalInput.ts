'use client';

import { useCallback } from 'react';
import {
  executeCommand,
  createEntry,
  getTutorialMessage,
  TUTORIAL_MESSAGES,
  sanitizeCommandInput,
} from '../engine/commands';
import {
  isInTutorialMode,
  processTutorialInput,
  isTutorialInputState,
} from '../engine/commands/interactiveTutorial';
import { resolvePath, getFileContent, getNode } from '../engine/filesystem';
import { saveCheckpoint } from '../storage/saves';
import { incrementStatistic } from '../storage/statistics';
import {
  MAX_HISTORY_SIZE,
  MAX_COMMAND_HISTORY_SIZE,
  MAX_COMMAND_INPUT_LENGTH,
} from '../constants/limits';
import { NIGHT_OWL_DURATION_MS } from '../constants/timing';
import { uiRandom, uiChance } from '../engine/rng';
import type {
  GamePhase,
  GameState,
  ImageTrigger,
  StreamingMode,
  TerminalEntry,
  VideoTrigger,
} from '../types';
import type { SoundType } from './useSound';

const STREAMING_DELAYS: Record<
  StreamingMode,
  { base: number; variance: number; glitchChance: number; glitchDelay: number }
> = {
  none: { base: 0, variance: 0, glitchChance: 0, glitchDelay: 0 },
  fast: { base: 40, variance: 20, glitchChance: 0, glitchDelay: 0 },
  normal: { base: 80, variance: 30, glitchChance: 0, glitchDelay: 0 },
  slow: { base: 120, variance: 50, glitchChance: 0.05, glitchDelay: 200 },
  glitchy: { base: 100, variance: 50, glitchChance: 0.15, glitchDelay: 400 },
};

type EncryptedChannelState = 'idle' | 'awaiting_open' | 'open' | 'awaiting_close';

interface TerminalInputRefs {
  outputRef: React.RefObject<HTMLDivElement>;
  inputRef: React.RefObject<HTMLInputElement>;
  streamStartScrollPos: React.MutableRefObject<number | null>;
  skipStreamingRef: React.MutableRefObject<boolean>;
  isProcessingRef: React.MutableRefObject<boolean>;
}

interface UseTerminalInputOptions {
  gameState: GameState;
  gamePhase: GamePhase;
  inputValue: string;
  isProcessing: boolean;
  showTuringTest: boolean;
  pendingImage: ImageTrigger | null;
  pendingVideo: VideoTrigger | null;
  pendingUfo74StartMessages: TerminalEntry[];
  pendingUfo74Messages: TerminalEntry[];
  historyIndex: number;
  setGameState: React.Dispatch<React.SetStateAction<GameState>>;
  setInputValue: React.Dispatch<React.SetStateAction<string>>;
  setIsProcessing: React.Dispatch<React.SetStateAction<boolean>>;
  setIsStreaming: React.Dispatch<React.SetStateAction<boolean>>;
  setHistoryIndex: React.Dispatch<React.SetStateAction<number>>;
  setPendingImage: React.Dispatch<React.SetStateAction<ImageTrigger | null>>;
  setPendingVideo: React.Dispatch<React.SetStateAction<VideoTrigger | null>>;
  setActiveImage: React.Dispatch<React.SetStateAction<ImageTrigger | null>>;
  setActiveVideo: React.Dispatch<React.SetStateAction<VideoTrigger | null>>;
  setPendingUfo74StartMessages: React.Dispatch<React.SetStateAction<TerminalEntry[]>>;
  setPendingUfo74Messages: React.Dispatch<React.SetStateAction<TerminalEntry[]>>;
  setQueuedAfterMediaMessages: React.Dispatch<React.SetStateAction<TerminalEntry[]>>;
  setShowEvidenceTracker: React.Dispatch<React.SetStateAction<boolean>>;
  setShowRiskTracker: React.Dispatch<React.SetStateAction<boolean>>;
  setShowTuringTest: React.Dispatch<React.SetStateAction<boolean>>;
  setGamePhase: React.Dispatch<React.SetStateAction<GamePhase>>;
  setGameOverReason: React.Dispatch<React.SetStateAction<string>>;
  setShowGameOver: React.Dispatch<React.SetStateAction<boolean>>;
  setBurnInLines: React.Dispatch<React.SetStateAction<string[]>>;
  setEncryptedChannelState: React.Dispatch<React.SetStateAction<EncryptedChannelState>>;
  onExitAction: () => void;
  onSaveRequestAction: (state: GameState) => void;
  playSound: (sound: SoundType) => void;
  playKeySound: (key: string) => void;
  triggerFlicker: () => void;
  checkAchievement: (id: string) => void;
  getCompletions: (input: string) => string[];
  completeInput: (input: string, completions: string[]) => string | null;
  markTabPressed: () => void;
  consumeTabPressed: () => boolean;
  refs: TerminalInputRefs;
}

export function useTerminalInput({
  gameState,
  gamePhase,
  inputValue,
  isProcessing,
  showTuringTest,
  pendingImage,
  pendingVideo,
  pendingUfo74StartMessages,
  pendingUfo74Messages,
  historyIndex,
  setGameState,
  setInputValue,
  setIsProcessing,
  setIsStreaming,
  setHistoryIndex,
  setPendingImage,
  setPendingVideo,
  setActiveImage,
  setActiveVideo,
  setPendingUfo74StartMessages,
  setPendingUfo74Messages,
  setQueuedAfterMediaMessages,
  setShowEvidenceTracker,
  setShowRiskTracker,
  setShowTuringTest,
  setGamePhase,
  setGameOverReason,
  setShowGameOver,
  setBurnInLines,
  setEncryptedChannelState,
  onExitAction,
  onSaveRequestAction,
  playSound,
  playKeySound,
  triggerFlicker,
  checkAchievement,
  getCompletions,
  completeInput,
  markTabPressed,
  consumeTabPressed,
  refs,
}: UseTerminalInputOptions) {
  const { outputRef, inputRef, streamStartScrollPos, skipStreamingRef, isProcessingRef } = refs;

  const openEncryptedChannelWithMessages = useCallback(
    (messages: TerminalEntry[]) => {
      if (messages.length === 0) return;

      setGameState(prev => ({
        ...prev,
        history: [
          ...prev.history,
          createEntry('system', ''),
          createEntry('ufo74', '┌─────────────────────────────────────────────────────────┐'),
          createEntry('ufo74', '│         >> ENCRYPTED CHANNEL OPEN <<                    │'),
          createEntry('ufo74', '└─────────────────────────────────────────────────────────┘'),
          createEntry('system', ''),
          ...messages.flatMap(msg => [msg, createEntry('system', '')]),
          createEntry('ufo74', '┌─────────────────────────────────────────────────────────┐'),
          createEntry('ufo74', '│         >> ENCRYPTED CHANNEL CLOSED <<                  │'),
          createEntry('ufo74', '└─────────────────────────────────────────────────────────┘'),
          createEntry('system', ''),
        ],
      }));
      playSound('transmission');
      playSound('message');

      setPendingUfo74Messages([]);
      setEncryptedChannelState('idle');
    },
    [playSound, setEncryptedChannelState, setGameState, setPendingUfo74Messages]
  );

  const streamOutput = useCallback(
    async (entries: TerminalEntry[], mode: StreamingMode): Promise<void> => {
      if (mode === 'none' || entries.length === 0) {
        if (entries.some(e => e.content.includes('>> INCOMING TRANSMISSION <<'))) {
          playSound('transmission');
        }
        setGameState(prev => ({
          ...prev,
          history: [...prev.history, ...entries],
        }));
        return;
      }

      const config = STREAMING_DELAYS[mode];
      skipStreamingRef.current = false;

      for (let i = 0; i < entries.length; i++) {
        if (skipStreamingRef.current) {
          const remaining = entries.slice(i);
          if (remaining.some(e => e.content.includes('>> INCOMING TRANSMISSION <<'))) {
            playSound('transmission');
          }
          setGameState(prev => ({
            ...prev,
            history: [...prev.history, ...remaining],
          }));
          break;
        }

        const entry = entries[i];

        if (entry.content.includes('>> INCOMING TRANSMISSION <<')) {
          playSound('transmission');
        }

        setGameState(prev => ({
          ...prev,
          history: [...prev.history, entry],
        }));

        let delay = config.base + (uiRandom() * config.variance * 2 - config.variance);

        if (uiChance(config.glitchChance)) {
          delay += config.glitchDelay;
          if (config.glitchDelay > 100) {
            triggerFlicker();
          }
        }

        if (delay > 0 && i < entries.length - 1) {
          await new Promise(resolve => setTimeout(resolve, delay));
        }
      }
    },
    [playSound, setGameState, skipStreamingRef, triggerFlicker]
  );

  const handleSubmit = useCallback(
    async (e?: React.SyntheticEvent) => {
      e?.preventDefault?.();

      const sanitizedInput = sanitizeCommandInput(inputValue, MAX_COMMAND_INPUT_LENGTH);
      const trimmedInput = sanitizedInput.value.trim();

      if (pendingImage && !trimmedInput) {
        setActiveImage(pendingImage);
        setPendingImage(null);
        return;
      }

      if (pendingVideo && !trimmedInput) {
        setActiveVideo(pendingVideo);
        setPendingVideo(null);
        return;
      }

      if (gameState.ufo74SecretDiscovered && !trimmedInput && gamePhase === 'terminal') {
        setGamePhase('secret_ending');
        setGameState(prev => ({
          ...prev,
          endingType: 'secret',
          isGameOver: true,
        }));
        return;
      }

      if (pendingUfo74StartMessages.length > 0 && !trimmedInput) {
        const messagesToSend = [...pendingUfo74StartMessages];
        setPendingUfo74StartMessages([]);
        openEncryptedChannelWithMessages(messagesToSend);
        return;
      }

      if (pendingUfo74Messages.length > 0 && !trimmedInput) {
        const messagesToSend = [...pendingUfo74Messages];
        setPendingUfo74Messages([]);
        openEncryptedChannelWithMessages(messagesToSend);
        return;
      }

      if (isInTutorialMode(gameState)) {
        const tutorialState = gameState.interactiveTutorialState;

        if (!tutorialState || !isTutorialInputState(tutorialState.current)) {
          setInputValue('');
          return;
        }

        const tabWasPressed = consumeTabPressed();
        const result = processTutorialInput(trimmedInput, gameState, tabWasPressed);

        if (result.output.length > 0 || result.stateChanges) {
          setGameState(prev => ({
            ...prev,
            ...result.stateChanges,
            history: [...prev.history, ...result.output],
          }));
        }

        if (result.stateChanges.tutorialComplete) {
          setTimeout(() => setShowEvidenceTracker(true), 300);
          playSound('reveal');
          setTimeout(() => setShowRiskTracker(true), 600);

          const newState = {
            ...gameState,
            ...result.stateChanges,
            history: [...gameState.history, ...result.output],
          };
          saveCheckpoint(newState, 'Tutorial complete');
        }

        setInputValue('');
        return;
      }

      if (
        !gameState.tutorialComplete &&
        gameState.tutorialStep !== undefined &&
        gameState.tutorialStep >= 0
      ) {
        if (trimmedInput) {
          const errorEntry = createEntry('error', 'ERROR: Incoming transmission in progress.');
          setGameState(prev => ({
            ...prev,
            history: [...prev.history, errorEntry],
          }));
          setInputValue('');
          return;
        }

        const currentStep = gameState.tutorialStep;
        const nextStep = currentStep + 1;

        const tutorialEntries = getTutorialMessage(currentStep);

        if (currentStep === 7) {
          setTimeout(() => setShowEvidenceTracker(true), 300);
          playSound('reveal');
        }
        if (currentStep === 8) {
          setTimeout(() => setShowRiskTracker(true), 300);
        }

        if (nextStep >= TUTORIAL_MESSAGES.length) {
          const newState = {
            ...gameState,
            history: [...gameState.history, ...tutorialEntries],
            tutorialStep: -1,
            tutorialComplete: true,
          };
          setGameState(newState);
          saveCheckpoint(newState, 'Tutorial complete');
        } else {
          setGameState(prev => ({
            ...prev,
            history: [...prev.history, ...tutorialEntries],
            tutorialStep: nextStep,
          }));
        }

        setInputValue('');
        return;
      }

      if (isProcessingRef.current || isProcessing || showTuringTest || !trimmedInput) return;

      const command = trimmedInput;
      const commandLower = command.toLowerCase().split(' ')[0];
      const shouldDeferUfo74 =
        commandLower === 'open' || commandLower === 'decrypt' || commandLower === 'last';
      setInputValue('');

      const dangerousCommands = ['decrypt', 'recover', 'trace', 'override', 'leak'];
      const quietCommands = ['help', 'status', 'ls', 'cd', 'back', 'notes', 'bookmark', 'progress'];
      const systemCommands = ['scan', 'wait', 'hide'];

      if (dangerousCommands.includes(commandLower)) {
        playSound('warning');
      } else if (quietCommands.includes(commandLower)) {
        playSound('enter');
      } else if (systemCommands.includes(commandLower)) {
        playSound('success');
      } else {
        playSound('enter');
      }

      setHistoryIndex(-1);

      const inputEntry = createEntry('input', `> ${command}`);
      const trimmedHistory =
        gameState.history.length >= MAX_HISTORY_SIZE
          ? gameState.history.slice(-MAX_HISTORY_SIZE + 1)
          : gameState.history;
      const newState: GameState = {
        ...gameState,
        history: [...trimmedHistory, inputEntry],
        commandHistory: [command, ...gameState.commandHistory.slice(0, MAX_COMMAND_HISTORY_SIZE - 1)],
      };

      setGameState(newState);

      if (command.toLowerCase() === 'save') {
        onSaveRequestAction(newState);
        return;
      }

      if (command.toLowerCase() === 'exit' || command.toLowerCase() === 'quit') {
        onExitAction();
        return;
      }

      isProcessingRef.current = true;
      setIsProcessing(true);

      incrementStatistic('commandsTyped');

      const result = executeCommand(inputValue, newState);

      if (result.delayMs) {
        await new Promise(resolve => setTimeout(resolve, result.delayMs));
      }

      if (result.triggerFlicker) {
        triggerFlicker();
      }

      const streamingMode = result.streamingMode || 'none';

      const stateChangesWithoutHistory = {
        ...result.stateChanges,
        truthsDiscovered: result.stateChanges.truthsDiscovered || newState.truthsDiscovered,
      };

      const intermediateState: GameState = {
        ...newState,
        ...stateChangesWithoutHistory,
      };

      if (result.stateChanges.history !== undefined) {
        setGameState({
          ...intermediateState,
          history: result.stateChanges.history,
        });
        isProcessingRef.current = false;
        setIsProcessing(false);
      } else if (streamingMode !== 'none' && result.output.length > 0) {
        const ufo74Messages = result.output.filter((e: TerminalEntry) => e.type === 'ufo74');
        const streamableOutput = result.output.filter((e: TerminalEntry) => e.type !== 'ufo74');

        if (outputRef.current) {
          streamStartScrollPos.current = outputRef.current.scrollHeight;
        }
        setIsStreaming(true);
        setGameState(intermediateState);

        try {
          await streamOutput(streamableOutput, streamingMode);

          if (result.imageTrigger || result.videoTrigger) {
            const pendingMediaMessages: TerminalEntry[] = [];
            if (result.imageTrigger) {
              pendingMediaMessages.push(
                createEntry('warning', ''),
                createEntry('warning', '▓▓▓ PARTIAL RECOVERY AVAILABLE ▓▓▓'),
                createEntry('system', '')
              );
            }
            if (result.videoTrigger) {
              pendingMediaMessages.push(
                createEntry('warning', ''),
                createEntry('warning', '▓▓▓ PARTIAL RECOVERY AVAILABLE ▓▓▓'),
                createEntry('system', '')
              );
            }
            setGameState(prev => ({
              ...prev,
              history: [...prev.history, ...pendingMediaMessages],
            }));
          }

          if (ufo74Messages.length > 0) {
            if (result.imageTrigger || result.videoTrigger) {
              setQueuedAfterMediaMessages(prev => [...prev, ...ufo74Messages]);
            } else if (shouldDeferUfo74) {
              setPendingUfo74StartMessages(prev => [...prev, ...ufo74Messages]);
            } else {
              openEncryptedChannelWithMessages(ufo74Messages);
            }
          }
        } finally {
          setIsStreaming(false);
          isProcessingRef.current = false;
          setIsProcessing(false);
          skipStreamingRef.current = false;
        }
      } else {
        const ufo74Messages = result.output.filter((e: TerminalEntry) => e.type === 'ufo74');
        const otherOutput = result.output.filter((e: TerminalEntry) => e.type !== 'ufo74');

        const pendingMediaMessages: TerminalEntry[] = [];
        if (result.imageTrigger) {
          pendingMediaMessages.push(
            createEntry('warning', ''),
            createEntry('warning', '▓▓▓ PARTIAL RECOVERY AVAILABLE ▓▓▓'),
            createEntry('system', '')
          );
        }
        if (result.videoTrigger) {
          pendingMediaMessages.push(
            createEntry('warning', ''),
            createEntry('warning', '▓▓▓ PARTIAL RECOVERY AVAILABLE ▓▓▓'),
            createEntry('system', '')
          );
        }

        setGameState({
          ...intermediateState,
          history: [...newState.history, ...otherOutput, ...pendingMediaMessages],
        });

        if (ufo74Messages.length > 0) {
          if (result.imageTrigger || result.videoTrigger) {
            setQueuedAfterMediaMessages(prev => [...prev, ...ufo74Messages]);
          } else if (shouldDeferUfo74) {
            setPendingUfo74StartMessages(prev => [...prev, ...ufo74Messages]);
          } else {
            openEncryptedChannelWithMessages(ufo74Messages);
          }
        }

        setIsProcessing(false);
        isProcessingRef.current = false;
      }

      if (result.imageTrigger) {
        setPendingImage(result.imageTrigger);
      }
      if (result.videoTrigger) {
        setPendingVideo(result.videoTrigger);
      }

      if (result.pendingUfo74Messages && result.pendingUfo74Messages.length > 0) {
        if (result.imageTrigger || result.videoTrigger) {
          setQueuedAfterMediaMessages(prev => [...prev, ...result.pendingUfo74Messages!]);
        } else if (shouldDeferUfo74) {
          setPendingUfo74StartMessages(prev => [...prev, ...result.pendingUfo74Messages!]);
        } else {
          openEncryptedChannelWithMessages(result.pendingUfo74Messages);
        }
      }

      if (result.triggerTuringTest) {
        setTimeout(() => {
          setShowTuringTest(true);
        }, 1500);
      }

      if (result.skipToPhase) {
        setGamePhase(result.skipToPhase);
        isProcessingRef.current = false;
        setIsProcessing(false);
        setTimeout(() => inputRef.current?.focus(), 0);
        return;
      }

      if (intermediateState.isGameOver) {
        setGameOverReason(intermediateState.gameOverReason || 'CRITICAL SYSTEM FAILURE');
        setShowGameOver(true);
        playSound('error');
        return;
      }

      const truthCount = intermediateState.truthsDiscovered?.size || 0;
      const prevTruthCount = gameState.truthsDiscovered?.size || 0;

      const filesReadCount = intermediateState.filesRead?.size || 0;
      const prevFilesReadCount = gameState.filesRead?.size || 0;
      if (filesReadCount > prevFilesReadCount) {
        incrementStatistic('filesRead');
      }

      if (truthCount > prevTruthCount) {
        playSound('fanfare');
        const checkpointReason =
          truthCount === 1
            ? 'First evidence'
            : truthCount === 5
              ? 'All evidence found'
              : `Evidence ${truthCount}/5`;
        saveCheckpoint(intermediateState, checkpointReason);
      }

      if (truthCount > 0 && prevTruthCount === 0) {
        checkAchievement('first_blood');
      }

      if (truthCount === 5 && prevTruthCount < 5) {
        checkAchievement('truth_seeker');
      }

      if (intermediateState.accessLevel > gameState.accessLevel && intermediateState.accessLevel >= 2) {
        saveCheckpoint(intermediateState, `Access level ${intermediateState.accessLevel}`);
      }

      if (!gameState.flags?.adminUnlocked && intermediateState.flags?.adminUnlocked) {
        saveCheckpoint(intermediateState, 'Admin access unlocked');
      }

      if (
        gameState.timedDecryptActive &&
        !intermediateState.timedDecryptActive &&
        intermediateState.avatarExpression === 'smirk'
      ) {
        playSound('fanfare');
      }

      if (!gameState.flags?.adminUnlocked && intermediateState.flags?.adminUnlocked) {
        playSound('fanfare');
      }

      if (result.output.length > 5 && command.toLowerCase().startsWith('open')) {
        const significantLines = result.output
          .filter(entry => entry.type === 'output' && entry.content.length > 20)
          .map(entry => entry.content)
          .slice(0, 5);
        if (significantLines.length > 0) {
          setBurnInLines(prev => [...significantLines, ...prev].slice(0, 8));
        }
      }

      if (intermediateState.godMode && !gameState.godMode) {
        checkAchievement('doom_fan');
      }

      if (result.checkAchievements) {
        for (const achievementId of result.checkAchievements) {
          checkAchievement(achievementId);
        }
      }

      const sessionDuration = Date.now() - gameState.sessionStartTime;
      if (sessionDuration >= NIGHT_OWL_DURATION_MS) {
        checkAchievement('night_owl');
      }

      setTimeout(() => inputRef.current?.focus(), 0);
    },
    [
      checkAchievement,
      consumeTabPressed,
      gamePhase,
      gameState,
      inputValue,
      isProcessing,
      isProcessingRef,
      onExitAction,
      onSaveRequestAction,
      openEncryptedChannelWithMessages,
      outputRef,
      pendingImage,
      pendingUfo74Messages,
      pendingUfo74StartMessages,
      pendingVideo,
      playSound,
      setActiveImage,
      setActiveVideo,
      setBurnInLines,
      setEncryptedChannelState,
      setGameOverReason,
      setGamePhase,
      setGameState,
      setHistoryIndex,
      setInputValue,
      setIsProcessing,
      setIsStreaming,
      setPendingImage,
      setPendingUfo74Messages,
      setPendingUfo74StartMessages,
      setPendingVideo,
      setQueuedAfterMediaMessages,
      setShowEvidenceTracker,
      setShowGameOver,
      setShowRiskTracker,
      setShowTuringTest,
      showTuringTest,
      skipStreamingRef,
      streamOutput,
      streamStartScrollPos,
      triggerFlicker,
    ]
  );

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === 'Tab') {
        e.preventDefault();

        markTabPressed();

        const completions = getCompletions(inputValue);

        const completed = completeInput(inputValue, completions);
        if (completed) {
          setInputValue(completed);
        }

        if (completions.length > 1) {
          const parts = inputValue.trimStart().split(/\s+/);
          const cmd = parts[0]?.toLowerCase();
          const isFileCommand = cmd === 'open' || cmd === 'decrypt';

          const completionLines: string[] = [];
          completionLines.push(completions.join('  '));

          if (isFileCommand && completions.length <= 3) {
            const partial = parts[parts.length - 1];
            let searchDir = gameState.currentPath;
            if (partial.includes('/')) {
              const lastSlash = partial.lastIndexOf('/');
              searchDir = resolvePath(partial.substring(0, lastSlash + 1), gameState.currentPath);
            }

            for (const completion of completions) {
              const fullPath = searchDir === '/' ? `/${completion}` : `${searchDir}/${completion}`;
              const node = getNode(fullPath, gameState);
              if (node && node.type === 'file') {
                const preview = getFileContent(fullPath, gameState);
                if (preview && preview.length > 0) {
                  const firstLine = preview.find(line => line.trim().length > 0) || preview[0];
                  const truncated =
                    firstLine.length > 50 ? firstLine.substring(0, 50) + '...' : firstLine;
                  completionLines.push(`  ${completion}: "${truncated}"`);
                }
              }
            }
          }

          const completionEntries = completionLines.map(line => createEntry('system', line));
          setGameState(prev => ({
            ...prev,
            history: [...prev.history, ...completionEntries],
          }));
        }
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        const newIndex = Math.min(historyIndex + 1, gameState.commandHistory.length - 1);
        if (newIndex >= 0 && gameState.commandHistory[newIndex]) {
          setHistoryIndex(newIndex);
          setInputValue(gameState.commandHistory[newIndex]);
        }
      } else if (e.key === 'ArrowDown') {
        e.preventDefault();
        const newIndex = historyIndex - 1;
        if (newIndex < 0) {
          setHistoryIndex(-1);
          setInputValue('');
        } else if (gameState.commandHistory[newIndex]) {
          setHistoryIndex(newIndex);
          setInputValue(gameState.commandHistory[newIndex]);
        }
      } else if (e.ctrlKey && e.key === 'l') {
        e.preventDefault();
        setGameState(prev => ({ ...prev, history: [] }));
      } else if (e.key === 'Backspace') {
        if (inputValue.length > 0) {
          playKeySound('Backspace');
        }
      }
    },
    [
      completeInput,
      gameState,
      getCompletions,
      historyIndex,
      inputValue,
      markTabPressed,
      playKeySound,
      setGameState,
      setHistoryIndex,
      setInputValue,
    ]
  );

  return { handleSubmit, handleKeyDown };
}
