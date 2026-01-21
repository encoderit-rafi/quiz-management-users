import { createFileRoute, useSearch } from '@tanstack/react-router'
// import { useQuizStore } from '@/store/quiz.store'
import { useGetResult } from '../questions/-apis'
// import { useEffect } from 'react'
import { Loader2 } from 'lucide-react'
import { z } from 'zod'
const SearchParams = z.object({
  quiz_id: z.string(),
  id: z.union([z.number(), z.string()]),
})
export const Route = createFileRoute('/_quiz/result/view')({
  validateSearch: SearchParams,
  component: RouteComponent,
})

function RouteComponent() {
  const { quiz_id, id } = useSearch({ from: Route.id })

  const {
    data: resultData,
    isPending,
    isError,
  } = useGetResult({
    quiz_id: quiz_id,
    id: id,
  })

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
    </div>
  )
}
