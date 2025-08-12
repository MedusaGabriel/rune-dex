import { Pokemon, PokemonSearchResult } from '@/types/pokemon';

const POKEAPI_BASE_URL = 'https://pokeapi.co/api/v2';

/**
 * Busca um Pokémon específico na PokeAPI
 */
export async function fetchPokemon(pokemonId: number | string): Promise<Pokemon | null> {
  try {
    const response = await fetch(`${POKEAPI_BASE_URL}/pokemon/${pokemonId.toString().toLowerCase()}`);
    
    if (!response.ok) {
      throw new Error(`Pokemon not found: ${pokemonId}`);
    }
    
    const pokemon: Pokemon = await response.json();
    return pokemon;
  } catch (error) {
    console.error('Error fetching Pokemon:', error);
    return null;
  }
}

/**
 * Busca múltiplos Pokémon por IDs
 */
export async function fetchMultiplePokemon(pokemonIds: number[]): Promise<Pokemon[]> {
  const promises = pokemonIds.map(id => fetchPokemon(id));
  const results = await Promise.allSettled(promises);
  
  return results
    .filter((result): result is PromiseFulfilledResult<Pokemon> => 
      result.status === 'fulfilled' && result.value !== null
    )
    .map(result => result.value);
}

/**
 * Formata dados do Pokémon para uso na aplicação
 */
export function formatPokemonData(pokemon: Pokemon): PokemonSearchResult {
  return {
    id: pokemon.id,
    name: pokemon.name,
    image: pokemon.sprites.other['official-artwork'].front_default || pokemon.sprites.front_default,
    types: pokemon.types.map(type => type.type.name)
  };
}

/**
 * Busca lista de Pokémon com paginação
 */
export async function fetchPokemonList(limit: number = 20, offset: number = 0) {
  try {
    const response = await fetch(`${POKEAPI_BASE_URL}/pokemon?limit=${limit}&offset=${offset}`);
    
    if (!response.ok) {
      throw new Error('Failed to fetch Pokemon list');
    }
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching Pokemon list:', error);
    return null;
  }
}

/**
 * Busca Pokémon por nome (com busca parcial)
 */
export async function searchPokemonByName(name: string): Promise<PokemonSearchResult[]> {
  try {
    // Para busca simples, vamos tentar buscar o Pokémon diretamente
    const pokemon = await fetchPokemon(name);
    
    if (pokemon) {
      return [formatPokemonData(pokemon)];
    }
    
    return [];
  } catch (error) {
    console.error('Error searching Pokemon:', error);
    return [];
  }
}
