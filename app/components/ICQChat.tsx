'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useI18n } from '../i18n';
import type { GameState, ICQPhase } from '../types';
import styles from './ICQChat.module.css';

type ICQMessage = GameState['icqMessages'][number];

interface MathQuestion {
  equation: string;
  answer: number;
  hint: string;
}

const MATH_QUESTIONS: MathQuestion[] = [
  { equation: '2x + 5 = 13', answer: 4, hint: 'isolate x' },
  { equation: '3x - 7 = 8', answer: 5, hint: 'add 7 to both sides' },
  { equation: '4x + 2 = 18', answer: 4, hint: 'subtract 2 first' },
];

interface ICQChatProps {
  onVictoryAction: () => void;
  initialTrust: number;
  initialMessages?: ICQMessage[];
  initialPhase?: ICQPhase;
  initialQuestion?: number;
  initialQuestionWrongAttempts?: number;
  initialFilesSent?: boolean;
  initialLeakChoice?: 'public' | 'covert';
  onStateChange?: (snapshot: {
    messages: ICQMessage[];
    phase: ICQPhase;
    currentQuestion: number;
    currentWrongAttempts: number;
    trust: number;
  }) => void;
  onTrustChange: (trust: number) => void;
  onMathMistake: () => void;
  onLeakChoice: (choice: 'public' | 'covert') => void;
  onFilesSent: () => void;
}

function normalizePhase(
  phase: ICQPhase,
  hasMessages: boolean,
  currentQuestion: number,
  filesSent: boolean,
  leakChoice?: 'public' | 'covert'
): ICQPhase {
  if (phase !== 'intro') {
    return phase;
  }
  if (leakChoice) {
    return 'sending';
  }
  if (filesSent) {
    return 'leak';
  }
  if (currentQuestion > 0) {
    return 'math';
  }
  if (hasMessages) {
    return 'scared';
  }
  return phase;
}

function extractMathAnswer(playerText: string): number | null {
  const assignmentMatch = playerText.match(/x\s*=\s*(-?\d+)/i);
  if (assignmentMatch) {
    return Number(assignmentMatch[1]);
  }

  const numericMatches = playerText.match(/-?\d+/g);
  if (!numericMatches || numericMatches.length === 0) {
    return null;
  }

  return Number(numericMatches[numericMatches.length - 1]);
}

