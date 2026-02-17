/**
 * COPILOT: Private Equity landing page
 *
 * UI from mockup Image 2:
 * - Breadcrumb: ACCOUNTING & CASH / PRIVATE EQUITY
 * - Five tile cards:
 *   1. CAPITAL CALL
 *   2. CASH DISTRIBUTION
 *   3. STOCK DISTRIBUTION
 *   4. HISTORY
 *   5. MANUAL PROCESSING
 * - Each tile has an icon and navigates to respective module
 */

import React from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/Card";
import {
  Hammer,
  DollarSign,
  TrendingUp,
  BookOpen,
  FileEdit,
  Home
} from "lucide-react";

const PrivateEquityLanding: React.FC = () => {
  const navigate = useNavigate();

  // Tile configurations matching mockup
  const tiles = [
    {
      id: "capital-call",
      title: "CAPITAL CALL",
      icon: Hammer,
      path: "/accounting-cash/private-equity/capital-call",
      description: "Manage capital call requests",
    },
    {
      id: "cash-distribution",
      title: "CASH DISTRIBUTION",
      icon: DollarSign,
      path: "/accounting-cash/private-equity/cash-distribution",
      description: "Process cash distributions",
    },
    {
      id: "stock-distribution",
      title: "STOCK DISTRIBUTION",
      icon: TrendingUp,
      path: "/accounting-cash/private-equity/stock-distribution",
      description: "Handle stock distributions",
    },
    {
      id: "history",
      title: "HISTORY",
      icon: BookOpen,
      path: "/accounting-cash/private-equity/history",
      description: "View historical records",
    },
    {
      id: "manual-processing",
      title: "MANUAL PROCESSING",
      icon: FileEdit,
      path: "/accounting-cash/private-equity/manual-processing",
      description: "Manual transaction processing",
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header with teal background */}
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
          <span className="text-teal-700 hover:underline cursor-pointer">
            <Home className="h-5 w-5" />
          </span>
          <span className="text-gray-400">/</span>
          <span
            className="text-teal-700 hover:underline cursor-pointer"
            onClick={() => navigate("/accounting-cash")}
          >
            ACCOUNTING & CASH
          </span>
          <span className="text-gray-400">/</span>
          <span className="text-gray-700 font-medium">PRIVATE EQUITY</span>
        </div>
      </div>

      {/* Page Content */}
      <div className="px-6 py-8">
        {/* Tile Grid - 2 rows layout */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 max-w-7xl">
          {/* First 4 tiles in top row */}
          {tiles.slice(0, 4).map((tile) => {
            const Icon = tile.icon;

            return (
              <Card
                title={tile.title}
                key={tile.id}
                className="cursor-pointer hover:shadow-lg transition-shadow border-2 hover:border-teal-600"
                onClick={() => navigate(tile.path)}
              >
                <CardContent className="p-6 flex flex-col items-center text-center">
                  {/* Icon */}
                  <div className="mb-4 p-4 bg-teal-100 rounded-lg">
                    <Icon className="h-12 w-12 text-teal-700" />
                  </div>

                  {/* Title */}
                  <h2 className="text-lg font-bold text-teal-700 mb-2">
                    {tile.title}
                  </h2>

                  {/* Description */}
                  <p className="text-xs text-gray-600">{tile.description}</p>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Manual Processing tile in second row */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 max-w-7xl mt-6">
          {tiles.slice(4).map((tile) => {
            const Icon = tile.icon;

            return (
              <Card
                title={tile.title}
                subtitle={tile.description}
                key={tile.id}
                className="cursor-pointer hover:shadow-lg transition-shadow border-2 hover:border-teal-600"
                onClick={() => navigate(tile.path)}
              >
                <CardContent className="p-6 flex flex-col items-center text-center">
                  <div className="mb-4 p-4 bg-teal-100 rounded-lg">
                    <Icon className="h-12 w-12 text-teal-700" />
                  </div>
                  <h2 className="text-lg font-bold text-teal-700 mb-2">
                    {tile.title}
                  </h2>
                  <p className="text-xs text-gray-600">{tile.description}</p>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </div>
  );
};
export default PrivateEquityLanding;
