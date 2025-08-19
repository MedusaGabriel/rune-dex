'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useFirestore } from '@/hooks/useFirestore';
import { Pokemon } from '@/types/firebase';
import ProtectedRoute from '@/components/protected-route';

export default function PokemonsPage() {
  console.log('🎯 PokemonsPage: Componente renderizando');
  
  const [pokemons, setPokemons] = useState<Pokemon[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showForm, setShowForm] = useState(false);
  
  // Form states
  const [nome, setNome] = useState('');
  const [kills, setKills] = useState(0);
  const [pokelog, setPokelog] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  
  const { user } = useAuth();
  const { createDocument, getUserDocuments, updateDocument, deleteDocument } = useFirestore();

  console.log('🎯 PokemonsPage: user =', user ? 'logado' : 'não logado');
  console.log('🎯 PokemonsPage: loading =', loading);

  useEffect(() => {
    console.log('🎯 PokemonsPage: useEffect executando', { user: user?.uid });
    
    const loadPokemons = async () => {
      if (!user) {
        console.log('🎯 PokemonsPage: Usuário não logado, saindo do useEffect');
        return;
      }
      
      try {
        console.log('🎯 PokemonsPage: Iniciando carregamento dos pokémons...');
        setLoading(true);
        const pokemonsData = await getUserDocuments('pokemons', user.uid);
        console.log('🎯 PokemonsPage: Pokémons carregados:', pokemonsData);
        
        // Ordenar por updatedAt no frontend
        const sortedPokemons = (pokemonsData as Pokemon[]).sort((a, b) => {
          const dateA = a.updatedAt instanceof Date ? a.updatedAt : new Date(a.updatedAt);
          const dateB = b.updatedAt instanceof Date ? b.updatedAt : new Date(b.updatedAt);
          return dateB.getTime() - dateA.getTime();
        });
        console.log('🎯 PokemonsPage: Pokémons ordenados:', sortedPokemons);
        setPokemons(sortedPokemons);
      } catch (error) {
        console.error('🎯 PokemonsPage: Erro ao carregar pokémons:', error);
        setError('Erro ao carregar pokémons');
      } finally {
        console.log('🎯 PokemonsPage: Finalizando loading');
        setLoading(false);
      }
    };

    loadPokemons();
  }, [user, getUserDocuments]); // Agora getUserDocuments é estável com useCallback

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    try {
      const pokemonData = {
        nome,
        kills,
        pokelog,
        userId: user.uid
      };

      if (editingId) {
        await updateDocument('pokemons', editingId, pokemonData);
        setPokemons(prev => prev.map(p => 
          p.id === editingId 
            ? { ...p, ...pokemonData, updatedAt: new Date() }
            : p
        ));
      } else {
        const newId = await createDocument('pokemons', pokemonData);
        const newPokemon: Pokemon = {
          id: newId,
          ...pokemonData,
          createdAt: new Date(),
          updatedAt: new Date()
        };
        setPokemons(prev => [newPokemon, ...prev]);
      }

      // Reset form
      setNome('');
      setKills(0);
      setPokelog('');
      setShowForm(false);
      setEditingId(null);
    } catch (error) {
      console.error('Erro ao salvar pokémon:', error);
      setError('Erro ao salvar pokémon');
    }
  };

  const handleEdit = (pokemon: Pokemon) => {
    setNome(pokemon.nome);
    setKills(pokemon.kills);
    setPokelog(pokemon.pokelog);
    setEditingId(pokemon.id);
    setShowForm(true);
  };

  const handleDelete = async (pokemonId: string) => {
    if (!confirm('Tem certeza que deseja excluir este pokémon?')) return;

    try {
      await deleteDocument('pokemons', pokemonId);
      setPokemons(prev => prev.filter(p => p.id !== pokemonId));
    } catch (error) {
      console.error('Erro ao deletar pokémon:', error);
      setError('Erro ao deletar pokémon');
    }
  };

  const resetForm = () => {
    setNome('');
    setKills(0);
    setPokelog('');
    setEditingId(null);
    setShowForm(false);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  return (
    <ProtectedRoute>
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Meus Pokémons</h1>
          <button
            onClick={() => setShowForm(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md"
          >
            Adicionar Pokémon
          </button>
        </div>

        {error && (
          <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-md">
            <p className="text-red-700">{error}</p>
          </div>
        )}

        {/* Form Modal */}
        {showForm && (
          <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
            <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
              <h3 className="text-lg font-bold text-gray-900 mb-4">
                {editingId ? 'Editar Pokémon' : 'Adicionar Pokémon'}
              </h3>
              
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Nome</label>
                  <input
                    type="text"
                    required
                    value={nome}
                    onChange={(e) => setNome(e.target.value)}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700">Kills</label>
                  <input
                    type="number"
                    min="0"
                    required
                    value={kills}
                    onChange={(e) => setKills(Number(e.target.value))}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700">Pokelog</label>
                  <textarea
                    required
                    value={pokelog}
                    onChange={(e) => setPokelog(e.target.value)}
                    rows={3}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                  />
                </div>
                
                <div className="flex justify-end space-x-2">
                  <button
                    type="button"
                    onClick={resetForm}
                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700"
                  >
                    {editingId ? 'Atualizar' : 'Adicionar'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Pokémons List */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {pokemons.map((pokemon) => (
            <div key={pokemon.id} className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-2">{pokemon.nome}</h3>
              <p className="text-gray-600 mb-2">Kills: {pokemon.kills}</p>
              <p className="text-gray-600 mb-4">Pokelog: {pokemon.pokelog}</p>
              
              <div className="flex justify-end space-x-2">
                <button
                  onClick={() => handleEdit(pokemon)}
                  className="px-3 py-1 text-sm bg-blue-100 text-blue-600 rounded hover:bg-blue-200"
                >
                  Editar
                </button>
                <button
                  onClick={() => handleDelete(pokemon.id)}
                  className="px-3 py-1 text-sm bg-red-100 text-red-600 rounded hover:bg-red-200"
                >
                  Excluir
                </button>
              </div>
            </div>
          ))}
        </div>

        {pokemons.length === 0 && (
          <div className="text-center py-8">
            <p className="text-gray-500">Nenhum pokémon encontrado. Adicione seu primeiro pokémon!</p>
          </div>
        )}
      </div>
    </ProtectedRoute>
  );
}
