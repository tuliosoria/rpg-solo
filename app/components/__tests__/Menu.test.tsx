import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import Menu from '../Menu';

// Mock the storage module
vi.mock('../../storage/saves', () => ({
  getSaveSlots: vi.fn(() => []),
  deleteSave: vi.fn(),
}));

import { getSaveSlots, deleteSave } from '../../storage/saves';

describe('Menu', () => {
  const defaultProps = {
    onNewGameAction: vi.fn(),
    onLoadGameAction: vi.fn(),
  };

  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(getSaveSlots).mockReturnValue([]);
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('Main Menu', () => {
    it('renders the game title', () => {
      render(<Menu {...defaultProps} />);

      expect(screen.getByText('VARGINHA')).toBeInTheDocument();
      expect(screen.getByText('TERMINAL 1996')).toBeInTheDocument();
    });

    it('renders all main menu buttons', () => {
      render(<Menu {...defaultProps} />);

      expect(screen.getByRole('button', { name: /NEW GAME/i })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /LOAD GAME/i })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /CREDITS/i })).toBeInTheDocument();
    });

    it('calls onNewGameAction when NEW GAME is clicked', () => {
      render(<Menu {...defaultProps} />);

      fireEvent.click(screen.getByRole('button', { name: /NEW GAME/i }));

      expect(defaultProps.onNewGameAction).toHaveBeenCalledTimes(1);
    });

    it('navigates to load screen when LOAD GAME is clicked', () => {
      render(<Menu {...defaultProps} />);

      fireEvent.click(screen.getByRole('button', { name: /LOAD GAME/i }));

      expect(screen.getByText('SAVED SESSIONS')).toBeInTheDocument();
    });

    it('navigates to credits screen when CREDITS is clicked', () => {
      render(<Menu {...defaultProps} />);

      fireEvent.click(screen.getByRole('button', { name: /CREDITS/i }));

      expect(screen.getByText('CREDITS')).toBeInTheDocument();
      expect(screen.getByText(/The Varginha Incident/)).toBeInTheDocument();
    });

    it('shows keyboard navigation hint', () => {
      render(<Menu {...defaultProps} />);

      expect(screen.getByText(/Navigate.*Enter Select/)).toBeInTheDocument();
    });
  });

  describe('Keyboard Navigation', () => {
    it('selects next item on ArrowDown', () => {
      render(<Menu {...defaultProps} />);

      // Initially NEW GAME is selected
      const newGameButton = screen.getByRole('button', { name: /NEW GAME/i });
      expect(newGameButton.textContent).toContain('▶');

      // Press down arrow
      fireEvent.keyDown(window, { key: 'ArrowDown' });

      // Now LOAD GAME should be selected
      const loadGameButton = screen.getByRole('button', { name: /LOAD GAME/i });
      expect(loadGameButton.textContent).toContain('▶');
    });

    it('selects previous item on ArrowUp', () => {
      render(<Menu {...defaultProps} />);

      // Press down twice to get to CREDITS
      fireEvent.keyDown(window, { key: 'ArrowDown' });
      fireEvent.keyDown(window, { key: 'ArrowDown' });

      // Press up to go back to LOAD GAME
      fireEvent.keyDown(window, { key: 'ArrowUp' });

      const loadGameButton = screen.getByRole('button', { name: /LOAD GAME/i });
      expect(loadGameButton.textContent).toContain('▶');
    });

    it('wraps around when at the end', () => {
      render(<Menu {...defaultProps} />);

      // Press down 3 times to wrap around
      fireEvent.keyDown(window, { key: 'ArrowDown' });
      fireEvent.keyDown(window, { key: 'ArrowDown' });
      fireEvent.keyDown(window, { key: 'ArrowDown' });

      // Should wrap to NEW GAME
      const newGameButton = screen.getByRole('button', { name: /NEW GAME/i });
      expect(newGameButton.textContent).toContain('▶');
    });

    it('activates selected item on Enter', () => {
      render(<Menu {...defaultProps} />);

      // NEW GAME is selected by default
      fireEvent.keyDown(window, { key: 'Enter' });

      expect(defaultProps.onNewGameAction).toHaveBeenCalledTimes(1);
    });

    it('navigates to LOAD GAME on Enter when selected', () => {
      render(<Menu {...defaultProps} />);

      fireEvent.keyDown(window, { key: 'ArrowDown' });
      fireEvent.keyDown(window, { key: 'Enter' });

      expect(screen.getByText('SAVED SESSIONS')).toBeInTheDocument();
    });
  });

  describe('Load Screen', () => {
    it('shows no saves message when empty', () => {
      vi.mocked(getSaveSlots).mockReturnValue([]);
      render(<Menu {...defaultProps} />);

      fireEvent.click(screen.getByRole('button', { name: /LOAD GAME/i }));

      expect(screen.getByText('No saved sessions found.')).toBeInTheDocument();
    });

    it('shows save slots when available', () => {
      vi.mocked(getSaveSlots).mockReturnValue([
        {
          id: 'save-1',
          name: 'Test Save',
          timestamp: Date.now(),
          currentPath: '/home/hackerkid',
          truthCount: 3,
          detectionLevel: 45,
        },
      ]);

      render(<Menu {...defaultProps} />);

      fireEvent.click(screen.getByRole('button', { name: /LOAD GAME/i }));

      expect(screen.getByText('Test Save')).toBeInTheDocument();
      expect(screen.getByText(/Progress: 3\/5/)).toBeInTheDocument();
      expect(screen.getByText(/Risk: 45%/)).toBeInTheDocument();
    });

    it('calls onLoadGameAction when save slot is clicked', () => {
      vi.mocked(getSaveSlots).mockReturnValue([
        {
          id: 'save-1',
          name: 'Test Save',
          timestamp: Date.now(),
          currentPath: '/home/hackerkid',
          truthCount: 3,
          detectionLevel: 45,
        },
      ]);

      render(<Menu {...defaultProps} />);

      fireEvent.click(screen.getByRole('button', { name: /LOAD GAME/i }));
      fireEvent.click(screen.getByText('Test Save'));

      expect(defaultProps.onLoadGameAction).toHaveBeenCalledWith('save-1');
    });

    it('shows delete button on save slots', () => {
      vi.mocked(getSaveSlots).mockReturnValue([
        {
          id: 'save-1',
          name: 'Test Save',
          timestamp: Date.now(),
          currentPath: '/home/hackerkid',
          truthCount: 3,
          detectionLevel: 45,
        },
      ]);

      render(<Menu {...defaultProps} />);

      fireEvent.click(screen.getByRole('button', { name: /LOAD GAME/i }));

      expect(screen.getByText('[X]')).toBeInTheDocument();
    });

    it('deletes save on confirm', () => {
      vi.mocked(getSaveSlots).mockReturnValue([
        {
          id: 'save-1',
          name: 'Test Save',
          timestamp: Date.now(),
          currentPath: '/home/hackerkid',
          truthCount: 3,
          detectionLevel: 45,
        },
      ]);

      // Mock window.confirm
      const confirmSpy = vi.spyOn(window, 'confirm').mockReturnValue(true);

      render(<Menu {...defaultProps} />);

      fireEvent.click(screen.getByRole('button', { name: /LOAD GAME/i }));
      fireEvent.click(screen.getByText('[X]'));

      expect(confirmSpy).toHaveBeenCalledWith('Delete this save?');
      expect(deleteSave).toHaveBeenCalledWith('save-1');

      confirmSpy.mockRestore();
    });

    it('returns to main menu on BACK click', () => {
      render(<Menu {...defaultProps} />);

      fireEvent.click(screen.getByRole('button', { name: /LOAD GAME/i }));
      fireEvent.click(screen.getByRole('button', { name: /BACK/i }));

      expect(screen.getByText('VARGINHA')).toBeInTheDocument();
    });

    it('returns to main menu on Escape', () => {
      render(<Menu {...defaultProps} />);

      fireEvent.click(screen.getByRole('button', { name: /LOAD GAME/i }));
      fireEvent.keyDown(window, { key: 'Escape' });

      expect(screen.getByText('VARGINHA')).toBeInTheDocument();
    });
  });

  describe('Credits Screen', () => {
    it('shows game information', () => {
      render(<Menu {...defaultProps} />);

      fireEvent.click(screen.getByRole('button', { name: /CREDITS/i }));

      expect(screen.getByText('VARGINHA: TERMINAL 1996')).toBeInTheDocument();
      expect(screen.getByText('Procedural Horror / Ufology / Hard Sci-Fi')).toBeInTheDocument();
    });

    it('returns to main menu on BACK click', () => {
      render(<Menu {...defaultProps} />);

      fireEvent.click(screen.getByRole('button', { name: /CREDITS/i }));
      fireEvent.click(screen.getByRole('button', { name: /BACK/i }));

      expect(screen.getByRole('button', { name: /NEW GAME/i })).toBeInTheDocument();
    });

    it('returns to main menu on Escape', () => {
      render(<Menu {...defaultProps} />);

      fireEvent.click(screen.getByRole('button', { name: /CREDITS/i }));
      fireEvent.keyDown(window, { key: 'Escape' });

      expect(screen.getByRole('button', { name: /NEW GAME/i })).toBeInTheDocument();
    });
  });

  describe('Mouse Interaction', () => {
    it('updates selection on mouse hover', () => {
      render(<Menu {...defaultProps} />);

      const loadGameButton = screen.getByRole('button', { name: /LOAD GAME/i });
      fireEvent.mouseEnter(loadGameButton);

      expect(loadGameButton.textContent).toContain('▶');
    });
  });

  describe('Detection Level Styling', () => {
    it('shows critical risk style for high detection', () => {
      vi.mocked(getSaveSlots).mockReturnValue([
        {
          id: 'save-1',
          name: 'High Risk Save',
          timestamp: Date.now(),
          currentPath: '/home/hackerkid',
          truthCount: 4,
          detectionLevel: 85,
        },
      ]);

      render(<Menu {...defaultProps} />);

      fireEvent.click(screen.getByRole('button', { name: /LOAD GAME/i }));

      const riskText = screen.getByText(/Risk: 85%/);
      expect(riskText.className).toContain('riskCritical');
    });

    it('shows high risk style for medium-high detection', () => {
      vi.mocked(getSaveSlots).mockReturnValue([
        {
          id: 'save-1',
          name: 'Medium Risk Save',
          timestamp: Date.now(),
          currentPath: '/home/hackerkid',
          truthCount: 2,
          detectionLevel: 65,
        },
      ]);

      render(<Menu {...defaultProps} />);

      fireEvent.click(screen.getByRole('button', { name: /LOAD GAME/i }));

      const riskText = screen.getByText(/Risk: 65%/);
      expect(riskText.className).toContain('riskHigh');
    });

    it('shows low risk style for low detection', () => {
      vi.mocked(getSaveSlots).mockReturnValue([
        {
          id: 'save-1',
          name: 'Low Risk Save',
          timestamp: Date.now(),
          currentPath: '/home/hackerkid',
          truthCount: 1,
          detectionLevel: 25,
        },
      ]);

      render(<Menu {...defaultProps} />);

      fireEvent.click(screen.getByRole('button', { name: /LOAD GAME/i }));

      const riskText = screen.getByText(/Risk: 25%/);
      expect(riskText.className).toContain('riskLow');
    });
  });
});
