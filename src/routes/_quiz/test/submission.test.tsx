import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import { RouteComponent } from '../submission/index'

const mockNavigate = vi.fn()

vi.mock('@tanstack/react-router', async () => {
  const actual = await vi.importActual<typeof import('@tanstack/react-router')>(
    '@tanstack/react-router',
  )

  return {
    ...actual,
    useNavigate: () => mockNavigate,
    createFileRoute: () => () => ({}),
  }
})

vi.mock('react-i18next', () => ({
  useTranslation: () => ({ t: (key: string) => key }),
}))

vi.mock('react-hook-form', async () => {
  const actual =
    await vi.importActual<typeof import('react-hook-form')>('react-hook-form')

  return {
    ...actual,
    useForm: vi.fn(() => ({
      register: vi.fn(),
      handleSubmit: (fn: any) => fn,
      formState: { errors: {} },
      reset: vi.fn(),
    })),
  }
})

vi.mock('@/store/quiz.store', () => ({
  useQuizStore: vi.fn(() => ({
    quiz: { leadFormSetting: { fields: [] } },
    getTotalMarks: vi.fn(() => 0),
    answers: {},
    resultPageId: 1,
    setResultPageId: vi.fn(),
  })),
}))

vi.mock('../questions/-apis/use-quiz-submission.api', () => ({
  useQuizSubmission: vi.fn(() => ({ mutate: vi.fn() })),
}))

vi.mock('../questions/-apis', () => ({
  useGetResultPage: vi.fn(() => ({ data: null, isPending: false })),
}))

beforeEach(() => {
  vi.clearAllMocks()
})

describe('Submission RouteComponent', () => {
  it('renders submission page title', () => {
    render(<RouteComponent />)
    expect(screen.getByText(/submission.title/i)).toBeInTheDocument()
  })
})
