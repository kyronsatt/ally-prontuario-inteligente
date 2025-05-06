import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { InsightItem } from "@/context/AnamneseContext";
import {
  AlertTriangle,
  Brain,
  Search,
  Flag,
  Zap,
  LucideBlocks,
} from "lucide-react";

interface ClinicalInsightsProps {
  insights: InsightItem[];
}

const getInsightIcon = (type: string) => {
  switch (type) {
    case "risk":
      return <AlertTriangle className="h-4 w-4" />;
    case "finding":
      return <Search className="h-4 w-4" />;
    case "suggestion":
      return <Brain className="h-4 w-4" />;
    case "red_flag":
      return <Flag className="h-4 w-4" />;
    default:
      return <Zap className="h-4 w-4" />;
  }
};

const getInsightColor = (type: string) => {
  switch (type) {
    case "risk":
      return "bg-amber-100 hover:bg-amber-200 text-amber-800 border-amber-300";
    case "finding":
      return "bg-blue-100 hover:bg-blue-200 text-blue-800 border-blue-300";
    case "suggestion":
      return "bg-purple-100 hover:bg-purple-200 text-purple-800 border-purple-300";
    case "red_flag":
      return "bg-red-100 hover:bg-red-200 text-red-800 border-red-300";
    default:
      return "bg-gray-100 hover:bg-gray-200 text-gray-800 border-gray-300";
  }
};

const ClinicalInsights: React.FC<ClinicalInsightsProps> = ({ insights }) => {
  if (!insights || insights.length === 0) {
    return (
      <Card className="h-[19rem] w-[70%]">
        <CardHeader>
          <CardTitle className="text-xl text-ally-blue flex items-center gap-2">
            <Brain className="h-5 w-5" /> Insights Clínicos
          </CardTitle>
        </CardHeader>
        <CardContent className="flex py-8 gap-3 items-center text-gray-500">
          <LucideBlocks size={20} className="opacity-90" />
          <p>Nenhum insight clínico disponível para esta anamnese.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="flex flex-col h-[19rem] w-[70%]">
      <CardHeader>
        <CardTitle className="text-xl text-ally-blue flex items-center gap-2">
          <Brain className="h-5 w-5" /> Insights Clínicos
        </CardTitle>
      </CardHeader>
      <CardContent className="flex-1 overflow-auto">
        <div className="space-y-4 mt-6">
          {insights.map((insight) => (
            <div
              key={`insight-${insight.label}`}
              className={`border rounded-md p-3 ${getInsightColor(
                insight.type
              )}`}
            >
              <div className="flex items-center gap-2 mb-1">
                {getInsightIcon(insight.type)}
                <Badge variant="outline" className="font-medium">
                  {insight.label}
                </Badge>
              </div>
              <p className="text-sm">{insight.content}</p>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default ClinicalInsights;
