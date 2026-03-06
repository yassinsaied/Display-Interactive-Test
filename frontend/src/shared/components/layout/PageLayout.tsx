import type { ReactNode } from 'react';
import { Navbar } from './Navbar';
import { Footer } from './Footer';

interface PageLayoutProps {
  children: ReactNode;
  title?: string;
  subtitle?: string;
}

export function PageLayout({ children, title, subtitle }: PageLayoutProps) {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex flex-col transition-colors duration-200">
      {/* Lien d'accès rapide au contenu principal (visib uniquement au focus clavier) */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:z-50 focus:top-4 focus:left-4 focus:px-4 focus:py-2 focus:bg-primary-600 focus:text-white focus:rounded-lg focus:shadow-lg"
      >
        Aller au contenu principal
      </a>
      <Navbar />

      <main id="main-content" className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 flex-1">
        {(title || subtitle) && (
          <div className="mb-8">
            {title && (
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-gray-100">
                {title}
              </h2>
            )}
            {subtitle && <p className="mt-2 text-gray-600 dark:text-gray-400">{subtitle}</p>}
          </div>
        )}
        {children}
      </main>

      <Footer />
    </div>
  );
}

export default PageLayout;
