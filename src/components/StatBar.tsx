import { getStatColor } from "@/lib/typeColors";

interface StatBarProps {
  name: string;
  value: number;
  maxValue?: number;
}

export function StatBar({ name, value, maxValue = 255 }: StatBarProps) {
  const percentage = (value / maxValue) * 100;
  const color = getStatColor(name);

  const displayName = name
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between text-sm">
        <span className="font-medium capitalize">{displayName}</span>
        <span className="text-primary font-semibold">{value}</span>
      </div>
      <div className="stat-bar">
        <div
          className={`stat-bar-fill ${color}`}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}
