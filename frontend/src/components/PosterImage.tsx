import { useState } from 'react';
import { Clapperboard } from 'lucide-react';
import { cn } from '@/lib/utils';

interface PosterImageProps {
  src?: string | null;
  alt: string;
  className?: string;
}
export function PosterImage({ src, alt, className }: PosterImageProps) {
  const [failed, setFailed] = useState(false);
  const showFallback = failed || !src;

  if (showFallback) {
    return (
      <div
        role="img"
        aria-label={alt}
        className={cn('flex items-center justify-center bg-muted', className)}
      >
        <Clapperboard className="h-1/4 w-1/4 min-h-6 min-w-6 text-muted-foreground/60" />
      </div>
    );
  }

  return (
    <img
      src={`https://image.tmdb.org/t/p/w500${src}`}
      alt={alt}
      loading="lazy"
      onError={() => setFailed(true)}
      className={className}
    />
  );
}
