import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent, act } from '@testing-library/react';
import VideoOverlay from '../VideoOverlay';

describe('VideoOverlay', () => {
  const defaultProps = {
    src: '/videos/test-video.mp4',
    title: 'TEST_VIDEO.VID',
    tone: 'surveillance' as const,
    onCloseAction: vi.fn(),
    corrupted: false,
  };

  beforeEach(() => {
    vi.clearAllMocks();
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('renders with correct title', async () => {
    render(<VideoOverlay {...defaultProps} />);
    
    // Fast-forward through initial animation
    act(() => {
      vi.advanceTimersByTime(200);
    });
    
    expect(screen.getByText(/RECOVERED VIDEO DATA/)).toBeInTheDocument();
    expect(screen.getByText(/TEST_VIDEO.VID/)).toBeInTheDocument();
  });

  it('displays corrupted header when corrupted prop is true', async () => {
    render(<VideoOverlay {...defaultProps} corrupted={true} />);
    
    act(() => {
      vi.advanceTimersByTime(200);
    });
    
    expect(screen.getByText(/PARTIAL VIDEO RECOVERY/)).toBeInTheDocument();
  });

  it('renders video element after initial animation', async () => {
    render(<VideoOverlay {...defaultProps} />);
    
    // Fast-forward through initial animation to make video visible
    act(() => {
      vi.advanceTimersByTime(200);
    });
    
    // Wait for the visible state to become true
    await vi.waitFor(() => {
      const video = document.querySelector('video');
      expect(video).toBeInTheDocument();
      expect(video).toHaveAttribute('src', '/videos/test-video.mp4');
    });
  });

  it('calls onCloseAction when escape key is pressed', async () => {
    render(<VideoOverlay {...defaultProps} />);
    
    act(() => {
      fireEvent.keyDown(window, { key: 'Escape' });
    });
    
    expect(defaultProps.onCloseAction).toHaveBeenCalledTimes(1);
  });

  it('renders play/pause button', async () => {
    render(<VideoOverlay {...defaultProps} />);
    
    act(() => {
      vi.advanceTimersByTime(200);
    });
    
    const playButton = screen.getByRole('button', { name: /play/i });
    expect(playButton).toBeInTheDocument();
  });

  it('displays keyboard shortcuts hint', async () => {
    render(<VideoOverlay {...defaultProps} />);
    
    act(() => {
      vi.advanceTimersByTime(200);
    });
    
    expect(screen.getByText(/SPACE.*Play\/Pause.*ESC.*Close/)).toBeInTheDocument();
  });

  it('applies clinical tone class correctly', async () => {
    render(<VideoOverlay {...defaultProps} tone="clinical" />);
    
    act(() => {
      vi.advanceTimersByTime(200);
    });
    
    const container = document.querySelector('[class*="greenGlow"]');
    expect(container).toBeInTheDocument();
  });

  it('applies surveillance tone class correctly', async () => {
    render(<VideoOverlay {...defaultProps} tone="surveillance" />);
    
    act(() => {
      vi.advanceTimersByTime(200);
    });
    
    const container = document.querySelector('[class*="amberGlow"]');
    expect(container).toBeInTheDocument();
  });

  it('displays time as 00:00 / 00:00 initially', async () => {
    render(<VideoOverlay {...defaultProps} />);
    
    act(() => {
      vi.advanceTimersByTime(200);
    });
    
    expect(screen.getByText('00:00 / 00:00')).toBeInTheDocument();
  });

  it('closes when clicking overlay background', async () => {
    render(<VideoOverlay {...defaultProps} />);
    
    // Get the overlay element (first child of rendered component)
    const overlay = document.querySelector('[class*="overlay"]');
    expect(overlay).toBeInTheDocument();
    
    // Click directly on the overlay (not on a child)
    act(() => {
      fireEvent.click(overlay!);
    });
    
    expect(defaultProps.onCloseAction).toHaveBeenCalled();
  });
});
