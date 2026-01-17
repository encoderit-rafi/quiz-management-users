import { api } from '@/axios'
import { useMutation } from '@tanstack/react-query'

export type GetResultPagePayload = {
  quiz_id: number | string
  data: Record<string, any>
}

export const useGetResultPage = () => {
  return useMutation({
    mutationFn: async ({ quiz_id, data }: GetResultPagePayload) => {
      const res = await api.post(`/quiz/${quiz_id}/result`, data)
      return res.data
    },
  })
}
