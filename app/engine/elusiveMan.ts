// Elusive Man Leak Mechanic for Terminal 1996
//
// This system handles the final leak sequence where the player must demonstrate
// real understanding of the evidence they've gathered by answering 5 questions
// from the Elusive Man - a cold, calculating information broker.

import { GameState, CommandResult, TerminalEntry } from '../types';
import { translateStatic } from '../i18n';
import { generateEntryId } from './commands/utils';

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

type TranslationValues = Record<string, string | number>;

function tElusive(key: string, fallback: string, values?: TranslationValues): string {
  return translateStatic(`engine.elusiveMan.${key}`, values, fallback);
}

function tElusiveLines(key: string, fallback: string[]): string[] {
  return tElusive(key, fallback.join('\n')).split('\n');
}

function createLeakQuestion(
  id: string,
  categoryFallback: string,
  questionFallback: string,
  acceptedConcepts: string[][],
  partialMatchHintFallback: string
): LeakQuestion {
  return {
    id,
    get category() {
      return tElusive(`questions.${id}.category`, categoryFallback);
    },
    get question() {
      return tElusive(`questions.${id}.question`, questionFallback);
    },
    acceptedConcepts,
    get partialMatchHint() {
      return tElusive(`questions.${id}.partialMatchHint`, partialMatchHintFallback);
    },
  };
}

