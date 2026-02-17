import { useParams, useNavigate } from 'react-router-dom';
import { useDocumentDetails } from '../hooks/useDocumentSearch';
import { ChevronLeft, AlertCircle, CheckCircle, AlertTriangle, Info } from 'lucide-react';
import { formatDateTime } from '@/lib/utils/formatters';

export default function DocumentDetailsPage() {
  const { genId } = useParams<{ genId: string }>();
  const navigate = useNavigate();
  const { data, isLoading, error, refetch } = useDocumentDetails(genId!);

  if (isLoading) {
    return (
      <div className="space-y-6">
        <button
          onClick={() => navigate('/document-tracker')}
          className="flex items-center gap-2 text-primary-blue hover:underline"
        >
          <ChevronLeft className="w-4 h-4" />
          Back to Documents
        </button>

        <div className="card flex flex-col items-center justify-center py-16">
          <div className="spinner mb-4"></div>
          <p className="text-neutral-600">Loading document details...</p>
        </div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="space-y-6">
        <button
          onClick={() => navigate('/document-tracker')}
          className="flex items-center gap-2 text-primary-blue hover:underline"
        >
          <ChevronLeft className="w-4 h-4" />
          Back to Documents
        </button>

        <div className="card border-2 border-red-500 bg-red-50">
          <div className="flex items-start gap-4">
            <AlertCircle className="w-6 h-6 text-red-600 flex-shrink-0 mt-1" />
            <div className="flex-1">
              <h3 className="font-semibold text-red-700 mb-2">Failed to Load Document</h3>
              <p className="text-neutral-700 mb-4">Unable to retrieve document details. Please try again.</p>
              <button
                onClick={() => refetch()}
                className="btn btn-secondary btn-sm"
              >
                Retry
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const severityIcons = {
    ERROR: <AlertCircle className="w-5 h-5 text-red-600" />,
    SUCCESS: <CheckCircle className="w-5 h-5 text-green-600" />,
    WARNING: <AlertTriangle className="w-5 h-5 text-yellow-600" />,
    INFO: <Info className="w-5 h-5 text-blue-600" />,
  };

  return (
    <div className="space-y-6">
      <button
        onClick={() => navigate('/document-tracker')}
        className="flex items-center gap-2 text-primary-blue hover:underline"
      >
        <ChevronLeft className="w-4 h-4" />
        Back to Documents
      </button>

      <div className="card">
        <div className="card-header">
          <h1>Document Details</h1>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div>
            <label className="form-label text-neutral-700 text-sm font-semibold">Gen ID</label>
            <p className="text-neutral-900 font-semibold text-lg">{data.genId}</p>
          </div>
          <div>
            <label className="form-label text-neutral-700 text-sm font-semibold">Document Type</label>
            <p className="text-neutral-900 text-lg">{data.documentType}</p>
          </div>
          <div>
            <label className="form-label text-neutral-700 text-sm font-semibold">Received At</label>
            <p className="text-neutral-900">{formatDateTime(data.receivedAt)}</p>
          </div>
        </div>
      </div>

      <div className="card">
        <div className="card-header">
          <h2 className="text-xl font-semibold">Sub Documents</h2>
          {data.subDocuments && data.subDocuments.length > 0 && (
            <span className="text-sm text-neutral-500">({data.subDocuments.length} items)</span>
          )}
        </div>

        {data.subDocuments && data.subDocuments.length > 0 ? (
          <div className="space-y-4">
            {data.subDocuments.map((subDoc) => {
              const severityColor =
                subDoc.severity === 'ERROR'
                  ? 'border-red-500 bg-red-50'
                  : subDoc.severity === 'SUCCESS'
                    ? 'border-green-500 bg-green-50'
                    : subDoc.severity === 'WARNING'
                      ? 'border-yellow-500 bg-yellow-50'
                      : 'border-blue-500 bg-blue-50';

              return (
                <div key={subDoc.id} className={`border-l-4 ${severityColor} p-5 rounded-lg flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4`}>
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-3">
                      {severityIcons[subDoc.severity as keyof typeof severityIcons]}
                      <div className="flex-1">
                        <h4 className="font-semibold text-neutral-900">{subDoc.subId}</h4>
                        <span className={`inline-block badge badge-${subDoc.status.toLowerCase()}`}>
                          {subDoc.status.replace(/_/g, ' ')}
                        </span>
                      </div>
                    </div>

                    <p className="text-sm text-neutral-700 mb-3 line-clamp-2">{subDoc.statusMessage}</p>

                    <p className="text-xs text-neutral-500">
                      Processed: {formatDateTime(subDoc.processedAt)}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-12">
            <AlertCircle className="w-12 h-12 text-neutral-400 mx-auto mb-3" />
            <p className="text-neutral-500 font-medium">No sub documents found</p>
            <p className="text-neutral-400 text-sm mt-1">This document has no sub-documents to display.</p>
          </div>
        )}
      </div>
    </div>
  );
}
