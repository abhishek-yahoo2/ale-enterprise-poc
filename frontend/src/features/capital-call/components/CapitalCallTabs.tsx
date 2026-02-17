/**
 * COPILOT: Main tabs navigation component
 * 
 * UI from mockup:
 * - Horizontal tab bar with 5 tabs
 * - Tabs: FOR REVIEW, REJECTED BY APPROVER, EXCEPTION, PENDING APPROVAL, FOLLOW-UP REQUIRED
 * - Active tab has dark background (teal-700 or darker)
 * - Inactive tabs have lighter background
 * - Tab changes update URL and trigger new data fetch
 * - Filters persist across tab switches (handled by Zustand store)
 */

import React from 'react';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/Tabs';
import { useCapitalCallStore } from '../store/capitalCallStore';
import { CapitalCallTab } from '../types';

export const CapitalCallTabs: React.FC = () => {
  const activeTab = useCapitalCallStore((state) => state.activeTab);
  const setActiveTab = useCapitalCallStore((state) => state.setActiveTab);
  
  // Tab configurations matching mockup
  const tabs = [
    { id: CapitalCallTab.FOR_REVIEW, label: 'FOR REVIEW' },
    { id: CapitalCallTab.REJECTED_BY_APPROVER, label: 'REJECTED BY APPROVER' },
    { id: CapitalCallTab.EXCEPTION, label: 'EXCEPTION' },
    { id: CapitalCallTab.PENDING_APPROVAL, label: 'PENDING APPROVAL' },
    { id: CapitalCallTab.FOLLOW_UP_REQUIRED, label: 'FOLLOW-UP REQUIRED FOR BREAKDOWN' }
  ];
  
  return (
    <Tabs 
      value={activeTab} 
      onValueChange={(value) => setActiveTab(value as CapitalCallTab)}
      className="w-full"
    >
      <TabsList className="w-full justify-start h-auto p-0 bg-transparent border-b">
        {tabs.map((tab) => (
          <TabsTrigger
            key={tab.id}
            value={tab.id}
            className="
              px-6 py-3 rounded-none border-b-2 border-transparent
              data-[state=active]:border-teal-600 
              data-[state=active]:bg-teal-700
              data-[state=active]:text-white
              data-[state=inactive]:bg-gray-100
              data-[state=inactive]:text-gray-700
              hover:bg-teal-600 hover:text-white
              transition-colors font-medium text-sm
            "
          >
            {tab.label}
          </TabsTrigger>
        ))}
      </TabsList>
    </Tabs>
  );
};