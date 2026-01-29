import { createFileRoute, Link } from '@tanstack/react-router'
import { useQuizStore } from '@/store/quiz.store'
import { useGetResultPage } from '../questions/-apis/use-get-result-page.api'
import { ChevronsRight, Copy, Download, Loader2 } from 'lucide-react'
import { Button, buttonVariants } from '@/components/ui/button'
import { jsPDF } from 'jspdf'
import html2canvas from 'html2canvas'
import { useState } from 'react'
import {
  FacebookShareButton,
  FacebookIcon,
  LinkedinIcon,
  LinkedinShareButton,
  TwitterShareButton,
  XIcon,
} from 'react-share'
import { BASE_URL } from '@/consts'
import { toast } from 'sonner'
import { useTranslation } from 'react-i18next'

export const Route = createFileRoute('/_quiz/result/')({
  component: RouteComponent,
})

function RouteComponent() {
  const { t } = useTranslation()
  const { quiz, getTotalMarks } = useQuizStore()
  const [isDownloading, setIsDownloading] = useState(false)
  const totalMarks = getTotalMarks()
  const {
    data: resultData,
    isPending,
    isError,
  } = useGetResultPage({
    quiz_id: quiz?.uuid || '',
    mark: totalMarks,
  })

  const handleDownloadPDF = async () => {
    const element = document.getElementById('result-content')
    if (!element) {
      return
    }

    setIsDownloading(true)
    try {
      const canvas = await html2canvas(element, {
        scale: 2,
        useCORS: true,
        logging: true,
        backgroundColor: '#ffffff',
        onclone: (clonedDoc) => {
          const styleTags = clonedDoc.querySelectorAll('style')
          styleTags.forEach((tag) => tag.remove())

          const linkTags = clonedDoc.querySelectorAll('link[rel="stylesheet"]')
          linkTags.forEach((tag) => tag.remove())

          const clonedElement = clonedDoc.getElementById('result-content')
          if (clonedElement) {
            clonedElement.style.pointerEvents = 'auto'
            clonedElement.classList.remove('pointer-events-none')
            clonedElement.style.padding = '20px'
            clonedElement.style.backgroundColor = '#ffffff'
            clonedElement.style.color = '#000000'
            clonedElement.style.fontFamily = 'Arial, sans-serif'
            clonedElement.style.lineHeight = '1.6'

            const allElements = clonedElement.querySelectorAll('*')
            allElements.forEach((el) => {
              const htmlEl = el as HTMLElement
              htmlEl.removeAttribute('class')
              htmlEl.style.color = '#000000'
              htmlEl.style.backgroundColor = 'transparent'
              htmlEl.style.borderColor = '#dddddd'

              if (htmlEl.tagName === 'H1') htmlEl.style.fontSize = '24px'
              if (htmlEl.tagName === 'H2') htmlEl.style.fontSize = '20px'
              if (htmlEl.tagName === 'H3') htmlEl.style.fontSize = '18px'
              if (htmlEl.tagName === 'P') htmlEl.style.marginBottom = '10px'
              if (htmlEl.tagName === 'TABLE') {
                htmlEl.style.borderCollapse = 'collapse'
                htmlEl.style.width = '100%'
              }
              if (htmlEl.tagName === 'TH' || htmlEl.tagName === 'TD') {
                htmlEl.style.border = '1px solid #dddddd'
                htmlEl.style.padding = '8px'
              }
            })
          }
        },
      })

      const imgData = canvas.toDataURL('image/png')
      const imgWidth = 210
      const imgHeight = (canvas.height * imgWidth) / canvas.width

      const pdf = new jsPDF('p', 'mm', 'a4')
      pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight)
      pdf.save(`quiz-result-${quiz?.title || 'download'}.pdf`)
    } catch (error) {
      console.error('❌ PDF generation failed:', error)
      toast.error(t('result.pdfFail'))
    } finally {
      setIsDownloading(false)
    }
  }

  const handleCopyLink = async () => {
    try {
      const link = `${window.location.origin}/view/?quiz_id=${quiz?.uuid}&id=${quiz?.id}`
      await navigator.clipboard.writeText(link)
      toast.success(t('result.copySuccess'))
    } catch (err) {
      console.error('Failed to copy link:', err)
      toast.error(t('result.copyError'))
    }
  }

  if (isPending) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh]">
        <Loader2 className="w-10 h-10 animate-spin text-(--primary-color)" />
        <p className="mt-4 text-gray-500">{t('result.calculating')}</p>
      </div>
    )
  }

  if (isError) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] text-center px-4">
        <h2 className="text-2xl font-bold text-red-500">
          {t('result.errorTitle')}
        </h2>
        <p className="mt-2 text-gray-600">{t('result.errorDescription')}</p>
      </div>
    )
  }

  const result = resultData?.data || resultData

  return (
    <div className="mx-auto my-10 max-w-2xl px-4">
      <div
        id="result-content"
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
                url={`${BASE_URL}/_quiz/view?quiz_id=${quiz?.uuid}&id=${resultData?.data?.id} `}
              >
                <FacebookIcon size={32} round />
              </FacebookShareButton>
              <TwitterShareButton
                url={`${BASE_URL}/_quiz/view?quiz_id=${quiz?.uuid}&id=${resultData?.data?.id}`}
                title={quiz?.title}
              >
                <XIcon size={32} round />
              </TwitterShareButton>
              <LinkedinShareButton
                url={`${BASE_URL}/_quiz/view?quiz_id=${quiz?.uuid}&id=${resultData?.data?.id}`}
              >
                <LinkedinIcon size={32} round />
              </LinkedinShareButton>
            </>
          )}
          {quiz?.resultDeliverySetting?.enable_pdf_download && (
            <Button
              size={'icon'}
              className={'size-8'}
              onClick={handleDownloadPDF}
              disabled={isDownloading}
            >
              {isDownloading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Download />
              )}
            </Button>
          )}
          <Button
            size={'icon'}
            className={'size-8 bg-amber-500 hover:bg-amber-400'}
            onClick={handleCopyLink}
          >
            <Copy />
          </Button>
        </div>
        {quiz?.resultDeliverySetting?.result_page_position == 'before' && (
          <>
            <p className="mb-4">{t('result.advisorMeeting')}</p>
            <Link
              to="/submission"
              className={buttonVariants({
                variant: 'primary-reverse',
                size: 'lg',
                className: 'flex items-center gap-2 max-w-xl! w-full',
              })}
            >
              <span>
                {quiz?.result_button_text || t('result.advisorMeeting')}
              </span>
              <ChevronsRight />
            </Link>
          </>
        )}
      </div>
    </div>
  )
}
