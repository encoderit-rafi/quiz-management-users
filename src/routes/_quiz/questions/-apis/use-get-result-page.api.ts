import { api } from '@/axios'
import { useQuery } from '@tanstack/react-query'
import { QUERY_KEYS } from '@/query-keys'

export type GetResultPagePayload = {
  quiz_id: string | number
  mark?: number
  submission_id?: number | null
}

export const useGetResultPage = ({
  quiz_id,
  mark,
  submission_id,
}: GetResultPagePayload) => {
  return useQuery({
    queryKey: QUERY_KEYS.GET_RESULT_PAGE(
      quiz_id,
      mark,
      submission_id ?? undefined,
    ),
    queryFn: async () => {
      const params: Record<string, number> = {}
      if (submission_id) {
        params.submission_id = submission_id
      } else if (mark !== undefined) {
        params.mark = mark
      }
      const res = await api.get(`/quiz/${quiz_id}/result`, { params })
      return res.data
    },
    enabled: !!quiz_id && (mark !== undefined || !!submission_id),
  })
}
