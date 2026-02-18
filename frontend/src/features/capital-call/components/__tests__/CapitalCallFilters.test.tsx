import { jest } from '@jest/globals';
import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

const mockSetFilters = jest.fn();
const mockResetFilters = jest.fn();
const mockInvalidateQueries = jest.fn();

jest.unstable_mockModule('../../store/capitalCallStore', () => ({
  useCapitalCallStore: (selector: any) => {
    const state = {
      filters: {},
      setFilters: mockSetFilters,
      resetFilters: mockResetFilters,
    };
    return selector(state);
  },
}));

jest.unstable_mockModule('@tanstack/react-query', () => ({
  useQueryClient: () => ({
    invalidateQueries: mockInvalidateQueries,
  }),
}));

jest.unstable_mockModule('react-hook-form', () => ({
  useForm: () => ({
    register: () => ({}),
    watch: () => undefined,
    setValue: jest.fn(),
    reset: jest.fn(),
    handleSubmit: (fn: any) => (e: any) => {
      e?.preventDefault?.();
      fn({});
    },
  }),
}));

jest.unstable_mockModule('@/components/ui/Button', () => ({
  default: ({ children, ...props }: any) =>
    React.createElement('button', props, children),
}));

jest.unstable_mockModule('@/components/ui/Input', () => ({
  default: (props: any) => React.createElement('input', props),
}));

jest.unstable_mockModule('@/components/ui/Select', () => ({
  Select: ({ children }: any) => React.createElement('div', null, children),
  SelectTrigger: ({ children }: any) => React.createElement('div', null, children),
  SelectValue: ({ placeholder }: any) => React.createElement('span', null, placeholder),
  SelectContent: ({ children }: any) => React.createElement('div', null, children),
  SelectItem: ({ children }: any) => React.createElement('div', null, children),
}));

jest.unstable_mockModule('@/components/ui/Calendar', () => ({
  default: () => React.createElement('div', null, 'Calendar'),
}));

jest.unstable_mockModule('@/components/ui/popover', () => ({
  Popover: ({ children }: any) => React.createElement('div', null, children),
  PopoverContent: ({ children }: any) => React.createElement('div', null, children),
  PopoverTrigger: ({ children }: any) => React.createElement('div', null, children),
}));

jest.unstable_mockModule('lucide-react', () => ({
  Search: () => React.createElement('span', null, 'SearchIcon'),
  RotateCcw: () => React.createElement('span', null, 'RotateCcwIcon'),
  FileDown: () => React.createElement('span', null, 'FileDownIcon'),
  RefreshCw: () => React.createElement('span', null, 'RefreshCwIcon'),
  ChevronDown: () => React.createElement('span', null, 'ChevronDownIcon'),
  ChevronUp: () => React.createElement('span', null, 'ChevronUpIcon'),
  X: () => React.createElement('span', null, 'XIcon'),
}));

jest.unstable_mockModule('date-fns', () => ({
  format: () => '01-Jan-2025',
}));

const { CapitalCallFilters } = await import('../CapitalCallFilters');

describe('CapitalCallFilters', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders without crashing', () => {
    const { container } = render(<CapitalCallFilters />);
    expect(container).toBeDefined();
  });

  it('displays the Filter heading', () => {
    render(<CapitalCallFilters />);
    expect(screen.getByText('Filter')).toBeInTheDocument();
  });

  it('renders SEARCH, RESET, and REFRESH buttons', () => {
    render(<CapitalCallFilters />);
    expect(screen.getByText('SEARCH')).toBeInTheDocument();
    expect(screen.getByText('RESET')).toBeInTheDocument();
    expect(screen.getByText('REFRESH')).toBeInTheDocument();
  });

  it('renders filter labels for Row 1 fields', () => {
    render(<CapitalCallFilters />);
    expect(screen.getByText('Client Name')).toBeInTheDocument();
    expect(screen.getByText('Account Id')).toBeInTheDocument();
    expect(screen.getByText('Asset Id')).toBeInTheDocument();
    expect(screen.getByText('Account Type')).toBeInTheDocument();
  });
});
