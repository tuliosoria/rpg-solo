import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import SettingsModal from '../SettingsModal';

describe('SettingsModal', () => {
  const defaultProps = {
    soundEnabled: true,
    masterVolume: 0.5,
    onToggleSound: vi.fn(),
    onVolumeChange: vi.fn(),
    onCloseAction: vi.fn(),
  };

  let mockStorage: Record<string, string>;
  let originalLocalStorage: Storage;

  beforeEach(() => {
    vi.clearAllMocks();
    mockStorage = {};
    originalLocalStorage = window.localStorage;
    
    // Create a mock localStorage object
    const localStorageMock = {
      getItem: vi.fn((key: string) => mockStorage[key] ?? null),
      setItem: vi.fn((key: string, value: string) => { mockStorage[key] = value; }),
      removeItem: vi.fn((key: string) => { delete mockStorage[key]; }),
      clear: vi.fn(() => { mockStorage = {}; }),
      length: 0,
      key: vi.fn(() => null),
    };
    
    Object.defineProperty(window, 'localStorage', {
      value: localStorageMock,
      writable: true,
      configurable: true,
    });
    
    // Reset document.body.classList
    document.body.classList.remove('no-crt');
  });

  afterEach(() => {
    Object.defineProperty(window, 'localStorage', {
      value: originalLocalStorage,
      writable: true,
      configurable: true,
    });
    vi.restoreAllMocks();
    document.body.classList.remove('no-crt');
  });

  it('renders the settings modal header', () => {
    render(<SettingsModal {...defaultProps} />);
    
    expect(screen.getByText('SETTINGS')).toBeInTheDocument();
  });

  it('displays sound enabled toggle in ON state', () => {
    render(<SettingsModal {...defaultProps} soundEnabled={true} />);
    
    const soundLabel = screen.getByText('Sound Effects');
    const soundRow = soundLabel.closest('[class*="setting"]');
    const soundToggle = soundRow?.querySelector('button');
    expect(soundToggle?.textContent).toBe('[ ON ]');
  });

  it('displays sound disabled toggle in OFF state', () => {
    render(<SettingsModal {...defaultProps} soundEnabled={false} />);
    
    const soundLabel = screen.getByText('Sound Effects');
    const soundRow = soundLabel.closest('[class*="setting"]');
    const soundToggle = soundRow?.querySelector('button');
    expect(soundToggle?.textContent).toBe('[ OFF ]');
  });

  it('calls onToggleSound when sound toggle is clicked', () => {
    render(<SettingsModal {...defaultProps} />);
    
    // There are multiple toggles, find the one in the Sound Effects row
    const soundLabel = screen.getByText('Sound Effects');
    const soundRow = soundLabel.closest('[class*="setting"]');
    const soundToggle = soundRow?.querySelector('button');
    
    fireEvent.click(soundToggle!);
    
    expect(defaultProps.onToggleSound).toHaveBeenCalledTimes(1);
  });

  it('displays volume slider with correct value', () => {
    render(<SettingsModal {...defaultProps} masterVolume={0.75} />);
    
    expect(screen.getByText('75%')).toBeInTheDocument();
  });

  it('calls onVolumeChange when slider is changed', () => {
    render(<SettingsModal {...defaultProps} />);
    
    const slider = screen.getByRole('slider');
    fireEvent.change(slider, { target: { value: '80' } });
    
    expect(defaultProps.onVolumeChange).toHaveBeenCalledWith(0.8);
  });

  it('disables volume slider when sound is disabled', () => {
    render(<SettingsModal {...defaultProps} soundEnabled={false} />);
    
    const slider = screen.getByRole('slider');
    expect(slider).toBeDisabled();
  });

  it('enables volume slider when sound is enabled', () => {
    render(<SettingsModal {...defaultProps} soundEnabled={true} />);
    
    const slider = screen.getByRole('slider');
    expect(slider).not.toBeDisabled();
  });

  it('displays CRT effects toggle', () => {
    render(<SettingsModal {...defaultProps} />);
    
    expect(screen.getByText('CRT Effects')).toBeInTheDocument();
  });

  it('loads CRT preference from localStorage on mount', async () => {
    mockStorage['varginha_crt_enabled'] = 'false';
    
    render(<SettingsModal {...defaultProps} />);
    
    // Wait for useEffect to run
    await waitFor(() => {
      const crtLabel = screen.getByText('CRT Effects');
      const crtRow = crtLabel.closest('[class*="setting"]');
      const crtToggle = crtRow?.querySelector('button');
      expect(crtToggle?.textContent).toBe('[ OFF ]');
    });
  });

  it('toggles CRT effects and saves to localStorage', async () => {
    render(<SettingsModal {...defaultProps} />);
    
    const crtLabel = screen.getByText('CRT Effects');
    const crtRow = crtLabel.closest('[class*="setting"]');
    const crtToggle = crtRow?.querySelector('button');
    
    // Initially ON (default state)
    expect(crtToggle?.textContent).toBe('[ ON ]');
    
    // Click to toggle OFF
    fireEvent.click(crtToggle!);
    
    await waitFor(() => {
      expect(crtToggle?.textContent).toBe('[ OFF ]');
    });
    expect(mockStorage['varginha_crt_enabled']).toBe('false');
  });

  it('adds no-crt class to body when CRT is disabled', async () => {
    render(<SettingsModal {...defaultProps} />);
    
    const crtLabel = screen.getByText('CRT Effects');
    const crtRow = crtLabel.closest('[class*="setting"]');
    const crtToggle = crtRow?.querySelector('button');
    
    // Toggle CRT off
    fireEvent.click(crtToggle!);
    
    await waitFor(() => {
      expect(document.body.classList.contains('no-crt')).toBe(true);
    });
  });

  it('removes no-crt class from body when CRT is enabled', async () => {
    document.body.classList.add('no-crt');
    mockStorage['varginha_crt_enabled'] = 'false';
    
    render(<SettingsModal {...defaultProps} />);
    
    // Wait for useEffect to load the OFF state
    await waitFor(() => {
      const crtLabel = screen.getByText('CRT Effects');
      const crtRow = crtLabel.closest('[class*="setting"]');
      const crtToggle = crtRow?.querySelector('button');
      expect(crtToggle?.textContent).toBe('[ OFF ]');
    });
    
    const crtLabel = screen.getByText('CRT Effects');
    const crtRow = crtLabel.closest('[class*="setting"]');
    const crtToggle = crtRow?.querySelector('button');
    
    // Toggle CRT on
    fireEvent.click(crtToggle!);
    
    await waitFor(() => {
      expect(document.body.classList.contains('no-crt')).toBe(false);
    });
  });

  it('displays keyboard shortcuts info', () => {
    render(<SettingsModal {...defaultProps} />);
    
    expect(screen.getByText('Keyboard Shortcuts:')).toBeInTheDocument();
    expect(screen.getByText(/Command history/)).toBeInTheDocument();
    expect(screen.getByText(/Autocomplete/)).toBeInTheDocument();
    expect(screen.getByText(/Close overlays/)).toBeInTheDocument();
  });

  it('calls onCloseAction when close button is clicked', () => {
    render(<SettingsModal {...defaultProps} />);
    
    const closeButton = screen.getByText('[ CLOSE ]');
    fireEvent.click(closeButton);
    
    expect(defaultProps.onCloseAction).toHaveBeenCalledTimes(1);
  });

  it('calls onCloseAction when overlay background is clicked', () => {
    render(<SettingsModal {...defaultProps} />);
    
    const overlay = document.querySelector('[class*="overlay"]');
    fireEvent.click(overlay!);
    
    expect(defaultProps.onCloseAction).toHaveBeenCalledTimes(1);
  });

  it('does not call onCloseAction when modal content is clicked', () => {
    render(<SettingsModal {...defaultProps} />);
    
    const modal = document.querySelector('[class*="modal"]');
    fireEvent.click(modal!);
    
    expect(defaultProps.onCloseAction).not.toHaveBeenCalled();
  });

  it('displays scanlines hint for CRT effects', () => {
    render(<SettingsModal {...defaultProps} />);
    
    expect(screen.getByText('Scanlines & glow')).toBeInTheDocument();
  });

  it('handles localStorage being unavailable', () => {
    const localStorageMock = {
      getItem: vi.fn(() => { throw new Error('localStorage not available'); }),
      setItem: vi.fn(() => { throw new Error('localStorage not available'); }),
      removeItem: vi.fn(),
      clear: vi.fn(),
      length: 0,
      key: vi.fn(),
    };
    
    Object.defineProperty(window, 'localStorage', {
      value: localStorageMock,
      writable: true,
      configurable: true,
    });
    
    // Should not throw
    expect(() => render(<SettingsModal {...defaultProps} />)).not.toThrow();
  });
});
