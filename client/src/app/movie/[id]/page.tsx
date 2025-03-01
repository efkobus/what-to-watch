'use client';

import { useState, useEffect } from 'react';
import React from 'react'; // Add this import
import Image from 'next/image';
import { useParams } from 'next/navigation'; // Add this import

// Movie details type
interface MovieDetails {
  id: number;
  title: string;
  poster_path: string;
  backdrop_path: string;
  release_date: string;
  runtime: number;
  vote_average: number;
  overview: string;
  media_type: 'movie' | 'tv';
  genres: { id: number; name: string }[];
  credits?: {
    cast: {
      id: number;
      name: string;
      character: string;
      profile_path: string;
    }[];
  };
  videos?: {
    results: {
      id: string;
      key: string;
      name: string;
      site: string;
      type: string;
    }[];
  };
  watchProviders?: {
    flatrate?: { provider_id: number; provider_name: string; logo_path: string }[];
    rent?: { provider_id: number; provider_name: string; logo_path: string }[];
    buy?: { provider_id: number; provider_name: string; logo_path: string }[];
    link?: string;
  };
}

export default function MoviePage() {
  // Replace the params prop with useParams hook
  const params = useParams();
  const movieId = params.id as string;
  
  const [movie, setMovie] = useState<MovieDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [mounted, setMounted] = useState(false);

  // Only run on client-side
  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;
    
    const fetchMovieDetails = async () => {
      setLoading(true);
      
      try {
        const mediaType = localStorage.getItem(`mediaType_${movieId}`) ?? 'movie';
        console.log(`Fetching movie details: /api/movies/${movieId}?type=${mediaType}`);
        
        const response = await fetch(`/api/movies/${movieId}?type=${mediaType}`);
        
        if (!response.ok) {
          const errorText = await response.text();
          console.error(`API Error (${response.status}):`, errorText);
          throw new Error(`Error: ${response.status} - ${errorText}`);
        }
        
        const data = await response.json();
        setMovie(data);
      } catch (err) {
        console.error('Failed to fetch movie details:', err);
        setError(`Failed to load movie details: ${err instanceof Error ? err.message : 'Unknown error'}`);
      } finally {
        setLoading(false);
      }
    };
    
    fetchMovieDetails();
  }, [movieId, mounted]);

  // Don't render on server
  if (!mounted) {
    return <div className="min-h-screen bg-gray-900"></div>;
  }

  // Rest of your component stays the same
  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Your existing JSX remains unchanged */}
      {loading && (
        <div className="flex justify-center items-center min-h-screen">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      )}
      
      {error && (
        <div className="container mx-auto px-4 py-8">
          <div className="bg-red-500/20 border border-red-500 text-white p-4 rounded-lg">
            {error}
          </div>
        </div>
      )}
      
      {movie && !loading && (
        <>
          {/* The rest of your existing JSX stays exactly the same */}
        </>
      )}
    </div>
  );
}