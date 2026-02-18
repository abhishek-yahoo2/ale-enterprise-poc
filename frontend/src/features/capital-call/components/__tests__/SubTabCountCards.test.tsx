import { jest } from '@jest/globals';
import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

const mockSetActiveSubTab = jest.fn();

jest.unstable_mockModule('../../store/capitalCallStore', () => ({
  useCapitalCallStore: (selector: any) => {
    const state = {
      activeSubTab: 'SSI_VERIFICATION_NEEDED',
      setActiveSubTab: mockSetActiveSubTab,
    };
    return selector(state);
  },
}));

jest.unstable_mockModule('../../hooks/useTabCounts', () => ({
  useTabCounts: () => ({
    data: {},
    isLoading: false,
  }),
}));

jest.unstable_mockModule('../../types', () => ({
  ForReviewSubTab: {
    SSI_VERIFICATION_NEEDED: 'SSI_VERIFICATION_NEEDED',
    TRANSACTION_TO_BE_PROCESSED: 'TRANSACTION_TO_BE_PROCESSED',
    MISSING_FUND_DOCUMENT: 'MISSING_FUND_DOCUMENT',
    MISSING_CLIENT_INSTRUCTION: 'MISSING_CLIENT_INSTRUCTION',
    MISSING_CLIENT_AND_FUND_INSTRUCTION: 'MISSING_CLIENT_AND_FUND_INSTRUCTION',
  },
}));

jest.unstable_mockModule('../../mocks/capitalCallMock', () => ({
  capitalCallMockApi: {
    getCountForSubTab: jest.fn(() => 42),
  },
}));

jest.unstable_mockModule('@/components/ui/Card', () => ({
  Card: ({ children, title, onClick, className }: any) =>
    React.createElement('div', { onClick, className, 'data-testid': `card-${title}` }, children),
  CardContent: ({ children, className }: any) =>
    React.createElement('div', { className }, children),
}));

jest.unstable_mockModule('lucide-react', () => ({
  Loader2: () => React.createElement('span', null, 'Loading...'),
}));

jest.unstable_mockModule('date-fns', () => ({
  sub: jest.fn(),
}));

const { SubTabCountCards } = await import('../SubTabCountCards');

describe('SubTabCountCards', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders without crashing', () => {
    const { container } = render(<SubTabCountCards />);
    expect(container).toBeDefined();
  });

  it('renders all five sub-tab card labels', () => {
    render(<SubTabCountCards />);
    expect(screen.getByText('SSI Verification Needed')).toBeInTheDocument();
    expect(screen.getByText('Transaction To Be Processed')).toBeInTheDocument();
    expect(screen.getByText('Missing Fund Document')).toBeInTheDocument();
    expect(screen.getByText('Missing Client Instruction')).toBeInTheDocument();
    expect(screen.getByText('Missing Client And Fund Instruction')).toBeInTheDocument();
  });

  it('renders the count value for each card', () => {
    render(<SubTabCountCards />);
    const countElements = screen.getAllByText('42');
    expect(countElements.length).toBe(5);
  });
});
