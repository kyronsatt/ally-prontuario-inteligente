import React, { useEffect, Suspense } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Toaster } from "sonner";

import { SidebarProvider } from "./components/ui/sidebar";
import ProtectedRoute from "./components/ProtectedRoute";
import { AuthProvider } from "./context/AuthContext";
import { PatientProvider } from "./context/PatientContext";
import { AppointmentProvider } from "./context/AppointmentContext";
import { TranscriptionProvider } from "./context/TranscriptionContext";
import { AnamneseProvider } from "./context/AnamneseContext";

import Index from "./pages/Index";
import Login from "./pages/Login";
import AppLayout from "./pages/app/AppLayout";
import Dashboard from "./pages/app/Dashboard";
import NewAppointment from "./pages/app/NewAppointment";
import Listening from "./pages/app/Listening";
import AppointmentSummary from "./pages/app/AppointmentSummary";
import AppointmentHistory from "./pages/app/AppointmentHistory";
import Help from "./pages/app/Help";
import Settings from "./pages/app/Settings";
import Profile from "./pages/app/Profile";
import Subscription from "./pages/app/Subscription";
import NotFound from "./pages/NotFound";
import Terms from "./pages/Terms";
import Privacy from "./pages/Privacy";
import { RecorderProvider } from "./context/RecorderContext";

const App: React.FC = () => {
  return (
    <BrowserRouter>
      <AuthProvider>
        <PatientProvider>
          <AppointmentProvider>
            <TranscriptionProvider>
              <AnamneseProvider>
                <Routes>
                  <Route path="/" element={<Index />} />
                  <Route path="/login" element={<Login />} />
                  <Route path="/termo-de-uso" element={<Terms />} />
                  <Route
                    path="/politica-de-privacidade"
                    element={<Privacy />}
                  />

                  <Route
                    path="/app"
                    element={
                      <ProtectedRoute>
                        <SidebarProvider>
                          <AppLayout />
                        </SidebarProvider>
                      </ProtectedRoute>
                    }
                  >
                    <Route index element={<Dashboard />} />
                    <Route
                      path="novo-atendimento"
                      element={<NewAppointment />}
                    />
                    <Route
                      path="escuta"
                      element={
                        <RecorderProvider>
                          <TranscriptionProvider>
                            <AnamneseProvider>
                              <Listening />
                            </AnamneseProvider>
                          </TranscriptionProvider>
                        </RecorderProvider>
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
                    <Route path="ajuda" element={<Help />} />
                    <Route path="configuracoes" element={<Settings />} />
                    <Route path="perfil" element={<Profile />} />
                    <Route path="subscription" element={<Subscription />} />
                  </Route>
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </AnamneseProvider>
            </TranscriptionProvider>
          </AppointmentProvider>
        </PatientProvider>
      </AuthProvider>
      <Toaster position="top-right" richColors closeButton />
    </BrowserRouter>
  );
};

export default App;
