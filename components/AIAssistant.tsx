import React, { useState, useRef, useEffect } from 'react';
import { X, Send, Sparkles, Loader, Film } from 'lucide-react';
import { getAIRecommendations } from '../services/geminiService';
import { Movie } from '../types';
import { MOCK_MOVIES } from '../constants';
import MovieCard from './MovieCard';

interface AIAssistantProps {
  onClose: () => void;
  onMovieClick: (movie: Movie) => void;
}

const AIAssistant: React.FC<AIAssistantProps> = ({ onClose, onMovieClick }) => {
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [recommendations, setRecommendations] = useState<Movie[]>([]);
  const [hasSearched, setHasSearched] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;

    setLoading(true);
    setHasSearched(true);
    setRecommendations([]);

    // Call Gemini Service
    const results = await getAIRecommendations(query, MOCK_MOVIES);
    
    setRecommendations(results);
    setLoading(false);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-sm flex items-start justify-center pt-20 px-4">
      <div className="w-full max-w-5xl flex flex-col h-[85vh] bg-[#1a1a1a] rounded-xl border border-white/10 shadow-2xl overflow-hidden animate-fade-in-down">
        
        {/* Header */}
        <div className="p-6 border-b border-white/10 flex items-center justify-between bg-gradient-to-r from-indigo-900/30 to-purple-900/30">
          <div className="flex items-center gap-3">
             <div className="p-2 bg-indigo-600 rounded-lg">
               <Sparkles className="text-white h-6 w-6" />
             </div>
             <div>
               <h2 className="text-xl font-bold text-white">StreamAI Assistant</h2>
               <p className="text-xs text-gray-400">Powered by Gemini 2.5</p>
             </div>
          </div>
          <button 
            onClick={onClose}
            className="p-2 hover:bg-white/10 rounded-full transition text-gray-400 hover:text-white"
          >
            <X size={24} />
          </button>
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto p-6 scroll-smooth">
          {!hasSearched ? (
            <div className="h-full flex flex-col items-center justify-center text-center space-y-6 opacity-70">
              <Film size={64} className="text-gray-600" />
              <h3 className="text-2xl font-bold text-gray-300">What are you in the mood for?</h3>
              <p className="max-w-md text-gray-500">
                Try asking for "90s action movies with a twist" or "Something heartwarming set in Italy". 
                I can even generate completely new movie concepts for you!
              </p>
              
              <div className="flex flex-wrap justify-center gap-3 mt-4">
                {["Cyberpunk thrillers", "Cozy mysteries", "Space operas", "Documentaries about nature"].map(suggestion => (
                  <button 
                    key={suggestion}
                    onClick={() => setQuery(suggestion)}
                    className="px-4 py-2 rounded-full bg-white/5 border border-white/10 hover:bg-white/10 hover:border-white/30 text-sm text-gray-300 transition"
                  >
                    {suggestion}
                  </button>
                ))}
              </div>
            </div>
          ) : loading ? (
             <div className="h-full flex flex-col items-center justify-center space-y-4">
               <Loader className="animate-spin text-indigo-500 h-10 w-10" />
               <p className="text-indigo-300 animate-pulse">Consulting the neural network...</p>
             </div>
          ) : (
            <div className="space-y-8">
              <div className="flex items-center gap-2 text-indigo-300 mb-4">
                 <Sparkles size={16} />
                 <span className="font-medium">AI Recommendations for "{query}"</span>
              </div>
              
              {recommendations.length > 0 ? (
                 <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {recommendations.map(movie => (
                       <MovieCard key={movie.id} movie={movie} onClick={onMovieClick} />
                    ))}
                 </div>
              ) : (
                 <div className="text-center text-gray-500 mt-20">
                    <p>No results found. Try a different prompt.</p>
                 </div>
              )}
            </div>
          )}
        </div>

        {/* Input Area */}
        <div className="p-6 border-t border-white/10 bg-[#1a1a1a]">
          <form onSubmit={handleSearch} className="relative">
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Describe your perfect movie..."
              className="w-full bg-black/40 border border-white/20 text-white pl-5 pr-14 py-4 rounded-xl focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition shadow-inner"
            />
            <button 
              type="submit"
              disabled={!query.trim() || loading}
              className="absolute right-3 top-1/2 -translate-y-1/2 p-2 bg-indigo-600 rounded-lg text-white disabled:opacity-50 disabled:cursor-not-allowed hover:bg-indigo-500 transition"
            >
              {loading ? <Loader size={18} className="animate-spin" /> : <Send size={18} />}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AIAssistant;
