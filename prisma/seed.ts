import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log(' Start seeding...');

  // 1. Створюємо тестового Юзера (щоб було кому писати рецензії)
  // Пароль: "123456" (це готовий хеш, щоб не мучитися з бібліотеками)
  const passwordHash = '$2b$10$EpWwR8t7c8.5.5.5.5.5.5.5.5.5.5.5';

  const user = await prisma.user.upsert({
    where: { email: 'admin@example.com' },
    update: {}, // Якщо юзер є - нічого не міняємо
    create: {
      email: 'admin@example.com',
      username: 'MovieMaster',
      password: passwordHash,
    },
  });

  console.log(` Created user: ${user.username} (ID: ${user.id})`);

  // 2. Створюємо Фільми
  const moviesData = [
    {
      tmdbId: 157336,
      title: 'Interstellar',
      posterPath: '/gEU2QniL6E77AAyXcCXr47FaOiy.jpg',
      genre: ['Adventure', 'Drama', 'Science Fiction'],
      releaseYear: 2014,
      averageRating: 8.6,
    },
    {
      tmdbId: 27205,
      title: 'Inception',
      posterPath: '/9gk7adHYeDvHkCSEqAvQNLV5Uge.jpg',
      genre: ['Action', 'Science Fiction', 'Adventure'],
      releaseYear: 2010,
      averageRating: 8.8,
    },
    {
      tmdbId: 550,
      title: 'Fight Club',
      posterPath: '/pB8BM7pdSp6B6Ih7QZ4DrQ3PmJK.jpg',
      genre: ['Drama'],
      releaseYear: 1999,
      averageRating: 8.4,
    },
    {
      tmdbId: 155,
      title: 'The Dark Knight',
      posterPath: '/qJ2tW6WMUDux911r6m7haRef0WH.jpg',
      genre: ['Drama', 'Action', 'Crime', 'Thriller'],
      releaseYear: 2008,
      averageRating: 8.5,
    },
  ];

  // Масив, куди ми збережемо створені фільми, щоб взяти їх ID
  const createdMovies = [];

  for (const movieData of moviesData) {
    const movie = await prisma.movie.upsert({
      where: { tmdbId: movieData.tmdbId },
      update: {},
      create: movieData,
    });
    createdMovies.push(movie);
    console.log(`Created movie: ${movie.title} (ID: ${movie.id})`);
  }

  // 3. Створюємо Рецензії (Reviews)
  // Прив'язуємо рецензії до нашого користувача і створених фільмів

  const reviewsData = [
    {
      movieTitle: 'Interstellar',
      content: 'Це просто шедевр! Музика Ганса Циммера неймовірна.',
    },
    {
      movieTitle: 'Inception',
      content: 'Сюжет дуже заплутаний, але кінцівка того варта.',
    },
    {
      movieTitle: 'The Dark Knight',
      content: 'Найкращий фільм про супергероїв. Джокер неперевершений.',
    },
  ];

  for (const reviewData of reviewsData) {
    // Знаходимо фільм у нашому масиві за назвою
    const targetMovie = createdMovies.find(
      (m) => m.title === reviewData.movieTitle,
    );

    if (targetMovie) {
      // Перевіряємо, чи вже є рецензія від цього юзера на цей фільм (щоб не дублювати)
      const existingReview = await prisma.review.findFirst({
        where: {
          userId: user.id,
          movieId: targetMovie.id,
        },
      });

      if (!existingReview) {
        await prisma.review.create({
          data: {
            content: reviewData.content,
            userId: user.id,
            movieId: targetMovie.id,
          },
        });
        console.log(`Created review for: ${targetMovie.title}`);
      }
    }
  }

  console.log(' Seeding finished.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
