'use client';

import React from 'react';
import MovieCard from './MovieCard';

interface Movie {
  id: number;
  title?: string;
  name?: string;
  poster_path: string | null;
  release_date?: string;
  first_air_date?: string;
  vote_average: number;
  media_type: 'movie' | 'tv';
}

interface MovieGridProps {
  movies: Movie[];
}

const MovieGrid: React.FC<MovieGridProps> = ({ movies }) => {
  if (!movies || movies.length === 0) {
    return (
      <div className="flex justify-center items-center min-h-32 mt-8">
        <p className="text-gray-500">No results found</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6 mt-8">
      {movies.map((movie) => (
        <MovieCard
          key={movie.id}
          id={movie.id}
          title={movie.title || movie.name || 'Unknown Title'}
          poster_path={movie.poster_path}
          release_date={movie.release_date || movie.first_air_date}
          vote_average={movie.vote_average}
          media_type={movie.media_type}
        />
      ))}
    </div>
  );
};

export default MovieGrid;
