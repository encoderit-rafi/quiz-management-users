import { createFileRoute, useParams } from '@tanstack/react-router'
import { Button } from '@/components/ui/button'
import { useEffect, useState } from 'react'
import Banner from '@/components/app/banner'
import { useGetQuiz } from '../-apis'
import { useQuery } from '@tanstack/react-query'
import QuestionBackground from '@/components/app/question-background'
import ProgressBar from '@/components/app/progress-bar'
import QuestionTitle from '@/components/app/question-title'
import QuestionCard from '@/components/app/question-card'
import AnswerCard from '@/components/app/answer-card'

export const Route = createFileRoute('/questions/$id/')({
  component: RouteComponent,
})

type QuizState = {
  currentQuestionIndex: number
  answers: Record<number, number> // questionId -> answerId
}

function RouteComponent() {
  const { id } = useParams({ from: Route.id })
  // Ensure id is parsed as a number for the API call
  const quizId = parseInt(id)
  const { data: quiz, isLoading } = useQuery(
    useGetQuiz(isNaN(quizId) ? 0 : quizId),
  )

  const { logo = '', title = '', heading = '', questions = [] } = quiz ?? {}
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [answers, setAnswers] = useState<Record<number, number>>({})
  const [error, setError] = useState<string | null>(null)

  // Load state from local storage on mount
  useEffect(() => {
    if (!id) return
    const saved = localStorage.getItem(`quiz-state-${id}`)
    if (saved) {
      try {
        const parsed = JSON.parse(saved) as QuizState
        if (typeof parsed.currentQuestionIndex === 'number') {
          setCurrentQuestionIndex(parsed.currentQuestionIndex)
        }
        if (parsed.answers) {
          setAnswers(parsed.answers)
        }
      } catch (e) {
        console.error('Failed to parse saved quiz state', e)
      }
    }
  }, [id])

  useEffect(() => {
    if (!id) return
    const state: QuizState = { currentQuestionIndex, answers }
    localStorage.setItem(`quiz-state-${id}`, JSON.stringify(state))
  }, [id, currentQuestionIndex, answers])

  const currentQuestion = questions[currentQuestionIndex]
  const totalQuestions = questions.length

  const handleAnswerSelect = (questionId: number, answerId: number) => {
    setAnswers((prev) => ({
      ...prev,
      [questionId]: answerId,
    }))
    setError(null)
  }

  const handleNext = () => {
    if (!currentQuestion) return

    const selectedAnswerId = answers[currentQuestion.id]
    if (!selectedAnswerId) {
      setError('Please select an answer to proceed.')
      return
    }

    if (currentQuestionIndex < totalQuestions - 1) {
      setCurrentQuestionIndex((prev) => prev + 1)
    } else {
      alert('Quiz Completed! Submitting...') // Placeholder for actual submission
    }
  }

  const handleBack = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex((prev) => prev - 1)
      setError(null)
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Loading...
      </div>
    )
  }

  if (!quiz || !currentQuestion) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Quiz not found or no questions.
      </div>
    )
  }

  const selectedAnswerId = answers[currentQuestion.id]

  return (
    <div
      className="relative min-h-screen"
      style={
        {
          '--primary-color': quiz?.primary_color || '#000',
          '--secondary-color': quiz?.secondary_color || '#000',
        } as React.CSSProperties
      }
    >
      <QuestionBackground img_src={questions[0]?.image || ''} />
      {/* CONTENT */}
      <div className="relative pt-[30vh] pb-[20vh] z-10">
        <QuestionCard>
          <div className="bg-(--primary-color)/10 py-6 border-b border-(--primary-color)">
            <Banner logo={logo || ''} title={title} heading={heading} />
          </div>
          <div className="mx-auto my-10 max-w-[80%]">
            <ProgressBar index={currentQuestionIndex} total={totalQuestions} />

            <QuestionTitle question={currentQuestion.question_text} />

            <div className="flex flex-col space-y-3">
              {currentQuestion.answers.map((answer, index) => {
                const isSelected = selectedAnswerId === answer.id
                return (
                  <AnswerCard
                    key={answer.id}
                    index={index}
                    isSelected={isSelected}
                    text={answer.answer_text}
                    onClick={() =>
                      handleAnswerSelect(currentQuestion.id, answer.id)
                    }
                  />
                )
              })}
            </div>

            {error && (
              <div className="text-red-500 text-center mt-4 font-medium animate-pulse">
                {error}
              </div>
            )}

            <div className="flex flex-col gap-3 justify-center my-8 max-w-lg mx-auto">
              <Button
                variant="primary-reverse"
                size="lg"
                className="w-full text-lg h-14"
                onClick={handleNext}
              >
                {currentQuestionIndex < totalQuestions - 1
                  ? 'Next Question'
                  : 'Submit Quiz'}
              </Button>

              {currentQuestionIndex > 0 && (
                <Button
                  variant="primary-reverse"
                  size="lg"
                  // className="w-full text-gray-500 hover:text-gray-900"
                  onClick={handleBack}
                >
                  Back
                </Button>
              )}
            </div>
          </div>
        </QuestionCard>
      </div>
    </div>
  )
}
