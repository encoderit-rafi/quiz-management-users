import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { TQuizSchema } from '@/routes/_quiz/questions/-types'

interface QuizState {
  quizId: string | number | null

  quiz: TQuizSchema | null
  currentQuestionIndex: number
  answers: Record<number, number[]> // questionId -> answerIds[]
  started_at: string | null
  resultPageId: number | null
  setQuizId: (id: string | number | null | undefined) => void
  setQuiz: (quiz: TQuizSchema | null) => void
  setResultPageId: (id: number | null) => void
  setCurrentQuestionIndex: (index: number) => void
  setAnswer: (
    questionId: number,
    answerId: number,
    multiselect?: boolean,
  ) => void
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
          const normalizedId =
            typeof id === 'string' ? Number(id) : id === undefined ? null : id
          if (state.quizId !== normalizedId) {
            return {
              quizId: normalizedId,
              currentQuestionIndex: 0,
              answers: {},
              started_at: null,
              resultPageId: null,
            }
          }
          return { quizId: normalizedId }
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
      setAnswer: (questionId, answerId, multiselect = false) =>
        set((state) => {
          const storedValue = state.answers[questionId]
          const currentAnswers = Array.isArray(storedValue)
            ? storedValue
            : storedValue != null
              ? [storedValue]
              : []
          let newAnswers: number[]

          if (multiselect) {
            if (currentAnswers.includes(answerId)) {
              newAnswers = currentAnswers.filter((id) => id !== answerId)
            } else {
              newAnswers = [...currentAnswers, answerId]
            }
          } else {
            newAnswers = [answerId]
          }

          return {
            answers: { ...state.answers, [questionId]: newAnswers },
          }
        }),
      nextQuestion: () => {
        const { currentQuestionIndex, quiz } = get()
        const totalQuestions = quiz?.questions?.length || 0
        if (currentQuestionIndex < totalQuestions - 1) {
          console.log('👉 ~ nextQuestion ~ index:', currentQuestionIndex + 1)
          set({ currentQuestionIndex: currentQuestionIndex + 1 })
        }
      },
      prevQuestion: () => {
        const { currentQuestionIndex } = get()
        if (currentQuestionIndex > 0) {
          console.log('👉 ~ prevQuestion ~ index:', currentQuestionIndex - 1)
          set({ currentQuestionIndex: currentQuestionIndex - 1 })
        }
      },
      resetProgress: () => set({ currentQuestionIndex: 0, answers: {} }),
      getTotalMarks: () => {
        const { quiz, answers } = get()
        if (!quiz?.questions) return 0
        return quiz.questions.reduce((acc, question) => {
          const selectedValue = answers[question.id]
          const selectedAnswerIds = Array.isArray(selectedValue)
            ? selectedValue
            : selectedValue != null
              ? [selectedValue]
              : []

          if (selectedAnswerIds.length === 0) return acc

          const questionPoints = selectedAnswerIds.reduce((sum, id) => {
            const answer = question.answers.find((a) => a.id === id)
            return sum + (answer?.points || 0)
          }, 0)

          return acc + questionPoints
        }, 0)
      },
    }),
    {
      name: 'quiz-storage',
    },
  ),
)
