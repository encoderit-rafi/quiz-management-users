import { createFileRoute, Link } from '@tanstack/react-router'
import { useQuizStore } from '@/store/quiz.store'
import { useGetResultPage } from '../questions/-apis/use-get-result-page.api'
import { useEffect } from 'react'
import { ChevronsRight, Loader2 } from 'lucide-react'
import { buttonVariants } from '@/components/ui/button'

export const Route = createFileRoute('/_quiz/result/')({
  component: RouteComponent,
})

function RouteComponent() {
  const { quiz, getTotalMarks, setResultPageId } = useQuizStore()
  const totalMarks = getTotalMarks()
  const {
    data: resultData,
    isPending,
    isError,
  } = useGetResultPage({
    quiz_id: quiz?.uuid || '',
    mark: totalMarks,
  })

  useEffect(() => {
    if (resultData) {
      const data = resultData?.data || resultData
      if (data?.id) {
        setResultPageId(data.id)
      }
    }
  }, [resultData, setResultPageId])

  if (isPending) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh]">
        <Loader2 className="w-10 h-10 animate-spin text-(--primary-color)" />
        <p className="mt-4 text-gray-500">Calculating your results...</p>
      </div>
    )
  }

  if (isError) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] text-center px-4">
        <h2 className="text-2xl font-bold text-red-500">
          Oops! Something went wrong.
        </h2>
        <p className="mt-2 text-gray-600">
          We couldn't retrieve your results. Please try again later.
        </p>
      </div>
    )
  }

  const result = resultData?.data || resultData

  return (
    <div className="mx-auto my-10 max-w-2xl px-4">
      <div
        className="pointer-events-none prose prose-slate prose-custom max-w-none prose-headings:text-(--secondary-color) mb-10 prose-table:border prose-table:border-(--primary-color)/20 prose-th:border prose-th:border-(--primary-color)/20 prose-th:p-4 prose-td:border prose-td:border-(--primary-color)/20 prose-td:p-4"
        dangerouslySetInnerHTML={{
          __html: result?.content || '',
        }}
      />
      <div className="flex justify-center my-4">
        <Link
          to="/submission"
          className={buttonVariants({
            variant: 'primary-reverse',
            size: 'lg',
            className: 'flex items-center gap-2 max-w-xl! w-full',
          })}
        >
          <span>Speak To An Advisor</span>
          <ChevronsRight />
        </Link>
      </div>
    </div>
  )
}
