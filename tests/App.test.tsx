import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import App from '../src/App';

describe('App', () => {
   it('renders the app title', () => {
      render(<App />);
      const heading = screen.getByText(/Audiobook Admin/i);
      expect(heading).toBeInTheDocument();
   });

   it('renders the count button', () => {
      render(<App />);
      const button = screen.getByRole('button', { name: /count is/i });
      expect(button).toBeInTheDocument();
   });
});

