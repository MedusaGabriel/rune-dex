"use client";

import { useState } from 'react';

interface UserHeaderProps {
  currentUser: { username: string; isAdmin: boolean } | null;
  onAdminAccess: () => void;
  onLogout: () => void;
}

export default function UserHeader({ currentUser, onAdminAccess, onLogout }: UserHeaderProps) {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  if (!currentUser) return null;

  return (
    <div className="fixed top-4 right-4 z-50">
      <div className="relative">
        {/* Header com nome do usuário */}
        <button
          onClick={() => setIsDropdownOpen(!isDropdownOpen)}
          className="flex items-center space-x-3 bg-white/10 backdrop-blur-lg border border-white/20 rounded-full px-4 py-2 hover:bg-white/20 transition-all"
        >
          <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              className="text-white"
            >
              <path
                d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"
                fill="currentColor"
              />
            </svg>
          </div>
          <div className="text-left">
            <div className="text-white font-medium text-sm">{currentUser.username}</div>
            {currentUser.isAdmin && (
              <div className="text-yellow-300 text-xs">Administrador</div>
            )}
          </div>
          <svg
            className={`w-4 h-4 text-white transition-transform ${
              isDropdownOpen ? 'rotate-180' : ''
            }`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>

        {/* Dropdown */}
        {isDropdownOpen && (
          <div className="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-xl border border-gray-200 py-2">
            {/* Informações do usuário */}
            <div className="px-4 py-3 border-b border-gray-200">
              <div className="text-sm font-medium text-gray-900">{currentUser.username}</div>
              <div className="text-xs text-gray-500">
                {currentUser.isAdmin ? 'Administrador' : 'Usuário'}
              </div>
            </div>

            {/* Opções para admin */}
            {currentUser.isAdmin && (
              <div className="py-1">
                <button
                  onClick={() => {
                    onAdminAccess();
                    setIsDropdownOpen(false);
                  }}
                  className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center space-x-2"
                >
                  <span>⚙️</span>
                  <span>Área Administrativa</span>
                </button>
              </div>
            )}

            {/* Opções comuns */}
            <div className="py-1 border-t border-gray-200">
              <button
                onClick={() => {
                  onLogout();
                  setIsDropdownOpen(false);
                }}
                className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center space-x-2"
              >
                <span>🚪</span>
                <span>Sair</span>
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Overlay para fechar dropdown */}
      {isDropdownOpen && (
        <div
          className="fixed inset-0 z-[-1]"
          onClick={() => setIsDropdownOpen(false)}
        />
      )}
    </div>
  );
}
