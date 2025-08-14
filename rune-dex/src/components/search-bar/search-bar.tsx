"use client";

import { useState } from 'react';
import { PokemonSearchResult } from '@/types/pokemon';

interface SearchBarProps {
  onSearch: (pokemon: PokemonSearchResult | null) => void;
  onLoading: (loading: boolean) => void;
  onError: (error: string | null) => void;
}

export default function SearchBar({ onSearch, onLoading, onError }: SearchBarProps) {
  const [searchTerm, setSearchTerm] = useState('');

  const handleSearch = async () => {
    if (!searchTerm.trim()) return;

    onLoading(true);
    onError(null);

    try {
      const response = await fetch(`/api/pokemon?name=${encodeURIComponent(searchTerm.toLowerCase().trim())}`);
      const result = await response.json();

      if (result.success) {
        onSearch(result.data);
      } else {
        onError(result.error || 'Pokémon não encontrado');
        onSearch(null);
      }
    } catch (err) {
      console.error('Search error:', err);
      onError('Erro ao buscar Pokémon. Tente novamente.');
      onSearch(null);
    } finally {
      onLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  const handleClear = () => {
    setSearchTerm('');
    onSearch(null);
    onError(null);
  };

  return (
    <div className="w-full max-w-lg mx-auto">
      <div className="relative">
        {/* Search Icon */}
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <svg 
            className="h-5 w-5 text-gray-400" 
            fill="none" 
            viewBox="0 0 24 24" 
            stroke="currentColor"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={2} 
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" 
            />
          </svg>
        </div>
        
        {/* Input Field */}
        <input
          type="text"
          placeholder="Pesquisar Pokémon..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          onKeyPress={handleKeyPress}
          className="block w-full pl-10 pr-12 py-3 border border-black rounded-lg 
          leading-5 bg-white placeholder-gray-500 focus:outline-none text-black
           focus:placeholder-black focus:ring-1 focus:ring-blue-500 focus:border-blue-500 sm:text-sm shadow-sm"
        />
        
        {/* Clear Button */}
        {searchTerm && (
          <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
            <button
              type="button"
              onClick={handleClear}
              className="h-5 w-5 text-gray-400 hover:text-black focus:outline-none"
            >
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
