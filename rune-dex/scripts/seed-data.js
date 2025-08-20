/**
 * Script para adicionar dados de exemplo ao Firestore
 * Execute: npm run seed-data
 */

import { initializeApp } from 'firebase/app';
import { getFirestore, collection, addDoc } from 'firebase/firestore';

const firebaseConfig = {
  // Adicione sua configuração aqui
  apiKey: "AIzaSyBEMgy8lNiyCP67tQXBuYEGZ2JzazYnxBw",
  authDomain: "rune-dex.firebaseapp.com",
  projectId: "rune-dex",
  storageBucket: "rune-dex.firebasestorage.app",
  messagingSenderId: "281609770735",
  appId: "1:281609770735:web:154418fb397b1cda3fad1a"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const examplePokemons = [
  {
    nome: "Pikachu",
    kills: 150,
    pokelog: "Pokémon elétrico muito rápido, ótimo para battles rápidos",
    userId: "example_user_id" // Substitua pelo ID de um usuário real
  },
  {
    nome: "Charizard",
    kills: 200,
    pokelog: "Dragão de fogo poderoso, excelente para raids",
    userId: "example_user_id"
  },
  {
    nome: "Blastoise",
    kills: 175,
    pokelog: "Tanque de água resistente, boa defesa",
    userId: "example_user_id"
  }
];

async function seedData() {
  try {
    console.log('Adicionando dados de exemplo...');
    
    for (const pokemon of examplePokemons) {
      const docRef = await addDoc(collection(db, 'pokemons'), {
        ...pokemon,
        createdAt: new Date(),
        updatedAt: new Date()
      });
      console.log(`Pokémon ${pokemon.nome} adicionado com ID: ${docRef.id}`);
    }
    
    console.log('Dados de exemplo adicionados com sucesso!');
  } catch (error) {
    console.error('Erro ao adicionar dados:', error);
  }
}

seedData();
