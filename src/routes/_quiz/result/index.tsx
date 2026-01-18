import { createFileRoute, useParams, useSearch } from '@tanstack/react-router'
import { useEffect } from 'react'
import QuestionCard from '@/components/app/question-card'
import { useGetResultPage } from '../questions/-apis/use-get-result-page.api'
import { z } from 'zod'
const SearchParams = z.object({
  mark: z.string(),
})
export const Route = createFileRoute('/_quiz/result/')({
  validateSearch: SearchParams,
  component: RouteComponent,
})

function RouteComponent() {
  const { id } = useParams({ from: Route.id })
  const { mark } = useSearch({ from: Route.id })

  const { mutate: getResultPage, isPending: isSubmitting } = useGetResultPage()

  useEffect(() => {
    // Updated payload as per request
    if (isSubmitting) return
    const payload = {
      quiz_id: id,
      data: {
        quiz_id: id,
        mark: mark,
      },
    }

    getResultPage(payload, {
      onSuccess: (data) => {
        console.log('👉 ~ RouteComponent ~ data:', data)
      },
      onError: (err) => {
        console.log('👉 ~ RouteComponent ~ err:', err)
      },
    })
  }, [])

  return (
    <div className="relative min-h-screen">
      {/* <QuestionBackground img_src={questions[0]?.image || ''} /> */}
      {/* CONTENT */}
      <div className="relative pt-[30vh] pb-[20vh] z-10">
        <QuestionCard>CODE...</QuestionCard>
      </div>
    </div>
  )
}
