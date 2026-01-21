import { api } from '@/axios'
import { useQuery } from '@tanstack/react-query'
import { QUERY_KEYS } from '@/query-keys'

export type GetResultPayload = {
  quiz_id: string | number
  id: string | number
}

export const useGetResult = ({ quiz_id, id }: GetResultPayload) => {
  return useQuery({
    queryKey: QUERY_KEYS.GET_RESULT(quiz_id, id),
    queryFn: async () => {
      const res = await api.get(`/quiz/${quiz_id}/result/${id}`)
      return res.data
    },
    enabled: !!quiz_id && !!id,
  })
}
