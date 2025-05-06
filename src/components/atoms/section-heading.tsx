
import React from "react";
import { cn } from "@/lib/utils";

interface SectionHeadingProps {
  children: React.ReactNode;
  className?: string;
}

export const SectionHeading: React.FC<SectionHeadingProps> = ({ 
  children, 
  className 
}) => (
  <h2 className={cn("heading-lg", className)}>
    {children}
  </h2>
);
