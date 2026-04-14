'use client';

import { useCallback } from 'react';
import {
  executeCommand,
  createEntry,
  getTutorialMessage,
  TUTORIAL_MESSAGES,
  sanitizeCommandInput,
} from '../engine/commands';
import { createEntryI18n } from '../engine/commands/utils';
import {
  isInTutorialMode,
  processTutorialInput,
  isTutorialInputState,
  TUTORIAL_INTRO_STEPS,
  TUTORIAL_BRIEFING_STEPS,
} from '../engine/commands/interactiveTutorial';
import { resolvePath, getFileContent, getNode } from '../engine/filesystem';
import { MAX_EVIDENCE_COUNT } from '../engine/evidenceRevelation';
import { saveCheckpoint } from '../storage/saves';
import { incrementStatistic } from '../storage/statistics';
import {
  MAX_COMMAND_HISTORY_SIZE,
  MAX_COMMAND_INPUT_LENGTH,
} from '../constants/limits';
import { NIGHT_OWL_DURATION_MS } from '../constants/timing';
import { uiRandom } from '../engine/rng';
import {
  TutorialStateID,
  type GamePhase,
  type GameState,
  type ImageTrigger,
  type StreamingMode,
  type TerminalEntry,
} from '../types';
import type { SoundType } from './useSound';
import { appendToHistory } from '../lib/appendToHistory';
import { speakCustomFirewallVoice } from '../components/FirewallEyes';
import { translateStatic } from '../i18n';

const STREAMING_DELAYS: Record<
  StreamingMode,
  { base: number; variance: number }
> = {
  none: { base: 0, variance: 0 },
  fast: { base: 40, variance: 20 },
  normal: { base: 80, variance: 30 },
  slow: { base: 120, variance: 50 },
};

type EncryptedChannelState = 'idle' | 'awaiting_open' | 'open' | 'awaiting_close';

