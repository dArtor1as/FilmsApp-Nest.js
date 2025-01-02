import { PrismaClient } from '@prisma/client';

let prisma: PrismaClient;

beforeAll(async () => {
  // Використовуємо URL з .env.test
  process.env.DATABASE_URL =
    'postgresql://postgres:MyPassword05@localhost:5433/NestjsDB?sslmode=prefer&connect_timeout=10';

  prisma = new PrismaClient();
  await prisma.$connect();

  // Міграція для таблиць, якщо необхідно
  await prisma.$executeRawUnsafe(`
    CREATE TABLE IF NOT EXISTS "Movie" (
      id SERIAL PRIMARY KEY,
      tmdbId INT UNIQUE NOT NULL,
      title TEXT NOT NULL,
      genre TEXT[] NOT NULL,
      releaseYear INT NOT NULL,
      averageRating FLOAT DEFAULT 0.0,
      createdAt TIMESTAMP DEFAULT NOW(),
      updatedAt TIMESTAMP DEFAULT NOW()
    );
  `);
});

afterAll(async () => {
  await prisma.$disconnect();
});
