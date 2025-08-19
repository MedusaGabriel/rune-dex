export interface User {
  id: string;
  email: string;
  role: 'user' | 'admin';
  createdAt: Date;
  updatedAt: Date;
}

export interface Pokemon {
  id: string;
  nome: string;
  kills: number;
  pokelog: string;
  userId: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface AuthUser {
  uid: string;
  email: string | null;
  emailVerified: boolean;
}
