import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { X } from 'lucide-react';
import { advancedSearchSchema } from '../schemas/filterSchema';
import type { AdvancedSearchFilters } from '../schemas/filterSchema';

interface AdvancedSearchDialogProps {
  open: boolean;
  onClose: () => void;
  onSearch: (filters: AdvancedSearchFilters) => void;
}

export const AdvancedSearchDialog = ({
  open,
  onClose,
  onSearch,
}: AdvancedSearchDialogProps) => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<AdvancedSearchFilters>({
    resolver: zodResolver(advancedSearchSchema),
  });

  const onSubmit = (data: AdvancedSearchFilters) => {
    onSearch(data);
    reset();
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b border-neutral-200 sticky top-0 bg-white">
          <h2 className="text-xl font-semibold">Advanced Search</h2>
          <button
            onClick={onClose}
            className="p-1 hover:bg-neutral-100 rounded-lg transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="form-label">Gen ID</label>
              <input
                type="text"
                placeholder="GEN12345678"
                className={`form-input ${errors.genId ? 'border-error' : ''}`}
                {...register('genId')}
              />
              {errors.genId && (
                <p className="form-error">{errors.genId.message}</p>
              )}
            </div>

            <div>
              <label className="form-label">Document Type</label>
              <select className="form-input" {...register('documentType')}>
                <option value="">All Types</option>
                <option value="TYPE1">Type 1</option>
                <option value="TYPE2">Type 2</option>
              </select>
            </div>

            <div>
              <label className="form-label">Created By</label>
              <input
                type="text"
                placeholder="Username"
                className="form-input"
                {...register('createdBy')}
              />
            </div>

            <div>
              <label className="form-label">Status</label>
              <select className="form-input" {...register('status')}>
                <option value="">All Statuses</option>
                <option value="PROCESS_FAILED">Process Failed</option>
                <option value="PROCESS_COMPLETED">Process Completed</option>
                <option value="IN_PROGRESS">In Progress</option>
              </select>
            </div>

            <div>
              <label className="form-label">From Date</label>
              <input
                type="date"
                className={`form-input ${errors.fromDate ? 'border-error' : ''}`}
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
                {...register('toDate')}
              />
              {errors.toDate && (
                <p className="form-error">{errors.toDate.message}</p>
              )}
            </div>

            <div>
              <label className="form-label">Severity</label>
              <select className="form-input" {...register('severity')}>
                <option value="">All Severities</option>
                <option value="ERROR">Error</option>
                <option value="SUCCESS">Success</option>
                <option value="WARNING">Warning</option>
                <option value="INFO">Info</option>
              </select>
            </div>
          </div>

          {Object.keys(errors).length > 0 && (
            <div className="alert alert-error">
              <p>Please fix the errors above before searching.</p>
            </div>
          )}

          {/* Footer */}
          <div className="flex gap-2 justify-end pt-4 border-t border-neutral-200">
            <button
              type="button"
              onClick={onClose}
              className="btn btn-outline"
            >
              Cancel
            </button>
            <button type="submit" className="btn btn-primary">
              Search
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
