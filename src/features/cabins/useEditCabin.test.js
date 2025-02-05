import { jest } from '@jest/globals';
import '@testing-library/jest-dom';
import { renderHook, waitFor } from '@testing-library/react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-hot-toast';
import { useEditCabin } from './useEditCabin';
import { createEditCabin } from '../../services/apiCabins';

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
  createEditCabin: jest.fn(),
}));

describe('useEditCabin', () => {
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

  test('displays a success toast on successful editing', async () => {
    const { result } = renderHook(() => useEditCabin());

    useMutation.mock.calls[0][0].onSuccess();

    result.current.editCabin({ newCabinData: {}, id: 123 });

    await waitFor(() => {
      expect(toast.success).toHaveBeenCalledWith('Cabin successfully edited');
    });
  });

  test('invalidates the cabins query cache on success', async () => {
    const { result } = renderHook(() => useEditCabin());

    useMutation.mock.calls[0][0].onSuccess();

    result.current.editCabin({ newCabinData: {}, id: 123 });

    await waitFor(() => {
      expect(mockInvalidateQueries).toHaveBeenCalledWith({
        queryKey: ['cabins'],
      });
    });
  });

  test('displays an error toast when the editing fails', async () => {
    const { result } = renderHook(() => useEditCabin());

    const mockError = new Error('Failed to edit cabin');

    useMutation.mock.calls[0][0].onError(mockError);

    result.current.editCabin({ newCabinData: {}, id: 123 });

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith(mockError.message);
    });
  });
});
