import { useNavigate } from 'react-router-dom';
import { PageLayout } from '@/shared/components/layout/PageLayout';
import { Button } from '@/shared/components/ui/Button';

export function HomePage() {
  const navigate = useNavigate();

  return (
    <PageLayout>
      <div className="flex flex-col items-center justify-center py-24 text-center animate-fade-in">
        <div className="max-w-3xl space-y-6">
          <span className="inline-block px-4 py-1.5 rounded-full bg-primary-100 dark:bg-primary-900 text-primary-700 dark:text-primary-300 text-sm font-semibold tracking-wide uppercase">
            Test Dev Fullstack
          </span>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-gray-900 dark:text-gray-100 leading-tight">
            Welcome to{' '}
            <span className="bg-gradient-to-r from-primary-600 to-primary-400 bg-clip-text text-transparent">
              Display Interactive
            </span>
          </h1>

          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
            <Button size="lg" onClick={() => navigate('/customers')}>
              Test The Test →
            </Button>
            <Button size="lg" variant="outline" onClick={() => navigate('/about')}>
              About This Test →
            </Button>
          </div>
        </div>
      </div>
    </PageLayout>
  );
}

export default HomePage;
