import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { RouteComponent } from '../questions/index';
import { useQuizStore } from '@/store/quiz.store';

// Mock the store
vi.mock('@/store/quiz.store', () => ({
  useQuizStore: vi.fn(),
}));

// Mock TanStack components and functions
vi.mock('@tanstack/react-router', async (importOriginal) => {
  const actual = await importOriginal<any>();
  return {
    ...actual,
    useNavigate: vi.fn(),
    createFileRoute: () => () => ({}),
  };
});

vi.mock('react-i18next', () => ({
  useTranslation: () => ({ t: (key: string) => key }),
}));

vi.mock('sonner', () => ({
  toast: { error: vi.fn() },
}));

describe('Questions RouteComponent', () => {
  const mockQuiz = {
    uuid: '1',
    title: 'Test Quiz',
    questions: [
      {
        id: 1,
        question_text: 'Q1',
        multiselect: false,
        answers: [
          { id: 101, answer_text: 'A1' },
          { id: 102, answer_text: 'A2' },
        ],
      },
      {
        id: 2,
        question_text: 'Q2',
        multiselect: false,
        answers: [
          { id: 201, answer_text: 'B1' },
        ],
      },
    ],
  };

  const mockStore = {
    quiz: mockQuiz,
    currentQuestionIndex: 0,
    answers: {},
    setAnswer: vi.fn(),
    nextQuestion: vi.fn(),
    prevQuestion: vi.fn(),
  };

  beforeEach(() => {
    (useQuizStore as any).mockReturnValue(mockStore);
  });

  it('renders question and answer options', () => {
    render(<RouteComponent />);
    expect(screen.getByText('Q1')).toBeInTheDocument();
    expect(screen.getByText('A1')).toBeInTheDocument();
  });

  it('navigates to next question on next button click if answer selected', () => {
    (useQuizStore as any).mockReturnValue({
      ...mockStore,
      answers: { 1: [101] },
    });
    render(<RouteComponent />);
    fireEvent.click(screen.getByText(/common.next/i));
    expect(mockStore.nextQuestion).toHaveBeenCalled();
  });
});
