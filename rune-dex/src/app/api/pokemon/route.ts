import { NextRequest, NextResponse } from 'next/server';
import { fetchPokemon, formatPokemonData } from '@/lib/pokeapi';
import { mockDB } from '@/lib/mock-database';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const pokemonId = searchParams.get('id');
  const pokemonName = searchParams.get('name');

  if (!pokemonId && !pokemonName) {
    return NextResponse.json(
      { error: 'Pokemon ID or name is required' },
      { status: 400 }
    );
  }

  try {
    const pokemon = await fetchPokemon(pokemonId || pokemonName!);
    
    if (!pokemon) {
      return NextResponse.json(
        { error: 'Pokemon not found' },
        { status: 404 }
      );
    }

    const formattedPokemon = formatPokemonData(pokemon);
    
    // Verificar se existe dados customizados no banco local
    const customPokemon = mockDB.findPokemonByName(pokemonName || pokemon.name);
    
    // Se encontrou dados customizados, adicionar informações do modelo
    if (customPokemon) {
      return NextResponse.json({
        success: true,
        data: {
          ...formattedPokemon,
          customData: {
            typeModel: customPokemon.typeModel,
            isCustom: true,
            customId: customPokemon.id,
            createdAt: customPokemon.createdAt
          }
        }
      });
    }
    
    return NextResponse.json({
      success: true,
      data: formattedPokemon
    });
  } catch (error) {
    console.error('Error fetching Pokemon:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
