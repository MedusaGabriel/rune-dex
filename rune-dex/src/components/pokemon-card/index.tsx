import Image from 'next/image';
import { PokemonSearchResult } from '@/types/pokemon';

interface PokemonCardProps {
  pokemon: PokemonSearchResult;
  onClick?: () => void;
}

export default function PokemonCard({ pokemon, onClick }: PokemonCardProps) {
  return (
    <div 
      className="bg-white/10 backdrop-blur-lg rounded-xl p-4 hover:bg-white/20 transition-colors cursor-pointer"
      onClick={onClick}
    >
      <div className="text-center">
        <Image
          src={pokemon.image}
          alt={pokemon.name}
          width={96}
          height={96}
          className="mx-auto mb-3"
        />
        <h3 className="text-lg font-semibold text-white capitalize mb-2">
          {pokemon.name}
        </h3>
        <div className="flex flex-wrap gap-1 justify-center">
          {pokemon.types.map((type) => (
            <span
              key={type}
              className="px-2 py-1 bg-gray-700 text-xs rounded-full text-gray-300"
            >
              {type}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
