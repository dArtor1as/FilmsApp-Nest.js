import { useState, useEffect } from 'react';
import { ReviewItem } from '@/components/ReviewItem';
import { BackButton } from '@/components/BackButton';
import { api } from '@/api/client';
import type { Review } from '@/types';

export default function Reviews() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchReviews() {
      try {
        const response = await api.get('/api/reviews');
        setReviews(response.data.reviews || response.data);
      } catch (err) {
        console.error('Помилка завантаження рецензій', err);
      } finally {
        setLoading(false);
      }
    }
    fetchReviews();
  }, []);

  // Функція для видалення рецензії зі списку (передається в ReviewItem)
  function handleReviewDeleted(deletedReviewId: number) {
    setReviews(reviews.filter((review) => review.id !== deletedReviewId));
  }

  if (loading) {
    return <div className="container py-10">Завантаження рецензій...</div>;
  }

  return (
    <div className="container py-10">
      <BackButton fallback="/" className="mb-6" />
      <h1 className="font-display text-3xl font-semibold">Останні рецензії</h1>
      <p className="mt-1 text-sm text-muted-foreground">
        Думки глядачів про фільми та обговорення під ними.
      </p>

      {reviews.length > 0 ? (
        <div className="mt-8 space-y-6">
          {reviews.map((review) => (
            <ReviewItem
              key={review.id}
              review={review}
              onReviewDeleted={handleReviewDeleted}
            />
          ))}
        </div>
      ) : (
        <div className="mt-8 rounded-lg border border-dashed border-border py-16 text-center">
          <p className="text-muted-foreground">Рецензій ще немає.</p>
        </div>
      )}
    </div>
  );
}
