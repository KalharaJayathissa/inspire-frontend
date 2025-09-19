import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import ComingSoon from "./pages/ComingSoon";
import Login from "./pages/login";
import AdminPage from "./pages/admin";
import MarkerPage from "./pages/marker";
import ResourcesSection from "./components/ResourcesSection";
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
          <Route path="/" element={<ComingSoon />} />
          <Route path = "/resource" element= {<ResourcesSection/>}></Route>
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
