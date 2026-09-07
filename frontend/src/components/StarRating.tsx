import { useState } from 'react';
import { Star } from 'lucide-react';
import { cn } from '@/lib/utils';
interface StarRatingProps {
  value: number;
  onChange?: (value: number) => void;
  max: number;
  readOnly: boolean;
}
// Інтерактивний рейтинг зірками (1–10).
export function StarRating({
  value = 0,
  onChange,
  max = 10,
  readOnly = false,
}: StarRatingProps) {
  const [hovered, setHovered] = useState<number | null>(null);
  const active = hovered ?? value;

  return (
    <div
      className="flex items-center gap-1"
      role={readOnly ? undefined : 'radiogroup'}
    >
      {Array.from({ length: max }, (_, i) => i + 1).map((star) => (
        <button
          key={star}
          type="button"
          disabled={readOnly}
          aria-label={`${star} з ${max}`}
          onMouseEnter={() => !readOnly && setHovered(star)}
          onMouseLeave={() => !readOnly && setHovered(null)}
          onClick={() => !readOnly && onChange?.(star)}
          className={cn(
            'transition-transform',
            !readOnly &&
              'hover:scale-110 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-sm',
          )}
        >
          <Star
            className={cn(
              'h-5 w-5 transition-colors',
              star <= active
                ? 'fill-primary text-primary'
                : 'fill-transparent text-muted-foreground',
            )}
          />
        </button>
      ))}
    </div>
  );
}
