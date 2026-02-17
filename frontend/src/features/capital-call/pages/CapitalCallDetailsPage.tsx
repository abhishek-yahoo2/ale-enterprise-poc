import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { ChevronLeft, Edit, Save, Send, CheckCircle, FileDown } from 'lucide-react';
import { useCapitalCallDetails, useUpdateCapitalCall, useSubmitCapitalCall, useApproveCapitalCall } from '../hooks/useCapitalCallSearch';
import { formatCurrency, formatDateTime } from '@/lib/utils/formatters';
import { BreakdownCategory, WorkflowStatus } from '@/types/api';
import CommentsSection from '../components/CommentsSection';
import BreakdownSection from '../components/BreakdownSection';
import EditModeToggle from '../components/EditModeToggle';

const capitalCallSchema = z.object({
  aleBatchId: z.string().regex(/^ALE-\d{6}$/, 'Invalid batch ID format'),
  totalAmount: z.number().min(0.01, 'Amount must be greater than 0'),
  breakdowns: z.array(
    z.object({
      category: z.nativeEnum(BreakdownCategory),
      percentage: z.number().min(0).max(100),
    })
  ),
});

type CapitalCallForm = z.infer<typeof capitalCallSchema>;

export default function CapitalCallDetailsPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const numId = id ? parseInt(id) : null;

  const { data, isLoading } = useCapitalCallDetails(numId);
  const { mutate: updateCC } = useUpdateCapitalCall();
  const { mutate: submitCC } = useSubmitCapitalCall();
  const { mutate: approveCC } = useApproveCapitalCall();

  const [isEditMode, setIsEditMode] = useState(false);
  const [totalPercentage, setTotalPercentage] = useState(0);

  const {
    register,
    handleSubmit,
    control,
    watch,
    formState: { errors, isDirty },
    reset,
  } = useForm<CapitalCallForm>({
    resolver: zodResolver(capitalCallSchema),
  });

  useEffect(() => {
    if (data) {
      reset({
        aleBatchId: data.aleBatchId,
        totalAmount: data.totalAmount,
        breakdowns: data.breakdowns || [],
      });
    }
  }, [data, reset]);

  const breakdowns = watch('breakdowns');
  const totalAmount = watch('totalAmount');

  useEffect(() => {
    if (breakdowns) {
      const total = breakdowns.reduce((sum: number, b: any) => sum + (b.percentage || 0), 0);
      setTotalPercentage(total);
    }
  }, [breakdowns]);

  const onSubmit = (formData: CapitalCallForm) => {
    if (numId) {
      updateCC(
        { id: numId, request: formData as any },
        {
          onSuccess: () => {
            setIsEditMode(false);
          },
        }
      );
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="spinner"></div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="alert alert-error">
        <p>Capital call not found.</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <button
        type="button"
        onClick={() => navigate('/capital-call')}
        className="flex items-center gap-2 text-primary-blue hover:underline"
      >
        <ChevronLeft className="w-4 h-4" />
        Back to Capital Calls
      </button>

      <div className="flex justify-between items-center">
        <h1>Capital Call Details</h1>

        <div className="flex gap-2">
          {!isEditMode && (
            <button type="button" onClick={() => setIsEditMode(true)} className="btn btn-primary flex items-center gap-2">
              <Edit className="w-4 h-4" />
              Edit
            </button>
          )}

          {isEditMode && (
            <>
              <button type="submit" className="btn btn-primary flex items-center gap-2" disabled={!isDirty}>
                <Save className="w-4 h-4" />
                Save
              </button>
              <button
                type="button"
                onClick={() => setIsEditMode(false)}
                className="btn btn-outline"
              >
                Cancel
              </button>
            </>
          )}

          {!isEditMode && data.workflowStatus === WorkflowStatus.DRAFT && (
            <button
              type="button"
              onClick={() => submitCC(numId!)}
              className="btn btn-primary flex items-center gap-2"
            >
              <Send className="w-4 h-4" />
              Submit
            </button>
          )}

          {!isEditMode && data.workflowStatus === WorkflowStatus.SUBMITTED && (
            <button
              type="button"
              onClick={() => approveCC(numId!)}
              className="btn btn-success flex items-center gap-2"
            >
              <CheckCircle className="w-4 h-4" />
              Approve
            </button>
          )}
        </div>
      </div>

      {/* Basic Information Card */}
      <div className="card">
        <div className="card-header">
          <h2>Basic Information</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="form-label">ALE Batch ID</label>
            <input
              type="text"
              className="form-input"
              {...register('aleBatchId')}
              disabled={!isEditMode}
            />
            {errors.aleBatchId && <p className="form-error">{errors.aleBatchId.message}</p>}
          </div>

          <div>
            <label className="form-label">Client Name</label>
            <input type="text" className="form-input" value={data.clientName} disabled />
          </div>

          <div>
            <label className="form-label">Total Amount</label>
            <input
              type="number"
              step="0.01"
              className="form-input"
              {...register('totalAmount', { valueAsNumber: true })}
              disabled={!isEditMode}
            />
            {errors.totalAmount && <p className="form-error">{errors.totalAmount.message}</p>}
          </div>

          <div>
            <label className="form-label">Status</label>
            <div className={`badge badge-${data.workflowStatus.toLowerCase()}`}>
              {data.workflowStatus}
            </div>
          </div>
        </div>
      </div>

      {/* Breakdowns Card */}
      <div className="card">
        <div className="card-header">
          <h2>Breakdown Allocation</h2>
        </div>

        <div className="overflow-x-auto">
          <table className="table">
            <thead>
              <tr>
                <th>Category</th>
                <th>Percentage (%)</th>
                <th>Amount</th>
              </tr>
            </thead>
            <tbody>
              {breakdowns && breakdowns.length > 0 ? (
                breakdowns.map((breakdown: any, idx: number) => (
                  <tr key={idx}>
                    <td>
                      <select
                        className="form-input"
                        {...register(`breakdowns.${idx}.category`)}
                        disabled={!isEditMode}
                      >
                        {Object.values(BreakdownCategory).map((cat) => (
                          <option key={cat} value={cat}>
                            {cat.replace(/_/g, ' ')}
                          </option>
                        ))}
                      </select>
                    </td>
                    <td>
                      <input
                        type="number"
                        step="0.01"
                        min="0"
                        max="100"
                        className="form-input"
                        {...register(`breakdowns.${idx}.percentage`, { valueAsNumber: true })}
                        disabled={!isEditMode}
                      />
                    </td>
                    <td className="font-semibold">
                      {formatCurrency((totalAmount * (breakdown?.percentage || 0)) / 100)}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={3} className="text-center text-neutral-500 py-4">
                    No breakdowns
                  </td>
                </tr>
              )}
            </tbody>
            <tfoot>
              <tr className="bg-neutral-100 font-semibold">
                <td>Total</td>
                <td className={totalPercentage > 100 ? 'text-red-600' : ''}>
                  {totalPercentage.toFixed(2)}%
                  {totalPercentage > 100 && ' (Exceeds 100%)'}
                </td>
                <td>{formatCurrency(totalAmount)}</td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>
      <div>
  <EditModeToggle 
    isEditMode={isEditMode}
    onToggle={() => setIsEditMode((prev) => !prev)}
  />
  <BreakdownSection  
    control={control}
    errors={errors}
  />
  <CommentsSection 
    comments={data.comments}  
    onAddComment={(content) => {
      // Handle adding comment (e.g., call API, then refetch details)
    }}  
  />
</div>
    </form>
  );
}
