import { Movie } from './types';

export const GENRES = [
  "Action", "Sci-Fi", "Drama", "Comedy", "Thriller", "Horror", "Documentary", "Anime"
];

export const MOCK_MOVIES: Movie[] = [
  {
    id: '1',
    title: 'Interstellar Horizons',
    description: 'A team of explorers travel through a wormhole in space in an attempt to ensure humanity\'s survival. A visual masterpiece of time and space.',
    thumbnailUrl: 'https://picsum.photos/seed/interstellar/400/600',
    coverUrl: 'https://picsum.photos/seed/interstellar-wide/1920/1080',
    genre: ['Sci-Fi', 'Adventure'],
    year: 2024,
    rating: 'PG-13',
    duration: '2h 49m',
    matchScore: 98,
    trending: true
  },
  {
    id: '2',
    title: 'Cyber Punk City',
    description: 'In a dystopic future, a mercenary outlaw seeks a one-of-a-kind implant that is the key to immortality.',
    thumbnailUrl: 'https://picsum.photos/seed/cyberpunk/400/600',
    coverUrl: 'https://picsum.photos/seed/cyberpunk-wide/1920/1080',
    genre: ['Sci-Fi', 'Action'],
    year: 2023,
    rating: 'R',
    duration: '2h 15m',
    matchScore: 95,
    trending: true
  },
  {
    id: '3',
    title: 'The Last Kingdom',
    description: 'As Alfred the Great defends his kingdom from Norse invaders, Uhtred, born a Saxon but raised by Vikings, seeks to claim his ancestral birthright.',
    thumbnailUrl: 'https://picsum.photos/seed/kingdom/400/600',
    coverUrl: 'https://picsum.photos/seed/kingdom-wide/1920/1080',
    genre: ['Action', 'Drama'],
    year: 2022,
    rating: 'TV-MA',
    duration: '5 Seasons',
    matchScore: 92
  },
  {
    id: '4',
    title: 'Silent Echoes',
    description: 'A deaf writer who retreated into the woods to live a solitary life must fight for her life in silence when a masked killer appears at her window.',
    thumbnailUrl: 'https://picsum.photos/seed/horror/400/600',
    coverUrl: 'https://picsum.photos/seed/horror-wide/1920/1080',
    genre: ['Thriller', 'Horror'],
    year: 2023,
    rating: 'R',
    duration: '1h 30m',
    matchScore: 88
  },
  {
    id: '5',
    title: 'Ocean Blue',
    description: 'A groundbreaking documentary exploring the deepest parts of the world\'s oceans and the strange creatures that inhabit them.',
    thumbnailUrl: 'https://picsum.photos/seed/ocean/400/600',
    coverUrl: 'https://picsum.photos/seed/ocean-wide/1920/1080',
    genre: ['Documentary'],
    year: 2024,
    rating: 'G',
    duration: '1h 45m',
    matchScore: 85
  },
  {
    id: '6',
    title: 'Neon Racer',
    description: 'An underground racer gets pulled into a high-stakes heist driving the fastest cars in the neon-lit streets of Tokyo.',
    thumbnailUrl: 'https://picsum.photos/seed/racer/400/600',
    coverUrl: 'https://picsum.photos/seed/racer-wide/1920/1080',
    genre: ['Action', 'Crime'],
    year: 2021,
    rating: 'PG-13',
    duration: '2h 10m',
    matchScore: 89
  },
   {
    id: '7',
    title: 'Medieval Mystery',
    description: 'A detective story set in the 14th century.',
    thumbnailUrl: 'https://picsum.photos/seed/medieval/400/600',
    coverUrl: 'https://picsum.photos/seed/medieval-wide/1920/1080',
    genre: ['Drama', 'Mystery'],
    year: 2020,
    rating: 'R',
    duration: '2h 05m',
    matchScore: 78
  },
  {
    id: '8',
    title: 'Space Cadets',
    description: 'A group of misfits join the space academy.',
    thumbnailUrl: 'https://picsum.photos/seed/space/400/600',
    coverUrl: 'https://picsum.photos/seed/space-wide/1920/1080',
    genre: ['Comedy', 'Sci-Fi'],
    year: 2023,
    rating: 'PG',
    duration: '1h 55m',
    matchScore: 82
  }
];
