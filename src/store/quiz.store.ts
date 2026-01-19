import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { TQuizSchema } from '@/routes/_quiz/questions/-types'

interface QuizState {
  quizId: number | null
  quiz: TQuizSchema | null
  currentQuestionIndex: number
  answers: Record<number, number> // questionId -> answerId
  started_at: string | null
  resultPageId: number | null
  setQuizId: (id: string | number | null) => void
  setQuiz: (quiz: TQuizSchema | null) => void
  setResultPageId: (id: number | null) => void
  setCurrentQuestionIndex: (index: number) => void
  setAnswer: (questionId: number, answerId: number) => void
  nextQuestion: () => void
  prevQuestion: () => void
  resetProgress: () => void
  getTotalMarks: () => number
}

export const useQuizStore = create<QuizState>()(
  persist(
    (set, get) => ({
      quizId: null,
      quiz: null,
      currentQuestionIndex: 0,
      answers: {},
      started_at: null,
      resultPageId: null,
      setQuizId: (id) =>
        set((state) => {
          if (state.quizId !== id) {
            return {
              quizId: id,
              currentQuestionIndex: 0,
              answers: {},
              started_at: null,
              resultPageId: null,
            }
          }
          return { quizId: id }
        }),
      setQuiz: (quiz) =>
        set((state) => {
          if (state.quiz?.id !== quiz?.id) {
            return {
              quiz,
              currentQuestionIndex: 0,
              answers: {},
              started_at: quiz ? new Date().toISOString() : null,
              resultPageId: null,
            }
          }
          return { quiz }
        }),
      setResultPageId: (id) => set({ resultPageId: id }),
      setCurrentQuestionIndex: (index) => set({ currentQuestionIndex: index }),
      setAnswer: (questionId, answerId) =>
        set((state) => ({
          answers: { ...state.answers, [questionId]: answerId },
        })),
      nextQuestion: () => {
        const { currentQuestionIndex, quiz } = get()
        const totalQuestions = quiz?.questions?.length || 0
        if (currentQuestionIndex < totalQuestions - 1) {
          set({ currentQuestionIndex: currentQuestionIndex + 1 })
        }
      },
      prevQuestion: () => {
        const { currentQuestionIndex } = get()
        if (currentQuestionIndex > 0) {
          set({ currentQuestionIndex: currentQuestionIndex - 1 })
        }
      },
      resetProgress: () => set({ currentQuestionIndex: 0, answers: {} }),
      getTotalMarks: () => {
        const { quiz, answers } = get()
        if (!quiz?.questions) return 0
        return quiz.questions.reduce((acc, question) => {
          const selectedAnswerId = answers[question.id]
          if (!selectedAnswerId) return acc
          const selectedAnswer = question.answers.find(
            (a) => a.id === selectedAnswerId,
          )
          return acc + (selectedAnswer?.points || 0)
        }, 0)
      },
    }),
    {
      name: 'quiz-storage',
    },
  ),
)
