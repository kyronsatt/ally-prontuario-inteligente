
import React from "react";
import FormatCard from "@/components/molecules/format-card";
import { FileText } from "lucide-react";

interface FormatListProps {
  onFormatSelect: (format: string) => void;
}

const FormatList: React.FC<FormatListProps> = ({ onFormatSelect }) => {
  return (
    <div>
      <h2 className="text-lg font-medium mb-4">Formato disponível</h2>
      <div className="grid gap-4 mb-8">
        <FormatCard
          icon={FileText}
          title="Anamnese Estruturada"
          description="Formato completo com histórico médico, exames e conclusões detalhadas"
          onClick={() => onFormatSelect("anamnese")}
        />
      </div>
    </div>
  );
};

export default FormatList;
