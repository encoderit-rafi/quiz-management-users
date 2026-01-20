import { cn } from '@/lib/utils'

export default function QuestionTitle({
  question,
  className,
}: {
  question: string
  className?: string
}) {
  return (
    <h1
      className={cn(
        'text-center font-bold text-2xl md:text-4xl px-5 my-4 md:my-5 text-gray-800',
        className,
      )}
    >
      {question}
    </h1>
  )
}
