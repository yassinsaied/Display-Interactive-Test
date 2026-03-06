import { Target } from 'lucide-react';
import type { ApproachCard } from '../types';
import { AboutSection } from './AboutSection';

interface ApproachListProps {
  cards: ApproachCard[];
}

export function ApproachList({ cards }: ApproachListProps) {
  return (
    <AboutSection icon={<Target size={24} />} title="Approche">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {cards.map(card => (
          <div
            key={card.title}
            className="bg-white dark:bg-gray-800 rounded-lg shadow p-5 space-y-2"
          >
            <h4 className="font-semibold text-gray-900 dark:text-gray-100">{card.title}</h4>
            <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">{card.body}</p>
          </div>
        ))}
      </div>
    </AboutSection>
  );
}
