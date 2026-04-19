import { render, screen } from '@testing-library/react';
import About from '../../src/components/About';

describe('About Component', () => {
  beforeEach(() => {
    render(<About />);
  });

  test('renders about section with correct id', () => {
    const aboutSection = screen.getByRole('region', { name: /about/i });
    expect(aboutSection).toBeInTheDocument();
    expect(aboutSection).toHaveAttribute('id', 'about');
  });

  test('displays section title', () => {
    expect(screen.getByText('About Me')).toBeInTheDocument();
  });

  test('has correct styling for section title', () => {
    const title = screen.getByText('About Me');
    expect(title).toHaveClass('text-3xl');
    expect(title).toHaveClass('md:text-4xl');
    expect(title).toHaveClass('font-display');
    expect(title).toHaveClass('font-semibold');
    expect(title).toHaveClass('text-green-darker');
    expect(title).toHaveClass('mb-8');
    expect(title).toHaveClass('text-center');
  });

  test('displays personal summary paragraph', () => {
    const summary = screen.getByText(/I'm a passionate full-stack developer/i);
    expect(summary).toBeInTheDocument();
    expect(summary.tagName).toBe('P');
  });

  test('personal summary has correct styling', () => {
    const summary = screen.getByText(/I'm a passionate full-stack developer/i);
    expect(summary).toHaveClass('text-lg');
    expect(summary).toHaveClass('md:text-xl');
    expect(summary).toHaveClass('text-green-dim');
    expect(summary).toHaveClass('max-w-3xl');
    expect(summary).toHaveClass('mx-auto');
    expect(summary).toHaveClass('text-center');
    expect(summary).toHaveClass('leading-relaxed');
  });

  test('section has correct background and padding', () => {
    const aboutSection = screen.getByRole('region', { name: /about/i });
    expect(aboutSection).toHaveClass('py-24');
    expect(aboutSection).toHaveClass('px-6');
  });

  test('section has correct container styling', () => {
    const container = screen.getByText(/I'm a passionate full-stack developer/i).closest('div');
    expect(container).toHaveClass('container');
    expect(container).toHaveClass('mx-auto');
    expect(container).toHaveClass('max-w-4xl');
  });
});