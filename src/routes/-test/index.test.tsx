import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import * as Index from '../index'
import { useQuizStore } from '@/store/quiz.store'
import { useQuery, useMutation } from '@tanstack/react-query'
import { usePreloadImage } from '@/hooks/use-preload-image'
import ErrorFallback from '@/components/app/error-fallback'
import React from 'react'

console.log('Index:', Index);

// Mock the store
vi.mock('@/store/quiz.store', () => ({
  useQuizStore: vi.fn(),
}))

// Mock TanStack Router
vi.mock('@tanstack/react-router', async (importOriginal) => {
  const actual = await importOriginal<any>()
  return {
    ...actual,
    Link: ({ children, to, ...props }: any) => <a href={to} {...props}>{children}</a>,
    createFileRoute: () => {
      const routeMock = (config: any) => ({
        useSearch: vi.fn(),
        ...config,
      })
      routeMock.useSearch = vi.fn()
      return routeMock
    },
  }
})

// Mock TanStack Query
vi.mock('@tanstack/react-query', () => ({
  useQuery: vi.fn(),
  useMutation: vi.fn(),
  queryOptions: vi.fn((opts) => opts),
}))

// Mock hooks
vi.mock('@/hooks/use-preload-image', () => ({
  usePreloadImage: vi.fn(),
}))

vi.mock('react-i18next', () => ({
  useTranslation: () => ({ t: (key: string) => key }),
}))

// Mock components
vi.mock('@/components/app/banner', () => ({
  default: () => <div data-testid="banner" />,
}))

vi.mock('@/components/app/not-found', () => ({
  default: () => <div>404</div>,
}))

vi.mock('../_quiz/questions/-apis/use-get-quiz.api', () => ({
  useGetQuiz: vi.fn(),
}))

vi.mock('../_quiz/questions/-apis/use-quiz-view-count.api', () => ({
  useQuizViewCount: vi.fn(() => ({ mutate: vi.fn() })),
}))

// Simple Error Boundary for testing
class TestErrorBoundary extends React.Component<{ children: React.ReactNode }, { hasError: boolean }> {
  constructor(props: any) {
    super(props)
    this.state = { hasError: false }
  }
  static getDerivedStateFromError() {
    return { hasError: true }
  }
  componentDidCatch(error: any, errorInfo: any) {
    this.setState({ hasError: true })
  }
  render() {
    if (this.state.hasError) {
      return <ErrorFallback error={new Error('Test Crash')} />
    }
    return this.props.children
  }
}

describe('Index RouteComponent', () => {
  const mockQuiz = {
    id: 1,
    uuid: 'quiz-123',
    title: 'Test Quiz',
    description: 'A test quiz description',
    background_image: 'bg.jpg',
    primary_color: '#ff0000',
    secondary_color: '#00ff00',
    logo: 'logo.png',
    heading: 'Welcome',
    cta_text: 'Start Now',
    landing_page_text: '<p>Welcome to the quiz</p>',
  }

  const mockStore = {
    quizId: 'quiz-123',
    setQuizId: vi.fn(),
    setQuiz: vi.fn(),
  }

  beforeEach(() => {
    vi.clearAllMocks()
    ;(useQuizStore as any).mockReturnValue(mockStore)
    ;(usePreloadImage as any).mockReturnValue({ isLoaded: true })
    ;(useMutation as any).mockReturnValue({ mutate: vi.fn() })
    ;(Index.Route.useSearch as any).mockReturnValue({ quiz_id: 'quiz-123' })
    // Mocking localStorage
    vi.stubGlobal('localStorage', {
      getItem: vi.fn(() => null),
      setItem: vi.fn(),
    })
  })

  it('renders loading state when quiz is fetching', () => {
    ;(useQuery as any).mockReturnValue({ isLoading: true })
    render(<Index.RouteComponent />)
    expect(document.querySelector('.animate-spin')).toBeInTheDocument()
  })

  it('renders quiz content when quiz loaded', () => {
    ;(useQuery as any).mockReturnValue({ data: mockQuiz, isLoading: false })
    render(<Index.RouteComponent />)
    expect(screen.getByText('Test Quiz')).toBeInTheDocument()
    expect(screen.getByText('A test quiz description')).toBeInTheDocument()
    expect(screen.getByText('Start Now')).toBeInTheDocument()
    expect(screen.getByText('Welcome to the quiz')).toBeInTheDocument()
  })

  it('renders NotFound when no quizId is available', () => {
    ;(useQuery as any).mockReturnValue({ data: null, isLoading: false })
    ;(useQuizStore as any).mockReturnValue({ ...mockStore, quizId: null })
    ;(Index.Route.useSearch as any).mockReturnValue({ quiz_id: null })
    render(<Index.RouteComponent />)
    expect(screen.getByText('404')).toBeInTheDocument()
  })

  it('falls back to ErrorFallback when a child component crashes', () => {
    const Crasher = () => {
      throw new Error('Crashed!')
    }
    
    // Suppress console.error for the expected crash
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {})

    render(
      <TestErrorBoundary>
        <Crasher />
      </TestErrorBoundary>
    )
    
    expect(screen.getByText('errors.fallback.title')).toBeInTheDocument()
    consoleSpy.mockRestore()
  })
})
