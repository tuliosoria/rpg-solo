import { describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import IntroSequence from '../IntroSequence';

vi.mock('../../i18n', () => ({
  useI18n: () => ({
    t: (key: string) => ({
      'intro.gate.prompt': 'Click to begin',
      'intro.skip.aria': 'Skip intro',
    })[key],
  }),
}));
vi.mock('../../hooks/useOptions', () => ({
  useOptions: () => ({ options: { musicEnabled: false, masterVolume: 0 } }),
}));
vi.mock('../../audio/menuMusic', () => ({ startMenuMusic: vi.fn() }));

describe('intro gate', () => {
  it('announces beginning, not skipping, when the first control starts the intro', () => {
    render(<IntroSequence onCompleteAction={vi.fn()} />);
    expect(screen.getByRole('button', { name: 'Click to begin' })).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: 'Skip intro' })).not.toBeInTheDocument();
  });
});
