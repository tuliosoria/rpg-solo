import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import AchievementGallery from '../AchievementGallery';

// Mock the achievements module
vi.mock('../../engine/achievements', () => ({
  ACHIEVEMENTS: [
    {
      id: 'speed_demon',
      name: 'Speed Demon',
      description: 'Complete the game in under 50 commands',
      icon: '⚡',
    },
    {
      id: 'ghost',
      name: 'Ghost Protocol',
      description: 'Win with detection level under 20%',
      icon: '👻',
    },
    {
      id: 'secret_achievement',
      name: 'Hidden',
      description: 'Secret description',
      icon: '🔒',
      secret: true,
    },
  ],
  getUnlockedAchievements: vi.fn(),
}));

import { getUnlockedAchievements } from '../../engine/achievements';

describe('AchievementGallery', () => {
  const mockOnClose = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders the achievement gallery header', () => {
    vi.mocked(getUnlockedAchievements).mockReturnValue(new Set());
    
    render(<AchievementGallery onCloseAction={mockOnClose} />);
    
    expect(screen.getByText('ACHIEVEMENTS')).toBeInTheDocument();
  });

  it('displays progress count correctly with no unlocks', () => {
    vi.mocked(getUnlockedAchievements).mockReturnValue(new Set());
    
    render(<AchievementGallery onCloseAction={mockOnClose} />);
    
    expect(screen.getByText('0 / 3 Unlocked')).toBeInTheDocument();
  });

  it('displays progress count correctly with some unlocks', () => {
    vi.mocked(getUnlockedAchievements).mockReturnValue(new Set(['speed_demon', 'ghost']));
    
    render(<AchievementGallery onCloseAction={mockOnClose} />);
    
    expect(screen.getByText('2 / 3 Unlocked')).toBeInTheDocument();
  });

  it('displays unlocked achievements with their details', () => {
    vi.mocked(getUnlockedAchievements).mockReturnValue(new Set(['speed_demon']));
    
    render(<AchievementGallery onCloseAction={mockOnClose} />);
    
    expect(screen.getByText('Speed Demon')).toBeInTheDocument();
    expect(screen.getByText('Complete the game in under 50 commands')).toBeInTheDocument();
    expect(screen.getByText('⚡')).toBeInTheDocument();
  });

  it('displays locked achievements with their details', () => {
    vi.mocked(getUnlockedAchievements).mockReturnValue(new Set());
    
    render(<AchievementGallery onCloseAction={mockOnClose} />);
    
    expect(screen.getByText('Ghost Protocol')).toBeInTheDocument();
    expect(screen.getByText('Win with detection level under 20%')).toBeInTheDocument();
  });

  it('hides secret achievement details when locked', () => {
    vi.mocked(getUnlockedAchievements).mockReturnValue(new Set());
    
    render(<AchievementGallery onCloseAction={mockOnClose} />);
    
    // Secret achievement should show ??? and be hidden
    expect(screen.getByText('???')).toBeInTheDocument();
    expect(screen.getByText('Secret achievement')).toBeInTheDocument();
    expect(screen.getByText('🔒')).toBeInTheDocument();
    
    // Real name should not be shown
    expect(screen.queryByText('Hidden')).not.toBeInTheDocument();
  });

  it('shows secret achievement details when unlocked', () => {
    vi.mocked(getUnlockedAchievements).mockReturnValue(new Set(['secret_achievement']));
    
    render(<AchievementGallery onCloseAction={mockOnClose} />);
    
    // When unlocked, secret achievement shows real info
    expect(screen.getByText('Hidden')).toBeInTheDocument();
    expect(screen.getByText('Secret description')).toBeInTheDocument();
    expect(screen.queryByText('???')).not.toBeInTheDocument();
  });

  it('calls onCloseAction when close button is clicked', () => {
    vi.mocked(getUnlockedAchievements).mockReturnValue(new Set());
    
    render(<AchievementGallery onCloseAction={mockOnClose} />);
    
    const closeButton = screen.getByText('[ CLOSE ]');
    fireEvent.click(closeButton);
    
    expect(mockOnClose).toHaveBeenCalledTimes(1);
  });

  it('calls onCloseAction when overlay background is clicked', () => {
    vi.mocked(getUnlockedAchievements).mockReturnValue(new Set());
    
    render(<AchievementGallery onCloseAction={mockOnClose} />);
    
    // Click on the overlay (first element with overlay class)
    const overlay = document.querySelector('[class*="overlay"]');
    fireEvent.click(overlay!);
    
    expect(mockOnClose).toHaveBeenCalledTimes(1);
  });

  it('does not call onCloseAction when modal content is clicked', () => {
    vi.mocked(getUnlockedAchievements).mockReturnValue(new Set());
    
    render(<AchievementGallery onCloseAction={mockOnClose} />);
    
    // Click on the modal (not overlay)
    const modal = document.querySelector('[class*="modal"]');
    fireEvent.click(modal!);
    
    expect(mockOnClose).not.toHaveBeenCalled();
  });

  it('applies correct CSS classes for unlocked achievements', () => {
    vi.mocked(getUnlockedAchievements).mockReturnValue(new Set(['speed_demon']));
    
    render(<AchievementGallery onCloseAction={mockOnClose} />);
    
    // Check that there's an element with the unlocked class
    const unlockedAchievement = document.querySelector('[class*="unlocked"]');
    expect(unlockedAchievement).toBeInTheDocument();
  });

  it('applies correct CSS classes for locked achievements', () => {
    vi.mocked(getUnlockedAchievements).mockReturnValue(new Set());
    
    render(<AchievementGallery onCloseAction={mockOnClose} />);
    
    // Check that there's an element with the locked class
    const lockedAchievement = document.querySelector('[class*="locked"]');
    expect(lockedAchievement).toBeInTheDocument();
  });

  it('renders all achievements in the grid', () => {
    vi.mocked(getUnlockedAchievements).mockReturnValue(new Set());
    
    render(<AchievementGallery onCloseAction={mockOnClose} />);
    
    // Should have 3 achievement items (even if some show as ???)
    const achievements = document.querySelectorAll('[class*="achievement"]');
    // Filter out the overall achievement class that might be on the container
    const achievementItems = Array.from(achievements).filter(
      el => !el.classList.toString().includes('Gallery')
    );
    expect(achievementItems.length).toBeGreaterThanOrEqual(3);
  });
});
