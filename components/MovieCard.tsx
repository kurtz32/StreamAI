import React from 'react';
import { Movie } from '../types';

interface MovieCardProps {
  movie: Movie;
  onClick: (movie: Movie) => void;
  className?: string;
}

const MovieCard: React.FC<MovieCardProps> = ({ movie, onClick, className }) => {
  // Adjusted min-width: 140px ensures two cards fit on a 320px screen (iPhone SE) with gaps
  const imageClass = className || 'h-36 min-w-[140px] w-[140px] md:h-44 md:min-w-[280px] md:w-[280px]';

  return (
    <div 
      className="group relative cursor-pointer flex flex-col gap-2 transition-transform duration-300 md:hover:scale-105"
      onClick={() => onClick(movie)}
    >
      <div className={`${imageClass} relative rounded-md overflow-hidden shadow-lg bg-gray-800`}>
        <img
          src={movie.thumbnailUrl} // Use thumbnailUrl (poster) instead of coverUrl for better performance in grids
          alt={movie.title}
          loading="lazy"
          decoding="async"
          className="w-full h-full object-cover"
        />
      </div>
      
      {/* Always visible details */}
      <div className="px-1 w-full max-w-[140px] md:max-w-[280px]">
         <p className="font-bold text-sm text-white truncate">{movie.title}</p>
         
         <div className="flex items-center gap-2 text-[10px] md:text-[11px] text-gray-400 font-medium mt-1">
           <span className="text-green-400">{movie.matchScore}% Match</span>
           <span>{movie.year}</span>
           <span className="border border-gray-600 px-1 rounded-sm text-[9px] md:text-[10px]">{movie.rating}</span>
         </div>
         
         <div className="text-[10px] md:text-[11px] text-gray-500 truncate mt-0.5">
           {movie.genre.slice(0, 3).join(' • ')}
         </div>
      </div>
    </div>
  );
};

export default MovieCard;