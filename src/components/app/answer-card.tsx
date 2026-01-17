import { cn } from '@/lib/utils'
import { CheckIcon } from 'lucide-react'

export default function AnswerCard({
  index,
  isSelected,
  text,
  ...props
}: {
  index: number
  isSelected: boolean
  text: string
} & React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        'cursor-pointer border  px-5 py-4 rounded-xl flex items-center gap-4 justify-between transition-all duration-200',
        isSelected
          ? 'bg-(--primary-color) border-(--primary-color) shadow-md'
          : 'bg-(--primary-color)/10 border-(--primary-color)/20 hover:bg-(--primary-color)/20',
      )}
      {...props}
    >
      <div className="flex items-center gap-4">
        <div
          className={cn(
            'rounded-full size-10 flex items-center justify-center shrink-0 transition-colors',
            isSelected
              ? 'bg-white text-(--primary-color)'
              : 'bg-(--primary-color)/20 text-(--primary-color)',
          )}
        >
          <span className="text-xl font-bold">
            {String.fromCharCode(65 + index)}
          </span>
        </div>
        <span
          className={cn(
            'text-lg font-medium',
            isSelected ? 'text-white' : 'text-gray-900',
          )}
        >
          {text}
        </span>
      </div>

      <div
        className={cn(
          'size-12 rounded-full bg-white/20 p-1 flex items-center justify-center duration-200 transition-all',
          isSelected ? 'opacity-100 scale-100' : 'opacity-0 scale-0',
        )}
      >
        <div className="size-full rounded-full bg-white flex items-center justify-center">
          <CheckIcon className="size-5 text-(--primary-color)" />
        </div>
      </div>
    </div>
  )
}
