import { render, screen } from '@testing-library/react';
import React from 'react';
import { Card, CardContent } from '../Card';

describe('Card', () => {
  it('renders a Card with title', () => {
    render(<Card title="My Card" />);
    expect(screen.getByText('My Card')).toBeInTheDocument();
  });

  it('renders Card with base styling classes', () => {
    const { container } = render(<Card title="Styled Card" />);
    const card = container.firstElementChild as HTMLElement;
    expect(card).toHaveClass('bg-white', 'shadow', 'rounded-lg', 'overflow-hidden');
  });

  it('renders CardHeader section when title is provided', () => {
    render(<Card title="Header Card" />);
    const title = screen.getByText('Header Card');
    expect(title.tagName).toBe('H3');
    expect(title).toHaveClass('text-lg', 'font-semibold');
  });

  it('renders subtitle when provided', () => {
    render(<Card title="Title" subtitle="A subtitle" />);
    expect(screen.getByText('A subtitle')).toBeInTheDocument();
    expect(screen.getByText('A subtitle').tagName).toBe('P');
    expect(screen.getByText('A subtitle')).toHaveClass('text-sm', 'text-gray-500');
  });

  it('does not render subtitle when not provided', () => {
    render(<Card title="No Subtitle" />);
    expect(screen.queryByText('text-gray-500')).not.toBeInTheDocument();
  });

  it('renders custom header content', () => {
    render(
      <Card title="Title" header={<span data-testid="custom-header">Custom Header</span>} />
    );
    expect(screen.getByTestId('custom-header')).toBeInTheDocument();
  });

  it('renders children as content', () => {
    render(
      <Card title="Card with children">
        <p>Child content here</p>
      </Card>
    );
    expect(screen.getByText('Child content here')).toBeInTheDocument();
  });

  it('renders content prop when no children are provided', () => {
    render(<Card title="Card" content={<span>Content via prop</span>} />);
    expect(screen.getByText('Content via prop')).toBeInTheDocument();
  });

  it('renders footer when provided', () => {
    render(
      <Card title="Card" footer={<button>Action</button>} />
    );
    expect(screen.getByRole('button', { name: 'Action' })).toBeInTheDocument();
  });

  it('does not render footer section when footer is not provided', () => {
    const { container } = render(<Card title="No Footer" />);
    const borderTElements = container.querySelectorAll('.border-t');
    expect(borderTElements.length).toBe(0);
  });

  it('applies custom className to Card', () => {
    const { container } = render(<Card title="Custom" className="my-card-class" />);
    const card = container.firstElementChild as HTMLElement;
    expect(card).toHaveClass('my-card-class');
    expect(card).toHaveClass('bg-white', 'shadow', 'rounded-lg');
  });

  it('passes through additional HTML div attributes', () => {
    const { container } = render(<Card title="Attrs" data-testid="card-el" />);
    expect(screen.getByTestId('card-el')).toBeInTheDocument();
  });
});

describe('CardContent', () => {
  it('renders CardContent with children', () => {
    render(<CardContent>Content text</CardContent>);
    expect(screen.getByText('Content text')).toBeInTheDocument();
  });

  it('applies base text styling class', () => {
    render(<CardContent data-testid="card-content">Text</CardContent>);
    const content = screen.getByTestId('card-content');
    expect(content).toHaveClass('text-gray-700');
  });

  it('applies custom className to CardContent', () => {
    render(<CardContent className="my-content-class" data-testid="card-content">Text</CardContent>);
    const content = screen.getByTestId('card-content');
    expect(content).toHaveClass('my-content-class');
    expect(content).toHaveClass('text-gray-700');
  });

  it('passes through additional HTML div attributes', () => {
    render(<CardContent data-testid="content-el" role="region">Content</CardContent>);
    const content = screen.getByTestId('content-el');
    expect(content).toHaveAttribute('role', 'region');
  });
});
