import { Link } from 'react-router-dom';
import { formatDateTime } from '@/lib/utils/formatters';

interface AlternativeDataGridProps {
  data: any;
  isLoading: boolean;
  columnPreferences: any;
  onRowClick: (record: any) => void;
  onSort: (field: string, direction: string) => void;
  onPageChange: (page: number) => void;
}

export const AlternativeDataGrid = ({
  data,
  isLoading,
  columnPreferences,
  onRowClick,
  onPageChange,
}: AlternativeDataGridProps) => {
  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="spinner"></div>
      </div>
    );
  }

  if (!data || !data.data || data.data.length === 0) {
    return (
      <div className="card text-center py-12">
        <p className="text-neutral-500">No records found. Try adjusting your filters.</p>
      </div>
    );
  }

  const visibleColumns = columnPreferences?.columns || [
    'clientName',
    'accountNumber',
    'fundFamily',
    'assetDescription',
    'status',
  ];

  return (
    <div className="space-y-4">
      <h3>Records ({data.pagination.totalElements})</h3>

      <div className="card p-0 overflow-x-auto">
        <table className="table">
          <thead>
            <tr>
              {visibleColumns.map((col: string) => (
                <th key={col}>{col.replace(/([A-Z])/g, ' $1').trim()}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.data.map((record: any) => (
              <tr key={record.id} onClick={() => onRowClick(record)}>
                {visibleColumns.map((col: string) => {
                  const value = record[col];

                  if (col === 'clientName' || col === 'accountNumber' || col === 'fundFamily') {
                    return (
                      <td key={col}>
                        <Link to="#" className="text-primary-blue hover:underline">
                          {value}
                        </Link>
                      </td>
                    );
                  }

                  if (col === 'status') {
                    return (
                      <td key={col}>
                        <span className={`badge badge-${value?.toLowerCase() || 'draft'}`}>
                          {value || '-'}
                        </span>
                      </td>
                    );
                  }

                  return <td key={col}>{value || '-'}</td>;
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {data.pagination.totalPages > 1 && (
        <div className="flex justify-center items-center gap-2">
          <button
            onClick={() => onPageChange(data.pagination.currentPage - 1)}
            disabled={data.pagination.currentPage === 0}
            className="btn btn-outline btn-sm disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Previous
          </button>
          <span className="text-sm text-neutral-600">
            Page {data.pagination.currentPage + 1} of {data.pagination.totalPages}
          </span>
          <button
            onClick={() => onPageChange(data.pagination.currentPage + 1)}
            disabled={data.pagination.currentPage >= data.pagination.totalPages - 1}
            className="btn btn-outline btn-sm disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
};
