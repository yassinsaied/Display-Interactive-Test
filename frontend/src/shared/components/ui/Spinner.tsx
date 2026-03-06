import { cn } from '@/shared/utils/cn';

export type SpinnerSize = 'sm' | 'md' | 'lg' | 'xl';

const spinnerSizes: Record<SpinnerSize, string> = {
  sm: 'h-4 w-4 border-2',
  md: 'h-6 w-6 border-2',
  lg: 'h-12 w-12 border-[3px]',
  xl: 'h-16 w-16 border-4',
};

interface SpinnerProps {
  size?: SpinnerSize;
  className?: string;
  label?: string;
  centered?: boolean;
}

export function Spinner({ size = 'md', className, label, centered = false }: SpinnerProps) {
  if (centered) {
    return (
      <div className="flex flex-col items-center justify-center gap-3" role="status">
        <div
          className={cn(
            'animate-spin rounded-full border-primary-600 border-t-transparent',
            spinnerSizes[size],
            className
          )}
          aria-hidden="true"
        />
        {label && <span className="text-sm text-gray-600 dark:text-gray-400">{label}</span>}
        <span className="sr-only">{label || 'Loading...'}</span>
      </div>
    );
  }

  return (
    <span role="status" aria-label={label || 'Loading'}>
      <span
        className={cn(
          'inline-block animate-spin rounded-full border-primary-600 border-t-transparent',
          spinnerSizes[size],
          className
        )}
        aria-hidden="true"
      />
    </span>
  );
}

export default Spinner;
