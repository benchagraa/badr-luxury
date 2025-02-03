import { jest } from '@jest/globals';
import '@testing-library/jest-dom';
import { renderHook, waitFor } from '@testing-library/react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-hot-toast';
import { useDeleteBooking } from './useDeleteBooking';

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

jest.mock('../../services/apiBookings', () => ({
  deleteBookingApi: jest.fn(),
}));

describe('useDeleteBooking', () => {
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

  test('calls deleteBookingApi when deleteBooking is triggered', () => {
    const { result } = renderHook(() => useDeleteBooking());

    // Trigger the deleteBooking mutation
    result.current.deleteBooking('booking-id-123');

    // Ensure the mutation function is called with the correct argument
    expect(mockMutate).toHaveBeenCalledWith('booking-id-123');
  });

  test('displays a success toast on successful deletion', async () => {
    const { result } = renderHook(() => useDeleteBooking());

    // Simulate a successful mutation
    useMutation.mock.calls[0][0].onSuccess();

    // Trigger the deleteBooking mutation
    result.current.deleteBooking('booking-id-123');

    // Wait for the success toast to be displayed
    await waitFor(() => {
      expect(toast.success).toHaveBeenCalledWith(
        'Booking successfully deleted'
      );
    });
  });

  test('invalidates the bookings query cache on success', async () => {
    const { result } = renderHook(() => useDeleteBooking());

    // Simulate a successful mutation
    useMutation.mock.calls[0][0].onSuccess();

    // Trigger the deleteBooking mutation
    result.current.deleteBooking('booking-id-123');

    // Wait for the bookings query cache to be invalidated
    await waitFor(() => {
      expect(mockInvalidateQueries).toHaveBeenCalledWith({
        queryKey: ['bookings'],
      });
    });
  });

  test('displays an error toast when the deletion fails', async () => {
    const { result } = renderHook(() => useDeleteBooking());

    const mockError = new Error('Failed to delete booking');

    // Simulate a failed mutation
    useMutation.mock.calls[0][0].onError(mockError);

    // Trigger the deleteBooking mutation
    result.current.deleteBooking('booking-id-123');

    // Wait for the error toast to be displayed
    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith(mockError.message);
    });
  });
});
