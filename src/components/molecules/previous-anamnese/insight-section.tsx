
import React from "react";
import { InsightItem } from "@/types/anamnese";

interface InsightSectionProps {
  insights?: InsightItem[];
}

const InsightSection: React.FC<InsightSectionProps> = ({ insights }) => {
  if (!insights || insights.length === 0) return null;

  return (
    <div className="mt-0">
      <h3 className="font-medium text-md text-ally-blue mb-3">
        Insights Clínicos
      </h3>
      <div className="space-y-2">
        {insights.map((insight, index) => (
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
  );
};

export default InsightSection;
