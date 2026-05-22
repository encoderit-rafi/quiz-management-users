import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { useQuizStore } from '@/store/quiz.store'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useQuizSubmission } from '../questions/-apis/use-quiz-submission.api'
import { Field, FieldError } from '@/components/ui/field'
import { ChevronsRight, Loader2 } from 'lucide-react'
import { toast } from 'sonner'
import { useGetResultPage } from '../questions/-apis'
import { useEffect, useMemo } from 'react'
import { useTranslation } from 'react-i18next'

export const Route = createFileRoute('/_quiz/submission/')({
  component: RouteComponent,
})

function RouteComponent() {
  const { t } = useTranslation()
  const navigate = useNavigate()

  const {
    quiz,
    answers,
    resultPageId,
    getTotalMarks,
    setResultPageId,
    setSubmissionId,
  } = useQuizStore()

  const { mutate: submitQuiz, isPending: isSubmitting } = useQuizSubmission()

  const isCategoryMode = quiz?.scoring_mode === 'category'
  const totalMarks = getTotalMarks()

  // Only pre-fetch result page for total-score mode
  const { data: resultData, isPending: isResultPending } = useGetResultPage({
    quiz_id: quiz?.uuid || '',
    mark: isCategoryMode ? undefined : totalMarks,
  })

  useEffect(() => {
    if (!isCategoryMode && resultData) {
      const data = resultData?.data || resultData
      if (data?.id) {
        setResultPageId(data.id)
      }
    }
  }, [resultData, isCategoryMode, setResultPageId])

  const rawFields = quiz?.leadFormSetting?.fields || []
  // Normalize: support both `field_name` (admin-created) and `name` (legacy/manual)
  const leadFields = rawFields.map((f) => ({
    ...f,
    field_name: (f.field_name || f.name || '').trim(),
  }))

  const schema = useMemo(() => {
    const schemaShape: Record<string, z.ZodTypeAny> = {}

    leadFields.forEach((field) => {
      if (!field.field_name) return
      let fieldSchema: z.ZodTypeAny = z.string()

      const isRequired = field.enabled && field.required

      const knownKey = ['name', 'email', 'phone', 'zip', 'address'].includes(field.field_name)
      const fieldLabel = knownKey ? t(`submission.form.${field.field_name}`) : field.label

      if (isRequired) {
        fieldSchema = (fieldSchema as z.ZodString).min(
          1,
          t('submission.form.required', { label: fieldLabel }),
        )
      } else {
        fieldSchema = fieldSchema.optional().or(z.literal(''))
      }

      if (field.type === 'email') {
        if (isRequired) {
          fieldSchema = (fieldSchema as z.ZodString).email(
            t('submission.form.invalidEmail'),
          )
        } else {
          fieldSchema = z.union([
            z.string().email(t('submission.form.invalidEmail')),
            z.literal(''),
            z.string().length(0).optional(),
          ])
        }
      }
      schemaShape[field.field_name] = fieldSchema
    })

    if (!schemaShape.name) {
      schemaShape.name = z
        .string()
        .min(
          1,
          t('submission.form.required', { label: t('submission.form.name') }),
        )
    }

    return z.object(schemaShape)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [quiz?.leadFormSetting?.fields])

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    resolver: zodResolver(schema),
  })

  if (!quiz) {
    return <div>No quiz found</div>
  }

  const onSubmit = (data: any) => {
    const total_score = getTotalMarks()
    const formattedAnswers = Object.entries(answers).map(([qId, aIds]) => {
      const normalizedAIds = Array.isArray(aIds) ? aIds : [aIds]
      return {
        question_id: Number(qId),
        answer_ids: normalizedAIds,
      }
    })

    const payload = {
      quiz_id: quiz.id,
      user_data: data,
      total_score,
      result_page_id: isCategoryMode ? null : (resultPageId || null),
      answers: formattedAnswers,
    }

    submitQuiz(
      { uuid: quiz.uuid, payload },
      {
        onSuccess: (response) => {
          toast.success(t('submission.success'))
          reset()

          // For category mode, store the submission ID so the result page
          // can fetch the server-computed result via submission_id
          if (isCategoryMode) {
            const submissionId = response?.data?.id ?? null
            setSubmissionId(submissionId)
          }

          navigate({ to: '/result', search: { quiz_id: quiz.uuid } })
        },
        onError: (err: any) => {
          toast.error(err?.response?.data?.message || t('submission.error'))
        },
      },
    )
  }

  // For total mode, block the submit button while the result page is pre-fetching
  const isWaiting = !isCategoryMode && isResultPending

  return (
    <div className="mx-auto my-10 max-w-xl">
      <div className="mb-8 text-center">
        <h1 className="text-2xl font-bold">{t('submission.title')}</h1>
        <p className="text-gray-500">{t('submission.description')}</p>
      </div>

      <div className="space-y-6">
        {(leadFields.find((f) => f.field_name === 'name')?.enabled !== false ||
          !leadFields.find((f) => f.field_name === 'name')) && (
          <Field>
            <input
              id="name"
              placeholder={t('submission.form.namePlaceholder')}
              className="bg-(--primary-color)/10 border-(--primary-color)/20 rounded-sm h-12 focus-visible:ring-(--primary-color)/30 focus-visible:border-(--primary-color)/20 w-full px-3"
              {...register('name')}
            />
            {errors.name && (
              <FieldError>{String(errors.name?.message)}</FieldError>
            )}
          </Field>
        )}

        {leadFields
          .filter((field) => field.enabled && field.field_name !== 'name')
          .map((field) => {
            const fieldLabel =
              field.field_name === 'name' ||
              field.field_name === 'email' ||
              field.field_name === 'phone' ||
              field.field_name === 'zip' ||
              field.field_name === 'address'
                ? t(`submission.form.${field.field_name}`)
                : field.label

            return (
              <Field key={field.field_name}>
                <input
                  id={field.field_name}
                  type={field.type}
                  className="bg-(--primary-color)/10 border-(--primary-color)/20 rounded-sm h-12 focus-visible:ring-(--primary-color)/30 focus-visible:border-(--primary-color)/20 w-full px-3"
                  placeholder={t('submission.form.fieldPlaceholder', {
                    label: fieldLabel,
                  })}
                  {...register(field.field_name)}
                />
                {errors[field.field_name] && (
                  <FieldError>
                    {String(errors[field.field_name]?.message)}
                  </FieldError>
                )}
              </Field>
            )
          })}

        <button
          type="button"
          onClick={handleSubmit(onSubmit)}
          className="w-full h-14 text-lg rounded-sm bg-(--primary-color) text-white font-medium disabled:opacity-50"
          disabled={isSubmitting || isWaiting}
        >
          <div className="flex items-center justify-center gap-2">
            {isWaiting ? t('common.pleaseWait') : t('common.submit')}
            {isSubmitting ? (
              <Loader2 className="mr-2 h-5 w-5 animate-spin" />
            ) : (
              <ChevronsRight />
            )}
          </div>
        </button>
      </div>
    </div>
  )
}
