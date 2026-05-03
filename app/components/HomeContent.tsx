'use client';

import React, { useState, useCallback, useRef, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { GameState } from '../types';
import { createNewGame, loadGameAsync, loadCheckpoint } from '../storage/saves';
import { incrementStatistic } from '../storage/statistics';
import { useGlobalErrorHandler } from '../hooks/useGlobalErrorHandler';
import { I18nProvider } from '../i18n';
import ErrorBoundary from './ErrorBoundary';
import Menu from './Menu';
import IntroSequence from './IntroSequence';
import { stopMenuMusic } from '../audio/menuMusic';

const Terminal = dynamic(() => import('./Terminal'), { ssr: false, loading: () => null });
const SaveModal = dynamic(() => import('./overlays/SaveModal'), { ssr: false, loading: () => null });

type View = 'intro' | 'menu' | 'game';

const INTRO_SESSION_KEY = 'terminal1996_introSeen';

function HomeContentInner() {
  const [view, setView] = useState<View>(() => {
    if (typeof window === 'undefined') return 'intro';
    try {
      return sessionStorage.getItem(INTRO_SESSION_KEY) === '1' ? 'menu' : 'intro';
    } catch {
      return 'intro';
    }
  });
  const [gameState, setGameState] = useState<GameState | null>(null);
  const [saveRequestState, setSaveRequestState] = useState<GameState | null>(null);
  const [showSaveModal, setShowSaveModal] = useState(false);
  // Increment whenever a fresh session is loaded (new game, load slot, load checkpoint)
  // to force the Terminal subtree to remount with the loaded state. Without this, the
  // Terminal's internal state hooks keep the prior session's UI/phase state and the
  // sync-effect path is fragile (missing risk header, no warmup animation, stale flags
  // that can fire an instant game over on the next command).
  const [sessionEpoch, setSessionEpoch] = useState(0);
  const loadRequestIdRef = useRef(0);

  // sessionStorage may change in tests/SSR-hydration; sync once on mount as a safety net
  useEffect(() => {
    try {
      if (sessionStorage.getItem(INTRO_SESSION_KEY) === '1') {
        setView(prev => (prev === 'intro' ? 'menu' : prev));
      }
    } catch {
      // sessionStorage unavailable; keep current view
    }
  }, []);

  const handleIntroComplete = useCallback(() => {
    try {
      sessionStorage.setItem(INTRO_SESSION_KEY, '1');
    } catch {
      // ignore
    }
    setView('menu');
  }, []);

  const invalidatePendingLoads = useCallback(() => {
    loadRequestIdRef.current += 1;
  }, []);

  const handleNewGame = useCallback(() => {
    invalidatePendingLoads();
    stopMenuMusic();
    const newState = createNewGame();
    incrementStatistic('gamesPlayed');
    setGameState(newState);
    setSaveRequestState(null);
    setShowSaveModal(false);
    setSessionEpoch(prev => prev + 1);
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
      stopMenuMusic();
      setGameState(loadedState);
      setSaveRequestState(null);
      setShowSaveModal(false);
      setSessionEpoch(prev => prev + 1);
      setView('game');
      return true;
    }
    return false;
  }, []);

  const handleLoadCheckpoint = useCallback((slotId: string) => {
    invalidatePendingLoads();
    const loadedState = loadCheckpoint(slotId);
    if (loadedState) {
      stopMenuMusic();
      // Reset game over state when loading checkpoint
      setGameState({
        ...loadedState,
        isGameOver: false,
        gameOverReason: undefined,
      });
      setSaveRequestState(null);
      setShowSaveModal(false);
      setSessionEpoch(prev => prev + 1);
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

  if (view === 'intro') {
    return <IntroSequence onCompleteAction={handleIntroComplete} />;
  }

  if (view === 'menu') {
    return <Menu onNewGameAction={handleNewGame} onLoadGameAction={handleLoadGame} />;
  }

  if (view === 'game' && gameState) {
    return (
      <>
        <Terminal
          key={`game-${sessionEpoch}`}
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
