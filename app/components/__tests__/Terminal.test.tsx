import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent, act, waitFor } from '@testing-library/react';
import Terminal, { normalizeVideoPromptChoice } from '../Terminal';
import styles from '../Terminal.module.css';
import { DEFAULT_GAME_STATE, GameState, TutorialStateID } from '../../types';
import { I18nProvider } from '../../i18n';
import { AUTOSAVE_INTERVAL_MS } from '../../constants/timing';
import * as rngModule from '../../engine/rng';

const { mockSpeakCustomFirewallVoice, mockFirewallEyes, mockStaticNoise } = vi.hoisted(() => ({
  mockSpeakCustomFirewallVoice: vi.fn(),
  mockFirewallEyes: vi.fn(),
  mockStaticNoise: vi.fn(),
}));

// Mock Next.js Image component
vi.mock('next/image', () => ({
  default: ({
    src,
    alt,
    priority: _priority,
    ...props
  }: {
    src: string;
    alt: string;
    priority?: boolean;
  }) => (
    // eslint-disable-next-line @next/next/no-img-element
    <img src={src} alt={alt} {...props} />
  ),
}));

const mockPlaySound = vi.fn();
const mockPlayKeySound = vi.fn();
const mockStartAmbient = vi.fn();
const mockStopAmbient = vi.fn();
const mockToggleSound = vi.fn();
const mockUpdateAmbientTension = vi.fn();
const mockSetAmbientDisturbance = vi.fn();
const mockSetMasterVolume = vi.fn();
const mockSpeak = vi.fn();
const mockSetMusicPlaybackRate = vi.fn();
let mockSoundEnabled = false;

// Mock the storage modules
vi.mock('../../storage/saves', () => ({
  autoSave: vi.fn(() => Date.now()),
  loadGameState: vi.fn(),
  saveGameState: vi.fn(),
  saveCheckpoint: vi.fn(),
  loadCheckpoint: vi.fn(),
  getCheckpointSlots: vi.fn(() => []),
  getLatestCheckpoint: vi.fn(() => null),
  deleteCheckpoint: vi.fn(),
  clearCheckpoints: vi.fn(),
}));

vi.mock('../../storage/statistics', () => ({
  incrementStatistic: vi.fn(),
  addPlaytime: vi.fn(),
  recordEnding: vi.fn(),
}));

// Mock the achievements module
vi.mock('../../engine/achievements', () => ({
  unlockAchievement: vi.fn(() => null),
  getAchievements: vi.fn(() => []),
  Achievement: {},
}));

vi.mock('../../components/FirewallEyes', async () => {
  const actual = await vi.importActual<typeof import('../../components/FirewallEyes')>(
    '../../components/FirewallEyes'
  );

  return {
    ...actual,
    default: (props: unknown) => {
      mockFirewallEyes(props);
      return <div data-testid="firewall-eyes" />;
    },
  };
});

vi.mock('../../lib/firewallVoice', () => ({
  speakCustomFirewallVoice: mockSpeakCustomFirewallVoice,
  unlockSpeechSynthesis: vi.fn(),
  initVoices: vi.fn(),
  FIREWALL_PHRASES: [],
  FIREWALL_PHRASE_TEXT: [],
}));

vi.mock('../../components/StaticNoise', () => ({
  default: (props: unknown) => {
    mockStaticNoise(props);
    return <div data-testid="static-noise" />;
  },
}));

// Mock useSound hook
vi.mock('../../hooks/useSound', () => ({
  useSound: () => ({
    playSound: mockPlaySound,
    playKeySound: mockPlayKeySound,
    startAmbient: mockStartAmbient,
    stopAmbient: mockStopAmbient,
    toggleSound: mockToggleSound,
    updateAmbientTension: mockUpdateAmbientTension,
    updateMusicForRisk: vi.fn(),
    setAmbientDisturbance: mockSetAmbientDisturbance,
    soundEnabled: mockSoundEnabled,
    masterVolume: 0.5,
    setMasterVolume: mockSetMasterVolume,
    speak: mockSpeak,
    setMusicPlaybackRate: mockSetMusicPlaybackRate,
  }),
}));

