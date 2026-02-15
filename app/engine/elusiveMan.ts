// Elusive Man Leak Mechanic for Terminal 1996
//
// This system handles the final leak sequence where the player must demonstrate
// real understanding of the evidence they've gathered by answering 5 questions
// from the Elusive Man - a cold, calculating information broker.

import { GameState, CommandResult, TerminalEntry, TruthCategory } from '../types';

// ═══════════════════════════════════════════════════════════════════════════
// CONSTANTS
// ═══════════════════════════════════════════════════════════════════════════

export const LEAK_DETECTION_PENALTY = 18; // Detection increase per wrong answer
export const LEAK_MAX_WRONG_ANSWERS = 3; // 3 wrong = game over
export const LEAK_TOTAL_QUESTIONS = 5;

// ═══════════════════════════════════════════════════════════════════════════
// QUESTION DEFINITIONS
// ═══════════════════════════════════════════════════════════════════════════

export interface LeakQuestion {
  id: string;
  category: string; // Display label: [ORIGIN], [LOCATION], etc.
  question: string;
  acceptedConcepts: string[][]; // Arrays of synonyms/related concepts (any match = correct)
  partialMatchHint: string; // Response when close but not quite
}

export const LEAK_QUESTIONS: LeakQuestion[] = [
  {
    id: 'debris_relocation',
    category: 'DEBRIS',
    question: 'The recovered material was relocated. Where was it taken?',
    acceptedConcepts: [
      ['campinas', 'campina'],
      ['esa', 'e.s.a.', 'escola de sargentos'],
      ['military base', 'army base', 'air base', 'base militar'],
      ['hangar', 'hangar 4'],
      ['tres coracoes', 'três corações'],
      ['storage', 'storage site', 'vault'],
      ['research center', 'research facility'],
      ['relocated', 'relocation', 'transfer', 'transferred', 'transported'],
      ['convoy', 'trucks'],
      ['zona militar', 'military zone'],
    ],
    partialMatchHint: 'Check the transport logs. Where did the convoy go?',
  },
  {
    id: 'being_containment',
    category: 'CONTAINMENT',
    question: 'What were the biological specimens? How many were contained?',
    acceptedConcepts: [
      ['three', '3', 'tres', 'três'],
      ['biological', 'biologic', 'biologics', 'bio-construct'],
      ['bio-a', 'bio-b', 'bio-c'],
      ['creature', 'creatures', 'entity', 'entities', 'being', 'beings'],
      ['specimen', 'specimens', 'subject', 'subjects'],
      ['contained', 'containment', 'captured', 'secured'],
      ['non-human', 'non human', 'nonhuman'],
      ['humanitas', 'hospital'],
      ['site 7'],
      ['autopsy', 'autopsied', 'necropsy'],
      ['manufactured', 'construct', 'bio-construct'],
      ['one died', 'one expired', 'one deceased', 'bio-c expired'],
    ],
    partialMatchHint: 'How many were recovered? What were they designated? Check the containment logs.',
  },
  {
    id: 'telepathic_scouts',
    category: 'PSI-COMM',
    question: 'How did the beings communicate, and what was their function?',
    acceptedConcepts: [
      ['telepathic', 'telepathy', 'telepaths'],
      ['psi', 'psionic', 'psychic', 'psi-comm'],
      ['neural', 'neurological', 'theta-wave', 'eeg'],
      ['scout', 'scouting', 'scouts', 'reconnaissance', 'recon'],
      ['bio-construct', 'bio construct', 'manufactured'],
      ['non-acoustic', 'non acoustic'],
      ['mental', 'mind', 'thought', 'thoughts'],
      ['transmission', 'transmit', 'transmitted'],
      ['conceptual', 'projection'],
      ['cataloguing', 'cataloging', 'survey', 'mapping'],
    ],
    partialMatchHint: 'Not through words. What did the psi-comm logs reveal about their purpose?',
  },
  {
    id: 'international_actors',
    category: 'FOREIGN',
    question: 'Which external powers were involved beyond Brazil?',
    acceptedConcepts: [
      ['american', 'americans', 'usa', 'us', 'united states', 'u.s.'],
      ['us military', 'american military', 'pentagon'],
      ['langley', 'cia', 'central intelligence'],
      ['nsa', 'signals intelligence'],
      ['embassy', 'diplomatic', 'diplomat'],
      ['protocol echo'],
      ['tel aviv', 'israel', 'israeli'],
      ['bilateral', 'treaty'],
      ['norad'],
      ['foreign', 'international', 'external'],
      ['liaison'],
    ],
    partialMatchHint: 'Who has the resources for such operations? Think about the diplomatic cables.',
  },
  {
    id: 'transition_2026',
    category: 'CONVERGENCE',
    question: 'What future event do the files point to? When?',
    acceptedConcepts: [
      ['2026'],
      ['thirty rotations', '30 rotations', 'thirty years', '30 years'],
      ['transition', 'convergence', 'activation'],
      ['window', 'activation window'],
      ['september', 'september 2026'],
      ['phase 3', 'phase three'],
      ['seeding', 'seed', 'project seed'],
      ['countdown'],
      ['coming', 'something is coming'],
      ['cycle', '30-year cycle', 'thirty-year cycle'],
    ],
    partialMatchHint: 'The "thirty rotations" reference. What year does it point to?',
  },
];

