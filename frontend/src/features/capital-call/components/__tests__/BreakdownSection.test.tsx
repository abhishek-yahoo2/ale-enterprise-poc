import { jest } from '@jest/globals';
import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

const mockAppend = jest.fn();
const mockRemove = jest.fn();

jest.unstable_mockModule('react-hook-form', () => ({
  useFieldArray: () => ({
    fields: [
      { id: '1', name: 'Fee A', percentage: 50 },
      { id: '2', name: 'Fee B', percentage: 30 },
    ],
    append: mockAppend,
    remove: mockRemove,
  }),
  Controller: ({ render: renderProp }: any) =>
    renderProp({
      field: { value: '', onChange: jest.fn(), onBlur: jest.fn(), ref: jest.fn(), name: '' },
      fieldState: { error: null },
    }),
}));

jest.unstable_mockModule('@/components/ui/Table', () => ({
  default: ({ columns, data }: any) =>
    React.createElement('table', null,
      React.createElement('thead', null,
        React.createElement('tr', null,
          columns.map((col: any) =>
            React.createElement('th', { key: col.accessor }, col.header)
          )
        )
      ),
      React.createElement('tbody', null,
        data.map((row: any, i: number) =>
          React.createElement('tr', { key: i },
            columns.map((col: any) =>
              React.createElement('td', { key: col.accessor }, row[col.accessor])
            )
          )
        )
      )
    ),
}));

const { default: BreakdownSection } = await import('../BreakdownSection');

describe('BreakdownSection', () => {
  const defaultProps = {
    control: {},
    errors: {},
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders without crashing', () => {
    const { container } = render(<BreakdownSection {...defaultProps} />);
    expect(container).toBeDefined();
  });

  it('displays the Breakdown heading', () => {
    render(<BreakdownSection {...defaultProps} />);
    expect(screen.getByText('Breakdown')).toBeInTheDocument();
  });

  it('renders the Add Breakdown button', () => {
    render(<BreakdownSection {...defaultProps} />);
    expect(screen.getByText('Add Breakdown')).toBeInTheDocument();
  });

  it('calls append when Add Breakdown is clicked', async () => {
    const user = userEvent.setup();
    render(<BreakdownSection {...defaultProps} />);
    await user.click(screen.getByText('Add Breakdown'));
    expect(mockAppend).toHaveBeenCalledTimes(1);
  });
});
