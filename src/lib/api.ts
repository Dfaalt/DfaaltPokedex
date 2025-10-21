const BASE_URL = "https://pokeapi.co/api/v2";

export interface Pokemon {
  id: number;
  name: string;
  types: Array<{ type: { name: string } }>;
  sprites: {
    other: {
      "official-artwork": {
        front_default: string;
      };
    };
  };
  stats: Array<{
    base_stat: number;
    stat: { name: string };
  }>;
  abilities: Array<{
    ability: { name: string };
    is_hidden: boolean;
  }>;
  height: number;
  weight: number;
  moves: Array<{
    move: { name: string };
    version_group_details: Array<{
      level_learned_at: number;
      move_learn_method: { name: string };
    }>;
  }>;
  species: {
    url: string;
  };
}

export interface EvolutionChain {
  species: {
    name: string;
    url: string;
  };
  evolves_to: EvolutionChain[];
  evolution_details: Array<{
    min_level?: number;
    trigger: { name: string };
    item?: { name: string };
  }>;
}

export interface EvolutionData {
  chain: EvolutionChain;
}

export interface SpeciesData {
  evolution_chain: {
    url: string;
  };
}

export interface PokemonListItem {
  name: string;
  url: string;
}

export interface PokemonListResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: PokemonListItem[];
}

export interface Type {
  name: string;
  pokemon: Array<{ pokemon: { name: string; url: string } }>;
}

// Fetch list of Pokémon
export async function fetchPokemonList(
  limit = 20,
  offset = 0,
): Promise<PokemonListResponse> {
  const response = await fetch(
    `${BASE_URL}/pokemon?limit=${limit}&offset=${offset}`,
  );
  if (!response.ok) throw new Error("Failed to fetch Pokémon list");
  return response.json();
}

// Fetch individual Pokémon details
export async function fetchPokemonDetails(
  nameOrId: string | number,
): Promise<Pokemon> {
  const response = await fetch(`${BASE_URL}/pokemon/${nameOrId}`);
  if (!response.ok) throw new Error(`Failed to fetch Pokémon: ${nameOrId}`);
  return response.json();
}

// Fetch multiple Pokémon in batches (with concurrency limit)
export async function fetchPokemonBatch(
  names: string[],
  concurrency = 5,
): Promise<Pokemon[]> {
  const results: Pokemon[] = [];

  for (let i = 0; i < names.length; i += concurrency) {
    const batch = names.slice(i, i + concurrency);
    const promises = batch.map((name) => fetchPokemonDetails(name));
    const batchResults = await Promise.allSettled(promises);

    batchResults.forEach((result) => {
      if (result.status === "fulfilled") {
        results.push(result.value);
      }
    });
  }

  return results;
}

// Fetch all types
export async function fetchTypes(): Promise<Array<{ name: string }>> {
  const response = await fetch(`${BASE_URL}/type`);
  if (!response.ok) throw new Error("Failed to fetch types");
  const data = await response.json();
  return data.results;
}

// Fetch Pokémon by type
export async function fetchPokemonByType(typeName: string): Promise<string[]> {
  const response = await fetch(`${BASE_URL}/type/${typeName}`);
  if (!response.ok) throw new Error(`Failed to fetch type: ${typeName}`);
  const data: Type = await response.json();
  return data.pokemon.map((p) => p.pokemon.name);
}

// Fetch generation data
export async function fetchGeneration(genNumber: number): Promise<string[]> {
  const response = await fetch(`${BASE_URL}/generation/${genNumber}`);
  if (!response.ok) throw new Error(`Failed to fetch generation: ${genNumber}`);
  const data = await response.json();
  return data.pokemon_species.map((s: any) => s.name);
}

// Calculate Base Stat Total
export function calculateBST(pokemon: Pokemon): number {
  return pokemon.stats.reduce((sum, stat) => sum + stat.base_stat, 0);
}

// Get stat by name
export function getStat(pokemon: Pokemon, statName: string): number {
  const stat = pokemon.stats.find((s) => s.stat.name === statName);
  return stat?.base_stat || 0;
}

