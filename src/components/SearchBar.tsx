import { Search, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useExplorerStore } from "@/store/useExplorerStore";
import { useEffect, useState } from "react";

export function SearchBar() {
  const { searchQuery, setSearchQuery } = useExplorerStore();
  const [localQuery, setLocalQuery] = useState(searchQuery);

  // Debounce search query
  useEffect(() => {
    const timer = setTimeout(() => {
      setSearchQuery(localQuery);
    }, 400);

    return () => clearTimeout(timer);
  }, [localQuery, setSearchQuery]);

  const handleClear = () => {
    setLocalQuery("");
    setSearchQuery("");
  };

  return (
    <div className="relative w-full max-w-xl">
      <Search className="text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2" />
      <Input
        type="text"
        placeholder="Search Pokémon by name..."
        value={localQuery}
        onChange={(e) => setLocalQuery(e.target.value)}
        className="h-12 rounded-xl pr-10 pl-10"
      />
      {localQuery && (
        <Button
          variant="ghost"
          size="icon"
          onClick={handleClear}
          className="absolute top-1/2 right-1 h-8 w-8 -translate-y-1/2 rounded-full"
        >
          <X className="h-4 w-4" />
        </Button>
      )}
    </div>
  );
}
