import { Clock } from 'lucide-react';
import type { TimeEntry } from '../types';
import { AboutSection } from './AboutSection';

interface WorkTimeSummaryProps {
  entries: TimeEntry[];
}

export function WorkTimeSummary({ entries }: WorkTimeSummaryProps) {
  const totalHours = entries.reduce((sum, e) => sum + e.hours, 0);

  return (
    <AboutSection
      icon={<Clock size={24} />}
      title="Répartition du Temps"
      trailing={
        <span className="ml-auto text-base font-semibold text-primary-600 dark:text-primary-400">
          Total: {totalHours.toFixed(1)}h
        </span>
      }
    >
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead className="bg-gray-50 dark:bg-gray-900">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider">
                Tâche
              </th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider">
                Description
              </th>
              <th className="px-6 py-3 text-right text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider">
                Heures
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
            {entries.map((entry, i) => (
              <tr
                key={i}
                className={
                  i % 2 === 1 ? 'bg-gray-50 dark:bg-gray-900/50' : 'bg-white dark:bg-gray-800'
                }
              >
                <td className="px-6 py-3 text-sm font-medium text-gray-900 dark:text-gray-100 whitespace-nowrap">
                  {entry.task}
                </td>
                <td className="px-6 py-3 text-sm text-gray-500 dark:text-gray-400">
                  {entry.description}
                </td>
                <td className="px-6 py-3 text-sm font-semibold text-primary-600 dark:text-primary-400 text-right">
                  {entry.hours.toFixed(1)}h
                </td>
              </tr>
            ))}
          </tbody>
          <tfoot className="bg-gray-50 dark:bg-gray-900">
            <tr>
              <td
                colSpan={2}
                className="px-6 py-3 text-sm font-bold text-gray-900 dark:text-gray-100"
              >
                Total
              </td>
              <td className="px-6 py-3 text-sm font-bold text-primary-600 dark:text-primary-400 text-right">
                {totalHours.toFixed(1)}h
              </td>
            </tr>
          </tfoot>
        </table>
      </div>
    </AboutSection>
  );
}
