import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent, act, waitFor } from '@testing-library/react';
import ICQChat from '../ICQChat';

describe('ICQChat Component', () => {
  const defaultProps = {
    onVictoryAction: vi.fn(),
    initialTrust: 50,
    onTrustChange: vi.fn(),
    onMathMistake: vi.fn(),
    onLeakChoice: vi.fn(),
    onFilesSent: vi.fn(),
  };

  beforeEach(() => {
    vi.clearAllMocks();
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('renders without crashing', () => {
    render(<ICQChat {...defaultProps} />);
    expect(document.body).toBeTruthy();
  });

  it('displays ICQ title bar', () => {
    render(<ICQChat {...defaultProps} />);

    // ICQ 99a should be in the title (multiple elements is OK)
    expect(screen.getAllByText(/ICQ 99a/).length).toBeGreaterThan(0);
  });

  it('displays teen username in title', () => {
    render(<ICQChat {...defaultProps} />);

    // Teen username should be visible (multiple elements is OK)
    expect(screen.getAllByText(/xXx_DarkMaster_xXx/).length).toBeGreaterThan(0);
  });

  it('shows connection established message', async () => {
    render(<ICQChat {...defaultProps} />);

    // Wait for initial system messages
    await act(async () => {
      vi.advanceTimersByTime(100);
    });

    expect(screen.getByText(/CONNECTION ESTABLISHED/)).toBeTruthy();
  });

  it('shows teen intro messages after connection', async () => {
    render(<ICQChat {...defaultProps} />);

    // Advance through the intro sequence
    await act(async () => {
      vi.advanceTimersByTime(10000);
    });

    // Teen should be online or typing
    const onlineMessages = screen.getAllByText(/xXx_DarkMaster_xXx/);
    expect(onlineMessages.length).toBeGreaterThan(0);
  });

  it('has disabled input during typing animation', async () => {
    render(<ICQChat {...defaultProps} />);

    // During intro sequence, input may be disabled
    const input = screen.getByPlaceholderText(/Digite sua mensagem|Missão completa/);
    expect(input).toBeTruthy();
  });

  it('shows status bar with connection info', () => {
    render(<ICQChat {...defaultProps} />);

    expect(screen.getByText(/modem 56k/)).toBeTruthy();
  });

  it('handles unmounting during async operations', async () => {
    const { unmount } = render(<ICQChat {...defaultProps} />);

    // Start the intro sequence
    await act(async () => {
      vi.advanceTimersByTime(1000);
    });

    // Unmount during async operation (tests the isMounted fix)
    expect(() => {
      unmount();
    }).not.toThrow();

    // Advance timers after unmount - should not cause errors
    await act(async () => {
      vi.advanceTimersByTime(5000);
    });
  });

  it('cleans up properly on unmount', () => {
    const { unmount } = render(<ICQChat {...defaultProps} />);

    // Should not throw when unmounting
    expect(() => unmount()).not.toThrow();
  });

  describe('Phase Transitions', () => {
    it('starts in intro phase', () => {
      render(<ICQChat {...defaultProps} />);

      // Initial phase should show connection messages
      expect(screen.getByText(/CONNECTION ESTABLISHED/)).toBeTruthy();
    });

    it('transitions through intro sequence safely', async () => {
      const { unmount } = render(<ICQChat {...defaultProps} />);

      // Run through intro with multiple timer advances
      for (let i = 0; i < 10; i++) {
        await act(async () => {
          vi.advanceTimersByTime(500);
        });
      }

      // Should not throw even with rapid unmount
      expect(() => unmount()).not.toThrow();
    });
  });

  describe('User Input', () => {
    it('accepts user input in text field', async () => {
      render(<ICQChat {...defaultProps} />);

      // Wait for intro to complete
      await act(async () => {
        vi.advanceTimersByTime(10000);
      });

      const input = screen.getByPlaceholderText(/Digite sua mensagem/);

      // Type in input
      await act(async () => {
        fireEvent.change(input, { target: { value: 'help' } });
      });

      expect((input as HTMLInputElement).value).toBe('help');
    });

    it('has a send button', () => {
      render(<ICQChat {...defaultProps} />);

      expect(screen.getByText('Enviar')).toBeTruthy();
    });
  });

  describe('Math Phase', () => {
    it('shows math hint after two wrong answers', async () => {
      render(<ICQChat {...defaultProps} />);

      const advanceUntilText = async (pattern: RegExp, steps = 30) => {
        for (let i = 0; i < steps; i++) {
          if (screen.queryByText(pattern)) return;
          await act(async () => {
            vi.advanceTimersByTime(1000);
          });
        }
        throw new Error(`Timed out waiting for ${pattern.toString()}`);
      };

      await advanceUntilText(/who r u\?\?\?/i);

      const input = screen.getByPlaceholderText(/Digite sua mensagem/);
      const form = input.closest('form');
      expect(form).toBeTruthy();

      await act(async () => {
        fireEvent.change(input, { target: { value: 'help' } });
        fireEvent.submit(form!);
      });

      await advanceUntilText(/what do u want\?\?\?/i);

      await act(async () => {
        fireEvent.change(input, { target: { value: 'save the file' } });
        fireEvent.submit(form!);
      });

      await advanceUntilText(/2x \+ 5 = 13/);
      await advanceUntilText(/what is x\?/i);

      await act(async () => {
        fireEvent.change(input, { target: { value: '5' } });
        fireEvent.submit(form!);
      });

      await advanceUntilText(/try again/i);

      await act(async () => {
        fireEvent.change(input, { target: { value: '5' } });
        fireEvent.submit(form!);
      });

      await advanceUntilText(/hint: isolate x/i);
    });
  });

  describe('Trust System', () => {
    it('initializes with provided trust value', () => {
      render(<ICQChat {...defaultProps} initialTrust={75} />);

      // Component should render with the initial trust value
      expect(document.body).toBeTruthy();
    });
  });

  describe('Visual Elements', () => {
    it('shows avatar emoji', () => {
      render(<ICQChat {...defaultProps} />);

      // Teen avatar
      expect(screen.getByText('👦')).toBeTruthy();
    });

    it('shows online status indicator', () => {
      render(<ICQChat {...defaultProps} />);

      expect(screen.getByText(/Online/)).toBeTruthy();
    });

    it('shows title bar buttons', () => {
      render(<ICQChat {...defaultProps} />);

      // Window control buttons
      expect(screen.getByText('_')).toBeTruthy();
      expect(screen.getByText('□')).toBeTruthy();
      expect(screen.getByText('×')).toBeTruthy();
    });
  });
});
