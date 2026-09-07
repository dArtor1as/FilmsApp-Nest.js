import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface BackButtonProps {
  fallback?: string; // куди йти, якщо історії немає
  label?: string;
  className?: string;
}

export function BackButton({
  fallback = '/',
  label = 'Назад',
  className,
}: BackButtonProps) {
  const navigate = useNavigate();

  function handleClick() {
    const canGoBack = (window.history.state?.idx ?? 0) > 0;
    if (canGoBack) {
      navigate(-1);
    } else {
      navigate(fallback);
    }
  }

  return (
    <Button
      variant="ghost"
      size="sm"
      className={className ?? '-ml-2'}
      onClick={handleClick}
    >
      <ArrowLeft className="h-4 w-4" />
      {label}
    </Button>
  );
}
