import { jest } from '@jest/globals';
import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

const mockNavigate = jest.fn();

jest.unstable_mockModule('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom') as any,
  useNavigate: () => mockNavigate,
}));

jest.unstable_mockModule('@/components/ui/button', () => ({
  __esModule: true,
  default: (props: any) => <button {...props} />,
  Button: (props: any) => <button {...props} />,
}));

const { NotFoundPage } = await import('../NotFoundPage');

describe('NotFoundPage', () => {
  beforeEach(() => {
    mockNavigate.mockClear();
  });

  it('renders 404', () => {
    render(<NotFoundPage />);
    expect(screen.getByText('404')).toBeInTheDocument();
  });

  it('renders "Page Not Found"', () => {
    render(<NotFoundPage />);
    expect(screen.getByText('Page Not Found')).toBeInTheDocument();
  });

  it('navigates to /accounting-cash when Go to Home button is clicked', async () => {
    const user = userEvent.setup();
    render(<NotFoundPage />);

    await user.click(screen.getByText('Go to Home'));
    expect(mockNavigate).toHaveBeenCalledWith('/accounting-cash');
  });
});
