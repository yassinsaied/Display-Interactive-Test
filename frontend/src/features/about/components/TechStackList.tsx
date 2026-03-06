import { Wrench } from 'lucide-react';
import type { TechItem } from '../types';
import { TechCard } from './TechCard';
import { AboutSection } from './AboutSection';

interface TechStackListProps {
  backend: TechItem[];
  frontend: TechItem[];
  infra: TechItem[];
}

export function TechStackList({ backend, frontend, infra }: TechStackListProps) {
  return (
    <AboutSection icon={<Wrench size={24} />} title="Technologies Utilisées">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <TechCard title="Backend" items={backend} color="primary" />
        <TechCard title="Frontend" items={frontend} color="success" />
        <TechCard title="Infrastructure" items={infra} color="secondary" />
      </div>
    </AboutSection>
  );
}
