import "./global.css";

import { Toaster } from "@/components/ui/toaster";
import { createRoot } from "react-dom/client";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "@/lib/auth-context";

import Dashboard from "./pages/admin/Dashboard";
import Users from "./pages/admin/Users";
import Jobs from "./pages/admin/Jobs";
import Categories from "./pages/admin/Categories";
import Companies from "./pages/admin/Companies";
import Applications from "./pages/admin/Applications";
import Analytics from "./pages/admin/Analytics";
import Reports from "./pages/admin/Reports";
import Security from "./pages/admin/Security";
import Settings from "./pages/admin/Settings";
import Emails from "./pages/admin/Emails";
import Verification from "./pages/admin/Verification";
import AuditLog from "./pages/admin/AuditLog";
import Login from "./pages/admin/Login";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

function ProtectedAdminRoute({ children }: { children: JSX.Element }) {
  const { isAuthenticated, isLoading } = useAuth();
  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center text-xs text-muted-foreground">
        Loading admin console...
      </div>
    );
  }
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  return children;
}

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/" element={<Navigate to="/admin/dashboard" replace />} />
            
            {/* Super Admin Live Routes */}
            <Route path="/admin" element={<Navigate to="/admin/dashboard" replace />} />
            <Route
              path="/admin/dashboard"
              element={
                <ProtectedAdminRoute>
                  <Dashboard />
                </ProtectedAdminRoute>
              }
            />
            <Route
              path="/admin/users"
              element={
                <ProtectedAdminRoute>
                  <Users />
                </ProtectedAdminRoute>
              }
            />
            <Route
              path="/admin/jobs"
              element={
                <ProtectedAdminRoute>
                  <Jobs />
                </ProtectedAdminRoute>
              }
            />
            <Route
              path="/admin/categories"
              element={
                <ProtectedAdminRoute>
                  <Categories />
                </ProtectedAdminRoute>
              }
            />
            <Route
              path="/admin/companies"
              element={
                <ProtectedAdminRoute>
                  <Companies />
                </ProtectedAdminRoute>
              }
            />
            <Route
              path="/admin/applications"
              element={
                <ProtectedAdminRoute>
                  <Applications />
                </ProtectedAdminRoute>
              }
            />
            <Route
              path="/admin/analytics"
              element={
                <ProtectedAdminRoute>
                  <Analytics />
                </ProtectedAdminRoute>
              }
            />
            <Route
              path="/admin/reports"
              element={
                <ProtectedAdminRoute>
                  <Reports />
                </ProtectedAdminRoute>
              }
            />
            <Route
              path="/admin/security"
              element={
                <ProtectedAdminRoute>
                  <Security />
                </ProtectedAdminRoute>
              }
            />
            <Route
              path="/admin/settings"
              element={
                <ProtectedAdminRoute>
                  <Settings />
                </ProtectedAdminRoute>
              }
            />
            <Route
              path="/admin/emails"
              element={
                <ProtectedAdminRoute>
                  <Emails />
                </ProtectedAdminRoute>
              }
            />
            <Route
              path="/admin/verification"
              element={
                <ProtectedAdminRoute>
                  <Verification />
                </ProtectedAdminRoute>
              }
            />
            <Route
              path="/admin/audit-log"
              element={
                <ProtectedAdminRoute>
                  <AuditLog />
                </ProtectedAdminRoute>
              }
            />
            
            {/* Catch-all 404 */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

createRoot(document.getElementById("root")!).render(<App />);
