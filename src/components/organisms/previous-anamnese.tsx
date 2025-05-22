import React from "react";
import moment from "moment";
import { Calendar, HistoryIcon, XCircleIcon } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { IAnamnese } from "@/types/anamnese";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "../ui/badge";

interface PreviousAnamneseProps {
  anamnese: IAnamnese | null;
  isLoading: boolean;
}

const PreviousAnamnese: React.FC<PreviousAnamneseProps> = ({
  anamnese,
  isLoading,
}) => {
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
        <CardHeader className="py-2">
          <CardTitle className="flex gap-2 items-center text-md lg:text-lg text-ally-blue">
            <HistoryIcon size={16} />
            Última Anamnese
          </CardTitle>
        </CardHeader>
        <CardContent className="flex py-4 gap-3 items-start text-gray-500 text-xs">
          <XCircleIcon size={20} className="opacity-90" />
          <p>Não há registros de anamneses anteriores para este paciente.</p>
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

  const formattedDateOfLastAnamnese = moment(anamnese?.created_at).format(
    "DD/MM/YY"
  );

  return (
    <Card className="h-full flex flex-col border-ally-blue/30">
      <CardHeader className="py-2 flex flex-row justify-between items-center text-ally-blue">
        <CardTitle className="flex gap-2 items-center text-md lg:text-lg">
          <HistoryIcon size={16} />
          <p>Última Anamnese</p>
        </CardTitle>
        <Badge
          variant="outline"
          className="items-center flex gap-1 text-sm font-light opacity-80 text-ally-gray"
        >
          <Calendar size={16} /> {formattedDateOfLastAnamnese}
        </Badge>
      </CardHeader>

      <CardContent className="flex-1 overflow-auto px-4 py-6">
        <div className="space-y-4 pb-4">
          {sections.map((section) => (
            <div key={section.title} className="border-b border-gray-200 pb-3">
              <h3 className="font-medium text-md text-ally-blue mb-1">
                {section.title}
              </h3>
              <div
                className="text-sm text-gray-700"
                dangerouslySetInnerHTML={{ __html: section.content }}
              />
            </div>
          ))}
        </div>

        {anamnese.insights && anamnese.insights.length > 0 && (
          <div className="mt-0">
            <h3 className="font-medium text-md text-ally-blue mb-3">
              Insights Clínicos
            </h3>
            <div className="space-y-2">
              {anamnese.insights.map((insight, index) => (
                <div
                  key={index}
                  className="text-sm p-2 border rounded-md"
                  style={{
                    borderColor:
                      insight.type === "risk"
                        ? "#FFBB5C"
                        : insight.type === "finding"
                        ? "#5D9C59"
                        : insight.type === "suggestion"
                        ? "#7895CB"
                        : "#FF6969",
                    backgroundColor:
                      insight.type === "risk"
                        ? "#FFF8E7"
                        : insight.type === "finding"
                        ? "#EFF5EE"
                        : insight.type === "suggestion"
                        ? "#EFF3FA"
                        : "#FFF0F0",
                  }}
                >
                  <span
                    className="font-medium"
                    style={{
                      color:
                        insight.type === "risk"
                          ? "#B7791F"
                          : insight.type === "finding"
                          ? "#276749"
                          : insight.type === "suggestion"
                          ? "#2C5282"
                          : "#C53030",
                    }}
                  >
                    {insight.label}:{" "}
                  </span>
                  <span>{insight.content}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default PreviousAnamnese;
