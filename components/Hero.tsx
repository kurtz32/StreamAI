import React from 'react';
import { Play, Info } from 'lucide-react';
import { Movie } from '../types';

interface HeroProps {
  movie: Movie | null;
  onPlay: () => void;
  onMoreInfo: () => void;
}

const Hero: React.FC<HeroProps> = ({ movie, onPlay, onMoreInfo }) => {
  if (!movie) return <div className="h-[50vh] md:h-[80vh] w-full bg-[#141414] animate-pulse"></div>;

  return (
    <div className="relative h-[60vh] sm:h-[65vh] md:h-[85vh] w-full">
      {/* Background Image */}
      <div className="absolute inset-0">
        <img 
          src={movie.coverUrl} 
          alt={movie.title}
          className="w-full h-full object-cover object-top"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#141414] via-[#141414]/40 md:via-transparent to-transparent"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-[#141414] via-[#141414]/20 to-transparent"></div>
        {/* Extra bottom fade for mobile legibility */}
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-[#141414] to-transparent md:hidden"></div>
      </div>

      {/* Content */}
      <div className="absolute bottom-8 sm:bottom-24 md:top-[30%] left-4 sm:left-8 md:left-12 max-w-[95%] sm:max-w-lg md:max-w-2xl space-y-3 md:space-y-5 z-20">
        <h1 className="text-3xl sm:text-4xl md:text-6xl lg:text-7xl font-bold drop-shadow-lg text-white leading-tight">
          {movie.title}
        </h1>
        
        <div className="flex items-center gap-3 text-xs sm:text-sm md:text-base text-gray-300 font-medium">
          <span className="text-green-400 font-bold">{movie.matchScore}% Match</span>
          <span>{movie.year}</span>
          <span className="border border-gray-500 px-1.5 py-0.5 text-[10px] md:text-xs rounded text-gray-200 bg-black/30">{movie.rating}</span>
          <span>{movie.duration}</span>
        </div>

        {/* Constrain text more aggressively on mobile (line-clamp-2) to prevent pushing buttons off screen */}
        <p className="text-sm sm:text-base md:text-lg text-gray-200 drop-shadow-md line-clamp-2 md:line-clamp-4 max-w-full md:max-w-[80%] leading-relaxed">
          {movie.description}
        </p>

        <div className="flex items-center gap-3 pt-2 md:pt-4 pb-2">
          <button 
            onClick={onPlay}
            className="flex items-center gap-2 bg-white text-black px-5 py-2 md:px-8 md:py-3 rounded font-bold hover:bg-gray-200 transition text-sm md:text-lg active:scale-95 transform"
          >
            <Play fill="currentColor" size={18} className="md:w-6 md:h-6" />
            Play
          </button>
          <button 
            onClick={onMoreInfo}
            className="flex items-center gap-2 bg-gray-600/70 text-white px-5 py-2 md:px-8 md:py-3 rounded font-bold hover:bg-gray-600/50 transition backdrop-blur-md text-sm md:text-lg active:scale-95 transform"
          >
            <Info size={18} className="md:w-6 md:h-6" />
            More Info
          </button>
        </div>
      </div>
    </div>
  );
};

export default Hero;