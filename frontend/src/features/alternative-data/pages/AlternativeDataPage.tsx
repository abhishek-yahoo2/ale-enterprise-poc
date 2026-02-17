import { useNavigate } from 'react-router-dom';
import { useAlternativeDataSearch, useColumnPreferences } from '../hooks/useAlternativeDataSearch';
import { AlternativeDataFilters } from '../components/AlternativeDataFilters';
import { AlternativeDataGrid } from '../components/AlternativeDataGrid';

export default function AlternativeDataPage() {
  const navigate = useNavigate();
  const {
    data,
    isLoading,
    error,
    searchParams,
    handleSearch,
    handlePageChange,
    handleSort,
    handleReset,
  } = useAlternativeDataSearch();
  const { data: columnPrefs } = useColumnPreferences();

  const handleRowClick = (record: any) => {
    // Navigate to details if needed
  };

  if (error) {
    return (
      <div className="alert alert-error">
        <p>Failed to load alternative data.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1>Alternative Data Management</h1>
      </div>

      <AlternativeDataFilters onSearch={handleSearch} onReset={handleReset} />

      <AlternativeDataGrid
        data={data}
        isLoading={isLoading}
        columnPreferences={columnPrefs}
        onRowClick={handleRowClick}
        onSort={handleSort}
        onPageChange={handlePageChange}
      />
    </div>
  );
}
