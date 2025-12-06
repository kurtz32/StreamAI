import React from 'react';
import { Movie } from '../types';

interface MovieCardProps {
  movie: Movie;
  onClick: (movie: Movie) => void;
  className?: string;
}

const MovieCard: React.FC<MovieCardProps> = ({ movie, onClick, className }) => {
  // Default: Vertical poster aspect ratio (2:3)
  // Mobile: 130px width, Desktop: 200px width.
  // The 'flex-shrink-0' is vital for horizontal scrolling rows.
  const defaultClass = 'w-[130px] sm:w-[160px] md:w-[200px] aspect-[2/3] flex-shrink-0';
  
  // If className is provided (e.g. from Grid), use that instead of default width/aspect.
  // But ensure rounded/overflow logic persists.
  const containerClass = className || defaultClass;

  return (
    <div 
      className="group relative cursor-pointer flex flex-col gap-2 transition-all duration-300 md:hover:scale-105"
      onClick={() => onClick(movie)}
      role="button"
      tabIndex={0}
    >
      <div className={`${containerClass} relative rounded-md overflow-hidden shadow-lg bg-[#202020]`}>
        <img
          src={movie.thumbnailUrl} 
          alt={movie.title}
          loading="lazy"
          decoding="async"
          className="w-full h-full object-cover transition-opacity duration-500 opacity-90 group-hover:opacity-100"
        />
        
        {/* Hover Overlay - hidden on mobile touch usually, visible on desktop hover */}
        <div className="absolute inset-0 bg-black/20 group-hover:bg-black/0 transition-colors"></div>
      </div>
      
      {/* Details - Constrain width to match the image container if possible, or just let it flow */}
      <div className={`px-1 w-full ${className ? '' : 'w-[130px] sm:w-[160px] md:w-[200px]'}`}>
         <p className="font-bold text-xs md:text-sm text-white truncate">{movie.title}</p>
         
         <div className="flex items-center justify-between text-[10px] md:text-[11px] text-gray-400 font-medium mt-1">
           <span className="text-green-400">{movie.matchScore}% Match</span>
           <span className="border border-gray-600 px-1 rounded-sm text-[9px] md:text-[10px]">{movie.rating}</span>
         </div>
         
         <div className="text-[10px] md:text-[11px] text-gray-500 truncate mt-0.5 hidden sm:block">
           {movie.genre.slice(0, 2).join(' • ')}
         </div>
      </div>
    </div>
  );
};

export default MovieCard;