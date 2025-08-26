'use client';
import React, { useEffect, useState, useRef, useMemo } from 'react';

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
  gameOver?: boolean; // accept legacy/alternate JSON key
  gameOverReason?: string;
  // Added optional metadata to help identify epilogues
  title?: string;
  epilogue?: boolean;
  skillCheck?: {
    stat?: 'tech' | 'logical' | 'empathy';
    difficulty: number | string;
    successNode: string;
    failureNode: string;
  };
  friendship?: { [character: string]: number }; // optional node-wide friendship adjustments
};

type GameState = {
  tech: number;
  logical: number;
  empathy: number;
  hasSkills: boolean;
  upgradeSelected?: 'tech' | 'logical' | 'empathy';
  chapter?: number;
  friendship?: { [character: string]: number }; // dynamic relationship map
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

type SavedGame = {
  version: number;
  timestamp: number;
  chapter: number;
  current: string;
  gameState: GameState;
  gameStats: GameStats;
  isGameOver?: boolean;
  gameOverReason?: string;
  title?: string;
};

export default function RpgSolo({ onExitToMenu, initialLoad }: { onExitToMenu?: () => void; initialLoad?: SavedGame }) {
  const [story, setStory] = useState<{ [key: string]: StoryNode } | null>(null);
  const [current, setCurrent] = useState('sinal_1');
  const [currentChapter, setCurrentChapter] = useState(1);
  const [gameState, setGameState] = useState<GameState>({
    tech: 5,
    logical: 5,
    empathy: 5,
  hasSkills: false,
  friendship: { Helena: 0, Dudu: 0, Leo: 0, Ágata: 0 }
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
  // New epilogue state
  const [isEpilogue, setIsEpilogue] = useState(false);
  const [generatedEpilogue, setGeneratedEpilogue] = useState<string | null>(null);
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
  const [showExitModal, setShowExitModal] = useState(false);

  const loadChapter = async (chapterNumber: number) => {
    setLoading(true);
    try {
      const ts = Date.now();
      // Primeiro tenta arquivo revisado
      const revisedName = `/capitulo${chapterNumber}_revisado.json?ts=${ts}`;
      const legacyName = `/chapter${chapterNumber}.json?ts=${ts}`;
      let response = await fetch(revisedName, { cache: 'no-store' });
      if (!response.ok) {
        response = await fetch(legacyName, { cache: 'no-store' });
      }
      const data = await response.json();

      // Conversão de schema: 'options' -> 'choices'
      const mapSkill = (skill?: string): 'tech' | 'logical' | 'empathy' | undefined => {
        if (!skill) return undefined;
        const s = skill.toLowerCase();
        if (s.includes('tec')) return 'tech';
        if (s.includes('lóg') || s.includes('logi')) return 'logical';
        if (s.includes('emp')) return 'empathy';
  if (s.includes('corag')) return 'tech'; // Map "Coragem" heuristically to tech (adjust later if new stat added)
        // Mapear outras (agilidade/força) heurísticamente para 'tech'
        if (s.includes('agi') || s.includes('for')) return 'tech';
        return undefined;
      };
      const mapDifficulty = (dc?: string): 'easy' | 'medium' | 'hard' => {
        if (!dc) return 'medium';
        const d = dc.toLowerCase();
        if (d.startsWith('fá') || d.startsWith('fa') || d.includes('fac')) return 'easy';
        if (d.startsWith('mé') || d.startsWith('me') || d.includes('méd')) return 'medium';
        if (d.startsWith('dif') || d.includes('díf')) return 'hard';
        return 'medium';
      };

      if (data && data.nodes) {
        // Explicit node -> image mapping only (avoid heuristic false positives)
        const explicitNodeImages: { [k: string]: string } = {
          c1_dudu: 'dudu.png'
        };
        const converted: { [key: string]: StoryNode } = {};
        Object.entries<any>(data.nodes).forEach(([key, node]) => {
          if (node && !node.choices && node.options) {
            node.choices = node.options.map((opt: any, idx: number) => {
              const choice: any = {
                id: `${node.id || key}_opt${idx}`,
                text: opt.label || opt.text || `Opção ${idx + 1}`,
                nextNode: opt.to || opt.next || opt.nextNode || key, // fallback para permanecer
              };
              // Suporte a formato legado com 'check' + 'success'/'failure'
              if (opt.check) {
                const stat = mapSkill(opt.check.skill);
                const difficulty = mapDifficulty(opt.check.dc);
                // Buscar nós de sucesso/falha explícitos
                let successNode = opt.success?.to || opt.success?.next || opt.success?.nextNode;
                let failureNode = opt.failure?.to || opt.failure?.next || opt.failure?.nextNode;
                // Fallbacks: se não houver, usar o 'to' principal
                if (!successNode) successNode = choice.nextNode;
                if (!failureNode) failureNode = successNode; // se só sucesso definido, falha cai no mesmo
                choice.skillCheck = {
                  stat,
                  difficulty,
                  successNode,
                  failureNode
                };
                // Caso haja efeitos diferentes em sucesso/falha e queira-se tratar depois, manter referências originais em choice
                if (opt.success?.effects) choice.successEffects = opt.success.effects;
                if (opt.failure?.effects) choice.failureEffects = opt.failure.effects;
              } else if (opt.skill || opt.dc) {
                // Formato simplificado anterior
                const stat = mapSkill(opt.skill);
                const difficulty = mapDifficulty(opt.dc);
                choice.skillCheck = {
                  stat,
                  difficulty,
                  successNode: choice.nextNode,
                  failureNode: choice.nextNode
                };
              }
              return choice;
            });
          }
          // Assign only if explicitly declared in JSON or mapping
          let autoImage = node.image || explicitNodeImages[node.id || key];
          converted[key] = {
            id: node.id || key,
            text: node.text || '',
            title: node.title,
            image: autoImage,
            choices: node.choices || [],
            skillCheck: node.skillCheck,
            gameOver: node.gameOver || node.isGameOver || false,
            epilogue: node.epilogue,
            friendship: node.effects?.friendship || node.friendship || undefined
          } as StoryNode;
        });
        setStory(converted);
        setStoryData(data);
        setCurrentChapter(chapterNumber);
        if (data.startNode) {
          setCurrent(data.startNode);
        } else {
          const firstNodeKey = Object.keys(converted)[0];
          setCurrent(firstNodeKey);
        }
      } else {
        setStory(null);
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

  // Apply saved game if provided
  const appliedSaveRef = useRef(false);
  useEffect(() => {
    if (initialLoad && !appliedSaveRef.current) {
      appliedSaveRef.current = true;
      const applySave = async () => {
        try {
          setGameState(initialLoad.gameState);
          setGameStats(initialLoad.gameStats);
          setIsGameOver(!!initialLoad.isGameOver);
          setGameOverReason(initialLoad.gameOverReason || '');
          await loadChapter(initialLoad.chapter);
          setCurrent(initialLoad.current);
        } catch (e) {
          console.error('Failed to apply saved game:', e);
        }
      };
      applySave();
    }
  }, [initialLoad]);

  const currentNode = story?.[current];

  // Helper to detect if a node represents an epilogue
  const nodeIsEpilogue = (node?: StoryNode | null): boolean => {
    if (!node) return false;
    if (node.epilogue) return true;
    const id = node.id?.toLowerCase() || '';
    // Check Portuguese spelling present in content files
    const title = (node.title || '').toLowerCase();
    return id.includes('epilogo') || title.includes('epilogo');
  };
  
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
  
  // Helper: chunk long text into paragraphs for readability
  const chunkTextToParagraphs = (text: string, sentencesPerParagraph: number = 2): string[] => {
    if (!text) return [];
    // Split by sentence endings
    const sentences = text
      .replace(/\s+/g, ' ') // normalize whitespace
      .split(/(?<=[.!?…])\s+/)
      .filter(Boolean);
    if (sentences.length <= sentencesPerParagraph) return [text.trim()];
    const paras: string[] = [];
    for (let i = 0; i < sentences.length; i += sentencesPerParagraph) {
      paras.push(sentences.slice(i, i + sentencesPerParagraph).join(' '));
    }
    return paras;
  };
  
  // Typewriter animation for the current node text
  const nodeText = currentNode ? getCleanedText(currentNode.text, currentNode.id) : '';
  const { displayText, isComplete, skipAnimation } = useTypewriter(nodeText, 25);
  const paragraphs = useMemo(() => chunkTextToParagraphs(displayText, 2), [displayText]);
  
  // Check for game over when current node changes
  useEffect(() => {
    if (currentNode && !loading && !isGameOver && !isEpilogue) {
      // Update node visit stats for the current node
      setGameStats(prev => ({
        ...prev,
        nodesVisited: prev.nodesVisited + 1
      }));

      // Check for skill check in the current node
      if (currentNode.skillCheck && !skillCheckInProgress) {
        performNodeSkillCheck(currentNode.skillCheck);
      }

      // If it's explicitly an epilogue node, always show epilogue screen
      if (nodeIsEpilogue(currentNode)) {
        setIsEpilogue(true);
        setIsGameOver(false);
        setGameOverReason('');
        return;
      }

      // Check for game over conditions (support both keys)
      if (currentNode.isGameOver || currentNode.gameOver) {
        if (currentChapter === 5) {
          // For any Chapter 5 ending branch, show Epilogue screen
          setGeneratedEpilogue(computeGeneratedEpilogue());
          setIsEpilogue(true);
          setIsGameOver(false);
          setGameOverReason('');
        } else {
          // Earlier chapters keep the classic Game Over
          setIsGameOver(true);
          setGameOverReason(currentNode.gameOverReason || 'Game Over');
        }
      }
    }
  }, [currentNode, loading, isGameOver, isEpilogue, currentChapter]);

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
        // Friendship effects for success/failure (new schema captured in successEffects/failureEffects)
        if (isSuccess && (choice as any).successEffects?.friendship) {
          const fr = (choice as any).successEffects.friendship as Record<string, number>;
          setGameState(prev => ({
            ...prev,
            friendship: Object.entries(fr).reduce((acc, [char, delta]) => {
              acc[char] = (prev.friendship?.[char] || 0) + delta;
              return acc;
            }, { ...(prev.friendship || {}) })
          }));
          setLastFriendshipDelta(fr);
        } else if (!isSuccess && (choice as any).failureEffects?.friendship) {
          const fr = (choice as any).failureEffects.friendship as Record<string, number>;
          setGameState(prev => ({
            ...prev,
            friendship: Object.entries(fr).reduce((acc, [char, delta]) => {
              acc[char] = (prev.friendship?.[char] || 0) + delta;
              return acc;
            }, { ...(prev.friendship || {}) })
          }));
          setLastFriendshipDelta(fr);
        }
        return isSuccess ? successNode : failureNode;
      } else if (success && failure) {
        return isSuccess ? success : failure;
      } else {
        return choice.nextNode;
      }
    })();
    
    // Store the next node in state for manual continuation
    setSkillCheckResult(prev => ({ ...prev!, nextNode }));
  };

  const performNodeSkillCheck = async (nodeSkillCheck: { stat?: 'tech' | 'logical' | 'empathy'; difficulty: number | string; successNode: string; failureNode: string; }) => {
    const { difficulty, successNode, failureNode } = nodeSkillCheck;
    
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
      // For node skill checks, convert string to number or use default
      dc = parseInt(difficulty) || 10;
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
    const nextNode = isSuccess ? successNode : failureNode;
    
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
      return;
    } else if (nextNode === 'chapter3_1') {
      loadChapter(3);
      return;
    } else if (nextNode === 'chapter4_1') {
      loadChapter(4);
      return;
    } else if (nextNode === 'chapter5_1') {
      loadChapter(5);
      return;
    }
    setCurrent(nextNode);
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

    // Friendship adjustments (direct choice effects)
    if ((choice as any).effects?.friendship) {
      const fr = (choice as any).effects.friendship as Record<string, number>;
      setGameState(prev => ({
        ...prev,
        friendship: Object.entries(fr).reduce((acc, [char, delta]) => {
          acc[char] = (prev.friendship?.[char] || 0) + delta;
          return acc;
        }, { ...(prev.friendship || {}) })
      }));
      setLastFriendshipDelta(fr);
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
        return;
      } else if (nextNode === 'chapter3_1') {
        loadChapter(3);
        return;
      } else if (nextNode === 'chapter4_1') {
        loadChapter(4);
        return;
      } else if (nextNode === 'chapter5_1') {
        loadChapter(5);
        return;
      }
      setCurrent(nextNode);
    }
  };

  const restartChapter = () => {
    // Reset game state but keep current chapter and skills
    setGameState(prev => ({
      ...prev,
      // Keep skills and upgrades but reset to healthy state
    }));
    setGameStats({
      nodesVisited: 0,
      skillCheckAttempts: 0,
      skillCheckSuccesses: 0,
      skillCheckFailures: 0,
      chaptersCompleted: 0
    });
    setIsGameOver(false);
    setIsEpilogue(false);
    setGeneratedEpilogue(null);
    setGameOverReason('');
    setShowTutorial(false);
    setTutorialData(null);

    // Return to the beginning of current chapter using the chapter's own startNode when available
    const getStartFor = (ch: number): string => {
      if (storyData?.startNode) return storyData.startNode;
      switch (ch) {
        case 1: return 'sinal_1';
        case 2: return 'visitante_1'; // chapter 2 real start node
        case 3: return 'chapter3_1';
        case 4: return 'cerco_1';
        case 5: return 'chapter5_1';
        default: return 'sinal_1';
      }
    };
    setCurrent(getStartFor(currentChapter));
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
    setIsEpilogue(false);
    setGeneratedEpilogue(null);
    setGameOverReason('');
    setShowTutorial(false);
    setTutorialData(null);
    setCurrentChapter(1);
    loadChapter(1);
  };

  // Track last friendship delta to show transient feedback
  const [lastFriendshipDelta, setLastFriendshipDelta] = useState<Record<string, number> | null>(null);
  useEffect(() => {
    if (lastFriendshipDelta) {
      const t = setTimeout(() => setLastFriendshipDelta(null), 3500);
      return () => clearTimeout(t);
    }
  }, [lastFriendshipDelta]);

  // Save & Exit helpers
  const buildSaveObject = (): SavedGame => ({
    version: 1,
    timestamp: Date.now(),
    chapter: currentChapter,
    current,
    gameState,
    gameStats,
    isGameOver,
    gameOverReason,
    title: storyData?.title
  });

  const saveGame = () => {
    try {
      const save = buildSaveObject();
      localStorage.setItem('rpgsolo_save_v1', JSON.stringify(save));
      return true;
    } catch (e) {
      console.error('Failed to save game:', e);
      return false;
    }
  };

  const exitToMenu = (save: boolean) => {
    if (save) {
      saveGame();
    }
    setShowExitModal(false);
    setIsEpilogue(false);
    setGeneratedEpilogue(null);
    if (onExitToMenu) onExitToMenu();
  };

  // Small generator to produce a fallback epilogue for any ending
  const computeGeneratedEpilogue = (): string => {
    const successRate = gameStats.skillCheckAttempts > 0
      ? Math.round((gameStats.skillCheckSuccesses / gameStats.skillCheckAttempts) * 100)
      : 0;
    const chapterLabel = `Capítulo ${currentChapter}`;
    const pathHint = successRate >= 60 ? 'um traço de esperança' : 'ecos de algo que ficou para trás';
    return [
      `Epilogo — ${chapterLabel}`,
      '',
      `Depois dos eventos, o mundo seguiu diferente. Seus passos deixaram marcas sutis: Tech ${gameState.tech}, Lógica ${gameState.logical}, Empatia ${gameState.empathy}.`,
      `Você encarou ${gameStats.nodesVisited} cenas e venceu ${successRate}% dos testes. Há ${pathHint} no ar — e histórias que continuam nas sombras.`,
      'Seus registros permanecem, e o silêncio também. Algumas noites… parecem responder.'
    ].join('\n');
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

  // Dedicated Epilogue Screen
  if (isEpilogue) {
    const epilogueText = nodeIsEpilogue(currentNode) && currentNode?.text ? currentNode.text : (generatedEpilogue || computeGeneratedEpilogue());
    const epilogueParagraphs = chunkTextToParagraphs(epilogueText, 2);
    return (
      <div style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        background: 'radial-gradient(circle at center, #000014 0%, #001a1a 60%, #000000 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontFamily: 'Courier New, Monaco, monospace',
        color: '#aaffaa',
        overflow: 'hidden',
        zIndex: 10000
      }}>
        {/* Soft scanlines */}
        <div style={{
          position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
          background: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,255,128,0.05) 2px, rgba(0,255,128,0.05) 4px)'
        }} />

        <div style={{
          position: 'relative',
          background: 'linear-gradient(135deg, rgba(0,20,0,0.9) 0%, rgba(0,35,0,0.95) 60%, rgba(0,0,0,0.9) 100%)',
          border: '2px solid #00ff88',
          borderRadius: 10,
          padding: '40px 30px',
          maxWidth: 900,
          width: '94%',
          textAlign: 'left',
          boxShadow: '0 0 40px rgba(0,255,136,0.2)'
        }}>
          <div style={{ fontSize: '2.2em', color: '#00ff88', fontWeight: 'bold', textAlign: 'center', marginBottom: 10 }}>
            EPÍLOGO
          </div>
          {currentNode?.image && (
            <div style={{ textAlign: 'center', margin: '10px 0 20px 0' }}>
              <img src={`/${currentNode.image}`} alt="Epilogue illustration" style={{ maxWidth: '100%', height: 'auto', border: '1px solid #00ff88', borderRadius: 6, filter: 'sepia(90%) hue-rotate(90deg) saturate(1.6)' }} />
            </div>
          )}
          <div style={{ fontSize: 16, lineHeight: 1.7, color: '#d6ffd6' }}>
            {epilogueParagraphs.map((p, i) => (
              <p key={i} style={{ margin: '0 0 14px 0' }}>{p}</p>
            ))}
          </div>

          <div style={{ display: 'flex', gap: 12, justifyContent: 'center', marginTop: 24, flexWrap: 'wrap' }}>
            <button onClick={restartChapter} style={{ padding: '12px 18px', border: '1px solid #00ff88', background: 'rgba(0,255,136,0.12)', color: '#e6ffe6', borderRadius: 8, cursor: 'pointer', minWidth: 220 }}>⟲ Reiniciar Capítulo</button>
            <button onClick={restartGame} style={{ padding: '12px 18px', border: '1px solid #88ffaa', background: 'rgba(255,255,255,0.06)', color: '#e6ffe6', borderRadius: 8, cursor: 'pointer', minWidth: 220 }}>☘ Novo Jogo</button>
            {onExitToMenu && (
              <button onClick={() => setShowExitModal(true)} style={{ padding: '12px 18px', border: '1px solid #00ff88', background: 'rgba(0,0,0,0.35)', color: '#e6ffe6', borderRadius: 8, cursor: 'pointer', minWidth: 220 }}>↩ Voltar ao Menu</button>
            )}
          </div>
        </div>

        {/* Exit modal (epilogue) */}
        {showExitModal && (
          <div style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', background: 'rgba(0,0,0,0.8)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 20000 }}>
            <div style={{ background: '#0b0b0b', border: '1px solid #00ff00', padding: 24, borderRadius: 10, width: '90%', maxWidth: 460, color: '#e0ffe0', fontFamily: 'Courier New, Monaco, monospace', textAlign: 'center' }}>
              <div style={{ fontSize: 18, marginBottom: 16, color: '#00ff88' }}>Save game before returning to menu?</div>
              <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
                <button onClick={() => exitToMenu(true)} style={{ padding: '10px 16px', border: '1px solid #00ff88', background: 'rgba(0,255,136,0.12)', color: '#e6ffe6', borderRadius: 8, cursor: 'pointer' }}>💾 Save & Exit</button>
                <button onClick={() => exitToMenu(false)} style={{ padding: '10px 16px', border: '1px solid #888', background: '#111', color: '#eee', borderRadius: 8, cursor: 'pointer' }}>Exit without Saving</button>
                <button onClick={() => setShowExitModal(false)} style={{ padding: '10px 16px', border: '1px solid #444', background: '#0b0b0b', color: '#aaa', borderRadius: 8, cursor: 'pointer' }}>Cancel</button>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  if (isGameOver) {
    const successRate = gameStats.skillCheckAttempts > 0 
      ? Math.round((gameStats.skillCheckSuccesses / gameStats.skillCheckAttempts) * 100) 
      : 0;

    return (
      <div style={{ 
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        background: `
          radial-gradient(circle at center, #000000 0%, #1a0000 40%, #330000 70%, #000000 100%),
          linear-gradient(45deg, transparent 48%, rgba(255, 0, 0, 0.03) 50%, transparent 52%),
          linear-gradient(-45deg, transparent 48%, rgba(255, 0, 0, 0.03) 50%, transparent 52%)
        `,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontFamily: 'Courier New, Monaco, monospace',
        overflow: 'hidden',
        zIndex: 10000
      }}>
        {/* Dramatic pulsing overlay */}
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          background: 'radial-gradient(circle at center, transparent 60%, rgba(255, 0, 0, 0.1) 100%)',
          animation: 'deathPulse 4s ease-in-out infinite'
        }} />
        
        {/* Static noise effect */}
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          background: `
            repeating-linear-gradient(
              90deg,
              transparent 0px,
              rgba(255, 0, 0, 0.02) 1px,
              transparent 2px
            ),
            repeating-linear-gradient(
              0deg,
              transparent 0px,
              rgba(255, 0, 0, 0.02) 1px,
              transparent 2px
            )
          `,
          pointerEvents: 'none',
          animation: 'staticNoise 0.1s linear infinite'
        }} />

        {/* Main game over panel */}
        <div style={{
          position: 'relative',
          background: `
            linear-gradient(135deg, 
              rgba(20, 0, 0, 0.95) 0%, 
              rgba(40, 0, 0, 0.98) 50%, 
              rgba(0, 0, 0, 0.95) 100%
            )
          `,
          border: '4px solid #ff0000',
          borderRadius: '0px',
          padding: '60px 40px',
          maxWidth: '800px',
          width: '95%',
          textAlign: 'center',
          boxShadow: `
            0 0 50px rgba(255, 0, 0, 0.8),
            inset 0 0 30px rgba(255, 0, 0, 0.1),
            0 0 100px rgba(255, 0, 0, 0.3)
          `,
          animation: 'terminalGlitch 6s ease-in-out infinite',
          transform: 'perspective(1000px) rotateX(2deg)',
        }}>
          
          {/* Corner decorations */}
          <div style={{
            position: 'absolute',
            top: '10px',
            left: '10px',
            width: '40px',
            height: '40px',
            border: '3px solid #ff0000',
            borderRight: 'none',
            borderBottom: 'none',
            animation: 'cornerFlash 3s ease-in-out infinite'
          }} />
          <div style={{
            position: 'absolute',
            top: '10px',
            right: '10px',
            width: '40px',
            height: '40px',
            border: '3px solid #ff0000',
            borderLeft: 'none',
            borderBottom: 'none',
            animation: 'cornerFlash 3s ease-in-out infinite 0.5s'
          }} />
          <div style={{
            position: 'absolute',
            bottom: '10px',
            left: '10px',
            width: '40px',
            height: '40px',
            border: '3px solid #ff0000',
            borderRight: 'none',
            borderTop: 'none',
            animation: 'cornerFlash 3s ease-in-out infinite 1s'
          }} />
          <div style={{
            position: 'absolute',
            bottom: '10px',
            right: '10px',
            width: '40px',
            height: '40px',
            border: '3px solid #ff0000',
            borderLeft: 'none',
            borderTop: 'none',
            animation: 'cornerFlash 3s ease-in-out infinite 1.5s'
          }} />

          {/* Skull/death symbol */}
          <div style={{
            fontSize: '4em',
            color: '#ff0000',
            marginBottom: '20px',
            animation: 'skullPulse 2s ease-in-out infinite',
            textShadow: '0 0 30px rgba(255, 0, 0, 1)'
          }}>
            ☠
          </div>

          {/* Massive GAME OVER text */}
          <div style={{
            fontSize: '4.5em',
            fontWeight: 'bold',
            color: '#ff0000',
            textShadow: `
              0 0 20px rgba(255, 0, 0, 0.8),
              0 0 40px rgba(255, 0, 0, 0.6),
              3px 3px 0px #330000,
              -3px -3px 0px #330000
            `,
            marginBottom: '10px',
            letterSpacing: '8px',
            animation: 'bigTextFlicker 3s ease-in-out infinite',
            transform: 'scaleY(1.2)',
            lineHeight: '0.9'
          }}>
            GAME OVER
          </div>

          {/* Subtitle */}
          <div style={{
            fontSize: '1.5em',
            color: '#ff6666',
            marginBottom: '40px',
            fontStyle: 'italic',
            textShadow: '0 0 10px rgba(255, 0, 0, 0.5)',
            animation: 'subtitleFade 4s ease-in-out infinite'
          }}>
            MISSION TERMINATED
          </div>

          {/* Failure reason in terminal style */}
          <div style={{
            background: 'rgba(0, 0, 0, 0.8)',
            border: '2px solid #ff3333',
            borderRadius: '0px',
            padding: '25px',
            marginBottom: '30px',
            fontSize: '1.3em',
            color: '#ff9999',
            fontFamily: 'Courier New, Monaco, monospace',
            textAlign: 'left',
            boxShadow: 'inset 0 0 20px rgba(255, 0, 0, 0.2)'
          }}>
            <div style={{ 
              color: '#ff0000', 
              fontWeight: 'bold', 
              marginBottom: '15px',
              fontSize: '1.1em'
            }}>
              ▶ TERMINATION CAUSE:
            </div>
            <div style={{ 
              fontStyle: 'italic',
              lineHeight: '1.6',
              borderLeft: '3px solid #ff0000',
              paddingLeft: '15px'
            }}>
              {gameOverReason}
            </div>
          </div>

          {/* Critical system info */}
          <div style={{
            background: 'rgba(255, 0, 0, 0.1)',
            border: '1px solid #ff3333',
            padding: '20px',
            marginBottom: '40px',
            fontSize: '1em',
            color: '#ff6666',
            textAlign: 'left'
          }}>
            <div style={{ 
              color: '#ff0000', 
              fontWeight: 'bold', 
              marginBottom: '10px',
              textAlign: 'center'
            }}>
              � CRITICAL SYSTEM FAILURE 🚨
            </div>
            <div style={{ textAlign: 'center', marginBottom: '15px' }}>
              Neural pathways severed • Consciousness integrity: 0% • Mission status: FAILED
            </div>
            <div style={{ 
              display: 'flex', 
              justifyContent: 'space-between',
              fontSize: '0.9em',
              color: '#ff9999'
            }}>
              <span>Chapter: {currentChapter}</span>
              <span>Progress: {gameStats.nodesVisited} nodes</span>
              <span>Success Rate: {successRate}%</span>
            </div>
          </div>

          {/* Restart options */}
          <div style={{
            borderTop: '2px solid #ff3333',
            paddingTop: '30px',
            marginTop: '20px'
          }}>
            <div style={{
              fontSize: '1.8em',
              color: '#ffaa00',
              marginBottom: '25px',
              fontWeight: 'bold',
              textShadow: '0 0 15px rgba(255, 170, 0, 0.8)'
            }}>
              CHOOSE YOUR FATE
            </div>
            
            <div style={{ 
              display: 'flex', 
              gap: '25px', 
              justifyContent: 'center', 
              flexWrap: 'wrap' 
            }}>
              <button 
                onClick={restartChapter}
                style={{
                  background: 'linear-gradient(45deg, #ff4400, #ff6600, #ff4400)',
                  color: '#ffffff',
                  border: '3px solid #ff0000',
                  padding: '18px 30px',
                  fontSize: '1.4em',
                  borderRadius: '0px',
                  cursor: 'pointer',
                  fontFamily: 'Courier New, Monaco, monospace',
                  fontWeight: 'bold',
                  transition: 'all 0.3s ease',
                  boxShadow: `
                    0 6px 20px rgba(255, 68, 0, 0.5),
                    inset 0 0 10px rgba(255, 255, 255, 0.1)
                  `,
                  textShadow: '0 2px 4px rgba(0, 0, 0, 0.8)',
                  transform: 'perspective(500px) rotateX(5deg)',
                  minWidth: '280px'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'perspective(500px) rotateX(5deg) translateY(-3px) scale(1.05)';
                  e.currentTarget.style.boxShadow = '0 8px 25px rgba(255, 68, 0, 0.7), inset 0 0 15px rgba(255, 255, 255, 0.2)';
                  e.currentTarget.style.background = 'linear-gradient(45deg, #ff6600, #ff8800, #ff6600)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'perspective(500px) rotateX(5deg) translateY(0) scale(1)';
                  e.currentTarget.style.boxShadow = '0 6px 20px rgba(255, 68, 0, 0.5), inset 0 0 10px rgba(255, 255, 255, 0.1)';
                  e.currentTarget.style.background = 'linear-gradient(45deg, #ff4400, #ff6600, #ff4400)';
                }}
              >
                ⟲ RETURN TO CHAPTER {currentChapter}
              </button>

              <button 
                onClick={restartGame}
                style={{
                  background: 'linear-gradient(45deg, #333333, #555555, #333333)',
                  color: '#ffffff',
                  border: '3px solid #666666',
                  padding: '18px 30px',
                  fontSize: '1.4em',
                  borderRadius: '0px',
                  cursor: 'pointer',
                  fontFamily: 'Courier New, Monaco, monospace',
                  fontWeight: 'bold',
                  transition: 'all 0.3s ease',
                  boxShadow: `
                    0 6px 20px rgba(0, 0, 0, 0.5),
                    inset 0 0 10px rgba(255, 255, 255, 0.1)
                  `,
                  textShadow: '0 2px 4px rgba(0, 0, 0, 0.8)',
                  transform: 'perspective(500px) rotateX(5deg)',
                  minWidth: '280px'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'perspective(500px) rotateX(5deg) translateY(-3px) scale(1.05)';
                  e.currentTarget.style.background = 'linear-gradient(45deg, #555555, #777777, #555555)';
                  e.currentTarget.style.border = '3px solid #888888';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'perspective(500px) rotateX(5deg) translateY(0) scale(1)';
                  e.currentTarget.style.background = 'linear-gradient(45deg, #333333, #555555, #333333)';
                  e.currentTarget.style.border = '3px solid #666666';
                }}
              >
                ☠ START NEW GAME
              </button>

              {onExitToMenu && (
                <button 
                  onClick={() => setShowExitModal(true)}
                  style={{
                    background: 'linear-gradient(45deg, #0a0a0a, #111, #0a0a0a)',
                    color: '#ffffff',
                    border: '3px solid #222',
                    padding: '18px 30px',
                    fontSize: '1.4em',
                    borderRadius: '0px',
                    cursor: 'pointer',
                    fontFamily: 'Courier New, Monaco, monospace',
                    fontWeight: 'bold',
                    transition: 'all 0.3s ease',
                    boxShadow: '0 6px 20px rgba(0, 0, 0, 0.5)',
                    minWidth: '280px'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-3px) scale(1.05)';
                    e.currentTarget.style.borderColor = '#333';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateY(0) scale(1)';
                    e.currentTarget.style.borderColor = '#222';
                  }}
                >
                  ↩ BACK TO MENU
                </button>
              )}

              {/* New: View Epilogue for all endings */}
              <button 
                onClick={() => { setGeneratedEpilogue(computeGeneratedEpilogue()); setIsEpilogue(true); setIsGameOver(false); }}
                style={{
                  background: 'linear-gradient(45deg, #00220f, #003a1a, #00220f)',
                  color: '#aaffaa',
                  border: '3px solid #00ff88',
                  padding: '18px 30px',
                  fontSize: '1.4em',
                  borderRadius: '0px',
                  cursor: 'pointer',
                  fontFamily: 'Courier New, Monaco, monospace',
                  fontWeight: 'bold',
                  transition: 'all 0.3s ease',
                  boxShadow: '0 6px 20px rgba(0, 255, 136, 0.25)',
                  minWidth: '280px'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-3px) scale(1.05)';
                  e.currentTarget.style.borderColor = '#33ffaa';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0) scale(1)';
                  e.currentTarget.style.borderColor = '#00ff88';
                }}
              >
                ✦ VIEW EPILOGUE
              </button>
            </div>
          </div>
        </div>

        {/* Exit modal (game over) */}
        {showExitModal && (
          <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100vw',
            height: '100vh',
            background: 'rgba(0,0,0,0.8)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 20000
          }}>
            <div style={{
              background: '#0b0b0b',
              border: '1px solid #00ff00',
              padding: 24,
              borderRadius: 10,
              width: '90%',
              maxWidth: 460,
              color: '#e0ffe0',
              fontFamily: 'Courier New, Monaco, monospace',
              textAlign: 'center'
            }}>
              <div style={{ fontSize: 18, marginBottom: 16, color: '#00ff88' }}>
                Save game before returning to menu?
              </div>
              <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
                <button onClick={() => exitToMenu(true)} style={{ padding: '10px 16px', border: '1px solid #00ff88', background: 'rgba(0,255,136,0.12)', color: '#e6ffe6', borderRadius: 8, cursor: 'pointer' }}>💾 Save & Exit</button>
                <button onClick={() => exitToMenu(false)} style={{ padding: '10px 16px', border: '1px solid #888', background: '#111', color: '#eee', borderRadius: 8, cursor: 'pointer' }}>Exit without Saving</button>
                <button onClick={() => setShowExitModal(false)} style={{ padding: '10px 16px', border: '1px solid #444', background: '#0b0b0b', color: '#aaa', borderRadius: 8, cursor: 'pointer' }}>Cancel</button>
              </div>
            </div>
          </div>
        )}

        <style jsx>{`
          @keyframes deathPulse {
            0%, 100% { opacity: 0.3; transform: scale(1); }
            50% { opacity: 0.8; transform: scale(1.05); }
          }
          
          @keyframes staticNoise {
            0% { transform: translateX(0px); }
            10% { transform: translateX(-1px); }
            20% { transform: translateX(1px); }
            30% { transform: translateX(-2px); }
            40% { transform: translateX(2px); }
            50% { transform: translateX(-1px); }
            60% { transform: translateX(1px); }
            70% { transform: translateX(-2px); }
            80% { transform: translateX(2px); }
            90% { transform: translateX(-1px); }
            100% { transform: translateX(0px); }
          }
          
          @keyframes terminalGlitch {
            0%, 95%, 100% { transform: perspective(1000px) rotateX(2deg) translateX(0); }
            1% { transform: perspective(1000px) rotateX(2deg) translateX(-3px); }
            3% { transform: perspective(1000px) rotateX(2deg) translateX(3px); }
            5% { transform: perspective(1000px) rotateX(2deg) translateX(-2px); }
          }
          
          @keyframes cornerFlash {
            0%, 50%, 100% { opacity: 1; }
            25%, 75% { opacity: 0.3; }
          }
          
          @keyframes skullPulse {
            0%, 100% { transform: scale(1); opacity: 1; }
            50% { transform: scale(1.2); opacity: 0.8; }
          }
          
          @keyframes bigTextFlicker {
            0%, 90%, 100% { opacity: 1; }
            5% { opacity: 0.7; }
            10% { opacity: 1; }
            15% { opacity: 0.8; }
            20% { opacity: 1; }
          }
          
          @keyframes subtitleFade {
            0%, 100% { opacity: 0.8; }
            50% { opacity: 1; }
          }
        `}</style>
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
          marginBottom: '20px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}>
          <div style={{ 
            color: '#00ff00', 
            fontSize: '17px', 
            fontWeight: 'bold' 
          }}>
            RPG SOLO TERMINAL v1.0 - Chapter {currentChapter}
          </div>
          {onExitToMenu && (
            <button
              onClick={(e) => { e.stopPropagation(); setShowExitModal(true); }}
              style={{
                background: 'transparent',
                color: '#00ff00',
                border: '1px solid #00ff00',
                padding: '6px 12px',
                borderRadius: '6px',
                cursor: 'pointer',
                fontFamily: 'inherit',
                fontSize: '0.95rem'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = 'rgba(0,255,0,0.1)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'transparent';
              }}
            >
              Menu
            </button>
          )}
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
            background: 'rgba(255, 255, 0, 0.06)',
            textAlign: 'center',
            minHeight: '140px',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center'
          }}>
            {/* No text while rolling: pure visual pulse */}
            {!skillCheckResult && (
              <div style={{
                width: 64,
                height: 64,
                margin: '0 auto',
                border: '4px solid rgba(255,255,0,0.4)',
                borderTopColor: '#ffff00',
                borderRadius: '50%',
                animation: 'spin 0.9s linear infinite',
                boxShadow: '0 0 12px rgba(255,255,0,0.4)'
              }} />
            )}
            {/* Results phase (show full text only after resolved) */}
            {skillCheckResult && (
              <>
                <h3 style={{ color: '#ffff00', marginBottom: '12px' }}>🎲 SKILL CHECK</h3>
                <div style={{ fontSize: '1.15em', marginBottom: '8px' }}>
                  Roll: {skillCheckResult.roll} + Stat: {skillCheckResult.stat} = {skillCheckResult.total}
                </div>
                <div style={{ fontSize: '1.05em', marginBottom: '10px', opacity: 0.85 }}>
                  Difficulty: {skillCheckResult.dc}
                </div>
                <div style={{ 
                  fontSize: '1.35em', 
                  fontWeight: 'bold',
                  color: skillCheckResult.success ? '#00ff88' : '#ff6b6b',
                  marginBottom: '16px'
                }}>
                  {skillCheckResult.success ? '✅ SUCCESSO' : '❌ FALHA'}
                </div>
                <button
                  onClick={continueAfterSkillCheck}
                  style={{
                    padding: '10px 22px',
                    background: skillCheckResult.success ? 'linear-gradient(90deg,#00ff88,#00cc55)' : 'linear-gradient(90deg,#ff4444,#aa0000)',
                    color: '#000',
                    border: 'none',
                    borderRadius: '6px',
                    fontSize: '1.05em',
                    fontWeight: 'bold',
                    cursor: 'pointer',
                    fontFamily: 'Courier New, Monaco, monospace',
                    boxShadow: '0 0 10px rgba(255,255,0,0.25)'
                  }}
                >
                  Continuar
                </button>
              </>
            )}
            <style jsx>{`
              @keyframes spin { from { transform: rotate(0deg);} to { transform: rotate(360deg);} }
            `}</style>
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

        {/* Image display for current node */}
        {currentNode?.image && (
          <div style={{ border: '1px solid #00ff00', padding: '10px', borderRadius: '5px' }}>
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
          fontSize: '16px', 
          lineHeight: '1.6', 
          margin: '20px 0', 
          color: '#c8ffc8',
          fontFamily: 'Courier New, Monaco, monospace',
          letterSpacing: '0.3px'
        }}>
          {paragraphs.map((p, i) => (
            <p key={i} style={{ margin: '0 0 14px 0', whiteSpace: 'normal' }}>{p}</p>
          ))}
          {!isComplete && (
            <span style={{ 
              color: '#00ff00',
              animation: 'blink 1s infinite'
            }}>▋</span>
          )}
        </div>

        {/* Friendship panel (persistent) */}
        {gameState.friendship && (
          <div style={{ marginTop: '10px', borderTop: '1px solid #003300', paddingTop: '14px' }}>
            <div style={{ fontSize: 12, color: '#66ffcc', marginBottom: 6, letterSpacing: '1px' }}>RELACIONAMENTOS</div>
            <div style={{ display: 'flex', gap: '18px', flexWrap: 'wrap' }}>
              {Object.entries(gameState.friendship).map(([char, val]) => (
                <div key={char} style={{ minWidth: '120px', background: 'rgba(0,255,136,0.05)', padding: '6px 10px', borderRadius: 6, border: '1px solid #004427', position: 'relative' }}>
                  <div style={{ fontSize: '12px', color: '#aaffee', fontWeight: 'bold', letterSpacing: '0.5px' }}>{char}</div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginTop: 4 }}>
                    <div style={{ flex: 1, height: 6, background: '#022d22', borderRadius: 4, overflow: 'hidden' }}>
                      <div style={{ width: `${Math.max(0, Math.min(100, (val + 10) * 5))}%`, height: '100%', background: 'linear-gradient(90deg,#00ff99,#00bb66)' }} />
                    </div>
                    <div style={{ fontSize: 11, color: '#e0ffe0', minWidth: 24, textAlign: 'right' }}>{val}</div>
                  </div>
                  {lastFriendshipDelta && lastFriendshipDelta[char] && (
                    <div style={{ position: 'absolute', top: -10, right: 4, fontSize: 11, fontWeight: 'bold', color: lastFriendshipDelta[char] > 0 ? '#00ff99' : '#ff6666', textShadow: '0 0 4px rgba(0,0,0,0.6)' }}>
                      {lastFriendshipDelta[char] > 0 ? `+${lastFriendshipDelta[char]}` : `${lastFriendshipDelta[char]}`}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Transient toast for friendship changes */}
        {lastFriendshipDelta && (
          <div style={{ position: 'fixed', bottom: 20, right: 20, background: 'rgba(0,40,0,0.9)', border: '1px solid #00ff88', padding: '10px 14px', borderRadius: 8, color: '#e0ffe0', fontSize: 13, zIndex: 3000, boxShadow: '0 0 10px rgba(0,255,136,0.3)' }}>
            {Object.entries(lastFriendshipDelta).map(([char, delta]) => (
              <div key={char} style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
                <span style={{ color: '#aaffee' }}>{char}</span>
                <span style={{ color: delta > 0 ? '#00ff99' : '#ff6666', fontWeight: 'bold' }}>{delta > 0 ? `+${delta}` : delta}</span>
              </div>
            ))}
          </div>
        )}

        {/* Choices - only show when not in skill check and after text finishes */}
        {!skillCheckInProgress && isComplete && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '15px', marginTop: '30px' }}>
            {(currentNode.choices || []).map((choice, index) => {
              const canSelect = canChoose(choice);
              const isSkill = !!choice.skillCheck;
              // Remove parenthetical (Teste ...) from original text for cleaner display
              const baseText = isSkill ? choice.text.replace(/\s*\(Teste[^)]*\)/i, '').trim() : choice.text;
              let diffLabel = '';
              if (isSkill) {
                const d = choice.skillCheck!.difficulty;
                if (typeof d === 'string') {
                  diffLabel = d === 'easy' ? 'FÁCIL' : d === 'medium' ? 'MÉDIO' : d === 'hard' ? 'DIFÍCIL' : d.toUpperCase();
                } else if (typeof d === 'number') {
                  diffLabel = 'DC ' + d;
                }
              }
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
                    transition: 'all 0.3s ease',
                    position: 'relative',
                    overflow: 'hidden'
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
                  <div style={{ display:'flex', alignItems:'center', gap:12 }}>
                    <span>{baseText}</span>
                    {isSkill && (
                      <span
                        style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: 6,
                          fontSize: '0.70rem',
                          letterSpacing: '1px',
                          background: 'rgba(255,255,0,0.08)',
                          border: '1px solid #d6d600',
                          color: '#ffff66',
                          padding: '4px 8px',
                          borderRadius: 20,
                          fontWeight: 600,
                          textTransform: 'uppercase',
                          boxShadow: '0 0 6px rgba(255,255,0,0.25)'
                        }}
                        aria-label={`Teste de perícia ${diffLabel}`}
                      >
                        <span style={{ filter:'drop-shadow(0 0 2px #ffff00)' }}>🎲</span>{diffLabel}
                      </span>
                    )}
                  </div>
                  {isSkill && choice.skillCheck?.stat && (
                    <div style={{ marginTop:6, fontSize:'0.65rem', letterSpacing:'1px', color:'#cccccc', opacity:0.75 }}>
                      STAT: <span style={{ color:'#00ff99' }}>{choice.skillCheck.stat.toUpperCase()}</span>
                      {typeof choice.skillCheck.difficulty === 'number' && (
                        <span style={{ marginLeft:8 }}>DC {choice.skillCheck.difficulty}</span>
                      )}
                    </div>
                  )}
                  {choice.requirements && (
                    <div style={{ fontSize: '0.9rem', color: '#ff6b6b', fontStyle: 'italic', marginTop: '5px' }}>
                      {choice.requirements.tech && `Tech ${choice.requirements.tech}+ `}
                      {choice.requirements.logical && `Logic ${choice.requirements.logical}+ `}
                      {choice.requirements.empathy && `Empathy ${choice.requirements.empathy}+`}
                    </div>
                  )}
                  {(choice as any).effects || (choice as any).successEffects || (choice as any).failureEffects ? (
                    <div style={{ fontSize: '0.8rem', color: '#00ff88', fontStyle: 'italic', marginTop: '8px', display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                      {(choice as any).effects?.tech && <span>Tech +{(choice as any).effects.tech}</span>}
                      {(choice as any).effects?.logical && <span>Logic +{(choice as any).effects.logical}</span>}
                      {(choice as any).effects?.empathy && <span>Empatia +{(choice as any).effects.empathy}</span>}
                      {(choice as any).effects?.friendship && Object.entries((choice as any).effects.friendship).map(([c,v]: any) => (
                        <span key={c}>{c} {v>0?`+${v}`:v}</span>
                      ))}
                      {(choice as any).successEffects?.friendship && Object.entries((choice as any).successEffects.friendship).map(([c,v]: any) => (
                        <span key={c}>Sucesso: {c} {v>0?`+${v}`:v}</span>
                      ))}
                      {(choice as any).failureEffects?.friendship && Object.entries((choice as any).failureEffects.friendship).map(([c,v]: any) => (
                        <span key={c}>Falha: {c} {v>0?`+${v}`:v}</span>
                      ))}
                    </div>
                  ) : null}
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* Exit modal (in-game) */}
      {showExitModal && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100vw',
          height: '100vh',
          background: 'rgba(0,0,0,0.8)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 5000
        }}>
          <div style={{
            background: '#0b0b0b',
            border: '1px solid #00ff00',
            padding: 24,
            borderRadius: 10,
            width: '90%',
            maxWidth: 460,
            color: '#e0ffe0',
            fontFamily: 'Courier New, Monaco, monospace',
            textAlign: 'center'
          }}>
            <div style={{ fontSize: 18, marginBottom: 16, color: '#00ff88' }}>
              Save game before returning to menu?
            </div>
            <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
              <button onClick={() => { exitToMenu(true); }} style={{ padding: '10px 16px', border: '1px solid #00ff88', background: 'rgba(0,255,136,0.12)', color: '#e6ffe6', borderRadius: 8, cursor: 'pointer' }}>💾 Save & Exit</button>
              <button onClick={() => { exitToMenu(false); }} style={{ padding: '10px 16px', border: '1px solid #888', background: '#111', color: '#eee', borderRadius: 8, cursor: 'pointer' }}>Exit without Saving</button>
              <button onClick={() => setShowExitModal(false)} style={{ padding: '10px 16px', border: '1px solid #444', background: '#0b0b0b', color: '#aaa', borderRadius: 8, cursor: 'pointer' }}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
