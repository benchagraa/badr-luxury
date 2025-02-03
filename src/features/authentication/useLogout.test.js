import { jest } from '@jest/globals';
import { renderHook } from '@testing-library/react-hooks';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { useLogout } from './useLogout';
import '@testing-library/jest-dom';

// Mock dependencies
jest.mock('@tanstack/react-query', () => ({
  useMutation: jest.fn(),
  useQueryClient: jest.fn(),
}));

jest.mock('react-router-dom', () => ({
  useNavigate: jest.fn(),
}));

jest.mock('../../services/apiAuth', () => ({
  logoutApi: jest.fn(),
}));

describe('useLogout', () => {
  let mockMutate, mockRemoveQueries, mockNavigate;

  beforeEach(() => {
    // Reset mocks before each test
    jest.clearAllMocks();

    // Mock useMutation
    mockMutate = jest.fn();
    useMutation.mockImplementation(({ mutationFn }) => ({
      mutate: mockMutate,
      isLoading: false,
      mutationFn,
    }));

    // Mock useQueryClient
    mockRemoveQueries = jest.fn();
    useQueryClient.mockReturnValue({
      removeQueries: mockRemoveQueries,
    });

    // Mock useNavigate
    mockNavigate = jest.fn();
    useNavigate.mockReturnValue(mockNavigate);
  });

  test('calls logoutApi when logout is triggered', () => {
    const { result } = renderHook(() => useLogout());

    // Trigger the logout mutation
    result.current.logout();

    // Ensure the mutation function is called
    expect(mockMutate).toHaveBeenCalled();
  });

  test('clears the query cache on success', () => {
    const { result } = renderHook(() => useLogout());

    // Simulate a successful mutation
    useMutation.mock.calls[0][0].onSuccess();

    // Ensure the query cache is cleared
    expect(mockRemoveQueries).toHaveBeenCalled();
  });

  test('navigates to /login on success', () => {
    const { result } = renderHook(() => useLogout());

    // Simulate a successful mutation
    useMutation.mock.calls[0][0].onSuccess();

    // Ensure navigation to /login
    expect(mockNavigate).toHaveBeenCalledWith('/login', { replace: true });
  });
});
