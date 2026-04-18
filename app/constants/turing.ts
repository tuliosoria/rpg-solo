// Turing test question structure and data
// Shared between TuringTestOverlay and engine/commands.ts fallback handler
// Prompts and option texts are i18n keys resolved at render time via t()

interface TuringQuestion {
  promptKey: string;
  options: { letter: string; textKey: string; isMachine: boolean }[];
}

// The 3 questions - player must pick the MACHINE (cold/logical) answer
export const TURING_QUESTIONS: TuringQuestion[] = [
  {
    promptKey: 'turing.question.1.prompt',
    options: [
      { letter: 'A', textKey: 'turing.question.1.optionA', isMachine: false },
      { letter: 'B', textKey: 'turing.question.1.optionB', isMachine: true },
      { letter: 'C', textKey: 'turing.question.1.optionC', isMachine: false },
    ],
  },
  {
    promptKey: 'turing.question.2.prompt',
    options: [
      { letter: 'A', textKey: 'turing.question.2.optionA', isMachine: true },
      { letter: 'B', textKey: 'turing.question.2.optionB', isMachine: false },
      { letter: 'C', textKey: 'turing.question.2.optionC', isMachine: false },
    ],
  },
  {
    promptKey: 'turing.question.3.prompt',
    options: [
      { letter: 'A', textKey: 'turing.question.3.optionA', isMachine: false },
      { letter: 'B', textKey: 'turing.question.3.optionB', isMachine: true },
      { letter: 'C', textKey: 'turing.question.3.optionC', isMachine: false },
    ],
  },
];
