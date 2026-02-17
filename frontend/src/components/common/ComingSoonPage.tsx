/**
 * COPILOT: Coming Soon placeholder page
 * 
 * Used for modules not yet implemented
 * Shows nice message with navigation back to landing page
 */

import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Construction, ArrowLeft } from 'lucide-react';

interface ComingSoonPageProps {
  title: string;
}

export const ComingSoonPage: React.FC<ComingSoonPageProps> = ({ title }) => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-teal-700 text-white px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="text-xl font-semibold">
            Northern Trust | Alternatives Lifecycle Engine 
          </div>
          <div className="flex items-center gap-4">
            <span className="text-sm">🔧 ALE - Data View | SYSTEM</span>
            <button className="p-2 hover:bg-teal-600 rounded">
              <span className="text-xl">👤</span>
            </button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex items-center justify-center h-[calc(100vh-200px)]">
        <div className="text-center">
          <Construction className="h-24 w-24 text-teal-600 mx-auto mb-6" />
          <h1 className="text-3xl font-bold text-gray-800 mb-4">
            {title}
          </h1>
          <p className="text-lg text-gray-600 mb-8">
            This module is under construction and will be available soon.
          </p>
          <Button 
            onClick={() => navigate(-1)}
            className="bg-teal-600 hover:bg-teal-700"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Go Back
          </Button>
        </div>
      </div>
    </div>
  );
};