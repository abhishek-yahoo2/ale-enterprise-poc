import { useState, useMemo } from "react";
import { FileDown, ChevronUp, ChevronDown, AlertCircle } from "lucide-react";
import { formatDateTime } from "@/lib/utils/formatters";

interface DocumentTrackerGridProps {
  data: any;
  isLoading: boolean;
  onRowClick: (doc: any) => void;
  onSort: (field: string, direction: string) => void;
  onPageChange: (page: number) => void;
  onExport: () => void;
  isExporting?: boolean;
}

type SortField = "genId" | "documentType" | "receivedAt" | "createdBy" | null;
type SortDirection = "ASC" | "DESC";

export const DocumentTrackerGrid = ({
  data,
  isLoading,
  onRowClick,
  onSort,
  onPageChange,
  onExport,
  isExporting = false,
}: DocumentTrackerGridProps) => {
  const [sortConfig, setSortConfig] = useState<{
    field: SortField;
    direction: SortDirection;
  } | null>(null);

  const handleSort = (field: SortField) => {
    let direction: SortDirection = "ASC";

    if (sortConfig?.field === field && sortConfig.direction === "ASC") {
      direction = "DESC";
    }

    setSortConfig({ field, direction });
    if (field) {
      onSort(field, direction);
    }
  };

  const getSortIcon = (field: SortField) => {
    if (sortConfig?.field !== field) {
      return <div className="w-4 h-4 opacity-30" />;
    }
    return sortConfig.direction === "ASC" ? (
      <ChevronUp className="w-4 h-4 text-primary-blue" />
    ) : (
      <ChevronDown className="w-4 h-4 text-primary-blue" />
    );
  };

  if (isLoading) {
    return (
      <div className="card flex flex-col items-center justify-center py-16">
        <div className="spinner mb-4"></div>
        <p className="text-neutral-600">Loading documents...</p>
      </div>
    );
  }

  if (!data || !data.data || data.data.length === 0) {
    return (
      <div className="card text-center py-16">
        <AlertCircle className="w-12 h-12 text-neutral-400 mx-auto mb-4" />
        <p className="text-neutral-600 text-lg">No documents found</p>
        <p className="text-neutral-500 text-sm mt-2">
          Try adjusting your filters or search criteria
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-lg font-semibold">Documents</h3>
          <p className="text-sm text-neutral-600">
            Total: <strong>{data.pagination.totalElements}</strong> • Page{" "}
            {data.pagination.currentPage + 1} of {data.pagination.totalPages}
          </p>
        </div>
        <button
          onClick={onExport}
          disabled={isExporting}
          className="btn btn-secondary flex items-center gap-2"
        >
          {isExporting ? (
            <>
              <div className="spinner"></div>
              Exporting...
            </>
          ) : (
            <>
              <FileDown className="w-4 h-4" />
              Export
            </>
          )}
        </button>
      </div>

      {/* Table */}
      <div className="card p-0 overflow-x-auto">
        <table className="table">
          <thead>
            <tr>
              <th>
                <div className="flex items-center justify-between">
                  Document Date
                  {getSortIcon("documentDate")}
                </div>
              </th>
              <th>
                <div className="flex items-center justify-between">
                  Client Name
                  {getSortIcon("clientName")}
                </div>
              </th>
              <th>
                <div className="flex items-center justify-between">
                  ALEGenID
                  {getSortIcon("genId")}
                </div>
              </th>
              <th>
                <div className="flex items-center justify-between">
                  Account Number
                  {getSortIcon("accountNumber")}
                </div>
              </th>
              <th>
                <div className="flex items-center justify-between">
                  Security Number
                  {getSortIcon("securityNumber")}
                </div>
              </th>
              <th>
                <div className="flex items-center justify-between">
                  Document Name
                  {getSortIcon("documentName")}
                </div>
              </th>
              <th>
                <div className="flex items-center justify-between">
                  Status
                  {getSortIcon("status")}
                </div>
              </th>

              <th>
                <div className="flex items-center justify-between">
                  Current Location
                  {getSortIcon("currentLocation")}
                </div>
              </th>
              <th>
                <div className="flex items-center justify-between">
                  Business Unit
                  {getSortIcon("businessUnit")}
                </div>
              </th>
              <th>
                <div className="flex items-center justify-between">
                  Link
                  {getSortIcon("link")}
                </div>
              </th>
            </tr>
          </thead>
          <tbody>
            {data.data.map((doc: any) => (
              <tr
                key={doc.id}
                className="cursor-pointer hover:bg-neutral-50"
                onClick={() => onRowClick(doc)}
              >
                <td>{formatDateTime(doc.documentDate)}</td>
                <td>{doc.clientName}</td>
                <td className="text-primary-blue hover:underline font-medium">
                  {doc.genId}
                </td>
                <td>{doc.accountNumber}</td>
                <td>{doc.securityNumber}</td>
                <td>{doc.documentName}</td>
                <td>{doc.status}</td>
                <td>{doc.currentLocation}</td>
                <td>{doc.businessUnit}</td>
                <td>{doc.link}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Improved Pagination */}
      {data.pagination.totalPages > 1 && (
        <div className="card bg-neutral-50">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
            <div className="text-sm text-neutral-600">
              Showing{" "}
              <strong>
                {data.pagination.currentPage * data.pagination.pageSize + 1}-
                {Math.min(
                  (data.pagination.currentPage + 1) * data.pagination.pageSize,
                  data.pagination.totalElements,
                )}
              </strong>{" "}
              of <strong>{data.pagination.totalElements}</strong> documents
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() =>
                  onPageChange(Math.max(0, data.pagination.currentPage - 1))
                }
                disabled={data.pagination.currentPage === 0}
                className="btn btn-outline btn-sm disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Previous
              </button>

              <div className="flex items-center gap-1">
                {Array.from({ length: data.pagination.totalPages }).map(
                  (_, idx) => {
                    const isActive = idx === data.pagination.currentPage;
                    const isVisible =
                      idx < 3 ||
                      idx > data.pagination.totalPages - 3 ||
                      (idx >= data.pagination.currentPage - 1 &&
                        idx <= data.pagination.currentPage + 1);

                    if (!isVisible) {
                      if (idx === 3) return <span key="ellipsis">....</span>;
                      return null;
                    }

                    return (
                      <button
                        key={idx}
                        onClick={() => onPageChange(idx)}
                        className={`w-8 h-8 rounded text-sm font-medium transition ${
                          isActive
                            ? "bg-primary-blue text-white"
                            : "bg-neutral-100 hover:bg-neutral-200"
                        }`}
                      >
                        {idx + 1}
                      </button>
                    );
                  },
                )}
              </div>

              <button
                onClick={() =>
                  onPageChange(
                    Math.min(
                      data.pagination.totalPages - 1,
                      data.pagination.currentPage + 1,
                    ),
                  )
                }
                disabled={
                  data.pagination.currentPage >= data.pagination.totalPages - 1
                }
                className="btn btn-outline btn-sm disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Next
              </button>
            </div>

            <div className="text-sm text-neutral-600">
              Page <strong>{data.pagination.currentPage + 1}</strong> of{" "}
              <strong>{data.pagination.totalPages}</strong>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
