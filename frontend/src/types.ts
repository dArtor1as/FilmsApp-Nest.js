export interface User {
  username: string;
  email?: string;
}

export interface Film {
  id: number;
  title: string;
  posterPath: string;
  genre: string | string[];
  releaseYear: number;
  averageRating: number;
  synopsis?: string;
  userRating?: number;
}

export interface Comment {
  id: number;
  content: string;
  createdAt: string;
  user: User;
}

export interface Review {
  id: number;
  content: string;
  createdAt: string;
  movie: Film;
  user: User;
  comments: Comment[];
}
