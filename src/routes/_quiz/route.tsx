import Banner from '@/components/app/banner'
import NotFound from '@/components/app/not-found'
import QuestionBackground from '@/components/app/question-background'
import QuestionCard from '@/components/app/question-card'
import { useQuizStore } from '@/store/quiz.store'
import { createFileRoute, Outlet } from '@tanstack/react-router'
// import { useEffect } from 'react'

export const Route = createFileRoute('/_quiz')({
  component: RouteComponent,
})

function RouteComponent() {
  const { quiz, currentQuestionIndex } = useQuizStore()
  const {
    primary_color,
    secondary_color,
    questions = [],
    logo = '',
    title = '',
    heading = '',
  } = quiz ?? {}
  if (!Boolean(quiz?.uuid)) {
    return <NotFound />
  }
  return (
    <div
      className="relative min-h-screen"
      style={
        {
          '--primary-color': primary_color || '#000',
          '--secondary-color': secondary_color || '#000',
        } as React.CSSProperties
      }
    >
      <QuestionBackground
        img_src={questions[currentQuestionIndex]?.image || ''}
      />
      {/* CONTENT */}
      <div className="relative py-[20vh] z-10 px-2">
        <QuestionCard>
          <div className="bg-(--primary-color)/10 py-6 border-b border-(--primary-color)/20">
            <Banner logo={logo || ''} title={title} heading={heading} />
          </div>
          <Outlet />
        </QuestionCard>
      </div>
    </div>
  )
}
