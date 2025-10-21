import type { Pokemon } from "@/lib/api";

const SUFFIXES = [
  "-mega-x",
  "-mega-y",
  "-mega",
  "-gmax",
  "-gigantamax",
  "-alola",
  "-galar",
  "-hisui",
  "-paldea",
];

function baseOf(name: string) {
  for (const suf of SUFFIXES) {
    if (name.endsWith(suf)) return name.slice(0, -suf.length);
  }
  // Ada juga pola seperti "darmanitan-galar-standard" -> base "darmanitan"
  return name.split("-")[0];
}

function variantRank(name: string): number {
  const n = name.toLowerCase();
  if (n.includes("mega-x")) return 1;
  if (n.includes("mega-y")) return 1;
  if (n.includes("mega")) return 1;
  if (n.includes("gmax") || n.includes("gigantamax")) return 2;
  if (n.includes("alola")) return 3;
  if (n.includes("galar")) return 3;
  if (n.includes("hisui")) return 3;
  if (n.includes("paldea")) return 3;
  return 0; // default
}

export function groupPokemonWithVariants(list: Pokemon[]): Pokemon[] {
  // Kelompokkan berdasarkan baseName
  const buckets = new Map<string, Pokemon[]>();
  for (const p of list) {
    const b = baseOf(p.name.toLowerCase());
    if (!buckets.has(b)) buckets.set(b, []);
    buckets.get(b)!.push(p);
  }

  // Urutkan dalam setiap bucket: default → mega → gmax → regional → lainnya
  const ordered: Pokemon[] = [];
  // Urutan bucket global berdasarkan id terkecil (biasanya base form)
  const bucketKeys = Array.from(buckets.keys()).sort((a, b) => {
    const aMin = Math.min(...buckets.get(a)!.map((x) => x.id));
    const bMin = Math.min(...buckets.get(b)!.map((x) => x.id));
    return aMin - bMin;
  });

  for (const key of bucketKeys) {
    const items = buckets.get(key)!;
    // Pisahkan default (id < 10000 kemungkinan besar base) vs varian
    const defaults = items.filter(
      (x) => !SUFFIXES.some((s) => x.name.endsWith(s)),
    );
    const variants = items.filter((x) => !defaults.includes(x));

    // Sort default by id asc (biasanya 1 item)
    defaults.sort((a, b) => a.id - b.id);
    // Sort variants by rank lalu id
    variants.sort((a, b) => {
      const r = variantRank(a.name) - variantRank(b.name);
      return r !== 0 ? r : a.id - b.id;
    });

    ordered.push(...defaults, ...variants);
  }
  return ordered;
}
