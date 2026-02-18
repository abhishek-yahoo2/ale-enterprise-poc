import { render, screen } from '@testing-library/react';
import React from 'react';
import Table from '../Table';

const sampleColumns = [
  { header: 'Name', accessor: 'name' },
  { header: 'Email', accessor: 'email' },
  { header: 'Role', accessor: 'role' },
];

const sampleData = [
  { name: 'Alice', email: 'alice@example.com', role: 'Admin' },
  { name: 'Bob', email: 'bob@example.com', role: 'User' },
  { name: 'Charlie', email: 'charlie@example.com', role: 'Editor' },
];

describe('Table', () => {
  it('renders a table element', () => {
    render(<Table columns={sampleColumns} data={sampleData} />);
    const table = screen.getByRole('table');
    expect(table).toBeInTheDocument();
  });

  it('renders all column headers', () => {
    render(<Table columns={sampleColumns} data={sampleData} />);
    expect(screen.getByText('Name')).toBeInTheDocument();
    expect(screen.getByText('Email')).toBeInTheDocument();
    expect(screen.getByText('Role')).toBeInTheDocument();
  });

  it('renders column headers as th elements', () => {
    render(<Table columns={sampleColumns} data={sampleData} />);
    const headerCells = screen.getAllByRole('columnheader');
    expect(headerCells).toHaveLength(3);
    expect(headerCells[0]).toHaveTextContent('Name');
    expect(headerCells[1]).toHaveTextContent('Email');
    expect(headerCells[2]).toHaveTextContent('Role');
  });

  it('renders all data rows', () => {
    render(<Table columns={sampleColumns} data={sampleData} />);
    // 1 header row + 3 data rows
    const rows = screen.getAllByRole('row');
    expect(rows).toHaveLength(4);
  });

  it('renders cell data correctly', () => {
    render(<Table columns={sampleColumns} data={sampleData} />);
    expect(screen.getByText('Alice')).toBeInTheDocument();
    expect(screen.getByText('alice@example.com')).toBeInTheDocument();
    expect(screen.getByText('Admin')).toBeInTheDocument();
    expect(screen.getByText('Bob')).toBeInTheDocument();
    expect(screen.getByText('bob@example.com')).toBeInTheDocument();
    expect(screen.getByText('User')).toBeInTheDocument();
    expect(screen.getByText('Charlie')).toBeInTheDocument();
    expect(screen.getByText('charlie@example.com')).toBeInTheDocument();
    expect(screen.getByText('Editor')).toBeInTheDocument();
  });

  it('applies styling classes to header cells', () => {
    render(<Table columns={sampleColumns} data={sampleData} />);
    const headerCells = screen.getAllByRole('columnheader');
    headerCells.forEach((th) => {
      expect(th).toHaveClass('px-6', 'py-3', 'border-b', 'border-gray-200', 'bg-gray-100', 'text-left', 'text-sm', 'font-semibold', 'text-gray-700');
    });
  });

  it('applies styling classes to data cells', () => {
    render(<Table columns={sampleColumns} data={sampleData} />);
    const dataCells = screen.getAllByRole('cell');
    expect(dataCells).toHaveLength(9); // 3 rows x 3 columns
    dataCells.forEach((td) => {
      expect(td).toHaveClass('px-6', 'py-4', 'border-b', 'border-gray-200', 'text-sm', 'text-gray-700');
    });
  });

  it('applies alternating row background colors', () => {
    render(<Table columns={sampleColumns} data={sampleData} />);
    const rows = screen.getAllByRole('row');
    // rows[0] is the header row, data rows start at index 1
    const dataRows = rows.slice(1);

    // Even index data rows (index 0, 2) get bg-white
    expect(dataRows[0]).toHaveClass('bg-white');
    expect(dataRows[2]).toHaveClass('bg-white');

    // Odd index data rows (index 1) get bg-gray-50 and hover:bg-gray-100
    expect(dataRows[1]).toHaveClass('bg-gray-50');
  });

  it('renders table within a scrollable container', () => {
    const { container } = render(<Table columns={sampleColumns} data={sampleData} />);
    const wrapper = container.firstElementChild as HTMLElement;
    expect(wrapper).toHaveClass('overflow-x-auto');
  });

  it('applies base table classes', () => {
    render(<Table columns={sampleColumns} data={sampleData} />);
    const table = screen.getByRole('table');
    expect(table).toHaveClass('min-w-full', 'bg-white', 'border', 'border-gray-200');
  });

  it('renders with empty data array', () => {
    render(<Table columns={sampleColumns} data={[]} />);
    const table = screen.getByRole('table');
    expect(table).toBeInTheDocument();
    // Only header row, no data rows
    const rows = screen.getAllByRole('row');
    expect(rows).toHaveLength(1);
    // Column headers are still present
    expect(screen.getByText('Name')).toBeInTheDocument();
  });

  it('renders with a single column', () => {
    const singleCol = [{ header: 'ID', accessor: 'id' }];
    const singleData = [{ id: '1' }, { id: '2' }];
    render(<Table columns={singleCol} data={singleData} />);
    expect(screen.getByText('ID')).toBeInTheDocument();
    expect(screen.getByText('1')).toBeInTheDocument();
    expect(screen.getByText('2')).toBeInTheDocument();
  });
});
