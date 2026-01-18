import NotFound from '@/components/app/not-found'
import { createFileRoute } from '@tanstack/react-router'
export const Route = createFileRoute('/$')({
  component: NotFound,
})
