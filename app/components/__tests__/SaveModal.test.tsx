import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import SaveModal from '../SaveModal';
import { GameState, DEFAULT_GAME_STATE } from '../../types';

// Mock the storage module
vi.mock('../../storage/saves', () => ({
  saveGame: vi.fn(),
}));

import { saveGame } from '../../storage/saves';

describe('SaveModal', () => {
  const createMockGameState = (overrides: Partial<GameState> = {}): GameState => ({
    ...DEFAULT_GAME_STATE,
    seed: 12345,
    rngState: 12345,
    sessionStartTime: Date.now(),
    currentPath: '/home/hackerkid',
    truthsDiscovered: new Set(['truth1', 'truth2']),
    detectionLevel: 25,
    ...overrides,
  });

  const defaultProps = {
    gameState: createMockGameState(),
    onCloseAction: vi.fn(),
    onSavedAction: vi.fn(),
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('Rendering', () => {
    it('renders the SAVE SESSION header', () => {
      render(<SaveModal {...defaultProps} />);

      expect(screen.getByText('SAVE SESSION')).toBeInTheDocument();
    });

    it('shows input field for session name', () => {
      render(<SaveModal {...defaultProps} />);

      expect(screen.getByRole('textbox')).toBeInTheDocument();
      expect(screen.getByText('Session Name (optional):')).toBeInTheDocument();
    });

    it('shows current game state info', () => {
      render(<SaveModal {...defaultProps} />);

      expect(screen.getByText('Current Path: /home/hackerkid')).toBeInTheDocument();
      expect(screen.getByText('Progress: 2/5 truths')).toBeInTheDocument();
    });

    it('shows SAVE and CANCEL buttons', () => {
      render(<SaveModal {...defaultProps} />);

      expect(screen.getByRole('button', { name: /SAVE/i })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /CANCEL/i })).toBeInTheDocument();
    });

    it('autofocuses the input field', () => {
      render(<SaveModal {...defaultProps} />);

      const input = screen.getByRole('textbox');
      expect(input).toHaveFocus();
    });
  });

  describe('Save Functionality', () => {
    it('calls saveGame with custom name when provided', () => {
      render(<SaveModal {...defaultProps} />);

      const input = screen.getByRole('textbox');
      fireEvent.change(input, { target: { value: 'My Save' } });

      fireEvent.click(screen.getByRole('button', { name: /SAVE/i }));

      expect(saveGame).toHaveBeenCalledWith(defaultProps.gameState, 'My Save');
      expect(defaultProps.onSavedAction).toHaveBeenCalledTimes(1);
    });

    it('calls saveGame with default name when input is empty', () => {
      render(<SaveModal {...defaultProps} />);

      fireEvent.click(screen.getByRole('button', { name: /SAVE/i }));

      expect(saveGame).toHaveBeenCalled();
      const callArgs = vi.mocked(saveGame).mock.calls[0];
      expect(callArgs[1]).toMatch(/^Session /);
      expect(defaultProps.onSavedAction).toHaveBeenCalledTimes(1);
    });

    it('trims whitespace from custom name', () => {
      render(<SaveModal {...defaultProps} />);

      const input = screen.getByRole('textbox');
      fireEvent.change(input, { target: { value: '  My Save  ' } });

      fireEvent.click(screen.getByRole('button', { name: /SAVE/i }));

      expect(saveGame).toHaveBeenCalledWith(defaultProps.gameState, 'My Save');
    });
  });

  describe('Close Functionality', () => {
    it('calls onCloseAction when CANCEL is clicked', () => {
      render(<SaveModal {...defaultProps} />);

      fireEvent.click(screen.getByRole('button', { name: /CANCEL/i }));

      expect(defaultProps.onCloseAction).toHaveBeenCalledTimes(1);
    });

    it('calls onCloseAction on Escape key', () => {
      render(<SaveModal {...defaultProps} />);

      fireEvent.keyDown(window, { key: 'Escape' });

      expect(defaultProps.onCloseAction).toHaveBeenCalledTimes(1);
    });

    it('calls onCloseAction when clicking overlay background', () => {
      const { container } = render(<SaveModal {...defaultProps} />);

      // Click the overlay directly
      const overlay = container.querySelector('[class*="overlay"]');
      fireEvent.click(overlay!);

      expect(defaultProps.onCloseAction).toHaveBeenCalledTimes(1);
    });

    it('does not close when clicking inside modal', () => {
      render(<SaveModal {...defaultProps} />);

      const modal = screen.getByText('SAVE SESSION').parentElement;
      fireEvent.click(modal!);

      expect(defaultProps.onCloseAction).not.toHaveBeenCalled();
    });
  });

  describe('Game State Display', () => {
    it('displays correct truth count', () => {
      const gameState = createMockGameState({
        truthsDiscovered: new Set(['t1', 't2', 't3', 't4']),
      });

      render(<SaveModal {...defaultProps} gameState={gameState} />);

      expect(screen.getByText('Progress: 4/5 truths')).toBeInTheDocument();
    });

    it('displays correct path', () => {
      const gameState = createMockGameState({
        currentPath: '/var/logs/system',
      });

      render(<SaveModal {...defaultProps} gameState={gameState} />);

      expect(screen.getByText('Current Path: /var/logs/system')).toBeInTheDocument();
    });
  });
});
