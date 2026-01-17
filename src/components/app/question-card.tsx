export default function QuestionCard({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className=" container mx-auto  rounded-2xl  bg-white/20 p-4 mb-20 max-w-4xl">
      <div className="rounded-2xl  bg-white border-b-8 border-(--primary-color) py-2 px-5 shadow-xl">
        <div className="rounded-2xl  overflow-hidden">{children}</div>
      </div>
    </div>
  )
}
