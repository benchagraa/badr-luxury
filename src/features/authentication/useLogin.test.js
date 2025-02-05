import { jest } from '@jest/globals';
import '@testing-library/jest-dom';
import { renderHook } from '@testing-library/react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { useLogin } from './useLogin';

jest.mock('@tanstack/react-query', () => ({
  useMutation: jest.fn(),
  useQueryClient: jest.fn(),
}));

jest.mock('react-router-dom', () => ({
  useNavigate: jest.fn(),
}));

jest.mock('react-hot-toast', () => ({
  toast: {
    error: jest.fn(),
  },
}));

jest.mock('../../services/apiAuth', () => ({
  loginApi: jest.fn(),
}));

describe('useLogin', () => {
  let mockMutate, mockSetQueryData, mockNavigate;

  beforeEach(() => {
    jest.clearAllMocks();

    mockMutate = jest.fn();
    useMutation.mockImplementation(({ mutationFn }) => ({
      mutate: mockMutate,
      isLoading: false,
      mutationFn,
    }));

    mockSetQueryData = jest.fn();
    useQueryClient.mockReturnValue({
      setQueryData: mockSetQueryData,
    });

    mockNavigate = jest.fn();
    useNavigate.mockReturnValue(mockNavigate);
  });

  test('calls loginApi with the correct email and password', async () => {
    const { result } = renderHook(() => useLogin());

    const email = 'badr.redax@gmail.com';
    const password = 'Badre0071@';

    result.current.login({ email, password });

    expect(mockMutate).toHaveBeenCalledWith({ email, password });
  });

  test('updates the query cache with user data on success', async () => {
    const { result } = renderHook(() => useLogin());

    const user = { user: { id: 1, email: 'test@example.com' } };

    useMutation.mock.calls[0][0].onSuccess(user);

    expect(mockSetQueryData).toHaveBeenCalledWith(['user'], user.user);
  });

  test('navigates to /dashboard on success', async () => {
    const { result } = renderHook(() => useLogin());

    const user = { user: { id: 1, email: 'test@example.com' } };

    useMutation.mock.calls[0][0].onSuccess(user);

    expect(mockNavigate).toHaveBeenCalledWith('/dashboard', { replace: true });
  });

  test('displays an error toast on failure', async () => {
    const { result } = renderHook(() => useLogin());

    const error = new Error('Login failed');

    useMutation.mock.calls[0][0].onError(error);

    expect(toast.error).toHaveBeenCalledWith(
      'Provided email or password are incorrect'
    );
  });
});
