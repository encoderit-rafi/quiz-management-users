import { api } from "@/axios";
import { queryOptions } from "@tanstack/react-query";
import { QUERY_KEYS } from "@/query-keys";
import type { TQuizSchema } from "../-types";

export const useGetQuiz = (id: string | number) => {
  return queryOptions({
    queryKey: QUERY_KEYS.GET_QUIZ(id),
    queryFn: async (): Promise<TQuizSchema> => {
      const res = await api.get(`/quizzes/${id}`);
      return res.data.data;
    },
    enabled: !!id,
  });
};
