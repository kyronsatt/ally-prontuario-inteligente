import React from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";

interface PatientInfoCardProps {
  patientName: string;
  appointmentDate: string;
}

const PatientInfoCard: React.FC<PatientInfoCardProps> = ({
  patientName,
  appointmentDate,
}) => {
  return (
    <Card className="mb-5 border-none overflow-hidden">
      <CardHeader className="bg-ally-blue/10 border-ally-blue/40 border-[1px] rounded-xl">
        <div className="flex justify-between items-center">
          <div>
            <CardDescription className="text-sm text-gray-600 mb-1">
              Paciente
            </CardDescription>
            <CardTitle className="text-2xl font-semibold">
              {patientName}
            </CardTitle>
          </div>
          <div className="text-right">
            <CardDescription className="text-sm font-thin text-gray-400 mb-1">
              Data do atendimento
            </CardDescription>
            <p className="font-medium text-ally-dark">{appointmentDate}</p>
          </div>
        </div>
      </CardHeader>
    </Card>
  );
};

export default PatientInfoCard;
