export default function QuestionBackground({ img_src }: { img_src: string }) {
  return (
    <div className="absolute inset-0 z-0 flex flex-col ">
      <img
        src={img_src || ''}
        className="w-full max-h-[50vh] object-center object-cover border-b-8 border-(--primary-color) shrink-0"
      />
      <div className="flex-1 relative ">
        <div className="absolute inset-0 -z-10 h-full w-full bg-white bg-[linear-gradient(to_right,#f0f0f0_1px,transparent_1px),linear-gradient(to_bottom,#f0f0f0_1px,transparent_1px)] bg-size-[6rem_4rem]" />
      </div>
    </div>
  )
}
