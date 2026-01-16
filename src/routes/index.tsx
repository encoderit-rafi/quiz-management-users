import Banner from '@/components/app/banner'
import { Button } from '@/components/ui/button'
import { createFileRoute, Link } from '@tanstack/react-router'

export const Route = createFileRoute('/')({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <div
      className={`min-h-screen flex flex-col overflow-hidden bg-[url(https://images.unsplash.com/photo-1590650516494-0c8e4a4dd67e?q=80&w=2071&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D)] bg-cover bg-center after:absolute after:inset-0 after:bg-linear-to-r after:from-black after:from-20% after:to-transparent text-white`}
    >
      <div className="flex-1 flex flex-col overflow-hidden relative z-10">
        <nav className="bg-white/20 p-2 shrink-0 backdrop-blur-xs">
          {/* <div className="w-fit mx-auto flex flex-col md:flex-row justify-between items-center pt-6 md:pt-0 gap-3 md:gap-10">
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
              <h2 className="font-medium">
                Is our Global Online MBA right for you?
              </h2>
            </div>
          </div> */}
          <Banner />
        </nav>
        <div className="container grow  mx-auto p-2 flex flex-col">
          <div className="w-full max-w-lg flex flex-col gap-8 justify-center grow">
            <h1 className="border-l-4 border-l-purple-500 p-2 text-4xl md:text-5xl font-bold ">
              Is our Global Online MBA right{' '}
              <span className="text-purple-500">for you?</span>
            </h1>
            <p className="text-lg">
              Are you looking for a flexible online MBA to advance your career
              skills? Take this 4-minute quiz to find out if this online MBA is
              right for you!
            </p>

            <Button variant={'primary'} size={'lg'}>
              <Link to="/questions/$id" params={{ id: '1' }}>
                Start Quiz »
              </Link>
            </Button>
            <div className="">
              <p className="text-lg">Education Matching for Students by</p>
              <Link to="/" className="text-purple-500 ">
                <span className="underline text-lg font-bold">
                  House of Education
                </span>{' '}
                »»
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