export const LEAK_QUESTIONS: LeakQuestion[] = [
  createLeakQuestion(
    'debris_relocation',
    'DEBRIS',
    'They moved the debris. Where?',
    [
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
    'Follow the convoy.'
  ),
  createLeakQuestion(
    'being_containment',
    'CONTAINMENT',
    'How many specimens, and what were they?',
    [
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
    'Count them. Use the containment labels.'
  ),
  createLeakQuestion(
    'telepathic_scouts',
    'PSI-COMM',
    'How did they communicate, and why were they here?',
    [
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
    'Not speech. Think psi-comm and purpose.'
  ),
  createLeakQuestion(
    'international_actors',
    'FOREIGN',
    'Who was involved besides Brazil?',
    [
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
    'Read the diplomatic cables.'
  ),
  createLeakQuestion(
    'transition_2026',
    'CONVERGENCE',
    'What were the files counting down to? When?',
    [
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
    'Thirty rotations. Name the year.'
  ),
];

// ═══════════════════════════════════════════════════════════════════════════
// ELUSIVE MAN DIALOGUE
// ═══════════════════════════════════════════════════════════════════════════

const ELUSIVE_MAN_INTRO_FALLBACK = [
  '',
  '▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓',
  '',
  '  SECURE CHANNEL OPEN',
  '  QUANTUM HANDSHAKE',
  '',
  '▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓',
  '',
];

const ELUSIVE_MAN_GREETING_FALLBACK = [
  '  You found me.',
  '',
  '  I have resources. You have proof.',
  '  Five answers buy a leak.',
  '',
  '  Each mistake raises exposure.',
  '  Three strikes and this channel dies.',
  '',
  '  Begin.',
  '',
];

const ELUSIVE_MAN_CORRECT_RESPONSES_FALLBACK = [
  'Acceptable.',
  'Continue.',
  'Correct.',
  'Adequate.',
  'Precisely.',
  'That checks out.',
  'Verified.',
];

const ELUSIVE_MAN_WRONG_RESPONSES_FALLBACK = [
  'Disappointing. Exposure rises.',
  'Incorrect. They felt that.',
  'Wrong. They\'re triangulating.',
  'Not what the files say. Risk spike.',
];

const ELUSIVE_MAN_PARTIAL_RESPONSES_FALLBACK = [
  'Close. Be sharper.',
  'Near it. Be more specific.',
  'Partly right. Finish it.',
  'Almost. What else?',
];

const ELUSIVE_MAN_VICTORY_FALLBACK = [
  '',
  '▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓',
  '',
  '  Five for five.',
  '',
  '  Leak initiated. Mirrors are live.',
  '  Be gone before dawn.',
  '',
  '▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓',
  '',
  '  >> LEAK SUCCESSFUL <<',
  '',
];

const ELUSIVE_MAN_LOCKOUT_FALLBACK = [
  '',
  '▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓',
  '',
  '  Three strikes.',
  '',
  '  Channel burned. Connection terminated.',
  '  Listen for the knock.',
  '',
  '▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓',
  '',
  '  >> SYSTEM LOCKOUT <<',
  '',
];

const ELUSIVE_MAN_ABORT_FALLBACK = [
  '',
  '  Wise choice. Or not.',
  '',
  '  Channel closed.',
  '',
];

function getElusiveManIntro(): string[] {
  return tElusiveLines('intro', ELUSIVE_MAN_INTRO_FALLBACK);
}

function getElusiveManGreeting(): string[] {
  return tElusiveLines('greeting', ELUSIVE_MAN_GREETING_FALLBACK);
}

function getElusiveManCorrectResponses(): string[] {
  return tElusiveLines('correctResponses', ELUSIVE_MAN_CORRECT_RESPONSES_FALLBACK);
}

function getElusiveManWrongResponses(): string[] {
  return tElusiveLines('wrongResponses', ELUSIVE_MAN_WRONG_RESPONSES_FALLBACK);
}

function getElusiveManPartialResponses(): string[] {
  return tElusiveLines('partialResponses', ELUSIVE_MAN_PARTIAL_RESPONSES_FALLBACK);
}

function getElusiveManVictory(): string[] {
  return tElusiveLines('victory', ELUSIVE_MAN_VICTORY_FALLBACK);
}

function getElusiveManLockout(): string[] {
  return tElusiveLines('lockout', ELUSIVE_MAN_LOCKOUT_FALLBACK);
}

function getElusiveManAbort(): string[] {
  return tElusiveLines('abort', ELUSIVE_MAN_ABORT_FALLBACK);
}

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
    id: generateEntryId(),
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
export function startLeakSequence(): CommandResult {
  const output: TerminalEntry[] = [];
  
  // Intro sequence
  for (const line of getElusiveManIntro()) {
    output.push(createEntry(line.includes('▓') ? 'warning' : 'system', line));
  }
  
  // Greeting
  for (const line of getElusiveManGreeting()) {
    output.push(createEntry('output', `  ${line}`));
  }
  
  // First question
  const firstQuestion = LEAK_QUESTIONS[0];
  output.push(createEntry('system', ''));
  output.push(createEntry('warning', `  [${firstQuestion.category}]`));
  output.push(createEntry('output', `  "${firstQuestion.question}"`));
  output.push(createEntry('system', ''));
  output.push(
    createEntry(
      'system',
      tElusive(
        'answerPrompt',
        '  Type your answer, or "abort" to disconnect.'
      )
    )
  );
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
      output: [createEntry('error', tElusive('sequenceError', 'Sequence error. Connection lost.'))],
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
    for (const line of getElusiveManAbort()) {
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
    output.push(
      createEntry(
        'notice',
        `  ${getRandomResponse(getElusiveManCorrectResponses(), responseIndex)}`
      )
    );
    
    const nextIndex = currentIndex + 1;
    
    if (nextIndex >= LEAK_QUESTIONS.length) {
      // All questions answered correctly!
      output.push(createEntry('system', ''));
      for (const line of getElusiveManVictory()) {
        output.push(createEntry(line.includes('▓') || line.includes('>>') ? 'notice' : 'output', line));
      }
      
      // Check if player has conspiracy files to optionally leak
      const hasConspiracyFiles = state.conspiracyFilesSeen && state.conspiracyFilesSeen.size > 0;
      
      if (hasConspiracyFiles) {
        // Ask about additional files before proceeding to victory
        output.push(createEntry('system', ''));
        output.push(createEntry('warning', '═══════════════════════════════════════════════════════════'));
        output.push(createEntry('system', ''));
        output.push(
          createEntry(
            'notice',
            tElusive('additionalFilesDetected', '  ADDITIONAL FILES DETECTED')
          )
        );
        output.push(createEntry('system', ''));
        output.push(
          createEntry(
            'output',
            tElusive(
              'conspiracyChoice.cacheCount',
              '  You have {{count}} conspiracy document(s) in your cache.',
              { count: state.conspiracyFilesSeen.size }
            )
          )
        );
        output.push(
          createEntry(
            'output',
            tElusive(
              'conspiracyChoice.exposureWarning',
              '  These expose government operations beyond the alien evidence.'
            )
          )
        );
        output.push(createEntry('system', ''));
        output.push(
          createEntry(
            'warning',
            tElusive(
              'conspiracyChoice.panicWarning',
              '  WARNING: Releasing these may cause widespread panic.'
            )
          )
        );
        output.push(createEntry('system', ''));
        output.push(
          createEntry(
            'output',
            tElusive(
              'conspiracyChoice.releaseEverything',
              '  Type "leak all" to release everything.'
            )
          )
        );
        output.push(
          createEntry(
            'output',
            tElusive(
              'conspiracyChoice.alienOnly',
              '  Type "continue" to proceed with alien evidence only.'
            )
          )
        );
        output.push(createEntry('system', ''));
        
        return {
          output,
          stateChanges: {
            inLeakSequence: false,
            leakQuestionsComplete: true, // Mark questions as done
            currentLeakQuestion: 0,
            leakWrongAnswers: 0,
            leakAnswers: newAnswers,
            pendingConspiracyChoice: true, // New flag for this decision point
            evidencesSaved: true,
            flags: {
              ...state.flags,
              leakSuccessful: true,
            },
          },
          delayMs: 2000,
          triggerFlicker: true,
        };
      }
      
      // No conspiracy files - proceed directly to victory
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
    output.push(
      createEntry(
        'warning',
        `  ${getRandomResponse(getElusiveManPartialResponses(), currentIndex)}`
      )
    );
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
  output.push(
    createEntry(
      'error',
      `  ${getRandomResponse(getElusiveManWrongResponses(), newWrongAnswers)}`
    )
  );
  output.push(
    createEntry(
      'warning',
      tElusive(
        'detectionIncrease',
        '  [DETECTION: +{{value}}%]',
        { value: LEAK_DETECTION_PENALTY }
      )
    )
  );
  output.push(
    createEntry(
      'system',
      tElusive(
        'wrongAnswersCounter',
        '  [Wrong answers: {{current}}/{{total}}]',
        { current: newWrongAnswers, total: LEAK_MAX_WRONG_ANSWERS }
      )
    )
  );
  
  if (newWrongAnswers >= LEAK_MAX_WRONG_ANSWERS) {
    // Game over - too many wrong answers
    output.push(createEntry('system', ''));
    for (const line of getElusiveManLockout()) {
      output.push(createEntry(line.includes('▓') || line.includes('>>') ? 'error' : 'output', line));
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

  if (newDetection >= 100) {
    output.push(createEntry('error', ''));
    output.push(createEntry('error', '▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓'));
    output.push(createEntry('error', ''));
    output.push(createEntry('error', tElusive('intrusionDetected', '  INTRUSION DETECTED')));
    output.push(createEntry('error', ''));
    output.push(
      createEntry('error', tElusive('tracedConnection', '  Your connection has been traced.'))
    );
    output.push(
      createEntry(
        'error',
        tElusive('securityDispatched', '  Security protocols have been dispatched.')
      )
    );
    output.push(createEntry('error', ''));
    output.push(createEntry('error', tElusive('sessionTerminated', '  >> SESSION TERMINATED <<')));
    output.push(createEntry('error', ''));
    output.push(createEntry('error', '▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓'));
    output.push(createEntry('error', ''));

    return {
      output,
      stateChanges: {
        inLeakSequence: false,
        currentLeakQuestion: 0,
        leakWrongAnswers: newWrongAnswers,
        leakAnswers: newAnswers,
        detectionLevel: newDetection,
        isGameOver: true,
        gameOverReason: 'INTRUSION DETECTED - TRACED',
      },
      delayMs: 800,
      triggerFlicker: true,
    };
  }
  
  // Continue with same question
  output.push(createEntry('system', ''));
  output.push(createEntry('output', tElusive('tryAgain', '  Try again.')));
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
    tElusive('status.header', '═══ ELUSIVE MAN INTERROGATION ═══'),
    tElusive('status.question', '  Question: {{current}}/{{total}}', {
      current: currentIndex + 1,
      total: LEAK_QUESTIONS.length,
    }),
    tElusive('status.errors', '  Errors: {{current}}/{{total}}', {
      current: wrongAnswers,
      total: LEAK_MAX_WRONG_ANSWERS,
    }),
    '═════════════════════════════════',
  ];
}

/**
 * Check if player is at the conspiracy files choice point
 */
export function isPendingConspiracyChoice(state: GameState): boolean {
  return state.pendingConspiracyChoice === true;
}

/**
 * Process the player's choice about leaking conspiracy files
 */
export function processConspiracyChoice(
  answer: string,
  state: GameState
): CommandResult {
  const output: TerminalEntry[] = [];
  const normalizedAnswer = normalizeText(answer);
  
  // Check for "leak all" or similar
  const leakAllKeywords = ['leak all', 'leak everything', 'yes', 'all', 'release all'];
  const continueKeywords = ['continue', 'no', 'skip', 'proceed', 'just alien', 'alien only'];
  
  if (leakAllKeywords.some(kw => normalizedAnswer.includes(kw))) {
    // Player chose to leak conspiracy files
    output.push(createEntry('system', ''));
    output.push(createEntry('warning', '▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓'));
    output.push(createEntry('system', ''));
    output.push(
      createEntry(
        'notice',
        tElusive('conspiracyChoice.fullDisclosure', '  FULL DISCLOSURE INITIATED')
      )
    );
    output.push(createEntry('system', ''));
    output.push(
      createEntry(
        'output',
        tElusive('conspiracyChoice.uploading', '  Uploading conspiracy documents...')
      )
    );
    output.push(
      createEntry(
        'output',
        tElusive(
          'conspiracyChoice.economicSent',
          '  Economic manipulation memos... SENT'
        )
      )
    );
    output.push(
      createEntry(
        'output',
        tElusive('conspiracyChoice.surveillanceSent', '  Surveillance programs... SENT')
      )
    );
    output.push(
      createEntry(
        'output',
        tElusive('conspiracyChoice.weatherSent', '  Weather modification logs... SENT')
      )
    );
    output.push(
      createEntry(
        'output',
        tElusive(
          'conspiracyChoice.revisionismSent',
          '  Historical revisionism records... SENT'
        )
      )
    );
    output.push(createEntry('system', ''));
    output.push(
      createEntry(
        'warning',
        tElusive('conspiracyChoice.everythingOut', '  EVERYTHING IS OUT THERE NOW.')
      )
    );
    output.push(createEntry('system', ''));
    output.push(
      createEntry(
        'error',
        tElusive(
          'conspiracyChoice.ufo74Line1',
          'UFO74: jesus christ, kid. you just blew it all open.'
        )
      )
    );
    output.push(
      createEntry(
        'error',
        tElusive(
          'conspiracyChoice.ufo74Line2',
          '       the aliens AND the conspiracies.'
        )
      )
    );
    output.push(
      createEntry(
        'error',
        tElusive(
          'conspiracyChoice.ufo74Line3',
          '       the world is gonna lose its mind.'
        )
      )
    );
    output.push(createEntry('system', ''));
    
    return {
      output,
      stateChanges: {
        pendingConspiracyChoice: false,
        gameWon: true,
        endingType: 'good',
        flags: {
          ...state.flags,
          conspiracyFilesLeaked: true,
        },
      },
      delayMs: 2500,
      triggerFlicker: true,
      skipToPhase: 'victory',
    };
  }
  
  if (continueKeywords.some(kw => normalizedAnswer.includes(kw))) {
    // Player chose NOT to leak conspiracy files
    output.push(createEntry('system', ''));
    output.push(
      createEntry(
        'notice',
        tElusive(
          'conspiracyChoice.alienOnlyConfirmed',
          '  Understood. Proceeding with alien evidence only.'
        )
      )
    );
    output.push(createEntry('system', ''));
    output.push(
      createEntry(
        'output',
        tElusive(
          'conspiracyChoice.smartChoice',
          'UFO74: smart choice. one bombshell at a time.'
        )
      )
    );
    output.push(
      createEntry(
        'output',
        tElusive('conspiracyChoice.waitLine', '       the conspiracy stuff can wait.')
      )
    );
    output.push(createEntry('system', ''));
    
    return {
      output,
      stateChanges: {
        pendingConspiracyChoice: false,
        gameWon: true,
        endingType: 'good',
        // conspiracyFilesLeaked stays false (or undefined)
      },
      delayMs: 1500,
      triggerFlicker: true,
      skipToPhase: 'victory',
    };
  }
  
  // Unclear response
  output.push(createEntry('system', ''));
  output.push(
    createEntry('warning', tElusive('conspiracyChoice.pleaseClarify', '  Please clarify:'))
  );
  output.push(
    createEntry(
      'output',
      tElusive(
        'conspiracyChoice.releaseAllDocuments',
        '  Type "leak all" to release ALL documents.'
      )
    )
  );
  output.push(
    createEntry(
      'output',
      tElusive(
        'conspiracyChoice.alienOnly',
        '  Type "continue" to proceed with alien evidence only.'
      )
    )
  );
  output.push(createEntry('system', ''));
  
  return {
    output,
    stateChanges: {},
    delayMs: 500,
  };
}
