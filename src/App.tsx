import { BrowserRouter, Routes, Route } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import ProtectedRoute from "@/components/ProtectedRoute";

import { AuthProvider } from "@/context/AuthContext";
import { PatientProvider } from "@/context/PatientContext";
import { AppointmentProvider } from "@/context/AppointmentContext";
import { TranscriptionProvider } from "@/context/TranscriptionContext";
import { AnamneseProvider } from "@/context/AnamneseContext";

import Index from "./pages/Index";
import AppLayout from "./pages/app/AppLayout";
import Dashboard from "./pages/app/Dashboard";
import NewAppointment from "./pages/app/NewAppointment";
import Listening from "./pages/app/Listening";
import AppointmentSummary from "./pages/app/AppointmentSummary";
import AppointmentHistory from "./pages/app/AppointmentHistory";
import Settings from "./pages/app/Settings";
import Help from "./pages/app/Help";
import Profile from "./pages/app/Profile";
import Login from "./pages/Login";
import NotFound from "./pages/NotFound";
import Terms from "./pages/Terms";
import Privacy from "./pages/Privacy";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/login" element={<Login />} />
            <Route
              path="/app"
              element={
                <AppPrivateRoute>
                  <AppLayout />
                </AppPrivateRoute>
              }
            >
              <Route index element={<Dashboard />} />
              <Route path="novo-atendimento" element={<NewAppointment />} />
              <Route
                path="escuta"
                element={
                  <TranscriptionProvider>
                    <AnamneseProvider>
                      <Listening />
                    </AnamneseProvider>
                  </TranscriptionProvider>
                }
              />
              <Route
                path="resumo"
                element={
                  <TranscriptionProvider>
                    <AnamneseProvider>
                      <AppointmentSummary />
                    </AnamneseProvider>
                  </TranscriptionProvider>
                }
              />
              <Route path="historico" element={<AppointmentHistory />} />
              <Route path="configuracoes" element={<Settings />} />
              <Route path="ajuda" element={<Help />} />
              <Route path="perfil" element={<Profile />} />
            </Route>

            <Route path="*" element={<NotFound />} />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;

export const AppPrivateRoute = ({ children }) => (
  <ProtectedRoute>
    <PatientProvider>
      <AppointmentProvider>{children}</AppointmentProvider>
    </PatientProvider>
  </ProtectedRoute>
);
