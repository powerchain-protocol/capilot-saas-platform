import { Skeleton } from "@/components/ui/skeleton";

export function ChatSkeleton() {
  return <div className="space-y-4" aria-label="Loading conversation"><Skeleton className="ml-auto h-16 w-2/3 rounded-2xl" /><Skeleton className="h-28 w-4/5 rounded-2xl" /><Skeleton className="ml-auto h-14 w-1/2 rounded-2xl" /></div>;
}
