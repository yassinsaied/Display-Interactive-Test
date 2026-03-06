import { Container } from 'lucide-react';
import type { DockerService } from '../types';
import { AboutSection } from './AboutSection';

interface TestEnvironmentProps {
  services: DockerService[];
}

export function TestEnvironment({ services }: TestEnvironmentProps) {
  return (
    <AboutSection icon={<Container size={24} />} title="Environnement de Test">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 space-y-4">
        <p className="text-gray-700 dark:text-gray-300">
          La pile entière s'exécute dans <strong>Docker Compose</strong> avec cinq services:
        </p>
        <ul className="space-y-2 text-sm text-gray-700 dark:text-gray-300">
          {services.map(s => (
            <li key={s.name} className="flex gap-3">
              <code className="text-xs bg-gray-100 dark:bg-gray-700 text-primary-600 dark:text-primary-400 px-2 py-0.5 rounded font-mono whitespace-nowrap self-start mt-0.5">
                {s.name}
              </code>
              <span>{s.desc}</span>
            </li>
          ))}
        </ul>
        <p className="text-xs text-gray-500 dark:text-gray-400 border-t border-gray-100 dark:border-gray-700 pt-3">
          <strong>Volumes nommés</strong> (<code className="text-xs">backend_vendor</code>,{' '}
          <code className="text-xs">frontend_node_modules</code>) protègent les dépendances
          installées d'être écrasées par les bind mounts, permettant des redémarrages instantanés
          après le premier build.
        </p>
      </div>
    </AboutSection>
  );
}
