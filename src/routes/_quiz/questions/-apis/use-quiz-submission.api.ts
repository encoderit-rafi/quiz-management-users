import { api } from '@/axios'
import { useMutation } from '@tanstack/react-query'

export type QuizSubmissionPayload = {
  quiz_id: number
  user_data: Record<string, any>
  total_score: number
  result_page_id: number
  answers: {
    question_id: number
    answer_ids: number[]
  }[]
}

export const useQuizSubmission = () => {
  return useMutation({
    mutationFn: async ({
      uuid,
      payload,
    }: {
      uuid: string
      payload: QuizSubmissionPayload
    }) => {
      const res = await api.post(`/quiz/${uuid}/quiz-submissions`, payload)
      return res.data
    },
  })
}
