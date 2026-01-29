import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { useQuizStore } from '@/store/quiz.store'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useQuizSubmission } from '../questions/-apis/use-quiz-submission.api'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Field, FieldError } from '@/components/ui/field'
import { ChevronsRight, Loader2 } from 'lucide-react'
import { toast } from 'sonner'
import { useGetResultPage } from '../questions/-apis'
import { useEffect } from 'react'
import { useTranslation } from 'react-i18next'

export const Route = createFileRoute('/_quiz/submission/')({
  component: RouteComponent,
})

function RouteComponent() {
  const { t } = useTranslation()
  const navigate = useNavigate()

  const { quiz, answers, resultPageId, getTotalMarks, setResultPageId } =
    useQuizStore()
  const { mutate: submitQuiz, isPending: isSubmitting } = useQuizSubmission()

  const totalMarks = getTotalMarks()
  const { data: resultData, isPending } = useGetResultPage({
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

  const leadFields = quiz?.leadFormSetting?.fields || []

  // Build dynamic Zod schema
  const schemaShape: Record<string, z.ZodTypeAny> = {}

  leadFields.forEach((field) => {
    let fieldSchema: z.ZodTypeAny = z.string()

    const isRequired = field.enabled && field.required

    if (isRequired) {
      fieldSchema = (fieldSchema as z.ZodString).min(
        1,
        t('submission.form.required', { label: field.label }),
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

  const schema = z.object(schemaShape)

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
      result_page_id: resultPageId || -1,
      answers: formattedAnswers,
    }

    submitQuiz(
      { uuid: quiz.uuid, payload },
      {
        onSuccess: () => {
          toast.success(t('submission.success'))
          reset()
          quiz?.resultDeliverySetting?.result_page_position == 'before'
            ? navigate({
                to: '/result/view',
                search: { quiz_id: quiz.uuid, id: quiz.id },
              })
            : navigate({ to: '/result', search: { quiz_id: quiz.uuid } })
        },
        onError: (err: any) => {
          toast.error(err?.response?.data?.message || t('submission.error'))
        },
      },
    )
  }

  return (
    <div className="mx-auto my-10 max-w-xl">
      <div className="mb-8 text-center">
        <h1 className="text-2xl font-bold">{t('submission.title')}</h1>
        <p className="text-gray-500">{t('submission.description')}</p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {(leadFields.find((f) => f.field_name === 'name')?.enabled !== false ||
          !leadFields.find((f) => f.field_name === 'name')) && (
          <Field>
            {/* <FieldLabel htmlFor="name">{t('submission.form.name')}</FieldLabel> */}
            <Input
              id="name"
              placeholder={t('submission.form.namePlaceholder')}
              className="bg-(--primary-color)/10 border-(--primary-color)/20 rounded-sm h-12 focus-visible:ring-(--primary-color)/30 focus-visible:border-(--primary-color)/20"
              {...register('name')}
            />
            {errors.name && (
              <FieldError>{String(errors.name?.message)}</FieldError>
            )}
          </Field>
        )}

        {leadFields
          .filter((field) => field.enabled && field.field_name !== 'name')
          .map((field) => (
            <Field key={field.field_name}>
              {/* <FieldLabel htmlFor={field.field_name}>{field.label}</FieldLabel> */}
              <Input
                id={field.field_name}
                type={field.type}
                className="bg-(--primary-color)/10 border-(--primary-color)/20 rounded-sm h-12 focus-visible:ring-(--primary-color)/30 focus-visible:border-(--primary-color)/20"
                placeholder={t('submission.form.fieldPlaceholder', {
                  label: field.label.toLowerCase(),
                })}
                {...register(field.field_name)}
              />
              {errors[field.field_name] && (
                <FieldError>
                  {String(errors[field.field_name]?.message)}
                </FieldError>
              )}
            </Field>
          ))}

        <Button
          type="submit"
          variant="primary-reverse"
          size="lg"
          className="w-full h-14 text-lg"
          disabled={isSubmitting || isPending}
        >
          <div className="flex items-center gap-2">
            {isPending ? t('common.pleaseWait') : t('common.submit')}
            {isSubmitting ? (
              <Loader2 className="mr-2 h-5 w-5 animate-spin" />
            ) : (
              <ChevronsRight />
            )}
          </div>
        </Button>
      </form>
    </div>
  )
}
