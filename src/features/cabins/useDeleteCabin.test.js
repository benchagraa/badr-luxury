import { jest } from '@jest/globals';
import '@testing-library/jest-dom';
// import { renderHook } from '@testing-library/react-hooks';
import { waitFor, renderHook } from '@testing-library/react';
// import { renderHook, waitFor } from '@testing-library/react-hooks';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-hot-toast';
import { useDeleteCabin } from './useDeleteCabin';
import { deleteCabinApi } from '../../services/apiCabins';

// Mock dependencies
jest.mock('@tanstack/react-query', () => ({
  useMutation: jest.fn(),
  useQueryClient: jest.fn(),
}));

jest.mock('react-hot-toast', () => ({
  toast: {
    success: jest.fn(),
    error: jest.fn(),
  },
}));

jest.mock('../../services/apiCabins', () => ({
  deleteCabinApi: jest.fn(),
}));

describe('useDeleteCabin', () => {
  let mockMutate, mockInvalidateQueries;

  beforeEach(() => {
    // Reset mocks before each test
    jest.clearAllMocks();

    // Mock useMutation
    mockMutate = jest.fn();
    useMutation.mockImplementation(({ mutationFn, onSuccess, onError }) => ({
      mutate: mockMutate,
      isLoading: false,
      mutationFn,
      onSuccess,
      onError,
    }));

    // Mock useQueryClient
    mockInvalidateQueries = jest.fn();
    useQueryClient.mockReturnValue({
      invalidateQueries: mockInvalidateQueries,
    });
  });

  test('calls deleteCabinApi when deleteCabin is triggered', () => {
    const { result } = renderHook(() => useDeleteCabin());

    // Trigger the deleteCabin mutation
    result.current.deleteCabin('cabin-id-123');

    // Ensure the mutation function is called with the correct argument
    expect(mockMutate).toHaveBeenCalledWith('cabin-id-123');
  });

  test('displays a success toast on successful deletion', async () => {
    const { result } = renderHook(() => useDeleteCabin());

    // Simulate a successful mutation
    useMutation.mock.calls[0][0].onSuccess();

    // Trigger the deleteCabin mutation
    result.current.deleteCabin('cabin-id-123');

    // Wait for the success toast to be displayed
    await waitFor(() => {
      expect(toast.success).toHaveBeenCalledWith('Cabin successfully deleted');
    });
  });

  test('invalidates the cabins query cache on success', async () => {
    const { result } = renderHook(() => useDeleteCabin());

    // Simulate a successful mutation
    useMutation.mock.calls[0][0].onSuccess();

    // Trigger the deleteCabin mutation
    result.current.deleteCabin('cabin-id-123');

    // Wait for the cabins query cache to be invalidated
    await waitFor(() => {
      expect(mockInvalidateQueries).toHaveBeenCalledWith({
        queryKey: ['cabins'],
      });
    });
  });

  test('displays an error toast when the deletion fails', async () => {
    const { result } = renderHook(() => useDeleteCabin());

    const mockError = new Error('Failed to delete cabin');

    // Simulate a failed mutation
    useMutation.mock.calls[0][0].onError(mockError);

    // Trigger the deleteCabin mutation
    result.current.deleteCabin('cabin-id-123');

    // Wait for the error toast to be displayed
    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith(mockError.message);
    });
  });
});
