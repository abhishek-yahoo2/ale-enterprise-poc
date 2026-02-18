import { jest } from '@jest/globals';
import React from 'react';
import { render, screen } from '@testing-library/react';

jest.unstable_mockModule('../../components/CapitalCallTabs', () => ({
  CapitalCallTabs: () => React.createElement('div', { 'data-testid': 'tabs' }, 'Tabs'),
}));

jest.unstable_mockModule('../../components/CapitalCallFilters', () => ({
  CapitalCallFilters: () => React.createElement('div', { 'data-testid': 'filters' }, 'Filters'),
}));

jest.unstable_mockModule('../../components/CapitalCallGrid', () => ({
  CapitalCallGrid: () => React.createElement('div', { 'data-testid': 'grid' }, 'Grid'),
}));

const { default: CapitalCallDashboard } = await import('../CapitalCallDashboard');

describe('CapitalCallDashboard', () => {
  it('renders all child components', () => {
    render(<CapitalCallDashboard />);
    expect(screen.getByTestId('tabs')).toBeInTheDocument();
    expect(screen.getByTestId('filters')).toBeInTheDocument();
    expect(screen.getByTestId('grid')).toBeInTheDocument();
  });
});
