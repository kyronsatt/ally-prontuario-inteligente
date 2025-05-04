import React, { useEffect, useState } from "react";
import { Check, FileText, PenBox, X } from "lucide-react";

import RichTextEditor from "@/components/molecules/rich-text-editor";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

import { IAnamnese } from "@/context/AnamneseContext";

interface AppointmentReportProps {
  anamnese?: IAnamnese;
  unsavedChanges: boolean;
  saveChanges: () => Promise<void>;
  onUpdateSection?: (section: string, content: string) => void;
}

const AppointmentReport: React.FC<AppointmentReportProps> = ({
  anamnese,
  onUpdateSection,
  saveChanges,
  unsavedChanges,
}) => {
  const [editingSection, setEditingSection] = useState<string | null>(null);
  const [originalAnamnese, setOriginalAnamnese] = useState<IAnamnese>();

  useEffect(() => {
    if (!unsavedChanges) setOriginalAnamnese(anamnese);
  }, [anamnese, originalAnamnese, unsavedChanges]);

  if (anamnese) {
    const sections = [
      {
        title: "Identificação",
        content: anamnese.identification,
        id: "identification",
      },
      {
        title: "Queixa Principal",
        content: anamnese.main_complaint,
        id: "main_complaint",
      },
      {
        title: "História da Doença Atual",
        content: anamnese.current_illness_history,
        id: "current_illness_history",
      },
      {
        title: "História Patológica Pregressa",
        content: anamnese.past_medical_history,
        id: "past_medical_history",
      },
      {
        title: "Histórico Social",
        content: anamnese.social_history,
        id: "social_history",
      },
      {
        title: "Histórico Familiar",
        content: anamnese.family_history,
        id: "family_history",
      },
      {
        title: "Exames Físicos",
        content: anamnese.physical_exams,
        id: "physical_exams",
      },
      {
        title: "Exames Complementares",
        content: anamnese.complementary_exams,
        id: "complementary_exams",
      },
      {
        title: "Abordagem Terapêutica",
        content: anamnese.therapeutic_approach,
        id: "therapeutic_approach",
      },
      {
        title: "Hipóteses Diagnósticas",
        content: anamnese.diagnostic_hypotheses,
        id: "diagnostic_hypotheses",
      },
    ];

    const handleContentChange = (sectionId: string, newContent: string) => {
      if (onUpdateSection) {
        onUpdateSection(sectionId, newContent);
      }
    };

    const handleSaveChanges = async (sectionId: string) => {
      await saveChanges();
      setEditingSection(null);
    };

    const handleDiscardChanges = async (sectionId: string) => {
      onUpdateSection(sectionId, originalAnamnese[sectionId]);
      setEditingSection(null);
    };

    return (
      <div className="space-y-6 animate-fade-in print:space-y-4">
        {sections.map(({ title, content, id: sectionId }) => (
          <Card
            key={`anamnese-section-card-${sectionId}`}
            className={`shadow-sm hover:shadow transition-shadow border-l-4 border-l-ally-blue overflow-hidden`}
          >
            <CardHeader
              className={`flex flex-row w-full items-center justify-between bg-gradient-to-r from-ally-blue/10 to-ally-gray/5 py-2`}
            >
              <CardTitle className="text-xl text-gray-800 inline w-fit">
                {title}
              </CardTitle>
              {editingSection === sectionId ? (
                <div className="flex gap-2">
                  <X
                    className="rounded-md p-1.5 cursor-pointer text-red-800/40 bg-red-100 hover:bg-red-200 hover:scale-110 transition-all"
                    size={32}
                    onClick={() => handleDiscardChanges(sectionId)}
                  />
                  <Check
                    className="rounded-md p-1.5 cursor-pointer text-green-800/40 bg-green-100 hover:bg-green-200 hover:scale-110 transition-all"
                    size={32}
                    onClick={() => handleSaveChanges(sectionId)}
                  />
                </div>
              ) : (
                <PenBox
                  className="rounded-md p-1.5 cursor-pointer text-gray-400 bg-gray-100 hover:bg-gray-200 hover:scale-110 transition-all"
                  size={32}
                  onClick={() => setEditingSection(sectionId)}
                />
              )}
            </CardHeader>
            <CardContent className="pt-4">
              <RichTextEditor
                id={sectionId}
                content={content}
                onChange={(newContent) =>
                  handleContentChange(sectionId, newContent)
                }
                isEditable={editingSection === sectionId}
              />
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
