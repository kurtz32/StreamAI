import React, { useEffect, useState } from 'react';
import { X, Play, Plus, ThumbsUp, Volume2, VolumeX, Youtube, Check } from 'lucide-react';
import { Movie, CastMember } from '../types';
import { fetchCast, fetchTrailer } from '../services/tmdb';

interface DetailsModalProps {
  movie: Movie;
  onClose: () => void;
  onPlay: () => void;
  isBookmarked: boolean;
  onToggleMyList: () => void;
}

const DetailsModal: React.FC<DetailsModalProps> = ({ movie, onClose, onPlay, isBookmarked, onToggleMyList }) => {
  const [muted, setMuted] = useState(true);
  const [cast, setCast] = useState<CastMember[]>([]);
  const [trailerKey, setTrailerKey] = useState<string | null>(null);
  const [showTrailer, setShowTrailer] = useState(false);

  useEffect(() => {
    // Reset state immediately when movie changes
    setTrailerKey(null);
    setShowTrailer(false);
    setCast([]);

    const loadDetails = async () => {
      const type = movie.mediaType || 'movie';
      // Use the ID directly, assuming it's valid for TMDB
      // If it's a mock ID, these calls will fail gracefully and return null/empty
      const [castData, trailerData] = await Promise.all([
        fetchCast(movie.id, type),
        fetchTrailer(movie.id, type)
      ]);
      setCast(castData);
      setTrailerKey(trailerData);
    };

    if (movie.id) {
      loadDetails();
    }
  }, [movie]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-0 md:p-4 overflow-y-auto">
      <div className="relative w-full h-full md:h-auto md:max-w-4xl bg-[#181818] md:rounded-lg shadow-2xl overflow-y-auto md:overflow-hidden animate-fade-in-up">
        
        {/* Close Button */}
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 z-20 bg-[#181818]/80 p-2 rounded-full hover:bg-gray-700 transition"
        >
          <X size={24} />
        </button>

        {/* Video/Image Hero Section */}
        <div className="relative h-[35vh] md:h-[450px] w-full bg-black">
           {showTrailer && trailerKey ? (
             <iframe
               className="w-full h-full"
               src={`https://www.youtube.com/embed/${trailerKey}?autoplay=1&mute=${muted ? 1 : 0}&controls=1&modestbranding=1&rel=0`}
               title="Trailer"
               frameBorder="0"
               allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
               allowFullScreen
             ></iframe>
           ) : (
             <img 
              src={movie.coverUrl} 
              alt={movie.title}
              className="w-full h-full object-cover opacity-80"
            />
           )}
          
          {/* Gradient Overlay (only show if not playing trailer to keep controls visible) */}
          {!showTrailer && (
            <div className="absolute inset-0 bg-gradient-to-t from-[#181818] via-transparent to-transparent"></div>
          )}

          {/* Controls Container */}
          {!showTrailer && (
            <div className="absolute bottom-6 md:bottom-12 left-4 md:left-12 space-y-3 md:space-y-4 max-w-lg z-10 w-full pr-4">
               <h2 className="text-2xl md:text-5xl font-bold text-white drop-shadow-md line-clamp-2">{movie.title}</h2>
               <div className="flex gap-2 md:gap-3 flex-wrap">
                  <button 
                    onClick={onPlay}
                    className="bg-white text-black px-4 md:px-8 py-1.5 md:py-2 rounded font-bold hover:bg-opacity-90 transition flex items-center gap-2 text-sm md:text-base"
                  >
                    <Play fill="currentColor" size={18} className="md:w-5 md:h-5" />
                    Play
                  </button>
                  
                  {trailerKey && (
                    <button 
                      onClick={() => setShowTrailer(true)}
                      className="bg-gray-600/70 text-white px-4 py-1.5 md:py-2 rounded font-bold hover:bg-gray-600/90 transition flex items-center gap-2 backdrop-blur-sm text-sm md:text-base"
                    >
                      <Youtube size={18} className="md:w-5 md:h-5" />
                      Trailer
                    </button>
                  )}

                  <button 
                    onClick={onToggleMyList}
                    className={`border p-1.5 md:p-2 rounded-full transition backdrop-blur-sm flex items-center justify-center ${isBookmarked ? 'bg-white text-black border-white' : 'border-gray-400 text-white hover:border-white bg-black/20'}`}
                    title={isBookmarked ? "Remove from My List" : "Add to My List"}
                  >
                    {isBookmarked ? <Check size={20} /> : <Plus size={20} />}
                  </button>
                  <button className="border border-gray-400 text-white p-1.5 md:p-2 rounded-full hover:border-white transition bg-black/20 backdrop-blur-sm">
                     <ThumbsUp size={20} />
                  </button>
               </div>
            </div>
          )}

          {!showTrailer && (
            <button 
              onClick={() => setMuted(!muted)}
              className="absolute bottom-6 md:bottom-12 right-4 md:right-12 border border-gray-500/50 bg-black/30 p-2 rounded-full hover:bg-white/10 transition text-gray-300 z-10"
            >
              {muted ? <VolumeX size={18} /> : <Volume2 size={18} />}
            </button>
          )}
        </div>

        {/* Details Section */}
        <div className="px-4 md:px-12 py-6 pb-20 md:pb-6">
           <div className="flex flex-col md:grid md:grid-cols-[2fr_1fr] gap-6 md:gap-8 mb-8">
             <div className="space-y-4">
                <div className="flex items-center gap-3 text-sm md:text-base font-semibold">
                  <span className="text-green-400">{movie.matchScore}% Match</span>
                  <span className="text-gray-400">{movie.year}</span>
                  <span className="border border-gray-500 px-1 text-xs rounded text-gray-300">{movie.rating}</span>
                  <span className="text-gray-400">{movie.duration}</span>
                </div>
                <p className="text-white text-sm md:text-base leading-relaxed">
                  {movie.description}
                </p>
             </div>
             
             <div className="text-xs md:text-sm space-y-3 text-gray-400">
                <div>
                  <span className="text-gray-500 block mb-1">Genres:</span>
                  <div className="flex flex-wrap gap-2 text-white">
                    {movie.genre.map((g, i) => (
                      <span key={g} className="hover:underline cursor-pointer">
                        {g}{i < movie.genre.length - 1 ? ',' : ''}
                      </span>
                    ))}
                  </div>
                </div>
                <div>
                   <span className="text-gray-500 block mb-1">Original Language:</span>
                   <span className="text-white">English</span>
                </div>
             </div>
           </div>

           {/* Cast Section */}
           {cast.length > 0 && (
             <div className="border-t border-gray-700 pt-6 mb-10 md:mb-0">
               <h3 className="text-lg md:text-xl font-bold text-white mb-4">Cast</h3>
               <div className="flex gap-4 overflow-x-auto pb-4 no-scrollbar">
                 {cast.map((actor) => (
                   <div key={actor.id} className="flex-shrink-0 w-20 md:w-24 text-center group cursor-pointer">
                     <div className="w-16 h-16 md:w-24 md:h-24 mx-auto mb-2 rounded-full overflow-hidden border-2 border-transparent group-hover:border-white transition-all shadow-lg bg-gray-800">
                       {actor.profileUrl ? (
                         <img 
                           src={actor.profileUrl} 
                           alt={actor.name} 
                           className="w-full h-full object-cover"
                         />
                       ) : (
                         <div className="w-full h-full flex items-center justify-center text-gray-500 font-bold text-xs">
                           No Image
                         </div>
                       )}
                     </div>
                     <p className="text-white text-xs md:text-sm font-medium truncate">{actor.name}</p>
                     <p className="text-gray-400 text-[10px] md:text-xs truncate">{actor.character}</p>
                   </div>
                 ))}
               </div>
             </div>
           )}
        </div>
      </div>
    </div>
  );
};

export default DetailsModal;