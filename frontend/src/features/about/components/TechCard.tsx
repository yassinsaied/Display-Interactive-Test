import type { TechItem } from '../types';

export type ColorKey = 'primary' | 'success' | 'secondary';

const badgeMap: Record<ColorKey, string> = {
  primary: 'bg-primary-100 dark:bg-primary-900 text-primary-700 dark:text-primary-300',
  success: 'bg-success-100 dark:bg-success-900 text-success-700 dark:text-success-300',
  secondary: 'bg-secondary-100 dark:bg-secondary-800 text-secondary-700 dark:text-secondary-200',
};

interface TechCardProps {
  title: string;
  items: TechItem[];
  color: ColorKey;
}

export function TechCard({ title, items, color }: TechCardProps) {
  return (
    <div className="rounded-lg border p-4 space-y-3 bg-secondary-50 dark:bg-secondary-900 border-secondary-200 dark:border-secondary-700">
      <h4 className="font-semibold text-gray-900 dark:text-gray-100">{title}</h4>
      <ul className="space-y-2">
        {items.map(item => (
          <li key={item.name} className="flex items-center justify-between gap-2">
            <div>
              <span className="text-sm font-medium text-gray-900 dark:text-gray-100">
                {item.name}
              </span>
              <span className="text-xs text-gray-500 dark:text-gray-400 ml-1">v{item.version}</span>
            </div>
            <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${badgeMap[color]}`}>
              {item.role}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}
