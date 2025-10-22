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
      {/* Softglass variant + responsive layout */}
      <div className="pokemon-card pokemon-card--softglass group flex h-full flex-col rounded-2xl border border-sky-500/40 p-3 transition-all sm:p-4">
        {/* Gambar */}
        <div className="bg-muted/60 relative flex aspect-square items-center justify-center overflow-hidden rounded-xl">
          <img
            src={imageUrl}
            alt={pokemon.name}
            loading="lazy"
            className="max-h-[80%] max-w-[80%] object-contain transition-transform duration-300 group-hover:scale-105"
          />
          <div className="bg-background/80 absolute top-2 right-2 rounded-full border border-sky-400/40 px-2 py-0.5 font-mono text-[10px] backdrop-blur-sm sm:text-xs">
            #{pokemon.id.toString().padStart(3, "0")}
          </div>
        </div>

        {/* Nama */}
        <h3 className="mt-3 line-clamp-2 min-h-[2.5rem] text-base leading-tight font-bold tracking-wide sm:min-h-[3rem] sm:text-lg">
          {formatPokemonName(pokemon.name)}
        </h3>

        {/* Type badges */}
        <div className="mt-2 flex flex-wrap justify-center gap-1 sm:gap-1.5">
          {pokemon.types.map(({ type }) => {
            const colors = getTypeColor(type.name);
            return (
              <span
                key={type.name}
                className={`type-badge ${colors.bg} ${colors.text}`}
              >
                {type.name}
              </span>
            );
          })}
        </div>

        {/* Base Stat — dorong ke bawah */}
        <div className="text-muted-foreground mt-auto flex items-center justify-between pt-3 sm:pt-4">
          <span className="text-xs sm:text-sm">Base Stat Total</span>
          <span className="text-primary text-xs font-bold sm:text-sm">
            {bst}
          </span>
        </div>
      </div>
    </Link>
  );
}
