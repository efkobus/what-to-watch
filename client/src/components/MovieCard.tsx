'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { MotionDiv } from '@/components/motion-div';

interface MovieCardProps {
  id: number;
  title: string;
  poster_path?: string | null;
  release_date?: string;
  vote_average?: number;
  media_type: 'movie' | 'tv';
}

const MovieCard: React.FC<MovieCardProps> = ({
  id,
  title,
  poster_path,
  release_date,
  vote_average,
  media_type
}) => {
  const router = useRouter();
  const imageBasePath = 'https://image.tmdb.org/t/p/w500';
  const year = release_date ? new Date(release_date).getFullYear() : '';
  
  const navigateToDetails = () => {
    router.push(`/details/${id}?type=${media_type}`);
  };

  return (
    <MotionDiv
      whileHover={{ scale: 1.05, rotateZ: 0.5 }}
      className="group relative h-[400px] cursor-pointer overflow-hidden rounded-3xl bg-slate-800 shadow-2xl transition-[transform] duration-300 hover:z-10"
      onClick={navigateToDetails}
    >
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-slate-900/90 to-slate-900" />
      
      <div className="absolute inset-0 rounded-[inherit] bg-gradient-to-r from-rose-500/20 to-amber-500/20 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

      {poster_path ? (
        <img
          src={`${imageBasePath}${poster_path}`}
          alt={title}
          className="h-full w-full object-cover"
        />
      ) : (
        <div className="flex items-center justify-center h-full w-full bg-gray-200">
          <span className="text-gray-500">No Image Available</span>
        </div>
      )}

      <div className="absolute bottom-0 left-0 right-0 space-y-2 p-6 text-slate-100">
        <h3 className="text-2xl font-bold drop-shadow-[0_2px_2px_rgba(0,0,0,0.9)]">
          {title}
        </h3>
        <div className="flex items-center gap-2 text-sm">
          <span className="rounded-full bg-rose-500/80 px-3 py-1 font-medium">
            {year}
          </span>
          {vote_average !== undefined && (
            <span className="text-slate-300">
              ★ {vote_average.toFixed(1)}
            </span>
          )}
        </div>
      </div>
    </MotionDiv>
  );
};

export default MovieCard;
