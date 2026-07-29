import { beforeEach, describe, expect, it, vi } from 'vitest';
import { act, renderHook } from '@testing-library/react';
import { DEFAULT_GAME_STATE, GameState, TutorialStateID } from '../../types';
import { MAX_COMMAND_INPUT_LENGTH } from '../../constants/limits';

vi.mock('../../storage/saves', () => ({
  saveCheckpoint: vi.fn(),
}));

vi.mock('../../storage/statistics', () => ({
  incrementStatistic: vi.fn(),
}));

vi.mock('../../lib/firewallVoice', () => ({
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
    sanitizeCommandInput: (input: string, maxLength = 256) => ({
      value: input.slice(0, maxLength),
      wasModified: input.length > maxLength,
      wasTruncated: input.length > maxLength,
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
    setGamePhase: vi.fn(),
    setGameOverReason: vi.fn(),
    setShowGameOver: vi.fn(),
    setBurnInLines: vi.fn(),
    setEncryptedChannelState: vi.fn(),
    onTuringTestTrigger: vi.fn(),
    onFirewallTaunt: vi.fn(),
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
    getTrackedState: () => trackedState,
  };
}

describe('useTerminalInput evidence progression', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('no longer writes an investigation-progress checkpoint when 5 files are read', async () => {
    vi.mocked(executeCommand).mockReturnValue(
      createCommandResult({
        evidenceCount: 6,
        filesRead: new Set([
          '/storage/quarantine/bio_container.log',
          '/storage/quarantine/manifest_a.txt',
          '/storage/quarantine/manifest_b.txt',
          '/storage/quarantine/manifest_c.txt',
          '/storage/quarantine/logistics_manifest_fragment.txt',
        ]),
      })
    );
    const options = createOptions(
      createGameState({
        evidenceCount: 5,
        filesRead: new Set([
          '/storage/quarantine/bio_container.log',
          '/storage/quarantine/manifest_a.txt',
          '/storage/quarantine/manifest_b.txt',
          '/storage/quarantine/manifest_c.txt',
        ]),
      })
    );
    const { result } = renderHook(() => useTerminalInput(options));

    await act(async () => {
      await result.current.handleSubmit();
    });

    expect(saveCheckpoint).not.toHaveBeenCalled();
    expect(options.playSound).not.toHaveBeenCalledWith('fanfare');
    expect(options.checkAchievement).not.toHaveBeenCalledWith('first_blood');
    expect(options.checkAchievement).not.toHaveBeenCalledWith('truth_seeker');
  });

  it('does not write an investigation-progress checkpoint until 5 files have been read', async () => {
    vi.mocked(executeCommand).mockReturnValue(
      createCommandResult({
        evidenceCount: 6,
        filesRead: new Set([
          '/storage/quarantine/bio_container.log',
          '/storage/quarantine/logistics_manifest_fragment.txt',
        ]),
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

    expect(saveCheckpoint).not.toHaveBeenCalledWith(
      expect.anything(),
      'Investigation progress'
    );
  });

  it('grants first_blood when the first file is saved', async () => {
    vi.mocked(executeCommand).mockReturnValue(
      createCommandResult({
        savedFiles: new Set(['/tmp/save_evidence.sh']),
      })
    );
    const options = createOptions(
      createGameState({
        savedFiles: new Set(),
      })
    );
    const { result } = renderHook(() => useTerminalInput(options));

    await act(async () => {
      await result.current.handleSubmit();
    });

    expect(options.checkAchievement).toHaveBeenCalledWith('first_blood');
    expect(options.checkAchievement).not.toHaveBeenCalledWith('truth_seeker');
  });

  it('grants truth_seeker when the dossier reaches 10 saved files', async () => {
    vi.mocked(executeCommand).mockReturnValue(
      createCommandResult({
        savedFiles: new Set([
          '/tmp/1.txt',
          '/tmp/2.txt',
          '/tmp/3.txt',
          '/tmp/4.txt',
          '/tmp/5.txt',
          '/tmp/6.txt',
          '/tmp/7.txt',
          '/tmp/8.txt',
          '/tmp/9.txt',
          '/tmp/10.txt',
        ]),
      })
    );
    const options = createOptions(
      createGameState({
        savedFiles: new Set([
          '/tmp/1.txt',
          '/tmp/2.txt',
          '/tmp/3.txt',
          '/tmp/4.txt',
          '/tmp/5.txt',
          '/tmp/6.txt',
          '/tmp/7.txt',
          '/tmp/8.txt',
          '/tmp/9.txt',
        ]),
      })
    );
    const { result } = renderHook(() => useTerminalInput(options));

    await act(async () => {
      await result.current.handleSubmit();
    });

    expect(options.checkAchievement).toHaveBeenCalledWith('truth_seeker');
  });
});

describe('useTerminalInput tutorial recovery', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('recovers oversized intro steps by replaying the final intro block', async () => {
    const options = createOptions(
      createGameState({
        tutorialComplete: false,
        tutorialStep: 999,
        interactiveTutorialState: {
          ...DEFAULT_GAME_STATE.interactiveTutorialState!,
          current: TutorialStateID.INTRO,
        },
      }),
      ''
    );
    const { result } = renderHook(() => useTerminalInput(options));

    await act(async () => {
      await result.current.handleSubmit();
    });

    const nextState = options.getTrackedState();
    expect(nextState.tutorialStep).toBe(0);
    expect(nextState.interactiveTutorialState?.current).toBe(TutorialStateID.LS_PROMPT);
  });

  it('recovers oversized briefing steps by completing the tutorial', async () => {
    const options = createOptions(
      createGameState({
        tutorialComplete: false,
        tutorialStep: 999,
        interactiveTutorialState: {
          ...DEFAULT_GAME_STATE.interactiveTutorialState!,
          current: TutorialStateID.TUTORIAL_END,
          dialogueComplete: true,
        },
      }),
      ''
    );
    const { result } = renderHook(() => useTerminalInput(options));

    await act(async () => {
      await result.current.handleSubmit();
    });

    const nextState = options.getTrackedState();
    expect(nextState.tutorialComplete).toBe(true);
    expect(nextState.tutorialStep).toBe(-1);
    expect(nextState.interactiveTutorialState?.current).toBe(TutorialStateID.GAME_ACTIVE);
    expect(saveCheckpoint).not.toHaveBeenCalled();
  });
});

/**
 * Bare `save` is a UI action, not an engine command: it is intercepted here and
 * opens the save-session modal, so `executeCommand` never sees it.
 *
 * The intercept compared the raw input against the literal English `save`,
 * which made the save-session UI English-only — pt-BR help tells the player to
 * type `salvar` and ES help says `guardar`, and both fell straight through to
 * the engine's "usage: save <filename>" message instead.
 */
describe('useTerminalInput save-session intercept', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(executeCommand).mockReturnValue(createCommandResult({}));
  });

  async function submit(input: string) {
    const options = createOptions(createGameState(), input);
    const { result } = renderHook(() => useTerminalInput(options));
    await act(async () => {
      await result.current.handleSubmit();
    });
    return options;
  }

  it.each(['save', 'salvar', 'guardar', 'SAVE', 'Salvar'])(
    'opens the save modal for %s',
    async input => {
      const options = await submit(input);
      expect(options.onSaveRequestAction).toHaveBeenCalledTimes(1);
      expect(executeCommand).not.toHaveBeenCalled();
    }
  );

  it.each(['save report.txt', 'salvar arquivo.txt', 'guardar archivo.txt'])(
    'still treats %s as a dossier save',
    async input => {
      const options = await submit(input);
      expect(options.onSaveRequestAction).not.toHaveBeenCalled();
      expect(executeCommand).toHaveBeenCalled();
    }
  );
});

describe('useTerminalInput command-length handoff', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(executeCommand).mockReturnValue(createCommandResult({}));
  });

  it('keeps sanitized history but gives the engine the original overlong input', async () => {
    const overlong = 'x'.repeat(MAX_COMMAND_INPUT_LENGTH + 1);
    const options = createOptions(createGameState(), overlong);
    const { result } = renderHook(() => useTerminalInput(options));

    await act(async () => {
      await result.current.handleSubmit();
    });

    expect(executeCommand).toHaveBeenCalledWith(
      overlong,
      expect.objectContaining({
        commandHistory: ['x'.repeat(MAX_COMMAND_INPUT_LENGTH)],
      })
    );
  });
});
