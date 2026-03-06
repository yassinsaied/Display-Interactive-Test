import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { cn } from '@/shared/utils/cn';
import { ThemeToggle } from '@/shared/components/ui/ThemeToggle';
import { navLinks } from '@/shared/lib/navLinks';

export function Navbar() {
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Ferme le menu mobile à chaque changement de route
  useEffect(() => {
    setIsMenuOpen(false);
  }, [location.pathname]);

  return (
    <header className="bg-gradient-to-r from-primary-600 to-primary-700 text-white shadow-lg">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between py-4">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3">
            <h1 className="text-xl sm:text-2xl font-bold text-white hover:text-primary-100 transition-colors">
              Display Interactive
            </h1>
            <p className="text-xs text-primary-200 hidden sm:block">Test Dev Fullstack</p>
          </Link>

          {/* Navigation desktop (md et plus) */}
          <nav className="hidden md:flex items-center gap-1" aria-label="Main navigation">
            {navLinks.map(link => (
              <Link
                key={link.path}
                to={link.path}
                className={cn(
                  'px-4 py-2 rounded-lg text-sm font-medium transition-colors',
                  location.pathname === link.path
                    ? 'bg-white/20 text-white'
                    : 'text-primary-100 hover:bg-white/10'
                )}
              >
                {link.label}
              </Link>
            ))}
            <ThemeToggle className="ml-2" />
          </nav>

          {/* Côté droit mobile : ThemeToggle + bouton hamburger */}
          <div className="flex items-center gap-2 md:hidden">
            <ThemeToggle />
            <button
              aria-label={isMenuOpen ? 'Fermer le menu' : 'Ouvrir le menu'}
              aria-expanded={isMenuOpen}
              aria-controls="mobile-menu"
              onClick={() => setIsMenuOpen(prev => !prev)}
              className="p-2 rounded-lg text-primary-100 hover:bg-white/10 transition-colors focus:outline-none focus:ring-2 focus:ring-white/30"
            >
              {isMenuOpen ? (
                /* Icône ✕ */
                <svg
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                  aria-hidden="true"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                /* Icône ☰ */
                <svg
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                  aria-hidden="true"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Menu déroulant mobile */}
      {isMenuOpen && (
        <nav
          id="mobile-menu"
          aria-label="Main navigation"
          className="md:hidden border-t border-white/10 bg-primary-700"
        >
          <ul className="container mx-auto px-4 py-2 flex flex-col gap-1">
            {navLinks.map(link => (
              <li key={link.path}>
                <Link
                  to={link.path}
                  className={cn(
                    'block px-4 py-3 rounded-lg text-sm font-medium transition-colors',
                    location.pathname === link.path
                      ? 'bg-white/20 text-white'
                      : 'text-primary-100 hover:bg-white/10'
                  )}
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      )}
    </header>
  );
}

export default Navbar;
