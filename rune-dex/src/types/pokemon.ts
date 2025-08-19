// Tipos relacionados aos Pokémon da PokeAPI
export interface Pokemon {
  id: number;
  name: string;
  sprites: {
    front_default: string;
    other: {
      'official-artwork': {
        front_default: string;
      };
    };
  };
  types: Array<{
    type: {
      name: string;
    };
  }>;
}

// Tipos para o sistema de runas do PXG
export interface PokemonRune {
  pokemonId: number;
  pokemonName: string;
  pokelog: number;
  runeLevel: number;
  requiredPokelog: number;
}

// Tipo para metas de runas
export interface RuneGoal {
  id: string;
  pokemonId: number;
  pokemonName: string;
  targetLevel: number;
  currentPokelog: number;
  requiredPokelog: number;
  progress: number; // porcentagem
}

// Tipo para dados de pokelog (nossa API customizada)
export interface PokelogData {
  pokemonId: number;
  pokemonName: string;
  baseStats: {
    hp: number;
    attack: number;
    defense: number;
    specialAttack: number;
    specialDefense: number;
    speed: number;
  };
  pokelogPerLevel: number[];
  totalPokelog: number;
}

// Tipos para API responses
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}

// Tipo para search de Pokémon
export interface PokemonSearchResult {
  id: number;
  name: string;
  image: string;
  types: string[];
  customData?: {
    typeModel: string;
    isCustom: boolean;
    customId: string;
    createdAt: Date;
  };
}
