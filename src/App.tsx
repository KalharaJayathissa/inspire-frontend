import { Toaster } from "@/components/ui/sonner";
import { Toaster as HotToaster } from "react-hot-toast";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Register from "./pages/Register";
import ComingSoon from "./pages/ComingSoon";
import NotFound from "./pages/NotFound";
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
      <HotToaster
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: {
            background: '#fff',
            color: '#333',
            border: '1px solid #e5e7eb',
            borderRadius: '12px',
            padding: '16px',
            fontSize: '14px',
            fontWeight: '500',
            boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
          },
          success: {
            style: {
              background: '#f0fdf4',
              color: '#15803d',
              border: '1px solid #bbf7d0',
            },
            iconTheme: {
              primary: '#15803d',
              secondary: '#f0fdf4',
            },
          },
          error: {
            style: {
              background: '#fef2f2',
              color: '#dc2626',
              border: '1px solid #fecaca',
            },
            iconTheme: {
              primary: '#dc2626',
              secondary: '#fef2f2',
            },
          },
        }}
      />
      <BrowserRouter>
        <Routes>

          <Route path="/invigilator" element={<Invigilator />} />
          <Route path="/api-test" element={<ApiTest />} />

          {/* Main landing page */}
          <Route path="/" element={<Index />} />
          <Route path="/index" element={<Index />} />
          <Route path="/register" element={<Register />} />
          <Route path="/coming-soon" element={<ComingSoon />} />
          <Route path='/login' element={<Login />} />
          <Route path='/admin/' element={<AdminPage />} />
          <Route path='/marker' element={<MarkerPage />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