export default function ICQChat({
  onVictoryAction,
  initialTrust,
  initialMessages = [],
  initialPhase = 'intro',
  initialQuestion = 0,
  initialQuestionWrongAttempts = 0,
  initialFilesSent = false,
  initialLeakChoice,
  onStateChange = () => {},
  onTrustChange,
  onMathMistake,
  onLeakChoice,
  onFilesSent,
}: ICQChatProps) {
  const { t, translateRuntimeText } = useI18n();
  const [messages, setMessages] = useState<ICQMessage[]>(initialMessages);
  const [inputValue, setInputValue] = useState('');
  const [phase, setPhase] = useState<ICQPhase>(
    normalizePhase(
      initialPhase,
      initialMessages.length > 0,
      initialQuestion,
      initialFilesSent,
      initialLeakChoice
    )
  );
  const [currentQuestion, setCurrentQuestion] = useState(initialQuestion);
  const [wrongAttempts, setWrongAttempts] = useState(initialQuestionWrongAttempts);
  const [isTyping, setIsTyping] = useState(false);
  const [trust, setTrust] = useState(initialTrust);
  const [fastForward, setFastForward] = useState(false);

  const chatRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const mountedRef = useRef(true);
  const introStartedRef = useRef(false);
  const victoryTimeoutRef = useRef<number | null>(null);

  useEffect(() => {
    return () => {
      mountedRef.current = false;
      if (victoryTimeoutRef.current !== null) {
        window.clearTimeout(victoryTimeoutRef.current);
      }
    };
  }, []);

  useEffect(() => {
    onStateChange({
      messages,
      phase,
      currentQuestion,
      currentWrongAttempts: wrongAttempts,
      trust,
    });
  }, [messages, phase, currentQuestion, wrongAttempts, trust, onStateChange]);

  // Auto-scroll to bottom
  useEffect(() => {
    if (chatRef.current) {
      chatRef.current.scrollTop = chatRef.current.scrollHeight;
    }
  }, [messages]);

  // Focus input
  useEffect(() => {
    if (phase !== 'sending' && phase !== 'victory') {
      inputRef.current?.focus();
    }
  }, [phase, isTyping]);

  // Get current time for timestamps
  const getTimestamp = useCallback(() => {
    const now = new Date();
    return `${now.getHours().toString().padStart(2, '0')}:${now
      .getMinutes()
      .toString()
      .padStart(2, '0')}`;
  }, []);

  const getDelay = useCallback(
    (delay: number) => (fastForward ? Math.min(220, Math.max(40, Math.ceil(delay / 6))) : delay),
    [fastForward]
  );

  const waitFor = useCallback(
    async (delay: number) => {
      await new Promise(resolve => setTimeout(resolve, getDelay(delay)));
    },
    [getDelay]
  );

  // Add teen message with typing delay
  const addTeenMessage = useCallback(
    async (text: string, delay = 1500) => {
      setIsTyping(true);
      await waitFor(delay);
      if (!mountedRef.current) return;
      setIsTyping(false);
      setMessages(prev => [...prev, { sender: 'teen', text, timestamp: getTimestamp() }]);
    },
    [getTimestamp, waitFor]
  );

  // Add system message
  const addSystemMessage = useCallback((text: string) => {
    setMessages(prev => [...prev, { sender: 'system', text }]);
  }, []);

  const adjustTrust = useCallback(
    (delta: number) => {
      setTrust(prev => {
        const next = Math.max(0, Math.min(100, prev + delta));
        onTrustChange(next);
        return next;
      });
    },
    [onTrustChange]
  );

  const includesAny = useCallback(
    (text: string, terms: string[]): boolean => terms.some(term => text.includes(term)),
    []
  );

  const promptLeakChoice = useCallback(async () => {
    addSystemMessage('═══ SAVING FILES ═══');
    onFilesSent();
    setPhase('leak');
    setWrongAttempts(0);

    await waitFor(1200);
    if (!mountedRef.current) return;
    await addTeenMessage('quick question before i do it', 1200);
    await addTeenMessage('u want me to post it everywhere or keep it quiet?', 1500);
    await addTeenMessage('type: public or covert', 1000);
  }, [addSystemMessage, addTeenMessage, onFilesSent, waitFor]);

  const finalizeTransfer = useCallback(async () => {
    setPhase('sending');
    await waitFor(900);
    if (!mountedRef.current) return;
    await addTeenMessage('getting a floppy disk...', 1000);
    await addTeenMessage('copying...', 1300);

    addSystemMessage('[▓▓▓▓▓▓▓▓▓▓] 100% - COMPLETE');

    await addTeenMessage('done!', 700);
    await addTeenMessage('saved everything to a floppy', 900);
    await addTeenMessage('gonna hide it under my bed', 800);
    await addTeenMessage('no one will find it 😎', 700);

    addSystemMessage('═══════════════════════════════════════════════════════════');
    addSystemMessage('MISSION COMPLETE');
    addSystemMessage('The evidence was saved to physical media.');
    addSystemMessage('The files survived the system purge.');
    addSystemMessage('═══════════════════════════════════════════════════════════');

    setPhase('victory');

    if (victoryTimeoutRef.current !== null) {
      window.clearTimeout(victoryTimeoutRef.current);
    }
    victoryTimeoutRef.current = window.setTimeout(() => {
      onVictoryAction();
    }, getDelay(1200));
  }, [addSystemMessage, addTeenMessage, getDelay, onVictoryAction, waitFor]);

  // Initial intro sequence
  useEffect(() => {
    if (introStartedRef.current) {
      return;
    }
    introStartedRef.current = true;

    if (initialMessages.length > 0 || phase !== 'intro' || initialQuestion > 0 || initialFilesSent) {
      return;
    }

    let cancelled = false;

    const startIntro = async () => {
      addSystemMessage('═══ CONNECTION ESTABLISHED ═══');
      addSystemMessage('UFO74 managed to "hang" the connection on a civilian computer');
      await waitFor(2000);

      if (cancelled || !mountedRef.current) return;
      addSystemMessage('xXx_DarkMaster_xXx is online');
      await addTeenMessage('???', 1000);
      if (cancelled || !mountedRef.current) return;
      await addTeenMessage('hello???', 1200);
      if (cancelled || !mountedRef.current) return;
      await addTeenMessage('who r u??? how did u get into my icq??', 1500);

      if (cancelled || !mountedRef.current) return;
      setPhase('scared');
    };

    void startIntro();

    return () => {
      cancelled = true;
    };
  }, [
    addSystemMessage,
    addTeenMessage,
    initialFilesSent,
    initialMessages.length,
    initialQuestion,
    phase,
    waitFor,
  ]);

  // Handle player input
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim() || isTyping || phase === 'sending' || phase === 'victory') return;

    const playerText = inputValue.trim();
    setInputValue('');
    setMessages(prev => [
      ...prev,
      { sender: 'player', text: playerText, timestamp: getTimestamp() },
    ]);

    switch (phase) {
      case 'scared':
        await handleScaredPhase(playerText);
        break;
      case 'bargain':
        await handleBargainPhase(playerText);
        break;
      case 'math':
        await handleMathPhase(playerText);
        break;
      case 'leak':
        await handleLeakPhase(playerText);
        break;
      default:
        break;
    }
  };

  const handleScaredPhase = async (playerText: string) => {
    const lower = playerText.toLowerCase();

    if (
      includesAny(lower, [
        'help',
        'need',
        'urgent',
        'important',
        'please',
        'listen',
        'save',
        'files',
        'file',
        'document',
        'documents',
        'evidence',
        'ajuda',
        'preciso',
        'por favor',
        'salvar',
        'arquivo',
        'arquivos',
        'documento',
        'documentos',
        'evidencia',
        'evidências',
        'ayuda',
        'necesito',
        'guardar',
        'archivo',
        'archivos',
      ])
    ) {
      if (includesAny(lower, ['save', 'files', 'file', 'document', 'evidence', 'arquivo', 'archivo'])) {
        await addTeenMessage('file??? what file??', 1100);
        await addTeenMessage('r u a hacker??? omg', 1300);
        await addTeenMessage('ok but what do u want anyway', 900);
        adjustTrust(2);
      } else {
        await addTeenMessage('dude i dont know who u r', 1000);
        await addTeenMessage('my mom said not to talk to strangers online', 1300);
        await addTeenMessage('what do u want???', 900);
        adjustTrust(6);
      }
      setPhase('bargain');
      return;
    }

    await addTeenMessage('huh?', 700);
    await addTeenMessage('say it simple. do u need help or do u need me to save something?', 1000);
    adjustTrust(-1);
    setPhase('bargain');
  };

  const handleBargainPhase = async (playerText: string) => {
    const lower = playerText.toLowerCase();

    if (
      includesAny(lower, [
        'save',
        'store',
        'floppy',
        'disk',
        'cd',
        'file',
        'backup',
        'salvar',
        'guardar',
        'disquete',
        'disco',
        'respaldo',
        'copia',
        'cópia',
        'archivo',
        'arquivos',
        'arquivo',
      ])
    ) {
      await addTeenMessage('hmmmm', 900);
      await addTeenMessage('let me think...', 1200);
      await addTeenMessage('ok ill do it', 1400);
      await addTeenMessage('BUT', 600);
      await addTeenMessage('u gotta help me with something first', 1000);
      await addTeenMessage('my math teacher gave me equation homework', 1200);
      await addTeenMessage('and i dont know how to do it 😭', 1000);
      await addTeenMessage('if u solve the 3 questions ill save ur files', 1200);
      await addTeenMessage('deal?', 700);

      addSystemMessage('═══ DEAL: Solve 3 linear equations ═══');
      adjustTrust(4);
      setPhase('math');

      await waitFor(900);
      if (!mountedRef.current) return;
      await addTeenMessage('ok first question:', 800);
      await addTeenMessage(MATH_QUESTIONS[0].equation, 900);
      await addTeenMessage('what is x?', 700);
    } else if (
      includesAny(lower, ['government', 'et', 'alien', 'ufo', 'varginha', 'governo', 'gobierno'])
    ) {
      await addTeenMessage('LOLOLOLOL', 900);
      await addTeenMessage('aliens??? r u joking', 1100);
      await addTeenMessage('my uncle talks about that stuff', 1000);
      await addTeenMessage('but maybe its true idk', 1100);
      await addTeenMessage('what do u want me to do?', 900);
      adjustTrust(-2);
    } else if (includesAny(lower, ['please', 'por favor'])) {
      await addTeenMessage('hmm ur asking nicely', 900);
      await addTeenMessage('what exactly do u want?', 800);
      adjustTrust(2);
    } else {
      await addTeenMessage('ok but what do i get out of this?', 1000);
      await addTeenMessage('im not gonna do anything for free', 1200);
      await addTeenMessage('say what u need saved and maybe we can deal', 900);
      adjustTrust(-2);
    }
  };

  const handleMathPhase = async (playerText: string) => {
    const answer = extractMathAnswer(playerText);
    const question = MATH_QUESTIONS[Math.min(currentQuestion, MATH_QUESTIONS.length - 1)];

    if (answer === null) {
      await addTeenMessage('thats not a number dude', 800);
      await addTeenMessage(`hint: ${question.hint}`, 1000);
      adjustTrust(-1);
      onMathMistake();
      return;
    }

    if (answer === question.answer) {
      await addTeenMessage('yesss!!! correct 🎉', 900);
      const projectedTrust = Math.min(100, trust + 3);
      adjustTrust(3);

      const nextQuestion = currentQuestion + 1;
      const canCashInTrust =
        projectedTrust >= 60 && nextQuestion >= MATH_QUESTIONS.length - 1;

      if (nextQuestion >= MATH_QUESTIONS.length || canCashInTrust) {
        setCurrentQuestion(MATH_QUESTIONS.length);
        setWrongAttempts(0);

        if (canCashInTrust && nextQuestion < MATH_QUESTIONS.length) {
          await addTeenMessage('ok ok. u clearly know what ur doing', 900);
          await addTeenMessage('trust meter says ur not totally sketchy anymore', 1000);
          await addTeenMessage('we can skip the last one', 900);
        } else {
          setCurrentQuestion(nextQuestion);
        }

        await addTeenMessage('wow ur so smart', 1000);
        await addTeenMessage('thx for helping me!', 900);
        await addTeenMessage('ok im gonna save ur files', 1100);
        await promptLeakChoice();
        return;
      }

      setCurrentQuestion(nextQuestion);
      setWrongAttempts(0);

      await waitFor(800);
      if (!mountedRef.current) return;
      const ordinal = nextQuestion === 1 ? '2nd' : '3rd';
      await addTeenMessage(`now the ${ordinal}:`, 900);
      await addTeenMessage(MATH_QUESTIONS[nextQuestion].equation, 900);
      await addTeenMessage('well?', 700);
      return;
    }

    const nextWrongAttempts = wrongAttempts + 1;
    setWrongAttempts(nextWrongAttempts);
    onMathMistake();
    adjustTrust(trust >= 60 ? -1 : -3);

    if (nextWrongAttempts >= 2) {
      await addTeenMessage('dude u dont know math either?? 😂', 900);
      await addTeenMessage(`hint: ${question.hint}`, 1100);
      if (trust >= 60) {
        await addTeenMessage('fine, one reset. dont waste it.', 900);
      }
      setWrongAttempts(0);
    } else {
      await addTeenMessage('wrong 😅', 700);
      await addTeenMessage('try again', 700);
    }
  };

  const handleLeakPhase = async (playerText: string) => {
    const lower = playerText.toLowerCase();
    if (includesAny(lower, ['public', 'publico', 'público', 'abierto', 'aberta', 'aberto'])) {
      onLeakChoice('public');
      await addTeenMessage('ok ok posting it on open forums', 900);
      await addTeenMessage('this is gonna get wild', 900);
      await finalizeTransfer();
      return;
    }
    if (
      includesAny(lower, [
        'covert',
        'quiet',
        'private',
        'silencioso',
        'discreto',
        'discreta',
        'privado',
        'reservado',
      ])
    ) {
      onLeakChoice('covert');
      await addTeenMessage('got it. quiet drop to my trusted list', 900);
      await addTeenMessage('no big splash, just copies', 900);
      await finalizeTransfer();
      return;
    }

    await addTeenMessage('public or covert. pick one.', 700);
  };

  return (
    <div className={styles.container}>
      {/* ICQ Title Bar */}
      <div className={styles.titleBar}>
        <div className={styles.titleLeft}>
          <span className={styles.icqLogo}>🌸</span>
          <span>ICQ 99a - xXx_DarkMaster_xXx</span>
        </div>
        <div className={styles.titleButtons}>
          <span className={styles.titleBtn}>_</span>
          <span className={styles.titleBtn}>□</span>
          <span className={styles.titleBtnClose}>×</span>
        </div>
      </div>

      {/* Contact Info Bar */}
      <div className={styles.contactBar}>
        <div className={styles.avatar}>👦</div>
        <div className={styles.contactInfo}>
          <div className={styles.contactName}>xXx_DarkMaster_xXx</div>
          <div className={styles.contactStatus}>🟢 {t('icq.online')}</div>
        </div>
      </div>

      {/* Chat Area */}
      <div
        className={styles.chatArea}
        ref={chatRef}
        role="log"
        aria-live="polite"
        aria-relevant="additions"
        aria-label={t('icq.chat.aria')}
      >
        {messages.map((msg, index) => (
          <div key={index} className={`${styles.message} ${styles[msg.sender]}`}>
            {msg.sender === 'system' ? (
              <div className={styles.systemMessage}>{translateRuntimeText(msg.text)}</div>
            ) : (
              <>
                <span className={styles.messageTime}>{msg.timestamp}</span>
                <span className={styles.messageSender}>
                  {msg.sender === 'teen' ? 'xXx_DarkMaster_xXx' : t('icq.you')}:
                </span>
                <span className={styles.messageText}>{translateRuntimeText(msg.text)}</span>
              </>
            )}
          </div>
        ))}
        {isTyping && <div className={styles.typing}>{t('icq.typing')}</div>}
      </div>

      {/* Input Area */}
      <div className={styles.inputArea}>
        <form onSubmit={handleSubmit} className={styles.inputForm}>
          <input
            ref={inputRef}
            type="text"
            value={inputValue}
            onChange={e => setInputValue(e.target.value)}
            placeholder={phase === 'victory' ? t('icq.placeholder.done') : t('icq.placeholder.default')}
            disabled={isTyping || phase === 'victory' || phase === 'sending'}
            className={styles.input}
            aria-label={t('icq.input.aria')}
          />
          <button
            type="button"
            className={styles.speedButton}
            onClick={() => setFastForward(prev => !prev)}
            aria-label={fastForward ? t('icq.speed.normal') : t('icq.speed.fast')}
          >
            {fastForward ? t('icq.speed.normal') : t('icq.speed.fast')}
          </button>
          <button
            type="submit"
            className={styles.sendButton}
            disabled={isTyping || phase === 'victory' || phase === 'sending'}
          >
            {t('icq.send')}
          </button>
        </form>
      </div>

      {/* Status Bar */}
      <div className={styles.statusBar}>
        <span>{t('icq.status.connected')}</span>
        <span>|</span>
        <span>
          {phase === 'math'
            ? t('icq.status.question', {
                current: Math.min(currentQuestion + 1, MATH_QUESTIONS.length),
              })
            : t('icq.status.trust', { value: trust })}
        </span>
      </div>
    </div>
  );
}
