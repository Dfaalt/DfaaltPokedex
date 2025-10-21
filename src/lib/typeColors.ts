// Type color mappings for badges
export const TYPE_COLORS: Record<string, { bg: string; text: string }> = {
  normal: { bg: "bg-gray-400", text: "text-gray-900" },
  fire: { bg: "bg-orange-500", text: "text-white" },
  water: { bg: "bg-blue-500", text: "text-white" },
  electric: { bg: "bg-yellow-400", text: "text-gray-900" },
  grass: { bg: "bg-green-500", text: "text-white" },
  ice: { bg: "bg-cyan-400", text: "text-gray-900" },
  fighting: { bg: "bg-red-600", text: "text-white" },
  poison: { bg: "bg-purple-500", text: "text-white" },
  ground: { bg: "bg-amber-600", text: "text-white" },
  flying: { bg: "bg-indigo-400", text: "text-white" },
  psychic: { bg: "bg-pink-500", text: "text-white" },
  bug: { bg: "bg-lime-500", text: "text-gray-900" },
  rock: { bg: "bg-yellow-700", text: "text-white" },
  ghost: { bg: "bg-purple-700", text: "text-white" },
  dragon: { bg: "bg-indigo-600", text: "text-white" },
  dark: { bg: "bg-gray-800", text: "text-white" },
  steel: { bg: "bg-gray-500", text: "text-white" },
  fairy: { bg: "bg-pink-400", text: "text-gray-900" },
};

export function getTypeColor(type: string): { bg: string; text: string } {
  return TYPE_COLORS[type.toLowerCase()] || TYPE_COLORS.normal;
}

// Stat colors for visualization
export const STAT_COLORS: Record<string, string> = {
  hp: "bg-red-500",
  attack: "bg-orange-500",
  defense: "bg-yellow-500",
  "special-attack": "bg-blue-500",
  "special-defense": "bg-green-500",
  speed: "bg-pink-500",
};

export function getStatColor(statName: string): string {
  return STAT_COLORS[statName] || "bg-gray-500";
}
