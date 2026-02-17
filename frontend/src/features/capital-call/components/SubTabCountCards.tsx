/**
 * COPILOT: Sub-tab count cards component
 * 
 * UI from mockups:
 * - Horizontal row of cards below main tabs
 * - Each card shows: Title and Count
 * - First card (SSI Verification Needed): Teal background - 2573 count
 * - Other cards: Green background with counts (17, 3285, 42, 64)
 * - Cards are clickable to switch active sub-tab
 * - Active card has darker border/shadow
 * 
 * Cards from left to right:
 * 1. SSI Verification Needed (teal)
 * 2. Transaction To Be Processed (green)
 * 3. Missing Fund Document (green)
 * 4. Missing Client Instruction (green)
 * 5. Missing Client And Fund Instruction (green)
 */

import React from 'react';
import { Card, CardContent } from '@/components/ui/Card';
import { useCapitalCallStore } from '../store/capitalCallStore';
import { useTabCounts } from '../hooks/useTabCounts';
import { ForReviewSubTab } from '../types';
import { Loader2 } from 'lucide-react';
import { sub } from 'date-fns';
import { capitalCallMockApi } from '../mocks/capitalCallMock';

export const SubTabCountCards: React.FC = () => {
  const activeSubTab = useCapitalCallStore((state) => state.activeSubTab);
  const setActiveSubTab = useCapitalCallStore((state) => state.setActiveSubTab);
  
  const { data: counts, isLoading } = useTabCounts();
  
  // Define card configurations matching UI mockup
  const cardConfigs = [
    {
      id: ForReviewSubTab.SSI_VERIFICATION_NEEDED,
      label: 'SSI Verification Needed',
      bgColor: 'bg-teal-700',
      hoverColor: 'hover:bg-teal-800'
    },
    {
      id: ForReviewSubTab.TRANSACTION_TO_BE_PROCESSED,
      label: 'Transaction To Be Processed',
      bgColor: 'bg-green-600',
      hoverColor: 'hover:bg-green-700'
    },
    {
      id: ForReviewSubTab.MISSING_FUND_DOCUMENT,
      label: 'Missing Fund Document',
      bgColor: 'bg-green-600',
      hoverColor: 'hover:bg-green-700'
    },
    {
      id: ForReviewSubTab.MISSING_CLIENT_INSTRUCTION,
      label: 'Missing Client Instruction',
      bgColor: 'bg-green-600',
      hoverColor: 'hover:bg-green-700'
    },
    {
      id: ForReviewSubTab.MISSING_CLIENT_AND_FUND_INSTRUCTION,
      label: 'Missing Client And Fund Instruction',
      bgColor: 'bg-green-600',
      hoverColor: 'hover:bg-green-700'
    }
  ];
  
  // Get count for specific sub-tab
//   const getCount = (subTabId: ForReviewSubTab): number => {
//     console.log("COUNT'", counts,"subTabId", subTabId);
//     // const found = counts?.find(c => c.subTab === subTabId);
//     // const found = counts[subTabId]
//     return counts
//   };
  
  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-8">
        <Loader2 className="h-6 w-6 animate-spin text-teal-600" />
      </div>
    );
  }
  
  return (
    <div className="grid grid-cols-5 gap-4 mb-6">
      {cardConfigs.map((config) => {
        const isActive = activeSubTab === config.id;
        //call getCounts from capitalCallMockApi to get count for the subtab and pass the subtab id as parameter
        const count = capitalCallMockApi.getCountForSubTab(config.id) || 0;
        // const count = getCount(config.id);
        
        return (
          <Card
          title={config.label}
            key={config.id}
            className={`
              cursor-pointer transition-all
              ${isActive ? 'ring-2 ring-teal-600 shadow-lg' : 'shadow'}
              ${config.bgColor} ${config.hoverColor}
              text-white
            `}
            onClick={() => setActiveSubTab(config.id)}
          >
            <CardContent className="p-4">
              <div className="text-center">
                <p className="text-sm font-medium mb-2 line-clamp-2">
                  {config.label}
                </p>
                <p className="text-3xl font-bold">
                  {count.toLocaleString()}
                </p>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
};