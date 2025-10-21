import { Skeleton } from "@/components/ui/skeleton";

export function SkeletonCard() {
  return (
    <div className="bg-card border-border rounded-2xl border p-4">
      <Skeleton className="mb-3 aspect-square w-full rounded-xl" />
      <Skeleton className="mb-2 h-6 w-3/4" />
      <div className="mb-3 flex gap-2">
        <Skeleton className="h-6 w-16 rounded-full" />
        <Skeleton className="h-6 w-16 rounded-full" />
      </div>
      <Skeleton className="h-4 w-full" />
    </div>
  );
}
