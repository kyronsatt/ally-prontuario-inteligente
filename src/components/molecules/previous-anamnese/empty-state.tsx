
import React from "react";
import { XCircleIcon } from "lucide-react";

const EmptyState: React.FC = () => (
  <div className="flex py-4 gap-3 items-start text-gray-500">
    <XCircleIcon size={24} className="opacity-90" />
    <p>Não há registros de anamneses anteriores para este paciente.</p>
  </div>
);

export default EmptyState;
