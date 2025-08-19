"use client";

import { useState } from 'react';
import { mockDB } from '@/lib/mock-database';

interface DatabaseViewerProps {
  currentUser?: { username: string; isAdmin: boolean } | null;
}

export default function DatabaseViewer({ currentUser }: DatabaseViewerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [users, setUsers] = useState(mockDB.getAllUsers());
  const [pokemons, setPokemons] = useState(mockDB.getAllPokemons());

  const canViewDatabase = currentUser?.isAdmin && currentUser?.username === 'admin';

  const refreshData = () => {
    setUsers(mockDB.getAllUsers());
    setPokemons(mockDB.getAllPokemons());
  };

  if (!canViewDatabase) {
    return null;
  }

  if (!isOpen) {
    return (
      <button
        onClick={() => {
          setIsOpen(true);
          refreshData();
        }}
        className="fixed bottom-4 right-4 bg-green-500 text-white px-4 py-2 rounded-lg shadow-lg hover:bg-green-600 transition-all z-50"
      >
        📊 Ver Banco Temporário
      </button>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={() => setIsOpen(false)}>
      <div 
        className="bg-white rounded-lg shadow-xl max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b border-gray-200">
          <h2 className="text-2xl font-bold text-gray-800">
            🗄️ Banco de Dados Temporário (Memória)
          </h2>
          <button
            onClick={() => setIsOpen(false)}
            className="text-gray-500 hover:text-gray-700 text-2xl"
          >
            ×
          </button>
        </div>

        <div className="p-6">
          {/* Info sobre armazenamento */}
          <div className="bg-yellow-100 border-l-4 border-yellow-500 p-4 mb-6">
            <div className="flex">
              <div className="flex-shrink-0">
                <span className="text-yellow-500 text-xl">⚠️</span>
              </div>
              <div className="ml-3">
                <p className="text-sm text-yellow-700">
                  <strong>Localização:</strong> Dados armazenados em memória JavaScript (src/lib/mock-database.ts)
                  <br />
                  <strong>Persistência:</strong> Os dados são perdidos quando você recarrega a página
                  <br />
                  <strong>Tipo:</strong> Simulação temporária de banco de dados para desenvolvimento
                </p>
              </div>
            </div>
          </div>

          {/* Botão refresh */}
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold text-gray-800">Dados Armazenados</h3>
            <button
              onClick={refreshData}
              className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
            >
              🔄 Atualizar
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Usuários */}
            <div>
              <h4 className="text-md font-semibold text-gray-700 mb-3">
                👥 Usuários ({users.length})
              </h4>
              <div className="space-y-2 max-h-60 overflow-y-auto">
                {users.length === 0 ? (
                  <p className="text-gray-500 text-sm">Nenhum usuário cadastrado</p>
                ) : (
                  users.map((user) => (
                    <div key={user.id} className="bg-gray-100 p-3 rounded text-sm">
                      <div><strong>ID:</strong> {user.id}</div>
                      <div><strong>Usuário:</strong> {user.username}</div>
                      <div><strong>Clan:</strong> {user.clan || 'Sem clan'}</div>
                      <div><strong>Admin:</strong> {user.isAdmin ? '✅ Sim' : '❌ Não'}</div>
                      <div><strong>Criado:</strong> {user.createdAt.toLocaleString()}</div>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Pokémons */}
            <div>
              <h4 className="text-md font-semibold text-gray-700 mb-3">
                🐾 Pokémons ({pokemons.length})
              </h4>
              <div className="space-y-2 max-h-60 overflow-y-auto">
                {pokemons.length === 0 ? (
                  <p className="text-gray-500 text-sm">Nenhum pokémon cadastrado</p>
                ) : (
                  pokemons.map((pokemon) => (
                    <div key={pokemon.id} className="bg-gray-100 p-3 rounded text-sm">
                      <div><strong>ID:</strong> {pokemon.id}</div>
                      <div><strong>Nome:</strong> {pokemon.name}</div>
                      <div><strong>Tipo:</strong> {pokemon.type}</div>
                      <div><strong>Modelo:</strong> {pokemon.typeModel}</div>
                      <div><strong>Criado por:</strong> {pokemon.createdBy}</div>
                      <div><strong>Criado:</strong> {pokemon.createdAt.toLocaleString()}</div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>

          {/* Console Commands */}
          <div className="mt-6 bg-gray-900 text-green-400 p-4 rounded text-sm">
            <div className="mb-2"><strong>💻 Comandos no Console do Navegador:</strong></div>
            <div className="space-y-1 font-mono">
              <div>• <code>mockDB.getAllUsers()</code> - Ver todos os usuários</div>
              <div>• <code>mockDB.getAllPokemons()</code> - Ver todos os pokémons</div>
              <div>• <code>mockDB.clearAll()</code> - Limpar todos os dados</div>
              <div>• <code>examples.viewAll()</code> - Ver exemplo de uso</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
