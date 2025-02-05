import { jest } from '@jest/globals';
import '@testing-library/jest-dom';

import { waitFor, renderHook } from '@testing-library/react';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-hot-toast';
import { useDeleteCabin } from './useDeleteCabin';
import { deleteCabinApi } from '../../services/apiCabins';

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
    jest.clearAllMocks();

    mockMutate = jest.fn();
    useMutation.mockImplementation(({ mutationFn, onSuccess, onError }) => ({
      mutate: mockMutate,
      isLoading: false,
      mutationFn,
      onSuccess,
      onError,
    }));

    mockInvalidateQueries = jest.fn();
    useQueryClient.mockReturnValue({
      invalidateQueries: mockInvalidateQueries,
    });
  });

  test('calls deleteCabinApi when deleteCabin is triggered', () => {
    const { result } = renderHook(() => useDeleteCabin());

    result.current.deleteCabin('cabin-id-123');

    expect(mockMutate).toHaveBeenCalledWith('cabin-id-123');
  });

  test('displays a success toast on successful deletion', async () => {
    const { result } = renderHook(() => useDeleteCabin());

    useMutation.mock.calls[0][0].onSuccess();

    result.current.deleteCabin('cabin-id-123');

    await waitFor(() => {
      expect(toast.success).toHaveBeenCalledWith('Cabin successfully deleted');
    });
  });

  test('invalidates the cabins query cache on success', async () => {
    const { result } = renderHook(() => useDeleteCabin());

    useMutation.mock.calls[0][0].onSuccess();

    result.current.deleteCabin('cabin-id-123');

    await waitFor(() => {
      expect(mockInvalidateQueries).toHaveBeenCalledWith({
        queryKey: ['cabins'],
      });
    });
  });

  test('displays an error toast when the deletion fails', async () => {
    const { result } = renderHook(() => useDeleteCabin());

    const mockError = new Error('Failed to delete cabin');

    useMutation.mock.calls[0][0].onError(mockError);

    result.current.deleteCabin('cabin-id-123');

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith(mockError.message);
    });
  });
});
