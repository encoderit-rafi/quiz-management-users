import { useTranslation } from 'react-i18next'
import { Button } from '@/components/ui/button'
import { AlertTriangle } from 'lucide-react'
import { useNavigate } from '@tanstack/react-router'

export default function ErrorFallback({ error, reset }: { error: Error; reset?: () => void }) {
  const { t } = useTranslation()
  const navigate = useNavigate()

  return (
    <div className="flex min-h-screen w-full flex-col items-center justify-center bg-gray-50 p-4 text-center">
      <div className="flex h-20 w-20 items-center justify-center rounded-full bg-red-100 text-red-600 mb-6">
        <AlertTriangle className="h-10 w-10" />
      </div>
      <h1 className="mb-2 text-2xl font-bold text-gray-900 md:text-3xl">
        {t('errors.fallback.title', 'Something went wrong')}
      </h1>
      <p className="mb-8 max-w-md text-gray-600">
        {t('errors.fallback.description', 'An unexpected error occurred. We apologize for the inconvenience.')}
      </p>
      
      {error && (
        <div className="mb-8 w-full max-w-lg overflow-hidden rounded-lg bg-gray-900 p-4 text-left text-sm text-red-400 font-mono">
          <div className="mb-2 font-bold text-gray-400">Error Details:</div>
          <pre className="whitespace-pre-wrap break-all">{error.message}</pre>
        </div>
      )}

      <div className="flex gap-4">
        {reset && (
          <Button variant="outline" onClick={reset}>
            {t('errors.fallback.retry', 'Try Again')}
          </Button>
        )}
        <Button variant="primary" onClick={() => navigate({ to: '/' })}>
          {t('errors.fallback.home', 'Back to Home')}
        </Button>
      </div>
    </div>
  )
}
