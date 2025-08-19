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
        
        {/* Informações customizadas do modelo */}
        {pokemon.customData && (
          <div className="mt-4 pt-4 border-t border-white/20">
            <div className="bg-gradient-to-r from-yellow-500/20 to-orange-500/20 backdrop-blur-sm rounded-lg p-3 mb-3">
              <div className="flex items-center justify-center space-x-2 mb-2">
                <span className="text-yellow-300 text-sm font-bold">⭐ POKÉMON CUSTOMIZADO</span>
              </div>
            </div>
            
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3 space-y-2">
              <div className="text-center">
                <div className="text-blue-300 font-bold text-lg">
                  Modelo Tipo {pokemon.customData.typeModel}
                </div>
                <div className="text-white/70 text-sm">
                  Configuração Especial
                </div>
              </div>
              
              <div className="grid grid-cols-1 gap-2 text-xs">
                <div className="bg-white/10 rounded p-2">
                  <span className="text-white/60">ID Customizado:</span>
                  <div className="font-mono text-blue-200">{pokemon.customData.customId}</div>
                </div>
                
                <div className="bg-white/10 rounded p-2">
                  <span className="text-white/60">Cadastrado em:</span>
                  <div className="text-green-200">
                    {new Date(pokemon.customData.createdAt).toLocaleDateString('pt-BR')}
                  </div>
                </div>
              </div>
              
              <div className="text-center pt-2 border-t border-white/20">
                <span className="text-purple-300 text-xs font-medium">
                  🎯 Configuração Administrativa Ativa
                </span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
