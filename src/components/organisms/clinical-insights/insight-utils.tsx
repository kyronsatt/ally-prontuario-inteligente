
import React from "react";
import { AlertTriangle, Brain, Search, Flag, Zap } from "lucide-react";

export const getInsightIcon = (type: string) => {
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

export const getInsightColor = (type: string) => {
  switch (type) {
    case "risk":
      return "bg-amber-50 text-amber-700 border-amber-200";
    case "finding":
      return "bg-blue-50 text-blue-700 border-blue-200";
    case "suggestion":
      return "bg-purple-50 text-purple-700 border-purple-200";
    case "red_flag":
      return "bg-red-50 text-red-700 border-red-200";
    default:
      return "bg-gray-50 text-gray-700 border-gray-200";
  }
};
