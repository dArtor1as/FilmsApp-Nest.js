import { useMemo, useState, useEffect } from 'react';
import { Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { FilmCard } from '@/components/FilmCard';
import { api } from '@/api/client';
import type { Film } from '@/types';

export default function Films() {
  const [films, setFilms] = useState<Film[]>([]);
  const [genres, setGenres] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  const [query, setQuery] = useState('');
  const [genre, setGenre] = useState('all');

  useEffect(() => {
    async function fetchFilms() {
      try {
        const response = await api.get('/api/films');
        setFilms(response.data.films || []);
        setGenres(response.data.genres || []);
      } catch (error) {
        console.error('Помилка завантаження фільмів', error);
      } finally {
        setLoading(false);
      }
    }
    fetchFilms();
  }, []);

  const filtered = useMemo(() => {
    return films.filter((film) => {
      const matchesTitle = film.title
        .toLowerCase()
        .includes(query.trim().toLowerCase());
      const matchesGenre = genre === 'all' || film.genre.includes(genre);
      return matchesTitle && matchesGenre;
    });
  }, [films, query, genre]);

  function handleReset() {
    setQuery('');
    setGenre('all');
  }

  if (loading) return <div className="container py-10">Завантаження...</div>;

  return (
    <div className="container py-10">
      <div className="mb-8 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="font-display text-3xl font-semibold">Фільми</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {filtered.length} з {films.length} фільмів
          </p>
        </div>
      </div>

      <form
        onSubmit={(e) => e.preventDefault()}
        className="mb-8 flex flex-col gap-3 sm:flex-row"
      >
        <div className="relative flex-1">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Пошук за назвою..."
            className="pl-9"
          />
        </div>
        <Select value={genre} onValueChange={setGenre}>
          <SelectTrigger className="sm:w-48">
            <SelectValue placeholder="Жанр" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Усі жанри</SelectItem>
            {genres.map((g) => (
              <SelectItem key={g} value={g}>
                {g}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Button type="button" variant="outline" onClick={handleReset}>
          Скинути
        </Button>
      </form>

      {filtered.length > 0 ? (
        <div className="grid grid-cols-2 gap-5 sm:grid-cols-3 lg:grid-cols-4">
          {filtered.map((film) => (
            <FilmCard key={film.id} film={film} />
          ))}
        </div>
      ) : (
        <div className="rounded-lg border border-dashed border-border py-16 text-center">
          <p className="text-muted-foreground">
            Нічого не знайдено. Спробуйте інший запит або жанр.
          </p>
        </div>
      )}
    </div>
  );
}
