import { useQuery } from "@tanstack/react-query";
import { useParams, useNavigate } from "react-router-dom";
import { fetchPokemonDetails, calculateBST } from "@/lib/api";
import { getTypeColor } from "@/lib/typeColors";
import { calculateTypeEffectiveness } from "@/lib/typeEffectiveness";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { StatBar } from "@/components/StatBar";
import { EvolutionChain } from "@/components/EvolutionChain";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { formatPokemonName } from "@/lib/formatName";
import {
  ArrowLeft,
  ChevronLeft,
  ChevronRight,
  Ruler,
  Weight,
  Shield,
  Swords,
} from "lucide-react";
import { useState } from "react";

export default function PokemonDetail() {
  const { name } = useParams<{ name: string }>();
  const navigate = useNavigate();
  const [showAllMoves, setShowAllMoves] = useState(false);

  const {
    data: pokemon,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["pokemon", name],
    queryFn: () => fetchPokemonDetails(name!),
    enabled: !!name,
  });

  if (error) {
    return (
      <div className="bg-background min-h-screen">
        <Header />
        <div className="container px-4 py-16 text-center">
          <h2 className="mb-4 text-2xl font-bold">Pokémon not found</h2>
          <Button onClick={() => navigate("/")} className="rounded-xl">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Explorer
          </Button>
        </div>
      </div>
    );
  }

  if (isLoading || !pokemon) {
    return (
      <div className="bg-background min-h-screen">
        <Header />
        <div className="container max-w-4xl px-4 py-8">
          <Skeleton className="mb-8 h-10 w-32" />
          <div className="grid gap-8 md:grid-cols-2">
            <Skeleton className="aspect-square rounded-2xl" />
            <div className="space-y-4">
              <Skeleton className="h-12 w-3/4" />
              <Skeleton className="h-6 w-full" />
              <Skeleton className="h-40 w-full" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  const bst = calculateBST(pokemon);
  const imageUrl = pokemon.sprites.other["official-artwork"].front_default;

  // Calculate type effectiveness
  const pokemonTypes = pokemon.types.map((t) => t.type.name);
  const typeEffectiveness = calculateTypeEffectiveness(pokemonTypes);

  // Get level-up moves (limited)
  const levelUpMoves = pokemon.moves
    .filter((m) =>
      m.version_group_details.some(
        (v) => v.move_learn_method.name === "level-up",
      ),
    )
    .slice(0, showAllMoves ? undefined : 10);

  const handlePrevious = () => {
    if (pokemon.id > 1) {
      navigate(`/pokemon/${pokemon.id - 1}`);
    }
  };

  const handleNext = () => {
    navigate(`/pokemon/${pokemon.id + 1}`);
  };

  return (
    <div className="bg-background min-h-screen">
      <Header />

      <main className="container mx-auto max-w-6xl px-4 py-8">
        {/* Navigation */}
        <div className="mb-8 flex items-center justify-between">
          <Button
            variant="ghost"
            onClick={() => navigate("/")}
            className="rounded-xl"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back
          </Button>

          <div className="flex gap-2">
            <Button
              variant="outline"
              size="icon"
              onClick={handlePrevious}
              disabled={pokemon.id === 1}
              className="rounded-xl"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={handleNext}
              className="rounded-xl"
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Hero Section */}
        <div className="mb-12 grid gap-8 md:grid-cols-2">
          {/* Image */}
          <div className="pokemon-card--softglass bg-card border-border flex items-center justify-center rounded-2xl border p-8">
            <div className="relative">
              <img
                src={imageUrl}
                alt={pokemon.name}
                className="w-full max-w-md"
              />
              <div className="bg-primary text-primary-foreground absolute -top-4 -right-4 flex h-16 w-16 items-center justify-center rounded-full text-lg font-bold">
                #{pokemon.id}
              </div>
            </div>
          </div>

          {/* Info */}
          <div className="space-y-6">
            <div>
              <h1 className="mb-4 text-4xl font-bold">
                {formatPokemonName(pokemon.name)}
              </h1>
              <div className="flex flex-wrap gap-2">
                {pokemon.types.map(({ type }) => {
                  const colors = getTypeColor(type.name);
                  return (
                    <span
                      key={type.name}
                      className={`type-badge text-sm ${colors.bg} ${colors.text}`}
                    >
                      {type.name}
                    </span>
                  );
                })}
              </div>
            </div>

            {/* Physical Stats */}
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-muted rounded-xl p-4">
                <div className="text-muted-foreground mb-2 flex items-center gap-2">
                  <Ruler className="h-4 w-4" />
                  <span className="text-sm">Height</span>
                </div>
                <p className="text-2xl font-bold">
                  {(pokemon.height / 10).toFixed(1)} m
                </p>
              </div>
              <div className="bg-muted rounded-xl p-4">
                <div className="text-muted-foreground mb-2 flex items-center gap-2">
                  <Weight className="h-4 w-4" />
                  <span className="text-sm">Weight</span>
                </div>
                <p className="text-2xl font-bold">
                  {(pokemon.weight / 10).toFixed(1)} kg
                </p>
              </div>
            </div>

            {/* Abilities */}
            <div>
              <h3 className="mb-3 font-semibold">Abilities</h3>
              <div className="flex flex-wrap gap-2">
                {pokemon.abilities.map(({ ability, is_hidden }) => (
                  <span
                    key={ability.name}
                    className="bg-secondary text-secondary-foreground rounded-xl px-4 py-2 text-sm font-medium capitalize"
                  >
                    {ability.name.replace("-", " ")}
                    {is_hidden && " (Hidden)"}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Stats Section */}
        <div className="bg-card border-border mb-8 rounded-2xl border p-8">
          <div className="mb-6 flex items-center justify-between">
            <h2 className="text-2xl font-bold">Base Stats</h2>
            <div className="text-sm">
              <span className="text-muted-foreground">Total: </span>
              <span className="text-primary text-2xl font-bold">{bst}</span>
            </div>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            {pokemon.stats.map((stat) => (
              <StatBar
                key={stat.stat.name}
                name={stat.stat.name}
                value={stat.base_stat}
              />
            ))}
          </div>
        </div>

        {/* Type Effectiveness Section */}
        <div className="bg-card border-border mb-8 rounded-2xl border p-8">
          <h2 className="mb-6 text-2xl font-bold">Type Effectiveness</h2>

          <div className="space-y-6">
            {/* Weaknesses */}
            {typeEffectiveness.weaknesses.length > 0 && (
              <div>
                <div className="mb-3 flex items-center gap-2">
                  <Swords className="text-destructive h-5 w-5" />
                  <h3 className="text-lg font-semibold">Weak Against</h3>
                </div>
                <div className="flex flex-wrap gap-2">
                  {typeEffectiveness.weaknesses.map(({ type, multiplier }) => {
                    const colors = getTypeColor(type);
                    return (
                      <div key={type} className="relative">
                        <span
                          className={`type-badge ${colors.bg} ${colors.text}`}
                        >
                          {type}
                        </span>
                        <span className="bg-destructive text-destructive-foreground absolute -top-2 -right-2 rounded-full px-1.5 py-0.5 text-xs font-bold">
                          {multiplier}×
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Resistances */}
            {typeEffectiveness.resistances.length > 0 && (
              <div>
                <div className="mb-3 flex items-center gap-2">
                  <Shield className="h-5 w-5 text-green-500" />
                  <h3 className="text-lg font-semibold">Resistant To</h3>
                </div>
                <div className="flex flex-wrap gap-2">
                  {typeEffectiveness.resistances.map(({ type, multiplier }) => {
                    const colors = getTypeColor(type);
                    return (
                      <div key={type} className="relative">
                        <span
                          className={`type-badge ${colors.bg} ${colors.text}`}
                        >
                          {type}
                        </span>
                        <span className="absolute -top-2 -right-2 rounded-full bg-green-500 px-1.5 py-0.5 text-xs font-bold text-white">
                          {multiplier}×
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Immunities */}
            {typeEffectiveness.immunities.length > 0 && (
              <div>
                <div className="mb-3 flex items-center gap-2">
                  <Shield className="h-5 w-5 text-blue-500" />
                  <h3 className="text-lg font-semibold">Immune To</h3>
                </div>
                <div className="flex flex-wrap gap-2">
                  {typeEffectiveness.immunities.map(({ type }) => {
                    const colors = getTypeColor(type);
                    return (
                      <div key={type} className="relative">
                        <span
                          className={`type-badge ${colors.bg} ${colors.text} opacity-60`}
                        >
                          {type}
                        </span>
                        <span className="absolute -top-2 -right-2 rounded-full bg-blue-500 px-1.5 py-0.5 text-xs font-bold text-white">
                          0×
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Evolution Chain */}
        <div className="mb-8">
          <EvolutionChain pokemonId={pokemon.id} />
        </div>

        {/* Moves Section */}
        <div className="bg-card border-border rounded-2xl border p-8">
          <h2 className="mb-6 text-2xl font-bold">Moves</h2>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
            {levelUpMoves.map((move) => (
              <div
                key={move.move.name}
                className="bg-muted rounded-lg px-3 py-2 text-sm capitalize"
              >
                {move.move.name.replace("-", " ")}
              </div>
            ))}
          </div>

          {!showAllMoves && pokemon.moves.length > 10 && (
            <Button
              variant="outline"
              onClick={() => setShowAllMoves(true)}
              className="mt-6 w-full rounded-xl"
            >
              Show All Moves ({pokemon.moves.length})
            </Button>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}
