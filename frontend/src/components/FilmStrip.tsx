export function FilmStrip({ className = '' }) {
  return (
    <div
      aria-hidden="true"
      className={`h-3 w-full bg-[radial-gradient(circle,hsl(var(--background))_2.5px,transparent_3px)] bg-size-[18px_18px] bg-repeat-x bg-center ${className}`}
    />
  );
}
