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
        'text-center font-bold text-3xl md:text-5xl px-5 my-8 text-gray-800',
        className,
      )}
    >
      {question}
    </h1>
  )
}
