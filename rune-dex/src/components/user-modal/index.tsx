"use client";

import { useState } from 'react';
import Image from 'next/image';
import { mockDB, User } from '@/lib/mock-database';

interface UserModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUserLogin?: (user: { username: string; isAdmin: boolean } | null) => void;
}

export default function UserModal({ isOpen, onClose, onUserLogin }: UserModalProps) {
  const [mode, setMode] = useState<'login' | 'register' | 'admin' | 'loggedIn'>('login');
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    confirmPassword: '',
    clan: '',
    // Admin form data
    pokemonName: '',
    pokemonType: '',
    pokemonImage: '',
    typeModel: ''
  });

  const clans = [
    'malefic',
    'psycraft',
    'volcanic',
    'raibolt',
    'orebound',
    'naturia',
    'gardestrike',
    'ironhard',
    'wingeon',
    'seavell'
  ];

  const typeModels = ['1', '2', '3', '4', '5'];

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const fetchPokemonData = async (pokemonName: string) => {
    if (!pokemonName.trim()) return;
    
    try {
      const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${pokemonName.toLowerCase()}`);
      if (response.ok) {
        const data = await response.json();
        setFormData(prev => ({
          ...prev,
          pokemonType: data.types.map((t: { type: { name: string } }) => t.type.name).join(', '),
          pokemonImage: data.sprites.front_default || ''
        }));
      }
    } catch (error) {
      console.error('Erro ao buscar dados do Pokémon:', error);
    }
  };

  const handlePokemonNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    setFormData(prev => ({ ...prev, pokemonName: value }));
    
    // Debounce para não fazer muitas requisições
    const timeoutId = setTimeout(() => {
      fetchPokemonData(value);
    }, 500);
    
    return () => clearTimeout(timeoutId);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (mode === 'login') {
      // Tentar fazer login
      const user = mockDB.authenticateUser(formData.username, formData.password);
      
      if (user) {
        setCurrentUser(user);
        setMode('loggedIn');
        onUserLogin?.(user);
        alert(`Login realizado com sucesso! Bem-vindo, ${user.username}`);
        onClose(); // Fechar modal após login
      } else {
        alert('Usuário ou senha incorretos!');
      }
    } else if (mode === 'register') {
      // Validar se as senhas coincidem
      if (formData.password !== formData.confirmPassword) {
        alert('As senhas não coincidem!');
        return;
      }

      // Verificar se usuário já existe
      const existingUser = mockDB.findUserByUsername(formData.username);
      if (existingUser) {
        alert('Usuário já existe! Tente fazer login ou escolha outro nome.');
        return;
      }

      // Criar nova conta
      try {
        const newUser = mockDB.addUser({
          username: formData.username,
          password: formData.password,
          clan: formData.clan,
          isAdmin: false
        });
        alert(`Conta criada com sucesso! Bem-vindo, ${newUser.username}`);
        setCurrentUser(newUser);
        setMode('loggedIn');
        onUserLogin?.(newUser);
        onClose(); // Fechar modal após cadastro
      } catch {
        alert('Erro ao criar conta.');
      }
    } else if (mode === 'admin') {
      // Validar dados do pokémon
      if (!formData.pokemonName || !formData.pokemonType || !formData.typeModel) {
        alert('Preencha todos os campos do Pokémon!');
        return;
      }

      // Cadastrar pokémon
      try {
        const newPokemon = mockDB.addPokemon({
          name: formData.pokemonName,
          type: formData.pokemonType,
          image: formData.pokemonImage,
          typeModel: formData.typeModel
        }, currentUser!.id);
        
        alert(`Pokémon ${newPokemon.name} cadastrado com sucesso!`);
        
        // Limpar apenas os campos do pokémon
        setFormData(prev => ({
          ...prev,
          pokemonName: '',
          pokemonType: '',
          pokemonImage: '',
          typeModel: ''
        }));
      } catch {
        alert('Erro ao cadastrar Pokémon.');
      }
    }
  };

  const resetForm = () => {
    setFormData({
      username: '',
      password: '',
      confirmPassword: '',
      clan: '',
      pokemonName: '',
      pokemonType: '',
      pokemonImage: '',
      typeModel: ''
    });
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setMode('login');
    resetForm();
    onUserLogin?.(null);
    // Force page refresh to reset all states
    window.location.reload();
  };

  const switchMode = (newMode: 'login' | 'register' | 'admin' | 'loggedIn') => {
    setMode(newMode);
    resetForm();
  };

  const handleClose = () => {
    // Só resetar se não estiver logado
    if (!currentUser) {
      setMode('login');
      resetForm();
    }
    onClose();
  };

  if (!isOpen) return null;

  // Função para renderizar o conteúdo baseado no modo
  const renderContent = () => {
    if (mode === 'loggedIn') {
      return (
        <div className="p-6">
          <div className="text-center mb-6">
            <h3 className="text-xl font-semibold text-gray-800 mb-2">
              Bem-vindo, {currentUser?.username}!
            </h3>
            <p className="text-gray-600">
              {currentUser?.clan && `Clan: ${currentUser.clan}`}
            </p>
          </div>
          
          <div className="space-y-3">
            {currentUser?.isAdmin && (
              <button
                onClick={() => setMode('admin')}
                className="w-full bg-red-500 text-white py-2 px-4 rounded-md hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500 font-medium"
              >
                🔧 Área Administrativa
              </button>
            )}
            
            <button
              onClick={handleLogout}
              className="w-full bg-gray-500 text-white py-2 px-4 rounded-md hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-500 font-medium"
            >
              Sair
            </button>
          </div>
        </div>
      );
    }

    return (
      <>
        {/* Mode Switch - apenas se não estiver logado */}
        {mode !== 'admin' && (
          <div className="flex border-b border-gray-200">
            <button
              onClick={() => switchMode('login')}
              className={`flex-1 py-3 px-4 text-center font-medium ${
                mode === 'login'
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Login
            </button>
            <button
              onClick={() => switchMode('register')}
              className={`flex-1 py-3 px-4 text-center font-medium ${
                mode === 'register'
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Cadastrar
            </button>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Campos de login/cadastro */}
          {mode !== 'admin' && (
            <>
              <div>
                <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-1">
                  Usuário
                </label>
                <input
                  type="text"
                  id="username"
                  name="username"
                  value={formData.username}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-black rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                  Senha
                </label>
                <input
                  type="password"
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-black rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              {mode === 'register' && (
                <>
                  <div>
                    <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
                      Confirmar Senha
                    </label>
                    <input
                      type="password"
                      id="confirmPassword"
                      name="confirmPassword"
                      value={formData.confirmPassword}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-black rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </div>

                  <div>
                    <label htmlFor="clan" className="block text-sm font-medium text-gray-700 mb-1">
                      Clan
                    </label>
                    <select
                      id="clan"
                      name="clan"
                      value={formData.clan}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-black rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    >
                      <option value="">Selecione um clan</option>
                      {clans.map((clan) => (
                        <option key={clan} value={clan}>
                          {clan}
                        </option>
                      ))}
                    </select>
                  </div>
                </>
              )}
            </>
          )}

          {/* Área Admin */}
          {mode === 'admin' && (
            <>
              <div className="border-b border-gray-200 pb-4 mb-4">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-semibold text-gray-800">Área Administrativa</h3>
                  <button
                    type="button"
                    onClick={() => setMode('loggedIn')}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    ← Voltar
                  </button>
                </div>
                <p className="text-gray-600 text-sm mt-1">
                  Logado como: {currentUser?.username}
                </p>
              </div>
              
              <h4 className="text-md font-semibold text-gray-800 mb-3">Cadastrar Pokémon</h4>
              
              <div>
                <label htmlFor="pokemonName" className="block text-sm font-medium text-gray-700 mb-1">
                  Nome
                </label>
                <input
                  type="text"
                  id="pokemonName"
                  name="pokemonName"
                  value={formData.pokemonName}
                  onChange={handlePokemonNameChange}
                  className="w-full px-3 py-2 border border-black rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Digite o nome do Pokémon"
                />
              </div>

              <div>
                <label htmlFor="pokemonType" className="block text-sm font-medium text-gray-700 mb-1">
                  Type (automático)
                </label>
                <input
                  type="text"
                  id="pokemonType"
                  name="pokemonType"
                  value={formData.pokemonType}
                  readOnly
                  className="w-full px-3 py-2 border border-black rounded-md bg-gray-100 text-gray-600"
                  placeholder="Será preenchido automaticamente"
                />
              </div>

              <div>
                <label htmlFor="pokemonImage" className="block text-sm font-medium text-gray-700 mb-1">
                  Imagem (automática)
                </label>
                <input
                  type="text"
                  id="pokemonImage"
                  name="pokemonImage"
                  value={formData.pokemonImage}
                  readOnly
                  className="w-full px-3 py-2 border border-black rounded-md bg-gray-100 text-gray-600"
                  placeholder="URL será preenchida automaticamente"
                />
                {formData.pokemonImage && (
                  <div className="mt-2">
                    <Image
                      src={formData.pokemonImage}
                      alt={formData.pokemonName}
                      width={80}
                      height={80}
                      className="object-contain border border-gray-300 rounded"
                    />
                  </div>
                )}
              </div>

              <div>
                <label htmlFor="typeModel" className="block text-sm font-medium text-gray-700 mb-1">
                  Type Model
                </label>
                <select
                  id="typeModel"
                  name="typeModel"
                  value={formData.typeModel}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-black rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Selecione um modelo</option>
                  {typeModels.map((model) => (
                    <option key={model} value={model}>
                      Modelo {model}
                    </option>
                  ))}
                </select>
              </div>
            </>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium"
          >
            {mode === 'login' && 'Entrar'}
            {mode === 'register' && 'Cadastrar'}
            {mode === 'admin' && 'Salvar Pokémon'}
          </button>
        </form>
      </>
    );
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={handleClose}>
      <div 
        className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4 max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b border-gray-200">
          <h2 className="text-2xl font-bold text-gray-800">
            {mode === 'login' && 'Login'}
            {mode === 'register' && 'Cadastro'}
            {mode === 'admin' && 'Administração'}
            {mode === 'loggedIn' && 'Perfil'}
          </h2>
          <button
            onClick={handleClose}
            className="text-gray-500 hover:text-gray-700 text-2xl"
          >
            ×
          </button>
        </div>

        {renderContent()}
      </div>
    </div>
  );
}
