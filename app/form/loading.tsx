import { Skeleton } from "@/components/ui/skeleton"

export default function Loading() {
  return (
    <div className="max-w-xl mx-auto p-6">
      <div className="mb-6">
        <Skeleton className="h-8 w-2/3 mb-4" />
        <Skeleton className="h-5 w-1/2 mb-2" />
      </div>
      <div className="space-y-4">
        <Skeleton className="h-12 w-full" />
        <Skeleton className="h-12 w-full" />
        <Skeleton className="h-12 w-full" />
        <Skeleton className="h-24 w-full" />
        <Skeleton className="h-12 w-1/2" />
      </div>
      <div className="mt-8">
        <Skeleton className="h-10 w-full rounded" />
      </div>
    </div>
  )
}
