
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate, useLocation } from "react-router-dom";
import { AuthProvider } from "@/context/AuthContext";
import PrivateRoute from "@/components/layout/PrivateRoute";
import AnimatedRoute from "@/components/layout/AnimatedRoute";
import Index from "./pages/Index";
import Auth from "./pages/Auth";
import Dashboard from "./pages/Dashboard";
import Employees from "./pages/Employees";
import EmployeeProfile from "./pages/EmployeeProfile";
import Attendance from "./pages/Attendance";
import WorkingDays from "./pages/WorkingDays";
import Events from "./pages/Events";
import Salary from "./pages/Salary";
import Settings from "./pages/Settings";
import Reports from "./pages/Reports";
import TimelineLogsPage from "./pages/TimelineLogs";
import LeaveManagement from "./pages/LeaveManagement";
import OvertimePage from "./pages/Overtime";
import NotFound from "./pages/NotFound";
import BiometricLockScreen from "./components/auth/BiometricLockScreen";

const queryClient = new QueryClient();

function AnimatedRoutes() {
  const location = useLocation();

  return (
    <div key={location.pathname}>
      <AnimatedRoute>
        <Routes location={location}>
          <Route path="/" element={<Index />} />
          <Route path="/auth" element={<Auth />} />
          <Route path="/dashboard" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
          <Route path="/employees" element={<PrivateRoute><Employees /></PrivateRoute>} />
          <Route path="/employees/:id" element={<PrivateRoute><EmployeeProfile /></PrivateRoute>} />
          <Route path="/attendance" element={<PrivateRoute><Attendance /></PrivateRoute>} />
          <Route path="/working-days" element={<PrivateRoute><WorkingDays /></PrivateRoute>} />
          <Route path="/events" element={<PrivateRoute><Events /></PrivateRoute>} />
          <Route path="/salary" element={<PrivateRoute><Salary /></PrivateRoute>} />
          <Route path="/settings" element={<PrivateRoute><Settings /></PrivateRoute>} />
          <Route path="/reports" element={<PrivateRoute><Reports /></PrivateRoute>} />
          <Route path="/timeline-logs" element={<PrivateRoute><TimelineLogsPage /></PrivateRoute>} />
          <Route path="/leave-management" element={<PrivateRoute><LeaveManagement /></PrivateRoute>} />
          <Route path="/overtime" element={<PrivateRoute><OvertimePage /></PrivateRoute>} />
          <Route path="/404" element={<NotFound />} />
          <Route path="*" element={<Navigate to="/404" replace />} />
        </Routes>
      </AnimatedRoute>
    </div>
  );
}

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BiometricLockScreen />
        <BrowserRouter>
          <AnimatedRoutes />
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
