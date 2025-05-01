import React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { FileText } from "lucide-react";

import { AnamneseNote, SoapNote } from "@/context/AppointmentContext";

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
    return (
      <div className="space-y-6 animate-fade-in print:space-y-4">
        {["subjective", "objective", "assessment", "plan"].map(
          (section, index) => (
            <Card
              key={section}
              className={`shadow-sm hover:shadow transition-shadow border-l-4 ${
                [
                  "border-l-blue-400",
                  "border-l-green-400",
                  "border-l-amber-400",
                  "border-l-purple-400",
                ][index]
              } overflow-hidden`}
            >
              <CardHeader
                className={`bg-gradient-to-r from-${
                  ["blue", "green", "amber", "purple"][index]
                }-50 to-transparent pb-3`}
              >
                <CardTitle className="text-xl text-gray-800">
                  {
                    [
                      "S - Subjetivo",
                      "O - Objetivo",
                      "A - Avaliação",
                      "P - Plano",
                    ][index]
                  }
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-4">
                <p className="text-gray-700 whitespace-pre-line">
                  {soapNote[section]}
                </p>
              </CardContent>
            </Card>
          )
        )}
      </div>
    );
  }

  if (viewFormat === "anamnese" && anamneseNote) {
    const sections = [
      {
        title: "Queixa Principal",
        content: anamneseNote.queixaPrincipal,
        color: "blue",
      },
      {
        title: "História da Doença Atual",
        content: anamneseNote.historiaDoencaAtual,
        color: "indigo",
      },
      {
        title: "Antecedentes Patológicos",
        content: anamneseNote.antecedentesPatologicos,
        color: "teal",
      },
      {
        title: "Medicações em Uso",
        content: anamneseNote.medicacoesEmUso,
        color: "cyan",
      },
      {
        title: "Hábitos de Vida",
        content: anamneseNote.habitosDeVida,
        color: "orange",
      },
      {
        title: "Exames Físicos",
        content: anamneseNote.examesFisicos,
        color: "emerald",
      },
      {
        title: "Exames Complementares",
        content: anamneseNote.examesComplementares,
        color: "sky",
      },
      {
        title: "Diagnóstico",
        content: anamneseNote.diagnostico,
        color: "rose",
      },
      { title: "Conduta", content: anamneseNote.conduta, color: "violet" },
    ];

    return (
      <div className="space-y-6 animate-fade-in print:space-y-4">
        {sections.map(({ title, content, color }) => (
          <Card
            key={title}
            className={`shadow-sm hover:shadow transition-shadow border-l-4 border-l-${color}-400 overflow-hidden`}
          >
            <CardHeader
              className={`bg-gradient-to-r from-${color}-50 to-transparent pb-3`}
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
