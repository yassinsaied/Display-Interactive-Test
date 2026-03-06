import { PageLayout } from '@/shared/components/layout/PageLayout';
import {
  TechStackList,
  TestEnvironment,
  WorkTimeSummary,
  ApproachList,
  backendTechs,
  frontendTechs,
  infraTechs,
  timeEntries,
  dockerServices,
  approachCards,
} from '@/features/about';

export function AboutTestPage() {
  return (
    <PageLayout title="À Propos du Test" subtitle="Aperçu technique et approche d'implémentation">
      <div className="space-y-10 animate-fade-in max-w-5xl mx-auto">
        <TechStackList backend={backendTechs} frontend={frontendTechs} infra={infraTechs} />
        <TestEnvironment services={dockerServices} />
        <WorkTimeSummary entries={timeEntries} />
        <ApproachList cards={approachCards} />
      </div>
    </PageLayout>
  );
}

export default AboutTestPage;
