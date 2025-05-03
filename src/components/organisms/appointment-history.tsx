import { ArrowLeft, Loader2 } from "lucide-react";
import React from "react";

import { AppointmentData } from "@/context/AppointmentContext";

import { Button } from "../ui/button";
import SearchBar from "../molecules/appointment-history/search-bar";
import AppointmentCard from "../molecules/appointment-history/appointment-card";

interface AppointmentHistoryProps {
  searchTerm: string;
  onSearchChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  appointments: Array<AppointmentData>;
  loading: boolean;
  error: string | null;
  selectedAppointmentId: string | null;
  onRetry: () => void;
  onViewDetails: (id: string) => void;
}

export const AppointmentHistory: React.FC<AppointmentHistoryProps> = ({
  searchTerm,
  onSearchChange,
  appointments,
  loading,
  error,
  selectedAppointmentId,
  onRetry,
  onViewDetails,
}) => {
  return (
    <div>
      <div>
        <div className="flex flex-row items-center justify-between pb-2">
          <h2 className="text-2xl">Histórico de Atendimentos</h2>
        </div>

        <div className="space-y-6">
          <SearchBar
            placeholder="Buscar paciente por nome..."
            value={searchTerm}
            onChange={onSearchChange}
          />

          <div className="space-y-4 mt-6">
            {loading ? (
              <div className="flex justify-center py-8">
                <Loader2 className="h-8 w-8 animate-spin text-ally-blue" />
              </div>
            ) : error ? (
              <div className="text-center py-8 text-red-500">
                <p>Erro ao carregar os atendimentos.</p>
                <Button onClick={onRetry} variant="outline" className="mt-2">
                  Tentar novamente
                </Button>
              </div>
            ) : appointments.length > 0 ? (
              appointments.map((appointment) => (
                <AppointmentCard
                  key={appointment.id}
                  id={appointment.id}
                  name={appointment.patients?.name} // TODO -> FIXME
                  date={appointment.created_at}
                  type={appointment.type}
                  isSelected={selectedAppointmentId === appointment.id}
                  onClick={() => onViewDetails(appointment.id)}
                />
              ))
            ) : (
              <div className="text-center py-8 text-gray-500">
                Nenhum atendimento encontrado com esse nome.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
