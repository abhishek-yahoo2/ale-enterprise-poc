//Reusable data grid with React Table (TanStack)
import React from 'react';
import { useTable, Column } from '@tanstack/react-table';

interface DataGridProps<T> {
    columns: Column<T>[];
    data: T[];
}

export const DataGrid = <T extends object>({ columns, data }: DataGridProps<T>) => {
    const {
        getTableProps,
        getTableBodyProps,
        headerGroups,
        rows,
        prepareRow,
    } = useTable<T>({ columns, data });

    return (
        <table {...getTableProps()} className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
                {headerGroups.map(headerGroup => (
                    <tr {...headerGroup.getHeaderGroupProps()} key={headerGroup.id}>
                        {headerGroup.headers.map(column => (
                            <th
                                {...column.getHeaderProps()}
                                key={column.id}
                                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                            >
                                {column.render('Header')}
                            </th>
                        ))}
                    </tr>   
                ))}
            </thead>
            <tbody {...getTableBodyProps()} className="bg-white divide-y divide-gray-200">
                {rows.map(row => {
                    prepareRow(row);
                    return (
                        <tr {...row.getRowProps()} key={row.id}>
                            {row.cells.map(cell => (
                                <td
                                    {...cell.getCellProps()}
                                    key={cell.column.id}
                                    className="px-6 py-4 whitespace-nowrap text-sm text-gray-500"
                                >
                                    {cell.render('Cell')}
                                </td>
                            ))}
                        </tr>
                    );
                })}
            </tbody>
        </table>
    );
}

