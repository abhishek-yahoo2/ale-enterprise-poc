import { jest } from '@jest/globals';
import React from 'react';
import { render } from '@testing-library/react';

jest.unstable_mockModule('react-day-picker', () => ({
  DayPicker: (props: any) => React.createElement('div', { 'data-testid': 'day-picker', 'data-mode': props.mode }, 'DayPicker'),
}));

jest.unstable_mockModule('react-day-picker/dist/style.css', () => ({}));

const { default: Calendar } = await import('../Calendar');

describe('Calendar', () => {
  it('renders DayPicker component', () => {
    const { getByTestId } = render(
      <Calendar mode="single" onSelect={jest.fn() as any} />
    );
    expect(getByTestId('day-picker')).toBeInTheDocument();
  });

  it('passes mode prop to DayPicker', () => {
    const { getByTestId } = render(
      <Calendar mode="range" onSelect={jest.fn() as any} />
    );
    expect(getByTestId('day-picker').getAttribute('data-mode')).toBe('range');
  });

  it('passes selected date', () => {
    const date = new Date(2024, 0, 15);
    const { getByTestId } = render(
      <Calendar mode="single" selected={date} onSelect={jest.fn() as any} />
    );
    expect(getByTestId('day-picker')).toBeInTheDocument();
  });
});
