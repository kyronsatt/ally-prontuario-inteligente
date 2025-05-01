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
    <Card className="mb-8 border-none shadow-md overflow-hidden">
      <CardHeader className="bg-gradient-to-r from-blue-50 to-blue-100 border-b">
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
            <CardDescription className="text-sm text-gray-600 mb-1">
              Data do atendimento
            </CardDescription>
            <p className="font-medium text-gray-800">{appointmentDate}</p>
          </div>
        </div>
      </CardHeader>
    </Card>
  );
};

export default PatientInfoCard;
