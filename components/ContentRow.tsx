import React, { useRef, useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Movie } from '../types';
import MovieCard from './MovieCard';

interface ContentRowProps {
  title: string;
  movies: Movie[];
  onMovieClick: (movie: Movie) => void;
}

const ContentRow: React.FC<ContentRowProps> = ({ title, movies, onMovieClick }) => {
  const rowRef = useRef<HTMLDivElement>(null);
  const [isMoved, setIsMoved] = useState(false);

  const handleClick = (direction: 'left' | 'right') => {
    setIsMoved(true);
    if (rowRef.current) {
      const { scrollLeft, clientWidth } = rowRef.current;
      const scrollTo = direction === 'left' 
        ? scrollLeft - clientWidth 
        : scrollLeft + clientWidth;
      
      rowRef.current.scrollTo({ left: scrollTo, behavior: 'smooth' });
    }
  };

  return (
    <div className="space-y-2 px-4 md:px-12 my-6 md:my-10 relative group">
      <h2 className="text-gray-200 text-base md:text-xl font-semibold transition hover:text-white cursor-pointer mb-2 md:mb-3">
        {title}
      </h2>
      
      <div className="relative group/row">
        {/* Hide arrows on mobile, they interfere with touch scrolling */}
        <ChevronLeft 
          className={`hidden md:block absolute top-0 bottom-0 left-2 z-40 m-auto h-9 w-9 cursor-pointer opacity-0 transition hover:scale-125 group-hover/row:opacity-100 bg-black/50 rounded-full p-1 ${!isMoved && 'hidden'}`}
          onClick={() => handleClick('left')}
        />

        <div 
          ref={rowRef}
          className="flex items-start space-x-3 md:space-x-4 overflow-x-scroll no-scrollbar pb-4 pt-2"
        >
          {movies.map((movie) => (
            <MovieCard key={movie.id} movie={movie} onClick={onMovieClick} />
          ))}
        </div>

        <ChevronRight 
          className="hidden md:block absolute top-0 bottom-0 right-2 z-40 m-auto h-9 w-9 cursor-pointer opacity-0 transition hover:scale-125 group-hover/row:opacity-100 bg-black/50 rounded-full p-1"
          onClick={() => handleClick('right')}
        />
      </div>
    </div>
  );
};

export default ContentRow;