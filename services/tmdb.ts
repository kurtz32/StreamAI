import { Movie, CastMember } from '../types';

const API_KEY = 'ce92539c90889cc88a401b0a7f040bb7';
const BASE_URL = 'https://api.themoviedb.org/3';
const IMAGE_BASE_URL = 'https://image.tmdb.org/t/p/original';
const PROFILE_BASE_URL = 'https://image.tmdb.org/t/p/w185';

const GENRE_MAP: { [key: number]: string } = {
  28: 'Action',
  12: 'Adventure',
  16: 'Animation',
  35: 'Comedy',
  80: 'Crime',
  99: 'Documentary',
  18: 'Drama',
  10751: 'Family',
  14: 'Fantasy',
  36: 'History',
  27: 'Horror',
  10402: 'Music',
  9648: 'Mystery',
  10749: 'Romance',
  878: 'Sci-Fi',
  10770: 'TV Movie',
  53: 'Thriller',
  10752: 'War',
  37: 'Western',
  // TV Specific
  10759: 'Action & Adventure',
  10762: 'Kids',
  10763: 'News',
  10764: 'Reality',
  10765: 'Sci-Fi & Fantasy',
  10766: 'Soap',
  10767: 'Talk',
  10768: 'War & Politics',
};

const mapResultToMovie = (result: any): Movie => {
  const genreNames = result.genre_ids 
    ? result.genre_ids.map((id: number) => GENRE_MAP[id] || 'General').slice(0, 3) 
    : ['Unknown'];

  // Determine media type if not explicitly provided
  const mediaType = result.media_type || (result.first_air_date ? 'tv' : 'movie');

  return {
    id: result.id.toString(),
    title: result.title || result.name || 'Untitled',
    description: result.overview || 'No description available.',
    thumbnailUrl: result.poster_path 
      ? `${IMAGE_BASE_URL}${result.poster_path}` 
      : 'https://via.placeholder.com/400x600?text=No+Image',
    coverUrl: result.backdrop_path 
      ? `${IMAGE_BASE_URL}${result.backdrop_path}` 
      : 'https://via.placeholder.com/1920x1080?text=No+Image',
    genre: genreNames,
    year: new Date(result.release_date || result.first_air_date || Date.now()).getFullYear(),
    rating: result.adult ? 'R' : 'PG-13', // Approximation
    duration: '2h', // TMDB list endpoint doesn't return runtime
    matchScore: Math.round((result.vote_average || 0) * 10),
    trending: false,
    mediaType: mediaType as 'movie' | 'tv'
  };
};

export const fetchTrending = async (): Promise<Movie[]> => {
  try {
    const response = await fetch(`${BASE_URL}/trending/all/week?api_key=${API_KEY}&language=en-US`);
    const data = await response.json();
    return data.results.map((m: any) => ({ ...mapResultToMovie(m), trending: true }));
  } catch (error) {
    console.error("Error fetching trending:", error);
    return [];
  }
};

export const fetchTopRated = async (): Promise<Movie[]> => {
  try {
    const response = await fetch(`${BASE_URL}/movie/top_rated?api_key=${API_KEY}&language=en-US`);
    const data = await response.json();
    return data.results.map(mapResultToMovie);
  } catch (error) {
    console.error("Error fetching top rated:", error);
    return [];
  }
};

export const fetchMoviesByGenre = async (genreId: number): Promise<Movie[]> => {
  try {
    const response = await fetch(`${BASE_URL}/discover/movie?api_key=${API_KEY}&with_genres=${genreId}&language=en-US&sort_by=popularity.desc`);
    const data = await response.json();
    return data.results.map(mapResultToMovie);
  } catch (error) {
    console.error(`Error fetching genre ${genreId}:`, error);
    return [];
  }
};

