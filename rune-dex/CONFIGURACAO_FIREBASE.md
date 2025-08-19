# 🔥 Configuração do Firebase Console - Passo a Passo

## ✅ Suas credenciais já estão configuradas!

Suas credenciais do Firebase já foram configuradas no projeto. Agora você precisa configurar o Firebase Console.

## 📋 Próximos Passos no Firebase Console

### 1. 🔐 Ativar Authentication

1. Acesse o [Firebase Console](https://console.firebase.google.com/)
2. Selecione seu projeto **rune-dex**
3. No menu lateral, clique em **Authentication**
4. Clique na aba **Sign-in method**
5. Clique em **Email/Password**
6. **Ative** a opção "Email/Password"
7. **NÃO** ative "Email link (passwordless sign-in)" por enquanto
8. Clique em **Save**

### 2. 📊 Configurar Firestore Database

1. No menu lateral do Firebase Console, clique em **Firestore Database**
2. Clique em **Create database**
3. Escolha **Start in test mode** (temporariamente)
4. Escolha a localização mais próxima (ex: `southamerica-east1` para Brasil)
5. Clique em **Done**

### 3. 📝 Configurar Regras do Firestore

Após criar o database, vá para a aba **Rules** e substitua as regras por:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Regras para usuários
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
      allow read: if request.auth != null;
    }
    
    // Regras para pokémons
    match /pokemons/{pokemonId} {
      allow read, write: if request.auth != null && 
        (request.auth.uid == resource.data.userId || 
         request.auth.uid == request.resource.data.userId);
      allow read: if request.auth != null;
    }
  }
}
```

Clique em **Publish** para salvar as regras.

### 4. 🔍 Configurar Índices (se necessário)

**⚠️ IMPORTANTE: O que são Índices do Firestore?**

Os índices do Firestore **não têm nada a ver** com a PokéAPI ou com colunas de Pokémons. Eles são para **otimizar consultas no banco de dados**.

**Por que você precisa de um índice para ver seus pokémons?**

1. **Você salva pokémons personalizados** no Firestore (nome, kills, pokelog)
2. **Para listar seus pokémons**, o sistema faz uma consulta que:
   - Filtra por `userId` (só seus pokémons)
   - Ordena por `updatedAt` (mais recentes primeiro)
3. **Consultas com filtro + ordenação** precisam de índice composto
4. **O índice é criado automaticamente** quando você clica no link do erro

**Como resolver se aparecer erro de índice:**

1. **Copie o link completo** que aparece no erro do console
   ```
   Exemplo: https://console.firebase.google.com/v1/r/project/rune-dex/firestore/indexes?create_composite=...
   ```

2. **Cole no navegador** para ir direto para a criação do índice

3. **Você verá uma tela assim:**
   ```
   Collection: pokemons
   Fields:
   - userId (Ascending)
   - updatedAt (Descending) 
   - __name__ (Ascending)
   ```

4. **Clique em "Create Index"**

5. **Aguarde 2-5 minutos** para o índice ser criado (aparecerá uma barra de progresso)

6. **Recarregue a página** dos Pokémons

**❓ FAQ sobre Índices:**

- **P: Isso afeta a PokéAPI?** R: Não, são coisas completamente separadas
- **P: Preciso criar colunas manualmente?** R: Não, o Firestore cria automaticamente
- **P: É sobre estrutura de dados dos pokémons?** R: Não, é sobre performance de consultas
- **P: Vou pagar por isso?** R: Não, índices básicos são gratuitos no Firebase

> **Resumo:** É só uma otimização técnica para que a página de pokémons carregue rápido. Nada a ver com conteúdo ou estrutura dos pokémons!

## 🚀 Testando o Sistema

1. **Acesse:** http://localhost:3000
2. **Será redirecionado para:** `/login`
3. **Crie sua primeira conta** usando o formulário
4. **Faça login** e explore o sistema!

## 👨‍💼 Como criar um usuário Admin

1. **Crie uma conta normal** primeiro
2. **Vá para o Firestore Database** no console
3. **Navegue para a coleção `users`**
4. **Encontre seu usuário** (pelo email)
5. **Edite o documento** e altere o campo `role` de `"user"` para `"admin"`
6. **Salve as alterações**
7. **Faça logout e login novamente** para aplicar as mudanças

## 🎯 Funcionalidades para Testar

### Como Usuário Normal:
- ✅ Fazer login/logout
- ✅ Visualizar dashboard
- ✅ Gerenciar Pokémons (criar, editar, excluir)
- ❌ Não consegue acessar `/admin`

### Como Admin:
- ✅ Todas as funcionalidades de usuário normal
- ✅ Acessar painel administrativo (`/admin`)
- ✅ Visualizar todos os usuários
- ✅ Alterar roles de outros usuários

## 🔧 Estrutura Criada Automaticamente

Quando você criar o primeiro usuário, o Firestore criará automaticamente:

### Coleção `users`:
```
users/
├── [uid-do-usuario]/
│   ├── email: "seu@email.com"
│   ├── role: "user"
│   ├── createdAt: timestamp
│   └── updatedAt: timestamp
```

### Coleção `pokemons` (quando adicionar o primeiro):
```
pokemons/
├── [id-aleatorio]/
│   ├── nome: "Nome do Pokemon"
│   ├── kills: 100
│   ├── pokelog: "Descrição"
│   ├── userId: "uid-do-usuario"
│   ├── createdAt: timestamp
│   └── updatedAt: timestamp
```

## ⚠️ Importante

- **NÃO compartilhe** suas credenciais do Firebase publicamente
- **Mantenha** o arquivo `.env.local` no `.gitignore`
- **Use regras de segurança** adequadas no Firestore
- **Monitore** o uso no Firebase Console

## 🎉 Pronto!

Após seguir esses passos, seu sistema estará 100% funcional com:
- ✅ Autenticação completa
- ✅ Base de dados em tempo real
- ✅ Sistema de roles
- ✅ Proteção de rotas
- ✅ Interface completa

**Divirta-se testando o sistema!** 🚀
