
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/hooks/useAuth";
import { Layout } from "@/components/layout/Layout";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import Home from "./pages/Home";
import Auth from "./pages/Auth";
import Events from "./pages/Events";
import EventChat from "./pages/EventChat";
import Profile from "./pages/Profile";
import Groups from "./pages/Groups";
import GroupChat from "./pages/GroupChat";
import BelayGroups from "./pages/BelayGroups";
import BelayChat from "./pages/BelayChat";
import Community from "./pages/Community";
import ClubTalk from "./pages/ClubTalk";
import Administrator from "./pages/Administrator";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            <Route path="/auth" element={<Auth />} />
            <Route path="/" element={
              <ProtectedRoute>
                <Layout useDesktopLayout={true}>
                  <Home />
                </Layout>
              </ProtectedRoute>
            } />
            <Route path="/events" element={
              <ProtectedRoute>
                <Layout useDesktopLayout={true} layoutType="two-panel">
                  <Events />
                </Layout>
              </ProtectedRoute>
            } />
            <Route path="/events/:eventId/chat" element={
              <ProtectedRoute>
                <Layout useDesktopLayout={true} fullscreen>
                  <EventChat />
                </Layout>
              </ProtectedRoute>
            } />
            <Route path="/profile" element={
              <ProtectedRoute>
                <Layout useDesktopLayout={true} fullscreen>
                  <Profile />
                </Layout>
              </ProtectedRoute>
            } />
            <Route path="/groups" element={
              <ProtectedRoute>
                <Layout useDesktopLayout={true} layoutType="two-panel">
                  <Groups />
                </Layout>
              </ProtectedRoute>
            } />
            <Route path="/groups/:groupId/chat" element={
              <ProtectedRoute>
                <Layout useDesktopLayout={true} fullscreen>
                  <GroupChat />
                </Layout>
              </ProtectedRoute>
            } />
            <Route path="/belay-groups" element={
              <ProtectedRoute>
                <Layout useDesktopLayout={true} layoutType="two-panel">
                  <BelayGroups />
                </Layout>
              </ProtectedRoute>
            } />
            <Route path="/belay-groups/:id/chat" element={
              <ProtectedRoute>
                <Layout useDesktopLayout={true} fullscreen>
                  <BelayChat />
                </Layout>
              </ProtectedRoute>
            } />
            <Route path="/chat" element={
              <ProtectedRoute>
                <Layout useDesktopLayout={true} layoutType="two-panel">
                  <Community />
                </Layout>
              </ProtectedRoute>
            } />
            <Route path="/club-talk" element={
              <ProtectedRoute>
                <Layout useDesktopLayout={true} fullscreen>
                  <ClubTalk />
                </Layout>
              </ProtectedRoute>
            } />
            <Route path="/admin" element={
              <ProtectedRoute>
                <Layout useDesktopLayout={true}>
                  <Administrator />
                </Layout>
              </ProtectedRoute>
            } />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
