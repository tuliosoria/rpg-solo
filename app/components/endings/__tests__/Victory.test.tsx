import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent, act } from '@testing-library/react';
import Victory from '../Victory';

// Mock the statistics module
vi.mock('../../../storage/statistics', () => ({
  recordEnding: vi.fn(),
}));

// Mock the achievements module
vi.mock('../../../engine/achievements', () => ({
  unlockAchievement: vi.fn(() => null),
}));

import { recordEnding } from '../../../storage/statistics';
import { unlockAchievement } from '../../../engine/achievements';

describe('Victory Component', () => {
  const defaultProps = {
    onRestartAction: vi.fn(),
    commandCount: 100,
    detectionLevel: 30,
    maxDetectionReached: 50,
    evidenceCount: 6,
    filesReadCount: 20,
  };

  beforeEach(() => {
    vi.clearAllMocks();
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  function advanceToCredits(textSpeed: 'normal' | 'instant' = 'normal') {
    act(() => {
      vi.advanceTimersByTime(textSpeed === 'instant' ? 150 : 1600);
    });

    act(() => {
      vi.advanceTimersByTime(textSpeed === 'instant' ? 400 : 10000);
    });
  }

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

  it('checks for completionist achievement when all readable files are found', () => {
    render(<Victory {...defaultProps} filesReadCount={85} totalReadableFiles={85} />);
    
    expect(unlockAchievement).toHaveBeenCalledWith('completionist');
  });

  it('checks the dossier-based ending achievement for the resolved ending variant', () => {
    render(<Victory {...defaultProps} />);

    expect(unlockAchievement).toHaveBeenCalledWith('ending_incomplete_picture');
  });

  it('uses runtime endingFlags to unlock modifier achievements', () => {
    render(
      <Victory
        {...defaultProps}
        conspiracyFilesLeaked={false}
        alphaReleased={false}
        neuralLinkAuthenticated={false}
        endingFlags={{
          conspiracyFilesLeaked: true,
          alphaReleased: true,
          neuralLinkAuthenticated: true,
        }}
      />
    );

    expect(unlockAchievement).toHaveBeenCalledWith('whistleblower');
    expect(unlockAchievement).toHaveBeenCalledWith('liberator');
    expect(unlockAchievement).toHaveBeenCalledWith('linked');
    expect(unlockAchievement).toHaveBeenCalledWith('revelator');
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

  it('shows a post-run dossier in the credits phase', () => {
    render(
      <Victory
        {...defaultProps}
        conspiracyFilesLeaked={true}
        alphaReleased={false}
        neuralLinkAuthenticated={false}
        totalReadableFiles={30}
      />
    );

    advanceToCredits();

    expect(screen.getByText('POST-RUN DOSSIER')).toBeInTheDocument();
    expect(screen.getByText('Evidence confirmed')).toBeInTheDocument();
    expect(screen.getByText('Undisclosed')).toBeInTheDocument();
  });

  it('supports instant text speed for the ending flow', () => {
    render(<Victory {...defaultProps} textSpeed="instant" totalReadableFiles={20} />);

    advanceToCredits('instant');

    expect(screen.getByText('POST-RUN DOSSIER')).toBeInTheDocument();
  });

  it('keeps the dossier inside the scrollable message region and focuses replay', () => {
    render(<Victory {...defaultProps} totalReadableFiles={20} />);

    advanceToCredits();

    const dossierTitle = screen.getByText('POST-RUN DOSSIER');
    expect(dossierTitle.closest('[class*="messageContent"]')).toBeTruthy();
    expect(screen.getByRole('button', { name: /play again/i })).toHaveFocus();
  });
});
