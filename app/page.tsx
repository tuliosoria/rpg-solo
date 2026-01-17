'use client';

import React, { useState, useCallback } from 'react';
import { GameState } from './types';
import { createNewGame, loadGame } from './storage/saves';
import Menu from './components/Menu';
import Terminal from './components/Terminal';
import SaveModal from './components/SaveModal';

type View = 'menu' | 'game';

export default function Home() {
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
    return (
      <Menu 
        onNewGameAction={handleNewGame}
        onLoadGameAction={handleLoadGame}
      />
    );
  }
  
  if (view === 'game' && gameState) {
    return (
      <>
        <Terminal 
          initialState={gameState}
          onExitAction={handleExit}
          onSaveRequestAction={handleSaveRequest}
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

