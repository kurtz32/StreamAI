export interface Movie {
  id: string;
  title: string;
  description: string;
  thumbnailUrl: string;
  coverUrl: string;
  genre: string[];
  year: number;
  rating: string;
  duration: string;
  matchScore: number;
  trending?: boolean;
  mediaType?: 'movie' | 'tv';
}

export interface CastMember {
  id: number;
  name: string;
  character: string;
  profileUrl: string | null;
}

export interface AIRecommendationRequest {
  mood: string;
  favoriteGenres: string[];
}

export interface AIChatMessage {
  id: string;
  role: 'user' | 'model';
  text: string;
  recommendations?: Movie[];
}
