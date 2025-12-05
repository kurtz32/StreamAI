import React, { useState, useEffect } from 'react';
import { ArrowLeft, Signal, Wifi, WifiOff, Tv, Flag, Globe, Zap, Server, Settings } from 'lucide-react';
import { Movie } from '../types';
import { fetchTVDetails } from '../services/tmdb';

interface WatchPageProps {
  movie: Movie;
  onBack: () => void;
}

// Extensive server list imitating PStream and other premium aggregators
const SERVERS = [
  // --- The Heavy Hitters (Working) ---
  { id: 'vidsrc-cc', name: 'VidSrc CC', icon: '🌀', status: 'online', type: 'vip', alias: 'vidsrc-cc' },
  { id: 'vidsrc-vip', name: 'VidSrc VIP', icon: '⚡', status: 'online', type: 'premium', alias: 'vidsrc' },
  { id: 'autoembed', name: 'AutoEmbed', icon: '🤖', status: 'online', type: 'auto', alias: 'autoembed' },
  { id: 'vidsrc-pro', name: 'VidSrc Pro', icon: '🚀', status: 'online', type: '4k', alias: 'vidsrc' },
  
  // --- Popular Mirrors (Mapped to working endpoints) ---
  { id: 'superembed', name: 'SuperEmbed', icon: '🎬', status: 'online', type: 'multi', alias: 'autoembed' },
  { id: '2embed', name: '2Embed', icon: '✌️', status: 'online', type: 'hd', alias: 'autoembed' },
  { id: 'vidlink', name: 'VidLink', icon: '🔗', status: 'online', type: 'fast', alias: 'autoembed' },
  
  // --- Specific Sources from Reference (Aliased for reliability) ---
  { id: 'darkness', name: 'Darkness', icon: '🌑', status: 'online', type: 'fast', alias: 'vidsrc' },
  { id: 'mary', name: 'Mary', icon: '👤', status: 'online', type: '1080p', alias: 'autoembed' },
  { id: 'xprime', name: 'XPrime', icon: '📺', status: 'online', type: 'hd', alias: 'vidsrc' },
  { id: 'hdtv', name: 'HDTV', icon: '📡', status: 'online', type: '1080p', alias: 'autoembed' },
  { id: 'hydrax', name: 'HydraX', icon: '🐍', status: 'online', type: 'sd', alias: 'autoembed' },
  { id: 'mp4upload', name: 'Mp4Upload', icon: '💾', status: 'online', type: 'backup', alias: 'vidsrc' },
  
  // --- International / Specialized ---
  { id: 'anime-world', name: 'AnimeWorld', icon: '🗾', status: 'online', type: 'sub', alias: 'autoembed' },
  { id: 'french-stream', name: 'FrenchStream', icon: '🇫🇷', status: 'online', type: 'fr', alias: 'autoembed' },
  { id: 'latino-pro', name: 'LatinoPro', icon: '🇲🇽', status: 'online', type: 'es', alias: 'vidsrc' },
];

