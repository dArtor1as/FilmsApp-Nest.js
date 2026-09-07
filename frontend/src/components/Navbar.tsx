import { NavLink } from 'react-router-dom';
import { Clapperboard } from 'lucide-react';
import { cn } from '@/lib/utils';

const links = [
  { to: '/films', label: 'Фільми' },
  { to: '/reviews', label: 'Рецензії' },
];

export function Navbar() {
  return (
    <header className="sticky top-0 z-40 border-b border-border/60 bg-background/85 backdrop-blur">
      <div className="container flex h-16 items-center justify-between">
        <NavLink
          to="/"
          className="flex items-center gap-2 font-display text-lg font-semibold"
        >
          <Clapperboard className="h-5 w-5 text-primary" />
          My Cinema
        </NavLink>

        <nav className="flex items-center gap-6">
          {links.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              className={({ isActive }) =>
                cn(
                  'text-sm text-muted-foreground transition-colors hover:text-foreground',
                  isActive && 'text-foreground',
                )
              }
            >
              {link.label}
            </NavLink>
          ))}
          <NavLink
            to="/login"
            className="rounded-md border border-primary/40 px-3 py-1.5 text-sm text-primary transition-colors hover:bg-primary hover:text-primary-foreground"
          >
            Увійти
          </NavLink>
        </nav>
      </div>
    </header>
  );
}
