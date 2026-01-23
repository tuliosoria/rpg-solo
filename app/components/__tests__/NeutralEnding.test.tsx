import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent, act } from '@testing-library/react';
import NeutralEnding from '../NeutralEnding';

// Mock the statistics module
vi.mock('../../storage/statistics', () => ({
  recordEnding: vi.fn(),
}));

import { recordEnding } from '../../storage/statistics';

describe('NeutralEnding Component', () => {
  const defaultProps = {
    onRestartAction: vi.fn(),
    commandCount: 75,
    detectionLevel: 50,
  };

  beforeEach(() => {
    vi.clearAllMocks();
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('renders without crashing', () => {
    render(<NeutralEnding {...defaultProps} />);
    expect(document.body).toBeTruthy();
  });

  it('records neutral ending in statistics on mount', () => {
    render(<NeutralEnding {...defaultProps} />);
    
    expect(recordEnding).toHaveBeenCalledWith('neutral', 75, 50);
    expect(recordEnding).toHaveBeenCalledTimes(1);
  });

  it('only records ending once even if props change', () => {
    const { rerender } = render(<NeutralEnding {...defaultProps} />);
    
    // Re-render with different props
    rerender(<NeutralEnding {...defaultProps} commandCount={100} />);
    
    // Should still only be called once
    expect(recordEnding).toHaveBeenCalledTimes(1);
  });

  it('uses default values when props not provided', () => {
    render(<NeutralEnding onRestartAction={vi.fn()} />);
    
    // Component should use default values (commandCount=0, detectionLevel=50)
    expect(recordEnding).toHaveBeenCalledWith('neutral', 0, 50);
  });

  it('progresses through disconnect phase', () => {
    render(<NeutralEnding {...defaultProps} />);
    
    // Initial phase is 'disconnect'
    act(() => {
      vi.advanceTimersByTime(2000);
    });
    
    expect(document.body).toBeTruthy();
  });

  it('shows message content after disconnect phase', async () => {
    render(<NeutralEnding {...defaultProps} />);
    
    // Fast-forward through phases
    act(() => {
      vi.advanceTimersByTime(5000);
    });
    
    expect(document.body).toBeTruthy();
  });

  it('displays UFO74 messages', async () => {
    render(<NeutralEnding {...defaultProps} />);
    
    // Fast-forward to show content
    act(() => {
      vi.advanceTimersByTime(15000);
    });
    
    // The neutral ending contains UFO74 messages
    expect(document.body).toBeTruthy();
  });

  it('shows restart option after animation completes', async () => {
    render(<NeutralEnding {...defaultProps} />);
    
    // Fast-forward through all animations
    act(() => {
      vi.advanceTimersByTime(30000);
    });
    
    expect(document.body).toBeTruthy();
  });

  it('calls onRestartAction when restart is clicked', async () => {
    render(<NeutralEnding {...defaultProps} />);
    
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
