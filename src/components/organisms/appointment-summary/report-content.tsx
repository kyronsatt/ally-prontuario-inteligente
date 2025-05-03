
import React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { FileText } from "lucide-react";

import { AnamneseNote } from "@/context/AppointmentContext";
import { twMerge } from "tailwind-merge";

interface AppointmentReportProps {
  anamneseNote?: AnamneseNote;
  isEditable?: boolean;
  onUpdateSection?: (section: string, content: string) => void;
}

const AppointmentReport: React.FC<AppointmentReportProps> = ({
  anamneseNote,
  isEditable = false,
  onUpdateSection,
}) => {
  if (anamneseNote) {
    const sections = [
      {
        title: "Queixa Principal",
        content: anamneseNote.queixaPrincipal,
        id: "queixaPrincipal"
      },
      {
        title: "História da Doença Atual",
        content: anamneseNote.historiaDoencaAtual,
        id: "historiaDoencaAtual"
      },
      {
        title: "Antecedentes Patológicos",
        content: anamneseNote.antecedentesPatologicos,
        id: "antecedentesPatologicos"
      },
      {
        title: "Medicações em Uso",
        content: anamneseNote.medicacoesEmUso,
        id: "medicacoesEmUso"
      },
      {
        title: "Hábitos de Vida",
        content: anamneseNote.habitosDeVida,
        id: "habitosDeVida"
      },
      {
        title: "Exames Físicos",
        content: anamneseNote.examesFisicos,
        id: "examesFisicos"
      },
      {
        title: "Exames Complementares",
        content: anamneseNote.examesComplementares,
        id: "examesComplementares"
      },
      {
        title: "Diagnóstico",
        content: anamneseNote.diagnostico,
        id: "diagnostico"
      },
      { 
        title: "Conduta", 
        content: anamneseNote.conduta,
        id: "conduta" 
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
            className={`shadow-sm hover:shadow transition-shadow border-l-4 border-l-teal-400 overflow-hidden`}
          >
            <CardHeader
              className={`bg-gradient-to-r from-teal-50 to-transparent pb-3`}
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
