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
    <Card className="flex flex-col h-[18rem] lg:h-[21rem] w-full lg:w-[30%]">
      <CardHeader className="border-none shadow-none py-4 bg-gradient-to-r from-ally-blue to-[#00e6e6]">
        <CardTitle className="text-lg text-white flex items-center gap-2">
          <ListIcon className="h-5 w-5" /> Informações
        </CardTitle>
      </CardHeader>
      <CardContent className="h-full">
        <div className="flex flex-col items-start gap-4 pt-6">
          <div>
            <CardDescription className="text-sm font-thin text-ally-gray">
              Paciente
            </CardDescription>
            <p className="text-lg font-medium text-ally-blue">{patientName}</p>
          </div>
          <div>
            <CardDescription className="text-sm font-thin text-ally-gray">
              Data do atendimento
            </CardDescription>
            <p className="text-lg font-medium text-ally-blue">
              {appointmentDate}
            </p>
          </div>
          <div>
            <CardDescription className="text-sm font-thin text-ally-gray">
              Tipo de Consulta
            </CardDescription>
            <p className="text-lg font-medium text-ally-blue">
              {type === "NEW" ? "Nova" : "Retorno"}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default PatientInfoCard;
