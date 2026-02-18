import { jest } from '@jest/globals';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { EmptyState } from '../EmptyState';

describe('EmptyState', () => {
  it('renders the title', () => {
    render(<EmptyState title="No items found" />);
    expect(screen.getByText('No items found')).toBeInTheDocument();
  });

  it('renders the description', () => {
    render(
      <EmptyState title="No items" description="Try adjusting your filters" />
    );
    expect(screen.getByText('Try adjusting your filters')).toBeInTheDocument();
  });

  it('renders the icon', () => {
    render(
      <EmptyState
        title="No items"
        icon={<span data-testid="test-icon">icon</span>}
      />
    );
    expect(screen.getByTestId('test-icon')).toBeInTheDocument();
  });

  it('renders the action button with the correct label', () => {
    const handleClick = jest.fn();
    render(
      <EmptyState
        title="No items"
        action={{ label: 'Add Item', onClick: handleClick }}
      />
    );
    expect(screen.getByText('Add Item')).toBeInTheDocument();
  });

  it('calls action onClick when the action button is clicked', async () => {
    const user = userEvent.setup();
    const handleClick = jest.fn();
    render(
      <EmptyState
        title="No items"
        action={{ label: 'Add Item', onClick: handleClick }}
      />
    );

    await user.click(screen.getByText('Add Item'));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });
});
