import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import VideoOverlay from '../VideoOverlay';

// Mock HTMLVideoElement play method
Object.defineProperty(HTMLMediaElement.prototype, 'play', {
  configurable: true,
  value: jest.fn().mockResolvedValue(undefined),
});

Object.defineProperty(HTMLMediaElement.prototype, 'pause', {
  configurable: true,
  value: jest.fn(),
});

Object.defineProperty(HTMLMediaElement.prototype, 'load', {
  configurable: true,
  value: jest.fn(),
});

describe('VideoOverlay', () => {
  const mockOnClose = jest.fn();
  const defaultProps = {
    src: '/test-video.mp4',
    alt: 'Test Video',
    onCloseAction: mockOnClose,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders with video element', async () => {
    render(<VideoOverlay {...defaultProps} />);
    
    await waitFor(() => {
      const video = document.querySelector('video');
      expect(video).toBeInTheDocument();
    });
  });

  it('displays the header text', () => {
    render(<VideoOverlay {...defaultProps} />);
    
    expect(screen.getByText(/RECOVERED VIDEO DATA/i)).toBeInTheDocument();
  });

  it('displays corrupted header when corrupted prop is true', () => {
    render(<VideoOverlay {...defaultProps} corrupted={true} />);
    
    expect(screen.getByText(/PARTIAL VIDEO RECOVERY/i)).toBeInTheDocument();
  });

  it('displays metadata information', () => {
    render(<VideoOverlay {...defaultProps} />);
    
    expect(screen.getByText(/CLASSIFICATION: RESTRICTED/i)).toBeInTheDocument();
    expect(screen.getByText(/Press ESC to close/i)).toBeInTheDocument();
  });

  it('calls onCloseAction when overlay is clicked', async () => {
    const user = userEvent.setup();
    render(<VideoOverlay {...defaultProps} />);
    
    const overlay = screen.getByText(/RECOVERED VIDEO DATA/i).parentElement?.parentElement?.parentElement;
    if (overlay) {
      await user.click(overlay);
    }
    
    expect(mockOnClose).toHaveBeenCalledTimes(1);
  });

  it('calls onCloseAction when Escape key is pressed', async () => {
    const user = userEvent.setup();
    render(<VideoOverlay {...defaultProps} />);
    
    await user.keyboard('{Escape}');
    
    expect(mockOnClose).toHaveBeenCalledTimes(1);
  });

  it('calls onCloseAction when Enter key is pressed', async () => {
    const user = userEvent.setup();
    render(<VideoOverlay {...defaultProps} />);
    
    await user.keyboard('{Enter}');
    
    expect(mockOnClose).toHaveBeenCalledTimes(1);
  });

  it('calls onCloseAction when Space key is pressed', async () => {
    const user = userEvent.setup();
    render(<VideoOverlay {...defaultProps} />);
    
    await user.keyboard(' ');
    
    expect(mockOnClose).toHaveBeenCalledTimes(1);
  });

  it('has video element with correct src', async () => {
    render(<VideoOverlay {...defaultProps} />);
    
    await waitFor(() => {
      const video = document.querySelector('video');
      expect(video).toHaveAttribute('src', '/test-video.mp4');
    });
  });

  it('has video controls enabled', async () => {
    render(<VideoOverlay {...defaultProps} />);
    
    await waitFor(() => {
      const video = document.querySelector('video');
      expect(video).toHaveAttribute('controls');
    });
  });

  it('shows corruption overlay when corrupted', () => {
    const { container } = render(<VideoOverlay {...defaultProps} corrupted={true} />);
    
    const corruptionOverlay = container.querySelector('[class*="corruptionOverlay"]');
    expect(corruptionOverlay).toBeInTheDocument();
  });

  it('does not show corruption overlay when not corrupted', () => {
    const { container } = render(<VideoOverlay {...defaultProps} corrupted={false} />);
    
    const corruptionOverlay = container.querySelector('[class*="corruptionOverlay"]');
    expect(corruptionOverlay).not.toBeInTheDocument();
  });

  it('has video element that can be played', async () => {
    render(<VideoOverlay {...defaultProps} />);
    
    await waitFor(() => {
      const video = document.querySelector('video');
      expect(video).toBeInTheDocument();
      expect(video).toHaveAttribute('src', '/test-video.mp4');
    });
  });
});
