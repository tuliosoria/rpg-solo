import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, act } from '@testing-library/react';
import GameOver from '../GameOver';

describe('GameOver', () => {
  const defaultProps = {
    reason: 'Detection level exceeded maximum threshold',
    onRestartCompleteAction: vi.fn(),
  };

  beforeEach(() => {
    vi.clearAllMocks();
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.restoreAllMocks();
    vi.useRealTimers();
  });

  describe('Error Phase', () => {
    it('renders the critical failure message', () => {
      render(<GameOver {...defaultProps} />);

      expect(screen.getByText(/CRITICAL SYSTEM FAILURE/)).toBeInTheDocument();
    });

    it('displays the provided reason', () => {
      render(<GameOver {...defaultProps} />);

      expect(screen.getByText('Detection level exceeded maximum threshold')).toBeInTheDocument();
    });

    it('shows session termination details', () => {
      render(<GameOver {...defaultProps} />);

      expect(screen.getByText('SESSION TERMINATED')).toBeInTheDocument();
      expect(screen.getByText('AUDIT LOG ARCHIVED')).toBeInTheDocument();
      expect(screen.getByText('COUNTERMEASURES ENGAGED')).toBeInTheDocument();
    });

    it('shows restart message', () => {
      render(<GameOver {...defaultProps} />);

      expect(screen.getByText('System restart imminent...')).toBeInTheDocument();
    });
  });

  describe('Restart Phase', () => {
    it('transitions to restart phase after delay', () => {
      render(<GameOver {...defaultProps} />);

      // Initially in error phase
      expect(screen.getByText(/CRITICAL SYSTEM FAILURE/)).toBeInTheDocument();

      // Fast-forward past error phase (3 seconds)
      act(() => {
        vi.advanceTimersByTime(3100);
      });

      // Should now be in restart phase
      expect(screen.getByText('TERMINAL SYSTEM RESTART')).toBeInTheDocument();
      expect(screen.getByText('REINITIALIZING...')).toBeInTheDocument();
    });

    it('shows progress bar during restart', () => {
      render(<GameOver {...defaultProps} />);

      act(() => {
        vi.advanceTimersByTime(3100);
      });

      // Progress bar should be visible (contains filled and empty blocks)
      const progressBar = screen.getByText(/\[.*\]/);
      expect(progressBar).toBeInTheDocument();
    });
  });

  describe('Different Reasons', () => {
    it('displays custom game over reason', () => {
      render(
        <GameOver reason="Wrong password attempts exceeded" onRestartCompleteAction={vi.fn()} />
      );

      expect(screen.getByText('Wrong password attempts exceeded')).toBeInTheDocument();
    });

    it('displays another custom reason', () => {
      render(<GameOver reason="Security lockout triggered" onRestartCompleteAction={vi.fn()} />);

      expect(screen.getByText('Security lockout triggered')).toBeInTheDocument();
    });
  });

  describe('Visual Elements', () => {
    it('renders scanlines overlay', () => {
      const { container } = render(<GameOver {...defaultProps} />);

      expect(container.querySelector('[class*="scanlines"]')).toBeInTheDocument();
    });

    it('renders container element', () => {
      const { container } = render(<GameOver {...defaultProps} />);

      expect(container.querySelector('[class*="container"]')).toBeInTheDocument();
    });
  });
});
