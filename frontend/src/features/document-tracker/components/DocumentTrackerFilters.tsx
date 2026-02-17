import { useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Search, RotateCcw, Settings } from 'lucide-react';
import type { DocumentTrackerFiltersType } from '../schemas/filterSchema';
import { documentTrackerFilterSchema } from '../schemas/filterSchema';
import { AdvancedSearchDialog } from './AdvancedSearchDialog';
import { toast } from 'sonner';

interface DocumentTrackerFiltersProps {
  onSearch: (filters: any) => void;
  onReset: () => void;
  isLoading?: boolean;
}

export const DocumentTrackerFilters = ({
  onSearch,
  onReset,
  isLoading = false,
}: DocumentTrackerFiltersProps) => {
  const [showAdvancedSearch, setShowAdvancedSearch] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
    control,
  } = useForm<DocumentTrackerFiltersType>({
    resolver: zodResolver(documentTrackerFilterSchema),
    defaultValues: {
      genId: '',
      documentType: '',
      fromDate: '',
      toDate: '',
    },
  });

  const handleReset = () => {
    reset();
    onReset();
    toast.success('Filters reset');
  };

  const onSubmit = (data: DocumentTrackerFiltersType) => {
    onSearch(data);
  };

  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)} className="card">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold">Search & Filter</h3>
          <button
            type="button"
            onClick={() => setShowAdvancedSearch(true)}
            className="btn btn-secondary btn-sm flex items-center gap-2"
          >
            <Settings className="w-4 h-4" />
            Advanced
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
          <div>
            <label className="form-label">Gen ID</label>
            <input
              type="text"
              placeholder="GEN12345678"
              className={`form-input ${errors.genId ? 'border-error' : ''}`}
              disabled={isLoading}
              {...register('genId')}
            />
            {errors.genId && (
              <p className="form-error">{errors.genId.message}</p>
            )}
          </div>

          <div>
            <label className="form-label">Document Type</label>
            <select
              className="form-input"
              disabled={isLoading}
              {...register('documentType')}
            >
              <option value="">All Types</option>
              <option value="TYPE1">Type 1</option>
              <option value="TYPE2">Type 2</option>
              <option value="TYPE3">Type 3</option>
            </select>
          </div>

          <div>
            <label className="form-label">From Date</label>
            <input
              type="date"
              className={`form-input ${errors.fromDate ? 'border-error' : ''}`}
              disabled={isLoading}
              {...register('fromDate')}
            />
            {errors.fromDate && (
              <p className="form-error">{errors.fromDate.message}</p>
            )}
          </div>

          <div>
            <label className="form-label">To Date</label>
            <input
              type="date"
              className={`form-input ${errors.toDate ? 'border-error' : ''}`}
              disabled={isLoading}
              {...register('toDate')}
            />
            {errors.toDate && (
              <p className="form-error">{errors.toDate.message}</p>
            )}
          </div>
        </div>

        {Object.keys(errors).length > 0 && (
          <div className="alert alert-error mb-4">
            <p>Please fix the errors above before searching.</p>
          </div>
        )}

        <div className="flex gap-2">
          <button
            type="submit"
            className="btn btn-primary flex items-center gap-2"
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <div className="spinner"></div>
                Searching...
              </>
            ) : (
              <>
                <Search className="w-4 h-4" />
                Search
              </>
            )}
          </button>
          <button
            type="button"
            className="btn btn-outline flex items-center gap-2"
            onClick={handleReset}
            disabled={isLoading}
          >
            <RotateCcw className="w-4 h-4" />
            Reset
          </button>
        </div>
      </form>

      <AdvancedSearchDialog
        open={showAdvancedSearch}
        onClose={() => setShowAdvancedSearch(false)}
        onSearch={(filters) => {
          onSearch(filters);
          setShowAdvancedSearch(false);
        }}
      />
    </>
  );
};
