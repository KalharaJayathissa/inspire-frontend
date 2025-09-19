import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import ComingSoon from "./pages/ComingSoon";
import Login from "./pages/login";
import AdminPage from "./pages/admin";
import MarkerPage from "./pages/marker";
import Attendent from "./pages/Attendent";
const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          {/* All routes now redirect to Coming Soon page */}
          <Route path='/login' element={<Login />} />
          <Route path='/admin/' element={<AdminPage />} />
          <Route path='/marker' element={<MarkerPage />} />
          <Route path='/attendent' element={<Attendent />} />
          <Route path="/" element={<ComingSoon />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
