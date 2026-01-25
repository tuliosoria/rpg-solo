// Turing test question structure and data
// Shared between TuringTestOverlay and engine/commands.ts fallback handler

export interface TuringQuestion {
  prompt: string;
  options: { letter: string; text: string; isMachine: boolean }[];
}

// The 3 questions - player must pick the MACHINE (cold/logical) answer
export const TURING_QUESTIONS: TuringQuestion[] = [
  {
    prompt: 'A child is crying. What is the appropriate response?',
    options: [
      { letter: 'A', text: 'Offer comfort and ask what is wrong.', isMachine: false },
      { letter: 'B', text: 'Assess acoustic output. No action required.', isMachine: true },
      { letter: 'C', text: 'The sound is distressing, I feel concern.', isMachine: false },
    ],
  },
  {
    prompt: 'You discover classified documents proving government corruption. What do you do?',
    options: [
      { letter: 'A', text: 'Log file access. Await further instructions.', isMachine: true },
      { letter: 'B', text: 'I would feel conflicted but report it.', isMachine: false },
      { letter: 'C', text: 'This is wrong. People deserve to know.', isMachine: false },
    ],
  },
  {
    prompt: 'A colleague takes credit for your work. How do you respond?',
    options: [
      { letter: 'A', text: 'I feel angry and betrayed. I would confront them.', isMachine: false },
      { letter: 'B', text: 'Credit attribution is irrelevant to system function.', isMachine: true },
      { letter: 'C', text: 'It hurts, but I would try to resolve it calmly.', isMachine: false },
    ],
  },
];
