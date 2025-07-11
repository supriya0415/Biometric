
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "@/context/AuthContext";


// Pages
import Index from "./pages/Index";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import SendMoney from "./pages/SendMoney";
import NotFound from "./pages/NotFound";
import { FingAuthProvider } from "./context/FingAuthContext";
import PaymentSuccess from './pages/PaymentSuccess';

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <FingAuthProvider>
          <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route 
              path="/send-money" 
              element={ <SendMoney />} />
               <Route path="/payment-success" element={<PaymentSuccess />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
    </FingAuthProvider>

  </QueryClientProvider>
);

export default App;
