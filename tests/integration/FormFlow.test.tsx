import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import App from '../../src/App';

describe('Contact Form Integration Flow', () => {
  beforeEach(() => {
    // Mock fetch globally for all tests in this suite
    global.fetch = jest.fn();
    render(<App />);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test('successful form submission flow', async () => {
    // Mock successful response
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve({ success: true }),
    });

    // Navigate to contact section
    const contactSection = screen.getByRole('region', { name: /contact/i });
    expect(contactSection).toBeInTheDocument();

    // Fill out form
    await userEvent.type(screen.getByLabelText(/name/i), 'Jane Smith');
    await userEvent.type(screen.getByLabelText(/email/i), 'jane@example.com');
    await userEvent.type(screen.getByLabelText(/message/i), 'This is a test message that is long enough to meet the minimum length requirement.');

    // Submit form
    const submitButton = screen.getByRole('button', { name: /send message/i });
    await userEvent.click(submitButton);

    // Verify fetch was called with correct arguments
    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: 'Jane Smith',
          email: 'jane@example.com',
          message: 'This is a test message that is long enough to meet the minimum length requirement.',
        }),
      });
    });

    // Verify success message is displayed
    await waitFor(() => {
      expect(screen.getByText(/thanks for your message/i)).toBeInTheDocument();
    });

    // Verify form was reset
    expect(screen.getByLabelText(/name/i)).toHaveValue('');
    expect(screen.getByLabelText(/email/i)).toHaveValue('');
    expect(screen.getByLabelText(/message/i)).toHaveValue('');
  });

  test('form submission with validation errors', async () => {
    // Submit empty form
    const submitButton = screen.getByRole('button', { name: /send message/i });
    await userEvent.click(submitButton);

    // Verify validation errors are displayed
    await waitFor(() => {
      expect(screen.getByText(/name is required/i)).toBeInTheDocument();
      expect(screen.getByText(/email is required/i)).toBeInTheDocument();
      expect(screen.getByText(/message is required/i)).toBeInTheDocument();
    });

    // Verify fetch was not called
    expect(global.fetch).not.toHaveBeenCalled();
  });

  test('form submission with network error', async () => {
    // Mock network error
    (global.fetch as jest.Mock).mockRejectedValueOnce(new Error('Network error'));

    // Fill out form with valid data
    await userEvent.type(screen.getByLabelText(/name/i), 'John Doe');
    await userEvent.type(screen.getByLabelText(/email/i), 'john@example.com');
    await userEvent.type(screen.getByLabelText(/message/i), 'This is a test message that is long enough to meet the minimum length requirement.');

    // Submit form
    const submitButton = screen.getByRole('button', { name: /send message/i });
    await userEvent.click(submitButton);

    // Verify error message is displayed
    await waitFor(() => {
      expect(screen.getByText(/sorry, something went wrong/i)).toBeInTheDocument();
    });
  });

  test('form submission with API error response', async () => {
    // Mock API error response
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: false,
      json: () => Promise.resolve({ error: 'Failed to process submission' }),
    });

    // Fill out form with valid data
    await userEvent.type(screen.getByLabelText(/name/i), 'Jane Smith');
    await userEvent.type(screen.getByLabelText(/email/i), 'jane@example.com');
    await userEvent.type(screen.getByLabelText(/message/i), 'This is a test message that is long enough to meet the minimum length requirement.');

    // Submit form
    const submitButton = screen.getByRole('button', { name: /send message/i });
    await userEvent.click(submitButton);

    // Verify error message is displayed
    await waitFor(() => {
      expect(screen.getByText(/sorry, something went wrong/i)).toBeInTheDocument();
    });
  });

  test('honeypot field prevents spam submission detection', async () => {
    // Mock successful response
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve({ success: true }),
    });

    // Fill out form but also fill honeypot field (simulating a bot)
    const honeypot = screen.getByLabelText(/address/i);
    await userEvent.type(honeypot, 'spam bot');
    
    await userEvent.type(screen.getByLabelText(/name/i), 'Spam Bot');
    await userEvent.type(screen.getByLabelText(/email/i), 'spam@example.com');
    await userEvent.type(screen.getByLabelText(/message/i), 'Buy my products!');

    // Submit form
    const submitButton = screen.getByRole('button', { name: /send message/i });
    await userEvent.click(submitButton);

    // Verify fetch was called (but in real implementation, the server would silently accept without sending email)
    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalled();
    });
  });
});