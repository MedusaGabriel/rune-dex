'use client';

import React, { useEffect } from 'react';
import { useAuth } from '../../hooks/useAuth';

const AdminPage: React.FC = () => {
  const { user, userProfile, loading } = useAuth();

  useEffect(() => {
    // Se não está carregando e não é admin, redireciona
    if (!loading && user && userProfile?.role !== 'admin') {
      window.location.href = '/pokemons';
    }
    // Se não está logado, redireciona para login
    if (!loading && !user) {
      window.location.href = '/login';
    }
  }, [user, userProfile, loading]);

  // Mostra loading enquanto carrega
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900 mx-auto"></div>
          <p className="mt-4 text-gray-600">Verificando permissões...</p>
        </div>
      </div>
    );
  }

  // Se não está logado, mostra mensagem (enquanto redireciona)
  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <p className="text-gray-600">Redirecionando para login...</p>
        </div>
      </div>
    );
  }

  // Se não é admin, mostra mensagem (enquanto redireciona)
  if (userProfile?.role !== 'admin') {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <p className="text-gray-600">Acesso negado. Redirecionando...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">
        🎉 Gerenciar Modelos
      </h1>
      
      <div className="bg-green-50 border border-green-200 rounded-md p-4 mb-8">
        <h2 className="text-lg font-semibold text-green-800 mb-2">
          Acesso Autorizado!
        </h2>
        <p className="text-green-700">
          Bem-vindo ao painel de administração, {user.email}!
        </p>
        <div className="mt-2 text-sm text-green-600">
          <p>Role: {userProfile.role}</p>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
          <h3 className="text-xl font-semibold text-gray-900 mb-4">
            Adicionar Pokémon
          </h3>
          <p className="text-gray-600 mb-4">
            Funcionalidade para adicionar novos pokémons ao sistema.
          </p>
          <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
            Em Desenvolvimento
          </button>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
          <h3 className="text-xl font-semibold text-gray-900 mb-4">
            Criar Tasks
          </h3>
          <p className="text-gray-600 mb-4">
            Funcionalidade para criar tasks de pokémons.
          </p>
          <button className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded">
            Em Desenvolvimento
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminPage;