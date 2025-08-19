'use client';

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { 
  User as FirebaseUser, 
  onAuthStateChanged, 
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut
} from 'firebase/auth';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { auth, db } from '@/lib/firebase';
import { User, AuthUser } from '@/types/firebase';

interface AuthContextType {
  user: AuthUser | null;
  userProfile: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [userProfile, setUserProfile] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    console.log('🔥 useAuth: Iniciando listener de auth');
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser: FirebaseUser | null) => {
      console.log('🔥 useAuth: Auth state changed:', firebaseUser ? 'User logged in' : 'User logged out');
      
      if (firebaseUser) {
        const authUser: AuthUser = {
          uid: firebaseUser.uid,
          email: firebaseUser.email,
          emailVerified: firebaseUser.emailVerified
        };
        console.log('🔥 useAuth: Setting user:', authUser);
        setUser(authUser);

        // Buscar perfil do usuário no Firestore
        console.log('🔥 useAuth: Buscando perfil no Firestore...');
        const userDoc = await getDoc(doc(db, 'users', firebaseUser.uid));
        if (userDoc.exists()) {
          const userData = userDoc.data();
          console.log('🔥 useAuth: Perfil encontrado:', userData);
          setUserProfile({
            id: firebaseUser.uid,
            email: userData.email,
            role: userData.role,
            createdAt: userData.createdAt?.toDate(),
            updatedAt: userData.updatedAt?.toDate()
          });
        } else {
          console.log('🔥 useAuth: Perfil não encontrado no Firestore');
        }
      } else {
        console.log('🔥 useAuth: Removendo user e profile');
        setUser(null);
        setUserProfile(null);
      }
      console.log('🔥 useAuth: Setting loading to false');
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const login = async (email: string, password: string) => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
    } catch (error) {
      console.error('Erro no login:', error);
      throw error;
    }
  };

  const register = async (email: string, password: string) => {
    try {
      const result = await createUserWithEmailAndPassword(auth, email, password);
      
      // Criar perfil do usuário no Firestore
      const userData: Omit<User, 'id'> = {
        email,
        role: 'user',
        createdAt: new Date(),
        updatedAt: new Date()
      };

      await setDoc(doc(db, 'users', result.user.uid), userData);
    } catch (error) {
      console.error('Erro no cadastro:', error);
      throw error;
    }
  };

  const logout = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error('Erro no logout:', error);
      throw error;
    }
  };

  const value = {
    user,
    userProfile,
    loading,
    login,
    register,
    logout
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth deve ser usado dentro de um AuthProvider');
  }
  return context;
}
