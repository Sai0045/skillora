import { Skeleton } from "@/components/common/skeleton";

export default function Loading() {
  return (
    <div className="space-y-6" aria-label="Loading Skillora">
      <Skeleton className="h-48 w-full" />
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Skeleton className="h-32" />
        <Skeleton className="h-32" />
        <Skeleton className="h-32" />
        <Skeleton className="h-32" />
      </div>
      <Skeleton className="h-64 w-full" />
    </div>
  );
}
