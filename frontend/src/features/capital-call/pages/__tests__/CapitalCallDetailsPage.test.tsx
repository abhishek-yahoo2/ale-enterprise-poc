import { jest } from '@jest/globals';
import React from 'react';
import { render, screen } from '@testing-library/react';

const mockNavigate = jest.fn();

jest.unstable_mockModule('react-router-dom', () => ({
  useParams: () => ({ id: '1' }),
  useNavigate: () => mockNavigate,
}));

jest.unstable_mockModule('react-hook-form', () => ({
  useForm: () => ({
    register: () => ({}),
    handleSubmit: (fn: any) => (e: any) => { e?.preventDefault?.(); fn({}); },
    control: {},
    watch: (field: string) => field === 'breakdowns' ? [] : 0,
    formState: { errors: {}, isDirty: false },
    reset: jest.fn(),
  }),
  Controller: ({ render: renderFn }: any) => renderFn({ field: {}, fieldState: {} }),
}));

jest.unstable_mockModule('@hookform/resolvers/zod', () => ({
  zodResolver: () => undefined,
}));

jest.unstable_mockModule('../../hooks/useCapitalCallSearch', () => ({
  useCapitalCallDetails: () => ({
    data: {
      id: 1,
      aleBatchId: 'ALE-000001',
      clientName: 'Test Client',
      totalAmount: 100000,
      workflowStatus: 'DRAFT',
      breakdowns: [],
      comments: [],
    },
    isLoading: false,
  }),
  useUpdateCapitalCall: () => ({ mutate: jest.fn() }),
  useSubmitCapitalCall: () => ({ mutate: jest.fn() }),
  useApproveCapitalCall: () => ({ mutate: jest.fn() }),
}));

jest.unstable_mockModule('../../components/CommentsSection', () => ({
  default: () => React.createElement('div', { 'data-testid': 'comments' }, 'Comments'),
}));

jest.unstable_mockModule('../../components/BreakdownSection', () => ({
  default: () => React.createElement('div', { 'data-testid': 'breakdown' }, 'Breakdown'),
}));

jest.unstable_mockModule('../../components/EditModeToggle', () => ({
  default: () => React.createElement('div', { 'data-testid': 'edit-toggle' }, 'EditToggle'),
}));

const { default: CapitalCallDetailsPage } = await import('../CapitalCallDetailsPage');

describe('CapitalCallDetailsPage', () => {
  it('renders page title', () => {
    render(<CapitalCallDetailsPage />);
    expect(screen.getByText('Capital Call Details')).toBeInTheDocument();
  });

  it('renders basic information', () => {
    render(<CapitalCallDetailsPage />);
    expect(screen.getByText('Basic Information')).toBeInTheDocument();
  });

  it('shows back navigation', () => {
    render(<CapitalCallDetailsPage />);
    expect(screen.getByText('Back to Capital Calls')).toBeInTheDocument();
  });
});
