// Ubah "charizard-mega-x" -> "Mega Charizard X", "walking-wake" -> "Walking Wake"
export function formatPokemonName(raw: string): string {
  if (!raw) return "";

  const name = raw.toLowerCase();

  // Mega
  if (name.includes("mega-x")) return `Mega ${cap(first(name))} X`;
  if (name.includes("mega-y")) return `Mega ${cap(first(name))} Y`;
  if (name.includes("mega")) return `Mega ${cap(first(name))}`;

  // Gigantamax
  if (name.includes("gmax") || name.includes("gigantamax"))
    return `${cap(first(name))} Gmax`;

  // Regional
  if (name.includes("alola")) return `Alolan ${cap(first(name))}`;
  if (name.includes("galar")) return `Galarian ${cap(first(name))}`;
  if (name.includes("hisui")) return `Hisuian ${cap(first(name))}`;
  if (name.includes("paldea")) return `Paldean ${cap(first(name))}`;

  // Default: ganti "-" jadi spasi + Capitalize Tiap Kata
  return name.split("-").map(cap).join(" ");
}

function first(name: string) {
  // Ambil bagian sebelum sufiks (-mega, -gmax, -alola, -galar, dst)
  return name.split("-")[0];
}
function cap(s: string) {
  return s ? s[0].toUpperCase() + s.slice(1) : s;
}
