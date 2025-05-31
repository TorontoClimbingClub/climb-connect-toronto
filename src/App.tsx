
import { Suspense, lazy } from "react";
import { Toaster } from "@/components/ui/toaster";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { LeaderboardProvider } from "@/contexts/LeaderboardContext";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import { ErrorMonitor } from "@/components/ErrorMonitor";
import "./App.css";

// Lazy load components for better performance
const Index = lazy(() => import("@/pages/Index"));
const Auth = lazy(() => import("@/pages/Auth"));
const Events = lazy(() => import("@/pages/Events"));
const EventDetail = lazy(() => import("@/pages/EventDetail"));
const Community = lazy(() => import("@/pages/Community"));
const RoutesPage = lazy(() => import("@/pages/Routes"));
const RouteDetail = lazy(() => import("@/pages/RouteDetail"));
const Profile = lazy(() => import("@/pages/Profile"));
const Admin = lazy(() => import("@/pages/Admin"));
const NotFound = lazy(() => import("@/pages/NotFound"));

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      retry: 1,
    },
  },
});

function App() {
  return (
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <BrowserRouter>
          <AuthProvider>
            <LeaderboardProvider>
              <div className="min-h-screen bg-background">
                <Suspense fallback={
                  <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-50 flex items-center justify-center">
                    <div className="text-[#E55A2B]">Loading...</div>
                  </div>
                }>
                  <Routes>
                    <Route path="/" element={<Index />} />
                    <Route path="/auth" element={<Auth />} />
                    <Route path="/events" element={<Events />} />
                    <Route path="/events/:id" element={<EventDetail />} />
                    <Route path="/community" element={<Community />} />
                    <Route path="/routes" element={<RoutesPage />} />
                    <Route path="/routes/:routeId" element={<RouteDetail />} />
                    <Route path="/profile" element={<Profile />} />
                    <Route path="/admin" element={<Admin />} />
                    <Route path="/404" element={<NotFound />} />
                    <Route path="*" element={<Navigate to="/404" replace />} />
                  </Routes>
                </Suspense>
              </div>
              <Toaster />
              <ErrorMonitor />
            </LeaderboardProvider>
          </AuthProvider>
        </BrowserRouter>
      </QueryClientProvider>
    </ErrorBoundary>
  );
}

export default App;
