export default function Banner() {
  return (
    <div className="w-fit mx-auto flex flex-col md:flex-row justify-between items-center pt-6 md:pt-0 gap-3 md:gap-10">
      <div className="flex font-medium  text-lg items-center justify-center gap-2 w-fit">
        <div className="w-fit py-1.5 px-2 rounded-md bg-purple-500 uppercase">
          qz
        </div>
        <p>Logo Here</p>
      </div>
      <div className="">
        <h3 className="font-light text-sm">
          Maastricht School of Management (MSM)
        </h3>
        <h2 className="font-medium">Is our Global Online MBA right for you?</h2>
      </div>
    </div>
  )
}
