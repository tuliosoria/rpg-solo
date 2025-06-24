'use client';
import React, { useEffect, useState, useMemo, useRef } from 'react';

type Choice = { 
  id: string;
  text: string; 
  nextNode: string;
  requirements?: {
    tech?: number;
    logical?: number;
    empathy?: number;
  };
  effects?: {
    tech?: number;
    logical?: number;
    empathy?: number;
  };
};

type StoryNode = { 
  id: string;
  chapter: number;
  title: string;
  text: string; 
  choices: Choice[];
};

type Story = { [key: string]: StoryNode };

type StoryData = {
  title?: string;
  description?: string;
  startNode?: string;
  playerStats?: {
    tech: number;
    logical: number;
    empathy: number;
  };
  nodes: Story;
};

type GameState = {
  tech: number;
  logical: number;
  empathy: number;
  choiceHistory: string[];
  hasSkills: boolean;
};

export default function RpgSolo() {
  const [story, setStory] = useState<Story | null>(null);
  const [storyData, setStoryData] = useState<StoryData | null>(null);
  const [current, setCurrent] = useState('wake_1');
  const [typedLength, setTypedLength] = useState(0);
  const [isTyping, setIsTyping] = useState(false);
  const [showChoices, setShowChoices] = useState(false);
  const [fadeClass, setFadeClass] = useState('fade-in');
  const skipRef = useRef(false);

  const [gameState, setGameState] = useState<GameState>({
    tech: 50,
    logical: 50,
    empathy: 50,
    choiceHistory: [],
    hasSkills: false
  });

  useEffect(() => {
    console.log('Loading story...');
    fetch('/story.json')
      .then(res => {
        console.log('Story response:', res.status);
        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }
        return res.json();
      })
      .then(data => {
        console.log('Story loaded successfully:', Object.keys(data.nodes || data).length, 'nodes');
        setStoryData(data);
        setStory(data.nodes || data);
        // Set the current node to the story's starting node if available
        if (data.startNode) {
          setCurrent(data.startNode);
        }
        // Initialize player stats
        if (data.playerStats) {
          setGameState(prev => ({
            ...prev,
            tech: data.playerStats.tech,
            logical: data.playerStats.logical,
            empathy: data.playerStats.empathy
          }));
        }
      })
      .catch(err => {
        console.error('Failed to load story:', err);
      });
  }, []);

  // Keyboard handler for skipping typewriter effect
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (isTyping && (event.key === 'Enter' || event.key === ' ' || event.key === 'Escape')) {
        skipRef.current = true;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isTyping]);

  // Scroll to top whenever the current node changes
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [current]);

  // Typewriter effect for story text
  const currentNode = useMemo(() => story?.[current], [story, current]);
  
  useEffect(() => {
    if (!currentNode) return;
    
    setTypedLength(0);
    setShowChoices(false);
    setIsTyping(true);
    setFadeClass('fade-in');
    skipRef.current = false;
    
    const text = currentNode.text;
    let index = 0;
    
    const timer = setInterval(() => {
      if (skipRef.current) {
        // Skip to end immediately
        setTypedLength(text.length);
        setIsTyping(false);
        setShowChoices(true);
        clearInterval(timer);
        return;
      }
      
      if (index < text.length) {
        setTypedLength(index + 1);
        index++;
      } else {
        setIsTyping(false);
        setShowChoices(true);
        clearInterval(timer);
      }
    }, 20);
    
    return () => {
      clearInterval(timer);
    };
  }, [currentNode]);

  const handleSkipTyping = () => {
    if (isTyping) {
      skipRef.current = true;
    }
  };

  const checkSkillRequirements = (choice: Choice): boolean => {
    if (!choice.requirements) return true;
    
    if (choice.requirements.tech && gameState.tech < choice.requirements.tech) return false;
    if (choice.requirements.logical && gameState.logical < choice.requirements.logical) return false;
    if (choice.requirements.empathy && gameState.empathy < choice.requirements.empathy) return false;
    
    return true;
  };

  const handleChoice = (choice: Choice) => {
    setFadeClass('fade-out');
    
    setTimeout(() => {
      // Apply stat effects
      if (choice.effects) {
        setGameState(prev => ({
          ...prev,
          tech: choice.effects?.tech ? prev.tech + choice.effects.tech : prev.tech,
          logical: choice.effects?.logical ? prev.logical + choice.effects.logical : prev.logical,
          empathy: choice.effects?.empathy ? prev.empathy + choice.effects.empathy : prev.empathy,
          choiceHistory: [...prev.choiceHistory, choice.id],
          hasSkills: true // Player has made a skill choice
        }));
      } else {
        setGameState(prev => ({
          ...prev,
          choiceHistory: [...prev.choiceHistory, choice.id]
        }));
      }
      
      setCurrent(choice.nextNode);
      setFadeClass('fade-in');
    }, 300);
  };

  if (!story || !currentNode) {
    return (
      <div className="rpg-container">
        <div className="loading">
          <div className="loading-spinner"></div>
          <p>Loading your story...</p>
        </div>
        <style jsx>{`
          .rpg-container {
            min-height: 100vh;
            background: linear-gradient(135deg, #0f0f23 0%, #1a1a2e 50%, #16213e 100%);
            color: #e0e0e0;
            padding: 20px;
            font-family: 'Courier New', monospace;
          }
          .loading {
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            min-height: 80vh;
          }
          .loading-spinner {
            width: 50px;
            height: 50px;
            border: 3px solid #333;
            border-top: 3px solid #00ff88;
            border-radius: 50%;
            animation: spin 1s linear infinite;
          }
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    );
  }

  return (
    <div className="rpg-container">
      <div className={`game-content ${fadeClass}`}>
        <div className="story-header">
          <h1 className="story-title">{storyData?.title || 'RPG Story'}</h1>
          {storyData?.description && (
            <p className="story-description">{storyData.description}</p>
          )}
        </div>

        {gameState.hasSkills && (
          <div className="stats-panel">
            <div className="status-item">
              <span className="status-label">Tech:</span>
              <span className="status-value">{gameState.tech}</span>
            </div>
            <div className="status-item">
              <span className="status-label">Logical:</span>
              <span className="status-value">{gameState.logical}</span>
            </div>
            <div className="status-item">
              <span className="status-label">Empathy:</span>
              <span className="status-value">{gameState.empathy}</span>
            </div>
          </div>
        )}

        <div className="story-content">
          <div className="chapter-info">
            <span className="chapter-number">Chapter {currentNode.chapter}</span>
            <h2 className="node-title">{currentNode.title}</h2>
          </div>

          <div className="story-text" onClick={handleSkipTyping}>
            <span style={{ color: '#e0e0e0' }}>
              {currentNode.text.slice(0, typedLength)}
            </span>
            <span style={{ color: 'transparent', userSelect: 'none' }}>
              {currentNode.text.slice(typedLength)}
            </span>
          </div>
          
          <div className="skip-hint">
            Press ENTER or click to skip ⤷
          </div>

          {showChoices && (
            <div className="choices-container">
              {currentNode.choices.map((choice, index) => {
                const canChoose = checkSkillRequirements(choice);
                return (
                  <button
                    key={index}
                    className={`choice-button ${!canChoose ? 'disabled' : ''}`}
                    onClick={() => canChoose && handleChoice(choice)}
                    disabled={!canChoose}
                  >
                    <span className="choice-text">{choice.text}</span>
                    {choice.requirements && (
                      <span className="choice-requirements">
                        {choice.requirements.tech && `Tech ${choice.requirements.tech}+`}
                        {choice.requirements.logical && `Logic ${choice.requirements.logical}+`}
                        {choice.requirements.empathy && `Empathy ${choice.requirements.empathy}+`}
                      </span>
                    )}
                    {choice.effects && (
                      <span className="choice-effects">
                        {choice.effects.tech && `+${choice.effects.tech} Tech`}
                        {choice.effects.logical && `+${choice.effects.logical} Logic`}
                        {choice.effects.empathy && `+${choice.effects.empathy} Empathy`}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          )}
        </div>
      </div>

      <style jsx>{`
        .rpg-container {
          min-height: 100vh;
          background: linear-gradient(135deg, #0f0f23 0%, #1a1a2e 50%, #16213e 100%);
          color: #e0e0e0;
          padding: 20px;
          font-family: 'Courier New', monospace;
        }

        .game-content {
          max-width: 800px;
          margin: 0 auto;
          transition: opacity 0.3s ease-in-out;
        }

        .fade-in {
          opacity: 1;
        }

        .fade-out {
          opacity: 0;
        }

        .story-header {
          text-align: center;
          margin-bottom: 30px;
          padding-bottom: 20px;
          border-bottom: 2px solid #00ff88;
        }

        .story-title {
          font-size: 2.5rem;
          color: #00ff88;
          margin: 0 0 10px 0;
          text-shadow: 0 0 10px rgba(0, 255, 136, 0.5);
        }

        .story-description {
          font-size: 1.1rem;
          color: #b0b0b0;
          margin: 0;
          font-style: italic;
        }

        .stats-panel {
          display: flex;
          justify-content: center;
          gap: 30px;
          margin-bottom: 30px;
          padding: 15px;
          background: rgba(255, 255, 255, 0.05);
          border-radius: 10px;
          backdrop-filter: blur(10px);
        }

        .status-item {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 5px;
        }

        .status-label {
          font-size: 0.9rem;
          color: #888;
          text-transform: uppercase;
          letter-spacing: 1px;
        }

        .status-value {
          font-size: 1.5rem;
          font-weight: bold;
          color: #00ff88;
          text-shadow: 0 0 5px rgba(0, 255, 136, 0.3);
        }

        .chapter-info {
          text-align: center;
          margin-bottom: 20px;
        }

        .chapter-number {
          font-size: 0.9rem;
          color: #00ff88;
          text-transform: uppercase;
          letter-spacing: 2px;
        }

        .node-title {
          font-size: 1.8rem;
          color: #ffffff;
          margin: 5px 0 0 0;
          text-shadow: 0 0 5px rgba(255, 255, 255, 0.2);
        }

        .story-text {
          font-size: 1.1rem;
          line-height: 1.8;
          margin: 30px 0;
          cursor: pointer;
          min-height: 200px;
          white-space: pre-wrap;
        }

        .skip-hint {
          text-align: center;
          font-size: 0.8rem;
          color: #666;
          margin-bottom: 20px;
          font-style: italic;
        }

        .choices-container {
          display: flex;
          flex-direction: column;
          gap: 15px;
          margin-top: 30px;
        }

        .choice-button {
          background: linear-gradient(135deg, rgba(0, 255, 136, 0.1) 0%, rgba(0, 255, 136, 0.2) 100%);
          border: 1px solid #00ff88;
          color: #e0e0e0;
          padding: 15px 20px;
          border-radius: 8px;
          cursor: pointer;
          transition: all 0.3s ease;
          text-align: left;
          font-family: inherit;
          font-size: 1rem;
          position: relative;
          overflow: hidden;
        }

        .choice-button:hover:not(.disabled) {
          background: linear-gradient(135deg, rgba(0, 255, 136, 0.2) 0%, rgba(0, 255, 136, 0.3) 100%);
          transform: translateX(5px);
          box-shadow: 0 5px 15px rgba(0, 255, 136, 0.2);
        }

        .choice-button.disabled {
          background: rgba(255, 255, 255, 0.05);
          border-color: #444;
          color: #666;
          cursor: not-allowed;
        }

        .choice-text {
          display: block;
          margin-bottom: 5px;
        }

        .choice-requirements {
          display: block;
          font-size: 0.8rem;
          color: #ff6b6b;
          font-style: italic;
        }

        .choice-effects {
          display: block;
          font-size: 0.8rem;
          color: #00ff88;
          font-style: italic;
        }

        @media (max-width: 768px) {
          .rpg-container {
            padding: 10px;
          }
          
          .stats-panel {
            flex-direction: column;
            gap: 15px;
          }
          
          .story-title {
            font-size: 2rem;
          }
          
          .story-text {
            font-size: 1rem;
          }
        }
      `}</style>
    </div>
  );
}
