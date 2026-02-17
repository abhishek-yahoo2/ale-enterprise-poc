/**
 * COPILOT: Main Capital Call page component
 * 
 * Assembles all components:
 * - Breadcrumb navigation
 * - Main tabs
 * - Queue selector (top right)
 * - Alerts indicator (top right)
 * - Sub-tab count cards (only for FOR REVIEW tab)
 * - Filter panel
 * - Data grid
 * 
 * Layout matches mockup exactly
 */

import React from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/Select';
import { AlertTriangle, Home } from 'lucide-react';
import { CapitalCallTabs } from '../components/CapitalCallTabs';
import { SubTabCountCards } from '../components/SubTabCountCards';
import { CapitalCallFilters } from '../components/CapitalCallFilters';
import { CapitalCallGrid } from '../components/CapitalCallGrid';
import { useCapitalCallStore } from '../store/capitalCallStore';
import { CapitalCallTab } from '../types';
import { useNavigate } from "react-router-dom";

 const CapitalCallPage: React.FC = () => {
    const navigate = useNavigate();
  const activeTab = useCapitalCallStore((state) => state.activeTab);
  const selectedQueue = useCapitalCallStore((state) => state.selectedQueue);
  const setSelectedQueue = useCapitalCallStore((state) => state.setSelectedQueue);
  
  // Mock alert count - replace with actual data
  const alertCount = 9;
  
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header with teal background - matching mockup */}
      <div className="bg-teal-700 text-white px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="text-xl font-semibold">
              Northern Trust | Alternatives Lifecycle Engine
            </div>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-sm">🔧 ALE - Data View | SYSTEM</span>
            <button className="p-2 hover:bg-teal-600 rounded">
              <span className="text-xl">👤</span>
            </button>
          </div>
        </div>
      </div>
      
      {/* Breadcrumb */}
      <div className="bg-white border-b px-6 py-3">
        <div className="flex items-center gap-2 text-sm">
          <span className="text-teal-700 hover:underline cursor-pointer" onClick={() => navigate("/")}>
            <Home className="h-5 w-5" />
          </span>
          <span className="text-gray-400">/</span>
          <span className="text-teal-700 hover:underline cursor-pointer">
            ACCOUNTING & CASH
          </span>
          <span className="text-gray-400">/</span>
          <span className="text-teal-700 hover:underline cursor-pointer">
            PRIVATE EQUITY
          </span>
          <span className="text-gray-400">/</span>
          <span className="text-teal-700 hover:underline cursor-pointer">
            CAPITAL CALL
          </span>
          <span className="text-gray-400">/</span>
          <span className="text-gray-700 font-medium">FOR REVIEW</span>
        </div>
      </div>
      
      {/* Main Tabs */}
      <div className="bg-white">
        <div className="px-6">
          <CapitalCallTabs />
        </div>
      </div>
      
      {/* Content Area */}
      <div className="px-6 py-4">
        {/* Top controls - Queue selector and Alerts */}
        <div className="flex items-center justify-between mb-4">
          <div className="w-64">
            <Select value={selectedQueue} onValueChange={setSelectedQueue}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Operator Queue">Operator Queue</SelectItem>
                <SelectItem value="Manager Queue">Manager Queue</SelectItem>
                <SelectItem value="Admin Queue">Admin Queue</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="flex items-center gap-2 text-red-600 font-semibold">
            <AlertTriangle className="h-5 w-5" />
            <span>ALERTS({alertCount})</span>
          </div>
        </div>
        
        {/* Sub-tab count cards - only show for FOR REVIEW tab */}
        {activeTab === CapitalCallTab.FOR_REVIEW && (
          <SubTabCountCards />
        )}
        
        {/* Filter Panel */}
        <CapitalCallFilters />
        
        {/* Data Grid */}
        <CapitalCallGrid />
      </div>
    </div>
  );
};
export default CapitalCallPage;