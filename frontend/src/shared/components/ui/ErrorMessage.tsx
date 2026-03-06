import { cn } from '@/shared/utils/cn';
import Button from './Button';

export type ErrorVariant = 'error' | 'warning' | 'info';

export interface ErrorVariantStyle {
  container: string;
  icon: string;
}

const errorVariants: Record<ErrorVariant, ErrorVariantStyle> = {
  error: { container: 'bg-red-50 border-red-200 text-red-800 dark:bg-red-950 dark:border-red-800 dark:text-red-300', icon: '❌' },
  warning: { container: 'bg-warning-50 border-warning-200 text-warning-800 dark:bg-warning-950 dark:border-warning-700 dark:text-warning-300', icon: '⚠️' },
  info: { container: 'bg-info-50 border-info-200 text-info-800 dark:bg-info-950 dark:border-info-700 dark:text-info-300', icon: 'ℹ️' },
};

interface ErrorMessageProps {
  title?: string;
  message: string;
  variant?: ErrorVariant;
  onRetry?: () => void;
  className?: string;
}

export function ErrorMessage({
  title,
  message,
  variant = 'error',
  onRetry,
  className,
}: ErrorMessageProps) {
  const styles = errorVariants[variant];

  return (
    <div className={cn('border rounded-lg p-4', styles.container, className)} role="alert">
      <div className="flex items-start gap-3">
        <span className="text-xl" aria-hidden="true">
          {styles.icon}
        </span>
        <div className="flex-1">
          {title && <h3 className="font-semibold mb-1">{title}</h3>}
          <p className="text-sm">{message}</p>
          {onRetry && (
            <Button variant="outline" size="sm" onClick={onRetry} className="mt-3">
              Retry
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}

export default ErrorMessage;
