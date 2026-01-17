import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/submission/')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/submission/"!</div>
}
