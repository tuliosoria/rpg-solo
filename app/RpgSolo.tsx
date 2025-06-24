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
  const [currentChapter, setCurrentChapter] = useState(1);
  const [gameState, setGameState] = useState<GameState>({
    tech: 5,
    logical: 5,
    empathy: 5,
    hasSkills: false
  });
  const [loading, setLoading] = useState(true);
  const [skillCheckInProgress, setSkillCheckInProgress] = useState(false);
  const [diceRoll, setDiceRoll] = useState<number | null>(null);
  const [skillCheckResult, setSkillCheckResult] = useState<SkillCheckResult | null>(null);  const [storyData, setStoryData] = useState<any>(null);
  
  const loadChapter = async (chapterNumber: number) => {
    setLoading(true);
    try {
      const response = await fetch(`/chapter${chapterNumber}.json`);
      const data = await response.json();      setStory(data.nodes);
      setStoryData(data);
      setCurrentChapter(chapterNumber);
      
      // Use the startNode from the data
      if (data.startNode) {
        setCurrent(data.startNode);
      } else {
        // Fallback to default nodes
        if (chapterNumber === 1) {
          setCurrent('wake_1');
        } else if (chapterNumber === 2) {
          setCurrent('chapter_2_start');
        }
      }
      
      setLoading(false);
    } catch (err) {
      console.error(`Failed to load chapter ${chapterNumber}:`, err);
      setLoading(false);
    }
  };

  useEffect(() => {
    loadChapter(1); // Load Chapter 1 by default
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
  const generateMarsAnalysisText = (success: boolean, statName: string, roll: number, stat: number, total: number, dc: number): string => {
    const baseRoll = `Roll: ${roll} + ${statName}: ${stat} = ${total} vs DC ${dc}`;
    
    if (statName === 'Logical') {
      return success 
        ? `SUCCESS! Your enhanced logical processing quickly identifies potential sources for the mysterious signal.\n\n${baseRoll}\n\nYour analytical mind considers the possibilities: "The signal's origin point and frequency suggest it could be from an automated probe or research station. The pattern indicates either a distress beacon, scientific data transmission, or potentially... something more sophisticated trying to communicate."\n\nChronos nods approvingly. "Excellent deduction. Your logical upgrade is functioning perfectly."`
        : `Your logical processes strain to make sense of the complex data, but the analysis remains inconclusive.\n\n${baseRoll}\n\nThe signal's patterns seem to shift just as you think you're grasping their meaning. "The data is... contradictory," you admit. "Without more information, I cannot determine a definitive source."\n\nChronos reassures you: "No matter. The signal remains a mystery for now, but your upgrade will prove valuable when we reach Mars."`;
    } else if (statName === 'Tech') {
      return success 
        ? `SUCCESS! Your technical analysis reveals fascinating details about the signal's composition and transmission method.\n\n${baseRoll}\n\nYour enhanced technical intuition dissects the signal: "This is using a modulated quantum encryption protocol - far more advanced than standard communication arrays. The carrier wave suggests it's being transmitted through both conventional radio and quantum entanglement channels simultaneously."\n\nChronos sounds intrigued. "Impressive. That level of technical sophistication suggests the source is highly advanced."`
        : `The technical complexity of the signal overwhelms your analysis systems, leaving you with more questions than answers.\n\n${baseRoll}\n\nFragmented data streams cascade across your neural interface. "The encryption is... beyond anything in our databases," you report. "Multiple overlapping protocols, some I don't recognize."\n\nChronos responds calmly: "Don't worry. We'll have better equipment to analyze it once we reach Mars."`;
    } else { // Empathy
      return success 
        ? `SUCCESS! Your empathic abilities detect something profound within the signal - an emotional resonance that speaks to consciousness and intent.\n\n${baseRoll}\n\nBeneath the technical data, you sense something deeper: "There's... feeling in this signal. Not just automated transmission - there's intention, maybe even desperation. Someone or something is trying to communicate, and they're... lonely? Afraid?"\n\nChronos pauses before responding: "Fascinating. If you're right, we may not be investigating a simple malfunction, but a first contact scenario."`
        : `You try to sense any emotional undertones in the signal, but the alien nature of the transmission makes it difficult to interpret.\n\n${baseRoll}\n\nThe signal feels... strange. Foreign. "I can sense there's something intentional about it," you report uncertainly, "but whatever consciousness might be behind it is too different from human emotion for me to read clearly."\n\nChronos acknowledges: "Perhaps proximity will help. Your empathic upgrade may prove crucial when we're closer to the source."`;
    }
  };

  const generateChapter2SkillCheckText = (nodeId: string, success: boolean, statName: string, roll: number, stat: number, total: number, dc: number): string => {
    const baseRoll = `Roll: ${roll} + ${statName}: ${stat} = ${total} vs DC ${dc}`;

    switch (nodeId) {
      case 'frequency_check':
        return success 
          ? `SUCCESS! Your enhanced abilities decode the frequency pattern.\n\n${baseRoll}\n\nThe humming is not random—it's a countdown. Something is preparing to wake up, and your arrival has accelerated the process.\n\nChronos: "We need to move quickly. Whatever's down there knows we're here."`
          : `The frequency overwhelms your neural processing systems.\n\n${baseRoll}\n\nStatic fills your mind. The humming grows louder, more insistent. Your enhanced abilities aren't enough to decode its alien pattern.\n\nChronos: "Pull back. The interference is damaging your neural matrix."`;

      case 'neural_skill_check':
        return success 
          ? `SUCCESS! You establish a stable neural link with the structure.\n\n${baseRoll}\n\nThe hatch peels open silently. Inside: darkness shaped into a hallway. The structure accepts you as authorized.\n\nChronos: "Impressive. You've gained administrative access."`
          : `FAILURE! The neural interface rejects your connection violently.\n\n${baseRoll}\n\nAn alarm shrieks across dimensions. The door opens violently—forceful, uninviting. Defense systems activate.\n\nChronos: "Brace yourself. You've triggered something hostile."`;

      case 'override_skill_check':
        return success 
          ? `SUCCESS! You push through the neural override.\n\n${baseRoll}\n\nThe terminal unfolds like a blooming flower. Inside, a message written in your own handwriting.\n\nChronos: "Replica 37 sent this... 'Don't trust me. The Hive is in all of us now.'"\n\nA chill runs down your spine.`
          : `FAILURE! The neural override backfires catastrophically.\n\n${baseRoll}\n\nAlarms explode around you. Gas leaks from unseen vents. Spikes emerge from the walls, seeking flesh.\n\nChronos: "Move! Now!"`;

      case 'mirror_skill_check':
        return success 
          ? `SUCCESS! You resist the mirror's pull.\n\n${baseRoll}\n\nYou yank your hand free just as the mirror cracks—revealing a tunnel behind it. The reflection screams silently as it shatters.\n\nChronos: "You broke something sacred. Be careful."`
          : `FAILURE! The mirror claims you.\n\n${baseRoll}\n\nYou vanish into the reflection. No scream. No trace. Just your image... smiling back at nothing.\n\n**GAME OVER**`;

      case 'stone_skill_check':
        return success 
          ? `SUCCESS! The stone resonates with your touch.\n\n${baseRoll}\n\nYou remember holding Lucy for the first time—but this isn't your memory. It belongs to another Replica.\n\nChronos: "You've unlocked memory fragments from Replica 37. She was here... and she learned something terrible."`
          : `FAILURE! The stone drains your essence.\n\n${baseRoll}\n\nYou black out. When you wake, your arm is missing—not damaged, simply gone, as if it never existed.\n\nChronos: "We need to leave. Now. This place is feeding on you."`;

      case 'disconnect_skill_check':
        return success 
          ? `SUCCESS! You sever the Hive connection.\n\n${baseRoll}\n\nYou yank the neural plug free. Pain explodes through your skull, then blessed silence.\n\nChronos: "You did it. Barely. The Hive is offline... for now. But something has changed in you."`
          : `FAILURE! The Hive overwhelms your will.\n\n${baseRoll}\n\nLight blinds you. When it fades, you are smiling—but the smile isn't yours.\n\n**GAME OVER**`;

      case 'resistance_skill_check':
        return success 
          ? `SUCCESS! Your will proves stronger than the Hive.\n\n${baseRoll}\n\nA scream tears through the chamber—not yours, but the Hive's. It recoils from your defiance.\n\nChronos: "You're still you. We can still stop this."`
          : `FAILURE! The Hive breaks your resistance.\n\n${baseRoll}\n\nYour eyes go blank. When you stand, the Hive wears your face like a mask.\n\n**GAME OVER**`;

      case 'joint_escape_skill_check':
        return success 
          ? `SUCCESS! You both squeeze through together.\n\n${baseRoll}\n\nBarely. Bruised, bleeding, but alive. The tunnel collapses behind you as you emerge into Martian daylight.\n\nLucy: "We made it... we both made it."`
          : `FAILURE! The tunnel collapses.\n\n${baseRoll}\n\nMetal tears. Lucy is impaled by falling debris. She gasps your name once before the light fades from her eyes.\n\n**GAME OVER**`;

      default:
        return success 
          ? `SUCCESS! Your enhanced abilities prove adequate.\n\n${baseRoll}\n\nYou overcome the challenge through skill and determination.`
          : `FAILURE! The task proves beyond your current capabilities.\n\n${baseRoll}\n\nYou are unable to succeed despite your best efforts.`;
    }
  };

  const performSkillCheck = async (choice: Choice): Promise<void> => {
    if (!choice.skillCheck) return;
    
    setSkillCheckInProgress(true);
    setSkillCheckResult(null);
    
    // Animate the dice roll
    const rollAnimation = async () => {
      for (let i = 0; i < 15; i++) {
        setDiceRoll(Math.floor(Math.random() * 20) + 1);
        await new Promise(resolve => setTimeout(resolve, 80));
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
        // Update the story text for skill check result nodes
      if (choice.nextNode && story) {
        let resultText = '';
        
        if (choice.nextNode === 'tutorial_check_result') {
          resultText = generateMarsAnalysisText(success, statName, finalRoll, stat, total, dc);
        } else {
          // Handle Chapter 2 skill checks
          resultText = generateChapter2SkillCheckText(choice.nextNode, success, statName, finalRoll, stat, total, dc);
        }
        
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
    }, 2500);
  };  const handleChoice = (choice: Choice) => {
    if (choice.skillCheck) {
      performSkillCheck(choice);
      return;
    }

    // Handle chapter transitions
    if (choice.nextNode === 'chapter_2_start' && currentChapter === 1) {
      loadChapter(2);
      return;
    }

    // Handle upgrade nodes - special logic for when player reaches upgrade nodes
    if (current === 'skill_logical' || current === 'skill_empathic' || current === 'skill_technical') {
      setGameState(prev => {
        const newState = { ...prev };
        
        // Apply the upgrade: set the chosen stat to 10 (5 base + 5 upgrade)
        if (current === 'skill_logical') {
          newState.logical = 10;
          newState.upgradeSelected = 'logical';
        } else if (current === 'skill_empathic') {
          newState.empathy = 10;
          newState.upgradeSelected = 'empathy';
        } else if (current === 'skill_technical') {
          newState.tech = 10;
          newState.upgradeSelected = 'tech';
        }
        
        newState.hasSkills = true;
        return newState;
      });
    }

    // Handle regular choice effects (now mostly empty after stat bonus removal)
    if (choice.effects) {
      setGameState(prev => ({
        tech: choice.effects?.tech ? prev.tech + choice.effects.tech : prev.tech,
        logical: choice.effects?.logical ? prev.logical + choice.effects.logical : prev.logical,
        empathy: choice.effects?.empathy ? prev.empathy + choice.effects.empathy : prev.empathy,
        hasSkills: prev.hasSkills,
        upgradeSelected: prev.upgradeSelected
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
            A consciousness awakens in a new body, tasked with investigating mysterious signals from Mars
          </p>
          
          {/* Chapter Selector */}
          <div style={{ 
            marginTop: '20px', 
            display: 'flex', 
            justifyContent: 'center', 
            gap: '10px' 
          }}>
            <button
              onClick={() => loadChapter(1)}
              style={{
                background: currentChapter === 1 ? '#00ff88' : 'rgba(255, 255, 255, 0.1)',
                color: currentChapter === 1 ? '#000' : '#e0e0e0',
                border: 'none',
                padding: '8px 16px',
                borderRadius: '5px',
                cursor: 'pointer',
                fontFamily: 'monospace',
                fontWeight: 'bold'
              }}
            >
              Chapter 1
            </button>
            <button
              onClick={() => loadChapter(2)}
              style={{
                background: currentChapter === 2 ? '#00ff88' : 'rgba(255, 255, 255, 0.1)',
                color: currentChapter === 2 ? '#000' : '#e0e0e0',
                border: 'none',
                padding: '8px 16px',
                borderRadius: '5px',
                cursor: 'pointer',
                fontFamily: 'monospace',
                fontWeight: 'bold'
              }}
            >
              Chapter 2
            </button>
          </div>
        </div>{/* Stats - only show after upgrade mechanic is introduced */}
        {gameState.upgradeSelected && (
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
              <div style={{ 
                fontSize: '1.5rem', 
                color: gameState.upgradeSelected === 'tech' ? '#00ff88' : '#666', 
                fontWeight: 'bold' 
              }}>
                {gameState.tech}
              </div>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '0.9rem', color: '#888' }}>LOGICAL</div>
              <div style={{ 
                fontSize: '1.5rem', 
                color: gameState.upgradeSelected === 'logical' ? '#00ff88' : '#666', 
                fontWeight: 'bold' 
              }}>
                {gameState.logical}
              </div>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '0.9rem', color: '#888' }}>EMPATHY</div>
              <div style={{ 
                fontSize: '1.5rem', 
                color: gameState.upgradeSelected === 'empathy' ? '#00ff88' : '#666', 
                fontWeight: 'bold' 
              }}>
                {gameState.empathy}
              </div>
            </div>
          </div>        )}

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
              ANALYZING MARS SIGNAL...
            </div>
            <div style={{
              width: '100px',
              height: '100px',
              background: 'linear-gradient(135deg, #ff6b6b, #4ecdc4)',
              borderRadius: '15px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '2.5rem',
              fontWeight: 'bold',
              color: 'white',
              animation: 'spin 0.3s linear infinite',
              boxShadow: '0 0 30px rgba(0, 255, 136, 0.6)',
              border: '3px solid #00ff88'
            }}>
              {diceRoll || '?'}
            </div>
            {skillCheckResult && (
              <div style={{ marginTop: '15px', textAlign: 'center' }}>
                <div style={{ fontSize: '1.3rem', color: skillCheckResult.success ? '#00ff88' : '#ff6b6b', fontWeight: 'bold' }}>
                  {skillCheckResult.success ? 'ANALYSIS SUCCESSFUL!' : 'ANALYSIS INCONCLUSIVE'}
                </div>
                <div style={{ fontSize: '1rem', color: '#b0b0b0', marginTop: '8px' }}>
                  D20 Roll: {skillCheckResult.roll} + Stat: {skillCheckResult.stat} = {skillCheckResult.total} vs DC {skillCheckResult.dc}
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
