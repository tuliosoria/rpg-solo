'use client';
import React, { useEffect, useState, useMemo, useRef } from 'react';

type Archetype = 'logical' | 'empathic' | 'technical' | null;

type Choice = { 
  text: string; 
  next: string;
  type?: 'normal' | 'skill_check' | 'memory_prompt' | 'hijack_consciousness' | 'identity_check' | 'empathy_override' | 'logic_gate' | 'tech_hack';
  archetype?: Archetype;
  difficulty?: 'easy' | 'normal' | 'hard';
  requirements?: {
    archetypeSuccesses?: number;
    memoryFragments?: number;
    humanityScore?: number;
    previousChoices?: string[];
  };
  consequences?: {
    humanityShift?: number;
    unlockPath?: string;
    lockPath?: string;
  };
};

type StoryNode = { 
  text: string; 
  choices: Choice[];
  memoryPrompt?: string;
  hijackAvailable?: boolean;
};

type Story = { [key: string]: StoryNode };

type GameState = {
  archetype: Archetype;
  skillChecksUsed: number;
  memoryPromptsUsed: number;
  hijackUsesRemaining: number;
  totalChoicesMade: number;
  archetypeChoicesSuccessful: number;
  humanityScore: number;
  memoryFragments: string[];
  unlockedPaths: string[];
  lockedPaths: string[];
  choiceHistory: string[];
  moralChoices: {
    compassionate: number;
    pragmatic: number;
    ruthless: number;
  };
};

