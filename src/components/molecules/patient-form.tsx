
import React from "react";
import Input from "@/components/atoms/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup } from "@/components/ui/radio-group";
import RadioGroupItem from "@/components/molecules/radio-group-item";

interface PatientFormProps {
  patientName: string;
  patientAge: string;
  patientGender: string;
  patientSex: string;
  patientProfession: string;
  patientColor: string;
  patientHousing: string;
  patientMaritalStatus: string;
  patientReligion: string;
  onNameChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onAgeChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onGenderChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  onSexChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  onProfessionChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onColorChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onHousingChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onMaritalStatusChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  onReligionChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const PatientForm: React.FC<PatientFormProps> = ({
  patientName,
  patientAge,
  patientGender,
  patientSex,
  patientProfession,
  patientColor,
  patientHousing,
  patientMaritalStatus,
  patientReligion,
  onNameChange,
  onAgeChange,
  onGenderChange,
  onSexChange,
  onProfessionChange,
  onColorChange,
  onHousingChange,
  onMaritalStatusChange,
  onReligionChange,
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

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
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
          <Label htmlFor="profession">Profissão</Label>
          <Input
            id="profession"
            value={patientProfession}
            onChange={onProfessionChange}
            placeholder="Profissão"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <div className="space-y-1">
          <Label htmlFor="sex">Sexo Biológico</Label>
          <select
            id="sex"
            value={patientSex}
            onChange={onSexChange}
            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-base md:text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <option value="">Selecione</option>
            <option value="MALE">Masculino</option>
            <option value="FEMALE">Feminino</option>
          </select>
        </div>

        <div className="space-y-1">
          <Label htmlFor="gender">Gênero</Label>
          <select
            id="gender"
            value={patientGender}
            onChange={onGenderChange}
            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-base md:text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <option value="">Selecione</option>
            <option value="MALE">Masculino</option>
            <option value="FEMALE">Feminino</option>
            <option value="OTHER">Outro</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <div className="space-y-1">
          <Label htmlFor="color">Cor/Etnia</Label>
          <Input
            id="color"
            value={patientColor}
            onChange={onColorChange}
            placeholder="Cor/Etnia"
          />
        </div>

        <div className="space-y-1">
          <Label htmlFor="housing">Moradia</Label>
          <Input
            id="housing"
            value={patientHousing}
            onChange={onHousingChange}
            placeholder="Tipo de moradia"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <div className="space-y-1">
          <Label htmlFor="maritalStatus">Estado Civil</Label>
          <select
            id="maritalStatus"
            value={patientMaritalStatus}
            onChange={onMaritalStatusChange}
            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-base md:text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <option value="">Selecione</option>
            <option value="SINGLE">Solteiro(a)</option>
            <option value="MARRIED">Casado(a)</option>
            <option value="DIVORCED">Divorciado(a)</option>
            <option value="WIDOWED">Viúvo(a)</option>
            <option value="OTHER">Outro</option>
          </select>
        </div>

        <div className="space-y-1">
          <Label htmlFor="religion">Religiosidade</Label>
          <Input
            id="religion"
            value={patientReligion}
            onChange={onReligionChange}
            placeholder="Religião (ex: Testemunha de Jeová)"
          />
        </div>
      </div>
    </>
  );
};

export default PatientForm;
