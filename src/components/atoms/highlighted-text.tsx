
import React from "react";

interface HighlightedTextProps {
  children: React.ReactNode;
}

export const HighlightedText: React.FC<HighlightedTextProps> = ({ children }) => (
  <span className="bg-ally-blue/20 inline">
    {children}
  </span>
);
