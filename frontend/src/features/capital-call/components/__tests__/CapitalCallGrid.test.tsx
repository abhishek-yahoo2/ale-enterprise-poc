import { jest } from '@jest/globals';
import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

const mockNavigate = jest.fn();
const mockSetPage = jest.fn();
const mockSetSort = jest.fn();

jest.unstable_mockModule('react-router-dom', () => ({
  useNavigate: () => mockNavigate,
}));

jest.unstable_mockModule('../../store/capitalCallStore', () => ({
  useCapitalCallStore: (selector: any) => {
    const state = {
      currentPage: 0,
      pageSize: 100,
      sortField: '',
      sortDirection: 'ASC',
      setPage: mockSetPage,
      setSort: mockSetSort,
      activeTab: 'FOR_REVIEW',
      filters: {},
    };
    return selector(state);
  },
}));

jest.unstable_mockModule('../../hooks/useCapitalCall', () => ({
  useCapitalCall: () => ({
    getByStatus: jest.fn(() => []),
    search: jest.fn(() =>
      Promise.resolve({
        data: [],
        pagination: { currentPage: 0, pageSize: 100, totalElements: 0, totalPages: 0 },
      })
    ),
  }),
}));

jest.unstable_mockModule('../../hooks/useCapitalCallSearch', () => ({
  useCapitalCallSearch: () => ({
    data: null,
    isLoading: false,
    error: null,
  }),
}));

jest.unstable_mockModule('../LockDialog', () => ({
  LockDialog: () => React.createElement('div', { 'data-testid': 'lock-dialog' }),
}));

jest.unstable_mockModule('@/components/ui/ModifiedTable', () => ({
  Table: ({ children }: any) => React.createElement('table', null, children),
  TableBody: ({ children }: any) => React.createElement('tbody', null, children),
  TableCell: ({ children }: any) => React.createElement('td', null, children),
  TableHead: ({ children, ...props }: any) => React.createElement('th', props, children),
  TableHeader: ({ children }: any) => React.createElement('thead', null, children),
  TableRow: ({ children, ...props }: any) => React.createElement('tr', props, children),
}));

jest.unstable_mockModule('@/components/ui/Button', () => ({
  default: ({ children, ...props }: any) =>
    React.createElement('button', props, children),
}));

jest.unstable_mockModule('lucide-react', () => ({
  ChevronLeft: () => React.createElement('span', null, 'ChevronLeft'),
  ChevronRight: () => React.createElement('span', null, 'ChevronRight'),
  ChevronsLeft: () => React.createElement('span', null, 'ChevronsLeft'),
  ChevronsRight: () => React.createElement('span', null, 'ChevronsRight'),
  Lock: () => React.createElement('span', null, 'LockIcon'),
  ArrowUpDown: () => React.createElement('span', null, 'ArrowUpDown'),
  ArrowUp: () => React.createElement('span', null, 'ArrowUp'),
  ArrowDown: () => React.createElement('span', null, 'ArrowDown'),
}));

jest.unstable_mockModule('date-fns', () => ({
  format: () => '01/01/2025',
}));

const { CapitalCallGrid } = await import('../CapitalCallGrid');

describe('CapitalCallGrid', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders without crashing', () => {
    const { container } = render(<CapitalCallGrid />);
    expect(container).toBeDefined();
  });

  it('shows loading state initially', () => {
    render(<CapitalCallGrid />);
    expect(screen.getByText('Loading capital calls...')).toBeInTheDocument();
  });
});
