'use client';

import React, { useState, useEffect, useRef } from 'react';
import styles from './ICQChat.module.css';

interface ICQMessage {
  sender: 'player' | 'teen' | 'system';
  text: string;
  timestamp?: string;
}

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
}

export default function ICQChat({ onVictoryAction }: ICQChatProps) {
  const [messages, setMessages] = useState<ICQMessage[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [phase, setPhase] = useState<'intro' | 'scared' | 'bargain' | 'math' | 'sending' | 'victory'>('intro');
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [wrongAttempts, setWrongAttempts] = useState(0);
  const [isTyping, setIsTyping] = useState(false);
  
  const chatRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  
  // Auto-scroll to bottom
  useEffect(() => {
    if (chatRef.current) {
      chatRef.current.scrollTop = chatRef.current.scrollHeight;
    }
  }, [messages]);
  
  // Focus input
  useEffect(() => {
    inputRef.current?.focus();
  }, [phase]);
  
  // Get current time for timestamps
  const getTimestamp = () => {
    const now = new Date();
    return `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;
  };
  
  // Add teen message with typing delay
  const addTeenMessage = async (text: string, delay = 1500) => {
    setIsTyping(true);
    await new Promise(resolve => setTimeout(resolve, delay));
    setIsTyping(false);
    setMessages(prev => [...prev, { sender: 'teen', text, timestamp: getTimestamp() }]);
  };
  
  // Add system message
  const addSystemMessage = (text: string) => {
    setMessages(prev => [...prev, { sender: 'system', text }]);
  };
  
  // Initial intro sequence
  useEffect(() => {
    const startIntro = async () => {
      addSystemMessage('═══ CONNECTION ESTABLISHED ═══');
      addSystemMessage('UFO74 managed to "hang" the connection on a civilian computer');
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      addSystemMessage('xXx_DarkMaster_xXx is online');
      await addTeenMessage('???', 1000);
      await addTeenMessage('hello???', 1200);
      await addTeenMessage('who r u??? how did u get into my icq??', 1500);
      
      setPhase('scared');
    };
    
    startIntro();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  
  // Handle player input
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim() || isTyping) return;
    
    const playerText = inputValue.trim();
    setInputValue('');
    setMessages(prev => [...prev, { sender: 'player', text: playerText, timestamp: getTimestamp() }]);
    
    // Phase-based responses
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
      default:
        break;
    }
  };
  
  const handleScaredPhase = async (playerText: string) => {
    const lower = playerText.toLowerCase();
    
    if (lower.includes('help') || lower.includes('need') || lower.includes('urgent') || lower.includes('important')) {
      await addTeenMessage('dude i dont know who u r', 1200);
      await addTeenMessage('my mom said not to talk to strangers online', 1500);
      await addTeenMessage('what do u want???', 1000);
      setPhase('bargain');
    } else if (lower.includes('file') || lower.includes('document') || lower.includes('evidence')) {
      await addTeenMessage('file??? what file??', 1200);
      await addTeenMessage('r u a hacker??? omg', 1500);
      await addTeenMessage('im gonna disconnect', 1000);
      await addTeenMessage('...', 2000);
      await addTeenMessage('ok but what do u want anyway', 1200);
      setPhase('bargain');
    } else {
      await addTeenMessage('huh?', 1000);
      await addTeenMessage('i dont understand', 1200);
      await addTeenMessage('speak properly, what do u want?', 1000);
    }
  };
  
  const handleBargainPhase = async (playerText: string) => {
    const lower = playerText.toLowerCase();
    
    if (lower.includes('save') || lower.includes('store') || lower.includes('floppy') || lower.includes('disk') || lower.includes('cd') || lower.includes('file') || lower.includes('backup')) {
      await addTeenMessage('hmmmm', 1000);
      await addTeenMessage('let me think...', 1500);
      await addTeenMessage('ok ill do it', 2000);
      await addTeenMessage('BUT', 800);
      await addTeenMessage('u gotta help me with something first', 1200);
      await addTeenMessage('my math teacher gave me equation homework', 1500);
      await addTeenMessage('and i dont know how to do it 😭', 1200);
      await addTeenMessage('if u solve the 3 questions ill save ur files', 1500);
      await addTeenMessage('deal?', 800);
      
      addSystemMessage('═══ DEAL: Solve 3 linear equations ═══');
      setPhase('math');
      
      // Show first question
      await new Promise(resolve => setTimeout(resolve, 1500));
      await addTeenMessage(`ok first question:`, 1000);
      await addTeenMessage(`${MATH_QUESTIONS[0].equation}`, 1200);
      await addTeenMessage(`what is x?`, 800);
      
    } else if (lower.includes('government') || lower.includes('et') || lower.includes('alien') || lower.includes('ufo') || lower.includes('varginha')) {
      await addTeenMessage('LOLOLOLOL', 1000);
      await addTeenMessage('aliens??? r u joking', 1500);
      await addTeenMessage('my uncle talks about that stuff', 1200);
      await addTeenMessage('but maybe its true idk', 1500);
      await addTeenMessage('what do u want me to do?', 1000);
    } else if (lower.includes('please')) {
      await addTeenMessage('hmm ur asking nicely', 1200);
      await addTeenMessage('what exactly do u want?', 1000);
    } else {
      await addTeenMessage('ok but what do i get out of this?', 1200);
      await addTeenMessage('im not gonna do anything for free', 1500);
    }
  };
  
  const handleMathPhase = async (playerText: string) => {
    const answer = parseInt(playerText.replace(/[^0-9-]/g, ''));
    const question = MATH_QUESTIONS[currentQuestion];
    
    if (isNaN(answer)) {
      await addTeenMessage('thats not a number dude', 1000);
      await addTeenMessage(`hint: ${question.hint}`, 1200);
      return;
    }
    
    if (answer === question.answer) {
      // Correct answer
      await addTeenMessage('yesss!!! correct 🎉', 1200);
      
      const nextQuestion = currentQuestion + 1;
      setCurrentQuestion(nextQuestion);
      setWrongAttempts(0);
      
      if (nextQuestion >= MATH_QUESTIONS.length) {
        // All questions answered - victory!
        await addTeenMessage('wow ur so smart', 1500);
        await addTeenMessage('thx for helping me!', 1200);
        await addTeenMessage('ok im gonna save ur files', 1500);
        
        addSystemMessage('═══ SAVING FILES ═══');
        setPhase('sending');
        
        await new Promise(resolve => setTimeout(resolve, 2000));
        await addTeenMessage('getting a floppy disk...', 1500);
        await addTeenMessage('copying...', 2000);
        
        addSystemMessage('[▓▓▓▓▓▓▓▓▓▓] 100% - COMPLETE');
        
        await addTeenMessage('done!', 1200);
        await addTeenMessage('saved everything to a floppy', 1500);
        await addTeenMessage('gonna hide it under my bed', 1200);
        await addTeenMessage('no one will find it 😎', 1000);
        
        addSystemMessage('═══════════════════════════════════════════════════════════');
        addSystemMessage('MISSION COMPLETE');
        addSystemMessage('The evidence was saved to physical media.');
        addSystemMessage('The files survived the system purge.');
        addSystemMessage('═══════════════════════════════════════════════════════════');
        
        setPhase('victory');
        
        // Trigger victory after delay
        setTimeout(() => {
          onVictoryAction();
        }, 5000);
        
      } else {
        // Next question
        await new Promise(resolve => setTimeout(resolve, 1000));
        const ordinal = nextQuestion === 1 ? '2nd' : '3rd';
        await addTeenMessage(`now the ${ordinal}:`, 1200);
        await addTeenMessage(`${MATH_QUESTIONS[nextQuestion].equation}`, 1200);
        await addTeenMessage(`well?`, 800);
      }
    } else {
      // Wrong answer
      setWrongAttempts(prev => prev + 1);
      
      if (wrongAttempts >= 2) {
        await addTeenMessage('dude u dont know math either?? 😂', 1200);
        await addTeenMessage(`hint: ${question.hint}`, 1500);
        setWrongAttempts(0);
      } else {
        await addTeenMessage('wrong 😅', 1000);
        await addTeenMessage('try again', 800);
      }
    }
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
          <div className={styles.contactStatus}>🟢 Online</div>
        </div>
      </div>
      
      {/* Chat Area */}
      <div className={styles.chatArea} ref={chatRef}>
        {messages.map((msg, index) => (
          <div key={index} className={`${styles.message} ${styles[msg.sender]}`}>
            {msg.sender === 'system' ? (
              <div className={styles.systemMessage}>{msg.text}</div>
            ) : (
              <>
                <span className={styles.messageTime}>{msg.timestamp}</span>
                <span className={styles.messageSender}>
                  {msg.sender === 'teen' ? 'xXx_DarkMaster_xXx' : 'Você'}:
                </span>
                <span className={styles.messageText}>{msg.text}</span>
              </>
            )}
          </div>
        ))}
        {isTyping && (
          <div className={styles.typing}>
            xXx_DarkMaster_xXx está digitando...
          </div>
        )}
      </div>
      
      {/* Input Area */}
      <div className={styles.inputArea}>
        <form onSubmit={handleSubmit} className={styles.inputForm}>
          <input
            ref={inputRef}
            type="text"
            value={inputValue}
            onChange={e => setInputValue(e.target.value)}
            placeholder={phase === 'victory' ? 'Missão completa!' : 'Digite sua mensagem...'}
            disabled={isTyping || phase === 'victory' || phase === 'sending'}
            className={styles.input}
          />
          <button 
            type="submit" 
            className={styles.sendButton}
            disabled={isTyping || phase === 'victory' || phase === 'sending'}
          >
            Enviar
          </button>
        </form>
      </div>
      
      {/* Status Bar */}
      <div className={styles.statusBar}>
        <span>Conectado via modem 56k</span>
        <span>|</span>
        <span>{phase === 'math' ? `Questão ${currentQuestion + 1}/3` : 'ICQ 99a'}</span>
      </div>
    </div>
  );
}
