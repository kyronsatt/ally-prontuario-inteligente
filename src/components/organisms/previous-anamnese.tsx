
import React from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { IAnamnese } from "@/context/AnamneseContext";
import { Skeleton } from "@/components/ui/skeleton";

interface PreviousAnamneseProps {
  anamnese: IAnamnese | null;
  isLoading: boolean;
}

const PreviousAnamnese: React.FC<PreviousAnamneseProps> = ({ anamnese, isLoading }) => {
  if (isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-8 w-3/4" />
        <Skeleton className="h-32 w-full" />
        <Skeleton className="h-32 w-full" />
      </div>
    );
  }

  if (!anamnese) {
    return (
      <Card className="h-full border-ally-blue/30">
        <CardHeader>
          <CardTitle className="text-xl text-ally-blue">Última Anamnese</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-500 italic">
            Não há registros de anamneses anteriores para este paciente.
          </p>
        </CardContent>
      </Card>
    );
  }

  const sections = [
    { title: "Queixa Principal", content: anamnese.main_complaint },
    { title: "História da Doença Atual", content: anamnese.current_illness_history },
    { title: "História Patológica Pregressa", content: anamnese.past_medical_history },
    { title: "Histórico Social", content: anamnese.social_history },
    { title: "Histórico Familiar", content: anamnese.family_history },
    { title: "Exames Físicos", content: anamnese.physical_exams },
    { title: "Exames Complementares", content: anamnese.complementary_exams },
    { title: "Abordagem Terapêutica", content: anamnese.therapeutic_approach },
    { title: "Hipóteses Diagnósticas", content: anamnese.diagnostic_hypotheses },
  ];

  return (
    <Card className="h-full border-ally-blue/30">
      <CardHeader className="pb-2">
        <CardTitle className="text-xl text-ally-blue">Última Anamnese</CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <ScrollArea className="h-[calc(100vh-220px)] px-4">
          <div className="space-y-4 pb-4">
            {sections.map((section) => (
              <div key={section.title} className="border-b border-gray-200 pb-3">
                <h3 className="font-medium text-ally-blue mb-1">{section.title}</h3>
                <div 
                  className="text-sm text-gray-700" 
                  dangerouslySetInnerHTML={{ __html: section.content }}
                />
              </div>
            ))}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
};

export default PreviousAnamnese;
