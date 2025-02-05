import { jest } from '@jest/globals';
import '@testing-library/jest-dom';
import { renderHook } from '@testing-library/react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import { useCheckin } from './useCheckin';
import { updateBooking } from '../../services/apiBookings';

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

    mockNavigate = jest.fn();
    useNavigate.mockReturnValue(mockNavigate);
  });

  test('displays a success toast on successful check-in', async () => {
    const { result } = renderHook(() => useCheckin());

    const mockData = { id: 123 };

    useMutation.mock.calls[0][0].onSuccess(mockData);

    result.current.checkin({ bookingId: 123, breakfast: {} });

    expect(toast.success).toHaveBeenCalledWith(
      `Booking #${mockData.id} successfully checked in`
    );
  });

  test('invalidates all active queries on success', async () => {
    const { result } = renderHook(() => useCheckin());

    useMutation.mock.calls[0][0].onSuccess({ id: 123 });

    result.current.checkin({ bookingId: 123, breakfast: {} });

    expect(mockInvalidateQueries).toHaveBeenCalledWith({ active: true });
  });

  test('navigates to the home page on success', async () => {
    const { result } = renderHook(() => useCheckin());

    useMutation.mock.calls[0][0].onSuccess({ id: 123 });

    result.current.checkin({ bookingId: 123, breakfast: {} });

    expect(mockNavigate).toHaveBeenCalledWith('/');
  });

  test('displays an error toast when the check-in fails', async () => {
    const { result } = renderHook(() => useCheckin());

    useMutation.mock.calls[0][0].onError();

    result.current.checkin({ bookingId: 123, breakfast: {} });

    expect(toast.error).toHaveBeenCalledWith(
      'There was an error while checking in'
    );
  });
});
