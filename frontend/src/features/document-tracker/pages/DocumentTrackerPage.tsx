import { useNavigate } from 'react-router-dom';
import { useDocumentSearch } from '../hooks/useDocumentSearch';
import { DocumentTrackerFilters } from '../components/DocumentTrackerFilters';
import { DocumentTrackerGrid } from '../components/DocumentTrackerGrid';
import { useDocumentExport } from '../hooks/useDocumentSearch';
import { useAuth } from '@/app/providers/AuthProvider';

export default function DocumentTrackerPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const {
    data,
    isLoading,
    error,
    searchParams,
    handleSearch,
    handlePageChange,
    handleSort,
    handleReset,
    refetch,
  } = useDocumentSearch();

  const { mutate: exportData, isPending: isExporting } = useDocumentExport();

  const handleRowClick = (doc: any) => {
    navigate(`/document-tracker/${doc.genId}`);
  };

  const handleExport = () => {
    exportData(searchParams);
  };

  if (error) {
    return (
      <div className="space-y-6">
        <h1>Document Tracker</h1>
        <div className="alert alert-error">
          <p>
            Failed to load documents. {error instanceof Error && error.message}
          </p>
          <button onClick={() => refetch()} className="btn btn-secondary btn-sm mt-2">
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1>Document Tracker</h1>
          <p className="text-neutral-600 text-sm mt-1">
            Manage and track document processing workflow
          </p>
        </div>
        <div className="text-right text-sm text-neutral-600">
          <p>Logged in as: <strong>{user?.username}</strong></p>
        </div>
      </div>

      <DocumentTrackerFilters
        onSearch={handleSearch}
        onReset={handleReset}
        isLoading={isLoading}
      />

      <DocumentTrackerGrid
        data={data}
        isLoading={isLoading}
        onRowClick={handleRowClick}
        onSort={handleSort}
        onPageChange={handlePageChange}
        onExport={handleExport}
        isExporting={isExporting}
      />
    </div>
  );
}
