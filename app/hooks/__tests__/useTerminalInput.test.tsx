import { beforeEach, describe, expect, it, vi } from 'vitest';
import { act, renderHook } from '@testing-library/react';
import { DEFAULT_GAME_STATE, GameState } from '../../types';

vi.mock('../../storage/saves', () => ({
  saveCheckpoint: vi.fn(),
}));

vi.mock('../../storage/statistics', () => ({
  incrementStatistic: vi.fn(),
}));

vi.mock('../../components/FirewallEyes', () => ({
  speakCustomFirewallVoice: vi.fn(),
}));

vi.mock('../../i18n', () => ({
  translateStatic: (_key: string, _vars?: Record<string, unknown>, fallback?: string) =>
    fallback ?? _key,
}));

vi.mock('../../engine/commands', () => {
  let entryId = 0;

  return {
    executeCommand: vi.fn(),
    createEntry: (type: string, content: string) => ({
      id: String(++entryId),
      type,
      content,
      timestamp: Date.now(),
    }),
    getTutorialMessage: vi.fn(),
    TUTORIAL_MESSAGES: {},
    sanitizeCommandInput: (input: string) => ({
      value: input,
      truncated: false,
    }),
  };
});

import { useTerminalInput } from '../useTerminalInput';
import { executeCommand } from '../../engine/commands';
import { saveCheckpoint } from '../../storage/saves';

function createGameState(overrides: Partial<GameState> = {}): GameState {
  return {
    ...DEFAULT_GAME_STATE,
    seed: 12345,
    rngState: 12345,
    sessionStartTime: 1,
    tutorialStep: -1,
    tutorialComplete: true,
    ...overrides,
  };
}

function createCommandResult(stateChanges: Partial<GameState>): ReturnType<typeof executeCommand> {
  return {
    output: [],
    stateChanges,
  };
}

function createOptions(gameState: GameState, inputValue = 'status') {
  let trackedState = gameState;

  return {
    gameState,
    gamePhase: 'terminal' as const,
    inputValue,
    textSpeed: 'normal' as const,
    isProcessing: false,
    showTuringTest: false,
    pendingImage: null,
    pendingUfo74StartMessages: [],
    pendingUfo74Messages: [],
    historyIndex: -1,
    setGameState: vi.fn(update => {
      trackedState = typeof update === 'function' ? update(trackedState) : update;
    }),
    setInputValue: vi.fn(),
    setIsProcessing: vi.fn(),
    setIsStreaming: vi.fn(),
    setHistoryIndex: vi.fn(),
    setPendingImage: vi.fn(),
    setActiveImage: vi.fn(),
    setPendingUfo74StartMessages: vi.fn(),
    appendPendingUfo74StartMessages: vi.fn(),
    setPendingUfo74Messages: vi.fn(),
    appendPendingUfo74Messages: vi.fn(),
    setQueuedAfterMediaMessages: vi.fn(),
    appendQueuedAfterMediaMessages: vi.fn(),
    setShowEvidenceTracker: vi.fn(),
    setShowRiskTracker: vi.fn(),
    setShowAttBar: vi.fn(),
    setShowAvatar: vi.fn(),
    setAvatarCreepyEntrance: vi.fn(),
    setIsShaking: vi.fn(),
    setShowFirewallScare: vi.fn(),
    setEvidenceFoundIndicatorKey: vi.fn(),
    setGamePhase: vi.fn(),
    setGameOverReason: vi.fn(),
    setShowGameOver: vi.fn(),
    setBurnInLines: vi.fn(),
    setEncryptedChannelState: vi.fn(),
    onTuringTestTrigger: vi.fn(),
    onExitAction: vi.fn(),
    onSaveRequestAction: vi.fn(),
    playSound: vi.fn(),
    playKeySound: vi.fn(),
    startAmbient: vi.fn(),
    triggerFlicker: vi.fn(),
    checkAchievement: vi.fn(),
    getCompletions: vi.fn(() => []),
    completeInput: vi.fn(() => null),
    markTabPressed: vi.fn(),
    consumeTabPressed: vi.fn(() => false),
    refs: {
      outputRef: { current: null },
      inputRef: { current: null },
      streamStartScrollPos: { current: null },
      skipStreamingRef: { current: false },
      isProcessingRef: { current: false },
    },
  };
}

describe('useTerminalInput evidence progression', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('writes /10 evidence progress checkpoints before the final threshold', async () => {
    vi.mocked(executeCommand).mockReturnValue(
      createCommandResult({
        evidenceCount: 6,
        filesRead: new Set(['/storage/quarantine/logistics_manifest_fragment.txt']),
      })
    );
    const options = createOptions(
      createGameState({
        evidenceCount: 5,
        filesRead: new Set(['/storage/quarantine/bio_container.log']),
      })
    );
    const { result } = renderHook(() => useTerminalInput(options));

    await act(async () => {
      await result.current.handleSubmit();
    });

    expect(saveCheckpoint).toHaveBeenCalledWith(
      expect.objectContaining({ evidenceCount: 6 }),
      'Evidence 6/10'
    );
    expect(options.checkAchievement).not.toHaveBeenCalledWith('truth_seeker');
  });

  it('grants truth_seeker and checkpoints the all-evidence state at 10', async () => {
    vi.mocked(executeCommand).mockReturnValue(
      createCommandResult({
        evidenceCount: 10,
        filesRead: new Set(['/tmp/save_evidence.sh']),
      })
    );
    const options = createOptions(
      createGameState({
        evidenceCount: 9,
        filesRead: new Set(['/tmp/session_residue.log']),
      })
    );
    const { result } = renderHook(() => useTerminalInput(options));

    await act(async () => {
      await result.current.handleSubmit();
    });

    expect(saveCheckpoint).toHaveBeenCalledWith(
      expect.objectContaining({ evidenceCount: 10 }),
      'All evidence found'
    );
    expect(options.checkAchievement).toHaveBeenCalledWith('truth_seeker');
  });
});
