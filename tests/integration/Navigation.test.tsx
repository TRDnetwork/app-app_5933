import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import App from '../../src/App';

describe('Navigation Integration', () => {
  beforeEach(() => {
    render(<App />);
  });

  test('navigates to about section when clicking about link in hero', async () => {
    const aboutLink = screen.getByRole('link', { name: /about/i });
    expect(aboutLink).toBeInTheDocument();
    
    // Click the link
    await userEvent.click(aboutLink);
    
    // Check if URL hash changed
    expect(window.location.hash).toBe('#about');
  });

  test('navigates to projects section when clicking projects link in navigation', async () => {
    const projectsLink = screen.getByRole('link', { name: /projects/i });
    expect(projectsLink).toBeInTheDocument();
    
    // Click the link
    await userEvent.click(projectsLink);
    
    // Check if URL hash changed
    expect(window.location.hash).toBe('#projects');
  });

  test('navigates to contact section when clicking contact link in navigation', async () => {
    const contactLink = screen.getByRole('link', { name: /contact/i });
    expect(contactLink).toBeInTheDocument();
    
    // Click the link
    await userEvent.click(contactLink);
    
    // Check if URL hash changed
    expect(window.location.hash).toBe('#contact');
  });

  test('navigation links maintain correct active state', async () => {
    // Initially, no section should be active (or hero is active)
    const aboutLink = screen.getByRole('link', { name: /about/i });
    const projectsLink = screen.getByRole('link', { name: /projects/i });
    const contactLink = screen.getByRole('link', { name: /contact/i });
    
    // Click about link
    await userEvent.click(aboutLink);
    expect(aboutLink).toHaveClass('text-orange');
    expect(projectsLink).not.toHaveClass('text-orange');
    expect(contactLink).not.toHaveClass('text-orange');
    
    // Click projects link
    await userEvent.click(projectsLink);
    expect(projectsLink).toHaveClass('text-orange');
    expect(aboutLink).not.toHaveClass('text-orange');
    expect(contactLink).not.toHaveClass('text-orange');
    
    // Click contact link
    await userEvent.click(contactLink);
    expect(contactLink).toHaveClass('text-orange');
    expect(aboutLink).not.toHaveClass('text-orange');
    expect(projectsLink).not.toHaveClass('text-orange');
  });

  test('smooth scrolling is applied to navigation links', () => {
    const navLinks = screen.getAllByRole('link');
    
    navLinks.forEach(link => {
      if (link.getAttribute('href')?.startsWith('#')) {
        expect(link).toHaveStyle('scroll-behavior: smooth');
      }
    });
  });

  test('header navigation is responsive and accessible', () => {
    const header = screen.getByRole('navigation', { name: /main/i });
    expect(header).toBeInTheDocument();
    
    const navLinks = screen.getAllByRole('link');
    expect(navLinks.length).toBeGreaterThan(0);
    
    // Check for proper ARIA labels
    expect(header).toHaveAttribute('aria-label', 'Main navigation');
  });
});