import React from "react";

interface PatientInfoProps {
  name: string;
  type: "NEW" | "RETURN";
}

const PatientInfo: React.FC<PatientInfoProps> = ({ name, type }) => {
  return (
    <div className="text-white">
      <p className="text-lg font-medium">Paciente:</p>
      <p className="text-2xl font-bold">{name}</p>
      <p className="text-sm mt-1 opacity-75">
        {type === "NEW" ? "Primeiro atendimento" : "Paciente de retorno"}
      </p>
    </div>
  );
};

export default PatientInfo;
