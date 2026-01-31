import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent, act } from '@testing-library/react';
import ImageOverlay from '../ImageOverlay';

// Mock the RNG module
vi.mock('../../engine/rng', () => ({
  uiChance: vi.fn(() => false),
  uiRandomInt: vi.fn(() => 50),
}));

describe('ImageOverlay', () => {
  const defaultProps = {
    src: '/images/test-image.jpg',
    alt: 'Test recovered image',
    tone: 'clinical' as const,
    onCloseAction: vi.fn(),
  };

  beforeEach(() => {
    vi.clearAllMocks();
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.restoreAllMocks();
    vi.useRealTimers();
  });

  describe('Rendering', () => {
    it('renders the recovered visual data header', () => {
      render(<ImageOverlay {...defaultProps} />);

      expect(screen.getByText(/RECOVERED VISUAL DATA/)).toBeInTheDocument();
    });

    it('shows classification label', () => {
      render(<ImageOverlay {...defaultProps} />);

      expect(screen.getByText('CLASSIFICATION: RESTRICTED')).toBeInTheDocument();
    });

    it('shows dismiss hint', () => {
      render(<ImageOverlay {...defaultProps} />);

      expect(screen.getByText('[Any key to dismiss]')).toBeInTheDocument();
    });

    it('shows image after initial flicker', () => {
      render(<ImageOverlay {...defaultProps} />);

      // Fast-forward past flicker (150ms)
      act(() => {
        vi.advanceTimersByTime(200);
      });

      const img = screen.getByAltText('Test recovered image');
      expect(img).toBeInTheDocument();
      expect(img).toHaveAttribute('src', '/images/test-image.jpg');
    });

    it('shows error message when image fails to load', () => {
      render(<ImageOverlay {...defaultProps} />);

      act(() => {
        vi.advanceTimersByTime(200);
      });

      const img = screen.getByAltText('Test recovered image');
      fireEvent.error(img);

      expect(screen.getByText(/IMAGE DATA CORRUPTED/i)).toBeInTheDocument();
    });
  });

  describe('Corrupted Mode', () => {
    it('shows partial recovery header when corrupted', () => {
      render(<ImageOverlay {...defaultProps} corrupted={true} />);

      expect(screen.getByText(/PARTIAL RECOVERY/)).toBeInTheDocument();
    });

    it('renders corruption overlay when corrupted', () => {
      const { container } = render(<ImageOverlay {...defaultProps} corrupted={true} />);

      expect(container.querySelector('[class*="corruptionOverlay"]')).toBeInTheDocument();
    });
  });

  describe('Tone Styling', () => {
    it('applies clinical (green) tone', () => {
      const { container } = render(<ImageOverlay {...defaultProps} tone="clinical" />);

      expect(container.querySelector('[class*="greenTone"]')).toBeInTheDocument();
      expect(container.querySelector('[class*="greenGlow"]')).toBeInTheDocument();
    });

    it('applies surveillance (amber) tone', () => {
      const { container } = render(<ImageOverlay {...defaultProps} tone="surveillance" />);

      expect(container.querySelector('[class*="amberTone"]')).toBeInTheDocument();
      expect(container.querySelector('[class*="amberGlow"]')).toBeInTheDocument();
    });
  });

  describe('Auto-Close', () => {
    it('auto-closes after default duration', () => {
      render(<ImageOverlay {...defaultProps} />);

      // Default duration is 8000ms
      act(() => {
        vi.advanceTimersByTime(8100);
      });

      expect(defaultProps.onCloseAction).toHaveBeenCalledTimes(1);
    });

    it('auto-closes after custom duration', () => {
      render(<ImageOverlay {...defaultProps} durationMs={5000} />);

      act(() => {
        vi.advanceTimersByTime(5100);
      });

      expect(defaultProps.onCloseAction).toHaveBeenCalledTimes(1);
    });
  });

  describe('Keyboard Interaction', () => {
    it('closes on Escape key', () => {
      render(<ImageOverlay {...defaultProps} />);

      fireEvent.keyDown(window, { key: 'Escape' });

      expect(defaultProps.onCloseAction).toHaveBeenCalledTimes(1);
    });

    it('closes on Enter key', () => {
      render(<ImageOverlay {...defaultProps} />);

      fireEvent.keyDown(window, { key: 'Enter' });

      expect(defaultProps.onCloseAction).toHaveBeenCalledTimes(1);
    });

    it('closes on Space key', () => {
      render(<ImageOverlay {...defaultProps} />);

      fireEvent.keyDown(window, { key: ' ' });

      expect(defaultProps.onCloseAction).toHaveBeenCalledTimes(1);
    });
  });

  describe('Click Interaction', () => {
    it('closes when overlay is clicked', () => {
      const { container } = render(<ImageOverlay {...defaultProps} />);

      const overlay = container.querySelector('[class*="overlay"]');
      fireEvent.click(overlay!);

      expect(defaultProps.onCloseAction).toHaveBeenCalledTimes(1);
    });
  });

  describe('Visual Elements', () => {
    it('renders scanlines overlay', () => {
      const { container } = render(<ImageOverlay {...defaultProps} />);

      expect(container.querySelector('[class*="scanlines"]')).toBeInTheDocument();
    });

    it('renders noise overlay', () => {
      const { container } = render(<ImageOverlay {...defaultProps} />);

      expect(container.querySelector('[class*="noise"]')).toBeInTheDocument();
    });

    it('renders CRT glow effect', () => {
      const { container } = render(<ImageOverlay {...defaultProps} />);

      expect(container.querySelector('[class*="glow"]')).toBeInTheDocument();
    });
  });

  describe('Cleanup', () => {
    it('clears pending flicker timeouts on unmount', async () => {
      const rng = await import('../../engine/rng');
      const mockedChance = vi.mocked(rng.uiChance);
      mockedChance.mockReturnValueOnce(true).mockReturnValue(false);

      const { unmount } = render(<ImageOverlay {...defaultProps} />);

      act(() => {
        vi.advanceTimersByTime(1500);
      });

      unmount();

      expect(vi.getTimerCount()).toBe(0);
    });
  });
});
