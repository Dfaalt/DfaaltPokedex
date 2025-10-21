import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useExplorerStore } from "@/store/useExplorerStore";

const GENERATIONS = [
  { value: 1, label: "Generation I (Kanto)" },
  { value: 2, label: "Generation II (Johto)" },
  { value: 3, label: "Generation III (Hoenn)" },
  { value: 4, label: "Generation IV (Sinnoh)" },
  { value: 5, label: "Generation V (Unova)" },
  { value: 6, label: "Generation VI (Kalos)" },
  { value: 7, label: "Generation VII (Alola)" },
  { value: 8, label: "Generation VIII (Galar)" },
  { value: 9, label: "Generation IX (Paldea)" },
];

export function GenerationFilter() {
  const { selectedGeneration, setGeneration } = useExplorerStore();

  return (
    <div className="space-y-3">
      <h3 className="text-sm font-semibold">Generation</h3>
      <Select
        value={selectedGeneration?.toString() || "all"}
        onValueChange={(value) =>
          setGeneration(value === "all" ? null : parseInt(value))
        }
      >
        <SelectTrigger className="w-full rounded-xl">
          <SelectValue placeholder="All Generations" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Generations</SelectItem>
          {GENERATIONS.map((gen) => (
            <SelectItem key={gen.value} value={gen.value.toString()}>
              {gen.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
