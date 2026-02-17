import { useForm } from 'react-hook-form';
import { Search, RotateCcw } from 'lucide-react';

interface AlternativeDataFiltersProps {
  onSearch: (filters: any) => void;
  onReset: () => void;
}

export const AlternativeDataFilters = ({ onSearch, onReset }: AlternativeDataFiltersProps) => {
  const { register, handleSubmit, reset } = useForm({
    defaultValues: {
      clientName: '',
      accountNumber: '',
      fundFamily: '',
      status: '',
      fromDate: '',
      toDate: '',
    },
  });

  const handleReset = () => {
    reset();
    onReset();
  };

  return (
    <form
      onSubmit={handleSubmit((data) => {
        onSearch(data);
      })}
      className="card"
    >
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
        <div>
          <label className="form-label">Client Name</label>
          <input type="text" className="form-input" {...register('clientName')} />
        </div>

        <div>
          <label className="form-label">Account Number</label>
          <input type="text" className="form-input" {...register('accountNumber')} />
        </div>

        <div>
          <label className="form-label">Fund Family</label>
          <input type="text" className="form-input" {...register('fundFamily')} />
        </div>

        <div>
          <label className="form-label">Status</label>
          <select className="form-input" {...register('status')}>
            <option value="">All Statuses</option>
            <option value="DRAFT">Draft</option>
            <option value="VALIDATED">Validated</option>
            <option value="PUBLISHED">Published</option>
            <option value="ARCHIVED">Archived</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
        <div>
          <label className="form-label">From Date</label>
          <input type="date" className="form-input" {...register('fromDate')} />
        </div>

        <div>
          <label className="form-label">To Date</label>
          <input type="date" className="form-input" {...register('toDate')} />
        </div>
      </div>

      <div className="flex gap-2">
        <button type="submit" className="btn btn-primary flex items-center gap-2">
          <Search className="w-4 h-4" />
          Search
        </button>
        <button type="button" className="btn btn-outline flex items-center gap-2" onClick={handleReset}>
          <RotateCcw className="w-4 h-4" />
          Reset
        </button>
      </div>
    </form>
  );
};
