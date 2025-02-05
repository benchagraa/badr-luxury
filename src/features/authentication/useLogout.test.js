import { jest } from '@jest/globals';
import { renderHook } from '@testing-library/react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { useLogout } from './useLogout';
import '@testing-library/jest-dom';

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
    jest.clearAllMocks();

    mockMutate = jest.fn();
    useMutation.mockImplementation(({ mutationFn }) => ({
      mutate: mockMutate,
      isLoading: false,
      mutationFn,
    }));

    mockRemoveQueries = jest.fn();
    useQueryClient.mockReturnValue({
      removeQueries: mockRemoveQueries,
    });

    mockNavigate = jest.fn();
    useNavigate.mockReturnValue(mockNavigate);
  });

  test('calls logoutApi when logout is triggered', () => {
    const { result } = renderHook(() => useLogout());

    result.current.logout();

    expect(mockMutate).toHaveBeenCalled();
  });

  test('clears the query cache on success', () => {
    const { result } = renderHook(() => useLogout());

    useMutation.mock.calls[0][0].onSuccess();

    expect(mockRemoveQueries).toHaveBeenCalled();
  });

  test('navigates to /login on success', () => {
    const { result } = renderHook(() => useLogout());

    useMutation.mock.calls[0][0].onSuccess();

    expect(mockNavigate).toHaveBeenCalledWith('/login', { replace: true });
  });
});
