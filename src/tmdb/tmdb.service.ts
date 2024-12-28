import { Injectable, NotFoundException } from '@nestjs/common';
import axios from 'axios';

@Injectable()
export class TmdbService {
  private readonly tmdbApiKey = process.env.TMDB_API_KEY;

  // Метод для отримання інформації про фільм з TMDB API
  async fetchMovieFromTMDB(tmdbId: number) {
    console.log(`Fetching movie with TMDB ID: ${tmdbId}`);
    console.log(`Using API Key: ${this.tmdbApiKey}`);
    try {
      const response = await axios.get(
        `https://api.themoviedb.org/3/movie/${tmdbId}`,
        {
          params: { api_key: this.tmdbApiKey },
        },
      );
      const movieData = response.data;
      return {
        tmdbId: Number(tmdbId),
        title: movieData.title,
        posterPath: movieData.poster_path, // Перетворюємо назву ключа
        genre: movieData.genres.map((g) => g.name), // Виправлення genres
        releaseYear: parseInt(movieData.release_date.split('-')[0], 10),
        averageRating: movieData.vote_average,
      };
    } catch (error) {
      throw new NotFoundException(
        `Failed to fetch movie data from TMDB: ${error.message}`,
      );
    }
  }
}
