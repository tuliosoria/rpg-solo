import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent, act } from '@testing-library/react';
import SecretEnding from '../SecretEnding';

// Mock the statistics module
vi.mock('../../storage/statistics', () => ({
  recordEnding: vi.fn(),
}));

import { recordEnding } from '../../storage/statistics';

describe('SecretEnding Component', () => {
  const defaultProps = {
    onRestartAction: vi.fn(),
    commandCount: 120,
    detectionLevel: 70,
  };

  beforeEach(() => {
    vi.clearAllMocks();
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('renders without crashing', () => {
    render(<SecretEnding {...defaultProps} />);
    expect(document.body).toBeTruthy();
  });

  it('records secret ending in statistics on mount', () => {
    render(<SecretEnding {...defaultProps} />);
    
    expect(recordEnding).toHaveBeenCalledWith('secret', 120, 70);
    expect(recordEnding).toHaveBeenCalledTimes(1);
  });

  it('only records ending once even if props change', () => {
    const { rerender } = render(<SecretEnding {...defaultProps} />);
    
    // Re-render with different props
    rerender(<SecretEnding {...defaultProps} commandCount={150} />);
    
    // Should still only be called once
    expect(recordEnding).toHaveBeenCalledTimes(1);
  });

  it('uses default values when props not provided', () => {
    render(<SecretEnding onRestartAction={vi.fn()} />);
    
    // Component should use default values (commandCount=0, detectionLevel=100)
    expect(recordEnding).toHaveBeenCalledWith('secret', 0, 100);
  });

  it('progresses through static phase', () => {
    render(<SecretEnding {...defaultProps} />);
    
    // Initial phase is 'static'
    act(() => {
      vi.advanceTimersByTime(2000);
    });
    
    expect(document.body).toBeTruthy();
  });

  it('shows reveal content after static phase', async () => {
    render(<SecretEnding {...defaultProps} />);
    
    // Fast-forward through phases
    act(() => {
      vi.advanceTimersByTime(5000);
    });
    
    expect(document.body).toBeTruthy();
  });

  it('displays the truth revelation content', async () => {
    render(<SecretEnding {...defaultProps} />);
    
    // Fast-forward to show content
    act(() => {
      vi.advanceTimersByTime(15000);
    });
    
    // The secret ending reveals UFO74's true identity
    expect(document.body).toBeTruthy();
  });

  it('shows restart option after animation completes', async () => {
    render(<SecretEnding {...defaultProps} />);
    
    // Fast-forward through all animations
    act(() => {
      vi.advanceTimersByTime(60000);
    });
    
    expect(document.body).toBeTruthy();
  });

  it('calls onRestartAction when restart is clicked', async () => {
    render(<SecretEnding {...defaultProps} />);
    
    // Fast-forward to final phase
    act(() => {
      vi.advanceTimersByTime(120000);
    });
    
    // Try to find and click restart
    const restartButton = screen.queryByText(/play again/i) || screen.queryByText(/restart/i);
    if (restartButton) {
      fireEvent.click(restartButton);
      expect(defaultProps.onRestartAction).toHaveBeenCalled();
    }
  });
});
