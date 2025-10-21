import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useExplorerStore } from "@/store/useExplorerStore";
import { ArrowDownAZ, ArrowUpAZ } from "lucide-react";

const SORT_OPTIONS = [
  { value: "name-asc", label: "Name (A-Z)", icon: ArrowDownAZ },
  { value: "name-desc", label: "Name (Z-A)", icon: ArrowUpAZ },
  { value: "id-asc", label: "Number (Low to High)", icon: ArrowDownAZ },
  { value: "id-desc", label: "Number (High to Low)", icon: ArrowUpAZ },
  { value: "bst-desc", label: "BST (High to Low)", icon: ArrowDownAZ },
  { value: "bst-asc", label: "BST (Low to High)", icon: ArrowUpAZ },
  { value: "speed-desc", label: "Speed (High to Low)", icon: ArrowDownAZ },
  { value: "speed-asc", label: "Speed (Low to High)", icon: ArrowUpAZ },
] as const;

export function SortSelect() {
  const { sortBy, setSortBy } = useExplorerStore();

  return (
    <div className="space-y-3">
      <h3 className="text-sm font-semibold">Sort By</h3>
      <Select value={sortBy} onValueChange={(value: any) => setSortBy(value)}>
        <SelectTrigger className="w-full rounded-xl">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {SORT_OPTIONS.map((option) => (
            <SelectItem key={option.value} value={option.value}>
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
