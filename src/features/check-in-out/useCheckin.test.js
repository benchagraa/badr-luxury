import { jest } from '@jest/globals';
import '@testing-library/jest-dom';
import { renderHook } from '@testing-library/react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import { useCheckin } from './useCheckin';
import { updateBooking } from '../../services/apiBookings';

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

jest.mock('react-router-dom', () => ({
  useNavigate: jest.fn(),
}));

jest.mock('../../services/apiBookings', () => ({
  updateBooking: jest.fn(),
}));

describe('useCheckin', () => {
  let mockMutate, mockInvalidateQueries, mockNavigate;

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

    // Mock useNavigate
    mockNavigate = jest.fn();
    useNavigate.mockReturnValue(mockNavigate);
  });

  test('displays a success toast on successful check-in', async () => {
    const { result } = renderHook(() => useCheckin());

    const mockData = { id: 123 };

    // Simulate a successful mutation
    useMutation.mock.calls[0][0].onSuccess(mockData);

    // Trigger the checkin mutation
    result.current.checkin({ bookingId: 123, breakfast: {} });

    // Ensure the success toast is displayed
    expect(toast.success).toHaveBeenCalledWith(
      `Booking #${mockData.id} successfully checked in`
    );
  });

  test('invalidates all active queries on success', async () => {
    const { result } = renderHook(() => useCheckin());

    // Simulate a successful mutation
    useMutation.mock.calls[0][0].onSuccess({ id: 123 });

    // Trigger the checkin mutation
    result.current.checkin({ bookingId: 123, breakfast: {} });

    // Ensure all active queries are invalidated
    expect(mockInvalidateQueries).toHaveBeenCalledWith({ active: true });
  });

  test('navigates to the home page on success', async () => {
    const { result } = renderHook(() => useCheckin());

    // Simulate a successful mutation
    useMutation.mock.calls[0][0].onSuccess({ id: 123 });

    // Trigger the checkin mutation
    result.current.checkin({ bookingId: 123, breakfast: {} });

    // Ensure navigation to the home page
    expect(mockNavigate).toHaveBeenCalledWith('/');
  });

  test('displays an error toast when the check-in fails', async () => {
    const { result } = renderHook(() => useCheckin());

    // Simulate a failed mutation
    useMutation.mock.calls[0][0].onError();

    // Trigger the checkin mutation
    result.current.checkin({ bookingId: 123, breakfast: {} });

    // Ensure the error toast is displayed
    expect(toast.error).toHaveBeenCalledWith(
      'There was an error while checking in'
    );
  });
});
