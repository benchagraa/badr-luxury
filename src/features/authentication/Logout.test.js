import { render, screen, fireEvent } from '@testing-library/react';
import Logout from './Logout';
import { useLogout } from './useLogout';
import SpinnerMini from '../../ui/SpinnerMini';
import { HiArrowRightOnRectangle } from 'react-icons/hi2';

// Mock the useLogout hook
jest.mock('./useLogout', () => ({
  useLogout: jest.fn(),
}));

// Mock the SpinnerMini component
jest.mock('../../ui/SpinnerMini', () => {
  return function SpinnerMini() {
    return <div data-testid="spinner">Loading...</div>;
  };
});

// Mock the HiArrowRightOnRectangle icon
jest.mock('react-icons/hi2', () => ({
  HiArrowRightOnRectangle: () => (
    <div data-testid="logout-icon">Logout Icon</div>
  ),
}));

describe('Logout', () => {
  beforeEach(() => {
    // Reset mocks before each test
    useLogout.mockReset();
    useLogout.mockReturnValue({
      logout: jest.fn(),
      isLoading: false,
    });
  });

  test('renders the button with the logout icon', () => {
    render(<Logout />);

    const button = screen.getByRole('button');
    const logoutIcon = screen.getByTestId('logout-icon');

    expect(button).toBeInTheDocument();
    expect(logoutIcon).toBeInTheDocument();
  });

  test('calls the logout function when the button is clicked', () => {
    const mockLogout = jest.fn();
    useLogout.mockReturnValue({ logout: mockLogout, isLoading: false });

    render(<Logout />);

    const button = screen.getByRole('button');
    fireEvent.click(button);

    expect(mockLogout).toHaveBeenCalled();
  });

  test('disables the button and shows the spinner during loading', () => {
    useLogout.mockReturnValue({ logout: jest.fn(), isLoading: true });

    render(<Logout />);

    const button = screen.getByRole('button');
    const spinner = screen.getByTestId('spinner');

    expect(button).toBeDisabled();
    expect(spinner).toBeInTheDocument();
  });
});
