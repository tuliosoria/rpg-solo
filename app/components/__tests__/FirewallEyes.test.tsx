import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, act } from '@testing-library/react';
import FirewallEyes, { DETECTION_THRESHOLD, SPAWN_COOLDOWN_MS } from '../FirewallEyes';
import type { FirewallEye } from '../../types';

describe('FirewallEyes', () => {
  const baseProps = {
    detectionLevel: 0,
    firewallActive: false,
    firewallDisarmed: false,
    eyes: [] as FirewallEye[],
    lastEyeSpawnTime: 0,
    paused: false,
    onEyeClick: vi.fn(),
    onEyeDetonate: vi.fn(),
    onSpawnEyeBatch: vi.fn(),
    onActivateFirewall: vi.fn(),
    onPauseChanged: vi.fn(),
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

  it('enforces the 60-second cooldown between spawn batches', () => {
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
});
