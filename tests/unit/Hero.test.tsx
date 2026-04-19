import { render, screen } from '@testing-library/react';
import Hero from '../../src/components/Hero';

describe('Hero Component', () => {
  beforeEach(() => {
    render(<Hero />);
  });

  test('renders hero section with correct id', () => {
    const heroSection = screen.getByRole('banner');
    expect(heroSection).toBeInTheDocument();
    expect(heroSection).toHaveAttribute('id', 'hero');
  });

  test('displays developer name', () => {
    expect(screen.getByText('Alex Morgan')).toBeInTheDocument();
  });

  test('displays correct role title', () => {
    expect(screen.getByText('Full-Stack Developer & Open Source Contributor')).toBeInTheDocument();
  });

  test('has correct styling classes for name', () => {
    const nameElement = screen.getByText('Alex Morgan');
    expect(nameElement).toHaveClass('text-4xl');
    expect(nameElement).toHaveClass('md:text-6xl');
    expect(nameElement).toHaveClass('font-display');
    expect(nameElement).toHaveClass('font-bold');
    expect(nameElement).toHaveClass('text-green-darker');
  });

  test('has correct styling classes for role', () => {
    const roleElement = screen.getByText('Full-Stack Developer & Open Source Contributor');
    expect(roleElement).toHaveClass('text-xl');
    expect(roleElement).toHaveClass('md:text-2xl');
    expect(roleElement).toHaveClass('text-green-dim');
    expect(roleElement).toHaveClass('mt-6');
  });

  test('contains smooth scroll navigation link', () => {
    const aboutLink = screen.getByRole('link', { name: /about/i });
    expect(aboutLink).toBeInTheDocument();
    expect(aboutLink).toHaveAttribute('href', '#about');
  });

  test('navigation link has correct styling', () => {
    const aboutLink = screen.getByRole('link', { name: /about/i });
    expect(aboutLink).toHaveClass('inline-flex');
    expect(aboutLink).toHaveClass('items-center');
    expect(aboutLink).toHaveClass('text-orange');
    expect(aboutLink).toHaveClass('font-medium');
    expect(aboutLink).toHaveClass('mt-8');
    expect(aboutLink).toHaveClass('hover:text-orange-alt');
  });

  test('contains arrow down icon for visual cue', () => {
    const arrowIcon = screen.getByTestId('arrow-down-icon');
    expect(arrowIcon).toBeInTheDocument();
  });
});