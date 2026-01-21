import { createFileRoute, Link } from '@tanstack/react-router'
import { useQuizStore } from '@/store/quiz.store'
import { useGetResultPage } from '../questions/-apis/use-get-result-page.api'
// import { useEffect } from 'react'
import { ChevronsRight, Download, Loader2 } from 'lucide-react'
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
export const Route = createFileRoute('/_quiz/result/')({
  component: RouteComponent,
})

function RouteComponent() {
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
  console.log('👉 ~ RouteComponent ~ resultData:', resultData)

  const handleDownloadPDF = async () => {
    console.log('🚀 Starting PDF download...')
    const element = document.getElementById('result-content')
    if (!element) {
      console.error('❌ Element not found')
      return
    }

    setIsDownloading(true)
    try {
      console.log('📸 Capturing with html2canvas...')
      const canvas = await html2canvas(element, {
        scale: 2,
        useCORS: true,
        logging: true,
        backgroundColor: '#ffffff',
        onclone: (clonedDoc) => {
          console.log('🧬 Processing cloned document...')

          // Remove ALL style and link tags
          const styleTags = clonedDoc.querySelectorAll('style')
          console.log(`Found ${styleTags.length} style tags`)
          styleTags.forEach((tag) => tag.remove())

          const linkTags = clonedDoc.querySelectorAll('link[rel="stylesheet"]')
          console.log(`Found ${linkTags.length} link tags`)
          linkTags.forEach((tag) => tag.remove())

          // Get the cloned element
          const clonedElement = clonedDoc.getElementById('result-content')
          if (clonedElement) {
            console.log('✅ Found cloned element')
            clonedElement.style.pointerEvents = 'auto'
            clonedElement.classList.remove('pointer-events-none')
            clonedElement.style.padding = '20px'
            clonedElement.style.backgroundColor = '#ffffff'
            clonedElement.style.color = '#000000'
            clonedElement.style.fontFamily = 'Arial, sans-serif'
            clonedElement.style.lineHeight = '1.6'

            // Apply safe styles to all child elements
            const allElements = clonedElement.querySelectorAll('*')
            console.log(`Processing ${allElements.length} elements`)
            allElements.forEach((el) => {
              const htmlEl = el as HTMLElement
              // Clear all existing styles
              htmlEl.removeAttribute('class')
              htmlEl.style.color = '#000000'
              htmlEl.style.backgroundColor = 'transparent'
              htmlEl.style.borderColor = '#dddddd'

              // Apply basic typography
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
            console.log('✅ Styles applied')
          }
        },
      })

      console.log('📄 Canvas created, generating PDF...')
      const imgData = canvas.toDataURL('image/png')
      const imgWidth = 210 // A4 width in mm
      const imgHeight = (canvas.height * imgWidth) / canvas.width

      const pdf = new jsPDF('p', 'mm', 'a4')
      pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight)
      pdf.save(`quiz-result-${quiz?.title || 'download'}.pdf`)
      console.log('✅ PDF saved successfully!')
    } catch (error) {
      console.error('❌ PDF generation failed:', error)
      alert('Failed to generate PDF. Please check the console for details.')
    } finally {
      setIsDownloading(false)
    }
  }

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
        </div>
        {quiz?.resultDeliverySetting?.result_page_position == 'before' && (
          <>
            <p className="mb-4">
              Feel free to setup a meeting with an advisor.
            </p>
            <Link
              to="/submission"
              className={buttonVariants({
                variant: 'primary-reverse',
                size: 'lg',
                className: 'flex items-center gap-2 max-w-xl! w-full',
              })}
            >
              <span>{quiz?.result_button_text || 'Speak To An Advisor'}</span>
              <ChevronsRight />
            </Link>
          </>
        )}
      </div>
    </div>
  )
}
