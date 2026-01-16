import { createFileRoute, Link, useParams } from '@tanstack/react-router'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { useState } from 'react'
import Banner from '@/components/app/banner'
import { Label } from '@/components/ui/label'
import { Checkbox } from '@/components/ui/checkbox'
import { cn } from '@/lib/utils'

export const Route = createFileRoute('/questions/$id/')({
  component: RouteComponent,
})

// Mock data - replace with actual API call
const mockQuestions = [
  {
    id: 1,
    question: 'What is your primary career goal?',
    options: [
      'Advance to a leadership position',
      'Switch to a new industry',
      'Start my own business',
      'Enhance my current skills',
    ],
  },
  {
    id: 2,
    question: 'How many years of work experience do you have?',
    options: [
      'Less than 2 years',
      '2-5 years',
      '5-10 years',
      'More than 10 years',
    ],
  },
  {
    id: 3,
    question: 'What is your preferred learning style?',
    options: [
      'Self-paced online courses',
      'Live interactive sessions',
      'Hybrid (mix of both)',
      'In-person classes',
    ],
  },
]

const totalQuestions = mockQuestions.length

function RouteComponent() {
  const { id } = useParams({ from: Route.id })
  const currentQuestionIndex = parseInt(id) - 1
  const currentQuestion = mockQuestions[currentQuestionIndex]
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null)

  const progress = ((currentQuestionIndex + 1) / totalQuestions) * 100

  if (!currentQuestion) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-purple-50 to-orange-50">
        <Card className="max-w-md">
          <CardContent className="p-8 text-center">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">
              Question not found
            </h2>
            <Link to="/">
              <Button variant="outline">Return Home</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    )
  }
  return (
    <div className="relative">
      {/* BACKGROUNDS */}
      <div className="absolute inset-0 z-0 flex flex-col ">
        <img
          src="https://images.unsplash.com/photo-1758270704262-ecc82b23dc37?q=80&w=2231&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
          className="w-full max-h-[50vh] object-center object-cover border-b-8 border-purple-500 shrink-0"
        />
        <div className="flex-1 relative ">
          <div className="absolute inset-0 -z-10 h-full w-full bg-white bg-[linear-gradient(to_right,#f0f0f0_1px,transparent_1px),linear-gradient(to_bottom,#f0f0f0_1px,transparent_1px)] bg-size-[6rem_4rem]" />
        </div>
      </div>
      {/* BACKGROUNDS */}
      <div className="relative pt-[30vh] pb-[20vh] z-10">
        <div className=" container mx-auto  rounded-2xl aspect-square bg-white/20 p-4 mb-20">
          <div className="rounded-2xl aspect-square bg-white border-b-8 border-purple-500 py-2 px-5">
            <div className="rounded-2xl aspect-square border overflow-hidden">
              <div className="bg-purple-500/10 py-6 border-b border-purple-500">
                <Banner />
              </div>
              <div className="mx-auto my-10 max-w-[80%]">
                <div className="h-3 bg-gray-300 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-orange-500 rounded-full transition-all duration-500 ease-out"
                    style={{ width: `${progress}%` }}
                  />
                </div>
                <div className="flex items-center justify-between my-2">
                  <span className="font-medium">Quesetion 1 to 10</span>
                  <span>Finish</span>
                </div>
                <h1 className="text-center font-bold text-5xl px-5 my-8">
                  Welcome! Which of these aspects are important to you when
                  choosing an MBA? (Select all that apply)
                </h1>
                <div className="flex flex-col space-y-2">
                  <Label
                    htmlFor="1"
                    className={cn(
                      'border border-purple-500/10 bg-purple-500/5 px-5 py-4 rounded-md flex items-center gap-2 justify-between',
                      {},
                    )}
                  >
                    <div className="rounded-full size-10 bg-purple-500/20 flex items-center justify-center">
                      <span className="text-purple-600 text-2xl font-medium text-center">
                        a
                      </span>
                    </div>
                    <Checkbox
                      aria-describedby={`1-description`}
                      className="size-10"
                      id="1"
                    />
                  </Label>
                </div>
                <div className="flex justify-center my-5">
                  <Button
                    variant={'primary'}
                    size={'lg'}
                    className={'w-full  max-w-2xl'}
                  >
                    Next Question
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
  // return (
  //   <div className="min-h-screen flex flex-col bg-linear-to-br from-purple-50 via-white to-orange-50">

  //     <nav className="bg-white/80 backdrop-blur-sm border-b border-gray-200 p-4 shrink-0 sticky top-0 z-10">
  //       <div className="container mx-auto flex justify-between items-center">
  //         <div className="flex items-center gap-2">
  //           <div className="w-fit py-1.5 px-2 rounded-md bg-purple-500 uppercase text-white font-medium text-lg">
  //             qz
  //           </div>
  //           <p className="font-medium text-gray-800">Quiz Management</p>
  //         </div>
  //         <Link to="/">
  //           <Button variant="ghost" size="sm">
  //             Exit Quiz
  //           </Button>
  //         </Link>
  //       </div>
  //     </nav>

  //     {/* Progress Bar */}
  //     <div className="bg-white border-b border-gray-200">
  //       <div className="container mx-auto px-4 py-4">
  //         <div className="flex justify-between items-center mb-2">
  //           <span className="text-sm font-medium text-gray-600">
  //             Question {currentQuestionIndex + 1} of {totalQuestions}
  //           </span>
  //           <span className="text-sm font-medium text-purple-600">
  //             {Math.round(progress)}% Complete
  //           </span>
  //         </div>
  // <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
  //   <div
  //     className="h-full bg-linear-to-r from-purple-500 to-orange-500 transition-all duration-500 ease-out"
  //     style={{ width: `${progress}%` }}
  //   />
  // </div>
  //       </div>
  //     </div>

  //     {/* Main Content */}
  //     <div className="flex-1 container mx-auto px-4 py-8 md:py-12">
  //       <div className="max-w-3xl mx-auto">
  //         <Card className="shadow-xl border-0 overflow-hidden">
  //           <CardHeader className="bg-linear-to-r from-purple-500 to-purple-600 text-white p-6 md:p-8">
  //             <h1 className="text-2xl md:text-3xl font-bold leading-tight">
  //               {currentQuestion.question}
  //             </h1>
  //           </CardHeader>
  //           <CardContent className="p-6 md:p-8">
  //             <div className="space-y-4">
  //               {currentQuestion.options.map((option, index) => (
  //                 <label
  //                   key={index}
  //                   className={`
  //                     flex items-start gap-4 p-4 md:p-5 rounded-lg border-2 cursor-pointer
  //                     transition-all duration-300 hover:shadow-md
  //                     ${
  //                       selectedAnswer === index
  //                         ? 'border-purple-500 bg-purple-50 shadow-md'
  //                         : 'border-gray-200 bg-white hover:border-purple-300'
  //                     }
  //                   `}
  //                 >
  //                   <input
  //                     type="radio"
  //                     name="answer"
  //                     value={index}
  //                     checked={selectedAnswer === index}
  //                     onChange={() => setSelectedAnswer(index)}
  //                     className="mt-1 w-5 h-5 text-purple-500 focus:ring-purple-500 focus:ring-2 cursor-pointer"
  //                   />
  //                   <span
  //                     className={`flex-1 text-base md:text-lg ${
  //                       selectedAnswer === index
  //                         ? 'text-purple-900 font-medium'
  //                         : 'text-gray-700'
  //                     }`}
  //                   >
  //                     {option}
  //                   </span>
  //                 </label>
  //               ))}
  //             </div>
  //           </CardContent>
  //         </Card>

  //         {/* Navigation Buttons */}
  //         <div className="flex justify-between items-center mt-8 gap-4">
  //           {currentQuestionIndex > 0 ? (
  //             <Link
  //               to="/questions/$id"
  //               params={{ id: String(currentQuestionIndex) }}
  //             >
  //               <Button
  //                 variant="outline"
  //                 size="lg"
  //                 className="px-6 md:px-8 border-gray-300 hover:border-purple-500 hover:text-purple-500"
  //               >
  //                 « Previous
  //               </Button>
  //             </Link>
  //           ) : (
  //             <Button
  //               variant="outline"
  //               size="lg"
  //               disabled
  //               className="px-6 md:px-8 border-gray-300 opacity-50 cursor-not-allowed"
  //             >
  //               « Previous
  //             </Button>
  //           )}

  //           {selectedAnswer !== null ? (
  //             currentQuestionIndex < totalQuestions - 1 ? (
  //               <Link
  //                 to="/questions/$id"
  //                 params={{ id: String(currentQuestionIndex + 2) }}
  //               >
  //                 <Button
  //                   size="lg"
  //                   className="px-6 md:px-8 font-medium bg-linear-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white"
  //                 >
  //                   Next »
  //                 </Button>
  //               </Link>
  //             ) : (
  //               <Link to="/">
  //                 <Button
  //                   size="lg"
  //                   className="px-6 md:px-8 font-medium bg-linear-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white"
  //                 >
  //                   Submit Quiz »
  //                 </Button>
  //               </Link>
  //             )
  //           ) : (
  //             <Button
  //               size="lg"
  //               disabled
  //               className="px-6 md:px-8 font-medium bg-gray-300 text-gray-500 cursor-not-allowed"
  //             >
  //               {currentQuestionIndex < totalQuestions - 1
  //                 ? 'Next »'
  //                 : 'Submit Quiz »'}
  //             </Button>
  //           )}
  //         </div>
  //       </div>
  //     </div>
  //   </div>
  // )
}
