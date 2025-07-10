import { Skeleton } from "@/components/ui/skeleton"

export default function Loading() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 to-pink-50 p-4">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-xl shadow p-8">
          <Skeleton className="w-16 h-16 mx-auto mb-4" />
          <Skeleton className="h-8 w-2/3 mx-auto mb-2" />
          <Skeleton className="h-5 w-3/4 mx-auto mb-6" />
          <Skeleton className="h-10 w-full mb-2" />
          <Skeleton className="h-10 w-full" />
        </div>
      </div>
    </div>
  )
}
