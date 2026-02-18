import { jest } from '@jest/globals';
import React from 'react';
import { render, screen } from '@testing-library/react';

jest.unstable_mockModule('react-router-dom', () => ({
  useNavigate: () => jest.fn(),
}));

jest.unstable_mockModule('../../components/CapitalCallTabs', () => ({
  CapitalCallTabs: () => React.createElement('div', { 'data-testid': 'tabs' }, 'Tabs'),
}));

jest.unstable_mockModule('../../components/SubTabCountCards', () => ({
  SubTabCountCards: () => React.createElement('div', { 'data-testid': 'subtabs' }, 'SubTabs'),
}));

jest.unstable_mockModule('../../components/CapitalCallFilters', () => ({
  CapitalCallFilters: () => React.createElement('div', { 'data-testid': 'filters' }, 'Filters'),
}));

jest.unstable_mockModule('../../components/CapitalCallGrid', () => ({
  CapitalCallGrid: () => React.createElement('div', { 'data-testid': 'grid' }, 'Grid'),
}));

jest.unstable_mockModule('../../store/capitalCallStore', () => ({
  useCapitalCallStore: (selector: any) => {
    const state = {
      activeTab: 'FOR_REVIEW',
      selectedQueue: 'Operator Queue',
      setSelectedQueue: jest.fn(),
    };
    return selector(state);
  },
}));

jest.unstable_mockModule('@/components/ui/Select', () => ({
  Select: ({ children }: any) => React.createElement('div', null, children),
  SelectContent: ({ children }: any) => React.createElement('div', null, children),
  SelectItem: ({ children }: any) => React.createElement('div', null, children),
  SelectTrigger: ({ children }: any) => React.createElement('div', null, children),
  SelectValue: () => React.createElement('span', null, 'Operator Queue'),
}));

const { default: CapitalCallPage } = await import('../CapitalCallPage');

describe('CapitalCallPage', () => {
  it('renders page header', () => {
    render(<CapitalCallPage />);
    expect(screen.getByText(/Northern Trust/)).toBeInTheDocument();
  });

  it('renders breadcrumb with CAPITAL CALL', () => {
    render(<CapitalCallPage />);
    expect(screen.getByText('CAPITAL CALL')).toBeInTheDocument();
  });

  it('renders tabs and grid components', () => {
    render(<CapitalCallPage />);
    expect(screen.getByTestId('tabs')).toBeInTheDocument();
    expect(screen.getByTestId('filters')).toBeInTheDocument();
    expect(screen.getByTestId('grid')).toBeInTheDocument();
  });
});
