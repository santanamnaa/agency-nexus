import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "@/hooks/useAuth";
import { ThemeProvider } from "@/hooks/useTheme";
import AppLayout from "@/components/layout/AppLayout";
import Login from "@/pages/Login";
import Dashboard from "@/pages/Dashboard";
import Clients from "@/pages/Clients";
import Projects from "@/pages/Projects";
import Tasks from "@/pages/Tasks";
import Finance from "@/pages/Finance";
import Team from "@/pages/Team";
import Services from "@/pages/Services";
import Attendance from "@/pages/Attendance";
import AuditLog from "@/pages/AuditLog";
import Notifications from "@/pages/Notifications";
import SettingsPage from "@/pages/SettingsPage";
import NotFound from "@/pages/NotFound";

const queryClient = new QueryClient();

function ProtectedRoute({ children, allowedRoles }: { children: React.ReactNode; allowedRoles?: string[] }) {
  const { user, loading, role } = useAuth();
  if (loading) return <div className="flex h-screen items-center justify-center"><div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" /></div>;
  if (!user) return <Navigate to="/login" replace />;
  if (allowedRoles && role && !allowedRoles.includes(role) && role !== "super_admin") return <Navigate to="/" replace />;
  return <>{children}</>;
}

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <AuthProvider>
            <Routes>
              <Route path="/login" element={<Login />} />
              <Route path="/" element={<ProtectedRoute><AppLayout /></ProtectedRoute>}>
                <Route index element={<Dashboard />} />
                <Route path="clients" element={<Clients />} />
                <Route path="projects" element={<ProtectedRoute allowedRoles={["super_admin", "employee"]}><Projects /></ProtectedRoute>} />
                <Route path="tasks" element={<ProtectedRoute allowedRoles={["super_admin", "employee"]}><Tasks /></ProtectedRoute>} />
                <Route path="finance" element={<ProtectedRoute allowedRoles={["super_admin"]}><Finance /></ProtectedRoute>} />
                <Route path="team" element={<ProtectedRoute allowedRoles={["super_admin"]}><Team /></ProtectedRoute>} />
                <Route path="services" element={<ProtectedRoute allowedRoles={["super_admin"]}><Services /></ProtectedRoute>} />
                <Route path="attendance" element={<Attendance />} />
                <Route path="audit-log" element={<ProtectedRoute allowedRoles={["super_admin"]}><AuditLog /></ProtectedRoute>} />
                <Route path="notifications" element={<Notifications />} />
                <Route path="settings" element={<SettingsPage />} />
              </Route>
              <Route path="*" element={<NotFound />} />
            </Routes>
          </AuthProvider>
        </BrowserRouter>
      </TooltipProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
