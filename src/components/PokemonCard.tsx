import { Pokemon, calculateBST } from "@/lib/api";
import { getTypeColor } from "@/lib/typeColors";
import { formatPokemonName } from "@/lib/formatName";
import { Link } from "react-router-dom";

interface PokemonCardProps {
  pokemon: Pokemon;
}

export function PokemonCard({ pokemon }: PokemonCardProps) {
  const bst = calculateBST(pokemon);
  const imageUrl = pokemon.sprites.other["official-artwork"].front_default;

  return (
    <Link to={`/pokemon/${pokemon.name}`} className="block">
      {/* Tambah varian softglass + group untuk hover anak */}
      <div className="pokemon-card pokemon-card--softglass group transition-all">
        {/* Frame gambar: sedikit kaca juga supaya menyatu */}
        <div className="relative mb-3 aspect-square overflow-hidden rounded-xl bg-white/40 backdrop-blur-md dark:bg-white/5">
          <img
            src={imageUrl}
            alt={pokemon.name}
            loading="lazy"
            className="h-full w-full object-contain p-4 transition-transform duration-300 group-hover:scale-105"
          />
          {/* ID */}
          <div className="bg-background/80 absolute top-2 right-2 rounded-full border border-sky-400/40 px-2 py-1 font-mono text-xs backdrop-blur-sm">
            #{pokemon.id.toString().padStart(3, "0")}
          </div>
        </div>

        {/* Nama */}
        <h3 className="mb-2 text-lg font-bold tracking-wide">
          {formatPokemonName(pokemon.name)}
        </h3>

        {/* Badge tipe: BIARKAN SESUAI TIPENYA */}
        <div className="mb-3 flex flex-wrap gap-1.5">
          {pokemon.types.map(({ type }) => {
            const colors = getTypeColor(type.name);
            return (
              <span
                key={type.name}
                className={`type-badge ${colors.bg} ${colors.text} shadow-sm`}
              >
                {type.name}
              </span>
            );
          })}
        </div>

        {/* BST */}
        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground">Base Stat Total</span>
          <span className="text-primary font-semibold">{bst}</span>
        </div>
      </div>
    </Link>
  );
}
