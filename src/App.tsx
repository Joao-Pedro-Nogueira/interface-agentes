
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AgentProvider } from "./contexts/AgentContext";
import Index from "./pages/Index";
import CreateAgent from "./pages/CreateAgent";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <AgentProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/criar-agente" element={<CreateAgent />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </AgentProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
