import { Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useExplorerStore } from "@/store/useExplorerStore";

interface EmptyStateProps {
  message?: string;
}

export function EmptyState({ message = "No Pokémon found" }: EmptyStateProps) {
  const { resetFilters } = useExplorerStore();

  return (
    <div className="flex flex-col items-center justify-center px-4 py-16">
      <div className="bg-muted mb-4 flex h-20 w-20 items-center justify-center rounded-full">
        <Search className="text-muted-foreground h-10 w-10" />
      </div>
      <h3 className="mb-2 text-xl font-semibold">{message}</h3>
      <p className="text-muted-foreground mb-6 max-w-md text-center">
        Try adjusting your filters or search query to find what you're looking
        for.
      </p>
      <Button onClick={resetFilters} variant="outline" className="rounded-xl">
        Reset Filters
      </Button>
    </div>
  );
}
