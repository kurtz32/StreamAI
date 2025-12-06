import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import ContentRow from './components/ContentRow';
import DetailsModal from './components/DetailsModal';
import AIAssistant from './components/AIAssistant';
import MovieCard from './components/MovieCard';
import WatchPage from './components/WatchPage';
import { 
  fetchTrending, fetchTopRated, fetchMoviesByGenre, fetchNetflixOriginals,
  fetchTrendingTV, fetchTopRatedTV, fetchTVByGenre, searchMulti
} from './services/tmdb';
import { Movie } from './types';
import { Loader } from 'lucide-react';

function App() {
  const [activeTab, setActiveTab] = useState('home');
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);
  const [playingMovie, setPlayingMovie] = useState<Movie | null>(null);
  const [showAI, setShowAI] = useState(false);
  const [loading, setLoading] = useState(true);
  
  const [featuredMovie, setFeaturedMovie] = useState<Movie | null>(null);
  
  // Search State
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<Movie[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  // My List (Bookmarks) State
  const [myList, setMyList] = useState<Movie[]>(() => {
    try {
      const saved = localStorage.getItem('streamai-mylist');
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem('streamai-mylist', JSON.stringify(myList));
  }, [myList]);

  const toggleMyList = (movie: Movie) => {
    setMyList(prev => {
      const exists = prev.find(m => m.id === movie.id);
      if (exists) {
        return prev.filter(m => m.id !== movie.id);
      }
      return [movie, ...prev];
    });
  };

  // Content Rows Data
  const [row1, setRow1] = useState<{ title: string; data: Movie[] }>({ title: '', data: [] });
  const [row2, setRow2] = useState<{ title: string; data: Movie[] }>({ title: '', data: [] });
  const [row3, setRow3] = useState<{ title: string; data: Movie[] }>({ title: '', data: [] });
  const [row4, setRow4] = useState<{ title: string; data: Movie[] }>({ title: '', data: [] });
  const [row5, setRow5] = useState<{ title: string; data: Movie[] }>({ title: '', data: [] });
  const [row6, setRow6] = useState<{ title: string; data: Movie[] }>({ title: '', data: [] });
  const [row7, setRow7] = useState<{ title: string; data: Movie[] }>({ title: '', data: [] });
  const [row8, setRow8] = useState<{ title: string; data: Movie[] }>({ title: '', data: [] });

  useEffect(() => {
    const loadContent = async () => {
      setLoading(true);
      try {
        if (activeTab === 'tv') {
            // LOAD TV SHOWS CONTENT
            const [trending, topRated, netflix, actionAdv, sciFiFantasy, comedy, drama, doc] = await Promise.all([
              fetchTrendingTV(),
              fetchTopRatedTV(),
              fetchNetflixOriginals(),
              fetchTVByGenre(10759), // Action & Adventure
              fetchTVByGenre(10765), // Sci-Fi & Fantasy
              fetchTVByGenre(35),    // Comedy
              fetchTVByGenre(18),    // Drama
              fetchTVByGenre(99)     // Documentary
            ]);

            setFeaturedMovie(netflix[Math.floor(Math.random() * netflix.length)] || trending[0] || null);
            setRow1({ title: "Trending TV Shows", data: trending });
            setRow2({ title: "Top Rated TV", data: topRated });
            setRow3({ title: "Netflix Originals", data: netflix });
            setRow4({ title: "Action & Adventure", data: actionAdv });
            setRow5({ title: "Sci-Fi & Fantasy", data: sciFiFantasy });
            setRow6({ title: "TV Comedies", data: comedy });
            setRow7({ title: "TV Dramas", data: drama });
            setRow8({ title: "Documentaries", data: doc });

        } else if (activeTab === 'movies') {
            // LOAD MOVIES CONTENT
            const [trending, topRated, action, scifi, comedy, horror, romance, doc] = await Promise.all([
                fetchTrending(), 
                fetchTopRated(),
                fetchMoviesByGenre(28),
                fetchMoviesByGenre(878),
                fetchMoviesByGenre(35),
                fetchMoviesByGenre(27),
                fetchMoviesByGenre(10749),
                fetchMoviesByGenre(99)
            ]);
             // Filter trending for just movies to be safe, though fetchTrending does 'all'
            const trendingMovies = trending.filter(m => m.mediaType !== 'tv');

            setFeaturedMovie(trendingMovies[Math.floor(Math.random() * trendingMovies.length)] || trendingMovies[0] || null);
            setRow1({ title: "Trending Movies", data: trendingMovies });
            setRow2({ title: "Top Rated Movies", data: topRated });
            setRow3({ title: "Action Thrillers", data: action });
            setRow4({ title: "Sci-Fi Blockbusters", data: scifi });
            setRow5({ title: "Comedies", data: comedy });
            setRow6({ title: "Horror", data: horror });
            setRow7({ title: "Romance", data: romance });
            setRow8({ title: "Documentaries", data: doc });

        } else {
            // HOME (MIXED)
            const [trending, topRated, action, scifi, comedy, horror, romance, netflix] = await Promise.all([
                fetchTrending(),
                fetchTopRated(),
                fetchMoviesByGenre(28),
                fetchMoviesByGenre(878),
                fetchMoviesByGenre(35),
                fetchMoviesByGenre(27),
                fetchMoviesByGenre(10749),
                fetchNetflixOriginals()
            ]);

            setFeaturedMovie(trending[Math.floor(Math.random() * trending.length)] || trending[0] || null);
            setRow1({ title: "Trending Now", data: trending });
            setRow2({ title: "Top Rated", data: topRated });
            setRow3({ title: "Netflix Originals", data: netflix });
            setRow4({ title: "Action Thrillers", data: action });
            setRow5({ title: "Sci-Fi & Fantasy", data: scifi });
            setRow6({ title: "Comedies", data: comedy });
            setRow7({ title: "Horror", data: horror });
            setRow8({ title: "Romance", data: romance });
        }

      } catch (error) {
        console.error("Failed to load content", error);
        // Ensure loading is false even on error so we don't get stuck on spinner
      } finally {
        setLoading(false);
      }
    };

    loadContent();
  }, [activeTab]);

  const handlePlay = (movie: Movie) => {
    setPlayingMovie(movie);
    // Also close the details modal if it's open
    setSelectedMovie(null);
  };

  const handleSearch = async (query: string) => {
    setSearchQuery(query);
    if (query.trim().length > 0) {
       setIsSearching(true);
       const results = await searchMulti(query);
       setSearchResults(results);
    } else {
       setIsSearching(false);
       setSearchResults([]);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#141414] flex items-center justify-center">
        <Loader className="animate-spin text-red-600 w-12 h-12" />
      </div>
    );
  }

  // Render Video Player
  if (playingMovie) {
    return (
      <WatchPage 
        movie={playingMovie} 
        onBack={() => setPlayingMovie(null)} 
      />
    );
  }

  return (
    <div className="relative min-h-screen bg-[#141414] pb-20 overflow-x-hidden">
      <Navbar 
        activeTab={activeTab} 
        onTabChange={setActiveTab} 
        onAIToggle={() => setShowAI(true)} 
        onSearch={handleSearch}
        myList={myList}
        onOpenMovie={setSelectedMovie}
        onToggleMyList={toggleMyList}
      />
      
      {isSearching ? (
         <div className="pt-24 px-4 md:px-12 min-h-screen">
            <h2 className="text-xl md:text-2xl text-white font-bold mb-6">
              {searchResults.length > 0 ? `Results for "${searchQuery}"` : `No results found for "${searchQuery}"`}
            </h2>
            
            {/* Responsive Grid for Search Results */}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 md:gap-6">
                {searchResults.map(movie => (
                    <MovieCard 
                      key={movie.id} 
                      movie={movie} 
                      onClick={setSelectedMovie} 
                      className="w-full aspect-[2/3] h-auto"
                    />
                ))}
            </div>
         </div>
      ) : (
        <>
          {featuredMovie ? (
            <Hero 
              movie={featuredMovie} 
              onPlay={() => handlePlay(featuredMovie)}
              onMoreInfo={() => setSelectedMovie(featuredMovie)}
            />
          ) : (
             // Spacer if no featured movie matches (or loading failed partially)
             <div className="pt-24 md:pt-32"></div>
          )}

          {/* Conditional margin: only pull up if Hero exists */}
          <div className={`relative z-10 space-y-4 md:space-y-8 ${featuredMovie ? '-mt-24 sm:-mt-32 md:-mt-48' : ''}`}>
            {row1.data.length > 0 && <ContentRow title={row1.title} movies={row1.data} onMovieClick={setSelectedMovie} />}
            {row2.data.length > 0 && <ContentRow title={row2.title} movies={row2.data} onMovieClick={setSelectedMovie} />}
            {row3.data.length > 0 && <ContentRow title={row3.title} movies={row3.data} onMovieClick={setSelectedMovie} />}
            {row4.data.length > 0 && <ContentRow title={row4.title} movies={row4.data} onMovieClick={setSelectedMovie} />}
            {row5.data.length > 0 && <ContentRow title={row5.title} movies={row5.data} onMovieClick={setSelectedMovie} />}
            {row6.data.length > 0 && <ContentRow title={row6.title} movies={row6.data} onMovieClick={setSelectedMovie} />}
            {row7.data.length > 0 && <ContentRow title={row7.title} movies={row7.data} onMovieClick={setSelectedMovie} />}
            {row8.data.length > 0 && <ContentRow title={row8.title} movies={row8.data} onMovieClick={setSelectedMovie} />}
          </div>
        </>
      )}

      {/* Modals */}
      {selectedMovie && (
        <DetailsModal 
          movie={selectedMovie} 
          onClose={() => setSelectedMovie(null)} 
          onPlay={() => handlePlay(selectedMovie)}
          isBookmarked={myList.some(m => m.id === selectedMovie.id)}
          onToggleMyList={() => toggleMyList(selectedMovie)}
        />
      )}

      {showAI && (
        <AIAssistant 
          onClose={() => setShowAI(false)} 
          onMovieClick={(movie) => {
             setSelectedMovie(movie);
          }}
        />
      )}
      
      {/* Footer */}
      {!isSearching && (
        <footer className="mt-20 px-6 md:px-12 py-8 text-gray-500 text-sm text-center border-t border-gray-800">
          <p>&copy; 2025 StreamAI. All rights reserved.</p>
          <p className="mt-2 text-indigo-400 font-medium">Develop by John Kurt Facturan</p>
          <p className="mt-2 text-xs opacity-50">Powered by Gemini API & TMDB</p>
        </footer>
      )}
    </div>
  );
}

export default App;