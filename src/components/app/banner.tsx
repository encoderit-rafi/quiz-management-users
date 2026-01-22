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
    <div className="w-fit mx-auto flex justify-between items-center gap-2">
      <img
        src={logo}
        alt={title}
        className="h-10 w-auto rounded-md object-center object-cover"
      />
      <div className="">
        <h3 className="font-light text-sm">{heading}</h3>
        <h2 className="font-medium">{title}</h2>
      </div>
    </div>
  )
}
