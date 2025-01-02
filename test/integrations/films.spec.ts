import * as request from 'supertest';
import { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { AppModule } from 'src/app.module';

let app: INestApplication;

beforeAll(async () => {
  const moduleRef = await Test.createTestingModule({
    imports: [AppModule],
  }).compile();

  app = moduleRef.createNestApplication();
  await app.init();
});

afterAll(async () => {
  await app.close();
});

describe('Movies API (Integration Tests)', () => {
  it('should create a new movie', async () => {
    const newMovie = {
      tmdbId: 12345,
      title: 'Test Movie',
      genre: ['Action', 'Adventure'],
      releaseYear: 2022,
    };

    const response = await request(app.getHttpServer())
      .post('/movies')
      .send(newMovie)
      .expect(201);

    expect(response.body).toHaveProperty('id');
    expect(response.body.title).toEqual('Test Movie');
  });

  it('should fetch all movies', async () => {
    const response = await request(app.getHttpServer())
      .get('/movies')
      .expect(200);

    expect(Array.isArray(response.body)).toBeTruthy();
  });
});
