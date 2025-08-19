"use client";

import { useState } from 'react';
import { mockDB } from '@/lib/mock-database';
import Image from 'next/image';

interface AdminLayoutProps {
  currentUser: { username: string; isAdmin: boolean };
  onClose: () => void;
}

export default function AdminLayout({ currentUser, onClose }: AdminLayoutProps) {
  const [activeSection, setActiveSection] = useState<'pokemon' | 'database'>('pokemon');
  const [users, setUsers] = useState(mockDB.getAllUsers());
  const [pokemons, setPokemons] = useState(mockDB.getAllPokemons());
  
  // Estado para formulário de Pokémon
  const [formData, setFormData] = useState({
    pokemonName: '',
    pokemonType: '',
    pokemonImage: '',
    typeModel: ''
  });

  const typeModels = ['1', '2', '3', '4', '5'];

  const refreshData = () => {
    setUsers(mockDB.getAllUsers());
    setPokemons(mockDB.getAllPokemons());
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const fetchPokemonData = async (pokemonName: string) => {
    if (!pokemonName.trim()) return;
    
    try {
      const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${pokemonName.toLowerCase()}`);
      if (response.ok) {
        const data = await response.json();
        setFormData(prev => ({
          ...prev,
          pokemonType: data.types.map((t: { type: { name: string } }) => t.type.name).join(', '),
          pokemonImage: data.sprites.front_default || ''
        }));
      }
    } catch (error) {
      console.error('Erro ao buscar dados do Pokémon:', error);
    }
  };

  const handlePokemonNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    setFormData(prev => ({ ...prev, pokemonName: value }));
    
    // Debounce para não fazer muitas requisições
    const timeoutId = setTimeout(() => {
      fetchPokemonData(value);
    }, 500);
    
    return () => clearTimeout(timeoutId);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validar dados do pokémon
    if (!formData.pokemonName || !formData.pokemonType || !formData.typeModel) {
      alert('Preencha todos os campos do Pokémon!');
      return;
    }

    // Cadastrar pokémon
    try {
      const newPokemon = mockDB.addPokemon({
        name: formData.pokemonName,
        type: formData.pokemonType,
        image: formData.pokemonImage,
        typeModel: formData.typeModel
      }, currentUser.username);
      
      alert(`Pokémon ${newPokemon.name} cadastrado com sucesso!`);
      
      // Limpar campos do pokémon
      setFormData({
        pokemonName: '',
        pokemonType: '',
        pokemonImage: '',
        typeModel: ''
      });
      
      // Atualizar dados
      refreshData();
    } catch {
      alert('Erro ao cadastrar Pokémon.');
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-7xl mx-4 h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex justify-between items-center p-4 border-b border-gray-200 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-t-lg">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
              <span className="text-lg">⚙️</span>
            </div>
            <div>
              <h1 className="text-xl font-bold">Área Administrativa</h1>
              <p className="text-sm text-white/80">Logado como: {currentUser.username}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-white/80 hover:text-white text-2xl w-8 h-8 flex items-center justify-center rounded-full hover:bg-white/20 transition-colors"
          >
            ×
          </button>
        </div>

        <div className="flex flex-1 overflow-hidden">
          {/* Sidebar */}
          <div className="w-64 bg-gray-50 border-r border-gray-200 p-4">
            <nav className="space-y-2">
              <button
                onClick={() => setActiveSection('pokemon')}
                className={`w-full text-left px-4 py-3 rounded-lg font-medium transition-colors ${
                  activeSection === 'pokemon'
                    ? 'bg-blue-500 text-white'
                    : 'text-gray-600 hover:bg-gray-200'
                }`}
              >
                🐾 Cadastrar Pokémon
              </button>
              <button
                onClick={() => {
                  setActiveSection('database');
                  refreshData();
                }}
                className={`w-full text-left px-4 py-3 rounded-lg font-medium transition-colors ${
                  activeSection === 'database'
                    ? 'bg-blue-500 text-white'
                    : 'text-gray-600 hover:bg-gray-200'
                }`}
              >
                🗄️ Banco de Dados
              </button>
            </nav>
          </div>

          {/* Main Content */}
          <div className="flex-1 p-6 overflow-y-auto">
            {activeSection === 'pokemon' && (
              <div>
                <h2 className="text-2xl font-bold text-black mb-6">Cadastrar Novo Pokémon</h2>
                
                <form onSubmit={handleSubmit} className="max-w-2xl space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label htmlFor="pokemonName" className="block text-sm font-medium text-black mb-2">
                        Nome do Pokémon
                      </label>
                      <input
                        type="text"
                        id="pokemonName"
                        name="pokemonName"
                        value={formData.pokemonName}
                        onChange={handlePokemonNameChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Digite o nome do Pokémon"
                      />
                    </div>

                    <div>
                      <label htmlFor="typeModel" className="block text-sm font-medium text-black mb-2">
                        Modelo do Tipo
                      </label>
                      <select
                        id="typeModel"
                        name="typeModel"
                        value={formData.typeModel}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="">Selecione um modelo</option>
                        {typeModels.map((model) => (
                          <option key={model} value={model}>
                            Modelo {model}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label htmlFor="pokemonType" className="block text-sm font-medium text-black mb-2">
                        Tipo (Automático)
                      </label>
                      <input
                        type="text"
                        id="pokemonType"
                        name="pokemonType"
                        value={formData.pokemonType}
                        readOnly
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-100 text-gray-600"
                        placeholder="Será preenchido automaticamente"
                      />
                    </div>

                    <div>
                      <label htmlFor="pokemonImage" className="block text-sm font-medium text-black mb-2">
                        Imagem (Automática)
                      </label>
                      <input
                        type="text"
                        id="pokemonImage"
                        name="pokemonImage"
                        value={formData.pokemonImage}
                        readOnly
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-100 text-gray-600"
                        placeholder="URL será preenchida automaticamente"
                      />
                    </div>
                  </div>

                  {formData.pokemonImage && (
                    <div className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg">
                      <Image
                        src={formData.pokemonImage}
                        alt={formData.pokemonName}
                        width={80}
                        height={80}
                        className="object-contain border border-gray-300 rounded"
                      />
                      <div>
                        <p className="font-medium text-black">{formData.pokemonName}</p>
                        <p className="text-sm text-black">{formData.pokemonType}</p>
                      </div>
                    </div>
                  )}

                  <button
                    type="submit"
                    className="w-full bg-blue-500 text-white py-3 px-6 rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium text-lg"
                  >
                    Cadastrar Pokémon
                  </button>
                </form>
              </div>
            )}

            {activeSection === 'database' && (
              <div>
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-bold text-black">Banco de Dados</h2>
                  <button
                    onClick={refreshData}
                    className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition-colors"
                  >
                    🔄 Atualizar
                  </button>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Usuários */}
                  <div className="bg-white border border-gray-200 rounded-lg p-4">
                    <h3 className="text-lg font-semibold text-black mb-4">
                      👥 Usuários ({users.length})
                    </h3>
                    <div className="space-y-3 max-h-80 overflow-y-auto">
                      {users.length === 0 ? (
                        <p className="text-black text-sm">Nenhum usuário cadastrado</p>
                      ) : (
                        users.map((user) => (
                          <div key={user.id} className="bg-gray-50 p-3 rounded text-sm">
                            <div className="flex justify-between items-start">
                              <div>
                                <div><strong className="text-black">Usuário:</strong> <span className="text-black">{user.username}</span></div>
                                <div><strong className="text-black">Clan:</strong> <span className="text-black">{user.clan || 'Sem clan'}</span></div>
                                <div><strong className="text-black">Admin:</strong> <span className="text-black">{user.isAdmin ? '✅ Sim' : '❌ Não'}</span></div>
                              </div>
                              <div className="text-xs text-black">
                                {user.createdAt.toLocaleDateString()}
                              </div>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </div>

                  {/* Pokémons */}
                  <div className="bg-white border border-gray-200 rounded-lg p-4">
                    <h3 className="text-lg font-semibold text-black mb-4">
                      🐾 Pokémons ({pokemons.length})
                    </h3>
                    <div className="space-y-3 max-h-80 overflow-y-auto">
                      {pokemons.length === 0 ? (
                        <p className="text-black text-sm">Nenhum pokémon cadastrado</p>
                      ) : (
                        pokemons.map((pokemon) => (
                          <div key={pokemon.id} className="bg-gray-50 p-3 rounded text-sm">
                            <div className="flex justify-between items-start">
                              <div>
                                <div><strong className="text-black">Nome:</strong> <span className="text-black">{pokemon.name}</span></div>
                                <div><strong className="text-black">Tipo:</strong> <span className="text-black">{pokemon.type}</span></div>
                                <div><strong className="text-black">Modelo:</strong> <span className="text-black">Tipo {pokemon.typeModel}</span></div>
                                <div><strong className="text-black">Criado por:</strong> <span className="text-black">{pokemon.createdBy}</span></div>
                              </div>
                              <div className="text-xs text-black">
                                {pokemon.createdAt.toLocaleDateString()}
                              </div>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
