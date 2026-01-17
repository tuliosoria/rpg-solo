'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { GameState, TerminalEntry, ImageTrigger } from '../types';
import { executeCommand, createEntry } from '../engine/commands';
import { autoSave } from '../storage/saves';
import ImageOverlay from './ImageOverlay';
import GameOver from './GameOver';
import styles from './Terminal.module.css';

interface TerminalProps {
  initialState: GameState;
  onExitAction: () => void;
  onSaveRequestAction: (state: GameState) => void;
}

export default function Terminal({ initialState, onExitAction, onSaveRequestAction }: TerminalProps) {
  const [gameState, setGameState] = useState<GameState>(initialState);
  const [inputValue, setInputValue] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [flickerActive, setFlickerActive] = useState(false);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [activeImage, setActiveImage] = useState<ImageTrigger | null>(null);
  const [showGameOver, setShowGameOver] = useState(false);
  const [gameOverReason, setGameOverReason] = useState('');
  
  const outputRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  
  // Scroll to bottom when history changes
  useEffect(() => {
    if (outputRef.current) {
      outputRef.current.scrollTop = outputRef.current.scrollHeight;
    }
  }, [gameState.history]);
  
  // Focus input on mount
  useEffect(() => {
    inputRef.current?.focus();
  }, []);
  
  // Auto-save periodically
  useEffect(() => {
    const interval = setInterval(() => {
      if (!gameState.isGameOver) {
        autoSave(gameState);
      }
    }, 30000); // Every 30 seconds
    
    return () => clearInterval(interval);
  }, [gameState]);
  
  // Trigger flicker effect
  const triggerFlicker = useCallback(() => {
    setFlickerActive(true);
    setTimeout(() => setFlickerActive(false), 300);
  }, []);
  
  // Handle command submission
  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (isProcessing || !inputValue.trim()) return;
    
    const command = inputValue.trim();
    setInputValue('');
    setHistoryIndex(-1);
    
    // Add command to history
    const inputEntry = createEntry('input', `> ${command}`);
    let newState: GameState = {
      ...gameState,
      history: [...gameState.history, inputEntry],
      commandHistory: [command, ...gameState.commandHistory.slice(0, 49)],
    };
    
    setGameState(newState);
    
    // Handle special commands
    if (command.toLowerCase() === 'save') {
      onSaveRequestAction(newState);
      return;
    }
    
    if (command.toLowerCase() === 'exit' || command.toLowerCase() === 'quit') {
      onExitAction();
      return;
    }
    
    // Execute command
    setIsProcessing(true);
    
    const result = executeCommand(command, newState);
    
    // Apply delay if specified
    if (result.delayMs) {
      await new Promise(resolve => setTimeout(resolve, result.delayMs));
    }
    
    // Apply flicker if specified
    if (result.triggerFlicker) {
      triggerFlicker();
    }
    
    // Update state with results
    const updatedState: GameState = {
      ...newState,
      ...result.stateChanges,
      history: result.stateChanges.history !== undefined 
        ? result.stateChanges.history 
        : [...newState.history, ...result.output],
      truthsDiscovered: result.stateChanges.truthsDiscovered || newState.truthsDiscovered,
    };
    
    setGameState(updatedState);
    setIsProcessing(false);
    
    // Show image if triggered
    if (result.imageTrigger) {
      setActiveImage(result.imageTrigger);
    }
    
    // Check for game over
    if (updatedState.isGameOver) {
      setGameOverReason(updatedState.gameOverReason || 'CRITICAL SYSTEM FAILURE');
      setShowGameOver(true);
      return;
    }
    
    // Focus input after processing
    inputRef.current?.focus();
  }, [gameState, inputValue, isProcessing, onExitAction, onSaveRequestAction, triggerFlicker]);
  
  // Handle keyboard navigation
  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'ArrowUp') {
      e.preventDefault();
      const newIndex = Math.min(historyIndex + 1, gameState.commandHistory.length - 1);
      if (newIndex >= 0 && gameState.commandHistory[newIndex]) {
        setHistoryIndex(newIndex);
        setInputValue(gameState.commandHistory[newIndex]);
      }
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      const newIndex = historyIndex - 1;
      if (newIndex < 0) {
        setHistoryIndex(-1);
        setInputValue('');
      } else if (gameState.commandHistory[newIndex]) {
        setHistoryIndex(newIndex);
        setInputValue(gameState.commandHistory[newIndex]);
      }
    } else if (e.ctrlKey && e.key === 'l') {
      e.preventDefault();
      setGameState(prev => ({ ...prev, history: [] }));
    }
  }, [historyIndex, gameState.commandHistory]);
  
  // Get status bar content
  const getStatusBar = () => {
    const parts: string[] = [];
    
    if (gameState.detectionLevel >= 50) {
      parts.push('AUDIT: ACTIVE');
    }
    if (gameState.sessionStability < 50) {
      parts.push('SESSION: UNSTABLE');
    }
    if (gameState.flags.adminUnlocked) {
      parts.push('ACCESS: ADMIN');
    }
    if (gameState.isGameOver) {
      parts.push(gameState.gameOverReason || 'TERMINATED');
    }
    
    return parts.join(' │ ') || 'SYSTEM NOMINAL';
  };
  
  // Render terminal entry
  const renderEntry = (entry: TerminalEntry) => {
    let className = styles.line;
    
    switch (entry.type) {
      case 'input':
        className = `${styles.line} ${styles.input}`;
        break;
      case 'error':
        className = `${styles.line} ${styles.error}`;
        break;
      case 'warning':
        className = `${styles.line} ${styles.warning}`;
        break;
      case 'system':
        className = `${styles.line} ${styles.system}`;
        break;
      case 'notice':
        className = `${styles.line} ${styles.notice}`;
        break;
    }
    
    return (
      <div key={entry.id} className={className}>
        {entry.content}
      </div>
    );
  };
  
  return (
    <div 
      className={`${styles.terminal} ${flickerActive ? styles.flicker : ''}`}
      onClick={() => inputRef.current?.focus()}
    >
      {/* Scanlines overlay */}
      <div className={styles.scanlines} />
      
      {/* Status bar */}
      <div className={styles.statusBar}>
        <span className={styles.statusLeft}>VARGINHA: TERMINAL 1996</span>
        <span className={styles.statusRight}>{getStatusBar()}</span>
      </div>
      
      {/* Output area */}
      <div className={styles.output} ref={outputRef}>
        {gameState.history.map(renderEntry)}
        {isProcessing && (
          <div className={`${styles.line} ${styles.processing}`}>
            Processing...
          </div>
        )}
      </div>
      
      {/* Input area */}
      <form onSubmit={handleSubmit} className={styles.inputArea}>
        <span className={styles.prompt}>&gt;</span>
        <input
          ref={inputRef}
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={handleKeyDown}
          className={styles.inputField}
          disabled={isProcessing || gameState.isGameOver}
          autoFocus
          autoComplete="off"
          spellCheck={false}
        />
        <span className={styles.cursor}>_</span>
      </form>
      
      {/* Exit button */}
      <button 
        className={styles.exitButton}
        onClick={onExitAction}
        title="Exit to Menu"
      >
        [ESC]
      </button>
      
      {/* Image overlay */}
      {activeImage && (
        <ImageOverlay
          src={activeImage.src}
          alt={activeImage.alt}
          tone={activeImage.tone}
          corrupted={activeImage.corrupted}
          onCloseAction={() => {
            setActiveImage(null);
            inputRef.current?.focus();
          }}
        />
      )}
      
      {/* Game Over overlay */}
      {showGameOver && (
        <GameOver
          reason={gameOverReason}
          onRestartCompleteAction={onExitAction}
        />
      )}
    </div>
  );
}
