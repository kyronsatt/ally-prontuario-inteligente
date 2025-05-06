
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { InsightItem } from "@/context/AnamneseContext";
import EmptyInsights from "./empty-insights";
import InsightList from "./insight-list";
import { Brain } from "lucide-react";

interface ClinicalInsightsProps {
  insights: InsightItem[];
}

const ClinicalInsights: React.FC<ClinicalInsightsProps> = ({ insights }) => {
  const hasInsights = insights && insights.length > 0;

  return (
    <Card className={`h-[19rem] ${hasInsights ? 'flex flex-col' : ''} ${hasInsights ? 'w-full' : 'w-[70%]'}`}>
      <CardHeader>
        <CardTitle className="text-xl text-ally-blue flex items-center gap-2">
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
