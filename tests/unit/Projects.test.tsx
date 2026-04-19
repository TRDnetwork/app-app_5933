import { render, screen } from '@testing-library/react';
import Projects from '../../src/components/Projects';

describe('Projects Component', () => {
  beforeEach(() => {
    render(<Projects />);
  });

  test('renders section with correct title', () => {
    expect(screen.getByText('Featured Projects')).toBeInTheDocument();
  });

  test('renders three project cards', () => {
    const projectCards = screen.getAllByRole('article');
    expect(projectCards).toHaveLength(3);
  });

  test('displays correct project titles', () => {
    expect(screen.getByText('TaskFlow')).toBeInTheDocument();
    expect(screen.getByText('DataViz Studio')).toBeInTheDocument();
    expect(screen.getByText('AuthGuard')).toBeInTheDocument();
  });

  test('displays project descriptions', () => {
    expect(screen.getByText(/collaborative task management platform/i)).toBeInTheDocument();
    expect(screen.getByText(/interactive dashboard builder/i)).toBeInTheDocument();
    expect(screen.getByText(/secure authentication microservice/i)).toBeInTheDocument();
  });

  test('displays correct tech stack tags', () => {
    const taskFlowTech = screen.getByText('React');
    expect(taskFlowTech).toBeInTheDocument();
    expect(taskFlowTech.parentElement).toHaveTextContent('ReactTypeScriptNode.jsPostgreSQLSocket.IO');
    
    const dataVizTech = screen.getByText('Vue');
    expect(dataVizTech).toBeInTheDocument();
    expect(dataVizTech.parentElement).toHaveTextContent('VueD3.jsPythonFastAPIRedis');
    
    const authGuardTech = screen.getByText('Next.js');
    expect(authGuardTech).toBeInTheDocument();
    expect(authGuardTech.parentElement).toHaveTextContent('Next.jsGoMongoDBJWTDocker');
  });

  test('project cards have correct styling classes', () => {
    const projectCards = screen.getAllByRole('article');
    projectCards.forEach(card => {
      expect(card).toHaveClass('bg-white');
      expect(card).toHaveClass('p-6');
      expect(card).toHaveClass('rounded-lg');
      expect(card).toHaveClass('shadow-sm');
      expect(card).toHaveClass('border');
      expect(card).toHaveClass('border-surface');
      expect(card).toHaveClass('hover:shadow-md');
    });
  });

  test('tech stack tags have correct styling', () => {
    const tags = screen.getAllByText(/React|TypeScript|Node.js|PostgreSQL|Socket.IO|Vue|D3.js|Python|FastAPI|Redis|Next.js|Go|MongoDB|JWT|Docker/i);
    tags.forEach(tag => {
      expect(tag).toHaveClass('px-3');
      expect(tag).toHaveClass('py-1');
      expect(tag).toHaveClass('bg-orange/10');
      expect(tag).toHaveClass('text-orange');
      expect(tag).toHaveClass('text-xs');
      expect(tag).toHaveClass('font-medium');
      expect(tag).toHaveClass('rounded-full');
    });
  });
});