export const fetchNetflixOriginals = async (): Promise<Movie[]> => {
    try {
        const response = await fetch(`${BASE_URL}/discover/tv?api_key=${API_KEY}&with_networks=213`);
        const data = await response.json();
        return data.results.map(mapResultToMovie);
    } catch (error) {
        console.error("Error fetching netflix originals:", error);
        return [];
    }
}

// TV Specific Functions
export const fetchTrendingTV = async (): Promise<Movie[]> => {
  try {
    const response = await fetch(`${BASE_URL}/trending/tv/week?api_key=${API_KEY}&language=en-US`);
    const data = await response.json();
    return data.results.map((m: any) => ({ ...mapResultToMovie(m), trending: true }));
  } catch (error) {
    console.error("Error fetching trending TV:", error);
    return [];
  }
};

export const fetchTopRatedTV = async (): Promise<Movie[]> => {
  try {
    const response = await fetch(`${BASE_URL}/tv/top_rated?api_key=${API_KEY}&language=en-US`);
    const data = await response.json();
    return data.results.map(mapResultToMovie);
  } catch (error) {
    console.error("Error fetching top rated TV:", error);
    return [];
  }
};

export const fetchTVByGenre = async (genreId: number): Promise<Movie[]> => {
  try {
    const response = await fetch(`${BASE_URL}/discover/tv?api_key=${API_KEY}&with_genres=${genreId}&language=en-US&sort_by=popularity.desc`);
    const data = await response.json();
    return data.results.map(mapResultToMovie);
  } catch (error) {
    console.error(`Error fetching TV genre ${genreId}:`, error);
    return [];
  }
};

export const fetchCast = async (id: string, type: 'movie' | 'tv' = 'movie'): Promise<CastMember[]> => {
  try {
    const response = await fetch(`${BASE_URL}/${type}/${id}/credits?api_key=${API_KEY}&language=en-US`);
    const data = await response.json();
    if (!data.cast) return [];
    return data.cast.slice(0, 10).map((c: any) => ({
      id: c.id,
      name: c.name,
      character: c.character,
      profileUrl: c.profile_path ? `${PROFILE_BASE_URL}${c.profile_path}` : null
    }));
  } catch (error) {
    console.error("Error fetching cast:", error);
    return [];
  }
}

export const fetchTrailer = async (id: string, type: 'movie' | 'tv' = 'movie'): Promise<string | null> => {
  try {
    const response = await fetch(`${BASE_URL}/${type}/${id}/videos?api_key=${API_KEY}&language=en-US`);
    const data = await response.json();
    
    if (!data.results || !Array.isArray(data.results)) {
      return null;
    }

    // Prioritize official trailers on YouTube
    const trailer = data.results.find((v: any) => v.site === 'YouTube' && v.type === 'Trailer') 
                 || data.results.find((v: any) => v.site === 'YouTube' && v.type === 'Teaser') // Fallback to Teaser
                 || data.results.find((v: any) => v.site === 'YouTube'); // Fallback to any video
                 
    return trailer ? trailer.key : null;
  } catch (error) {
    console.error("Error fetching trailer:", error);
    return null;
  }
}

// NEW: Fetch detailed TV show info (seasons, episodes per season)
export const fetchTVDetails = async (id: string): Promise<any> => {
  try {
    const response = await fetch(`${BASE_URL}/tv/${id}?api_key=${API_KEY}&language=en-US`);
    return await response.json();
  } catch (error) {
    console.error("Error fetching TV details:", error);
    return null;
  }
};

export const searchMulti = async (query: string): Promise<Movie[]> => {
  try {
    const response = await fetch(`${BASE_URL}/search/multi?api_key=${API_KEY}&language=en-US&query=${encodeURIComponent(query)}&page=1&include_adult=false`);
    const data = await response.json();
    if (!data.results) return [];
    return data.results
      .filter((item: any) => item.media_type === 'movie' || item.media_type === 'tv')
      .map(mapResultToMovie);
  } catch (error) {
    console.error("Error searching:", error);
    return [];
  }
};