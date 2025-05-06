
import React from "react";
import { cn } from "@/lib/utils";

interface PatientInfoProps {
  name: string;
  type: "NEW" | "RETURN";
  className?: string;
}

const PatientInfo: React.FC<PatientInfoProps> = ({ 
  name, 
  type,
  className
}) => {
  return (
    <div className={cn("text-white w-full flex gap-2 justify-center items-center", className)}>
      <p className="text-xl font-medium">{name}</p>
      <PatientTypeTag type={type} />
    </div>
  );
};

interface PatientTypeTagProps {
  type: "NEW" | "RETURN";
}

const PatientTypeTag: React.FC<PatientTypeTagProps> = ({ type }) => (
  <p className="text-sm font-semibold rounded-full bg-white/10 border border-white py-1 px-4 w-fit">
    {type === "NEW" ? "Primeiro atendimento" : "Paciente de retorno"}
  </p>
);

export default PatientInfo;