interface TerminalInputRefs {
  outputRef: React.RefObject<HTMLDivElement | null>;
  inputRef: React.RefObject<HTMLInputElement | null>;
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
  pendingUfo74StartMessages: TerminalEntry[];
  pendingUfo74Messages: TerminalEntry[];
  historyIndex: number;
  setGameState: React.Dispatch<React.SetStateAction<GameState>>;
  setInputValue: React.Dispatch<React.SetStateAction<string>>;
  setIsProcessing: React.Dispatch<React.SetStateAction<boolean>>;
  setIsStreaming: React.Dispatch<React.SetStateAction<boolean>>;
  setHistoryIndex: React.Dispatch<React.SetStateAction<number>>;
  setPendingImage: React.Dispatch<React.SetStateAction<ImageTrigger | null>>;
  setActiveImage: React.Dispatch<React.SetStateAction<ImageTrigger | null>>;
  setPendingUfo74StartMessages: React.Dispatch<React.SetStateAction<TerminalEntry[]>>;
  appendPendingUfo74StartMessages: (items: TerminalEntry[]) => void;
  setPendingUfo74Messages: React.Dispatch<React.SetStateAction<TerminalEntry[]>>;
  appendPendingUfo74Messages: (items: TerminalEntry[]) => void;
  setQueuedAfterMediaMessages: React.Dispatch<React.SetStateAction<TerminalEntry[]>>;
  appendQueuedAfterMediaMessages: (items: TerminalEntry[]) => void;
  setShowEvidenceTracker: React.Dispatch<React.SetStateAction<boolean>>;
  setShowRiskTracker: React.Dispatch<React.SetStateAction<boolean>>;
  setShowAttBar: React.Dispatch<React.SetStateAction<boolean>>;
  setShowAvatar: React.Dispatch<React.SetStateAction<boolean>>;
  setAvatarCreepyEntrance: React.Dispatch<React.SetStateAction<boolean>>;
  setIsShaking: React.Dispatch<React.SetStateAction<boolean>>;
  setShowFirewallScare: React.Dispatch<React.SetStateAction<boolean>>;
  setEvidenceFoundIndicatorKey: React.Dispatch<React.SetStateAction<number>>;
  setGamePhase: React.Dispatch<React.SetStateAction<GamePhase>>;
  setGameOverReason: React.Dispatch<React.SetStateAction<string>>;
  setShowGameOver: React.Dispatch<React.SetStateAction<boolean>>;
  setBurnInLines: React.Dispatch<React.SetStateAction<string[]>>;
  setEncryptedChannelState: React.Dispatch<React.SetStateAction<EncryptedChannelState>>;
  onTuringTestTrigger: () => void;
  onExitAction: () => void;
  onSaveRequestAction: (state: GameState) => void;
  playSound: (sound: SoundType) => void;
  playKeySound: (key: string) => void;
  startAmbient: () => void;
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
  pendingUfo74StartMessages,
  pendingUfo74Messages,
  historyIndex,
  setGameState,
  setInputValue,
  setIsProcessing,
  setIsStreaming,
  setHistoryIndex,
  setPendingImage,
  setActiveImage,
  setPendingUfo74StartMessages,
  appendPendingUfo74StartMessages,
  setPendingUfo74Messages,
  appendQueuedAfterMediaMessages,
  setShowEvidenceTracker,
  setShowRiskTracker,
  setShowAttBar,
  setShowAvatar,
  setAvatarCreepyEntrance,
  setIsShaking,
  setShowFirewallScare,
  setEvidenceFoundIndicatorKey,
  setGamePhase,
  setGameOverReason,
  setShowGameOver,
  setBurnInLines,
  setEncryptedChannelState,
  onTuringTestTrigger,
  onExitAction,
  onSaveRequestAction,
  playSound,
  playKeySound,
  startAmbient,
  triggerFlicker,
  checkAchievement,
  getCompletions,
  completeInput,
  markTabPressed,
  consumeTabPressed,
  refs,
}: UseTerminalInputOptions) {
  const { outputRef, inputRef, streamStartScrollPos, skipStreamingRef, isProcessingRef } = refs;

  const scrollToBottom = useCallback(() => {
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        if (outputRef.current) {
          outputRef.current.scrollTop = outputRef.current.scrollHeight;
        }
      });
    });
  }, [outputRef]);

  const openEncryptedChannelWithMessages = useCallback(
    (messages: TerminalEntry[]) => {
      if (messages.length === 0) return;

      // Checkpoint on first UFO74 contact (major story moment)
      if (!gameState.flags?.firstUfo74Contact) {
        saveCheckpoint(
          { ...gameState, flags: { ...gameState.flags, firstUfo74Contact: true } },
          translateStatic('checkpoint.reason.firstUfo74Contact', undefined, 'First UFO74 contact')
        );
      }

      setGameState(prev => ({
        ...prev,
        // Mark first UFO74 contact
        flags: { ...prev.flags, firstUfo74Contact: true },
        history: [...prev.history, ...messages],
      }));
      playSound('transmission');
      playSound('message');

      setPendingUfo74Messages([]);
      setEncryptedChannelState('idle');
    },
    [gameState, playSound, setEncryptedChannelState, setGameState, setPendingUfo74Messages]
  );

  const streamOutput = useCallback(
    async (entries: TerminalEntry[], mode: StreamingMode): Promise<void> => {
      if (mode === 'none' || entries.length === 0) {
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
          setGameState(prev => ({
            ...prev,
            history: [...prev.history, ...remaining],
          }));
          break;
        }

        const entry = entries[i];

        setGameState(prev => ({
          ...prev,
          history: [...prev.history, entry],
        }));

        const delay = config.base + (uiRandom() * config.variance * 2 - config.variance);

        if (delay > 0 && i < entries.length - 1) {
          await new Promise(resolve => setTimeout(resolve, delay));
        }
      }
    },
    [setGameState, skipStreamingRef]
  );

  const handleSubmit = useCallback(
    async (e?: React.SyntheticEvent) => {
      e?.preventDefault?.();

      const sanitizedInput = sanitizeCommandInput(inputValue, MAX_COMMAND_INPUT_LENGTH);
      const trimmedInput = sanitizedInput.value.trim();

      if (pendingImage && !trimmedInput) {
        setActiveImage(pendingImage);
        setPendingImage(null);
        playSound('creepy');
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

      // Merge both UFO74 message queues into a single encrypted channel
      const allPendingUfo74 = [...pendingUfo74StartMessages, ...pendingUfo74Messages];
      if (allPendingUfo74.length > 0 && !trimmedInput) {
        setPendingUfo74StartMessages([]);
        setPendingUfo74Messages([]);
        openEncryptedChannelWithMessages(allPendingUfo74);
        return;
      }

      if (isInTutorialMode(gameState)) {
        const tutorialState = gameState.interactiveTutorialState;

        // Handle INTRO: step-by-step blocks on Enter
        if (tutorialState?.current === TutorialStateID.INTRO) {
          if (trimmedInput) {
            setInputValue('');
            return;
          }

          const introStep = gameState.tutorialStep ?? 0;

          if (introStep < TUTORIAL_INTRO_STEPS.length) {
            const stepEntries = TUTORIAL_INTRO_STEPS[introStep];
            const nextStep = introStep + 1;
            const isLastStep = nextStep >= TUTORIAL_INTRO_STEPS.length;

            // Sound feedback on each Enter press
            if (introStep !== 1) {
              playSound('enter');
            }

            // Block 1: "You will be... hackerkid" → trigger creepy avatar entrance
            if (introStep === 1) {
              setTimeout(() => {
                setAvatarCreepyEntrance(true);
                setShowAvatar(true);
                setTimeout(() => setAvatarCreepyEntrance(false), 3000);
              }, 500);
              playSound('creepy');
            }

            if (isLastStep) {
              // Intro complete → transition to LS_PROMPT
              setGameState(prev => ({
                ...prev,
                history: [...prev.history, ...stepEntries],
                tutorialStep: 0,
                interactiveTutorialState: {
                  ...tutorialState,
                  current: TutorialStateID.LS_PROMPT,
                  inputLocked: false,
                  dialogueComplete: true,
                },
              }));
            } else {
              setGameState(prev => ({
                ...prev,
                history: [...prev.history, ...stepEntries],
                tutorialStep: nextStep,
              }));
            }
          }

          setInputValue('');
          return;
        }

        // Handle TUTORIAL_END briefing: step-by-step on Enter
        if (tutorialState?.current === TutorialStateID.TUTORIAL_END) {
          if (trimmedInput) {
            setInputValue('');
            return;
          }

          const briefingStep = gameState.tutorialStep ?? 0;

          if (briefingStep < TUTORIAL_BRIEFING_STEPS.length) {
            const stepEntries = TUTORIAL_BRIEFING_STEPS[briefingStep];

            // Step 0: evidence mention → reveal evidence tracker + ambient
            if (briefingStep === 0) {
              setTimeout(() => setShowEvidenceTracker(true), 300);
              startAmbient();
              playSound('reveal');
            }
            // Step 1: risk/detection mention → reveal risk bar
            else if (briefingStep === 1) {
              setTimeout(() => setShowRiskTracker(true), 300);
              playSound('reveal');
            }
            // Step 2: attempts mention → reveal ATT bar
            else if (briefingStep === 2) {
              setTimeout(() => setShowAttBar(true), 300);
              playSound('reveal');
            }
            // All other briefing steps
            else {
              playSound('enter');
            }

            const nextStep = briefingStep + 1;
            const isLastStep = nextStep >= TUTORIAL_BRIEFING_STEPS.length;

            if (isLastStep) {
              // Briefing complete → transition to GAME_ACTIVE
              setGameState(prev => {
                const newState = {
                  ...prev,
                  history: [...prev.history, ...stepEntries],
                  tutorialStep: -1,
                  tutorialComplete: true,
                  interactiveTutorialState: {
                    ...tutorialState,
                    current: TutorialStateID.GAME_ACTIVE,
                    inputLocked: false,
                  },
                  currentPath: '/',
                };
                saveCheckpoint(
                  newState,
                  translateStatic('checkpoint.reason.tutorialComplete', undefined, 'Tutorial complete')
                );
                return newState;
              });
            } else {
              setGameState(prev => ({
                ...prev,
                history: [...prev.history, ...stepEntries],
                tutorialStep: nextStep,
              }));
            }
          }

          setInputValue('');
          return;
        }

        if (!tutorialState || !isTutorialInputState(tutorialState.current)) {
          setInputValue('');
          return;
        }

        const tabWasPressed = consumeTabPressed();
        const result = processTutorialInput(trimmedInput, gameState, tabWasPressed);

        // Sound feedback for tutorial commands
        if (trimmedInput) {
          playSound('enter');
        }

        if (result.output.length > 0 || result.stateChanges) {
          setGameState(prev => ({
            ...prev,
            ...result.stateChanges,
            history: [...prev.history, ...result.output],
          }));
        }

        // Firewall jumpscare when player navigates back (cd ..)
        const newTutState = result.stateChanges?.interactiveTutorialState;
        if (newTutState && newTutState.current === TutorialStateID.LS_REINFORCE) {
          // Trigger the scare: shake + eye overlay + robotic voice
          setIsShaking(true);
          setShowFirewallScare(true);
          playSound('error');
          speakCustomFirewallVoice('I see you');

          // After 1.5s, dismiss scare and show UFO74 warning
          setTimeout(() => {
            setIsShaking(false);
            setShowFirewallScare(false);

            // UFO74 firewall warning
            setTimeout(() => {
              setGameState(prev => ({
                ...prev,
                history: [
                  ...prev.history,
                  createEntry('system', ''),
                  createEntryI18n(
                    'ufo74',
                    'hooks.useTerminalInput.firewallWarning.1',
                    "[UFO74]: ⚠️  Hey kid, that's the FIREWALL."
                  ),
                  createEntryI18n(
                    'ufo74',
                    'hooks.useTerminalInput.firewallWarning.2',
                    '[UFO74]: We better not mess with that crazy thing.'
                  ),
                  createEntryI18n(
                    'ufo74',
                    'hooks.useTerminalInput.firewallWarning.3',
                    '[UFO74]: █▓▒░ BE CAREFUL ░▒▓█'
                  ),
                  createEntry('system', ''),
                  createEntryI18n(
                    'ufo74',
                    'hooks.useTerminalInput.firewallWarning.4',
                    "[UFO74]: Let's try `cd ..` again."
                  ),
                  createEntry('system', ''),
                ],
              }));
              playSound('message');
            }, 400);
          }, 1500);
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
          const errorEntry = createEntryI18n(
            'error',
            'hooks.useTerminalInput.incomingTransmissionInProgress',
            'ERROR: Incoming transmission in progress.'
          );
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
          setGameState(prev => {
            const newState = {
              ...prev,
              history: [...prev.history, ...tutorialEntries],
              tutorialStep: -1,
              tutorialComplete: true,
            };
            saveCheckpoint(
              newState,
              translateStatic('checkpoint.reason.tutorialComplete', undefined, 'Tutorial complete')
            );
            return newState;
          });
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

      const dangerousCommands = ['recover', 'trace', 'override', 'leak'];
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
      const newState: GameState = {
        ...gameState,
        history: appendToHistory(gameState.history, inputEntry),
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
      const previousSingularEvents = newState.singularEventsTriggered || new Set<string>();
      const nextSingularEvents =
        result.stateChanges.singularEventsTriggered || previousSingularEvents;
      const didTriggerSecondVoice =
        !previousSingularEvents.has('second_voice') && nextSingularEvents.has('second_voice');
      const playSecondVoiceCue = () => {
        if (!didTriggerSecondVoice) return;

        // Fire only when the actual one-time event lands in history, so the cue stays sparse
        // and follows the unsettling text instead of preceding it.
        setTimeout(() => playSound('omen'), 120);
        setTimeout(() => playSound('static'), 320);
      };

      if (result.delayMs) {
        await new Promise(resolve => setTimeout(resolve, result.delayMs));
      }

      if (result.triggerFlicker) {
        triggerFlicker();
      }

      const streamingMode = result.streamingMode || 'none';

      const stateChangesWithoutHistory = {
        ...result.stateChanges,
        evidenceCount: result.stateChanges.evidenceCount ?? newState.evidenceCount,
      };

      const intermediateState: GameState = {
        ...newState,
        ...stateChangesWithoutHistory,
      };

      if (result.stateChanges.history !== undefined) {
        setGameState(prev => ({
          ...prev,
          ...stateChangesWithoutHistory,
          history: result.stateChanges.history!,
        }));
        playSecondVoiceCue();
        scrollToBottom();
        isProcessingRef.current = false;
        setIsProcessing(false);
      } else if (streamingMode !== 'none' && result.output.length > 0) {
        const ufo74Messages = result.output.filter((e: TerminalEntry) => e.type === 'ufo74');
        const streamableOutput = result.output.filter((e: TerminalEntry) => e.type !== 'ufo74');

        if (outputRef.current) {
          streamStartScrollPos.current = outputRef.current.scrollHeight;
        }
        setIsStreaming(true);
        setGameState(prev => ({
          ...prev,
          ...stateChangesWithoutHistory,
        }));

        try {
          await streamOutput(streamableOutput, streamingMode);

          if (result.imageTrigger) {
            const pendingMediaMessages: TerminalEntry[] = [];
            if (result.imageTrigger) {
              pendingMediaMessages.push(
                createEntry('warning', ''),
                createEntryI18n(
                  'warning',
                  'hooks.useTerminalInput.partialRecoveryAvailable',
                  '▓▓▓ PARTIAL RECOVERY AVAILABLE ▓▓▓'
                ),
                createEntry('system', '')
              );
            }
            setGameState(prev => ({
              ...prev,
              history: [...prev.history, ...pendingMediaMessages],
            }));
          }

          playSecondVoiceCue();

          if (ufo74Messages.length > 0) {
            if (result.imageTrigger) {
              appendQueuedAfterMediaMessages(ufo74Messages);
            } else if (shouldDeferUfo74) {
              appendPendingUfo74StartMessages(ufo74Messages);
            } else {
              openEncryptedChannelWithMessages(ufo74Messages);
            }
          }
        } finally {
          setIsStreaming(false);
          isProcessingRef.current = false;
          setIsProcessing(false);
          skipStreamingRef.current = false;
          scrollToBottom();
        }
      } else {
        const ufo74Messages = result.output.filter((e: TerminalEntry) => e.type === 'ufo74');
        const otherOutput = result.output.filter((e: TerminalEntry) => e.type !== 'ufo74');

        const pendingMediaMessages: TerminalEntry[] = [];
        if (result.imageTrigger) {
          pendingMediaMessages.push(
            createEntry('warning', ''),
            createEntryI18n(
              'warning',
              'hooks.useTerminalInput.partialRecoveryAvailable',
              '▓▓▓ PARTIAL RECOVERY AVAILABLE ▓▓▓'
            ),
            createEntry('system', '')
          );
        }

        setGameState(prev => ({
          ...prev,
          ...stateChangesWithoutHistory,
          history: [...prev.history, ...otherOutput, ...pendingMediaMessages],
        }));
        playSecondVoiceCue();
        scrollToBottom();

        if (ufo74Messages.length > 0) {
          if (result.imageTrigger) {
            appendQueuedAfterMediaMessages(ufo74Messages);
          } else if (shouldDeferUfo74) {
            appendPendingUfo74StartMessages(ufo74Messages);
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

      if (result.pendingUfo74Messages && result.pendingUfo74Messages.length > 0) {
        if (result.imageTrigger) {
          appendQueuedAfterMediaMessages(result.pendingUfo74Messages);
        } else if (shouldDeferUfo74) {
          appendPendingUfo74StartMessages(result.pendingUfo74Messages);
        } else {
          openEncryptedChannelWithMessages(result.pendingUfo74Messages);
        }
      }

      if (result.triggerTuringTest) {
        setTimeout(() => {
          onTuringTestTrigger();
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
        setGameOverReason(
          intermediateState.gameOverReason ||
            translateStatic(
              'gameOver.reason.criticalSystemFailure',
              undefined,
              'CRITICAL SYSTEM FAILURE'
            )
        );
        setShowGameOver(true);
        playSound('error');
        return;
      }

      const evidenceCount = intermediateState.evidenceCount || 0;
      const prevEvidenceCount = gameState.evidenceCount || 0;

      const filesReadCount = intermediateState.filesRead?.size || 0;
      const prevFilesReadCount = gameState.filesRead?.size || 0;
      if (filesReadCount > prevFilesReadCount) {
        incrementStatistic('filesRead');
      }

      if (evidenceCount > prevEvidenceCount) {
        setEvidenceFoundIndicatorKey(prev => prev + 1);
        playSound('fanfare');
        const checkpointReason =
          evidenceCount === 1
            ? translateStatic('checkpoint.reason.firstEvidence', undefined, 'First evidence')
            : evidenceCount === MAX_EVIDENCE_COUNT
              ? translateStatic('checkpoint.reason.allEvidenceFound', undefined, 'All evidence found')
              : translateStatic(
                  'checkpoint.reason.evidenceProgress',
                  { count: evidenceCount },
                  `Evidence ${evidenceCount}/${MAX_EVIDENCE_COUNT}`
                );
        saveCheckpoint(intermediateState, checkpointReason);
      }

      if (evidenceCount > 0 && prevEvidenceCount === 0) {
        checkAchievement('first_blood');
      }

      if (
        evidenceCount === MAX_EVIDENCE_COUNT &&
        prevEvidenceCount < MAX_EVIDENCE_COUNT
      ) {
        checkAchievement('truth_seeker');
      }

      if (intermediateState.accessLevel > gameState.accessLevel && intermediateState.accessLevel >= 2) {
        saveCheckpoint(
          intermediateState,
          translateStatic(
            'checkpoint.reason.accessLevel',
            { value: intermediateState.accessLevel },
            `Access level ${intermediateState.accessLevel}`
          )
        );
      }

      if (!gameState.flags?.adminUnlocked && intermediateState.flags?.adminUnlocked) {
        saveCheckpoint(
          intermediateState,
          translateStatic(
            'checkpoint.reason.adminAccessUnlocked',
            undefined,
            'Admin access unlocked'
          )
        );
      }

      // Checkpoint when detection approaches critical threshold (80%+)
      // Only checkpoint once per session to avoid spam
      if (
        intermediateState.detectionLevel >= 80 &&
        gameState.detectionLevel < 80 &&
        !gameState.flags?.criticalDetectionCheckpointed
      ) {
        // Save checkpoint with the flag set to prevent duplicate checkpoints
        const stateWithFlag = {
          ...intermediateState,
          flags: { ...intermediateState.flags, criticalDetectionCheckpointed: true },
        };
        saveCheckpoint(
          stateWithFlag,
          translateStatic(
            'checkpoint.reason.detectionApproachingCritical',
            undefined,
            'Detection approaching critical'
          )
        );
        // Update the intermediate state so the flag persists
        setGameState(prev => ({
          ...prev,
          flags: { ...prev.flags, criticalDetectionCheckpointed: true },
        }));
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

      // Play morse code audio when opening the morse intercept file
      if (!gameState.morseFileRead && intermediateState.morseFileRead) {
        // Delay slightly so the file content starts streaming first
        setTimeout(() => playSound('morse'), 800);
      }

      // Handle soundTrigger from command results
      if (result.soundTrigger === 'evidence') {
        playSound('reveal');
      } else if (result.soundTrigger === 'error') {
        playSound('error');
      } else if (result.soundTrigger === 'morse') {
        playSound('morse');
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
      playSound,
      setActiveImage,
      setBurnInLines,
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
      appendPendingUfo74StartMessages,
      appendQueuedAfterMediaMessages,
      setShowEvidenceTracker,
      setShowAttBar,
      setShowAvatar,
      setAvatarCreepyEntrance,
      setIsShaking,
      setShowFirewallScare,
      setShowGameOver,
      setShowRiskTracker,
      showTuringTest,
      onTuringTestTrigger,
      inputRef,
      skipStreamingRef,
      startAmbient,
      streamOutput,
      streamStartScrollPos,
      scrollToBottom,
      triggerFlicker,
      setEvidenceFoundIndicatorKey,
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
