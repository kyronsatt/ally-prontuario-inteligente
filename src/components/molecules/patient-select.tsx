import React from "react";
import { Label } from "@/components/ui/label";
import { PatientData } from "@/context/PatientContext";

interface PatientSelectProps {
  patients: PatientData[];
  selectedPatientId: string;
  onPatientChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
}

const PatientSelect: React.FC<PatientSelectProps> = ({
  patients,
  selectedPatientId,
  onPatientChange,
}) => {
  return (
    <div className="space-y-1 w-full lg:w-1/2">
      <Label htmlFor="patient">Selecione o paciente</Label>
      <select
        id="patient"
        value={selectedPatientId}
        onChange={onPatientChange}
        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-base md:text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
      >
        <option value="">Selecione um paciente</option>
        {patients?.map((patient) => (
          <option key={patient.id} value={patient.id}>
            {patient.name}
          </option>
        ))}
      </select>
    </div>
  );
};

export default PatientSelect;
