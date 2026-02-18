import { jest } from '@jest/globals';
import React from 'react';
import { render, screen } from '@testing-library/react';
import { Popover, PopoverTrigger, PopoverContent } from '../popover';

describe('Popover', () => {
  it('renders trigger', () => {
    render(
      <Popover>
        <PopoverTrigger>Open</PopoverTrigger>
        <PopoverContent>Content</PopoverContent>
      </Popover>
    );
    expect(screen.getByText('Open')).toBeInTheDocument();
  });

  it('does not show content when closed', () => {
    render(
      <Popover open={false}>
        <PopoverTrigger>Open</PopoverTrigger>
        <PopoverContent>Hidden</PopoverContent>
      </Popover>
    );
    expect(screen.queryByText('Hidden')).not.toBeInTheDocument();
  });

  it('shows content when open=true', () => {
    render(
      <Popover open={true}>
        <PopoverTrigger>Open</PopoverTrigger>
        <PopoverContent>Visible</PopoverContent>
      </Popover>
    );
    expect(screen.getByText('Visible')).toBeInTheDocument();
  });

  it('applies custom className to content', () => {
    render(
      <Popover open={true}>
        <PopoverTrigger>Open</PopoverTrigger>
        <PopoverContent className="custom-class">Content</PopoverContent>
      </Popover>
    );
    expect(screen.getByText('Content').className).toContain('custom-class');
  });
});
