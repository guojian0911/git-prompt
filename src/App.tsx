
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";

// Import all page components
import Index from "@/pages/Index";
import PromptDetail from "@/pages/PromptDetail";
import SubmitPrompt from "@/pages/SubmitPrompt";
import Categories from "@/pages/Categories";
import Login from "@/pages/auth/Login";
import SignUp from "@/pages/auth/SignUp";
import Profile from "@/pages/Profile";
import NotFound from "@/pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/prompt/:id" element={<PromptDetail />} />
            <Route path="/submit" element={<SubmitPrompt />} />
            <Route path="/explore" element={<Index />} />
            <Route path="/categories" element={<Categories />} />
            <Route path="/category/:slug" element={<Index />} />
            <Route path="/auth/login" element={<Login />} />
            <Route path="/auth/signup" element={<SignUp />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/account" element={<Profile />} />
            <Route path="/starred" element={<Index />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
