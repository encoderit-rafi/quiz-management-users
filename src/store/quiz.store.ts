import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { TQuizSchema } from '@/routes/_quiz/questions/-types'

interface QuizState {
  quizId: number | null
  quiz: TQuizSchema | null
  currentQuestionIndex: number
  answers: Record<number, number> // questionId -> answerId
  setQuizId: (id: number | null) => void
  setQuiz: (quiz: TQuizSchema | null) => void
  setCurrentQuestionIndex: (index: number) => void
  setAnswer: (questionId: number, answerId: number) => void
  nextQuestion: () => void
  prevQuestion: () => void
  resetProgress: () => void
}

export const useQuizStore = create<QuizState>()(
  persist(
    (set, get) => ({
      quizId: null,
      quiz: null,
      currentQuestionIndex: 0,
      answers: {},
      setQuizId: (id) =>
        set((state) => {
          if (state.quizId !== id) {
            return { quizId: id, currentQuestionIndex: 0, answers: {} }
          }
          return { quizId: id }
        }),
      setQuiz: (quiz) =>
        set((state) => {
          if (state.quiz?.id !== quiz?.id) {
            return { quiz, currentQuestionIndex: 0, answers: {} }
          }
          return { quiz }
        }),
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
    }),
    {
      name: 'quiz-storage',
    },
  ),
)
