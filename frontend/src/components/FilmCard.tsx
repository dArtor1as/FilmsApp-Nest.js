import { Link } from 'react-router-dom';
import { Star } from 'lucide-react';
import { PosterImage } from '@/components/PosterImage';
import type { Film } from '@/types';

export function FilmCard({ film }: { film: Film }) {
  return (
    <Link
      to={`/films/${film.id}`}
      className="group block overflow-hidden rounded-lg border border-border bg-card transition-colors hover:border-primary/50"
    >
      <div className="relative aspect-2/3 overflow-hidden bg-muted">
        <PosterImage
          src={film.posterPath}
          alt={`Постер: ${film.title}`}
          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.03]"
        />
        <div className="absolute right-2 top-2 flex items-center gap-1 rounded-full bg-background/90 px-2 py-1 text-xs font-semibold text-primary shadow-sm">
          <Star className="h-3 w-3 fill-primary" />
          {film.averageRating.toFixed(1)}
        </div>
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-16 bg-linear-to-t from-black/70 to-transparent" />
      </div>
      <div className="p-3">
        <h3 className="truncate font-display text-base font-semibold leading-tight">
          {film.title}
        </h3>
        <p className="mt-1 text-sm text-muted-foreground">
          {film.releaseYear} · {film.genre}
        </p>
      </div>
    </Link>
  );
}
