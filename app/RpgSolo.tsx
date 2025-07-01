'use client';
import React, { useEffect, useState, useRef } from 'react';

// Typewriter hook for text animation
const useTypewriter = (text: string, speed: number = 30) => {
  const [displayText, setDisplayText] = useState('');
  const [isComplete, setIsComplete] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    setDisplayText('');
    setIsComplete(false);

    let i = 0;
    intervalRef.current = setInterval(() => {
      if (i < text.length) {
        setDisplayText(text.slice(0, i + 1));
        i++;
      } else {
        setIsComplete(true);
        if (intervalRef.current) clearInterval(intervalRef.current);
      }
    }, speed);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [text, speed]);

  const skipAnimation = () => {
    if (!isComplete) {
      setDisplayText(text);
      setIsComplete(true);
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    }
  };

  return { displayText, isComplete, skipAnimation };
};

type Choice = { 
  text: string; 
  nextNode: string; 
  requirements?: { tech?: number; logical?: number; empathy?: number; };
  effects?: { tech?: number; logical?: number; empathy?: number; };
  skillCheck?: {
    stat?: 'tech' | 'logical' | 'empathy';
    skill?: 'tech' | 'logical' | 'empathy';
    difficulty: 'easy' | 'medium' | 'hard' | number;
    success?: string;
    failure?: string;
    successNode?: string;
    failureNode?: string;
    type?: string;
  };
};

type StoryNode = {
  id: string;
  text: string;
  choices: Choice[];
  image?: string;
  effects?: { tech?: number; logical?: number; empathy?: number; };
  isGameOver?: boolean;
  gameOverReason?: string;
};

type GameState = {
  tech: number;
  logical: number;
  empathy: number;
  hasSkills: boolean;
  upgradeSelected?: 'tech' | 'logical' | 'empathy';
  chapter?: number;
};

type GameStats = {
  nodesVisited: number;
  skillCheckAttempts: number;
  skillCheckSuccesses: number;
  skillCheckFailures: number;
  chaptersCompleted: number;
};

type SkillCheckResult = {
  roll: number;
  stat: number;
  total: number;
  dc: number;
  success: boolean;
  nextNode?: string;
};

