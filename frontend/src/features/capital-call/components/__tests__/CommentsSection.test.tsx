import { jest } from '@jest/globals';
import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

jest.unstable_mockModule('react-hook-form', () => {
  let currentValue = '';
  return {
    useForm: () => ({
      control: {},
      handleSubmit: (fn: any) => (e: any) => {
        e?.preventDefault?.();
        fn({ content: currentValue });
      },
      reset: jest.fn(() => {
        currentValue = '';
      }),
    }),
    Controller: ({ render: renderProp, name }: any) =>
      renderProp({
        field: {
          value: currentValue,
          onChange: (e: any) => {
            currentValue = e?.target?.value ?? e;
          },
          onBlur: jest.fn(),
          ref: jest.fn(),
          name,
        },
        fieldState: { error: null },
      }),
  };
});

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

const { default: CommentsSection } = await import('../CommentsSection');

describe('CommentsSection', () => {
  const mockOnAddComment = jest.fn();
  const sampleComments = [
    { id: '1', author: 'Alice', content: 'First comment', timestamp: '2025-01-15T10:00:00Z' },
    { id: '2', author: 'Bob', content: 'Second comment', timestamp: '2025-01-16T12:00:00Z' },
  ];

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders without crashing', () => {
    const { container } = render(
      <CommentsSection comments={sampleComments} onAddComment={mockOnAddComment} />
    );
    expect(container).toBeDefined();
  });

  it('displays the Comments heading', () => {
    render(
      <CommentsSection comments={sampleComments} onAddComment={mockOnAddComment} />
    );
    expect(screen.getByText('Comments')).toBeInTheDocument();
  });

  it('renders the Add Comment button', () => {
    render(
      <CommentsSection comments={sampleComments} onAddComment={mockOnAddComment} />
    );
    expect(screen.getByText('Add Comment')).toBeInTheDocument();
  });

  it('renders the comment text area placeholder', () => {
    render(
      <CommentsSection comments={sampleComments} onAddComment={mockOnAddComment} />
    );
    expect(screen.getByPlaceholderText('Add a comment...')).toBeInTheDocument();
  });
});
