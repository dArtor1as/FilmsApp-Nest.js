import { Test, TestingModule } from '@nestjs/testing';
import { NestExpressApplication } from '@nestjs/platform-express';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { DatabaseService } from '../src/database/database.service';
import { TmdbService } from '../src/tmdb/tmdb.service';

describe('FilmsController (e2e)', () => {
  let app: NestExpressApplication;

  const mockDatabaseService = {
    movie: {
      findMany: jest.fn().mockResolvedValue([
        {
          id: 1,
          title: 'Test Film',
          genre: ['Drama', 'Action'],
        },
        {
          id: 2,
          title: 'Another Test Film',
          genre: ['Comedy'],
        },
      ]),
      create: jest.fn().mockResolvedValue({
        id: 3,
        title: 'New Test Film',
        genre: ['Thriller'],
      }),
      findUnique: jest.fn(),
      delete: jest.fn(),
    },
  };

  const mockTmdbService = {
    fetchMovieFromTMDB: jest.fn().mockResolvedValue({
      tmdbId: 101,
      title: 'Mock TMDB Film',
      posterPath: '/mock-poster.jpg',
      genre: ['Adventure'],
      releaseYear: 2021,
      averageRating: 8.1,
    }),
  };

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    })
      .overrideProvider(DatabaseService)
      .useValue(mockDatabaseService)
      .overrideProvider(TmdbService)
      .useValue(mockTmdbService)
      .compile();

    app = moduleFixture.createNestApplication<NestExpressApplication>();

    // Налаштування HBS видалено, оскільки тепер це JSON API

    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  it('/films (GET) should return a list of films and genres', async () => {
    const response = await request(app.getHttpServer()).get('/films');

    expect(response.status).toBe(200);

    // Перевіряємо структуру JSON замість HTML
    expect(response.body).toBeDefined();
    expect(response.body.films).toHaveLength(2);
    expect(response.body.films[0].title).toBe('Test Film');
    expect(response.body.films[1].title).toBe('Another Test Film');

    // Перевіряємо, що жанри також повертаються
    expect(response.body.genres).toEqual(
      expect.arrayContaining(['Drama', 'Action', 'Comedy']),
    );
  });

  it('/films (POST) should create a new film', async () => {
    const newFilm = {
      tmdbId: 123,
    };
    const response = await request(app.getHttpServer())
      .post('/films')
      .send(newFilm);
    expect(response.status).toBe(201);
    expect(response.body).toEqual({
      id: 3,
      title: 'New Test Film',
      genre: ['Thriller'],
    });
  });
});
