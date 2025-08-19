'use client';

import { useState, useEffect } from 'react';
import { useFirestore } from '@/hooks/useFirestore';
import { User } from '@/types/firebase';
import ProtectedRoute from '@/components/protected-route';

export default function AdminPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  const { getDocuments, updateDocument } = useFirestore();

  useEffect(() => {
    const loadUsersData = async () => {
      try {
        setLoading(true);
        const usersData = await getDocuments('users');
        setUsers(usersData as User[]);
      } catch (error) {
        console.error('Erro ao carregar usuários:', error);
        setError('Erro ao carregar usuários');
      } finally {
        setLoading(false);
      }
    };
    
    loadUsersData();
  }, [getDocuments]);

  const handleRoleChange = async (userId: string, newRole: 'user' | 'admin') => {
    try {
      await updateDocument('users', userId, { role: newRole });
      
      // Atualizar localmente
      setUsers(prevUsers => 
        prevUsers.map(user => 
          user.id === userId ? { ...user, role: newRole } : user
        )
      );
    } catch (error) {
      console.error('Erro ao atualizar role:', error);
      setError('Erro ao atualizar permissões do usuário');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  return (
    <ProtectedRoute requireAdmin={true}>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">
          Painel de Administração
        </h1>

        {error && (
          <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-md">
            <p className="text-red-700">{error}</p>
          </div>
        )}

        <div className="bg-white shadow overflow-hidden sm:rounded-md">
          <ul className="divide-y divide-gray-200">
            {users.map((user) => (
              <li key={user.id} className="px-6 py-4">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center">
                      <div className="flex-shrink-0">
                        <div className="h-10 w-10 rounded-full bg-gray-300 flex items-center justify-center">
                          <span className="text-sm font-medium text-gray-700">
                            {user.email?.charAt(0).toUpperCase()}
                          </span>
                        </div>
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">
                          {user.email}
                        </div>
                        <div className="text-sm text-gray-500">
                          ID: {user.id}
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center">
                      <span className="text-sm text-gray-500 mr-2">Role:</span>
                      <select
                        value={user.role}
                        onChange={(e) => handleRoleChange(user.id, e.target.value as 'user' | 'admin')}
                        className="text-sm border border-gray-300 rounded-md px-2 py-1 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      >
                        <option value="user">Usuário</option>
                        <option value="admin">Admin</option>
                      </select>
                    </div>
                    
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      user.role === 'admin' 
                        ? 'bg-red-100 text-red-800' 
                        : 'bg-green-100 text-green-800'
                    }`}>
                      {user.role === 'admin' ? 'Administrador' : 'Usuário'}
                    </span>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>

        {users.length === 0 && (
          <div className="text-center py-8">
            <p className="text-gray-500">Nenhum usuário encontrado.</p>
          </div>
        )}
      </div>
    </ProtectedRoute>
  );
}
