import { jest } from '@jest/globals';
import '@testing-library/jest-dom';
import { waitFor, renderHook } from '@testing-library/react';
import { useQuery } from '@tanstack/react-query';
import { useParams } from 'react-router-dom';
import { useBooking } from './useBooking';
import { getBooking } from '../../services/apiBookings';

jest.mock('@tanstack/react-query', () => ({
  useQuery: jest.fn(),
}));

jest.mock('react-router-dom', () => ({
  useParams: jest.fn(),
}));

jest.mock('../../services/apiBookings', () => ({
  getBooking: jest.fn(),
}));

describe('useBooking', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('fetches booking data using the correct bookingId', async () => {
    const bookingId = '123';
    const mockBooking = { id: '123', guestName: 'John Doe' };

    useParams.mockReturnValue({ bookingId });

    useQuery.mockImplementation(({ queryKey, queryFn }) => {
      expect(queryKey).toEqual(['booking', bookingId]);
      expect(queryFn).toBeDefined();
      return {
        isLoading: false,
        data: mockBooking,
        error: null,
      };
    });

    getBooking.mockResolvedValue(mockBooking);

    const { result } = renderHook(() => useBooking());

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
      expect(result.current.booking).toEqual(mockBooking);
      expect(result.current.error).toBeNull();
    });
  });

  test('handles loading state while fetching data', () => {
    const bookingId = '123';

    useParams.mockReturnValue({ bookingId });

    useQuery.mockImplementation(() => ({
      isLoading: true,
      data: undefined,
      error: null,
    }));

    const { result } = renderHook(() => useBooking());

    expect(result.current.isLoading).toBe(true);
    expect(result.current.booking).toBeUndefined();
    expect(result.current.error).toBeNull();
  });

  test('handles errors when the API call fails', async () => {
    const bookingId = '123';
    const mockError = new Error('Failed to fetch booking');

    useParams.mockReturnValue({ bookingId });

    useQuery.mockImplementation(() => ({
      isLoading: false,
      data: undefined,
      error: mockError,
    }));

    getBooking.mockRejectedValue(mockError);

    const { result } = renderHook(() => useBooking());

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
      expect(result.current.booking).toBeUndefined();
      expect(result.current.error).toEqual(mockError);
    });
  });
});
