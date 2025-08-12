import type { Metadata } from 'next';
import SearchBar from '@/components/search-bar/search-bar';

export const metadata: Metadata = {
  title: 'RuneDex',
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
        </div>
        {/* Body */}
        <div className="flex justify-center mb-8">
          <SearchBar />
        </div>


      </main>
    </div>
  );
}
