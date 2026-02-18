import { jest } from '@jest/globals';
import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

const mockSetActiveTab = jest.fn();

jest.unstable_mockModule('../../store/capitalCallStore', () => ({
  useCapitalCallStore: (selector: any) => {
    const state = {
      activeTab: 'FOR_REVIEW',
      setActiveTab: mockSetActiveTab,
    };
    return selector(state);
  },
}));

jest.unstable_mockModule('../../types', () => ({
  CapitalCallTab: {
    FOR_REVIEW: 'FOR_REVIEW',
    REJECTED_BY_APPROVER: 'REJECTED_BY_APPROVER',
    EXCEPTION: 'EXCEPTION',
    PENDING_APPROVAL: 'PENDING_APPROVAL',
    FOLLOW_UP_REQUIRED: 'FOLLOW_UP_REQUIRED',
  },
}));

jest.unstable_mockModule('@/components/ui/Tabs', () => ({
  Tabs: ({ children, value, onValueChange }: any) =>
    React.createElement('div', { 'data-testid': 'tabs', 'data-value': value }, children),
  TabsList: ({ children }: any) =>
    React.createElement('div', { 'data-testid': 'tabs-list', role: 'tablist' }, children),
  TabsTrigger: ({ children, value, ...props }: any) =>
    React.createElement('button', { ...props, role: 'tab', 'data-value': value }, children),
}));

const { CapitalCallTabs } = await import('../CapitalCallTabs');

describe('CapitalCallTabs', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders without crashing', () => {
    const { container } = render(<CapitalCallTabs />);
    expect(container).toBeDefined();
  });

  it('renders all five tab labels', () => {
    render(<CapitalCallTabs />);
    expect(screen.getByText('FOR REVIEW')).toBeInTheDocument();
    expect(screen.getByText('REJECTED BY APPROVER')).toBeInTheDocument();
    expect(screen.getByText('EXCEPTION')).toBeInTheDocument();
    expect(screen.getByText('PENDING APPROVAL')).toBeInTheDocument();
    expect(screen.getByText('FOLLOW-UP REQUIRED FOR BREAKDOWN')).toBeInTheDocument();
  });

  it('renders a tab element for each tab', () => {
    render(<CapitalCallTabs />);
    const tabs = screen.getAllByRole('tab');
    expect(tabs).toHaveLength(5);
  });
});
