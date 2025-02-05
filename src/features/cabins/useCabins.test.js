import { jest } from '@jest/globals';
import '@testing-library/jest-dom';
import { waitFor, renderHook } from '@testing-library/react';

import { useQuery } from '@tanstack/react-query';
import { useCabins } from './useCabins';
import { getCabins } from '../../services/apiCabins';

jest.mock('@tanstack/react-query', () => ({
  useQuery: jest.fn(),
}));

jest.mock('../../services/apiCabins', () => ({
  getCabins: jest.fn(),
}));

describe('useCabins', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('fetches cabin data using the getCabins function', async () => {
    const mockCabins = [
      { id: 1, name: 'Cabin 1' },
      { id: 2, name: 'Cabin 2' },
    ];

    useQuery.mockImplementation(({ queryKey, queryFn }) => {
      expect(queryKey).toEqual(['cabins']);
      expect(queryFn).toBeDefined();
      return {
        isLoading: false,
        data: mockCabins,
        error: null,
      };
    });

    getCabins.mockResolvedValue(mockCabins);

    const { result } = renderHook(() => useCabins());

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
      expect(result.current.cabins).toEqual(mockCabins);
      expect(result.current.error).toBeNull();
    });
  });

  test('handles loading state while fetching data', () => {
    useQuery.mockImplementation(() => ({
      isLoading: true,
      data: undefined,
      error: null,
    }));

    const { result } = renderHook(() => useCabins());

    expect(result.current.isLoading).toBe(true);
    expect(result.current.cabins).toBeUndefined();
    expect(result.current.error).toBeNull();
  });

  test('handles errors when the API call fails', async () => {
    const mockError = new Error('Failed to fetch cabins');

    useQuery.mockImplementation(() => ({
      isLoading: false,
      data: undefined,
      error: mockError,
    }));

    getCabins.mockRejectedValue(mockError);

    const { result } = renderHook(() => useCabins());

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
      expect(result.current.cabins).toBeUndefined();
      expect(result.current.error).toEqual(mockError);
    });
  });
});
