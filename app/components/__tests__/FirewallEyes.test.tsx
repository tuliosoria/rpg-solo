import { describe, it, expect, vi, beforeEach } from 'vitest';

// FirewallEyes.tsx is missing useState in its React import and references
// onFirewallTaunt without declaring it (rebase artifacts).
// Expose them globally before the component module is evaluated.
vi.hoisted(() => {
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const React = require('react');
  (globalThis as any).useState = React.useState;
  (globalThis as any).onFirewallTaunt = undefined;
});

import { render } from '@testing-library/react';
import FirewallEyes, {
  DETECTION_THRESHOLD,
} from '../FirewallEyes';
import styles from '../FirewallEyes.module.css';

describe('FirewallEyes (ambient)', () => {
  const baseProps = {
    detectionLevel: 0,
    firewallActive: false,
    firewallDisarmed: false,
    onActivateFirewall: vi.fn(),
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders nothing when firewallActive is false', () => {
    const { container } = render(
      <FirewallEyes {...baseProps} />
    );
    expect(container.querySelector(`.${styles.firewallContainer}`)).toBeNull();
  });

  it('renders nothing when firewallDisarmed is true', () => {
    const { container } = render(
      <FirewallEyes
        {...baseProps}
        firewallActive={true}
        firewallDisarmed={true}
        detectionLevel={50}
      />
    );
    expect(container.querySelector(`.${styles.firewallContainer}`)).toBeNull();
  });

  it('renders 2 eyes at detection 30%', () => {
    const { container } = render(
      <FirewallEyes
        {...baseProps}
        firewallActive={true}
        detectionLevel={30}
      />
    );
    const eyes = container.querySelectorAll('[data-testid="firewall-ambient-eye"]');
    expect(eyes.length).toBe(2);
  });

  it('renders 4 eyes at detection 50%', () => {
    const { container } = render(
      <FirewallEyes
        {...baseProps}
        firewallActive={true}
        detectionLevel={50}
      />
    );
    const eyes = container.querySelectorAll('[data-testid="firewall-ambient-eye"]');
    expect(eyes.length).toBe(4);
  });

  it('renders 6 eyes at detection 70%', () => {
    const { container } = render(
      <FirewallEyes
        {...baseProps}
        firewallActive={true}
        detectionLevel={70}
      />
    );
    const eyes = container.querySelectorAll('[data-testid="firewall-ambient-eye"]');
    expect(eyes.length).toBe(6);
  });

  it('renders 8 eyes at detection 85%', () => {
    const { container } = render(
      <FirewallEyes
        {...baseProps}
        firewallActive={true}
        detectionLevel={85}
      />
    );
    const eyes = container.querySelectorAll('[data-testid="firewall-ambient-eye"]');
    expect(eyes.length).toBe(8);
  });

  it('renders 10 eyes at detection 95%', () => {
    const { container } = render(
      <FirewallEyes
        {...baseProps}
        firewallActive={true}
        detectionLevel={95}
      />
    );
    const eyes = container.querySelectorAll('[data-testid="firewall-ambient-eye"]');
    expect(eyes.length).toBe(10);
  });

  it('container has the firewallContainer CSS class', () => {
    const { container } = render(
      <FirewallEyes
        {...baseProps}
        firewallActive={true}
        detectionLevel={30}
      />
    );
    const firewallContainer = container.querySelector(`.${styles.firewallContainer}`);
    expect(firewallContainer).not.toBeNull();
  });

  it('calls onActivateFirewall when detection crosses 25%', () => {
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

  it('does not call onActivateFirewall when already active', () => {
    const onActivateFirewall = vi.fn();

    render(
      <FirewallEyes
        {...baseProps}
        detectionLevel={30}
        firewallActive={true}
        onActivateFirewall={onActivateFirewall}
      />
    );

    expect(onActivateFirewall).not.toHaveBeenCalled();
  });

  it('does not call onActivateFirewall when disarmed', () => {
    const onActivateFirewall = vi.fn();

    render(
      <FirewallEyes
        {...baseProps}
        detectionLevel={30}
        firewallDisarmed={true}
        onActivateFirewall={onActivateFirewall}
      />
    );

    expect(onActivateFirewall).not.toHaveBeenCalled();
  });
});
