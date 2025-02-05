import { jest } from '@jest/globals';
import { render, screen, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { DarkModeProvider, useDarkMode } from './DarkModeContext';
import { useEffect } from 'react';
import '@testing-library/jest-dom';

const localStorageMock = (() => {
  let store = {};
  return {
    getItem: (key) => store[key] || null,
    setItem: (key, value) => (store[key] = value.toString()),
    clear: () => (store = {}),
  };
})();

Object.defineProperty(window, 'localStorage', { value: localStorageMock });

window.matchMedia = jest.fn().mockImplementation((query) => ({
  matches: query === '(prefers-color-scheme: dark)',
  addListener: jest.fn(),
  removeListener: jest.fn(),
}));

describe('DarkModeContext', () => {
  beforeEach(() => {
    window.localStorage.clear();
    document.documentElement.className = '';
  });

  test('initializes dark mode based on system preference', () => {
    render(
      <DarkModeProvider>
        <div />
      </DarkModeProvider>
    );

    expect(document.documentElement).toHaveClass('dark-mode');
    expect(document.documentElement).not.toHaveClass('light-mode');
  });

  test('toggles dark mode correctly', async () => {
    function TestComponent() {
      const { isDarkMode, toggleDarkMode } = useDarkMode();
      return (
        <div>
          <span>{isDarkMode ? 'Dark' : 'Light'}</span>
          <button onClick={toggleDarkMode}>Toggle</button>
        </div>
      );
    }

    render(
      <DarkModeProvider>
        <TestComponent />
      </DarkModeProvider>
    );

    expect(screen.getByText('Dark')).toBeInTheDocument();
    expect(document.documentElement).toHaveClass('dark-mode');

    await userEvent.click(screen.getByRole('button', { name: 'Toggle' }));

    expect(screen.getByText('Light')).toBeInTheDocument();
    expect(document.documentElement).toHaveClass('light-mode');
  });

  test('persists dark mode state in localStorage', async () => {
    function TestComponent() {
      const { toggleDarkMode } = useDarkMode();
      return <button onClick={toggleDarkMode}>Toggle</button>;
    }

    render(
      <DarkModeProvider>
        <TestComponent />
      </DarkModeProvider>
    );

    expect(localStorage.getItem('isDarkMode')).toBe('true');

    await userEvent.click(screen.getByRole('button', { name: 'Toggle' }));

    expect(localStorage.getItem('isDarkMode')).toBe('false');
  });

  test('throws error when used outside provider', () => {
    const ErrorComponent = () => {
      useDarkMode();
      return null;
    };

    jest.spyOn(console, 'error').mockImplementation(() => {});

    expect(() => render(<ErrorComponent />)).toThrow(
      'DarkModeContext was used outside of DarkModeProvider'
    );

    console.error.mockRestore();
  });

  test('handles initial false state when system preference is light', () => {
    window.matchMedia = jest.fn().mockImplementation((query) => ({
      matches: false,
      addListener: jest.fn(),
      removeListener: jest.fn(),
    }));

    render(
      <DarkModeProvider>
        <div />
      </DarkModeProvider>
    );

    expect(document.documentElement).toHaveClass('light-mode');
    expect(localStorage.getItem('isDarkMode')).toBe('false');
  });
});
