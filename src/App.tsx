
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "@/contexts/AuthContext";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import { ErrorMonitor } from "@/components/ErrorMonitor";
import Index from "./pages/Index";
import Auth from "./pages/Auth";
import Events from "./pages/Events";
import EventDetail from "./pages/EventDetail";
import ClimbingRoutes from "./pages/Routes";
import RouteDetail from "./pages/RouteDetail";
import Profile from "./pages/Profile";
import Admin from "./pages/Admin";
import Community from "./pages/Community";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: (failureCount, error: any) => {
        // Don't retry auth errors
        if (error?.message?.includes('JWT') || error?.message?.includes('session')) {
          return false;
        }
        return failureCount < 3;
      },
      staleTime: 5 * 60 * 1000, // 5 minutes
    },
  },
});

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, loading } = useAuth();
  
  console.log('🛡️ ProtectedRoute check:', {
    userId: user?.id,
    userEmail: user?.email,
    loading,
    route: window.location.pathname
  });
  
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-50 flex items-center justify-center">
        <div className="text-[#E55A2B]">Loading...</div>
      </div>
    );
  }
  
  if (!user) {
    console.warn('🚫 ProtectedRoute: Redirecting unauthenticated user to auth');
    return <Navigate to="/auth" replace />;
  }
  
  return <>{children}</>;
};

const AppRoutes = () => {
  const { user, loading } = useAuth();
  
  console.log('🗺️ AppRoutes render:', {
    userId: user?.id,
    userEmail: user?.email,
    loading,
    route: window.location.pathname
  });
  
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-50 flex items-center justify-center">
        <div className="text-[#E55A2B]">Loading...</div>
      </div>
    );
  }

  return (
    <Routes>
      <Route path="/" element={user ? <Index /> : <Navigate to="/auth" replace />} />
      <Route path="/auth" element={user ? <Navigate to="/" replace /> : <Auth />} />
      <Route path="/events" element={<Events />} />
      <Route path="/events/:eventId" element={<EventDetail />} />
      <Route path="/routes" element={<ClimbingRoutes />} />
      <Route path="/routes/:routeId" element={<RouteDetail />} />
      <Route path="/community" element={<Community />} />
      <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
      <Route path="/admin" element={<ProtectedRoute><Admin /></ProtectedRoute>} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

const App = () => (
  <ErrorBoundary>
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <AuthProvider>
          <ErrorMonitor />
          <BrowserRouter>
            <AppRoutes />
          </BrowserRouter>
        </AuthProvider>
      </TooltipProvider>
    </QueryClientProvider>
  </ErrorBoundary>
);

export default App;
