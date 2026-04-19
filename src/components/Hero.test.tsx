import { render, screen } from '@testing-library/react';
import { Hero } from './Hero';

describe('Hero Component', () => {
  test('renders hero section with correct content', () => {
    render(<Hero />);
    
    expect(screen.getByText('Jane Doe')).toBeInTheDocument();
    expect(screen.getByText('Full-Stack Developer & UI Enthusiast')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Contact Me' })).toBeInTheDocument();
  });

  test('applies correct styling classes', () => {
    render(<Hero />);
    
    const heroSection = screen.getByRole('region');
    expect(heroSection).toHaveClass('section');
    expect(heroSection).toHaveStyle('background-color: #faf8f5');
  });

  test('contains motion elements with correct initial state', () => {
    render(<Hero />);
    
    const heading = screen.getByRole('heading', { level: 1 });
    expect(heading).toHaveStyle('opacity: 0');
  });

  test('renders contact button with correct styling', () => {
    render(<Hero />);
    
    const button = screen.getByRole('link', { name: 'Contact Me' });
    expect(button).toHaveClass('btn');
    expect(button).toHaveStyle('color: white');
    expect(button).toHaveStyle('background-color: #e66000');
  });
});
---