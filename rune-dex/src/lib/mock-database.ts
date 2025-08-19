// Simulação de banco de dados em memória
// Este arquivo demonstra como os dados estão sendo armazenados temporariamente

export interface User {
  id: string;
  username: string;
  password: string; // Em produção, seria um hash
  clan?: string;
  isAdmin: boolean;
  createdAt: Date;
}

export interface Pokemon {
  id: string;
  name: string;
  type: string;
  image: string;
  typeModel: string;
  createdAt: Date;
  createdBy: string; // ID do usuário admin que criou
}

// Simulação de banco de dados em memória
class MockDatabase {
  private users: User[] = [];
  private pokemons: Pokemon[] = [];

  // Métodos para usuários
  addUser(userData: Omit<User, 'id' | 'createdAt'>): User {
    const user: User = {
      ...userData,
      id: Date.now().toString(),
      createdAt: new Date()
    };
    this.users.push(user);
    console.log('Usuário criado:', user);
    return user;
  }

  findUserByUsername(username: string): User | undefined {
    return this.users.find(user => user.username === username);
  }

  authenticateUser(username: string, password: string): User | null {
    const user = this.findUserByUsername(username);
    if (user && user.password === password) {
      console.log('Login realizado:', { username, isAdmin: user.isAdmin });
      return user;
    }
    return null;
  }

  addPokemon(pokemonData: Omit<Pokemon, 'id' | 'createdAt' | 'createdBy'>, createdBy: string): Pokemon {
    const pokemon: Pokemon = {
      ...pokemonData,
      id: Date.now().toString(),
      createdAt: new Date(),
      createdBy
    };
    this.pokemons.push(pokemon);
    console.log('Pokémon cadastrado:', pokemon);
    return pokemon;
  }

  getAllPokemons(): Pokemon[] {
    return this.pokemons;
  }

  getAllUsers(): User[] {
    return this.users;
  }

  // Método para buscar pokémon por nome
  findPokemonByName(name: string): Pokemon | undefined {
    return this.pokemons.find(pokemon => 
      pokemon.name.toLowerCase() === name.toLowerCase()
    );
  }

  // Método para limpar dados (para demonstração)
  clearAll(): void {
    this.users = [];
    this.pokemons = [];
    console.log('Banco de dados limpo');
  }
}

// Instância singleton do mock database
export const mockDB = new MockDatabase();

// Criar usuário admin padrão para testes
mockDB.addUser({
  username: 'admin',
  password: 'admin123',
  clan: 'malefic',
  isAdmin: true
});

export const examples = {
  createUser: () => {
    return mockDB.addUser({
      username: 'admin',
      password: '123456',
      clan: 'malefic',
      isAdmin: true
    });
  },
  
  createPokemon: (adminUserId: string) => {
    return mockDB.addPokemon({
      name: 'pikachu',
      type: 'electric',
      image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/25.png',
      typeModel: '1'
    }, adminUserId);
  },
  
  login: () => {
    return mockDB.authenticateUser('admin', '123456');
  },
  
  viewAll: () => {
    console.log('Usuários:', mockDB.getAllUsers());
    console.log('Pokémons:', mockDB.getAllPokemons());
  }
};

// Disponibilizar no console global para demonstração
if (typeof window !== 'undefined') {
  (window as { mockDB?: MockDatabase; examples?: typeof examples }).mockDB = mockDB;
  (window as { mockDB?: MockDatabase; examples?: typeof examples }).examples = examples;
}
