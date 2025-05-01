import React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { FileText } from "lucide-react";

import { AnamneseNote, SoapNote } from "@/context/AppointmentContext";
import { twMerge } from "tailwind-merge";

interface AppointmentReportProps {
  viewFormat: string;
  soapNote?: SoapNote;
  anamneseNote?: AnamneseNote;
}

const AppointmentReport: React.FC<AppointmentReportProps> = ({
  viewFormat,
  soapNote,
  anamneseNote,
}) => {
  if (viewFormat === "soap" && soapNote) {
    const soapSections = [
      { title: "S - Subjetivo", content: soapNote.subjective, color: "blue" },
      { title: "O - Objetivo", content: soapNote.objective, color: "green" },
      { title: "A - Avaliação", content: soapNote.assessment, color: "amber" },
      { title: "P - Plano", content: soapNote.plan, color: "purple" },
    ];

    return (
      <div className="space-y-6 animate-fade-in print:space-y-4">
        {soapSections.map(({ title, content, color }) => (
          <Card
            key={title}
            className={twMerge(
              "shadow-sm hover:shadow transition-shadow border-l-4 overflow-hidden",
              `border-l-${color}-400`
            )}
          >
            <CardHeader
              className={twMerge(
                "bg-gradient-to-r to-transparent pb-3",
                `from-slate-50`
              )}
            >
              <CardTitle className="text-xl text-gray-800">{title}</CardTitle>
            </CardHeader>
            <CardContent className="pt-4">
              <p className="text-gray-700 whitespace-pre-line">{content}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (viewFormat === "anamnese" && anamneseNote) {
    const sections = [
      {
        title: "Queixa Principal",
        content: anamneseNote.queixaPrincipal,
      },
      {
        title: "História da Doença Atual",
        content: anamneseNote.historiaDoencaAtual,
      },
      {
        title: "Antecedentes Patológicos",
        content: anamneseNote.antecedentesPatologicos,
      },
      {
        title: "Medicações em Uso",
        content: anamneseNote.medicacoesEmUso,
      },
      {
        title: "Hábitos de Vida",
        content: anamneseNote.habitosDeVida,
      },
      {
        title: "Exames Físicos",
        content: anamneseNote.examesFisicos,
      },
      {
        title: "Exames Complementares",
        content: anamneseNote.examesComplementares,
      },
      {
        title: "Diagnóstico",
        content: anamneseNote.diagnostico,
      },
      { title: "Conduta", content: anamneseNote.conduta },
    ];

    return (
      <div className="space-y-6 animate-fade-in print:space-y-4">
        {sections.map(({ title, content }) => (
          <Card
            key={title}
            className={`shadow-sm hover:shadow transition-shadow border-l-4 border-l-teal-400 overflow-hidden`}
          >
            <CardHeader
              className={`bg-gradient-to-r from-teal-50 to-transparent pb-3`}
            >
              <CardTitle className="text-xl text-gray-800">{title}</CardTitle>
            </CardHeader>
            <CardContent className="pt-4">
              <p className="text-gray-700 whitespace-pre-line">{content}</p>
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
