import React, { ReactElement, useEffect, useState } from "react";
import {
  Check,
  FileText,
  Loader,
  Loader2,
  PenBox,
  X,
  Brain,
  LucideIcon,
  LucideUser,
  LucideAngry,
  LucideThermometer,
  LucideHeartPulse,
  LucideUsers2,
  LucideHouse,
  LucideFingerprint,
  LucideTestTube2,
  LucidePill,
  LucideStethoscope,
  LucideProps,
  LucideCircleArrowRight,
  LucideArrowRight,
} from "lucide-react";

import RichTextEditor from "@/components/molecules/rich-text-editor";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

import { IAnamnese } from "@/context/AnamneseContext";
import { cn } from "@/lib/utils";
import { Separator } from "@/components/ui/separator";

interface AppointmentReportProps {
  anamnese?: IAnamnese;
  isSaving: boolean;
  unsavedChanges: boolean;
  saveChanges: () => Promise<void>;
  onUpdateSection?: (section: string, content: string) => void;
}

const AppointmentReport: React.FC<AppointmentReportProps> = ({
  anamnese,
  isSaving,
  unsavedChanges,
  onUpdateSection,
  saveChanges,
}) => {
  const [editingSection, setEditingSection] = useState<string | null>(null);
  const [originalAnamnese, setOriginalAnamnese] = useState<IAnamnese>();

  useEffect(() => {
    if (!unsavedChanges && !isSaving) setOriginalAnamnese(anamnese);
  }, [anamnese, originalAnamnese, isSaving, unsavedChanges]);

  if (anamnese) {
    const sections: Array<{
      title: string;
      content: string;
      id: string;
      icon: React.ForwardRefExoticComponent<
        Omit<LucideProps, "ref"> & React.RefAttributes<SVGSVGElement>
      >;
      acronym: string;
    }> = [
      {
        title: "Identificação",
        content: anamnese.identification,
        id: "identification",
        icon: LucideFingerprint,
        acronym: "Identificação",
      },
      {
        title: "Queixa Principal",
        content: anamnese.main_complaint,
        id: "main_complaint",
        icon: LucideAngry,
        acronym: "Queixa",
      },
      {
        title: "História da Doença Atual",
        content: anamnese.current_illness_history,
        id: "current_illness_history",
        icon: LucideThermometer,
        acronym: "HDA",
      },
      {
        title: "História Patológica Pregressa",
        content: anamnese.past_medical_history,
        id: "past_medical_history",
        icon: LucideHeartPulse,
        acronym: "HPP",
      },
      {
        title: "Histórico Social",
        content: anamnese.social_history,
        id: "social_history",
        icon: LucideUsers2,
        acronym: "H. Social",
      },
      {
        title: "Histórico Familiar",
        content: anamnese.family_history,
        id: "family_history",
        icon: LucideHouse,
        acronym: "H. Familiar",
      },
      {
        title: "Exames Físicos",
        content: anamnese.physical_exams,
        id: "physical_exams",
        icon: LucideUser,
        acronym: "E. Físicos",
      },
      {
        title: "Exames Complementares",
        content: anamnese.complementary_exams,
        id: "complementary_exams",
        icon: LucideTestTube2,
        acronym: "E. Complementares",
      },
      {
        title: "Abordagem Terapêutica",
        content: anamnese.therapeutic_approach,
        id: "therapeutic_approach",
        icon: LucidePill,
        acronym: "Conduta",
      },
      {
        title: "Hipóteses Diagnósticas",
        content: anamnese.diagnostic_hypotheses,
        id: "diagnostic_hypotheses",
        icon: LucideStethoscope,
        acronym: "Hipóteses",
      },
    ];

    const handleContentChange = (sectionId: string, newContent: string) => {
      if (onUpdateSection) {
        onUpdateSection(sectionId, newContent);
      }
    };

    const handleSaveChanges = async () => {
      saveChanges().then(() => {
        setEditingSection(null);
      });
    };

    const handleDiscardChanges = async (sectionId: string) => {
      if (onUpdateSection && originalAnamnese) {
        onUpdateSection(sectionId, originalAnamnese[sectionId]);
      }
      setEditingSection(null);
    };

    const getEditionButtonClassName = (type: "CANCEL" | "SAVE" | "EDIT") => {
      const baseClassName = `rounded-md p-1.5 transition-all ${
        isSaving ? "cursor-wait" : "cursor-pointer hover:scale-110"
      }`;
      const cancelClassName = `${baseClassName} text-red-800/40 bg-red-100 border border-red-200`;
      const saveClassName = `${baseClassName} text-green-800/40 bg-green-200 border border-green-300`;
      const editClassName = `${baseClassName} text-ally-blue/70 hover:text-ally-blue`;

      const indexer = {
        CANCEL: cancelClassName,
        SAVE: saveClassName,
        EDIT: editClassName,
      };

      return cn(
        indexer[type],
        isSaving ? "disabled opacity-70" : "opacity-100"
      );
    };

    return (
      <div className="w-full grid grid-cols-8 gap-10">
        <div className="space-y-6 animate-fade-in print:space-y-4 col-span-full">
          {sections.map(({ title, content, id: sectionId, icon: Icon }) => (
            <Card
              id={sectionId}
              key={`anamnese-section-card-${sectionId}`}
              className={`border-l-4 border-r-ally-blue/30 border-t-ally-blue/30 border-b-ally-blue/30 border-l-ally-blue overflow-hidden shadow-none`}
            >
              <CardHeader
                className={`flex flex-row w-full items-center justify-between bg-ally-blue/10 py-2`}
              >
                <CardTitle className="text-xl flex items-center gap-3 w-fit">
                  {<Icon className="h-5" />} {title}
                </CardTitle>
                {isSaving && editingSection === sectionId && (
                  <Loader2 size={20} className="text-ally-blue animate-spin" />
                )}
                {!isSaving && editingSection === sectionId ? (
                  <div className="flex gap-2">
                    <X
                      className={getEditionButtonClassName("CANCEL")}
                      size={32}
                      onClick={() => handleDiscardChanges(sectionId)}
                    />
                    <Check
                      className={getEditionButtonClassName("SAVE")}
                      size={32}
                      onClick={() => handleSaveChanges()}
                    />
                  </div>
                ) : (
                  !isSaving && (
                    <PenBox
                      className={getEditionButtonClassName("EDIT")}
                      size={32}
                      onClick={() => setEditingSection(sectionId)}
                    />
                  )
                )}
              </CardHeader>
              <CardContent className="p-2">
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
