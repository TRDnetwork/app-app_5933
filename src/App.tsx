import { Hero } from './components/Hero';
import { About } from './components/About';
import { Projects } from './components/Projects';
import { ContactForm } from './components/ContactForm';
import { useEffect } from 'react';
import { useReducedMotion } from 'framer-motion';

function App() {
  const prefersReducedMotion = useReducedMotion();

  // a11y fix: respect user's motion preference
  useEffect(() => {
    if (prefersReducedMotion) {
      document.body.style.setProperty('scroll-behavior', 'auto');
    }
  }, [prefersReducedMotion]);

  return (
    <div className="min-h-screen scroll-smooth bg-cream">
      {/* Skip to content link for keyboard users */}
      <a 
        href="#main-content" 
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 z-50 px-4 py-2 bg-[#e66000] text-white rounded-lg transition-all duration-300 min-h-11"
      >
        Skip to content
      </a>

      <main id="main-content" role="main">
        <Hero />
        <div className="divider" /> {/* a11y fix: visual divider with sufficient contrast */}
        <About />
        <div className="divider" /> {/* a11y fix: visual divider with sufficient contrast */}
        <Projects />
        <div className="divider" /> {/* a11y fix: visual divider with sufficient contrast */}
        <ContactForm />
      </main>
    </div>
  );
}

export default App;
---