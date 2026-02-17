/**
 * COPILOT: 404 Not Found page
 */

import React from 'react';
import { useNavigate } from 'react-router-dom';
import Button  from '@/components/ui/button';
import { AlertCircle, Home } from 'lucide-react';

export const NotFoundPage: React.FC = () => {
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
          <AlertCircle className="h-24 w-24 text-red-600 mx-auto mb-6" />
          <h1 className="text-6xl font-bold text-gray-800 mb-4">404</h1>
          <p className="text-2xl text-gray-600 mb-2">Page Not Found</p>
          <p className="text-gray-500 mb-8">
            The page you're looking for doesn't exist.
          </p>
          <Button 
            onClick={() => navigate('/accounting-cash')}
            className="bg-teal-600 hover:bg-teal-700"
          >
            <Home className="mr-2 h-4 w-4" />
            Go to Home
          </Button>
        </div>
      </div>
    </div>
  );
};