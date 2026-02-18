import { jest } from '@jest/globals';
import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Dialog, DialogHeader, DialogContent, DialogFooter, DialogTitle, DialogDescription } from '../Dialog';

describe('Dialog', () => {
  it('renders nothing when not open', () => {
    const { container } = render(
      <Dialog isOpen={false} onClose={jest.fn() as any}>Content</Dialog>
    );
    expect(container.innerHTML).toBe('');
  });

  it('renders content when open', () => {
    render(
      <Dialog isOpen={true} onClose={jest.fn() as any}>
        <DialogContent>Hello Dialog</DialogContent>
      </Dialog>
    );
    expect(screen.getByText('Hello Dialog')).toBeInTheDocument();
  });

  it('renders DialogHeader with title', () => {
    render(
      <Dialog isOpen={true} onClose={jest.fn() as any}>
        <DialogHeader title="Test Title" />
      </Dialog>
    );
    expect(screen.getByText('Test Title')).toBeInTheDocument();
  });

  it('renders DialogTitle', () => {
    render(<DialogTitle>My Title</DialogTitle>);
    expect(screen.getByText('My Title')).toBeInTheDocument();
  });

  it('renders DialogDescription', () => {
    render(<DialogDescription>Description text</DialogDescription>);
    expect(screen.getByText('Description text')).toBeInTheDocument();
  });

  it('renders DialogFooter', () => {
    render(<DialogFooter>Footer content</DialogFooter>);
    expect(screen.getByText('Footer content')).toBeInTheDocument();
  });
});
