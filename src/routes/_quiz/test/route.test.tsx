import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { RouteComponent } from '../route';
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
    Outlet: () => <div data-testid="outlet">Outlet</div>,
    createFileRoute: () => () => ({}),
  };
});

// Mock hooks
vi.mock('@/hooks/use-preload-image', () => ({
  usePreloadImage: () => ({ isLoaded: true }),
}));

describe('RouteComponent', () => {
  it('renders 404 when no quiz is available', () => {
    (useQuizStore as any).mockReturnValue({
      quiz: null,
      currentQuestionIndex: 0,
    });
    render(<RouteComponent />);
    expect(screen.getByText('404')).toBeInTheDocument();
  });

  it('renders quiz content when quiz is available', () => {
    (useQuizStore as any).mockReturnValue({
      quiz: {
        uuid: '123',
        title: 'Test Quiz',
        heading: 'Welcome',
        questions: [],
      },
      currentQuestionIndex: 0,
    });
    render(<RouteComponent />);
    expect(screen.getByText('Test Quiz')).toBeInTheDocument();
    expect(screen.getByTestId('outlet')).toBeInTheDocument();
  });
});
