'use client';

import React, { useState, useCallback } from 'react';
import dynamic from 'next/dynamic';
import { GameState } from '../types';
import { createNewGame, loadGame, loadCheckpoint } from '../storage/saves';
import { useGlobalErrorHandler } from '../hooks/useGlobalErrorHandler';
import ErrorBoundary from './ErrorBoundary';
import Menu from './Menu';

const Terminal = dynamic(() => import('./Terminal'), { ssr: false, loading: () => null });
const SaveModal = dynamic(() => import('./SaveModal'), { ssr: false, loading: () => null });

type View = 'menu' | 'game';

function HomeContentInner() {
  const [view, setView] = useState<View>('menu');
  const [gameState, setGameState] = useState<GameState | null>(null);
  const [showSaveModal, setShowSaveModal] = useState(false);

  const handleNewGame = useCallback(() => {
    const newState = createNewGame();
    setGameState(newState);
    setView('game');
  }, []);

  const handleLoadGame = useCallback((slotId: string) => {
    const loadedState = loadGame(slotId);
    if (loadedState) {
      setGameState(loadedState);
      setView('game');
    }
  }, []);

  const handleLoadCheckpoint = useCallback((slotId: string) => {
    const loadedState = loadCheckpoint(slotId);
    if (loadedState) {
      // Reset game over state when loading checkpoint
      setGameState({
        ...loadedState,
        isGameOver: false,
        gameOverReason: undefined,
      });
      setView('game');
    }
  }, []);

  const handleExit = useCallback(() => {
    setView('menu');
    setGameState(null);
  }, []);

  const handleSaveRequest = useCallback((state: GameState) => {
    setGameState(state);
    setShowSaveModal(true);
  }, []);

  const handleSaved = useCallback(() => {
    setShowSaveModal(false);
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
            gameState={gameState}
            onCloseAction={() => setShowSaveModal(false)}
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
    <ErrorBoundary>
      <HomeContentInner />
    </ErrorBoundary>
  );
}
