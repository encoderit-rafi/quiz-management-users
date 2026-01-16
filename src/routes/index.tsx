import Banner from '@/components/app/banner'
import { Button } from '@/components/ui/button'
import { createFileRoute, Link } from '@tanstack/react-router'
import { z } from 'zod'
import { useEffect, useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { useQuizViewCount, useGetQuiz } from './questions/-apis'

const searchSchema = z.object({
  quiz_id: z.number().optional().catch(undefined),
})

export const Route = createFileRoute('/')({
  validateSearch: searchSchema,
  component: RouteComponent,
})

function RouteComponent() {
  const { quiz_id } = Route.useSearch()
  const [activeQuizId, setActiveQuizId] = useState<number | null>(null)
  const { mutate: viewQuiz } = useQuizViewCount()

  const { data: quizData, isLoading } = useQuery(useGetQuiz(activeQuizId!))

  useEffect(() => {
    const localQuizId = localStorage.getItem('quiz_id')
    const parsedLocalQuizId = localQuizId ? Number(localQuizId) : null

    if (quiz_id) {
      setActiveQuizId(quiz_id)
      if (!parsedLocalQuizId || parsedLocalQuizId !== quiz_id) {
        // Call view count API and update local storage
        viewQuiz(quiz_id)
        localStorage.setItem('quiz_id', String(quiz_id))
      }
    } else if (parsedLocalQuizId) {
      setActiveQuizId(parsedLocalQuizId)
    }
  }, [quiz_id, viewQuiz])

  if (!activeQuizId && !isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen text-2xl font-bold bg-gray-100">
        No quiz found
      </div>
    )
  }

  if (isLoading) return <div>Loading...</div>

  return (
    <div
      className={`min-h-screen flex flex-col overflow-hidden bg-cover bg-center after:absolute after:inset-0 after:bg-linear-to-r after:from-black after:from-20% after:to-transparent text-white`}
      style={{
        backgroundImage: `url(${quizData?.background_image})`,
      }}
    >
      <div className="flex-1 flex flex-col overflow-hidden relative z-10">
        <nav className="bg-white/20 p-2 shrink-0 backdrop-blur-xs">
          <Banner
            logo={quizData?.logo || ''}
            title={quizData?.title || ''}
            heading={quizData?.heading || ''}
          />
        </nav>
        <div className="container grow  mx-auto p-2 flex flex-col">
          <div className="w-full max-w-lg flex flex-col gap-8 justify-center grow">
            <h1 className="border-l-4 border-l-purple-500 p-2 text-4xl md:text-5xl font-bold ">
              {quizData?.title || ''}
            </h1>
            <p className="text-lg">{quizData?.description || ''}</p>

            <Button variant={'primary'} size={'lg'}>
              <Link
                to="/questions/$id"
                params={{ id: String(activeQuizId || 1) }}
              >
                {quizData?.cta_text || 'Start Quiz'} »
              </Link>
            </Button>
            <div
              className="prose"
              dangerouslySetInnerHTML={{
                __html: quizData?.landing_page_text || '',
              }}
            />
          </div>
        </div>
      </div>
    </div>
  )
}
