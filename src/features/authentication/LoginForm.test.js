import { jest } from '@jest/globals';
import '@testing-library/jest-dom';
import { render, screen, fireEvent } from '@testing-library/react';
import LoginForm from './LoginForm';
import { useLogin } from './useLogin';

// Mock the useLogin hook
jest.mock('./useLogin');

describe('LoginForm Component', () => {
  let mockLogin;

  beforeEach(() => {
    // Mock the login function and isLoading state
    mockLogin = jest.fn();
    useLogin.mockReturnValue({ login: mockLogin, isLoading: false });
  });

  test('renders email and password input fields', () => {
    render(<LoginForm />);

    expect(screen.getByLabelText(/email address/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
  });

  test('updates input fields on change', () => {
    render(<LoginForm />);

    const emailInput = screen.getByLabelText(/email address/i);
    const passwordInput = screen.getByLabelText(/password/i);

    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'password123' } });

    expect(emailInput.value).toBe('test@example.com');
    expect(passwordInput.value).toBe('password123');
  });

  test('calls login function with correct credentials on submit', () => {
    render(<LoginForm />);

    const emailInput = screen.getByLabelText('Email address');
    const passwordInput = screen.getByLabelText('Password');
    const submitButton = screen.getByRole('button', { name: 'Log in' });

    fireEvent.change(emailInput, { target: { value: 'user@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'securepassword' } });

    fireEvent.click(submitButton);

    expect(mockLogin).toHaveBeenCalledWith(
      { email: 'user@example.com', password: 'securepassword' },
      expect.any(Object)
    );
  });

  test('disables button when isLoading is true', () => {
    useLogin.mockReturnValue({ login: mockLogin, isLoading: true });

    render(<LoginForm />);

    const submitButton = screen.getByRole('button');

    expect(submitButton).toBeDisabled();
  });

  test('clears input fields after successful login', () => {
    render(<LoginForm />);

    const emailInput = screen.getByLabelText(/email address/i);
    const passwordInput = screen.getByLabelText(/password/i);
    const submitButton = screen.getByRole('button');

    fireEvent.change(emailInput, { target: { value: 'user@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'securepassword' } });

    // Simulate successful login completion
    mockLogin.mockImplementation((_data, { onSettled }) => onSettled());

    fireEvent.click(submitButton);

    expect(emailInput.value).toBe('');
    expect(passwordInput.value).toBe('');
  });
});
