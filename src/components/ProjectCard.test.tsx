import { render, screen } from '@testing-library/react';
import ProjectCard from './ProjectCard';

const mockProject = {
  title: 'TaskFlow',
  description: 'A task management app with real-time collaboration',
  tech: ['React', 'TypeScript', 'Tailwind CSS']
};

describe('ProjectCard Component', () => {
  test('renders project card with all information', () => {
    render(<ProjectCard project={mockProject} />);
    
    expect(screen.getByText('TaskFlow')).toBeInTheDocument();
    expect(screen.getByText('A task management app with real-time collaboration')).toBeInTheDocument();
    expect(screen.getByText('React')).toBeInTheDocument();
    expect(screen.getByText('TypeScript')).toBeInTheDocument();
    expect(screen.getByText('Tailwind CSS')).toBeInTheDocument();
  });

  test('applies correct styling classes', () => {
    render(<ProjectCard project={mockProject} />);
    
    const card = screen.getByText('TaskFlow').closest('div');
    expect(card).toHaveClass('card');
    expect(card).toHaveStyle('background-color: white');
    expect(card).toHaveStyle('border: 1px solid rgb(243, 244, 246)');
  });

  test('displays tech stack as badges', () => {
    render(<ProjectCard project={mockProject} />);
    
    const badges = screen.getAllByText(/React|TypeScript|Tailwind CSS/);
    badges.forEach(badge => {
      expect(badge).toHaveStyle('background-color: #e9e5dd');
      expect(badge).toHaveStyle('color: #1a2e1a');
      expect(badge).toHaveClass('rounded-full');
    });
  });

  test('applies hover effects', () => {
    render(<ProjectCard project={mockProject} />);
    
    const card = screen.getByText('TaskFlow').closest('div');
    expect(card).toHaveClass('transition-all');
    expect(card).toHaveClass('duration-300');
    expect(card).toHaveClass('hover:translate-y-[-8px]');
  });
});
---