import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { Button } from '@/components/ui/button'

import ProgressBar from '@/components/app/progress-bar'
import QuestionTitle from '@/components/app/question-title'
import AnswerCard from '@/components/app/answer-card'
import { useQuizStore } from '@/store/quiz.store'

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
    setAnswer(questionId, answerId)
  }

  const handleNext = () => {
    const selectedAnswerId = answers[currentQuestion.id]
    if (!selectedAnswerId) return

    if (currentQuestionIndex === totalQuestions - 1) {
      // console.log('Submit Quiz', answers)
      return navigate({ to: '/result' })
    }

    nextQuestion()
  }

  const handleBack = () => {
    prevQuestion()
  }

  const selectedAnswerId = answers[currentQuestion.id]

  return (
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
              onClick={() => handleAnswerSelect(currentQuestion.id, answer.id)}
            />
          )
        })}
      </div>

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
