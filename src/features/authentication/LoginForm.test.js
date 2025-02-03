import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import LoginForm from './LoginForm';
import { useLogin } from './useLogin';
import SpinnerMini from '../../ui/SpinnerMini';
// import '@testing-library/jest-dom';

// Mock the useLogin hook
jest.mock('./useLogin', () => ({
  useLogin: jest.fn(),
}));

// Mock the SpinnerMini component to simplify testing
jest.mock('../../ui/SpinnerMini', () => {
  return function SpinnerMini() {
    return <div data-testid="spinner">Loading...</div>;
  };
});

describe('LoginForm', () => {
  beforeEach(() => {
    // Reset mocks before each test
    useLogin.mockReset();
    useLogin.mockReturnValue({
      login: jest.fn(),
      isLoading: false,
    });
  });

  test('renders email and password inputs and a submit button', () => {
    render(<LoginForm />);

    expect(screen.getByLabelText(/email address/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /log in/i })).toBeInTheDocument();
  });

  test('updates email and password inputs when user types', () => {
    render(<LoginForm />);

    const emailInput = screen.getByLabelText(/email address/i);
    const passwordInput = screen.getByLabelText(/password/i);

    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'password123' } });

    expect(emailInput).toHaveValue('test@example.com');
    expect(passwordInput).toHaveValue('password123');
  });

  test('submits the form with email and password when valid', () => {
    const mockLogin = jest.fn();
    useLogin.mockReturnValue({ login: mockLogin, isLoading: false });

    render(<LoginForm />);

    const emailInput = screen.getByLabelText(/email address/i);
    const passwordInput = screen.getByLabelText(/password/i);
    const form = emailInput.closest('form');

    fireEvent.change(emailInput, { target: { value: 'user@test.com' } });
    fireEvent.change(passwordInput, { target: { value: 'pass123' } });
    fireEvent.submit(form);

    expect(mockLogin).toHaveBeenCalledWith(
      { email: 'user@test.com', password: 'pass123' },
      { onSettled: expect.any(Function) }
    );
  });

  test('does not submit the form if email or password is empty', () => {
    const mockLogin = jest.fn();
    useLogin.mockReturnValue({ login: mockLogin, isLoading: false });

    render(<LoginForm />);

    const form = screen.getByRole('form');

    // Submit without filling inputs
    fireEvent.submit(form);
    expect(mockLogin).not.toHaveBeenCalled();

    // Submit with only email
    fireEvent.change(screen.getByLabelText(/email address/i), {
      target: { value: 'test@example.com' },
    });
    fireEvent.submit(form);
    expect(mockLogin).not.toHaveBeenCalled();

    // Submit with only password
    fireEvent.change(screen.getByLabelText(/password/i), {
      target: { value: 'password123' },
    });
    fireEvent.submit(form);
    expect(mockLogin).not.toHaveBeenCalled();
  });

  test('disables inputs and button during loading and shows spinner', () => {
    useLogin.mockReturnValue({ login: jest.fn(), isLoading: true });

    render(<LoginForm />);

    const emailInput = screen.getByLabelText(/email address/i);
    const passwordInput = screen.getByLabelText(/password/i);
    const button = screen.getByRole('button', { name: /log in/i });

    expect(emailInput).toBeDisabled();
    expect(passwordInput).toBeDisabled();
    expect(button).toBeDisabled();
    expect(screen.getByTestId('spinner')).toBeInTheDocument();
    expect(button).not.toHaveTextContent(/log in/i);
  });

  test('clears email and password inputs after form submission', async () => {
    let onSettledCallback;
    const mockLogin = jest.fn((credentials, { onSettled }) => {
      onSettledCallback = onSettled;
    });
    useLogin.mockReturnValue({ login: mockLogin, isLoading: false });

    render(<LoginForm />);

    const emailInput = screen.getByLabelText(/email address/i);
    const passwordInput = screen.getByLabelText(/password/i);
    const form = screen.getByRole('form');

    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'password123' } });
    fireEvent.submit(form);

    // Trigger the onSettled callback to reset the form
    onSettledCallback();

    await waitFor(() => {
      expect(emailInput).toHaveValue('');
      expect(passwordInput).toHaveValue('');
    });
  });
});
