import { useQuery } from "@tanstack/react-query";
import { fetchTypes } from "@/lib/api";
import { getTypeColor } from "@/lib/typeColors";
import { useExplorerStore } from "@/store/useExplorerStore";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";

export function TypeFilter() {
  const { selectedTypes, toggleType, clearTypes } = useExplorerStore();
  const { data: types, isLoading } = useQuery({
    queryKey: ["types"],
    queryFn: fetchTypes,
  });

  if (isLoading) {
    return (
      <div className="text-muted-foreground text-sm">Loading types...</div>
    );
  }

  const mainTypes =
    types?.filter((t) => !["unknown", "shadow"].includes(t.name)) || [];

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold">Type</h3>
        {selectedTypes.length > 0 && (
          <Button
            variant="ghost"
            size="sm"
            onClick={clearTypes}
            className="h-7 text-xs"
          >
            Clear
          </Button>
        )}
      </div>

      <div className="flex flex-wrap gap-2">
        {mainTypes.map((type) => {
          const isSelected = selectedTypes.includes(type.name);
          const colors = getTypeColor(type.name);

          return (
            <button
              key={type.name}
              onClick={() => toggleType(type.name)}
              className={`type-badge transition-all ${colors.bg} ${colors.text} ${
                isSelected
                  ? "ring-primary ring-offset-background ring-2 ring-offset-2"
                  : "opacity-60 hover:opacity-100"
              }`}
            >
              {type.name}
            </button>
          );
        })}
      </div>

      {selectedTypes.length > 0 && (
        <div className="border-border flex flex-wrap gap-2 border-t pt-2">
          <span className="text-muted-foreground text-xs">Selected:</span>
          {selectedTypes.map((type) => {
            const colors = getTypeColor(type);
            return (
              <span
                key={type}
                className={`type-badge ${colors.bg} ${colors.text} flex items-center gap-1`}
              >
                {type}
                <X
                  className="h-3 w-3 cursor-pointer"
                  onClick={() => toggleType(type)}
                />
              </span>
            );
          })}
        </div>
      )}
    </div>
  );
}