export default function RpgSolo() {
  const [story, setStory] = useState<Story | null>(null);
  const [current, setCurrent] = useState('start');
  const [typedLength, setTypedLength] = useState(0);
  const [isTyping, setIsTyping] = useState(false);
  const [showChoices, setShowChoices] = useState(false);
  const [fadeClass, setFadeClass] = useState('fade-in');
  const [skipTyping, setSkipTyping] = useState(false);  const [gameState, setGameState] = useState<GameState>({
    archetype: null,
    skillChecksUsed: 0,
    memoryPromptsUsed: 0,
    hijackUsesRemaining: 3,
    totalChoicesMade: 0,
    archetypeChoicesSuccessful: 0,
    humanityScore: 50, // Start neutral (0-100 scale)
    memoryFragments: [],
    unlockedPaths: [],
    lockedPaths: [],
    choiceHistory: [],
    moralChoices: {
      compassionate: 0,
      pragmatic: 0,
      ruthless: 0
    }
  });
  const [showArchetypeSelection, setShowArchetypeSelection] = useState(false);
  const [showSkillCheckResult, setShowSkillCheckResult] = useState<{show: boolean, success: boolean, text: string}>({show: false, success: false, text: ''});
  const [showMemoryPrompt, setShowMemoryPrompt] = useState<{show: boolean, text: string}>({show: false, text: ''});
  const [showHijackConfirm, setShowHijackConfirm] = useState<{show: boolean, choice: Choice | null}>({show: false, choice: null});
  const skipRef = useRef(false);  useEffect(() => {
    fetch('/story.json')
      .then(res => res.json())
      .then(setStory);
  }, []);

  // Show archetype selection when story loads and no archetype chosen
  useEffect(() => {
    if (story && gameState.archetype === null && current === 'start') {
      setShowArchetypeSelection(true);
    }
  }, [story, gameState.archetype, current]);
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

  const selectArchetype = (archetype: Archetype) => {
    setGameState(prev => ({ ...prev, archetype }));
    setShowArchetypeSelection(false);
  };

  const performSkillCheck = (choice: Choice): boolean => {
    const baseSuccess = 0.5; // 50% base chance
    const archetypeBonus = choice.archetype === gameState.archetype ? 0.3 : 0; // +30% for matching archetype
    const difficultyModifier = choice.difficulty === 'easy' ? 0.1 : choice.difficulty === 'hard' ? -0.1 : 0;
    
    const successChance = Math.min(0.95, baseSuccess + archetypeBonus + difficultyModifier);
    const success = Math.random() < successChance;
    
    setGameState(prev => ({
      ...prev,
      skillChecksUsed: prev.skillChecksUsed + 1,
      archetypeChoicesSuccessful: success && choice.archetype === gameState.archetype ? 
        prev.archetypeChoicesSuccessful + 1 : prev.archetypeChoicesSuccessful
    }));
    
    return success;
  };
  const handleMemoryPrompt = (memoryText: string) => {
    setShowMemoryPrompt({ show: true, text: memoryText });
    setGameState(prev => ({ 
      ...prev, 
      memoryPromptsUsed: prev.memoryPromptsUsed + 1,
      memoryFragments: [...prev.memoryFragments, memoryText]
    }));
  };

  const handleHijackAttempt = (choice: Choice) => {
    if (gameState.hijackUsesRemaining > 0) {
      setShowHijackConfirm({ show: true, choice });
    }
  };

  const confirmHijack = () => {
    if (showHijackConfirm.choice) {
      setGameState(prev => ({ 
        ...prev, 
        hijackUsesRemaining: prev.hijackUsesRemaining - 1,
        totalChoicesMade: prev.totalChoicesMade + 1
      }));
      setShowHijackConfirm({ show: false, choice: null });
      handleChoiceClick(showHijackConfirm.choice.next);
    }
  };
  const handleChoiceClick = (nextNode: string, choice?: Choice) => {
    if (choice) {
      // Check requirements before allowing choice
      if (choice.requirements && !meetsRequirements(choice.requirements)) {
        return; // Don't process choice if requirements not met
      }

      // Update choice history and apply consequences
      setGameState(prev => {
        let newState = { 
          ...prev, 
          totalChoicesMade: prev.totalChoicesMade + 1,
          choiceHistory: [...prev.choiceHistory, choice.text]
        };

        // Apply consequences
        if (choice.consequences) {
          if (choice.consequences.humanityShift) {
            newState.humanityScore = Math.max(0, Math.min(100, 
              newState.humanityScore + choice.consequences.humanityShift
            ));
          }
          if (choice.consequences.unlockPath) {
            newState.unlockedPaths = [...newState.unlockedPaths, choice.consequences.unlockPath];
          }
          if (choice.consequences.lockPath) {
            newState.lockedPaths = [...newState.lockedPaths, choice.consequences.lockPath];
          }
        }

        // Track moral alignment
        if (choice.text.toLowerCase().includes('help') || choice.text.toLowerCase().includes('save')) {
          newState.moralChoices.compassionate += 1;
        } else if (choice.text.toLowerCase().includes('practical') || choice.text.toLowerCase().includes('logical')) {
          newState.moralChoices.pragmatic += 1;
        } else if (choice.text.toLowerCase().includes('eliminate') || choice.text.toLowerCase().includes('destroy')) {
          newState.moralChoices.ruthless += 1;
        }

        return newState;
      });

      // Handle different choice types
      if (choice.type === 'skill_check') {
        const success = performSkillCheck(choice);
        setShowSkillCheckResult({ 
          show: true, 
          success, 
          text: success ? 
            `Success! Your ${choice.archetype} expertise proves invaluable.` :
            `Despite your efforts, the challenge proves too difficult.`
        });
        
        // If failed, might show alternative path or consequence
        if (!success) {
          // Could redirect to failure node if it exists
          // For now, continue to the intended node but with consequence
        }
      } else if (choice.type === 'memory_prompt') {
        const memoryText = currentNode?.memoryPrompt || "What would the real Dr. Korvain have done?";
        handleMemoryPrompt(memoryText);
        return; // Don't proceed until memory prompt is resolved
      } else if (choice.type === 'hijack_consciousness') {
        handleHijackAttempt(choice);
        return; // Don't proceed until hijack is confirmed/denied
      } else if (choice.type === 'identity_check') {
        handleIdentityCheck(choice);
        return;
      }
    }

    setFadeClass('fade-out');
    setTimeout(() => {
      setCurrent(nextNode);
    }, 150);
  };

  const meetsRequirements = (requirements: NonNullable<Choice['requirements']>): boolean => {
    if (requirements.archetypeSuccesses && gameState.archetypeChoicesSuccessful < requirements.archetypeSuccesses) {
      return false;
    }
    if (requirements.memoryFragments && gameState.memoryFragments.length < requirements.memoryFragments) {
      return false;
    }
    if (requirements.humanityScore && gameState.humanityScore < requirements.humanityScore) {
      return false;
    }
    if (requirements.previousChoices) {
      const hasAllChoices = requirements.previousChoices.every(choice => 
        gameState.choiceHistory.some(made => made.includes(choice))
      );
      if (!hasAllChoices) return false;
    }
    return true;
  };

  const handleIdentityCheck = (choice: Choice) => {
    const humanityLevel = gameState.humanityScore;
    let resultText = "";
    
    if (humanityLevel > 70) {
      resultText = "Your humanity remains strong. You choose compassion over efficiency.";
    } else if (humanityLevel < 30) {
      resultText = "Your digital nature asserts itself. Logic overrides emotion.";
    } else {
      resultText = "You struggle between human values and digital precision.";
    }
    
    setShowSkillCheckResult({ 
      show: true, 
      success: true, 
      text: resultText
    });
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
        
        .choice-button.archetype-match {
          border-color: rgba(100, 255, 218, 0.6);
          background: linear-gradient(135deg, rgba(100, 255, 218, 0.3) 0%, rgba(129, 236, 236, 0.3) 100%);
        }
        
        .choice-button.skill-check {
          border-left: 4px solid #64ffda;
        }
        
        .choice-button.memory-prompt {
          border-left: 4px solid #bb86fc;
        }
        
        .choice-button.hijack_consciousness {
          border-left: 4px solid #ff6b6b;
        }
        
        .choice-button:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }
        
        .choice-content {
          display: flex;
          justify-content: space-between;
          align-items: center;
          width: 100%;
        }
        
        .choice-text {
          flex: 1;
        }
        
        .choice-indicator {
          font-size: 0.9rem;
          padding: 4px 8px;
          border-radius: 8px;
          margin-left: 12px;
          font-weight: 600;
        }
        
        .choice-indicator.skill-check {
          background: rgba(100, 255, 218, 0.2);
          color: #64ffda;
        }
        
        .choice-indicator.memory-prompt {
          background: rgba(187, 134, 252, 0.2);
          color: #bb86fc;
        }
          .choice-indicator.hijack {
          background: rgba(255, 107, 107, 0.2);
          color: #ff6b6b;
        }
        
        .choice-indicator.identity-check {
          background: rgba(156, 39, 176, 0.2);
          color: #9c27b0;
        }
        
        .choice-indicator.humanity-shift.positive {
          background: rgba(76, 175, 80, 0.2);
          color: #4caf50;
        }
        
        .choice-indicator.humanity-shift.negative {
          background: rgba(244, 67, 54, 0.2);
          color: #f44336;
        }
        
        .choice-indicator.archetype-bonus {
          background: rgba(255, 193, 7, 0.2);
          color: #ffc107;
        }
        
        .archetype-selection {
          padding: 20px 0;
        }
        
        .archetype-title {
          color: #64ffda;
          font-size: 1.4rem;
          margin-bottom: 12px;
          text-align: center;
        }
        
        .archetype-description {
          color: #b0b0b0;
          margin-bottom: 24px;
          text-align: center;
        }
        
        .archetype-button {
          display: block;
          width: 100%;
          margin: 12px 0;
          padding: 20px;
          border: 2px solid transparent;
          border-radius: 12px;
          background: linear-gradient(135deg, rgba(100, 255, 218, 0.1) 0%, rgba(129, 236, 236, 0.1) 100%);
          color: #e0e0e0;
          cursor: pointer;
          transition: all 0.3s ease;
          text-align: left;
        }
        
        .archetype-button:hover {
          transform: translateY(-2px);
          border-color: rgba(100, 255, 218, 0.4);
          background: linear-gradient(135deg, rgba(100, 255, 218, 0.2) 0%, rgba(129, 236, 236, 0.2) 100%);
        }
        
        .archetype-button.logical:hover {
          border-color: rgba(64, 196, 255, 0.6);
        }
        
        .archetype-button.empathic:hover {
          border-color: rgba(187, 134, 252, 0.6);
        }
        
        .archetype-button.technical:hover {
          border-color: rgba(255, 193, 7, 0.6);
        }
        
        .archetype-name {
          display: block;
          font-size: 1.2rem;
          font-weight: 700;
          margin-bottom: 6px;
        }
        
        .archetype-desc {
          display: block;
          font-size: 0.95rem;
          opacity: 0.8;
        }
        
        .final-stats {
          margin-top: 20px;
          padding: 20px;
          background: rgba(100, 255, 218, 0.1);
          border-radius: 12px;
          border: 1px solid rgba(100, 255, 218, 0.2);
        }
          .final-stats p {
          margin: 8px 0;
          color: #b0b0b0;
        }
        
        .status-display {
          display: flex;
          flex-wrap: wrap;
          gap: 16px;
          margin-bottom: 20px;
          padding: 12px 16px;
          background: rgba(100, 255, 218, 0.05);
          border-radius: 8px;
          border: 1px solid rgba(100, 255, 218, 0.1);
        }
        
        .status-item {
          display: flex;
          align-items: center;
          gap: 6px;
        }
        
        .status-label {
          font-size: 0.9rem;
          color: #888;
          font-weight: 500;
        }
        
        .status-value {
          font-size: 0.9rem;
          font-weight: 600;
          padding: 2px 8px;
          border-radius: 4px;
        }
        
        .status-value.archetype-logical {
          background: rgba(64, 196, 255, 0.2);
          color: #40c4ff;
        }
        
        .status-value.archetype-empathic {
          background: rgba(187, 134, 252, 0.2);
          color: #bb86fc;
        }
        
        .status-value.archetype-technical {
          background: rgba(255, 193, 7, 0.2);
          color: #ffc107;
        }
        
        .status-value.humanity-high {
          background: rgba(76, 175, 80, 0.2);
          color: #4caf50;
        }
        
        .status-value.humanity-mid {
          background: rgba(255, 193, 7, 0.2);
          color: #ffc107;
        }
        
        .status-value.humanity-low {
          background: rgba(244, 67, 54, 0.2);
          color: #f44336;
        }
        
        .status-value.hijack-remaining {
          background: rgba(255, 107, 107, 0.2);
          color: #ff6b6b;
        }
        
        .moral-alignment {
          margin-top: 12px;
          padding-top: 12px;
          border-top: 1px solid rgba(100, 255, 218, 0.2);
        }
        
        .modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: rgba(0, 0, 0, 0.8);
          display: flex;
          justify-content: center;
          align-items: center;
          z-index: 1000;
          backdrop-filter: blur(5px);
        }
        
        .modal-content {
          background: rgba(15, 15, 25, 0.95);
          border-radius: 20px;
          padding: 30px;
          max-width: 500px;
          width: 90%;
          border: 1px solid rgba(100, 255, 218, 0.3);
          box-shadow: 0 20px 40px rgba(0, 0, 0, 0.6);
        }
        
        .skill-result-title {
          font-size: 1.3rem;
          margin-bottom: 16px;
          text-align: center;
        }
        
        .skill-result-title.success {
          color: #4caf50;
        }
        
        .skill-result-title.failure {
          color: #f44336;
        }
        
        .skill-result-text {
          color: #e0e0e0;
          line-height: 1.6;
          margin-bottom: 20px;
          text-align: center;
        }
        
        .memory-title {
          color: #bb86fc;
          font-size: 1.3rem;
          margin-bottom: 16px;
          text-align: center;
        }
          .memory-text {
          color: #e0e0e0;
          line-height: 1.6;
          margin-bottom: 20px;
          text-align: center;
          font-style: italic;
        }
        
        .memory-stats {
          background: rgba(187, 134, 252, 0.1);
          border: 1px solid rgba(187, 134, 252, 0.2);
          border-radius: 8px;
          padding: 12px;
          margin-bottom: 20px;
          font-size: 0.9rem;
        }
        
        .memory-stats p {
          margin: 4px 0;
          color: #bb86fc;
        }
        
        .memory-actions {
          display: flex;
          gap: 12px;
          justify-content: center;
          flex-wrap: wrap;
        }
        
        .hijack-title {
          color: #ff6b6b;
          font-size: 1.3rem;
          margin-bottom: 16px;
          text-align: center;
        }
        
        .hijack-warning {
          color: #ffeb3b;
          font-weight: 600;
          margin-bottom: 16px;
          text-align: center;
          background: rgba(255, 235, 59, 0.1);
          padding: 12px;
          border-radius: 8px;
          border: 1px solid rgba(255, 235, 59, 0.3);
        }
        
        .hijack-uses {
          color: #e0e0e0;
          margin-bottom: 20px;
          text-align: center;
        }
        
        .hijack-actions {
          display: flex;
          gap: 12px;
          justify-content: center;
        }
        
        .modal-button {
          padding: 12px 24px;
          border: 2px solid transparent;
          border-radius: 8px;
          background: linear-gradient(135deg, rgba(100, 255, 218, 0.2) 0%, rgba(129, 236, 236, 0.2) 100%);
          color: #e0e0e0;
          cursor: pointer;
          transition: all 0.3s ease;
          font-weight: 600;
        }
        
        .modal-button:hover {
          transform: translateY(-2px);
          border-color: rgba(100, 255, 218, 0.4);
        }
        
        .modal-button.memory-yes {
          background: linear-gradient(135deg, rgba(187, 134, 252, 0.2) 0%, rgba(187, 134, 252, 0.3) 100%);
        }
        
        .modal-button.memory-yes:hover {
          border-color: rgba(187, 134, 252, 0.6);
        }
        
        .modal-button.hijack-confirm {
          background: linear-gradient(135deg, rgba(255, 107, 107, 0.2) 0%, rgba(255, 107, 107, 0.3) 100%);
        }
        
        .modal-button.hijack-confirm:hover {
          border-color: rgba(255, 107, 107, 0.6);
        }
        
        .modal-button.hijack-cancel {
          background: linear-gradient(135deg, rgba(76, 175, 80, 0.2) 0%, rgba(76, 175, 80, 0.3) 100%);
        }
        
        .modal-button.hijack-cancel:hover {
          border-color: rgba(76, 175, 80, 0.6);
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
          <h1 className="title">Neural Command Interface</h1>
          
          {/* Dynamic Status Display */}
          {!showArchetypeSelection && gameState.archetype && (
            <div className="status-display">
              <div className="status-item">
                <span className="status-label">Archetype:</span>
                <span className={`status-value archetype-${gameState.archetype}`}>
                  {gameState.archetype?.toUpperCase()}
                </span>
              </div>
              <div className="status-item">
                <span className="status-label">Humanity:</span>
                <span className={`status-value humanity-${
                  gameState.humanityScore > 70 ? 'high' : 
                  gameState.humanityScore < 30 ? 'low' : 'mid'
                }`}>
                  {gameState.humanityScore}/100
                </span>
              </div>
              {gameState.memoryFragments.length > 0 && (
                <div className="status-item">
                  <span className="status-label">Memories:</span>
                  <span className="status-value">{gameState.memoryFragments.length}</span>
                </div>
              )}
              {gameState.hijackUsesRemaining < 3 && (
                <div className="status-item">
                  <span className="status-label">Overrides:</span>
                  <span className="status-value hijack-remaining">{gameState.hijackUsesRemaining}</span>
                </div>
              )}
            </div>
          )}          <div className="story-text" onClick={handleSkipTyping}>
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
            {showArchetypeSelection && (
              <div className="archetype-selection">
                <h3 className="archetype-title">Select Dr. Korvain's Background</h3>
                <p className="archetype-description">
                  Choose the archetype that will shape how Dr. Korvain approaches challenges:
                </p>
                <button
                  className="archetype-button logical"
                  onClick={() => selectArchetype('logical')}
                >
                  <span className="archetype-name">Logical</span>
                  <span className="archetype-desc">Scientist rooted in analysis and rationality</span>
                </button>
                <button
                  className="archetype-button empathic"
                  onClick={() => selectArchetype('empathic')}
                >
                  <span className="archetype-name">Empathic</span>
                  <span className="archetype-desc">Humanitarian guided by emotional intelligence</span>
                </button>
                <button
                  className="archetype-button technical"
                  onClick={() => selectArchetype('technical')}
                >
                  <span className="archetype-name">Technical</span>
                  <span className="archetype-desc">Engineer with hands-on problem-solving expertise</span>
                </button>
              </div>
            )}
              {!showArchetypeSelection && node.choices
              .filter(choice => !choice.requirements || meetsRequirements(choice.requirements))
              .map((choice, idx) => (
              <button
                key={idx}
                className={`choice-button ${choice.type || 'normal'} ${choice.archetype === gameState.archetype ? 'archetype-match' : ''}`}
                onClick={() => handleChoiceClick(choice.next, choice)}
                disabled={choice.type === 'hijack_consciousness' && gameState.hijackUsesRemaining === 0}
              >
                <div className="choice-content">
                  <span className="choice-text">{choice.text}</span>
                  {choice.type === 'skill_check' && (
                    <span className="choice-indicator skill-check">
                      🎯 {choice.archetype === gameState.archetype ? '80%' : '50%'}
                    </span>
                  )}
                  {choice.type === 'memory_prompt' && (
                    <span className="choice-indicator memory-prompt">💭 Memory</span>
                  )}
                  {choice.type === 'hijack_consciousness' && (
                    <span className="choice-indicator hijack">
                      🧠 Override ({gameState.hijackUsesRemaining} left)
                    </span>
                  )}
                  {choice.type === 'identity_check' && (
                    <span className="choice-indicator identity-check">🤔 Identity</span>
                  )}
                  {choice.archetype === gameState.archetype && choice.type !== 'skill_check' && (
                    <span className="choice-indicator archetype-bonus">✨ Expertise</span>
                  )}
                  {choice.consequences?.humanityShift && (
                    <span className={`choice-indicator humanity-shift ${choice.consequences.humanityShift > 0 ? 'positive' : 'negative'}`}>
                      {choice.consequences.humanityShift > 0 ? '❤️' : '🤖'} {Math.abs(choice.consequences.humanityShift)}
                    </span>
                  )}
                </div>
              </button>
            ))}
            
            {currentNode?.memoryPrompt && (
              <button
                className="choice-button memory-prompt"
                onClick={() => handleMemoryPrompt(currentNode.memoryPrompt!)}
              >
                <div className="choice-content">
                  <span className="choice-text">💭 What would the real Dr. Korvain have done?</span>
                  <span className="choice-indicator memory-prompt">Memory ({gameState.memoryPromptsUsed} used)</span>
                </div>
              </button>
            )}
              {node.choices.length === 0 && !showArchetypeSelection && (
              <div className="ending-section">
                <p className="ending-text">◉ MISSION COMPLETE ◉</p>
                <div className="final-stats">
                  <p>Archetype: {gameState.archetype}</p>
                  <p>Choices Made: {gameState.totalChoicesMade}</p>
                  <p>Skill Checks: {gameState.skillChecksUsed}</p>
                  <p>Archetype Successes: {gameState.archetypeChoicesSuccessful}</p>
                  <p>Memory Fragments: {gameState.memoryFragments.length}</p>
                  <p>Hijack Uses Remaining: {gameState.hijackUsesRemaining}</p>
                  <p>Humanity Score: {gameState.humanityScore}/100</p>
                  <div className="moral-alignment">
                    <p>Moral Alignment:</p>
                    <p>• Compassionate: {gameState.moralChoices.compassionate}</p>
                    <p>• Pragmatic: {gameState.moralChoices.pragmatic}</p>
                    <p>• Ruthless: {gameState.moralChoices.ruthless}</p>
                  </div>
                </div>
              </div>
            )}
          </div>        </div>
      </div>

      {/* Skill Check Result Modal */}
      {showSkillCheckResult.show && (
        <div className="modal-overlay" onClick={() => setShowSkillCheckResult({show: false, success: false, text: ''})}>
          <div className="modal-content skill-check-modal" onClick={e => e.stopPropagation()}>
            <h3 className={`skill-result-title ${showSkillCheckResult.success ? 'success' : 'failure'}`}>
              {showSkillCheckResult.success ? '✅ Success!' : '❌ Challenge Failed'}
            </h3>
            <p className="skill-result-text">{showSkillCheckResult.text}</p>
            <button 
              className="modal-button"
              onClick={() => setShowSkillCheckResult({show: false, success: false, text: ''})}
            >
              Continue
            </button>
          </div>
        </div>
      )}      {/* Memory Prompt Modal */}
      {showMemoryPrompt.show && (
        <div className="modal-overlay" onClick={() => setShowMemoryPrompt({show: false, text: ''})}>
          <div className="modal-content memory-modal" onClick={e => e.stopPropagation()}>
            <h3 className="memory-title">💭 Memory Fragment</h3>
            <p className="memory-text">{showMemoryPrompt.text}</p>
            <div className="memory-stats">
              <p>Collected Memory Fragments: {gameState.memoryFragments.length}</p>
              <p>Humanity Score: {gameState.humanityScore}/100</p>
            </div>
            <div className="memory-actions">
              <button 
                className="modal-button memory-yes"
                onClick={() => {
                  setGameState(prev => ({ ...prev, humanityShift: prev.humanityScore + 5 }));
                  setShowMemoryPrompt({show: false, text: ''});
                  // Could unlock special path or dialogue
                }}
              >
                Embrace Original Values (+5 Humanity)
              </button>
              <button 
                className="modal-button memory-no"
                onClick={() => {
                  setGameState(prev => ({ ...prev, humanityShift: prev.humanityScore - 3 }));
                  setShowMemoryPrompt({show: false, text: ''});
                }}
              >
                Forge New Identity (-3 Humanity)
              </button>
              <button 
                className="modal-button memory-neutral"
                onClick={() => setShowMemoryPrompt({show: false, text: ''})}
              >
                Simply Remember (No Change)
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Hijack Consciousness Confirmation Modal */}
      {showHijackConfirm.show && (
        <div className="modal-overlay">
          <div className="modal-content hijack-modal" onClick={e => e.stopPropagation()}>
            <h3 className="hijack-title">🧠 Neural Override Protocol</h3>
            <p className="hijack-warning">
              WARNING: This action will temporarily override another person's consciousness. 
              This is a permanent ethical violation that cannot be undone.
            </p>
            <p className="hijack-uses">Remaining Uses: {gameState.hijackUsesRemaining}</p>
            <div className="hijack-actions">
              <button 
                className="modal-button hijack-confirm"
                onClick={confirmHijack}
              >
                Authorize Override
              </button>
              <button 
                className="modal-button hijack-cancel"
                onClick={() => setShowHijackConfirm({show: false, choice: null})}
              >
                Maintain Autonomy
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}