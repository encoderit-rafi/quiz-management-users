export const QUERY_KEYS = {
  GET_QUIZ: (id: string | number) => ['get-quiz', id],
  GET_RESULT_PAGE: (quiz_id: string | number, mark: number) => [
    'get-result-page',
    quiz_id,
    mark,
  ],
}
