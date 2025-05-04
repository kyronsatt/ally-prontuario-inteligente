import React from "react";
import { useFormContext } from "react-hook-form";

import Input from "@/components/atoms/input";
import { Label } from "@/components/ui/label";
import { PatientCreationPayload } from "@/context/PatientContext";

const PatientForm: React.FC = () => {
  const {
    register,
    formState: { errors },
  } = useFormContext<PatientCreationPayload>();

  return (
    <>
      <div className="space-y-1">
        <Label htmlFor="name">
          Nome do paciente<p className="text-ally-blue inline">*</p>
        </Label>
        <Input
          id="name"
          {...register("name", { required: true })}
          placeholder="Nome completo"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <div className="space-y-1">
          <Label htmlFor="age">
            Idade<p className="text-ally-blue inline">*</p>
          </Label>
          <Input
            id="age"
            type="number"
            {...register("age", { required: true })}
            placeholder="Idade"
          />
        </div>

        <div className="space-y-1">
          <Label htmlFor="profession">Profissão</Label>
          <Input
            id="profession"
            {...register("profession")}
            placeholder="Profissão"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <div className="space-y-1">
          <Label htmlFor="sex">Sexo Biológico</Label>
          <select
            id="sex"
            {...register("sex")}
            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2"
          >
            <option value="">Selecione</option>
            <option value="MALE">Masculino</option>
            <option value="FEMALE">Feminino</option>
          </select>
        </div>

        <div className="space-y-1">
          <Label htmlFor="gender">Gênero</Label>
          <Input
            id="gender"
            {...register("gender")}
            placeholder="Heterossexual, homossexual..."
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <div className="space-y-1">
          <Label htmlFor="color">Cor/Etnia</Label>
          <Input id="color" {...register("color")} placeholder="Cor/Etnia" />
        </div>

        <div className="space-y-1">
          <Label htmlFor="housing">Moradia</Label>
          <Input
            id="housing"
            {...register("housing")}
            placeholder="Tipo de moradia"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <div className="space-y-1">
          <Label htmlFor="marital_status">Estado Civil</Label>
          <select
            id="marital_status"
            {...register("marital_status")}
            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2"
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
            {...register("religion")}
            placeholder="Religião (ex: Testemunha de Jeová)"
          />
        </div>
      </div>

      {errors && <p className="text-red-600 font-semibold">{errors[0]}</p>}
    </>
  );
};

export default PatientForm;
