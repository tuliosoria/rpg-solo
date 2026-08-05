import { describe, expect, it, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import type { ReactNode } from 'react';
import { I18nProvider } from '../../../i18n';
import OnboardingCards from '../OnboardingCards';
import TutorialSkipPopup from '../TutorialSkipPopup';

vi.mock('../../StaticNoise', () => ({
  default: () => <div data-testid="static-noise" />,
}));

function renderWithI18n(ui: ReactNode) {
  return render(<I18nProvider>{ui}</I18nProvider>);
}

describe('introductory overlays', () => {
  it('keeps Tab available and preserves native Enter activation for onboarding buttons', () => {
    const onSkip = vi.fn();

    renderWithI18n(
      <OnboardingCards
        textSpeed="instant"
        onComplete={vi.fn()}
        onSkip={onSkip}
        onCardLoad={vi.fn()}
      />
    );

    const tabEvent = new KeyboardEvent('keydown', { key: 'Tab', bubbles: true, cancelable: true });
    window.dispatchEvent(tabEvent);
    expect(tabEvent.defaultPrevented).toBe(false);

    const skipButton = screen.getByRole('button', { name: /skip onboarding/i });
    const enterEvent = new KeyboardEvent('keydown', {
      key: 'Enter',
      bubbles: true,
      cancelable: true,
    });
    skipButton.dispatchEvent(enterEvent);
    expect(enterEvent.defaultPrevented).toBe(false);

    fireEvent.click(skipButton);
    expect(onSkip).toHaveBeenCalledTimes(1);
  });

  it('keeps Enter and Space available for the focused tutorial choice', () => {
    const onContinue = vi.fn();

    renderWithI18n(<TutorialSkipPopup onSkip={vi.fn()} onContinue={onContinue} />);

    const tutorialButton = screen.getByRole('button', { name: /tutorial/i });
    expect(tutorialButton).toHaveFocus();

    const enterEvent = new KeyboardEvent('keydown', {
      key: 'Enter',
      bubbles: true,
      cancelable: true,
    });
    tutorialButton.dispatchEvent(enterEvent);
    expect(enterEvent.defaultPrevented).toBe(false);

    fireEvent.click(tutorialButton);
    expect(onContinue).toHaveBeenCalledTimes(1);
  });
});
