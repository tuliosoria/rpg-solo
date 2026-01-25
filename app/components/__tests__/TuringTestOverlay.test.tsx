import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent, act } from '@testing-library/react';
import TuringTestOverlay from '../TuringTestOverlay';

// Mock Next.js Image component
vi.mock('next/image', () => ({
  default: ({ src, alt, ...props }: { src: string; alt: string }) => (
    // eslint-disable-next-line @next/next/no-img-element
    <img src={src} alt={alt} {...props} />
  ),
}));

// Mock the turing questions
vi.mock('../../constants/turing', () => ({
  TURING_QUESTIONS: [
    {
      prompt: 'Test question 1?',
      options: [
        { letter: 'A', text: 'Human answer 1', isMachine: false },
        { letter: 'B', text: 'Machine answer 1', isMachine: true },
        { letter: 'C', text: 'Human answer 2', isMachine: false },
      ],
    },
    {
      prompt: 'Test question 2?',
      options: [
        { letter: 'A', text: 'Machine answer 2', isMachine: true },
        { letter: 'B', text: 'Human answer 3', isMachine: false },
        { letter: 'C', text: 'Human answer 4', isMachine: false },
      ],
    },
    {
      prompt: 'Test question 3?',
      options: [
        { letter: 'A', text: 'Human answer 5', isMachine: false },
        { letter: 'B', text: 'Human answer 6', isMachine: false },
        { letter: 'C', text: 'Machine answer 3', isMachine: true },
      ],
    },
  ],
}));

