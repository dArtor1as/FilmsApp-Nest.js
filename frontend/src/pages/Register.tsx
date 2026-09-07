import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Clapperboard, Eye, EyeOff } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { FilmStrip } from '@/components/FilmStrip';
import { BackButton } from '@/components/BackButton';
import { api } from '@/api/client';

export default function Register() {
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError('');
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    const data = Object.fromEntries(formData);

    try {
      await api.post('/auth/register', {
        username: data.username,
        email: data.email,
        password: data.password,
      });
      // Після успішної реєстрації перенаправляємо на логін
      navigate('/login');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Помилка при реєстрації');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center bg-muted/20 px-4 py-12">
      <BackButton
        fallback="/"
        className="absolute left-4 top-4 sm:left-8 sm:top-8"
      />
      <div className="w-full max-w-sm overflow-hidden rounded-lg border border-border bg-card">
        <FilmStrip />
        <div className="p-8">
          <div className="mb-6 flex flex-col items-center gap-2 text-center">
            <BackButton fallback="/" className="mb-4" />
            <Clapperboard className="h-7 w-7 text-primary" />
            <h1 className="font-display text-2xl font-semibold">Реєстрація</h1>
            <p className="text-sm text-muted-foreground">
              Створіть акаунт, щоб почати оцінювати фільми.
            </p>
          </div>

          {error && (
            <div
              role="alert"
              className="mb-4 rounded-md border border-destructive/40 bg-destructive/10 px-3 py-2 text-sm text-destructive"
            >
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="username">Ім'я користувача</Label>
              <Input id="username" name="username" required />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="email">Email</Label>
              <Input id="email" name="email" type="email" required />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="password">Пароль</Label>
              <div className="relative">
                <Input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  required
                  className="pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((s) => !s)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  aria-label={
                    showPassword ? 'Приховати пароль' : 'Показати пароль'
                  }
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>
            </div>
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? 'Реєструємо...' : 'Зареєструватися'}
            </Button>
          </form>

          <p className="mt-6 text-center text-sm text-muted-foreground">
            Вже маєте акаунт?{' '}
            <Link
              to="/login"
              className="font-medium text-primary hover:underline"
            >
              Авторизація
            </Link>
          </p>
        </div>
        <FilmStrip />
      </div>
    </div>
  );
}
