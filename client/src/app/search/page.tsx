'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { MotionDiv } from '@/components/motion-div';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';

// Define types for our movie results
interface Movie {
  id: number;
  title: string;
  poster_path: string;
  release_date: string;
  vote_average: number;
  overview: string;
  media_type?: string;
}

export default function SearchPage() {
  const searchParams = useSearchParams();
  const query = searchParams.get('q') || '';
  
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [mounted, setMounted] = useState(false);
  const [searchTerm, setSearchTerm] = useState(query);

  // Only run on client-side
  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;
    
    const fetchMovies = async () => {
      // Don't search if query is empty
      if (!query) return;
      
      setLoading(true);
      setError('');
      
      try {
        // Using your backend API endpoint for search
        const response = await fetch(`/api/movies/search?query=${encodeURIComponent(query)}`);
        
        if (!response.ok) {
          throw new Error(`Error: ${response.status}`);
        }
        
        const data = await response.json();
        setMovies(data ?? []); // Update this line to handle the direct results array
      } catch (err) {
        console.error('Failed to fetch movies:', err);
        setError('Failed to fetch movies. Please try again later.');
      } finally {
        setLoading(false);
      }
    };
    
    fetchMovies();
  }, [query, mounted]);

  // Don't render anything on the server side
  if (!mounted) {
    return <div className="min-h-screen bg-gray-900"></div>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 relative overflow-hidden">
      <MotionDiv
        animate={{
          background: [
            'linear-gradient(45deg, #1a1a1a, #2d1a1a)',
            'linear-gradient(135deg, #2d1a1a, #1a2d2a)',
            'linear-gradient(225deg, #1a2d2a, #2d1a1a)'
          ]
        }}
        transition={{ duration: 15, repeat: Infinity }}
        className="absolute inset-0 opacity-20"
      />
      <MotionDiv
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-6xl mx-auto px-4 py-16"
      >
        <h1 className="text-4xl md:text-6xl font-bold text-center mb-12 bg-gradient-to-r from-rose-400 via-red-400 to-amber-600 bg-clip-text text-transparent">
          Movie Explorer
        </h1>
        
        <div className="relative group max-w-2xl mx-auto mb-16">
          <Input
            type="text"
            placeholder="Busque por título, gênero ou ator..."
            className="h-16 text-lg rounded-2xl shadow-xl pl-16 pr-6 border-2 border-slate-700 bg-slate-800/50 backdrop-blur-sm text-white hover:border-rose-500/50 transition-colors"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-6 h-6 text-rose-500/80 group-hover:text-rose-400 transition-colors" />
        </div>

        <h1 className="text-3xl font-bold mb-8">
          {query ? `Search Results for "${query}"` : 'Search Movies'}
        </h1>
        
        {loading && (
          <div className="flex justify-center my-12">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        )}
        
        {error && (
          <div className="bg-red-500/20 border border-red-500 text-white p-4 rounded-lg mb-8">
            {error}
          </div>
        )}
        
        {!loading && !error && movies.length === 0 && query && (
          <div className="text-center py-12">
            <p className="text-xl text-gray-300">No movies found for "{query}"</p>
            <p className="mt-4 text-gray-400">Try another search term or check your spelling</p>
          </div>
        )}
        
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {movies.map((movie) => (
            <div key={movie.id} className="bg-gray-800 rounded-lg overflow-hidden shadow-lg transition-transform hover:scale-105">
              <div className="relative h-[300px]">
                {movie.poster_path ? (
                  <Image
                    src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                    alt={movie.title}
                    fill
                    className="object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-gray-700">
                    <p className="text-gray-400">No image available</p>
                  </div>
                )}
                <div className="absolute top-2 right-2 bg-blue-600 text-white text-sm font-semibold px-2 py-1 rounded-md">
                  {movie.vote_average?.toFixed(1)}
                </div>
              </div>
              
              <div className="p-4">
                <h3 className="text-lg font-semibold mb-1 truncate">{movie.title}</h3>
                <p className="text-sm text-gray-400 mb-2">
                  {movie.release_date ? new Date(movie.release_date).getFullYear().toString() : 'Unknown'} 
                  {movie.media_type && ` • ${movie.media_type.charAt(0).toUpperCase() + movie.media_type.slice(1)}`}
                </p>
                <p className="text-sm text-gray-300 line-clamp-2">{movie.overview || 'No description available'}</p>
                <Link 
                  href={`/movie/${movie.id}`} 
                  className="block w-full text-center mt-4 py-2 bg-blue-600 rounded hover:bg-blue-700 transition"
                >
                  Details
                </Link>
              </div>
            </div>
          ))}
        </div>
      </MotionDiv>
    </div>
  );
}