//Generate Resubale Table component using Tailwind CSS. The Table component should have props for columns and data, where columns is an array of objects with header and accessor properties, and data is an array of objects representing the rows of the table. The Table component should render a table with the specified columns and data, and should also include basic styling for the table headers and rows.
//use material design for the table with hover effects and alternating row colors. The table should be responsive and adapt to different screen sizes.

import React from 'react';
interface Column {
    header: string;
    accessor: string;
}
interface TableProps {
    columns: Column[];
    data: Record<string, any>[];
}
const Table: React.FC<TableProps> = ({ columns, data }) => {
    return (
        <div className="overflow-x-auto">     <table className="min-w-full bg-white border border-gray-200">
            <thead>
                <tr>
                    {columns.map((col) => ( 
                        <th key={col.accessor} className="px-6 py-3 border-b border-gray-200 bg-gray-100 text-left text-sm font-semibold text-gray-700">
                            {col.header}
                        </th>
                    ))}
                </tr>
            </thead>
            <tbody>
                {data.map((row, index) => (
                    <tr key={index} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50 hover:bg-gray-100'}>
                        {columns.map((col) => (
                            <td key={col.accessor} className="px-6 py-4 border-b border-gray-200 text-sm text-gray-700">
                                {row[col.accessor]}
                            </td>
                        ))}
                    </tr>
                ))}
            </tbody>
        </table>
        </div>
    );
}
export default Table;