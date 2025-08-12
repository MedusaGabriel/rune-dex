import { useState } from 'react';

interface SearchBarProps {
  onSearch: (query: string) => void;
  placeholder?: string;
  isLoading?: boolean;
}

export default function SearchBar({ 
  onSearch, 
  placeholder = "Digite o nome do Pokémon...", 
  isLoading = false 
}: SearchBarProps) {
  const [query, setQuery] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      onSearch(query.trim());
    }
  };

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-md mx-auto">
      <div className="relative">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={placeholder}
          disabled={isLoading}
          className="w-full px-4 py-3 pl-12 pr-4 bg-white/10 backdrop-blur-lg border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent disabled:opacity-50"
        />
        <div className="absolute left-4 top-1/2 transform -translate-y-1/2">
          {isLoading ? (
            <div className="animate-spin w-5 h-5 border-2 border-gray-400 border-t-yellow-400 rounded-full"></div>
          ) : (
            <svg
              className="w-5 h-5 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          )}
        </div>
      </div>
    </form>
  );
}