// ═══════════════════════════════════════════════════════════════════════════
// ELUSIVE MAN DIALOGUE
// ═══════════════════════════════════════════════════════════════════════════

export const ELUSIVE_MAN_INTRO = [
  '',
  '▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓',
  '',
  '  SECURE CHANNEL ESTABLISHED',
  '  ENCRYPTION: QUANTUM-GRADE',
  '',
  '▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓',
  '',
];

export const ELUSIVE_MAN_GREETING = [
  '  So. You found a way to reach me.',
  '',
  '  I have resources. You have information.',
  '  Let\'s see if it\'s worth my time.',
  '',
  '  Five questions. Answer them correctly, and the truth goes public.',
  '  Answer wrong... and you\'ll wish you hadn\'t made contact.',
  '',
  '  Every mistake increases your exposure. Significantly.',
  '  Three failures and this conversation never happened.',
  '',
  '  Let\'s begin.',
  '',
];

export const ELUSIVE_MAN_CORRECT_RESPONSES = [
  'Acceptable.',
  'Continue.',
  'Correct.',
  'Adequate.',
  'Precisely.',
  'That checks out.',
  'Verified.',
];

export const ELUSIVE_MAN_WRONG_RESPONSES = [
  'Disappointing. That will cost you.',
  'Incorrect. Your exposure just increased substantially.',
  'Wrong. They\'re getting closer to finding you.',
  'That\'s not what the files say. Risk spike logged.',
];

export const ELUSIVE_MAN_PARTIAL_RESPONSES = [
  'Close, but not quite. Elaborate.',
  'You\'re in the vicinity. Be more specific.',
  'Partially correct. Think harder.',
  'Almost. What else?',
];

export const ELUSIVE_MAN_VICTORY = [
  '',
  '▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓',
  '',
  '  Five for five. Impressive.',
  '',
  '  You\'ve done your homework. The evidence is... compelling.',
  '',
  '  The leak is initiated. Multiple outlets. Redundant backups.',
  '  By morning, the world will know what happened in Varginha.',
  '',
  '  Your work here is done. Disappear. Now.',
  '',
  '▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓',
  '',
  '  >> LEAK SUCCESSFUL <<',
  '',
];

export const ELUSIVE_MAN_LOCKOUT = [
  '',
  '▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓',
  '',
  '  Three strikes. You\'re out.',
  '',
  '  You don\'t have the intelligence. Literally.',
  '  This channel is compromised. Connection terminated.',
  '',
  '  Good luck with whoever\'s knocking at your door.',
  '',
  '▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓',
  '',
  '  >> SYSTEM LOCKOUT <<',
  '',
];

export const ELUSIVE_MAN_ABORT = [
  '',
  '  Wise choice. Or cowardly. Time will tell.',
  '  Come back when you\'re ready.',
  '',
  '  Channel closed.',
  '',
];

// ═══════════════════════════════════════════════════════════════════════════
// SEMANTIC MATCHING
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Result of semantic answer evaluation
 */
export interface AnswerEvaluationResult {
  isCorrect: boolean;
  isPartialMatch: boolean;
  matchedConcepts: string[]; // Which concepts were matched
}

/**
 * Normalize text for matching: lowercase, remove punctuation, trim
 */
