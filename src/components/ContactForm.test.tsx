import { render, screen, fireEvent } from '@testing-library/react';
import { ContactForm } from './ContactForm';

describe('ContactForm Component', () => {
  beforeEach(() => {
    // Mock fetch for form submission
    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve({ success: true }),
      })
    ) as jest.Mock;
  });

  test('renders form with all required fields', () => {
    render(<ContactForm />);
    
    expect(screen.getByLabelText('Your Name')).toBeInTheDocument();
    expect(screen.getByLabelText('Your Email')).toBeInTheDocument();
    expect(screen.getByLabelText('Your Message')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Send Message' })).toBeInTheDocument();
  });

  test('shows validation errors for empty submission', async () => {
    render(<ContactForm />);
    
    const submitButton = screen.getByRole('button', { name: 'Send Message' });
    fireEvent.click(submitButton);
    
    expect(await screen.findByText('Name is required')).toBeInTheDocument();
    expect(await screen.findByText('Email is required')).toBeInTheDocument();
    expect(await screen.findByText('Message is required')).toBeInTheDocument();
  });

  test('shows error for invalid email format', async () => {
    render(<ContactForm />);
    
    const emailInput = screen.getByLabelText('Your Email');
    fireEvent.change(emailInput, { target: { value: 'invalid-email' } });
    
    const submitButton = screen.getByRole('button', { name: 'Send Message' });
    fireEvent.click(submitButton);
    
    expect(await screen.findByText('Email is invalid')).toBeInTheDocument();
  });

  test('submits form successfully with valid data', async () => {
    render(<ContactForm />);
    
    fireEvent.change(screen.getByLabelText('Your Name'), { target: { value: 'John Doe' } });
    fireEvent.change(screen.getByLabelText('Your Email'), { target: { value: 'john@example.com' } });
    fireEvent.change(screen.getByLabelText('Your Message'), { target: { value: 'Hello, I would like to work together!' } });
    
    const submitButton = screen.getByRole('button', { name: 'Send Message' });
    fireEvent.click(submitButton);
    
    expect(global.fetch).toHaveBeenCalledWith('/api/contact', expect.objectContaining({
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
    }));
  });

  test('disables button during submission', async () => {
    render(<ContactForm />);
    
    fireEvent.change(screen.getByLabelText('Your Name'), { target: { value: 'John Doe' } });
    fireEvent.change(screen.getByLabelText('Your Email'), { target: { value: 'john@example.com' } });
    fireEvent.change(screen.getByLabelText('Your Message'), { target: { value: 'Hello!' } });
    
    const submitButton = screen.getByRole('button', { name: 'Send Message' });
    fireEvent.click(submitButton);
    
    expect(submitButton).toBeDisabled();
  });

  test('shows success message after submission', async () => {
    render(<ContactForm />);
    
    fireEvent.change(screen.getByLabelText('Your Name'), { target: { value: 'John Doe' } });
    fireEvent.change(screen.getByLabelText('Your Email'), { target: { value: 'john@example.com' } });
    fireEvent.change(screen.getByLabelText('Your Message'), { target: { value: 'Hello!' } });
    
    const submitButton = screen.getByRole('button', { name: 'Send Message' });
    fireEvent.click(submitButton);
    
    expect(await screen.findByText('Message sent successfully!')).toBeInTheDocument();
  });
});
---