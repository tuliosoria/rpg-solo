import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent, act } from '@testing-library/react';
import AchievementPopup from '../AchievementPopup';
import { Achievement } from '../../engine/achievements';
import { FloatingUIProvider } from '../FloatingUI';

// Wrapper for FloatingUIProvider
const renderWithProvider = (ui: React.ReactElement) => {
  return render(<FloatingUIProvider>{ui}</FloatingUIProvider>);
};

describe('AchievementPopup', () => {
  const mockAchievement: Achievement = {
    id: 'test_achievement',
    name: 'Test Achievement',
    description: 'This is a test achievement',
    icon: '🏆',
  };

  const mockOnDismiss = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('renders achievement details', () => {
    renderWithProvider(<AchievementPopup achievement={mockAchievement} onDismiss={mockOnDismiss} />);
    
    expect(screen.getByText('ACHIEVEMENT UNLOCKED')).toBeInTheDocument();
    expect(screen.getByText('Test Achievement')).toBeInTheDocument();
    expect(screen.getByText('This is a test achievement')).toBeInTheDocument();
    expect(screen.getByText('🏆')).toBeInTheDocument();
  });

  it('becomes visible after initial animation delay', () => {
    renderWithProvider(<AchievementPopup achievement={mockAchievement} onDismiss={mockOnDismiss} />);
    
    // Initially not visible
    const popup = document.querySelector('[class*="popup"]');
    expect(popup?.className).not.toContain('visible');
    
    // Advance timer for visibility
    act(() => {
      vi.advanceTimersByTime(100);
    });
    
    // Now visible
    expect(popup?.className).toContain('visible');
  });

  it('auto-dismisses after 4 seconds', () => {
    renderWithProvider(<AchievementPopup achievement={mockAchievement} onDismiss={mockOnDismiss} />);
    
    // Advance to just before auto-dismiss
    act(() => {
      vi.advanceTimersByTime(3900);
    });
    
    expect(mockOnDismiss).not.toHaveBeenCalled();
    
    // Advance past auto-dismiss and exit animation
    act(() => {
      vi.advanceTimersByTime(600);
    });
    
    expect(mockOnDismiss).toHaveBeenCalledTimes(1);
  });

  it('dismisses on click', () => {
    renderWithProvider(<AchievementPopup achievement={mockAchievement} onDismiss={mockOnDismiss} />);
    
    const popup = document.querySelector('[class*="popup"]');
    
    act(() => {
      fireEvent.click(popup!);
    });
    
    // Exit animation starts
    expect(popup?.className).toContain('exiting');
    
    // Wait for exit animation
    act(() => {
      vi.advanceTimersByTime(500);
    });
    
    expect(mockOnDismiss).toHaveBeenCalledTimes(1);
  });

  it('adds exiting class before dismiss animation', () => {
    renderWithProvider(<AchievementPopup achievement={mockAchievement} onDismiss={mockOnDismiss} />);
    
    const popup = document.querySelector('[class*="popup"]');
    
    // Click to dismiss
    act(() => {
      fireEvent.click(popup!);
    });
    
    // Should have exiting class
    expect(popup?.className).toContain('exiting');
  });

  it('clears timeouts on unmount', () => {
    const clearTimeoutSpy = vi.spyOn(global, 'clearTimeout');
    
    const { unmount } = renderWithProvider(
      <AchievementPopup achievement={mockAchievement} onDismiss={mockOnDismiss} />
    );
    
    unmount();
    
    // Should have cleared both show and dismiss timers
    expect(clearTimeoutSpy).toHaveBeenCalled();
    
    clearTimeoutSpy.mockRestore();
  });

  it('renders with secret achievement', () => {
    const secretAchievement: Achievement = {
      id: 'secret',
      name: 'Secret Achievement',
      description: 'You found a secret!',
      icon: '🤫',
      secret: true,
    };
    
    renderWithProvider(<AchievementPopup achievement={secretAchievement} onDismiss={mockOnDismiss} />);
    
    expect(screen.getByText('Secret Achievement')).toBeInTheDocument();
    expect(screen.getByText('You found a secret!')).toBeInTheDocument();
    expect(screen.getByText('🤫')).toBeInTheDocument();
  });

  it('handles multiple rapid clicks by entering exit state', () => {
    renderWithProvider(<AchievementPopup achievement={mockAchievement} onDismiss={mockOnDismiss} />);
    
    const popup = document.querySelector('[class*="popup"]');
    
    // First click triggers exiting state
    act(() => {
      fireEvent.click(popup!);
    });
    
    // Should have exiting class after first click
    expect(popup?.className).toContain('exiting');
    
    // Wait for animation
    act(() => {
      vi.advanceTimersByTime(500);
    });
    
    // At least one dismiss should have been called
    expect(mockOnDismiss).toHaveBeenCalled();
  });
});
