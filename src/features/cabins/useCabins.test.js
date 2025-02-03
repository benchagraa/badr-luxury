import { jest } from '@jest/globals';
import '@testing-library/jest-dom';
import { waitFor, renderHook } from '@testing-library/react';
// import { renderHook, waitFor } from '@testing-library/react-hooks';
import { useQuery } from '@tanstack/react-query';
import { useCabins } from './useCabins';
import { getCabins } from '../../services/apiCabins';

// Mock dependencies
jest.mock('@tanstack/react-query', () => ({
  useQuery: jest.fn(),
}));

jest.mock('../../services/apiCabins', () => ({
  getCabins: jest.fn(),
}));

describe('useCabins', () => {
  beforeEach(() => {
    // Reset mocks before each test
    jest.clearAllMocks();
  });

  test('fetches cabin data using the getCabins function', async () => {
    const mockCabins = [
      { id: 1, name: 'Cabin 1' },
      { id: 2, name: 'Cabin 2' },
    ];

    // Mock useQuery to return the cabin data
    useQuery.mockImplementation(({ queryKey, queryFn }) => {
      expect(queryKey).toEqual(['cabins']);
      expect(queryFn).toBeDefined();
      return {
        isLoading: false,
        data: mockCabins,
        error: null,
      };
    });

    // Mock getCabins to return the mock cabins
    getCabins.mockResolvedValue(mockCabins);

    const { result } = renderHook(() => useCabins());

    // Wait for the hook to resolve
    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
      expect(result.current.cabins).toEqual(mockCabins);
      expect(result.current.error).toBeNull();
    });
  });

  test('handles loading state while fetching data', () => {
    // Mock useQuery to return the loading state
    useQuery.mockImplementation(() => ({
      isLoading: true,
      data: undefined,
      error: null,
    }));

    const { result } = renderHook(() => useCabins());

    // Verify loading state
    expect(result.current.isLoading).toBe(true);
    expect(result.current.cabins).toBeUndefined();
    expect(result.current.error).toBeNull();
  });

  test('handles errors when the API call fails', async () => {
    const mockError = new Error('Failed to fetch cabins');

    // Mock useQuery to return an error
    useQuery.mockImplementation(() => ({
      isLoading: false,
      data: undefined,
      error: mockError,
    }));

    // Mock getCabins to throw an error
    getCabins.mockRejectedValue(mockError);

    const { result } = renderHook(() => useCabins());

    // Wait for the hook to resolve
    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
      expect(result.current.cabins).toBeUndefined();
      expect(result.current.error).toEqual(mockError);
    });
  });
});
