import { createFileRoute } from '@tanstack/react-router'
import { useQuizStore } from '@/store/quiz.store'
import { useGetResultPage } from '../questions/-apis/use-get-result-page.api'
// import { useEffect } from 'react'
import { ChevronsRight, Download, Loader2, Send } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  FacebookShareButton,
  FacebookIcon,
  LinkedinIcon,
  LinkedinShareButton,
  TwitterShareButton,
  XIcon,
} from 'react-share'
import { BASE_URL } from '@/consts'
export const Route = createFileRoute('/_quiz/result/')({
  component: RouteComponent,
})

function RouteComponent() {
  const { quiz, getTotalMarks } = useQuizStore()
  const totalMarks = getTotalMarks()
  const {
    data: resultData,
    isPending,
    isError,
  } = useGetResultPage({
    quiz_id: quiz?.uuid || '',
    mark: totalMarks,
  })
  console.log('👉 ~ RouteComponent ~ resultData:', resultData)

  // useEffect(() => {
  //   if (resultData) {
  //     const data = resultData?.data || resultData
  //     if (data?.id) {
  //       setResultPageId(data.id)
  //     }
  //   }
  // }, [resultData, setResultPageId])

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
      <div className="flex flex-col items-center justify-center my-4">
        <div className="flex items-center gap-2 justify-center">
          {quiz?.resultDeliverySetting?.enable_link_share && (
            <>
              <FacebookShareButton
                url={`${BASE_URL}/_quiz/result/view?quiz_id=${quiz?.uuid}&id=${resultData?.data?.id} `}
              >
                <FacebookIcon size={32} round />
              </FacebookShareButton>
              <TwitterShareButton
                url={`${BASE_URL}/_quiz/result/view?quiz_id=${quiz?.uuid}&id=${resultData?.data?.id}`}
                title={quiz?.title}
              >
                <XIcon size={32} round />
              </TwitterShareButton>
              <LinkedinShareButton
                url={`${BASE_URL}/_quiz/result/view?quiz_id=${quiz?.uuid}&id=${resultData?.data?.id}`}
              >
                <LinkedinIcon size={32} round />
              </LinkedinShareButton>
            </>
          )}
          {quiz?.resultDeliverySetting?.enable_pdf_download && (
            <Button size={'icon'} className={'size-8'}>
              <Download />
            </Button>
          )}
          {quiz?.resultDeliverySetting?.enable_email_result && (
            <Button
              size={'icon'}
              className="size-8 bg-orange-500 hover:bg-orange-400"
            >
              <Send />
            </Button>
          )}
        </div>
        <p className="mb-4">Feel free to setup a meeting with an advisor.</p>
        <Button
          // to="/submission"
          variant="primary-reverse"
          // className={buttonVariants({
          //   variant: 'primary-reverse',
          //   size: 'lg',
          //   className: 'flex items-center gap-2 max-w-xl! w-full',
          // })}
          className="flex items-center gap-2 max-w-xl! w-full"
        >
          <span>{quiz?.result_button_text || 'Speak To An Advisor'}</span>
          <ChevronsRight />
        </Button>
      </div>
    </div>
  )
}
