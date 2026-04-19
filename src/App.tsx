import React from 'react';
import { HashRouter, Routes, Route } from 'react-router-dom';
import { Hero } from './components/Hero';
import { About } from './components/About';
import { Projects } from './components/Projects';
import { ContactForm } from './components/ContactForm';

const App: React.FC = () => {
  return (
    <HashRouter>
      <div className="min-h-screen" style={{ backgroundColor: '#faf8f5' }}>
        <header className="sticky top-0 z-50 bg-[#faf8f5] shadow-sm" role="banner">
          <nav
            className="container mx-auto px-6 py-4"
            aria-label="Main navigation"
          >
            <ul className="flex flex-wrap justify-center gap-x-8 gap-y-4 sm:gap-x-12">
              {[
                { href: '#hero', label: 'Home' },
                { href: '#about', label: 'About' },
                { href: '#projects', label: 'Projects' },
                { href: '#contact', label: 'Contact' },
              ].map((item) => (
                <li key={item.href}>
                  <a
                    href={item.href}
                    className="font-medium text-[#1a2e1a] hover:text-[#e66000] transition-colors duration-200 text-sm sm:text-base"
                    aria-current={
                      window.location.hash === item.href ? 'page' : undefined
                    }
                  >
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        </header>

        <main>
          <Routes>
            <Route path="/" element={
              <>
                <Hero />
                <About />
                <Projects />
                <ContactForm />
              </>
            } />
          </Routes>
        </main>

        <footer
          className="py-8 text-center text-[#4a4538] text-sm"
          style={{ fontFamily: 'Satoshi, sans-serif' }}
          role="contentinfo"
        >
          <p>&copy; {new Date().getFullYear()} Jane Doe. All rights reserved.</p>
        </footer>
      </div>
    </HashRouter>
  );
};

export default App;
---