import React from "react";

interface PatientInfoProps {
  name: string;
  type: "NEW" | "RETURN";
}

const PatientInfo: React.FC<PatientInfoProps> = ({ name, type }) => {
  return (
    <div className="text-white w-full flex gap-2 justify-center items-center">
      <p className="text-xl font-medium">{name}</p>
      <p className="text-sm font-semibold rounded-full bg-white/10 border border-white py-1 px-4 w-fit">
        {type === "NEW" ? "Primeiro atendimento" : "Paciente de retorno"}
      </p>
    </div>
  );
};

export default PatientInfo;
