/**
 * COPILOT: Accounting & Cash landing page
 *
 * UI from mockup Image 1:
 * - Page title: "ACCOUNTING & CASH"
 * - Three tile cards displayed horizontally:
 *   1. PRIVATE EQUITY (bar chart icon)
 *   2. UNITIZED FUNDS (grid icon)
 *   3. ALTERNATIVE FUNDS SERVICES (road/highway icon)
 * - Each tile is clickable and navigates to respective section
 * - Clean, card-based layout with icons
 */

import React from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/Card";
import { BarChart3, Grid3x3, Car, Home } from "lucide-react";

const AccountingCashLanding: React.FC = () => {
  const navigate = useNavigate();

  // Tile configurations matching mockup
  const tiles = [
    {
      id: "private-equity",
      title: "PRIVATE EQUITY",
      icon: BarChart3,
      path: "/accounting-cash/private-equity",
      description: "Capital Call, Cash Distribution, Stock Distribution",
    },
    {
      id: "unitized-funds",
      title: "UNITIZED FUNDS",
      icon: Grid3x3,
      path: "/accounting-cash/unitized-funds",
      description: "Fund accounting and management",
    },
    {
      id: "alternative-funds",
      title: "ALTERNATIVE FUNDS SERVICES",
      icon: Car,
      path: "/accounting-cash/alternative-funds-services",
      description: "Alternative investment services",
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header with teal background */}
      <div className="bg-teal-700 text-white px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="text-xl font-semibold">
                <Home className="h5 w5 hover:underline cursor-pointer" onClick={() => navigate("/")}/>
            </div>
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

      {/* Page Content */}
      <div className="px-6 py-8">
        {/* Page Title */}
        <h1 className="text-3xl font-bold text-gray-800 mb-8">
          ACCOUNTING & CASH
        </h1>

        {/* Tile Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl">
          {tiles.map((tile) => {
            const Icon = tile.icon;

            return (
              //generate code for missing props

              <Card
                title={tile.title}
                subtitle={tile.description}
                key={tile.id}
                className="cursor-pointer hover:shadow-lg transition-shadow border-2 hover:border-teal-600"
                onClick={() => navigate(tile.path)}
              >
                <CardContent className="p-8 flex flex-col items-center text-center">
                  {/* Icon */}
                  <div className="mb-4 p-6 bg-teal-100 rounded-lg">
                    <Icon className="h-16 w-16 text-teal-700" />
                  </div>

                  {/* Title */}
                  <h2 className="text-xl font-bold text-teal-700 mb-2">
                    {tile.title}
                  </h2>

                  {/* Description */}
                  <p className="text-sm text-gray-600">{tile.description}</p>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default AccountingCashLanding;
