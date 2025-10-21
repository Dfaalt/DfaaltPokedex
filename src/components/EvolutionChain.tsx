import { useQuery } from "@tanstack/react-query";
import {
  fetchEvolutionChain,
  fetchPokemonDetails,
  extractIdFromUrl,
  EvolutionChain as EvolutionChainType,
  getSpecialForms,
} from "@/lib/api";
import { useNavigate } from "react-router-dom";
import { Skeleton } from "@/components/ui/skeleton";
import { formatPokemonName } from "@/lib/formatName";
import { ArrowRight, ArrowDown } from "lucide-react";

interface EvolutionChainProps {
  pokemonId: number;
}

interface EvolutionStage {
  name: string;
  id: number;
  imageUrl: string;
  minLevel?: number;
  trigger?: string;
  item?: string;
}

export function EvolutionChain({ pokemonId }: EvolutionChainProps) {
  const navigate = useNavigate();

  const { data: evolutionChain, isLoading } = useQuery({
    queryKey: ["evolution-chain", pokemonId],
    queryFn: () => fetchEvolutionChain(pokemonId),
    staleTime: 1000 * 60 * 60,
  });

  // Fetch special form details
  const { data: specialFormsData } = useQuery({
    queryKey: ["special-forms", pokemonId],
    queryFn: async () => {
      if (!evolutionChain) return [];

      // Find the final evolution in the chain
      let finalEvolutionName = evolutionChain.species.name;
      let current = evolutionChain;
      while (current.evolves_to.length > 0) {
        current = current.evolves_to[0];
        finalEvolutionName = current.species.name;
      }

      const specialForms = getSpecialForms();
      const megaForms = specialForms.filter((form) =>
        form.startsWith(finalEvolutionName + "-mega"),
      );
      const gmaxForms = specialForms.filter((form) =>
        form.startsWith(finalEvolutionName + "-gmax"),
      );

      const allSpecialForms = [...megaForms, ...gmaxForms];
      const formDetails = await Promise.all(
        allSpecialForms.map(
          async (formName): Promise<EvolutionStage | null> => {
            try {
              const details = await fetchPokemonDetails(formName);
              return {
                name: formName,
                id: details.id,
                imageUrl:
                  details.sprites.other["official-artwork"].front_default,
                trigger: formName.includes("-mega")
                  ? "mega-evolution"
                  : "gigantamax",
              };
            } catch {
              return null;
            }
          },
        ),
      );

      return formDetails.filter(
        (f): f is EvolutionStage => f !== null && !!f.imageUrl,
      );
    },
    enabled: !!evolutionChain,
    staleTime: 1000 * 60 * 60,
  });

  // Flatten evolution chain to array and add special forms
  const flattenEvolutionChain = (
    chain: EvolutionChainType | null,
    specialForms: EvolutionStage[] = [],
  ): EvolutionStage[] => {
    if (!chain) return [];

    const stages: EvolutionStage[] = [];

    const traverse = (current: EvolutionChainType) => {
      const id = extractIdFromUrl(current.species.url);
      stages.push({
        name: current.species.name,
        id,
        imageUrl: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${id}.png`,
        minLevel: current.evolution_details[0]?.min_level,
        trigger: current.evolution_details[0]?.trigger.name,
        item: current.evolution_details[0]?.item?.name,
      });

      current.evolves_to.forEach((evolution) => traverse(evolution));
    };

    traverse(chain);

    // Add fetched special forms
    if (specialForms.length > 0) {
      stages.push(...specialForms);
    }

    return stages;
  };

  const evolutionStages = flattenEvolutionChain(
    evolutionChain,
    specialFormsData,
  );

  if (isLoading) {
    return (
      <div className="bg-card border-border rounded-2xl border p-8">
        <h2 className="mb-6 text-2xl font-bold">Evolution Chain</h2>
        <div className="flex items-center justify-center gap-4">
          <Skeleton className="h-32 w-32 rounded-xl" />
          <ArrowRight className="text-muted-foreground h-6 w-6" />
          <Skeleton className="h-32 w-32 rounded-xl" />
        </div>
      </div>
    );
  }

  if (!evolutionChain || evolutionStages.length <= 1) {
    return null;
  }

  return (
    <div className="bg-card border-border rounded-2xl border p-8">
      <h2 className="mb-6 text-2xl font-bold">Evolution Chain</h2>

      <div className="flex flex-col flex-wrap items-center justify-center gap-6 sm:flex-row">
        {evolutionStages.map((stage, index) => (
          <div
            key={stage.id}
            className="flex flex-col items-center gap-6 sm:flex-row"
          >
            <button
              onClick={() => navigate(`/pokemon/${stage.name}`)}
              className={`group hover:bg-accent relative flex flex-col items-center gap-2 rounded-xl p-4 transition-all ${
                stage.id === pokemonId
                  ? "bg-primary/10 ring-primary ring-2"
                  : ""
              }`}
            >
              <div className="relative h-24 w-24 sm:h-32 sm:w-32">
                <img
                  src={stage.imageUrl}
                  alt={stage.name}
                  className="h-full w-full object-contain transition-transform group-hover:scale-110"
                />
              </div>

              <div className="text-center">
                <p className="text-sm font-semibold sm:text-base">
                  {formatPokemonName(stage.name)}
                </p>
                <p className="text-muted-foreground text-xs">#{stage.id}</p>
              </div>

              {stage.id === pokemonId && (
                <div className="bg-primary text-primary-foreground absolute -top-2 -right-2 rounded-full px-2 py-1 text-xs font-medium">
                  Current
                </div>
              )}
            </button>

            {index < evolutionStages.length - 1 && (
              <div className="flex flex-col items-center">
                {/* Arrow changes direction based on screen size */}
                <ArrowDown className="text-muted-foreground h-6 w-6 sm:hidden" />
                <ArrowRight className="text-muted-foreground hidden h-6 w-6 sm:block" />
                {evolutionStages[index + 1].trigger === "mega-evolution" && (
                  <span className="text-muted-foreground mt-1 text-xs">
                    Mega Evolution
                  </span>
                )}
                {evolutionStages[index + 1].trigger === "gigantamax" && (
                  <span className="text-muted-foreground mt-1 text-xs">
                    Gigantamax
                  </span>
                )}
                {evolutionStages[index + 1].minLevel && (
                  <span className="text-muted-foreground mt-1 text-xs">
                    Lv. {evolutionStages[index + 1].minLevel}
                  </span>
                )}
                {evolutionStages[index + 1].item && (
                  <span className="text-muted-foreground mt-1 text-xs capitalize">
                    {evolutionStages[index + 1].item.replace("-", " ")}
                  </span>
                )}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
