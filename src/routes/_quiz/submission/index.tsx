import { createFileRoute } from '@tanstack/react-router'
import { useQuizStore } from '@/store/quiz.store'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useQuizSubmission } from '../questions/-apis/use-quiz-submission.api'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Field, FieldLabel, FieldError } from '@/components/ui/field'
import { ChevronsRight, Loader2 } from 'lucide-react'
import { toast } from 'sonner'
import { useState } from 'react'
import { cn } from '@/lib/utils'

export const Route = createFileRoute('/_quiz/submission/')({
  component: RouteComponent,
})

function RouteComponent() {
  const [message, setMessage] = useState<{ success: string; error: string }>({
    success: '',
    error: '',
  })

  const { quiz, answers, resultPageId, getTotalMarks } = useQuizStore()
  const { mutate: submitQuiz, isPending: isSubmitting } = useQuizSubmission()

  const leadFields = quiz?.leadFormSetting?.fields || []
  console.log('👉 ~ RouteComponent ~ leadFields:', quiz)

  // Build dynamic Zod schema
  const schemaShape: Record<string, z.ZodTypeAny> = {}

  leadFields.forEach((field) => {
    let fieldSchema: z.ZodTypeAny = z.string()

    const isRequired = field.enabled && field.required

    if (isRequired) {
      fieldSchema = (fieldSchema as z.ZodString).min(
        1,
        `${field.label} is required`,
      )
    } else {
      fieldSchema = fieldSchema.optional().or(z.literal(''))
    }

    if (field.type === 'email') {
      // For email, if it's optional, we only validate the format if it's not empty
      if (isRequired) {
        fieldSchema = (fieldSchema as z.ZodString).email(
          'Invalid email address',
        )
      } else {
        fieldSchema = z.union([
          z.string().email('Invalid email address'),
          z.literal(''),
          z.string().length(0).optional(),
        ])
      }
    }
    schemaShape[field.field_name] = fieldSchema
  })

  // Ensure 'name' is at least defined if it wasn't in leadFields
  if (!schemaShape.name) {
    schemaShape.name = z.string().min(1, 'Name is required')
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
  console.log('👉 ~ RouteComponent ~ errors:', errors)

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
      result_page_id: resultPageId || 0,
      answers: formattedAnswers,
    }

    submitQuiz(
      { uuid: quiz.uuid, payload },
      {
        onSuccess: () => {
          // navigate({ to: '/', search: { quiz_id: quiz.uuid } })
          toast.success('Successfully submitted!')
          setMessage({ success: 'Successfully submitted!', error: '' })
          reset()
        },
        onError: (err: any) => {
          console.log('👉 ~ onSubmit ~ err:', err)
          toast.error(err?.response?.data?.message || 'Failed to submit quiz')
          setMessage({
            success: '',
            error: err?.response?.data?.message || 'Failed to submit quiz',
          })
        },
      },
    )
  }

  return (
    <div className="mx-auto my-10 max-w-xl">
      <div className="mb-8 text-center">
        <h1 className="text-2xl font-bold">That's all the questions!</h1>
        <p className="text-gray-500">
          Please provide your details to access your personal result. We'll also
          email you a link.
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {(leadFields.find((f) => f.field_name === 'name')?.enabled !== false ||
          !leadFields.find((f) => f.field_name === 'name')) && (
          <Field>
            <FieldLabel htmlFor="name">Name</FieldLabel>
            <Input
              id="name"
              placeholder="Enter your name"
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
              <FieldLabel htmlFor={field.field_name}>{field.label}</FieldLabel>
              <Input
                id={field.field_name}
                type={field.type}
                className="bg-(--primary-color)/10 border-(--primary-color)/20 rounded-sm h-12 focus-visible:ring-(--primary-color)/30 focus-visible:border-(--primary-color)/20"
                placeholder={`Enter your ${field.label.toLowerCase()}`}
                {...register(field.field_name)}
              />
              {errors[field.field_name] && (
                <FieldError>
                  {String(errors[field.field_name]?.message)}
                </FieldError>
              )}
            </Field>
          ))}

        <div
          className={cn('text-center hidden', {
            'text-green-500': Boolean(message.success),
            'text-red-500': Boolean(message.error),
            block: Boolean(message.success || message.error),
          })}
        >
          {message.success || message.error}
        </div>

        <Button
          type="submit"
          variant="primary-reverse"
          size="lg"
          className="w-full h-14 text-lg"
          disabled={isSubmitting}
        >
          <div className="flex items-center gap-2">
            Submit
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
