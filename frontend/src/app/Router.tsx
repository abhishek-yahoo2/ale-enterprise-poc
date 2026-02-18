import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "./providers/AuthProvider";
import { AppLayout } from "@/components/layout/AppLayout";
import { Suspense, lazy } from "react";

// Lazy load pages
const DashboardPage = lazy(() => import("@/features/dashboard/DashboardPage"));
const DocumentTrackerPage = lazy(
  () => import("@/features/document-tracker/pages/DocumentTrackerPage"),
);
const DocumentDetailsPage = lazy(
  () => import("@/features/document-tracker/pages/DocumentDetailsPage"),
);
const CapitalCallPage = lazy(
  () => import("@/features/capital-call/pages/CapitalCallPage"),
);
const CapitalCallDetailsPage = lazy(
  () => import("@/features/capital-call/pages/CapitalCallDetailsPage"),
);
//lazy loading AccountingCashLanding and PrivateEquityLanding eagerly since they are entry points for multiple modules
const AccountingCashLanding = lazy(
  () => import("@/features/accounting-cash/AccountingCashLanding"),
);

const PrivateEquityLanding = lazy(
  () => import("@/features/accounting-cash/private-equity/PrivateEquityLanding"),
);

const AlternativeDataPage = lazy(
  () => import("@/features/alternative-data/pages/AlternativeDataPage"),
);
const LoginPage = lazy(() => import("@/features/auth/LoginPage"));

const LoadingSpinner = () => (
  <div className="flex items-center justify-center min-h-screen">
    <div className="spinner"></div>
  </div>
);

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <AppLayout>{children}</AppLayout>;
};

export const Router = () => {
  return (
    <BrowserRouter>
      <Suspense fallback={<LoadingSpinner />}>
        <Routes>
          <Route path="/login" element={<LoginPage />} />

          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <DashboardPage />
              </ProtectedRoute>
            }
          />

          {/* Document Tracker */}
          <Route
            path="/document-tracker"
            element={
              <ProtectedRoute>
                <DocumentTrackerPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/document-tracker/:genId"
            element={
              <ProtectedRoute>
                <DocumentDetailsPage />
              </ProtectedRoute>
            }
          />

          {/* Capital Call */}
          <Route
            path="/capital-call"
            element={
              <ProtectedRoute>
                <CapitalCallPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/capital-call/:id"
            element={
              <ProtectedRoute>
                <CapitalCallDetailsPage />
              </ProtectedRoute>
            }
          />

          {/* Alternative Data */}
          <Route
            path="/alternative-data"
            element={
              <ProtectedRoute>
                <AlternativeDataPage />
              </ProtectedRoute>
            }
          />

          {/* Redirect root to dashboard */}
          <Route path="/" element={<Navigate to="/dashboard" replace />} />

          {/* Accounting & Cash: same AppLayout (header + sidebar) */}
          <Route
            path="/accounting-cash"
            element={
              <ProtectedRoute>
                <AccountingCashLanding />
              </ProtectedRoute>
            }
          />
          <Route
            path="/accounting-cash/private-equity"
            element={
              <ProtectedRoute>
                <PrivateEquityLanding />
              </ProtectedRoute>
            }
          />
          <Route
            path="/accounting-cash/private-equity/capital-call"
            element={
              <ProtectedRoute>
                <CapitalCallPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/accounting-cash/private-equity/capital-call/:id"
            element={
              <ProtectedRoute>
                <CapitalCallDetailsPage />
              </ProtectedRoute>
            }
          />

          {/* 404 */}
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
};

export default Router;
