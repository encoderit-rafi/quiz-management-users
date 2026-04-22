import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import { RouteComponent } from '../result/index'
import { useQuizStore } from '@/store/quiz.store'
import { useGetResultPage } from '../questions/-apis/use-get-result-page.api'

vi.mock('@/store/quiz.store', () => ({
  useQuizStore: vi.fn(),
}))

vi.mock('../questions/-apis/use-get-result-page.api', () => ({
  useGetResultPage: vi.fn(),
}))

vi.mock('@tanstack/react-router', async () => {
  const actual = await vi.importActual<typeof import('@tanstack/react-router')>(
    '@tanstack/react-router',
  )

  return {
    ...actual,
    Link: ({ children, ...props }: any) => <a {...props}>{children}</a>,
    createFileRoute: () => () => ({}),
  }
})

vi.mock('react-i18next', () => ({
  useTranslation: () => ({ t: (key: string) => key }),
}))

vi.mock('react-share', () => ({
  FacebookShareButton: ({ children }: any) => <div>{children}</div>,
  FacebookIcon: () => <div>FB</div>,
  LinkedinShareButton: ({ children }: any) => <div>{children}</div>,
  LinkedinIcon: () => <div>LI</div>,
  TwitterShareButton: ({ children }: any) => <div>{children}</div>,
  XIcon: () => <div>X</div>,
}))

vi.mock('sonner', () => ({
  toast: { success: vi.fn(), error: vi.fn() },
}))

beforeEach(() => {
  vi.clearAllMocks()
})

describe('Result RouteComponent', () => {
  it('renders loading state', () => {
    ;(useQuizStore as any).mockReturnValue({
      quiz: { uuid: '1' },
      getTotalMarks: () => 10,
    })

    ;(useGetResultPage as any).mockReturnValue({
      isPending: true,
      isError: false,
    })

    render(<RouteComponent />)
    expect(screen.getByText('result.calculating')).toBeInTheDocument()
  })

  it('renders error state', () => {
    ;(useQuizStore as any).mockReturnValue({
      quiz: { uuid: '1' },
      getTotalMarks: () => 10,
    })

    ;(useGetResultPage as any).mockReturnValue({
      isPending: false,
      isError: true,
    })

    render(<RouteComponent />)
    expect(screen.getByText('result.errorTitle')).toBeInTheDocument()
  })
})
