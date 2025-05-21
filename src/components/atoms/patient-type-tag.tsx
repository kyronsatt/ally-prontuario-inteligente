
import React from "react";

interface PatientTypeTagProps {
  type: "NEW" | "RETURN";
}

export const PatientTypeTag: React.FC<PatientTypeTagProps> = ({ type }) => (
  <p className="text-sm font-semibold rounded-full bg-white/10 border border-white py-1 px-4 w-fit">
    {type === "NEW" ? "Primeiro atendimento" : "Paciente de retorno"}
  </p>
);

export default PatientTypeTag;
