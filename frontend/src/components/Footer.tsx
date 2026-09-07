import { Clapperboard } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t border-border/60 py-10">
      <div className="container flex flex-col items-center gap-3 text-center">
        <div className="flex items-center gap-2 font-display text-base">
          <Clapperboard className="h-4 w-4 text-primary" />
          My Cinema
        </div>
        <p className="text-sm text-muted-foreground">
          © 2026 My Cinema. Всі права захищені.
        </p>
        <a
          href="mailto:contact@mycinema.com"
          className="text-sm text-primary hover:underline"
        >
          contact@mycinema.com
        </a>
      </div>
    </footer>
  );
}
