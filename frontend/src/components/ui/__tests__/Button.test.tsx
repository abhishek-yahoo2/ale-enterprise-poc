import { jest } from '@jest/globals';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import React from 'react';
import Button from '../Button';

describe('Button', () => {
  it('renders with default variant (primary) and default size (medium)', () => {
    render(<Button>Click me</Button>);
    const button = screen.getByRole('button', { name: 'Click me' });
    expect(button).toBeInTheDocument();
    expect(button).toHaveClass('bg-primary', 'text-white');
    expect(button).toHaveClass('px-4', 'py-2');
  });

  describe('variants', () => {
    it('renders primary variant', () => {
      render(<Button variant="primary">Primary</Button>);
      const button = screen.getByRole('button', { name: 'Primary' });
      expect(button).toHaveClass('bg-primary', 'text-white', 'hover:bg-primary-dark');
    });

    it('renders secondary variant', () => {
      render(<Button variant="secondary">Secondary</Button>);
      const button = screen.getByRole('button', { name: 'Secondary' });
      expect(button).toHaveClass('bg-secondary', 'text-white');
    });

    it('renders danger variant', () => {
      render(<Button variant="danger">Danger</Button>);
      const button = screen.getByRole('button', { name: 'Danger' });
      expect(button).toHaveClass('bg-red-500', 'text-white');
    });

    it('renders outline variant', () => {
      render(<Button variant="outline">Outline</Button>);
      const button = screen.getByRole('button', { name: 'Outline' });
      expect(button).toHaveClass('border', 'border-primary', 'text-primary');
    });

    it('renders success variant', () => {
      render(<Button variant="success">Success</Button>);
      const button = screen.getByRole('button', { name: 'Success' });
      expect(button).toHaveClass('bg-green-500', 'text-white');
    });
  });

  describe('sizes', () => {
    it('renders small size', () => {
      render(<Button size="small">Small</Button>);
      const button = screen.getByRole('button', { name: 'Small' });
      expect(button).toHaveClass('px-2', 'py-1', 'text-sm');
    });

    it('renders medium size (default)', () => {
      render(<Button size="medium">Medium</Button>);
      const button = screen.getByRole('button', { name: 'Medium' });
      expect(button).toHaveClass('px-4', 'py-2');
    });

    it('renders large size', () => {
      render(<Button size="large">Large</Button>);
      const button = screen.getByRole('button', { name: 'Large' });
      expect(button).toHaveClass('px-6', 'py-3', 'text-lg');
    });
  });

  it('applies custom className', () => {
    render(<Button className="my-custom-class">Custom</Button>);
    const button = screen.getByRole('button', { name: 'Custom' });
    expect(button).toHaveClass('my-custom-class');
    // Should still have base classes
    expect(button).toHaveClass('inline-flex', 'items-center', 'justify-center');
  });

  it('handles click events', async () => {
    const user = userEvent.setup();
    const handleClick = jest.fn();
    render(<Button onClick={handleClick}>Clickable</Button>);
    const button = screen.getByRole('button', { name: 'Clickable' });
    await user.click(button);
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('does not fire click when disabled', async () => {
    const user = userEvent.setup();
    const handleClick = jest.fn();
    render(
      <Button onClick={handleClick} disabled>
        Disabled
      </Button>
    );
    const button = screen.getByRole('button', { name: 'Disabled' });
    expect(button).toBeDisabled();
    await user.click(button);
    expect(handleClick).not.toHaveBeenCalled();
  });

  it('passes through additional HTML button attributes', () => {
    render(<Button type="submit" aria-label="submit-btn">Submit</Button>);
    const button = screen.getByRole('button', { name: 'submit-btn' });
    expect(button).toHaveAttribute('type', 'submit');
  });

  it('renders children content', () => {
    render(
      <Button>
        <span data-testid="child-icon">icon</span>
        Click
      </Button>
    );
    expect(screen.getByTestId('child-icon')).toBeInTheDocument();
    expect(screen.getByRole('button')).toHaveTextContent('Click');
  });
});
