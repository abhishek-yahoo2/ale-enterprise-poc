import { jest } from '@jest/globals';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { FilterContainer } from '../FilterContainer';

describe('FilterContainer', () => {
  it('renders the input with the given placeholder', () => {
    const onFilterChange = jest.fn();
    render(
      <FilterContainer
        onFilterChange={onFilterChange}
        placeholder="Filter items..."
      />
    );
    expect(screen.getByPlaceholderText('Filter items...')).toBeInTheDocument();
  });

  it('renders the input with default placeholder when none provided', () => {
    const onFilterChange = jest.fn();
    render(<FilterContainer onFilterChange={onFilterChange} />);
    expect(screen.getByPlaceholderText('Search...')).toBeInTheDocument();
  });

  it('calls onFilterChange when the user types in the input', async () => {
    const user = userEvent.setup();
    const onFilterChange = jest.fn();
    render(<FilterContainer onFilterChange={onFilterChange} />);

    const input = screen.getByPlaceholderText('Search...');
    await user.type(input, 'hello');

    // onFilterChange is called for each keystroke
    expect(onFilterChange).toHaveBeenCalledTimes(5);
    expect(onFilterChange).toHaveBeenLastCalledWith({ search: 'hello' });
  });

  it('shows the Clear button when text is entered', async () => {
    const user = userEvent.setup();
    const onFilterChange = jest.fn();
    render(<FilterContainer onFilterChange={onFilterChange} />);

    // Clear button should not be visible initially
    expect(screen.queryByText('Clear')).not.toBeInTheDocument();

    const input = screen.getByPlaceholderText('Search...');
    await user.type(input, 'test');

    expect(screen.getByText('Clear')).toBeInTheDocument();
  });

  it('clears the input and calls onFilterChange when Clear is clicked', async () => {
    const user = userEvent.setup();
    const onFilterChange = jest.fn();
    render(<FilterContainer onFilterChange={onFilterChange} />);

    const input = screen.getByPlaceholderText('Search...');
    await user.type(input, 'test');

    // Reset mock to track only the clear call
    onFilterChange.mockClear();

    await user.click(screen.getByText('Clear'));

    expect(input).toHaveValue('');
    expect(onFilterChange).toHaveBeenCalledWith({ search: '' });
  });
});
