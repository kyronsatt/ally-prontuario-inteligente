import React from "react";
import Input from "@/components/atoms/input";
import { Label } from "@/components/ui/label";

interface PatientFormProps {
  patientName: string;
  patientAge: string;
  patientGender: string;
  onNameChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onAgeChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onGenderChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
}

const PatientForm: React.FC<PatientFormProps> = ({
  patientName,
  patientAge,
  patientGender,
  onNameChange,
  onAgeChange,
  onGenderChange,
}) => {
  return (
    <>
      <div className="space-y-1">
        <Label htmlFor="name">Nome do paciente</Label>
        <Input
          id="name"
          value={patientName}
          onChange={onNameChange}
          placeholder="Nome completo"
        />
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-1">
          <Label htmlFor="age">Idade</Label>
          <Input
            id="age"
            type="number"
            value={patientAge}
            onChange={onAgeChange}
            placeholder="Idade"
          />
        </div>

        <div className="space-y-1">
          <Label htmlFor="gender">Gênero</Label>
          <select
            id="gender"
            value={patientGender}
            onChange={onGenderChange}
            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-base md:text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <option value="MALE">Masculino</option>
            <option value="FEMALE">Feminino</option>
            <option value="OTHER">Outro</option>
          </select>
        </div>
      </div>
    </>
  );
};

export default PatientForm;
