import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { Button } from '@/components/ui/button'

import ProgressBar from '@/components/app/progress-bar'
import QuestionTitle from '@/components/app/question-title'
import AnswerCard from '@/components/app/answer-card'
import { useQuizStore } from '@/store/quiz.store'
import { ChevronsRight } from 'lucide-react'
import { toast } from 'sonner'

export const Route = createFileRoute('/_quiz/questions/')({
  component: RouteComponent,
})

function RouteComponent() {
  const navigate = useNavigate()
  const {
    quiz,
    currentQuestionIndex,
    answers,
    setAnswer,
    nextQuestion,
    prevQuestion,
  } = useQuizStore()

  const { questions = [] } = quiz ?? {}

  const currentQuestion = questions[currentQuestionIndex]
  const totalQuestions = questions.length

  if (!currentQuestion) return null

  const handleAnswerSelect = (questionId: number, answerId: number) => {
    setAnswer(questionId, answerId, currentQuestion.multiselect)
  }

  const handleNext = () => {
    const selectedValue = answers[currentQuestion.id]
    const selectedAnswerIds = Array.isArray(selectedValue)
      ? selectedValue
      : selectedValue != null
        ? [selectedValue]
        : []

    if (selectedAnswerIds.length === 0) {
      toast.error('Please select an answer to continue')
      return
    }

    if (currentQuestionIndex === totalQuestions - 1) {
      // console.log('Submit Quiz', answers)
      return navigate({ to: '/submission' })
    }

    nextQuestion()
  }

  const handleBack = () => {
    prevQuestion()
  }

  return (
    <div className="p-3">
      <ProgressBar index={currentQuestionIndex} total={totalQuestions} />

      <QuestionTitle question={currentQuestion.question_text} />
      <div className="hidden md:block text-lg font-semibold rounded-full bg-(--secondary-color)/20 text-(--secondary-color) py-2 px-10 my-5 w-fit text-center mx-auto">
        {currentQuestion.multiselect ? 'Multiple Select' : 'Select'} 1 -{' '}
        {currentQuestion?.answers?.length} Options
      </div>

      <div className="flex flex-col space-y-3">
        {currentQuestion.answers.map((answer, index) => {
          const selectedValue = answers[currentQuestion.id]
          const isSelected = Array.isArray(selectedValue)
            ? selectedValue.includes(answer.id)
            : selectedValue === answer.id
          return (
            <AnswerCard
              key={answer.id}
              index={index}
              isSelected={isSelected}
              text={answer.answer_text}
              onClick={() => handleAnswerSelect(currentQuestion.id, answer.id)}
            />
          )
        })}
      </div>

      <div className="flex flex-col gap-3 justify-center my-8 max-w-lg mx-auto">
        <Button
          variant="primary-reverse"
          size="lg"
          className="w-full text-lg h-14 flex items-center gap-2"
          onClick={handleNext}
        >
          {currentQuestionIndex < totalQuestions - 1 ? (
            <span>
              ({currentQuestionIndex + 1} - {totalQuestions}) Next Question
            </span>
          ) : (
            'Submit Quiz'
          )}
          <ChevronsRight />
        </Button>

        {currentQuestionIndex > 0 && (
          <Button
            variant="primary"
            size="lg"
            className="w-full text-lg h-14"
            onClick={handleBack}
          >
            Back
          </Button>
        )}
      </div>
    </div>
  )
}
