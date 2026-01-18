import React from 'react'

export default function NotFound() {
  return (
    <div className="flex h-screen w-full flex-col items-center justify-center bg-gray-50 text-center">
      <div className="space-y-4 px-4 text-center">
        <h1 className="text-9xl font-black text-gray-200">404</h1>
        <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl text-gray-800">
          Page Not Found
        </h2>
        <p className="mx-auto max-w-150 text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed dark:text-gray-400">
          Oops! The page you are looking for does not exist. It might have been
          moved or deleted.
        </p>
      </div>
    </div>
  )
}
