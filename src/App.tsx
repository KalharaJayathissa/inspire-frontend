import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import ComingSoon from "./pages/ComingSoon";
import Login from "./pages/login";
import AdminPage from "./pages/admin";
import MarkerPage from "./pages/marker";
import Invigilator from "./pages/invigilator/Invigilator";
import { ApiTest } from "./components/ApiTest";
const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster position="top-right" />
      <BrowserRouter>
        <Routes>
          {/* All routes now redirect to Coming Soon page */}
          <Route path="/login" element={<Login />} />
          <Route path="/admin/" element={<AdminPage />} />
          <Route path="/marker" element={<MarkerPage />} />
          <Route path="/invigilator" element={<Invigilator />} />
          <Route path="/api-test" element={<ApiTest />} />
          <Route path="/" element={<ComingSoon />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
