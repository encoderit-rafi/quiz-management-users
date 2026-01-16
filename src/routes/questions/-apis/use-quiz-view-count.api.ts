import { api } from '@/axios'
import { useMutation } from '@tanstack/react-query'

export const useQuizViewCount = () => {
  return useMutation({
    mutationFn: async (quizId: string | number) => {
      const res = await api.post(`/quiz/${quizId}/view`)
      return res.data
    },
  })
}
