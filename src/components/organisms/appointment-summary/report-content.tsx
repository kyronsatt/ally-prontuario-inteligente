import React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { FileText } from "lucide-react";

import { Anamnese } from "@/context/AppointmentContext";
import { twMerge } from "tailwind-merge";

interface AppointmentReportProps {
  anamnese?: Anamnese;
  isEditable?: boolean;
  onUpdateSection?: (section: string, content: string) => void;
}

const AppointmentReport: React.FC<AppointmentReportProps> = ({
  anamnese,
  isEditable = false,
  onUpdateSection,
}) => {
  if (anamnese) {
    const sections = [
      {
        title: "Identificação",
        content: anamnese.identification,
        id: "queixaPrincipal",
      },
      {
        title: "Queixa Principal",
        content: anamnese.main_complaint,
        id: "queixaPrincipal",
      },
      {
        title: "História da Doença Atual",
        content: anamnese.current_illness_history,
        id: "historiaDoencaAtual",
      },
      {
        title: "História Patológica Pregressa",
        content: anamnese.past_medical_history,
        id: "antecedentesPatologicos",
      },
      {
        title: "Histórico Social",
        content: anamnese.social_history,
        id: "habitosDeVida",
      },
      {
        title: "Histórico Familiar",
        content: anamnese.family_history,
        id: "habitosDeVida",
      },
      {
        title: "Exames Físicos",
        content: anamnese.physical_exams,
        id: "examesFisicos",
      },
      {
        title: "Exames Complementares",
        content: anamnese.complementary_exams,
        id: "examesComplementares",
      },
    ];

    const handleContentChange = (sectionId: string, newContent: string) => {
      if (onUpdateSection) {
        onUpdateSection(sectionId, newContent);
      }
    };

    return (
      <div className="space-y-6 animate-fade-in print:space-y-4">
        {sections.map(({ title, content, id }) => (
          <Card
            key={id}
            className={`shadow-sm hover:shadow transition-shadow border-l-4 border-l-ally-blue overflow-hidden`}
          >
            <CardHeader
              className={`bg-gradient-to-r from-ally-blue/5 to-transparent pb-3`}
            >
              <CardTitle className="text-xl text-gray-800">{title}</CardTitle>
            </CardHeader>
            <CardContent className="pt-4">
              {isEditable ? (
                <textarea
                  className="w-full p-2 border rounded-md min-h-[100px] focus:outline-none focus:ring-2 focus:ring-teal-400 focus:border-transparent"
                  value={content}
                  onChange={(e) => handleContentChange(id, e.target.value)}
                />
              ) : (
                <p className="text-gray-700 whitespace-pre-line">{content}</p>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="text-center py-16 bg-gray-50 rounded-lg border border-dashed border-gray-300">
      <FileText className="h-16 w-16 text-gray-400 mx-auto mb-4" />
      <p className="text-gray-500 text-lg">Nenhum relatório disponível</p>
      <p className="text-gray-400 mt-2">
        Por favor, inicie um novo atendimento para gerar um relatório
      </p>
    </div>
  );
};

export default AppointmentReport;
