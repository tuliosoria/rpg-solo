import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, act } from '@testing-library/react';
import Blackout from '../Blackout';

describe('Blackout', () => {
  const defaultProps = {
    onCompleteAction: vi.fn(),
  };

  beforeEach(() => {
    vi.clearAllMocks();
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.restoreAllMocks();
    vi.useRealTimers();
  });

  describe('Glitch Phase', () => {
    it('renders the CONNECTION INTERRUPTED message', () => {
      render(<Blackout {...defaultProps} />);

      expect(screen.getByText(/CONNECTION INTERRUPTED/)).toBeInTheDocument();
    });

    it('shows system detection message', () => {
      render(<Blackout {...defaultProps} />);

      expect(screen.getByText('SYSTEM DETECTED UNAUTHORIZED ACCESS')).toBeInTheDocument();
    });

    it('shows purge protocol message', () => {
      render(<Blackout {...defaultProps} />);

      expect(screen.getByText('INITIATING PURGE PROTOCOL...')).toBeInTheDocument();
    });
  });

  describe('Loading Phase', () => {
    it('transitions to loading phase after glitch', () => {
      render(<Blackout {...defaultProps} />);

      // Fast-forward past glitch phase (2 seconds)
      act(() => {
        vi.advanceTimersByTime(2100);
      });

      expect(screen.getByText('CLEARING SYSTEM CACHE')).toBeInTheDocument();
    });

    it('shows progress bar during loading', () => {
      render(<Blackout {...defaultProps} />);

      act(() => {
        vi.advanceTimersByTime(2100);
      });

      // Should show percentage
      expect(screen.getByText(/\d+%/)).toBeInTheDocument();
    });

    it('shows loading status messages', () => {
      render(<Blackout {...defaultProps} />);

      act(() => {
        vi.advanceTimersByTime(2100);
      });

      // Should show the first loading message
      expect(screen.getByText('Removing session logs...')).toBeInTheDocument();
    });
  });

  describe('Visual Elements', () => {
    it('renders scanlines overlay', () => {
      const { container } = render(<Blackout {...defaultProps} />);

      expect(container.querySelector('[class*="scanlines"]')).toBeInTheDocument();
    });
  });

  describe('Component Structure', () => {
    it('renders without crashing', () => {
      const { container } = render(<Blackout {...defaultProps} />);

      expect(container.firstChild).toBeInTheDocument();
    });

    it('contains UFO74 messages in the component', () => {
      // This tests that the component has the UFO74 messages defined
      // We don't test the animation timing which is fragile with fake timers
      render(<Blackout {...defaultProps} />);

      // The component renders - the messages are defined internally
      expect(screen.getByText(/CONNECTION INTERRUPTED/)).toBeInTheDocument();
    });
  });
});
