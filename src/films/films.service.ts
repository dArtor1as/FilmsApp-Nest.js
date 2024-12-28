import { Injectable, NotFoundException } from '@nestjs/common';
import { DatabaseService } from '../database/database.service';
import { TmdbService } from '../tmdb/tmdb.service';
import { CreateFilmDto } from './dto/create-film.dto';
import { UpdateFilmDto } from './dto/update-film.dto';

@Injectable()
export class FilmsService {
  constructor(
    private readonly databaseService: DatabaseService,
    private readonly tmdbService: TmdbService,
  ) {}

  async findAll(genre?: string, title?: string): Promise<any> {
    const whereClause: any = {};

    if (genre) {
      whereClause.genre = { has: genre };
    }

    if (title) {
      whereClause.title = { contains: title, mode: 'insensitive' };
    }

    return this.databaseService.movie.findMany({ where: whereClause });
  }
  async findAllGenres(): Promise<string[]> {
    const films = await this.databaseService.movie.findMany();
    const genres = new Set<string>();
    films.forEach((film) => film.genre.forEach((g) => genres.add(g)));
    return Array.from(genres);
  }

  // Отримання конкретного фільму за ID
  async findOne(id: number): Promise<any> {
    const movie = await this.databaseService.movie.findUnique({
      where: { id },
      include: {
        ratings: true, // Включаємо всі рейтинги для фільму
      },
    });

    if (!movie) {
      throw new NotFoundException(`Movie with ID ${id} not found`);
    }

    // Обчислення userRating з рейтингу користувачів
    const userRatings = movie.ratings.map((rating) => rating.value);
    const userRating =
      userRatings.length > 0
        ? userRatings.reduce((sum, rating) => sum + rating, 0) /
          userRatings.length
        : 0;

    return {
      ...movie,
      userRating,
    };
  }

  // Додавання нового фільму
  async create(createFilmDto: CreateFilmDto): Promise<any> {
    return this.databaseService.movie.create({
      data: {
        tmdbId: Number(createFilmDto.tmdbId),
        title: createFilmDto.title,
        posterPath: createFilmDto.posterPath,
        genre: createFilmDto.genre,
        releaseYear: createFilmDto.releaseYear,
        averageRating: createFilmDto.averageRating ?? 0,
      },
    });
  }

  // Оновлення фільму
  async update(id: number, updateFilmDto: UpdateFilmDto): Promise<any> {
    const existingMovie = await this.findOne(id); // Перевіряємо, чи фільм існує
    return this.databaseService.movie.update({
      where: { id },
      data: {
        title: updateFilmDto.title ?? existingMovie.title,
        posterPath: updateFilmDto.posterPath ?? existingMovie.posterPath,
        genre: updateFilmDto.genre ?? existingMovie.genre,
        releaseYear: updateFilmDto.releaseYear ?? existingMovie.releaseYear,
        averageRating:
          updateFilmDto.averageRating ?? existingMovie.averageRating,
      },
    });
  }

  // Видалення фільму
  async delete(id: number): Promise<any> {
    await this.findOne(id); // Перевірка, чи фільм існує
    return this.databaseService.movie.delete({ where: { id } });
  }

  // Отримання даних про фільм з TMDB API
  async findOneByTmdbId(tmdbId: number): Promise<any> {
    const existingMovie = await this.databaseService.movie.findUnique({
      where: { tmdbId },
    });
    if (existingMovie) {
      return existingMovie; // Якщо фільм вже є в базі, повертаємо його
    }

    // Якщо фільм не знайдений у БД, отримуємо дані з TMDB API
    const movieData = await this.tmdbService.fetchMovieFromTMDB(tmdbId);
    return this.databaseService.movie.create({
      data: {
        tmdbId,
        title: movieData.title,
        posterPath: movieData.posterPath,
        genre: movieData.genre,
        releaseYear: movieData.releaseYear,
        averageRating: movieData.averageRating,
      },
    });
  }
}