// Fetch evolution chain for a Pokemon
export async function fetchEvolutionChain(
  pokemonId: number,
): Promise<EvolutionChain | null> {
  try {
    // First, get the species data
    const speciesResponse = await fetch(
      `${BASE_URL}/pokemon-species/${pokemonId}`,
    );
    if (!speciesResponse.ok) return null;
    const speciesData: SpeciesData = await speciesResponse.json();

    // Then, get the evolution chain
    const evolutionResponse = await fetch(speciesData.evolution_chain.url);
    if (!evolutionResponse.ok) return null;
    const evolutionData: EvolutionData = await evolutionResponse.json();

    return evolutionData.chain;
  } catch (error) {
    console.error("Failed to fetch evolution chain:", error);
    return null;
  }
}

// Extract Pokemon ID from species URL
export function extractIdFromUrl(url: string): number {
  const matches = url.match(/\/(\d+)\//);
  return matches ? parseInt(matches[1]) : 0;
}

// Get list of Mega Evolution and Gigantamax forms
export function getSpecialForms(): string[] {
  return [
    // Mega Evolutions
    "venusaur-mega",
    "charizard-mega-x",
    "charizard-mega-y",
    "blastoise-mega",
    "alakazam-mega",
    "gengar-mega",
    "kangaskhan-mega",
    "pinsir-mega",
    "gyarados-mega",
    "aerodactyl-mega",
    "mewtwo-mega-x",
    "mewtwo-mega-y",
    "ampharos-mega",
    "scizor-mega",
    "heracross-mega",
    "houndoom-mega",
    "tyranitar-mega",
    "blaziken-mega",
    "gardevoir-mega",
    "mawile-mega",
    "aggron-mega",
    "medicham-mega",
    "manectric-mega",
    "banette-mega",
    "absol-mega",
    "garchomp-mega",
    "lucario-mega",
    "abomasnow-mega",
    "beedrill-mega",
    "pidgeot-mega",
    "slowbro-mega",
    "steelix-mega",
    "sceptile-mega",
    "swampert-mega",
    "sableye-mega",
    "sharpedo-mega",
    "camerupt-mega",
    "altaria-mega",
    "glalie-mega",
    "salamence-mega",
    "metagross-mega",
    "latias-mega",
    "latios-mega",
    "rayquaza-mega",
    "lopunny-mega",
    "gallade-mega",
    "audino-mega",
    "diancie-mega",

    // Regional forms - Alola (contoh umum)
    "raichu-alola",
    "vulpix-alola",
    "ninetales-alola",
    "meowth-alola",
    "rattata-alola",
    "raticate-alola",
    "sandshrew-alola",
    "sandslash-alola",
    "grimer-alola",
    "muk-alola",
    "marowak-alola",

    // Regional forms - Galar (contoh umum)
    "meowth-galar",
    "zigzagoon-galar",
    "linoone-galar",
    "ponyta-galar",
    "rapidash-galar",
    "farfetchd-galar",
    "corsola-galar",
    "darmanitan-galar-standard",

    // Gigantamax forms
    "venusaur-gmax",
    "charizard-gmax",
    "blastoise-gmax",
    "butterfree-gmax",
    "pikachu-gmax",
    "meowth-gmax",
    "machamp-gmax",
    "gengar-gmax",
    "kingler-gmax",
    "lapras-gmax",
    "eevee-gmax",
    "snorlax-gmax",
    "garbodor-gmax",
    "melmetal-gmax",
    "rillaboom-gmax",
    "cinderace-gmax",
    "inteleon-gmax",
    "corviknight-gmax",
    "orbeetle-gmax",
    "drednaw-gmax",
    "coalossal-gmax",
    "flapple-gmax",
    "appletun-gmax",
    "sandaconda-gmax",
    "toxtricity-amped-gmax",
    "toxtricity-low-key-gmax",
    "centiskorch-gmax",
    "hatterene-gmax",
    "grimmsnarl-gmax",
    "alcremie-gmax",
    "copperajah-gmax",
    "duraludon-gmax",
    "urshifu-single-strike-gmax",
    "urshifu-rapid-strike-gmax",
  ];
}
