import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent, act } from '@testing-library/react';
import Terminal from '../Terminal';
import { DEFAULT_GAME_STATE, GameState } from '../../types';

// Mock Next.js Image component
vi.mock('next/image', () => ({
  default: ({ src, alt, ...props }: { src: string; alt: string }) => (
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
const mockSetMasterVolume = vi.fn();
let mockSoundEnabled = false;

// Mock the storage modules
vi.mock('../../storage/saves', () => ({
  autoSave: vi.fn(),
  loadGameState: vi.fn(),
  saveGameState: vi.fn(),
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

// Mock useSound hook
vi.mock('../../hooks/useSound', () => ({
  useSound: () => ({
    playSound: mockPlaySound,
    playKeySound: mockPlayKeySound,
    startAmbient: mockStartAmbient,
    stopAmbient: mockStopAmbient,
    toggleSound: mockToggleSound,
    updateAmbientTension: mockUpdateAmbientTension,
    soundEnabled: mockSoundEnabled,
    masterVolume: 0.5,
    setMasterVolume: mockSetMasterVolume,
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
    mockSoundEnabled = false;
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('renders without crashing', () => {
    render(<Terminal {...defaultProps} />);
    expect(document.body).toBeTruthy();
  });

  it('renders the command input', () => {
    render(<Terminal {...defaultProps} />);

    const input = document.querySelector('input');
    expect(input).toBeInTheDocument();
  });

  it('renders the terminal header', () => {
    render(<Terminal {...defaultProps} />);

    // Terminal should have header with system info
    expect(screen.getByText(/TERMINAL 1996/i)).toBeInTheDocument();
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

  it('renders ICQ chat when icqPhase is active', async () => {
    vi.useRealTimers();
    const icqState = {
      ...defaultProps.initialState,
      icqPhase: true,
    };

    render(<Terminal {...defaultProps} initialState={icqState} />);

    expect(await screen.findByText(/ICQ 99a -/i)).toBeInTheDocument();
    expect(await screen.findByLabelText(/ICQ chat log/i)).toBeInTheDocument();
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

      // Click to advance tutorial
      act(() => {
        fireEvent.click(enterPrompt);
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
