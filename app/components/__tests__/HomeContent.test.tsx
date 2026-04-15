import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, act } from '@testing-library/react';
import type { ReactNode } from 'react';
import { DEFAULT_GAME_STATE, GameState } from '../../types';

vi.mock('next/dynamic', () => ({
  default: () =>
    function DynamicMock(props: {
      initialState?: { currentPath?: string };
      onExitAction?: () => void;
    }) {
      return (
        <div>
          <div data-testid="dynamic-component">
            {props.initialState?.currentPath ?? 'dynamic-component'}
          </div>
          {props.onExitAction && <button onClick={props.onExitAction}>exit</button>}
        </div>
      );
    },
}));

vi.mock('../../hooks/useGlobalErrorHandler', () => ({
  useGlobalErrorHandler: vi.fn(),
}));

vi.mock('../../i18n', () => ({
  I18nProvider: ({ children }: { children: ReactNode }) => <>{children}</>,
}));

vi.mock('../ErrorBoundary', () => ({
  default: ({ children }: { children: ReactNode }) => <>{children}</>,
}));

vi.mock('../../storage/saves', () => ({
  createNewGame: vi.fn(),
  loadGameAsync: vi.fn(),
  loadCheckpoint: vi.fn(),
}));

vi.mock('../../storage/statistics', () => ({
  incrementStatistic: vi.fn(),
}));

vi.mock('../Menu', () => {
  let controller: AbortController | null = null;

  return {
    default: ({
      onNewGameAction,
      onLoadGameAction,
    }: {
      onNewGameAction: () => void;
      onLoadGameAction: (
        slotId: string,
        signal?: AbortSignal
      ) => void | boolean | Promise<void | boolean>;
    }) => (
      <div>
        <button onClick={onNewGameAction}>new game</button>
        <button
          onClick={() => {
            controller = new AbortController();
            void onLoadGameAction('save-1', controller.signal);
          }}
        >
          load save
        </button>
        <button
          onClick={() => {
            controller?.abort();
            onNewGameAction();
          }}
        >
          abort and new game
        </button>
      </div>
    ),
  };
});

import HomeContent from '../HomeContent';
import { createNewGame, loadGameAsync } from '../../storage/saves';
import { incrementStatistic } from '../../storage/statistics';

function createGameState(currentPath: string): GameState {
  return {
    ...DEFAULT_GAME_STATE,
    seed: 12345,
    rngState: 12345,
    sessionStartTime: 1,
    currentPath,
  };
}

describe('HomeContent', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(createNewGame).mockReturnValue(createGameState('/new-game'));
  });

  it('ignores an aborted stale load after the player starts a new game', async () => {
    const loadedState = createGameState('/loaded-save');
    let resolveLoad: ((state: GameState | null) => void) | undefined;
    const pendingLoad = new Promise<GameState | null>(resolve => {
      resolveLoad = resolve;
    });

    vi.mocked(loadGameAsync).mockReturnValue(pendingLoad);

    render(<HomeContent />);

    fireEvent.click(screen.getByRole('button', { name: /load save/i }));
    fireEvent.click(screen.getByRole('button', { name: /abort and new game/i }));

    expect(screen.getByTestId('dynamic-component')).toHaveTextContent('/new-game');
    expect(loadGameAsync).toHaveBeenCalledWith('save-1', expect.any(AbortSignal));

    await act(async () => {
      resolveLoad?.(loadedState);
      await pendingLoad;
    });

    expect(screen.getByTestId('dynamic-component')).toHaveTextContent('/new-game');
  });

  it('records a started game when the player begins a new session', () => {
    render(<HomeContent />);

    fireEvent.click(screen.getByRole('button', { name: /^new game$/i }));

    expect(incrementStatistic).toHaveBeenCalledWith('gamesPlayed');
    expect(screen.getByTestId('dynamic-component')).toHaveTextContent('/new-game');
  });

  it('loads a saved game successfully and can return to the menu', async () => {
    vi.mocked(loadGameAsync).mockResolvedValue(createGameState('/loaded-save'));

    render(<HomeContent />);

    fireEvent.click(screen.getByRole('button', { name: /load save/i }));

    expect(await screen.findByTestId('dynamic-component')).toHaveTextContent('/loaded-save');

    fireEvent.click(screen.getByRole('button', { name: /exit/i }));

    expect(screen.getByRole('button', { name: /load save/i })).toBeInTheDocument();
  });
});
