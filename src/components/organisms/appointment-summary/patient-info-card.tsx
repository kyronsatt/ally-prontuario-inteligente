import React from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { ListIcon, User2Icon } from "lucide-react";
import { AppointmentType } from "@/context/AppointmentContext";

interface PatientInfoCardProps {
  patientName: string;
  appointmentDate: string;
  type: AppointmentType;
}

const PatientInfoCard: React.FC<PatientInfoCardProps> = ({
  patientName,
  appointmentDate,
  type,
}) => {
  return (
    <Card className="h-[19rem] w-full lg:w-[30%]">
      <CardHeader className="border-none shadow-none">
        <CardTitle className="text-xl text-ally-blue flex items-center gap-2">
          <ListIcon className="h-5 w-5" /> Informações
        </CardTitle>
      </CardHeader>
      <CardContent className="h-full">
        <div className="flex flex-col items-start gap-4 pt-6">
          <div>
            <CardDescription className="text-sm text-ally-gray">
              Paciente
            </CardDescription>
            <p className="text-lg font-semibold text-ally-blue">
              {patientName}
            </p>
          </div>
          <div>
            <CardDescription className="text-sm text-ally-gray">
              Data do atendimento
            </CardDescription>
            <p className="text-lg font-semibold text-ally-blue">
              {appointmentDate}
            </p>
          </div>
          <div>
            <CardDescription className="text-sm text-ally-gray">
              Tipo de Consulta
            </CardDescription>
            <p className="text-lg font-semibold text-ally-blue">
              {type === "NEW" ? "Nova" : "Retorno"}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default PatientInfoCard;
