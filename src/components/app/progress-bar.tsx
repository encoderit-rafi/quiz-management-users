export default function ProgressBar({
  index,
  total,
}: {
  index: number
  total: number
}) {
  const progress = ((index + 1) / total) * 100
  return (
    <div className="">
      <div className="h-3 bg-gray-200 rounded-full overflow-hidden">
        <div
          className="h-full bg-(--primary-color) rounded-full transition-all duration-500 ease-out"
          style={{ width: `${progress}%` }}
        />
      </div>
      <div className="flex items-center justify-between my-2 text-sm text-gray-500">
        {/* <span className="font-medium text-gray-900">
          Question {index + 1} of {total}
        </span>
        <span>Finish</span> */}
        <span className="font-medium text-gray-900">
          Fråga {index + 1} av {total}
        </span>
        <span>Slut</span>
      </div>
    </div>
  )
}
