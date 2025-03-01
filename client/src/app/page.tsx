'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function Home() {
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchTerm)}`);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black text-white">
      <div className="container mx-auto px-4 py-16">
        <div className="flex flex-col items-center justify-center space-y-8 pt-20">
          <h1 className="text-4xl md:text-6xl font-bold text-center">
            Movie Searcher
          </h1>
          <p className="text-xl text-center text-gray-300 max-w-2xl">
            Discover movies and TV shows with our AI-powered search platform
          </p>
          
          <form onSubmit={handleSearch} className="w-full max-w-md mt-8">
            <div className="relative">
              <input
                type="text"
                placeholder="Search for movies or TV shows..."
                className="w-full px-4 py-3 rounded-full bg-white/10 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 text-white"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <button 
                type="submit"
                className="absolute right-1 top-1 px-4 py-2 bg-blue-600 rounded-full hover:bg-blue-700 transition"
                disabled={loading}
              >
                {loading ? 'Searching...' : 'Search'}
              </button>
            </div>
          </form>
          
          <div className="mt-10 grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div className="p-6 bg-gray-800 rounded-lg">
              <h3 className="text-xl font-semibold mb-3">Advanced Search</h3>
              <p className="text-gray-400">Find exactly what you're looking for with powerful filters</p>
            </div>
            <div className="p-6 bg-gray-800 rounded-lg">
              <h3 className="text-xl font-semibold mb-3">AI Recommendations</h3>
              <p className="text-gray-400">Get personalized suggestions based on your interests</p>
            </div>
            <div className="p-6 bg-gray-800 rounded-lg">
              <h3 className="text-xl font-semibold mb-3">Detailed Information</h3>
              <p className="text-gray-400">Access comprehensive details about any movie or TV show</p>
            </div>
          </div>
          
          <div className="mt-8">
            <Link 
              href="/login" 
              className="text-blue-400 hover:text-blue-300 transition"
            >
              Login
            </Link>
            {' or '}
            <Link 
              href="/register" 
              className="text-blue-400 hover:text-blue-300 transition"
            >
              Register
            </Link>
            {' for a personalized experience'}
          </div>
        </div>
      </div>
    </div>
  );
}
