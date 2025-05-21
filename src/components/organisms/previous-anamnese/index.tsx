
import React from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { IAnamnese } from "@/types/anamnese";
import LoadingState from "@/components/molecules/previous-anamnese/loading-state";
import EmptyState from "@/components/molecules/previous-anamnese/empty-state";
import HeaderWithDate from "@/components/molecules/previous-anamnese/header-with-date";
import SectionItem from "@/components/molecules/previous-anamnese/section-item";
import InsightSection from "@/components/molecules/previous-anamnese/insight-section";

interface PreviousAnamneseProps {
  anamnese: IAnamnese | null;
  isLoading: boolean;
}

const PreviousAnamnese: React.FC<PreviousAnamneseProps> = ({
  anamnese,
  isLoading,
}) => {
  if (isLoading) {
    return <LoadingState />;
  }

  if (!anamnese) {
    return (
      <Card className="h-fit max-h-[50%] border-ally-blue/30">
        <CardHeader className="py-2">
          <HeaderWithDate />
        </CardHeader>
        <CardContent>
          <EmptyState />
        </CardContent>
      </Card>
    );
  }

  const sections = [
    { title: "Identificação", content: anamnese.identification },
    { title: "Queixa Principal", content: anamnese.main_complaint },
    {
      title: "História da Doença Atual",
      content: anamnese.current_illness_history,
    },
    {
      title: "História Patológica Pregressa",
      content: anamnese.past_medical_history,
    },
    { title: "Histórico Social", content: anamnese.social_history },
    { title: "Histórico Familiar", content: anamnese.family_history },
    { title: "Exames Físicos", content: anamnese.physical_exams },
    { title: "Exames Complementares", content: anamnese.complementary_exams },
    { title: "Abordagem Terapêutica", content: anamnese.therapeutic_approach },
    {
      title: "Hipóteses Diagnósticas",
      content: anamnese.diagnostic_hypotheses,
    },
  ];

  return (
    <Card className="h-2/3 flex flex-col border-ally-blue/30">
      <CardHeader className="py-2">
        <HeaderWithDate date={anamnese.created_at} />
      </CardHeader>

      <CardContent className="flex-1 overflow-auto px-4 py-6">
        <div className="space-y-4 pb-4">
          {sections.map((section) => (
            <SectionItem 
              key={section.title} 
              title={section.title} 
              content={section.content} 
            />
          ))}
        </div>

        <InsightSection insights={anamnese.insights} />
      </CardContent>
    </Card>
  );
};

export default PreviousAnamnese;
