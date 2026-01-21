export const QUERY_KEYS = {
  GET_QUIZ: (id: string | number) => ['get-quiz', id],
  GET_RESULT_PAGE: (quiz_id: string | number, mark: number) => [
    'get-result-page',
    quiz_id,
    mark,
  ],
  GET_RESULT: (quiz_id: string | number, id: string | number) => [
    'get-result',
    quiz_id,
    id,
  ],
}
