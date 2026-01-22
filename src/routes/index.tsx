import Banner from '@/components/app/banner'
import { Button } from '@/components/ui/button'
import { useQuizStore } from '@/store/quiz.store'
import { createFileRoute, Link } from '@tanstack/react-router'
import { z } from 'zod'
import { useEffect } from 'react'
import { useQuery } from '@tanstack/react-query'
import { useGetQuiz } from './_quiz/questions/-apis/use-get-quiz.api'
import { useQuizViewCount } from './_quiz/questions/-apis/use-quiz-view-count.api'
import NotFound from '@/components/app/not-found'
import { ChevronsRight, Loader2 } from 'lucide-react'
import { usePreloadImage } from '@/hooks/use-preload-image'

const searchSchema = z.object({
  quiz_id: z.union([z.string(), z.number()]).optional().catch(undefined),
})

export const Route = createFileRoute('/')({
  validateSearch: searchSchema,
  component: RouteComponent,
})

function RouteComponent() {
  const { quiz_id } = Route.useSearch()
  console.log('👉 ~ RouteComponent ~ quiz_id:', quiz_id)
  const {
    quizId: activeQuizId,
    setQuizId: setActiveQuizId,
    setQuiz,
  } = useQuizStore()

  const effectiveId = quiz_id ?? activeQuizId
  const { mutate: addViewCount } = useQuizViewCount()

  const { data: quiz, isLoading } = useQuery(useGetQuiz(effectiveId ?? 0))
  const { isLoaded: isImageLoaded } = usePreloadImage(
    quiz?.background_image ?? undefined,
  )

  useEffect(() => {
    const id = quiz?.id
    if (id) {
      const viewQuizzes = JSON.parse(localStorage.getItem('view_quiz') || '[]')
      if (!viewQuizzes.includes(id)) {
        addViewCount(id)
        localStorage.setItem('view_quiz', JSON.stringify([...viewQuizzes, id]))
      }
    }
  }, [quiz?.id, addViewCount])

  useEffect(() => {
    if (quiz) {
      setQuiz(quiz)
    }
  }, [quiz, setQuiz])

  useEffect(() => {
    if (quiz_id && activeQuizId !== quiz_id) {
      setActiveQuizId(quiz_id)
    }
  }, [quiz_id, activeQuizId, setActiveQuizId])

  // if (!effectiveId) {
  //   throw notFound()
  // }

  if (isLoading)
    return (
      <div className="flex h-screen w-full flex-col items-center justify-center bg-gray-50 text-center">
        <Loader2 className=" h-5 w-5 animate-spin" />
      </div>
    )
  if (quiz?.background_image && !isImageLoaded)
    return (
      <div className="flex h-screen w-full flex-col items-center justify-center bg-white-50 backdrop-blur-sm text-center">
        <Loader2 className=" h-5 w-5 animate-spin" />
      </div>
    )

  // if (!quiz) {
  //   throw notFound()
  // }
  if (!effectiveId && !isLoading) {
    return <NotFound />
  }
  return (
    <div
      className={`min-h-screen flex flex-col overflow-hidden bg-cover bg-center after:absolute after:inset-0 after:bg-linear-to-r after:from-black after:from-20% after:to-transparent text-white`}
      style={
        {
          backgroundImage: `url(${quiz?.background_image})`,
          '--primary-color': quiz?.primary_color,
          '--secondary-color': quiz?.secondary_color,
        } as React.CSSProperties
      }
    >
      <div className="flex-1 flex flex-col overflow-hidden relative z-10">
        <nav className="bg-white/20 p-2 shrink-0 backdrop-blur-xs">
          <Banner
            logo={quiz?.logo || ''}
            title={quiz?.title || ''}
            heading={quiz?.heading || ''}
          />
        </nav>
        <div className="container grow  mx-auto p-2 flex flex-col">
          <div className="w-full max-w-lg flex flex-col gap-8 justify-center grow">
            <h1 className="border-l-4 border-l-(--primary-color) p-2 text-4xl md:text-5xl font-bold ">
              {quiz?.title || ''}
            </h1>
            <p className="text-lg">{quiz?.description || ''}</p>

            <Button variant={'primary'} size={'lg'}>
              <Link to="/questions" className="flex items-center gap-2">
                {quiz?.cta_text || 'Start Quiz'} <ChevronsRight />
              </Link>
            </Button>
            <div
              className="prose"
              dangerouslySetInnerHTML={{
                __html: quiz?.landing_page_text || '',
              }}
            />
          </div>
        </div>
      </div>
    </div>
  )
}
