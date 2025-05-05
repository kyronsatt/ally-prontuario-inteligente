import React, { useState, useEffect } from "react";
import { Search } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

import { AppointmentCard } from "@/components/molecules/appointment-history/appointment-card";

export interface AppointmentHistoryProps {
  appointments: any[];
  compact?: boolean;
  showSearch?: boolean;
}

export const AppointmentHistory: React.FC<AppointmentHistoryProps> = ({
  appointments = [],
  compact = false,
  showSearch = true,
}) => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredAppointments, setFilteredAppointments] = useState(appointments);

  useEffect(() => {
    if (searchTerm) {
      const filtered = appointments.filter((appointment) => {
        const patientName = `${appointment.patient?.first_name || ""} ${
          appointment.patient?.last_name || ""
        }`.toLowerCase();
        return patientName.includes(searchTerm.toLowerCase());
      });
      setFilteredAppointments(filtered);
    } else {
      setFilteredAppointments(appointments);
    }
  }, [searchTerm, appointments]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  if (appointments.length === 0) {
    return (
      <Card className="p-6 text-center bg-gray-50">
        <p className="text-gray-500">Nenhum atendimento encontrado.</p>
        <Button
          onClick={() => navigate("/app/novo-atendimento")}
          className="mt-4 bg-ally-blue hover:bg-ally-blue/90"
        >
          Iniciar novo atendimento
        </Button>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {showSearch && (
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            placeholder="Buscar paciente..."
            value={searchTerm}
            onChange={handleSearchChange}
            className="pl-10"
          />
        </div>
      )}

      <div className="space-y-4">
        {filteredAppointments.length === 0 ? (
          <Card className="p-6 text-center bg-gray-50">
            <p className="text-gray-500">
              Nenhum atendimento encontrado para "{searchTerm}".
            </p>
          </Card>
        ) : (
          filteredAppointments.map((appointment) => (
            <AppointmentCard
              key={appointment.id}
              appointment={appointment}
              compact={compact}
            />
          ))
        )}
      </div>
    </div>
  );
};