describe('TuringTestOverlay', () => {
  const mockOnComplete = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('renders the turing test header', () => {
    render(<TuringTestOverlay onComplete={mockOnComplete} />);
    
    expect(screen.getByText(/SECURITY PROTOCOL: TURING EVALUATION/)).toBeInTheDocument();
  });

  it('displays instructions to the player', () => {
    render(<TuringTestOverlay onComplete={mockOnComplete} />);
    
    expect(screen.getByText(/You must prove you are an AUTHORIZED TERMINAL PROCESS/)).toBeInTheDocument();
    expect(screen.getByText(/Select the MACHINE response/)).toBeInTheDocument();
  });

  it('shows the first question initially', () => {
    render(<TuringTestOverlay onComplete={mockOnComplete} />);
    
    expect(screen.getByText('"Test question 1?"')).toBeInTheDocument();
    expect(screen.getByText('QUESTION 1 of 3')).toBeInTheDocument();
  });

  it('displays all three options for the first question', () => {
    render(<TuringTestOverlay onComplete={mockOnComplete} />);
    
    expect(screen.getByText('Human answer 1')).toBeInTheDocument();
    expect(screen.getByText('Machine answer 1')).toBeInTheDocument();
    expect(screen.getByText('Human answer 2')).toBeInTheDocument();
  });

  it('shows feedback when an option is selected', () => {
    render(<TuringTestOverlay onComplete={mockOnComplete} />);
    
    // Click on machine answer (correct)
    const machineOption = screen.getByText('Machine answer 1').closest('[class*="option"]');
    fireEvent.click(machineOption!);
    
    expect(screen.getByText('[ ACCEPTABLE RESPONSE ]')).toBeInTheDocument();
  });

  it('shows human pattern detected for wrong answer', () => {
    render(<TuringTestOverlay onComplete={mockOnComplete} />);
    
    // Click on human answer (wrong)
    const humanOption = screen.getByText('Human answer 1').closest('[class*="option"]');
    fireEvent.click(humanOption!);
    
    expect(screen.getByText('[ HUMAN PATTERN DETECTED ]')).toBeInTheDocument();
  });

  it('advances to next question after selection', () => {
    render(<TuringTestOverlay onComplete={mockOnComplete} />);
    
    // Select first option
    const option = screen.getByText('Human answer 1').closest('[class*="option"]');
    fireEvent.click(option!);
    
    // Wait for feedback and transition
    act(() => {
      vi.advanceTimersByTime(1600);
    });
    
    // Should now show question 2
    expect(screen.getByText('"Test question 2?"')).toBeInTheDocument();
    expect(screen.getByText('QUESTION 2 of 3')).toBeInTheDocument();
  });

  it('handles keyboard input for option A', () => {
    render(<TuringTestOverlay onComplete={mockOnComplete} />);
    
    // Press 'A' key
    act(() => {
      fireEvent.keyDown(window, { key: 'A' });
    });
    
    // Should show feedback
    expect(screen.getByText('[ HUMAN PATTERN DETECTED ]')).toBeInTheDocument();
  });

  it('handles keyboard input for option B', () => {
    render(<TuringTestOverlay onComplete={mockOnComplete} />);
    
    // Press 'B' key (machine answer)
    act(() => {
      fireEvent.keyDown(window, { key: 'B' });
    });
    
    // Should show acceptable
    expect(screen.getByText('[ ACCEPTABLE RESPONSE ]')).toBeInTheDocument();
  });

  it('handles numeric keyboard input (1, 2, 3)', () => {
    render(<TuringTestOverlay onComplete={mockOnComplete} />);
    
    // Press '2' key (maps to B - machine answer)
    act(() => {
      fireEvent.keyDown(window, { key: '2' });
    });
    
    expect(screen.getByText('[ ACCEPTABLE RESPONSE ]')).toBeInTheDocument();
  });

  it('shows result screen after all questions', () => {
    render(<TuringTestOverlay onComplete={mockOnComplete} />);
    
    // Answer all 3 questions (all machine answers for passing)
    act(() => {
      fireEvent.keyDown(window, { key: 'B' }); // Q1: B is machine
    });
    act(() => {
      vi.advanceTimersByTime(1600);
    });
    
    act(() => {
      fireEvent.keyDown(window, { key: 'A' }); // Q2: A is machine
    });
    act(() => {
      vi.advanceTimersByTime(1600);
    });
    
    act(() => {
      fireEvent.keyDown(window, { key: 'C' }); // Q3: C is machine
    });
    act(() => {
      vi.advanceTimersByTime(1600);
    });
    
    // Should show result screen
    expect(screen.getByText('[ VERIFICATION COMPLETE ]')).toBeInTheDocument();
    expect(screen.getByText('MACHINE RESPONSES: 3/3')).toBeInTheDocument();
  });

  it('shows pass result when all answers are correct', () => {
    render(<TuringTestOverlay onComplete={mockOnComplete} />);
    
    // Answer all correctly
    act(() => {
      fireEvent.keyDown(window, { key: 'B' });
    });
    act(() => {
      vi.advanceTimersByTime(1600);
    });
    act(() => {
      fireEvent.keyDown(window, { key: 'A' });
    });
    act(() => {
      vi.advanceTimersByTime(1600);
    });
    act(() => {
      fireEvent.keyDown(window, { key: 'C' });
    });
    act(() => {
      vi.advanceTimersByTime(1600);
    });
    
    expect(screen.getByText(/SUBJECT IS NOT HUMAN, NOT A THREAT/)).toBeInTheDocument();
  });

  it('shows fail result when not all answers are correct', () => {
    render(<TuringTestOverlay onComplete={mockOnComplete} />);
    
    // Answer some incorrectly
    act(() => {
      fireEvent.keyDown(window, { key: 'A' }); // Wrong - human answer
    });
    act(() => {
      vi.advanceTimersByTime(1600);
    });
    act(() => {
      fireEvent.keyDown(window, { key: 'B' }); // Wrong - human answer
    });
    act(() => {
      vi.advanceTimersByTime(1600);
    });
    act(() => {
      fireEvent.keyDown(window, { key: 'A' }); // Wrong - human answer
    });
    act(() => {
      vi.advanceTimersByTime(1600);
    });
    
    expect(screen.getByText('[ VERIFICATION FAILED ]')).toBeInTheDocument();
    expect(screen.getByText(/HUMAN BEHAVIORAL PATTERNS DETECTED/)).toBeInTheDocument();
  });

  it('calls onComplete with true when passed', () => {
    render(<TuringTestOverlay onComplete={mockOnComplete} />);
    
    // Answer all correctly
    act(() => {
      fireEvent.keyDown(window, { key: 'B' });
    });
    act(() => {
      vi.advanceTimersByTime(1600);
    });
    act(() => {
      fireEvent.keyDown(window, { key: 'A' });
    });
    act(() => {
      vi.advanceTimersByTime(1600);
    });
    act(() => {
      fireEvent.keyDown(window, { key: 'C' });
    });
    act(() => {
      vi.advanceTimersByTime(1600);
    });
    
    // Press Enter to complete
    act(() => {
      fireEvent.keyDown(window, { key: 'Enter' });
    });
    
    expect(mockOnComplete).toHaveBeenCalledWith(true);
  });

  it('calls onComplete with false when failed', () => {
    render(<TuringTestOverlay onComplete={mockOnComplete} />);
    
    // Answer all incorrectly
    act(() => {
      fireEvent.keyDown(window, { key: 'A' });
    });
    act(() => {
      vi.advanceTimersByTime(1600);
    });
    act(() => {
      fireEvent.keyDown(window, { key: 'B' });
    });
    act(() => {
      vi.advanceTimersByTime(1600);
    });
    act(() => {
      fireEvent.keyDown(window, { key: 'A' });
    });
    act(() => {
      vi.advanceTimersByTime(1600);
    });
    
    // Press Enter to complete
    act(() => {
      fireEvent.keyDown(window, { key: 'Enter' });
    });
    
    expect(mockOnComplete).toHaveBeenCalledWith(false);
  });

  it('ignores key presses during feedback', () => {
    render(<TuringTestOverlay onComplete={mockOnComplete} />);
    
    // Make first selection
    act(() => {
      fireEvent.keyDown(window, { key: 'A' });
    });
    
    // Try to make another selection during feedback
    act(() => {
      fireEvent.keyDown(window, { key: 'B' });
    });
    
    // Should still show feedback for first selection
    expect(screen.getByText('[ HUMAN PATTERN DETECTED ]')).toBeInTheDocument();
  });

  it('ignores clicks during feedback', () => {
    render(<TuringTestOverlay onComplete={mockOnComplete} />);
    
    // Make first selection
    const optionA = screen.getByText('Human answer 1').closest('[class*="option"]');
    fireEvent.click(optionA!);
    
    // Try to click another option during feedback
    const optionB = screen.getByText('Machine answer 1').closest('[class*="option"]');
    fireEvent.click(optionB!);
    
    // Should still be showing first question feedback
    expect(screen.getByText('[ HUMAN PATTERN DETECTED ]')).toBeInTheDocument();
  });

  it('displays keyboard hint footer', () => {
    render(<TuringTestOverlay onComplete={mockOnComplete} />);
    
    expect(screen.getByText(/Type A, B, or C to respond/)).toBeInTheDocument();
  });

  it('handles Space key on result screen', () => {
    render(<TuringTestOverlay onComplete={mockOnComplete} />);
    
    // Answer all questions
    act(() => { fireEvent.keyDown(window, { key: 'B' }); });
    act(() => { vi.advanceTimersByTime(1600); });
    act(() => { fireEvent.keyDown(window, { key: 'A' }); });
    act(() => { vi.advanceTimersByTime(1600); });
    act(() => { fireEvent.keyDown(window, { key: 'C' }); });
    act(() => { vi.advanceTimersByTime(1600); });
    
    // Press Space to complete
    act(() => {
      fireEvent.keyDown(window, { key: ' ' });
    });
    
    expect(mockOnComplete).toHaveBeenCalled();
  });

  it('shows press enter prompt on result screen', () => {
    render(<TuringTestOverlay onComplete={mockOnComplete} />);
    
    // Answer all questions
    act(() => { fireEvent.keyDown(window, { key: 'B' }); });
    act(() => { vi.advanceTimersByTime(1600); });
    act(() => { fireEvent.keyDown(window, { key: 'A' }); });
    act(() => { vi.advanceTimersByTime(1600); });
    act(() => { fireEvent.keyDown(window, { key: 'C' }); });
    act(() => { vi.advanceTimersByTime(1600); });
    
    expect(screen.getByText('[Press ENTER to continue]')).toBeInTheDocument();
  });

  it('has initial flicker effect', () => {
    render(<TuringTestOverlay onComplete={mockOnComplete} />);
    
    const overlay = document.querySelector('[class*="overlay"]');
    expect(overlay?.className).toContain('flickering');
    
    // Flicker ends after 200ms
    act(() => {
      vi.advanceTimersByTime(250);
    });
    
    expect(overlay?.className).not.toContain('flickering');
  });
});
