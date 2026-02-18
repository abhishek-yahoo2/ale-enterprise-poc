import React from 'react';
import { render, screen } from '@testing-library/react';
import Tooltip from '../Tooltip';

describe('Tooltip', () => {
  it('renders children', () => {
    render(<Tooltip text="Help text">Hover me</Tooltip>);
    expect(screen.getByText('Hover me')).toBeInTheDocument();
  });

  it('renders tooltip text', () => {
    render(<Tooltip text="Help text">Hover me</Tooltip>);
    expect(screen.getByText('Help text')).toBeInTheDocument();
  });

  it('defaults to top position', () => {
    render(<Tooltip text="Help">Content</Tooltip>);
    const tooltip = screen.getByText('Help');
    expect(tooltip.className).toContain('bottom-full');
  });

  it('handles bottom position', () => {
    render(<Tooltip text="Help" position="bottom">Content</Tooltip>);
    const tooltip = screen.getByText('Help');
    expect(tooltip.className).toContain('top-full');
  });

  it('handles left position', () => {
    render(<Tooltip text="Help" position="left">Content</Tooltip>);
    const tooltip = screen.getByText('Help');
    expect(tooltip.className).toContain('right-full');
  });

  it('handles right position', () => {
    render(<Tooltip text="Help" position="right">Content</Tooltip>);
    const tooltip = screen.getByText('Help');
    expect(tooltip.className).toContain('left-full');
  });
});
