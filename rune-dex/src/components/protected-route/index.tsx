'use client';

import { useAuth } from '@/hooks/useAuth';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requireAdmin?: boolean;
}

export default function ProtectedRoute({ 
  children, 
  requireAdmin = false 
}: ProtectedRouteProps) {
  console.log('🛡️ ProtectedRoute: Renderizando', { requireAdmin });
  
  const { user, userProfile, loading } = useAuth();
  const router = useRouter();

  console.log('🛡️ ProtectedRoute: Estado atual', { 
    user: user?.uid, 
    userProfile: userProfile?.role, 
    loading 
  });

  useEffect(() => {
    console.log('🛡️ ProtectedRoute: useEffect executando', { user, userProfile, loading, requireAdmin });
    
    if (!loading) {
      if (!user) {
        console.log('🛡️ ProtectedRoute: Usuário não logado, redirecionando para /login');
        router.push('/login');
        return;
      }

      if (requireAdmin && userProfile?.role !== 'admin') {
        console.log('🛡️ ProtectedRoute: Usuário não é admin, redirecionando para /');
        router.push('/');
        return;
      }
      
      console.log('🛡️ ProtectedRoute: Acesso autorizado');
    }
  }, [user, userProfile, loading, requireAdmin, router]);

  if (loading) {
    console.log('🛡️ ProtectedRoute: Ainda carregando, mostrando spinner');
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  if (!user) {
    console.log('🛡️ ProtectedRoute: Usuário não logado, retornando null');
    return null;
  }

  if (requireAdmin && userProfile?.role !== 'admin') {
    console.log('🛡️ ProtectedRoute: Acesso negado - não é admin');
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-600 mb-4">Acesso Negado</h1>
          <p className="text-gray-600">Você não tem permissão para acessar esta página.</p>
        </div>
      </div>
    );
  }

  console.log('🛡️ ProtectedRoute: Renderizando children');
  return <>{children}</>;
}
