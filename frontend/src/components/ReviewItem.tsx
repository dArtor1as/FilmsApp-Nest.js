import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { FilmStrip } from '@/components/FilmStrip';
import { PosterImage } from '@/components/PosterImage';
import { formatDate } from '@/lib/date.js';
import { api } from '@/api/client';
import { Trash2 } from 'lucide-react';
import type { Review, Comment } from '@/types';
import { useAuth } from '@/lib/auth';

function initials(username?: string) {
  return username?.slice(0, 2).toUpperCase() || 'U';
}

interface ReviewItemProps {
  review: Review;
  onReviewDeleted: (id: number) => void;
}

export function ReviewItem({ review, onReviewDeleted }: ReviewItemProps) {
  const { user } = useAuth();
  const currentUser = user?.username;

  const [commentContent, setCommentContent] = useState('');
  const [comments, setComments] = useState<Comment[]>(review.comments || []);

  async function handleAddComment(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!commentContent.trim()) return;

    try {
      // Робимо запит до бекенду
      const response = await api.post('/api/comments', {
        reviewId: review.id,
        content: commentContent,
      });
      setComments([...comments, response.data]);
      setCommentContent('');
    } catch (err) {
      console.error('Помилка додавання коментаря', err);
      alert('Помилка додавання коментаря');
    }
  }

  async function handleDeleteReview() {
    if (!confirm('Ви впевнені, що хочете видалити цю рецензію?')) return;
    try {
      await api.delete(`/api/reviews/${review.id}`);
      // Викликаємо колбек, переданий з батьківського компонента, щоб прибрати рецензію зі списку
      if (onReviewDeleted) onReviewDeleted(review.id);
    } catch (err) {
      console.error('Помилка видалення рецензії', err);
      alert('Не вдалося видалити рецензію');
    }
  }

  async function handleDeleteComment(commentId: number) {
    if (!confirm('Ви впевнені, що хочете видалити цей коментар?')) return;
    try {
      await api.delete(`/api/comments/${commentId}`);
      // Оновлюємо локальний стейт коментарів
      setComments(comments.filter((c) => c.id !== commentId));
    } catch (err) {
      console.error('Помилка видалення коментаря', err);
      alert('Не вдалося видалити коментар');
    }
  }

  return (
    <article className="overflow-hidden rounded-lg border border-border bg-card">
      <div className="flex gap-4 p-5 relative">
        <Link to={`/films/${review.movie.id}`} className="shrink-0">
          <PosterImage
            src={review.movie?.posterPath}
            alt={`Постер: ${review.movie?.title}`}
            className="h-28 w-20 rounded-md object-cover"
          />
        </Link>
        <div className="min-w-0 flex-1">
          <Link
            to={`/films/${review.movie.id}`}
            className="font-display text-base font-semibold hover:text-primary"
          >
            {review.movie?.title}
          </Link>
          <p className="mt-2 text-sm leading-relaxed text-foreground/90">
            {review.content}
          </p>
          <div className="mt-3 flex items-center gap-2 text-xs text-muted-foreground">
            <Avatar className="h-6 w-6">
              <AvatarFallback className="text-[10px]">
                {initials(review.user?.username)}
              </AvatarFallback>
            </Avatar>
            <span className="font-medium text-foreground/80">
              {review.user?.username}
            </span>
            <span aria-hidden="true">·</span>
            <span>{formatDate(review.createdAt || new Date())}</span>
          </div>
        </div>

        {/* Кнопка видалення рецензії, якщо це автор */}
        {currentUser === review.user?.username && (
          <Button
            variant="ghost"
            size="icon"
            className="absolute top-4 right-4 text-destructive/70 hover:text-destructive"
            onClick={handleDeleteReview}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        )}
      </div>

      <FilmStrip />

      <div className="space-y-4 bg-muted/30 p-5">
        {comments.length > 0 ? (
          <ul className="space-y-3">
            {comments.map((c) => (
              <li
                key={c.id}
                className="border-l-2 border-primary/40 pl-3 relative"
              >
                <div className="pr-8">
                  <p className="text-sm text-foreground/90">{c.content}</p>
                  <p className="mt-1 text-xs text-muted-foreground">
                    <span className="font-medium text-foreground/70">
                      {c.user?.username}
                    </span>
                    {' · '}
                    {formatDate(c.createdAt || new Date())}
                  </p>
                </div>
                {/* Кнопка видалення коментаря, якщо це автор */}
                {currentUser === c.user?.username && (
                  <Button
                    variant="ghost"
                    size="icon"
                    className="absolute top-0 right-0 h-6 w-6 text-destructive/70 hover:text-destructive"
                    onClick={() => handleDeleteComment(c.id)}
                  >
                    <Trash2 className="h-3 w-3" />
                  </Button>
                )}
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-sm text-muted-foreground">Коментарів ще немає.</p>
        )}

        {currentUser && (
          <form onSubmit={handleAddComment} className="flex gap-2">
            <Textarea
              value={commentContent}
              onChange={(e) => setCommentContent(e.target.value)}
              placeholder="Додати коментар..."
              className="min-h-10 flex-1 resize-none bg-background"
              rows={1}
            />
            <Button type="submit" size="sm" className="self-end">
              Надіслати
            </Button>
          </form>
        )}
      </div>
    </article>
  );
}
