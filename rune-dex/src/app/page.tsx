"use client";

import { useState } from 'react';
import SearchBar from '@/components/search-bar/search-bar';
import PokemonCard from '@/components/pokemon-card';
import Loading from '@/components/loading';
import ErrorMessage from '@/components/error-message';
import { PokemonSearchResult } from '@/types/pokemon';

export default function Home() {
  const [pokemon, setPokemon] = useState<PokemonSearchResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSearch = (result: PokemonSearchResult | null) => {
    setPokemon(result);
  };

  const handleLoading = (isLoading: boolean) => {
    setLoading(isLoading);
  };

  const handleError = (errorMessage: string | null) => {
    setError(errorMessage);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900">
      <main className="container mx-auto px-4 py-16">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-6xl font-bold text-white mb-4">
            Rune<span className="text-yellow-400">Dex</span>
          </h1>

        </div>

        {/* Search Bar */}
        <div className="flex justify-center mb-8">
          <SearchBar 
            onSearch={handleSearch}
            onLoading={handleLoading}
            onError={handleError}
          />
        </div>

        {/* Results Section */}
        <div className="flex justify-center">
          {loading && <Loading />}
          
          {error && !loading && <ErrorMessage message={error} />}
          
          {pokemon && !loading && !error && (
            <div className="max-w-sm">
              <PokemonCard 
                pokemon={pokemon}
                onClick={() => {
                  // Aqui você pode adicionar lógica para abrir detalhes
                  console.log('Clicou no Pokémon:', pokemon.name);
                }}
              />
            </div>
          )}
          
          {!pokemon && !loading && !error && (
            <div className="text-center py-8">
              <p className="text-white/60 text-lg">
                Digite o nome de um Pokémon para começar
              </p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
