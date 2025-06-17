'use client';
import React, { useEffect, useState, useMemo, useRef } from 'react';

type Choice = { text: string; next: string };
type StoryNode = { text: string; choices: Choice[] };
type Story = { [key: string]: StoryNode };

export default function RpgSolo() {  const [story, setStory] = useState<Story | null>(null);
  const [current, setCurrent] = useState('start');
  const [typedLength, setTypedLength] = useState(0);
  const [isTyping, setIsTyping] = useState(false);
  const [showChoices, setShowChoices] = useState(false);
  const [fadeClass, setFadeClass] = useState('fade-in');
  const [skipTyping, setSkipTyping] = useState(false);
  const skipRef = useRef(false);
  useEffect(() => {
    fetch('/story.json')
      .then(res => res.json())
      .then(setStory);
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
  }, [current]);  // Typewriter effect for story text
  const currentNode = useMemo(() => story?.[current], [story, current]);
  
  useEffect(() => {
    if (!currentNode) return;
    
    setTypedLength(0);
    setShowChoices(false);
    setIsTyping(true);
    setSkipTyping(false);
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
    };  }, [currentNode]); // Removed skipTyping dependency

  const handleSkipTyping = () => {
    if (isTyping) {
      skipRef.current = true;
    }
  };

  const handleChoiceClick = (nextNode: string) => {
    setFadeClass('fade-out');
    setTimeout(() => {
      setCurrent(nextNode);
    }, 150);
  };

  if (!story) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Initializing Neural Interface...</p>
        <style jsx>{`
          .loading-container {
            min-height: 100vh;
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            background: linear-gradient(135deg, #0a0a0a 0%, #1a1a2e 50%, #16213e 100%);
            color: #64ffda;
            font-family: 'Courier New', monospace;
            font-size: 1.1rem;
          }
          .loading-spinner {
            width: 40px;
            height: 40px;
            border: 3px solid #333;
            border-top: 3px solid #64ffda;
            border-radius: 50%;
            animation: spin 1s linear infinite;
            margin-bottom: 20px;
          }
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    );
  }

  const node = story[current];
  return (
    <>
      <style jsx>{`
        @import url('https://fonts.googleapis.com/css2?family=Orbitron:wght@400;700;900&family=Exo+2:wght@300;400;600&display=swap');
        
        .container {
          min-height: 100vh;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          background: linear-gradient(135deg, #0a0a0a 0%, #1a1a2e 50%, #16213e 100%);
          background-attachment: fixed;
          font-family: 'Exo 2', sans-serif;
          color: #e0e0e0;
          padding: 20px;
          position: relative;
          overflow: hidden;
        }
        
        .container::before {
          content: '';
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: 
            radial-gradient(circle at 20% 50%, rgba(120, 119, 198, 0.1) 0%, transparent 50%),
            radial-gradient(circle at 80% 20%, rgba(255, 119, 198, 0.05) 0%, transparent 50%),
            radial-gradient(circle at 40% 80%, rgba(120, 219, 255, 0.05) 0%, transparent 50%);
          pointer-events: none;
          z-index: 0;
        }
        
        .story-card {
          background: rgba(15, 15, 25, 0.95);
          backdrop-filter: blur(20px);
          border-radius: 20px;
          box-shadow: 
            0 20px 40px rgba(0, 0, 0, 0.6),
            0 0 0 1px rgba(100, 255, 218, 0.1),
            inset 0 1px 0 rgba(255, 255, 255, 0.1);
          padding: 40px 32px;
          max-width: 700px;
          width: 100%;
          text-align: left;
          position: relative;
          z-index: 1;
          border: 1px solid rgba(100, 255, 218, 0.2);
        }
        
        .title {
          font-family: 'Orbitron', monospace;
          font-size: 2.5rem;
          font-weight: 900;
          margin-bottom: 1.5rem;
          text-align: center;
          background: linear-gradient(135deg, #64ffda 0%, #80deea 50%, #4fc3f7 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          text-shadow: 0 0 30px rgba(100, 255, 218, 0.3);
          letter-spacing: 2px;
        }        .story-text {
          font-size: 1.2rem;
          line-height: 1.8;
          margin-bottom: 2.5rem;
          color: #e0e0e0;
          text-align: justify;
          text-justify: inter-word;
          position: relative;
          white-space: pre-wrap;
          word-wrap: break-word;
          cursor: ${isTyping ? 'pointer' : 'default'};
          transition: opacity 0.2s ease;
        }
        
        .story-text:hover {
          opacity: ${isTyping ? '0.8' : '1'};
        }        .story-text::after {
          content: ${isTyping ? "'▊'" : "''"}; 
          color: #64ffda;
          animation: ${isTyping ? 'blink 1s infinite' : 'none'};
        }
        
        .skip-hint {
          position: absolute;
          bottom: 10px;
          right: 15px;
          font-size: 0.8rem;
          color: rgba(100, 255, 218, 0.6);
          opacity: ${isTyping ? '1' : '0'};
          transition: opacity 0.3s ease;
          pointer-events: none;
          font-family: 'Courier New', monospace;
        }
        
        .choices-container {
          opacity: ${showChoices ? '1' : '0'};
          transform: translateY(${showChoices ? '0' : '20px'});
          transition: all 0.5s ease;
        }
        
        .choice-button {
          display: block;
          width: 100%;
          margin: 16px 0;
          padding: 18px 24px;
          font-size: 1.1rem;
          font-weight: 600;
          font-family: 'Exo 2', sans-serif;
          border-radius: 12px;
          border: 2px solid transparent;
          background: linear-gradient(135deg, rgba(100, 255, 218, 0.15) 0%, rgba(129, 236, 236, 0.15) 100%);
          color: #e0e0e0;
          cursor: pointer;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
          position: relative;
          overflow: hidden;
          text-align: left;
        }
        
        .choice-button::before {
          content: '';
          position: absolute;
          top: 0;
          left: -100%;
          width: 100%;
          height: 100%;
          background: linear-gradient(90deg, transparent, rgba(100, 255, 218, 0.2), transparent);
          transition: left 0.5s;
        }
        
        .choice-button:hover {
          transform: translateY(-2px) scale(1.02);
          border-color: rgba(100, 255, 218, 0.4);
          background: linear-gradient(135deg, rgba(100, 255, 218, 0.25) 0%, rgba(129, 236, 236, 0.25) 100%);
          box-shadow: 0 8px 25px rgba(100, 255, 218, 0.15);
          color: #ffffff;
        }
        
        .choice-button:hover::before {
          left: 100%;
        }
        
        .choice-button:active {
          transform: translateY(0) scale(1);
        }
        
        .ending-text {
          margin-top: 2rem;
          font-size: 1.3rem;
          color: #64ffda;
          text-align: center;
          font-weight: 600;
          text-shadow: 0 0 10px rgba(100, 255, 218, 0.3);
        }
        
        .fade-in {
          opacity: 1;
          transform: translateY(0);
          transition: all 0.3s ease;
        }
        
        .fade-out {
          opacity: 0;
          transform: translateY(-10px);
          transition: all 0.15s ease;
        }
        
        @keyframes blink {
          0%, 50% { opacity: 1; }
          51%, 100% { opacity: 0; }
        }
        
        @media (max-width: 768px) {
          .story-card {
            padding: 24px 20px;
            margin: 10px;
          }
          
          .title {
            font-size: 2rem;
          }
          
          .story-text {
            font-size: 1.1rem;
            line-height: 1.7;
          }
          
          .choice-button {
            padding: 16px 20px;
            font-size: 1rem;
          }
        }
      `}</style>
      
      <div className="container">
        <div className={`story-card ${fadeClass}`}>
          <h1 className="title">Neural Command Interface</h1>          <div className="story-text" onClick={handleSkipTyping}>
            <span style={{ color: '#e0e0e0' }}>
              {currentNode?.text.slice(0, typedLength)}
            </span>
            <span style={{ color: 'transparent', userSelect: 'none' }}>
              {currentNode?.text.slice(typedLength)}
            </span>
          </div>
          
          <div className="skip-hint">
            Press ENTER or click to skip ⤷
          </div>
          
          <div className="choices-container">
            {node.choices.map((choice, idx) => (
              <button
                key={idx}
                className="choice-button"
                onClick={() => handleChoiceClick(choice.next)}
              >
                {choice.text}
              </button>
            ))}
            {node.choices.length === 0 && (
              <p className="ending-text">
                ◉ MISSION COMPLETE ◉
              </p>
            )}
          </div>
        </div>
      </div>
    </>
  );
}