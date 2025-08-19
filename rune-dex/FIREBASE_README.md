# RuneDex - Sistema Firebase

Sistema completo de autenticação e gerenciamento usando Firebase, Next.js e TypeScript.

## Funcionalidades Implementadas

### 🔐 Autenticação
- Login e cadastro com email/senha
- Proteção de rotas
- Gerenciamento de sessões
- Logout seguro

### 👥 Sistema de Usuários
- Perfis de usuário com roles (user/admin)
- Painel administrativo para gerenciar usuários
- Alteração de permissões em tempo real

### 🎯 Gerenciamento de Pokémons
- CRUD completo de Pokémons
- Cada usuário gerencia seus próprios Pokémons
- Campos: nome, kills, pokelog
- Interface intuitiva com modais

### 🛡️ Proteção de Rotas
- Middleware automático de autenticação
- Proteção baseada em roles
- Redirecionamentos automáticos

## Configuração

### 1. Variáveis de Ambiente

Copie o arquivo `.env.local.example` para `.env.local` e configure suas variáveis do Firebase:

\`\`\`bash
cp .env.local.example .env.local
\`\`\`

Configure as seguintes variáveis no `.env.local`:

\`\`\`env
NEXT_PUBLIC_FIREBASE_API_KEY=sua_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=seu_projeto.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=seu_projeto_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=seu_projeto.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=seu_messaging_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=seu_app_id
\`\`\`

### 2. Configuração do Firebase

1. Acesse o [Console Firebase](https://console.firebase.google.com/)
2. Crie um novo projeto ou use um existente
3. Ative Authentication > Sign-in method > Email/Password
4. Ative Firestore Database
5. Configure as regras do Firestore:

\`\`\`javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Regras para usuários
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
      allow read: if request.auth != null && 
        resource.data.role == 'admin' || 
        request.auth.token.role == 'admin';
    }
    
    // Regras para pokémons
    match /pokemons/{pokemonId} {
      allow read, write: if request.auth != null && 
        (request.auth.uid == resource.data.userId || 
         request.auth.uid == request.resource.data.userId);
    }
  }
}
\`\`\`

### 3. Instalação e Execução

\`\`\`bash
# Instalar dependências
npm install

# Executar em desenvolvimento
npm run dev
\`\`\`

## Estrutura do Projeto

\`\`\`
src/
├── app/
│   ├── layout.tsx          # Layout principal com AuthProvider
│   ├── page.tsx            # Dashboard principal
│   ├── login/
│   │   └── page.tsx        # Página de login/cadastro
│   ├── admin/
│   │   └── page.tsx        # Painel administrativo
│   └── pokemons/
│       └── page.tsx        # Gerenciamento de Pokémons
├── components/
│   ├── navbar/             # Barra de navegação
│   └── protected-route/    # Componente de proteção de rotas
├── hooks/
│   ├── useAuth.tsx         # Hook de autenticação
│   └── useFirestore.ts     # Hook para operações no Firestore
├── lib/
│   └── firebase.ts         # Configuração do Firebase
└── types/
    └── firebase.ts         # Tipos TypeScript
\`\`\`

## Rotas

- \`/\` - Dashboard principal (protegida)
- \`/login\` - Login e cadastro
- \`/pokemons\` - Gerenciamento de Pokémons (protegida)
- \`/admin\` - Painel administrativo (apenas admins)

## Hooks Disponíveis

### useAuth()
\`\`\`typescript
const { user, userProfile, loading, login, register, logout } = useAuth();
\`\`\`

### useFirestore()
\`\`\`typescript
const { 
  createDocument, 
  getDocument, 
  getDocuments, 
  updateDocument, 
  deleteDocument, 
  getUserDocuments 
} = useFirestore();
\`\`\`

## Dados de Exemplo

### Estrutura do Usuário
\`\`\`typescript
{
  id: string;
  email: string;
  role: 'user' | 'admin';
  createdAt: Date;
  updatedAt: Date;
}
\`\`\`

### Estrutura do Pokémon
\`\`\`typescript
{
  id: string;
  nome: string;
  kills: number;
  pokelog: string;
  userId: string;
  createdAt: Date;
  updatedAt: Date;
}
\`\`\`

## Funcionalidades por Página

### Dashboard (/)
- Visão geral do sistema
- Links rápidos para funcionalidades
- Informações do perfil do usuário

### Login (/login)
- Formulário unificado de login/cadastro
- Validação de campos
- Tratamento de erros
- Redirecionamento automático

### Pokémons (/pokemons)
- Lista de Pokémons do usuário
- Adicionar novo Pokémon
- Editar Pokémon existente
- Excluir Pokémon
- Interface responsiva

### Admin (/admin)
- Lista todos os usuários
- Alterar role de usuários
- Apenas acessível por administradores
- Atualização em tempo real

## Próximos Passos

1. Configure suas variáveis de ambiente do Firebase
2. Execute o projeto localmente
3. Crie sua primeira conta (será automaticamente do tipo 'user')
4. Para ter um admin, altere manualmente no console do Firebase o campo 'role' de um usuário para 'admin'
5. Teste todas as funcionalidades!

## Segurança

- Todas as rotas são protegidas por autenticação
- Roles são verificados tanto no frontend quanto nas regras do Firestore
- Dados são isolados por usuário
- Validação de permissões em tempo real
