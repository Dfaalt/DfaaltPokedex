// Ubah "charizard-mega-x" -> "Mega Charizard X", "walking-wake" -> "Walking Wake"
export function formatPokemonName(raw: string): string {
  if (!raw) return "";

  const name = raw.toLowerCase();

  // --- Mega forms ---
  // Pastikan hanya form yang benar-benar punya "-mega"
  if (name.endsWith("-mega-x")) return `Mega ${cap(first(name))} X`;
  if (name.endsWith("-mega-y")) return `Mega ${cap(first(name))} Y`;
  if (name.endsWith("-mega")) return `Mega ${cap(first(name))}`;

  // --- Gigantamax ---
  if (name.includes("gmax") || name.includes("gigantamax"))
    return `${cap(first(name))} Gmax`;

  // --- Regional forms ---
  if (name.endsWith("-alola") || name.endsWith("-alolan"))
    return `Alolan ${cap(first(name))}`;
  if (name.endsWith("-galar") || name.endsWith("-galarian"))
    return `Galarian ${cap(first(name))}`;
  if (name.endsWith("-hisui") || name.endsWith("-hisuian"))
    return `Hisuian ${cap(first(name))}`;
  if (name.endsWith("-paldea") || name.endsWith("-paldean"))
    return `Paldean ${cap(first(name))}`;

  // --- Default: ganti "-" jadi spasi + Capitalize tiap kata ---
  return name.split("-").map(cap).join(" ");
}

function first(name: string) {
  // Ambil bagian sebelum sufiks form
  return name.split("-")[0];
}

function cap(s: string) {
  return s ? s[0].toUpperCase() + s.slice(1) : s;
}
