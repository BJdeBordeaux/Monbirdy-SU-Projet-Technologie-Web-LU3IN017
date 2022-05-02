import { render, screen } from '@testing-library/react';
import App_bak from './App_bak';

test('renders learn react link', () => {
  render(<App_bak />);
  const linkElement = screen.getByText(/learn react/i);
  expect(linkElement).toBeInTheDocument();
});
