import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Film as FilmIcon, MessageSquare, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { PosterImage } from '@/components/PosterImage';
import { api } from '@/api/client';
import type { Film } from '@/types';

export default function Home() {
  const [films, setFilms] = useState<Film[]>([]);
  // Завантажуємо фільми з бекенду
  useEffect(() => {
    async function fetchFilms() {
      try {
        const response = await api.get('/api/films');
        setFilms(response.data.films || []);
      } catch (error) {
        console.error('Помилка завантаження фільмів', error);
      }
    }
    fetchFilms();
  }, []);

  const featured = films.slice(0, 4);

  return (
    <div>
      {/* постери*/}
      <section className="border-b border-border/60">
        <div className="container grid gap-10 py-16 md:grid-cols-2 md:items-center md:py-24">
          <div>
            <h1 className="text-balance font-display text-4xl font-semibold leading-[1.1] md:text-5xl">
              Кожен фільм заслуговує на чесну рецензію.
            </h1>
            <p className="mt-5 max-w-md text-base leading-relaxed text-muted-foreground">
              My Cinema — місце, де ви оцінюєте фільми, читаєте думки інших
              глядачів і знаходите наступне кіно на вечір.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Button asChild size="lg">
                <Link to="/films">
                  <FilmIcon className="h-4 w-4" />
                  Переглянути фільми
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline">
                <Link to="/reviews">
                  <MessageSquare className="h-4 w-4" />
                  Читати рецензії
                </Link>
              </Button>
            </div>
          </div>

          {/* */}
          <div className="relative mx-auto flex h-72 w-full max-w-sm items-center justify-center md:h-80">
            {featured.map((film, i) => {
              const offset = i - (featured.length - 1) / 2;
              return (
                <div
                  key={film.id}
                  className="absolute h-64 w-44 overflow-hidden rounded-lg border border-border shadow-2xl shadow-black/50 transition-transform duration-300 hover:z-10 hover:-translate-y-2"
                  style={{
                    transform: `translateX(${offset * 60}px) rotate(${offset * 6}deg)`,
                    zIndex: 10 - Math.abs(offset),
                  }}
                >
                  <PosterImage
                    src={film.posterPath}
                    alt={film.title}
                    className="h-full w-full object-cover"
                  />
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* дії */}
      <section className="container grid gap-6 py-16 md:grid-cols-2">
        <Link
          to="/films"
          className="group rounded-lg border border-border bg-card p-8 transition-colors hover:border-primary/50"
        >
          <FilmIcon className="h-6 w-6 text-primary" />
          <h2 className="mt-4 font-display text-xl font-semibold">
            Перегляньте наші фільми
          </h2>
          <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
            Шукайте за назвою чи жанром і слідкуйте за середнім рейтингом
            кожного фільму.
          </p>
          <span className="mt-4 inline-block text-sm font-medium text-primary group-hover:underline">
            Перейти до фільмів
          </span>
        </Link>

        <Link
          to="/reviews"
          className="group rounded-lg border border-border bg-card p-8 transition-colors hover:border-primary/50"
        >
          <Star className="h-6 w-6 text-primary" />
          <h2 className="mt-4 font-display text-xl font-semibold">
            Читайте рецензії
          </h2>
          <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
            Дізнайтеся, що думають інші глядачі, і додайте власний коментар до
            обговорення.
          </p>
          <span className="mt-4 inline-block text-sm font-medium text-primary group-hover:underline">
            Перейти до рецензій
          </span>
        </Link>
      </section>
    </div>
  );
}
