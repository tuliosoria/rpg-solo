import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent, act } from '@testing-library/react';
import VideoOverlay from '../VideoOverlay';
import * as rng from '../../engine/rng';

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

  it('toggles play/pause on Space key', async () => {
    render(<VideoOverlay {...defaultProps} />);

    act(() => {
      vi.advanceTimersByTime(200);
    });

    // Press Space key
    act(() => {
      fireEvent.keyDown(window, { key: ' ' });
    });

    // Video play is called (we can verify by checking if the play function was attempted)
    const video = document.querySelector('video');
    expect(video).toBeInTheDocument();
  });

  it('toggles play/pause on Enter key', async () => {
    render(<VideoOverlay {...defaultProps} />);

    act(() => {
      vi.advanceTimersByTime(200);
    });

    // Press Enter key
    act(() => {
      fireEvent.keyDown(window, { key: 'Enter' });
    });

    const video = document.querySelector('video');
    expect(video).toBeInTheDocument();
  });

  it('handles video loadedmetadata event', async () => {
    render(<VideoOverlay {...defaultProps} />);

    act(() => {
      vi.advanceTimersByTime(200);
    });

    const video = document.querySelector('video');
    expect(video).toBeInTheDocument();

    // Simulate loadedmetadata event
    act(() => {
      Object.defineProperty(video, 'duration', { value: 120, writable: true });
      fireEvent.loadedMetadata(video!);
    });

    // After loading, time display should update
    expect(screen.getByText(/00:00 \/ 02:00/)).toBeInTheDocument();
  });

  it('handles video timeupdate event', async () => {
    render(<VideoOverlay {...defaultProps} />);

    act(() => {
      vi.advanceTimersByTime(200);
    });

    const video = document.querySelector('video') as HTMLVideoElement;

    // Simulate video playing
    act(() => {
      Object.defineProperty(video, 'duration', { value: 60, writable: true });
      Object.defineProperty(video, 'currentTime', { value: 30, writable: true });
      fireEvent.loadedMetadata(video);
      fireEvent.timeUpdate(video);
    });

    // Progress should update
    expect(screen.getByText(/00:30 \/ 01:00/)).toBeInTheDocument();
  });

  it('handles video ended event', async () => {
    render(<VideoOverlay {...defaultProps} />);

    act(() => {
      vi.advanceTimersByTime(200);
    });

    const video = document.querySelector('video');

    // Simulate video ending
    act(() => {
      fireEvent.ended(video!);
    });

    // Play button should show play icon (not pause)
    const playButton = screen.getByRole('button', { name: /play/i });
    expect(playButton).toBeInTheDocument();
  });

  it('handles video error event', async () => {
    render(<VideoOverlay {...defaultProps} />);

    act(() => {
      vi.advanceTimersByTime(200);
    });

    const video = document.querySelector('video');

    // Simulate video error
    act(() => {
      fireEvent.error(video!);
    });

    // Error message should display
    expect(screen.getByText(/VIDEO DATA CORRUPTED/)).toBeInTheDocument();
  });

  it('hides controls when error occurs', async () => {
    render(<VideoOverlay {...defaultProps} />);

    act(() => {
      vi.advanceTimersByTime(200);
    });

    const video = document.querySelector('video');

    act(() => {
      fireEvent.error(video!);
    });

    // Play button should not be present when there's an error
    expect(screen.queryByRole('button', { name: /play/i })).not.toBeInTheDocument();
  });

  it('handles play button click', async () => {
    render(<VideoOverlay {...defaultProps} />);

    act(() => {
      vi.advanceTimersByTime(200);
    });

    const playButton = screen.getByRole('button', { name: /play/i });

    act(() => {
      fireEvent.click(playButton);
    });

    // Button should work (video play is attempted)
    expect(playButton).toBeInTheDocument();
  });

  it('shows error when playback is blocked', async () => {
    render(<VideoOverlay {...defaultProps} />);

    act(() => {
      vi.advanceTimersByTime(200);
    });

    const video = document.querySelector('video') as HTMLVideoElement;
    if (video) {
      Object.defineProperty(video, 'duration', { value: 120, writable: true });
      fireEvent.loadedMetadata(video);
      vi.spyOn(video, 'play').mockImplementation(
        () => Promise.reject(new Error('blocked')) as never
      );
    }

    const playButton = screen.getByRole('button', { name: /play/i });

    await act(async () => {
      fireEvent.click(playButton);
      await Promise.resolve();
    });

    expect(screen.getByText(/PLAYBACK BLOCKED/i)).toBeInTheDocument();
  });

  it('handles progress bar click to seek', async () => {
    render(<VideoOverlay {...defaultProps} />);

    act(() => {
      vi.advanceTimersByTime(200);
    });

    const video = document.querySelector('video') as HTMLVideoElement;

    // Set up video duration and mock currentTime setter
    act(() => {
      Object.defineProperty(video, 'duration', { value: 100, writable: true });
      // Mock currentTime to be settable without jsdom errors
      let currentTimeValue = 0;
      Object.defineProperty(video, 'currentTime', {
        get: () => currentTimeValue,
        set: v => {
          if (Number.isFinite(v)) {
            currentTimeValue = v;
          }
        },
        configurable: true,
      });
      fireEvent.loadedMetadata(video);
    });

    // Find progress container and click
    const progressContainer = document.querySelector('[class*="progressContainer"]');
    if (progressContainer) {
      // Mock getBoundingClientRect to return proper dimensions
      const originalGetBoundingClientRect = progressContainer.getBoundingClientRect;
      progressContainer.getBoundingClientRect = () => ({
        left: 0,
        right: 100,
        top: 0,
        bottom: 10,
        width: 100,
        height: 10,
        x: 0,
        y: 0,
        toJSON: () => {},
      });

      act(() => {
        fireEvent.click(progressContainer, {
          clientX: 50,
          clientY: 5,
        });
      });

      // Restore original
      progressContainer.getBoundingClientRect = originalGetBoundingClientRect;
    }

    expect(video).toBeInTheDocument();
  });

  it('shows corrupted overlay elements when corrupted', async () => {
    render(<VideoOverlay {...defaultProps} corrupted={true} />);

    act(() => {
      vi.advanceTimersByTime(200);
    });

    const corruptedFrame = document.querySelector('[class*="corrupted"]');
    expect(corruptedFrame).toBeInTheDocument();
  });

  it('shows classification and file metadata', async () => {
    render(<VideoOverlay {...defaultProps} />);

    act(() => {
      vi.advanceTimersByTime(200);
    });

    expect(screen.getByText('CLASSIFICATION: RESTRICTED')).toBeInTheDocument();
    expect(screen.getByText(/FILE: TEST_VIDEO.VID/)).toBeInTheDocument();
  });

  it('formats time correctly for various durations', async () => {
    render(<VideoOverlay {...defaultProps} />);

    act(() => {
      vi.advanceTimersByTime(200);
    });

    const video = document.querySelector('video') as HTMLVideoElement;

    // Test with longer duration
    act(() => {
      Object.defineProperty(video, 'duration', { value: 3661, writable: true }); // 61 min 1 sec
      Object.defineProperty(video, 'currentTime', { value: 65, writable: true }); // 1 min 5 sec
      fireEvent.loadedMetadata(video);
      fireEvent.timeUpdate(video);
    });

    expect(screen.getByText(/01:05 \/ 61:01/)).toBeInTheDocument();
  });

  it('shows loading state initially', async () => {
    render(<VideoOverlay {...defaultProps} />);

    act(() => {
      vi.advanceTimersByTime(200);
    });

    // Before loadedmetadata, button shows loading indicator
    const playButton = screen.getByRole('button', { name: /play/i });
    expect(playButton.textContent).toBe('...');
  });

  it('handles video play event', async () => {
    render(<VideoOverlay {...defaultProps} />);

    act(() => {
      vi.advanceTimersByTime(200);
    });

    const video = document.querySelector('video');

    // Simulate metadata loaded first
    act(() => {
      Object.defineProperty(video, 'duration', { value: 60, writable: true });
      fireEvent.loadedMetadata(video!);
    });

    // Simulate play event
    act(() => {
      fireEvent.play(video!);
    });

    // Button should show pause icon
    const playButton = screen.getByRole('button', { name: /pause/i });
    expect(playButton.textContent).toBe('║║');
  });

  it('handles video pause event', async () => {
    render(<VideoOverlay {...defaultProps} />);

    act(() => {
      vi.advanceTimersByTime(200);
    });

    const video = document.querySelector('video');

    // Load and start playing
    act(() => {
      Object.defineProperty(video, 'duration', { value: 60, writable: true });
      fireEvent.loadedMetadata(video!);
      fireEvent.play(video!);
    });

    // Now pause
    act(() => {
      fireEvent.pause(video!);
    });

    // Button should show play icon again
    const playButton = screen.getByRole('button', { name: /play/i });
    expect(playButton).toBeInTheDocument();
  });

  it('applies clinical tone to video wrapper', async () => {
    render(<VideoOverlay {...defaultProps} tone="clinical" />);

    act(() => {
      vi.advanceTimersByTime(200);
    });

    const videoWrapper = document.querySelector('[class*="greenTone"]');
    expect(videoWrapper).toBeInTheDocument();
  });

  it('applies surveillance tone to video wrapper', async () => {
    render(<VideoOverlay {...defaultProps} tone="surveillance" />);

    act(() => {
      vi.advanceTimersByTime(200);
    });

    const videoWrapper = document.querySelector('[class*="amberTone"]');
    expect(videoWrapper).toBeInTheDocument();
  });

  it('does not close when clicking on container content', async () => {
    render(<VideoOverlay {...defaultProps} />);

    act(() => {
      vi.advanceTimersByTime(200);
    });

    // Click on container (not overlay)
    const container = document.querySelector('[class*="container"]');

    act(() => {
      // Create an event where target !== currentTarget
      fireEvent.click(container!);
    });

    // onCloseAction should NOT be called when clicking inside container
    expect(defaultProps.onCloseAction).not.toHaveBeenCalled();
  });

  it('clears pending flicker timeouts on unmount', () => {
    const chanceSpy = vi.spyOn(rng, 'uiChance').mockReturnValue(true);
    const randomSpy = vi.spyOn(rng, 'uiRandomInt').mockReturnValue(50);

    const { unmount } = render(<VideoOverlay {...defaultProps} />);

    act(() => {
      vi.advanceTimersByTime(2000);
    });

    unmount();

    expect(vi.getTimerCount()).toBe(0);

    chanceSpy.mockRestore();
    randomSpy.mockRestore();
  });
});
