import { jest } from '@jest/globals';
import React from 'react';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';

// Mock the Card component
jest.unstable_mockModule('@/components/ui/Card', () => ({
  Card: ({ children, className, onClick, ...props }: any) =>
    React.createElement('div', { className, onClick, 'data-testid': `card-${props.title}` }, children),
  CardContent: ({ children, className }: any) =>
    React.createElement('div', { className }, children),
}));

const { default: PrivateEquityLanding } = await import('../PrivateEquityLanding');

describe('PrivateEquityLanding', () => {
  it('renders without crashing', () => {
    const { container } = render(
      <MemoryRouter>
        <PrivateEquityLanding />
      </MemoryRouter>
    );
    expect(container).toBeDefined();
  });

  it('renders the breadcrumb with ACCOUNTING & CASH and PRIVATE EQUITY', () => {
    render(
      <MemoryRouter>
        <PrivateEquityLanding />
      </MemoryRouter>
    );
    expect(screen.getByText('ACCOUNTING & CASH')).toBeInTheDocument();
    expect(screen.getByText('PRIVATE EQUITY')).toBeInTheDocument();
  });

  it('renders all five tile cards', () => {
    render(
      <MemoryRouter>
        <PrivateEquityLanding />
      </MemoryRouter>
    );
    expect(screen.getAllByText('CAPITAL CALL').length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText('CASH DISTRIBUTION').length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText('STOCK DISTRIBUTION').length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText('HISTORY').length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText('MANUAL PROCESSING').length).toBeGreaterThanOrEqual(1);
  });

  it('renders tile descriptions', () => {
    render(
      <MemoryRouter>
        <PrivateEquityLanding />
      </MemoryRouter>
    );
    expect(screen.getByText('Manage capital call requests')).toBeInTheDocument();
    expect(screen.getByText('Process cash distributions')).toBeInTheDocument();
    expect(screen.getByText('Handle stock distributions')).toBeInTheDocument();
    expect(screen.getByText('View historical records')).toBeInTheDocument();
    expect(screen.getByText('Manual transaction processing')).toBeInTheDocument();
  });
});
