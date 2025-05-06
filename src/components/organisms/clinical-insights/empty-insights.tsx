
import React from "react";
import { LucideBlocks } from "lucide-react";

const EmptyInsights: React.FC = () => (
  <div className="flex py-8 gap-3 items-center text-gray-500">
    <LucideBlocks size={20} className="opacity-90" />
    <p>Nenhum insight clínico disponível para esta anamnese.</p>
  </div>
);

export default EmptyInsights;
