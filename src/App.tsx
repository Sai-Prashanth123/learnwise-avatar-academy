
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AppProvider } from "@/context/AppContext";
import MainLayout from "@/components/layout/MainLayout";
import Index from "./pages/Index";
import Dashboard from "./pages/Dashboard";
import AITutor from "./pages/AITutor";
import AITutorSession from "./pages/AITutorSession";
import ConversationalAI from "./pages/ConversationalAI";
import Quiz from "./pages/Quiz";
import QuizSession from "./pages/QuizSession";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AppProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route element={<MainLayout />}>
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/ai-tutor" element={<AITutor />} />
              <Route path="/ai-tutor/session" element={<AITutorSession />} />
              <Route path="/conversational-ai" element={<ConversationalAI />} />
              <Route path="/quiz" element={<Quiz />} />
              <Route path="/quiz/session" element={<QuizSession />} />
            </Route>
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AppProvider>
  </QueryClientProvider>
);

export default App;
