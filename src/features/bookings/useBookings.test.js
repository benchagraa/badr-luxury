import { jest } from '@jest/globals';
import '@testing-library/jest-dom';
// import { renderHook } from '@testing-library/react-hooks';
import { waitFor, renderHook } from '@testing-library/react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useSearchParams } from 'react-router-dom';
import { useBookings } from './useBookings';

// Mock dependencies
jest.mock('@tanstack/react-query', () => ({
  useQuery: jest.fn(),
  useQueryClient: jest.fn(),
}));

jest.mock('react-router-dom', () => ({
  useSearchParams: jest.fn(),
}));

jest.mock('../../services/apiBookings', () => ({
  getBookings: jest.fn(),
}));

describe('useBookings', () => {
  let mockGetBookings, mockPrefetchQuery, mockSearchParams;

  beforeEach(() => {
    // Reset mocks before each test
    jest.clearAllMocks();

    // Mock useQuery
    useQuery.mockImplementation(({ queryKey, queryFn }) => {
      return {
        isLoading: false,
        data: { data: [], count: 0 },
        error: null,
      };
    });

    // Mock useQueryClient
    mockPrefetchQuery = jest.fn();
    useQueryClient.mockReturnValue({
      prefetchQuery: mockPrefetchQuery,
    });

    // Mock useSearchParams
    mockSearchParams = new URLSearchParams();
    useSearchParams.mockReturnValue([mockSearchParams]);
  });

  test('fetches bookings data with the correct filter, sort, and pagination parameters', () => {
    const { result } = renderHook(() => useBookings());

    // Verify the default query key and parameters
    expect(useQuery).toHaveBeenCalledWith({
      queryKey: [
        'bookings',
        null,
        { field: 'startDate', direction: 'desc' },
        1,
      ],
      queryFn: expect.any(Function),
    });
  });

  test('applies filter based on the status search parameter', () => {
    mockSearchParams.set('status', 'checked-in');
    const { result } = renderHook(() => useBookings());

    // Verify the query key includes the filter
    expect(useQuery).toHaveBeenCalledWith({
      queryKey: [
        'bookings',
        { field: 'status', value: 'checked-in' },
        { field: 'startDate', direction: 'desc' },
        1,
      ],
      queryFn: expect.any(Function),
    });
  });

  test('applies sorting based on the sortBy search parameter', () => {
    mockSearchParams.set('sortBy', 'totalPrice-asc');
    const { result } = renderHook(() => useBookings());

    // Verify the query key includes the sortBy parameter
    expect(useQuery).toHaveBeenCalledWith({
      queryKey: [
        'bookings',
        null,
        { field: 'totalPrice', direction: 'asc' },
        1,
      ],
      queryFn: expect.any(Function),
    });
  });

  test('applies pagination based on the page search parameter', () => {
    mockSearchParams.set('page', '2');
    const { result } = renderHook(() => useBookings());

    // Verify the query key includes the page parameter
    expect(useQuery).toHaveBeenCalledWith({
      queryKey: [
        'bookings',
        null,
        { field: 'startDate', direction: 'desc' },
        2,
      ],
      queryFn: expect.any(Function),
    });
  });

  test('handles loading and error states', () => {
    // Mock useQuery to return loading and error states
    useQuery.mockImplementation(({ queryKey, queryFn }) => {
      return {
        isLoading: true,
        data: undefined,
        error: new Error('Failed to fetch bookings'),
      };
    });

    const { result } = renderHook(() => useBookings());

    // Verify loading and error states
    expect(result.current.isLoading).toBe(true);
    expect(result.current.error).toEqual(new Error('Failed to fetch bookings'));
    expect(result.current.bookings).toBeUndefined();
    expect(result.current.count).toBeUndefined();
  });
});
