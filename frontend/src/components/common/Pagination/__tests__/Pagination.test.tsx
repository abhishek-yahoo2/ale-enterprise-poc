import { jest } from '@jest/globals';
import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Pagination from '../Pagination';

describe('Pagination', () => {
  it('renders page info', () => {
    render(<Pagination totalItems={100} itemsPerPage={10} onPageChange={jest.fn() as any} />);
    expect(screen.getByText('Page 1 of 10')).toBeInTheDocument();
  });

  it('renders Previous and Next buttons', () => {
    render(<Pagination totalItems={50} itemsPerPage={10} onPageChange={jest.fn() as any} />);
    expect(screen.getByText('Previous')).toBeInTheDocument();
    expect(screen.getByText('Next')).toBeInTheDocument();
  });

  it('disables Previous on first page', () => {
    render(<Pagination totalItems={50} itemsPerPage={10} onPageChange={jest.fn() as any} />);
    expect(screen.getByText('Previous')).toBeDisabled();
  });

  it('calls onPageChange when Next is clicked', async () => {
    const onChange = jest.fn();
    const user = userEvent.setup();
    render(<Pagination totalItems={50} itemsPerPage={10} onPageChange={onChange as any} />);
    await user.click(screen.getByText('Next'));
    expect(onChange).toHaveBeenCalledWith(2);
  });

  it('calls onPageChange when page number is clicked', async () => {
    const onChange = jest.fn();
    const user = userEvent.setup();
    render(<Pagination totalItems={50} itemsPerPage={10} onPageChange={onChange as any} />);
    await user.click(screen.getByText('3'));
    expect(onChange).toHaveBeenCalledWith(3);
  });

  it('updates page display after navigation', async () => {
    const user = userEvent.setup();
    render(<Pagination totalItems={50} itemsPerPage={10} onPageChange={jest.fn() as any} />);
    await user.click(screen.getByText('Next'));
    expect(screen.getByText('Page 2 of 5')).toBeInTheDocument();
  });
});
