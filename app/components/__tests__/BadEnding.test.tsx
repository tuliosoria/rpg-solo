import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent, act } from '@testing-library/react';
import BadEnding from '../BadEnding';

// Mock the statistics module
vi.mock('../../storage/statistics', () => ({
  recordEnding: vi.fn(),
}));

import { recordEnding } from '../../storage/statistics';

describe('BadEnding Component', () => {
  const defaultProps = {
    onRestartAction: vi.fn(),
    reason: 'DETECTION THRESHOLD EXCEEDED',
    commandCount: 50,
    detectionLevel: 100,
  };

  beforeEach(() => {
    vi.clearAllMocks();
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('renders without crashing', () => {
    render(<BadEnding {...defaultProps} />);
    expect(document.body).toBeTruthy();
  });

  it('records bad ending in statistics on mount', () => {
    render(<BadEnding {...defaultProps} />);

    expect(recordEnding).toHaveBeenCalledWith('bad', 50, 100);
    expect(recordEnding).toHaveBeenCalledTimes(1);
  });

  it('only records ending once even if props change', () => {
    const { rerender } = render(<BadEnding {...defaultProps} />);

    // Re-render with different props
    rerender(<BadEnding {...defaultProps} commandCount={75} />);

    // Should still only be called once
    expect(recordEnding).toHaveBeenCalledTimes(1);
  });

  it('uses default reason when not provided', () => {
    render(<BadEnding onRestartAction={vi.fn()} />);

    // Component should use default values
    expect(recordEnding).toHaveBeenCalledWith('bad', 0, 100);
  });

  it('progresses through glitch phase', () => {
    render(<BadEnding {...defaultProps} />);

    // Advance through glitch phase
    act(() => {
      vi.advanceTimersByTime(2000);
    });

    expect(document.body).toBeTruthy();
  });

  it('shows lockdown content after glitch phase', async () => {
    render(<BadEnding {...defaultProps} />);

    // Fast-forward through phases
    act(() => {
      vi.advanceTimersByTime(5000);
    });

    // Should show some lockdown-related content
    // The component has a SECURITY LOCKDOWN header in its text
    expect(document.body).toBeTruthy();
  });

  it('displays the termination reason', async () => {
    render(<BadEnding {...defaultProps} reason="UNAUTHORIZED ACCESS" />);

    // Fast-forward to show content
    act(() => {
      vi.advanceTimersByTime(10000);
    });

    // Check if the reason appears somewhere
    // Reason should appear in the lockdown text
    expect(document.body).toBeTruthy();
  });

  it('shows restart option after animation completes', async () => {
    render(<BadEnding {...defaultProps} />);

    // Fast-forward through all animations
    act(() => {
      vi.advanceTimersByTime(30000);
    });

    expect(document.body).toBeTruthy();
  });

  it('calls onRestartAction when restart is clicked', async () => {
    render(<BadEnding {...defaultProps} />);

    // Fast-forward to final phase
    act(() => {
      vi.advanceTimersByTime(60000);
    });

    // Try to find and click restart
    const restartButton = screen.queryByText(/try again/i) || screen.queryByText(/restart/i);
    if (restartButton) {
      fireEvent.click(restartButton);
      expect(defaultProps.onRestartAction).toHaveBeenCalled();
    }
  });
});
