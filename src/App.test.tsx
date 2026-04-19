import { render, screen } from '@testing-library/react';
import App from './App';

describe('App Component', () => {
  test('renders all main sections', () => {
    render(<App />);
    
    expect(screen.getByText('Jane Doe')).toBeInTheDocument();
    expect(screen.getByText('About Me')).toBeInTheDocument();
    expect(screen.getByText('Featured Projects')).toBeInTheDocument();
    expect(screen.getByText('Get In Touch')).toBeInTheDocument();
  });

  test('navigates to contact section on button click', () => {
    render(<App />);
    
    const contactButton = screen.getByRole('link', { name: 'Contact Me' });
    expect(contactButton).toHaveAttribute('href', '#contact');
  });

  test('applies global styles correctly', () => {
    render(<App />);
    
    const body = document.body;
    expect(body).toHaveStyle('background-color: #faf8f5');
    expect(body).toHaveStyle('color: #1a2e1a');
    expect(body).toHaveStyle('font-family: Satoshi, sans-serif');
  });

  test('maintains responsive layout', () => {
    render(<App />);
    
    const mainContainer = screen.getByRole('main');
    expect(mainContainer).toHaveClass('min-h-screen');
    expect(mainContainer).toHaveClass('scroll-smooth');
  });

  test('renders section dividers', () => {
    render(<App />);
    
    const dividers = document.querySelectorAll('.divider');
    expect(dividers.length).toBe(3); // Between hero-about, about-projects, projects-contact
    dividers.forEach(divider => {
      expect(divider).toHaveStyle('border-top-color: #e66000');
    });
  });
});
---