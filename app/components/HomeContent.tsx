'use client';

import React, { useState, useCallback, useRef } from 'react';
import dynamic from 'next/dynamic';
import { GameState } from '../types';
import { createNewGame, loadGameAsync, loadCheckpoint } from '../storage/saves';
import { incrementStatistic } from '../storage/statistics';
import { useGlobalErrorHandler } from '../hooks/useGlobalErrorHandler';
import { I18nProvider } from '../i18n';
import ErrorBoundary from './ErrorBoundary';
import Menu from './Menu';

const Terminal = dynamic(() => import('./Terminal'), { ssr: false, loading: () => null });
const SaveModal = dynamic(() => import('./SaveModal'), { ssr: false, loading: () => null });

type View = 'menu' | 'game';

function HomeContentInner() {
  const [view, setView] = useState<View>('menu');
  const [gameState, setGameState] = useState<GameState | null>(null);
  const [saveRequestState, setSaveRequestState] = useState<GameState | null>(null);
  const [showSaveModal, setShowSaveModal] = useState(false);
  const loadRequestIdRef = useRef(0);

  const invalidatePendingLoads = useCallback(() => {
    loadRequestIdRef.current += 1;
  }, []);

  const handleNewGame = useCallback(() => {
    invalidatePendingLoads();
    const newState = createNewGame();
    incrementStatistic('gamesPlayed');
    setGameState(newState);
    setSaveRequestState(null);
    setShowSaveModal(false);
    setView('game');
  }, [invalidatePendingLoads]);

  const handleLoadGame = useCallback(async (slotId: string, signal?: AbortSignal) => {
    const requestId = loadRequestIdRef.current + 1;
    loadRequestIdRef.current = requestId;
    const loadedState = await loadGameAsync(slotId, signal);

    if (signal?.aborted || requestId !== loadRequestIdRef.current) {
      return false;
    }

    if (loadedState) {
      setGameState(loadedState);
      setSaveRequestState(null);
      setShowSaveModal(false);
      setView('game');
      return true;
    }
    return false;
  }, []);

  const handleLoadCheckpoint = useCallback((slotId: string) => {
    invalidatePendingLoads();
    const loadedState = loadCheckpoint(slotId);
    if (loadedState) {
      // Reset game over state when loading checkpoint
      setGameState({
        ...loadedState,
        isGameOver: false,
        gameOverReason: undefined,
      });
      setSaveRequestState(null);
      setShowSaveModal(false);
      setView('game');
    }
  }, [invalidatePendingLoads]);

  const handleExit = useCallback(() => {
    invalidatePendingLoads();
    setView('menu');
    setGameState(null);
    setSaveRequestState(null);
    setShowSaveModal(false);
  }, [invalidatePendingLoads]);

  const handleSaveRequest = useCallback((state: GameState) => {
    setSaveRequestState(state);
    setShowSaveModal(true);
  }, []);

  const handleSaved = useCallback(() => {
    setShowSaveModal(false);
    setSaveRequestState(null);
  }, []);

  if (view === 'menu') {
    return <Menu onNewGameAction={handleNewGame} onLoadGameAction={handleLoadGame} />;
  }

  if (view === 'game' && gameState) {
    return (
      <>
        <Terminal
          initialState={gameState}
          onExitAction={handleExit}
          onSaveRequestAction={handleSaveRequest}
          onLoadCheckpointAction={handleLoadCheckpoint}
        />
        {showSaveModal && (
          <SaveModal
            gameState={saveRequestState ?? gameState}
            onCloseAction={() => {
              setShowSaveModal(false);
              setSaveRequestState(null);
            }}
            onSavedAction={handleSaved}
          />
        )}
      </>
    );
  }

  return null;
}

/**
 * Main HomeContent component wrapped with ErrorBoundary and global error handlers.
 */
export default function HomeContent() {
  // Set up global handlers for unhandled promise rejections
  useGlobalErrorHandler();

  return (
    <I18nProvider>
      <ErrorBoundary>
        <HomeContentInner />
      </ErrorBoundary>
    </I18nProvider>
  );
}
