import { api } from '@/axios'
import { useQuery } from '@tanstack/react-query'
import { QUERY_KEYS } from '@/query-keys'

export type GetResultPagePayload = {
  quiz_id: string | number
  mark: number
}

export const useGetResultPage = ({ quiz_id, mark }: GetResultPagePayload) => {
  return useQuery({
    queryKey: QUERY_KEYS.GET_RESULT_PAGE(quiz_id, mark),
    queryFn: async () => {
      const res = await api.get(`/quiz/${quiz_id}/result`, {
        params: { mark },
      })
      return res.data
    },
    enabled: !!quiz_id && mark !== undefined,
  })
}
