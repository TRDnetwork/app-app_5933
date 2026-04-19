import { render, screen } from '@testing-library/react';
import { Projects } from './Projects';

describe('Projects Component', () => {
  test('renders projects section with heading', () => {
    render(<Projects />);
    
    expect(screen.getByText('Featured Projects')).toBeInTheDocument();
    expect(screen.getByRole('heading', { level: 2 })).toBeInTheDocument();
  });

  test('displays all three project cards', () => {
    render(<Projects />);
    
    expect(screen.getByText('TaskFlow')).toBeInTheDocument();
    expect(screen.getByText('DataViz Studio')).toBeInTheDocument();
    expect(screen.getByText('AuthGuard')).toBeInTheDocument();
  });

  test('maintains responsive grid layout', () => {
    render(<Projects />);
    
    const container = screen.getByText('Featured Projects').closest('div');
    expect(container).toHaveClass('grid');
    expect(container).toHaveClass('gap-8');
    expect(container).toHaveClass('md:grid-cols-2');
    expect(container).toHaveClass('lg:grid-cols-3');
  });

  test('applies section divider styling', () => {
    render(<Projects />);
    
    const section = screen.getByText('Featured Projects').closest('section');
    expect(section).toHaveClass('section');
    expect(section).toHaveStyle('border-color: #e66000');
  });

  test('renders project cards with correct props', () => {
    render(<Projects />);
    
    // Check that each project has description and tech stack
    expect(screen.getByText(/task management app/i)).toBeInTheDocument();
    expect(screen.getByText(/data visualization platform/i)).toBeInTheDocument();
    expect(screen.getByText(/authentication system/i)).toBeInTheDocument();
    
    // Check tech stack presence
    expect(screen.getByText('React')).toBeInTheDocument();
    expect(screen.getByText('D3.js')).toBeInTheDocument();
    expect(screen.getByText('Node.js')).toBeInTheDocument();
  });
});
---