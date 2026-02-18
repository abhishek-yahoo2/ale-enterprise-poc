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
  Button: (props: any) => <button {...props} />,
}));

const { ComingSoonPage } = await import('../ComingSoonPage');

describe('ComingSoonPage', () => {
  beforeEach(() => {
    mockNavigate.mockClear();
  });

  it('renders the title', () => {
    render(<ComingSoonPage title="Feature Coming Soon" />);
    expect(screen.getByText('Feature Coming Soon')).toBeInTheDocument();
  });

  it('renders the construction message', () => {
    render(<ComingSoonPage title="Feature Coming Soon" />);
    expect(
      screen.getByText(
        'This module is under construction and will be available soon.'
      )
    ).toBeInTheDocument();
  });

  it('calls navigate(-1) when Go Back button is clicked', async () => {
    const user = userEvent.setup();
    render(<ComingSoonPage title="Feature Coming Soon" />);

    await user.click(screen.getByText('Go Back'));
    expect(mockNavigate).toHaveBeenCalledWith(-1);
  });
});
