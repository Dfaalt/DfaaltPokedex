import { useQuery } from "@tanstack/react-query";
import { useEffect, useState, useMemo } from "react";
import {
  fetchPokemonList,
  fetchPokemonBatch,
  calculateBST,
  getStat,
  Pokemon,
  getSpecialForms,
} from "@/lib/api";
import { useExplorerStore } from "@/store/useExplorerStore";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { SearchBar } from "@/components/SearchBar";
import { TypeFilter } from "@/components/TypeFilter";
import { GenerationFilter } from "@/components/GenerationFilter";
import { SortSelect } from "@/components/SortSelect";
import { PokemonCard } from "@/components/PokemonCard";
import { SkeletonCard } from "@/components/SkeletonCard";
import { EmptyState } from "@/components/EmptyState";
import { Button } from "@/components/ui/button";
import { groupPokemonWithVariants } from "@/lib/groupVariants";
import { ChevronLeft, ChevronRight } from "lucide-react";

export default function Explorer() {
  const {
    searchQuery,
    selectedTypes,
    selectedGeneration,
    minBST,
    maxBST,
    sortBy,
    currentPage,
    itemsPerPage,
    setCurrentPage,
  } = useExplorerStore();

  const [allPokemon, setAllPokemon] = useState<Pokemon[]>([]);

  // Fetch initial list of Pokémon
  const { data: listData, isLoading: isLoadingList } = useQuery({
    queryKey: ["pokemon-list"],
    queryFn: () => fetchPokemonList(1025, 0), // All Pokémon up to Gen 9
    staleTime: 1000 * 60 * 60, // 1 hour
  });

  // Fetch details for all Pokémon including special forms
  const { data: pokemonData, isLoading: isLoadingDetails } = useQuery({
    queryKey: ["pokemon-details", listData?.results.length],
    queryFn: async () => {
      if (!listData) return [];
      const regularPokemon = listData.results.map((p) => p.name);
      const specialForms = getSpecialForms();
      const allNames = [...regularPokemon, ...specialForms];
      return fetchPokemonBatch(allNames, 10);
    },
    enabled: !!listData,
    staleTime: 1000 * 60 * 60,
  });

  useEffect(() => {
    if (pokemonData) {
      setAllPokemon(groupPokemonWithVariants(pokemonData));
    }
  }, [pokemonData]);

  // Helper function to get base Pokemon name (removes variant suffixes)
  const getBaseName = (name: string): string => {
    // Remove mega, gmax, regional form suffixes
    return name
      .replace(/-mega(-[xy])?$/i, "")
      .replace(/-gmax$/i, "")
      .replace(/-(alola|galar|hisui|paldea)$/i, "");
  };

  // Helper function to determine variant order priority
  const getVariantPriority = (name: string): number => {
    if (name.includes("-gmax")) return 3; // Gigantamax last
    if (name.includes("-mega")) return 2; // Mega Evolution second
    if (name.match(/-(alola|galar|hisui|paldea)$/)) return 1; // Regional forms
    return 0; // Base form first
  };

  // Generation ID ranges
  const getGenerationRange = (gen: number | null): [number, number] | null => {
    if (!gen) return null;
    const ranges: Record<number, [number, number]> = {
      1: [1, 151],
      2: [152, 251],
      3: [252, 386],
      4: [387, 493],
      5: [494, 649],
      6: [650, 721],
      7: [722, 809],
      8: [810, 905],
      9: [906, 1025],
    };
    return ranges[gen] || null;
  };

  // Filter and sort Pokémon
  const filteredAndSortedPokemon = useMemo(() => {
    let filtered = [...allPokemon];

    // Search filter
    if (searchQuery) {
      filtered = filtered.filter((p) =>
        p.name.toLowerCase().includes(searchQuery.toLowerCase()),
      );
    }

    // Generation filter
    const genRange = getGenerationRange(selectedGeneration);
    if (genRange) {
      const [minId, maxId] = genRange;
      filtered = filtered.filter((p) => p.id >= minId && p.id <= maxId);
    }

    // Type filter (AND logic)
    if (selectedTypes.length > 0) {
      filtered = filtered.filter((p) =>
        selectedTypes.every((selectedType) =>
          p.types.some((t) => t.type.name === selectedType),
        ),
      );
    }

    // BST filter
    filtered = filtered.filter((p) => {
      const bst = calculateBST(p);
      return bst >= minBST && bst <= maxBST;
    });

    // Sort - Group variants with their base Pokemon
    filtered.sort((a, b) => {
      const baseNameA = getBaseName(a.name);
      const baseNameB = getBaseName(b.name);

      // Find the base Pokemon ID for proper grouping
      const baseIdA = allPokemon.find((p) => p.name === baseNameA)?.id || a.id;
      const baseIdB = allPokemon.find((p) => p.name === baseNameB)?.id || b.id;

      switch (sortBy) {
        case "name-asc":
        case "name-desc": {
          const nameCompare =
            sortBy === "name-asc"
              ? baseNameA.localeCompare(baseNameB)
              : baseNameB.localeCompare(baseNameA);

          if (nameCompare !== 0) return nameCompare;
          // Same base name, sort by variant priority
          return getVariantPriority(a.name) - getVariantPriority(b.name);
        }

        case "id-asc":
        case "id-desc": {
          const idCompare =
            sortBy === "id-asc" ? baseIdA - baseIdB : baseIdB - baseIdA;

          if (idCompare !== 0) return idCompare;
          // Same base ID, sort by variant priority
          return getVariantPriority(a.name) - getVariantPriority(b.name);
        }

        case "bst-asc":
        case "bst-desc": {
          const bstCompare =
            sortBy === "bst-asc"
              ? calculateBST(a) - calculateBST(b)
              : calculateBST(b) - calculateBST(a);

          if (Math.abs(bstCompare) > 0) return bstCompare;
          // Same BST, group by base ID
          const idCompare = baseIdA - baseIdB;
          if (idCompare !== 0) return idCompare;
          return getVariantPriority(a.name) - getVariantPriority(b.name);
        }

        case "speed-asc":
        case "speed-desc": {
          const speedCompare =
            sortBy === "speed-asc"
              ? getStat(a, "speed") - getStat(b, "speed")
              : getStat(b, "speed") - getStat(a, "speed");

          if (speedCompare !== 0) return speedCompare;
          // Same speed, group by base ID
          const idCompare = baseIdA - baseIdB;
          if (idCompare !== 0) return idCompare;
          return getVariantPriority(a.name) - getVariantPriority(b.name);
        }

        default:
          return 0;
      }
    });

    return filtered;
  }, [
    allPokemon,
    searchQuery,
    selectedTypes,
    selectedGeneration,
    minBST,
    maxBST,
    sortBy,
  ]);

  // Pagination
  const totalPages = Math.ceil(filteredAndSortedPokemon.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentPokemon = filteredAndSortedPokemon.slice(startIndex, endIndex);

  const isLoading = isLoadingList || isLoadingDetails;

  return (
    <div className="bg-background min-h-screen">
      <Header />
      <main className="container mx-auto max-w-7xl px-4 py-8">
        {/* Search Bar - Desktop Only */}
        <div className="mb-6 justify-center lg:flex">
          <div className="w-full max-w-2xl">
            <SearchBar />
          </div>
        </div>

        {/* Filters Below Search - Desktop Only */}
        <div className="mb-8 hidden justify-center lg:flex">
          <div className="w-full max-w-5xl">
            <div className="bg-card border-border rounded-2xl border p-6">
              <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
                <TypeFilter />
                <GenerationFilter />
                <SortSelect />
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="mx-auto w-full">
          {/* Results count */}
          <div className="text-muted-foreground mb-6 text-sm">
            {isLoading
              ? "Loading..."
              : `Showing ${currentPokemon.length} of ${filteredAndSortedPokemon.length} Pokémon`}
          </div>

          {/* Grid */}
          {isLoading ? (
            <div className="grid grid-cols-2 gap-4 sm:gap-6 lg:grid-cols-3 xl:grid-cols-4">
              {Array.from({ length: 8 }).map((_, i) => (
                <SkeletonCard key={i} />
              ))}
            </div>
          ) : currentPokemon.length === 0 ? (
            <EmptyState />
          ) : (
            <>
              <div className="grid grid-cols-2 gap-4 sm:gap-6 lg:grid-cols-3 xl:grid-cols-4">
                {currentPokemon.map((pokemon) => (
                  <PokemonCard key={pokemon.id} pokemon={pokemon} />
                ))}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="mt-12 flex items-center justify-center gap-2">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => setCurrentPage(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="rounded-xl"
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </Button>

                  <div className="flex items-center gap-1">
                    {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                      let pageNum;
                      if (totalPages <= 5) {
                        pageNum = i + 1;
                      } else if (currentPage <= 3) {
                        pageNum = i + 1;
                      } else if (currentPage >= totalPages - 2) {
                        pageNum = totalPages - 4 + i;
                      } else {
                        pageNum = currentPage - 2 + i;
                      }

                      return (
                        <Button
                          key={pageNum}
                          variant={
                            currentPage === pageNum ? "default" : "outline"
                          }
                          size="icon"
                          onClick={() => setCurrentPage(pageNum)}
                          className="h-10 w-10 rounded-xl"
                        >
                          {pageNum}
                        </Button>
                      );
                    })}
                  </div>

                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => setCurrentPage(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className="rounded-xl"
                  >
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              )}
            </>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}
