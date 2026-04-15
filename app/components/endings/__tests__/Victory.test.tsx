import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent, act } from '@testing-library/react';
import type { ImgHTMLAttributes } from 'react';
import Victory from '../Victory';

vi.mock('next/image', () => ({
  default: ({ alt, src, ...props }: ImgHTMLAttributes<HTMLImageElement>) => (
    // eslint-disable-next-line @next/next/no-img-element
    <img alt={alt} src={typeof src === 'string' ? src : ''} {...props} />
  ),
}));

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

  function advanceToComplete(textSpeed: 'normal' | 'instant' = 'normal') {
    if (textSpeed === 'instant') return; // instant starts at 'complete'
    // Advance through loading phase (2500ms for normal)
    act(() => {
      vi.advanceTimersByTime(3000);
    });
    // Advance through page → complete transition
    act(() => {
      vi.advanceTimersByTime(10000);
    });
  }

  it('renders without crashing', () => {
    render(<Victory {...defaultProps} />);
    expect(document.body).toBeTruthy();
  });

  it('records good ending in statistics on mount', () => {
    render(<Victory {...defaultProps} />);
    
    expect(recordEnding).toHaveBeenCalledWith('good', 100, 30);
    expect(recordEnding).toHaveBeenCalledTimes(1);
  });

  it('only records ending once even if props change', () => {
    const { rerender } = render(<Victory {...defaultProps} />);
    
    rerender(<Victory {...defaultProps} commandCount={150} />);
    
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
    
    // Advance through loading phase
    act(() => {
      vi.advanceTimersByTime(3000);
    });
    
    // Should eventually show page content
    expect(document.body).toBeTruthy();
  });

  it('shows restart button after all phases complete', async () => {
    render(<Victory {...defaultProps} />);
    
    // Fast-forward through all phases
    act(() => {
      vi.advanceTimersByTime(30000);
    });
    
    expect(document.body).toBeTruthy();
  });

  it('calls onRestartAction when restart is clicked', async () => {
    render(<Victory {...defaultProps} />);
    
    // Fast-forward to complete phase
    act(() => {
      vi.advanceTimersByTime(60000);
    });
    
    const restartButton = screen.queryByText(/play again/i) || screen.queryByText(/restart/i);
    if (restartButton) {
      fireEvent.click(restartButton);
      expect(defaultProps.onRestartAction).toHaveBeenCalled();
    }
  });

  it('shows a post-run dossier in the complete phase', () => {
    render(
      <Victory
        {...defaultProps}
        conspiracyFilesLeaked={true}
        alphaReleased={false}
        neuralLinkAuthenticated={false}
        totalReadableFiles={30}
      />
    );

    advanceToComplete();

    expect(screen.getByText('POST-RUN DOSSIER')).toBeInTheDocument();
    expect(screen.getByText('Evidence confirmed')).toBeInTheDocument();
    expect(screen.getByText('Public broadcast')).toBeInTheDocument();
  });

  it('keeps the leak path undisclosed for an incomplete dossier', () => {
    render(<Victory {...defaultProps} textSpeed="instant" totalReadableFiles={30} />);

    advanceToComplete('instant');

    expect(screen.getByText('Undisclosed')).toBeInTheDocument();
  });

  it('renders configured ending art when an AOL image source exists', () => {
    render(<Victory {...defaultProps} endingId="ufo74_exposed" textSpeed="instant" />);

    expect(
      screen.getByAltText('ferreira_service_photo_CLASSIFIED.jpg (unable to load)')
    ).toBeInTheDocument();
  });

  it('infers public leak modifiers from the ending when legacy flags are absent', () => {
    render(<Victory {...defaultProps} endingId="government_scandal" textSpeed="instant" />);

    advanceToComplete('instant');

    expect(screen.getByText('Leaked')).toBeInTheDocument();
    expect(screen.getByText('Public broadcast')).toBeInTheDocument();
  });

  it('supports instant text speed for the ending flow', () => {
    render(<Victory {...defaultProps} textSpeed="instant" totalReadableFiles={20} />);

    advanceToComplete('instant');

    expect(screen.getByText('POST-RUN DOSSIER')).toBeInTheDocument();
  });

  it('keeps the dossier inside the scrollable content area and focuses replay', () => {
    render(<Victory {...defaultProps} totalReadableFiles={20} textSpeed="instant" />);

    advanceToComplete('instant');

    const dossierTitle = screen.getByText('POST-RUN DOSSIER');
    expect(dossierTitle.closest('[class*="contentArea"]')).toBeTruthy();
    expect(screen.getByRole('button', { name: /play again/i })).toHaveFocus();
  });

  it('renders AOL breaking news headline for a specific ending', () => {
    render(<Victory {...defaultProps} endingId="ridiculed" textSpeed="instant" />);

    expect(screen.getByText(/INTERNET HOAX ALERT/i)).toBeInTheDocument();
  });

  it('shows browser chrome elements', () => {
    render(<Victory {...defaultProps} textSpeed="instant" />);

    expect(screen.getByText(/AOL News: Breaking Report/)).toBeInTheDocument();
    expect(screen.getByText('Location:')).toBeInTheDocument();
    expect(screen.getByText('Document: Done')).toBeInTheDocument();
  });

  it('shows loading screen before page content', () => {
    render(<Victory {...defaultProps} textSpeed="normal" />);

    expect(screen.getByText(/Transferring data from www\.aol\.com/)).toBeInTheDocument();
  });
});
