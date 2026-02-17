/**
 * COPILOT: Capital Call data grid component
 * 
 * UI Requirements from mockup:
 * - Table with many columns (SLA, Notice Pay Date, Wire Pay Date, etc.)
 * - Row background colors:
 *   - Red (#FFE5E5 or similar) = isSensitive: true
 *   - Yellow (#FFF4E5 or similar) = hasAlert: true
 *   - White = normal
 * - Sortable columns (click header to sort)
 * - Row click to navigate to details page
 * - Pagination at bottom: "1 to 100 of 2573" with arrow buttons
 * - Lock icon shown if row is locked
 * - Click locked row shows lock dialog
 * 
 * Columns in order:
 * SLA | Notice Pay Date | Wire Pay Date | Instruction Type | Client Name | 
 * Asset Description | Account Id | Asset Id | Account Type | Currency | 
 * Amount | NT Tech | TOE Reference | ALE Batch Id | Status
 */

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/ModifiedTable';
import Button  from '@/components/ui/Button';
import { 
  ChevronLeft, 
  ChevronRight, 
  ChevronsLeft, 
  ChevronsRight, 
  Lock,
  ArrowUpDown,
  ArrowUp,
  ArrowDown
} from 'lucide-react';
import { useCapitalCallStore } from '../store/capitalCallStore';
import { useCapitalCall } from '../hooks/useCapitalCall';
import { useCapitalCallSearch } from '../hooks/useCapitalCallSearch';
import { LockDialog } from './LockDialog';
import { format } from 'date-fns';
import type { CapitalCall } from '../types';

