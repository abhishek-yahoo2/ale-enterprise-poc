import { jest } from '@jest/globals';
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';

// Mock the Card component
jest.unstable_mockModule('@/components/ui/Card', () => ({
  Card: ({ children, className, onClick, ...props }: any) =>
    React.createElement('div', { className, onClick, 'data-testid': `card-${props.title}` }, children),
  CardContent: ({ children, className }: any) =>
    React.createElement('div', { className }, children),
}));

const { default: AccountingCashLanding } = await import('../AccountingCashLanding');

const mockNavigate = jest.fn();
jest.unstable_mockModule('react-router-dom', async () => {
  const actual = await import('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

// Re-import after mocking useNavigate
const { default: AccountingCashLandingWithNav } = await import('../AccountingCashLanding');

describe('AccountingCashLanding', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders without crashing', () => {
    const { container } = render(
      <MemoryRouter>
        <AccountingCashLanding />
      </MemoryRouter>
    );
    expect(container).toBeDefined();
  });

  it('displays the page title', () => {
    render(
      <MemoryRouter>
        <AccountingCashLanding />
      </MemoryRouter>
    );
    expect(screen.getByText('ACCOUNTING & CASH')).toBeInTheDocument();
  });

  it('renders all three tile cards', () => {
    render(
      <MemoryRouter>
        <AccountingCashLanding />
      </MemoryRouter>
    );
    expect(screen.getAllByText('PRIVATE EQUITY').length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText('UNITIZED FUNDS').length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText('ALTERNATIVE FUNDS SERVICES').length).toBeGreaterThanOrEqual(1);
  });

  it('renders tile descriptions', () => {
    render(
      <MemoryRouter>
        <AccountingCashLanding />
      </MemoryRouter>
    );
    expect(screen.getByText('Capital Call, Cash Distribution, Stock Distribution')).toBeInTheDocument();
    expect(screen.getByText('Fund accounting and management')).toBeInTheDocument();
    expect(screen.getByText('Alternative investment services')).toBeInTheDocument();
  });
});
