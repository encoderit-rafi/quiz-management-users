import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import { RouteComponent } from '../view'
import { useGetResult } from '../_quiz/questions/-apis'
import { usePreloadImage } from '@/hooks/use-preload-image'
import * as TanStackRouter from '@tanstack/react-router'
import ErrorFallback from '@/components/app/error-fallback'
import React from 'react'

// Mock dependencies
vi.mock('@tanstack/react-router', async (importOriginal) => {
  const actual = await importOriginal<any>()
  return {
    ...actual,
    useSearch: vi.fn(),
    createFileRoute: () => {
      const routeMock = (config: any) => ({
        ...config,
        id: '/view'
      })
      return routeMock
    },
  }
})

vi.mock('../_quiz/questions/-apis', () => ({
  useGetResult: vi.fn(),
}))

vi.mock('@/hooks/use-preload-image', () => ({
  usePreloadImage: vi.fn(),
}))

vi.mock('react-i18next', () => ({
  useTranslation: () => ({ t: (key: string) => key }),
}))

// Mock components
vi.mock('@/components/app/question-background', () => ({
  default: () => <div data-testid="bg" />,
}))

vi.mock('@/components/app/question-card', () => ({
  default: ({ children }: any) => <div data-testid="card">{children}</div>,
}))

vi.mock('@/components/app/banner', () => ({
  default: () => <div data-testid="banner" />,
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

describe('View RouteComponent', () => {
  const mockResult = {
    data: {
      content: '<p>Result Content</p>',
      quiz: {
        title: 'Quiz Title',
        heading: 'Heading',
        primary_color: '#000',
        secondary_color: '#000',
      },
    },
  }

  beforeEach(() => {
    vi.clearAllMocks()
    ;(usePreloadImage as any).mockReturnValue({ isLoaded: true })
    ;(TanStackRouter.useSearch as any).mockReturnValue({ quiz_id: '1', id: '1' })
  })

  it('renders loading state', () => {
    ;(useGetResult as any).mockReturnValue({ isPending: true })
    render(<RouteComponent />)
    expect(screen.getByText('result.calculating')).toBeInTheDocument()
  })

  it('renders error state', () => {
    ;(useGetResult as any).mockReturnValue({ isError: true })
    render(<RouteComponent />)
    expect(screen.getByText('result.errorTitle')).toBeInTheDocument()
  })

  it('renders result content when loaded', () => {
    ;(useGetResult as any).mockReturnValue({ data: mockResult, isPending: false })
    render(<RouteComponent />)
    expect(screen.getByTestId('card')).toBeInTheDocument()
    expect(screen.getByText('Result Content')).toBeInTheDocument()
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