export const CapitalCallGrid: React.FC = () => {
  const navigate = useNavigate();
  
  // State from store
  const currentPage = useCapitalCallStore((state) => state.currentPage);
  const pageSize = useCapitalCallStore((state) => state.pageSize);
  const sortField = useCapitalCallStore((state) => state.sortField);
  const sortDirection = useCapitalCallStore((state) => state.sortDirection);
  const setPage = useCapitalCallStore((state) => state.setPage);
  const setSort = useCapitalCallStore((state) => state.setSort);

  const { selectedTab, filters } = useCapitalCallStore( (state) => ({
    selectedTab: state.activeTab,
    filters: state.filters
  }));
  const {getByStatus,search} = useCapitalCall();
  const tabData = getByStatus(selectedTab);
//   const data = search(filters);
//   console.log("GRID DATA", data.then(res => console.log("SEARCH RESULT", res)));
  // Fetch data
//   const { data, isLoading, error } = useCapitalCallSearch();

// handle promise data from search  api from mock and set it to state
  const [data, setData] = useState<CapitalCall[] | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
    React.useEffect(() => {
        setIsLoading(true);
        search(filters)
            .then((result) => {
                console.log("SEARCH RESULT", result);
                setData(result);
                setIsLoading(false);
            })
            .catch((err) => {
                setError(err);
                setIsLoading(false);
            });
    }, [filters]);

  
  // Lock dialog state
  const [lockDialogOpen, setLockDialogOpen] = useState(false);
  const [selectedLockedItem, setSelectedLockedItem] = useState<CapitalCall | null>(null);
  
  // Handle row click
  const handleRowClick = (capitalCall: CapitalCall) => {
    // If locked by another user, show lock dialog
    if (capitalCall.lockedBy) {
      setSelectedLockedItem(capitalCall);
      setLockDialogOpen(true);
      return;
    }
    
    // Navigate to details page
    navigate(`/accounting-cash/private-equity/capital-call/${capitalCall.id}`);
  };
  
  // Handle column sort
  const handleSort = (field: string) => {
    if (sortField === field) {
      // Toggle direction
      const newDirection = sortDirection === 'ASC' ? 'DESC' : 'ASC';
      setSort(field, newDirection);
    } else {
      // New field, default to ASC
      setSort(field, 'ASC');
    }
  };
  
  // Get sort icon for column
  const getSortIcon = (field: string) => {
    if (sortField !== field) return <ArrowUpDown className="h-4 w-4 ml-1 inline" />;
    return sortDirection === 'ASC' 
      ? <ArrowUp className="h-4 w-4 ml-1 inline text-teal-600" />
      : <ArrowDown className="h-4 w-4 ml-1 inline text-teal-600" />;
  };
  
  // Get row background color class
  const getRowClassName = (capitalCall: CapitalCall): string => {
    if (capitalCall.isSensitive) return 'bg-red-100 hover:bg-red-200';
    if (capitalCall.hasAlert) return 'bg-yellow-100 hover:bg-yellow-200';
    return 'hover:bg-gray-50';
  };
  
  // Format date from ISO string
  const formatDate = (dateString: string | null): string => {
    if (!dateString) return '-';
    try {
      return format(new Date(dateString), 'MM/dd/yyyy');
    } catch {
      return dateString;
    }
  };
  
  // Format currency amount
  const formatAmount = (amount: number): string => {
    return new Intl.NumberFormat('en-US', {
      style: 'decimal',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(amount);
  };
  
  // Pagination calculations
  console.log("DATA", data);
  const totalPages = data?.pagination.totalPages || 0;
  const totalElements = data?.pagination.totalElements || 0;
  const startItem = currentPage * pageSize + 1;
  const endItem = Math.min((currentPage + 1) * pageSize, totalElements);
  
  const canGoPrevious = currentPage > 0;
  const canGoNext = currentPage < totalPages - 1;
  
  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading capital calls...</p>
        </div>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
        <p className="text-red-800 font-semibold mb-2">Error loading data</p>
        <p className="text-red-600 text-sm">{(error as Error).message}</p>
      </div>
    );
  }
  
  if (!data?.data?.length) {
    return (
      <div className="bg-gray-50 border border-gray-200 rounded-lg p-12 text-center">
        <p className="text-gray-600 text-lg">No capital calls found</p>
        <p className="text-gray-500 text-sm mt-2">Try adjusting your filters</p>
      </div>
    );
  }
  
  return (
    <div className="space-y-4">
      {/* Table wrapper with horizontal scroll */}
      <div className="border rounded-lg overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow className="bg-gray-50">
              <TableHead className="w-12"></TableHead> {/* Lock icon column */}
              
              <TableHead 
                className="cursor-pointer whitespace-nowrap"
                onClick={() => handleSort('sla')}
              >
                SLA {getSortIcon('sla')}
              </TableHead>
              
              <TableHead 
                className="cursor-pointer whitespace-nowrap"
                onClick={() => handleSort('noticePayDate')}
              >
                Notice Pay Date {getSortIcon('noticePayDate')}
              </TableHead>
              
              <TableHead 
                className="cursor-pointer whitespace-nowrap"
                onClick={() => handleSort('wirePayDate')}
              >
                Wire Pay Date {getSortIcon('wirePayDate')}
              </TableHead>
              
              <TableHead 
                className="cursor-pointer whitespace-nowrap"
                onClick={() => handleSort('instructionType')}
              >
                Instruction Type {getSortIcon('instructionType')}
              </TableHead>
              
              <TableHead 
                className="cursor-pointer whitespace-nowrap"
                onClick={() => handleSort('clientName')}
              >
                Client Name {getSortIcon('clientName')}
              </TableHead>
              
              <TableHead 
                className="cursor-pointer whitespace-nowrap"
                onClick={() => handleSort('assetDescription')}
              >
                Asset Description {getSortIcon('assetDescription')}
              </TableHead>
              
              <TableHead 
                className="cursor-pointer whitespace-nowrap"
                onClick={() => handleSort('accountId')}
              >
                Account Id {getSortIcon('accountId')}
              </TableHead>
              
              <TableHead 
                className="cursor-pointer whitespace-nowrap"
                onClick={() => handleSort('assetId')}
              >
                Asset Id {getSortIcon('assetId')}
              </TableHead>
              
              <TableHead 
                className="cursor-pointer whitespace-nowrap"
                onClick={() => handleSort('accountType')}
              >
                Account Type {getSortIcon('accountType')}
              </TableHead>
              
              <TableHead 
                className="cursor-pointer whitespace-nowrap"
                onClick={() => handleSort('currency')}
              >
                Currency {getSortIcon('currency')}
              </TableHead>
              
              <TableHead 
                className="cursor-pointer whitespace-nowrap text-right"
                onClick={() => handleSort('amount')}
              >
                Amount {getSortIcon('amount')}
              </TableHead>
              
              <TableHead 
                className="cursor-pointer whitespace-nowrap"
                onClick={() => handleSort('ntTech')}
              >
                NT Tech {getSortIcon('ntTech')}
              </TableHead>
              
              <TableHead 
                className="cursor-pointer whitespace-nowrap"
                onClick={() => handleSort('toeReference')}
              >
                TOE Reference {getSortIcon('toeReference')}
              </TableHead>
              
              <TableHead 
                className="cursor-pointer whitespace-nowrap"
                onClick={() => handleSort('aleBatchId')}
              >
                ALE Batch Id {getSortIcon('aleBatchId')}
              </TableHead>
              
              <TableHead 
                className="cursor-pointer whitespace-nowrap"
                onClick={() => handleSort('status')}
              >
                Status {getSortIcon('status')}
              </TableHead>
            </TableRow>
          </TableHeader>
          
          <TableBody>
            {data.data.map((capitalCall: CapitalCall) => (
              <TableRow
                key={capitalCall.id}
                className={`cursor-pointer transition-colors ${getRowClassName(capitalCall)}`}
                onClick={() => handleRowClick(capitalCall)}
              >
                {/* Lock icon column */}
                <TableCell className="text-center">
                  {capitalCall.lockedBy && (
                    <Lock className="h-4 w-4 text-red-600 inline" />
                  )}
                </TableCell>
                
                <TableCell className="font-medium">{capitalCall.sla}</TableCell>
                <TableCell>{formatDate(capitalCall.noticePayDate)}</TableCell>
                <TableCell>{formatDate(capitalCall.wirePayDate)}</TableCell>
                <TableCell>{capitalCall.instructionType}</TableCell>
                <TableCell className="font-medium">{capitalCall.clientName}</TableCell>
                <TableCell>{capitalCall.assetDescription}</TableCell>
                <TableCell>{capitalCall.accountId}</TableCell>
                <TableCell>{capitalCall.assetId}</TableCell>
                <TableCell>{capitalCall.accountType}</TableCell>
                <TableCell>{capitalCall.currency}</TableCell>
                <TableCell className="text-right font-mono">
                  {formatAmount(capitalCall.amount)}
                </TableCell>
                <TableCell>{capitalCall.ntTech}</TableCell>
                <TableCell>{capitalCall.toeReference}</TableCell>
                <TableCell className="font-mono text-sm">
                  {capitalCall.aleBatchId}
                </TableCell>
                <TableCell>{capitalCall.status}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      
      {/* Pagination */}
      <div className="flex items-center justify-between px-2">
        <div className="text-sm text-gray-600">
          {startItem} to {endItem} of {totalElements.toLocaleString()}
        </div>
        
        <div className="flex items-center gap-2">
          {/* First page */}
          <Button
            variant="outline"
            size="small"
            onClick={() => setPage(0)}
            disabled={!canGoPrevious}
          >
            <ChevronsLeft className="h-4 w-4" />
          </Button>
          
          {/* Previous page */}
          <Button
            variant="outline"
            size="small"
            onClick={() => setPage(currentPage - 1)}
            disabled={!canGoPrevious}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          
          {/* Page indicator */}
          <div className="text-sm text-gray-600 min-w-[100px] text-center">
            Page {currentPage + 1} of {totalPages}
          </div>
          
          {/* Next page */}
          <Button
            variant="outline"
            size="small"
            onClick={() => setPage(currentPage + 1)}
            disabled={!canGoNext}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
          
          {/* Last page */}
          <Button
            variant="outline"
            size="small"
            onClick={() => setPage(totalPages - 1)}
            disabled={!canGoNext}
          >
            <ChevronsRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
      
      {/* Lock Dialog */}
      <LockDialog
        open={lockDialogOpen}
        onClose={() => {
          setLockDialogOpen(false);
          setSelectedLockedItem(null);
        }}
        capitalCall={selectedLockedItem}
      />
    </div>
  );
};