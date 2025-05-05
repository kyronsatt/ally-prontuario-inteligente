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
    <Card className="mb-5 border border-ally-blue/30 rounded-xl overflow-hidden shadow-none">
      <CardHeader className="border-none rounded-xl shadow-none">
        <div className="flex justify-between items-center">
          <div>
            <CardDescription className="text-sm text-ally-gray mb-1">
              Paciente
            </CardDescription>
            <CardTitle className="text-2xl font-semibold">
              {patientName}
            </CardTitle>
          </div>
          <div className="text-right">
            <CardDescription className="text-sm font-extralight text-ally-gray mb-1">
              Data do atendimento
            </CardDescription>
            <p className="font-medium text-ally-blue">{appointmentDate}</p>
          </div>
        </div>
      </CardHeader>
    </Card>
  );
};

export default PatientInfoCard;
