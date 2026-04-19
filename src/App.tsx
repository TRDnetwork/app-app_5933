import { useEffect } from 'react';
import { Hero } from './components/Hero';
import { About } from './components/About';
import { Projects } from './components/Projects';
import { ContactForm } from './components/ContactForm';
import { Header } from './components/Header';

export default function App() {
  useEffect(() => {
    // Add smooth scrolling behavior
    document.documentElement.style.scrollBehavior = 'smooth';
    
    return () => {
      document.documentElement.style.scrollBehavior = 'auto';
    };
  }, []);

  return (
    <>
      <Header />
      <main 
        id="main-content" 
        className="min-h-screen scroll-smooth bg-bg"
        role="main"
      >
        <Hero />
        <div className="divider"></div>
        <About />
        <div className="divider"></div>
        <Projects />
        <div className="divider"></div>
        <ContactForm />
      </main>
    </>
  );
}
---