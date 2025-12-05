import React from 'react';
import { Play, Info } from 'lucide-react';
import { Movie } from '../types';

interface HeroProps {
  movie: Movie | null;
  onPlay: () => void;
  onMoreInfo: () => void;
}

const Hero: React.FC<HeroProps> = ({ movie, onPlay, onMoreInfo }) => {
  if (!movie) return <div className="h-[60vh] md:h-[80vh] w-full bg-[#141414] animate-pulse"></div>;

  return (
    <div className="relative h-[60vh] md:h-[80vh] w-full">
      {/* Background Image */}
      <div className="absolute inset-0">
        <img 
          src={movie.coverUrl} 
          alt={movie.title}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#141414] via-[#141414]/50 md:via-transparent to-transparent"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-[#141414] via-transparent to-transparent"></div>
      </div>

      {/* Content */}
      <div className="absolute bottom-20 md:top-[35%] left-4 md:left-12 max-w-xl space-y-3 md:space-y-4">
        <h1 className="text-3xl md:text-6xl font-bold drop-shadow-lg text-white leading-tight">
          {movie.title}
        </h1>
        
        <div className="flex items-center gap-3 text-xs md:text-base text-gray-300 font-medium">
          <span className="text-green-400 font-bold">{movie.matchScore}% Match</span>
          <span>{movie.year}</span>
          <span className="border border-gray-500 px-1 text-[10px] md:text-xs rounded">{movie.rating}</span>
          <span>{movie.duration}</span>
        </div>

        <p className="text-sm md:text-lg text-gray-200 drop-shadow-md line-clamp-3 max-w-[90%] md:max-w-full">
          {movie.description}
        </p>

        <div className="flex items-center gap-3 pt-2 md:pt-4">
          <button 
            onClick={onPlay}
            className="flex items-center gap-2 bg-white text-black px-4 md:px-8 py-2 md:py-3 rounded font-bold hover:bg-opacity-90 transition text-sm md:text-base"
          >
            <Play fill="currentColor" size={18} className="md:w-5 md:h-5" />
            Play
          </button>
          <button 
            onClick={onMoreInfo}
            className="flex items-center gap-2 bg-gray-500/70 text-white px-4 md:px-8 py-2 md:py-3 rounded font-bold hover:bg-gray-500/50 transition backdrop-blur-sm text-sm md:text-base"
          >
            <Info size={18} className="md:w-5 md:h-5" />
            More Info
          </button>
        </div>
      </div>
    </div>
  );
};

export default Hero;