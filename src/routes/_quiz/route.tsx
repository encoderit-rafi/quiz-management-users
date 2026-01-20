import Banner from '@/components/app/banner'
import NotFound from '@/components/app/not-found'
import QuestionBackground from '@/components/app/question-background'
import QuestionCard from '@/components/app/question-card'
import { useQuizStore } from '@/store/quiz.store'
import { createFileRoute, Outlet } from '@tanstack/react-router'
import { usePreloadImage } from '@/hooks/use-preload-image'
import { Loader2 } from 'lucide-react'
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

  const currentQuestionImage =
    questions[currentQuestionIndex]?.image ?? undefined
  const { isLoaded: isQuestionImageLoaded } =
    usePreloadImage(currentQuestionImage)

  if (!Boolean(quiz?.uuid)) {
    return <NotFound />
  }
  console.log('👉 ~ Question Image:', questions[currentQuestionIndex]?.image)
  return (
    <div
      className="relative min-h-dvh"
      style={
        {
          '--primary-color': primary_color || '#000',
          '--secondary-color': secondary_color || '#000',
        } as React.CSSProperties
      }
    >
      <QuestionBackground
        key={currentQuestionIndex}
        img_src={questions[currentQuestionIndex]?.image || ''}
      />
      {/* CONTENT */}
      {!isQuestionImageLoaded && (
        <div className="absolute inset-0 z-50 flex items-center justify-center bg-white/50 backdrop-blur-sm">
          <Loader2 className="h-10 w-10 animate-spin text-(--primary-color)" />
        </div>
      )}
      {/* <div className="relative pt-[20vh] pb-[5vh] z-10 px-2"> */}
      <div className="relative pt-[20vh] pb-[5vh] z-10 px-2">
        <QuestionCard>
          <div className="bg-(--primary-color)/10 py-3 border-b border-(--primary-color)/20">
            <Banner logo={logo || ''} title={title} heading={heading} />
          </div>
          <Outlet />
        </QuestionCard>
      </div>
    </div>
  )
}
