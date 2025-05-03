
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/context/AuthContext";
import { PatientProvider } from "@/context/PatientContext";
import { AppointmentProvider } from "@/context/AppointmentContext";
import ProtectedRoute from "@/components/ProtectedRoute";
import Index from "./pages/Index";
import AppLayout from "./pages/app/AppLayout";
import Dashboard from "./pages/app/Dashboard";
import NewAppointment from "./pages/app/NewAppointment";
import Listening from "./pages/app/Listening";
import AppointmentSummary from "./pages/app/AppointmentSummary";
import AppointmentHistory from "./pages/app/AppointmentHistory";
import Settings from "./pages/app/Settings";
import Login from "./pages/Login";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <PatientProvider>
            <AppointmentProvider>
              <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/login" element={<Login />} />
                <Route
                  path="/app"
                  element={
                    <ProtectedRoute>
                      <AppLayout />
                    </ProtectedRoute>
                  }
                >
                  <Route index element={<Dashboard />} />
                  <Route path="novo-atendimento" element={<NewAppointment />} />
                  <Route path="escuta" element={<Listening />} />
                  <Route path="resumo" element={<AppointmentSummary />} />
                  <Route path="historico" element={<AppointmentHistory />} />
                  <Route path="configuracoes" element={<Settings />} />
                </Route>
                {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
                <Route path="*" element={<NotFound />} />
              </Routes>
            </AppointmentProvider>
          </PatientProvider>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
