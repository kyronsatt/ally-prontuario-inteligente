
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { InsightItem } from "@/types/anamnese";
import EmptyInsights from "@/components/molecules/clinical-insights/empty-state";
import InsightList from "@/components/molecules/clinical-insights/insight-list";
import { Brain } from "lucide-react";

interface ClinicalInsightsProps {
  insights: InsightItem[];
}

const ClinicalInsights: React.FC<ClinicalInsightsProps> = ({ insights }) => {
  const hasInsights = insights && insights.length > 0;

  return (
    <Card className={`h-[21rem] ${hasInsights ? 'flex flex-col' : ''} ${hasInsights ? 'w-full' : 'w-[70%]'}`}>
      <CardHeader className="py-4 bg-gradient-to-r from-ally-blue to-[#00e6e6]">
        <CardTitle className="text-lg text-white flex items-center gap-2">
          <Brain className="h-5 w-5" /> Insights Clínicos
        </CardTitle>
      </CardHeader>

      <CardContent className={hasInsights ? "flex-1 overflow-auto" : ""}>
        {hasInsights ? <InsightList insights={insights} /> : <EmptyInsights />}
      </CardContent>
    </Card>
  );
};

export default ClinicalInsights;
