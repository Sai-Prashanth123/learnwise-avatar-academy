import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate, Outlet } from "react-router-dom";
import { AppProvider, useAppContext } from "@/context/AppContext";
import MainLayout from "@/components/layout/MainLayout";
import Index from "./pages/Index";
import Dashboard from "./pages/Dashboard";
import AITutor from "./pages/AITutor";
import AITutorSession from "./pages/AITutorSession";
import ConversationalAI from "./pages/ConversationalAI";
import Quiz from "./pages/Quiz";
import QuizSession from "./pages/QuizSession";
import NotFound from "./pages/NotFound";
import Login from "./pages/Auth/Login";
import Register from "./pages/Auth/Register";
import Onboarding from "./pages/Onboarding";

const queryClient = new QueryClient();

// Protected route component
const ProtectedRoute = () => {
  const { isAuthenticated, isLoading, isOnboarded, isOnboardingQuizCompleted } = useAppContext();
  
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-pulse">Loading...</div>
      </div>
    );
  }
  
  // Not authenticated, redirect to login
  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }
  
  // Authenticated but not onboarded, redirect to onboarding
  if (!isOnboarded || !isOnboardingQuizCompleted) {
    return <Navigate to="/onboarding" />;
  }
  
  return <Outlet />;
};

// Public route that redirects to dashboard if already authenticated
const AuthRoute = () => {
  const { isAuthenticated, isLoading } = useAppContext();
  
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-pulse">Loading...</div>
      </div>
    );
  }
  
  return isAuthenticated ? <Navigate to="/dashboard" /> : <Outlet />;
};

// Routes for users who are authenticated but need onboarding
const OnboardingRoute = () => {
  const { isAuthenticated, isLoading, isOnboarded, isOnboardingQuizCompleted } = useAppContext();
  
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-pulse">Loading...</div>
      </div>
    );
  }
  
  // Not authenticated, redirect to login
  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }
  
  // Already onboarded, redirect to dashboard
  if (isOnboarded && isOnboardingQuizCompleted) {
    return <Navigate to="/dashboard" />;
  }
  
  return <Outlet />;
};

const AppRoutes = () => {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public routes */}
        <Route path="/" element={<Index />} />
        
        {/* Auth routes */}
        <Route element={<AuthRoute />}>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
        </Route>
        
        {/* Onboarding routes */}
        <Route element={<OnboardingRoute />}>
          <Route path="/onboarding" element={<Onboarding />} />
        </Route>
        
        {/* Protected routes */}
        <Route element={<ProtectedRoute />}>
          <Route element={<MainLayout />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/ai-tutor" element={<AITutor />} />
            <Route path="/ai-tutor/session" element={<AITutorSession />} />
            <Route path="/conversational-ai" element={<ConversationalAI />} />
            <Route path="/quiz" element={<Quiz />} />
            <Route path="/quiz/session" element={<QuizSession />} />
          </Route>
        </Route>
        
        {/* 404 route */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AppProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <AppRoutes />
      </TooltipProvider>
    </AppProvider>
  </QueryClientProvider>
);

export default App;
