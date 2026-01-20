export default function QuestionCard({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="mx-auto rounded-2xl bg-white/20 max-w-5xl md:p-3">
      <div className="rounded-2xl bg-white border-b-8 border-(--primary-color) py-2 px-2 md:px-5 shadow-xl">
        <div className="rounded-2xl overflow-hidden">{children}</div>
      </div>
    </div>
  )
}
