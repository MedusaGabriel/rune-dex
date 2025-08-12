import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'RuneDex - Calculadora de Runas PXG',
  description: 'Sua calculadora definitiva para o sistema de runas do PXG. Gerencie seu progresso e planeje suas metas com facilidade.',
};

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900">
      <main className="container mx-auto px-4 py-16">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-6xl font-bold text-white mb-4">
            Rune<span className="text-yellow-400">Dex</span>
          </h1>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            Sua calculadora definitiva para o sistema de runas do PXG. 
            Gerencie seu progresso e planeje suas metas com facilidade.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 text-center">
            <div className="text-4xl mb-4">🔍</div>
            <h3 className="text-xl font-semibold text-white mb-2">
              Pesquisar Pokémon
            </h3>
            <p className="text-gray-300">
              Encontre qualquer Pokémon e visualize suas informações completas
            </p>
          </div>

          <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 text-center">
            <div className="text-4xl mb-4">📊</div>
            <h3 className="text-xl font-semibold text-white mb-2">
              Calcular Pokelog
            </h3>
            <p className="text-gray-300">
              Descubra quanto pokelog você possui e quanto precisa farmar
            </p>
          </div>

          <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 text-center">
            <div className="text-4xl mb-4">🎯</div>
            <h3 className="text-xl font-semibold text-white mb-2">
              Definir Metas
            </h3>
            <p className="text-gray-300">
              Planeje seu progresso e acompanhe suas metas de runas
            </p>
          </div>
        </div>

        {/* Call to Action */}
        <div className="text-center">
          <div className="bg-white/5 backdrop-blur-lg rounded-xl p-8 max-w-lg mx-auto">
            <h2 className="text-2xl font-bold text-white mb-4">
              Pronto para começar?
            </h2>
            <p className="text-gray-300 mb-6">
              Comece a gerenciar suas runas agora mesmo!
            </p>
            <button className="bg-yellow-400 hover:bg-yellow-500 text-black font-semibold px-8 py-3 rounded-lg transition-colors">
              Começar Agora
            </button>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-16 text-gray-400">
          <p>
            Feito com ❤️ para a comunidade PXG
          </p>
        </div>
      </main>
    </div>
  );
}
