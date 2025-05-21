
import React from "react";
import { InsightItem } from "@/types/anamnese";
import InsightItemComponent from "./insight-item";

interface InsightListProps {
  insights: InsightItem[];
}

const InsightList: React.FC<InsightListProps> = ({ insights }) => {
  return (
    <div className="space-y-4 mt-6">
      {insights.map((insight, index) => (
        <InsightItemComponent 
          key={`insight-${insight.label}-${index}`} 
          insight={insight} 
        />
      ))}
    </div>
  );
};

export default InsightList;
