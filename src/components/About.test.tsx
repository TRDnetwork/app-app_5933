import { render, screen } from '@testing-library/react';
import { About } from './About';

describe('About Component', () => {
  test('renders about section with bio text', () => {
    render(<About />);
    
    expect(screen.getByText('About Me')).toBeInTheDocument();
    expect(screen.getByText(/I'm a full-stack developer with over 5 years of experience/i)).toBeInTheDocument();
  });

  test('applies correct section styling', () => {
    render(<About />);
    
    const aboutSection = screen.getByText('About Me').closest('section');
    expect(aboutSection).toHaveClass('section');
    expect(aboutSection).toHaveStyle('color: #1a2e1a');
  });

  test('renders with proper typography hierarchy', () => {
    render(<About />);
    
    const heading = screen.getByRole('heading', { level: 2 });
    expect(heading).toHaveStyle('font-family: Fraunces, serif');
    
    const paragraph = screen.getByText(/I'm a full-stack developer/i).closest('p');
    expect(paragraph).toHaveStyle('font-family: Satoshi, sans-serif');
    expect(paragraph).toHaveStyle('line-height: 1.6');
  });

  test('maintains responsive design', () => {
    render(<About />);
    
    const content = screen.getByText(/I'm a full-stack developer/i).closest('div');
    expect(content).toHaveClass('max-w-3xl');
    expect(content).toHaveClass('mx-auto');
  });
});
---