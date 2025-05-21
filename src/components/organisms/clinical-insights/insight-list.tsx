
import React from "react";
import { Badge } from "@/components/ui/badge";
import { InsightItem } from "@/types/anamnese";
import { getInsightIcon, getInsightColor } from "./insight-utils";

interface InsightListProps {
  insights: InsightItem[];
}

const InsightList: React.FC<InsightListProps> = ({ insights }) => (
  <div className="space-y-4 mt-6">
    {insights.map((insight, index) => (
      <div
        key={`insight-${insight.label || index}`}
        className={`border rounded-md p-3 ${getInsightColor(insight.type)}`}
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
);

export default InsightList;
