/**
 * COPILOT: Capital Call filter panel component
 * 
 * UI Requirements from mockup:
 * - 3 rows of filters in a collapsible panel
 * - Conditional visibility: Hide "Day Type" when fromDate OR toDate OR aleBatchId present
 * - Action buttons: SEARCH, RESET, Export (Excel icon), REFRESH
 * - Filters persist when switching tabs
 * - All filter values come from and update Zustand store
 * 
 * Layout:
 * - Each row uses grid with multiple columns
 * - Responsive design
 * - Clear (X) buttons on some dropdowns
 */

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import  Button from '@/components/ui/Button';
import  Input  from '@/components/ui/Input';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/Select';
import  Calendar from '@/components/ui/Calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Search, RotateCcw, FileDown, RefreshCw, ChevronDown, ChevronUp, X } from 'lucide-react';
import { format } from 'date-fns';
import { useCapitalCallStore } from '../store/capitalCallStore';
import { useQueryClient } from '@tanstack/react-query';
import type { CapitalCallSearchFilters } from '../types';

export const CapitalCallFilters: React.FC = () => {
  const [isExpanded, setIsExpanded] = useState(true);
  
  // Get state from store
  const filters = useCapitalCallStore((state) => state.filters);
  const setFilters = useCapitalCallStore((state) => state.setFilters);
  const resetFilters = useCapitalCallStore((state) => state.resetFilters);
  
  const queryClient = useQueryClient();
  
  // Form management
  const { register, watch, setValue, reset, handleSubmit } = useForm<CapitalCallSearchFilters>({
    defaultValues: filters
  });
  
  // Watch fields for conditional visibility logic
  const fromDate = watch('fromDate');
  const toDate = watch('toDate');
  const aleBatchId = watch('aleBatchId');
  
  // US 2.2: Hide Day Type when fromDate OR toDate OR aleBatchId present
  const shouldHideDayType = !!(fromDate || toDate || aleBatchId);
  
  // Handle search button click
  const onSearch = (formData: CapitalCallSearchFilters) => {
    setFilters(formData);
  };
  
  // Handle reset button click
  const onReset = () => {
    reset({});
    resetFilters();
  };
  
  // Handle refresh button click
  const onRefresh = () => {
    queryClient.invalidateQueries({ queryKey: ['capital-calls'] });
  };
  
  // Handle export button click
  const onExport = async () => {
    // Implementation in next section
    console.log('Export clicked');
  };

  return (
    <div className="bg-white border rounded-lg shadow-sm mb-4">
      {/* Filter header with toggle */}
      <div 
        className="flex items-center justify-between p-4 cursor-pointer hover:bg-gray-50"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <h3 className="font-semibold text-lg">Filter</h3>
        {isExpanded ? <ChevronUp /> : <ChevronDown />}
      </div>
      
      {/* Filter form - collapsible */}
      {isExpanded && (
        <form onSubmit={handleSubmit(onSearch)} className="p-4 pt-0 space-y-4">
          
          {/* Row 1 */}
          <div className="grid grid-cols-7 gap-3">
            {/* Client Name */}
            <div>
              <label className="text-sm font-medium mb-1 block">Client Name</label>
              <Input label='' {...register('clientName')} placeholder="" />
            </div>
            
            {/* Account Id */}
            <div>
              <label className="text-sm font-medium mb-1 block">Account Id</label>
              <Input label='' {...register('accountId')} placeholder="" />
            </div>
            
            {/* Asset Id */}
            <div>
              <label className="text-sm font-medium mb-1 block">Asset Id</label>
              <Input {...register('assetId')} placeholder="" />
            </div>
            
            {/* Account Type - Dropdown */}
            <div>
              <label className="text-sm font-medium mb-1 block">Account Type</label>
              <Select
                value={watch('accountType') || ''}
                onValueChange={(value) => setValue('accountType', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="DV">DV</SelectItem>
                  <SelectItem value="SV">SV</SelectItem>
                  {/* Add more options based on backend */}
                </SelectContent>
              </Select>
            </div>
            
            {/* Due */}
            <div>
              <label className="text-sm font-medium mb-1 block">Due</label>
              <Input {...register('due')} placeholder="" />
            </div>
            
            {/* Instruction Type - Dropdown */}
            <div>
              <label className="text-sm font-medium mb-1 block">Instruction Type</label>
              <Select
                value={watch('instructionType') || ''}
                onValueChange={(value) => setValue('instructionType', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Type1">Type 1</SelectItem>
                  <SelectItem value="Type2">Type 2</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            {/* SLA - Dropdown with clear X */}
            <div>
              <label className="text-sm font-medium mb-1 block">SLA</label>
              <div className="relative">
                <Select
                  value={watch('sla') || ''}
                  onValueChange={(value) => setValue('sla', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="YES">YES</SelectItem>
                    <SelectItem value="NO">NO</SelectItem>
                  </SelectContent>
                </Select>
                {watch('sla') && (
                  <button
                    type="button"
                    onClick={() => setValue('sla', '')}
                    className="absolute right-8 top-1/2 -translate-y-1/2"
                  >
                    <X className="h-4 w-4 text-gray-400 hover:text-gray-600" />
                  </button>
                )}
              </div>
            </div>
          </div>
          
          {/* Row 2 */}
          <div className="grid grid-cols-7 gap-3">
            {/* Asset Description */}
            <div>
              <label className="text-sm font-medium mb-1 block">Asset Description</label>
              <Input {...register('assetDescription')} placeholder="" />
            </div>
            
            {/* Amount */}
            <div>
              <label className="text-sm font-medium mb-1 block">Amount</label>
              <Input 
                type="number" 
                step="0.01"
                {...register('amount', { valueAsNumber: true })} 
                placeholder="" 
              />
            </div>
            
            {/* Currency - Dropdown */}
            <div>
              <label className="text-sm font-medium mb-1 block">Currency</label>
              <Select
                value={watch('currency') || ''}
                onValueChange={(value) => setValue('currency', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="USD">USD</SelectItem>
                  <SelectItem value="EUR">EUR</SelectItem>
                  <SelectItem value="GBP">GBP</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            {/* From Effective Date - Date Picker */}
            <div>
              <label className="text-sm font-medium mb-1 block">From Effective Date</label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button 
                    variant="outline" 
                    className="w-full justify-start text-left font-normal"
                  >
                    {fromDate ? format(new Date(fromDate), 'dd-MMM-yyyy') : 'dd-mmm-yyyy'}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={fromDate ? new Date(fromDate) : undefined}
                    onSelect={(date) => setValue('fromDate', date?.toISOString() || '')}
                  />
                </PopoverContent>
              </Popover>
            </div>
            
            {/* To Effective Date - Date Picker */}
            <div>
              <label className="text-sm font-medium mb-1 block">To Effective Date</label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button 
                    variant="outline" 
                    className="w-full justify-start text-left font-normal"
                  >
                    {toDate ? format(new Date(toDate), 'dd-MMM-yyyy') : 'dd-mmm-yyyy'}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={toDate ? new Date(toDate) : undefined}
                    onSelect={(date) => setValue('toDate', date?.toISOString() || '')}
                  />
                </PopoverContent>
              </Popover>
            </div>
            
            {/* Day Type - Conditionally hidden */}
            {!shouldHideDayType && (
              <div>
                <label className="text-sm font-medium mb-1 block">Day Type</label>
                <Select
                  value={watch('dayType') || ''}
                  onValueChange={(value) => setValue('dayType', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Due Through Today">Due Through Today</SelectItem>
                    <SelectItem value="Business Day">Business Day</SelectItem>
                    <SelectItem value="Calendar Day">Calendar Day</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            )}
            
            {/* Tech Region */}
            <div>
              <label className="text-sm font-medium mb-1 block">Tech Region</label>
              <Input {...register('techRegion')} placeholder="" />
            </div>
          </div>
          
          {/* Row 3 */}
          <div className="grid grid-cols-6 gap-3">
            {/* Status - Dropdown with clear X */}
            <div>
              <label className="text-sm font-medium mb-1 block">Status</label>
              <div className="relative">
                <Select
                  value={watch('status') || ''}
                  onValueChange={(value) => setValue('status', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="DRAFT">Draft</SelectItem>
                    <SelectItem value="SUBMITTED">Submitted</SelectItem>
                    <SelectItem value="APPROVED">Approved</SelectItem>
                  </SelectContent>
                </Select>
                {watch('status') && (
                  <button
                    type="button"
                    onClick={() => setValue('status', '')}
                    className="absolute right-8 top-1/2 -translate-y-1/2"
                  >
                    <X className="h-4 w-4 text-gray-400 hover:text-gray-600" />
                  </button>
                )}
              </div>
            </div>
            
            {/* Queue - Dropdown */}
            <div>
              <label className="text-sm font-medium mb-1 block">Queue</label>
              <Select
                value={watch('queue') || ''}
                onValueChange={(value) => setValue('queue', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Queue1">Queue 1</SelectItem>
                  <SelectItem value="Queue2">Queue 2</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            {/* TOE Reference */}
            <div>
              <label className="text-sm font-medium mb-1 block">TOE Reference</label>
              <Input {...register('toeReference')} placeholder="" />
            </div>
            
            {/* ALE Batch Id */}
            <div>
              <label className="text-sm font-medium mb-1 block">ALE Batch Id</label>
              <Input {...register('aleBatchId')} placeholder="" />
            </div>
            
            {/* Sign Off */}
            <div>
              <label className="text-sm font-medium mb-1 block">Sign Off</label>
              <Input {...register('signOff')} placeholder="" />
            </div>
            
            {/* NT Tech */}
            <div>
              <label className="text-sm font-medium mb-1 block">NT Tech</label>
              <Input 
                {...register('ntTech')} 
                placeholder="Eg: LanID Or LanID1,LanID2,LanID3" 
              />
            </div>
          </div>
          
          {/* Action Buttons */}
          <div className="flex gap-2 pt-2">
            <Button 
              type="submit" 
              className="bg-teal-600 hover:bg-teal-700 text-white"
            >
              <Search className="mr-2 h-4 w-4" />
              SEARCH
            </Button>
            
            <Button 
              type="button" 
              variant="outline"
              onClick={onReset}
            >
              <RotateCcw className="mr-2 h-4 w-4" />
              RESET
            </Button>
            
            <Button 
              type="button" 
              variant="outline"
              onClick={onExport}
            >
              <FileDown className="h-4 w-4" />
            </Button>
            
            <Button 
              type="button" 
              variant="outline"
              onClick={onRefresh}
            >
              <RefreshCw className="h-4 w-4" />
              REFRESH
            </Button>
          </div>
        </form>
      )}
    </div>
  );
};