import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

const navItems = [
  { label: 'Facilities', path: '/facilities' },
  { label: 'Graph', path: '/graph' },
  { label: 'Amendments', path: '/amendments' },
  { label: 'Compliance', path: '/compliance' },
  { label: 'Activity', path: '/activity' },
];

export function Navigation() {
  const location = useLocation();
  const isLanding = location.pathname === '/';

  return (
    <motion.header
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
      className={cn(
        'fixed top-0 left-0 right-0 z-50 transition-all duration-300',
        isLanding ? 'bg-transparent' : 'glass'
      )}
    >
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className="relative w-8 h-8">
              <svg
                viewBox="0 0 32 32"
                className="w-full h-full"
                fill="none"
              >
                <circle
                  cx="16"
                  cy="16"
                  r="14"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  className="text-primary/50"
                />
                <circle
                  cx="16"
                  cy="16"
                  r="6"
                  fill="currentColor"
                  className="text-primary"
                />
                <line
                  x1="16"
                  y1="10"
                  x2="16"
                  y2="2"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  className="text-primary/70"
                />
                <line
                  x1="22"
                  y1="16"
                  x2="30"
                  y2="16"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  className="text-primary/70"
                />
                <line
                  x1="16"
                  y1="22"
                  x2="16"
                  y2="30"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  className="text-primary/70"
                />
                <line
                  x1="10"
                  y1="16"
                  x2="2"
                  y2="16"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  className="text-primary/70"
                />
              </svg>
            </div>
            <span className="font-serif text-lg font-medium text-foreground group-hover:text-primary transition-colors">
              Covenant Graph
            </span>
          </Link>

          {/* Navigation */}
          <nav className="hidden md:flex items-center gap-1">
            {navItems.map((item) => {
              const isActive = location.pathname === item.path || 
                (item.path !== '/' && location.pathname.startsWith(item.path));
              
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={cn(
                    'relative px-4 py-2 text-sm font-medium transition-colors rounded-md',
                    isActive
                      ? 'text-primary'
                      : 'text-muted-foreground hover:text-foreground'
                  )}
                >
                  {item.label}
                  {isActive && (
                    <motion.div
                      layoutId="nav-indicator"
                      className="absolute bottom-0 left-2 right-2 h-0.5 bg-primary rounded-full"
                      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                    />
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Actions */}
          <div className="flex items-center gap-4">
            {!isLanding && (
              <Link
                to="/facilities/new"
                className="hidden sm:flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground text-sm font-medium rounded-md hover:bg-primary/90 transition-colors"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                New Facility
              </Link>
            )}
          </div>
        </div>
      </div>
    </motion.header>
  );
}
