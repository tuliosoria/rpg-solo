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
  skillCheck?: {
    type: string;
    difficulty: 'easy' | 'medium' | 'hard';
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
  upgradeSelected?: 'tech' | 'logical' | 'empathy';
};

type SkillCheckResult = {
  roll: number;
  stat: number;
  total: number;
  dc: number;
  success: boolean;
};

export default function RpgSolo() {
  const [story, setStory] = useState<{ [key: string]: StoryNode } | null>(null);
  const [current, setCurrent] = useState('wake_1');
  const [gameState, setGameState] = useState<GameState>({
    tech: 5,
    logical: 5,
    empathy: 5,
    hasSkills: false
  });
  const [loading, setLoading] = useState(true);
  const [skillCheckInProgress, setSkillCheckInProgress] = useState(false);
  const [diceRoll, setDiceRoll] = useState<number | null>(null);
  const [skillCheckResult, setSkillCheckResult] = useState<SkillCheckResult | null>(null);
  const [storyData, setStoryData] = useState<any>(null);
  useEffect(() => {
    fetch('/story.json')
      .then(res => res.json())
      .then(data => {
        setStory(data.nodes);
        setStoryData(data);
        if (data.startNode) {
          setCurrent(data.startNode);
        }
        if (data.playerStats) {
          setGameState(prev => ({
            ...prev,
            tech: data.playerStats.tech,
            logical: data.playerStats.logical,
            empathy: data.playerStats.empathy
          }));
        }
        setLoading(false);
      })
      .catch(err => {
        console.error('Failed to load story:', err);
        setLoading(false);
      });
  }, []);

  const currentNode = story?.[current];
  const rollD20 = () => Math.floor(Math.random() * 20) + 1;

  const getDifficultyClass = (difficulty: 'easy' | 'medium' | 'hard'): number => {
    const dcs = storyData?.gameRules?.difficultyClasses;
    if (!dcs) return { easy: 10, medium: 15, hard: 20 }[difficulty];
    return dcs[difficulty] || 10;
  };

  const determineSkillCheckStat = (gameState: GameState): { stat: number, statName: string } => {
    // Determine which stat to use based on the upgrade selected
    if (gameState.upgradeSelected === 'tech' || gameState.tech > 5) {
      return { stat: gameState.tech, statName: 'Tech' };
    } else if (gameState.upgradeSelected === 'logical' || gameState.logical > 5) {
      return { stat: gameState.logical, statName: 'Logical' };
    } else if (gameState.upgradeSelected === 'empathy' || gameState.empathy > 5) {
      return { stat: gameState.empathy, statName: 'Empathy' };
    }
    // Default to the highest stat
    if (gameState.tech >= gameState.logical && gameState.tech >= gameState.empathy) {
      return { stat: gameState.tech, statName: 'Tech' };
    } else if (gameState.logical >= gameState.empathy) {
      return { stat: gameState.logical, statName: 'Logical' };
    } else {
      return { stat: gameState.empathy, statName: 'Empathy' };
    }
  };

  const performSkillCheck = async (choice: Choice): Promise<void> => {
    if (!choice.skillCheck) return;
    
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
    
    const { stat, statName } = determineSkillCheckStat(gameState);
    const dc = getDifficultyClass(choice.skillCheck.difficulty);
    const total = finalRoll + stat;
    const success = total >= dc;
    
    const result: SkillCheckResult = {
      roll: finalRoll,
      stat,
      total,
      dc,
      success
    };
    
    setSkillCheckResult(result);
    
    // Wait a moment to show the result
    setTimeout(() => {
      setSkillCheckInProgress(false);
      
      // Update the story text for tutorial_check_result node
      if (choice.nextNode === 'tutorial_check_result' && story) {
        const resultText = success 
          ? `SUCCESS! Your enhanced ${statName.toLowerCase()} abilities allow you to quickly parse through the security protocols.\n\nRoll: ${finalRoll} + ${statName}: ${stat} = ${total} vs DC ${dc}\n\n"Excellent," Chronos says with approval. "Your neural upgrade is functioning perfectly. The security analysis is complete—no threats detected."`
          : `The data streams past faster than you can process, even with your enhanced abilities.\n\nRoll: ${finalRoll} + ${statName}: ${stat} = ${total} vs DC ${dc}\n\n"No matter," Chronos reassures you. "The security protocols are mostly automated anyway. Your upgrade is still valuable for what lies ahead."`;
        
        // Update the node text dynamically
        const updatedStory = { ...story };
        if (updatedStory[choice.nextNode]) {
          updatedStory[choice.nextNode] = {
            ...updatedStory[choice.nextNode],
            text: resultText
          };
          setStory(updatedStory);
        }
      }
      
      setCurrent(choice.nextNode);
      setDiceRoll(null);
      setSkillCheckResult(null);
    }, 2000);
  };
  const handleChoice = (choice: Choice) => {
    if (choice.skillCheck) {
      performSkillCheck(choice);
      return;
    }

    // Handle upgrade nodes - special logic for when player reaches upgrade nodes
    if (current === 'skill_logical' || current === 'skill_empathic' || current === 'skill_technical') {
      setGameState(prev => {
        const newState = { ...prev };
        
        // Apply the upgrade bonus based on which skill node we're on
        if (current === 'skill_logical') {
          newState.logical = Math.min(10, prev.logical + 5); // +5 bonus, max 10
          newState.upgradeSelected = 'logical';
        } else if (current === 'skill_empathic') {
          newState.empathy = Math.min(10, prev.empathy + 5); // +5 bonus, max 10
          newState.upgradeSelected = 'empathy';
        } else if (current === 'skill_technical') {
          newState.tech = Math.min(10, prev.tech + 5); // +5 bonus, max 10
          newState.upgradeSelected = 'tech';
        }
        
        newState.hasSkills = true;
        return newState;
      });
    }

    // Handle regular choice effects (now mostly empty after stat bonus removal)
    if (choice.effects) {
      setGameState(prev => {
        const newState = {
          tech: choice.effects?.tech ? prev.tech + choice.effects.tech : prev.tech,
          logical: choice.effects?.logical ? prev.logical + choice.effects.logical : prev.logical,
          empathy: choice.effects?.empathy ? prev.empathy + choice.effects.empathy : prev.empathy,
          hasSkills: prev.hasSkills,
          upgradeSelected: prev.upgradeSelected
        };
        
        return newState;
      });
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
        </div>        {/* Stats - only show after skill selection */}
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

        {/* Skill Check Animation */}
        {skillCheckInProgress && (
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            marginBottom: '30px',
            padding: '20px',
            background: 'rgba(0, 255, 136, 0.1)',
            borderRadius: '10px',
            border: '1px solid #00ff88'
          }}>
            <div style={{ fontSize: '1.2rem', color: '#00ff88', marginBottom: '15px' }}>
              SKILL CHECK IN PROGRESS...
            </div>
            <div style={{
              width: '80px',
              height: '80px',
              background: 'linear-gradient(135deg, #ff6b6b, #4ecdc4)',
              borderRadius: '10px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '2rem',
              fontWeight: 'bold',
              color: 'white',
              animation: 'spin 0.5s linear infinite',
              boxShadow: '0 0 20px rgba(0, 255, 136, 0.5)'
            }}>
              {diceRoll || '?'}
            </div>
            {skillCheckResult && (
              <div style={{ marginTop: '15px', textAlign: 'center' }}>
                <div style={{ fontSize: '1.1rem', color: skillCheckResult.success ? '#00ff88' : '#ff6b6b' }}>
                  {skillCheckResult.success ? 'SUCCESS!' : 'FAILURE'}
                </div>
                <div style={{ fontSize: '0.9rem', color: '#b0b0b0', marginTop: '5px' }}>
                  Roll: {skillCheckResult.roll} + Stat: {skillCheckResult.stat} = {skillCheckResult.total} vs DC {skillCheckResult.dc}
                </div>
              </div>
            )}
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
