import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import PauseMenu from '../PauseMenu';

describe('PauseMenu', () => {
  const defaultProps = {
    onResumeAction: vi.fn(),
    onSaveAction: vi.fn(),
    onLoadAction: vi.fn(),
    onSettingsAction: vi.fn(),
    onExitAction: vi.fn(),
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('Main Pause Menu', () => {
    it('renders the PAUSED header', () => {
      render(<PauseMenu {...defaultProps} />);

      expect(screen.getByText('PAUSED')).toBeInTheDocument();
    });

    it('renders all menu options', () => {
      render(<PauseMenu {...defaultProps} />);

      expect(screen.getByRole('button', { name: /RESUME GAME/i })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /SAVE SESSION/i })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /LOAD CHECKPOINT/i })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /HELP/i })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /SETTINGS/i })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /EXIT TO MENU/i })).toBeInTheDocument();
    });

    it('shows a succinct objective from Help', () => {
      render(<PauseMenu {...defaultProps} />);

      fireEvent.click(screen.getByRole('button', { name: /HELP/i }));

      expect(screen.getByText('OBJECTIVE')).toBeInTheDocument();
      expect(screen.getByText(/Save the ones that strengthen your case/i)).toBeInTheDocument();
      expect(screen.getByText(/once you leak, there is no coming back/i)).toBeInTheDocument();
    });

    it('shows keyboard navigation hint', () => {
      render(<PauseMenu {...defaultProps} />);

      expect(screen.getByText(/Navigate.*Enter Select.*Esc Resume/)).toBeInTheDocument();
    });

    it('calls onResumeAction when clicking RESUME', () => {
      render(<PauseMenu {...defaultProps} />);

      fireEvent.click(screen.getByRole('button', { name: /RESUME GAME/i }));

      expect(defaultProps.onResumeAction).toHaveBeenCalledTimes(1);
    });

    it('calls onSaveAction when clicking SAVE', () => {
      render(<PauseMenu {...defaultProps} />);

      fireEvent.click(screen.getByRole('button', { name: /SAVE SESSION/i }));

      expect(defaultProps.onSaveAction).toHaveBeenCalledTimes(1);
    });

    it('shows load confirmation when clicking LOAD', () => {
      render(<PauseMenu {...defaultProps} />);

      fireEvent.click(screen.getByRole('button', { name: /LOAD CHECKPOINT/i }));

      expect(defaultProps.onLoadAction).not.toHaveBeenCalled();
      expect(screen.getByText('LOAD CHECKPOINT?')).toBeInTheDocument();
      expect(screen.getByText('Unsaved progress will be lost.')).toBeInTheDocument();
    });

    it('calls onSettingsAction when clicking SETTINGS', () => {
      render(<PauseMenu {...defaultProps} />);

      fireEvent.click(screen.getByRole('button', { name: /SETTINGS/i }));

      expect(defaultProps.onSettingsAction).toHaveBeenCalledTimes(1);
    });

    it('shows exit confirmation when clicking EXIT', () => {
      render(<PauseMenu {...defaultProps} />);

      fireEvent.click(screen.getByRole('button', { name: /EXIT TO MENU/i }));

      expect(screen.getByText('EXIT TO MENU?')).toBeInTheDocument();
      expect(screen.getByText('Unsaved progress will be lost.')).toBeInTheDocument();
    });

    it('calls onResumeAction when clicking overlay background', () => {
      const { container } = render(<PauseMenu {...defaultProps} />);

      // Click the overlay directly (first child with overlay class)
      const overlay = container.querySelector('[class*="overlay"]');
      fireEvent.click(overlay!);

      expect(defaultProps.onResumeAction).toHaveBeenCalledTimes(1);
    });
  });

  describe('Keyboard Navigation', () => {
    it('selects next item on ArrowDown', () => {
      render(<PauseMenu {...defaultProps} />);

      const resumeButton = screen.getByRole('button', { name: /RESUME GAME/i });
      expect(resumeButton.textContent).toContain('▶');

      fireEvent.keyDown(window, { key: 'ArrowDown' });

      const saveButton = screen.getByRole('button', { name: /SAVE SESSION/i });
      expect(saveButton.textContent).toContain('▶');
    });

    it('selects previous item on ArrowUp', () => {
      render(<PauseMenu {...defaultProps} />);

      fireEvent.keyDown(window, { key: 'ArrowDown' });
      fireEvent.keyDown(window, { key: 'ArrowUp' });

      const resumeButton = screen.getByRole('button', { name: /RESUME GAME/i });
      expect(resumeButton.textContent).toContain('▶');
    });

    it('wraps around when at end', () => {
      render(<PauseMenu {...defaultProps} />);

      // Press down through all menu items to wrap to beginning
      for (let i = 0; i < 6; i++) {
        fireEvent.keyDown(window, { key: 'ArrowDown' });
      }

      const resumeButton = screen.getByRole('button', { name: /RESUME GAME/i });
      expect(resumeButton.textContent).toContain('▶');
    });

    it('activates selected item on Enter', () => {
      render(<PauseMenu {...defaultProps} />);

      fireEvent.keyDown(window, { key: 'Enter' });

      expect(defaultProps.onResumeAction).toHaveBeenCalledTimes(1);
    });

    it('calls onResumeAction on Escape', () => {
      render(<PauseMenu {...defaultProps} />);

      fireEvent.keyDown(window, { key: 'Escape' });

      expect(defaultProps.onResumeAction).toHaveBeenCalledTimes(1);
    });

    it('navigates to settings on Enter when selected', () => {
      render(<PauseMenu {...defaultProps} />);

      // Navigate to settings (index 4)
      for (let i = 0; i < 4; i++) {
        fireEvent.keyDown(window, { key: 'ArrowDown' });
      }
      fireEvent.keyDown(window, { key: 'Enter' });

      expect(defaultProps.onSettingsAction).toHaveBeenCalledTimes(1);
    });
  });

  describe('Exit Confirmation', () => {
    it('shows confirmation dialog when EXIT is selected with Enter', () => {
      render(<PauseMenu {...defaultProps} />);

      // Navigate to EXIT (index 5)
      for (let i = 0; i < 5; i++) {
        fireEvent.keyDown(window, { key: 'ArrowDown' });
      }
      fireEvent.keyDown(window, { key: 'Enter' });

      expect(screen.getByText('EXIT TO MENU?')).toBeInTheDocument();
    });

    it('defaults to NO option in confirmation dialog', () => {
      render(<PauseMenu {...defaultProps} />);

      fireEvent.click(screen.getByRole('button', { name: /EXIT TO MENU/i }));

      const noButton = screen.getByRole('button', { name: /NO, CONTINUE/i });
      expect(noButton.textContent).toContain('▶');
    });

    it('calls onExitAction when confirming exit', () => {
      render(<PauseMenu {...defaultProps} />);

      fireEvent.click(screen.getByRole('button', { name: /EXIT TO MENU/i }));
      fireEvent.click(screen.getByRole('button', { name: /YES, EXIT/i }));

      expect(defaultProps.onExitAction).toHaveBeenCalledTimes(1);
    });

    it('returns to pause menu when canceling exit', () => {
      render(<PauseMenu {...defaultProps} />);

      fireEvent.click(screen.getByRole('button', { name: /EXIT TO MENU/i }));
      fireEvent.click(screen.getByRole('button', { name: /NO, CONTINUE/i }));

      expect(screen.getByText('PAUSED')).toBeInTheDocument();
      expect(screen.queryByText('EXIT TO MENU?')).not.toBeInTheDocument();
    });

    it('returns to pause menu on Escape from confirmation', () => {
      render(<PauseMenu {...defaultProps} />);

      fireEvent.click(screen.getByRole('button', { name: /EXIT TO MENU/i }));
      fireEvent.keyDown(window, { key: 'Escape' });

      expect(screen.getByText('PAUSED')).toBeInTheDocument();
    });

    it('confirms exit on Enter when YES is selected', () => {
      render(<PauseMenu {...defaultProps} />);

      fireEvent.click(screen.getByRole('button', { name: /EXIT TO MENU/i }));

      // Navigate to YES (index 0)
      fireEvent.keyDown(window, { key: 'ArrowUp' });
      fireEvent.keyDown(window, { key: 'Enter' });

      expect(defaultProps.onExitAction).toHaveBeenCalledTimes(1);
    });

    it('shows cancel hint in confirmation dialog', () => {
      render(<PauseMenu {...defaultProps} />);

      fireEvent.click(screen.getByRole('button', { name: /EXIT TO MENU/i }));

      expect(screen.getByText(/Navigate.*Enter Select.*Esc Cancel/)).toBeInTheDocument();
    });
  });

  describe('Load Confirmation', () => {
    it('shows confirmation dialog when LOAD is selected with Enter', () => {
      render(<PauseMenu {...defaultProps} />);

      fireEvent.keyDown(window, { key: 'ArrowDown' });
      fireEvent.keyDown(window, { key: 'ArrowDown' });
      fireEvent.keyDown(window, { key: 'Enter' });

      expect(screen.getByText('LOAD CHECKPOINT?')).toBeInTheDocument();
    });

    it('defaults to NO option in load confirmation dialog', () => {
      render(<PauseMenu {...defaultProps} />);

      fireEvent.click(screen.getByRole('button', { name: /LOAD CHECKPOINT/i }));

      const noButton = screen.getByRole('button', { name: /NO, CONTINUE/i });
      expect(noButton.textContent).toContain('▶');
    });

    it('calls onLoadAction when confirming load', () => {
      render(<PauseMenu {...defaultProps} />);

      fireEvent.click(screen.getByRole('button', { name: /LOAD CHECKPOINT/i }));
      fireEvent.click(screen.getByRole('button', { name: /YES, LOAD/i }));

      expect(defaultProps.onLoadAction).toHaveBeenCalledTimes(1);
    });

    it('returns to pause menu when canceling load', () => {
      render(<PauseMenu {...defaultProps} />);

      fireEvent.click(screen.getByRole('button', { name: /LOAD CHECKPOINT/i }));
      fireEvent.click(screen.getByRole('button', { name: /NO, CONTINUE/i }));

      expect(screen.getByText('PAUSED')).toBeInTheDocument();
      expect(screen.queryByText('LOAD CHECKPOINT?')).not.toBeInTheDocument();
    });

    it('returns to pause menu on Escape from load confirmation', () => {
      render(<PauseMenu {...defaultProps} />);

      fireEvent.click(screen.getByRole('button', { name: /LOAD CHECKPOINT/i }));
      fireEvent.keyDown(window, { key: 'Escape' });

      expect(screen.getByText('PAUSED')).toBeInTheDocument();
    });
  });

  describe('Mouse Interaction', () => {
    it('updates selection on mouse hover', () => {
      render(<PauseMenu {...defaultProps} />);

      const loadButton = screen.getByRole('button', { name: /LOAD CHECKPOINT/i });
      fireEvent.mouseEnter(loadButton);

      expect(loadButton.textContent).toContain('▶');
    });

    it('hides checkpoint loading when no checkpoint is available', () => {
      render(<PauseMenu {...defaultProps} canLoadAction={false} />);

      expect(screen.queryByRole('button', { name: /LOAD CHECKPOINT/i })).not.toBeInTheDocument();
    });

    it('updates selection on mouse hover in confirmation', () => {
      render(<PauseMenu {...defaultProps} />);

      fireEvent.click(screen.getByRole('button', { name: /EXIT TO MENU/i }));

      const yesButton = screen.getByRole('button', { name: /YES, EXIT/i });
      fireEvent.mouseEnter(yesButton);

      expect(yesButton.textContent).toContain('▶');
    });
  });
});
