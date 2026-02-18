import React from 'react';
import { render, screen } from '@testing-library/react';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '../ModifiedTable';

describe('ModifiedTable', () => {
  it('renders a full table', () => {
    render(
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Age</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow>
            <TableCell>Alice</TableCell>
            <TableCell>30</TableCell>
          </TableRow>
        </TableBody>
      </Table>
    );
    expect(screen.getByText('Name')).toBeInTheDocument();
    expect(screen.getByText('Age')).toBeInTheDocument();
    expect(screen.getByText('Alice')).toBeInTheDocument();
    expect(screen.getByText('30')).toBeInTheDocument();
  });

  it('applies custom className to Table', () => {
    const { container } = render(<Table className="custom-table"><tbody></tbody></Table>);
    expect(container.querySelector('table')?.className).toContain('custom-table');
  });

  it('applies custom className to TableHead', () => {
    render(
      <table>
        <thead>
          <tr>
            <TableHead className="custom-head">Header</TableHead>
          </tr>
        </thead>
      </table>
    );
    expect(screen.getByText('Header').className).toContain('custom-head');
  });

  it('applies custom className to TableCell', () => {
    render(
      <table>
        <tbody>
          <tr>
            <TableCell className="custom-cell">Cell</TableCell>
          </tr>
        </tbody>
      </table>
    );
    expect(screen.getByText('Cell').className).toContain('custom-cell');
  });
});
