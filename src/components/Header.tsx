import { motion } from 'framer-motion';
import { useReducedMotion } from 'framer-motion';

export const Header = () => {
  const prefersReducedMotion = useReducedMotion();
  const navItems = [
    { name: 'Home', href: '#home' },
    { name: 'About', href: '#about' },
    { name: 'Projects', href: '#projects' },
    { name: 'Contact', href: '#contact' },
  ];

  return (
    <header 
      className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-surface"
      role="banner"
    >
      <div className="max-w-5xl mx-auto px-4 py-4">
        <nav 
          className="flex justify-center space-x-8"
          role="navigation"
          aria-label="Main navigation"
        >
          {navItems.map((item) => (
            <motion.a
              key={item.name}
              href={item.href}
              className="text-text-dim hover:text-accent font-medium transition-colors tap-target"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ 
                duration: prefersReducedMotion ? 0 : 0.3,
                delay: prefersReducedMotion ? 0 : 0.1 
              }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {item.name}
            </motion.a>
          ))}
        </nav>
      </div>
    </header>
  );
};
---