export function normalizeText(text: string): string {
  return text
    .toLowerCase()
    .replace(/[.,!?;:'"()[\]{}]/g, '') // Remove punctuation
    .replace(/\s+/g, ' ') // Normalize whitespace
    .trim();
}

/**
 * Check if a word appears in the answer (with word boundary awareness)
 */
function wordMatches(answer: string, word: string): boolean {
  const normalizedAnswer = normalizeText(answer);
  const normalizedWord = normalizeText(word);
  
  // Direct substring match (for multi-word phrases)
  if (normalizedAnswer.includes(normalizedWord)) {
    return true;
  }
  
  // Word boundary match (for single words)
  const words = normalizedAnswer.split(/\s+/);
  return words.some(w => {
    // Exact match
    if (w === normalizedWord) return true;
    // Starts with (for partial word matches like "recon" matching "reconnaissance")
    if (w.startsWith(normalizedWord) && normalizedWord.length >= 4) return true;
    if (normalizedWord.startsWith(w) && w.length >= 4) return true;
    return false;
  });
}

/**
 * Evaluate if an answer matches the expected concepts for a question
 */
export function evaluateAnswer(
  answer: string,
  question: LeakQuestion
): AnswerEvaluationResult {
  const normalizedAnswer = normalizeText(answer);
  const matchedConcepts: string[] = [];
  
  // Empty answer is never correct
  if (normalizedAnswer.length < 2) {
    return { isCorrect: false, isPartialMatch: false, matchedConcepts: [] };
  }
  
  // Check each concept group
  for (const conceptGroup of question.acceptedConcepts) {
    for (const concept of conceptGroup) {
      if (wordMatches(answer, concept)) {
        matchedConcepts.push(concept);
        break; // Only count one match per group
      }
    }
  }
  
  // Correct if at least one concept matched
  const isCorrect = matchedConcepts.length > 0;
  
  // Partial match: answer is long enough to suggest effort but no concepts matched
  // This triggers the "elaborate" response
  const isPartialMatch = !isCorrect && normalizedAnswer.length >= 10 && 
    normalizedAnswer.split(/\s+/).length >= 2;
  
  return { isCorrect, isPartialMatch, matchedConcepts };
}

// ═══════════════════════════════════════════════════════════════════════════
// STATE HELPERS
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Check if player is currently in a leak sequence
 */
export function isInLeakSequence(state: GameState): boolean {
  return state.inLeakSequence === true;
}

/**
 * Get the current leak question (0-indexed)
 */
export function getCurrentLeakQuestion(state: GameState): LeakQuestion | null {
  const index = state.currentLeakQuestion ?? 0;
  return LEAK_QUESTIONS[index] ?? null;
}

/**
 * Get a random response from an array (deterministic based on state)
 */
function getRandomResponse(responses: string[], index: number): string {
  return responses[index % responses.length];
}

// ═══════════════════════════════════════════════════════════════════════════
// ENTRY HELPER
// ═══════════════════════════════════════════════════════════════════════════

function createEntry(
  type: TerminalEntry['type'],
  content: string
): TerminalEntry {
  return {
    id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    type,
    content,
    timestamp: Date.now(),
  };
}

// ═══════════════════════════════════════════════════════════════════════════
// MAIN HANDLERS
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Start the leak sequence with the Elusive Man
 */
export function startLeakSequence(state: GameState): CommandResult {
  const output: TerminalEntry[] = [];
  
  // Intro sequence
  for (const line of ELUSIVE_MAN_INTRO) {
    output.push(createEntry(line.includes('▓') ? 'warning' : 'system', line));
  }
  
  // Greeting
  for (const line of ELUSIVE_MAN_GREETING) {
    output.push(createEntry('output', `  ${line}`));
  }
  
  // First question
  const firstQuestion = LEAK_QUESTIONS[0];
  output.push(createEntry('system', ''));
  output.push(createEntry('warning', `  [${firstQuestion.category}]`));
  output.push(createEntry('output', `  "${firstQuestion.question}"`));
  output.push(createEntry('system', ''));
  output.push(createEntry('system', '  Type your answer, or "abort" to disconnect.'));
  output.push(createEntry('system', ''));
  
  return {
    output,
    stateChanges: {
      inLeakSequence: true,
      currentLeakQuestion: 0,
      leakWrongAnswers: 0,
      leakAnswers: [],
    },
    delayMs: 1500,
    triggerFlicker: true,
  };
}

/**
 * Process an answer during the leak sequence
 */
export function processLeakAnswer(
  answer: string,
  state: GameState
): CommandResult {
  const output: TerminalEntry[] = [];
  const currentIndex = state.currentLeakQuestion ?? 0;
  const wrongAnswers = state.leakWrongAnswers ?? 0;
  const previousAnswers = state.leakAnswers ?? [];
  const question = LEAK_QUESTIONS[currentIndex];
  
  if (!question) {
    // Shouldn't happen, but handle gracefully
    return {
      output: [createEntry('error', 'Sequence error. Connection lost.')],
      stateChanges: {
        inLeakSequence: false,
        currentLeakQuestion: 0,
        leakWrongAnswers: 0,
      },
    };
  }
  
  // Check for abort
  const normalizedAnswer = normalizeText(answer);
  if (normalizedAnswer === 'abort' || normalizedAnswer === 'cancel' || normalizedAnswer === 'quit') {
    for (const line of ELUSIVE_MAN_ABORT) {
      output.push(createEntry('output', line));
    }
    return {
      output,
      stateChanges: {
        inLeakSequence: false,
        currentLeakQuestion: 0,
        leakWrongAnswers: 0,
        leakAnswers: [],
      },
      delayMs: 500,
    };
  }
  
  // Evaluate the answer
  const evaluation = evaluateAnswer(answer, question);
  const newAnswers = [...previousAnswers, answer];
  
  if (evaluation.isCorrect) {
    // Correct answer
    const responseIndex = currentIndex;
    output.push(createEntry('system', ''));
    output.push(createEntry('notice', `  ${getRandomResponse(ELUSIVE_MAN_CORRECT_RESPONSES, responseIndex)}`));
    
    const nextIndex = currentIndex + 1;
    
    if (nextIndex >= LEAK_QUESTIONS.length) {
      // All questions answered correctly - VICTORY!
      output.push(createEntry('system', ''));
      for (const line of ELUSIVE_MAN_VICTORY) {
        output.push(createEntry(line.includes('▓') || line.includes('SUCCESSFUL') ? 'notice' : 'output', line));
      }
      
      return {
        output,
        stateChanges: {
          inLeakSequence: false,
          currentLeakQuestion: 0,
          leakWrongAnswers: 0,
          leakAnswers: newAnswers,
          gameWon: true,
          endingType: 'good',
          evidencesSaved: true,
          flags: {
            ...state.flags,
            leakSuccessful: true,
            allEvidenceCollected: true,
          },
        },
        delayMs: 2000,
        triggerFlicker: true,
        skipToPhase: 'victory',
      };
    }
    
    // Next question
    const nextQuestion = LEAK_QUESTIONS[nextIndex];
    output.push(createEntry('system', ''));
    output.push(createEntry('warning', `  [${nextQuestion.category}]`));
    output.push(createEntry('output', `  "${nextQuestion.question}"`));
    output.push(createEntry('system', ''));
    
    return {
      output,
      stateChanges: {
        currentLeakQuestion: nextIndex,
        leakAnswers: newAnswers,
      },
      delayMs: 800,
    };
  }
  
  if (evaluation.isPartialMatch) {
    // Partial match - give a hint but don't penalize
    output.push(createEntry('system', ''));
    output.push(createEntry('warning', `  ${getRandomResponse(ELUSIVE_MAN_PARTIAL_RESPONSES, currentIndex)}`));
    output.push(createEntry('output', `  ${question.partialMatchHint}`));
    output.push(createEntry('system', ''));
    
    return {
      output,
      stateChanges: {},
      delayMs: 500,
    };
  }
  
  // Wrong answer
  const newWrongAnswers = wrongAnswers + 1;
  const newDetection = Math.min(100, (state.detectionLevel ?? 0) + LEAK_DETECTION_PENALTY);
  
  output.push(createEntry('system', ''));
  output.push(createEntry('error', `  ${getRandomResponse(ELUSIVE_MAN_WRONG_RESPONSES, newWrongAnswers)}`));
  output.push(createEntry('warning', `  [DETECTION: +${LEAK_DETECTION_PENALTY}%]`));
  output.push(createEntry('system', `  [Wrong answers: ${newWrongAnswers}/${LEAK_MAX_WRONG_ANSWERS}]`));
  
  if (newWrongAnswers >= LEAK_MAX_WRONG_ANSWERS) {
    // Game over - too many wrong answers
    output.push(createEntry('system', ''));
    for (const line of ELUSIVE_MAN_LOCKOUT) {
      output.push(createEntry(line.includes('▓') || line.includes('LOCKOUT') ? 'error' : 'output', line));
    }
    
    return {
      output,
      stateChanges: {
        inLeakSequence: false,
        currentLeakQuestion: 0,
        leakWrongAnswers: newWrongAnswers,
        leakAnswers: newAnswers,
        detectionLevel: newDetection,
        isGameOver: true,
        gameOverReason: 'ELUSIVE MAN LOCKOUT - INSUFFICIENT INTELLIGENCE',
        endingType: 'bad',
      },
      delayMs: 2000,
      triggerFlicker: true,
      skipToPhase: 'bad_ending',
    };
  }
  
  // Continue with same question
  output.push(createEntry('system', ''));
  output.push(createEntry('output', '  Try again.'));
  output.push(createEntry('system', ''));
  
  return {
    output,
    stateChanges: {
      leakWrongAnswers: newWrongAnswers,
      leakAnswers: newAnswers,
      detectionLevel: newDetection,
    },
    delayMs: 800,
  };
}

/**
 * Get status message showing leak progress
 */
export function getLeakStatus(state: GameState): string[] {
  if (!state.inLeakSequence) {
    return [];
  }
  
  const currentIndex = state.currentLeakQuestion ?? 0;
  const wrongAnswers = state.leakWrongAnswers ?? 0;
  
  return [
    '',
    '═══ ELUSIVE MAN INTERROGATION ═══',
    `  Question: ${currentIndex + 1}/${LEAK_QUESTIONS.length}`,
    `  Errors: ${wrongAnswers}/${LEAK_MAX_WRONG_ANSWERS}`,
    '═════════════════════════════════',
  ];
}
