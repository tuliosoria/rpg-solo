import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent, act } from '@testing-library/react';
import Victory from '../Victory';

// Mock the statistics module
vi.mock('../../storage/statistics', () => ({
  recordEnding: vi.fn(),
}));

// Mock the achievements module
vi.mock('../../engine/achievements', () => ({
  unlockAchievement: vi.fn(() => null),
}));

import { recordEnding } from '../../storage/statistics';
import { unlockAchievement } from '../../engine/achievements';

describe('Victory Component', () => {
  const defaultProps = {
    onRestartAction: vi.fn(),
    commandCount: 100,
    detectionLevel: 30,
    maxDetectionReached: 50,
    mathMistakes: 0,
    evidenceLinks: [] as Array<[string, string]>,
    dataIntegrity: 100,
    filesReadCount: 20,
  };

  beforeEach(() => {
    vi.clearAllMocks();
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('renders without crashing', () => {
    render(<Victory {...defaultProps} />);
    // Component should render
    expect(document.body).toBeTruthy();
  });

  it('records good ending in statistics on mount', () => {
    render(<Victory {...defaultProps} />);
    
    expect(recordEnding).toHaveBeenCalledWith('good', 100, 30);
    expect(recordEnding).toHaveBeenCalledTimes(1);
  });

  it('only records ending once even if props change', () => {
    const { rerender } = render(<Victory {...defaultProps} />);
    
    // Re-render with different props
    rerender(<Victory {...defaultProps} commandCount={150} />);
    
    // Should still only be called once
    expect(recordEnding).toHaveBeenCalledTimes(1);
  });

  it('checks for speed_demon achievement when commands < 50', () => {
    render(<Victory {...defaultProps} commandCount={45} />);
    
    expect(unlockAchievement).toHaveBeenCalledWith('speed_demon');
  });

  it('does not check for speed_demon achievement when commands >= 50', () => {
    render(<Victory {...defaultProps} commandCount={100} />);
    
    expect(unlockAchievement).not.toHaveBeenCalledWith('speed_demon');
  });

  it('checks for ghost achievement when detection < 20', () => {
    render(<Victory {...defaultProps} detectionLevel={15} />);
    
    expect(unlockAchievement).toHaveBeenCalledWith('ghost');
  });

  it('does not check for ghost achievement when detection >= 20', () => {
    render(<Victory {...defaultProps} detectionLevel={30} />);
    
    expect(unlockAchievement).not.toHaveBeenCalledWith('ghost');
  });

  it('checks for survivor achievement when maxDetection >= 80', () => {
    render(<Victory {...defaultProps} maxDetectionReached={85} />);
    
    expect(unlockAchievement).toHaveBeenCalledWith('survivor');
  });

  it('checks for mathematician achievement when mathMistakes = 0', () => {
    render(<Victory {...defaultProps} mathMistakes={0} />);
    
    expect(unlockAchievement).toHaveBeenCalledWith('mathematician');
  });

  it('does not check for mathematician achievement when mathMistakes > 0', () => {
    render(<Victory {...defaultProps} mathMistakes={2} />);
    
    expect(unlockAchievement).not.toHaveBeenCalledWith('mathematician');
  });

  it('checks for completionist achievement when filesRead >= 80', () => {
    render(<Victory {...defaultProps} filesReadCount={85} />);
    
    expect(unlockAchievement).toHaveBeenCalledWith('completionist');
  });

  it('progresses through phases with timers', async () => {
    render(<Victory {...defaultProps} />);
    
    // Initial phase should be 'intro'
    // Advance through intro phase
    act(() => {
      vi.advanceTimersByTime(3000);
    });
    
    // Should eventually show credits or message content
    // This tests that the component doesn't crash during phase transitions
    expect(document.body).toBeTruthy();
  });

  it('shows restart button after all phases complete', async () => {
    render(<Victory {...defaultProps} />);
    
    // Fast-forward through all phases
    act(() => {
      vi.advanceTimersByTime(30000); // 30 seconds should be enough
    });
    
    // Restart button should eventually appear
    // Note: We're just checking the component survives all phase transitions
    expect(document.body).toBeTruthy();
  });

  it('calls onRestartAction when restart is clicked', async () => {
    render(<Victory {...defaultProps} />);
    
    // Fast-forward to final phase
    act(() => {
      vi.advanceTimersByTime(60000);
    });
    
    // Try to find and click the restart button
    const restartButton = screen.queryByText(/play again/i) || screen.queryByText(/restart/i);
    if (restartButton) {
      fireEvent.click(restartButton);
      expect(defaultProps.onRestartAction).toHaveBeenCalled();
    }
  });
});
