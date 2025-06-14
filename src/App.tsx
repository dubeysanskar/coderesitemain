
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Founders from "./pages/Founders";
import Validator from "./pages/Validator";
import ServiceGig from "./pages/ServiceGig";
import PPTGenerator from "./pages/PPTGenerator";
import ResumeBuilder from "./pages/ResumeBuilder";
import ReportGenerator from "./pages/ReportGenerator";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/founders" element={<Founders />} />
          <Route path="/validator" element={<Validator />} />
          <Route path="/ppt-generator" element={<PPTGenerator />} />
          <Route path="/resume-builder" element={<ResumeBuilder />} />
          <Route path="/report-generator" element={<ReportGenerator />} />
          <Route path="/services/:service" element={<ServiceGig />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
