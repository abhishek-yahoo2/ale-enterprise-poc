import { jest } from '@jest/globals';
import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

const { default: EditModeToggle } = await import('../EditModeToggle');

describe('EditModeToggle', () => {
  const mockOnToggle = jest.fn() as any;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders without crashing', () => {
    const { container } = render(
      <EditModeToggle isEditMode={false} onToggle={mockOnToggle} />
    );
    expect(container).toBeDefined();
  });

  it('shows Edit button when not in edit mode', () => {
    render(<EditModeToggle isEditMode={false} onToggle={mockOnToggle} />);
    expect(screen.getByText('Edit')).toBeInTheDocument();
  });

  it('shows Cancel button when in edit mode', () => {
    render(<EditModeToggle isEditMode={true} onToggle={mockOnToggle} />);
    expect(screen.getByText('Cancel')).toBeInTheDocument();
  });

  it('calls onToggle when button is clicked', async () => {
    const user = userEvent.setup();
    render(<EditModeToggle isEditMode={false} onToggle={mockOnToggle} />);
    await user.click(screen.getByText('Edit'));
    expect(mockOnToggle).toHaveBeenCalledTimes(1);
  });
});
