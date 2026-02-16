import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, act } from '@testing-library/react';
import FirewallEyes, {
  DETECTION_THRESHOLD,
  SPAWN_COOLDOWN_MS,
  FIREWALL_EYE_BATCH_SIZES,
  FIREWALL_EYE_BATCH_THRESHOLDS,
  getFirewallEyeBatchSize,
} from '../FirewallEyes';
import type { FirewallEye } from '../../types';

describe('FirewallEyes', () => {
  const baseProps = {
    detectionLevel: 0,
    firewallActive: false,
    firewallDisarmed: false,
    eyes: [] as FirewallEye[],
    lastEyeSpawnTime: 0,
    paused: false,
    turingTestActive: false,
    isReadingFile: false,
    firewallEyesTutorialShown: true, // Skip tutorial in tests
    onEyeClick: vi.fn(),
    onEyeDetonate: vi.fn(),
    onSpawnEyeBatch: vi.fn(),
    onActivateFirewall: vi.fn(),
    onPauseChanged: vi.fn(),
    onTutorialShown: vi.fn(),
  };

  beforeEach(() => {
    vi.clearAllMocks();
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2026-01-01T00:00:00.000Z'));
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('activates the firewall when detection reaches the threshold', () => {
    const onActivateFirewall = vi.fn();

    render(
      <FirewallEyes
        {...baseProps}
        detectionLevel={DETECTION_THRESHOLD}
        onActivateFirewall={onActivateFirewall}
      />
    );

    expect(onActivateFirewall).toHaveBeenCalledTimes(1);
  });

  it('spawns an eye batch once the cooldown has elapsed', () => {
    const onSpawnEyeBatch = vi.fn();
    const now = Date.now();

    render(
      <FirewallEyes
        {...baseProps}
        firewallActive={true}
        lastEyeSpawnTime={now - SPAWN_COOLDOWN_MS - 1}
        onSpawnEyeBatch={onSpawnEyeBatch}
      />
    );

    act(() => {
      vi.runOnlyPendingTimers();
    });

    expect(onSpawnEyeBatch).toHaveBeenCalledTimes(1);
  });

  it('enforces the 90-second cooldown between spawn batches', () => {
    const onSpawnEyeBatch = vi.fn();
    const now = Date.now();

    render(
      <FirewallEyes
        {...baseProps}
        firewallActive={true}
        lastEyeSpawnTime={now}
        onSpawnEyeBatch={onSpawnEyeBatch}
      />
    );

    act(() => {
      vi.advanceTimersByTime(SPAWN_COOLDOWN_MS - 1);
    });

    expect(onSpawnEyeBatch).not.toHaveBeenCalled();

    act(() => {
      vi.advanceTimersByTime(1);
    });

    expect(onSpawnEyeBatch).toHaveBeenCalledTimes(1);
  });

  it('stops spawning while the Turing Test is active', () => {
    const onSpawnEyeBatch = vi.fn();
    const now = Date.now();

    render(
      <FirewallEyes
        {...baseProps}
        firewallActive={true}
        paused={true}
        lastEyeSpawnTime={now - SPAWN_COOLDOWN_MS - 1}
        onSpawnEyeBatch={onSpawnEyeBatch}
      />
    );

    act(() => {
      vi.advanceTimersByTime(SPAWN_COOLDOWN_MS);
    });

    expect(onSpawnEyeBatch).not.toHaveBeenCalled();
  });

  it('resumes spawning after the Turing Test completes', () => {
    const onSpawnEyeBatch = vi.fn();
    const now = Date.now();
    const lastEyeSpawnTime = now - (SPAWN_COOLDOWN_MS - 1000);

    const { rerender } = render(
      <FirewallEyes
        {...baseProps}
        firewallActive={true}
        paused={true}
        lastEyeSpawnTime={lastEyeSpawnTime}
        onSpawnEyeBatch={onSpawnEyeBatch}
      />
    );

    rerender(
      <FirewallEyes
        {...baseProps}
        firewallActive={true}
        paused={false}
        lastEyeSpawnTime={lastEyeSpawnTime}
        onSpawnEyeBatch={onSpawnEyeBatch}
      />
    );

    act(() => {
      vi.advanceTimersByTime(999);
    });

    expect(onSpawnEyeBatch).not.toHaveBeenCalled();

    act(() => {
      vi.advanceTimersByTime(1);
    });

    expect(onSpawnEyeBatch).toHaveBeenCalledTimes(1);
  });

  it('does not spawn when the firewall is disarmed', () => {
    const onSpawnEyeBatch = vi.fn();
    const now = Date.now();

    render(
      <FirewallEyes
        {...baseProps}
        firewallActive={true}
        firewallDisarmed={true}
        lastEyeSpawnTime={now - SPAWN_COOLDOWN_MS - 1}
        onSpawnEyeBatch={onSpawnEyeBatch}
      />
    );

    act(() => {
      vi.advanceTimersByTime(SPAWN_COOLDOWN_MS);
    });

    expect(onSpawnEyeBatch).not.toHaveBeenCalled();
  });

  it('detonates eyes when their timers expire', () => {
    const onEyeDetonate = vi.fn();
    const now = Date.now();
    const eyes: FirewallEye[] = [
      {
        id: 'eye-1',
        x: 50,
        y: 40,
        spawnTime: now,
        detonateTime: now + 1000,
        isDetonating: false,
      },
    ];

    render(
      <FirewallEyes
        {...baseProps}
        firewallActive={true}
        eyes={eyes}
        onEyeDetonate={onEyeDetonate}
      />
    );

    act(() => {
      vi.advanceTimersByTime(1000);
    });

    expect(onEyeDetonate).toHaveBeenCalledWith('eye-1');
  });

  describe('getFirewallEyeBatchSize', () => {
    it('returns the default size below 75% risk', () => {
      expect(getFirewallEyeBatchSize(FIREWALL_EYE_BATCH_THRESHOLDS.HIGH - 1)).toBe(
        FIREWALL_EYE_BATCH_SIZES.BASE
      );
    });

    it('returns 10 at 75% risk', () => {
      expect(getFirewallEyeBatchSize(FIREWALL_EYE_BATCH_THRESHOLDS.HIGH)).toBe(
        FIREWALL_EYE_BATCH_SIZES.HIGH
      );
    });

    it('returns 12 at 85% risk', () => {
      expect(getFirewallEyeBatchSize(FIREWALL_EYE_BATCH_THRESHOLDS.CRITICAL)).toBe(
        FIREWALL_EYE_BATCH_SIZES.CRITICAL
      );
    });
  });
});

describe('Tutorial Popup', () => {
  const baseProps = {
    detectionLevel: 30,
    firewallActive: true,
    firewallDisarmed: false,
    eyes: [
      {
        id: 'eye-1',
        x: 50,
        y: 40,
        spawnTime: Date.now(),
        detonateTime: Date.now() + 8000,
        isDetonating: false,
      },
    ] as FirewallEye[],
    lastEyeSpawnTime: Date.now(),
    paused: false,
    turingTestActive: false,
    isReadingFile: false,
    firewallEyesTutorialShown: false, // Tutorial NOT shown yet
    onEyeClick: vi.fn(),
    onEyeDetonate: vi.fn(),
    onSpawnEyeBatch: vi.fn(),
    onActivateFirewall: vi.fn(),
    onPauseChanged: vi.fn(),
    onTutorialShown: vi.fn(),
  };

  it('shows tutorial popup when eyes first appear and tutorial not shown', () => {
    const { container } = render(<FirewallEyes {...baseProps} />);
    
    // Should show the tutorial overlay
    const overlay = container.querySelector('[class*="tutorialOverlay"]');
    expect(overlay).not.toBeNull();
    
    // Should have called onTutorialShown
    expect(baseProps.onTutorialShown).toHaveBeenCalledTimes(1);
  });

  it('does not show tutorial popup when firewallEyesTutorialShown is true', () => {
    const { container } = render(
      <FirewallEyes {...baseProps} firewallEyesTutorialShown={true} />
    );
    
    // Should NOT show the tutorial overlay
    const overlay = container.querySelector('[class*="tutorialOverlay"]');
    expect(overlay).toBeNull();
  });

  it('hides eyes while tutorial popup is showing', () => {
    const { container } = render(<FirewallEyes {...baseProps} />);
    
    // Eyes should NOT be visible while popup is showing
    const eyes = container.querySelectorAll('[class*="eye"]');
    // The only element with "eye" in class should be the popup elements, not actual eyes
    const eyeButtons = container.querySelectorAll('button[class*="eye"]');
    expect(eyeButtons.length).toBe(0);
  });
});
