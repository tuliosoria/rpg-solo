'use client';
import React, { useEffect, useState } from 'react';

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

type GameState = {
  tech: number;
  logical: number;
  empathy: number;
  hasSkills: boolean;
};

export default function RpgSolo() {
  const [story, setStory] = useState<{ [key: string]: StoryNode } | null>(null);
  const [current, setCurrent] = useState('wake_1');
  const [gameState, setGameState] = useState<GameState>({
    tech: 50,
    logical: 50,
    empathy: 50,
    hasSkills: false
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/story.json')
      .then(res => res.json())
      .then(data => {
        setStory(data.nodes);
        if (data.startNode) {
          setCurrent(data.startNode);
        }
        setLoading(false);
      })
      .catch(err => {
        console.error('Failed to load story:', err);
        setLoading(false);
      });
  }, []);

  const currentNode = story?.[current];

  const handleChoice = (choice: Choice) => {
    if (choice.effects) {
      setGameState(prev => ({
        tech: choice.effects?.tech ? prev.tech + choice.effects.tech : prev.tech,
        logical: choice.effects?.logical ? prev.logical + choice.effects.logical : prev.logical,
        empathy: choice.effects?.empathy ? prev.empathy + choice.effects.empathy : prev.empathy,
        hasSkills: true
      }));
    }
    setCurrent(choice.nextNode);
  };

  const canChoose = (choice: Choice): boolean => {
    if (!choice.requirements) return true;
    if (choice.requirements.tech && gameState.tech < choice.requirements.tech) return false;
    if (choice.requirements.logical && gameState.logical < choice.requirements.logical) return false;
    if (choice.requirements.empathy && gameState.empathy < choice.requirements.empathy) return false;
    return true;
  };

  if (loading) {
    return (
      <div style={{ 
        minHeight: '100vh', 
        background: '#0f0f23', 
        color: '#e0e0e0', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center',
        fontFamily: 'monospace'
      }}>
        Loading...
      </div>
    );
  }

  if (!currentNode) {
    return (
      <div style={{ 
        minHeight: '100vh', 
        background: '#0f0f23', 
        color: '#e0e0e0', 
        padding: '20px',
        fontFamily: 'monospace'
      }}>
        Story node not found: {current}
      </div>
    );
  }

  return (
    <div style={{ 
      minHeight: '100vh', 
      background: 'linear-gradient(135deg, #0f0f23 0%, #1a1a2e 50%, #16213e 100%)', 
      color: '#e0e0e0', 
      padding: '20px',
      fontFamily: 'monospace'
    }}>
      <div style={{ maxWidth: '800px', margin: '0 auto' }}>
        
        {/* Title */}
        <div style={{ textAlign: 'center', marginBottom: '30px' }}>
          <h1 style={{ color: '#00ff88', fontSize: '2rem', margin: '0 0 10px 0' }}>
            Dr. Korvain - Replica 43
          </h1>
          <p style={{ color: '#b0b0b0', fontStyle: 'italic' }}>
            A consciousness awakens in a new body, tasked with investigating mysterious signals from the Moon
          </p>
        </div>

        {/* Stats - only show after skill selection */}
        {gameState.hasSkills && (
          <div style={{ 
            display: 'flex', 
            justifyContent: 'center', 
            gap: '30px', 
            marginBottom: '30px',
            padding: '15px',
            background: 'rgba(255, 255, 255, 0.05)',
            borderRadius: '10px'
          }}>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '0.9rem', color: '#888' }}>TECH</div>
              <div style={{ fontSize: '1.5rem', color: '#00ff88', fontWeight: 'bold' }}>
                {gameState.tech}
              </div>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '0.9rem', color: '#888' }}>LOGICAL</div>
              <div style={{ fontSize: '1.5rem', color: '#00ff88', fontWeight: 'bold' }}>
                {gameState.logical}
              </div>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '0.9rem', color: '#888' }}>EMPATHY</div>
              <div style={{ fontSize: '1.5rem', color: '#00ff88', fontWeight: 'bold' }}>
                {gameState.empathy}
              </div>
            </div>
          </div>
        )}

        {/* Chapter info */}
        <div style={{ textAlign: 'center', marginBottom: '20px' }}>
          <div style={{ fontSize: '0.9rem', color: '#00ff88', letterSpacing: '2px' }}>
            CHAPTER {currentNode.chapter}
          </div>
          <h2 style={{ fontSize: '1.8rem', color: '#ffffff', margin: '5px 0 0 0' }}>
            {currentNode.title}
          </h2>
        </div>

        {/* Story text - no typewriter effect to save memory */}
        <div style={{ 
          fontSize: '1.1rem', 
          lineHeight: '1.8', 
          margin: '30px 0', 
          whiteSpace: 'pre-wrap',
          minHeight: '200px'
        }}>
          {currentNode.text}
        </div>

        {/* Choices */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '15px', marginTop: '30px' }}>
          {currentNode.choices.map((choice, index) => {
            const canSelect = canChoose(choice);
            return (
              <button
                key={index}
                onClick={() => canSelect && handleChoice(choice)}
                disabled={!canSelect}
                style={{
                  background: canSelect 
                    ? 'linear-gradient(135deg, rgba(0, 255, 136, 0.1) 0%, rgba(0, 255, 136, 0.2) 100%)'
                    : 'rgba(255, 255, 255, 0.05)',
                  border: canSelect ? '1px solid #00ff88' : '1px solid #444',
                  color: canSelect ? '#e0e0e0' : '#666',
                  padding: '15px 20px',
                  borderRadius: '8px',
                  cursor: canSelect ? 'pointer' : 'not-allowed',
                  textAlign: 'left',
                  fontFamily: 'inherit',
                  fontSize: '1rem',
                  transition: 'all 0.3s ease'
                }}
                onMouseEnter={(e) => {
                  if (canSelect) {
                    e.currentTarget.style.transform = 'translateX(5px)';
                    e.currentTarget.style.boxShadow = '0 5px 15px rgba(0, 255, 136, 0.2)';
                  }
                }}
                onMouseLeave={(e) => {
                  if (canSelect) {
                    e.currentTarget.style.transform = 'translateX(0)';
                    e.currentTarget.style.boxShadow = 'none';
                  }
                }}
              >
                <div>{choice.text}</div>
                {choice.requirements && (
                  <div style={{ fontSize: '0.8rem', color: '#ff6b6b', fontStyle: 'italic', marginTop: '5px' }}>
                    {choice.requirements.tech && `Tech ${choice.requirements.tech}+ `}
                    {choice.requirements.logical && `Logic ${choice.requirements.logical}+ `}
                    {choice.requirements.empathy && `Empathy ${choice.requirements.empathy}+`}
                  </div>
                )}
                {choice.effects && (
                  <div style={{ fontSize: '0.8rem', color: '#00ff88', fontStyle: 'italic', marginTop: '5px' }}>
                    {choice.effects.tech && `+${choice.effects.tech} Tech `}
                    {choice.effects.logical && `+${choice.effects.logical} Logic `}
                    {choice.effects.empathy && `+${choice.effects.empathy} Empathy`}
                  </div>
                )}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