describe('Terminal Component', () => {
  const defaultProps = {
    initialState: {
      ...DEFAULT_GAME_STATE,
      seed: 12345,
      rngState: 12345,
      sessionStartTime: Date.now(),
      tutorialComplete: true, // Skip tutorial for most tests
      tutorialStep: -1,
    } as GameState,
    onExitAction: vi.fn(),
    onSaveRequestAction: vi.fn(),
  };

  beforeEach(() => {
    vi.clearAllMocks();
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2026-01-01T00:00:00Z'));
    mockSoundEnabled = false;
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('renders without crashing', () => {
    render(<Terminal {...defaultProps} />);
    expect(document.body).toBeTruthy();
  });

  it('localizes tutorial skip output using selected language', async () => {
    vi.useRealTimers();
    window.localStorage.setItem('terminal1996_language', 'es');

    const tutorialState = {
      ...DEFAULT_GAME_STATE,
      seed: 12345,
      rngState: 12345,
      sessionStartTime: Date.now(),
      tutorialComplete: false,
      tutorialStep: 0,
    } as GameState;

    render(
      <I18nProvider>
        <Terminal {...defaultProps} initialState={tutorialState} />
      </I18nProvider>
    );

    await waitFor(() => {
      expect(screen.getByRole('button', { name: /\[ Y \] SALTAR/i })).toBeInTheDocument();
    });

    fireEvent.click(screen.getByRole('button', { name: /\[ Y \] SALTAR/i }));

    await waitFor(() => {
      expect(screen.getByText('> CREANDO PERFIL DE USUARIO...')).toBeInTheDocument();
    });

    expect(screen.getByText('[UFO74 se desconectó]')).toBeInTheDocument();

    window.localStorage.removeItem('terminal1996_language');
  });

  it('renders the command input', () => {
    render(<Terminal {...defaultProps} />);

    const input = document.querySelector('input');
    expect(input).toBeInTheDocument();
  });

  it('accepts localized video prompt responses', () => {
    expect(normalizeVideoPromptChoice('yes')).toBe('yes');
    expect(normalizeVideoPromptChoice('sim')).toBe('yes');
    expect(normalizeVideoPromptChoice('sí')).toBe('yes');
    expect(normalizeVideoPromptChoice('no')).toBe('no');
    expect(normalizeVideoPromptChoice('não')).toBe('no');
    expect(normalizeVideoPromptChoice('maybe')).toBeNull();
  });

  it('renders UFO74 runs flush without spacer entries', () => {
    const ufo74State = {
      ...defaultProps.initialState,
      history: [
        {
          id: 'before-ufo74',
          type: 'system',
          content: 'PREVIOUS LINE',
          timestamp: 1,
        },
        {
          id: 'blank-before-ufo74',
          type: 'system',
          content: '',
          timestamp: 2,
        },
        {
          id: 'second-blank-before-ufo74',
          type: 'system',
          content: '',
          timestamp: 3,
        },
        {
          id: 'ufo74-line-one',
          type: 'ufo74',
          content: '│ UFO74: first line',
          timestamp: 4,
        },
        {
          id: 'blank-between-ufo74',
          type: 'system',
          content: '',
          timestamp: 5,
        },
        {
          id: 'ufo74-line-two',
          type: 'ufo74',
          content: '│ UFO74: second line',
          timestamp: 6,
        },
        {
          id: 'blank-after-ufo74',
          type: 'system',
          content: '',
          timestamp: 7,
        },
        {
          id: 'after-ufo74',
          type: 'system',
          content: 'NEXT LINE',
          timestamp: 8,
        },
      ],
    } as GameState;

    const { container } = render(<Terminal {...defaultProps} initialState={ufo74State} />);

    const output = container.querySelector(`.${styles.output}`);
    const outputLines = Array.from(output?.children ?? []);

    expect(outputLines.map(line => line.textContent ?? '')).toEqual([
      'PREVIOUS LINE',
      '│ UFO74: first line',
      '│ UFO74: second line',
      'NEXT LINE',
    ]);
    expect(outputLines[0]).toHaveClass(styles.flushBeforeUfo74);
    expect(outputLines[1]).toHaveClass(styles.ufo74Flush);
    expect(outputLines[2]).toHaveClass(styles.ufo74Flush);
  });

  it('keeps terminal text unchanged when high-risk static is active', () => {
    const readableLine = 'READABLE STATIC TEST LINE';

    render(
      <Terminal
        {...defaultProps}
        initialState={{
          ...defaultProps.initialState,
          detectionLevel: 90,
          history: [
            {
              id: 'static-readable-line',
              type: 'system',
              content: readableLine,
              timestamp: Date.now(),
            },
          ],
        }}
      />
    );

    expect(screen.getByText(readableLine)).toBeInTheDocument();
  });

  it('restarts the alien silhouette timer when a new external state is loaded', async () => {
    const randomSpy = vi.spyOn(rngModule, 'uiRandom').mockReturnValue(0);

    try {
      const { rerender } = render(
        <Terminal
          {...defaultProps}
          initialState={{
            ...defaultProps.initialState,
            detectionLevel: 75,
          }}
        />
      );

      await act(async () => {});

      act(() => {
        vi.advanceTimersByTime(15000);
      });

      mockStaticNoise.mockClear();

      rerender(
        <Terminal
          {...defaultProps}
          initialState={{
            ...defaultProps.initialState,
            detectionLevel: 80,
          }}
        />
      );

      await act(async () => {});

      act(() => {
        vi.advanceTimersByTime(15001);
      });

      await act(async () => {});

      expect(
        mockStaticNoise.mock.calls.some(
          ([props]) => (props as { alienVisible?: boolean }).alienVisible === true
        )
      ).toBe(false);

      act(() => {
        vi.advanceTimersByTime(15000);
      });

      await act(async () => {});

      expect(
        mockStaticNoise.mock.calls.some(
          ([props]) => (props as { alienVisible?: boolean }).alienVisible === true
        )
      ).toBe(true);
    } finally {
      randomSpy.mockRestore();
    }
  });

  it('forces the alien silhouette visible during preview mode at 70 detection', async () => {
    render(
      <Terminal
        {...defaultProps}
        initialState={{
          ...defaultProps.initialState,
          detectionLevel: 70,
          alienPreviewUntil: Date.now() + 10000,
        }}
      />
    );

    await act(async () => {});

    act(() => {
      vi.advanceTimersByTime(1);
    });

    await act(async () => {});

    expect(
      mockStaticNoise.mock.calls.some(
        ([props]) =>
          (props as { alienVisible?: boolean; intensity?: number }).alienVisible === true &&
          ((props as { intensity?: number }).intensity ?? 0) > 0
      )
    ).toBe(true);
  });

  it('spikes ambient disturbance while the alien silhouette is visible and restores it after', () => {
    render(
      <Terminal
        {...defaultProps}
        initialState={{
          ...defaultProps.initialState,
          detectionLevel: 0,
          alienPreviewUntil: Date.now() + 3000,
        }}
      />
    );

    expect(mockSetAmbientDisturbance).toHaveBeenCalledWith(1);

    act(() => {
      vi.advanceTimersByTime(3001);
    });

    expect(mockSetAmbientDisturbance.mock.calls.flat()).toContain(0);
  });

  it('mounts firewall eyes even while atmosphere suppression is active', () => {
    render(
      <Terminal
        {...defaultProps}
        initialState={{
          ...defaultProps.initialState,
          detectionLevel: 25,
          evidenceCount: 0,
          filesRead: new Set(),
        }}
      />
    );

    expect(screen.getByTestId('firewall-eyes')).toBeInTheDocument();
    expect(mockFirewallEyes).toHaveBeenCalled();
  });

  it('stops ambient audio and plays the final firewall line on game over', () => {
    render(
      <Terminal
        {...defaultProps}
        initialState={{
          ...defaultProps.initialState,
          isGameOver: true,
          gameOverReason: 'Security lockout triggered',
        }}
      />
    );

    expect(mockStopAmbient).toHaveBeenCalled();
    expect(mockSpeakCustomFirewallVoice).toHaveBeenCalledWith('I disconnect you.');
  });

  it('renders a compact evidence counter in the HUD without category labels', () => {
    render(<Terminal {...defaultProps} />);

    expect(screen.getByText('Alien Files')).toBeInTheDocument();
    expect(screen.getByText('Saved: [0/10]')).toBeInTheDocument();
    expect(screen.queryByText('Recovered')).not.toBeInTheDocument();
    expect(screen.queryByText('Captured')).not.toBeInTheDocument();
    expect(screen.queryByText('Signals')).not.toBeInTheDocument();
    expect(screen.queryByText('Foreign')).not.toBeInTheDocument();
    expect(screen.queryByText('Next')).not.toBeInTheDocument();
  });

  it('restores focus after closing settings modal', () => {
    render(<Terminal {...defaultProps} />);

    const input = screen.getByLabelText(/terminal command input/i) as HTMLInputElement;
    input.focus();
    expect(input).toHaveFocus();

    const headerToggle = screen.getByRole('button', { name: /VARGINHA: TERMINAL 1996/i });
    act(() => {
      fireEvent.click(headerToggle);
    });

    const settingsButton = screen.getByRole('button', { name: /SETTINGS/i });
    act(() => {
      fireEvent.click(settingsButton);
    });

    expect(screen.getByRole('heading', { name: /SETTINGS/i })).toBeInTheDocument();

    const closeButton = screen.getByRole('button', { name: /\[ CLOSE \]/i });
    act(() => {
      fireEvent.click(closeButton);
    });

    act(() => {
      vi.advanceTimersByTime(0);
    });

    expect(input).toHaveFocus();
  });

  it('renders the terminal header', () => {
    render(<Terminal {...defaultProps} />);

    // Terminal should have header with system info
    expect(screen.getByText(/TERMINAL 1996/i)).toBeInTheDocument();
  });

  it('shows the deploy version in the header', () => {
    render(<Terminal {...defaultProps} />);

    const versionTag = screen.getByText(/^(?:v0\.\d+\.0|dev-local)$/);
    expect(versionTag).toBeInTheDocument();
  });

  it('accepts user input', () => {
    render(<Terminal {...defaultProps} />);

    const input = document.querySelector('input') as HTMLInputElement;

    act(() => {
      fireEvent.change(input, { target: { value: 'help' } });
    });

    expect(input.value).toBe('help');
  });

  it('clears input after command submission', async () => {
    render(<Terminal {...defaultProps} />);

    const input = document.querySelector('input') as HTMLInputElement;

    act(() => {
      fireEvent.change(input, { target: { value: 'help' } });
    });

    const form = input.closest('form');
    act(() => {
      fireEvent.submit(form!);
    });

    // Input should be cleared after submission
    expect(input.value).toBe('');
  });

  it('prevents double submissions while processing', async () => {
    render(<Terminal {...defaultProps} />);

    const input = document.querySelector('input') as HTMLInputElement;

    act(() => {
      fireEvent.change(input, { target: { value: 'help' } });
    });

    const form = input.closest('form');
    act(() => {
      fireEvent.submit(form!);
      fireEvent.submit(form!);
    });

    act(() => {
      vi.advanceTimersByTime(100);
    });

    expect(screen.getAllByText(/> help/)).toHaveLength(1);
  });

  it('adds command to history on submission', async () => {
    render(<Terminal {...defaultProps} />);

    const input = document.querySelector('input') as HTMLInputElement;

    act(() => {
      fireEvent.change(input, { target: { value: 'help' } });
    });

    const form = input.closest('form');
    act(() => {
      fireEvent.submit(form!);
    });

    // Advance timers for any async operations
    act(() => {
      vi.advanceTimersByTime(100);
    });

    // The command should appear in the terminal output
    expect(screen.getByText(/> help/)).toBeInTheDocument();
  });

  it('shows help output when help command is executed', async () => {
    render(<Terminal {...defaultProps} />);

    const input = document.querySelector('input') as HTMLInputElement;

    act(() => {
      fireEvent.change(input, { target: { value: 'help' } });
      fireEvent.submit(input.closest('form')!);
    });

    // Advance timers for streaming/processing
    act(() => {
      vi.advanceTimersByTime(1000);
    });

    // Help output should contain terminal commands header
    expect(screen.getByText(/TERMINAL COMMANDS/i)).toBeInTheDocument();
  });

  it('navigates command history with arrow keys', async () => {
    render(<Terminal {...defaultProps} />);

    const input = document.querySelector('input') as HTMLInputElement;

    // Execute a few commands first
    act(() => {
      fireEvent.change(input, { target: { value: 'help' } });
      fireEvent.submit(input.closest('form')!);
    });

    act(() => {
      vi.advanceTimersByTime(500);
    });

    act(() => {
      fireEvent.change(input, { target: { value: 'status' } });
      fireEvent.submit(input.closest('form')!);
    });

    act(() => {
      vi.advanceTimersByTime(500);
    });

    // Press up arrow to get previous command
    act(() => {
      fireEvent.keyDown(input, { key: 'ArrowUp' });
    });

    expect(input.value).toBe('status');

    // Press up again
    act(() => {
      fireEvent.keyDown(input, { key: 'ArrowUp' });
    });

    expect(input.value).toBe('help');

    // Press down to go back
    act(() => {
      fireEvent.keyDown(input, { key: 'ArrowDown' });
    });

    expect(input.value).toBe('status');
  });

  it('shows error for unknown commands', async () => {
    render(<Terminal {...defaultProps} />);

    const input = document.querySelector('input') as HTMLInputElement;

    act(() => {
      fireEvent.change(input, { target: { value: 'unknowncommand123' } });
      fireEvent.submit(input.closest('form')!);
    });

    act(() => {
      vi.advanceTimersByTime(500);
    });

    // Should show unrecognized command error
    expect(screen.getByText(/not recognized|unknown command/i)).toBeInTheDocument();
  });

  it('toggles pause menu on Escape key', async () => {
    render(<Terminal {...defaultProps} />);

    // Press Escape to open pause menu
    act(() => {
      fireEvent.keyDown(window, { key: 'Escape' });
    });

    // Pause menu should be visible
    expect(screen.getByText(/PAUSED/i)).toBeInTheDocument();

    // Press Escape again to close
    act(() => {
      fireEvent.keyDown(window, { key: 'Escape' });
    });

    // Pause menu should be hidden
    expect(screen.queryByText(/PAUSED/i)).not.toBeInTheDocument();
  });

  it('restores focus after closing pause menu', () => {
    render(<Terminal {...defaultProps} />);

    const input = screen.getByLabelText(/terminal command input/i) as HTMLInputElement;
    input.focus();

    act(() => {
      fireEvent.keyDown(window, { key: 'Escape' });
    });

    expect(screen.getByText(/PAUSED/i)).toBeInTheDocument();

    const resumeButton = screen.getByRole('button', { name: /RESUME GAME/i });
    act(() => {
      fireEvent.click(resumeButton);
    });

    act(() => {
      vi.advanceTimersByTime(0);
    });

    expect(screen.queryByText(/PAUSED/i)).not.toBeInTheDocument();
    expect(input).toHaveFocus();
  });

  it('restores enter-only follow-up prompts after closing the pause menu', async () => {
    const delayedState = {
      ...defaultProps.initialState,
      detectionLevel: 55,
    } as GameState;

    render(<Terminal {...defaultProps} initialState={delayedState} />);

    const input = screen.getByLabelText(/terminal command input/i) as HTMLInputElement;

    act(() => {
      fireEvent.change(input, {
        target: { value: 'open /internal/audio_transcript_brief.txt' },
      });
      fireEvent.submit(input.closest('form')!);
    });

    await act(async () => {
      await vi.advanceTimersByTimeAsync(10000);
    });

    await act(async () => {
      await Promise.resolve();
    });

    expect(screen.queryByText(/Processing\.\.\./i)).not.toBeInTheDocument();
    expect(screen.getByText(/Press Enter ↵ to proceed/i)).toBeInTheDocument();
    expect(document.querySelector('.line.ufo74')).toBeNull();

    act(() => {
      fireEvent.keyDown(window, { key: 'Escape' });
    });

    expect(screen.getByText(/PAUSED/i)).toBeInTheDocument();

    act(() => {
      fireEvent.keyDown(window, { key: 'Escape' });
    });

    expect(screen.queryByText(/PAUSED/i)).not.toBeInTheDocument();

    await act(async () => {
      await Promise.resolve();
    });

    const proceedButton = screen.getByRole('button', { name: /Press Enter ↵ to (?:continue|proceed)/i });

    act(() => {
      fireEvent.click(proceedButton);
    });

    await act(async () => {
      await Promise.resolve();
    });

    expect(document.querySelector('.line.ufo74')).not.toBeNull();
  });

  it('advances enter-only prompts from the inline continue button', async () => {
    const delayedState = {
      ...defaultProps.initialState,
      detectionLevel: 55,
    } as GameState;

    const { container } = render(<Terminal {...defaultProps} initialState={delayedState} />);

    const input = screen.getByLabelText(/terminal command input/i) as HTMLInputElement;

    act(() => {
      fireEvent.change(input, {
        target: { value: 'open /internal/audio_transcript_brief.txt' },
      });
      fireEvent.submit(input.closest('form')!);
    });

    await act(async () => {
      await vi.advanceTimersByTimeAsync(10000);
    });

    await act(async () => {
      await Promise.resolve();
    });

    expect(screen.queryByText(/Processing\.\.\./i)).not.toBeInTheDocument();
    expect(screen.getByText(/Press Enter ↵ to proceed/i)).toBeInTheDocument();
    expect(document.querySelector('.line.ufo74')).toBeNull();

    const proceedButton = screen.getByRole('button', { name: /Press Enter ↵ to (?:continue|proceed)/i });

    act(() => {
      fireEvent.click(proceedButton);
    });

    await act(async () => {
      await Promise.resolve();
    });

    const output = container.querySelector(`.${styles.output}`);
    const ufo74Lines = Array.from(output?.querySelectorAll<HTMLElement>(`.${styles.ufo74Flush}`) ?? []);

    expect(ufo74Lines.length).toBeGreaterThan(0);
    expect(ufo74Lines[0]).toBeDefined();
    expect(ufo74Lines[0]?.previousElementSibling).not.toBeNull();
    expect(ufo74Lines[0]?.previousElementSibling).toHaveClass(styles.flushBeforeUfo74);
    expect(
      ufo74Lines.some(
        line =>
          line.previousElementSibling?.textContent === '' || line.nextElementSibling?.textContent === ''
      )
    ).toBe(false);
  });

  it('completes file processing after pausing during the command delay', async () => {
    const delayedState = {
      ...defaultProps.initialState,
      detectionLevel: 55,
    } as GameState;

    render(<Terminal {...defaultProps} initialState={delayedState} />);

    const input = screen.getByLabelText(/terminal command input/i) as HTMLInputElement;

    act(() => {
      fireEvent.change(input, {
        target: { value: 'open /internal/incident_summary_official.txt' },
      });
      fireEvent.submit(input.closest('form')!);
    });

    expect(screen.getByText(/Processing\.\.\./i)).toBeInTheDocument();

    act(() => {
      fireEvent.keyDown(window, { key: 'Escape' });
    });

    expect(screen.getByText(/PAUSED/i)).toBeInTheDocument();

    act(() => {
      fireEvent.keyDown(window, { key: 'Escape' });
    });

    expect(screen.queryByText(/PAUSED/i)).not.toBeInTheDocument();

    await act(async () => {
      await vi.advanceTimersByTimeAsync(10000);
    });

    expect(screen.queryByText(/Processing\.\.\./i)).not.toBeInTheDocument();

    expect(screen.getAllByText(/RELATÓRIO OFICIAL DE INCIDENTE/i).length).toBeGreaterThan(0);
  });

  it('pauses the timed decrypt window while the pause menu is open', () => {
    const timedDecryptState = {
      ...defaultProps.initialState,
      timedDecryptActive: true,
      timedDecryptEndTime: Date.now() + 5000,
      timedDecryptSequence: '0426',
    } as GameState;

    render(<Terminal {...defaultProps} initialState={timedDecryptState} />);

    const timerBeforePause = screen.getByText(/\d+\.\ds/).textContent;

    act(() => {
      fireEvent.keyDown(window, { key: 'Escape' });
    });

    expect(screen.getByText(/PAUSED/i)).toBeInTheDocument();

    act(() => {
      vi.advanceTimersByTime(2000);
    });

    expect(screen.getByText(timerBeforePause ?? '')).toBeInTheDocument();

    act(() => {
      fireEvent.keyDown(window, { key: 'Escape' });
      vi.advanceTimersByTime(100);
    });

    const timerAfterResume = screen.getByText(/\d+\.\ds/).textContent ?? '0.0s';
    expect(Number.parseFloat(timerAfterResume)).toBeGreaterThan(2.5);
  });

  it('does not expire the countdown immediately after resuming from pause', () => {
    const countdownState = {
      ...defaultProps.initialState,
      countdownActive: true,
      countdownEndTime: Date.now() + 1000,
    } as GameState;

    render(<Terminal {...defaultProps} initialState={countdownState} />);

    act(() => {
      fireEvent.keyDown(window, { key: 'Escape' });
      vi.advanceTimersByTime(2500);
    });

    expect(screen.getByText(/PAUSED/i)).toBeInTheDocument();

    act(() => {
      fireEvent.keyDown(window, { key: 'Escape' });
      vi.advanceTimersByTime(50);
    });

    expect(screen.queryByText(/PAUSED/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/CONNECTION LOST/i)).not.toBeInTheDocument();
  });

  it('shows status bar with system information', () => {
    render(<Terminal {...defaultProps} />);

    // Status bar should show nominal status initially
    expect(screen.getByText(/SYSTEM NOMINAL/i)).toBeInTheDocument();
  });

  it('shows AUDIT: ACTIVE when detection is high', () => {
    const highDetectionState = {
      ...defaultProps.initialState,
      detectionLevel: 60,
    };

    render(<Terminal {...defaultProps} initialState={highDetectionState} />);

    expect(screen.getByText(/AUDIT.*ACTIVE/i)).toBeInTheDocument();
  });

  it('shows the save indicator after an autosave runs', () => {
    render(<Terminal {...defaultProps} />);

    expect(screen.queryByText(/Saved: <1m ago/i)).not.toBeInTheDocument();

    act(() => {
      vi.advanceTimersByTime(AUTOSAVE_INTERVAL_MS);
    });

    const saveIndicator = screen.getByText(/Saved: <1m ago/i);

    expect(saveIndicator).toBeInTheDocument();
    expect(saveIndicator).toHaveAttribute('aria-live', 'polite');
    expect(saveIndicator).toHaveClass(styles.saveIndicator);
  });

  it('renders blackout when evidencesSaved is active', async () => {
    vi.useRealTimers();
    const blackoutState = {
      ...defaultProps.initialState,
      evidencesSaved: true,
    };

    render(<Terminal {...defaultProps} initialState={blackoutState} />);

    expect(await screen.findByText(/CONNECTION INTERRUPTED/i)).toBeInTheDocument();
  });

  it('renders bad ending when endingType is bad', async () => {
    vi.useRealTimers();
    const badEndingState = {
      ...defaultProps.initialState,
      endingType: 'bad',
      isGameOver: true,
    } as GameState;

    render(<Terminal {...defaultProps} initialState={badEndingState} />);

    expect(await screen.findByText(/CONNECTION LOST/i)).toBeInTheDocument();
  });

  it('shows Turing evaluation overlay when active', async () => {
    vi.useRealTimers();
    const turingState = {
      ...defaultProps.initialState,
      turingEvaluationActive: true,
    };

    render(<Terminal {...defaultProps} initialState={turingState} />);

    expect(await screen.findByText(/TURING EVALUATION/i)).toBeInTheDocument();
  });

  describe('Tutorial Mode', () => {
    const tutorialProps = {
      ...defaultProps,
      initialState: {
        ...DEFAULT_GAME_STATE,
        seed: 12345,
        rngState: 12345,
        sessionStartTime: Date.now(),
        tutorialComplete: false,
        tutorialStep: 0,
      } as GameState,
    };

    it('shows enter prompt in tutorial mode', () => {
      render(<Terminal {...tutorialProps} />);

      // Tutorial mode should show a subtle enter prompt button
      const enterPrompt = screen.getByRole('button', { name: /↵/ });
      expect(enterPrompt).toBeInTheDocument();

      // Should NOT have an input field in tutorial mode
      const input = document.querySelector('input');
      expect(input).toBeNull();
    });

    it('advances tutorial on Enter key', async () => {
      render(<Terminal {...tutorialProps} />);

      const enterPrompt = screen.getByRole('button', { name: /↵/ });
      enterPrompt.focus();

      // Press Enter to advance tutorial
      act(() => {
        fireEvent.keyDown(enterPrompt, { key: 'Enter' });
      });

      act(() => {
        vi.advanceTimersByTime(500);
      });

      // After first Enter, tutorial content should appear in output
      const output = document.querySelector('.output');
      expect(output).toBeTruthy();
    });

    it('shows enter prompt instead of input during tutorial', async () => {
      render(<Terminal {...tutorialProps} />);

      // In tutorial mode, there's no input to type into - just the enter prompt
      const enterPrompt = screen.getByRole('button', { name: /↵/ });
      expect(enterPrompt).toBeInTheDocument();

      // Click the button to advance
      act(() => {
        fireEvent.click(enterPrompt);
      });

      act(() => {
        vi.advanceTimersByTime(500);
      });

      // Tutorial should still be in progress (button still visible)
      // The button advances the tutorial step by step
      expect(screen.getByRole('button', { name: /↵/ })).toBeInTheDocument();
    });

    it('anchors the tutorial firewall scare overlay to the terminal screen', () => {
      const tutorialScareState = {
        ...DEFAULT_GAME_STATE,
        seed: 12345,
        rngState: 12345,
        sessionStartTime: Date.now(),
        tutorialComplete: false,
        tutorialStep: 0,
        currentPath: '/internal/misc',
        interactiveTutorialState: {
          current: TutorialStateID.CD_BACK_PROMPT,
          failCount: 0,
          nudgeShown: false,
          inputLocked: false,
          dialogueComplete: true,
        },
      } as GameState;

      const { container } = render(<Terminal {...defaultProps} initialState={tutorialScareState} />);

      const input = screen.getByLabelText(/terminal command input/i) as HTMLInputElement;

      act(() => {
        fireEvent.change(input, { target: { value: 'cd ..' } });
      });

      const form = input.closest('form');

      act(() => {
        fireEvent.submit(form!);
      });

      const overlay = container.querySelector(`.${styles.firewallScareOverlay}`);
      const terminalScreen = container.querySelector(`.${styles.terminal}`);

      expect(overlay).toBeInTheDocument();
      expect(overlay?.parentElement).toBe(terminalScreen);
      expect(overlay).toHaveStyle({ position: 'absolute', inset: '0' });
    });
  });

  describe('Tab Completion', () => {
    it('completes command names on Tab', async () => {
      render(<Terminal {...defaultProps} />);

      const input = document.querySelector('input') as HTMLInputElement;

      act(() => {
        fireEvent.change(input, { target: { value: 'hel' } });
        fireEvent.keyDown(input, { key: 'Tab' });
      });

      expect(input.value).toBe('help '); // Autocomplete adds trailing space
    });

    it('completes partial commands', async () => {
      render(<Terminal {...defaultProps} />);

      const input = document.querySelector('input') as HTMLInputElement;

      act(() => {
        fireEvent.change(input, { target: { value: 'sta' } });
        fireEvent.keyDown(input, { key: 'Tab' });
      });

      expect(input.value).toBe('status '); // Autocomplete adds trailing space
    });
  });
});