export default function RpgSolo() {
  const [story, setStory] = useState<{ [key: string]: StoryNode } | null>(null);
  const [current, setCurrent] = useState('wake_1');
  const [currentChapter, setCurrentChapter] = useState(1);
  const [gameState, setGameState] = useState<GameState>({
    tech: 5,
    logical: 5,
    empathy: 5,
    hasSkills: false
  });
  const [gameStats, setGameStats] = useState<GameStats>({
    nodesVisited: 0,
    skillCheckAttempts: 0,
    skillCheckSuccesses: 0,
    skillCheckFailures: 0,
    chaptersCompleted: 0
  });
  const [isGameOver, setIsGameOver] = useState(false);
  const [gameOverReason, setGameOverReason] = useState('');
  const [loading, setLoading] = useState(true);
  const [skillCheckInProgress, setSkillCheckInProgress] = useState(false);
  const [diceRoll, setDiceRoll] = useState<number | null>(null);
  const [skillCheckResult, setSkillCheckResult] = useState<SkillCheckResult | null>(null);
  const [storyData, setStoryData] = useState<any>(null);
  const [showTutorial, setShowTutorial] = useState(false);
  const [tutorialData, setTutorialData] = useState<{
    title: string;
    statName: string;
    statValue: number;
  } | null>(null);
  
  const loadChapter = async (chapterNumber: number) => {
    setLoading(true);
    try {
      const response = await fetch(`/chapter${chapterNumber}.json`);
      const data = await response.json();
      setStory(data.nodes);
      setStoryData(data);
      setCurrentChapter(chapterNumber);
      
      // Use the startNode from the data
      if (data.startNode) {
        setCurrent(data.startNode);
      } else {
        // Fallback for chapters without a specified start node
        const firstNodeKey = Object.keys(data.nodes)[0];
        setCurrent(firstNodeKey);
      }
    } catch (error) {
      console.error('Error loading chapter:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadChapter(1);
  }, []);

  const currentNode = story?.[current];
  
  // Function to clean story text for skill upgrade nodes
  const getCleanedText = (text: string, nodeId: string): string => {
    if (['skill_logical', 'skill_empathic', 'skill_technical'].includes(nodeId) && showTutorial) {
      // Remove the tutorial information when showing tutorial interface
      const lines = text.split('\n');
      const cleanedLines = [];
      let skipTutorial = false;
      
      for (const line of lines) {
        if (line.includes('UPGRADE INSTALLED') || line.includes('+ Your') || line.includes('+ All checks') || line.includes('- Easy:') || line.includes('- Medium:') || line.includes('- Hard:')) {
          skipTutorial = true;
          continue;
        }
        if (!skipTutorial) {
          cleanedLines.push(line);
        }
      }
      return cleanedLines.join('\n').trim();
    }
    return text;
  };
  
  // Typewriter animation for the current node text
  const nodeText = currentNode ? getCleanedText(currentNode.text, currentNode.id) : '';
  const { displayText, isComplete, skipAnimation } = useTypewriter(nodeText, 25);
  
  // Check for game over when current node changes
  useEffect(() => {
    if (currentNode && !loading && !isGameOver) {
      // Update node visit stats for the current node
      setGameStats(prev => ({
        ...prev,
        nodesVisited: prev.nodesVisited + 1
      }));

      // Check for game over conditions
      if (currentNode.isGameOver) {
        setIsGameOver(true);
        setGameOverReason(currentNode.gameOverReason || 'Game Over');
      }
    }
  }, [currentNode, loading, isGameOver]);

  const rollD20 = () => Math.floor(Math.random() * 20) + 1;

  const getDifficultyClass = (difficulty: 'easy' | 'medium' | 'hard'): number => {
    return { easy: 10, medium: 15, hard: 18 }[difficulty];
  };

  const determineSkillCheckStat = (gameState: GameState): { stat: number, statName: string } => {
    // Prioritize upgraded stat or highest stat
    if (gameState.upgradeSelected === 'tech' || gameState.tech > 5) {
      return { stat: gameState.tech, statName: 'Tech' };
    } else if (gameState.upgradeSelected === 'logical' || gameState.logical > 5) {
      return { stat: gameState.logical, statName: 'Logic' };
    } else if (gameState.upgradeSelected === 'empathy' || gameState.empathy > 5) {
      return { stat: gameState.empathy, statName: 'Empathy' };
    }
    
    // Default to highest stat
    const stats = [
      { stat: gameState.tech, statName: 'Tech' },
      { stat: gameState.logical, statName: 'Logic' },
      { stat: gameState.empathy, statName: 'Empathy' }
    ];
    return stats.reduce((highest, current) => current.stat > highest.stat ? current : highest);
  };

  const performSkillCheck = async (choice: Choice) => {
    if (!choice.skillCheck) return;

    const { difficulty, success, failure, successNode, failureNode } = choice.skillCheck;
    
    setSkillCheckInProgress(true);
    setSkillCheckResult(null);
    
    // Animate the dice roll
    const rollAnimation = async () => {
      for (let i = 0; i < 10; i++) {
        setDiceRoll(Math.floor(Math.random() * 20) + 1);
        await new Promise(resolve => setTimeout(resolve, 100));
      }
    };
    
    await rollAnimation();
    
    const finalRoll = rollD20();
    setDiceRoll(finalRoll);
    
    // Handle different difficulty formats
    let dc: number;
    if (typeof difficulty === 'number') {
      dc = difficulty;
    } else {
      dc = getDifficultyClass(difficulty);
    }
    
    const { stat, statName } = determineSkillCheckStat(gameState);
    const total = finalRoll + stat;
    const isSuccess = total >= dc;

    const result: SkillCheckResult = {
      roll: finalRoll,
      stat,
      total,
      dc,
      success: isSuccess
    };

    setSkillCheckResult(result);

    setGameStats(prev => ({
      ...prev,
      skillCheckAttempts: prev.skillCheckAttempts + 1,
      skillCheckSuccesses: prev.skillCheckSuccesses + (isSuccess ? 1 : 0),
      skillCheckFailures: prev.skillCheckFailures + (isSuccess ? 0 : 1)
    }));

    // Store the next node for manual continuation
    const nextNode = (() => {
      if (successNode && failureNode) {
        // New format: uses successNode/failureNode
        return isSuccess ? successNode : failureNode;
      } else if (success && failure) {
        // Old format: uses success/failure text as node IDs
        return isSuccess ? success : failure;
      } else {
        // Fallback to choice's nextNode
        return choice.nextNode;
      }
    })();
    
    // Store the next node in state for manual continuation
    setSkillCheckResult(prev => ({ ...prev!, nextNode }));
  };

  const canChoose = (choice: Choice): boolean => {
    if (!choice.requirements) return true;
    
    const { tech, logical, empathy } = choice.requirements;
    return (!tech || gameState.tech >= tech) &&
           (!logical || gameState.logical >= logical) &&
           (!empathy || gameState.empathy >= empathy);
  };

  const continueAfterSkillCheck = () => {
    if (!skillCheckResult?.nextNode) return;
    
    const nextNode = skillCheckResult.nextNode;
    
    // Clear skill check state
    setSkillCheckInProgress(false);
    setDiceRoll(null);
    setSkillCheckResult(null);
    
    // Handle chapter transitions
    if (nextNode === 'chapter2_1') {
      loadChapter(2);
    } else if (nextNode === 'chapter3_1') {
      loadChapter(3);
    } else {
      setCurrent(nextNode);
    }
  };

  const continueTutorial = () => {
    setShowTutorial(false);
    setTutorialData(null);
    // Continue to the tutorial skill check node
    setCurrent('tutorial_skill_check');
  };

  const handleChoice = (choice: Choice) => {
    if (skillCheckInProgress) return;

    // Apply stat effects first
    if (choice.effects) {
      setGameState(prev => ({
        ...prev,
        tech: Math.max(0, prev.tech + (choice.effects?.tech || 0)),
        logical: Math.max(0, prev.logical + (choice.effects?.logical || 0)),
        empathy: Math.max(0, prev.empathy + (choice.effects?.empathy || 0))
      }));
    }

    // Check for skill checks
    if (choice.skillCheck) {
      performSkillCheck(choice);
    } else {
      // Regular choice - handle chapter transitions and skill upgrades
      const nextNode = choice.nextNode;
      
      // Check for skill upgrades
      if (nextNode === 'skill_logical') {
        setGameState(prev => ({
          ...prev,
          logical: 10,
          upgradeSelected: 'logical',
          hasSkills: true
        }));
        setTutorialData({
          title: 'LOGICAL UPGRADE INSTALLED',
          statName: 'LOGICAL',
          statValue: 10
        });
        setShowTutorial(true);
      } else if (nextNode === 'skill_empathic') {
        setGameState(prev => ({
          ...prev,
          empathy: 10,
          upgradeSelected: 'empathy',
          hasSkills: true
        }));
        setTutorialData({
          title: 'EMPATHIC UPGRADE INSTALLED',
          statName: 'EMPATHY',
          statValue: 10
        });
        setShowTutorial(true);
      } else if (nextNode === 'skill_technical') {
        setGameState(prev => ({
          ...prev,
          tech: 10,
          upgradeSelected: 'tech',
          hasSkills: true
        }));
        setTutorialData({
          title: 'TECHNICAL UPGRADE INSTALLED',
          statName: 'TECH',
          statValue: 10
        });
        setShowTutorial(true);
      }
      
      // Check if this is a chapter transition
      if (nextNode === 'chapter2_1') {
        loadChapter(2);
      } else if (nextNode === 'chapter3_1') {
        loadChapter(3);
      } else {
        setCurrent(nextNode);
      }
    }
  };

  const restartGame = () => {
    setGameState({
      tech: 5,
      logical: 5,
      empathy: 5,
      hasSkills: false
    });
    setGameStats({
      nodesVisited: 0,
      skillCheckAttempts: 0,
      skillCheckSuccesses: 0,
      skillCheckFailures: 0,
      chaptersCompleted: 0
    });
    setIsGameOver(false);
    setGameOverReason('');
    setShowTutorial(false);
    setTutorialData(null);
    setCurrentChapter(1);
    loadChapter(1);
  };

  if (loading) {
    return (
      <div style={{ 
        minHeight: '100vh', 
        background: '#000000', 
        color: '#00ff00', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center',
        fontFamily: 'Courier New, Monaco, monospace'
      }}>
        Loading...
      </div>
    );
  }

  if (isGameOver) {
    const successRate = gameStats.skillCheckAttempts > 0 
      ? Math.round((gameStats.skillCheckSuccesses / gameStats.skillCheckAttempts) * 100) 
      : 0;

    return (
      <div style={{ 
        minHeight: '100vh', 
        background: '#000000',
        color: '#ff6b6b', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center',
        fontFamily: 'Courier New, Monaco, monospace',
        padding: '20px'
      }}>
        <div style={{
          background: 'rgba(255, 107, 107, 0.1)',
          border: '2px solid #ff6b6b',
          borderRadius: '10px',
          padding: '40px',
          maxWidth: '600px',
          textAlign: 'center',
          boxShadow: '0 0 20px rgba(255, 107, 107, 0.3)'
        }}>
          <h1 style={{ 
            color: '#ff6b6b', 
            fontSize: '2.6em', 
            marginBottom: '20px',
            textShadow: '0 0 10px rgba(255, 107, 107, 0.5)'
          }}>
            {gameOverReason}
          </h1>
          
          <div style={{ 
            background: 'rgba(255, 255, 255, 0.1)', 
            padding: '20px', 
            borderRadius: '8px', 
            marginBottom: '30px',
            border: '1px solid rgba(255, 255, 255, 0.2)'
          }}>
            <h2 style={{ color: '#4ecdc4', marginBottom: '15px' }}>Game Statistics</h2>
            <div style={{ textAlign: 'left', fontSize: '1.2em' }}>
              <p><strong>Nodes Explored:</strong> {gameStats.nodesVisited}</p>
              <p><strong>Skill Checks Attempted:</strong> {gameStats.skillCheckAttempts}</p>
              <p><strong>Successful Checks:</strong> {gameStats.skillCheckSuccesses}</p>
              <p><strong>Failed Checks:</strong> {gameStats.skillCheckFailures}</p>
              <p><strong>Success Rate:</strong> {successRate}%</p>
              <p><strong>Current Chapter:</strong> {currentChapter}</p>
            </div>
          </div>

          <button 
            onClick={restartGame}
            style={{
              background: 'linear-gradient(45deg, #00ff00, #00aa00)',
              color: 'black',
              border: 'none',
              padding: '15px 30px',
              fontSize: '1.3em',
              borderRadius: '8px',
              cursor: 'pointer',
              fontFamily: 'Courier New, Monaco, monospace',
              transition: 'all 0.3s ease',
              boxShadow: '0 4px 15px rgba(0, 255, 0, 0.3)'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-2px)';
              e.currentTarget.style.boxShadow = '0 6px 20px rgba(0, 255, 0, 0.4)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 4px 15px rgba(0, 255, 0, 0.3)';
            }}
          >
            🔄 Start New Adventure
          </button>
        </div>
      </div>
    );
  }

  if (!currentNode) {
    return (
      <div style={{ 
        minHeight: '100vh', 
        background: '#000000', 
        color: '#ff6b6b', 
        padding: '20px',
        fontFamily: 'Courier New, Monaco, monospace'
      }}>
        Story node not found: {current}
      </div>
    );
  }

  return (
    <div 
      style={{ 
        minHeight: '100vh', 
        background: '#000000',
        color: '#00ff00', 
        padding: '0',
        fontFamily: 'Courier New, Monaco, monospace',
        fontSize: '15px',
        lineHeight: '1.4',
        overflow: 'hidden',
        position: 'relative'
      }}
      onClick={skipAnimation} // Click anywhere to complete typewriter animation
    >
      {/* Terminal scan lines effect */}
      <div style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: `repeating-linear-gradient(
          0deg,
          transparent,
          transparent 2px,
          rgba(0, 255, 0, 0.03) 2px,
          rgba(0, 255, 0, 0.03) 4px
        )`,
        pointerEvents: 'none',
        zIndex: 1000
      }} />
      
      {/* Terminal container */}
      <div style={{ 
        maxWidth: '900px', 
        margin: '0 auto',
        padding: '20px',
        minHeight: '100vh',
        position: 'relative',
        zIndex: 1
      }}>
        {/* Terminal header */}
        <div style={{ 
          borderBottom: '1px solid #00ff00',
          paddingBottom: '10px',
          marginBottom: '20px'
        }}>        <div style={{ 
          color: '#00ff00', 
          fontSize: '17px', 
          fontWeight: 'bold' 
        }}>
            RPG SOLO TERMINAL v1.0 - Chapter {currentChapter}
          </div>
        </div>

        {/* Stats display - only show after neural upgrade is selected */}
        {gameState.hasSkills && (
          <div style={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            marginBottom: '20px',
            padding: '10px',
            border: '1px solid #00ff00',
            borderRadius: '5px',
            background: 'rgba(0, 255, 0, 0.05)'
          }}>
            <div>Tech: {gameState.tech}{gameState.upgradeSelected === 'tech' && gameState.tech === 10 ? ' (+5)' : ''}</div>
            <div>Logic: {gameState.logical}{gameState.upgradeSelected === 'logical' && gameState.logical === 10 ? ' (+5)' : ''}</div>
            <div>Empathy: {gameState.empathy}{gameState.upgradeSelected === 'empathy' && gameState.empathy === 10 ? ' (+5)' : ''}</div>
          </div>
        )}

        {/* Skill check in progress */}
        {skillCheckInProgress && (
          <div style={{
            border: '2px solid #ffff00',
            borderRadius: '10px',
            padding: '20px',
            marginBottom: '20px',
            background: 'rgba(255, 255, 0, 0.1)',
            textAlign: 'center'
          }}>
            <h3 style={{ color: '#ffff00', marginBottom: '15px' }}>🎲 SKILL CHECK</h3>
            
            {/* Dice animation phase */}
            {diceRoll && !skillCheckResult && (
              <div style={{ 
                fontSize: '3.1em', 
                marginBottom: '10px',
                transform: 'scale(1.1)',
                transition: 'transform 0.1s ease-in-out',
                filter: 'drop-shadow(0 0 10px #ffff00)'
              }}>
                🎲 {diceRoll}
              </div>
            )}
            
            {/* Results phase */}
            {skillCheckResult && (
              <>
                <div style={{ fontSize: '1.3em', marginBottom: '10px' }}>
                  Roll: {skillCheckResult.roll} + Stat: {skillCheckResult.stat} = Total: {skillCheckResult.total}
                </div>
                <div style={{ fontSize: '1.2em', marginBottom: '10px' }}>
                  Difficulty: {skillCheckResult.dc}
                </div>
                <div style={{ 
                  fontSize: '1.4em', 
                  fontWeight: 'bold',
                  color: skillCheckResult.success ? '#00ff00' : '#ff6b6b',
                  marginBottom: '15px'
                }}>
                  {skillCheckResult.success ? '✅ SUCCESS!' : '❌ FAILURE!'}
                </div>
                <button
                  onClick={continueAfterSkillCheck}
                  style={{
                    padding: '10px 20px',
                    backgroundColor: '#00ff00',
                    color: '#000000',
                    border: 'none',
                    borderRadius: '5px',
                    fontSize: '1.2em',
                    fontWeight: 'bold',
                    cursor: 'pointer',
                    fontFamily: 'Courier New, Monaco, monospace'
                  }}
                >
                  Continue
                </button>
              </>
            )}
          </div>
        )}

        {/* Tutorial interface for skill upgrades */}
        {showTutorial && tutorialData && (
          <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(0, 0, 0, 0.9)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 2000
          }}>
            <div style={{
              background: 'linear-gradient(135deg, #001a00, #003300)',
              border: '3px solid #00ff00',
              borderRadius: '15px',
              padding: '40px',
              maxWidth: '600px',
              width: '90%',
              boxShadow: '0 0 30px rgba(0, 255, 0, 0.5)',
              textAlign: 'center',
              position: 'relative'
            }}>
              {/* Header */}
              <div style={{
                color: '#00ff00',
                fontSize: '25px',
                fontWeight: 'bold',
                marginBottom: '20px',
                textTransform: 'uppercase',
                letterSpacing: '2px'
              }}>
                🧠 NEURAL UPGRADE COMPLETE 🧠
              </div>

              {/* Upgrade Title */}
              <div style={{
                color: '#ffff00',
                fontSize: '21px',
                fontWeight: 'bold',
                marginBottom: '25px',
                background: 'rgba(255, 255, 0, 0.1)',
                padding: '10px',
                borderRadius: '8px',
                border: '1px solid #ffff00'
              }}>
                {tutorialData.title}
              </div>

              {/* Stats Display */}
              <div style={{
                background: 'rgba(0, 255, 0, 0.1)',
                border: '2px solid #00ff00',
                borderRadius: '10px',
                padding: '20px',
                marginBottom: '25px'
              }}>
                <div style={{ color: '#00ff00', fontSize: '19px', marginBottom: '15px' }}>
                  ✅ All stats start at 5. With the upgrade, your {tutorialData.statName} stat was increased to {tutorialData.statValue}
                </div>
                
                <div style={{ color: '#ffffff', fontSize: '17px', lineHeight: '1.6' }}>
                  <div style={{ marginBottom: '10px', fontWeight: 'bold' }}>
                    🎲 All skill checks are: <span style={{ color: '#ffff00' }}>1d20 + stat vs DC</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-around', marginTop: '15px' }}>
                    <div>🟢 Easy: DC 10</div>
                    <div>🟡 Medium: DC 15</div>
                    <div>🔴 Hard: DC 20</div>
                  </div>
                </div>
              </div>

              {/* Continue Button */}
              <button
                onClick={continueTutorial}
                style={{
                  background: 'linear-gradient(135deg, #00ff00, #00cc00)',
                  color: '#000000',
                  border: 'none',
                  borderRadius: '8px',
                  padding: '15px 30px',
                  fontSize: '19px',
                  fontWeight: 'bold',
                  cursor: 'pointer',
                  textTransform: 'uppercase',
                  letterSpacing: '1px',
                  boxShadow: '0 4px 15px rgba(0, 255, 0, 0.3)',
                  transition: 'all 0.3s ease'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'scale(1.05)';
                  e.currentTarget.style.boxShadow = '0 6px 20px rgba(0, 255, 0, 0.4)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'scale(1)';
                  e.currentTarget.style.boxShadow = '0 4px 15px rgba(0, 255, 0, 0.3)';
                }}
              >
                Continue
              </button>
            </div>
          </div>
        )}

        {/* Image display */}
        {currentNode.image && (
          <div style={{ 
            textAlign: 'center', 
            marginBottom: '20px',
            border: '1px solid #00ff00',
            padding: '10px',
            borderRadius: '5px'
          }}>
            <img 
              src={`/${currentNode.image}`} 
              alt="Story illustration" 
              style={{ 
                maxWidth: '100%', 
                height: 'auto',
                border: '1px solid #00ff00',
                filter: 'sepia(100%) hue-rotate(90deg) saturate(2)'
              }}
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.style.display = 'none';
                const parent = target.parentElement;
                if (parent) {
                  parent.innerHTML = `<div style="color: #888; font-style: italic; padding: 20px;">
                    [Image not found: ${currentNode.image}]<br/>
                    <small>Please add the image file to the public directory</small>
                  </div>`;
                }
              }}
            />
          </div>
        )}

        {/* Story text with typewriter effect */}
        <div style={{ 
          fontSize: '15px', 
          lineHeight: '1.4', 
          margin: '20px 0', 
          whiteSpace: 'pre-wrap',
          minHeight: '200px',
          color: '#00ff00',
          fontFamily: 'Courier New, Monaco, monospace',
          letterSpacing: '0.5px'
        }}>
          {displayText}
          {!isComplete && (
            <span style={{ 
              color: '#00ff00',
              animation: 'blink 1s infinite'
            }}>▋</span>
          )}
        </div>

        {/* Choices - only show when not in skill check */}
        {!skillCheckInProgress && (
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
                    fontSize: '1.1rem',
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
                    <div style={{ fontSize: '0.9rem', color: '#ff6b6b', fontStyle: 'italic', marginTop: '5px' }}>
                      {choice.requirements.tech && `Tech ${choice.requirements.tech}+ `}
                      {choice.requirements.logical && `Logic ${choice.requirements.logical}+ `}
                      {choice.requirements.empathy && `Empathy ${choice.requirements.empathy}+`}
                    </div>
                  )}
                  {choice.effects && (
                    <div style={{ fontSize: '0.9rem', color: '#00ff88', fontStyle: 'italic', marginTop: '5px' }}>
                      {choice.effects.tech && `+${choice.effects.tech} Tech `}
                      {choice.effects.logical && `+${choice.effects.logical} Logic `}
                      {choice.effects.empathy && `+${choice.effects.empathy} Empathy`}
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