const WatchPage: React.FC<WatchPageProps> = ({ movie, onBack }) => {
  const [server, setServer] = useState(SERVERS[0]);
  const [loading, setLoading] = useState(true);
  const [season, setSeason] = useState(1);
  const [episode, setEpisode] = useState(1);
  const [seasonsData, setSeasonsData] = useState<{ season_number: number; episode_count: number }[]>([]);
  const [showSidebar, setShowSidebar] = useState(false);

  // Reset loading when server/content changes
  useEffect(() => {
    setLoading(true);
    const timer = setTimeout(() => setLoading(false), 2000); 
    return () => clearTimeout(timer);
  }, [server, season, episode]);

  // Fetch TV Details (Seasons & Episodes)
  useEffect(() => {
    if (movie.mediaType === 'tv') {
      const loadSeasons = async () => {
        const details = await fetchTVDetails(movie.id);
        if (details && details.seasons) {
          // Filter out season 0 (specials) usually
          const validSeasons = details.seasons.filter((s: any) => s.season_number > 0);
          setSeasonsData(validSeasons);
        }
      };
      loadSeasons();
    }
  }, [movie.id, movie.mediaType]);

  const handleSeasonChange = (newSeason: number) => {
    setSeason(newSeason);
    setEpisode(1); // Reset to episode 1 when season changes
  };

  const getEmbedUrl = () => {
    const isTv = movie.mediaType === 'tv';
    const tmdbId = movie.id;
    const endpointType = server.alias || 'vidsrc';

    if (endpointType === 'vidsrc-cc') {
      return isTv 
        ? `https://vidsrc.cc/v2/embed/tv/${tmdbId}/${season}/${episode}`
        : `https://vidsrc.cc/v2/embed/movie/${tmdbId}`;
    }

    if (endpointType === 'vidsrc') {
      return isTv 
        ? `https://vidsrc.vip/embed/tv/${tmdbId}/${season}/${episode}`
        : `https://vidsrc.vip/embed/movie/${tmdbId}`;
    }

    if (endpointType === 'autoembed') {
      return isTv
        ? `https://autoembed.co/tv/tmdb/${tmdbId}-${season}-${episode}`
        : `https://autoembed.co/movie/tmdb/${tmdbId}`;
    }

    return `https://vidsrc.vip/embed/movie/${tmdbId}`;
  };

  const currentSeason = seasonsData.find(s => s.season_number === season);
  const episodeCount = currentSeason ? currentSeason.episode_count : 24;

  const handleBack = async () => {
    if (document.fullscreenElement) {
      await document.exitFullscreen();
    }
    onBack();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black flex flex-col animate-fade-in text-white font-sans">
      
      {/* Top Navigation Bar */}
      <div className="h-16 flex items-center justify-between pr-4 pl-20 md:pl-24 md:pr-6 bg-[#0f0f0f] border-b border-white/5 z-30 shadow-md">
        <div className="flex items-center gap-4 overflow-hidden">
          <button 
            onClick={handleBack}
            className="p-2 rounded-full hover:bg-white/10 transition text-gray-300 hover:text-white flex-shrink-0"
          >
            <ArrowLeft size={22} />
          </button>
          <div className="min-w-0">
            <h1 className="text-base md:text-lg font-bold text-gray-100 truncate">
              {movie.title}
            </h1>
            {movie.mediaType === 'tv' && (
              <div className="flex items-center gap-2 text-xs text-indigo-400 font-medium">
                <span>S{season}</span>
                <span className="w-1 h-1 bg-gray-600 rounded-full"></span>
                <span>E{episode}</span>
              </div>
            )}
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-md bg-[#1a1a1a] border border-white/5 text-xs text-gray-400">
             <Signal size={14} className="text-green-500" />
             <span className="font-mono">PING: 24ms</span>
          </div>
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-md bg-indigo-900/20 border border-indigo-500/30 text-xs font-medium text-indigo-200">
             <Globe size={14} />
             <span>{server.name}</span>
          </div>
          <button 
            onClick={() => setShowSidebar(!showSidebar)}
            className={`p-2 rounded-md transition-colors ${showSidebar ? 'bg-white/20 text-white' : 'hover:bg-white/10 text-gray-400'}`}
            title="Server & Episode Settings"
          >
             <Settings size={20} />
          </button>
        </div>
      </div>

      {/* Content Layout */}
      <div className="flex-1 flex overflow-hidden relative">
        
        {/* Left: Video Player */}
        <div className="flex-1 relative bg-black flex flex-col">
          <div className="flex-1 relative w-full h-full">
            {loading && (
              <div className="absolute inset-0 flex flex-col items-center justify-center z-10 bg-black">
                 <div className="relative">
                   <div className="w-16 h-16 border-4 border-indigo-600/30 border-t-indigo-500 rounded-full animate-spin"></div>
                   <div className="absolute inset-0 flex items-center justify-center">
                     <Zap size={20} className="text-indigo-500 animate-pulse" />
                   </div>
                 </div>
                 <p className="text-gray-400 text-sm mt-4 font-medium animate-pulse">
                   Connecting to secure server <span className="text-indigo-400">{server.name}</span>...
                 </p>
              </div>
            )}
            
            <iframe
              key={`${server.id}-${season}-${episode}`} // Force re-render on change
              src={getEmbedUrl()}
              className="w-full h-full border-0"
              allowFullScreen
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              referrerPolicy="origin"
              sandbox="allow-forms allow-pointer-lock allow-same-origin allow-scripts allow-presentation"
            />
          </div>
        </div>

        {/* Right: Server & Episode Sidebar */}
        <div className={`bg-[#121212] border-l border-white/5 flex flex-col flex-shrink-0 z-30 shadow-xl transition-all duration-300 ease-in-out ${showSidebar ? 'w-72 md:w-80 opacity-100' : 'w-0 opacity-0 overflow-hidden'}`}>
          <div className="w-72 md:w-80 h-full flex flex-col">
            {/* Section: Server List */}
            <div className="flex-1 flex flex-col min-h-0">
              <div className="p-4 border-b border-white/5 bg-[#161616]">
                <div className="flex items-center justify-between mb-1">
                  <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider flex items-center gap-2">
                    <Server size={14} /> Server List
                  </h3>
                  <span className="text-[10px] bg-green-900/30 text-green-400 px-1.5 py-0.5 rounded border border-green-800/50">
                    {SERVERS.filter(s => s.status === 'online').length} Online
                  </span>
                </div>
              </div>

              <div className="flex-1 overflow-y-auto p-2 space-y-1 custom-scrollbar">
                 {SERVERS.map((srv) => (
                   <button
                     key={srv.id}
                     onClick={() => setServer(srv)}
                     className={`w-full flex items-center justify-between p-2.5 rounded-lg transition-all group ${
                       server.id === srv.id 
                         ? 'bg-gradient-to-r from-indigo-900/40 to-purple-900/20 border border-indigo-500/40' 
                         : 'hover:bg-white/5 border border-transparent'
                     }`}
                   >
                     <div className="flex items-center gap-3 min-w-0">
                       <span className="flex-shrink-0 w-8 h-8 rounded-full bg-[#1a1a1a] flex items-center justify-center text-lg border border-white/5 shadow-sm group-hover:scale-105 transition-transform">
                         {srv.icon}
                       </span>
                       <div className="text-left min-w-0">
                         <p className={`text-sm font-medium truncate ${server.id === srv.id ? 'text-white' : 'text-gray-300'}`}>
                           {srv.name}
                         </p>
                         <div className="flex items-center gap-2">
                            <p className="text-[10px] text-gray-500 uppercase">{srv.type}</p>
                            {server.id === srv.id && <span className="text-[10px] text-indigo-400 animate-pulse">● Active</span>}
                         </div>
                       </div>
                     </div>
                     
                     <div className="flex flex-col items-end gap-1">
                        {srv.status === 'online' ? (
                          <Wifi size={14} className={`${server.id === srv.id ? 'text-green-400' : 'text-gray-600 group-hover:text-green-500'}`} />
                        ) : (
                          <WifiOff size={14} className="text-red-500" />
                        )}
                     </div>
                   </button>
                 ))}
              </div>
            </div>

            {/* Section: Episode Selector (Only for TV) */}
            {movie.mediaType === 'tv' && (
               <div className="p-4 border-t border-white/10 bg-[#161616]">
                  <h3 className="text-xs font-bold text-gray-400 mb-3 flex items-center gap-2">
                     <Tv size={14} /> SELECT EPISODE
                  </h3>
                  <div className="grid grid-cols-2 gap-2">
                     <div className="space-y-1">
                        <label className="text-[10px] text-gray-500 uppercase font-bold ml-1">Season</label>
                        <select 
                          value={season} 
                          onChange={(e) => handleSeasonChange(Number(e.target.value))}
                          className="w-full bg-[#0a0a0a] text-white text-sm py-2 px-3 rounded border border-white/10 focus:border-indigo-500 outline-none appearance-none hover:border-white/30 transition cursor-pointer"
                        >
                           {seasonsData.length > 0 ? (
                             seasonsData.map((s) => (
                               <option key={s.season_number} value={s.season_number}>Season {s.season_number}</option>
                             ))
                           ) : (
                             // Fallback while loading or if data missing
                             [...Array(10)].map((_, i) => <option key={i+1} value={i+1}>Season {i+1}</option>)
                           )}
                        </select>
                     </div>
                     <div className="space-y-1">
                        <label className="text-[10px] text-gray-500 uppercase font-bold ml-1">Episode</label>
                        <select 
                          value={episode} 
                          onChange={(e) => setEpisode(Number(e.target.value))}
                          className="w-full bg-[#0a0a0a] text-white text-sm py-2 px-3 rounded border border-white/10 focus:border-indigo-500 outline-none appearance-none hover:border-white/30 transition cursor-pointer"
                        >
                           {[...Array(episodeCount)].map((_, i) => <option key={i+1} value={i+1}>Episode {i+1}</option>)}
                        </select>
                     </div>
                  </div>
               </div>
            )}

            {/* Footer Actions */}
            <div className="p-3 border-t border-white/10 bg-[#0f0f0f]">
               <button className="flex items-center justify-center gap-2 text-xs text-gray-500 hover:text-red-400 transition w-full py-2 rounded hover:bg-white/5">
                  <Flag size={12} /> Report Playback Issue
               </button>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(255, 255, 255, 0.02);
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(255, 255, 255, 0.1);
          border-radius: 3px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(255, 255, 255, 0.2);
        }
      `}</style>
    </div>
  );
};

export default WatchPage;