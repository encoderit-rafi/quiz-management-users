export default function Banner({
  logo,
  title,
  heading,
}: {
  logo: string
  title: string
  heading: string
}) {
  return (
    <div className="w-fit mx-auto flex flex-col md:flex-row justify-between items-center pt-6 md:pt-0 gap-6">
      <div className="flex font-medium  text-lg items-center justify-center gap-2 w-fit">
        <img
          src={logo}
          alt={title}
          className="size-10 rounded-md object-center object-cover"
        />
        {/* <p>Logo Here</p> */}
      </div>
      <div className="">
        <h3 className="font-light text-sm">{heading}</h3>
        <h2 className="font-medium">{title}</h2>
      </div>
    </div>
  )
}
