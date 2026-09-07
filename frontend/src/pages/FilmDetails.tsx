import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { StarRating } from '@/components/StarRating';
import { BackButton } from '@/components/BackButton';
import { PosterImage } from '@/components/PosterImage';
import { api } from '@/api/client';
import type { Film } from '@/types';

export default function FilmDetails() {
  const { id } = useParams<{ id: string }>();
  const [film, setFilm] = useState<Film | null>(null);
  const [loading, setLoading] = useState(true);

  const [userRating, setUserRating] = useState(0);
  const [ratingSubmitted, setRatingSubmitted] = useState(false);
  const [review, setReview] = useState('');
  const [reviewSubmitted, setReviewSubmitted] = useState(false);

  // Отримання даних фільму та оцінки поточного користувача
  useEffect(() => {
    async function fetchFilmData() {
      try {
        // Отримуємо фільм
        const res = await api.get(`/api/films/${id}`);
        setFilm(res.data.film);

        // Отримуємо оцінку поточного користувача (якщо авторизований)
        if (localStorage.getItem('access_token')) {
          const ratingRes = await api.get(`/ratings/movie/${id}/me`);
          if (ratingRes.data.value) {
            setUserRating(ratingRes.data.value);
            setRatingSubmitted(true);
          }
        }
      } catch (err) {
        console.error('Помилка завантаження фільму', err);
      } finally {
        setLoading(false);
      }
    }
    fetchFilmData();
  }, [id]);

  async function handleRatingSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    try {
      await api.post('/api/ratings', {
        movieId: Number(id),
        value: userRating,
      });
      setRatingSubmitted(true);
      // Повторно завантажуємо дані фільму, щоб оновити середній рейтинг
      const res = await api.get(`/api/films/${id}`);
      setFilm(res.data.film);
    } catch (err) {
      console.error('Помилка при відправці оцінки', err);
      alert('Не вдалося зберегти оцінку');
    }
  }

  async function handleReviewSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!review.trim()) return;
    try {
      await api.post('/reviews', {
        movieId: Number(id),
        content: review,
      });
      setReviewSubmitted(true);
      setReview('');
    } catch (err) {
      console.error('Помилка при відправці рецензії', err);
    }
  }

  if (loading) return <div>Завантаження...</div>;
  if (!film) return <div>Фільм не знайдено</div>;

  return (
    <div className="container py-10">
      <BackButton className="mb-6" label="Назад" fallback="/films" />

      <div className="grid gap-10 md:grid-cols-[280px_1fr]">
        {/* Постер + рейтинг */}
        <div>
          <PosterImage
            src={film.posterPath}
            alt={`Постер: ${film.title}`}
            className="w-full aspect-2/3 rounded-lg border border-border object-cover"
          />

          <Card className="mt-5">
            <CardContent className="p-4">
              <h2 className="font-display text-sm font-semibold">
                Оцінити фільм
              </h2>
              <form onSubmit={handleRatingSubmit} className="mt-3 space-y-3">
                <StarRating
                  value={userRating}
                  onChange={setUserRating}
                  max={10}
                  readOnly={false}
                />
                <Button
                  type="submit"
                  size="sm"
                  className="w-full"
                  disabled={userRating === 0}
                >
                  {ratingSubmitted ? 'Оцінку оновлено' : 'Надіслати оцінку'}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>

        {/* Інформація */}
        <div>
          <h1 className="font-display text-3xl font-semibold">{film.title}</h1>
          <div className="mt-3 flex flex-wrap items-center gap-2">
            <Badge variant="outline">{film.genre}</Badge>
            <Badge variant="secondary">{film.releaseYear}</Badge>
          </div>

          <p className="mt-5 max-w-2xl leading-relaxed text-foreground/90">
            {film.synopsis}
          </p>

          <div className="mt-6 flex flex-wrap gap-8">
            <div>
              <p className="text-xs uppercase tracking-wide text-muted-foreground">
                Середня оцінка
              </p>
              <p className="mt-1 flex items-center gap-1.5 font-display text-2xl font-semibold">
                <Star className="h-5 w-5 fill-primary text-primary" />
                {film.averageRating.toFixed(1)}
              </p>
            </div>
            <div>
              <p className="text-xs uppercase tracking-wide text-muted-foreground">
                Ваша оцінка
              </p>
              <p className="mt-1 flex items-center gap-1.5 font-display text-2xl font-semibold">
                <Star className="h-5 w-5 fill-primary text-primary" />
                {ratingSubmitted ? userRating : '—'}
              </p>
            </div>
          </div>

          <div className="mt-10">
            <h2 className="font-display text-xl font-semibold">
              Залишити рецензію
            </h2>
            {reviewSubmitted && (
              <p className="mt-2 text-sm text-primary">
                Дякуємо! Вашу рецензію додано.
              </p>
            )}
            <form
              onSubmit={handleReviewSubmit}
              className="mt-4 max-w-xl space-y-3"
            >
              <div className="space-y-1.5">
                <Label htmlFor="content">Ваш відгук</Label>
                <Textarea
                  id="content"
                  value={review}
                  onChange={(e) => setReview(e.target.value)}
                  placeholder="Що вам сподобалось або не сподобалось у фільмі?"
                  required
                />
              </div>
              <Button type="submit">Опублікувати</Button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
